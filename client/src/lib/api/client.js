/**
 * API Client with Axios
 *
 * Centralized HTTP client with:
 * - Automatic token attachment
 * - Request/response interceptors
 * - Error handling
 * - Token expiration handling
 */

import axios from "axios";
import { tokenStorage } from "../storage/tokenStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(
        `🚀 API Request: ${config.method.toUpperCase()} ${config.url}`,
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }

    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Log error in development
      if (import.meta.env.DEV) {
        console.error(`❌ API Error ${status}:`, data);
      }

      // Handle 401 Unauthorized - token expired or invalid
      if (status === 401) {
        tokenStorage.clearToken();

        // Dispatch custom event for auth failure
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));

        // Only redirect if not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?session=expired";
        }
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error("Access forbidden");
      }

      // Handle 404 Not Found
      if (status === 404) {
        console.error("Resource not found");
      }

      // Handle 500 Server Error
      if (status === 500) {
        console.error("Server error");
      }

      // Return normalized error
      return Promise.reject({
        status,
        message: data?.message || "An error occurred",
        errors: data?.errors || [],
        originalError: error,
      });
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error("❌ Network Error:", error.message);
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your internet connection.",
        originalError: error,
      });
    } else {
      // Something else happened
      console.error("❌ Error:", error.message);
      return Promise.reject({
        message: error.message || "An unexpected error occurred",
        originalError: error,
      });
    }
  },
);

/**
 * API Client Methods
 */
export const api = {
  // GET request
  get: (url, config = {}) => apiClient.get(url, config),

  // POST request
  post: (url, data, config = {}) => apiClient.post(url, data, config),

  // PUT request
  put: (url, data, config = {}) => apiClient.put(url, data, config),

  // PATCH request
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),

  // DELETE request
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiClient;
