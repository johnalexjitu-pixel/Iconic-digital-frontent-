import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'Present' : 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Present' : 'Missing',
    };

    // Try database connection
    let dbStatus = 'Not attempted';
    try {
      await connectDB();
      dbStatus = 'Connected successfully';
    } catch (dbError) {
      dbStatus = `Error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`;
    }

    return NextResponse.json({
      success: true,
      data: {
        environment: envCheck,
        database: {
          status: dbStatus,
        },
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: {
        NODE_ENV: process.env.NODE_ENV,
        MONGODB_URI: process.env.MONGODB_URI ? 'Present' : 'Missing',
      }
    }, { status: 500 });
  }
}
