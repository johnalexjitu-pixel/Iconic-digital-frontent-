import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST - Calculate and save hold amount automatically when negative balance detected
export async function POST(request: NextRequest) {
  try {
    const { userId, membershipId } = await request.json();

    if (!userId && !membershipId) {
      return NextResponse.json({
        success: false,
        error: 'Either userId or membershipId is required'
      }, { status: 400 });
    }

    const usersCollection = await getCollection('users');
    
    // Find user by userId or membershipId
    let user;
    if (userId) {
      user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    } else {
      user = await usersCollection.findOne({ membershipId: membershipId });
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    console.log(`🔍 Checking user for automatic hold amount calculation: ${user.username} (${user.membershipId})`);
    console.log(`📊 Current account balance: ${user.accountBalance}`);
    console.log(`📊 Current trial balance: ${user.trialBalance}`);
    console.log(`📊 Current hold amount: ${user.holdAmount}`);

    // Check if user has negative balance
    const accountBalance = user.accountBalance || 0;
    const trialBalance = user.trialBalance || 0;
    const currentHoldAmount = user.holdAmount || 0;

    // Calculate if user should have hold amount
    let shouldHaveHoldAmount = false;
    let calculatedHoldAmount = 0;
    let reason = '';

    if (accountBalance < 0) {
      // User has negative account balance
      shouldHaveHoldAmount = true;
      calculatedHoldAmount = trialBalance + Math.abs(accountBalance);
      reason = 'negative_account_balance';
      console.log(`⚠️ Negative account balance detected: ${accountBalance}`);
      console.log(`💸 Calculated hold amount: ${trialBalance} + ${Math.abs(accountBalance)} = ${calculatedHoldAmount}`);
    } else if (user.lastNegativeTime && user.lastNegativeTime !== null) {
      // User had negative balance before but now positive
      // Check if hold amount should be maintained
      const timeSinceNegative = new Date().getTime() - new Date(user.lastNegativeTime).getTime();
      const daysSinceNegative = timeSinceNegative / (1000 * 60 * 60 * 24);
      
      if (daysSinceNegative < 30 && currentHoldAmount > 0) {
        // Keep existing hold amount if it's been less than 30 days
        shouldHaveHoldAmount = true;
        calculatedHoldAmount = currentHoldAmount;
        reason = 'maintain_existing_hold';
        console.log(`⏰ Maintaining existing hold amount: ${currentHoldAmount} (${daysSinceNegative.toFixed(1)} days since negative)`);
      }
    }

    // Update hold amount if needed
    if (shouldHaveHoldAmount && calculatedHoldAmount !== currentHoldAmount) {
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            holdAmount: calculatedHoldAmount,
            lastNegativeTime: accountBalance < 0 ? new Date() : user.lastNegativeTime,
            allowTask: accountBalance < 0 ? false : user.allowTask,
            updatedAt: new Date()
          }
        }
      );

      console.log(`✅ Hold amount updated: ${currentHoldAmount} → ${calculatedHoldAmount} (reason: ${reason})`);
      
      return NextResponse.json({
        success: true,
        message: 'Hold amount calculated and updated automatically',
        data: {
          userId: user._id,
          membershipId: user.membershipId,
          username: user.username,
          previousHoldAmount: currentHoldAmount,
          newHoldAmount: calculatedHoldAmount,
          reason: reason,
          accountBalance: accountBalance,
          trialBalance: trialBalance,
          allowTask: accountBalance < 0 ? false : user.allowTask
        }
      });
    } else if (shouldHaveHoldAmount && calculatedHoldAmount === currentHoldAmount) {
      console.log(`ℹ️ Hold amount already correct: ${currentHoldAmount}`);
      
      return NextResponse.json({
        success: true,
        message: 'Hold amount already correct',
        data: {
          userId: user._id,
          membershipId: user.membershipId,
          username: user.username,
          holdAmount: currentHoldAmount,
          reason: reason,
          accountBalance: accountBalance,
          trialBalance: trialBalance
        }
      });
    } else {
      console.log(`ℹ️ No hold amount needed for user: ${user.username}`);
      
      return NextResponse.json({
        success: true,
        message: 'No hold amount needed',
        data: {
          userId: user._id,
          membershipId: user.membershipId,
          username: user.username,
          holdAmount: 0,
          reason: 'no_negative_balance',
          accountBalance: accountBalance,
          trialBalance: trialBalance
        }
      });
    }

  } catch (error) {
    console.error('Error calculating hold amount:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to calculate hold amount'
    }, { status: 500 });
  }
}

// GET - Check hold amount status for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const membershipId = searchParams.get('membershipId');

    if (!userId && !membershipId) {
      return NextResponse.json({
        success: false,
        error: 'Either userId or membershipId is required'
      }, { status: 400 });
    }

    const usersCollection = await getCollection('users');
    
    // Find user by userId or membershipId
    let user;
    if (userId) {
      user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    } else {
      user = await usersCollection.findOne({ membershipId: membershipId });
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    const accountBalance = user.accountBalance || 0;
    const trialBalance = user.trialBalance || 0;
    const holdAmount = user.holdAmount || 0;
    const lastNegativeTime = user.lastNegativeTime;

    // Calculate expected hold amount
    let expectedHoldAmount = 0;
    let shouldHaveHoldAmount = false;
    let reason = '';

    if (accountBalance < 0) {
      expectedHoldAmount = trialBalance + Math.abs(accountBalance);
      shouldHaveHoldAmount = true;
      reason = 'negative_account_balance';
    } else if (lastNegativeTime && lastNegativeTime !== null) {
      const timeSinceNegative = new Date().getTime() - new Date(lastNegativeTime).getTime();
      const daysSinceNegative = timeSinceNegative / (1000 * 60 * 60 * 24);
      
      if (daysSinceNegative < 30 && holdAmount > 0) {
        expectedHoldAmount = holdAmount;
        shouldHaveHoldAmount = true;
        reason = 'maintain_existing_hold';
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user._id,
        membershipId: user.membershipId,
        username: user.username,
        currentHoldAmount: holdAmount,
        expectedHoldAmount: expectedHoldAmount,
        shouldHaveHoldAmount: shouldHaveHoldAmount,
        reason: reason,
        accountBalance: accountBalance,
        trialBalance: trialBalance,
        lastNegativeTime: lastNegativeTime,
        allowTask: user.allowTask,
        needsUpdate: shouldHaveHoldAmount && expectedHoldAmount !== holdAmount
      }
    });

  } catch (error) {
    console.error('Error checking hold amount status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check hold amount status'
    }, { status: 500 });
  }
}
