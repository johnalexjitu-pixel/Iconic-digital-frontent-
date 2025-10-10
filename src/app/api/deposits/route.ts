import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const depositsCollection = await getCollection('deposits');
    const usersCollection = await getCollection('users');
    
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

    // Create deposit record
    const newDeposit = {
      _id: new ObjectId(),
      userId,
      membershipId,
      amount,
      amountType,
      date: new Date(),
      status: 'pending',
      method: method || 'bank_transfer',
      transactionId,
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await depositsCollection.insertOne(newDeposit);

    return NextResponse.json({
      success: true,
      message: 'Deposit request created successfully',
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