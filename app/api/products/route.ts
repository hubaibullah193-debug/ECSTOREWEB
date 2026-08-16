import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, like, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const db = getDb();

    const conditions = [eq(products.isActive, true)];

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (search) {
      conditions.push(like(products.name, `%${search}%`));
    }

    const baseQuery = db
      .select()
      .from(products)
      .where(and(...conditions));

    const result = limit ? await baseQuery.limit(limit) : await baseQuery;

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch products', details: errorMessage },
      { status: 500 }
    );
  }
}
