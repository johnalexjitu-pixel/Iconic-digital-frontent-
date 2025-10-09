import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const usersCollection = await getCollection('users');
    const { id: userId } = await params;

    // Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID'
      }, { status: 400 });
    }

    // Find and update user status
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          status: 'active',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User activated successfully'
    });

  } catch (error) {
    console.error('User activation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to activate user'
    }, { status: 500 });
  }
}
