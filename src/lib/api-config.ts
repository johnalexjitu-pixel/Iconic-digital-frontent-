// Environment-based API Configuration
// All API endpoints are configured from environment variables

export const apiConfig = {
  // Base URLs from environment variables
  baseUrls: {
    // Primary API URL
    api: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
    
    // Frontend URL
    frontend: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001',
    
    // App URL
    app: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001',
  },

  // API Endpoints Configuration
  endpoints: {
    // Authentication endpoints
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      refresh: '/api/auth/refresh',
    },

    // User endpoints
    user: {
      profile: '/api/user',
      update: '/api/user',
      stats: '/api/user/stats',
      avatar: '/api/user/avatar',
    },

    // Users management (Admin)
    users: {
      list: '/api/users',
      create: '/api/users',
      get: (id: string) => `/api/users/${id}`,
      update: (id: string) => `/api/users/${id}`,
      delete: (id: string) => `/api/users/${id}`,
    },

    // Campaign endpoints
    campaigns: {
      list: '/api/campaigns',
      create: '/api/campaigns',
      get: (id: string) => `/api/campaigns/${id}`,
      update: (id: string) => `/api/campaigns/${id}`,
      delete: (id: string) => `/api/campaigns/${id}`,
      join: (id: string) => `/api/campaigns/${id}/join`,
      leave: (id: string) => `/api/campaigns/${id}/leave`,
    },

    // Transaction endpoints
    transactions: {
      list: '/api/transactions',
      create: '/api/transactions',
      get: (id: string) => `/api/transactions/${id}`,
      update: (id: string) => `/api/transactions/${id}`,
      delete: (id: string) => `/api/transactions/${id}`,
      history: '/api/transactions/history',
    },

    // Withdrawal endpoints
    withdrawals: {
      list: '/api/withdrawals',
      create: '/api/withdrawals',
      get: (id: string) => `/api/withdrawals/${id}`,
      approve: '/api/withdrawals/approve',
    },

    // Deposit endpoints
    deposits: {
      list: '/api/deposits',
      create: '/api/deposits',
      get: (id: string) => `/api/deposits/${id}`,
      approve: '/api/deposits/approve',
    },

    // Dashboard endpoints
    dashboard: {
      stats: '/api/dashboard/stats',
      analytics: '/api/dashboard/analytics',
      overview: '/api/dashboard/overview',
    },

    // File upload endpoints
    upload: {
      image: '/api/upload/image',
      document: '/api/upload/document',
      avatar: '/api/upload/avatar',
    },

    // External service endpoints
    services: {
      payment: process.env.NEXT_PUBLIC_PAYMENT_API_URL || '/api/payments',
      notification: process.env.NEXT_PUBLIC_NOTIFICATION_API_URL || '/api/notifications',
      email: '/api/services/email',
      sms: '/api/services/sms',
    },

    // Health and status endpoints
    health: {
      check: '/api/health',
      status: '/api/status',
      env: '/api/env-status',
      api: '/api/api-status',
    },
  },

  // Request configuration
  request: {
    timeout: parseInt(process.env.API_TIMEOUT || '10000'),
    retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3'),
    enableLogging: process.env.NODE_ENV === 'development',
  },

  // Headers configuration
  headers: {
    default: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    cors: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${apiConfig.baseUrls.api}${endpoint}`;
};

// Helper function to get full frontend URL
export const getFrontendUrl = (path: string = ''): string => {
  return `${apiConfig.baseUrls.frontend}${path}`;
};

// Helper function to get environment-specific configuration
export const getEnvironmentConfig = () => {
  return {
    environment: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    apiBaseUrl: apiConfig.baseUrls.api,
    frontendUrl: apiConfig.baseUrls.frontend,
    enableLogging: apiConfig.request.enableLogging,
    timeout: apiConfig.request.timeout,
    retryAttempts: apiConfig.request.retryAttempts,
  };
};

// Export all endpoints for easy access
export const {
  endpoints,
  baseUrls,
  request: requestConfig,
  headers: headerConfig,
} = apiConfig;
