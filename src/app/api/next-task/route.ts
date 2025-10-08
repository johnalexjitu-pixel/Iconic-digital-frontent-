import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ICustomerTask, CustomerTaskCollection } from '@/models/CustomerTask';
import { ICampaignClaim, CampaignClaimCollection } from '@/models/CampaignClaim';
import { ObjectId } from 'mongodb';

// GET - Get next available task for user
export async function GET(request: NextRequest) {
  try {
    const tasksCollection = await getCollection(CustomerTaskCollection);
    const claimsCollection = await getCollection(CampaignClaimCollection);
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's completed tasks
    let completedTaskIds = [];
    try {
      const userIdString = new ObjectId(userId).toString();
      const claims = await claimsCollection.find({ customerId: userIdString }).toArray();
      completedTaskIds = claims.map(claim => claim.taskId);
      console.log(`📝 Found ${claims.length} completed tasks for user ${userIdString}`);
    } catch (e) {
      const claims = await claimsCollection.find({ customerId: userId }).toArray();
      completedTaskIds = claims.map(claim => claim.taskId);
      console.log(`📝 Found ${claims.length} completed tasks for user ${userId} (string format)`);
    }

    // Get user's available tasks
    let availableTasks = [];
    try {
      const userIdString = new ObjectId(userId).toString();
      availableTasks = await tasksCollection.find({ 
        customerId: userIdString,
        _id: { $nin: completedTaskIds.map(id => new ObjectId(id)) }
      }).sort({ taskNumber: 1 }).toArray();
      console.log(`📋 Found ${availableTasks.length} available customer tasks for user ${userIdString}`);
    } catch (e) {
      availableTasks = await tasksCollection.find({ 
        customerId: userId,
        _id: { $nin: completedTaskIds.map(id => new ObjectId(id)) }
      }).sort({ taskNumber: 1 }).toArray();
      console.log(`📋 Found ${availableTasks.length} available customer tasks for user ${userId} (string format)`);
    }

    if (availableTasks.length > 0) {
      console.log(`📋 Found ${availableTasks.length} available tasks for user ${userId}`);
      console.log(`📋 Next task: ${availableTasks[0].taskTitle} (Task #${availableTasks[0].taskNumber})`);
      
      return NextResponse.json({
        success: true,
        data: {
          task: availableTasks[0],
          totalAvailable: availableTasks.length,
          completedCount: completedTaskIds.length
        }
      });
    }

    // If no customer tasks, try to get from campaigns
    console.log('📋 No customer tasks found, checking campaigns...');
    try {
      const campaignsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/campaigns`);
      
      if (!campaignsResponse.ok) {
        console.error('❌ Campaigns API failed:', campaignsResponse.status, campaignsResponse.statusText);
        throw new Error(`Campaigns API failed: ${campaignsResponse.status}`);
      }
      
      const campaignsData = await campaignsResponse.json();
      console.log('📊 Campaigns API response:', campaignsData);
      
      if (campaignsData.success && campaignsData.data && campaignsData.data.length > 0) {
        const campaign = campaignsData.data[0];
        console.log(`📊 Using campaign: ${campaign.title} (${campaign.platform})`);
        
        const campaignTask = {
          _id: new ObjectId().toString(),
          customerId: userId,
          taskNumber: completedTaskIds.length + 1, // Next task number based on completed count
          taskPrice: campaign.commission || 0, // Use commission as base amount
          taskCommission: campaign.commission || 0, // Use commission field
          taskTitle: campaign.title || campaign.brand || 'Campaign Task',
          taskDescription: campaign.description || 'Complete this campaign task',
          platform: campaign.platform || campaign.type || 'General',
          status: 'pending',
          isFromCampaign: true,
          campaignId: campaign._id,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        console.log(`✅ Campaign task loaded: ${campaignTask.taskTitle} (Task #${campaignTask.taskNumber})`);

        return NextResponse.json({
          success: true,
          data: {
            task: campaignTask,
            totalAvailable: campaignsData.data.length,
            completedCount: completedTaskIds.length,
            source: 'campaign'
          }
        });
      } else {
        console.log('❌ No campaigns found in campaigns collection');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }

    // No tasks available - return helpful message
    console.log('❌ No tasks available for user:', userId);
    return NextResponse.json({
      success: true,
      data: null,
      message: 'No tasks available. Please contact admin to create tasks.',
      completedCount: completedTaskIds.length,
      debug: {
        customerTasksFound: availableTasks.length,
        campaignsChecked: true,
        userId: userId
      }
    });

  } catch (error) {
    console.error('Error getting next task:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
