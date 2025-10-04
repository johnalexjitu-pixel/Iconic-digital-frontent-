# 🚀 Iconic Digital Frontend - Setup Instructions

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Bun** (v1.2.23+) - Already installed ✅
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)

## 📋 Setup Steps

### 1. Clone and Navigate to Project
```bash
cd "C:\Users\Luke\Desktop\Projects\iconicdigital\iconic-digital-frontend"
```

### 2. Install Dependencies
```bash
# Using Bun (recommended)
bun install

# OR using npm
npm install

# OR using yarn
yarn install
```

### 3. Environment Configuration

The `.env.local` file has been created with the following configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/iconic-digital

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Development Environment
NODE_ENV=development
```

**Important**: Update the `MONGODB_URI` if you're using MongoDB Atlas or a different MongoDB setup.

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Or start manually
   mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iconic-digital
   ```

### 5. Start Development Server

```bash
# Using Bun (recommended)
bun run dev

# OR using npm
npm run dev

# OR using npx
npx next dev
```

The server will start on `http://localhost:3000`

### 6. Access the Application

Open your browser and navigate to:
- **Local**: http://localhost:3000
- **Network**: http://0.0.0.0:3000 (accessible from other devices on your network)

## 🎯 Application Features

### Dashboard
- User stats (Account Balance, Campaigns, Commission, Withdrawal)
- Campaign preview video
- Quick launch campaign button

### Navigation
- **Home**: Dashboard overview
- **Services**: Campaign services
- **Campaign**: Campaign management
- **History**: Transaction history
- **Account**: User profile and settings

### Mock Data
The application comes with pre-configured mock data:
- Sample user: "gokazi" (Silver level)
- Sample campaigns: Taco Bell, Renault, Louis Philippe, Shiseido
- Transaction history and user statistics

## 🛠️ Available Scripts

```bash
# Development
bun run dev          # Start development server with Turbopack
npm run dev          # Alternative development command

# Production
bun run build        # Build for production
bun run start        # Start production server

# Code Quality
bun run lint         # Run TypeScript check and ESLint
bun run format       # Format code with Biome
```

## 🔧 Configuration Files

- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - Shadcn/ui configuration
- `.env.local` - Environment variables (created)

## 📱 Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **Package Manager**: Bun
- **Code Quality**: ESLint, Biome

## 🚨 Troubleshooting

### Common Issues

1. **Port 3000 already in use**:
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

2. **MongoDB connection issues**:
   - Ensure MongoDB is running
   - Check connection string in `.env.local`
   - Verify network access if using Atlas

3. **Dependencies not installing**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules bun.lockb
   bun install
   ```

4. **TypeScript errors**:
   ```bash
   # Check TypeScript configuration
   bunx tsc --noEmit
   ```

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure MongoDB is running and accessible
4. Check the `.env.local` configuration

## 🎉 You're Ready!

Once the development server is running, you can:
- View the dashboard at http://localhost:3000
- Explore the different pages via the bottom navigation
- Test the API endpoints
- Start developing new features

The application is fully functional with mock data, so you can immediately see how it works!
