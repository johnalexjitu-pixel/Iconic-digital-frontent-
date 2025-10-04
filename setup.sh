#!/bin/bash

# SocialTrend Frontend - Quick Setup Script
# This script will set up the entire frontend application

echo "🚀 SocialTrend Frontend Setup Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Bun is installed
check_bun() {
    print_status "Checking Bun installation..."
    if command -v bun &> /dev/null; then
        BUN_VERSION=$(bun --version)
        print_success "Bun is installed: $BUN_VERSION"
        return 0
    else
        print_warning "Bun is not installed. Installing Bun..."
        install_bun
    fi
}

# Install Bun
install_bun() {
    print_status "Installing Bun..."
    
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        powershell -c "irm bun.sh/install.ps1 | iex"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        curl -fsSL https://bun.sh/install | bash
    else
        # Linux
        curl -fsSL https://bun.sh/install | bash
    fi
    
    # Add Bun to PATH
    export PATH="$HOME/.bun/bin:$PATH"
    
    if command -v bun &> /dev/null; then
        print_success "Bun installed successfully!"
    else
        print_error "Failed to install Bun. Please install manually."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "bun.lockb" ]; then
        bun install
    elif [ -f "package-lock.json" ]; then
        npm install
    elif [ -f "yarn.lock" ]; then
        yarn install
    else
        print_warning "No lock file found. Installing with Bun..."
        bun install
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully!"
    else
        print_error "Failed to install dependencies."
        exit 1
    fi
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Create .env.development if it doesn't exist
    if [ ! -f ".env.development" ]; then
        cat > .env.development << EOF
# Development Environment Configuration
NODE_ENV=development

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f

# Features
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEBUG=true
EOF
        print_success "Created .env.development"
    fi
    
    # Create .env.local if it doesn't exist
    if [ ! -f ".env.local" ]; then
        cp .env.development .env.local
        print_success "Created .env.local"
    fi
    
    # Create .env.production if it doesn't exist
    if [ ! -f ".env.production" ]; then
        cat > .env.production << EOF
# ==========================================
# PRODUCTION ENVIRONMENT CONFIGURATION - Iconic Digital
# ==========================================

# Environment Type
NODE_ENV=production

# Server Configuration
PORT=3001
HOST=0.0.0.0

# Frontend URLs - Iconic Digital Domains
NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site
NEXT_PUBLIC_APP_URL=https://iconicdigital.site
NEXT_PUBLIC_API_BASE_URL=https://iconicdigital.site

# Backend Configuration - Admin Dashboard Domain
NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site
NEXT_PUBLIC_BACKEND_URL=https://admin.iconicdigital.site

# Database Configuration
MONGODB_URI=mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital
DATABASE_NAME=iconic-digital-prod

# Authentication
NEXTAUTH_URL=https://iconicdigital.site
NEXTAUTH_SECRET=92586b0f1b72cb5d3d95a7d2bbc52caedb5c608fab35754278a3ad1daeea215f

# Features & Services
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_ENABLE_MOCK_DATA=false

# CORS Configuration - Iconic Digital Domains
NEXT_PUBLIC_ALLOWED_ORIGINS=https://iconicdigital.site,https://www.iconicdigital.site,https://admin.iconicdigital.site

# External APIs - Admin Dashboard
NEXT_PUBLIC_PAYMENT_API_URL=https://admin.iconicdigital.site/api/payments
NEXT_PUBLIC_NOTIFICATION_API_URL=https://admin.iconicdigital.site/api/notifications

# File Upload - Main Domain
NEXT_PUBLIC_UPLOAD_URL=https://iconicdigital.site/api/upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# Logging
LOG_LEVEL=info
LOG_FILE=logs/production.log
API_REQUEST_LOG=false

# Security - Iconic Digital Domain
CORS_ORIGIN=https://iconicdigital.site
TRUSTED_PROXIES=1
EOF
        print_success "Created .env.production"
    fi
}

# Test database connection
test_database() {
    print_status "Testing database connection..."
    
    # Create a simple test script
    cat > test-db.js << 'EOF'
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://iconicdigital:iconicdigital@iconicdigital.t5nr2g9.mongodb.net/?retryWrites=true&w=majority&appName=iconicdigital';

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
EOF
    
    # Run the test
    if bun run test-db.js 2>/dev/null || node test-db.js 2>/dev/null; then
        print_success "Database connection successful!"
        rm test-db.js
    else
        print_warning "Database connection failed. Please check your MongoDB URI."
        rm test-db.js
    fi
}

# Start development server
start_server() {
    print_status "Starting development server..."
    print_success "Setup completed! Starting server..."
    print_status "Server will be available at: http://localhost:3001"
    print_status "Press Ctrl+C to stop the server"
    
    # Start the server
    bun run dev
}

# Main setup function
main() {
    echo "=========================================="
    echo "🚀 SocialTrend Frontend Setup"
    echo "=========================================="
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    # Run setup steps
    check_bun
    install_dependencies
    setup_environment
    test_database
    
    echo "=========================================="
    print_success "Setup completed successfully!"
    echo "=========================================="
    
    # Ask if user wants to start the server
    read -p "Do you want to start the development server now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_server
    else
        print_status "You can start the server later with: bun run dev"
        print_status "Access the application at: http://localhost:3001"
    fi
}

# Run main function
main "$@"
