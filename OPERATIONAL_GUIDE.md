# 🚀 Operational Guide - Complete CRUD System

## 📋 Overview

আপনার SocialTrend application এখন একটি সম্পূর্ণ operational system যেখানে account registration থেকে শুরু করে সব dynamic data Dashboard থেকে CRUD operations করা যায়।

## 🔐 Authentication System

### Registration Flow
1. **User Registration**: `/auth/register`
   - Full name, email, password validation
   - Referral code support
   - Automatic membership ID generation
   - Password hashing with bcrypt

2. **User Login**: `/auth/login`
   - Email/password authentication
   - Session management (localStorage)
   - Automatic redirect to dashboard

### API Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
```

## 🏗️ CRUD Operations

### 1. User Management

#### API Endpoints
```
GET    /api/users           - Get all users (with pagination, search, filtering)
POST   /api/users           - Create new user (Admin)
GET    /api/users/[id]      - Get user by ID
PUT    /api/users/[id]      - Update user
DELETE /api/users/[id]      - Delete user
```

#### Features
- **Pagination**: Page-based data loading
- **Search**: Name, email, membership ID search
- **Filtering**: Filter by membership level
- **Validation**: Email uniqueness, required fields
- **Security**: Password exclusion from responses

### 2. Campaign Management

#### API Endpoints
```
GET    /api/campaigns           - Get campaigns (with filtering)
POST   /api/campaigns           - Create new campaign
GET    /api/campaigns/[id]      - Get campaign details
PUT    /api/campaigns/[id]      - Update campaign
DELETE /api/campaigns/[id]      - Delete campaign
```

#### Features
- **Auto-generation**: Campaign ID, code, task code
- **Status Management**: Active, Completed, Pending, Cancelled
- **Participant Tracking**: Current vs max participants
- **Commission Calculation**: Automatic profit calculation

### 3. Transaction Management

#### API Endpoints
```
GET    /api/transactions           - Get transactions
POST   /api/transactions           - Create transaction
GET    /api/transactions/[id]      - Get transaction details
PUT    /api/transactions/[id]      - Update transaction
DELETE /api/transactions/[id]      - Delete transaction
```

#### Features
- **Transaction Types**: Campaign earning, withdrawal, deposit, daily bonus, referral bonus
- **Status Tracking**: Completed, processing, failed, cancelled
- **Reference System**: Unique transaction IDs
- **Metadata Support**: Flexible data storage

## 🎛️ Admin Dashboard

### Features
- **Real-time Statistics**: User count, active campaigns, total transactions, earnings
- **Data Management**: Full CRUD operations for all entities
- **Search & Filter**: Advanced filtering capabilities
- **Bulk Operations**: Mass data management
- **Export Functionality**: Data export capabilities

### Dashboard Sections
1. **Users Tab**
   - View all users with pagination
   - Search by name, email, membership ID
   - Filter by membership level
   - Edit/Delete user operations

2. **Campaigns Tab**
   - View all campaigns
   - Filter by status and type
   - Create new campaigns
   - Edit/Delete campaign operations

3. **Transactions Tab**
   - View all transactions
   - Filter by type and status
   - Transaction history
   - Edit/Delete transaction operations

## 🔧 Technical Implementation

### Database Models
```typescript
// User Model
interface IUser {
  name: string;
  email: string;
  password: string;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  membershipId: string;
  referralCode: string;
  creditScore: number;
  accountBalance: number;
  totalEarnings: number;
  campaignsCompleted: number;
  dailyCheckIn: {
    streak: number;
    daysClaimed: number[];
  };
  withdrawalInfo?: {
    method: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    branch: string;
    documentsUploaded: boolean;
  };
}

// Campaign Model
interface ICampaign {
  campaignId: string;
  code: string;
  brand: string;
  logo: string;
  description: string;
  type: 'Social' | 'Paid' | 'Creative' | 'Influencer';
  commissionRate: number;
  commissionAmount: number;
  baseAmount: number;
  profit: number;
  taskCode: string;
  status: 'Active' | 'Completed' | 'Pending' | 'Cancelled';
  requirements: string[];
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// Transaction Model
interface ITransaction {
  transactionId: string;
  userId: string;
  type: 'campaign_earning' | 'withdrawal' | 'deposit' | 'daily_bonus' | 'referral_bonus';
  amount: number;
  description: string;
  campaignId?: string;
  status: 'completed' | 'processing' | 'failed' | 'cancelled';
  method?: string;
  reference?: string;
  metadata?: { [key: string]: any };
}
```

### API Client
- **Environment-based configuration**
- **Automatic retry mechanism**
- **Error handling and logging**
- **Timeout management**
- **Fallback to mock data**

## 🚀 Usage Instructions

### 1. Start the Application
```bash
# Development
bun run dev
# Access: http://localhost:3001
```

### 2. User Registration
1. Go to `/auth/register`
2. Fill in registration form
3. Account automatically created with Bronze level
4. Redirected to login page

### 3. User Login
1. Go to `/auth/login`
2. Enter credentials
3. Redirected to dashboard
4. User data stored in localStorage

### 4. Admin Operations
1. Go to `/admin`
2. Select appropriate tab (Users/Campaigns/Transactions)
3. Use CRUD operations:
   - **Create**: Click "Add" button
   - **Read**: View data in tables
   - **Update**: Click edit button
   - **Delete**: Click delete button

### 5. Data Management
- **Search**: Use search functionality
- **Filter**: Apply filters for specific data
- **Pagination**: Navigate through large datasets
- **Refresh**: Update data in real-time

## 📊 Data Flow

```
Registration → Login → Dashboard → CRUD Operations
     ↓              ↓         ↓           ↓
   Database    Session    User Data   Admin Panel
     ↓              ↓         ↓           ↓
   MongoDB    localStorage  API Calls  Real-time Updates
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Mongoose ODM
- **XSS Protection**: React built-in protection
- **CSRF Protection**: Next.js built-in protection

## 📱 User Experience

### Authentication Flow
- **Seamless Registration**: One-click account creation
- **Quick Login**: Fast authentication
- **Session Persistence**: Stay logged in
- **Secure Logout**: Clear session data

### Dashboard Experience
- **Real-time Updates**: Live data refresh
- **Responsive Design**: Mobile-friendly interface
- **Intuitive Navigation**: Easy-to-use interface
- **Error Handling**: User-friendly error messages

## 🎯 Next Steps

1. **Test All Operations**: Verify CRUD functionality
2. **Add More Features**: Extend functionality as needed
3. **Deploy to Production**: Set up production environment
4. **Monitor Performance**: Track system performance
5. **User Feedback**: Collect and implement user feedback

## 🛠️ Development Commands

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run linting
bun run lint

# Format code
bun run format
```

আপনার application এখন সম্পূর্ণভাবে operational এবং সব dynamic data management করার জন্য প্রস্তুত! 🎉
