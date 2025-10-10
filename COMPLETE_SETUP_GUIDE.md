# 🚀 Complete Setup Guide - SocialTrend Frontend

## 📋 Overview

এই guide আপনাকে সাহায্য করবে অন্য কোনো site বা code editor থেকে এই frontend application এর সাথে connect করতে।

## 🛠️ Prerequisites

### Required Software
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Bun** (v1.2.23+) - [Installation guide below](#bun-installation)
- **MongoDB** - [MongoDB Atlas](https://www.mongodb.com/atlas) (Recommended) or Local MongoDB
- **Git** - [Download here](https://git-scm.com/)

### System Requirements
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 2GB free space
- **Internet**: Stable internet connection

## 🔧 Installation Process

### Step 1: Install Bun

#### Windows
```bash
# PowerShell (Run as Administrator)
powershell -c "irm bun.sh/install.ps1 | iex"

# Or using npm
npm install -g bun
```

#### macOS/Linux
```bash
# Using curl
curl -fsSL https://bun.sh/install | bash

# Or using npm
npm install -g bun
```

#### Verify Installation
```bash
bun --version
# Should show: 1.2.23 or higher
```

### Step 2: Clone/Download Project

#### Option A: Git Clone
```bash
git clone <your-repository-url>
cd iconic-digital-frontend
```

#### Option B: Download ZIP
1. Download project ZIP file
2. Extract to desired location
3. Open terminal in project directory

### Step 3: Install Dependencies

```bash
# Using Bun (Recommended)
bun install

# OR using npm
npm install

# OR using yarn
yarn install
```

### Step 4: Environment Setup

#### Create Environment Files

**Development Environment** (`.env.development`):
```env
# Development Environment Configuration
NODE_ENV=development

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital

# Authentication
AUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f

# Features
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEBUG=true
```

**Production Environment** (`.env.production`):
```env
# Production Environment Configuration
NODE_ENV=production

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-frontend-domain.com
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com

# Database
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital

# Authentication
AUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f

# Features
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_DEBUG=false
```

**Local Environment** (`.env.local`):
```bash
# Copy development environment for local use
cp .env.development .env.local
```

### Step 5: Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Get connection string
5. Update `MONGODB_URI` in environment files

#### Option B: Local MongoDB
```bash
# Windows
# Download and install MongoDB Community Edition
# Start MongoDB service
net start MongoDB

# macOS (using Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Step 6: Start Development Server

```bash
# Using Bun (Recommended)
bun run dev

# OR using npm
npm run dev

# OR using npx
npx next dev
```

**Server will start on:**
- Local: http://localhost:3001
- Network: http://0.0.0.0:3001

## 🌐 Access Points

### Frontend URLs
- **Main Application**: http://localhost:3001
- **Registration**: http://localhost:3001/auth/register
- **Login**: http://localhost:3001/auth/login
- **Admin Dashboard**: http://localhost:3001/admin

### API Endpoints
- **Status Check**: http://localhost:3001/api/status
- **User Management**: http://localhost:3001/api/users
- **Campaign Management**: http://localhost:3001/api/campaigns
- **Transaction Management**: http://localhost:3001/api/transactions
- **Authentication**: http://localhost:3001/api/auth/register, http://localhost:3001/api/auth/login

## 🔗 External Connection

### For Other Sites/Applications

#### API Integration
```javascript
// Example: Connect from another application
const API_BASE_URL = 'http://localhost:3001';

// User registration
const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// User login
const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

// Get campaigns
const getCampaigns = async () => {
  const response = await fetch(`${API_BASE_URL}/api/campaigns`);
  return response.json();
};
```

#### CORS Configuration
If connecting from different domains, update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  // ... rest of your config
};

module.exports = nextConfig;
```

### For Code Editors (VS Code, etc.)

#### VS Code Setup
1. Install extensions:
   - **ES7+ React/Redux/React-Native snippets**
   - **Tailwind CSS IntelliSense**
   - **TypeScript Importer**
   - **MongoDB for VS Code**

2. Open project:
   ```bash
   code .
   ```

3. Configure settings (`.vscode/settings.json`):
   ```json
   {
     "typescript.preferences.importModuleSpecifier": "relative",
     "emmet.includeLanguages": {
       "javascript": "javascriptreact"
     },
     "tailwindCSS.includeLanguages": {
       "typescript": "typescript",
       "typescriptreact": "typescriptreact"
     }
   }
   ```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build project
bun run build

# Deploy
netlify deploy --prod --dir=out
```

### Option 3: Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t socialtrend-frontend .
docker run -p 3001:3001 socialtrend-frontend
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process on port 3001
npx kill-port 3001

# Or use different port
bun run dev -- -p 3002
```

#### 2. MongoDB Connection Issues
```bash
# Check MongoDB status
mongosh --eval "db.adminCommand('ping')"

# Test connection string
node -e "console.log('Testing MongoDB connection...')"
```

#### 3. Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install

# Or with npm
rm -rf node_modules package-lock.json
npm install
```

#### 4. Environment Variables Not Loading
```bash
# Check if .env.local exists
ls -la .env*

# Verify environment variables
node -e "console.log(process.env.MONGODB_URI)"
```

### Debug Commands

```bash
# Check server status
curl http://localhost:3001/api/status

# Test database connection
curl http://localhost:3001/api/users

# Check environment
echo $NODE_ENV

# View logs
bun run dev --verbose
```

## 📱 Mobile/Responsive Testing

### Local Network Access
```bash
# Start server on all interfaces
bun run dev -- -H 0.0.0.0

# Access from mobile device
# http://YOUR_LOCAL_IP:3001
```

### Mobile Development
```bash
# Install mobile development tools
npm install -g @expo/cli

# Test on mobile
expo start --web
```

## 🔐 Security Considerations

### Production Security
1. **Change default secrets**:
   ```env
   NEXTAUTH_SECRET=your-unique-secret-here
   ```

2. **Enable HTTPS**:
   ```javascript
   // next.config.js
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: [
             {
               key: 'Strict-Transport-Security',
               value: 'max-age=31536000; includeSubDomains',
             },
           ],
         },
       ];
     },
   };
   ```

3. **Environment Variables**:
   - Never commit `.env.local` to version control
   - Use different secrets for different environments
   - Rotate secrets regularly

## 📊 Monitoring & Analytics

### Health Check Endpoint
```bash
# Check application health
curl http://localhost:3001/api/status
```

### Performance Monitoring
```bash
# Install monitoring tools
npm install -g clinic

# Run performance analysis
clinic doctor -- node server.js
```

## 🎯 Quick Start Commands

```bash
# Complete setup in one go
git clone <repository-url> && \
cd iconic-digital-frontend && \
bun install && \
cp .env.development .env.local && \
bun run dev
```

## 📞 Support

### Getting Help
1. **Check logs**: Look at terminal output for errors
2. **Test endpoints**: Use curl or Postman to test APIs
3. **Verify environment**: Ensure all environment variables are set
4. **Check dependencies**: Make sure all packages are installed

### Useful Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🎉 Success Checklist

- [ ] Bun installed and working
- [ ] Dependencies installed successfully
- [ ] Environment files created
- [ ] MongoDB connection established
- [ ] Development server running
- [ ] Registration working
- [ ] Login working
- [ ] Admin dashboard accessible
- [ ] API endpoints responding
- [ ] External connections possible

আপনার SocialTrend frontend এখন সম্পূর্ণভাবে setup এবং external connections এর জন্য প্রস্তুত! 🚀
