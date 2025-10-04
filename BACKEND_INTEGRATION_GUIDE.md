# Backend Integration Guide for Iconic Digital Frontend

## Overview
This guide provides step-by-step instructions for integrating the Iconic Digital frontend with a backend server. The frontend is designed to work with any backend that implements the required API endpoints.

## Prerequisites
- Node.js 18+ installed
- MongoDB database
- Backend server (Express.js, Fastify, or similar)
- JWT authentication library
- File upload handling (multer, formidable, etc.)

## Quick Start

### 1. Environment Setup
Create a `.env.local` file in your frontend project:

```env
# Backend Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/iconic-digital

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Environment
NODE_ENV=development

# CORS
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000
```

### 2. Backend Server Requirements

#### Required Dependencies
```bash
npm install express mongoose cors helmet morgan dotenv bcryptjs jsonwebtoken multer
```

#### Basic Express Server Setup
```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/users', require('./routes/users'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Database Models

### User Model
```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  level: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
  },
  membershipId: {
    type: String,
    unique: true,
    required: true
  },
  referralCode: {
    type: String,
    unique: true,
    required: true
  },
  creditScore: {
    type: Number,
    default: 750
  },
  accountBalance: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  campaignsCompleted: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  dailyCheckIn: {
    streak: {
      type: Number,
      default: 0
    },
    daysClaimed: [{
      type: Number,
      min: 1,
      max: 31
    }]
  },
  withdrawalInfo: {
    method: String,
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    branch: String,
    documentsUploaded: {
      type: Boolean,
      default: false
    },
    uploadedDocuments: [{
      name: String,
      size: Number,
      type: String,
      lastModified: Number
    }]
  },
  withdrawalPassword: String,
  avatar: String
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate membership ID
userSchema.pre('save', function(next) {
  if (this.isNew && !this.membershipId) {
    this.membershipId = 'MEM' + Date.now().toString(36).toUpperCase();
  }
  next();
});

// Generate referral code
userSchema.pre('save', function(next) {
  if (this.isNew && !this.referralCode) {
    this.referralCode = 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
```

### Campaign Model
```javascript
// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  reward: {
    type: Number,
    required: true,
    min: 0
  },
  participants: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  requirements: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Campaign', campaignSchema);
```

### Transaction Model
```javascript
// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'earning'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
```

## API Routes Implementation

### Authentication Routes
```javascript
// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      referralCode
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          level: user.level,
          membershipId: user.membershipId,
          referralCode: user.referralCode,
          accountBalance: user.accountBalance,
          totalEarnings: user.totalEarnings,
          campaignsCompleted: user.campaignsCompleted,
          lastLogin: user.lastLogin,
          dailyCheckIn: user.dailyCheckIn,
          avatar: user.avatar,
          createdAt: user.createdAt
        },
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          level: user.level,
          accountBalance: user.accountBalance,
          totalEarnings: user.totalEarnings
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

module.exports = router;
```

### User Routes
```javascript
// routes/user.js
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const allowedFields = ['dailyCheckIn', 'withdrawalInfo', 'accountBalance', 'totalEarnings'];
    const updateFields = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

module.exports = router;
```

### Campaign Routes
```javascript
// routes/campaigns.js
const express = require('express');
const Campaign = require('../models/Campaign');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all campaigns
router.get('/', auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'active' })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// Get specific campaign
router.get('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

module.exports = router;
```

### Transaction Routes
```javascript
// routes/transactions.js
const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user transactions
router.get('/', auth, async (req, res) => {
  try {
    const { type, status, limit = 20, offset = 0 } = req.query;
    
    const filter = { userId: req.user.userId };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// Create transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, method, status, description, metadata } = req.body;

    const transaction = new Transaction({
      userId: req.user.userId,
      type,
      amount,
      method,
      status,
      description,
      metadata
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

module.exports = router;
```

### File Upload Routes
```javascript
// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/documents';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPG, JPEG) are allowed'));
    }
  }
});

// Upload documents
router.post('/document', auth, upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      id: file.filename,
      name: file.originalname,
      url: `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/documents/${file.filename}`,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date()
    }));

    res.json({
      success: true,
      data: {
        uploadedFiles,
        totalFiles: uploadedFiles.length,
        totalSize: uploadedFiles.reduce((sum, file) => sum + file.size, 0)
      },
      message: 'Files uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Upload failed',
      message: error.message
    });
  }
});

module.exports = router;
```

### Authentication Middleware
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    req.user = { userId: user._id, email: user.email };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

module.exports = auth;
```

## Environment Variables for Backend

Create a `.env` file in your backend project:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/iconic-digital

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads
```

## Testing the Integration

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test API Endpoints
Use Postman or curl to test:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","referralCode":"REF123456"}'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get user profile (with token)
curl -X GET http://localhost:5000/api/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Production Deployment

### Backend Deployment (Railway/Render/Heroku)
1. Set environment variables in your hosting platform
2. Deploy your backend code
3. Update frontend environment variables with production backend URL

### Frontend Deployment (Vercel)
1. Set environment variables in Vercel dashboard
2. Deploy using `vercel --prod`

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS is properly configured in backend
   - Check ALLOWED_ORIGINS environment variable

2. **Authentication Errors**
   - Verify JWT_SECRET is set in backend
   - Check token format in Authorization header

3. **Database Connection Issues**
   - Verify MONGODB_URI is correct
   - Ensure MongoDB is running

4. **File Upload Issues**
   - Check file size limits
   - Verify upload directory permissions

### Debug Mode
Enable debug logging in frontend:

```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## Support

For additional help:
- Check the API documentation
- Review the frontend code in `src/lib/api-client.ts`
- Test with Postman collection
- Check browser network tab for API calls

---

**Last Updated**: January 2024
**Version**: 1.0.0
