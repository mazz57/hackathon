const dbService = require("../services/dbService");
const smsService = require("../services/smsService");

// @desc    Trigger SOS
// @route   POST /sos/trigger
// @access  Private
const triggerSOS = async (req, res) => {
  try {
    const { location, triggerType, latitude, longitude } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Support both formats: {location: {lat, lon}} or {latitude, longitude}
    let sosLocation;
    if (location && location.lat !== undefined && location.lon !== undefined) {
      sosLocation = location;
    } else if (latitude !== undefined && longitude !== undefined) {
      sosLocation = { lat: latitude, lon: longitude };
    } else {
      return res.status(400).json({
        message:
          "Location is required (provide either location.lat/lon or latitude/longitude)",
      });
    }

    console.log(
      `📍 SOS triggered by user: ${user._id} at ${sosLocation.lat}, ${sosLocation.lon}`
    );

    // 1. Save SOS Event
    let sosEvent;
    try {
      sosEvent = await dbService.saveSOS({
        user: user._id,
        location: sosLocation,
        triggerType: triggerType || "MANUAL",
      });
      console.log(`✅ SOS event saved: ${sosEvent._id}`);
    } catch (error) {
      console.error("❌ Failed to save SOS event:", error.message);
      // Continue even if save fails - SMS is more critical
    }

    // 2. Get Contacts
    let contacts = [];
    try {
      contacts = await dbService.getContacts(user._id);
      console.log(`📞 Found ${contacts.length} emergency contacts`);
    } catch (error) {
      console.error("❌ Failed to get contacts:", error.message);
      return res.status(500).json({
        message: "Failed to retrieve emergency contacts",
        error: error.message,
      });
    }

    if (contacts.length === 0) {
      return res.status(400).json({
        message: "No emergency contacts found. Please add contacts first.",
        sosId: sosEvent?._id,
      });
    }

    const phoneNumbers = contacts.map((c) => c.phone).filter(Boolean);

    // 3. Send SMS
    let smsResults = [];
    try {
      const message = `🚨 SOS ALERT! ${
        user.name
      } needs help!\nLocation: https://maps.google.com/?q=${sosLocation.lat},${
        sosLocation.lon
      }\nTime: ${new Date().toLocaleString()}`;

      smsResults = await smsService.sendBulkSMS(phoneNumbers, message);

      const successCount = smsResults.filter((r) => r.success).length;
      console.log(
        `📊 SMS sent: ${successCount}/${smsResults.length} successful`
      );
    } catch (error) {
      console.error("❌ SMS sending failed:", error.message);
      // Don't fail the request - SOS was still logged
    }

    res.status(201).json({
      message: "SOS alert triggered",
      sosId: sosEvent?._id,
      contactsNotified: smsResults.filter((r) => r.success).length,
      totalContacts: contacts.length,
      results: smsResults,
      location: sosLocation,
    });
  } catch (error) {
    console.error("❌ SOS trigger error:", error.message);
    res.status(500).json({
      message: "Failed to trigger SOS",
      error: error.message,
    });
  }
};

// @desc    SMS Fallback Trigger
// @route   POST /sos/sms-trigger
// @access  Public (for low-network scenarios)
const smsFallbackTrigger = async (req, res) => {
  try {
    const { userId, phone, location, triggerType, latitude, longitude } =
      req.body;

    // Find user by userId or phone
    let user;
    try {
      if (userId) {
        user = await dbService.getUserById(userId);
      } else if (phone) {
        user = await dbService.getUserByPhone(phone);
      } else {
        return res.status(400).json({
          message: "Either userId or phone is required",
        });
      }

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
    } catch (error) {
      console.error("❌ User lookup failed:", error.message);
      return res.status(500).json({
        message: "Failed to find user",
        error: error.message,
      });
    }

    // Support both location formats
    let sosLocation;
    if (location && location.lat !== undefined && location.lon !== undefined) {
      sosLocation = location;
    } else if (latitude !== undefined && longitude !== undefined) {
      sosLocation = { lat: latitude, lon: longitude };
    } else {
      return res.status(400).json({
        message:
          "Location is required (provide either location.lat/lon or latitude/longitude)",
      });
    }

    console.log(`📍 Low-network SOS from user: ${user._id}`);

    // Get contacts
    let contacts = [];
    try {
      contacts = await dbService.getContacts(user._id);
    } catch (error) {
      console.error("❌ Failed to get contacts:", error.message);
      return res.status(500).json({
        message: "Failed to retrieve emergency contacts",
        error: error.message,
      });
    }

    if (contacts.length === 0) {
      return res.status(400).json({
        message: "No emergency contacts found",
      });
    }

    const phoneNumbers = contacts.map((c) => c.phone).filter(Boolean);

    // Send SMS
    let smsResults = [];
    try {
      const message = `🚨 EMERGENCY! ${
        user.name
      } triggered a low-network SOS alert.
Location: https://maps.google.com/?q=${sosLocation.lat},${sosLocation.lon}
Time: ${new Date().toLocaleString()}
Please reach them immediately.`;

      smsResults = await smsService.sendBulkSMS(phoneNumbers, message);
    } catch (error) {
      console.error("❌ SMS sending failed:", error.message);
    }

    const successCount = smsResults.filter((r) => r.success).length;

    res.status(200).json({
      message: "Low-network SOS processed",
      status: successCount > 0 ? "sent" : "failed",
      contactsNotified: successCount,
      totalContacts: contacts.length,
      results: smsResults,
    });
  } catch (error) {
    console.error("❌ SMS fallback error:", error.message);
    res.status(500).json({
      message: "Failed to process low-network SOS",
      error: error.message,
    });
  }
};

module.exports = {
  triggerSOS,
  smsFallbackTrigger,
};
