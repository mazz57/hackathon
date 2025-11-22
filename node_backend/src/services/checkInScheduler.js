const CheckIn = require('../models/CheckIn');
const { notifyContacts } = require('./checkInNotificationService');

let intervalId;

const startScheduler = () => {
    console.log('Check-in scheduler started...');

    // Run every 60 seconds
    intervalId = setInterval(async () => {
        try {
            const now = new Date();

            // Find active check-ins where nextCheckInTime < now
            const activeCheckIns = await CheckIn.find({
                status: 'active',
                nextCheckInTime: { $lt: now }
            }).populate('user');

            for (const checkIn of activeCheckIns) {
                const gracePeriodMs = checkIn.gracePeriodMinutes * 60 * 1000;
                const overdueTime = new Date(checkIn.nextCheckInTime.getTime() + gracePeriodMs);

                if (now > overdueTime) {
                    console.log(`Check-in overdue for user ${checkIn.user.name} (ID: ${checkIn._id})`);

                    // Mark as missed immediately to prevent double-processing
                    checkIn.status = 'missed';
                    checkIn.missedCount += 1;
                    await checkIn.save();

                    // Trigger SMS notification
                    await notifyContacts(checkIn);
                }
            }
        } catch (error) {
            console.error('Error in check-in scheduler:', error);
        }
    }, 60000); // runs every minute
};

const stopScheduler = () => {
    if (intervalId) {
        clearInterval(intervalId);
        console.log('Check-in scheduler stopped.');
    }
};

module.exports = {
    startScheduler,
    stopScheduler
};
