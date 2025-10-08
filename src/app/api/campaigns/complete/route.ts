import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ICampaignClaim, CampaignClaimCollection } from '@/models/CampaignClaim';
import { ObjectId } from 'mongodb';

// GET - Fetch completed campaigns for a customer
export async function GET(request: NextRequest) {
  try {
    const claimsCollection = await getCollection(CampaignClaimCollection);
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get completed campaigns - handle both string and ObjectId formats
    let claims = [];
    try {
      // Try as ObjectId first (convert to string for query)
      const customerIdString = new ObjectId(customerId).toString();
      claims = await claimsCollection.find({ customerId: customerIdString }).toArray();
    } catch (e) {
      // If ObjectId fails, try as string
      claims = await claimsCollection.find({ customerId }).toArray();
    }

    return NextResponse.json({
      success: true,
      data: claims
    });

  } catch (error) {
    console.error('Error fetching completed campaigns:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Complete a task and save progress
export async function POST(request: NextRequest) {
  try {
    const claimsCollection = await getCollection(CampaignClaimCollection);
    const usersCollection = await getCollection('users');
    
    const { userId, taskId, taskTitle, platform, commission, amount, taskType, campaignId } = await request.json();
    
    if (!userId || !taskId) {
      return NextResponse.json(
        { success: false, message: 'User ID and Task ID are required' },
        { status: 400 }
      );
    }

    // Check if task is already completed
    const existingClaim = await claimsCollection.findOne({
      customerId: userId,
      taskId: taskId
    });

    if (existingClaim) {
      return NextResponse.json(
        { success: false, message: 'Task already completed' },
        { status: 400 }
      );
    }

    console.log(`🎯 Completing task: ${taskTitle} (ID: ${taskId}) for user: ${userId}`);

    // Create campaign claim
    const claim: ICampaignClaim = {
      customerId: userId,
      taskId: taskId,
      claimedAt: new Date(),
      status: 'completed',
      campaignId: campaignId, // Store the original campaign ID
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const claimResult = await claimsCollection.insertOne(claim);
    console.log(`✅ Task completion saved to database with ID: ${claimResult.insertedId}`);

    // Update user balance and campaign count
    if (commission > 0) {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (user) {
        const newBalance = (user.accountBalance || 0) + commission;
        const newTotalEarnings = (user.totalEarnings || 0) + commission;
        const newCampaignsCompleted = (user.campaignsCompleted || 0) + 1;

        console.log(`💰 Updating user balance: ${user.accountBalance} → ${newBalance} (+${commission})`);
        console.log(`📊 Updating campaigns completed: ${user.campaignsCompleted} → ${newCampaignsCompleted}`);

        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              accountBalance: newBalance,
              totalEarnings: newTotalEarnings,
              campaignsCompleted: newCampaignsCompleted,
              updatedAt: new Date()
            }
          }
        );
        
        console.log(`✅ User stats updated successfully`);
      } else {
        console.log(`❌ User not found: ${userId}`);
      }
    } else {
      console.log(`ℹ️ No commission to add (commission: ${commission})`);
    }

    return NextResponse.json({
      success: true,
      message: 'Task completed successfully',
      data: {
        claimId: claimResult.insertedId,
        commissionAdded: commission || 0
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