#!/bin/bash

# Local Development Startup Script
echo "🚀 Starting BuilderIQ Local Development Environment"
echo "===================================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start database and Redis
echo "📦 Starting PostgreSQL and Redis..."
docker-compose up -d db redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if database is accessible
if docker-compose exec -T db pg_isready -U builderiq > /dev/null 2>&1; then
    echo "✅ Database is ready"
else
    echo "❌ Database failed to start. Check Docker logs."
    exit 1
fi
echo ""

# Check if migrations need to be run
echo "🔍 Checking database migrations..."
echo "Run migrations manually if this is your first time:"
echo "  docker-compose exec -T db psql -U builderiq -f /migrations/001_init_schema.sql"
echo ""

# Start backend in background
echo "🔧 Starting Backend API..."
cd backend
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..
echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend..."
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""

echo "===================================================="
echo "✅ All services are running!"
echo ""
echo "📍 Access URLs:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "📝 To stop all services:"
echo "   Press Ctrl+C, then run: docker-compose down"
echo ""
echo "===================================================="

# Wait for user interrupt
wait
