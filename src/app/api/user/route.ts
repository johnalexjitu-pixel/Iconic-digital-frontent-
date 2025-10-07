import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { config } from '@/lib/config';
import { getCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Get user data from database
    const usersCollection = await getCollection('users');
    
    // Get user email from query parameters or default to test@test.com
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'test@test.com';
    
    // Get the specific user by email
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No user found'
      }, { status: 404 });
    }

    // Return user data (without password)
        const userResponse = {
          _id: user._id,
          name: user.name?.trim() || 'User',
          email: user.email,
          level: user.level || 'Bronze',
          membershipId: user.membershipId || '',
          referralCode: user.referralCode || '',
          creditScore: user.creditScore || 100,
          accountBalance: user.accountBalance || 0,
          walletBalance: user.walletBalance || 0,
          totalEarnings: user.totalEarnings || 0,
          campaignsCompleted: user.campaignsCompleted || 0,
          todayCommission: user.todayCommission || 0,
          withdrawalAmount: user.withdrawalAmount || 0,
          dailyCampaignsCompleted: user.dailyCampaignsCompleted || 0,
          dailyCheckIn: user.dailyCheckIn || { 
            lastCheckIn: null, 
            streak: 0, 
            daysClaimed: [] 
          },
          withdrawalInfo: user.withdrawalInfo || null,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          phoneNumber: user.phoneNumber || ''
        };

    return NextResponse.json({
      success: true,
      data: userResponse,
      source: 'database'
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
    const usersCollection = await getCollection('users');
    const updateData = await request.json();
    
    // Get user ID from the request body or headers
    const userId = updateData.userId || updateData._id;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Handle password updates
    if (updateData.currentPassword && updateData.newPassword) {
      // Update login password
      const hashedPassword = await bcrypt.hash(updateData.newPassword, 12);
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashedPassword } }
      );
    }

    if (updateData.currentWithdrawalPassword && updateData.newWithdrawalPassword) {
      // Update withdrawal password
      const hashedWithdrawalPassword = await bcrypt.hash(updateData.newWithdrawalPassword, 12);
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { withdrawalPassword: hashedWithdrawalPassword } }
      );
    }

    // Handle other updates
    const allowedFields = ['dailyCheckIn', 'withdrawalInfo', 'accountBalance', 'totalEarnings', 'name', 'phoneNumber'];
    const updateFields: Record<string, unknown> = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field];
      }
    });

    if (Object.keys(updateFields).length > 0) {
      updateFields.updatedAt = new Date();
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateFields }
      );
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
