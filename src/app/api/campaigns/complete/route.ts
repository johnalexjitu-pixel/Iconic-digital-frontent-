import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ICampaignClaim, CampaignClaimCollection } from '@/models/CampaignClaim';
import { UserTaskHistoryCollection } from '@/models/UserTaskHistory';
import { calculateCommission, getCommissionTier } from '@/lib/commission-calculator';
import { ObjectId } from 'mongodb';

// GET - Fetch completed campaigns for a customer
export async function GET(request: NextRequest) {
  try {
    const claimsCollection = await getCollection(CampaignClaimCollection);
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get completed campaigns - handle both string and ObjectId formats
    let claims = [];
    try {
      // Try as ObjectId first (convert to string for query)
      const customerIdString = new ObjectId(customerId).toString();
      claims = await claimsCollection.find({ customerId: customerIdString }).toArray();
    } catch (e) {
      // If ObjectId fails, try as string
      claims = await claimsCollection.find({ customerId }).toArray();
    }

    return NextResponse.json({
      success: true,
      data: claims
    });

  } catch (error) {
    console.error('Error fetching completed campaigns:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Complete a task and save progress
export async function POST(request: NextRequest) {
  try {
    const claimsCollection = await getCollection(CampaignClaimCollection);
    const usersCollection = await getCollection('users');
    
    const { userId, taskId, taskTitle, platform, commission, amount, taskType, campaignId, taskPrice, taskNumber } = await request.json();
    
    if (!userId || !taskId) {
      return NextResponse.json(
        { success: false, message: 'User ID and Task ID are required' },
        { status: 400 }
      );
    }

    // Get user data to calculate commission based on balance
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has negative balance
    if ((user.accountBalance || 0) < 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Your account balance is negative. Please contact customer support or make a deposit to continue.',
          errorType: 'negative_balance',
          redirectTo: '/contact-support'
        },
        { status: 403 }
      );
    }

    // Calculate commission based on user's account balance
    const balanceBasedCommission = calculateCommission(user.accountBalance || 0);
    const finalCommission = commission || balanceBasedCommission;
    
    console.log(`💰 User balance: ${user.accountBalance}, Commission tier: ${getCommissionTier(user.accountBalance)?.description}, Calculated commission: ${finalCommission}`);

    // Always create a new campaign claim to allow multiple completions of the same task
    const claim: ICampaignClaim = {
      customerId: userId,
      taskId: taskId,
      claimedAt: new Date(),
      status: 'completed',
      campaignId: campaignId, // Store the original campaign ID
      commissionEarned: finalCommission, // Store commission earned
      taskTitle: taskTitle, // Store task title for history
      platform: platform, // Store platform for history
      taskPrice: taskPrice || amount, // Store task price for history
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const claimResult = await claimsCollection.insertOne(claim);
    console.log(`✅ Task completion saved to database with ID: ${claimResult.insertedId}`);

    // Get user data for history recording
    const userForHistory = await usersCollection.findOne({ _id: new ObjectId(userId) });

    // Also record in user task history
    const historyCollection = await getCollection(UserTaskHistoryCollection);
    const historyRecord = {
      membershipId: userForHistory?.membershipId || 'unknown',
      taskId: taskId,
      taskNumber: taskNumber || 1,
      taskTitle: taskTitle,
      platform: platform,
      commissionEarned: finalCommission,
      taskPrice: taskPrice || amount,
      source: 'campaigns',
      campaignId: campaignId,
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await historyCollection.insertOne(historyRecord);
    console.log(`📚 Task history recorded for user: ${userForHistory?.membershipId}`);

    // Update user balance and campaign count with hold balance release logic
    const userForUpdate = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (userForUpdate) {
      let newBalance = (userForUpdate.accountBalance || 0) + finalCommission;
      const newTotalEarnings = (userForUpdate.totalEarnings || 0) + finalCommission;
      const newCampaignsCompleted = (userForUpdate.campaignsCompleted || 0) + 1;
      let newCampaignCommission = (userForUpdate.campaignCommission || 0) + finalCommission;
      
      // Handle hold balance release for deposited users
      if (userForUpdate.depositCount > 0 && userForUpdate.campaignCommission < 0) {
        // User has deposited and had negative commission - release hold balance
        const holdBalance = Math.abs(userForUpdate.campaignCommission);
        newBalance = newBalance + holdBalance;
        newCampaignCommission = finalCommission; // Reset to current task commission
        console.log(`🔄 Hold balance released: ${holdBalance} added to account balance`);
      }

      console.log(`💰 Updating user balance: ${userForUpdate.accountBalance} → ${newBalance} (+${finalCommission})`);
      console.log(`📊 Updating campaigns completed: ${userForUpdate.campaignsCompleted} → ${newCampaignsCompleted}`);
      console.log(`💵 Updating campaign commission: ${userForUpdate.campaignCommission} → ${newCampaignCommission}`);

      // Check if user has completed 30 tasks and should increment campaignSet
      let updatedCampaignSet = userForUpdate.campaignSet || [];
      if (newCampaignsCompleted > 0 && newCampaignsCompleted % 30 === 0) {
        const newSetNumber = updatedCampaignSet.length + 1;
        updatedCampaignSet = [...updatedCampaignSet, newSetNumber];
        console.log(`🎯 User completed ${newCampaignsCompleted} tasks, adding set ${newSetNumber}. CampaignSet: ${JSON.stringify(updatedCampaignSet)}`);
      }

      const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            accountBalance: newBalance,
            totalEarnings: newTotalEarnings,
            campaignsCompleted: newCampaignsCompleted,
            campaignCommission: newCampaignCommission,
            campaignSet: updatedCampaignSet,
            updatedAt: new Date()
          }
        }
      );
      
      if (updateResult.modifiedCount > 0) {
        console.log(`✅ User stats updated successfully in database`);
      } else {
        console.log(`⚠️ User stats update may have failed - no documents modified`);
      }
    } else {
      console.log(`❌ User not found: ${userId}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Task completed successfully',
      data: {
        claimId: 'insertedId' in claimResult ? claimResult.insertedId : 'updated',
        commissionAdded: finalCommission || 0,
        commission: finalCommission || 0,
        newBalance: userForUpdate ? (userForUpdate.accountBalance || 0) + finalCommission : 0,
        accountBalance: userForUpdate ? (userForUpdate.accountBalance || 0) + finalCommission : 0
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