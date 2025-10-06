import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all campaigns for admin
export async function GET(request: NextRequest) {
  try {
    const campaignsCollection = await getCollection('campaigns');
    const campaigns = await campaignsCollection.find({}).toArray();
    
    return NextResponse.json({
      success: true,
      data: campaigns,
      total: campaigns.length
    });
  } catch (error) {
    console.error('Error fetching campaigns for admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST - Create new campaign from admin dashboard
export async function POST(request: NextRequest) {
  try {
    const campaignsCollection = await getCollection('campaigns');
    const campaignData = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'platform', 'commission', 'requirements', 'duration'];
    for (const field of requiredFields) {
      if (!campaignData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new campaign document
    const newCampaign = {
      _id: new ObjectId(),
      title: campaignData.title,
      description: campaignData.description,
      platform: campaignData.platform,
      commission: parseInt(campaignData.commission),
      requirements: Array.isArray(campaignData.requirements) ? campaignData.requirements : [campaignData.requirements],
      duration: parseInt(campaignData.duration),
      status: campaignData.status || 'active',
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

// PUT - Update existing campaign
export async function PUT(request: NextRequest) {
  try {
    const campaignsCollection = await getCollection('campaigns');
    const { campaignId, ...updateData } = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const updateResult = await campaignsCollection.updateOne(
      { _id: new ObjectId(campaignId) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found or no changes made' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign updated successfully'
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE - Delete campaign
export async function DELETE(request: NextRequest) {
  try {
    const campaignsCollection = await getCollection('campaigns');
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('id');

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const deleteResult = await campaignsCollection.deleteOne({
      _id: new ObjectId(campaignId)
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}


