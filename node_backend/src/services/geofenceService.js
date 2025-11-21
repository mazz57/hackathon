const geolib = require("geolib");

const checkGeofences = (location, geofences) => {
  const results = [];

  geofences.forEach((geofence) => {
    const isInside = geolib.isPointInPolygon(
      { latitude: location.lat, longitude: location.lon },
      geofence.polygon.map((p) => ({ latitude: p.lat, longitude: p.lon }))
    );

    results.push({
      geofenceId: geofence._id,
      name: geofence.name,
      isInside,
    });
  });

  return results;
};

module.exports = {
  checkGeofences,
};
