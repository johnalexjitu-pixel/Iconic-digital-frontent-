import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { HoldAmountCollection } from '@/models/HoldAmount';
import { ObjectId } from 'mongodb';

// POST - Comprehensive deposit verification with automatic task unlock
export async function POST(request: NextRequest) {
  try {
    const { membershipId, amount } = await request.json();

    if (!membershipId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Membership ID is required' 
      }, { status: 400 });
    }

    const depositsCollection = await getCollection('deposits');
    const usersCollection = await getCollection('users');
    const holdAmountsCollection = await getCollection(HoldAmountCollection);
    
    // Get user data first by membershipId
    const user = await usersCollection.findOne({ membershipId: membershipId });
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found with this membership ID' 
      }, { status: 404 });
    }

    console.log(`🔍 VERIFY: Comprehensive verification for membershipId: ${membershipId}`);
    console.log(`👤 User: ${user.username}, Last Negative Time: ${user.lastNegativeTime}`);
    console.log(`🔒 Allow Task: ${user.allowTask}, Account Balance: ${user.accountBalance}`);

    // Build verification query
    const depositQuery: { membershipId: string; status?: string; amount?: number; createdAt?: { $gt: Date } } = {
      status: 'completed',
      membershipId: membershipId
    };

    // If specific amount is provided, also check amount
    if (amount && amount > 0) {
      depositQuery.amount = amount;
    }

    // Get all completed deposits for this user
    const allDeposits = await depositsCollection.find(depositQuery).toArray();
    
    // Filter deposits that are after negative balance time
    const validDeposits = allDeposits.filter(deposit => {
      // Check if deposit is after user's lastNegativeTime
      if (user.lastNegativeTime) {
        const depositTime = new Date(deposit.createdAt);
        const negativeTime = new Date(user.lastNegativeTime);
        const isAfterNegative = depositTime > negativeTime;
        
        console.log(`📅 Deposit ${deposit._id}: ${depositTime.toISOString()} > ${negativeTime.toISOString()} = ${isAfterNegative}`);
        return isAfterNegative;
      }
      return false; // If no negative time, no deposits are valid
    });

    const hasValidDeposits = validDeposits.length > 0;
    const totalValidAmount = validDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);
    const validDepositCount = validDeposits.length;
    
    // Count auto-validated deposits
    const autoValidatedDeposits = validDeposits.filter(deposit => deposit.autoValidationReason === 'auto_validated_after_negative_balance');
    const autoValidatedCount = autoValidatedDeposits.length;
    const autoValidatedAmount = autoValidatedDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);

    console.log(`📊 VERIFY: Comprehensive verification results:`);
    console.log(`   Total deposits found: ${allDeposits.length}`);
    console.log(`   Valid deposits (after negative): ${validDeposits.length}`);
    console.log(`   Total valid amount: ${totalValidAmount}`);
    console.log(`   Auto-validated deposits: ${autoValidatedCount}, Amount: ${autoValidatedAmount}`);

    // Check if user needs task unlock
    let taskUnlocked = false;
    let unlockDetails = null;

    if (hasValidDeposits && user.allowTask === false) {
      console.log(`🔓 User is blocked but has valid deposits - checking for automatic unlock`);
      
      // Get hold amount from database
      const holdAmountRecord = await holdAmountsCollection.findOne({
        userId: user._id.toString(),
        isActive: true
      });
      
      const holdAmount = holdAmountRecord?.holdAmount || user.holdAmount || 0;
      console.log(`🔍 Hold amount found: ${holdAmount}`);
      
      if (holdAmount > 0 && totalValidAmount >= holdAmount) {
        // Deposit covers the hold amount - unlock user
        const leftoverDeposit = totalValidAmount - holdAmount;
        
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { 
              accountBalance: 0, // Reset account balance to 0 after deposit
              withdrawalBalance: 0, // Clear withdrawal balance
              allowTask: true, // Tasks unlocked
              holdAmount: holdAmount, // Keep hold amount for withdrawal display
              lastNegativeTime: null, // Clear negative time
              updatedAt: new Date()
            }
          }
        );
        
        taskUnlocked = true;
        unlockDetails = {
          unlockedAt: new Date(),
          leftoverAmount: leftoverDeposit,
          holdAmountReleased: holdAmount,
          reason: 'valid_deposits_found_after_negative_balance'
        };
        
        console.log(`✅ VERIFY: Automatic unlock successful: Leftover: ${leftoverDeposit}, Hold Amount: ${holdAmount}, Tasks Unlocked`);
      } else if (holdAmount > 0 && totalValidAmount < holdAmount) {
        console.log(`⚠️ VERIFY: Deposits insufficient for unlock: ${totalValidAmount} < ${holdAmount}`);
        unlockDetails = {
          reason: 'insufficient_deposits',
          required: holdAmount,
          available: totalValidAmount,
          shortfall: holdAmount - totalValidAmount
        };
      } else {
        console.log(`ℹ️ VERIFY: No hold amount found, but valid deposits exist`);
        unlockDetails = {
          reason: 'no_hold_amount',
          message: 'Valid deposits found but no hold amount to release'
        };
      }
    } else if (hasValidDeposits && user.allowTask === true) {
      console.log(`✅ VERIFY: User already unlocked and has valid deposits`);
      unlockDetails = {
        reason: 'already_unlocked',
        message: 'User is already unlocked and has valid deposits'
      };
    } else if (!hasValidDeposits && user.allowTask === false) {
      console.log(`❌ VERIFY: No valid deposits found after negative balance`);
      unlockDetails = {
        reason: 'no_valid_deposits',
        message: 'No deposits found after negative balance time'
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        verification: {
          membershipId: membershipId,
          userFound: true,
          hasNegativeBalance: user.lastNegativeTime !== null,
          lastNegativeTime: user.lastNegativeTime,
          currentAllowTask: user.allowTask,
          accountBalance: user.accountBalance
        },
        deposits: {
          totalFound: allDeposits.length,
          validAfterNegative: validDepositCount,
          totalValidAmount: totalValidAmount,
          autoValidatedCount: autoValidatedCount,
          autoValidatedAmount: autoValidatedAmount,
          validDeposits: validDeposits.map(deposit => ({
            _id: deposit._id,
            amount: deposit.amount,
            method: deposit.method,
            status: deposit.status,
            membershipId: deposit.membershipId,
            autoValidationReason: deposit.autoValidationReason,
            createdAt: deposit.createdAt,
            verifiedAfterNegative: true
          }))
        },
        taskUnlock: {
          unlocked: taskUnlocked,
          details: unlockDetails
        }
      }
    });

  } catch (error) {
    console.error('Error verifying deposits:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to verify deposits' 
    }, { status: 500 });
  }
}

// GET - Quick verification check
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const membershipId = searchParams.get('membershipId');

    if (!membershipId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Membership ID is required' 
      }, { status: 400 });
    }

    const usersCollection = await getCollection('users');
    
    // Get user data first by membershipId
    const user = await usersCollection.findOne({ membershipId: membershipId });
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found with this membership ID' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        membershipId: membershipId,
        userFound: true,
        hasNegativeBalance: user.lastNegativeTime !== null,
        lastNegativeTime: user.lastNegativeTime,
        allowTask: user.allowTask,
        accountBalance: user.accountBalance,
        holdAmount: user.holdAmount,
        withdrawalBalance: user.withdrawalBalance
      }
    });

  } catch (error) {
    console.error('Error checking user status:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check user status' 
    }, { status: 500 });
  }
}
