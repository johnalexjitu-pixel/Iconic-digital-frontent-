# 🌍 Environment Setup Guide - Complete Process Environment Configuration

## 📋 Overview

এই guide আপনাকে সাহায্য করবে environment variables ব্যবহার করে localhost এবং production environment থেকে কাজ করতে।

## 🔧 Environment Variables Configuration

### 📁 Environment Files Structure

```
iconic-digital-frontend/
├── .env.development      # Development environment
├── .env.production       # Production environment
├── .env.local           # Local overrides (git ignored)
└── .env.example         # Template for new environments
```

## 🏠 Local Development Setup

### Step 1: Create Development Environment

**`.env.development`:**
```env
# ==========================================
# DEVELOPMENT ENVIRONMENT CONFIGURATION
# ==========================================

# Environment Type
NODE_ENV=development

# Server Configuration
PORT=3001
HOST=localhost

# Frontend URLs
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Backend Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Database Configuration
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital
DATABASE_NAME=iconic-digital-dev

# Authentication
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f

# Features & Services
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=true

# CORS Configuration
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002

# External APIs
NEXT_PUBLIC_PAYMENT_API_URL=http://localhost:8000/api/payments
NEXT_PUBLIC_NOTIFICATION_API_URL=http://localhost:9000/api/notifications

# File Upload
NEXT_PUBLIC_UPLOAD_URL=http://localhost:3001/api/upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# Email Configuration
EMAIL_SERVICE=nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@socialtrend.com

# Redis Configuration (for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/development.log
API_REQUEST_LOG=true
```

## 🚀 Production Setup

### Step 2: Create Production Environment

**`.env.production`:**
```env
# ==========================================
# PRODUCTION ENVIRONMENT CONFIGURATION
# ==========================================

# Environment Type
NODE_ENV=production

# Server Configuration
PORT=3001
HOST=0.0.0.0

# Frontend URLs
NEXT_PUBLIC_FRONTEND_URL=https://socialtrend.com
NEXT_PUBLIC_APP_URL=https://socialtrend.com

# Backend Configuration
NEXT_PUBLIC_API_URL=https://api.socialtrend.com
NEXT_PUBLIC_BACKEND_URL=https://api.socialtrend.com

# Database Configuration
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital
DATABASE_NAME=iconic-digital-prod

# Authentication
NEXTAUTH_URL=https://socialtrend.com
NEXTAUTH_SECRET=your-production-secret-key-here-change-this

# Features & Services
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_ENABLE_MOCK_DATA=false

# CORS Configuration
NEXT_PUBLIC_ALLOWED_ORIGINS=https://socialtrend.com,https://www.socialtrend.com,https://admin.socialtrend.com

# External APIs
NEXT_PUBLIC_PAYMENT_API_URL=https://payments.socialtrend.com/api
NEXT_PUBLIC_NOTIFICATION_API_URL=https://notifications.socialtrend.com/api

# File Upload
NEXT_PUBLIC_UPLOAD_URL=https://socialtrend.com/api/upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# Email Configuration
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@socialtrend.com

# Redis Configuration
REDIS_URL=redis://your-redis-host:6379
REDIS_PASSWORD=your-redis-password

# Logging
LOG_LEVEL=info
LOG_FILE=logs/production.log
API_REQUEST_LOG=false

# Security
CORS_ORIGIN=https://socialtrend.com
TRUSTED_PROXIES=1
```

## 🔄 Environment Switching Setup

### Step 3: Create Environment Template

**`.env.example`:**
```env
# ==========================================
# ENVIRONMENT TEMPLATE
# Copy this file and modify for your environment
# ==========================================

# Environment Type (development/production/test)
NODE_ENV=development

# Server Configuration
PORT=3001
HOST=localhost

# Frontend URLs
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Backend Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&appName=app
DATABASE_NAME=iconic-digital

# Authentication
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here

# Features & Services
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=true

# Add more environment variables as needed...
```

## 🔧 Updated Configuration System

### Step 4: Update Configuration File

**`src/lib/config.ts`:**
```typescript
// Environment-based configuration
export const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '3001'),
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development',
  },
  
  // URLs
  urls: {
    frontend: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001',
    app: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
    api: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    backend: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  },
  
  // Database
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/iconic-digital',
    name: process.env.DATABASE_NAME || 'iconic-digital',
  },
  
  // Authentication
  auth: {
    url: process.env.NEXTAUTH_URL || 'http://localhost:3001',
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
  },
  
  // Features
  features: {
    enableRealtime: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true' || process.env.NODE_ENV === 'development',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true' || process.env.NODE_ENV === 'development',
    enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development',
  },
  
  // External Services
  services: {
    payment: {
      apiUrl: process.env.NEXT_PUBLIC_PAYMENT_API_URL || 'http://localhost:8000/api/payments',
    },
    notification: {
      apiUrl: process.env.NEXT_PUBLIC_NOTIFICATION_API_URL || 'http://localhost:9000/api/notifications',
    },
    upload: {
      url: process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:3001/api/upload',
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
      allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['jpg', 'jpeg', 'png'],
    },
  },
  
  // Email Configuration
  email: {
    service: process.env.EMAIL_SERVICE || 'nodemailer',
    smtp: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || '',
    },
    from: process.env.FROM_EMAIL || 'noreply@socialtrend.com',
  },
  
  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || '',
  },
  
  // CORS Configuration
  cors: {
    origins: process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
    defaultOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
    file: process.env.LOG_FILE || `logs/${process.env.NODE_ENV}.log`,
    apiRequests: process.env.API_REQUEST_LOG === 'true' || process.env.NODE_ENV === 'development',
  },
  
  // Security
  security: {
    trustedProxies: parseInt(process.env.TRUSTED_PROXIES || '1'),
  }
};

// Environment-specific settings
export const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';
  
  return {
    // API Configuration
    api: {
      timeout: isDevelopment ? 10000 : isProduction ? 5000 : 3000,
      retryAttempts: isDevelopment ? 3 : isProduction ? 2 : 1,
      baseUrl: config.urls.api,
      endpoints: {
        // Dynamic endpoints based on environment
        users: `${config.urls.api}/api/users`,
        campaigns: `${config.urls.api}/api/campaigns`,
        transactions: `${config.urls.api}/api/transactions`,
        auth: {
          register: `${config.urls.api}/api/auth/register`,
          login: `${config.urls.api}/api/auth/login`,
        },
        payments: `${config.services.payment.apiUrl}`,
        notifications: `${config.services.notification.apiUrl}`,
      }
    },
    
    // Database Configuration
    database: {
      connectionOptions: {
        maxPoolSize: isProduction ? 10 : 5,
        serverSelectionTimeoutMS: isDevelopment ? 5000 : 3000,
        socketTimeoutMS: isDevelopment ? 45000 : 30000,
      }
    },
    
    // Logging Configuration
    logging: {
      enableConsole: isDevelopment || isTest,
      enableFile: true,
      enableErrorLogging: true,
    },
    
    // Features Configuration
    features: {
      enableHotReload: isDevelopment,
      enableSourceMaps: isDevelopment,
      enableCompression: isProduction,
      enableCaching: isProduction,
    }
  };
};

// Export environment info
export const environmentInfo = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001'),
  host: process.env.HOST || 'localhost',
};
```

### Step 5: Update Package.json Scripts

**`package.json`:**
```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0 --turbopack",
    "dev:local": "cp .env.development .env.local && next dev -H 0.0.0.0 --turbopack",
    "dev:prod": "cp .env.production .env.local && next dev -H 0.0.0.0 --turbopack",
    "build": "next build",
    "build:dev": "cp .env.development .env.local && next build",
    "build:prod": "cp .env.production .env.local && next build",
    "start": "next start",
    "start:dev": "cp .env.development .env.local && next start",
    "start:prod": "cp .env.production .env.local && next start",
    "lint": "bunx tsc --noEmit && next lint",
    "format": "bunx biome format --write",
    "env:check": "node -e \"console.log('Environment:', process.env.NODE_ENV); console.log('API URL:', process.env.NEXT_PUBLIC_API_URL); console.log('Frontend URL:', process.env.NEXT_PUBLIC_FRONTEND_URL);\"",
    "test": "NODE_ENV=test jest",
    "test:dev": "cp .env.development .env.local && NODE_ENV=development jest",
    "test:prod": "cp .env.production .env.local && NODE_ENV=production jest"
  }
}
```

## 🚀 Usage Instructions

### Local Development

**Option 1: Using Scripts**
```bash
# Development environment
bun run lint:dev

# Production-like environment
bun run dev:prod
```

**Option 2: Manual Environment Switching**
```bash
# Switch to development
cp .env.development .env.local
bun run dev

# Switch to production
cp .env.production .env.local
bun run dev
```

**Option 3: Direct Environment Variables**
```bash
# Development
NODE_ENV=development NEXT_PUBLIC_API_URL=http://localhost:5000 bun run dev

# Production
NODE_ENV=production NEXT_PUBLIC_API_URL=https://api.socialtrend.com bun run dev
```

### Production Deployment

**Building for Production:**
```bash
# Build for production
bun run build:prod

# Start production server
bun run start:prod
```

**Environment Variables Check:**
```bash
# Check current environment configuration
bun run env:check
```

## 📊 Environment Monitoring

### Step 6: Create Environment Status API

**`src/app/api/env-status/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { config, environmentInfo, getEnvironmentConfig } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const envConfig = getEnvironmentConfig();
    
    return NextResponse.json({
      success: true,
      data: {
        environment: {
          type: environmentInfo.env,
          isDevelopment: environmentInfo.isDevelopment,
          isProduction: environmentInfo.isProduction,
          port: environmentInfo.port,
          host: environmentInfo.host,
        },
        server: config.server,
        urls: config.urls,
        database: {
          name: config.database.name,
          connected: true, // Add actual connection check
        },
        features: config.features,
        services: config.services,
        cors: config.cors,
        logging: config.logging,
        apiConfig: envConfig.api,
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
```

### Step 7: Create Environment Switcher Component

**`src/components/EnvironmentSwitcher.tsx`:**
```typescript
"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Server, Database, CheckCircle, XCircle, Environment } from 'lucide-react';

interface EnvironmentStatus {
  environment: {
    type: string;
    isDevelopment: boolean;
    isProduction: boolean;
    port: number;
    port: string;
  };
  server: any;
  urls: any;
  database: any;
  features: any;
  services: any;
  cors: any;
  apiConfig: any;
  timestamp: string;
}

export function EnvironmentSwitcher() {
  const [status, setStatus] = useState<EnvironmentStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/env-status');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to check status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Environment className="w-5 h-5" />
          Environment Configuration
        </h3>
        <Button
          onClick={checkStatus}
          disabled={loading}
          size="sm"
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'load:spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {status && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Environment:</span>
                <Badge variant={status.environment.isDevelopment ? 'default' : 'secondary'}>
                  {status.environment.type}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Server:</span>
                <span className="text-sm text-gray-600">
                  {status.server.host}:{status.server.port}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Frontend:</span>
                <span className="text-sm text-gray-600">{status.urls.frontend}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Backend:</span>
                <span className="text-sm text-gray-600">{status.urls.api}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database:</span>
                <span className="text-sm text-gray-600">{status.database.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Real-time:</span>
                <Badge variant={status.features.enableRealtime ? 'default' : 'secondary'}>
                  {status.features.enableRealtime ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Analytics:</span>
                <Badge variant={status.features.enableAnalytics ? 'default' : 'secondary'}>
                  {status.features.enableAnalytics ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Debug Mode:</span>
                <Badge variant={status.features.enableDebug ? 'default' : 'secondary'}>
                  {status.features.enableDebug ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 pt-2 border-t">
            Last updated: {new Date(status.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {!status && !loading && (
        <div className="text-center text-gray-500 py-4">
          <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Click refresh to check environment status</p>
        </div>
      )}
    </Card>
  );
}
```

## 🎯 Quick Commands

### Environment Switching
```bash
# Development
bun run dev:local

# Production
bun run dev:prod

# Check environment
bun run env:check
```

### Testing Different Environments
```bash
# Test development configuration
NODE_ENV=development bun run test:dev

# Test production configuration
NODE_ENV=production bun run test:prod
```

## 📋 Environment Checklist

### Development Setup
- [ ] `.env.development` created
- [ ] `.env.local` configured
- [ ] Development API URLs set
- [ ] Mock data enabled
- [ ] Debug mode enabled

### Production Setup
- [ ] `.env.production` created
- [ ] Production API URLs set
- [ ] Analytics enabled
- [ ] Debug mode disabled
- [ ] Security configurations set

## 🚨 Important Notes

1. **Environment Priority**: `.env.local` > `.env.production`/`.env.development` > Environment variables
2. **Security**: Never commit `.env.local` to version control
3. **Production Secrets**: Change all default secrets in production
4. **CORS**: Configure CORS origins properly for different environments
5. **Database**: Use separate databases for development and production

আপনার application এখন সম্পূর্ণভাবে environment-based এবং যেকোনো environment থেকে কাজ করার জন্য প্রস্তুত! 🚀
