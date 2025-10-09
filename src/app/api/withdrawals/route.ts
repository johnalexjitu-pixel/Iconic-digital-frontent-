import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { IWithdrawal, WithdrawalCollection } from '@/models/Withdrawal';
import { IUser, UserCollection } from '@/models/User';
import { ObjectId } from 'mongodb';

// GET - Fetch user's withdrawals
export async function GET(request: NextRequest) {
  try {
    const withdrawalsCollection = await getCollection(WithdrawalCollection);
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching withdrawals for customerId:', customerId);
    const withdrawals = await withdrawalsCollection.find({ customerId }).sort({ createdAt: -1 }).toArray();
    console.log('🔍 Found withdrawals:', withdrawals.length, 'records');

    return NextResponse.json({
      success: true,
      data: withdrawals
    });

  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create withdrawal request
export async function POST(request: NextRequest) {
  try {
    const withdrawalsCollection = await getCollection(WithdrawalCollection);
    const usersCollection = await getCollection(UserCollection);
    
    const { 
      customerId, 
      amount, 
      method, 
      accountDetails 
    } = await request.json();
    
    if (!customerId || !amount || !method) {
      return NextResponse.json(
        { success: false, message: 'Customer ID, amount, and method are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Check user balance
    const user = await usersCollection.findOne({ _id: new ObjectId(customerId) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.accountBalance < amount) {
      return NextResponse.json(
        { success: false, message: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Deduct amount from user balance (hold it)
    console.log('💰 Deducting balance:', { customerId, amount, currentBalance: user.accountBalance });
    const balanceUpdateResult = await usersCollection.updateOne(
      { _id: new ObjectId(customerId) },
      { $inc: { accountBalance: -amount } }
    );
    console.log('💰 Balance update result:', balanceUpdateResult);

    const now = new Date();
    const withdrawal = {
      customerId,
      amount,
      method,
      accountDetails,
      status: 'pending' as const,
      submittedAt: now,
      createdAt: now,
      updatedAt: now
    };

    console.log('📝 Creating withdrawal record:', withdrawal);
    const result = await withdrawalsCollection.insertOne(withdrawal);
    console.log('📝 Withdrawal creation result:', result);

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: { ...withdrawal, _id: result.insertedId }
    });

  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

