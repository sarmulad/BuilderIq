#!/bin/bash

# Railway Deployment Helper Script
echo "🚂 BuilderIQ Railway Deployment"
echo "================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo "Install it with: npm i -g @railway/cli"
    echo "Or: brew install railway"
    exit 1
fi

echo "✅ Railway CLI found"
echo ""

# Login check
echo "Checking Railway login status..."
if railway whoami &> /dev/null; then
    echo "✅ Logged in to Railway"
else
    echo "❌ Not logged in. Running 'railway login'..."
    railway login
fi
echo ""

# Create or link project
echo "Do you want to:"
echo "1. Create a new Railway project"
echo "2. Link to existing project"
read -p "Enter choice (1 or 2): " choice
echo ""

if [ "$choice" = "1" ]; then
    echo "Creating new Railway project..."
    railway init
else
    echo "Linking to existing project..."
    railway link
fi
echo ""

# Deploy backend
echo "📦 Deploying Backend Service..."
read -p "Press Enter to continue..."
cd backend
railway up
echo "✅ Backend deployed"
cd ..
echo ""

# Deploy worker
echo "📦 Deploying Scraper Worker..."
read -p "Press Enter to continue..."
cd scraper
railway up
echo "✅ Worker deployed"
cd ..
echo ""

echo "================================"
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Railway dashboard"
echo "2. Check service logs for any errors"
echo "3. Get your backend URL from Railway dashboard"
echo "4. Update NEXT_PUBLIC_API_URL in Vercel"
