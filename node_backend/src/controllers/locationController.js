const dbService = require("../services/dbService");

// @desc    Share Location
// @route   POST /location/share
// @access  Private
const shareLocation = async (req, res) => {
  const { location, latitude, longitude } = req.body;

  // Support both formats: {location: {lat, lon}} or {latitude, longitude}
  let locationData;
  if (location && location.lat && location.lon) {
    locationData = location;
  } else if (latitude !== undefined && longitude !== undefined) {
    locationData = { lat: latitude, lon: longitude };
  } else {
    res.status(400);
    throw new Error(
      "Location data required (provide either location.lat/lon or latitude/longitude)"
    );
  }

  const loc = await dbService.saveLocation({
    user: req.user._id,
    location: locationData,
  });

  res.status(201).json(loc);
};

// @desc    Get Latest Location
// @route   GET /location/:userId/latest
// @access  Private
const getLatestLocation = async (req, res) => {
  const location = await dbService.getLatestLocation(req.params.userId);

  if (!location) {
    res.status(404);
    throw new Error("Location not found");
  }

  res.json(location);
};

module.exports = {
  shareLocation,
  getLatestLocation,
};
