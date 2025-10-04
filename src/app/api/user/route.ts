import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // For demo purposes, return mock user data
    // In production, you'd get the user ID from authentication
    const mockUser = {
      _id: "mock_user_id",
      name: "gokazi",
      email: "gokazi@example.com",
      level: "Silver",
      membershipId: "46235",
      referralCode: "UXOX485U6",
      creditScore: 100,
      accountBalance: 61076,
      totalEarnings: 0,
      campaignsCompleted: 8,
      lastLogin: new Date(),
      dailyCheckIn: {
        lastCheckIn: new Date(),
        streak: 4,
        daysClaimed: [1, 2, 3, 4]
      }
    };

    return NextResponse.json({
      success: true,
      data: mockUser
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const updateData = await request.json();
    const userId = "mock_user_id"; // In production, get from auth

    // For demo, just return success
    // In production, update the actual user document

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
