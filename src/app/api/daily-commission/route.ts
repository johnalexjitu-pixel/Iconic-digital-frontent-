import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { DailyCommissionCollection } from '@/models/DailyCommission';
import { ObjectId } from 'mongodb';

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

    const dailyCommissionsCollection = await getCollection(DailyCommissionCollection);
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Find all daily commissions for the user for today
    const todayCommissions = await dailyCommissionsCollection.find({
      userId: userId,
      date: today
    }).toArray();
    
    // Calculate total commission for today
    const totalTodayCommission = todayCommissions.reduce((sum, commission) => sum + commission.amount, 0);
    
    console.log(`📊 Today's commission for user ${userId}: ${totalTodayCommission} BDT (${todayCommissions.length} entries)`);
    
    return NextResponse.json({
      success: true,
      data: {
        userId: userId,
        date: today,
        totalCommission: totalTodayCommission,
        commissionCount: todayCommissions.length,
        commissions: todayCommissions
      }
    });

  } catch (error) {
    console.error('Error fetching today\'s commission:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
