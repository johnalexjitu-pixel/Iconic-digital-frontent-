import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const transactionsCollection = await getCollection('transactions');

    // Fetch real transactions from database
    const transactions = await transactionsCollection.find({}).toArray();
    
    // If no transactions exist, return empty array
    if (!transactions || transactions.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No transactions found'
      });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredTransactions = transactions;

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
      },
      source: 'database'
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
    const transactionsCollection = await getCollection('transactions');
    const transactionData = await request.json();

    // Generate unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create new transaction document
    const newTransaction = {
      _id: new ObjectId(),
      transactionId,
      userId: transactionData.userId || "mock_user_id",
      type: transactionData.type || "deposit",
      amount: transactionData.amount || 0,
      description: transactionData.description || "",
      campaignId: transactionData.campaignId || null,
      status: transactionData.status || "pending",
      method: transactionData.method || null,
      reference: transactionData.reference || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await transactionsCollection.insertOne(newTransaction);

    return NextResponse.json({
      success: true,
      message: 'Transaction created successfully',
      data: newTransaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
