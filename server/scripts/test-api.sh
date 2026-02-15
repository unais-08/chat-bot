#!/bin/bash

# Chatbot Backend - Complete Test Suite
# Run this after starting the server to verify everything works

BASE_URL="http://localhost:8080"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Chatbot Backend Test Suite"
echo "=============================="
echo ""

# Test counter
PASSED=0
FAILED=0

# Test 1: Health Check
echo -n "1. Testing health endpoint... "
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/health)
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $HEALTH_RESPONSE)"
    ((FAILED++))
fi

# Test 2: Register User
echo -n "2. Testing user registration... "
REGISTER_RESPONSE=$(curl -s -X POST ${BASE_URL}/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test$(date +%s)@test.com\",\"password\":\"test123\",\"name\":\"Test User\"}")

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$TOKEN" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $REGISTER_RESPONSE"
    ((FAILED++))
    exit 1
fi

# Test 3: Get Current User
echo -n "3. Testing get current user... "
ME_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN")
if [ "$ME_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $ME_RESPONSE)"
    ((FAILED++))
fi

# Test 4: Create Chat
echo -n "4. Testing create chat... "
CHAT_RESPONSE=$(curl -s -X POST ${BASE_URL}/api/v1/chats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Chat","initialMessage":"Hello, this is a test!"}')

CHAT_ID=$(echo $CHAT_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ ! -z "$CHAT_ID" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $CHAT_RESPONSE"
    ((FAILED++))
fi

# Test 5: Add Message to Chat
echo -n "5. Testing add message... "
MESSAGE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/v1/chats/${CHAT_ID}/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"role":"model","content":"This is a bot response!"}')
if [ "$MESSAGE_RESPONSE" = "201" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $MESSAGE_RESPONSE)"
    ((FAILED++))
fi

# Test 6: Get All Chats
echo -n "6. Testing get all chats... "
CHATS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/v1/chats \
  -H "Authorization: Bearer $TOKEN")
if [ "$CHATS_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $CHATS_RESPONSE)"
    ((FAILED++))
fi

# Test 7: Get Specific Chat
echo -n "7. Testing get specific chat... "
CHAT_DETAIL_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/v1/chats/${CHAT_ID} \
  -H "Authorization: Bearer $TOKEN")
if [ "$CHAT_DETAIL_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $CHAT_DETAIL_RESPONSE)"
    ((FAILED++))
fi

# Test 8: Update Chat Title
echo -n "8. Testing update chat title... "
UPDATE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/v1/chats/${CHAT_ID} \
  -X PATCH \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Updated Test Chat"}')
if [ "$UPDATE_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $UPDATE_RESPONSE)"
    ((FAILED++))
fi

# Test 9: Get Chat Stats
echo -n "9. Testing get chat stats... "
STATS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/v1/chats/stats \
  -H "Authorization: Bearer $TOKEN")
if [ "$STATS_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $STATS_RESPONSE)"
    ((FAILED++))
fi

# Test 10: Delete Chat
echo -n "10. Testing delete chat... "
DELETE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/v1/chats/${CHAT_ID} \
  -X DELETE \
  -H "Authorization: Bearer $TOKEN")
if [ "$DELETE_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $DELETE_RESPONSE)"
    ((FAILED++))
fi

# Test 11: Unauthorized Access
echo -n "11. Testing unauthorized access... "
UNAUTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/v1/chats)
if [ "$UNAUTH_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (Expected 401, got $UNAUTH_RESPONSE)"
    ((FAILED++))
fi

# Test 12: Invalid Token
echo -n "12. Testing invalid token... "
INVALID_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/v1/chats \
  -H "Authorization: Bearer invalid_token_123")
if [ "$INVALID_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (Expected 401, got $INVALID_RESPONSE)"
    ((FAILED++))
fi

# Summary
echo ""
echo "=============================="
echo "Test Results:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "=============================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
