import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { IWithdrawal, WithdrawalCollection } from '@/models/Withdrawal';
import { ObjectId } from 'mongodb';

// POST - Approve withdrawal (Admin only)
export async function POST(request: NextRequest) {
  try {
    const withdrawalsCollection = await getCollection(WithdrawalCollection);
    
    const { withdrawalId, adminId, adminNotes } = await request.json();
    
    if (!withdrawalId) {
      return NextResponse.json(
        { success: false, message: 'Withdrawal ID is required' },
        { status: 400 }
      );
    }

    const withdrawal = await withdrawalsCollection.findOne({ _id: new ObjectId(withdrawalId) });
    if (!withdrawal) {
      return NextResponse.json(
        { success: false, message: 'Withdrawal not found' },
        { status: 404 }
      );
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: 'Withdrawal already processed' },
        { status: 400 }
      );
    }

    // Update withdrawal status
    const now = new Date();
    await withdrawalsCollection.updateOne(
      { _id: new ObjectId(withdrawalId) },
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
      message: 'Withdrawal approved successfully',
      data: withdrawal
    });

  } catch (error) {
    console.error('Error approving withdrawal:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

