/**
 * Token Storage Utility
 *
 * Centralized token management with localStorage
 * Can be easily switched to cookies or sessionStorage
 */

const TOKEN_KEY = "chatbot_auth_token";
const USER_KEY = "chatbot_user";

export const tokenStorage = {
  /**
   * Save authentication token
   */
  setToken(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Failed to save token:", error);
    }
  },

  /**
   * Get authentication token
   */
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Failed to get token:", error);
      return null;
    }
  },

  /**
   * Remove authentication token
   */
  clearToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Failed to clear token:", error);
    }
  },

  /**
   * Check if user is authenticated
   */
  hasToken() {
    return !!this.getToken();
  },

  /**
   * Save user data
   */
  setUser(user) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  },

  /**
   * Get user data
   */
  getUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Failed to get user:", error);
      return null;
    }
  },
};

/**
 * Production alternative: httpOnly cookies
 *
 * Backend sends token in Set-Cookie header with httpOnly flag
 * Frontend makes requests with credentials: 'include'
 * More secure against XSS attacks
 *
 * Example:
 *
 * // Backend (auth.controller.js)
 * res.cookie('token', token, {
 *   httpOnly: true,
 *   secure: process.env.NODE_ENV === 'production',
 *   sameSite: 'strict',
 *   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
 * });
 *
 * // Frontend (api client)
 * axios.create({
 *   withCredentials: true
 * })
 */
