import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { config } from '@/lib/config';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    // Try to get data from backend server first
    if (config.env.isDevelopment) {
      const backendResponse = await apiClient.getUserProfile();
      
      if (backendResponse.success) {
        return NextResponse.json(backendResponse);
      }
    }

    // Fallback to mock data if backend is not available
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
      data: mockUser,
      source: 'mock-data'
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

    // Handle password updates
    if (updateData.currentPassword && updateData.newPassword) {
      // Update login password
      const hashedPassword = await bcrypt.hash(updateData.newPassword, 12);
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
    }

    if (updateData.currentWithdrawalPassword && updateData.newWithdrawalPassword) {
      // Update withdrawal password
      const hashedWithdrawalPassword = await bcrypt.hash(updateData.newWithdrawalPassword, 12);
      await User.findByIdAndUpdate(userId, { withdrawalPassword: hashedWithdrawalPassword });
    }

    // Handle other updates
    const allowedFields = ['dailyCheckIn', 'withdrawalInfo', 'accountBalance', 'totalEarnings'];
    const updateFields: Record<string, any> = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field];
      }
    });

    if (Object.keys(updateFields).length > 0) {
      await User.findByIdAndUpdate(userId, updateFields);
    }

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
