import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const usersCollection = await getCollection('users');
    const { username, password, phoneNumber, gender, referralCode } = await request.json();

    // Validation
    if (!username || !password || !phoneNumber || !gender) {
      return NextResponse.json({
        success: false,
        error: 'Username, password, phone number, and gender are required'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User already exists with this username'
      }, { status: 400 });
    }

    // Generate unique IDs
    const membershipId = Math.floor(10000 + Math.random() * 90000).toString();
    const userReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create new user document with your schema structure
    const newUser = {
      _id: new ObjectId(),
      username,
      number: `+880${phoneNumber}`, // Add Bangladesh country code
      password: password, // Store plain text password
      gender,
      membershipId,
      referralCode: userReferralCode,
      referStatus: 'inactive',
      level: 'Bronze',
      creditScore: 0,
      accountBalance: 10000, // New users get 10000 trial balance added to account balance
      totalEarnings: 0,
      campaignsCompleted: 0,
      campaignSet: [1], // Default campaignSet = 1 for new users
      campaignCommission: 0,
      depositCount: 0,
      requiredTask: 30, // Default required tasks for new users
      trialBalance: 10000, // Keep trial balance field for tracking
      campaignStatus: 'inactive',
      withdrawStatus: 'inactive',
      accountStatus: 'inactive',
      dailyCheckIn: {
        lastCheckIn: null,
        streak: 0,
        daysClaimed: []
      },
      isActive: false,
      allowTask: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await usersCollection.insertOne(newUser);

    // Return user data (without password)
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      number: newUser.number,
      gender: newUser.gender,
      membershipId: newUser.membershipId,
      referralCode: newUser.referralCode,
      referStatus: newUser.referStatus,
      level: newUser.level,
      creditScore: newUser.creditScore,
      accountBalance: newUser.accountBalance,
      totalEarnings: newUser.totalEarnings,
      campaignsCompleted: newUser.campaignsCompleted,
      campaignSet: newUser.campaignSet,
      campaignCommission: newUser.campaignCommission,
      depositCount: newUser.depositCount,
      trialBalance: newUser.trialBalance,
      campaignStatus: newUser.campaignStatus,
      withdrawStatus: newUser.withdrawStatus,
      accountStatus: newUser.accountStatus,
      dailyCheckIn: newUser.dailyCheckIn,
      isActive: newUser.isActive,
      allowTask: newUser.allowTask,
      createdAt: newUser.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Registration failed'
    }, { status: 500 });
  }
}
