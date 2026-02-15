# 📁 New Frontend Folder Structure

This document shows the complete folder structure after implementing the new architecture.

---

## 🎯 Complete Structure

```
client/
├── public/
│   └── _redirects                      # Netlify redirects
│
├── src/
│   │
│   ├── features/                       # ⭐ Feature-based modules
│   │   │
│   │   ├── auth/                       # 🔐 Authentication Feature
│   │   │   ├── api/
│   │   │   │   └── authApi.js         # Auth API calls (login, register, me)
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx      # Login form with validation
│   │   │   │   ├── RegisterForm.jsx   # Registration form
│   │   │   │   └── ProtectedRoute.jsx # Route guards
│   │   │   ├── context/
│   │   │   │   └── AuthContext.jsx    # Auth state provider
│   │   │   └── hooks/
│   │   │       └── useAuthForm.js     # (Optional) Form hook
│   │   │
│   │   ├── chat/                       # 💬 Chat Feature
│   │   │   ├── api/
│   │   │   │   └── chatApi.js         # Chat API calls (CRUD)
│   │   │   ├── components/
│   │   │   │   ├── ChatList.jsx       # (Keep existing or create new)
│   │   │   │   ├── ChatSidebar.jsx    # (Keep existing or create new)
│   │   │   │   ├── MessageBubble.jsx  # (Create new)
│   │   │   │   └── MessageInput.jsx   # (Create new)
│   │   │   └── hooks/
│   │   │       ├── useChat.js         # Single chat management
│   │   │       └── useChatList.js     # Chat list management
│   │   │
│   │   └── dashboard/                  # 📊 Dashboard Feature (Optional)
│   │       ├── components/
│   │       │   └── StatsCard.jsx
│   │       └── hooks/
│   │           └── useDashboard.js
│   │
│   ├── lib/                            # 🛠️ Core Libraries
│   │   ├── api/
│   │   │   ├── client.js              # ⭐ Axios instance + interceptors
│   │   │   └── endpoints.js           # (Optional) API endpoint constants
│   │   ├── gemini/
│   │   │   └── gemini.js              # ⭐ Gemini AI service
│   │   └── storage/
│   │       └── tokenStorage.js        # ⭐ Token management
│   │
│   ├── shared/                         # 🔧 Shared/Common Code
│   │   ├── components/
│   │   │   ├── Spinner.jsx            # ⭐ Loading spinner
│   │   │   ├── Button.jsx             # (Optional) Reusable button
│   │   │   ├── Input.jsx              # (Optional) Reusable input
│   │   │   └── ErrorBoundary.jsx      # (Optional) Error boundary
│   │   ├── hooks/
│   │   │   ├── useDebounce.js         # (Optional) Debounce hook
│   │   │   └── useLocalStorage.js     # (Optional) Local storage hook
│   │   └── utils/
│   │       ├── validators.js          # (Optional) Input validators
│   │       ├── formatters.js          # (Optional) Date formatters
│   │       └── constants.js           # (Optional) Constants
│   │
│   ├── layouts/                        # 🖼️ Layout Components
│   │   ├── RootLayout.jsx             # (Keep existing)
│   │   └── DashboardLayout.jsx        # (Keep existing or simplify)
│   │
│   ├── pages/                          # 📄 Page Components
│   │   ├── HomePage.jsx               # (Keep existing)
│   │   ├── LoginPage.jsx              # ⭐ New login page
│   │   ├── RegisterPage.jsx           # ⭐ New register page
│   │   ├── NewDashboardPage.jsx       # ⭐ New dashboard
│   │   ├── NewChatPage.jsx            # ⭐ New chat page
│   │   └── ErrorPage.jsx              # (Keep existing)
│   │
│   ├── styles/                         # 🎨 Global Styles
│   │   └── index.css                  # (Keep existing Tailwind)
│   │
│   ├── main.jsx                        # ⭐ App entry point (UPDATED)
│   └── main-old.jsx                    # (Backup of original)
│
├── .env                                # Environment variables
├── .env.example                        # Example env file
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🎯 Key Points

### ⭐ New Files (Must Create)

These are the core files you need to create:

**Priority 1 (Critical):**

```
✅ lib/api/client.js
✅ lib/storage/tokenStorage.js
✅ lib/gemini/gemini.js
✅ features/auth/context/AuthContext.jsx
✅ features/auth/components/ProtectedRoute.jsx
✅ features/auth/components/LoginForm.jsx
✅ features/auth/components/RegisterForm.jsx
✅ features/auth/api/authApi.js
✅ features/chat/api/chatApi.js
✅ features/chat/hooks/useChat.js
✅ features/chat/hooks/useChatList.js
✅ pages/LoginPage.jsx
✅ pages/RegisterPage.jsx
✅ pages/NewDashboardPage.jsx
✅ pages/NewChatPage.jsx
✅ shared/components/Spinner.jsx
✅ main.jsx (UPDATE)
```

**Priority 2 (Nice to Have):**

```
⭕ shared/components/Button.jsx
⭕ shared/components/ErrorBoundary.jsx
⭕ shared/hooks/useDebounce.js
⭕ shared/utils/validators.js
⭕ shared/utils/formatters.js
```

---

## 📦 Existing Files to Keep/Update

### Keep As-Is

```
✓ components/Conversation.jsx        # Can reuse
✓ components/Header.jsx              # Can reuse
✓ layouts/RootLayout.jsx             # Can reuse
✓ pages/HomePage.jsx                 # Keep
✓ pages/ErrorPage.jsx                # Keep
✓ index.css                          # Keep Tailwind config
```

### Remove (Old Clerk Files)

```
❌ pages/SignInPage.jsx              # Replace with LoginPage.jsx
❌ pages/SignUpPage.jsx              # Replace with RegisterPage.jsx
❌ Any Clerk-related code
```

### Update

```
🔄 main.jsx                          # Update routing & add AuthProvider
🔄 pages/ChatPage.jsx                # Update to use new hooks
🔄 pages/DashboardPage.jsx           # Update to use new hooks
🔄 libs/chat_service.js              # Replace with features/chat/api/chatApi.js
```

---

## 🗂️ Migration Strategy

### Step 1: Create New Structure

```bash
cd client/src

# Create feature folders
mkdir -p features/auth/{api,components,context,hooks}
mkdir -p features/chat/{api,components,hooks}
mkdir -p features/dashboard/{components,hooks}

# Create lib folders
mkdir -p lib/{api,storage,gemini}

# Create shared folders
mkdir -p shared/{components,hooks,utils}
```

### Step 2: Copy New Files

Place all the new files I created in their respective locations.

### Step 3: Update Imports

Update your existing components to use new imports:

```javascript
// OLD
import { useUser } from "@clerk/clerk-react";
import chatService from "../libs/chat_service";

// NEW
import { useAuth } from "../features/auth/context/AuthContext";
import { chatApi } from "../features/chat/api/chatApi";
```

---

## 🎨 Folder Naming Conventions

| Folder        | Purpose           | Naming                     |
| ------------- | ----------------- | -------------------------- |
| `features/`   | Feature modules   | Singular noun (auth, chat) |
| `components/` | React components  | PascalCase.jsx             |
| `hooks/`      | Custom hooks      | useCamelCase.js            |
| `api/`        | API services      | camelCaseApi.js            |
| `utils/`      | Utility functions | camelCase.js               |
| `context/`    | Context providers | PascalCaseContext.jsx      |

---

## 📊 File Size Guidelines

Keep files focused and small:

| File Type   | Lines of Code | Max |
| ----------- | ------------- | --- |
| Component   | 100-200       | 300 |
| Hook        | 50-150        | 200 |
| API Service | 50-100        | 150 |
| Utility     | 20-50         | 100 |

If a file exceeds these limits, consider splitting it.

---

## 🔍 How to Navigate

### Finding Auth Code

```
features/auth/
├── How users login/register?     → components/LoginForm.jsx
├── Auth state management?        → context/AuthContext.jsx
├── API calls?                    → api/authApi.js
├── Route protection?             → components/ProtectedRoute.jsx
```

### Finding Chat Code

```
features/chat/
├── Chat operations?              → hooks/useChat.js
├── Chat list?                    → hooks/useChatList.js
├── API calls?                    → api/chatApi.js
├── UI components?                → components/
```

### Finding API Code

```
lib/api/
├── How are requests made?        → client.js
├── How are tokens attached?      → client.js (interceptor)
├── Error handling?               → client.js (interceptor)
```

---

## 🎯 Quick Reference

### To Add a New Feature

1. Create folder in `features/`
2. Add `api/`, `components/`, `hooks/` subfolders
3. Keep feature code self-contained
4. Export main components/hooks

### To Add a New Page

1. Create in `pages/`
2. Import feature hooks/components
3. Add route in `main.jsx`
4. Test protected route if needed

### To Add a Utility

1. Create in `shared/utils/`
2. Keep functions pure
3. Add unit tests
4. Export from index.js

---

## ✅ Verification Checklist

After setting up the structure:

- [ ] All folders created
- [ ] New files in correct locations
- [ ] Old Clerk files removed
- [ ] Imports updated
- [ ] No broken imports
- [ ] App runs without errors
- [ ] Can navigate to all pages

---

## 📝 Notes

### Why This Structure?

1. **Scalability** - Easy to add new features without affecting others
2. **Maintainability** - Related code is grouped together
3. **Testability** - Each feature can be tested independently
4. **Team Collaboration** - Multiple people can work on different features
5. **Code Discovery** - Easy to find where code lives

### When to Deviate?

This structure is a guideline, not a law. Adjust based on:

- Team size
- Project complexity
- Specific requirements
- Personal preference

**But keep these principles:**

- Features are self-contained
- Shared code is truly shared
- Clear separation of concerns
- Consistent naming conventions

---

That's it! Your new folder structure is ready for production. 🚀
