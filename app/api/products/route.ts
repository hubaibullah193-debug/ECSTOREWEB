import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, like, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const db = getDb();

    const conditions = [eq(products.isActive, true)];

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (search) {
      conditions.push(like(products.name, `%${search}%`));
    }

    const result = await db
      .select()
      .from(products)
      .where(and(...conditions));

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
