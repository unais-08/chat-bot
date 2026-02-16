/**
 * Login Form Component
 *
 * Custom login form with validation
 */

import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Check if redirected due to session expiration
  const sessionExpired =
    new URLSearchParams(location.search).get("session") === "expired";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear server error
    if (serverError) {
      setServerError("");
    }
  };

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setServerError("");

    try {
      await login(formData);
      toast.success("Welcome back!");

      // Redirect to the page they were trying to access, or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error.message || "Invalid email or password";
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
        <h2 className="text-2xl font-semibold text-center mb-8 text-zinc-800">
          Welcome Back
        </h2>

        {sessionExpired && (
          <div className="mb-4 p-3 bg-yellow-50/80 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800">
              Your session has expired. Please login again.
            </p>
          </div>
        )}

        {serverError && (
          <div className="mb-4 p-3 bg-red-50/80 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.email
                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                  : "border-zinc-300 focus:ring-zinc-300 focus:border-zinc-400"
              }`}
              placeholder="you@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.password
                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                  : "border-zinc-300 focus:ring-zinc-300 focus:border-zinc-400"
              }`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-900 text-white py-3 px-4 rounded-xl hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-zinc-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-zinc-900 hover:text-zinc-700 font-medium transition-colors duration-200"
          >
            Register here
          </Link>
        </p>
      </div>
      {/* Demo Credentials Card */}
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Demo Account
        </p>

        <div className="mt-3 space-y-2 text-sm text-zinc-700">
          <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-zinc-200">
            <span className="text-zinc-500">Email</span>
            <span className="font-medium text-zinc-900">test@gmail.com</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-zinc-200">
            <span className="text-zinc-500">Password</span>
            <span className="font-medium text-zinc-900">Test@1234</span>
          </div>
        </div>
      </div>
    </div>
  );
};
