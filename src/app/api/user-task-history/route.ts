import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { UserTaskHistoryCollection } from '@/models/UserTaskHistory';
import { CampaignCollection } from '@/models/Campaign';

// GET - Fetch user's completed task history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const membershipId = searchParams.get('membershipId');
    
    if (!membershipId) {
      return NextResponse.json(
        { success: false, message: 'Membership ID is required' },
        { status: 400 }
      );
    }

    console.log(`📚 Fetching task history for membershipId: ${membershipId}`);

    const historyCollection = await getCollection(UserTaskHistoryCollection);
    
    // Get user's completed tasks, sorted by completion date (newest first)
    const completedTasks = await historyCollection
      .find({ membershipId })
      .sort({ completedAt: -1 })
      .toArray();

    console.log(`📊 Found ${completedTasks.length} completed tasks for user ${membershipId}`);

    // Fetch campaign data for campaign tasks to get logos and brand names
    const campaignsCollection = await getCollection(CampaignCollection);
    const campaignTasks = completedTasks.filter(task => task.source === 'campaigns');
    
    // Get unique campaign IDs
    const campaignIds = [...new Set(campaignTasks.map(task => task.campaignId).filter(Boolean))];
    
    // Fetch campaign details
    const campaigns = await campaignsCollection.find({ 
      campaignId: { $in: campaignIds } 
    }).toArray();
    
    // Create campaign lookup map
    const campaignMap = new Map();
    campaigns.forEach(campaign => {
      campaignMap.set(campaign.campaignId, campaign);
    });

    // Enhance tasks with campaign data
    const enhancedTasks = completedTasks.map(task => {
      if (task.source === 'campaigns' && task.campaignId) {
        const campaign = campaignMap.get(task.campaignId);
        if (campaign) {
          return {
            ...task,
            logo: campaign.logo,
            brand: campaign.brand
          };
        }
      }
      return task;
    });

    // Calculate summary statistics
    const totalCommission = enhancedTasks.reduce((sum, task) => sum + task.commissionEarned, 0);
    const totalTasks = enhancedTasks.length;
    const tasksBySource = {
      customerTasks: enhancedTasks.filter(task => task.source === 'customerTasks').length,
      campaigns: enhancedTasks.filter(task => task.source === 'campaigns').length
    };

    return NextResponse.json({
      success: true,
      data: {
        tasks: enhancedTasks,
        summary: {
          totalTasks,
          totalCommission,
          tasksBySource,
          membershipId
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user task history:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', errorMessage);
    console.error('Error stack:', errorStack);
    return NextResponse.json(
      { success: false, message: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// POST - Add a completed task to history (for manual entries if needed)
export async function POST(request: NextRequest) {
  try {
    const historyCollection = await getCollection(UserTaskHistoryCollection);
    const taskData = await request.json();

    // Validate required fields
    const requiredFields = ['membershipId', 'taskId', 'taskNumber', 'taskTitle', 'platform', 'commissionEarned'];
    for (const field of requiredFields) {
      if (!taskData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const historyRecord = {
      ...taskData,
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await historyCollection.insertOne(historyRecord);

    return NextResponse.json({
      success: true,
      message: 'Task history record created successfully',
      data: {
        historyId: result.insertedId,
        taskNumber: taskData.taskNumber,
        commissionEarned: taskData.commissionEarned
      }
    });

  } catch (error) {
    console.error('Error creating task history record:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
