#!/bin/bash

# NingClean API Test Script
# Jalankan ini di terminal untuk test endpoint API

BASE_URL="http://localhost:4000/api"

echo "========================================"
echo "  NingClean API Test Script"
echo "========================================"
echo ""

# Test 1: Health Check
echo "📊 Test 1: Health Check"
echo "GET $BASE_URL"
curl -s "$BASE_URL"
echo ""
echo ""

# Test 2: List Services (Public)
echo "📋 Test 2: List Services (Public)"
echo "GET $BASE_URL/services"
curl -s "$BASE_URL/services" | head -100
echo ""
echo ""

# Test 3: Create User (Jika belum ada)
echo "📝 Test 3: Register User"
echo "POST $BASE_URL/auth/register"
REGISTER_RESP=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "name": "Test User",
    "password": "testpassword123"
  }')
echo "$REGISTER_RESP"
echo ""

# Extract token
TOKEN=$(echo "$REGISTER_RESP" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
echo "🔑 Token: ${TOKEN:0:30}..."
echo ""

# Test 4: Login
echo "🔓 Test 4: Login"
echo "POST $BASE_URL/auth/login"
LOGIN_RESP=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpassword123"
  }')
echo "$LOGIN_RESP"
echo ""

# Re-extract token from login
TOKEN=$(echo "$LOGIN_RESP" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

# Test 5: Get Profile (Requires Auth)
if [ -n "$TOKEN" ]; then
  echo "👤 Test 5: Get User Profile (Authenticated)"
  echo "GET $BASE_URL/auth/me"
  curl -s "$BASE_URL/auth/me" \
    -H "Authorization: Bearer $TOKEN"
  echo ""
else
  echo "❌ Test 5: No token found, skipping authenticated test"
fi
echo ""

# Test 6: Create Booking (Public)
echo "📅 Test 6: Create Booking (Public)"
echo "POST $BASE_URL/bookings"
BOOKING_RESP=$(curl -s -X POST "$BASE_URL/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test Customer",
      "email": "customer@example.com",
      "phone": "+628123456789"
    },
    "serviceDate": "'"$(date -d '+1 day' '+%Y-%m-%d')"'",
    "serviceTime": "09:00",
    "address": "Jl. Test No. 123, Jakarta",
    "area": "Jakarta",
    "items": [
      {
        "serviceId": "placeholder-service-id",
        "quantity": 1
      }
    ],
    "totalAmount": 250000
  }')
echo "$BOOKING_RESP"
echo ""

# Test 7: Get Bookings (Requires Auth)
if [ -n "$TOKEN" ]; then
  echo "📚 Test 7: Get Bookings (Authenticated)"
  echo "GET $BASE_URL/bookings"
  curl -s "$BASE_URL/bookings" \
    -H "Authorization: Bearer $TOKEN" | head -100
echo ""
fi
echo ""

# Test 8: Check Supabase Config (Custom endpoint)
echo "🔧 Test 8: Check Supabase Configuration"
echo "GET $BASE_URL/admin/stats"
if [ -n "$TOKEN" ]; then
  curl -s "$BASE_URL/admin/stats" \
    -H "Authorization: Bearer $TOKEN" | head -100
else
  echo "⚠️  Skipped - requires authentication"
fi
echo ""

echo ""
echo "========================================"
echo "  Test Complete!"
echo "========================================"
echo ""
echo "📝 Notes:"
echo "- Test 1 (Health): Harus return status JSON"
echo "- Test 2 (Services): Harus return array services"
echo "- Test 3 (Register): Buat user baru atau error 'Email already exists'"
echo "- Test 4 (Login): Harus return token"
echo "- Test 5 (Profile): Harus return user data"
echo "- Test 6 (Booking): Harus create booking atau error validasi"
echo "- Test 7 (Bookings): Harus return list bookings"
echo "- Test 8 (Admin): Cek dashboard stats"
