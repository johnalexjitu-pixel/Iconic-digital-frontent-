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

    // Check if user has completed 30 tasks in current set
    const currentSet = user.campaignSet.length;
    const tasksInCurrentSet = user.campaignsCompleted - (currentSet * 30);

    if (tasksInCurrentSet < 30) {
      return NextResponse.json({
        success: false,
        error: 'You must complete 30 tasks before requesting a reset'
      }, { status: 400 });
    }

    // Check maximum sets allowed
    const maxSets = user.depositCount > 0 ? 3 : 2; // 3 sets for deposited users (90 tasks), 2 sets for new users (60 tasks)
    
    if (user.campaignSet.length >= maxSets) {
      return NextResponse.json({
        success: false,
        error: 'You have reached the maximum number of task sets'
      }, { status: 400 });
    }

    // Add new set number
    const newSetNumber = user.campaignSet.length + 1;
    const updatedCampaignSet = [...user.campaignSet, newSetNumber];

    // Mark old completed tasks as reset to allow re-completion
    const claimsCollection = await getCollection('campaignclaims');
    await claimsCollection.updateMany(
      { customerId: userId },
      { 
        $set: { 
          resetAt: new Date(),
          resetSetNumber: newSetNumber,
          updatedAt: new Date()
        }
      }
    );

    // Update user with new set
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          campaignSet: updatedCampaignSet,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Task set reset successfully',
      data: {
        newSetNumber,
        totalSets: updatedCampaignSet.length,
        tasksCompleted: user.campaignsCompleted,
        canWithdraw: user.depositCount > 0 && updatedCampaignSet.length >= 3
      }
    });

  } catch (error) {
    console.error('Task reset error:', error);
    return NextResponse.json({
      success: false,
      error: 'Task reset failed'
    }, { status: 500 });
  }
}
