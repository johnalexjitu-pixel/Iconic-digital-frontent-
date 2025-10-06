import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Deposit from '@/models/Deposit';

// GET - Fetch user's deposits
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

    const deposits = await Deposit.find({ customerId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: deposits
    });

  } catch (error) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create deposit request
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { customerId, amount, method, transactionId } = await request.json();
    
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

    const deposit = new Deposit({
      customerId,
      amount,
      method,
      transactionId,
      status: 'pending'
    });

    await deposit.save();

    return NextResponse.json({
      success: true,
      message: 'Deposit request submitted successfully',
      data: deposit
    });

  } catch (error) {
    console.error('Error creating deposit:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

