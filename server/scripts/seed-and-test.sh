#!/bin/bash

# Comprehensive Test and Demo Script for Chatbot Backend
# This script seeds the database and runs complete tests

BASE_URL="http://localhost:8080"
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🧪 CHATBOT BACKEND - SEED & TEST SUITE                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if server is running
echo -n "Checking if server is running... "
SERVER_CHECK=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/health 2>/dev/null)
if [ "$SERVER_CHECK" != "200" ]; then
    echo -e "${RED}✗ Server not running${NC}"
    echo "Please start the server first with: npm run dev"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Seed database
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}📦 Seeding Database${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
npm run db:seed

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database seeding failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}🧪 Running API Tests${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Test counter
PASSED=0
FAILED=0

# Test 1: Health Check
echo -n "1. Health check... "
HEALTH_RESPONSE=$(curl -s ${BASE_URL}/health)
HEALTH_STATUS=$(echo $HEALTH_RESPONSE | grep -o '"success":true')
if [ ! -z "$HEALTH_STATUS" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Test 2: Login with seeded user (Alice)
echo -n "2. Login with Alice... "
LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}')

ALICE_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$ALICE_TOKEN" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $LOGIN_RESPONSE"
    ((FAILED++))
fi

# Test 3: Get Alice's profile
echo -n "3. Get Alice's profile... "
PROFILE_RESPONSE=$(curl -s ${BASE_URL}/api/v1/auth/me \
  -H "Authorization: Bearer $ALICE_TOKEN")
PROFILE_EMAIL=$(echo $PROFILE_RESPONSE | grep -o '"email":"alice@example.com"')
if [ ! -z "$PROFILE_EMAIL" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Test 4: Get Alice's chats (should have seeded chats)
echo -n "4. Get Alice's chats... "
CHATS_RESPONSE=$(curl -s ${BASE_URL}/api/v1/chats \
  -H "Authorization: Bearer $ALICE_TOKEN")
CHAT_COUNT=$(echo $CHATS_RESPONSE | grep -o '"id":"[^"]*' | wc -l)
if [ "$CHAT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Found $CHAT_COUNT chats)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Get first chat ID
FIRST_CHAT_ID=$(echo $CHATS_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

# Test 5: Get specific chat details
echo -n "5. Get chat details... "
CHAT_DETAIL=$(curl -s ${BASE_URL}/api/v1/chats/${FIRST_CHAT_ID} \
  -H "Authorization: Bearer $ALICE_TOKEN")
MESSAGE_COUNT=$(echo $CHAT_DETAIL | grep -o '"content":"[^"]*' | wc -l)
if [ "$MESSAGE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Found $MESSAGE_COUNT messages)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Test 6: Create new chat
echo -n "6. Create new chat... "
NEW_CHAT=$(curl -s -X POST ${BASE_URL}/api/v1/chats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -d '{"title":"Test Chat","initialMessage":"This is a test message!"}')
NEW_CHAT_ID=$(echo $NEW_CHAT | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
if [ ! -z "$NEW_CHAT_ID" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Test 7: Add message to chat
echo -n "7. Add message to chat... "
ADD_MESSAGE=$(curl -s -X POST ${BASE_URL}/api/v1/chats/${NEW_CHAT_ID}/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -d '{"role":"model","content":"This is a bot response!"}')
MESSAGE_ID=$(echo $ADD_MESSAGE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
if [ ! -z "$MESSAGE_ID" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Test 8: Update chat title
echo -n "8. Update chat title... "
UPDATE_TITLE=$(curl -s -X PATCH ${BASE_URL}/api/v1/chats/${NEW_CHAT_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -d '{"title":"Updated Test Chat"}')
UPDATE_SUCCESS=$(echo $UPDATE_TITLE | grep -o '"success":true')
if [ ! -z "$UPDATE_SUCCESS" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Test 9: Get chat statistics
echo -n "9. Get chat statistics... "
STATS=$(curl -s ${BASE_URL}/api/v1/chats/stats \
  -H "Authorization: Bearer $ALICE_TOKEN")
TOTAL_CHATS=$(echo $STATS | grep -o '"totalChats":[0-9]*' | cut -d':' -f2)
if [ ! -z "$TOTAL_CHATS" ] && [ "$TOTAL_CHATS" -gt 0 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Total: $TOTAL_CHATS chats)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Test 10: Login with Bob
echo -n "10. Login with Bob... "
BOB_LOGIN=$(curl -s -X POST ${BASE_URL}/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com","password":"password123"}')
BOB_TOKEN=$(echo $BOB_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
if [ ! -z "$BOB_TOKEN" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Test 11: Bob shouldn't see Alice's chats
echo -n "11. Verify chat isolation... "
BOB_CHATS=$(curl -s ${BASE_URL}/api/v1/chats \
  -H "Authorization: Bearer $BOB_TOKEN")
BOB_CHAT_COUNT=$(echo $BOB_CHATS | grep -o '"id":"[^"]*' | wc -l)
# Bob should have his own chats from seed, not Alice's new chat
BOB_HAS_NEW_CHAT=$(echo $BOB_CHATS | grep -o "$NEW_CHAT_ID")
if [ -z "$BOB_HAS_NEW_CHAT" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Bob has $BOB_CHAT_COUNT chats, isolated correctly)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (Chat isolation broken)"
    ((FAILED++))
fi

# Test 12: Delete chat
echo -n "12. Delete chat... "
DELETE_CHAT=$(curl -s -X DELETE ${BASE_URL}/api/v1/chats/${NEW_CHAT_ID} \
  -H "Authorization: Bearer $ALICE_TOKEN")
DELETE_SUCCESS=$(echo $DELETE_CHAT | grep -o '"success":true')
if [ ! -z "$DELETE_SUCCESS" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Summary
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}📊 Test Results${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Passed: $PASSED / 12${NC}"
echo -e "${RED}Failed: $FAILED / 12${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo ""
    echo -e "${CYAN}🎉 Database is seeded with test data!${NC}"
    echo ""
    echo -e "${YELLOW}📝 Test Accounts:${NC}"
    echo "  • alice@example.com : password123 (3 chats)"
    echo "  • bob@example.com : password123 (2 chats)"
    echo "  • charlie@example.com : password123 (1 chat)"
    echo ""
    echo -e "${CYAN}💡 Quick Commands:${NC}"
    echo "  npm run db:studio     # View database in browser"
    echo "  npm run db:seed       # Re-seed database"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo "Please check the server logs for more details"
    exit 1
fi
