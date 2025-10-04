import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        environment: {
          type: config.server.env,
          isDevelopment: config.env.isDevelopment,
          isProduction: config.env.isProduction,
          port: config.server.port,
          host: config.server.host,
        },
        server: config.server,
        urls: config.urls,
        database: {
          name: config.database.name,
          uri: config.database.uri.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
        },
        features: config.features,
        services: config.services,
        cors: config.cors,
        logging: config.logging,
        timestamp: new Date().toISOString(),
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
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
