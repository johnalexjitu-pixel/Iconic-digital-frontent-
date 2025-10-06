import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';

// GET - Fetch user's withdrawals
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const withdrawals = await Withdrawal.find({ customerId }).sort({ createdAt: -1 });

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
    await connectDB();
    
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
    const user = await User.findById(customerId);
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
    await User.findByIdAndUpdate(customerId, {
      $inc: { accountBalance: -amount }
    });

    const withdrawal = new Withdrawal({
      customerId,
      amount,
      method,
      accountDetails,
      status: 'pending'
    });

    await withdrawal.save();

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: withdrawal
    });

  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

