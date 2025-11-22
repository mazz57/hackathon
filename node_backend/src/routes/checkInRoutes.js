const express = require('express');
const router = express.Router();
const {
    startCheckIn,
    confirmCheckIn,
    stopCheckIn,
    getActiveCheckIn
} = require('../controllers/checkInController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startCheckIn);
router.post('/confirm/:id', protect, confirmCheckIn);
router.post('/stop/:id', protect, stopCheckIn);
router.get('/active', protect, getActiveCheckIn);

module.exports = router;
