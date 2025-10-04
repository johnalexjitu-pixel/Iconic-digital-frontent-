import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const campaignsCollection = await getCollection('campaigns');

    // Mock campaigns data based on the screenshots
    const mockCampaigns = [
      {
        _id: "1",
        campaignId: "P1IT7024",
        code: "WPE02",
        brand: "TACO BELL",
        logo: "🌮",
        description: "Social media promotion campaign",
        type: "Social",
        commissionRate: 10,
        commissionAmount: 55924,
        baseAmount: 55924,
        profit: 5592,
        taskCode: "WPE02",
        status: "Completed",
        requirements: ["Post on social media", "Use hashtags", "Tag brand"],
        duration: 7,
        maxParticipants: 100,
        currentParticipants: 45,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-22'),
        isActive: false
      },
      {
        _id: "2",
        campaignId: "P1IT7025",
        code: "OWEXPS",
        brand: "RENAULT",
        logo: "🚗",
        description: "Product review campaign",
        type: "Creative",
        commissionRate: 1,
        commissionAmount: 7450,
        baseAmount: 7450,
        profit: 74,
        taskCode: "OWEXPS",
        status: "Completed",
        requirements: ["Create video review", "Post on YouTube", "Minimum 2 minutes"],
        duration: 14,
        maxParticipants: 50,
        currentParticipants: 23,
        startDate: new Date('2024-01-13'),
        endDate: new Date('2024-01-27'),
        isActive: false
      },
      {
        _id: "3",
        campaignId: "P1IT7023",
        code: "V17EOB",
        brand: "LOUIS PHILLIPPE",
        logo: "👔",
        description: "Fashion brand promotion",
        type: "Influencer",
        commissionRate: 1,
        commissionAmount: 7444,
        baseAmount: 7444,
        profit: 74,
        taskCode: "V17EOB",
        status: "Completed",
        requirements: ["Fashion photoshoot", "Instagram post", "Story highlights"],
        duration: 10,
        maxParticipants: 75,
        currentParticipants: 31,
        startDate: new Date('2024-01-11'),
        endDate: new Date('2024-01-21'),
        isActive: false
      },
      {
        _id: "4",
        campaignId: "P1IT7022",
        code: "2024MZ",
        brand: "SHISEIDO",
        logo: "💄",
        description: "Beauty product campaign",
        type: "Creative",
        commissionRate: 1,
        commissionAmount: 7184,
        baseAmount: 7184,
        profit: 71,
        taskCode: "2024MZ",
        status: "Completed",
        requirements: ["Makeup tutorial", "Before/after photos", "Product showcase"],
        duration: 5,
        maxParticipants: 30,
        currentParticipants: 18,
        startDate: new Date('2024-01-09'),
        endDate: new Date('2024-01-14'),
        isActive: false
      }
    ];

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let filteredCampaigns = mockCampaigns;

    if (status) {
      filteredCampaigns = filteredCampaigns.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    if (type) {
      filteredCampaigns = filteredCampaigns.filter(c => c.type.toLowerCase() === type.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: filteredCampaigns,
      total: filteredCampaigns.length
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
