import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, dayNumber } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection('users');
    const dailyCheckInsCollection = await getCollection('dailyCheckIns');
    
    // Check if user has completed at least 30 tasks
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.campaignsCompleted < 30) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'You need to complete at least 30 tasks before claiming daily check-in bonus',
          errorType: 'insufficient_tasks',
          requiredTasks: 30,
          completedTasks: user.campaignsCompleted
        },
        { status: 400 }
      );
    }
    
    // Check if user already claimed today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const existingCheckIn = await dailyCheckInsCollection.findOne({
      userId: userId,
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd
      }
    });

    if (existingCheckIn) {
      return NextResponse.json(
        { success: false, message: 'You have already claimed your daily check-in bonus today' },
        { status: 400 }
      );
    }

    // Get the bonus amount for this day from dailyCheckins collection
    const bonusData = await dailyCheckInsCollection.findOne({
      dayNumber: dayNumber || 1
    });

    const bonusAmount = bonusData?.amount || 2000; // Default to 2000 if not found

    // Create new daily check-in record
    const checkInRecord = {
      userId: userId,
      dayNumber: dayNumber || 1,
      amount: bonusAmount,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await dailyCheckInsCollection.insertOne(checkInRecord);

    if (result.insertedId) {
      // Update user's account balance
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $inc: { accountBalance: bonusAmount },
          $set: { lastDailyCheckIn: new Date() }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Daily check-in bonus claimed successfully',
        data: {
          checkInId: result.insertedId,
          amount: bonusAmount,
          dayNumber: dayNumber || 1
        }
      });
    }

    return NextResponse.json(
      { success: false, message: 'Failed to record check-in' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error processing daily check-in:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection('users');
    const dailyCheckInsCollection = await getCollection('dailyCheckIns');
    
    // Check if user has completed at least 30 tasks
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const canClaimDailyCheckin = user.campaignsCompleted >= 30;
    
    // Get user's check-in history
    const checkIns = await dailyCheckInsCollection
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .toArray();

    // Check if user can claim today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const todayCheckIn = await dailyCheckInsCollection.findOne({
      userId: userId,
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd
      }
    });

    // Get all available bonus amounts from dailyCheckins collection
    const bonusAmounts = await dailyCheckInsCollection
      .find({}, { projection: { dayNumber: 1, amount: 1 } })
      .sort({ dayNumber: 1 })
      .toArray();

    // Calculate streak
    let streak = 0;
    const sortedCheckIns = checkIns.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    for (let i = 0; i < sortedCheckIns.length; i++) {
      const checkInDate = new Date(sortedCheckIns[i].createdAt);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      const checkInDay = checkInDate.getDate();
      const expectedDay = expectedDate.getDate();
      
      if (checkInDay === expectedDay) {
        streak++;
      } else {
        break;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        canClaimToday: !todayCheckIn && canClaimDailyCheckin,
        canClaimDailyCheckin: canClaimDailyCheckin,
        requiredTasks: 30,
        completedTasks: user.campaignsCompleted,
        streak: streak,
        totalCheckIns: checkIns.length,
        totalAmountEarned: checkIns.reduce((sum, checkIn) => sum + (checkIn.amount || 0), 0),
        bonusAmounts: bonusAmounts,
        history: checkIns.map(checkIn => ({
          id: checkIn._id,
          dayNumber: checkIn.dayNumber,
          amount: checkIn.amount,
          createdAt: checkIn.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching daily check-in data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
