/**
 * Register Form Component
 *
 * Custom registration form with validation
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

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

    // Name validation (optional field)
    if (formData.name && formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
      });

      toast.success("Account created successfully!");

      // Redirect to dashboard after successful registration
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
      const errorMsg =
        error.message || "Registration failed. Email may already be in use.";
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
          Create Account
        </h2>

        {serverError && (
          <div className="mb-4 p-3 bg-red-50/80 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 mb-2"
            >
              Name (Optional)
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.name
                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                  : "border-zinc-300 focus:ring-zinc-300 focus:border-zinc-400"
              }`}
              placeholder="John Doe"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-zinc-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.confirmPassword
                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                  : "border-zinc-300 focus:ring-zinc-300 focus:border-zinc-400"
              }`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-900 text-white py-3 px-4 rounded-xl hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-zinc-900 hover:text-zinc-700 font-medium transition-colors duration-200"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
