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

    console.log(`🔧 Manual trial balance deduction fix for user ${userId}`);
    console.log(`Current account balance: ${user.accountBalance || 0}`);
    console.log(`Current trial balance: ${user.trialBalance || 0}`);
    console.log(`Campaigns completed: ${user.campaignsCompleted || 0}`);
    console.log(`Deposit count: ${user.depositCount || 0}`);

    const currentAccountBalance = user.accountBalance || 0;
    const currentTrialBalance = user.trialBalance || 0;
    const campaignsCompleted = user.campaignsCompleted || 0;
    const depositCount = user.depositCount || 0;

    // Check if user should have had trial balance deducted
    if (campaignsCompleted >= 30 && depositCount === 0 && currentTrialBalance === 0) {
      // User completed 30+ tasks, no deposits, trial balance is 0
      // This means trial balance was reset but account balance wasn't deducted
      const trialBalanceAmount = 10000; // Standard trial balance amount
      const newAccountBalance = currentAccountBalance - trialBalanceAmount;
      
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            accountBalance: newAccountBalance,
            updatedAt: new Date() 
          } 
        }
      );

      console.log(`✅ Trial balance deduction applied: ${trialBalanceAmount} BDT deducted from account balance`);
      console.log(`📊 Account balance: ${currentAccountBalance} → ${newAccountBalance} BDT`);

      return NextResponse.json({
        success: true,
        message: 'Trial balance deduction applied successfully',
        data: {
          userId: userId,
          previousAccountBalance: currentAccountBalance,
          newAccountBalance: newAccountBalance,
          trialBalanceDeducted: trialBalanceAmount,
          campaignsCompleted: campaignsCompleted,
          depositCount: depositCount
        }
      });
    } else if (depositCount > 0) {
      console.log(`⚠️ User has deposits (${depositCount}), no deduction needed`);
      return NextResponse.json({
        success: false,
        message: 'Users with deposits do not need trial balance deduction',
        data: {
          userId: userId,
          depositCount: depositCount,
          accountBalance: currentAccountBalance
        }
      });
    } else if (campaignsCompleted < 30) {
      console.log(`⚠️ User has not completed 30 tasks (${campaignsCompleted}), no deduction needed`);
      return NextResponse.json({
        success: false,
        message: 'User has not completed 30 tasks yet',
        data: {
          userId: userId,
          campaignsCompleted: campaignsCompleted,
          accountBalance: currentAccountBalance
        }
      });
    } else if (currentTrialBalance > 0) {
      console.log(`⚠️ Trial balance still exists (${currentTrialBalance}), deduction not needed yet`);
      return NextResponse.json({
        success: false,
        message: 'Trial balance still exists, deduction will happen when it resets',
        data: {
          userId: userId,
          trialBalance: currentTrialBalance,
          accountBalance: currentAccountBalance
        }
      });
    } else {
      console.log(`ℹ️ No action needed for this user`);
      return NextResponse.json({
        success: true,
        message: 'No action needed',
        data: {
          userId: userId,
          accountBalance: currentAccountBalance,
          trialBalance: currentTrialBalance
        }
      });
    }

  } catch (error) {
    console.error('Trial balance deduction fix error:', error);
    return NextResponse.json({
      success: false,
      error: 'Trial balance deduction fix failed'
    }, { status: 500 });
  }
}
