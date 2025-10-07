import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ICustomerTask, CustomerTaskCollection } from '@/models/CustomerTask';
import { ICampaignClaim, CampaignClaimCollection } from '@/models/CampaignClaim';
import { IUser, UserCollection } from '@/models/User';
import { ObjectId } from 'mongodb';

// POST - Claim a task
export async function POST(request: NextRequest) {
  try {
    const tasksCollection = await getCollection(CustomerTaskCollection);
    const claimsCollection = await getCollection(CampaignClaimCollection);
    const usersCollection = await getCollection(UserCollection);
    
    const { customerId, taskId } = await request.json();
    
    if (!customerId || !taskId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID and Task ID are required' },
        { status: 400 }
      );
    }

    // Check if task exists and belongs to customer
    const task = await tasksCollection.findOne({ _id: new ObjectId(taskId), customerId });
    if (!task) {
      return NextResponse.json(
        { success: false, message: 'Task not found or does not belong to customer' },
        { status: 404 }
      );
    }

    // Check if task is already claimed
    const existingClaim = await claimsCollection.findOne({ customerId, taskId });
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
    const user = await usersCollection.findOne({ _id: new ObjectId(customerId) });
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
    await usersCollection.updateOne(
      { _id: new ObjectId(customerId) },
      { $inc: { accountBalance: -task.taskPrice } }
    );

    // Create claim record
    const now = new Date();
    const claim = {
      customerId,
      taskId,
      taskNumber: task.taskNumber,
      commissionEarned: task.taskCommission,
      status: 'claimed' as const,
      claimedAt: now,
      createdAt: now,
      updatedAt: now
    };

    const claimResult = await claimsCollection.insertOne(claim);

    // Update task status
    await tasksCollection.updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: {
          status: 'claimed',
          claimedAt: now,
          updatedAt: now
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Task claimed successfully',
      data: { ...claim, _id: claimResult.insertedId }
    });

  } catch (error) {
    console.error('Error claiming task:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

