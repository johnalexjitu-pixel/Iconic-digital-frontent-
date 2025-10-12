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

    // If approved, update user's deposit count and handle negative commission
    if (status === 'approved') {
      // Get user data to check for negative commission
      const user = await usersCollection.findOne({ _id: new ObjectId(deposit.userId) });
      
      if (user) {
        let negativeCommission = user.negativeCommission || 0;
        const depositAmount = deposit.amount;
        const accountBalance = user.accountBalance || 0;
        
        // Check if user has negative balance but negativeCommission field is not set (old data)
        if (negativeCommission === 0 && accountBalance < 0) {
          negativeCommission = Math.abs(accountBalance);
          console.log(`📊 Detected old data: negativeCommission calculated from account balance: ${negativeCommission}`);
        }
        
        if (negativeCommission > 0) {
          // ⚙️ NEGATIVE COMMISSION RECOVERY SCENARIO
          console.log(`💰 Deposit approved for user with negative commission`);
          console.log(`Negative Commission: ${negativeCommission}`);
          console.log(`Deposit Amount: ${depositAmount}`);
          
          if (depositAmount >= negativeCommission) {
            // ✅ Valid deposit - covers the loss
            const leftoverAmount = depositAmount - negativeCommission;
            let holdAmount = user.holdAmount || 0;
            
            // If holdAmount is 0, calculate it from trial balance and negative commission
            if (holdAmount === 0) {
              const trialBalance = user.trialBalance || 0;
              const accountBalance = user.accountBalance || 0;
              // If account balance is negative, use trial balance + loss
              if (accountBalance < 0) {
                holdAmount = trialBalance + Math.abs(accountBalance);
              } else {
                holdAmount = accountBalance + trialBalance + negativeCommission;
              }
              console.log(`📊 Calculated hold amount: trialBalance(${trialBalance}) + loss(${negativeCommission}) = ${holdAmount}`);
            }
            
            console.log(`✅ Deposit covers loss. Leftover: ${leftoverAmount}`);
            console.log(`Hold Amount: ${holdAmount}`);
            
            // Update user with cleared negative commission and kept hold amount
            const updateData: {
              $inc: { depositCount: number };
              $set: {
                accountBalance: number;
                negativeCommission: number;
                holdAmount: number;
                withdrawalBalance: number;
                allowTask: boolean;
                updatedAt: Date;
              };
            } = {
              $inc: { depositCount: 1 },
              $set: { 
                accountBalance: leftoverAmount, // Leftover after covering loss (0 if equal)
                negativeCommission: 0, // Clear negative commission
                holdAmount: holdAmount, // KEEP hold amount (don't clear it!)
                withdrawalBalance: holdAmount, // Show hold amount for withdrawal
                allowTask: true, // Unlock tasks
                updatedAt: new Date() 
              }
            };
            
            await usersCollection.updateOne(
              { _id: new ObjectId(deposit.userId) },
              updateData
            );
            
            console.log(`🔓 Account unlocked. User can now complete tasks.`);
            console.log(`Hold Amount Kept: ${holdAmount}`);
            console.log(`Withdrawal Balance: ${holdAmount}`);
            
          } else {
            // ❌ Insufficient deposit
            console.log(`❌ Insufficient deposit. Required: ${negativeCommission}, Got: ${depositAmount}`);
            
            return NextResponse.json({
              success: false,
              error: `Insufficient deposit amount. Minimum required: BDT ${negativeCommission}`,
              minimumRequired: negativeCommission,
              depositedAmount: depositAmount
            }, { status: 400 });
          }
          
        } else {
          // Normal deposit logic - no negative commission
          console.log(`💰 Normal deposit approved`);
          
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
