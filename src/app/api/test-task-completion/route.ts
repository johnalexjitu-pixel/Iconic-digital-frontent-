import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { userId, testType } = await request.json();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    console.log(`🧪 Testing task completion for user: ${user.username} (${user.membershipId})`);
    console.log(`📊 Current user stats:`, {
      accountBalance: user.accountBalance,
      campaignsCompleted: user.campaignsCompleted,
      campaignCommission: user.campaignCommission,
      totalEarnings: user.totalEarnings,
      depositCount: user.depositCount
    });

    // Test 1: Simulate task completion with commission
    const testCommission = 35; // Same as shown in the image
    const newBalance = (user.accountBalance || 0) + testCommission;
    const newTotalEarnings = (user.totalEarnings || 0) + testCommission;
    const newCampaignsCompleted = (user.campaignsCompleted || 0) + 1;
    const newCampaignCommission = (user.campaignCommission || 0) + testCommission;

    console.log(`💰 Simulating task completion with commission: ${testCommission}`);
    console.log(`📈 Expected new values:`, {
      accountBalance: `${user.accountBalance} → ${newBalance}`,
      campaignsCompleted: `${user.campaignsCompleted} → ${newCampaignsCompleted}`,
      campaignCommission: `${user.campaignCommission} → ${newCampaignCommission}`,
      totalEarnings: `${user.totalEarnings} → ${newTotalEarnings}`
    });

    // Update user stats
    const updateResult = await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          accountBalance: newBalance,
          campaignsCompleted: newCampaignsCompleted,
          campaignCommission: newCampaignCommission,
          totalEarnings: newTotalEarnings,
          updatedAt: new Date()
        }
      }
    );

    console.log(`✅ Update result:`, {
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
      acknowledged: updateResult.acknowledged
    });

    // Verify the update
    const updatedUser = await usersCollection.findOne({ _id: user._id });
    
    console.log(`🔍 Verification - Updated user stats:`, {
      accountBalance: updatedUser?.accountBalance,
      campaignsCompleted: updatedUser?.campaignsCompleted,
      campaignCommission: updatedUser?.campaignCommission,
      totalEarnings: updatedUser?.totalEarnings
    });

    // Test 2: Test the actual API endpoints
    const apiTestResults: Record<string, unknown> = {};
    
    if (testType === 'customer-tasks') {
      // Test customer-tasks/complete API
      try {
        const customerTasksCollection = await getCollection('customerTasks');
        const testTask = await customerTasksCollection.findOne({ 
          customerCode: user.membershipId,
          status: 'pending'
        });
        
        if (testTask) {
          console.log(`🎯 Found test task: ${testTask._id}`);
          apiTestResults.customerTaskFound = true;
          apiTestResults.taskId = testTask._id.toString();
        } else {
          console.log(`❌ No pending customer tasks found for user`);
          apiTestResults.customerTaskFound = false;
        }
      } catch (error) {
        console.error(`❌ Error testing customer tasks:`, error);
        apiTestResults.customerTaskError = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    if (testType === 'campaigns') {
      // Test campaigns/complete API
      try {
        const campaignsCollection = await getCollection('campaigns');
        const testCampaign = await campaignsCollection.findOne({ 
          status: 'active'
        });
        
        if (testCampaign) {
          console.log(`🎯 Found test campaign: ${testCampaign._id}`);
          apiTestResults.campaignFound = true;
          apiTestResults.campaignId = testCampaign._id.toString();
        } else {
          console.log(`❌ No active campaigns found`);
          apiTestResults.campaignFound = false;
        }
      } catch (error) {
        console.error(`❌ Error testing campaigns:`, error);
        apiTestResults.campaignError = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Test completed successfully',
      data: {
        userId: userId,
        username: user.username,
        membershipId: user.membershipId,
        beforeUpdate: {
          accountBalance: user.accountBalance,
          campaignsCompleted: user.campaignsCompleted,
          campaignCommission: user.campaignCommission,
          totalEarnings: user.totalEarnings
        },
        afterUpdate: {
          accountBalance: updatedUser?.accountBalance,
          campaignsCompleted: updatedUser?.campaignsCompleted,
          campaignCommission: updatedUser?.campaignCommission,
          totalEarnings: updatedUser?.totalEarnings
        },
        updateResult: {
          matchedCount: updateResult.matchedCount,
          modifiedCount: updateResult.modifiedCount,
          acknowledged: updateResult.acknowledged
        },
        apiTestResults: apiTestResults,
        testCommission: testCommission
      }
    });

  } catch (error) {
    console.error('Test task completion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Check for pending tasks
    const customerTasksCollection = await getCollection('customerTasks');
    const pendingTasks = await customerTasksCollection.find({ 
      customerCode: user.membershipId,
      status: 'pending'
    }).toArray();

    const campaignsCollection = await getCollection('campaigns');
    const activeCampaigns = await campaignsCollection.find({ 
      status: 'active'
    }).toArray();

    return NextResponse.json({
      success: true,
      data: {
        user: {
          username: user.username,
          membershipId: user.membershipId,
          accountBalance: user.accountBalance,
          campaignsCompleted: user.campaignsCompleted,
          campaignCommission: user.campaignCommission,
          totalEarnings: user.totalEarnings,
          depositCount: user.depositCount,
          campaignStatus: user.campaignStatus
        },
        pendingTasks: pendingTasks.length,
        activeCampaigns: activeCampaigns.length,
        canCompleteTasks: user.campaignStatus === 'active'
      }
    });

  } catch (error) {
    console.error('Test get user data error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get user data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
