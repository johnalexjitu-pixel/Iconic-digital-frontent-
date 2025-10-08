import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { IUserTaskHistory, UserTaskHistoryCollection } from '@/models/UserTaskHistory';

// GET - Fetch next task using new workflow system
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const membershipId = searchParams.get('membershipId');
    
    if (!membershipId) {
      return NextResponse.json(
        { success: false, message: 'Membership ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Starting task workflow for membershipId: ${membershipId}`);

    // Step 1: Check user's completed tasks count
    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ membershipId });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const completedTasks = user.campaignsCompleted || 0;
    const nextTaskNumber = completedTasks + 1;
    
    console.log(`📊 User has completed ${completedTasks} tasks, looking for task #${nextTaskNumber}`);

    // Step 2: Search in customerTasks collection first
    const customerTasksCollection = await getCollection('customerTasks');
    const customerTask = await customerTasksCollection.findOne({
      customerCode: membershipId, // Search by customerCode, not customerId
      taskNumber: nextTaskNumber,
      status: 'pending'
    });

    if (customerTask) {
      console.log(`✅ Found task in customerTasks: Task #${nextTaskNumber}`);
      
      // Calculate commission from customerTasks
      const totalCommission = (customerTask.taskCommission || 0) + 
                             (customerTask.taskPrice || 0) + 
                             (customerTask.estimatedNegativeAmount || 0);
      
      console.log(`💰 CustomerTask commission calculation: ${customerTask.taskCommission} + ${customerTask.taskPrice} + ${customerTask.estimatedNegativeAmount} = ${totalCommission}`);

      const taskData = {
        _id: customerTask._id.toString(),
        customerId: customerTask.customerCode, // Use customerCode as customerId for consistency
        taskNumber: customerTask.taskNumber,
        taskTitle: customerTask.taskTitle || `Task ${customerTask.taskNumber}`,
        taskDescription: customerTask.taskDescription || `Complete task ${customerTask.taskNumber}`,
        platform: customerTask.platform || 'General',
        taskCommission: totalCommission,
        taskPrice: customerTask.taskPrice || 0,
        status: customerTask.status,
        source: 'customerTasks',
        campaignId: customerTask.campaignId,
        hasGoldenEgg: customerTask.hasGoldenEgg || false,
        createdAt: customerTask.createdAt,
        updatedAt: customerTask.updatedAt
      };

      return NextResponse.json({
        success: true,
        data: {
          task: taskData,
          completedCount: completedTasks,
          nextTaskNumber: nextTaskNumber,
          source: 'customerTasks',
          calculation: {
            taskCommission: customerTask.taskCommission || 0,
            taskPrice: customerTask.taskPrice || 0,
            estimatedNegativeAmount: customerTask.estimatedNegativeAmount || 0,
            totalCommission: totalCommission
          }
        }
      });
    }

    // Step 3: If not found in customerTasks, search in campaigns collection
    console.log(`❌ Task #${nextTaskNumber} not found in customerTasks, searching campaigns...`);
    
    const campaignsCollection = await getCollection('campaigns');
    const campaigns = await campaignsCollection.find({ 
      status: 'Active',
      isActive: true 
    }).toArray();

    if (campaigns.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No active campaigns available',
        completedCount: completedTasks
      });
    }

    // Randomly select a campaign (since campaigns don't have task numbers)
    const randomCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    
    console.log(`🎯 Selected random campaign: ${randomCampaign.brand} (ID: ${randomCampaign._id})`);

    // Calculate commission from campaigns
    const totalCommission = (randomCampaign.commissionAmount || 0) + 
                           (randomCampaign.baseAmount || 0);
    
    console.log(`💰 Campaign commission calculation: ${randomCampaign.commissionAmount} + ${randomCampaign.baseAmount} = ${totalCommission}`);

    const taskData = {
      _id: randomCampaign._id.toString(),
      customerId: membershipId,
      taskNumber: nextTaskNumber,
      taskTitle: randomCampaign.brand || `Campaign Task ${nextTaskNumber}`,
      taskDescription: randomCampaign.description || `Complete campaign task ${nextTaskNumber}`,
      platform: randomCampaign.type || 'General',
      taskCommission: totalCommission,
      taskPrice: randomCampaign.baseAmount || 0,
      status: 'pending',
      source: 'campaigns',
      campaignId: randomCampaign._id.toString(),
      hasGoldenEgg: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: {
        task: taskData,
        completedCount: completedTasks,
        nextTaskNumber: nextTaskNumber,
        source: 'campaigns',
        calculation: {
          commissionAmount: randomCampaign.commissionAmount || 0,
          baseAmount: randomCampaign.baseAmount || 0,
          totalCommission: totalCommission
        }
      }
    });

  } catch (error) {
    console.error('Error in task workflow:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Complete task and update user progress
export async function POST(request: NextRequest) {
  try {
    const { membershipId, taskId, taskTitle, platform, commission, taskNumber, source } = await request.json();
    
    if (!membershipId || !taskId) {
      return NextResponse.json(
        { success: false, message: 'Membership ID and Task ID are required' },
        { status: 400 }
      );
    }

    console.log(`🎯 Completing task for membershipId: ${membershipId}, Task: ${taskTitle}, Commission: ${commission}`);

    // Update user's campaignsCompleted count
    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ membershipId });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const currentCompleted = user.campaignsCompleted || 0;
    const newCompleted = currentCompleted + 1;
    const newBalance = (user.accountBalance || 0) + commission;
    const newTotalEarnings = (user.totalEarnings || 0) + commission;

    console.log(`📊 Updating user progress: ${currentCompleted} → ${newCompleted} tasks completed`);
    console.log(`💰 Updating balance: ${user.accountBalance} → ${newBalance} (+${commission})`);

    // Update user in database
    await usersCollection.updateOne(
      { membershipId },
      {
        $set: {
          campaignsCompleted: newCompleted,
          accountBalance: newBalance,
          totalEarnings: newTotalEarnings,
          updatedAt: new Date()
        }
      }
    );

    // If task was from customerTasks, mark it as completed
    if (source === 'customerTasks') {
      const customerTasksCollection = await getCollection('customerTasks');
      await customerTasksCollection.updateOne(
        { _id: new ObjectId(taskId) },
        {
          $set: {
            status: 'completed',
            completedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
    }

    // Save task completion record
    const claimsCollection = await getCollection('campaignclaims');
    await claimsCollection.insertOne({
      customerId: membershipId,
      taskId: taskId,
      claimedAt: new Date(),
      status: 'completed',
      campaignId: taskId,
      commissionEarned: commission,
      taskTitle: taskTitle,
      platform: platform,
      taskPrice: commission,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save to user task history for history page
    const historyCollection = await getCollection(UserTaskHistoryCollection);
    const historyRecord: IUserTaskHistory = {
      membershipId: membershipId,
      customerCode: membershipId, // Use membershipId as customerCode for consistency
      taskId: taskId,
      taskNumber: taskNumber,
      taskTitle: taskTitle,
      taskDescription: `Completed task ${taskNumber}`,
      platform: platform,
      commissionEarned: commission,
      taskPrice: commission,
      source: source as 'customerTasks' | 'campaigns',
      campaignId: taskId,
      hasGoldenEgg: false, // Default to false, can be updated if needed
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await historyCollection.insertOne(historyRecord);
    console.log(`📝 Task completion saved to user history: Task #${taskNumber}`);

    console.log(`✅ Task completion saved successfully`);

    return NextResponse.json({
      success: true,
      message: 'Task completed successfully',
      data: {
        completedCount: newCompleted,
        commissionAdded: commission,
        newBalance: newBalance
      }
    });

  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

