import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { canUserWithdraw, getCampaignSetRule } from '@/lib/campaign-set-rules';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate total deposit amount (sum of all deposits)
    const depositsCollection = await getCollection('deposits');
    const deposits = await depositsCollection.find({ 
      userId: userId, 
      status: 'approved' 
    }).toArray();
    
    const totalDepositAmount = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    
    // Get campaign set rule based on deposit amount
    const campaignRule = getCampaignSetRule(totalDepositAmount);
    
    // Check if user can withdraw
    const canWithdraw = canUserWithdraw(user.campaignsCompleted || 0, totalDepositAmount);
    
    // Calculate progress
    const progressPercentage = Math.min(
      ((user.campaignsCompleted || 0) / campaignRule.totalTasksRequired) * 100, 
      100
    );
    
    console.log(`📊 Withdrawal eligibility check for user ${userId}:`);
    console.log(`Total Deposit: ${totalDepositAmount} BDT`);
    console.log(`Campaigns Completed: ${user.campaignsCompleted || 0}`);
    console.log(`Total Tasks Required: ${campaignRule.totalTasksRequired}`);
    console.log(`Can Withdraw: ${canWithdraw}`);
    console.log(`Progress: ${progressPercentage.toFixed(1)}%`);
    
    return NextResponse.json({
      success: true,
      data: {
        userId: userId,
        canWithdraw: canWithdraw,
        campaignsCompleted: user.campaignsCompleted || 0,
        totalTasksRequired: campaignRule.totalTasksRequired,
        remainingTasks: Math.max(0, campaignRule.totalTasksRequired - (user.campaignsCompleted || 0)),
        progressPercentage: Math.round(progressPercentage),
        campaignRule: campaignRule,
        totalDepositAmount: totalDepositAmount,
        campaignSet: user.campaignSet || [1],
        withdrawStatus: user.withdrawStatus || 'inactive'
      }
    });

  } catch (error) {
    console.error('Error checking withdrawal eligibility:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate total deposit amount
    const depositsCollection = await getCollection('deposits');
    const deposits = await depositsCollection.find({ 
      userId: userId, 
      status: 'approved' 
    }).toArray();
    
    const totalDepositAmount = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    
    // Check if user can withdraw
    const canWithdraw = canUserWithdraw(user.campaignsCompleted || 0, totalDepositAmount);
    
    if (!canWithdraw) {
      const campaignRule = getCampaignSetRule(totalDepositAmount);
      const remainingTasks = campaignRule.totalTasksRequired - (user.campaignsCompleted || 0);
      
      return NextResponse.json({
        success: false,
        message: `You need to complete ${remainingTasks} more tasks to be eligible for withdrawal`,
        data: {
          campaignsCompleted: user.campaignsCompleted || 0,
          totalTasksRequired: campaignRule.totalTasksRequired,
          remainingTasks: remainingTasks,
          campaignRule: campaignRule
        }
      }, { status: 403 });
    }

    // Enable withdrawal for eligible user
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          withdrawStatus: 'active',
          updatedAt: new Date() 
        } 
      }
    );

    console.log(`✅ Withdrawal enabled for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Withdrawal eligibility confirmed and enabled',
      data: {
        userId: userId,
        withdrawStatus: 'active',
        campaignsCompleted: user.campaignsCompleted || 0,
        totalDepositAmount: totalDepositAmount
      }
    });

  } catch (error) {
    console.error('Error enabling withdrawal:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
