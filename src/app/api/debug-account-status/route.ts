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
      campaignCommission: user.campaignCommission || 0,
      totalEarnings: user.totalEarnings || 0,
      updatedAt: user.updatedAt
    };

    // Check if trial balance deduction should have happened
    const shouldHaveDeduction = accountStatus.campaignsCompleted >= 30 && accountStatus.depositCount === 0;
    const expectedAccountBalance = shouldHaveDeduction && accountStatus.trialBalance === 0 
      ? accountStatus.accountBalance + 10000 // If trial balance is 0, account should have been deducted by 10000
      : accountStatus.accountBalance;

    return NextResponse.json({
      success: true,
      message: 'Account status retrieved successfully',
      data: {
        ...accountStatus,
        shouldHaveDeduction,
        expectedAccountBalance,
        deductionIssue: shouldHaveDeduction && accountStatus.trialBalance === 0 && accountStatus.accountBalance > 1000
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
