const CheckIn = require('../models/CheckIn');
const asyncHandler = require('express-async-handler');

// @desc    Start a new check-in session
// @route   POST /api/checkin/start
// @access  Private
const startCheckIn = asyncHandler(async (req, res) => {
    const { intervalMinutes, gracePeriodMinutes, customMessage } = req.body;

    if (!intervalMinutes) {
        res.status(400);
        throw new Error('Interval is required');
    }

    // Check if user already has an active session
    const existingSession = await CheckIn.findOne({ user: req.user._id, status: { $in: ['active', 'paused'] } });

    if (existingSession) {
        res.status(400);
        throw new Error('You already have an active check-in session. Please stop it first.');
    }

    const nextCheckInTime = new Date(Date.now() + intervalMinutes * 60000);

    const checkIn = await CheckIn.create({
        user: req.user._id,
        intervalMinutes,
        gracePeriodMinutes: gracePeriodMinutes || 5,
        customMessage,
        nextCheckInTime,
        status: 'active'
    });

    res.status(201).json(checkIn);
});

// @desc    Confirm check-in (I'm safe)
// @route   POST /api/checkin/confirm/:id
// @access  Private
const confirmCheckIn = asyncHandler(async (req, res) => {
    const checkIn = await CheckIn.findById(req.params.id);

    if (!checkIn) {
        res.status(404);
        throw new Error('Check-in session not found');
    }

    if (checkIn.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    if (checkIn.status === 'completed') {
        res.status(400);
        throw new Error('This session is already completed');
    }

    // Reset timer
    checkIn.lastCheckInTime = Date.now();
    checkIn.nextCheckInTime = new Date(Date.now() + checkIn.intervalMinutes * 60000);

    // If it was missed, set back to active
    if (checkIn.status === 'missed') {
        checkIn.status = 'active';
    }

    await checkIn.save();

    res.json(checkIn);
});

// @desc    Stop check-in session
// @route   POST /api/checkin/stop/:id
// @access  Private
const stopCheckIn = asyncHandler(async (req, res) => {
    const checkIn = await CheckIn.findById(req.params.id);

    if (!checkIn) {
        res.status(404);
        throw new Error('Check-in session not found');
    }

    if (checkIn.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    checkIn.status = 'completed';
    await checkIn.save();

    res.json({ message: 'Check-in session stopped', checkIn });
});

// @desc    Get active check-in
// @route   GET /api/checkin/active
// @access  Private
const getActiveCheckIn = asyncHandler(async (req, res) => {
    const checkIn = await CheckIn.findOne({
        user: req.user._id,
        status: { $in: ['active', 'paused', 'missed'] }
    });

    res.json(checkIn || null);
});

module.exports = {
    startCheckIn,
    confirmCheckIn,
    stopCheckIn,
    getActiveCheckIn
};
