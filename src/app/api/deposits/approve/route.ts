import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { HoldAmountCollection } from '@/models/HoldAmount';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const depositsCollection = await getCollection('deposits');
    const usersCollection = await getCollection('users');
    const holdAmountsCollection = await getCollection(HoldAmountCollection);
    
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

    // If approved, implement new hold amount logic
    if (status === 'approved') {
      // Get user data
      const user = await usersCollection.findOne({ _id: new ObjectId(deposit.userId) });
      
      if (user) {
        console.log(`💰 Processing deposit approval for user: ${user.membershipId}, Amount: ${deposit.amount}`);
        
        // Get hold amount from database
        const holdAmountRecord = await holdAmountsCollection.findOne({
          userId: user._id.toString(),
          isActive: true
        });
        
        const holdAmount = holdAmountRecord?.holdAmount || user.holdAmount || 0;
        console.log(`🔍 Hold amount found: ${holdAmount}`);
        
        if (holdAmount > 0) {
          // 3️⃣ After Deposit (Deposit ≥ Negative Balance)
          console.log('🔄 Processing deposit with hold amount');
          
          if (deposit.amount >= holdAmount) {
            // Deposit covers the hold amount
            const leftoverDeposit = deposit.amount - holdAmount;
            
            await usersCollection.updateOne(
              { _id: new ObjectId(deposit.userId) },
              { 
                $inc: { depositCount: 1 },
                $set: { 
                  accountBalance: 0, // Reset account balance to 0 after deposit
                  withdrawalBalance: holdAmount, // Hold amount saved as withdrawal amount
                  allowTask: true, // Tasks unlocked
                  holdAmount: holdAmount, // Keep hold amount in users collection for withdrawal display
                  lastNegativeTime: null, // Clear negative time
                  updatedAt: new Date(),
                  // Add to deposit history
                  $push: {
                    depositHistory: {
                      amount: deposit.amount,
                      date: new Date(),
                      type: 'manual',
                      transactionId: deposit.transactionId
                    }
                  }
                }
              }
            );
            
            console.log(`✅ Deposit approved: Leftover: ${leftoverDeposit}, Hold Amount: ${holdAmount}, Tasks Unlocked`);
          } else {
            // Deposit insufficient - just add to account balance but keep hold
            await usersCollection.updateOne(
              { _id: new ObjectId(deposit.userId) },
              { 
                $inc: { 
                  depositCount: 1,
                  accountBalance: deposit.amount
                },
                $set: { 
                  updatedAt: new Date(),
                  // Add to deposit history
                  $push: {
                    depositHistory: {
                      amount: deposit.amount,
                      date: new Date(),
                      type: 'manual',
                      transactionId: deposit.transactionId
                    }
                  }
                }
              }
            );
            
            console.log(`⚠️ Deposit insufficient: ${deposit.amount} < ${holdAmount}. Hold amount remains.`);
          }
        } else {
          // Normal deposit - no hold amount
          await usersCollection.updateOne(
            { _id: new ObjectId(deposit.userId) },
            { 
              $inc: { 
                depositCount: 1,
                accountBalance: deposit.amount
              },
              $set: { 
                updatedAt: new Date(),
                // Add to deposit history
                $push: {
                  depositHistory: {
                    amount: deposit.amount,
                    date: new Date(),
                    type: 'manual',
                    transactionId: deposit.transactionId
                  }
                }
              }
            }
          );
          
          console.log(`✅ Normal deposit approved: ${deposit.amount} added to account balance`);
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