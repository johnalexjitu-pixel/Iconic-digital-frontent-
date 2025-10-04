@echo off
setlocal enabledelayedexpansion

REM SocialTrend Frontend - Quick Setup Script for Windows
REM This script will set up the entire frontend application

echo.
echo ==========================================
echo 🚀 SocialTrend Frontend Setup Starting...
echo ==========================================
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Function to check Bun installation
echo [INFO] Checking Bun installation...
bun --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('bun --version') do set BUN_VERSION=%%i
    echo [SUCCESS] Bun is installed: !BUN_VERSION!
) else (
    echo [WARNING] Bun is not installed. Installing Bun...
    echo [INFO] Installing Bun...
    powershell -c "irm bun.sh/install.ps1 | iex"
    
    REM Add Bun to PATH for current session
    set "PATH=%PATH%;%USERPROFILE%\.bun\bin"
    
    REM Verify installation
    bun --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo [SUCCESS] Bun installed successfully!
    ) else (
        echo [ERROR] Failed to install Bun. Please install manually.
        pause
        exit /b 1
    )
)

REM Install dependencies
echo.
echo [INFO] Installing dependencies...
if exist "bun.lockb" (
    bun install
) else if exist "package-lock.json" (
    npm install
) else if exist "yarn.lock" (
    yarn install
) else (
    echo [WARNING] No lock file found. Installing with Bun...
    bun install
)

if %errorlevel% equ 0 (
    echo [SUCCESS] Dependencies installed successfully!
) else (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
)

REM Setup environment files
echo.
echo [INFO] Setting up environment files...

REM Create .env.development if it doesn't exist
if not exist ".env.development" (
    (
        echo # Development Environment Configuration
        echo NODE_ENV=development
        echo.
        echo # API Configuration
        echo NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
        echo NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
        echo.
        echo # Database
        echo MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true^&w=majority^&appName=iconicdigital
        echo.
        echo # NextAuth
        echo NEXTAUTH_URL=http://localhost:3001
        echo NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f
        echo.
        echo # Features
        echo NEXT_PUBLIC_ENABLE_REALTIME=true
        echo NEXT_PUBLIC_ENABLE_ANALYTICS=false
        echo NEXT_PUBLIC_DEBUG=true
    ) > .env.development
    echo [SUCCESS] Created .env.development
)

REM Create .env.local if it doesn't exist
if not exist ".env.local" (
    copy .env.development .env.local >nul
    echo [SUCCESS] Created .env.local
)

REM Create .env.production if it doesn't exist
if not exist ".env.production" (
    (
        echo # ==========================================
        echo # PRODUCTION ENVIRONMENT CONFIGURATION - Iconic Digital
        echo # ==========================================
        echo.
        echo # Environment Type
        echo NODE_ENV=production
        echo.
        echo # Server Configuration
        echo PORT=3001
        echo HOST=0.0.0.0
        echo.
        echo # Frontend URLs - Iconic Digital Domains
        echo NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site
        echo NEXT_PUBLIC_APP_URL=https://iconicdigital.site
        echo NEXT_PUBLIC_API_BASE_URL=https://iconicdigital.site
        echo.
        echo # Backend Configuration - Admin Dashboard Domain
        echo NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site
        echo NEXT_PUBLIC_BACKEND_URL=https://admin.iconicdigital.site
        echo.
        echo # Database Configuration
        echo MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true^&w=majority^&appName=iconicdigital
        echo DATABASE_NAME=iconic-digital-prod
        echo.
        echo # Authentication
        echo NEXTAUTH_URL=https://iconicdigital.site
        echo NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f
        echo.
        echo # Features & Services
        echo NEXT_PUBLIC_ENABLE_REALTIME=true
        echo NEXT_PUBLIC_ENABLE_ANALYTICS=true
        echo NEXT_PUBLIC_ENABLE_DEBUG=false
        echo NEXT_PUBLIC_ENABLE_MOCK_DATA=false
        echo.
        echo # CORS Configuration - Iconic Digital Domains
        echo NEXT_PUBLIC_ALLOWED_ORIGINS=https://iconicdigital.site,https://www.iconicdigital.site,https://admin.iconicdigital.site
        echo.
        echo # External APIs - Admin Dashboard
        echo NEXT_PUBLIC_PAYMENT_API_URL=https://admin.iconicdigital.site/api/payments
        echo NEXT_PUBLIC_NOTIFICATION_API_URL=https://admin.iconicdigital.site/api/notifications
        echo.
        echo # File Upload - Main Domain
        echo NEXT_PUBLIC_UPLOAD_URL=https://iconicdigital.site/api/upload
        echo MAX_FILE_SIZE=10485760
        echo ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx
        echo.
        echo # Logging
        echo LOG_LEVEL=info
        echo LOG_FILE=logs/production.log
        echo API_REQUEST_LOG=false
        echo.
        echo # Security - Iconic Digital Domain
        echo CORS_ORIGIN=https://iconicdigital.site
        echo TRUSTED_PROXIES=1
    ) > .env.production
    echo [SUCCESS] Created .env.production
)

REM Test database connection
echo.
echo [INFO] Testing database connection...

REM Create a simple test script
(
    echo const mongoose = require^('mongoose'^);
    echo.
    echo const MONGODB_URI = process.env.MONGODB_URI ^|^| 'mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true^&w=majority^&appName=iconicdigital';
    echo.
    echo async function testConnection^(^) {
    echo   try {
    echo     console.log^('🔄 Connecting to MongoDB...'^);
    echo     await mongoose.connect^(MONGODB_URI^);
    echo     console.log^('✅ MongoDB connection successful!'^);
    echo.
    echo     const collections = await mongoose.connection.db.listCollections^(^).toArray^(^);
    echo     console.log^('📁 Available collections:', collections.map^(c =^> c.name^)^);
    echo.
    echo     await mongoose.disconnect^(^);
    echo     console.log^('🔌 Disconnected from MongoDB'^);
    echo     process.exit^(0^);
    echo   } catch ^(error^) {
    echo     console.error^('❌ MongoDB connection failed:', error.message^);
    echo     process.exit^(1^);
    echo   }
    echo }
    echo.
    echo testConnection^(^);
) > test-db.js

REM Run the test
bun run test-db.js 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Database connection successful!
    del test-db.js
) else (
    node test-db.js 2>nul
    if %errorlevel% equ 0 (
        echo [SUCCESS] Database connection successful!
        del test-db.js
    ) else (
        echo [WARNING] Database connection failed. Please check your MongoDB URI.
        del test-db.js
    )
)

echo.
echo ==========================================
echo [SUCCESS] Setup completed successfully!
echo ==========================================
echo.

REM Ask if user wants to start the server
set /p start_server="Do you want to start the development server now? (y/n): "
if /i "%start_server%"=="y" (
    echo.
    echo [INFO] Starting development server...
    echo [SUCCESS] Server will be available at: http://localhost:3001
    echo [INFO] Press Ctrl+C to stop the server
    echo.
    bun run dev
) else (
    echo.
    echo [INFO] You can start the server later with: bun run dev
    echo [INFO] Access the application at: http://localhost:3001
    echo.
    pause
)
