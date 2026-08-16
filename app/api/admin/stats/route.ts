import { getDb } from '@/lib/db';
import { products, orders } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();

    const allProducts = await db.select().from(products);
    const activeProducts = allProducts.filter((p) => p.isActive).length;
    const lowStockProducts = allProducts.filter((p) => (p.stock ?? 0) < 5).length;

    const allOrders = await db.select().from(orders);
    const pendingOrders = allOrders.filter((o) => o.status === 'pending').length;
    const completedOrders = allOrders.filter(
      (o) => o.status === 'delivered'
    ).length;

    return NextResponse.json({
      stats: {
        totalProducts: allProducts.length,
        activeProducts,
        lowStockProducts,
        totalOrders: allOrders.length,
        pendingOrders,
        completedOrders,
      },
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
