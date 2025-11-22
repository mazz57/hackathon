// backend/src/controllers/tripController.js
const dbService = require("../services/dbService");
const smsService = require("../services/smsService");
const geolib = require("geolib");

// Helper: compute meters from lat/lon
const metersBetween = (p1, p2) => {
  return geolib.getDistance(
    { latitude: p1.latitude || p1.lat, longitude: p1.longitude || p1.lon },
    { latitude: p2.latitude || p2.lat, longitude: p2.longitude || p2.lon }
  );
};

// START TRIP
const startTrip = async (req, res) => {
  const { destination, eta, estimatedDuration, startLocation, routePath } =
    req.body;

  if (!destination || !startLocation) {
    res.status(400);
    throw new Error("destination and startLocation are required");
  }

  const trip = await dbService.createTrip({
    user: req.user._id,
    destination,
    eta,
    estimatedDuration,
    startLocation: { lat: startLocation.lat, lon: startLocation.lon },
    routePath: routePath || [], // array of { latitude, longitude }
  });

  res.status(201).json(trip);
};

// END TRIP
const endTrip = async (req, res) => {
  const { tripId } = req.body;
  const trip = await dbService.updateTripStatus(tripId, "completed");
  res.json(trip);
};

// TRIP ALERT (manual)
const tripAlert = async (req, res) => {
  const { tripId } = req.body;
  const user = req.user;

  const trip = await dbService.updateTripStatus(tripId, "alerted");

  const contacts = await dbService.getContacts(user._id);
  const phoneNumbers = contacts.map((c) => c.phone);

  const message = `TRIP ALERT! ${user.name} has missed a check-in for trip to ${trip.destination}.`;
  await smsService.sendBulkSMS(phoneNumbers, message);

  res.json({ message: "Alert sent", trip });
};

// NEW: UPDATE LOCATION — run from frontend watchPosition
const updateTripLocation = async (req, res) => {
  const { tripId, latitude, longitude } = req.body;
  if (!tripId || latitude === undefined || longitude === undefined) {
    res.status(400);
    throw new Error("tripId, latitude and longitude required");
  }

  // 1. fetch trip
  const trip = await dbService.getTrip(tripId);
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  // 2. save currentLocation and push to routePath if you want
  const currentPoint = { latitude, longitude, updatedAt: new Date() };
  trip.currentLocation = { latitude, longitude, updatedAt: new Date() };

  // Optionally push to routePath for history (avoid huge arrays in prod)
  if (!trip.routePath) trip.routePath = [];
  trip.routePath.push({ latitude, longitude });

  // 3. deviation check:
  // If trip has a planned routePath, compute nearest distance from current point to any point on routePath.
  // Use deviationThreshold from trip or default 100 meters.
  const threshold = trip.deviationThreshold || 100;

  let isDeviated = false;
  if (trip.routePath && trip.routePath.length > 0) {
    // Find minimum distance to any segment/point in routePath
    // We'll compute distance to each route point — good for simple polyline route (cheap).
    let minDist = Infinity;
    for (const p of trip.routePath) {
      const d = metersBetween(p, { latitude, longitude });
      if (d < minDist) minDist = d;
    }
    // If routePath length large, you can optimize by sampling points.

    if (minDist > threshold) {
      isDeviated = true;
    }
  } else {
    // No routePath: optionally compare to destination or startLocation.
    const dest = trip.endLocation || null;
    if (dest) {
      const dToDest = metersBetween(dest, { latitude, longitude });
      // being far from route doesn't imply deviation; keep conservative
      isDeviated = dToDest > threshold * 10; // loose rule
    } else {
      isDeviated = false;
    }
  }

  trip.isDeviated = isDeviated;
  await trip.save();

  // 4. If deviated, send SOS-like SMS to contacts (optional)
  if (isDeviated) {
    const contacts = await dbService.getContacts(trip.user);
    const phoneNumbers = contacts.map((c) => c.phone);
    const message = `ALERT: Trip deviation detected for ${
      req.user ? req.user.name : "user"
    }. Current location: https://maps.google.com/?q=${latitude},${longitude}`;
    // fire-and-forget, do not block response too long
    smsService
      .sendBulkSMS(phoneNumbers, message)
      .catch((err) => console.error("SMS error:", err));
  }

  // 5. Return status to frontend
  res.json({ isDeviated, currentLocation: trip.currentLocation });
};

module.exports = {
  startTrip,
  endTrip,
  tripAlert,
  updateTripLocation,
};
