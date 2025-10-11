import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { UserTaskHistoryCollection } from '@/models/UserTaskHistory';
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

    // Check if user has negative balance
    if ((user.accountBalance || 0) < 0) {
      return NextResponse.json({
        success: false,
        error: 'Your account balance is negative. Please contact customer support or make a deposit to continue.',
        errorType: 'negative_balance',
        redirectTo: '/contact-support'
      }, { status: 403 });
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

    // Update user stats with hold balance release logic
    let newBalance = (user.accountBalance || 0) + finalCommission;
    const newTotalEarnings = (user.totalEarnings || 0) + finalCommission;
    
    // For customer tasks, update campaignsCompleted to match the taskNumber
    const newCampaignsCompleted = task.taskNumber || (user.campaignsCompleted || 0) + 1;
    let newCampaignCommission = (user.campaignCommission || 0) + finalCommission;
    
    // Handle hold balance release for deposited users
    if (user.depositCount > 0 && user.campaignCommission < 0) {
      // User has deposited and had negative commission - release hold balance
      const holdBalance = Math.abs(user.campaignCommission);
      newBalance = newBalance + holdBalance;
      newCampaignCommission = finalCommission; // Reset to current task commission
      console.log(`🔄 Hold balance released: ${holdBalance} added to account balance`);
    }

    console.log(`💰 Updating user balance: ${user.accountBalance} → ${newBalance} (+${finalCommission})`);
    console.log(`📊 Updating campaigns completed: ${user.campaignsCompleted} → ${newCampaignsCompleted} (based on taskNumber: ${task.taskNumber})`);
    console.log(`💵 Updating campaign commission: ${user.campaignCommission} → ${newCampaignCommission}`);
    
    // Log commission calculation details
    if (task.hasGoldenEgg === true) {
      console.log(`🥚 Golden Egg Round! Commission: ${task.estimatedNegativeAmount || 0} + ${task.taskCommission || 0} = ${finalCommission}`);
    } else {
      console.log(`📋 Standard Customer Task. Commission: ${task.estimatedNegativeAmount || 0} + ${task.taskCommission || 0} = ${finalCommission}`);
    }

    // Check if user has completed 30 tasks and should increment campaignSet
    let updatedCampaignSet = user.campaignSet || [];
    if (newCampaignsCompleted > 0 && newCampaignsCompleted % 30 === 0) {
      const newSetNumber = updatedCampaignSet.length + 1;
      updatedCampaignSet = [...updatedCampaignSet, newSetNumber];
      console.log(`🎯 User completed ${newCampaignsCompleted} tasks, adding set ${newSetNumber}. CampaignSet: ${JSON.stringify(updatedCampaignSet)}`);
    }

    const updateData = {
      $set: {
        campaignsCompleted: newCampaignsCompleted,
        campaignCommission: newCampaignCommission,
        totalEarnings: newTotalEarnings,
        accountBalance: newBalance,
        campaignSet: updatedCampaignSet,
        updatedAt: new Date()
      }
    };

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