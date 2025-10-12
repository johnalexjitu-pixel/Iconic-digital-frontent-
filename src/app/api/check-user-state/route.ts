import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Check user's current database state
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }

    const usersCollection = await getCollection('users');
    
    // Get user data
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Return relevant fields
    return NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        membershipId: user.membershipId,
        accountBalance: user.accountBalance,
        trialBalance: user.trialBalance,
        campaignCommission: user.campaignCommission,
        negativeCommission: user.negativeCommission,
        holdAmount: user.holdAmount,
        withdrawalBalance: user.withdrawalBalance,
        allowTask: user.allowTask,
        depositCount: user.depositCount,
        campaignsCompleted: user.campaignsCompleted
      }
    });

  } catch (error) {
    console.error('Error checking user state:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check user state' 
    }, { status: 500 });
  }
}

