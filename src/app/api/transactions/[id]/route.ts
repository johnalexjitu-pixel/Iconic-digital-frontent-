import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Get transaction by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const transactionsCollection = await getCollection('transactions');
    const { id } = await params;

    const transaction = await transactionsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!transaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch transaction'
    }, { status: 500 });
  }
}

// PUT - Update transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const transactionsCollection = await getCollection('transactions');
    const { id } = await params;

    const updateData = await request.json();
    
    // Remove sensitive fields
    delete updateData._id;
    delete updateData.createdAt;

    const result = await transactionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 });
    }

    const transaction = await transactionsCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });

  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update transaction'
    }, { status: 500 });
  }
}

// DELETE - Delete transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const transactionsCollection = await getCollection('transactions');
    const { id } = await params;

    const result = await transactionsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete transaction'
    }, { status: 500 });
  }
}
