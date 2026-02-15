# 🚀 Implementation Guide - Migrating to New Architecture

This guide will help you migrate from the old Clerk-based frontend to the new custom auth architecture.

## 📋 Pre-Migration Checklist

- [ ] Backend is running and tested
- [ ] Database is set up (PostgreSQL)
- [ ] Environment variables configured
- [ ] Backup existing client code

---

## 🔧 Step 1: Install Dependencies

```bash
cd client

# Install required packages (if not already installed)
npm install axios react-router-dom
npm install @google/generative-ai  # For Gemini AI

# Remove Clerk dependency
npm uninstall @clerk/clerk-react
```

---

## 🗂️ Step 2: Reorganize File Structure

### Create New Directories

```bash
cd src

# Create feature-based structure
mkdir -p features/auth/{components,hooks,context,api}
mkdir -p features/chat/{components,hooks,api}
mkdir -p lib/{api,storage,gemini}
mkdir -p shared/components
```

### Move/Copy New Files

All the files I've created are ready to use:

**Core Infrastructure:**

- `lib/api/client.js` - API client
- `lib/storage/tokenStorage.js` - Token management
- `lib/gemini/gemini.js` - AI service

**Auth Feature:**

- `features/auth/api/authApi.js`
- `features/auth/context/AuthContext.jsx`
- `features/auth/components/ProtectedRoute.jsx`
- `features/auth/components/LoginForm.jsx`
- `features/auth/components/RegisterForm.jsx`

**Chat Feature:**

- `features/chat/api/chatApi.js`
- `features/chat/hooks/useChat.js`
- `features/chat/hooks/useChatList.js`

**Pages:**

- `pages/LoginPage.jsx`
- `pages/RegisterPage.jsx`
- `pages/NewDashboardPage.jsx`
- `pages/NewChatPage.jsx`

**Shared:**

- `shared/components/Spinner.jsx`

---

## ⚙️ Step 3: Update Environment Variables

Create/update `.env` file in the client directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Gemini AI (optional - for AI responses)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🔄 Step 4: Replace Main Entry Point

**Option A: Gradual Migration (Recommended)**

Keep your existing `main.jsx` and test new features separately:

```bash
# Rename current main.jsx as backup
mv src/main.jsx src/main-old.jsx

# Rename new main.jsx
mv src/main-new.jsx src/main.jsx
```

**Option B: Direct Replacement**

Replace the content of `src/main.jsx` with `main-new.jsx` content.

---

## 🧪 Step 5: Test the Implementation

### Start Development Server

```bash
npm run dev
```

### Test Flow

1. **Register Flow:**
   - Navigate to `http://localhost:5173/register`
   - Register a new user
   - Should redirect to dashboard

2. **Login Flow:**
   - Logout and go to login
   - Login with credentials
   - Should redirect to dashboard

3. **Protected Routes:**
   - Try accessing `/dashboard` without login
   - Should redirect to login page

4. **Chat Flow:**
   - Click "New Chat" on dashboard
   - Send a message
   - Check if AI responds
   - Check if chat is saved

5. **Token Expiration:**
   - Open DevTools > Application > Local Storage
   - Delete `chatbot_auth_token`
   - Try accessing protected route
   - Should redirect to login

---

## 🔍 Step 6: Update Existing Components (If Needed)

### Remove Clerk Dependencies

Search for and remove/replace:

```javascript
// OLD - Remove these
import { useUser } from "@clerk/clerk-react";
import { SignIn, SignUp } from "@clerk/clerk-react";
const { user } = useUser();

// NEW - Replace with these
import { useAuth } from "./features/auth/context/AuthContext";
const { user } = useAuth();
```

### Update User Object Access

```javascript
// OLD
user.id; // Clerk user ID
user.emailAddress; // Clerk email
user.primaryEmailAddress; // Clerk email

// NEW
user.id; // PostgreSQL UUID
user.email; // Email
user.name; // Optional name
```

---

## 🐛 Step 7: Common Issues & Solutions

### Issue 1: "useAuth must be used within AuthProvider"

**Solution:** Ensure `<AuthProvider>` wraps your entire app in `main.jsx`

```jsx
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>
```

### Issue 2: API calls fail with 401

**Solutions:**

1. Check if token exists in localStorage
2. Verify backend is running on correct port
3. Check CORS configuration in backend
4. Check `VITE_API_BASE_URL` in `.env`

### Issue 3: Infinite redirect loop

**Solution:** Check `ProtectedRoute` and `PublicOnlyRoute` logic. Ensure `isLoading` is properly handled.

### Issue 4: Token not attaching to requests

**Solution:** Check `lib/api/client.js` request interceptor. Verify `tokenStorage.getToken()` works.

---

## 📊 Step 8: Verify Database

Open a database client or use Prisma Studio:

```bash
cd server
npx prisma studio
```

Check:

- Users are being created
- Chats are being saved
- Messages are being stored

---

## 🚀 Step 9: Production Considerations

### Before Deploying:

1. **Switch to httpOnly Cookies:**
   - Update backend to send tokens in cookies
   - Update API client to use `withCredentials: true`
   - More secure against XSS attacks

2. **Environment Variables:**

   ```bash
   # Production .env
   VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
   VITE_GEMINI_API_KEY=production_key
   ```

3. **Build & Test:**

   ```bash
   npm run build
   npm run preview  # Test production build locally
   ```

4. **CORS Configuration:**
   Ensure backend allows your production frontend domain

5. **Security Headers:**
   - Set proper CSP headers
   - Enable HTTPS
   - Configure secure cookies

---

## 📈 Step 10: Optional Enhancements

### Add Loading Skeletons

Instead of just spinners, create skeleton loaders:

```jsx
// SkeletonChatList.jsx
export const SkeletonChatList = () => (
  <div className="space-y-2">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="h-16 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);
```

### Add Toast Notifications

Install a toast library:

```bash
npm install react-hot-toast
```

Use in components:

```javascript
import toast from "react-hot-toast";

toast.success("Message sent!");
toast.error("Failed to send message");
```

### Add Error Boundary

Wrap sections of your app:

```jsx
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</ErrorBoundary>;
```

---

## ✅ Migration Checklist

- [ ] All new files copied to correct locations
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Main.jsx updated with new routing
- [ ] Clerk dependencies removed
- [ ] Registration tested
- [ ] Login tested
- [ ] Protected routes tested
- [ ] Chat creation tested
- [ ] Message sending tested
- [ ] Token expiration handling tested
- [ ] Logout tested
- [ ] Database verified

---

## 🎓 Key Architectural Changes

### Before (Clerk)

```
User → Clerk SDK → Clerk Servers → Your Backend
```

### After (Custom Auth)

```
User → Login Form → Your Backend → JWT Token → Protected Routes
```

### Authentication Flow Comparison

| Step             | Old (Clerk)               | New (Custom)              |
| ---------------- | ------------------------- | ------------------------- |
| Login            | Clerk `<SignIn>`          | Custom `<LoginForm>`      |
| Token            | Managed by Clerk          | Stored in localStorage    |
| User State       | `useUser()` hook          | `useAuth()` custom hook   |
| Protected Routes | Clerk's built-in          | Custom `<ProtectedRoute>` |
| API Calls        | Clerk token auto-attached | Axios interceptor         |

---

## 📚 Key Files Reference

### Most Important Files

1. **`lib/api/client.js`** - All API logic, interceptors
2. **`features/auth/context/AuthContext.jsx`** - Auth state management
3. **`features/auth/components/ProtectedRoute.jsx`** - Route protection
4. **`features/chat/hooks/useChat.js`** - Chat functionality
5. **`main.jsx`** - App entry point & routing

---

## 🆘 Getting Help

If you encounter issues:

1. Check browser console for errors
2. Check network tab for failed API calls
3. Verify backend logs
4. Check database for data
5. Review this guide's troubleshooting section

---

## 🎯 Next Steps After Migration

1. **Test thoroughly** in different scenarios
2. **Add unit tests** for critical functions
3. **Optimize performance** (memoization, lazy loading)
4. **Add analytics** (track user behavior)
5. **Plan new features** (real-time chat, file uploads)

---

## 🏆 Success Criteria

Your migration is successful when:

✅ Users can register and login  
✅ JWT tokens are managed properly  
✅ Protected routes work correctly  
✅ Chats are created and saved  
✅ Messages are sent and stored  
✅ Token expiration is handled gracefully  
✅ No Clerk dependencies remain  
✅ All data flows through your backend

---

## 🎉 You're Done!

You now have a production-ready, maintainable frontend architecture with:

- Custom authentication (no external dependencies)
- Clean, modular code structure
- Type-safe API layer
- Secure token management
- Scalable feature-based architecture

**Happy coding! 🚀**
