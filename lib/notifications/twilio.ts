import twilio from 'twilio';

export type NotificationChannel = 'sms' | 'whatsapp';

function getClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error('Missing Twilio credentials in environment variables');
  }

  return twilio(accountSid, authToken);
}

export async function sendSMS(phoneNumber: string, message: string) {
  try {
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!twilioPhoneNumber) {
      return { success: false, error: 'Missing TWILIO_PHONE_NUMBER' };
    }

    const client = getClient();
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('SMS send failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendWhatsApp(phoneNumber: string, message: string) {
  try {
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!twilioPhoneNumber) {
      return { success: false, error: 'Missing TWILIO_PHONE_NUMBER' };
    }

    const client = getClient();
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${phoneNumber}`,
    });
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('WhatsApp send failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendNotification(
  phoneNumber: string,
  message: string,
  channel: NotificationChannel = 'sms'
) {
  if (channel === 'whatsapp') {
    return sendWhatsApp(phoneNumber, message);
  }
  return sendSMS(phoneNumber, message);
}
