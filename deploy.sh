#!/bin/bash

# Teams Clone Deployment Script
# This script sets up the production environment and starts the application

echo "🚀 Starting Teams Clone Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Create logs directory
mkdir -p logs

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm ci --production
cd ..

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd frontend
npm ci --production

# Build frontend for production
echo "🔨 Building frontend for production..."
npm run build
cd ..

# Start services with PM2
echo "🚀 Starting services with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 to start on system boot
echo "🔧 Setting up PM2 startup..."
pm2 startup

# Display status
echo "✅ Deployment complete!"
echo ""
echo "📊 Application Status:"
pm2 status

echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://$(hostname -I | awk '{print $1}'):3001"
echo "   Backend API: http://$(hostname -I | awk '{print $1}'):5000"
echo "   Health Check: http://$(hostname -I | awk '{print $1}'):5000/health"

echo ""
echo "📋 Useful Commands:"
echo "   pm2 status              - Check application status"
echo "   pm2 logs                - View application logs"
echo "   pm2 restart all         - Restart all services"
echo "   pm2 stop all            - Stop all services"
echo "   pm2 delete all          - Remove all services from PM2"