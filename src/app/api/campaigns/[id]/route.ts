import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';

// GET - Get campaign by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return NextResponse.json({
        success: false,
        error: 'Campaign not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: campaign
    });

  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch campaign'
    }, { status: 500 });
  }
}

// PUT - Update campaign
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const updateData = await request.json();
    
    // Remove sensitive fields
    delete updateData._id;
    delete updateData.createdAt;

    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return NextResponse.json({
        success: false,
        error: 'Campaign not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign
    });

  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update campaign'
    }, { status: 500 });
  }
}

// DELETE - Delete campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const campaign = await Campaign.findByIdAndDelete(id);
    
    if (!campaign) {
      return NextResponse.json({
        success: false,
        error: 'Campaign not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete campaign'
    }, { status: 500 });
  }
}
