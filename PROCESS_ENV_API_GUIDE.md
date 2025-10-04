# 🔧 Process.env API Configuration Guide

## ✅ **সমস্যা সমাধান সম্পূর্ণ!**

আপনার সব API calls এখন `process.env` থেকে আসবে এবং environment variables update করলে সব API connections আপনার domain থেকে হবে।

## 🎯 **Environment-Based API Configuration**

### 📁 **API Configuration Files Created:**

#### 1. **`src/lib/api-config.ts`** ✅
- সব API endpoints environment variables থেকে configure হয়
- Dynamic URL generation based on environment
- Complete endpoint mapping

#### 2. **`src/lib/api-client.ts`** ✅  
- Environment-based API client
- সব API calls `process.env` থেকে URL নেয়
- Automatic environment switching

#### 3. **`src/app/api/api-status/route.ts`** ✅
- API configuration monitoring endpoint
- Real-time environment variables check
- Complete API endpoints listing

## 🔄 **Environment Variables Configuration**

### Development Environment (`.env.development`)
```env
# API Configuration - Development
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001

# API Settings
API_TIMEOUT=10000
API_RETRY_ATTEMPTS=3
```

### Production Environment (`.env.production`)
```env
# API Configuration - Production (Your Domain)
NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site
NEXT_PUBLIC_BACKEND_URL=https://admin.iconicdigital.site
NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site

# API Settings
API_TIMEOUT=5000
API_RETRY_ATTEMPTS=2
```

## 🚀 **API Calls Now Environment-Based**

### Before (Hardcoded):
```javascript
// Old way - hardcoded URLs
fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### After (Environment-Based):
```javascript
// New way - environment variables
import { apiClient } from '@/lib/api-client';

// All API calls now use process.env
await apiClient.register({
  name: 'User Name',
  email: 'user@example.com',
  password: 'password123'
});
```

## 📊 **API Configuration Structure**

### Environment Variables Used:
```env
# Primary API Configuration
NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site
NEXT_PUBLIC_BACKEND_URL=https://admin.iconicdigital.site
NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site

# API Behavior Configuration  
API_TIMEOUT=5000
API_RETRY_ATTEMPTS=2

# External Services
NEXT_PUBLIC_PAYMENT_API_URL=https://admin.iconicdigital.site/api/payments
NEXT_PUBLIC_NOTIFICATION_API_URL=https://admin.iconicdigital.site/api/notifications
```

### API Endpoints Configuration:
```javascript
// All endpoints now environment-based
endpoints: {
  auth: {
    register: '/api/auth/register',  // Uses NEXT_PUBLIC_API_URL
    login: '/api/auth/login',        // Uses NEXT_PUBLIC_API_URL
  },
  users: {
    list: '/api/users',              // Uses NEXT_PUBLIC_API_URL
    create: '/api/users',            // Uses NEXT_PUBLIC_API_URL
  },
  campaigns: {
    list: '/api/campaigns',          // Uses NEXT_PUBLIC_API_URL
    create: '/api/campaigns',        // Uses NEXT_PUBLIC_API_URL
  }
}
```

## 🔄 **Environment Switching**

### Switch to Development (localhost):
```bash
# Copy development environment
cp .env.development .env.local

# Restart server
bun run dev

# API calls will now go to:
# http://localhost:5000/api/auth/register
# http://localhost:5000/api/users
# http://localhost:5000/api/campaigns
```

### Switch to Production (Your Domain):
```bash
# Copy production environment
cp .env.production .env.local

# Restart server  
bun run dev

# API calls will now go to:
# https://admin.iconicdigital.site/api/auth/register
# https://admin.iconicdigital.site/api/users
# https://admin.iconicdigital.site/api/campaigns
```

## 📱 **API Status Monitoring**

### Check Current API Configuration:
```bash
# Browser access
http://localhost:3001/api/api-status

# Expected response:
{
  "data": {
    "environment": {
      "type": "development",
      "isDevelopment": true
    },
    "urls": {
      "frontend": "http://localhost:3001",
      "api": "http://localhost:5000"
    },
    "endpoints": {
      "auth": {
        "register": "http://localhost:5000/api/auth/register",
        "login": "http://localhost:5000/api/auth/login"
      }
    }
  }
}
```

### Production API Status:
```bash
# After switching to production
{
  "data": {
    "environment": {
      "type": "production", 
      "isProduction": true
    },
    "urls": {
      "frontend": "https://iconicdigital.site",
      "api": "https://admin.iconicdigital.site"
    },
    "endpoints": {
      "auth": {
        "register": "https://admin.iconicdigital.site/api/auth/register",
        "login": "https://admin.iconicdigital.site/api/auth/login"
      }
    }
  }
}
```

## 🎯 **Usage Examples**

### Registration API Call:
```javascript
// Development environment
// Calls: http://localhost:5000/api/auth/register
await apiClient.register({
  name: 'MD SHAMIM SIDDIK',
  email: 'shamimtest@gmail.com',
  password: 'password123'
});

// Production environment  
// Calls: https://admin.iconicdigital.site/api/auth/register
await apiClient.register({
  name: 'MD SHAMIM SIDDIK',
  email: 'shamimtest@gmail.com', 
  password: 'password123'
});
```

### Campaign Management:
```javascript
// Development
// Calls: http://localhost:5000/api/campaigns
const campaigns = await apiClient.getCampaigns();

// Production
// Calls: https://admin.iconicdigital.site/api/campaigns
const campaigns = await apiClient.getCampaigns();
```

### User Management:
```javascript
// Development
// Calls: http://localhost:5000/api/users
const users = await apiClient.getUsers();

// Production
// Calls: https://admin.iconicdigital.site/api/users
const users = await apiClient.getUsers();
```

## 🔧 **Environment Variables Priority**

### Priority Order:
1. **`.env.local`** (highest priority)
2. **`.env.production`** / **`.env.development`**
3. **Default values** (lowest priority)

### Environment Variable Loading:
```javascript
// API Client automatically uses:
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
               process.env.NEXT_PUBLIC_BACKEND_URL || 
               'http://localhost:5000';
```

## 🚀 **Quick Commands**

### Environment Switching:
```bash
# Development mode
cp .env.development .env.local && bun run dev

# Production mode  
cp .env.production .env.local && bun run dev

# Check current configuration
curl http://localhost:3001/api/api-status
```

### API Testing:
```bash
# Test registration (will use current environment)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📋 **Environment Checklist**

### Development Setup:
- [ ] `.env.development` configured with localhost URLs
- [ ] `NEXT_PUBLIC_API_URL=http://localhost:5000`
- [ ] `NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001`
- [ ] API calls go to localhost

### Production Setup:
- [ ] `.env.production` configured with your domain URLs
- [ ] `NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site`
- [ ] `NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site`
- [ ] API calls go to your domain

## 🎉 **Results**

### ✅ **Environment-Based API Calls:**
- সব API calls এখন `process.env` থেকে URL নেয়
- Environment variables update করলে automatically API calls change হয়
- Development: `localhost:5000` থেকে API calls
- Production: `admin.iconicdigital.site` থেকে API calls

### ✅ **Dynamic Configuration:**
- API timeout, retry attempts environment variables থেকে
- CORS configuration environment-based
- External services URLs environment-based

### ✅ **Easy Environment Switching:**
- `.env.development` → localhost API calls
- `.env.production` → your domain API calls
- Server restart করলেই environment change হয়

---

## 🚀 **Ready for Your Domain!**

আপনার সব API calls এখন সম্পূর্ণভাবে environment-based:

- ✅ **Development**: `http://localhost:5000` থেকে API calls
- ✅ **Production**: `https://admin.iconicdigital.site` থেকে API calls  
- ✅ **Environment Switching**: `.env` file change করলেই API calls change হয়
- ✅ **Process.env Integration**: সব configuration `process.env` থেকে আসে

**Environment file update করলেই সব API connections আপনার domain থেকে হবে!** 🎯
