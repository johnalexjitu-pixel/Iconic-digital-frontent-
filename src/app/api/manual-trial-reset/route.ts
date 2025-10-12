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
    console.log(`Deposit count: ${user.depositCount || 0}`);

    const currentTrialBalance = user.trialBalance || 0;
    const currentAccountBalance = user.accountBalance || 0;

    // Only reset trial balance for users with NO deposits
    if (user.depositCount === 0) {
      // For non-deposited users, always deduct 10,000 BDT (trial balance amount) from account balance
      // regardless of current trial balance value
      const trialBalanceAmount = 10000; // Standard trial balance amount
      const newAccountBalance = currentAccountBalance - trialBalanceAmount;
      
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            trialBalance: 0,
            accountBalance: newAccountBalance,
            updatedAt: new Date() 
          } 
        }
      );

      console.log(`✅ Trial balance reset: ${trialBalanceAmount} BDT deducted from account balance`);
      console.log(`📊 Account balance: ${currentAccountBalance} → ${newAccountBalance} BDT`);
    } else if (user.depositCount > 0) {
      console.log(`⚠️ User has deposits (${user.depositCount}), skipping trial balance reset`);
      return NextResponse.json({
        success: false,
        message: 'Users with deposits cannot reset trial balance',
        data: {
          userId: userId,
          depositCount: user.depositCount,
          trialBalance: currentTrialBalance
        }
      });
    } else {
      console.log(`ℹ️ Trial balance already 0, no action needed`);
      return NextResponse.json({
        success: true,
        message: 'Trial balance is already 0',
        data: {
          userId: userId,
          trialBalance: 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Trial balance reset successfully',
      data: {
        userId: userId,
        previousTrialBalance: currentTrialBalance,
        newTrialBalance: 0,
        previousAccountBalance: currentAccountBalance,
        newAccountBalance: currentAccountBalance - 10000,
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
