#!/bin/bash

# Teams Clone Production Startup Script
# For VPS deployment with exposed ports

echo "🚀 Starting Teams Clone Production Server..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "ecosystem.config.js" ]; then
    echo "❌ Please run this script from the teams-clone root directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Create necessary directories
mkdir -p logs backend/data

# Install dependencies if node_modules doesn't exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm ci --production && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm ci --production && cd ..
fi

# Build frontend if dist doesn't exist
if [ ! -d "frontend/dist" ]; then
    echo "🔨 Building frontend for production..."
    cd frontend && npm run build && cd ..
fi

# Stop any existing instances
echo "🛑 Stopping any existing instances..."
pm2 delete teams-clone-backend teams-clone-frontend 2>/dev/null || true

# Start services with PM2
echo "🚀 Starting production services..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Display status
echo ""
echo "✅ Teams Clone is now running!"
echo ""
echo "📊 Application Status:"
pm2 status

echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://0.0.0.0:3001"
echo "   Backend API: http://0.0.0.0:5000"
echo "   Health Check: http://0.0.0.0:5000/health"

echo ""
echo "📋 Useful Commands:"
echo "   pm2 status              - Check application status"
echo "   pm2 logs                - View application logs"
echo "   pm2 restart all         - Restart all services"
echo "   pm2 stop all            - Stop all services"
echo "   sudo ufw allow 3001     - Allow frontend port"
echo "   sudo ufw allow 5000     - Allow backend port"

echo ""
echo "🔒 Security Note:"
echo "   Make sure to configure your firewall to allow ports 3001 and 5000"
echo "   Consider using a reverse proxy (nginx) for production"
echo "   Set strong JWT_SECRET in backend/.env.production"