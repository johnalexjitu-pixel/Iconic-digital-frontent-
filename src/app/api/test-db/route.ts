import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing MongoDB connection...');
    
    // Test MongoDB connection
    await connectDB();
    
    console.log('✅ MongoDB connection successful!');
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful!',
      timestamp: new Date().toISOString(),
      status: 'connected'
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'MongoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      status: 'disconnected'
    }, { status: 500 });
  }
}
