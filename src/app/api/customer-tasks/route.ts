import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const customerTasksCollection = await getCollection('customerTasks');
    const { searchParams } = new URL(request.url);
    const customerCode = searchParams.get('customerCode');
    const status = searchParams.get('status');

    console.log('🔍 Customer Tasks API - Search params:', { customerCode, status });

    let query = {};
    if (customerCode) {
      // Handle potential formatting issues (remove trailing commas, trim whitespace)
      const cleanCustomerCode = customerCode.trim().replace(/,$/, '');
      console.log('🔍 Cleaned customerCode:', cleanCustomerCode);
      
      // Search for exact match or match with trailing comma
      query = { 
        $or: [
          { customerCode: cleanCustomerCode },
          { customerCode: `${cleanCustomerCode},` },
          { customerCode: customerCode } // Original format as fallback
        ]
      };
    }
    
    // Always filter for pending tasks that are NOT completed
    query = { 
      ...query, 
      status: 'pending',
      completedAt: { $exists: false } // Exclude tasks that have completedAt field
    };
    
    // Override status filter if explicitly provided
    if (status) {
      query = { ...query, status };
    }

    console.log('🔍 Customer Tasks query:', JSON.stringify(query));

    const tasks = await customerTasksCollection.find(query).sort({ taskNumber: 1 }).toArray();
    
    console.log(`🔍 Found ${tasks.length} customer tasks for customerCode: ${customerCode}`);
    if (tasks.length > 0) {
      console.log('🔍 First task details:', {
        taskNumber: tasks[0].taskNumber,
        customerCode: tasks[0].customerCode,
        hasGoldenEgg: tasks[0].hasGoldenEgg,
        status: tasks[0].status
      });
    }

    return NextResponse.json({
      success: true,
      data: tasks
    });

  } catch (error) {
    console.error('Error fetching customer tasks:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch customer tasks'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const customerTasksCollection = await getCollection('customerTasks');
    const campaignsCollection = await getCollection('campaigns');
    const usersCollection = await getCollection('users');
    
    const { customerId, customerCode, campaignId, hasGoldenEgg } = await request.json();

    // Validation
    if (!customerId || !customerCode || !campaignId) {
      return NextResponse.json({
        success: false,
        error: 'Customer ID, customer code, and campaign ID are required'
      }, { status: 400 });
    }

    // Get user details to determine commission limits
    const user = await usersCollection.findOne({ _id: new ObjectId(customerId) });
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Get campaign details
    const campaign = await campaignsCollection.findOne({ _id: new ObjectId(campaignId) });
    if (!campaign) {
      return NextResponse.json({
        success: false,
        error: 'Campaign not found'
      }, { status: 404 });
    }

    // Get next task number for this customer
    const lastTask = await customerTasksCollection.findOne(
      { customerCode },
      { sort: { taskNumber: -1 } }
    );
    const nextTaskNumber = lastTask ? lastTask.taskNumber + 1 : 1;

    // Calculate commission based on user type
    let randomCommission;
    if (user.depositCount === 0) {
      // New user: distribute 1000 BDT across 30 tasks randomly
      // Each task gets between 20-50 BDT to ensure total ~1000 BDT
      randomCommission = Math.floor(Math.random() * 31) + 20; // 20-50 BDT
    } else {
      // Deposited user: use campaign limits
      randomCommission = Math.floor(
        Math.random() * (campaign.maxCommission - campaign.minCommission + 1)
      ) + campaign.minCommission;
    }

    // Create customer task
    const newTask = {
      _id: new ObjectId(),
      customerId,
      customerCode,
      taskNumber: nextTaskNumber,
      campaignId,
      taskCommission: randomCommission,
      taskPrice: campaign.baseAmount,
      estimatedNegativeAmount: 0,
      priceFrom: 0,
      priceTo: 0,
      hasGoldenEgg: hasGoldenEgg || false,
      expiredDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await customerTasksCollection.insertOne(newTask);

    return NextResponse.json({
      success: true,
      message: 'Customer task created successfully',
      data: {
        _id: newTask._id,
        customerId: newTask.customerId,
        customerCode: newTask.customerCode,
        taskNumber: newTask.taskNumber,
        campaignId: newTask.campaignId,
        taskCommission: newTask.taskCommission,
        taskPrice: newTask.taskPrice,
        hasGoldenEgg: newTask.hasGoldenEgg,
        expiredDate: newTask.expiredDate,
        status: newTask.status,
        createdAt: newTask.createdAt
      }
    });

  } catch (error) {
    console.error('Customer task creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Customer task creation failed'
    }, { status: 500 });
  }
}