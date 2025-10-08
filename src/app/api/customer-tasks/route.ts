import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ICustomerTask, CustomerTaskCollection } from '@/models/CustomerTask';
import { ICampaignClaim, CampaignClaimCollection } from '@/models/CampaignClaim';
import { ObjectId } from 'mongodb';

// GET - Fetch user's tasks
export async function GET(request: NextRequest) {
  try {
    const tasksCollection = await getCollection(CustomerTaskCollection);
    const claimsCollection = await getCollection(CampaignClaimCollection);
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get user's tasks - handle both string and ObjectId formats
    let tasks = [];
    try {
      // Try as ObjectId first (convert to string for query)
      const customerIdString = new ObjectId(customerId).toString();
      tasks = await tasksCollection.find({ customerId: customerIdString }).sort({ taskNumber: 1 }).toArray();
    } catch (e) {
      // If ObjectId fails, try as string
      tasks = await tasksCollection.find({ customerId }).sort({ taskNumber: 1 }).toArray();
    }
    
    // Get claimed tasks - handle both string and ObjectId formats
    let claimedTasks = [];
    try {
      // Try as ObjectId first (convert to string for query)
      claimedTasks = await claimsCollection.find({ customerId: new ObjectId(customerId).toString() }).toArray();
    } catch (e) {
      // If ObjectId fails, try as string
      claimedTasks = await claimsCollection.find({ customerId }).toArray();
    }
    const claimedTaskIds = new Set(claimedTasks.map(ct => ct.taskId));
    
    // Mark tasks as claimed
    const tasksWithClaimStatus = tasks.map(task => ({
      ...task,
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
    const tasksCollection = await getCollection(CustomerTaskCollection);
    
    const { customerId, taskCount = 30 } = await request.json();
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Check if tasks already exist for this customer - handle both string and ObjectId formats
    let existingTasks = [];
    try {
      // Try as ObjectId first (convert to string for query)
      existingTasks = await tasksCollection.find({ customerId: new ObjectId(customerId).toString() }).toArray();
    } catch (e) {
      // If ObjectId fails, try as string
      existingTasks = await tasksCollection.find({ customerId }).toArray();
    }
    
    if (existingTasks.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Tasks already exist for this customer' },
        { status: 400 }
      );
    }

    // Create 30 tasks for the customer
    const tasks = [];
    const now = new Date();
    for (let i = 1; i <= taskCount; i++) {
      tasks.push({
        customerId,
        taskNumber: i,
        taskPrice: 0,
        taskCommission: 0,
        taskTitle: `Task ${i}`,
        taskDescription: `Complete task ${i} to earn commission`,
        platform: 'General',
        status: 'pending',
        createdAt: now,
        updatedAt: now
      });
    }

    const result = await tasksCollection.insertMany(tasks);

    return NextResponse.json({
      success: true,
      message: `${taskCount} tasks created successfully`,
      data: Object.values(result.insertedIds)
    });

  } catch (error) {
    console.error('Error creating customer tasks:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

