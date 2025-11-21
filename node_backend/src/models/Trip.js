const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    eta: {
      type: Date,
    },
    estimatedDuration: {
      type: Number, // in minutes
    },
    status: {
      type: String,
      enum: ["active", "completed", "alerted", "cancelled"],
      default: "active",
    },
    startLocation: {
      lat: Number,
      lon: Number,
    },
    endLocation: {
      lat: Number,
      lon: Number,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);
