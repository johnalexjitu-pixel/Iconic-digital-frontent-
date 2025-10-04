import { NextRequest, NextResponse } from 'next/server';
import { getApiStatus } from '@/lib/api-client';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const apiStatus = await getApiStatus();
    
    return NextResponse.json({
      success: true,
      data: {
        environment: config.env,
        api: {
          frontend: config.api.baseUrl,
          backend: config.api.backendUrl,
          status: apiStatus,
        },
        features: config.features,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
