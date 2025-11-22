const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MongoDB connection options for production
    const options = {
      maxPoolSize: 10, // Connection pool size
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // In production, retry connection instead of crashing immediately
    if (process.env.NODE_ENV === "production") {
      console.log("🔄 Retrying database connection in 5 seconds...");
      setTimeout(connectDB, 5000);
    } else {
      // In development, exit to show the error clearly
      process.exit(1);
    }
  }
};

module.exports = connectDB;
