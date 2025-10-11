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

    const withdrawals = await withdrawalsCollection.find({ customerId }).sort({ createdAt: -1 }).toArray();

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
      accountDetails,
      withdrawalPassword
    } = await request.json();
    
    if (!customerId || !amount || !method || !withdrawalPassword) {
      return NextResponse.json(
        { success: false, message: 'Customer ID, amount, method, and withdrawal password are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Check user balance and withdrawal password
    const user = await usersCollection.findOne({ _id: new ObjectId(customerId) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has withdrawal password set
    if (!user.withdrawalPassword) {
      return NextResponse.json(
        { success: false, message: 'Withdrawal password not set. Please set your withdrawal password first.' },
        { status: 400 }
      );
    }

    // Validate withdrawal password
    if (user.withdrawalPassword !== withdrawalPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid withdrawal password' },
        { status: 401 }
      );
    }

    // Check if account balance is negative
    if (user.accountBalance < 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cannot make withdrawal with negative account balance. Please contact support or make a deposit.',
          errorType: 'negative_balance',
          redirectTo: '/contact-support'
        },
        { status: 400 }
      );
    }

    if (user.accountBalance < amount) {
      return NextResponse.json(
        { success: false, message: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Check withdrawal eligibility based on task completion
    const requiredTasks = user.depositCount > 0 ? 90 : 30;
    const currentSet = user.campaignSet.length;
    const tasksInCurrentSet = user.campaignsCompleted - (currentSet * 30);
    
    if (user.depositCount === 0) {
      // New user: must complete 30 tasks and can only withdraw commission (not trial balance)
      if (user.campaignsCompleted < 30) {
        return NextResponse.json(
          { 
            success: false, 
            message: `You must complete ${30 - user.campaignsCompleted} more tasks before making a withdrawal`,
            tasksRemaining: 30 - user.campaignsCompleted
          },
          { status: 400 }
        );
      }
      
      // Check if trying to withdraw more than commission
      // For new users, accountBalance includes trial balance, but only commission is withdrawable
      const maxWithdrawable = user.campaignCommission;
      if (amount > maxWithdrawable) {
        return NextResponse.json(
          { 
            success: false, 
            message: `You can only withdraw your commission (BDT ${maxWithdrawable}). Trial balance cannot be withdrawn.`,
            maxWithdrawable
          },
          { status: 400 }
        );
      }
    } else {
      // Deposited user: must complete 90 tasks (3 sets of 30)
      if (user.campaignsCompleted < 90) {
        return NextResponse.json(
          { 
            success: false, 
            message: `You must complete ${90 - user.campaignsCompleted} more tasks before making a withdrawal`,
            tasksRemaining: 90 - user.campaignsCompleted
          },
          { status: 400 }
        );
      }
    }

    // Deduct amount from user balance (hold it)
    await usersCollection.updateOne(
      { _id: new ObjectId(customerId) },
      { $inc: { accountBalance: -amount } }
    );

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

    const result = await withdrawalsCollection.insertOne(withdrawal);

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

