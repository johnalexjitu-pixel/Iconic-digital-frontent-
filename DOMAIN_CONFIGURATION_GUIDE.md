# 🌐 Domain Configuration Guide - Iconic Digital

## 📋 Overview

আপনার SocialTrend frontend এখন `iconicdigital.site` domain এর জন্য সম্পূর্ণভাবে configured।

## 🔧 Domain Structure

### Main Domain Configuration
- **Frontend URL**: `https://iconicdigital.site`
- **Admin Dashboard**: `https://admin.iconicdigital.site`
- **API Backend**: `https://admin.iconicdigital.site/api`

## 🔄 Environment Configuration

### Development Environment (.env.development)
```env
# Development - Local Configuration
NODE_ENV=development
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Production Environment (.env.production)
```env
# Production - Iconic Digital Domain Configuration
NODE_ENV=production

# Frontend URLs - Main Domain
NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site
NEXT_PUBLIC_APP_URL=https://iconicdigital.site
NEXT_PUBLIC_API_BASE_URL=https://iconicdigital.site

# Backend Configuration - Admin Dashboard Subdomain
NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site
NEXT_PUBLIC_BACKEND_URL=https://admin.iconicdigital.site

# CORS Configuration
NEXT_PUBLIC_ALLOWED_ORIGINS=https://iconicdigital.site,https://www.iconicdigital.site,https://admin.iconicdigital.site

# External APIs - Admin Dashboard
NEXT_PUBLIC_PAYMENT_API_URL=https://admin.iconicdigital.site/api/payments
NEXT_PUBLIC_NOTIFICATION_API_URL=https://admin.iconicdigital.site/api/notifications

# File Upload - Main Domain
NEXT_PUBLIC_UPLOAD_URL=https://iconicdigital.site/api/upload

# Security
CORS_ORIGIN=https://iconicdigital.site
```

## 🚀 Domain Switching Commands

### Switch to Production (Iconic Digital Domain)
```bash
# Method 1: Automated script
bun run dev:prod

# Method 2: Manual switching
cp .env.production .env.local
bun run dev

# Method 3: Environment variable override
NODE_ENV=production NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site bun run dev
```

### Switch to Development (Localhost)
```bash
# Method 1: Automated script
bun run dev:local

# Method 2: Manual switching
cp .env.development .env.local
bun run dev
```

### Check Current Domain Configuration
```bash
# Check environment
bun run env:check

# Check via API
curl http://localhost:3001/api/env-status
```

## 📊 Domain Configuration Verification

### Environment Status API Response
```json
{
  "success": true,
  "data": {
    "environment": {
      "type": "production",
      "isProduction": true,
      "port": 3001,
      "host": "0.0.0.0"
    },
    "urls": {
      "frontend": "https://iconicdigital.site",
      "app": "https://iconicdigital.site", 
      "api": "https://admin.iconicdigital.site",
      "backend": "https://admin.iconicdigital.site"
    }.
    "cors": {
      "origins": [
        "https://iconicdigital.site",
        "https://www.iconicdigital.site", 
        "https://admin.iconicdigital.site"
      ],
      "defaultOrigin": "https://iconicdigital.site"
    },
    "services": {
      "payment": {
        "apiUrl": "https://admin.iconicdigital.site/api/payments"
      },
      "notification": {
        "apiUrl": "https://admin.iconicdigital.site/api/notifications"
      },
      "upload": {
        "url": "https://iconicdigital.site/api/upload"
      }
    }
  }
}
```

## 🌐 DNS Configuration Required

### Domain Setup Checklist
- [ ] **Main Domain**: `iconicdigital.site` pointed to your server
- [ ] **Admin Subdomain**: `admin.iconicdigital.site` pointed to your server  
- [ ] **SSL Certificates**: HTTPS enabled for all domains
- [ ] **CORS**: Allowed origins configured properly

### DNS Records Example
```
A Record:
iconicdigital.site → YOUR_SERVER_IP
admin.iconicdigital.site → YOUR_SERVER_IP

CNAME Record (if using subdomain):
admin.iconicdigital.site → iconicdigital.site
```

## 🔗 API Endpoints Structure

### Main Domain (Frontend)
```
https://iconicdigital.site/
├── /auth/register
├── /auth/login  
├── /dashboard
├── /campaign
├── /history
├── /account
└── /api/status
```

### Admin Dashboard Domain
```
https://admin.iconicdigital.site/
├── /api/users
├── /api/campaigns
├── /api/transactions
├── /api/auth/register
├── /api/auth/login
├── /api/payments
└── /api/notifications
```

## 🔧 Deployment Configuration

### Production Build Command
```bash
# Build for Iconic Digital domain
bun run build:prod

# Start production server
bun run start:prod
```

### Deployment Checklist
- [ ] Environment switched to production
- [ ] Domain configuration verified
- [ ] SSL certificates installed
- [ ] CORS configured for all domains
- [ ] Admin dashboard accessible at `admin.iconicdigital.site`
- [ ] Main frontend accessible at `iconicdigital.site`

## 🌍 Environment Variables Reference

### Frontend Configuration
```env
# Main Domain - Frontend
NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site
NEXT_PUBLIC_APP_URL=https://iconicdigital.site

# Admin Domain - Backend/API
NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site  
NEXT_PUBLIC_BACKEND_URL=https://admin.iconicdigital.site

# CORS - Allowed Origins
NEXT_PUBLIC_ALLOWED_ORIGINS=https://iconicdigital.site,https://www.iconicdigital.site,https://admin.iconicdigital.site
```

### External Integration Example
```javascript
// Dynamic API connection based on domain
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://admin.iconicdigital.site/api'
  : 'http://localhost:5000/api';

// Frontend URL
const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://iconicdigital.site'
  : 'http://localhost:3001';

// Example API call
fetch(`${API_BASE_URL}/users`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Origin': FRONTEND_URL
  }
});
```

## 🔒 Security Configuration

### CORS Headers
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            value: 'https://iconicdigital.site,https://admin.iconicdigital.site' 
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

### Environment-Specific Security
- **Development**: `http://localhost:3001` allowed
- **Production**: `https://iconicdigital.site`, `https://admin.iconicdigital.site` allowed

## 📱 Mobile/External Access

### Network Access
```bash
# Local network access
bun run dev -- -H 0.0.0.0

# Mobile access URL
http://YOUR_LOCAL_IP:3001

# External domain access
https://iconicdigital.site
https://admin.iconicdigital.site
```

## 🎯 Domain Testing

### Test Development Environment
```bash
bun run dev:local
# Access: http://localhost:3001
# API: http://localhost:5000
```

### Test Production Environment
```bash
bun run dev:prod  
# Access: https://iconicdigital.site
# Admin: https://admin.iconicdigital.site
```

### Verify Domain Configuration
```bash
# Check environment status
curl http://localhost:3001/api/env-status

# Expected production response:
{
  "urls": {
    "frontend": "https://iconicdigital.site",
    "api": "https://admin.iconicdigital.site"
  }
}
```

## 🚀 Quick Domain Setup

### Automatic Setup
```bash
# Run domain-configured setup
bun run dev:prod

# Verify configuration
bun run env:check
```

### Manual Domain Verification
```bash
# Check active configuration
cat .env.local | grep -E "(FRONTEND_URL|API_URL|BACKEND_URL)"

# Expected output for production:
# NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site
# NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site
```

## 📋 Domain Maintenance Checklist

### Pre-deployment
- [ ] Domain DNS records configured
- [ ] SSL certificates installed
- [ ] Environment switched to production
- [ ] Admin subdomain accessible
- [ ] CORS configured for all domains

### Post-deployment
- [ ] Main domain accessible
- [ ] Admin dashboard working
- [ ] API endpoints responding
- [ ] External integrations working
- [ ] Mobile access enabled

---

## 🎉 Iconic Digital Domain Ready!

আপনার SocialTrend frontend এখন সম্পূর্ণভাবে configured:

- ✅ **Main Domain**: `https://iconicdigital.site`
- ✅ **Admin Dashboard**: `https://admin.iconicdigital.site`
- ✅ **API Backend**: `https://admin.iconicdigital.site/api`
- ✅ **Environment Switching**: Development ↔ Production
- ✅ **External Connections**: CORS configured for all domains
- ✅ **Mobile Access**: Responsive design for all devices

**Usage Commands:**
- Development: `bun run dev:local`
- Production: `bun run dev:prod`
- Domain Check: `bun run env:check`

আপনার `iconicdigital.site` domain এর জন্য সবকিছু প্রস্তুত! 🚀
