import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { config } from '@/lib/config';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Get user data from database
    const usersCollection = await getCollection('users');
    
    // Get user username from query parameters or default to testuser
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'testuser';
    
    // Get the specific user by username
    const user = await usersCollection.findOne({ username });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No user found'
      }, { status: 404 });
    }

    // Return user data (without password)
        const userResponse = {
          _id: user._id,
          username: user.username || '',
          number: user.number || '',
          gender: user.gender || 'male',
          level: user.level || 'Bronze',
          membershipId: user.membershipId || '',
          referralCode: user.referralCode || '',
          referStatus: user.referStatus || 'inactive',
          creditScore: user.creditScore || 0,
          accountBalance: user.accountBalance || 0,
          totalEarnings: user.totalEarnings || 0,
          campaignsCompleted: user.campaignsCompleted || 0,
          campaignSet: user.campaignSet || [],
          campaignCommission: user.campaignCommission || 0,
          depositCount: user.depositCount || 0,
          trialBalance: user.trialBalance || 0,
          negativeCommission: user.negativeCommission || 0, // Added for negative commission system
          holdAmount: user.holdAmount || 0, // Added for hold amount
          withdrawalBalance: user.withdrawalBalance || 0, // Added for withdrawal balance
          campaignStatus: user.campaignStatus || 'inactive',
          withdrawStatus: user.withdrawStatus || 'inactive',
          accountStatus: user.accountStatus || 'inactive',
          dailyCheckIn: user.dailyCheckIn || { 
            lastCheckIn: null, 
            streak: 0, 
            daysClaimed: [] 
          },
          isActive: user.isActive || false,
          allowTask: user.allowTask || true,
          withdrawalInfo: user.withdrawalInfo || null,
          withdrawalPassword: user.withdrawalPassword ? '***' : undefined, // Indicate if password exists without exposing it
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
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
      // Update login password - store plain text
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: updateData.newPassword } }
      );
    }

    // Handle initial withdrawal password creation (only if user doesn't have one)
    if (updateData.newWithdrawalPassword && !updateData.currentWithdrawalPassword) {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user?.withdrawalPassword) {
        // Create initial withdrawal password - store plain text
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { withdrawalPassword: updateData.newWithdrawalPassword } }
        );
      } else {
        return NextResponse.json(
          { success: false, error: 'Withdrawal password already exists. Only admin can change it.' },
          { status: 403 }
        );
      }
    }

    // Handle withdrawal password change (admin only - users cannot change once set)
    if (updateData.currentWithdrawalPassword && updateData.newWithdrawalPassword) {
      // Check if this is an admin request (you can add proper admin authentication here)
      const isAdminRequest = updateData.isAdminRequest === true;
      
      if (!isAdminRequest) {
        return NextResponse.json(
          { success: false, error: 'Users cannot change withdrawal password. Contact admin for assistance.' },
          { status: 403 }
        );
      }
      
      // Admin can change withdrawal password - store plain text
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { withdrawalPassword: updateData.newWithdrawalPassword } }
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
