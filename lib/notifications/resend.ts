import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error('Missing RESEND_API_KEY in environment variables');
}

const resend = new Resend(resendApiKey);

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  replyTo?: string
) {
  try {
    const result = await resend.emails.send({
      from: 'Khan Glowcare Center <noreply@khan-glowcare.com>',
      to,
      subject,
      html,
      replyTo: replyTo || 'support@khan-glowcare.com',
    });

    if (result.error) {
      console.error('Email send error:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderNumber: string,
  customerName: string,
  items: Array<{ name: string; quantity: number; price: string }>,
  totalAmount: string
) {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Confirmation</h2>
      <p>Dear ${customerName},</p>
      <p>Thank you for your order! Your order has been received and is being processed.</p>

      <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p><strong>Order Number:</strong> ${orderNumber}</p>
      </div>

      <h3 style="color: #333;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Quantity</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 20px; padding-top: 10px; border-top: 2px solid #ddd;">
        <p style="font-size: 18px; color: #333;"><strong>Total: Rs. ${totalAmount}</strong></p>
      </div>

      <p style="margin-top: 30px; color: #666;">We'll send you a shipping notification as soon as your order ships.</p>
      <p style="color: #666;">If you have any questions, please reply to this email or contact us at support@khan-glowcare.com</p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 12px; color: #999;">Khan Glowcare Center | Your premium skincare destination</p>
    </div>
  `;

  return sendEmail(to, `Order Confirmation - ${orderNumber}`, html);
}

export async function sendOrderStatusEmail(
  to: string,
  orderNumber: string,
  customerName: string,
  status: string,
  trackingUrl?: string
) {
  const statusMessages: Record<string, string> = {
    confirmed: 'Your order has been confirmed and is being prepared for shipment.',
    shipped: 'Your order has been shipped! Track your package using the link below.',
    delivered: 'Your order has been delivered. We hope you love your products!',
    cancelled: 'Your order has been cancelled. Please contact us if you have questions.',
  };

  const trackingLink = trackingUrl
    ? `<p style="margin-top: 20px;"><a href="${trackingUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Track Your Order</a></p>`
    : '';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Update</h2>
      <p>Dear ${customerName},</p>

      <div style="background: #e8f5e9; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #4caf50;">
        <p style="margin: 0; color: #2e7d32;"><strong>${statusMessages[status] || `Your order status: ${status}`}</strong></p>
      </div>

      <p><strong>Order Number:</strong> ${orderNumber}</p>

      ${trackingLink}

      <p style="margin-top: 30px; color: #666;">If you have any questions, please reply to this email or contact us at support@khan-glowcare.com</p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 12px; color: #999;">Khan Glowcare Center | Your premium skincare destination</p>
    </div>
  `;

  return sendEmail(to, `Order ${status.charAt(0).toUpperCase() + status.slice(1)} - ${orderNumber}`, html);
}

export async function sendPasswordResetEmail(
  to: string,
  resetLink: string,
  customerName: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Dear ${customerName},</p>

      <p>We received a request to reset your password. Click the link below to create a new password:</p>

      <p style="margin: 30px 0;">
        <a href="${resetLink}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      </p>

      <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request a password reset, you can ignore this email.</p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 12px; color: #999;">Khan Glowcare Center | Your premium skincare destination</p>
    </div>
  `;

  return sendEmail(to, 'Password Reset Request', html);
}
