# Migration Guide: MongoDB → PostgreSQL

## What Changed

### Architecture

- **Before**: MongoDB + Mongoose + Clerk Auth
- **After**: PostgreSQL + Prisma + Custom JWT Auth

### Structure

```
Old:                          New:
server.js                 →   src/server.js
controllers/              →   src/modules/{module}/{module}.controller.js
routes/                   →   src/modules/{module}/{module}.routes.js
models/                   →   prisma/schema.prisma
db/connectDB.js          →   src/config/database.js
```

## Database Schema Changes

### Users

**MongoDB (Clerk)**: External auth, no user table
**PostgreSQL**: Native user table with auth

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // hashed with bcrypt
  name      String?
  chats     Chat[]
}
```

### Chats

**Before (MongoDB)**:

```javascript
{
  _id: ObjectId,
  userId: String,
  title: String,
  messages: [{ role, parts: [{ text }] }]
}
```

**After (PostgreSQL)**:

```prisma
model Chat {
  id        String   @id @default(uuid())
  title     String
  userId    String
  messages  Message[]
  user      User @relation(...)
}

model Message {
  id        String
  chatId    String
  role      String
  content   String @db.Text
  chat      Chat @relation(...)
}
```

## API Endpoints Comparison

### Authentication (NEW)

```
POST /api/v1/auth/register  - Register new user
POST /api/v1/auth/login     - Login user
GET  /api/v1/auth/me        - Get current user
```

### Chats

```
Old                           New
POST /chats                → POST /api/v1/chats
GET /users/:userId/chats   → GET /api/v1/chats (auto-detects user from token)
GET /chats/:chatId         → GET /api/v1/chats/:chatId
POST /chats/:chatId/messages → POST /api/v1/chats/:chatId/messages

New Endpoints:
PATCH /api/v1/chats/:chatId          - Update chat title
DELETE /api/v1/chats/:chatId         - Delete chat
GET /api/v1/chats/stats              - Get user stats
```

## Code Migration Examples

### Creating a Chat

**Before**:

```javascript
const newChat = new Chat({
  userId,
  title: title || undefined,
  messages: [{ role: "user", parts: [{ text: initialMessage }] }],
});
await newChat.save();
await UserChats.findOneAndUpdate(
  { userId },
  { $push: { chatSessions: savedChat._id } },
);
```

**After**:

```javascript
const chat = await prisma.chat.create({
  data: {
    title: chatTitle,
    userId,
    messages: {
      create: [{ role: "user", content: initialMessage }],
    },
  },
  include: { messages: true },
});
```

### Getting User Chats

**Before**:

```javascript
const userChats = await UserChats.findOne({ userId }).populate({
  path: "chatSessions",
  select: "title messages createdAt",
  options: { sort: { createdAt: -1 } },
});
```

**After**:

```javascript
const chats = await prisma.chat.findMany({
  where: { userId },
  orderBy: { updatedAt: "desc" },
  include: {
    messages: { orderBy: { createdAt: "asc" }, take: 1 },
    _count: { select: { messages: true } },
  },
});
```

## Authentication Flow

### Before (Clerk)

```javascript
import { clerkMiddleware } from "@clerk/express";
app.use(clerkMiddleware());
// User ID from Clerk session
```

### After (JWT)

```javascript
// Login returns JWT token
const token = jwt.sign({ userId }, secret);

// Middleware verifies token
const decoded = jwt.verify(token, secret);
req.user = decoded; // { userId }
```

## Environment Variables

**Before**:

```env
PORT=8080
MONGODB_URI=mongodb://...
CLERK_SECRET_KEY=...
```

**After**:

```env
PORT=8080
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173
```

## Migration Steps

1. **Backup MongoDB Data** (if needed)

   ```bash
   mongoexport --db=chatbot --collection=chats --out=chats.json
   ```

2. **Setup PostgreSQL**

   ```bash
   # Install and create database
   sudo apt install postgresql
   sudo -u postgres psql -c "CREATE DATABASE chatbot_db;"
   ```

3. **Install New Dependencies**

   ```bash
   npm install @prisma/client bcryptjs jsonwebtoken helmet
   npm install -D prisma
   npm uninstall mongoose @clerk/express
   ```

4. **Initialize Prisma**

   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Update Frontend** (next step)
   - Replace Clerk auth with custom JWT
   - Update API endpoints
   - Store token in localStorage/cookies

## Benefits of New Architecture

✅ **Full Control**: No third-party auth dependency  
✅ **Better Performance**: PostgreSQL ACID compliance  
✅ **Simpler Structure**: Module-based organization  
✅ **Type Safety**: Prisma provides TypeScript-like safety  
✅ **Production Ready**: Error handling, logging, security  
✅ **Cost Effective**: No external auth service fees  
✅ **Easier Testing**: Standard REST API patterns

## Breaking Changes

⚠️ **Authentication Required**: All endpoints now need JWT token  
⚠️ **API Structure Changed**: `/api/v1` prefix added  
⚠️ **User Management**: Frontend must handle registration/login  
⚠️ **Message Format**: `parts[].text` → `content`  
⚠️ **IDs**: ObjectId (24 chars) → UUID (36 chars)

## Rollback Plan

If issues occur, old MongoDB code is preserved in:

- `server.js` (old)
- `controllers/` (old)
- `models/` (old)
- `routes/` (old)

To rollback:

```bash
npm install mongoose @clerk/express
npm uninstall @prisma/client prisma bcryptjs jsonwebtoken
# Restore old code
```
