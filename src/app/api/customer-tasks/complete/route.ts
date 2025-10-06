import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CustomerTask from '@/models/CustomerTask';
import CampaignClaim from '@/models/CampaignClaim';
import User from '@/models/User';

// POST - Complete a claimed task
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

    // Check if claim exists
    const claim = await CampaignClaim.findOne({ customerId, taskId });
    if (!claim) {
      return NextResponse.json(
        { success: false, message: 'Task not claimed' },
        { status: 404 }
      );
    }

    // Check if already completed
    if (claim.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'Task already completed' },
        { status: 400 }
      );
    }

    // Get task details
    const task = await CustomerTask.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }

    // Add commission to user balance
    await User.findByIdAndUpdate(customerId, {
      $inc: { 
        accountBalance: task.taskCommission,
        campaignsCompleted: 1,
        todayCommission: task.taskCommission
      }
    });

    // Update claim status
    await CampaignClaim.findByIdAndUpdate(claim._id, {
      status: 'completed',
      completedAt: new Date()
    });

    // Update task status
    await CustomerTask.findByIdAndUpdate(taskId, {
      status: 'completed',
      completedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Task completed successfully',
      data: {
        commissionEarned: task.taskCommission,
        newBalance: (await User.findById(customerId))?.accountBalance || 0
      }
    });

  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

