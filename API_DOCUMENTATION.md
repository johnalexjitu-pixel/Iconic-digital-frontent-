# Iconic Digital Frontend API Documentation

## Overview
This document provides comprehensive API documentation for the Iconic Digital frontend application. The API is designed to work with a backend server and includes environment-based configuration for different deployment scenarios.

## Table of Contents
1. [Environment Configuration](#environment-configuration)
2. [API Endpoints](#api-endpoints)
3. [Authentication](#authentication)
4. [User Management](#user-management)
5. [Campaign Management](#campaign-management)
6. [Transaction Management](#transaction-management)
7. [File Upload](#file-upload)
8. [Error Handling](#error-handling)
9. [Backend Integration](#backend-integration)

## Environment Configuration

### Required Environment Variables

#### Development (.env.development)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/iconic-digital-dev

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Environment
NODE_ENV=development

# URLs
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# CORS
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# External Services
NEXT_PUBLIC_PAYMENT_API_URL=http://localhost:5000/api/payments
NEXT_PUBLIC_NOTIFICATION_API_URL=http://localhost:5000/api/notifications
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5000/api/upload

# API Configuration
API_TIMEOUT=10000
API_RETRY_ATTEMPTS=3
```

#### Production (.env.production)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iconic-digital-prod

# Authentication
NEXTAUTH_URL=https://iconicdigital.site
NEXTAUTH_SECRET=your-production-secret-key

# Environment
NODE_ENV=production

# URLs
NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site
NEXT_PUBLIC_BACKEND_URL=https://api.iconicdigital.site
NEXT_PUBLIC_API_URL=https://api.iconicdigital.site/api
NEXT_PUBLIC_APP_URL=https://iconicdigital.site
NEXT_PUBLIC_API_BASE_URL=https://api.iconicdigital.site

# CORS
NEXT_PUBLIC_ALLOWED_ORIGINS=https://iconicdigital.site,https://admin.iconicdigital.site

# External Services
NEXT_PUBLIC_PAYMENT_API_URL=https://api.iconicdigital.site/api/payments
NEXT_PUBLIC_NOTIFICATION_API_URL=https://api.iconicdigital.site/api/notifications
NEXT_PUBLIC_UPLOAD_URL=https://api.iconicdigital.site/api/upload

# API Configuration
API_TIMEOUT=15000
API_RETRY_ATTEMPTS=5
```

## API Endpoints

### Base URL Configuration
- **Development**: `http://localhost:5000`
- **Production**: `https://api.iconicdigital.site`

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "referralCode": "REF123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "level": "Bronze",
      "membershipId": "MEM123456",
      "referralCode": "REF123456",
      "accountBalance": 0,
      "totalEarnings": 0,
      "campaignsCompleted": 0,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "dailyCheckIn": {
        "streak": 0,
        "daysClaimed": []
      },
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

#### POST /api/auth/login
Authenticate user and return access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "level": "Bronze",
      "accountBalance": 1000,
      "totalEarnings": 500
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

### User Management Endpoints

#### GET /api/user
Get current user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "level": "Bronze",
    "membershipId": "MEM123456",
    "referralCode": "REF123456",
    "creditScore": 750,
    "accountBalance": 1000,
    "totalEarnings": 500,
    "campaignsCompleted": 5,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "dailyCheckIn": {
      "streak": 3,
      "daysClaimed": [1, 2, 3]
    },
    "withdrawalInfo": {
      "method": "Bank Account",
      "accountHolderName": "John Doe",
      "bankName": "Example Bank",
      "accountNumber": "1234567890",
      "branch": "Main Branch",
      "documentsUploaded": true
    },
    "avatar": "avatar_url_here",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/user
Update user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "dailyCheckIn": {
    "streak": 4,
    "daysClaimed": [1, 2, 3, 4]
  },
  "withdrawalInfo": {
    "method": "Bank Account",
    "accountHolderName": "John Smith",
    "bankName": "New Bank",
    "accountNumber": "9876543210",
    "branch": "Downtown Branch",
    "documentsUploaded": true,
    "uploadedDocuments": [
      {
        "name": "id_document.jpg",
        "size": 1024000,
        "type": "image/jpeg",
        "lastModified": 1640995200000
      }
    ]
  },
  "accountBalance": 1500,
  "totalEarnings": 750
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Smith",
      "accountBalance": 1500,
      "totalEarnings": 750,
      "withdrawalInfo": {
        "method": "Bank Account",
        "accountHolderName": "John Smith",
        "bankName": "New Bank",
        "accountNumber": "9876543210",
        "branch": "Downtown Branch",
        "documentsUploaded": true
      }
    }
  },
  "message": "Profile updated successfully"
}
```

### Campaign Management Endpoints

#### GET /api/campaigns
Get list of available campaigns.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "campaign_id_1",
      "title": "Social Media Campaign",
      "description": "Promote our brand on social media platforms",
      "status": "active",
      "reward": 100,
      "participants": 25,
      "duration": 7,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "campaign_id_2",
      "title": "Product Review Campaign",
      "description": "Write honest reviews for our products",
      "status": "active",
      "reward": 150,
      "participants": 15,
      "duration": 14,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/campaigns
Create a new campaign (Admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Campaign",
  "description": "Campaign description",
  "reward": 200,
  "duration": 10,
  "requirements": "Must have 100+ followers"
}
```

#### GET /api/campaigns/:id
Get specific campaign details.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "campaign_id",
    "title": "Social Media Campaign",
    "description": "Promote our brand on social media platforms",
    "status": "active",
    "reward": 100,
    "participants": 25,
    "duration": 7,
    "requirements": "Must have 100+ followers",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Transaction Management Endpoints

#### GET /api/transactions
Get user's transaction history.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `type`: Filter by transaction type (deposit, withdrawal, earning)
- `status`: Filter by transaction status (pending, completed, failed)
- `limit`: Number of transactions to return (default: 20)
- `offset`: Number of transactions to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "transaction_id_1",
      "type": "deposit",
      "amount": 500,
      "status": "completed",
      "description": "Account deposit",
      "method": "Bank Transfer",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "metadata": {
        "bankName": "Example Bank",
        "transactionId": "TXN123456"
      }
    },
    {
      "_id": "transaction_id_2",
      "type": "earning",
      "amount": 100,
      "status": "completed",
      "description": "Campaign reward",
      "method": "Campaign Completion",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "metadata": {
        "campaignId": "campaign_id_1",
        "campaignTitle": "Social Media Campaign"
      }
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### POST /api/transactions
Create a new transaction.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "withdrawal",
  "amount": 200,
  "method": "Bank Account",
  "status": "processing",
  "description": "Withdrawal to Bank Account - 1234567890",
  "metadata": {
    "accountHolderName": "John Doe",
    "bankName": "Example Bank",
    "accountNumber": "1234567890",
    "branch": "Main Branch",
    "documentsUploaded": true,
    "documentCount": 2
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "transaction_id",
    "type": "withdrawal",
    "amount": 200,
    "status": "processing",
    "description": "Withdrawal to Bank Account - 1234567890",
    "method": "Bank Account",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "metadata": {
      "accountHolderName": "John Doe",
      "bankName": "Example Bank",
      "accountNumber": "1234567890",
      "branch": "Main Branch",
      "documentsUploaded": true,
      "documentCount": 2
    }
  },
  "message": "Transaction created successfully"
}
```

### File Upload Endpoints

#### POST /api/upload/document
Upload identity verification documents.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData with files:
- files: File[] (PNG, JPG, JPEG up to 10MB each)
- type: "identity_verification"
- userId: "user_id"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadedFiles": [
      {
        "id": "file_id_1",
        "name": "id_document.jpg",
        "url": "https://api.iconicdigital.site/uploads/documents/file_id_1.jpg",
        "size": 1024000,
        "type": "image/jpeg",
        "uploadedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalFiles": 1,
    "totalSize": 1024000
  },
  "message": "Files uploaded successfully"
}
```

#### POST /api/upload/avatar
Upload user avatar.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData with file:
- file: File (PNG, JPG, JPEG up to 5MB)
- userId: "user_id"
```

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "code": "ERROR_CODE"
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Access denied
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `429`: Too Many Requests
- `500`: Internal Server Error

## Backend Integration

### Database Schema

#### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  level: String (Bronze, Silver, Gold, Platinum),
  membershipId: String (unique),
  referralCode: String (unique),
  creditScore: Number,
  accountBalance: Number,
  totalEarnings: Number,
  campaignsCompleted: Number,
  lastLogin: Date,
  dailyCheckIn: {
    streak: Number,
    daysClaimed: [Number]
  },
  withdrawalInfo: {
    method: String,
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    branch: String,
    documentsUploaded: Boolean,
    uploadedDocuments: [Object]
  },
  withdrawalPassword: String (hashed),
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Campaign Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (active, inactive, completed),
  reward: Number,
  participants: Number,
  duration: Number,
  requirements: String,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

#### Transaction Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (User),
  type: String (deposit, withdrawal, earning),
  amount: Number,
  status: String (pending, processing, completed, failed),
  description: String,
  method: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Required Backend Endpoints

The backend server must implement the following endpoints:

1. **Authentication**
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `POST /api/auth/logout`
   - `POST /api/auth/refresh`

2. **User Management**
   - `GET /api/user`
   - `PUT /api/user`
   - `GET /api/users` (Admin)
   - `POST /api/users` (Admin)
   - `GET /api/users/:id` (Admin)
   - `PUT /api/users/:id` (Admin)
   - `DELETE /api/users/:id` (Admin)

3. **Campaign Management**
   - `GET /api/campaigns`
   - `POST /api/campaigns` (Admin)
   - `GET /api/campaigns/:id`
   - `PUT /api/campaigns/:id` (Admin)
   - `DELETE /api/campaigns/:id` (Admin)

4. **Transaction Management**
   - `GET /api/transactions`
   - `POST /api/transactions`
   - `GET /api/transactions/:id`
   - `PUT /api/transactions/:id` (Admin)
   - `DELETE /api/transactions/:id` (Admin)

5. **File Upload**
   - `POST /api/upload/document`
   - `POST /api/upload/avatar`

6. **Health Check**
   - `GET /api/health`
   - `GET /api/status`

### CORS Configuration
The backend must include proper CORS headers:

```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Authentication Middleware
Implement JWT-based authentication:

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

## Frontend Integration

### API Client Usage
```javascript
import { apiClient } from '@/lib/api-client';

// Register user
const response = await apiClient.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  referralCode: 'REF123456'
});

// Login user
const loginResponse = await apiClient.login({
  email: 'john@example.com',
  password: 'password123'
});

// Get user profile
const profile = await apiClient.getUserProfile();

// Update user profile
const updateResponse = await apiClient.updateUserProfile({
  accountBalance: 1500,
  totalEarnings: 750
});

// Get campaigns
const campaigns = await apiClient.getCampaigns();

// Create transaction
const transaction = await apiClient.createTransaction({
  type: 'withdrawal',
  amount: 200,
  method: 'Bank Account',
  status: 'processing',
  description: 'Withdrawal request'
});
```

### Environment Setup
1. Copy the appropriate environment file:
   ```bash
   cp .env.development .env.local
   ```

2. Update the environment variables with your backend URL:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://your-backend-url:port
   NEXT_PUBLIC_API_URL=http://your-backend-url:port/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

### API Testing with Postman
1. Import the provided Postman collection
2. Set up environment variables in Postman
3. Test all endpoints with proper authentication

### Frontend Testing
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run build
npm run build

# Start development server
npm run dev
```

## Deployment

### Vercel Deployment
1. Set environment variables in Vercel dashboard
2. Deploy using:
   ```bash
   vercel --prod
   ```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Support

For technical support or questions about the API:
- Email: support@iconicdigital.site
- Documentation: https://docs.iconicdigital.site
- GitHub: https://github.com/iconicdigital1/iconic-digital-frontend

---

**Last Updated**: January 2024
**Version**: 1.0.0