#!/bin/bash

echo "🚀 Setting up Chatbot Backend with PostgreSQL"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL CLI not detected.${NC}"
    echo "You can either:"
    echo "  1. Install PostgreSQL locally"
    echo "  2. Use Docker: docker run --name postgres-chatbot -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=chatbot_db -p 5432:5432 -d postgres:16"
    echo ""
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Setup .env file
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please update DATABASE_URL and JWT_SECRET in .env file${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping...${NC}"
fi

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to generate Prisma client${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prisma client generated${NC}"

# Setup instructions
echo ""
echo "=============================================="
echo -e "${GREEN}✅ Setup completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Update .env file with your PostgreSQL credentials"
echo "2. Run: npm run db:push (to create database tables)"
echo "3. Run: npm run dev (to start development server)"
echo ""
echo "Or use the quick start script:"
echo "  chmod +x quick-start.sh && ./quick-start.sh"
echo ""
