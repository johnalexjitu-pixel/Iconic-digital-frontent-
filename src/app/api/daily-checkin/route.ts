import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, streak, daysClaimed } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection('users');
    
    // Update user's daily check-in data
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          dailyCheckIn: {
            streak: streak || 0,
            daysClaimed: daysClaimed || [],
            lastCheckIn: new Date()
          }
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Daily check-in updated successfully',
      data: {
        streak: streak || 0,
        daysClaimed: daysClaimed || []
      }
    });

  } catch (error) {
    console.error('Error updating daily check-in:', error);
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
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const dailyCheckIn = user.dailyCheckIn || { streak: 0, daysClaimed: [] };

    return NextResponse.json({
      success: true,
      data: {
        streak: dailyCheckIn.streak || 0,
        daysClaimed: dailyCheckIn.daysClaimed || [],
        lastCheckIn: dailyCheckIn.lastCheckIn || null
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
