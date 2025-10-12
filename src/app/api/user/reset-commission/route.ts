import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Reset daily commission (today commission) after 24 hours
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

    // Reset only if campaignCommission is positive
    // Don't reset if it's negative (that's part of negative commission system)
    const currentCommission = user.campaignCommission || 0;
    
    if (currentCommission > 0) {
      // Reset positive commission to 0
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            campaignCommission: 0,
            lastCommissionReset: new Date(),
            updatedAt: new Date()
          }
        }
      );

      console.log(`🔄 Daily commission reset for user ${user.username}: ${currentCommission} → 0`);

      return NextResponse.json({
        success: true,
        message: 'Commission reset successfully',
        data: {
          previousCommission: currentCommission,
          newCommission: 0,
          resetAt: new Date()
        }
      });
    } else {
      // Don't reset negative commission
      console.log(`⚠️ Commission is negative or 0, not resetting: ${currentCommission}`);
      
      return NextResponse.json({
        success: true,
        message: 'Commission not reset (negative or zero)',
        data: {
          currentCommission,
          reason: 'Commission is negative or already zero'
        }
      });
    }

  } catch (error) {
    console.error('Error resetting commission:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reset commission' 
    }, { status: 500 });
  }
}

