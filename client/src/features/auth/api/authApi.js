/**
 * Authentication API Service
 *
 * All auth-related API calls
 */

import { api } from "../../../lib/api/client";

export const authApi = {
  /**
   * Register new user
   */
  async register({ email, password, name }) {
    const response = await api.post("/auth/register", {
      email,
      password,
      name,
    });
    return response.data;
  },

  /**
   * Login user
   */
  async login({ email, password }) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Logout (client-side only - clear token)
   * If using httpOnly cookies, make a POST to /auth/logout on backend
   */
  logout() {
    // Just clear token from storage
    // Token validation happens on backend
    return Promise.resolve();
  },
};
