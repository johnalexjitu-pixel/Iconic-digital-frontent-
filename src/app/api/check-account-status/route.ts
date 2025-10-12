import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Get current account status
    const accountStatus = {
      userId: user._id.toString(),
      membershipId: user.membershipId,
      username: user.username,
      accountBalance: user.accountBalance || 0,
      trialBalance: user.trialBalance || 0,
      campaignsCompleted: user.campaignsCompleted || 0,
      campaignSet: user.campaignSet || [],
      depositCount: user.depositCount || 0,
      holdAmount: user.holdAmount || 0,
      withdrawalBalance: user.withdrawalBalance || 0,
      negativeCommission: user.negativeCommission || 0,
      allowTask: user.allowTask !== false, // Default to true
      lastReset: user.lastReset,
      updatedAt: user.updatedAt
    };

    // Calculate total available balance
    const totalAvailable = accountStatus.accountBalance + accountStatus.trialBalance;

    return NextResponse.json({
      success: true,
      message: 'Account status retrieved successfully',
      data: {
        ...accountStatus,
        totalAvailable,
        isLocked: accountStatus.campaignsCompleted >= 30 && accountStatus.depositCount === 0,
        canWithdraw: accountStatus.depositCount > 0 || accountStatus.campaignsCompleted >= 30
      }
    });

  } catch (error) {
    console.error('Error checking account status:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check account status'
    }, { status: 500 });
  }
}
