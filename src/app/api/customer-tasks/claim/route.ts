import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CustomerTask from '@/models/CustomerTask';
import CampaignClaim from '@/models/CampaignClaim';
import User from '@/models/User';

// POST - Claim a task
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { customerId, taskId } = await request.json();
    
    if (!customerId || !taskId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID and Task ID are required' },
        { status: 400 }
      );
    }

    // Check if task exists and belongs to customer
    const task = await CustomerTask.findOne({ _id: taskId, customerId });
    if (!task) {
      return NextResponse.json(
        { success: false, message: 'Task not found or does not belong to customer' },
        { status: 404 }
      );
    }

    // Check if task is already claimed
    const existingClaim = await CampaignClaim.findOne({ customerId, taskId });
    if (existingClaim) {
      return NextResponse.json(
        { success: false, message: 'Task already claimed' },
        { status: 400 }
      );
    }

    // Check if task is active
    if (task.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Task is not active' },
        { status: 400 }
      );
    }

    // Check user balance
    const user = await User.findOne({ _id: customerId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.accountBalance < task.taskPrice) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Insufficient balance',
          redirectTo: '/deposit'
        },
        { status: 400 }
      );
    }

    // Deduct task price from user balance
    await User.findByIdAndUpdate(customerId, {
      $inc: { accountBalance: -task.taskPrice }
    });

    // Create claim record
    const claim = new CampaignClaim({
      customerId,
      taskId,
      taskNumber: task.taskNumber,
      commissionEarned: task.taskCommission,
      status: 'claimed'
    });

    await claim.save();

    // Update task status
    await CustomerTask.findByIdAndUpdate(taskId, {
      status: 'claimed',
      claimedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Task claimed successfully',
      data: claim
    });

  } catch (error) {
    console.error('Error claiming task:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

