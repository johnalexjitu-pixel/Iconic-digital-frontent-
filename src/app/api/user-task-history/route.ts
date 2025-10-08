import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { UserTaskHistoryCollection } from '@/models/UserTaskHistory';

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

    // Calculate summary statistics
    const totalCommission = completedTasks.reduce((sum, task) => sum + task.commissionEarned, 0);
    const totalTasks = completedTasks.length;
    const tasksBySource = {
      customerTasks: completedTasks.filter(task => task.source === 'customerTasks').length,
      campaigns: completedTasks.filter(task => task.source === 'campaigns').length
    };

    return NextResponse.json({
      success: true,
      data: {
        tasks: completedTasks,
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
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, message: `Internal server error: ${error.message}` },
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
