# Quick Start Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (local or Docker)

## Setup (5 minutes)

### 1. Install PostgreSQL

**Option A: Ubuntu/Debian**

```bash
sudo apt update && sudo apt install postgresql postgresql-contrib
sudo service postgresql start
sudo -u postgres psql -c "CREATE DATABASE chatbot_db;"
```

**Option B: macOS**

```bash
brew install postgresql@16
brew services start postgresql@16
createdb chatbot_db
```

**Option C: Docker**

```bash
docker run --name postgres-chatbot \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=chatbot_db \
  -p 5432:5432 \
  -d postgres:16
```

### 2. Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

### 3. Configure Environment

Edit `.env` and update:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/chatbot_db"
JWT_SECRET="your-random-secret-key-min-32-chars"
```

### 4. Initialize Database & Start

```bash
chmod +x quick-start.sh
./quick-start.sh
```

Server runs on http://localhost:8080

## Test API

```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Create Chat (use token from login)
curl -X POST http://localhost:8080/api/v1/chats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Chat","initialMessage":"Hello!"}'
```

## Troubleshooting

**Database connection failed?**

- Check PostgreSQL is running: `sudo service postgresql status`
- Verify DATABASE_URL in .env
- Test connection: `psql postgresql://username:password@localhost:5432/chatbot_db`

**Port already in use?**

- Change PORT in .env file
- Kill process: `lsof -ti:8080 | xargs kill -9`

**Prisma errors?**

- Regenerate client: `npm run db:generate`
- Reset database: `npx prisma migrate reset`

## View Database

```bash
npm run db:studio
```

Opens browser at http://localhost:5555
