# 📝 Code Examples & Patterns

Production-grade code examples for common scenarios in the chatbot application.

---

## 🔐 Authentication Examples

### Example 1: Using Auth Hook in Components

```jsx
import { useAuth } from "../features/auth/context/AuthContext";

const ProfileComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Welcome, {user.name || user.email}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Example 2: Custom Auth Form Hook

```javascript
// features/auth/hooks/useAuthForm.js
import { useState } from "react";

export const useAuthForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (onSubmit, validate) => {
    setIsSubmitting(true);

    // Validate
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await onSubmit(values);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};
```

### Example 3: Redirect After Login

```jsx
import { useLocation } from "react-router-dom";

const LoginForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (credentials) => {
    await login(credentials);

    // Redirect to intended page or dashboard
    const from = location.state?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });
  };

  // ...
};
```

---

## 💬 Chat Management Examples

### Example 4: Chat List with Infinite Scroll

```jsx
import { useEffect, useRef } from "react";
import { useChatList } from "../features/chat/hooks/useChatList";

const ChatList = () => {
  const { chats, isLoading, pagination, loadMore } = useChatList();
  const observerRef = useRef();

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [pagination.hasMore, isLoading, loadMore]);

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
      {pagination.hasMore && (
        <div ref={observerRef} className="loading-trigger">
          {isLoading && <Spinner />}
        </div>
      )}
    </div>
  );
};
```

### Example 5: Optimistic Message Updates

```javascript
// features/chat/hooks/useOptimisticMessages.js
import { useState, useCallback } from "react";

export const useOptimisticMessages = (initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);

  const addOptimisticMessage = useCallback((tempMessage) => {
    setMessages((prev) => [...prev, tempMessage]);
    return tempMessage.id;
  }, []);

  const replaceMessage = useCallback((tempId, realMessage) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === tempId ? realMessage : msg)),
    );
  }, []);

  const removeMessage = useCallback((messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  return {
    messages,
    addOptimisticMessage,
    replaceMessage,
    removeMessage,
  };
};
```

### Example 6: Debounced Chat Search

```jsx
import { useState, useMemo } from "react";
import { useDebounce } from "../shared/hooks/useDebounce";

const ChatSearch = ({ chats }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredChats = useMemo(() => {
    if (!debouncedSearch) return chats;

    return chats.filter((chat) =>
      chat.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [chats, debouncedSearch]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search chats..."
      />
      <ChatList chats={filteredChats} />
    </div>
  );
};

// shared/hooks/useDebounce.js
import { useState, useEffect } from "react";

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

---

## 🎨 UI Component Examples

### Example 7: Reusable Button Component

```jsx
// shared/components/Button.jsx
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) => {
  const baseStyles =
    "rounded-md font-medium transition-colors focus:outline-none focus:ring-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <Spinner size="sm" className="mr-2" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
```

### Example 8: Message Bubble Component

```jsx
// features/chat/components/MessageBubble.jsx
import { memo } from "react";

export const MessageBubble = memo(({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-3xl px-4 py-3 rounded-lg ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-800 border border-gray-200"
        }`}
      >
        {/* Avatar */}
        {!isUser && (
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mr-2" />
            <span className="text-xs font-medium text-gray-500">
              AI Assistant
            </span>
          </div>
        )}

        {/* Content */}
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

        {/* Timestamp */}
        <p
          className={`text-xs mt-2 ${isUser ? "text-blue-100" : "text-gray-400"}`}
        >
          {new Date(message.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";
```

### Example 9: Error Boundary

```jsx
// shared/components/ErrorBoundary.jsx
import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    // You could send to error tracking service here
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage:
// <ErrorBoundary>
//   <YourApp />
// </ErrorBoundary>
```

---

## 🛠️ Utility Functions

### Example 10: API Error Handler

```javascript
// shared/utils/errorHandler.js

export const handleApiError = (error) => {
  // Network error
  if (error.status === 0) {
    return {
      title: "Network Error",
      message: "Please check your internet connection",
      shouldRetry: true,
    };
  }

  // Unauthorized
  if (error.status === 401) {
    return {
      title: "Authentication Error",
      message: "Please login again",
      shouldRetry: false,
      shouldLogout: true,
    };
  }

  // Forbidden
  if (error.status === 403) {
    return {
      title: "Access Denied",
      message: "You don't have permission to access this resource",
      shouldRetry: false,
    };
  }

  // Not Found
  if (error.status === 404) {
    return {
      title: "Not Found",
      message: "The requested resource was not found",
      shouldRetry: false,
    };
  }

  // Server Error
  if (error.status >= 500) {
    return {
      title: "Server Error",
      message: "Something went wrong on our end. Please try again later.",
      shouldRetry: true,
    };
  }

  // Default
  return {
    title: "Error",
    message: error.message || "An unexpected error occurred",
    shouldRetry: false,
  };
};
```

### Example 11: Date Formatters

```javascript
// shared/utils/formatters.js

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Less than 1 minute
  if (diffMins < 1) return "Just now";

  // Less than 1 hour
  if (diffMins < 60) return `${diffMins}m ago`;

  // Less than 24 hours
  if (diffHours < 24) return `${diffHours}h ago`;

  // Less than 7 days
  if (diffDays < 7) return `${diffDays}d ago`;

  // Older - show date
  return date.toLocaleDateString();
};

export const formatMessageTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
```

### Example 12: Input Validators

```javascript
// shared/utils/validators.js

export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Invalid email format";
    return null;
  },

  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (value.length > 100) return "Password is too long";
    return null;
  },

  required: (fieldName) => (value) => {
    if (!value || value.trim() === "") {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },
};

// Usage:
const errors = {};
errors.email = validators.email(formData.email);
errors.password = validators.password(formData.password);
```

---

## 🧪 Testing Examples

### Example 13: Testing Auth Hook

```javascript
// features/auth/__tests__/useAuth.test.js
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";

describe("useAuth", () => {
  it("should login user successfully", async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: "test@test.com",
        password: "password123",
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeTruthy();
  });

  it("should logout user", async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    // First login
    await act(async () => {
      await result.current.login({
        email: "test@test.com",
        password: "password123",
      });
    });

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

### Example 14: Testing API Client

```javascript
// lib/api/__tests__/client.test.js
import { api } from "../client";
import { tokenStorage } from "../../storage/tokenStorage";

jest.mock("../../storage/tokenStorage");

describe("API Client", () => {
  beforeEach(() => {
    tokenStorage.getToken.mockReturnValue("fake-token");
  });

  it("should attach token to requests", async () => {
    const mockFetch = jest.spyOn(global, "fetch");

    await api.get("/test");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fake-token",
        }),
      }),
    );
  });
});
```

---

## 🎯 Advanced Patterns

### Example 15: Custom Hook with Polling

```javascript
// shared/hooks/usePolling.js
import { useEffect, useRef } from "react";

export const usePolling = (callback, interval = 5000, enabled = true) => {
  const savedCallback = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (!enabled) return;

    const tick = () => savedCallback.current();
    const id = setInterval(tick, interval);

    return () => clearInterval(id);
  }, [interval, enabled]);
};

// Usage:
const ChatPage = () => {
  const { refetch } = useChat(chatId);

  // Poll for new messages every 5 seconds
  usePolling(refetch, 5000, true);

  // ...
};
```

### Example 16: Compound Component Pattern

```jsx
// features/chat/components/ChatWindow/index.jsx
const ChatWindowContext = createContext();

export const ChatWindow = ({ children, chatId }) => {
  const { messages, sendMessage, isLoading } = useChat(chatId);

  return (
    <ChatWindowContext.Provider value={{ messages, sendMessage, isLoading }}>
      <div className="chat-window">{children}</div>
    </ChatWindowContext.Provider>
  );
};

ChatWindow.Header = ({ title }) => <div className="chat-header">{title}</div>;

ChatWindow.Messages = () => {
  const { messages, isLoading } = useContext(ChatWindowContext);

  if (isLoading) return <Spinner />;

  return (
    <div className="messages">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
};

ChatWindow.Input = () => {
  const { sendMessage } = useContext(ChatWindowContext);
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
};

// Usage:
<ChatWindow chatId={chatId}>
  <ChatWindow.Header title="Chat Title" />
  <ChatWindow.Messages />
  <ChatWindow.Input />
</ChatWindow>;
```

---

## 🔥 Performance Optimization Examples

### Example 17: Virtualized Message List

```jsx
import { FixedSizeList } from "react-window";

const VirtualizedMessageList = ({ messages }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <MessageBubble message={messages[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={messages.length}
      itemSize={100}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

### Example 18: Memoized Chat List

```jsx
import { memo, useMemo } from "react";

const ChatItem = memo(({ chat, onClick }) => (
  <div onClick={onClick} className="chat-item">
    <h3>{chat.title}</h3>
    <p>{formatDate(chat.createdAt)}</p>
  </div>
));

ChatItem.displayName = "ChatItem";

const ChatList = ({ chats, onChatSelect }) => {
  const sortedChats = useMemo(() => {
    return [...chats].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    );
  }, [chats]);

  return (
    <div>
      {sortedChats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          onClick={() => onChatSelect(chat.id)}
        />
      ))}
    </div>
  );
};
```

---

## 🎨 Styling Patterns

### Example 19: Tailwind Custom Components

```jsx
// shared/components/Card.jsx
export const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Header = ({ children, className = "" }) => (
  <div className={`mb-4 pb-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

Card.Footer = ({ children, className = "" }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

// Usage:
<Card>
  <Card.Header>
    <h2>Chat Statistics</h2>
  </Card.Header>
  <Card.Body>
    <p>Total Chats: 25</p>
  </Card.Body>
</Card>;
```

---

These examples demonstrate production-ready patterns that are:

- **Maintainable** - Easy to understand and modify
- **Testable** - Can be unit tested
- **Reusable** - DRY principles applied
- **Performant** - Optimized for React
- **Scalable** - Patterns that grow with your app
