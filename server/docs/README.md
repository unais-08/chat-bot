# Chatbot Backend - PostgreSQL

Production-ready chatbot backend built with Node.js, Express, PostgreSQL, and Prisma.

## 🚀 Features

- **Authentication**: JWT-based auth with email/password
- **Chat Management**: Create, read, update, delete chats
- **Message History**: Store and retrieve complete conversation history
- **User Management**: Secure user registration and profile management
- **Production Ready**: Error handling, logging, security headers

## 📁 Project Structure

```
server/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.service.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.routes.js
│   │   └── chat/
│   │       ├── chat.service.js
│   │       ├── chat.controller.js
│   │       └── chat.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── logger.middleware.js
│   ├── config/
│   │   ├── database.js
│   │   └── index.js
│   ├── app.js
│   └── server.js
├── prisma/
│   └── schema.prisma
├── .env.example
└── package.json
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup PostgreSQL

**Option A: Local PostgreSQL**

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo service postgresql start

# Create database
sudo -u postgres psql
CREATE DATABASE chatbot_db;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE chatbot_db TO your_username;
\q
```

**Option B: Docker**

```bash
docker run --name postgres-chatbot \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=chatbot_db \
  -p 5432:5432 \
  -d postgres:16
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=8080
NODE_ENV=development

DATABASE_URL="postgresql://username:password@localhost:5432/chatbot_db?schema=public"

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or use migrations for production
npm run db:migrate
```

### 5. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Authentication

```bash
# Register
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

# Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Get current user
GET /api/v1/auth/me
Headers: { Authorization: "Bearer <token>" }
```

### Chats

```bash
# Create new chat
POST /api/v1/chats
Headers: { Authorization: "Bearer <token>" }
{
  "title": "My Chat",
  "initialMessage": "Hello!"
}

# Get all user chats
GET /api/v1/chats?limit=50&offset=0
Headers: { Authorization: "Bearer <token>" }

# Get specific chat
GET /api/v1/chats/:chatId
Headers: { Authorization: "Bearer <token>" }

# Add message to chat
POST /api/v1/chats/:chatId/messages
Headers: { Authorization: "Bearer <token>" }
{
  "role": "user",
  "content": "How are you?"
}

# Update chat title
PATCH /api/v1/chats/:chatId
Headers: { Authorization: "Bearer <token>" }
{
  "title": "New Title"
}

# Delete chat
DELETE /api/v1/chats/:chatId
Headers: { Authorization: "Bearer <token>" }

# Get chat statistics
GET /api/v1/chats/stats
Headers: { Authorization: "Bearer <token>" }
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT authentication
- Helmet.js for security headers
- CORS configuration
- Input validation
- SQL injection protection (Prisma ORM)

## 🗄️ Database Schema

```prisma
User {
  id        String
  email     String (unique)
  password  String (hashed)
  name      String?
  chats     Chat[]
}

Chat {
  id        String
  title     String
  userId    String
  messages  Message[]
  user      User
}

Message {
  id        String
  chatId    String
  role      String (user/model)
  content   Text
  chat      Chat
}
```

## 🚀 Production Deployment

### Render / Railway / Heroku

1. Add PostgreSQL addon
2. Set environment variables
3. Add build command: `npm run db:generate && npm run db:push`
4. Add start command: `npm start`

### AWS / DigitalOcean

1. Setup PostgreSQL instance
2. Configure environment variables
3. Run migrations: `npm run db:migrate`
4. Start with PM2: `pm2 start src/server.js --name chatbot-api`

## 🛠️ Useful Commands

```bash
# View database in browser
npm run db:studio

# Reset database
npx prisma migrate reset

# Format Prisma schema
npx prisma format

# Generate Prisma client
npm run db:generate
```

## 📝 Notes

- All chat routes require authentication
- Messages are automatically ordered by creation time
- Deleting a chat cascades to delete all messages
- User passwords are never returned in API responses
- Token expires in 7 days by default

## 🤝 Contributing

Feel free to submit issues and pull requests!
