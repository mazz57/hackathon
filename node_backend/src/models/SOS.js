const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },
    triggerType: {
      type: String,
      enum: ["SHAKE", "POWER_BUTTON", "APP_BUTTON"],
      default: "manual",
    },
    status: {
      type: String,
      enum: ["active", "resolved", "false_alarm"],
      default: "active",
    },
    notificationsSent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SOS", sosSchema);
