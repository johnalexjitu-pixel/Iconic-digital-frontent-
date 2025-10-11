import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const depositsCollection = await getCollection('deposits');
    const usersCollection = await getCollection('users');
    
    const { depositId, status, adminNotes } = await request.json();

    // Validation
    if (!depositId || !status) {
      return NextResponse.json({
        success: false,
        error: 'Deposit ID and status are required'
      }, { status: 400 });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Status must be either approved or rejected'
      }, { status: 400 });
    }

    // Find the deposit
    const deposit = await depositsCollection.findOne({ _id: new ObjectId(depositId) });
    if (!deposit) {
      return NextResponse.json({
        success: false,
        error: 'Deposit not found'
      }, { status: 404 });
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json({
        success: false,
        error: 'Deposit has already been processed'
      }, { status: 400 });
    }

    // Update deposit status
    await depositsCollection.updateOne(
      { _id: deposit._id },
      { 
        $set: { 
          status,
          updatedAt: new Date(),
          adminNotes
        }
      }
    );

    // If approved, update user's deposit count and account balance
    if (status === 'approved') {
      // Get user data to check for negative commission
      const user = await usersCollection.findOne({ _id: new ObjectId(deposit.userId) });
      
      if (user) {
        // Check if user has negative commission and this is their first deposit
        if (user.campaignCommission < 0 && user.depositCount === 0) {
          // Clear negative commission balance - keep hold balance for withdrawal
          const holdBalance = Math.abs(user.campaignCommission);
          await usersCollection.updateOne(
            { _id: new ObjectId(deposit.userId) },
            { 
              $inc: { depositCount: 1 },
              $set: { 
                accountBalance: 0, // Set to 0 after deposit clears negative balance
                campaignCommission: holdBalance, // Set to hold balance amount for withdrawal
                updatedAt: new Date() 
              }
            }
          );
        } else {
          // Normal deposit logic - add deposit amount to account balance
          await usersCollection.updateOne(
            { _id: new ObjectId(deposit.userId) },
            { 
              $inc: { 
                depositCount: 1,
                accountBalance: deposit.amount
              },
              $set: { updatedAt: new Date() }
            }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Deposit ${status} successfully`,
      data: {
        depositId: deposit._id,
        status,
        adminNotes
      }
    });

  } catch (error) {
    console.error('Deposit approval error:', error);
    return NextResponse.json({
      success: false,
      error: 'Deposit approval failed'
    }, { status: 500 });
  }
}