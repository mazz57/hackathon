const express = require('express');
const router = express.Router();
const { createGeofence, getGeofences, checkGeofence } = require('../controllers/geofenceController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

router.post('/create', protect, asyncHandler(createGeofence));
router.get('/:userId', protect, asyncHandler(getGeofences));
router.post('/check', protect, asyncHandler(checkGeofence));

module.exports = router;
