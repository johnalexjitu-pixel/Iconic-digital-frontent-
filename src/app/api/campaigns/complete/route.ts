import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ICampaignClaim, CampaignClaimCollection } from '@/models/CampaignClaim';
import { UserTaskHistoryCollection } from '@/models/UserTaskHistory';
import { IDailyCommission, DailyCommissionCollection } from '@/models/DailyCommission';
import { calculateCommission, getCommissionTier } from '@/lib/commission-calculator';
import { shouldProgressCampaignSet, getNextCampaignSet } from '@/lib/campaign-set-rules';
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

    // Update user balance and campaign count with hold balance release logic
    const userForUpdate = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (userForUpdate) {
      let newBalance = (userForUpdate.accountBalance || 0) + finalCommission;
      const newTotalEarnings = (userForUpdate.totalEarnings || 0) + finalCommission;
      const newCampaignsCompleted = (userForUpdate.campaignsCompleted || 0) + 1;
      let newCampaignCommission = (userForUpdate.campaignCommission || 0) + finalCommission;
      
      // Check if user has hold balance from negative commission scenario
      const hasHoldBalance = (userForUpdate.holdAmount || 0) > 0 && 
                            ((userForUpdate.negativeCommission || 0) === 0 || 
                             (finalCommission > 0 && (userForUpdate.accountBalance || 0) >= 0));
      
      console.log(`🔍 Campaign Task - Hold Balance Check:`, {
        holdAmount: userForUpdate.holdAmount || 0,
        negativeCommission: userForUpdate.negativeCommission || 0,
        accountBalance: userForUpdate.accountBalance || 0,
        finalCommission,
        hasHoldBalance
      });
      
      if (hasHoldBalance) {
        // ✅ HOLD BALANCE RELEASE (from negative commission scenario)
        const releasedAmount = userForUpdate.holdAmount || 0;
        newBalance = (userForUpdate.accountBalance || 0) + releasedAmount + finalCommission;
        console.log(`🔓 HOLD BALANCE RELEASE!`);
        console.log(`Released Amount: ${releasedAmount}`);
        console.log(`New Commission: ${finalCommission}`);
        console.log(`New Balance: ${newBalance}`);
      } else if (userForUpdate.depositCount > 0) {
        // Handle old hold balance release for deposited users (legacy logic)
        if (userForUpdate.campaignCommission > 0 && userForUpdate.accountBalance === 0) {
          const holdBalance = userForUpdate.campaignCommission;
          newBalance = newBalance + holdBalance;
          newCampaignCommission = finalCommission;
          console.log(`🔄 Old hold balance released: ${holdBalance} added to account balance`);
        } else {
          newCampaignCommission = (userForUpdate.campaignCommission || 0) + finalCommission;
        }
      }

      console.log(`💰 Updating user balance: ${userForUpdate.accountBalance} → ${newBalance} (+${finalCommission})`);
      console.log(`📊 Updating campaigns completed: ${userForUpdate.campaignsCompleted} → ${newCampaignsCompleted}`);
      console.log(`💵 Updating campaign commission: ${userForUpdate.campaignCommission} → ${newCampaignCommission}`);

      // Reset trial balance to 0 when completing 30 tasks (trial balance disappears)
      // Only for users with NO deposits (depositCount === 0)
      if (newCampaignsCompleted > 0 && newCampaignsCompleted % 30 === 0 && userForUpdate.depositCount === 0) {
        const currentTrialBalance = userForUpdate.trialBalance || 0;
        
        // For non-deposited users, always deduct 10,000 BDT (trial balance amount) from account balance
        // regardless of current trial balance value
        const trialBalanceAmount = 10000; // Standard trial balance amount
        newBalance = newBalance - trialBalanceAmount;
        
        console.log(`💰 Trial balance reset: ${trialBalanceAmount} BDT trial balance deducted`);
        console.log(`📊 Account balance deducted: ${newBalance + trialBalanceAmount} → ${newBalance} BDT`);
        console.log(`🎯 Non-deposited user completed ${newCampaignsCompleted} tasks - trial balance deduction applied`);
      }

      // Check if user has completed tasks and should increment campaignSet
      let updatedCampaignSet = userForUpdate.campaignSet || [];
      let requiredTask = 30; // Default required tasks
      
      if (shouldProgressCampaignSet(newCampaignsCompleted, updatedCampaignSet.length, userForUpdate.depositCount > 0 ? 1 : 0, newBalance)) {
        const nextSet = getNextCampaignSet(updatedCampaignSet.length, userForUpdate.depositCount > 0 ? 1 : 0, newBalance);
        updatedCampaignSet.push(nextSet);
        
        console.log(`🎯 User completed ${newCampaignsCompleted} tasks, progressing to campaign set ${nextSet}. CampaignSet: ${JSON.stringify(updatedCampaignSet)}`);
        console.log(`💰 Account Balance: ${newBalance} BDT - VIP status: ${newBalance >= 1000000 ? 'Yes' : 'No'}`);
        
        // Set requiredTask based on VIP status and current set
        if (newBalance >= 1000000 && updatedCampaignSet.length === 3) {
          requiredTask = 32; // VIP users in Set 3 need 32 tasks
          console.log(`👑 VIP User progressed to Set 3 - Required tasks: ${requiredTask}`);
        } else {
          requiredTask = 30; // All other cases need 30 tasks
          console.log(`🔒 User progressed to Set ${nextSet} - Required tasks: ${requiredTask}`);
        }
      } else {
        // User hasn't progressed to next set yet, determine current required tasks
        if (newBalance >= 1000000 && updatedCampaignSet.length === 3) {
          requiredTask = 32; // VIP users in Set 3 need 32 tasks
        } else {
          requiredTask = 30; // All other cases need 30 tasks
        }
      }

      // Prepare update data
      const updateData: {
        accountBalance: number;
        totalEarnings: number;
        campaignsCompleted: number;
        campaignCommission: number;
        campaignSet: number[];
        holdAmount?: number;
        withdrawalBalance?: number;
        negativeCommission?: number;
        allowTask?: boolean;
        trialBalance?: number;
        requiredTask?: number;
        updatedAt: Date;
      } = {
        accountBalance: newBalance,
        totalEarnings: newTotalEarnings,
        campaignsCompleted: newCampaignsCompleted,
        campaignCommission: newCampaignCommission,
        campaignSet: updatedCampaignSet,
        requiredTask: requiredTask,
        updatedAt: new Date()
      };
      
      // If hold was released, clear the hold fields
      if (hasHoldBalance) {
        updateData.holdAmount = 0;
        updateData.withdrawalBalance = 0;
        updateData.negativeCommission = 0;
        updateData.allowTask = true;
        console.log(`🧹 Cleared: holdAmount, withdrawalBalance, negativeCommission`);
      }
      
      // If 30 tasks completed, reset trial balance (only for non-deposited users)
      if (newCampaignsCompleted > 0 && newCampaignsCompleted % 30 === 0 && userForUpdate.depositCount === 0) {
        updateData.trialBalance = 0;
      }
      
      const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
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