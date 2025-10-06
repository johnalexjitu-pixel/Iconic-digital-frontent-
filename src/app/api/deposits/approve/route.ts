import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Deposit from '@/models/Deposit';
import User from '@/models/User';

// POST - Approve deposit (Admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { depositId, adminId, adminNotes } = await request.json();
    
    if (!depositId) {
      return NextResponse.json(
        { success: false, message: 'Deposit ID is required' },
        { status: 400 }
      );
    }

    const deposit = await Deposit.findById(depositId);
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
    await User.findByIdAndUpdate(deposit.customerId, {
      $inc: { accountBalance: deposit.amount }
    });

    // Update deposit status
    await Deposit.findByIdAndUpdate(depositId, {
      status: 'approved',
      processedAt: new Date(),
      processedBy: adminId,
      adminNotes
    });

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

