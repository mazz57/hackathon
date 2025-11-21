const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log(`SMS sent to ${to}: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error(`Error sending SMS to ${to}:`, error.message);
    // Don't throw, just return failure so other SMSs can proceed or app doesn't crash
    return { success: false, error: error.message };
  }
};

const sendBulkSMS = async (phoneNumbers, body) => {
  const results = [];
  for (const phone of phoneNumbers) {
    const result = await sendSMS(phone, body);
    results.push({ phone, ...result });
  }
  return results;
};

module.exports = {
  sendSMS,
  sendBulkSMS,
};
