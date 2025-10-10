import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const usersCollection = await getCollection('users');
    const { username, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Username and password are required'
      }, { status: 400 });
    }

    // Find user
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Check password
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Check if user account is active
    if (user.accountStatus === 'inactive') {
      return NextResponse.json({
        success: false,
        error: 'Your account is inactive. Please contact support for account activation.',
        requiresVerification: true,
        username: user.username
      }, { status: 403 });
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Return user data (without password)
    const userResponse = {
      _id: user._id,
      username: user.username,
      number: user.number,
      gender: user.gender,
      level: user.level,
      membershipId: user.membershipId,
      referralCode: user.referralCode,
      referStatus: user.referStatus,
      creditScore: user.creditScore,
      accountBalance: user.accountBalance,
      totalEarnings: user.totalEarnings,
      campaignsCompleted: user.campaignsCompleted,
      campaignSet: user.campaignSet,
      campaignCommission: user.campaignCommission,
      depositCount: user.depositCount,
      trialBalance: user.trialBalance,
      campaignStatus: user.campaignStatus,
      withdrawStatus: user.withdrawStatus,
      accountStatus: user.accountStatus,
      dailyCheckIn: user.dailyCheckIn,
      isActive: user.isActive,
      allowTask: user.allowTask,
      lastLogin: new Date(),
      createdAt: user.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login failed'
    }, { status: 500 });
  }
}
