import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const campaignsCollection = await getCollection('campaigns');

    // Use real campaigns from database - no mockup data

    // Fetch campaigns from database (use real data, no mockup)
    const campaigns = await campaignsCollection.find({}).toArray();
    
    // If no campaigns exist, return empty array
    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No campaigns found'
      });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let filteredCampaigns = campaigns;

    if (status) {
      filteredCampaigns = filteredCampaigns.filter((c: Record<string, unknown>) => 
        c.status && typeof c.status === 'string' && c.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (type) {
      filteredCampaigns = filteredCampaigns.filter((c: Record<string, unknown>) => 
        c.type && typeof c.type === 'string' && c.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Return all campaigns (don't filter by status unless specifically requested)
    // filteredCampaigns = filteredCampaigns.filter(c => c.status === 'active' || c.status === 'Active' || !c.status);

    return NextResponse.json({
      success: true,
      data: filteredCampaigns,
      total: filteredCampaigns.length,
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const campaignsCollection = await getCollection('campaigns');
    const campaignData = await request.json();

    // Generate unique IDs
    const campaignId = `P1IT${Math.floor(1000 + Math.random() * 9000)}`;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const taskCode = code;

    // Create new campaign document
    const newCampaign = {
      _id: new ObjectId(),
      ...campaignData,
      campaignId,
      code,
      taskCode,
      currentParticipants: 0,
      status: 'Active',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await campaignsCollection.insertOne(newCampaign);

    return NextResponse.json({
      success: true,
      message: 'Campaign created successfully',
      data: newCampaign
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
