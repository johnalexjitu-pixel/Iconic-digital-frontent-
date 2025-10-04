@echo off
REM Vercel Deployment Script for Iconic Digital (Windows)
REM This script prepares and deploys the application to Vercel

echo.
echo ==========================================
echo 🚀 Iconic Digital Vercel Deployment
echo ==========================================
echo.

REM Check if Vercel CLI is installed
echo [INFO] Checking Vercel CLI installation...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Vercel CLI is not installed!
    echo [INFO] Installing Vercel CLI...
    
    REM Try to install with npm first
    npm install -g vercel >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Vercel CLI with npm
        echo Please install Vercel CLI manually: npm install -g vercel
        pause
        exit /b 1
    )
    echo [SUCCESS] Vercel CLI installed
) else (
    echo [SUCCESS] Vercel CLI is installed
)

REM Check if user is logged in to Vercel
echo [INFO] Checking Vercel authentication...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Not logged in to Vercel. Please login...
    vercel login
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to login to Vercel
        pause
        exit /b 1
    )
) else (
    echo [SUCCESS] Logged in to Vercel
)

REM Prepare environment for production
echo [INFO] Preparing production environment...
if not exist ".env.production" (
    echo [ERROR] .env.production file not found!
    pause
    exit /b 1
)

copy .env.production .env.local >nul
echo [SUCCESS] Production environment configured

REM Verify environment variables
echo [INFO] Verifying environment variables...
findstr /C:"NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site" .env.local >nul
if %errorlevel% neq 0 (
    echo [WARNING] Frontend URL not set to production domain
)

findstr /C:"NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site" .env.local >nul
if %errorlevel% neq 0 (
    echo [WARNING] API URL not set to production domain
)

echo [SUCCESS] Environment variables verified

REM Clean previous build
echo [INFO] Cleaning previous build...
if exist ".next" rmdir /s /q ".next" >nul 2>&1
echo [INFO] Cleaned previous build

REM Install dependencies
echo [INFO] Installing dependencies...
if exist "bun.lockb" (
    bun install >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies with bun
        pause
        exit /b 1
    )
) else (
    npm install >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies with npm
        pause
        exit /b 1
    )
)
echo [SUCCESS] Dependencies installed

REM Build application
echo [INFO] Building Next.js application...
if exist "bun.lockb" (
    bun run build >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed with bun!
        pause
        exit /b 1
    )
) else (
    npm run build >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed with npm!
        pause
        exit /b 1
    )
)
echo [SUCCESS] Application built successfully

REM Deploy to Vercel
echo [INFO] Deploying to Vercel...
vercel --prod --yes
if %errorlevel% neq 0 (
    echo [ERROR] Deployment failed!
    pause
    exit /b 1
)

echo [SUCCESS] Deployment successful!
echo [INFO] Your application is now live on Vercel

REM Display deployment information
echo.
echo ==========================================
echo 📊 Deployment Information
echo ==========================================
echo.
echo 🌐 Main Domain: https://iconicdigital.site
echo 🔧 Admin Dashboard: https://admin.iconicdigital.site
echo 📡 API Base URL: https://admin.iconicdigital.site/api
echo.
echo 📊 Environment Variables:
echo   - NODE_ENV: production
echo   - NEXT_PUBLIC_FRONTEND_URL: https://iconicdigital.site
echo   - NEXT_PUBLIC_API_URL: https://admin.iconicdigital.site
echo   - MONGODB_URI: Configured for production
echo.
echo 🔍 Test Endpoints:
echo   - Registration: https://admin.iconicdigital.site/api/auth/register
echo   - Login: https://admin.iconicdigital.site/api/auth/login
echo   - Users: https://admin.iconicdigital.site/api/users
echo   - Campaigns: https://admin.iconicdigital.site/api/campaigns
echo.
echo ==========================================
echo [SUCCESS] 🎉 Deployment Complete!
echo ==========================================
echo.
pause
