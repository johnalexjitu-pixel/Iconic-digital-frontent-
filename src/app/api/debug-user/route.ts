import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Debug endpoint for specific user
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

    console.log(`🔍 Debugging user with membershipId: ${membershipId}`);

    // Find user by membershipId
    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ membershipId });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: `User with membershipId ${membershipId} not found`
      });
    }

    console.log(`✅ User found: ${user.name} (${user.email})`);

    // Check customer tasks
    const customerTasksCollection = await getCollection('customerTasks');
    const customerTasks = await customerTasksCollection.find({ 
      customerId: user._id.toString() 
    }).toArray();

    // Check completed tasks
    const claimsCollection = await getCollection('campaignClaims');
    const claims = await claimsCollection.find({ 
      customerId: user._id.toString() 
    }).toArray();

    // Check campaigns
    const campaignsCollection = await getCollection('campaigns');
    const campaigns = await campaignsCollection.find({}).toArray();

    const completedTaskIds = claims.map(claim => claim.taskId);
    const availableCustomerTasks = customerTasks.filter(task => 
      !completedTaskIds.includes(task._id.toString())
    );

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          membershipId: user.membershipId,
          campaignsCompleted: user.campaignsCompleted,
          accountBalance: user.accountBalance
        },
        customerTasks: {
          total: customerTasks.length,
          available: availableCustomerTasks.length,
          completed: completedTaskIds.length
        },
        campaigns: {
          total: campaigns.length,
          sample: campaigns.length > 0 ? {
            title: campaigns[0].title,
            platform: campaigns[0].platform,
            commission: campaigns[0].commission
          } : null
        },
        debug: {
          completedTaskIds,
          shouldShowTask: availableCustomerTasks.length > 0 || campaigns.length > 0,
          nextTaskSource: availableCustomerTasks.length > 0 ? 'customer_task' : 'campaign'
        }
      }
    });

  } catch (error) {
    console.error('Error debugging user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
