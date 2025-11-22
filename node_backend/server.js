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
startScheduler();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/contacts", require("./src/routes/contactRoutes"));
app.use("/api/sos", require("./src/routes/sosRoutes"));
app.use("/api/location", require("./src/routes/locationRoutes"));
app.use("/api/geofence", require("./src/routes/geofenceRoutes"));
app.use("/api/trips", require("./src/routes/tripRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("Women Safety App Backend is running...");
});

// Error Handling Middleware
// I noticed validateRequest.js in the file list, let's check if it has error handlers.
// If not, I'll define them here or in a separate file.
// For now, I will define standard error handlers here to be safe.

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log("Received kill signal, shutting down gracefully");
  server.close(() => {
    console.log("Closed out remaining connections");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });

  // Force close server after 10 secs
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  console.log(err.stack);
  process.exit(1);
});
