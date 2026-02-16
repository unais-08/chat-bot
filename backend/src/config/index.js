import { configDotenv } from "dotenv";

configDotenv();

export const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || "development",
  jwt: {
    secret:
      process.env.JWT_SECRET || "fallback-secret-key-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:5173",
    ],
  },
};

// Validate after export for better error messages
if (!process.env.JWT_SECRET) {
  console.warn(
    "⚠️  WARNING: JWT_SECRET not found in environment variables. Using fallback (not secure for production)",
  );
}
