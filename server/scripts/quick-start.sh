#!/bin/bash

echo "🚀 Quick Start - Chatbot Backend"
echo "================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run ./setup.sh first"
    exit 1
fi

# Check if database URL is configured
if grep -q "username:password@localhost" .env; then
    echo "⚠️  Database URL not configured in .env"
    echo "Please update DATABASE_URL in .env file"
    exit 1
fi

# Push schema to database
echo ""
echo "📊 Setting up database schema..."
npm run db:push

if [ $? -ne 0 ]; then
    echo "❌ Failed to setup database. Please check your DATABASE_URL"
    exit 1
fi

echo "✅ Database schema created"

# Start development server
echo ""
echo "🚀 Starting development server..."
echo ""
npm run dev
