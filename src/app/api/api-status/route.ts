import { NextRequest, NextResponse } from 'next/server';
import { apiClient, getApiStatus } from '@/lib/api-client';
import { apiConfig, getEnvironmentConfig } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  try {
    const apiStatus = await getApiStatus();
    const clientInfo = apiClient.getEnvironmentInfo();
    
    const envConfig = getEnvironmentConfig();
    
    return NextResponse.json({
      success: true,
      data: {
        // Environment Configuration
        environment: {
          type: envConfig.environment,
          isDevelopment: envConfig.isDevelopment,
          isProduction: envConfig.isProduction,
        },
        
        // URL Configuration
        urls: {
          frontend: envConfig.frontendUrl,
          api: envConfig.apiBaseUrl,
          backend: envConfig.apiBaseUrl,
        },
        
        // API Client Configuration
        apiClient: {
          currentBaseUrl: clientInfo.baseUrl,
          timeout: clientInfo.timeout,
          retryAttempts: clientInfo.retryAttempts,
          enableLogging: clientInfo.enableLogging,
        },
        
        // API Status
        apiStatus: {
          baseUrl: apiStatus.apiBaseUrl,
          backendUrl: apiStatus.backendUrl,
          frontendUrl: apiStatus.frontendUrl,
          isAvailable: apiStatus.isAvailable,
        },
        
        // Environment Variables
        environmentVariables: {
          NODE_ENV: process.env.NODE_ENV,
          MONGODB_URI: process.env.MONGODB_URI ? 'EXISTS' : 'MISSING',
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
          NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
          NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
          API_TIMEOUT: process.env.API_TIMEOUT,
          API_RETRY_ATTEMPTS: process.env.API_RETRY_ATTEMPTS,
        },
        
        // API Endpoints Available
        endpoints: {
          auth: {
            register: `${clientInfo.baseUrl}${apiConfig.endpoints.auth.register}`,
            login: `${clientInfo.baseUrl}${apiConfig.endpoints.auth.login}`,
          },
          users: {
            list: `${clientInfo.baseUrl}${apiConfig.endpoints.users.list}`,
            create: `${clientInfo.baseUrl}${apiConfig.endpoints.users.create}`,
            profile: `${clientInfo.baseUrl}${apiConfig.endpoints.user.profile}`,
          },
          campaigns: {
            list: `${clientInfo.baseUrl}${apiConfig.endpoints.campaigns.list}`,
            create: `${clientInfo.baseUrl}${apiConfig.endpoints.campaigns.create}`,
          },
          transactions: {
            list: `${clientInfo.baseUrl}${apiConfig.endpoints.transactions.list}`,
            create: `${clientInfo.baseUrl}${apiConfig.endpoints.transactions.create}`,
          },
          dashboard: {
            stats: `${clientInfo.baseUrl}${apiConfig.endpoints.dashboard.stats}`,
            analytics: `${clientInfo.baseUrl}${apiConfig.endpoints.dashboard.analytics}`,
          },
          health: {
            check: `${clientInfo.baseUrl}${apiConfig.endpoints.health.check}`,
            status: `${clientInfo.baseUrl}${apiConfig.endpoints.health.status}`,
          },
        },
        
        timestamp: new Date().toISOString(),
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
  } catch (error) {
    const envConfig = getEnvironmentConfig();
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: {
        environment: envConfig.environment,
        apiBaseUrl: apiClient.getCurrentBaseUrl(),
        frontendUrl: envConfig.frontendUrl,
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}
