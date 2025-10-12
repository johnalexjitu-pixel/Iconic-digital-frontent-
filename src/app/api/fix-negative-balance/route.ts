import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Fix users with negative commission but missing withdrawalBalance/holdAmount
 * This is a one-time fix for users who got negative commission before the system was updated
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

    const negativeCommission = user.negativeCommission || 0;
    const holdAmount = user.holdAmount || 0;
    const withdrawalBalance = user.withdrawalBalance || 0;
    const accountBalance = user.accountBalance || 0;
    const trialBalance = user.trialBalance || 0;

    console.log(`🔍 Checking user balance:`, {
      userId,
      accountBalance,
      negativeCommission,
      holdAmount,
      withdrawalBalance,
      trialBalance
    });

    // Check if user has negative commission but missing hold/withdrawal balance
    if (negativeCommission > 0 && (holdAmount === 0 || withdrawalBalance === 0)) {
      console.log(`🔧 Fixing user balance...`);
      
      // Calculate the correct hold amount
      // If account balance is negative, the absolute value is the loss
      // We need to calculate what the previous balance was
      let totalPreviousBalance = 0;
      
      if (accountBalance < 0) {
        // Account balance is negative, so previous balance was from trial balance
        totalPreviousBalance = trialBalance;
      } else {
        // Use account balance + trial balance
        totalPreviousBalance = accountBalance + trialBalance;
      }
      
      // Hold amount = previous balance + loss amount
      const calculatedHoldAmount = totalPreviousBalance + negativeCommission;
      
      console.log(`💰 Calculated Hold Amount:`, {
        totalPreviousBalance,
        negativeCommission,
        calculatedHoldAmount
      });

      // Update user with correct values
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            holdAmount: calculatedHoldAmount,
            withdrawalBalance: calculatedHoldAmount,
            allowTask: false, // Ensure tasks are blocked
            updatedAt: new Date()
          }
        }
      );

      console.log(`✅ User balance fixed!`);

      return NextResponse.json({
        success: true,
        message: 'User balance fixed successfully',
        data: {
          userId,
          previousHoldAmount: holdAmount,
          newHoldAmount: calculatedHoldAmount,
          withdrawalBalance: calculatedHoldAmount
        }
      });
    } else if (negativeCommission > 0) {
      // User already has correct values
      return NextResponse.json({
        success: true,
        message: 'User balance is already correct',
        data: {
          userId,
          holdAmount,
          withdrawalBalance,
          negativeCommission
        }
      });
    } else {
      // User doesn't have negative commission
      return NextResponse.json({
        success: true,
        message: 'User does not have negative commission',
        data: {
          userId,
          accountBalance,
          negativeCommission: 0
        }
      });
    }

  } catch (error) {
    console.error('Error fixing user balance:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fix user balance' 
    }, { status: 500 });
  }
}

