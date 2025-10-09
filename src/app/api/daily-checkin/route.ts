import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { userId } = decoded;
    const body = await request.json();
    const { streak, daysClaimed } = body;

    const usersCollection = await getCollection('users');
    
    // Update user's daily check-in data
    const result = await usersCollection.updateOne(
      { _id: userId },
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
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { userId } = decoded;

    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ _id: userId });

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
