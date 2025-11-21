const express = require('express');
const router = express.Router();
const { triggerSOS, smsFallbackTrigger } = require('../controllers/sosController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

router.post('/trigger', protect, asyncHandler(triggerSOS));
router.post('/sms-trigger', asyncHandler(smsFallbackTrigger));

module.exports = router;
