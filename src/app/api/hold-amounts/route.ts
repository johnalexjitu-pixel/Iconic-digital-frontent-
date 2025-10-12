import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { HoldAmountCollection } from '@/models/HoldAmount';
import { ObjectId } from 'mongodb';

// GET - Fetch hold amounts for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const membershipId = searchParams.get('membershipId');
    
    if (!userId && !membershipId) {
      return NextResponse.json(
        { success: false, message: 'User ID or Membership ID is required' },
        { status: 400 }
      );
    }

    const holdAmountsCollection = await getCollection(HoldAmountCollection);
    
    let query = {};
    if (userId) {
      query = { userId };
    } else if (membershipId) {
      query = { membershipId };
    }

    const holdAmounts = await holdAmountsCollection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      data: holdAmounts
    });

  } catch (error) {
    console.error('Error fetching hold amounts:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create or update hold amount
export async function POST(request: NextRequest) {
  try {
    const holdAmountsCollection = await getCollection(HoldAmountCollection);
    const { userId, membershipId, holdAmount, reason } = await request.json();

    if (!userId || !membershipId || !holdAmount || !reason) {
      return NextResponse.json(
        { success: false, message: 'User ID, Membership ID, hold amount, and reason are required' },
        { status: 400 }
      );
    }

    // Check if user already has an active hold amount
    const existingHold = await holdAmountsCollection.findOne({
      userId,
      isActive: true
    });

    if (existingHold) {
      // Update existing hold amount
      await holdAmountsCollection.updateOne(
        { _id: existingHold._id },
        {
          $set: {
            holdAmount,
            reason,
            updatedAt: new Date()
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Hold amount updated successfully',
        data: { _id: existingHold._id, holdAmount, reason }
      });
    } else {
      // Create new hold amount
      const newHoldAmount = {
        _id: new ObjectId(),
        userId,
        membershipId,
        holdAmount,
        reason,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      await holdAmountsCollection.insertOne(newHoldAmount);

      return NextResponse.json({
        success: true,
        message: 'Hold amount created successfully',
        data: {
          _id: newHoldAmount._id,
          holdAmount,
          reason
        }
      });
    }

  } catch (error) {
    console.error('Error managing hold amount:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Clear hold amount
export async function DELETE(request: NextRequest) {
  try {
    const holdAmountsCollection = await getCollection(HoldAmountCollection);
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Mark hold amount as cleared
    const result = await holdAmountsCollection.updateOne(
      { userId, isActive: true },
      {
        $set: {
          isActive: false,
          clearedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'No active hold amount found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Hold amount cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing hold amount:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
