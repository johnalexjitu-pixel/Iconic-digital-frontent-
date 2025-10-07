import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { IDeposit, DepositCollection } from '@/models/Deposit';
import { IUser, UserCollection } from '@/models/User';
import { ObjectId } from 'mongodb';

// POST - Approve deposit (Admin only)
export async function POST(request: NextRequest) {
  try {
    const depositsCollection = await getCollection(DepositCollection);
    const usersCollection = await getCollection(UserCollection);
    
    const { depositId, adminId, adminNotes } = await request.json();
    
    if (!depositId) {
      return NextResponse.json(
        { success: false, message: 'Deposit ID is required' },
        { status: 400 }
      );
    }

    const deposit = await depositsCollection.findOne({ _id: new ObjectId(depositId) });
    if (!deposit) {
      return NextResponse.json(
        { success: false, message: 'Deposit not found' },
        { status: 404 }
      );
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: 'Deposit already processed' },
        { status: 400 }
      );
    }

    // Add amount to user balance
    await usersCollection.updateOne(
      { _id: new ObjectId(deposit.customerId) },
      { $inc: { accountBalance: deposit.amount } }
    );

    // Update deposit status
    const now = new Date();
    await depositsCollection.updateOne(
      { _id: new ObjectId(depositId) },
      {
        $set: {
          status: 'approved',
          processedAt: now,
          processedBy: adminId,
          adminNotes,
          updatedAt: now
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Deposit approved successfully',
      data: deposit
    });

  } catch (error) {
    console.error('Error approving deposit:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

