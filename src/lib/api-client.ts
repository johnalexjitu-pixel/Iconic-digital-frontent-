import { apiConfig, getApiUrl, getEnvironmentConfig } from './api-config';

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

// Environment-based API Client
export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private enableLogging: boolean;
  private envConfig: ReturnType<typeof getEnvironmentConfig>;

  constructor() {
    // Get environment configuration
    this.envConfig = getEnvironmentConfig();
    
    // Use environment-based URL configuration
    this.baseUrl = this.envConfig.apiBaseUrl;
    this.timeout = this.envConfig.timeout;
    this.retryAttempts = this.envConfig.retryAttempts;
    this.enableLogging = this.envConfig.enableLogging;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (this.enableLogging) {
      console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (this.enableLogging) {
        console.log(`✅ API Response: ${url}`, data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (this.enableLogging) {
        console.error(`❌ API Error: ${url}`, error);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Authentication API methods
  async register(data: { name: string; email: string; password: string; referralCode?: string }): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.auth.register, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User API methods
  async getUserProfile(): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.user.profile);
  }

  async updateUserProfile(data: Record<string, unknown>): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.user.update, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getUserStats(): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.user.stats);
  }

  // Users management (Admin)
  async getUsers(): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.users.list);
  }

  async createUser(data: Record<string, unknown>): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.users.create, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.users.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.users.delete(id), {
      method: 'DELETE',
    });
  }

  // Campaign API methods
  async getCampaigns(params?: { status?: string; type?: string }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    
    const endpoint = queryParams.toString() 
      ? `${apiConfig.endpoints.campaigns.list}?${queryParams.toString()}`
      : apiConfig.endpoints.campaigns.list;
    
    return this.makeRequest(endpoint);
  }

  async createCampaign(data: Record<string, unknown>): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.campaigns.create, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCampaignDetails(id: string): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.campaigns.get(id));
  }

  async updateCampaign(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.campaigns.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id: string): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.campaigns.delete(id), {
      method: 'DELETE',
    });
  }

  async joinCampaign(id: string): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.campaigns.join(id), {
      method: 'POST',
    });
  }

  // Transaction API methods
  async getTransactions(): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.transactions.list);
  }

  async createTransaction(data: Record<string, unknown>): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.transactions.create, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTransactionDetails(id: string): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.transactions.get(id));
  }

  async updateTransaction(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.transactions.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(id: string): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.transactions.delete(id), {
      method: 'DELETE',
    });
  }

  async getTransactionHistory(): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.transactions.history);
  }

  // Dashboard API methods
  async getDashboardStats(): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.dashboard.stats);
  }

  async getDashboardAnalytics(): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.dashboard.analytics);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest(apiConfig.endpoints.health.check);
  }

  // Get current API base URL (for debugging)
  getCurrentBaseUrl(): string {
    return this.baseUrl;
  }

  // Get environment info
  getEnvironmentInfo() {
    return {
      environment: this.envConfig.environment,
      baseUrl: this.baseUrl,
      frontendUrl: this.envConfig.frontendUrl,
      timeout: this.timeout,
      retryAttempts: this.retryAttempts,
      enableLogging: this.enableLogging,
      isDevelopment: this.envConfig.isDevelopment,
      isProduction: this.envConfig.isProduction,
    };
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Utility functions
export const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await apiClient.healthCheck();
    return response.success;
  } catch {
    return false;
  }
};

export const getApiStatus = async () => {
  const isAvailable = await isBackendAvailable();
  const envConfig = getEnvironmentConfig();
  return {
    environment: envConfig.environment,
    apiBaseUrl: apiClient.getCurrentBaseUrl(),
    backendUrl: envConfig.apiBaseUrl,
    frontendUrl: envConfig.frontendUrl,
    isAvailable,
    timestamp: new Date().toISOString(),
  };
};
