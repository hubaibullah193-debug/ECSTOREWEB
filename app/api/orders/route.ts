import { getDb } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CheckoutRequest {
  items: CartItem[];
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince?: string;
  shippingPostalCode?: string;
  paymentMethod: 'cod' | 'jazzcash' | 'easypaisa';
  notes?: string;
  userId: string;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();
    const db = getDb();

    // Validate products exist and have stock
    const productList = await db.select().from(products);

    let totalAmount = 0;
    const itemsToCreate = [];

    for (const item of body.items) {
      const product = productList.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      const stock = product.stock ?? 0;
      if (stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const price = parseFloat(product.price.toString());
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      itemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price.toString(),
        subtotal: subtotal.toString(),
      });
    }

    // Create order
    const orderId = uuidv4();
    const orderNumber = `ORD-${Date.now()}`;
    const shippingCost = 0;
    const finalAmount = totalAmount + shippingCost;

    await db.insert(orders).values({
      userId: body.userId,
      orderNumber,
      paymentMethod: body.paymentMethod,
      totalAmount: totalAmount.toString(),
      shippingCost: shippingCost.toString(),
      finalAmount: finalAmount.toString(),
      shippingName: body.shippingName,
      shippingEmail: body.shippingEmail || '',
      shippingPhone: body.shippingPhone,
      shippingAddress: body.shippingAddress,
      shippingCity: body.shippingCity,
      shippingProvince: body.shippingProvince,
      shippingPostalCode: body.shippingPostalCode,
      notes: body.notes,
    });

    // Create order items
    for (const item of itemsToCreate) {
      await db.insert(orderItems).values({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      });
    }

    // Deduct stock
    for (const item of body.items) {
      await db
        .update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(eq(products.id, item.productId));
    }

    return NextResponse.json(
      {
        data: {
          orderId,
          orderNumber,
          totalAmount,
          shippingCost,
          finalAmount,
          paymentMethod: body.paymentMethod,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
