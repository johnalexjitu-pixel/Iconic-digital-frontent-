import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { UserTaskHistoryCollection } from '@/models/UserTaskHistory';
import { HoldAmountCollection } from '@/models/HoldAmount';
import { calculateCommission, getCommissionTier } from '@/lib/commission-calculator';
import { ObjectId } from 'mongodb';

// Automatic hold amount calculation function
function calculateHoldAmount(accountBalance: number, trialBalance: number, commission: number): number {
  console.log(`🧮 Calculating hold amount: accountBalance=${accountBalance}, trialBalance=${trialBalance}, commission=${commission}`);
  
  // If commission is negative, calculate hold amount
  if (commission < 0) {
    const lossAmount = Math.abs(commission);
    // Hold amount = previous balance + trial balance + loss amount
    const totalHoldAmount = accountBalance + trialBalance + lossAmount;
    
    console.log(`💸 Negative commission detected: ${commission}`);
    console.log(`💸 Previous account balance: ${accountBalance}`);
    console.log(`💸 Trial balance: ${trialBalance}`);
    console.log(`💸 Loss amount: ${lossAmount}`);
    console.log(`💸 Total hold amount: ${accountBalance} + ${trialBalance} + ${lossAmount} = ${totalHoldAmount}`);
    
    return totalHoldAmount;
  }
  
  // If commission is positive, no hold amount needed
  console.log(`✅ Positive commission: ${commission} - no hold amount needed`);
  return 0;
}

export async function POST(request: NextRequest) {
  try {
    const customerTasksCollection = await getCollection('customerTasks');
    const usersCollection = await getCollection('users');
    const holdAmountsCollection = await getCollection(HoldAmountCollection);
    
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
    // Exception: Allow task completion if user has negative commission (to process the negative)
    if (user.allowTask === false) {
      // Check if this is a negative commission task that should be allowed
      const isNegativeCommissionTask = task.estimatedNegativeAmount && task.estimatedNegativeAmount < 0;
      
      if (!isNegativeCommissionTask) {
        return NextResponse.json({
          success: false,
          error: 'Your account is temporarily blocked. Please make a deposit to unlock tasks.',
          errorType: 'account_blocked',
          redirectTo: '/deposit'
        }, { status: 403 });
      } else {
        console.log(`⚠️ Allowing blocked user to complete negative commission task: ${task.estimatedNegativeAmount}`);
      }
    }

    // Check if user can complete tasks (campaignStatus must be active)
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

    // Calculate commission based on Golden Egg logic for customerTasks
    let finalCommission;
    let commissionType = 'standard';
    
    if (task.hasGoldenEgg === true) {
      // Golden Egg Round: estimatedNegativeAmount + taskCommission
      finalCommission = (task.estimatedNegativeAmount || 0) + (task.taskCommission || 0);
      commissionType = 'golden_egg';
      console.log(`🥚 Golden Egg Round! Commission: ${task.estimatedNegativeAmount || 0} + ${task.taskCommission || 0} = ${finalCommission}`);
    } else {
      // Standard customer task: estimatedNegativeAmount + taskCommission (same as Golden Egg)
      finalCommission = (task.estimatedNegativeAmount || 0) + (task.taskCommission || 0);
      commissionType = 'customer_task';
      console.log(`📋 Standard Customer Task. Commission: ${task.estimatedNegativeAmount || 0} + ${task.taskCommission || 0} = ${finalCommission}`);
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

    // 🧠 NEW CAMPAIGN LOGIC IMPLEMENTATION
    let newBalance = 0;
    let newWithdrawalBalance = 0;
    let newAllowTask = true;
    let newHoldAmount = 0;
    let newLastNegativeTime = null;

    if (finalCommission > 0) {
      // 1️⃣ POSITIVE COMMISSION (Normal Case)
      console.log('✅ Positive Commission - Normal Case');
      
      // Check if user has holdAmount (from previous negative commission)
      if (user.holdAmount && user.holdAmount > 0) {
        // 4️⃣ After Next Task (Post-Deposit Merge)
        console.log('🔄 Post-Deposit Merge - Releasing hold amount');
        const currentAccountBalance = user.accountBalance || 0;
        const currentTrialBalance = user.trialBalance || 0;
        const fullCurrentBalance = currentAccountBalance + currentTrialBalance;
        
        // Merge hold amount back to account balance (including trial)
        newBalance = fullCurrentBalance + user.holdAmount + finalCommission;
        newWithdrawalBalance = 0; // Clear withdrawal balance
        newHoldAmount = 0; // Clear hold amount from users collection
        newAllowTask = true;
        
        // Clear hold amount from database
        await holdAmountsCollection.updateOne(
          { userId: user._id.toString(), isActive: true },
          {
            $set: {
              isActive: false,
              clearedAt: new Date(),
              updatedAt: new Date()
            }
          }
        );
        
        console.log(`🔄 Post-deposit merge: ${fullCurrentBalance} + ${user.holdAmount} + ${finalCommission} = ${newBalance}`);
        console.log(`📊 Account balance includes trial: ${currentAccountBalance} + ${currentTrialBalance} = ${fullCurrentBalance}`);
        console.log(`✅ Hold amount cleared from users collection: ${user.holdAmount} → 0`);
      } else {
        // Normal positive commission
        const currentAccountBalance = user.accountBalance || 0;
        const currentTrialBalance = user.trialBalance || 0;
        newBalance = currentAccountBalance + currentTrialBalance + finalCommission;
        newWithdrawalBalance = 0;
        newAllowTask = true;
        console.log(`✅ Normal positive: ${currentAccountBalance} + ${currentTrialBalance} + ${finalCommission} = ${newBalance}`);
      }
      
    } else if (finalCommission < 0) {
      // 2️⃣ NEGATIVE COMMISSION (Loss Case)
      console.log('⚠️ Negative Commission - Loss Case');
      
      const previousAccountBalance = user.accountBalance || 0;
      const trialBalance = user.trialBalance || 0; // Include trial balance
      const fullAccountBalance = previousAccountBalance + trialBalance; // Full balance including trial
      
      newBalance = finalCommission; // Shows only the loss (negative commission)
      const holdAmount = fullAccountBalance + Math.abs(finalCommission); // Total hold amount (previous balance + trial + loss)
      newWithdrawalBalance = 0; // No withdrawal balance in negative scenario
      newAllowTask = false; // Block user until deposit
      newLastNegativeTime = new Date();
      
      // Automatic hold amount calculation logic
      const automaticHoldAmount = calculateHoldAmount(previousAccountBalance, trialBalance, finalCommission);
      newHoldAmount = automaticHoldAmount; // Use automatic calculation
      
      // Store total withdrawal amount in database for future use
      const storedWithdrawalAmount = automaticHoldAmount; // Use automatic calculation
      const withdrawalStatus = 'pending'; // Set status as pending when storing withdrawal amount
      
      console.log(`📊 Full account balance (including trial): ${previousAccountBalance} + ${trialBalance} = ${fullAccountBalance}`);
      console.log(`💸 Automatic hold amount calculation: ${automaticHoldAmount}`);
      console.log(`💸 Manual hold amount: ${fullAccountBalance} + ${Math.abs(finalCommission)} = ${holdAmount}`);
      console.log(`💾 Using automatic calculation: ${automaticHoldAmount} with status: ${withdrawalStatus}`);
      console.log(`👤 User tracking: userId=${user._id}, username=${user.username}, membershipId=${user.membershipId}`);
      
      // Use automatic calculation instead of manual
      newHoldAmount = automaticHoldAmount;
      
      // Save hold amount to database
      await holdAmountsCollection.updateOne(
        { userId: user._id.toString(), isActive: true },
        {
          $set: {
            userId: user._id.toString(),
            membershipId: user.membershipId,
            holdAmount: newHoldAmount,
            reason: 'negative_commission',
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
      
      console.log(`⚠️ Negative commission: ${finalCommission}, accountBalance: ${newBalance}, withdrawalBalance: ${newWithdrawalBalance}, holdAmount: ${newHoldAmount}`);
    } else {
      // No commission change
      newBalance = user.accountBalance || 0;
      newWithdrawalBalance = user.withdrawalBalance || 0;
      newAllowTask = user.allowTask;
    }

    // Update user stats
    const newTotalEarnings = (user.totalEarnings || 0) + finalCommission;
    const newCampaignsCompleted = task.taskNumber || (user.campaignsCompleted || 0) + 1;
    const newCampaignCommission = (user.campaignCommission || 0) + finalCommission;

    console.log(`💰 Updating user balance: ${user.accountBalance} → ${newBalance} (+${finalCommission})`);
    console.log(`📊 Updating campaigns completed: ${user.campaignsCompleted} → ${newCampaignsCompleted} (based on taskNumber: ${task.taskNumber})`);
    console.log(`💵 Updating campaign commission: ${user.campaignCommission} → ${newCampaignCommission}`);
    console.log(`🔒 Allow task: ${user.allowTask} → ${newAllowTask}`);

    // Check if user has completed 30 tasks and should increment campaignSet
    let updatedCampaignSet = user.campaignSet || [];
    if (newCampaignsCompleted > 0 && newCampaignsCompleted % 30 === 0) {
      const newSetNumber = updatedCampaignSet.length + 1;
      updatedCampaignSet = [...updatedCampaignSet, newSetNumber];
      console.log(`🎯 User completed ${newCampaignsCompleted} tasks, adding set ${newSetNumber}. CampaignSet: ${JSON.stringify(updatedCampaignSet)}`);
    }

    // If withdrawal balance is being cleared (post-deposit merge), clear trial balance too
    const shouldClearTrialBalance = user.withdrawalBalance && user.withdrawalBalance > 0 && newWithdrawalBalance === 0;
    
    // Determine stored withdrawal amount and status based on scenario
    let storedWithdrawalAmount = user.storedWithdrawalAmount || 0;
    let withdrawalStatus = user.withdrawalStatus || 'cleared';
    
    if (finalCommission < 0) {
      // Negative scenario: store the total withdrawal amount with pending status
      storedWithdrawalAmount = newHoldAmount; // Use holdAmount instead of withdrawalBalance
      withdrawalStatus = 'pending';
      console.log(`📝 Setting withdrawal status to PENDING for user: ${user.username} (${user.membershipId})`);
      console.log(`💾 Storing hold amount as withdrawal amount: ${newHoldAmount}`);
    } else if (shouldClearTrialBalance) {
      // Post-deposit merge: clear stored withdrawal amount and set to cleared
      storedWithdrawalAmount = 0;
      withdrawalStatus = 'cleared';
      console.log(`✅ Setting withdrawal status to CLEARED for user: ${user.username} (${user.membershipId})`);
    }
    
    const updateData = {
      $set: {
        campaignsCompleted: newCampaignsCompleted,
        campaignCommission: newCampaignCommission,
        totalEarnings: newTotalEarnings,
        accountBalance: newBalance,
        withdrawalBalance: newWithdrawalBalance,
        allowTask: newAllowTask,
        holdAmount: newHoldAmount,
        lastNegativeTime: newLastNegativeTime,
        campaignSet: updatedCampaignSet,
        storedWithdrawalAmount: storedWithdrawalAmount, // Store withdrawal amount in database
        withdrawalStatus: withdrawalStatus, // Track withdrawal status (pending/cleared)
        updatedAt: new Date(),
        // Clear trial balance when withdrawal balance is released (post-deposit merge)
        ...(shouldClearTrialBalance && { trialBalance: 0 })
      }
    };
    
    if (shouldClearTrialBalance) {
      console.log(`🔄 Clearing trial balance as withdrawal balance is being released`);
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
        accountBalance: newBalance,
        withdrawalBalance: newWithdrawalBalance,
        allowTask: newAllowTask,
        newBalance: newBalance
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