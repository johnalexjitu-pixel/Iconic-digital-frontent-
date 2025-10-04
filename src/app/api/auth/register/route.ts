import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const usersCollection = await getCollection('users');
    const { name, email, password, referralCode } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Name, email, and password are required'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User already exists with this email'
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique IDs
    const membershipId = Math.floor(10000 + Math.random() * 90000).toString();
    const userReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create new user document
    const newUser = {
      _id: new ObjectId(),
      name,
      email,
      password: hashedPassword,
      membershipId,
      referralCode: userReferralCode,
      level: 'Bronze',
      creditScore: 100,
      accountBalance: 0,
      totalEarnings: 0,
      campaignsCompleted: 0,
      dailyCheckIn: {
        streak: 0,
        daysClaimed: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await usersCollection.insertOne(newUser);

    // Return user data (without password)
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      level: newUser.level,
      membershipId: newUser.membershipId,
      referralCode: newUser.referralCode,
      creditScore: newUser.creditScore,
      accountBalance: newUser.accountBalance,
      totalEarnings: newUser.totalEarnings,
      campaignsCompleted: newUser.campaignsCompleted,
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
