import { getDb } from '@/lib/db';
import { orders, users, storeSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendOrderConfirmationEmail, sendEmail } from '@/lib/notifications/resend';
import { sendSMS } from '@/lib/notifications/twilio';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, type } = body;

    if (!orderId || !type) {
      return NextResponse.json(
        { error: 'Missing orderId or type' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Fetch order with user details
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = order[0];
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, orderData.userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = user[0];
    const customerEmail = userData.email || '';
    const customerName = userData.name || 'Valued Customer';
    const customerPhone = orderData.shippingPhone;

    // Get notification settings from store settings
    const db2 = getDb();
    const settingsRows = await db2.select().from(storeSettings);
    const settingsMap = Object.fromEntries(
      settingsRows.map((s) => [s.key, s.value])
    );

    const sendSmsNotif = settingsMap['notify_sms'] !== 'false';
    const sendWhatsAppNotif = settingsMap['notify_whatsapp'] === 'true';

    const results: Record<string, any> = {};

    switch (type) {
      case 'order_confirmation': {
        // This would need order items, so we'll fetch them if needed
        // For now, send basic SMS confirmation
        if (sendSmsNotif && customerPhone) {
          const message = `Dear ${customerName}, your order ${orderData.orderNumber} has been confirmed. Total: Rs. ${orderData.finalAmount}. Thank you for shopping with Khan Glowcare Center!`;
          results.sms = await sendSMS(customerPhone, message);
        }

        if (sendWhatsAppNotif && customerPhone) {
          const message = `Order Confirmed! 🎉\n\nOrder #${orderData.orderNumber}\nAmount: Rs. ${orderData.finalAmount}\n\nThank you for shopping with Khan Glowcare Center!`;
          results.whatsapp = await sendSMS(customerPhone, message); // Use regular SMS for WhatsApp simulation
        }

        if (customerEmail) {
          // Send email with order details
          results.email = await sendOrderConfirmationEmail(
            customerEmail,
            orderData.orderNumber,
            customerName,
            [], // Items would need to be fetched separately
            String(orderData.finalAmount)
          );
        }
        break;
      }

      case 'order_shipped': {
        if (sendSmsNotif && customerPhone) {
          const message = `📦 Your order ${orderData.orderNumber} has been shipped! Track your package at khan-glowcare.com. Thank you!`;
          results.sms = await sendSMS(customerPhone, message);
        }

        if (customerEmail) {
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Order Shipped! 📦</h2>
              <p>Dear ${customerName},</p>
              <p>Your order has been shipped and is on its way to you!</p>
              <div style="background: #e3f2fd; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
                <p><strong>Tracking Reference:</strong> ${orderData.paymentReference || 'N/A'}</p>
              </div>
              <p style="color: #666;">You can track your order at: <a href="https://khan-glowcare.com/track/${orderData.id}">Track Your Order</a></p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="font-size: 12px; color: #999;">Khan Glowcare Center</p>
            </div>
          `;
          results.email = await sendEmail(
            customerEmail,
            `Order Shipped - ${orderData.orderNumber}`,
            html
          );
        }
        break;
      }

      case 'order_delivered': {
        if (sendSmsNotif && customerPhone) {
          const message = `✓ Your order ${orderData.orderNumber} has been delivered! We hope you love your products. Rate your experience at khan-glowcare.com`;
          results.sms = await sendSMS(customerPhone, message);
        }

        if (customerEmail) {
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Order Delivered! ✓</h2>
              <p>Dear ${customerName},</p>
              <p>Your order has been delivered! We hope you love your skincare products.</p>
              <div style="background: #f1f8e9; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #558b2f;">
                <p style="margin: 0;"><strong>Order Number:</strong> ${orderData.orderNumber}</p>
              </div>
              <p style="margin-top: 20px;">Have feedback? We'd love to hear from you!</p>
              <p><a href="https://khan-glowcare.com/feedback/${orderData.id}" style="background: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Share Feedback</a></p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="font-size: 12px; color: #999;">Khan Glowcare Center</p>
            </div>
          `;
          results.email = await sendEmail(
            customerEmail,
            `Order Delivered - ${orderData.orderNumber}`,
            html
          );
        }
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Unknown notification type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      orderId,
      type,
      results,
    });
  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
