// MUST BE FIRST LINE
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const connectDB = require("./src/config/db");
const { notFound, errorHandler } = require("./src/middleware/validateRequest");
const { startScheduler } = require("./src/services/checkInScheduler");

// Connect to database
connectDB();

// Start scheduler only if database is connected
mongoose.connection.once("open", () => {
  try {
    startScheduler();
    console.log("✅ Check-in scheduler started");
  } catch (error) {
    console.error("⚠️  Failed to start scheduler:", error.message);
    // Don't crash, scheduler is not critical
  }
});

const app = express();

// Trust proxy (important for Render/Heroku)
app.set("trust proxy", 1);

// Middleware
app.use(express.json({ limit: "10mb" })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined")); // More detailed logs in production
}

// Request timeout middleware (prevent hanging requests)
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 second timeout
  res.setTimeout(30000);
  next();
});

// Health check endpoint (for Render/monitoring services)
app.get("/health", (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };

  // Return 503 if database is not connected
  const statusCode = mongoose.connection.readyState === 1 ? 200 : 503;
  res.status(statusCode).json(health);
});

// Service status endpoint
app.get("/status", async (req, res) => {
  try {
    const { checkTwilioStatus } = require("./src/services/smsService");

    const status = {
      server: "running",
      database: {
        status:
          mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        host: mongoose.connection.host || "unknown",
        name: mongoose.connection.name || "unknown",
      },
      sms: checkTwilioStatus(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get status",
      message: error.message,
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "SAHAYA Women Safety App Backend",
    status: "running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      status: "/status",
      api: "/api/*",
    },
  });
});

// API Routes - wrapped in try-catch for safety
try {
  app.use("/api/auth", require("./src/routes/authRoutes"));
  app.use("/api/contacts", require("./src/routes/contactRoutes"));
  app.use("/api/sos", require("./src/routes/sosRoutes"));
  app.use("/api/location", require("./src/routes/locationRoutes"));
  app.use("/api/geofence", require("./src/routes/geofenceRoutes"));
  app.use("/api/trips", require("./src/routes/tripRoutes"));
  app.use("/api/admin", require("./src/routes/adminRoutes"));
  console.log("✅ All API routes loaded successfully");
} catch (error) {
  console.error("❌ Error loading routes:", error.message);
  // Continue running even if some routes fail to load
}

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`❌ Error: ${err.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    path: req.originalUrl,
    method: req.method,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    console.log("✅ HTTP server closed");

    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("⚠️  Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  console.error(err.stack);

  // In production, log but don't crash
  if (process.env.NODE_ENV !== "production") {
    server.close(() => process.exit(1));
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  console.error(err.stack);

  // Always exit on uncaught exception
  process.exit(1);
});

module.exports = app; // Export for testing
