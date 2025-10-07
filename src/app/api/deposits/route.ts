import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { IDeposit, DepositCollection } from '@/models/Deposit';

// GET - Fetch user's deposits
export async function GET(request: NextRequest) {
  try {
    const depositsCollection = await getCollection(DepositCollection);
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const deposits = await depositsCollection.find({ customerId }).sort({ createdAt: -1 }).toArray();

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
    const depositsCollection = await getCollection(DepositCollection);
    
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

    const now = new Date();
    const deposit = {
      customerId,
      amount,
      method,
      transactionId,
      status: 'pending' as const,
      submittedAt: now,
      createdAt: now,
      updatedAt: now
    };

    const result = await depositsCollection.insertOne(deposit);

    return NextResponse.json({
      success: true,
      message: 'Deposit request submitted successfully',
      data: { ...deposit, _id: result.insertedId }
    });

  } catch (error) {
    console.error('Error creating deposit:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

