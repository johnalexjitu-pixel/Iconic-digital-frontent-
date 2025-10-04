#!/bin/bash

# Vercel Deployment Script for Iconic Digital
# This script prepares and deploys the application to Vercel

echo "🚀 Starting Vercel Deployment for Iconic Digital..."

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

# Check if Vercel CLI is installed
check_vercel_cli() {
    print_status "Checking Vercel CLI installation..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed!"
        print_status "Installing Vercel CLI..."
        
        if command -v npm &> /dev/null; then
            npm install -g vercel
        elif command -v bun &> /dev/null; then
            bun add -g vercel
        else
            print_error "Neither npm nor bun is available. Please install Vercel CLI manually."
            exit 1
        fi
    else
        print_success "Vercel CLI is installed"
    fi
}

# Check if user is logged in to Vercel
check_vercel_auth() {
    print_status "Checking Vercel authentication..."
    
    if ! vercel whoami &> /dev/null; then
        print_warning "Not logged in to Vercel. Please login..."
        vercel login
    else
        print_success "Logged in to Vercel"
    fi
}

# Prepare environment for production
prepare_production_env() {
    print_status "Preparing production environment..."
    
    # Copy production environment
    cp .env.production .env.local
    print_success "Production environment configured"
    
    # Verify environment variables
    print_status "Verifying environment variables..."
    
    if [ ! -f ".env.local" ]; then
        print_error ".env.local file not found!"
        exit 1
    fi
    
    # Check critical environment variables
    if ! grep -q "NEXT_PUBLIC_FRONTEND_URL=https://iconicdigital.site" .env.local; then
        print_warning "Frontend URL not set to production domain"
    fi
    
    if ! grep -q "NEXT_PUBLIC_API_URL=https://admin.iconicdigital.site" .env.local; then
        print_warning "API URL not set to production domain"
    fi
    
    print_success "Environment variables verified"
}

# Build the application
build_application() {
    print_status "Building application for production..."
    
    # Clean previous build
    rm -rf .next
    print_status "Cleaned previous build"
    
    # Install dependencies
    print_status "Installing dependencies..."
    if command -v bun &> /dev/null; then
        bun install
    else
        npm install
    fi
    
    # Build application
    print_status "Building Next.js application..."
    if command -v bun &> /dev/null; then
        bun run build
    else
        npm run build
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Application built successfully"
    else
        print_error "Build failed!"
        exit 1
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Deploy to production
    vercel --prod --yes
    
    if [ $? -eq 0 ]; then
        print_success "Deployment successful!"
        print_status "Your application is now live on Vercel"
    else
        print_error "Deployment failed!"
        exit 1
    fi
}

# Display deployment information
show_deployment_info() {
    print_status "Deployment Information:"
    echo ""
    echo "🌐 Main Domain: https://iconicdigital.site"
    echo "🔧 Admin Dashboard: https://admin.iconicdigital.site"
    echo "📡 API Base URL: https://admin.iconicdigital.site/api"
    echo ""
    echo "📊 Environment Variables:"
    echo "  - NODE_ENV: production"
    echo "  - NEXT_PUBLIC_FRONTEND_URL: https://iconicdigital.site"
    echo "  - NEXT_PUBLIC_API_URL: https://admin.iconicdigital.site"
    echo "  - MONGODB_URI: Configured for production"
    echo ""
    echo "🔍 Test Endpoints:"
    echo "  - Registration: https://admin.iconicdigital.site/api/auth/register"
    echo "  - Login: https://admin.iconicdigital.site/api/auth/login"
    echo "  - Users: https://admin.iconicdigital.site/api/users"
    echo "  - Campaigns: https://admin.iconicdigital.site/api/campaigns"
    echo ""
    print_success "Deployment completed successfully!"
}

# Main deployment process
main() {
    echo "=========================================="
    echo "🚀 Iconic Digital Vercel Deployment"
    echo "=========================================="
    echo ""
    
    # Step 1: Check prerequisites
    check_vercel_cli
    check_vercel_auth
    
    # Step 2: Prepare environment
    prepare_production_env
    
    # Step 3: Build application
    build_application
    
    # Step 4: Deploy to Vercel
    deploy_to_vercel
    
    # Step 5: Show deployment info
    show_deployment_info
    
    echo ""
    echo "=========================================="
    print_success "🎉 Deployment Complete!"
    echo "=========================================="
}

# Run main function
main "$@"
