const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    intervalMinutes: {
        type: Number,
        required: true,
        enum: [15, 30, 60, 120] // Restrict to specific intervals
    },
    nextCheckInTime: {
        type: Date,
        required: true
    },
    lastCheckInTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'completed', 'missed'],
        default: 'active'
    },
    missedCount: {
        type: Number,
        default: 0
    },
    gracePeriodMinutes: {
        type: Number,
        default: 5
    },
    customMessage: {
        type: String,
        default: 'I have missed my scheduled check-in. Please contact me to ensure I am safe.'
    },
    notificationsSent: [{
        sentAt: {
            type: Date,
            default: Date.now
        },
        contactIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contact'
        }]
    }]
}, {
    timestamps: true
});

// Index for efficient querying by scheduler
checkInSchema.index({ status: 1, nextCheckInTime: 1 });

module.exports = mongoose.model('CheckIn', checkInSchema);
