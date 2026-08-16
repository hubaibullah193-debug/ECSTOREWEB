import { getDb } from '@/lib/db';
import { orders, orderTracking } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import {
  verifyJazzCashResponse,
  parseJazzCashResponse,
} from '@/lib/payments/jazzcash';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams: Record<string, any> = {};

    // Convert URLSearchParams to object
    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // Verify the response hash
    if (!verifyJazzCashResponse(queryParams)) {
      console.error('Invalid JazzCash response hash');
      return NextResponse.redirect(
        new URL('/checkout?error=invalid_payment_response', request.url)
      );
    }

    const paymentData = parseJazzCashResponse(queryParams);
    const db = getDb();

    // Find order by order number
    const orderList = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, paymentData.orderReference));

    if (!orderList || orderList.length === 0) {
      console.error('Order not found:', paymentData.orderReference);
      return NextResponse.redirect(
        new URL('/checkout?error=order_not_found', request.url)
      );
    }

    const order = orderList[0];

    if (paymentData.status === 'success') {
      // Update order payment status
      await db
        .update(orders)
        .set({
          paymentStatus: 'completed',
          status: 'confirmed',
          paymentReference: paymentData.transactionId,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      // Add tracking record
      await db.insert(orderTracking).values({
        id: uuidv4(),
        orderId: order.id,
        status: 'confirmed',
        description: `Payment confirmed via JazzCash (Transaction: ${paymentData.transactionId})`,
        timestamp: new Date(),
      });

      return NextResponse.redirect(
        new URL(`/order-confirmation/${order.id}`, request.url)
      );
    } else {
      // Payment failed
      await db
        .update(orders)
        .set({
          paymentStatus: 'failed',
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      return NextResponse.redirect(
        new URL(`/checkout?error=payment_failed&orderId=${order.id}`, request.url)
      );
    }
  } catch (error) {
    console.error('JazzCash callback error:', error);
    return NextResponse.redirect(
      new URL('/checkout?error=payment_processing_error', request.url)
    );
  }
}
