import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ICustomerTask, CustomerTaskCollection } from '@/models/CustomerTask';
import { ICampaignClaim, CampaignClaimCollection } from '@/models/CampaignClaim';
import { IUser, UserCollection } from '@/models/User';
import { ObjectId } from 'mongodb';

// POST - Complete a claimed task
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

    // Check if claim exists
    const claim = await claimsCollection.findOne({ customerId, taskId });
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
    const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });
    if (!task) {
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }

    // Add commission to user balance
    await usersCollection.updateOne(
      { _id: new ObjectId(customerId) },
      { 
        $inc: { 
          accountBalance: task.taskCommission,
          campaignsCompleted: 1,
          todayCommission: task.taskCommission
        }
      }
    );

    // Update claim status
    const now = new Date();
    await claimsCollection.updateOne(
      { _id: claim._id },
      {
        $set: {
          status: 'completed',
          completedAt: now,
          updatedAt: now
        }
      }
    );

    // Update task status
    await tasksCollection.updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: {
          status: 'completed',
          completedAt: now,
          updatedAt: now
        }
      }
    );

    // Get updated user balance
    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(customerId) });

    return NextResponse.json({
      success: true,
      message: 'Task completed successfully',
      data: {
        commissionEarned: task.taskCommission,
        newBalance: updatedUser?.accountBalance || 0
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

