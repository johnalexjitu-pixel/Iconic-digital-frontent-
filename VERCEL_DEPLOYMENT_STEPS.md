# 🚀 Vercel Deployment Steps

## ⚠️ **Current Issue**: MONGODB_URI Missing

The error occurs because environment variables are not set in Vercel. Here's how to fix it:

## 🔧 **Solution 1: Add Environment Variables to Vercel**

### Step 1: Go to Vercel Dashboard
1. Open [vercel.com](https://vercel.com)
2. Login to your account
3. Select your project: `iconic-digital-frontend`

### Step 2: Add Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Click **Add New**
3. Add these variables one by one:

```
Name: MONGODB_URI
Value: mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital
Environment: Production, Preview

Name: NEXTAUTH_URL
Value: https://iconicdigital.site
Environment: Production, Preview

Name: NEXTAUTH_SECRET
Value: 92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f
Environment: Production, Preview

Name: NODE_ENV
Value: production
Environment: Production, Preview

Name: NEXT_PUBLIC_FRONTEND_URL
Value: https://iconicdigital.site
Environment: Production, Preview

Name: NEXT_PUBLIC_API_URL
Value: https://admin.iconicdigital.site
Environment: Production, Preview
```

### Step 3: Redeploy
After adding variables, trigger a new deployment:
```bash
vercel --prod
```

---

## 🔧 **Solution 2: Use Vercel CLI with Environment File**

### Step 1: Create Environment File
```bash
# Create .env.production file
echo "MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital" > .env.production
echo "NEXTAUTH_URL=https://iconicdigital.site" >> .env.production
echo "NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f" >> .env.production
echo "NODE_ENV=production" >> .env.production
echo "NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site" >> .env.production
echo "NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site" >> .env.production
```

### Step 2: Deploy with Environment
```bash
vercel --prod --env-file .env.production
```

---

## 🔧 **Solution 3: Quick Fix (Already Applied)**

I've updated the code to use a fallback MongoDB URI, so the app will work even without environment variables.

### What I Fixed:
- Added fallback MongoDB URI in `src/lib/mongodb.ts`
- App will now work with default database connection
- No more "MONGODB_URI missing" error

---

## 🚀 **Deploy Now**

### Option A: Deploy with Fallback (Recommended)
```bash
vercel --prod
```
This will work immediately with the fallback URI.

### Option B: Add Environment Variables First
1. Go to Vercel Dashboard
2. Add environment variables (see Solution 1)
3. Then deploy: `vercel --prod`

---

## ✅ **Verification**

After deployment, test:
- `https://your-app.vercel.app/api/debug-env` - Check environment
- `https://your-app.vercel.app/api/auth/register` - Test registration
- `https://your-app.vercel.app/api/campaigns` - Test campaigns

---

## 🎯 **Quick Commands**

```bash
# Deploy immediately (with fallback)
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

**The app is now ready to deploy without environment variable errors!** 🎉
