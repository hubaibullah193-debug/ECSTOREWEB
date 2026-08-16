import { getDb } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import {
  createJazzCashPaymentRequest,
  verifyJazzCashResponse,
  parseJazzCashResponse,
} from '@/lib/payments/jazzcash';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order || order.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = order[0];
    const returnUrl = `${process.env.JAZZCASH_RETURN_URL}?orderId=${orderId}`;

    const paymentRequest = createJazzCashPaymentRequest({
      orderId,
      orderNumber: orderData.orderNumber,
      totalAmount: parseFloat(orderData.finalAmount.toString()),
      customerName: orderData.shippingName,
      customerEmail: orderData.shippingEmail || '',
      customerPhone: orderData.shippingPhone,
      returnUrl,
    });

    return NextResponse.json({ data: paymentRequest });
  } catch (error) {
    console.error('Failed to initiate JazzCash payment:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
