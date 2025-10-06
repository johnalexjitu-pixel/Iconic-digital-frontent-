import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const campaignsCollection = await getCollection('campaigns');

    // Check if campaigns exist, if not create sample campaigns
    const existingCampaigns = await campaignsCollection.find({}).toArray();
    
    if (existingCampaigns.length === 0) {
      // Create sample campaigns
      const sampleCampaigns = [
        {
          _id: new ObjectId(),
          title: "Instagram Story Promotion",
          description: "Share our brand story on Instagram with hashtags",
          platform: "Instagram",
          commission: 500,
          requirements: ["Post story", "Use hashtags", "Tag brand"],
          duration: 1,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(),
          title: "Facebook Post Campaign",
          description: "Create engaging Facebook post about our product",
          platform: "Facebook",
          commission: 750,
          requirements: ["Create post", "Include images", "Engage audience"],
          duration: 2,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(),
          title: "YouTube Video Review",
          description: "Create video review of our product on YouTube",
          platform: "YouTube",
          commission: 1200,
          requirements: ["Minimum 3 minutes", "Honest review", "Include link"],
          duration: 7,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(),
          title: "TikTok Dance Challenge",
          description: "Participate in our brand dance challenge",
          platform: "TikTok",
          commission: 300,
          requirements: ["Use our music", "Follow choreography", "Use hashtag"],
          duration: 1,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(),
          title: "Twitter Thread Campaign",
          description: "Create informative thread about our service",
          platform: "Twitter",
          commission: 400,
          requirements: ["5+ tweets", "Include facts", "Engage replies"],
          duration: 1,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await campaignsCollection.insertMany(sampleCampaigns);
    }

    // Fetch campaigns from database
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
      filteredCampaigns = filteredCampaigns.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    if (type) {
      filteredCampaigns = filteredCampaigns.filter(c => c.platform.toLowerCase() === type.toLowerCase());
    }

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
