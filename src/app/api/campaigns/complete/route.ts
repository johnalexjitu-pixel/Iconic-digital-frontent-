import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { campaignId, userId, commission } = await request.json();
    
    if (!campaignId || !userId || !commission) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection('users');
    const campaignsCollection = await getCollection('campaigns');
    const transactionsCollection = await getCollection('transactions');

    // Get user data
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get campaign data
    const campaign = await campaignsCollection.findOne({ _id: new ObjectId(campaignId) });
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check if user has reached daily limit (30 campaigns)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = await transactionsCollection.find({
      userId: userId,
      type: 'campaign_earning',
      createdAt: { $gte: today }
    }).toArray();

    if (todayTransactions.length >= 30) {
      return NextResponse.json(
        { success: false, error: 'Daily campaign limit reached (30/30)' },
        { status: 400 }
      );
    }

    // Update user's account balance and stats
    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $inc: {
          accountBalance: commission,
          campaignsCompleted: 1,
          todayCommission: commission,
          dailyCampaignsCompleted: 1
        },
        $set: {
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user balance' },
        { status: 500 }
      );
    }

    // Create transaction record
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const newTransaction = {
      _id: new ObjectId(),
      transactionId,
      userId: userId,
      type: 'campaign_earning',
      amount: commission,
      description: `Campaign ${campaign.title} - ${campaign.platform}`,
      campaignId: campaignId,
      status: 'completed',
      method: 'Campaign',
      reference: `CAM_TXN_${transactionId}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await transactionsCollection.insertOne(newTransaction);

    // Mark campaign as completed for this user (optional - you might want to keep campaigns active for other users)
    // await campaignsCollection.updateOne(
    //   { _id: new ObjectId(campaignId) },
    //   { $set: { status: 'completed', updatedAt: new Date() } }
    // );

    return NextResponse.json({
      success: true,
      message: 'Campaign completed successfully',
      data: {
        commission,
        newBalance: user.accountBalance + commission,
        transactionId: newTransaction.transactionId
      }
    });

  } catch (error) {
    console.error('Error completing campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete campaign' },
      { status: 500 }
    );
  }
}


