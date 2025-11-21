const dbService = require("../services/dbService");
const geofenceService = require("../services/geofenceService");
const smsService = require("../services/smsService");

// @desc    Create Geofence
// @route   POST /geofence/create
// @access  Private
const createGeofence = async (req, res) => {
  const {
    name,
    polygon,
    latitude,
    longitude,
    radius,
    alertOnEnter,
    alertOnExit,
  } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Geofence name is required");
  }

  let geofencePolygon;

  // Support two formats:
  // 1. Polygon format: { name, polygon: [{lat, lon}, ...] }
  // 2. Circular format: { name, latitude, longitude, radius }

  if (polygon && Array.isArray(polygon) && polygon.length > 0) {
    // Polygon format
    geofencePolygon = polygon;
  } else if (
    latitude !== undefined &&
    longitude !== undefined &&
    radius !== undefined
  ) {
    // Circular format - convert to a simple polygon (approximation with 8 points)
    const numPoints = 8;
    geofencePolygon = [];
    const earthRadius = 6371000; // meters

    for (let i = 0; i < numPoints; i++) {
      const angle = ((i * 360) / numPoints) * (Math.PI / 180);
      const latOffset = (radius / earthRadius) * (180 / Math.PI);
      const lonOffset =
        (radius / (earthRadius * Math.cos((latitude * Math.PI) / 180))) *
        (180 / Math.PI);

      geofencePolygon.push({
        lat: latitude + latOffset * Math.cos(angle),
        lon: longitude + lonOffset * Math.sin(angle),
      });
    }
  } else {
    res.status(400);
    throw new Error(
      "Invalid geofence data. Provide either polygon array or latitude/longitude/radius"
    );
  }

  const geofence = await dbService.createGeofence({
    user: req.user._id,
    name,
    polygon: geofencePolygon,
    alertOnEnter: alertOnEnter !== undefined ? alertOnEnter : true,
    alertOnExit: alertOnExit !== undefined ? alertOnExit : true,
  });

  res.status(201).json(geofence);
};

// @desc    Get User Geofences
// @route   GET /geofence/:userId
// @access  Private
const getGeofences = async (req, res) => {
  const geofences = await dbService.getGeofencesForUser(req.params.userId);
  res.json(geofences);
};

// @desc    Check Geofence Status
// @route   POST /geofence/check
// @access  Private
const checkGeofence = async (req, res) => {
  const { location } = req.body;
  const user = req.user;

  const geofences = await dbService.getGeofencesForUser(user._id);
  const results = geofenceService.checkGeofences(location, geofences);

  // Logic to trigger alerts
  // If inside a geofence with alertOnEnter=true, trigger SMS
  const alerts = [];
  for (const result of results) {
    const geo = geofences.find(
      (g) => g._id.toString() === result.geofenceId.toString()
    );

    if (result.isInside && geo.alertOnEnter) {
      alerts.push(`Entered ${geo.name}`);
      // Trigger SMS
      const contacts = await dbService.getContacts(user._id);
      const phoneNumbers = contacts.map((c) => c.phone);
      await smsService.sendBulkSMS(
        phoneNumbers,
        `Alert: ${user.name} entered ${geo.name}`
      );
    }

    // Note: Exit alerts require state tracking (was inside, now outside).
    // We skip that for this stateless check endpoint unless we pass previous state.
  }

  res.json({
    results,
    alertsTriggered: alerts,
  });
};

module.exports = {
  createGeofence,
  getGeofences,
  checkGeofence,
};
