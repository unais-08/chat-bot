# Chatbot-GPT

A full-stack, production-ready AI chatbot application with a modern, minimal design. Built with React, Express, PostgreSQL, and Google's Gemini AI.

## 🚀 Features

- **Real-time AI Conversations** - Powered by Google Gemini AI with streaming responses
- **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- **Chat Management** - Create, view, search, sort, and delete conversations
- **Modern UI/UX** - Minimal zinc/slate theme with smooth animations and transitions
- **Markdown Support** - Rich text rendering with syntax highlighting for code blocks
- **Responsive Design** - Mobile-first approach with Tailwind CSS v4
- **Toast Notifications** - Custom toast system for user feedback
- **Protected Routes** - Secure authentication flow with route protection

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│                 │         │                  │         │                  │
│   React SPA     │◄───────►│   Express API    │◄───────►│   PostgreSQL     │
│   (Frontend)    │         │   (Backend)      │         │   (Database)     │
│                 │         │                  │         │                  │
└────────┬────────┘         └────────┬─────────┘         └──────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌──────────────────┐
│                 │         │                  │
│   Gemini AI     │         │   Prisma ORM     │
│   (Google)      │         │                  │
│                 │         │                  │
└─────────────────┘         └──────────────────┘
```

### Tech Stack

#### Frontend (`/client`)

- **Framework**: React 18.3.1 with Vite 6.0.5
- **Routing**: React Router DOM 7.1.3
- **Styling**: Tailwind CSS 4.1.18 (minimal zinc/slate theme)
- **UI Components**: Custom components with smooth animations
- **State Management**: React Context API (AuthContext)
- **HTTP Client**: Axios 1.7.9
- **AI Integration**: Google GenAI SDK 1.41.0
- **Markdown Rendering**: react-markdown 9.0.3 with syntax highlighting
- **Notifications**: react-hot-toast 2.6.0 + Custom Toast component

#### Backend (`/server`)

- **Runtime**: Node.js with ES Modules
- **Framework**: Express 4.21.2
- **Database**: PostgreSQL with Prisma ORM 5.20.0
- **Authentication**: JWT (jsonwebtoken 9.0.2) + bcryptjs 2.4.3
- **Security**: Helmet 8.0.0, CORS 2.8.5
- **Environment**: dotenv 16.4.7
- **Development**: nodemon 3.1.9

---

## 🗄️ Database Schema

### Users Table

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  chats     Chat[]
}
```

### Chats Table

```prisma
model Chat {
  id        String    @id @default(uuid())
  title     String
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages  Message[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Messages Table

```prisma
model Message {
  id        String   @id @default(uuid())
  role      String   // "user" or "bot"
  content   String   @db.Text
  chatId    String
  chat      Chat     @relation(fields: [chatId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

**Relationships:**

- One User → Many Chats (one-to-many)
- One Chat → Many Messages (one-to-many)
- Cascade deletes enabled for data integrity

---

## 🔐 Authentication Flow

### Registration

1. User submits email, password, name
2. Backend validates input
3. Password hashed with bcrypt (10 rounds)
4. User created in database
5. JWT token generated and returned
6. Token stored in localStorage
7. User redirected to dashboard

### Login

1. User submits email, password
2. Backend validates credentials
3. Password compared with bcrypt
4. JWT token generated (24h expiry)
5. Token stored in localStorage
6. AuthContext updates state
7. User redirected to dashboard

### Protected Routes

- Middleware checks JWT token validity
- Token decoded to extract user ID
- User data attached to request object
- Invalid/expired tokens return 401 Unauthorized

---

## 💬 Chat System Architecture

### Message Flow

```
User Input → Frontend → Backend API → PostgreSQL
                ↓
          Gemini AI API
                ↓
    Streaming Response → Frontend → UI Update
                                        ↓
                                   PostgreSQL
```

### Key Features

1. **Chat Creation**
   - New chat created on first message
   - Title auto-generated from first message
   - Stored with user association

2. **Message Handling**
   - User message saved immediately
   - Sent to Gemini AI for processing
   - Bot response streamed in real-time
   - Both messages stored in database

3. **Chat Management**
   - View all chats with search/sort
   - Delete chats with cascade
   - Stats tracking (total chats, messages, today's activity)

---

## 🎨 Frontend Architecture

### State Management

**Global State (Context API):**

- `AuthContext`: User authentication state, login/logout functions
- `useChatList`: Custom hook for chat list management
- `useChat`: Custom hook for individual chat management

**Local State:**

- Component-level useState for UI state
- Form handling with controlled components
- Modal and toast visibility states

### Custom Hooks

**`useChat(chatId)`**

- Manages single chat state
- Handles message sending
- Streams AI responses
- Updates message list in real-time

**`useChatList()`**

- Fetches all user chats
- Provides add/remove chat functions
- Handles loading states
- Manages chat list updates

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description       | Auth Required |
| ------ | ----------- | ----------------- | ------------- |
| POST   | `/register` | Create new user   | No            |
| POST   | `/login`    | Authenticate user | No            |
| GET    | `/me`       | Get current user  | Yes           |

### Chat Routes (`/api/chats`)

| Method | Endpoint | Description         | Auth Required |
| ------ | -------- | ------------------- | ------------- |
| GET    | `/`      | Get all user chats  | Yes           |
| POST   | `/`      | Create new chat     | Yes           |
| GET    | `/:id`   | Get chat by ID      | Yes           |
| DELETE | `/:id`   | Delete chat         | Yes           |
| GET    | `/stats` | Get chat statistics | Yes           |

### Message Routes (`/api/chats/:chatId/messages`)

| Method | Endpoint | Description       | Auth Required |
| ------ | -------- | ----------------- | ------------- |
| GET    | `/`      | Get chat messages | Yes           |
| POST   | `/`      | Send new message  | Yes           |

---

## 🎯 Key Design Decisions

### Frontend

1. **Tailwind CSS v4**
   - Minimal zinc/slate color palette
   - Custom animations in CSS
   - Utility-first approach
   - No component libraries

2. **Custom Components**
   - ConfirmDialog for deletions
   - Custom Toast notifications
   - Reusable UI components
   - Consistent design system

3. **AI Integration**
   - Client-side Gemini AI calls
   - Streaming responses for better UX
   - Markdown rendering with syntax highlighting
   - Error handling with user feedback

4. **Route Protection**
   - Protected routes with ProtectedRoute component
   - Automatic redirect to login
   - Token validation on mount

### Backend

1. **Modular Architecture**
   - Feature-based folder structure
   - Separation of concerns (controller/service/routes)
   - Middleware-based request handling
   - Clean error handling

2. **Security**
   - JWT authentication
   - bcrypt password hashing
   - Helmet for HTTP headers
   - CORS configuration
   - Input validation

3. **Database**
   - Prisma ORM for type safety
   - UUID primary keys
   - Cascade deletes
   - Indexed fields for performance

---

## 🎨 Design System

### Color Palette (Zinc/Slate Theme)

- **Primary**: `zinc-900` - Dark elements, buttons, headers
- **Secondary**: `zinc-700/800` - Secondary text, icons
- **Background**: `zinc-50/100` - Page backgrounds, cards
- **Border**: `zinc-200/300` - Dividers, borders
- **Text**: `zinc-600/700/800/900` - Text hierarchy
- **Accent**: White with shadows for elevated elements

### Typography

- **Headings**: Font weight 600-700, zinc-900
- **Body**: Font weight 400-500, zinc-600/700
- **Small Text**: Font size sm/xs, zinc-500

### Components

- **Border Radius**: `rounded-xl` (0.75rem) for cards, `rounded-2xl` for larger elements
- **Shadows**: `shadow-sm` for subtle depth, `shadow-md/lg` for elevated states
- **Transitions**: `duration-200` for smooth interactions
- **Animations**: Custom fade-in, slide-out, scale-in animations

---

## 🛡️ Security Measures

1. **Authentication** - JWT with 24-hour expiry
2. **Password Security** - bcrypt with 10 salt rounds
3. **HTTP Security** - Helmet middleware for security headers
4. **CORS** - Configured for specific origins
5. **Input Validation** - Server-side validation for all inputs
6. **SQL Injection Prevention** - Prisma ORM with parameterized queries
7. **XSS Prevention** - React's built-in XSS protection + rehype-sanitize

---
