const Contact = require('../models/Contact');
const CheckIn = require('../models/CheckIn');
const { sendBulkSMS } = require('./smsService');

const notifyContacts = async (checkIn) => {
    try {
        const contacts = await Contact.find({ user: checkIn.user });

        if (!contacts || contacts.length === 0) {
            console.log(`No contacts found for user ${checkIn.user}`);
            return;
        }

        const userName = checkIn.user.name || 'User';
        const lastSeen = new Date(checkIn.lastCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const message = `URGENT: ${userName} missed a safety check-in. Last seen at ${lastSeen}. Message: "${checkIn.customMessage}" - Sent by Sahaya App`;

        const phoneNumbers = contacts.map(contact => contact.phone);

        console.log(`Sending check-in alert for ${userName} to ${phoneNumbers.length} contacts.`);
        await sendBulkSMS(phoneNumbers, message);

        await CheckIn.findByIdAndUpdate(checkIn._id, {
            $push: {
                notificationsSent: {
                    contactIds: contacts.map(c => c._id)
                }
            }
        });

        return true;
    } catch (error) {
        console.error('Error in notifyContacts:', error);
        return false;
    }
};

module.exports = {
    notifyContacts
};
