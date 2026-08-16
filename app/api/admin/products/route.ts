import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDb();

    const allProducts = await db
      .select()
      .from(products)
      .orderBy(products.createdAt);

    return NextResponse.json({ products: allProducts });
  } catch (error) {
    console.error('Failed to fetch admin products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();

    const {
      name,
      description,
      price,
      category,
      image,
      stock,
      sku,
    } = body;

    if (!name || !price || !category || !sku) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db
      .insert(products)
      .values({
        name,
        description,
        price,
        category,
        image,
        stock: stock || 0,
        sku,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ product: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
