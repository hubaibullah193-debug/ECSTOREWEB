import { sendSMS, sendWhatsApp, sendNotification } from './twilio';
import {
  sendEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendPasswordResetEmail,
} from './resend';

export type NotificationType =
  | 'order_confirmation'
  | 'order_status'
  | 'password_reset'
  | 'custom_sms'
  | 'custom_email';

export interface NotificationPayload {
  type: NotificationType;
  recipient: {
    email?: string;
    phone?: string;
    name?: string;
  };
  data: Record<string, unknown>;
}

export async function sendOrderConfirmation(
  email: string,
  phone: string,
  name: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: string }>,
  totalAmount: string,
  sendSMSNotif: boolean = true,
  sendWhatsAppNotif: boolean = false
) {
  const results = {
    email: null as any,
    sms: null as any,
    whatsapp: null as any,
  };

  // Send email
  results.email = await sendOrderConfirmationEmail(
    email,
    orderNumber,
    name,
    items,
    totalAmount
  );

  // Send SMS notification
  if (sendSMSNotif && phone) {
    const smsMessage = `Dear ${name}, your order ${orderNumber} has been confirmed. Total: Rs. ${totalAmount}. Track: khan-glowcare.com`;
    results.sms = await sendSMS(phone, smsMessage);
  }

  // Send WhatsApp notification
  if (sendWhatsAppNotif && phone) {
    const waMessage = `Order Confirmed! 🎉\n\nOrder #${orderNumber}\nAmount: Rs. ${totalAmount}\n\nThank you for shopping with Khan Glowcare Center!`;
    results.whatsapp = await sendWhatsApp(phone, waMessage);
  }

  return results;
}

export async function sendOrderStatusUpdate(
  email: string,
  phone: string,
  name: string,
  orderNumber: string,
  status: string,
  sendSMSNotif: boolean = true,
  sendWhatsAppNotif: boolean = false,
  trackingUrl?: string
) {
  const results = {
    email: null as any,
    sms: null as any,
    whatsapp: null as any,
  };

  // Send email
  results.email = await sendOrderStatusEmail(email, orderNumber, name, status, trackingUrl);

  // Send SMS notification
  if (sendSMSNotif && phone) {
    const statusMessages: Record<string, string> = {
      shipped: '📦 Your order has been shipped!',
      delivered: '✓ Your order has been delivered!',
      confirmed: '✓ Your order has been confirmed!',
      cancelled: '✗ Your order has been cancelled.',
    };
    const smsMessage = `${statusMessages[status] || `Order ${status}`} Order: ${orderNumber}. Track: khan-glowcare.com`;
    results.sms = await sendSMS(phone, smsMessage);
  }

  // Send WhatsApp notification
  if (sendWhatsAppNotif && phone) {
    const waMessages: Record<string, string> = {
      shipped: `📦 Order Shipped!\n\nOrder #${orderNumber}\nYour package is on the way!`,
      delivered: `✓ Order Delivered!\n\nOrder #${orderNumber}\nWe hope you love your products!`,
      confirmed: `✓ Order Confirmed!\n\nOrder #${orderNumber}\nPreparing for shipment...`,
      cancelled: `Order Cancelled\n\nOrder #${orderNumber}\nContact us for assistance.`,
    };
    const waMessage = waMessages[status] || `Order ${status}: ${orderNumber}`;
    results.whatsapp = await sendWhatsApp(phone, waMessage);
  }

  return results;
}

export async function sendPasswordReset(
  email: string,
  name: string,
  resetLink: string
) {
  return sendPasswordResetEmail(email, resetLink, name);
}

export async function sendCustomNotification(payload: NotificationPayload) {
  const { type, recipient, data } = payload;

  switch (type) {
    case 'order_confirmation':
      return sendOrderConfirmation(
        recipient.email || '',
        recipient.phone || '',
        recipient.name || 'Valued Customer',
        data.orderNumber as string,
        data.items as any,
        data.totalAmount as string,
        data.sendSMS as boolean,
        data.sendWhatsApp as boolean
      );

    case 'order_status':
      return sendOrderStatusUpdate(
        recipient.email || '',
        recipient.phone || '',
        recipient.name || 'Valued Customer',
        data.orderNumber as string,
        data.status as string,
        data.sendSMS as boolean,
        data.sendWhatsApp as boolean,
        data.trackingUrl as string | undefined
      );

    case 'password_reset':
      return sendPasswordReset(
        recipient.email || '',
        recipient.name || 'User',
        data.resetLink as string
      );

    case 'custom_sms':
      if (recipient.phone) {
        return sendSMS(recipient.phone, data.message as string);
      }
      break;

    case 'custom_email':
      return sendEmail(
        recipient.email || '',
        data.subject as string,
        data.html as string
      );
  }

  return { success: false, error: 'Unknown notification type' };
}
