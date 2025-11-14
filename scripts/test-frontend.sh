#!/bin/bash

# Test Frontend Health Check Script
echo "🧪 Testing BuilderIQ Frontend..."
echo ""

# Get frontend URL from environment or use default
FRONTEND_URL=${1:-"http://localhost:3000"}

echo "Testing: $FRONTEND_URL"
echo "========================"
echo ""

# Test homepage
echo "1. Testing homepage..."
homepage_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$homepage_code" = "200" ]; then
    echo "✅ Homepage loads successfully"
else
    echo "❌ Homepage failed to load (HTTP $homepage_code)"
fi
echo ""

# Test auth pages
echo "2. Testing login page..."
login_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/auth/login")
if [ "$login_code" = "200" ]; then
    echo "✅ Login page accessible"
else
    echo "❌ Login page not accessible (HTTP $login_code)"
fi
echo ""

echo "3. Testing signup page..."
signup_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/auth/signup")
if [ "$signup_code" = "200" ]; then
    echo "✅ Signup page accessible"
else
    echo "❌ Signup page not accessible (HTTP $signup_code)"
fi
echo ""

# Test search page
echo "4. Testing search page..."
search_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/search")
if [ "$search_code" = "200" ]; then
    echo "✅ Search page accessible"
else
    echo "❌ Search page not accessible (HTTP $search_code)"
fi
echo ""

# Test pricing page
echo "5. Testing pricing page..."
pricing_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/pricing")
if [ "$pricing_code" = "200" ]; then
    echo "✅ Pricing page accessible"
else
    echo "❌ Pricing page not accessible (HTTP $pricing_code)"
fi
echo ""

echo "========================"
echo "🎉 Frontend testing complete!"
echo ""
echo "Next steps:"
echo "- Open $FRONTEND_URL in your browser"
echo "- Test user registration and login"
echo "- Verify API connection in browser console"
