const CheckIn = require("../models/CheckIn");
const { notifyContacts } = require("./checkInNotificationService");

let intervalId;
let isRunning = false;

const startScheduler = () => {
  if (isRunning) {
    console.log("⚠️  Check-in scheduler already running");
    return;
  }

  console.log("✅ Check-in scheduler started");
  isRunning = true;

  // Run every 60 seconds
  intervalId = setInterval(async () => {
    try {
      const now = new Date();

      // Find active check-ins where nextCheckInTime < now
      const activeCheckIns = await CheckIn.find({
        status: "active",
        nextCheckInTime: { $lt: now },
      }).populate("user");

      if (activeCheckIns.length > 0) {
        console.log(`📋 Processing ${activeCheckIns.length} overdue check-ins`);
      }

      for (const checkIn of activeCheckIns) {
        try {
          const gracePeriodMs = (checkIn.gracePeriodMinutes || 5) * 60 * 1000;
          const overdueTime = new Date(
            checkIn.nextCheckInTime.getTime() + gracePeriodMs
          );

          if (now > overdueTime) {
            console.log(
              `⚠️  Check-in overdue for user ${
                checkIn.user?.name || "Unknown"
              } (ID: ${checkIn._id})`
            );

            // Mark as missed immediately to prevent double-processing
            checkIn.status = "missed";
            checkIn.missedCount = (checkIn.missedCount || 0) + 1;
            await checkIn.save();

            // Trigger SMS notification (don't await to prevent blocking)
            notifyContacts(checkIn).catch((err) => {
              console.error(
                `❌ Failed to notify contacts for check-in ${checkIn._id}:`,
                err.message
              );
            });
          }
        } catch (checkInError) {
          console.error(
            `❌ Error processing check-in ${checkIn._id}:`,
            checkInError.message
          );
          // Continue processing other check-ins
        }
      }
    } catch (error) {
      console.error("❌ Error in check-in scheduler:", error.message);
      // Don't crash the scheduler - it will retry on next interval
    }
  }, 60000); // runs every minute
};

const stopScheduler = () => {
  if (intervalId) {
    clearInterval(intervalId);
    isRunning = false;
    console.log("✅ Check-in scheduler stopped");
  }
};

module.exports = {
  startScheduler,
  stopScheduler,
};
