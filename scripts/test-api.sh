#!/bin/bash

# Test API Health Check Script
echo "🧪 Testing BuilderIQ API..."
echo ""

# Get API URL from environment or use default
API_URL=${1:-"http://localhost:8000"}

echo "Testing: $API_URL"
echo "========================"
echo ""

# Test health endpoint
echo "1. Testing /health endpoint..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo "✅ Health check passed"
    echo "$body" | jq '.'
else
    echo "❌ Health check failed (HTTP $http_code)"
    echo "$body"
fi
echo ""

# Test API docs
echo "2. Testing /docs endpoint..."
docs_code=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/docs")
if [ "$docs_code" = "200" ]; then
    echo "✅ API documentation available at $API_URL/docs"
else
    echo "❌ API docs not available (HTTP $docs_code)"
fi
echo ""

# Test CORS
echo "3. Testing CORS headers..."
cors_headers=$(curl -s -I -X OPTIONS "$API_URL/api/v1/incentives" \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: GET" | grep -i "access-control")

if [ ! -z "$cors_headers" ]; then
    echo "✅ CORS headers present"
    echo "$cors_headers"
else
    echo "❌ CORS headers missing"
fi
echo ""

# Test auth endpoint
echo "4. Testing /api/v1/auth/register endpoint..."
register_response=$(curl -s -w "\n%{http_code}" \
    -X POST "$API_URL/api/v1/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }')

register_code=$(echo "$register_response" | tail -n1)
if [ "$register_code" = "200" ] || [ "$register_code" = "400" ]; then
    echo "✅ Registration endpoint working (HTTP $register_code)"
else
    echo "❌ Registration endpoint error (HTTP $register_code)"
fi
echo ""

echo "========================"
echo "🎉 API testing complete!"
echo ""
echo "Next steps:"
echo "- Visit $API_URL/docs for interactive API documentation"
echo "- Check backend logs for any errors"
echo "- Verify database connection in logs"
