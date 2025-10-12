import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const usersCollection = await getCollection('users');
    
    const { userId } = await request.json();

    // Validation
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Get user details
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    console.log(`🔧 Manual trial balance reset for user ${userId}`);
    console.log(`Current trial balance: ${user.trialBalance || 0}`);
    console.log(`Current campaigns completed: ${user.campaignsCompleted || 0}`);

    // Reset trial balance to 0
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          trialBalance: 0,
          updatedAt: new Date() 
        } 
      }
    );

    console.log(`✅ Trial balance reset to 0 for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Trial balance reset successfully',
      data: {
        userId: userId,
        previousTrialBalance: user.trialBalance || 0,
        newTrialBalance: 0,
        campaignsCompleted: user.campaignsCompleted || 0
      }
    });

  } catch (error) {
    console.error('Trial balance reset error:', error);
    return NextResponse.json({
      success: false,
      error: 'Trial balance reset failed'
    }, { status: 500 });
  }
}
