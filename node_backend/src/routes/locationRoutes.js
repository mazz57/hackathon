const express = require('express');
const router = express.Router();
const { shareLocation, getLatestLocation } = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

router.post('/share', protect, asyncHandler(shareLocation));
router.get('/:userId/latest', protect, asyncHandler(getLatestLocation));

module.exports = router;
