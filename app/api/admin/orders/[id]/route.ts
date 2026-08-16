import { getDb } from '@/lib/db';
import { orders } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const body = await request.json();

    const { status, paymentStatus, notes } = body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updatedAt = new Date();

    const result = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Trigger notification if status changed to shipped or delivered
    if (status && (status === 'shipped' || status === 'delivered')) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notifications/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: id,
            type: `order_${status}`,
          }),
        }).catch(() => {
          console.warn(`Failed to send order ${status} notification`);
        });
      } catch (notificationError) {
        console.warn('Notification trigger error:', notificationError);
      }
    }

    return NextResponse.json({ order: result[0] });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
