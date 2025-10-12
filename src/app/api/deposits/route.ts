import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { HoldAmountCollection } from '@/models/HoldAmount';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const depositsCollection = await getCollection('deposits');
    const usersCollection = await getCollection('users');
    const holdAmountsCollection = await getCollection(HoldAmountCollection);
    
    const { userId, membershipId, amount, amountType, method, transactionId, notes } = await request.json();

    // Validation
    if (!userId || !membershipId || !amount || !amountType) {
      return NextResponse.json({
        success: false,
        error: 'User ID, membership ID, amount, and amount type are required'
      }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be greater than 0'
      }, { status: 400 });
    }

    // Verify user exists
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Check if user has negative balance (lastNegativeTime exists)
    const hasNegativeBalance = user.lastNegativeTime && user.lastNegativeTime !== null;
    const isAfterNegativeBalance = hasNegativeBalance && new Date() > new Date(user.lastNegativeTime);
    
    console.log(`🔍 Deposit creation check: User ${membershipId}`);
    console.log(`📊 Has negative balance: ${hasNegativeBalance}`);
    console.log(`📅 Last negative time: ${user.lastNegativeTime}`);
    console.log(`⏰ Is after negative balance: ${isAfterNegativeBalance}`);

    // Determine initial status
    let initialStatus = 'pending';
    let autoValidationReason = null;
    
    if (isAfterNegativeBalance) {
      // Auto-validate deposits after negative balance
      initialStatus = 'completed';
      autoValidationReason = 'auto_validated_after_negative_balance';
      console.log(`✅ Auto-validating deposit: User had negative balance on ${user.lastNegativeTime}`);
    }

    // Create deposit record
    const newDeposit = {
      _id: new ObjectId(),
      userId,
      membershipId,
      amount,
      amountType,
      date: new Date(),
      status: initialStatus,
      method: method || 'bank_transfer',
      transactionId,
      notes,
      autoValidationReason,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await depositsCollection.insertOne(newDeposit);

    // If auto-validated, process the deposit immediately
    if (initialStatus === 'completed') {
      console.log(`🔄 Processing auto-validated deposit: ${amount} BDT`);
      
      // Get hold amount from database
      const holdAmountRecord = await holdAmountsCollection.findOne({
        userId: user._id.toString(),
        isActive: true
      });
      
      const holdAmount = holdAmountRecord?.holdAmount || user.holdAmount || 0;
      console.log(`🔍 Hold amount found: ${holdAmount}`);
      
      if (holdAmount > 0 && amount >= holdAmount) {
        // Deposit covers the hold amount - unlock user
        const leftoverDeposit = amount - holdAmount;
        
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { 
            $inc: { depositCount: 1 },
            $set: { 
              accountBalance: 0, // Reset account balance to 0 after deposit
              withdrawalBalance: 0, // Clear withdrawal balance
              allowTask: true, // Tasks unlocked
              holdAmount: holdAmount, // Keep hold amount for withdrawal display
              lastNegativeTime: null, // Clear negative time
              updatedAt: new Date(),
              // Add to deposit history
              $push: {
                depositHistory: {
                  amount: amount,
                  date: new Date(),
                  type: 'auto_validated',
                  transactionId: transactionId
                }
              }
            }
          }
        );
        
        console.log(`✅ Auto-processed deposit: Leftover: ${leftoverDeposit}, Hold Amount: ${holdAmount}, Tasks Unlocked`);
      } else if (holdAmount > 0 && amount < holdAmount) {
        // Deposit insufficient - just add to account balance but keep hold
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { 
            $inc: { 
              depositCount: 1,
              accountBalance: amount
            },
            $set: { 
              updatedAt: new Date(),
              // Add to deposit history
              $push: {
                depositHistory: {
                  amount: amount,
                  date: new Date(),
                  type: 'auto_validated',
                  transactionId: transactionId
                }
              }
            }
          }
        );
        
        console.log(`⚠️ Auto-processed deposit insufficient: ${amount} < ${holdAmount}. Hold amount remains.`);
      } else {
        // Normal deposit - no hold amount
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { 
            $inc: { 
              depositCount: 1,
              accountBalance: amount
            },
            $set: { 
              updatedAt: new Date(),
              // Add to deposit history
              $push: {
                depositHistory: {
                  amount: amount,
                  date: new Date(),
                  type: 'auto_validated',
                  transactionId: transactionId
                }
              }
            }
          }
        );
        
        console.log(`✅ Auto-processed normal deposit: ${amount} added to account balance`);
      }
    }

    return NextResponse.json({
      success: true,
      message: initialStatus === 'completed' ? 'Deposit auto-validated and processed successfully' : 'Deposit request created successfully',
      data: {
        _id: newDeposit._id,
        userId: newDeposit.userId,
        membershipId: newDeposit.membershipId,
        amount: newDeposit.amount,
        amountType: newDeposit.amountType,
        date: newDeposit.date,
        status: newDeposit.status,
        method: newDeposit.method,
        transactionId: newDeposit.transactionId,
        notes: newDeposit.notes,
        autoValidationReason: newDeposit.autoValidationReason,
        createdAt: newDeposit.createdAt
      }
    });

  } catch (error) {
    console.error('Deposit creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Deposit creation failed'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const depositsCollection = await getCollection('deposits');
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query = {};
    if (userId) {
      query = { userId };
    }

    const deposits = await depositsCollection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      data: deposits
    });

  } catch (error) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch deposits'
    }, { status: 500 });
  }
}