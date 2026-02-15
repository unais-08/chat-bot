/**
 * Authentication Context
 *
 * Provides auth state and actions throughout the app
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { authApi } from "../api/authApi";
import { tokenStorage } from "../../../lib/storage/tokenStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.getToken();
      const savedUser = tokenStorage.getUser();

      if (token && savedUser) {
        // Try to verify token with backend
        try {
          const response = await authApi.getCurrentUser();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear everything
          console.error("Token verification failed:", error);
          tokenStorage.clearToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Listen for unauthorized events
   */
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async ({ email, password }) => {
    const response = await authApi.login({ email, password });

    const { user: userData, token } = response.data;

    // Save token and user
    tokenStorage.setToken(token);
    tokenStorage.setUser(userData);

    // Update state
    setUser(userData);
    setIsAuthenticated(true);

    return userData;
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async ({ email, password, name }) => {
    const response = await authApi.register({ email, password, name });

    const { user: userData, token } = response.data;

    // Save token and user
    tokenStorage.setToken(token);
    tokenStorage.setUser(userData);

    // Update state
    setUser(userData);
    setIsAuthenticated(true);

    return userData;
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call result
      tokenStorage.clearToken();
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    }
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.data);
      tokenStorage.setUser(response.data);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // If refresh fails, logout
      logout();
    }
  }, [logout]);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
