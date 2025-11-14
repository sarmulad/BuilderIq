#!/bin/bash

echo "🚀 BuilderIQ Setup Script"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your actual values!"
    echo ""
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Install scraper dependencies
echo "📦 Installing scraper dependencies..."
cd scraper
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Run 'docker-compose up' to start all services"
echo "3. Visit http://localhost:3000 for frontend"
echo "4. Visit http://localhost:8000/docs for API documentation"
echo ""
