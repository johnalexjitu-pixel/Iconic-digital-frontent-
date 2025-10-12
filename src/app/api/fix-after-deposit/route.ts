import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Fix user state after deposit when negativeCommission wasn't cleared
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

    console.log('🔧 Fixing user after deposit...');
    console.log('Current state:', {
      accountBalance: user.accountBalance,
      negativeCommission: user.negativeCommission,
      holdAmount: user.holdAmount,
      allowTask: user.allowTask
    });

    // Clear negativeCommission and set allowTask to true
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          negativeCommission: 0,
          allowTask: true,
          updatedAt: new Date()
        }
      }
    );

    console.log('✅ Fixed! negativeCommission cleared and allowTask set to true');

    return NextResponse.json({
      success: true,
      message: 'User state fixed after deposit',
      data: {
        userId,
        negativeCommissionCleared: true,
        allowTaskSet: true
      }
    });

  } catch (error) {
    console.error('Error fixing user state:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fix user state' 
    }, { status: 500 });
  }
}

