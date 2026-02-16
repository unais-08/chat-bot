import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import prisma from "./config/database.js";
import { config } from "./config/index.js";

const PORT = config.port;

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(error.name, error.message);
  process.exit(1);
});

// Test database connection and start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Start server
    const server = app.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`,
      );
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (error) => {
      console.error("UNHANDLED REJECTION! Shutting down...");
      console.error(error);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      await prisma.$disconnect();
      server.close(() => {
        console.log("Process terminated");
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received. Shutting down gracefully...");
      await prisma.$disconnect();
      server.close(() => {
        console.log("Process terminated");
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
