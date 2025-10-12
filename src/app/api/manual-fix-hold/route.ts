import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Manual fix for hold amount that was cleared after deposit
 * This restores the hold amount that should have been kept
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

    const accountBalance = user.accountBalance || 0;
    const trialBalance = user.trialBalance || 0;
    const holdAmount = user.holdAmount || 0;
    const withdrawalBalance = user.withdrawalBalance || 0;
    const negativeCommission = user.negativeCommission || 0;

    console.log(`🔍 Current user state:`, {
      userId,
      accountBalance,
      trialBalance,
      holdAmount,
      withdrawalBalance,
      negativeCommission
    });

    // Check if hold amount is 0 but should exist
    if (holdAmount === 0 && trialBalance > 0 && accountBalance >= 0) {
      // User deposited and cleared negative, but hold was lost
      // The hold should include previous balance that was held
      // Since user deposited and account is now 0, the hold was: trial balance + the loss
      // We can infer: if total commission is negative, that's the loss amount
      const totalCommission = user.campaignCommission || 0;
      const lossAmount = totalCommission < 0 ? Math.abs(totalCommission) : 0;
      
      // Calculate what hold amount should be: trial balance + loss amount
      const calculatedHold = trialBalance + lossAmount;
      
      console.log(`🔧 Restoring hold amount: trial(${trialBalance}) + loss(${lossAmount}) = ${calculatedHold}`);

      // Update user
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            holdAmount: calculatedHold,
            withdrawalBalance: calculatedHold,
            updatedAt: new Date()
          }
        }
      );

      console.log(`✅ Hold amount restored!`);

      return NextResponse.json({
        success: true,
        message: 'Hold amount restored successfully',
        data: {
          userId,
          previousHoldAmount: holdAmount,
          newHoldAmount: calculatedHold,
          withdrawalBalance: calculatedHold
        }
      });
    } else if (holdAmount > 0) {
      // Hold amount already exists
      return NextResponse.json({
        success: true,
        message: 'Hold amount is already set',
        data: {
          userId,
          holdAmount,
          withdrawalBalance
        }
      });
    } else {
      // Cannot calculate hold amount
      return NextResponse.json({
        success: false,
        message: 'Cannot calculate hold amount - insufficient data',
        data: {
          userId,
          accountBalance,
          trialBalance,
          negativeCommission
        }
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error fixing hold amount:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fix hold amount' 
    }, { status: 500 });
  }
}

