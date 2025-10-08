import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const vipLevelsCollection = await getCollection('vipLevels');
    
    // Fetch all VIP levels from database
    const vipLevels = await vipLevelsCollection.find({}).sort({ minAmount: 1 }).toArray();
    
    if (!vipLevels || vipLevels.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No VIP levels found'
      });
    }

    return NextResponse.json({
      success: true,
      data: vipLevels
    });

  } catch (error) {
    console.error('Error fetching VIP levels:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
