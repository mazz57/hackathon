const twilio = require("twilio");

// Check if Twilio credentials are configured
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

let client = null;
let isTwilioConfigured = false;

// Initialize Twilio client only if credentials are available
try {
  if (accountSid && authToken && twilioPhone) {
    client = twilio(accountSid, authToken);
    isTwilioConfigured = true;
    console.log("✅ Twilio SMS service initialized successfully");
  } else {
    console.warn(
      "⚠️  Twilio credentials not configured. SMS features will be disabled."
    );
    console.warn(
      "   Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in environment variables."
    );
  }
} catch (error) {
  console.error("❌ Failed to initialize Twilio client:", error.message);
  isTwilioConfigured = false;
}

const sendSMS = async (to, body) => {
  // Graceful degradation if Twilio not configured
  if (!isTwilioConfigured || !client) {
    console.warn(`SMS not sent to ${to}: Twilio not configured`);
    return {
      success: false,
      error: "SMS service not configured",
      message: "Twilio credentials missing",
    };
  }

  try {
    const message = await client.messages.create({
      body: body,
      from: twilioPhone,
      to: to,
    });
    console.log(`✅ SMS sent to ${to}: ${message.sid}`);
    return { success: true, sid: message.sid, to };
  } catch (error) {
    console.error(`❌ Error sending SMS to ${to}:`, error.message);
    // Don't throw, just return failure so other SMSs can proceed
    return {
      success: false,
      error: error.message,
      to,
      code: error.code || "UNKNOWN",
    };
  }
};

const sendBulkSMS = async (phoneNumbers, body) => {
  if (!phoneNumbers || phoneNumbers.length === 0) {
    console.warn("No phone numbers provided for bulk SMS");
    return [];
  }

  const results = [];
  for (const phone of phoneNumbers) {
    if (!phone) {
      console.warn("Skipping invalid phone number");
      continue;
    }
    const result = await sendSMS(phone, body);
    results.push({ phone, ...result });
  }

  const successCount = results.filter((r) => r.success).length;
  console.log(
    `📊 Bulk SMS: ${successCount}/${results.length} sent successfully`
  );

  return results;
};

// Health check function
const checkTwilioStatus = () => {
  return {
    configured: isTwilioConfigured,
    accountSid: accountSid ? `${accountSid.substring(0, 8)}...` : "Not set",
    phoneNumber: twilioPhone || "Not set",
  };
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  checkTwilioStatus,
  isTwilioConfigured,
};
