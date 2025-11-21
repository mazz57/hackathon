const express = require('express');
const router = express.Router();
const { startTrip, endTrip, tripAlert } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

router.post('/start', protect, asyncHandler(startTrip));
router.post('/end', protect, asyncHandler(endTrip));
router.post('/alert', protect, asyncHandler(tripAlert));

module.exports = router;
