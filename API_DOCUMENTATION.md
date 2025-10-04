# 📚 API Documentation - SocialTrend Frontend

## 🌐 Base URL
```
Development: http://localhost:3001
Production: https://your-domain.com
```

## 🔐 Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "referralCode": "ABC123" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "68e09ac5d30baad87b6d81b0",
    "name": "John Doe",
    "email": "john@example.com",
    "level": "Bronze",
    "membershipId": "29935",
    "referralCode": "9CNMVST9",
    "creditScore": 100,
    "accountBalance": 0,
    "totalEarnings": 0,
    "campaignsCompleted": 0,
    "createdAt": "2025-10-04T03:55:49.940Z"
  }
}
```

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "68e09ac5d30baad87b6d81b0",
    "name": "John Doe",
    "email": "john@example.com",
    "level": "Bronze",
    "membershipId": "29935",
    "referralCode": "9CNMVST9",
    "creditScore": 100,
    "accountBalance": 0,
    "totalEarnings": 0,
    "campaignsCompleted": 0,
    "dailyCheckIn": {
      "streak": 0,
      "daysClaimed": [],
      "lastCheckIn": null
    },
    "lastLogin": "2025-10-04T03:55:56.920Z",
    "createdAt": "2025-10-04T03:55:49.940Z"
  }
}
```

## 👥 User Management Endpoints

### GET /api/users
Get all users with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `level` (optional): Filter by membership level
- `search` (optional): Search by name, email, or membership ID

**Example:**
```
GET /api/users?page=1&limit=10&level=Gold&search=john
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68e09ac5d30baad87b6d81b0",
      "name": "John Doe",
      "email": "john@example.com",
      "level": "Gold",
      "membershipId": "29935",
      "accountBalance": 50000,
      "totalEarnings": 25000,
      "campaignsCompleted": 15,
      "createdAt": "2025-10-04T03:55:49.940Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### GET /api/users/[id]
Get user by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "68e09ac5d30baad87b6d81b0",
    "name": "John Doe",
    "email": "john@example.com",
    "level": "Gold",
    "membershipId": "29935",
    "referralCode": "9CNMVST9",
    "creditScore": 100,
    "accountBalance": 50000,
    "totalEarnings": 25000,
    "campaignsCompleted": 15,
    "dailyCheckIn": {
      "streak": 5,
      "daysClaimed": [1, 2, 3, 4, 5],
      "lastCheckIn": "2025-10-04T00:00:00.000Z"
    },
    "createdAt": "2025-10-04T03:55:49.940Z",
    "updatedAt": "2025-10-04T03:55:49.940Z"
  }
}
```

### PUT /api/users/[id]
Update user information.

**Request Body:**
```json
{
  "name": "John Smith",
  "level": "Silver",
  "accountBalance": 75000
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "68e09ac5d30baad87b6d81b0",
    "name": "John Smith",
    "email": "john@example.com",
    "level": "Silver",
    "membershipId": "29935",
    "accountBalance": 75000,
    "updatedAt": "2025-10-04T04:00:00.000Z"
  }
}
```

### DELETE /api/users/[id]
Delete user account.

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## 🎯 Campaign Management Endpoints

### GET /api/campaigns
Get all campaigns with filtering.

**Query Parameters:**
- `status` (optional): Filter by status (Active, Completed, Pending, Cancelled)
- `type` (optional): Filter by type (Social, Paid, Creative, Influencer)

**Example:**
```
GET /api/campaigns?status=Active&type=Social
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68e09adcd30baad87b6d81b4",
      "campaignId": "P1IT9189",
      "code": "6HFVFR",
      "brand": "Test Brand",
      "logo": "🏷️",
      "description": "Test campaign description",
      "type": "Social",
      "commissionRate": 10,
      "commissionAmount": 5000,
      "baseAmount": 50000,
      "profit": 5000,
      "taskCode": "6HFVFR",
      "status": "Active",
      "requirements": ["Post on social media", "Use hashtags"],
      "duration": 7,
      "maxParticipants": 100,
      "currentParticipants": 0,
      "startDate": "2025-10-04T00:00:00.000Z",
      "endDate": "2025-10-11T00:00:00.000Z",
      "isActive": true,
      "createdAt": "2025-10-04T03:56:12.103Z",
      "updatedAt": "2025-10-04T03:56:12.103Z"
    }
  ],
  "total": 1
}
```

### POST /api/campaigns
Create a new campaign.

**Request Body:**
```json
{
  "brand": "Nike",
  "logo": "👟",
  "description": "Nike shoe promotion campaign",
  "type": "Social",
  "commissionRate": 15,
  "commissionAmount": 7500,
  "baseAmount": 50000,
  "profit": 7500,
  "requirements": ["Post on Instagram", "Use #NikeShoes", "Tag @nike"],
  "duration": 14,
  "maxParticipants": 200,
  "startDate": "2025-10-05T00:00:00.000Z",
  "endDate": "2025-10-19T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Campaign created successfully",
  "data": {
    "_id": "68e09adcd30baad87b6d81b4",
    "campaignId": "P1IT9189",
    "code": "6HFVFR",
    "brand": "Nike",
    "logo": "👟",
    "description": "Nike shoe promotion campaign",
    "type": "Social",
    "commissionRate": 15,
    "commissionAmount": 7500,
    "baseAmount": 50000,
    "profit": 7500,
    "taskCode": "6HFVFR",
    "status": "Active",
    "requirements": ["Post on Instagram", "Use #NikeShoes", "Tag @nike"],
    "duration": 14,
    "maxParticipants": 200,
    "currentParticipants": 0,
    "startDate": "2025-10-05T00:00:00.000Z",
    "endDate": "2025-10-19T00:00:00.000Z",
    "isActive": true,
    "createdAt": "2025-10-04T03:56:12.103Z",
    "updatedAt": "2025-10-04T03:56:12.103Z"
  }
}
```

### GET /api/campaigns/[id]
Get campaign by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "68e09adcd30baad87b6d81b4",
    "campaignId": "P1IT9189",
    "code": "6HFVFR",
    "brand": "Nike",
    "logo": "👟",
    "description": "Nike shoe promotion campaign",
    "type": "Social",
    "commissionRate": 15,
    "commissionAmount": 7500,
    "baseAmount": 50000,
    "profit": 7500,
    "taskCode": "6HFVFR",
    "status": "Active",
    "requirements": ["Post on Instagram", "Use #NikeShoes", "Tag @nike"],
    "duration": 14,
    "maxParticipants": 200,
    "currentParticipants": 0,
    "startDate": "2025-10-05T00:00:00.000Z",
    "endDate": "2025-10-19T00:00:00.000Z",
    "isActive": true,
    "createdAt": "2025-10-04T03:56:12.103Z",
    "updatedAt": "2025-10-04T03:56:12.103Z"
  }
}
```

### PUT /api/campaigns/[id]
Update campaign.

**Request Body:**
```json
{
  "status": "Completed",
  "currentParticipants": 150,
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Campaign updated successfully",
  "data": {
    "_id": "68e09adcd30baad87b6d81b4",
    "campaignId": "P1IT9189",
    "status": "Completed",
    "currentParticipants": 150,
    "isActive": false,
    "updatedAt": "2025-10-04T04:00:00.000Z"
  }
}
```

### DELETE /api/campaigns/[id]
Delete campaign.

**Response:**
```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

## 💰 Transaction Management Endpoints

### GET /api/transactions
Get all transactions.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68e09ae5d30baad87b6d81b5",
      "transactionId": "TXN123456",
      "userId": "68e09ac5d30baad87b6d81b0",
      "type": "campaign_earning",
      "amount": 5000,
      "description": "Earning from Nike campaign",
      "campaignId": "68e09adcd30baad87b6d81b4",
      "status": "completed",
      "method": "bank_transfer",
      "reference": "REF123456",
      "metadata": {
        "campaignName": "Nike Shoe Promotion"
      },
      "createdAt": "2025-10-04T04:00:00.000Z",
      "updatedAt": "2025-10-04T04:00:00.000Z"
    }
  ]
}
```

### POST /api/transactions
Create a new transaction.

**Request Body:**
```json
{
  "userId": "68e09ac5d30baad87b6d81b0",
  "type": "campaign_earning",
  "amount": 5000,
  "description": "Earning from Nike campaign",
  "campaignId": "68e09adcd30baad87b6d81b4",
  "status": "completed",
  "method": "bank_transfer",
  "reference": "REF123456",
  "metadata": {
    "campaignName": "Nike Shoe Promotion"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "68e09ae5d30baad87b6d81b5",
    "transactionId": "TXN123456",
    "userId": "68e09ac5d30baad87b6d81b0",
    "type": "campaign_earning",
    "amount": 5000,
    "description": "Earning from Nike campaign",
    "campaignId": "68e09adcd30baad87b6d81b4",
    "status": "completed",
    "method": "bank_transfer",
    "reference": "REF123456",
    "metadata": {
      "campaignName": "Nike Shoe Promotion"
    },
    "createdAt": "2025-10-04T04:00:00.000Z",
    "updatedAt": "2025-10-04T04:00:00.000Z"
  }
}
```

### GET /api/transactions/[id]
Get transaction by ID.

### PUT /api/transactions/[id]
Update transaction.

### DELETE /api/transactions/[id]
Delete transaction.

## 📊 Status & Health Endpoints

### GET /api/status
Get application status and environment information.

**Response:**
```json
{
  "success": true,
  "data": {
    "environment": {
      "isDevelopment": true,
      "isProduction": false,
      "isTest": false
    },
    "api": {
      "frontend": "http://localhost:3001",
      "backend": "http://localhost:5000",
      "status": {
        "backendUrl": "http://localhost:5000",
        "isAvailable": false,
        "timestamp": "2025-10-04T03:52:43.557Z"
      }
    },
    "features": {
      "enableRealtime": false,
      "enableAnalytics": false
    },
    "timestamp": "2025-10-04T03:52:43.557Z"
  }
}
```

## 🔧 Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description",
  "timestamp": "2025-10-04T04:00:00.000Z"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## 🌐 CORS Configuration

For external connections, ensure CORS is properly configured:

```javascript
// next.config.js
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
};
```

## 📱 Usage Examples

### JavaScript/Node.js
```javascript
const API_BASE = 'http://localhost:3001';

// Register user
const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Get campaigns
const getCampaigns = async () => {
  const response = await fetch(`${API_BASE}/api/campaigns`);
  return response.json();
};
```

### Python
```python
import requests

API_BASE = 'http://localhost:3001'

# Register user
def register_user(user_data):
    response = requests.post(f'{API_BASE}/api/auth/register', json=user_data)
    return response.json()

# Get campaigns
def get_campaigns():
    response = requests.get(f'{API_BASE}/api/campaigns')
    return response.json()
```

### PHP
```php
<?php
$api_base = 'http://localhost:3001';

// Register user
function registerUser($userData) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $api_base . '/api/auth/register');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}
?>
```

## 🔒 Security Notes

1. **Authentication**: Currently uses localStorage for session management
2. **Password Hashing**: Uses bcrypt with salt rounds
3. **Input Validation**: Server-side validation on all endpoints
4. **CORS**: Configure appropriately for production
5. **Rate Limiting**: Consider implementing for production use

## 📞 Support

For API support or questions:
- Check the application logs for detailed error messages
- Verify environment variables are properly set
- Ensure MongoDB connection is working
- Test endpoints using curl or Postman

---

এই API documentation ব্যবহার করে আপনি যেকোনো external application থেকে SocialTrend frontend এর সাথে connect করতে পারবেন! 🚀
