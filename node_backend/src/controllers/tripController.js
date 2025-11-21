const dbService = require("../services/dbService");
const smsService = require("../services/smsService");

// @desc    Start Trip
// @route   POST /trip/start
// @access  Private
const startTrip = async (req, res) => {
  const { destination, eta, estimatedDuration } = req.body;

  if (!destination) {
    res.status(400);
    throw new Error("Destination is required");
  }

  const trip = await dbService.createTrip({
    user: req.user._id,
    destination,
    eta,
    estimatedDuration,
  });

  res.status(201).json(trip);
};

// @desc    End Trip
// @route   POST /trip/end
// @access  Private
const endTrip = async (req, res) => {
  const { tripId } = req.body;

  const trip = await dbService.updateTripStatus(tripId, "completed");

  res.json(trip);
};

// @desc    Trip Alert (Missed Check-in)
// @route   POST /trip/alert
// @access  Private
const tripAlert = async (req, res) => {
  const { tripId } = req.body;
  const user = req.user;

  const trip = await dbService.updateTripStatus(tripId, "alerted");

  // Trigger SOS-like behavior
  const contacts = await dbService.getContacts(user._id);
  const phoneNumbers = contacts.map((c) => c.phone);

  const message = `TRIP ALERT! ${user.name} has missed a check-in for trip to ${trip.destination}.`;
  await smsService.sendBulkSMS(phoneNumbers, message);

  res.json({ message: "Alert sent", trip });
};

module.exports = {
  startTrip,
  endTrip,
  tripAlert,
};
