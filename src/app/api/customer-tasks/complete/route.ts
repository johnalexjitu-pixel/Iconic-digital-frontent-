import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { UserTaskHistoryCollection } from '@/models/UserTaskHistory';
import { IDailyCommission, DailyCommissionCollection } from '@/models/DailyCommission';
import { calculateCommission, getCommissionTier } from '@/lib/commission-calculator';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const customerTasksCollection = await getCollection('customerTasks');
    const usersCollection = await getCollection('users');
    
    const { taskId, userId } = await request.json();

    // Validation
    if (!taskId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Task ID and user ID are required'
      }, { status: 400 });
    }

    // Find the task
    const task = await customerTasksCollection.findOne({ _id: new ObjectId(taskId) });
    if (!task) {
      return NextResponse.json({
        success: false,
        error: 'Task not found'
      }, { status: 404 });
    }

    if (task.status !== 'pending') {
      return NextResponse.json({
        success: false,
        error: 'Task has already been completed or expired'
      }, { status: 400 });
    }

    // Check if task is expired
    if (new Date() > task.expiredDate) {
      await customerTasksCollection.updateOne(
        { _id: task._id },
        { 
          $set: { 
            status: 'expired',
            updatedAt: new Date()
          }
        }
      );
      return NextResponse.json({
        success: false,
        error: 'Task has expired'
      }, { status: 400 });
    }

    // Get user details
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Log the matching process
    console.log('🔍 Customer Task Completion - Matching Process:');
    console.log(`📋 Task customerCode: "${task.customerCode}"`);
    console.log(`👤 User membershipId: "${user.membershipId}"`);
    console.log(`✅ Match Status: ${task.customerCode === user.membershipId ? 'MATCHED' : 'MISMATCH'}`);
    
    // Verify the customerCode matches membershipId
    if (task.customerCode !== user.membershipId) {
      console.log('⚠️ WARNING: customerCode does not match membershipId!');
      console.log(`Expected: ${user.membershipId}, Found: ${task.customerCode}`);
    }

    // Check if user can complete tasks (allowTask must be true)
    if (user.allowTask === false) {
      return NextResponse.json({
        success: false,
        error: 'Your account is locked due to negative balance. Please make a deposit to continue.',
        errorType: 'task_locked',
        redirectTo: '/deposit'
      }, { status: 403 });
    }

    // Check if user's campaign status is inactive
    if (user.campaignStatus !== 'active') {
      return NextResponse.json({
        success: false,
        error: 'Your campaign status is inactive. Please contact support to activate your account.'
      }, { status: 403 });
    }

    // Check task limits based on deposit status
    const maxTasks = user.depositCount > 0 ? 90 : 30;
    const currentSet = user.campaignSet.length;
    const tasksInCurrentSet = user.campaignsCompleted - (currentSet * 30);

    if (tasksInCurrentSet >= 30) {
      return NextResponse.json({
        success: false,
        error: 'You have completed 30 tasks in this set. Please request a task reset to continue.',
        requiresReset: true
      }, { status: 400 });
    }

    // Calculate commission for CUSTOMER TASKS (can be negative)
    // estimatedNegativeAmount is the commission (can be negative)
    // taskCommission is always 0 for customer tasks in negative scenario
    let finalCommission;
    let commissionType = 'standard';
    
    if (task.hasGoldenEgg === true) {
      // Golden Egg Round: estimatedNegativeAmount + taskCommission
      finalCommission = (task.estimatedNegativeAmount || 0) + (task.taskCommission || 0);
      commissionType = 'golden_egg';
      console.log(`🥚 Golden Egg Round! Commission: ${task.estimatedNegativeAmount || 0} + ${task.taskCommission || 0} = ${finalCommission}`);
    } else {
      // Standard customer task: estimatedNegativeAmount (can be negative)
      finalCommission = (task.estimatedNegativeAmount || 0);
      commissionType = 'customer_task';
      console.log(`📋 Customer Task. Commission: ${finalCommission}`);
    }
    
    console.log(`💰 Commission Type: ${commissionType}, Final Commission: ${finalCommission}`);

    // Update task status
    await customerTasksCollection.updateOne(
      { _id: task._id },
      { 
        $set: { 
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    // Handle negative commission scenario
    let updateData: {
      $set: {
        accountBalance: number;
        negativeCommission?: number;
        holdAmount?: number;
        withdrawalBalance?: number;
        allowTask?: boolean;
        campaignsCompleted: number;
        campaignCommission: number;
        totalEarnings: number;
        campaignSet: number[];
        trialBalance?: number;
        updatedAt: Date;
      };
    };
    const currentAccountBalance = user.accountBalance || 0;
    const currentCampaignCommission = user.campaignCommission || 0;
    const newCampaignsCompleted = task.taskNumber || (user.campaignsCompleted || 0) + 1;
    const newTotalEarnings = (user.totalEarnings || 0) + finalCommission;

    // Check if user has hold balance (from previous negative scenario, now deposited)
    // Release hold if: holdAmount > 0 AND (negativeCommission is 0 OR accountBalance > 0 after positive task)
    const hasHoldBalance = (user.holdAmount || 0) > 0 && 
                          ((user.negativeCommission || 0) === 0 || 
                           (finalCommission > 0 && currentAccountBalance >= 0));

    console.log(`🔍 Hold Balance Check:`, {
      holdAmount: user.holdAmount || 0,
      negativeCommission: user.negativeCommission || 0,
      currentAccountBalance,
      finalCommission,
      hasHoldBalance
    });

    if (finalCommission < 0) {
      // ⚙️ NEGATIVE COMMISSION SCENARIO
      const lossAmount = Math.abs(finalCommission);
      const trialBalance = user.trialBalance || 0;
      
      // Hold amount calculation:
      // The accountBalance already includes trial balance, so we just use it directly
      // Hold = current account balance + loss amount
      // This protects the user's current balance (which already includes trial if any)
      const holdAmount = currentAccountBalance + lossAmount;
      
      console.log(`⚠️ NEGATIVE COMMISSION DETECTED!`);
      console.log(`Loss Amount: ${lossAmount}`);
      console.log(`Current Account Balance: ${currentAccountBalance}`);
      console.log(`Trial Balance (reference): ${trialBalance}`);
      console.log(`Hold Amount (Balance + Loss): ${currentAccountBalance} + ${lossAmount} = ${holdAmount}`);

      updateData = {
        $set: {
          accountBalance: -lossAmount, // Show negative in UI
          negativeCommission: lossAmount, // Store loss amount (positive)
          holdAmount: holdAmount, // Total previous balance + loss
          withdrawalBalance: holdAmount, // Show in withdrawal UI
          allowTask: false, // Block new tasks
          campaignsCompleted: newCampaignsCompleted,
          campaignCommission: currentCampaignCommission + finalCommission,
          totalEarnings: newTotalEarnings,
          campaignSet: user.campaignSet || [],
          updatedAt: new Date()
        }
      };

      console.log(`🔒 Account locked. User must deposit ${lossAmount} BDT to continue.`);
      console.log(`💰 Withdrawal Amount (Hold): ${holdAmount} BDT`);
      
    } else if (hasHoldBalance) {
      // ✅ HOLD BALANCE RELEASE SCENARIO (after deposit, completing next task)
      const releasedAmount = user.holdAmount || 0;
      const newBalance = currentAccountBalance + releasedAmount + finalCommission;
      
      console.log(`🔓 HOLD BALANCE RELEASE!`);
      console.log(`Released Amount: ${releasedAmount}`);
      console.log(`New Commission: ${finalCommission}`);
      console.log(`New Balance: ${newBalance}`);

      updateData = {
        $set: {
          accountBalance: newBalance, // Add hold + new commission to account
          holdAmount: 0, // Clear hold
          withdrawalBalance: 0, // Clear withdrawal balance
          negativeCommission: 0, // Clear negative commission (if not already cleared)
          allowTask: true, // Ensure tasks are allowed
          campaignsCompleted: newCampaignsCompleted,
          campaignCommission: currentCampaignCommission + finalCommission,
          totalEarnings: newTotalEarnings,
          campaignSet: user.campaignSet || [],
          updatedAt: new Date()
        }
      };

      console.log(`✅ Hold balance released to account. Normal flow resumed.`);
      console.log(`🧹 Cleared: holdAmount, withdrawalBalance, negativeCommission`);
      
    } else {
      // ✅ NORMAL POSITIVE COMMISSION SCENARIO
      const newBalance = currentAccountBalance + finalCommission;
      
      console.log(`✅ POSITIVE COMMISSION`);
      console.log(`Commission: ${finalCommission}`);
      console.log(`New Balance: ${newBalance}`);

      updateData = {
        $set: {
          accountBalance: newBalance,
          campaignsCompleted: newCampaignsCompleted,
          campaignCommission: currentCampaignCommission + finalCommission,
          totalEarnings: newTotalEarnings,
          campaignSet: user.campaignSet || [],
          updatedAt: new Date()
        }
      };
    }

    // Check if user has completed 30 tasks and should increment campaignSet
    let updatedCampaignSet = user.campaignSet || [];
    if (newCampaignsCompleted > 0 && newCampaignsCompleted % 30 === 0) {
      const newSetNumber = updatedCampaignSet.length + 1;
      updatedCampaignSet = [...updatedCampaignSet, newSetNumber];
      updateData.$set.campaignSet = updatedCampaignSet;
      
      // Reset trial balance to user's account balance when completing 30 tasks
      const currentTrialBalance = user.trialBalance || 0;
      const currentAccountBalance = updateData.$set.accountBalance;
      
      // Move trial balance to account balance (add trial balance to current account balance)
      updateData.$set.accountBalance = currentAccountBalance + currentTrialBalance;
      updateData.$set.trialBalance = 0; // Reset trial balance to 0
      
      console.log(`🎯 User completed ${newCampaignsCompleted} tasks, adding set ${newSetNumber}. CampaignSet: ${JSON.stringify(updatedCampaignSet)}`);
      console.log(`💰 Trial balance reset: ${currentTrialBalance} BDT moved to account balance`);
      console.log(`📊 New account balance: ${currentAccountBalance} + ${currentTrialBalance} = ${updateData.$set.accountBalance}`);
    }

    await usersCollection.updateOne(
      { _id: user._id },
      updateData
    );

    console.log(`✅ User stats updated successfully in database`);

    // Also record in user task history
    const historyCollection = await getCollection(UserTaskHistoryCollection);
    const historyRecord = {
      membershipId: user.membershipId || 'unknown',
      taskId: task._id.toString(),
      taskNumber: task.taskNumber || 1,
      taskTitle: task.taskTitle || 'Customer Task',
      platform: task.platform || 'Unknown',
      commissionEarned: finalCommission,
      taskPrice: task.taskPrice || 0,
      source: 'customerTasks',
      campaignId: task.campaignId || null,
      hasGoldenEgg: task.hasGoldenEgg || false,
      selectedEgg: null,
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await historyCollection.insertOne(historyRecord);
    console.log(`📚 Task history recorded for user: ${user.membershipId}`);

    // Save daily commission (positive only)
    if (finalCommission > 0) {
      const dailyCommissionsCollection = await getCollection(DailyCommissionCollection);
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const dailyCommission: IDailyCommission = {
        userId: userId,
        amount: finalCommission,
        date: today,
        createdAt: new Date()
      };
      
      await dailyCommissionsCollection.insertOne(dailyCommission);
      console.log(`💰 Daily commission saved: ${finalCommission} BDT for user ${userId} on ${today}`);
    } else {
      console.log(`⚠️ Commission is not positive (${finalCommission}), skipping daily commission tracking`);
    }

    return NextResponse.json({
      success: true,
      message: 'Task completed successfully',
      data: {
        taskId: task._id,
        commission: finalCommission,
        commissionType: commissionType,
        isGoldenEgg: task.hasGoldenEgg === true,
        taskNumber: task.taskNumber,
        hasGoldenEgg: task.hasGoldenEgg,
        tasksCompleted: newCampaignsCompleted,
        accountBalance: updateData.$set.accountBalance,
        newBalance: updateData.$set.accountBalance
      }
    });

  } catch (error) {
    console.error('Task completion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Task completion failed'
    }, { status: 500 });
  }
}
