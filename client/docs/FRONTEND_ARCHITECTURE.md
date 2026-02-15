# 🏗️ Frontend Architecture - Production-Ready React Chatbot

## 📋 Executive Summary

This document outlines a **production-grade frontend architecture** for the chatbot application, integrating with the custom PostgreSQL backend and JWT authentication system.

**Key Principles:**

- **Feature-based architecture** for scalability
- **Clear separation of concerns** (UI, logic, state, API)
- **Custom auth integration** (no Clerk, no third-party)
- **Type-safe API layer** with error handling
- **Simple state management** using React Context (upgradeable to Zustand/Redux if needed)
- **Security-first** approach for token management

---

## 🎯 Backend Analysis Summary

### Authentication Flow

- **JWT-based authentication** with Bearer tokens
- **Token storage:** localStorage (with httpOnly cookie option for production)
- **Token lifetime:** 7 days (configurable)
- **Protected routes:** All `/api/v1/chats/*` endpoints require authentication
- **Middleware:** `authenticate` middleware validates Bearer token

### API Contracts

#### Auth Endpoints

```javascript
// Register
POST /api/v1/auth/register
Body: { email, password, name? }
Response: { success, message, data: { user, token } }

// Login
POST /api/v1/auth/login
Body: { email, password }
Response: { success, message, data: { user, token } }

// Get Current User
GET /api/v1/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: { id, email, name, createdAt } }
```

#### Chat Endpoints

```javascript
// Create Chat
POST /api/v1/chats
Headers: { Authorization: "Bearer <token>" }
Body: { title?, initialMessage }
Response: { success, message, data: { id, title, userId, messages[] } }

// Get User Chats
GET /api/v1/chats?limit=50&offset=0
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: Chat[], pagination }

// Get Specific Chat
GET /api/v1/chats/:chatId
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: { id, title, userId, messages[] } }

// Add Message
POST /api/v1/chats/:chatId/messages
Headers: { Authorization: "Bearer <token>" }
Body: { role: "user" | "model", content }
Response: { success, message, data: Message }

// Update Chat Title
PATCH /api/v1/chats/:chatId
Headers: { Authorization: "Bearer <token>" }
Body: { title }

// Delete Chat
DELETE /api/v1/chats/:chatId
Headers: { Authorization: "Bearer <token>" }

// Get Stats
GET /api/v1/chats/stats
Headers: { Authorization: "Bearer <token>" }
Response: { success, data: { totalChats, totalMessages } }
```

### Database Schema

```
User (id, email, password, name, createdAt, updatedAt)
  ├─> Chat (id, title, userId, createdAt, updatedAt)
       ├─> Message (id, chatId, role, content, createdAt)
```

---

## 🏛️ Proposed Frontend Architecture

### High-Level Structure

```
client/
├── public/                      # Static assets
├── src/
│   ├── main.jsx                # App entry point
│   ├── App.jsx                 # Root component with providers
│   │
│   ├── features/               # Feature-based modules
│   │   ├── auth/              # Authentication feature
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.js
│   │   │   │   └── useAuthForm.js
│   │   │   ├── context/
│   │   │   │   └── AuthContext.jsx
│   │   │   └── api/
│   │   │       └── authApi.js
│   │   │
│   │   ├── chat/              # Chat feature
│   │   │   ├── components/
│   │   │   │   ├── ChatList.jsx
│   │   │   │   ├── ChatSidebar.jsx
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── MessageList.jsx
│   │   │   │   ├── MessageInput.jsx
│   │   │   │   └── MessageBubble.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useChat.js
│   │   │   │   ├── useChatList.js
│   │   │   │   └── useMessages.js
│   │   │   ├── context/
│   │   │   │   └── ChatContext.jsx
│   │   │   └── api/
│   │   │       └── chatApi.js
│   │   │
│   │   └── dashboard/         # Dashboard feature
│   │       ├── components/
│   │       │   ├── DashboardStats.jsx
│   │       │   └── RecentChats.jsx
│   │       └── hooks/
│   │           └── useDashboard.js
│   │
│   ├── shared/                # Shared/common code
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── Toast.jsx
│   │   ├── hooks/            # Common hooks
│   │   │   ├── useDebounce.js
│   │   │   ├── useLocalStorage.js
│   │   │   └── useMediaQuery.js
│   │   └── utils/            # Utility functions
│   │       ├── validators.js
│   │       ├── formatters.js
│   │       └── constants.js
│   │
│   ├── lib/                  # Core libraries
│   │   ├── api/
│   │   │   ├── client.js     # Axios instance with interceptors
│   │   │   └── endpoints.js  # API endpoint constants
│   │   ├── gemini/
│   │   │   └── gemini.js     # Gemini AI integration
│   │   └── storage/
│   │       └── tokenStorage.js
│   │
│   ├── layouts/              # Layout components
│   │   ├── RootLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── DashboardLayout.jsx
│   │
│   ├── pages/                # Page components (route containers)
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ChatPage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   └── styles/               # Global styles
│       └── index.css
│
├── .env.example
├── vite.config.js
└── package.json
```

---

## 🔐 Authentication Architecture

### Token Management Strategy

**Development (Current):**

- Store JWT in `localStorage`
- Simple, fast development
- Vulnerable to XSS (acceptable for development)

**Production (Recommended):**

- Backend sends JWT in httpOnly cookie
- Frontend makes requests with credentials
- Protected against XSS
- Requires backend CORS configuration

### Auth Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. User submits login
       ▼
┌─────────────────┐
│  LoginForm.jsx  │
└──────┬──────────┘
       │
       │ 2. Calls authApi.login()
       ▼
┌─────────────────┐
│  lib/api/       │
│  client.js      │
└──────┬──────────┘
       │
       │ 3. POST /auth/login
       ▼
┌─────────────────┐
│  Backend API    │
└──────┬──────────┘
       │
       │ 4. Returns { user, token }
       ▼
┌─────────────────┐
│  AuthContext    │
└──────┬──────────┘
       │
       │ 5. Saves token to localStorage
       │ 6. Updates user state
       ▼
┌─────────────────┐
│  Navigate to    │
│  /dashboard     │
└─────────────────┘
```

### Protected Route Pattern

```javascript
// Only authenticated users can access
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/chat/:id" element={<ChatPage />} />
</Route>

// Redirect authenticated users away from auth pages
<Route element={<PublicOnlyRoute />}>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
</Route>
```

---

## 🌐 API Service Layer Design

### Centralized API Client

**Why?**

- Single source of truth for API configuration
- Automatic token attachment to all requests
- Centralized error handling
- Request/response interceptors
- Easy to mock for testing

**Key Features:**

- Axios interceptors for auth tokens
- Automatic 401 handling (token expiration → logout)
- Request/response logging (dev mode)
- Base URL configuration
- Error normalization

---

## 📊 State Management Strategy

### Recommendation: **React Context + Custom Hooks**

**Rationale:**

- Application is **chat-focused** with straightforward state needs
- No complex cross-cutting state dependencies
- Context provides sufficient performance for this use case
- Can migrate to Zustand/Redux later if needed

### State Architecture

```
┌──────────────────────────────────────┐
│          App Component               │
│  ┌────────────────────────────────┐  │
│  │     AuthProvider               │  │
│  │  (user, token, login, logout)  │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │   ChatProvider           │  │  │
│  │  │  (chats, activeChat,     │  │  │
│  │  │   messages, sendMsg)     │  │  │
│  │  │  ┌────────────────────┐  │  │  │
│  │  │  │   App Routes       │  │  │  │
│  │  │  └────────────────────┘  │  │  │
│  │  └──────────────────────────┘  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Context Responsibilities:**

1. **AuthContext**
   - Current user state
   - Login/logout actions
   - Token management
   - Auth status checking

2. **ChatContext** (Optional - can use local state)
   - Active chat state
   - Messages for active chat
   - Send message action
   - Optimistic updates

**Alternative: Zustand** (if state complexity grows)

```javascript
// Simpler than Redux, more powerful than Context
// Migration path if needed
import create from "zustand";

const useStore = create((set) => ({
  user: null,
  chats: [],
  setUser: (user) => set({ user }),
  addChat: (chat) =>
    set((state) => ({
      chats: [chat, ...state.chats],
    })),
}));
```

---

## 🎨 Component Design Principles

### 1. **Smart vs Dumb Components**

**Smart (Container) Components:**

- Fetch data
- Manage state
- Handle business logic
- Example: `ChatPage.jsx`, `DashboardPage.jsx`

**Dumb (Presentational) Components:**

- Receive props
- Render UI
- Fire callbacks
- Example: `MessageBubble.jsx`, `Button.jsx`

### 2. **Custom Hooks for Logic Reuse**

```javascript
// Instead of duplicating logic in components
useAuth(); // Auth state + actions
useChat(chatId); // Chat data + actions
useChatList(); // List of chats + CRUD
useMessages(); // Message stream + send
```

### 3. **Error Boundaries**

Wrap major sections to prevent full app crashes:

```jsx
<ErrorBoundary fallback={<ErrorPage />}>
  <ChatWindow />
</ErrorBoundary>
```

---

## 🔒 Security Best Practices

### 1. Token Security

```javascript
// ✅ DO: Store token securely
localStorage.setItem("token", token); // Dev
// httpOnly cookies                    // Prod

// ❌ DON'T: Expose token in logs
console.log(token); // Never!
```

### 2. Input Validation

```javascript
// Always validate user input
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (pwd) => pwd.length >= 6;
```

### 3. XSS Protection

```javascript
// React escapes by default, but be careful with:
dangerouslySetInnerHTML; // Avoid unless necessary
```

### 4. API Security

```javascript
// Never expose sensitive config
// Use .env for API keys
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_GEMINI_API_KEY=your_key_here
```

---

## 🚀 Performance Optimizations

### 1. Code Splitting

```javascript
// Lazy load routes
const ChatPage = lazy(() => import("./pages/ChatPage"));
```

### 2. Memoization

```javascript
// Prevent unnecessary re-renders
const MemoizedChatList = memo(ChatList);
useMemo(() => expensiveCalculation(), [deps]);
useCallback(() => handleClick(), [deps]);
```

### 3. Virtual Scrolling

```javascript
// For long message lists (1000+ messages)
import { FixedSizeList } from "react-window";
```

### 4. Debouncing

```javascript
// For search/input fields
const debouncedSearch = useDebounce(searchTerm, 300);
```

---

## 🧪 Testing Strategy

### 1. Unit Tests

- Custom hooks (`useAuth`, `useChat`)
- Utility functions
- API client

### 2. Integration Tests

- Auth flow (login → dashboard)
- Chat creation flow
- Message sending

### 3. E2E Tests (Optional)

- Cypress or Playwright
- Critical user journeys

---

## 📈 Scalability Considerations

### Current Scale (v1)

- 100s of users
- 1000s of messages per chat
- Simple Context state management

### Future Scale (v2+)

- **1000s of users:** Add Redis caching (backend)
- **Real-time chat:** Integrate WebSockets (Socket.io)
- **10K+ messages:** Virtual scrolling + pagination
- **Complex state:** Migrate to Zustand/Redux
- **Multiple AI models:** Abstract AI service layer

---

## 🎯 Migration from Clerk to Custom Auth

### Key Changes

| Aspect               | Old (Clerk)                    | New (Custom Auth)             |
| -------------------- | ------------------------------ | ----------------------------- |
| **Auth Provider**    | `<ClerkProvider>`              | `<AuthProvider>` (custom)     |
| **User Hook**        | `useUser()` from Clerk         | `useAuth()` custom hook       |
| **Protected Routes** | Clerk's built-in               | Custom `<ProtectedRoute>`     |
| **Login/Signup**     | `<SignIn>`, `<SignUp>`         | Custom forms                  |
| **Token Management** | Automatic                      | Manual (localStorage/cookies) |
| **User Object**      | `user.id`, `user.emailAddress` | `user.id`, `user.email`       |

---

## 🛣️ Routing Strategy

```javascript
// Public routes
/                  → HomePage (landing)
/login             → LoginPage
/register          → RegisterPage

// Protected routes (requires auth)
/dashboard         → DashboardPage (stats + recent chats)
/dashboard/chats   → Redirect to /dashboard/chats/new
/dashboard/chats/new       → ChatPage (new chat)
/dashboard/chats/:chatId   → ChatPage (existing chat)

// Error handling
/*                 → NotFoundPage
```

---

## 🎨 UX/UI Guidelines

### Loading States

```javascript
// Show skeleton loaders, not just spinners
<SkeletonChatList />    // While loading chats
<SkeletonMessage />     // While AI responds
```

### Error States

```javascript
// Graceful error handling with retry
<ErrorMessage message="Failed to load chat" onRetry={refetch} />
```

### Empty States

```javascript
// Friendly empty states
<EmptyState
  icon={<ChatIcon />}
  title="No chats yet"
  description="Start a new conversation"
  action={<Button onClick={createChat}>New Chat</Button>}
/>
```

### Optimistic Updates

```javascript
// Update UI immediately, rollback on error
const sendMessage = async (content) => {
  const tempMessage = { id: "temp", content, role: "user" };
  setMessages((prev) => [...prev, tempMessage]);

  try {
    const saved = await chatApi.sendMessage(chatId, content);
    setMessages((prev) => prev.map((m) => (m.id === "temp" ? saved : m)));
  } catch (error) {
    // Rollback
    setMessages((prev) => prev.filter((m) => m.id !== "temp"));
    toast.error("Failed to send message");
  }
};
```

---

## 🔄 Future Improvements

### Phase 1 (Current)

- [x] Custom JWT auth
- [x] Basic chat functionality
- [x] PostgreSQL integration

### Phase 2 (Next 3 months)

- [ ] Real-time messaging (WebSockets)
- [ ] Message reactions/editing
- [ ] File upload support
- [ ] Chat search functionality

### Phase 3 (6+ months)

- [ ] Multi-user chat rooms
- [ ] Voice input/output
- [ ] Advanced AI capabilities (RAG, context memory)
- [ ] Mobile app (React Native)

---

## 📚 Technology Stack

### Core

- **React 18+** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool (fast, modern)

### State & Data

- **React Context** - State management
- **Axios** - HTTP client
- **React Query** (optional) - Server state caching

### Styling

- **Tailwind CSS** - Utility-first CSS
- **CSS Modules** (optional) - Scoped styles

### AI Integration

- **Google Gemini API** - AI responses

### Dev Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **React DevTools** - Debugging

---

## 📖 Developer Workflow

### 1. Start Development

```bash
cd client
npm install
npm run dev     # Start Vite dev server
```

### 2. Environment Variables

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_GEMINI_API_KEY=your_gemini_key
```

### 3. Code Organization

```bash
# Working on a feature
src/features/chat/
  components/     # UI components
  hooks/         # Business logic
  api/           # API calls
```

### 4. Testing

```bash
npm run test           # Unit tests
npm run test:watch     # Watch mode
```

### 5. Build for Production

```bash
npm run build          # Creates dist/
npm run preview        # Preview production build
```

---

## 🎓 Best Practices Summary

1. ✅ **Feature-based architecture** - Group by feature, not by type
2. ✅ **Custom hooks** - Extract reusable logic
3. ✅ **API layer separation** - Keep API calls out of components
4. ✅ **Error boundaries** - Prevent full app crashes
5. ✅ **Loading states** - Always show feedback to user
6. ✅ **Optimistic updates** - Update UI before API response
7. ✅ **Input validation** - Validate on frontend AND backend
8. ✅ **Secure token storage** - Use httpOnly cookies in production
9. ✅ **Code splitting** - Lazy load routes
10. ✅ **Clean code** - Small components, single responsibility

---

## 🎯 Summary

This architecture provides:

- **Scalable structure** that grows with your app
- **Clear separation of concerns** for maintainability
- **Production-ready patterns** for security and performance
- **Simple yet powerful** state management
- **Easy testing** with isolated, focused modules
- **Future-proof** design that can adapt to new requirements

The key is **starting simple** (Context API, feature-based structure) and **scaling up** when needed (Zustand, advanced patterns).
