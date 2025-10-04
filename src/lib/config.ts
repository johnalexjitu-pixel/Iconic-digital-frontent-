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
  
  // Legacy API Configuration (for backward compatibility)
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001',
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  },
  
  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
  
  // Database Configuration
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
  }
};

// API Endpoints
export const apiEndpoints = {
  // User endpoints
  user: {
    profile: `${config.api.backendUrl}/api/user/profile`,
    update: `${config.api.backendUrl}/api/user/update`,
    stats: `${config.api.backendUrl}/api/user/stats`,
  },
  
  // Campaign endpoints
  campaigns: {
    list: `${config.api.backendUrl}/api/campaigns`,
    create: `${config.api.backendUrl}/api/campaigns`,
    details: (id: string) => `${config.api.backendUrl}/api/campaigns/${id}`,
    join: (id: string) => `${config.api.backendUrl}/api/campaigns/${id}/join`,
  },
  
  // Transaction endpoints
  transactions: {
    list: `${config.api.backendUrl}/api/transactions`,
    create: `${config.api.backendUrl}/api/transactions`,
    history: `${config.api.backendUrl}/api/transactions/history`,
  },
  
  // Auth endpoints
  auth: {
    login: `${config.api.backendUrl}/api/auth/login`,
    register: `${config.api.backendUrl}/api/auth/register`,
    logout: `${config.api.backendUrl}/api/auth/logout`,
    refresh: `${config.api.backendUrl}/api/auth/refresh`,
  },
  
  // Dashboard endpoints
  dashboard: {
    stats: `${config.api.backendUrl}/api/dashboard/stats`,
    analytics: `${config.api.backendUrl}/api/dashboard/analytics`,
  }
};

// Environment-specific settings
export const getEnvironmentConfig = () => {
  if (config.env.isDevelopment) {
    return {
      apiTimeout: 10000,
      retryAttempts: 3,
      enableLogging: true,
      enableMockData: true,
    };
  }
  
  if (config.env.isProduction) {
    return {
      apiTimeout: 5000,
      retryAttempts: 2,
      enableLogging: false,
      enableMockData: false,
    };
  }
  
  if (config.env.isTest) {
    return {
      apiTimeout: 3000,
      retryAttempts: 1,
      enableLogging: true,
      enableMockData: true,
    };
  }
  
  return {
    apiTimeout: 5000,
    retryAttempts: 2,
    enableLogging: false,
    enableMockData: false,
  };
};
