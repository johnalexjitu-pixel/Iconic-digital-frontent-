# 🚀 Quick Start Guide - SocialTrend Frontend

## ⚡ One-Command Setup

### Windows Users
```bash
# Double-click setup.bat or run in Command Prompt
setup.bat
```

### macOS/Linux Users
```bash
# Run in terminal
./setup.sh
```

### Manual Setup
```bash
# 1. Install Bun
powershell -c "irm bun.sh/install.ps1 | iex"  # Windows
curl -fsSL https://bun.sh/install | bash      # macOS/Linux

# 2. Install dependencies
bun install

# 3. Setup environment
cp .env.development .env.local

# 4. Start server
bun run dev
```

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Main App** | http://localhost:3001 | Frontend application |
| **Registration** | http://localhost:3001/auth/register | User registration |
| **Login** | http://localhost:3001/auth/login | User login |
| **Admin Dashboard** | http://localhost:3001/admin | Admin panel |
| **API Status** | http://localhost:3001/api/status | API health check |

## 🔗 External Connection

### API Base URL
```
Development: http://localhost:3001
Production: https://your-domain.com
```

### Key Endpoints
```
POST /api/auth/register    - User registration
POST /api/auth/login       - User login
GET  /api/users           - Get all users
GET  /api/campaigns       - Get all campaigns
GET  /api/transactions     - Get all transactions
```

### Example Integration
```javascript
// Connect from any external application
const API_BASE = 'http://localhost:3001';

// Register user
fetch(`${API_BASE}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 📁 Project Structure

```
iconic-digital-frontend/
├── src/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── auth/          # Authentication pages
│   │   ├── admin/         # Admin dashboard
│   │   └── page.tsx       # Main page
│   ├── components/        # React components
│   ├── lib/              # Utilities and config
│   └── models/           # Database models
├── .env.development      # Development config
├── .env.production       # Production config
├── .env.local           # Local environment
├── setup.sh             # Linux/macOS setup script
├── setup.bat            # Windows setup script
└── package.json         # Dependencies
```

## 🎯 Features

### ✅ Authentication System
- User registration with validation
- Secure login with bcrypt
- Session management
- Logout functionality

### ✅ CRUD Operations
- **Users**: Create, Read, Update, Delete
- **Campaigns**: Full campaign management
- **Transactions**: Complete transaction handling
- **Real-time Updates**: Live data refresh

### ✅ Admin Dashboard
- Statistics overview
- Data management interface
- Search and filtering
- Bulk operations

### ✅ API Integration
- RESTful API endpoints
- Environment-based configuration
- Error handling and logging
- CORS support for external connections

## 🔧 Environment Configuration

### Development (.env.development)
```env
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f
```

### Production (.env.production)
```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://your-frontend-domain.com
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital
NEXTAUTH_URL=https://your-frontend-domain.com
NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
bun run build
netlify deploy --prod --dir=out
```

### Docker
```bash
docker build -t socialtrend-frontend .
docker run -p 3001:3001 socialtrend-frontend
```

## 🔍 Testing

### Health Check
```bash
curl http://localhost:3001/api/status
```

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📚 Documentation Files

- **COMPLETE_SETUP_GUIDE.md** - Detailed setup instructions
- **API_DOCUMENTATION.md** - Complete API reference
- **OPERATIONAL_GUIDE.md** - CRUD operations guide
- **BACKEND_SETUP_GUIDE.md** - Backend integration guide

## 🆘 Troubleshooting

### Common Issues

1. **Port 3001 in use**
   ```bash
   npx kill-port 3001
   ```

2. **MongoDB connection failed**
   - Check MongoDB Atlas connection string
   - Verify network access

3. **Dependencies not installing**
   ```bash
   rm -rf node_modules bun.lockb
   bun install
   ```

4. **Environment variables not loading**
   - Ensure `.env.local` exists
   - Check variable names

### Debug Commands
```bash
# Check server status
curl http://localhost:3001/api/status

# Test database
curl http://localhost:3001/api/users

# View logs
bun run dev --verbose
```

## 🎉 Success Checklist

- [ ] Bun installed and working
- [ ] Dependencies installed
- [ ] Environment files created
- [ ] MongoDB connected
- [ ] Server running on port 3001
- [ ] Registration working
- [ ] Login working
- [ ] Admin dashboard accessible
- [ ] API endpoints responding
- [ ] External connections possible

---

## 🚀 Ready to Go!

আপনার SocialTrend frontend এখন সম্পূর্ণভাবে setup এবং external connections এর জন্য প্রস্তুত!

**Next Steps:**
1. Run setup script
2. Access http://localhost:3001
3. Test registration and login
4. Explore admin dashboard
5. Integrate with external applications

**Support:** Check documentation files for detailed guides and API reference.
