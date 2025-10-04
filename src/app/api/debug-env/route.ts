import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'EXISTS' : 'MISSING',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'EXISTS' : 'MISSING',
      PORT: process.env.PORT,
      FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
      API_URL: process.env.NEXT_PUBLIC_API_URL,
    };

    return NextResponse.json({
      success: true,
      data: {
        environment_variables: envVars,
        timestamp: new Date().toISOString(),
        server_url: request.url,
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
