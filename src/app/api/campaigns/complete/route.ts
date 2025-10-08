import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ICampaignClaim, CampaignClaimCollection } from '@/models/CampaignClaim';
import { ObjectId } from 'mongodb';

// GET - Fetch completed campaigns for a customer
export async function GET(request: NextRequest) {
  try {
    const claimsCollection = await getCollection(CampaignClaimCollection);
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get completed campaigns - handle both string and ObjectId formats
    let claims = [];
    try {
      // Try as ObjectId first (convert to string for query)
      const customerIdString = new ObjectId(customerId).toString();
      claims = await claimsCollection.find({ customerId: customerIdString }).toArray();
    } catch (e) {
      // If ObjectId fails, try as string
      claims = await claimsCollection.find({ customerId }).toArray();
    }

    return NextResponse.json({
      success: true,
      data: claims
    });

  } catch (error) {
    console.error('Error fetching completed campaigns:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}