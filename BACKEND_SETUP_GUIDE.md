# 🚀 Backend Setup Guide - Iconic Digital Frontend

## 📋 Overview

এই frontend application এখন environment-based configuration ব্যবহার করে এবং আলাদা backend server এর সাথে কাজ করতে পারে।

## 🔧 Environment Configuration

### Development Environment (`.env.development`)
```env
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEBUG=true
```

### Production Environment (`.env.production`)
```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://your-frontend-domain.com
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital
NEXTAUTH_URL=https://your-frontend-domain.com
NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_DEBUG=false
```

## 🏗️ Architecture

```
Frontend (Next.js)     Backend (Express/Fastify)
     ↓                        ↓
http://localhost:3001  →  http://localhost:5000
     ↓                        ↓
   MongoDB Atlas Database
```

## 📡 API Endpoints

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/update` - Update user profile
- `GET /api/user/stats` - Get user statistics

### Campaign Endpoints
- `GET /api/campaigns` - Get campaigns list
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns/:id/join` - Join campaign

### Transaction Endpoints
- `GET /api/transactions` - Get transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/history` - Get transaction history

### Dashboard Endpoints
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get analytics data

### Health Check
- `GET /api/health` - Backend health check

## 🚀 Running the Application

### 1. Development Mode
```bash
# Copy development environment
cp .env.development .env.local

# Install dependencies
bun install

# Start frontend
bun run dev
```

### 2. Production Mode
```bash
# Copy production environment
cp .env.production .env.local

# Build and start
bun run build
bun run start
```

## 🔍 Testing Backend Connection

### Frontend Status Check
```bash
curl http://localhost:3001/api/status
```

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

## 📱 Frontend Features

### Environment Switcher Component
- Real-time backend connection status
- Environment information display
- Manual refresh capability

### API Client
- Automatic retry mechanism
- Environment-based configuration
- Error handling and logging
- Timeout management

### Fallback System
- Mock data when backend is unavailable
- Graceful degradation
- Development-friendly debugging

## 🛠️ Backend Server Requirements

আপনার backend server এ এই endpoints implement করতে হবে:

### Base URL: `http://localhost:5000`

```javascript
// Example Express.js setup
const express = require('express');
const app = express();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend server is running' });
});

// User endpoints
app.get('/api/user/profile', getUserProfile);
app.patch('/api/user/update', updateUserProfile);
app.get('/api/user/stats', getUserStats);

// Campaign endpoints
app.get('/api/campaigns', getCampaigns);
app.post('/api/campaigns', createCampaign);
app.get('/api/campaigns/:id', getCampaignDetails);
app.post('/api/campaigns/:id/join', joinCampaign);

// Transaction endpoints
app.get('/api/transactions', getTransactions);
app.post('/api/transactions', createTransaction);
app.get('/api/transactions/history', getTransactionHistory);

// Dashboard endpoints
app.get('/api/dashboard/stats', getDashboardStats);
app.get('/api/dashboard/analytics', getDashboardAnalytics);

app.listen(5000, () => {
  console.log('Backend server running on port 5000');
});
```

## 🧪 Testing Different Environments

### Test Development Environment
```bash
# Set development environment
cp .env.development .env.local
bun run dev
# Frontend: http://localhost:3001
# Backend: http://localhost:5000 (if running)
```

### Test Production Environment
```bash
# Set production environment
cp .env.production .env.local
bun run build
bun run start
# Frontend: https://your-domain.com
# Backend: https://your-backend-api.com
```

## 🔧 Configuration Files

- `src/lib/config.ts` - Main configuration
- `src/lib/api-client.ts` - API client with environment support
- `src/components/EnvironmentSwitcher.tsx` - Environment status component
- `.env.development` - Development settings
- `.env.production` - Production settings

## 📊 Monitoring

### Frontend Monitoring
- Environment status in UI
- API call logging (development)
- Error tracking and reporting

### Backend Monitoring
- Health check endpoint
- API response times
- Error logging

## 🚨 Troubleshooting

### Common Issues

1. **Backend not responding**:
   - Check if backend server is running on port 5000
   - Verify `NEXT_PUBLIC_BACKEND_URL` in environment file
   - Check network connectivity

2. **Environment not switching**:
   - Ensure correct `.env.local` file
   - Restart development server
   - Check environment variables

3. **API calls failing**:
   - Check backend server status
   - Verify API endpoints
   - Check CORS configuration

## 🎯 Next Steps

1. **Set up your backend server** with the required endpoints
2. **Configure environment variables** for your deployment
3. **Test the connection** using the status endpoint
4. **Deploy both frontend and backend** to your hosting platform

আপনার frontend এখন সম্পূর্ণভাবে environment-based এবং backend server এর সাথে কাজ করার জন্য প্রস্তুত! 🎉
