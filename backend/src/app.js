import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config/index.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import prisma from "./config/database.js";

// Import routes
import authRoutes from "./modules/auth/auth.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware with CSP configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS configuration
app.use(
  cors({
    origin: config.cors.origins,
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging (only in development)
if (config.nodeEnv === "development") {
  app.use(requestLogger);
}

// Health check
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Service unavailable",
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      database: "disconnected",
      error: error.message,
    });
  }
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chats", chatRoutes);

// Serve React static files in production
if (config.nodeEnv === "production") {
  const frontendBuildPath = path.join(__dirname, "../../frontend/dist");

  // Serve static files
  app.use(express.static(frontendBuildPath));

  // Handle React routing - send all non-API requests to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  // In development, just show a message for non-API routes
  app.get("/", (req, res) => {
    res.json({
      message: "API Server is running",
      environment: "development",
      docs: "/health for health check",
    });
  });
}

// 404 handler for API routes (only reached if no route matches)
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
