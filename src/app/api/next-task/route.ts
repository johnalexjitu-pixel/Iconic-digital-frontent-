import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ICustomerTask, CustomerTaskCollection } from '@/models/CustomerTask';
import { ICampaignClaim, CampaignClaimCollection } from '@/models/CampaignClaim';
import { ObjectId } from 'mongodb';
import { calculateCommission, getCommissionTier } from '@/lib/commission-calculator';

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

    // If no customer tasks, try to get from campaigns directly
    console.log('📋 No customer tasks found, checking campaigns directly...');
    try {
      // Get user data to calculate commission based on balance
      const usersCollection = await getCollection('users');
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      
      if (!user) {
        return NextResponse.json({
          success: false,
          message: 'User not found',
          completedCount: completedTaskIds.length
        });
      }
      
      // Get campaigns directly from database instead of API call
      const campaignsCollection = await getCollection('campaigns');
      const campaigns = await campaignsCollection.find({}).toArray();
      
      console.log(`📊 Found ${campaigns.length} campaigns in database`);
      
      if (campaigns.length > 0) {
        console.log('📋 Sample campaign from DB:', {
          brand: campaigns[0].brand,
          type: campaigns[0].type,
          commissionAmount: campaigns[0].commissionAmount,
          baseAmount: campaigns[0].baseAmount,
          status: campaigns[0].status
        });
      }
      if (campaigns.length > 0) {
        // Get campaigns that haven't been completed by this user
        const claimsCollection = await getCollection(CampaignClaimCollection);
        const userClaims = await claimsCollection.find({ customerId: userId }).toArray();
        const completedCampaignIds = userClaims.map(claim => claim.campaignId).filter(Boolean);
        
        console.log(`📝 Completed campaign IDs for user: [${completedCampaignIds.join(', ')}]`);
        
        const availableCampaigns = campaigns.filter(campaign => 
          !completedCampaignIds.includes(campaign._id.toString())
        );
        
        console.log(`📋 Available campaigns: ${availableCampaigns.length} out of ${campaigns.length}`);
        
        // If all campaigns completed, start over with first campaign
        const campaignToUse = availableCampaigns.length > 0 ? availableCampaigns[0] : campaigns[0];
        
        console.log(`🎯 Selected campaign: ${campaignToUse.brand} (ID: ${campaignToUse._id})`);
        
        // Calculate commission based on user's account balance using tiered system
        const balanceBasedCommission = calculateCommission(user.accountBalance || 0);
        
        console.log(`📊 Using campaign: ${campaignToUse.brand} (${campaignToUse.type}) - User balance: ${user.accountBalance}, Commission tier: ${getCommissionTier(user.accountBalance)?.description}, Calculated commission: ${balanceBasedCommission}`);
        
        const campaignTask = {
          _id: new ObjectId().toString(),
          customerId: userId,
          taskNumber: completedTaskIds.length + 1, // Next task number based on completed count
          taskPrice: campaignToUse.baseAmount || 0, // Use baseAmount from real campaigns
          taskCommission: balanceBasedCommission, // Use tiered commission based on account balance
          taskTitle: campaignToUse.brand || campaignToUse.title || 'Campaign Task', // Use brand from real campaigns
          taskDescription: campaignToUse.description || 'Complete this campaign task',
          platform: campaignToUse.type || campaignToUse.platform || 'General', // Use type from real campaigns
          status: 'pending',
          isFromCampaign: true,
          campaignId: campaignToUse._id,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        console.log(`✅ Campaign task loaded: ${campaignTask.taskTitle} (Task #${campaignTask.taskNumber}) - Commission: BDT ${campaignTask.taskCommission}`);

        return NextResponse.json({
          success: true,
          data: {
            task: campaignTask,
            totalAvailable: campaigns.length,
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
