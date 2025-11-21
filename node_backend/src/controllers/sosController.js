const dbService = require("../services/dbService");
const smsService = require("../services/smsService");

// @desc    Trigger SOS
// @route   POST /sos/trigger
// @access  Private
const triggerSOS = async (req, res) => {
  const { location, triggerType, latitude, longitude } = req.body;
  const user = req.user;

  // Support both formats: {location: {lat, lon}} or {latitude, longitude}
  let sosLocation;
  if (location && location.lat && location.lon) {
    sosLocation = location;
  } else if (latitude !== undefined && longitude !== undefined) {
    sosLocation = { lat: latitude, lon: longitude };
  } else {
    res.status(400);
    throw new Error(
      "Location is required (provide either location.lat/lon or latitude/longitude)"
    );
  }

  console.log("Triggering SOS for user:", user._id);

  // 1. Save SOS Event
  console.log("Saving SOS event...");
  const sosEvent = await dbService.saveSOS({
    user: user._id,
    location: sosLocation,
    triggerType,
  });
  console.log("SOS event saved:", sosEvent._id);

  // 2. Get Contacts
  console.log("Getting contacts...");
  const contacts = await dbService.getContacts(user._id);
  console.log("Contacts found:", contacts.length);
  const phoneNumbers = contacts.map((c) => c.phone);

  // 3. Send SMS
  console.log("Sending SMS to:", phoneNumbers);
  const message = `SOS! ${user.name} needs help! Location: https://maps.google.com/?q=${sosLocation.lat},${sosLocation.lon}`;
  const smsResults = await smsService.sendBulkSMS(phoneNumbers, message);
  console.log("SMS Results:", smsResults);

  // 4. Update SOS with SMS status (Optional: In a real app, we'd update the document)
  // For now, we just return the results.

  res.status(201).json({
    sosId: sosEvent._id,
    smsSent: smsResults.length,
    results: smsResults,
  });
};

// @desc    SMS Fallback Trigger
// @route   POST /sos/sms-trigger
// @access  Public (or protected with a special API key if possible, but usually Public for fallback)
const smsFallbackTrigger = async (req, res) => {
  // This endpoint simulates receiving an SMS webhook or a direct request from the app
  // when data connection is flaky but a small HTTP request might make it.
  // Or it could be used by a separate SMS gateway.

  // For this implementation, we assume the app sends this.
  const { userId, phone, location, triggerType, latitude, longitude } =
    req.body;

  // Find user by userId or phone
  let user;
  if (userId) {
    user = await dbService.getUserById(userId);
  } else if (phone) {
    user = await dbService.getUserByPhone(phone);
  } else {
    res.status(400);
    throw new Error("Either userId or phone is required");
  }

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Support both location formats
  let sosLocation;
  if (location && location.lat && location.lon) {
    sosLocation = location;
  } else if (latitude !== undefined && longitude !== undefined) {
    sosLocation = { lat: latitude, lon: longitude };
  } else {
    res.status(400);
    throw new Error(
      "Location is required (provide either location.lat/lon or latitude/longitude)"
    );
  }

  const contacts = await dbService.getContacts(user._id);
  const phoneNumbers = contacts.map((c) => c.phone);

  const message = `${user.name} triggered an emergency alert.
Location: https://maps.google.com/?q=${sosLocation.lat},${sosLocation.lon}
Please reach them immediately.`;
  const smsResults = await smsService.sendBulkSMS(phoneNumbers, message);

  res.status(200).json({ status: "queued", results: smsResults });
};

module.exports = {
  triggerSOS,
  smsFallbackTrigger,
};
