import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { HoldAmountCollection } from '@/models/HoldAmount';
import { ObjectId } from 'mongodb';

// GET - Check deposits by query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const membershipId = searchParams.get('membershipId');
    const amount = searchParams.get('amount');

    if (!membershipId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Membership ID is required' 
      }, { status: 400 });
    }

    const depositsCollection = await getCollection('deposits');
    const usersCollection = await getCollection('users');
    
    // Get user data first by membershipId
    const user = await usersCollection.findOne({ membershipId: membershipId });
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found with this membership ID' 
      }, { status: 404 });
    }
    
    // Build comprehensive query for deposits verification
    const depositQuery: { membershipId: string; status?: string; amount?: number; createdAt?: { $gt: Date } } = {
      status: 'completed',
      membershipId: membershipId
    };

    // If specific amount is provided, also check amount
    if (amount && parseFloat(amount) > 0) {
      depositQuery.amount = parseFloat(amount);
    }

    console.log(`🔍 GET: Comprehensive deposit verification for membershipId: ${membershipId}`);
    console.log(`📊 Verification criteria: Status=completed, Amount=${amount || 'any'}, Time=after negative balance`);
    
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

    const hasDeposits = validDeposits.length > 0;
    const totalDepositAmount = validDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);
    const depositCount = validDeposits.length;
    
    // Count auto-validated deposits
    const autoValidatedDeposits = validDeposits.filter(deposit => deposit.autoValidationReason === 'auto_validated_after_negative_balance');
    const autoValidatedCount = autoValidatedDeposits.length;
    const autoValidatedAmount = autoValidatedDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);

    console.log(`📊 GET: Comprehensive verification results:`);
    console.log(`   Total deposits found: ${allDeposits.length}`);
    console.log(`   Valid deposits (after negative): ${validDeposits.length}`);
    console.log(`   Total valid amount: ${totalDepositAmount}`);
    console.log(`   Auto-validated deposits: ${autoValidatedCount}, Amount: ${autoValidatedAmount}`);

    return NextResponse.json({
      success: true,
      data: {
        hasDeposits,
        depositCount,
        totalDepositAmount,
        hasActualDeposits: hasDeposits,
        autoValidatedCount,
        autoValidatedAmount,
        deposits: validDeposits.map(deposit => ({
          _id: deposit._id,
          amount: deposit.amount,
          method: deposit.method,
          status: deposit.status,
          membershipId: deposit.membershipId,
          autoValidationReason: deposit.autoValidationReason,
          createdAt: deposit.createdAt,
          verifiedAfterNegative: true
        }))
      }
    });

  } catch (error) {
    console.error('Error checking deposits (GET):', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check deposits' 
    }, { status: 500 });
  }
}

// POST - Check deposits with automatic unlock functionality
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
    
    // Build comprehensive query for deposits verification
    const depositQuery: { membershipId: string; status?: string; amount?: number; createdAt?: { $gt: Date } } = {
      status: 'completed',
      membershipId: membershipId
    };

    // If specific amount is provided, also check amount
    if (amount && amount > 0) {
      depositQuery.amount = amount;
    }

    console.log(`🔍 POST: Comprehensive deposit verification for membershipId: ${membershipId}`);
    console.log(`📊 Verification criteria: Status=completed, Amount=${amount || 'any'}, Time=after negative balance`);
    
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

    const hasDeposits = validDeposits.length > 0;
    const totalDepositAmount = validDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);
    const depositCount = validDeposits.length;
    
    // Count auto-validated deposits
    const autoValidatedDeposits = validDeposits.filter(deposit => deposit.autoValidationReason === 'auto_validated_after_negative_balance');
    const autoValidatedCount = autoValidatedDeposits.length;
    const autoValidatedAmount = autoValidatedDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);

    console.log(`📊 POST: Comprehensive verification results:`);
    console.log(`   Total deposits found: ${allDeposits.length}`);
    console.log(`   Valid deposits (after negative): ${validDeposits.length}`);
    console.log(`   Total valid amount: ${totalDepositAmount}`);
    console.log(`   Auto-validated deposits: ${autoValidatedCount}, Amount: ${autoValidatedAmount}`);

    // If deposits are found and user is blocked, automatically unlock tasks
    if (hasDeposits && user.allowTask === false) {
      console.log(`🔓 User is blocked but has deposits - checking for automatic unlock`);
      
      // Get hold amount from database
      const holdAmountRecord = await holdAmountsCollection.findOne({
        userId: user._id.toString(),
        isActive: true
      });
      
      const holdAmount = holdAmountRecord?.holdAmount || user.holdAmount || 0;
      console.log(`🔍 Hold amount found: ${holdAmount}`);
      
      if (holdAmount > 0 && totalDepositAmount >= holdAmount) {
        // Deposit covers the hold amount - unlock user
        const leftoverDeposit = totalDepositAmount - holdAmount;
        
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
        
        console.log(`✅ Automatic unlock: Leftover: ${leftoverDeposit}, Hold Amount: ${holdAmount}, Tasks Unlocked`);
        
        return NextResponse.json({
          success: true,
          data: {
            hasDeposits: true,
            depositCount,
            totalDepositAmount,
            hasActualDeposits: true,
            automaticUnlock: true,
            unlockedAt: new Date(),
            leftoverAmount: leftoverDeposit,
            holdAmountReleased: holdAmount,
            autoValidatedCount,
            autoValidatedAmount,
            deposits: validDeposits.map(deposit => ({
              _id: deposit._id,
              amount: deposit.amount,
              method: deposit.method,
              status: deposit.status,
              membershipId: deposit.membershipId,
              autoValidationReason: deposit.autoValidationReason,
              createdAt: deposit.createdAt,
              verifiedAfterNegative: true
            }))
          }
        });
      } else if (holdAmount > 0 && totalDepositAmount < holdAmount) {
        console.log(`⚠️ Deposits insufficient for unlock: ${totalDepositAmount} < ${holdAmount}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        hasDeposits,
        depositCount,
        totalDepositAmount,
        hasActualDeposits: hasDeposits,
        automaticUnlock: false,
        autoValidatedCount,
        autoValidatedAmount,
        deposits: validDeposits.map(deposit => ({
          _id: deposit._id,
          amount: deposit.amount,
          method: deposit.method,
          status: deposit.status,
          membershipId: deposit.membershipId,
          autoValidationReason: deposit.autoValidationReason,
          createdAt: deposit.createdAt,
          verifiedAfterNegative: true
        }))
      }
    });

  } catch (error) {
    console.error('Error checking deposits:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check deposits' 
    }, { status: 500 });
  }
}
