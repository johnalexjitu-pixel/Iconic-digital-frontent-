import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CustomerTask from '@/models/CustomerTask';
import CampaignClaim from '@/models/CampaignClaim';

// GET - Fetch user's tasks
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

    // Get user's tasks
    const tasks = await CustomerTask.find({ customerId }).sort({ taskNumber: 1 });
    
    // Get claimed tasks
    const claimedTasks = await CampaignClaim.find({ customerId });
    const claimedTaskIds = new Set(claimedTasks.map(ct => ct.taskId));
    
    // Mark tasks as claimed
    const tasksWithClaimStatus = tasks.map(task => ({
      ...task.toObject(),
      isClaimed: claimedTaskIds.has(task._id.toString())
    }));

    return NextResponse.json({
      success: true,
      data: tasksWithClaimStatus
    });

  } catch (error) {
    console.error('Error fetching customer tasks:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create tasks for a customer (Admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { customerId, taskCount = 30 } = await request.json();
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Check if tasks already exist for this customer
    const existingTasks = await CustomerTask.find({ customerId });
    if (existingTasks.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Tasks already exist for this customer' },
        { status: 400 }
      );
    }

    // Create 30 tasks for the customer
    const tasks = [];
    for (let i = 1; i <= taskCount; i++) {
      tasks.push({
        customerId,
        taskNumber: i,
        taskPrice: 0,
        taskCommission: 0,
        taskTitle: `Task ${i}`,
        taskDescription: `Complete task ${i} to earn commission`,
        platform: 'General',
        status: 'pending'
      });
    }

    const createdTasks = await CustomerTask.insertMany(tasks);

    return NextResponse.json({
      success: true,
      message: `${taskCount} tasks created successfully`,
      data: createdTasks
    });

  } catch (error) {
    console.error('Error creating customer tasks:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

