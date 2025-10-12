import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }

    const depositsCollection = await getCollection('deposits');
    const usersCollection = await getCollection('users');
    
    // Check if user has any completed deposits
    // Search for both ObjectId and string formats since deposits collection has mixed data types
    const deposits = await depositsCollection.find({
      $and: [
        { status: 'completed' },
        {
          $or: [
            { userId: userId }, // String format
            { userId: new ObjectId(userId) }, // ObjectId format
            { userId: ObjectId.isValid(userId) ? new ObjectId(userId) : userId } // Safe ObjectId conversion
          ]
        }
      ]
    }).toArray();

    const hasDeposits = deposits.length > 0;
    const totalDepositAmount = deposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);
    const depositCount = deposits.length;

    // Get user data to check negative commission
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    let requiresDeposit = false;
    let minimumDepositRequired = 0;
    
    if (user && (user.negativeCommission || 0) > 0) {
      // User has negative commission - requires deposit
      requiresDeposit = true;
      minimumDepositRequired = user.negativeCommission;
    }

    return NextResponse.json({
      success: true,
      data: {
        hasDeposits,
        depositCount,
        totalDepositAmount,
        requiresDeposit,
        minimumDepositRequired,
        deposits: deposits.map(deposit => ({
          _id: deposit._id,
          amount: deposit.amount,
          method: deposit.method,
          status: deposit.status,
          createdAt: deposit.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Error checking deposits:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check deposits' 
    }, { status: 500 });
  }
}
