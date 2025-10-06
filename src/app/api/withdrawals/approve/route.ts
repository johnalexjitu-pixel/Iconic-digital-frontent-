import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';

// POST - Approve withdrawal (Admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { withdrawalId, adminId, adminNotes } = await request.json();
    
    if (!withdrawalId) {
      return NextResponse.json(
        { success: false, message: 'Withdrawal ID is required' },
        { status: 400 }
      );
    }

    const withdrawal = await Withdrawal.findById(withdrawalId);
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
    await Withdrawal.findByIdAndUpdate(withdrawalId, {
      status: 'approved',
      processedAt: new Date(),
      processedBy: adminId,
      adminNotes
    });

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

