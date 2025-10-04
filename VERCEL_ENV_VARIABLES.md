# 🌐 Vercel Environment Variables

## 📋 Complete Environment Variables for Vercel Dashboard

Copy these variables and add them to your Vercel project settings:

### 🔧 **Production Environment Variables**

```env
# Database Configuration
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital

# Authentication
NEXTAUTH_URL=https://iconicdigital.site
NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f

# Environment
NODE_ENV=production

# Frontend URLs
NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site
NEXT_PUBLIC_APP_URL=https://iconicdigital.site

# Backend/API URLs
NEXT_PUBLIC_BACKEND_URL=https://admin.iconicdigital.site
NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site

# Features
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_ENABLE_MOCK_DATA=false

# API Configuration
API_TIMEOUT=15000
API_RETRY_ATTEMPTS=5

# CORS Configuration
NEXT_PUBLIC_ALLOWED_ORIGINS=https://iconicdigital.site,https://admin.iconicdigital.site
CORS_ORIGIN=https://iconicdigital.site

# Logging
LOG_LEVEL=info
LOG_FILE=logs/production.log
API_REQUEST_LOG=false

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf

# External Services
NEXT_PUBLIC_PAYMENT_API_URL=https://admin.iconicdigital.site/api/payments
NEXT_PUBLIC_NOTIFICATION_API_URL=https://admin.iconicdigital.site/api/notifications
NEXT_PUBLIC_UPLOAD_URL=https://iconicdigital.site/api/upload
```

---

## 🚀 **How to Add to Vercel:**

### Step 1: Go to Vercel Dashboard
1. Open [vercel.com](https://vercel.com)
2. Select your project: `iconic-digital-frontend`
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Each Variable
For each variable above:
1. Click **Add New**
2. **Name**: Copy the variable name (e.g., `MONGODB_URI`)
3. **Value**: Copy the variable value
4. **Environment**: Select **Production** (and **Preview** if needed)
5. Click **Save**

### Step 3: Deploy
After adding all variables:
```bash
vercel --prod
```

---

## 🔍 **Variable Categories:**

### 🗄️ **Database**
- `MONGODB_URI` - MongoDB Atlas connection string

### 🔐 **Authentication**
- `NEXTAUTH_URL` - Frontend URL for auth
- `NEXTAUTH_SECRET` - Secret key for JWT

### 🌐 **URLs**
- `NEXT_PUBLIC_FRONTEND_URL` - Main frontend URL
- `NEXT_PUBLIC_API_URL` - API/Backend URL
- `NEXT_PUBLIC_APP_URL` - App URL

### ⚙️ **Features**
- `NEXT_PUBLIC_ENABLE_REALTIME` - Enable real-time updates
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable analytics
- `NEXT_PUBLIC_ENABLE_DEBUG` - Enable debug mode
- `NEXT_PUBLIC_ENABLE_MOCK_DATA` - Enable mock data

### 🔧 **API Settings**
- `API_TIMEOUT` - Request timeout (15 seconds)
- `API_RETRY_ATTEMPTS` - Retry attempts (5 times)

### 🛡️ **Security**
- `NEXT_PUBLIC_ALLOWED_ORIGINS` - CORS allowed origins
- `CORS_ORIGIN` - Default CORS origin

---

## ✅ **Verification:**

After deployment, test these endpoints:
- `https://iconicdigital.site/api/debug-env` - Check environment variables
- `https://iconicdigital.site/api/api-status` - Check API configuration
- `https://iconicdigital.site/api/auth/register` - Test user registration
- `https://iconicdigital.site/api/campaigns` - Test campaigns API

---

## 🎯 **Quick Copy-Paste:**

**Copy this entire block and paste into Vercel:**

```
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital
NEXTAUTH_URL=https://iconicdigital.site
NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f
NODE_ENV=production
NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site
NEXT_PUBLIC_APP_URL=https://iconicdigital.site
NEXT_PUBLIC_BACKEND_URL=https://admin.iconicdigital.site
NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
API_TIMEOUT=15000
API_RETRY_ATTEMPTS=5
NEXT_PUBLIC_ALLOWED_ORIGINS=https://iconicdigital.site,https://admin.iconicdigital.site
CORS_ORIGIN=https://iconicdigital.site
LOG_LEVEL=info
LOG_FILE=logs/production.log
API_REQUEST_LOG=false
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf
NEXT_PUBLIC_PAYMENT_API_URL=https://admin.iconicdigital.site/api/payments
NEXT_PUBLIC_NOTIFICATION_API_URL=https://admin.iconicdigital.site/api/notifications
NEXT_PUBLIC_UPLOAD_URL=https://iconicdigital.site/api/upload
```

**🎉 Ready for Vercel Deployment!**
