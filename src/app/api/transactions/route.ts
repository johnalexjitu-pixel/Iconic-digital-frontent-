import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Mock transactions data
    const mockTransactions = [
      {
        _id: "1",
        transactionId: "TXN001",
        userId: "mock_user_id",
        type: "campaign_earning",
        amount: 5592,
        description: "Campaign P1IT7024 - TACO BELL",
        campaignId: "P1IT7024",
        status: "completed",
        method: null,
        reference: "CAM_TXN_001",
        createdAt: new Date('2024-01-15T14:30:00Z'),
        updatedAt: new Date('2024-01-15T14:30:00Z')
      },
      {
        _id: "2",
        transactionId: "TXN002",
        userId: "mock_user_id",
        type: "withdrawal",
        amount: -10000,
        description: "Withdrawal to Bank Account",
        status: "processing",
        method: "Bank Transfer",
        reference: "WD_TXN_002",
        createdAt: new Date('2024-01-14T10:15:00Z'),
        updatedAt: new Date('2024-01-14T10:15:00Z')
      },
      {
        _id: "3",
        transactionId: "TXN003",
        userId: "mock_user_id",
        type: "campaign_earning",
        amount: 74,
        description: "Campaign P1IT7025 - RENAULT",
        campaignId: "P1IT7025",
        status: "completed",
        method: null,
        reference: "CAM_TXN_003",
        createdAt: new Date('2024-01-13T16:45:00Z'),
        updatedAt: new Date('2024-01-13T16:45:00Z')
      },
      {
        _id: "4",
        transactionId: "TXN004",
        userId: "mock_user_id",
        type: "deposit",
        amount: 50000,
        description: "Bank Deposit - Account Transfer",
        status: "completed",
        method: "Bank Transfer",
        reference: "DEP_TXN_004",
        createdAt: new Date('2024-01-12T09:20:00Z'),
        updatedAt: new Date('2024-01-12T09:20:00Z')
      },
      {
        _id: "5",
        transactionId: "TXN005",
        userId: "mock_user_id",
        type: "campaign_earning",
        amount: 74,
        description: "Campaign P1IT7023 - LOUIS PHILLIPPE",
        campaignId: "P1IT7023",
        status: "completed",
        method: null,
        reference: "CAM_TXN_005",
        createdAt: new Date('2024-01-11T13:30:00Z'),
        updatedAt: new Date('2024-01-11T13:30:00Z')
      },
      {
        _id: "6",
        transactionId: "TXN006",
        userId: "mock_user_id",
        type: "daily_bonus",
        amount: 100,
        description: "Daily Check-in Bonus - Day 7",
        status: "completed",
        method: null,
        reference: "DAILY_TXN_006",
        createdAt: new Date('2024-01-10T08:00:00Z'),
        updatedAt: new Date('2024-01-10T08:00:00Z')
      }
    ];

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredTransactions = mockTransactions;

    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }

    if (status) {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }

    // Apply pagination
    const paginatedTransactions = filteredTransactions.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
      total: filteredTransactions.length,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < filteredTransactions.length
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const transactionData = await request.json();

    // For demo, just return success
    // In production, create actual transaction document

    return NextResponse.json({
      success: true,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
