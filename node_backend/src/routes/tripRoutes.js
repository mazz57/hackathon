const express = require("express");
const router = express.Router();
const {
  startTrip,
  endTrip,
  tripAlert,
  updateTripLocation,
} = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("express-async-handler");

router.post("/start", protect, asyncHandler(startTrip));
router.post("/end", protect, asyncHandler(endTrip));
router.post("/alert", protect, asyncHandler(tripAlert));

// NEW - update location while trip is active
router.post("/location", protect, asyncHandler(updateTripLocation));

module.exports = router;
