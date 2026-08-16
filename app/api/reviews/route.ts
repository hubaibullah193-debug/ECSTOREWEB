import { getDb } from '@/lib/db';
import { productReviews, orders, orderItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const approved = searchParams.get('approved') === 'true';

  if (!productId) {
    return Response.json({ error: 'productId required' }, { status: 400 });
  }

  const db = getDb();

  try {
    let query = db
      .select()
      .from(productReviews)
      .where(eq(productReviews.productId, productId));

    if (approved) {
      query = db
        .select()
        .from(productReviews)
        .where(and(eq(productReviews.productId, productId), eq(productReviews.isApproved, true)));
    }

    const reviews = await query;
    return Response.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const db = getDb();
  const hdrs = await headers();
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: hdrs });

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, orderId, rating, title, comment, images } = body;

    if (!productId || !rating) {
      return Response.json({ error: 'productId and rating required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return Response.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Verify user has purchased this product (if orderId provided)
    if (orderId) {
      const orderItem = await db
        .select()
        .from(orderItems)
        .where(
          and(
            eq(orderItems.productId, productId),
            eq(orderItems.orderId, orderId),
          ),
        )
        .limit(1);

      if (!orderItem.length) {
        return Response.json({ error: 'Product not found in this order' }, { status: 403 });
      }
    }

    // Check if user already reviewed this product
    const existing = await db
      .select()
      .from(productReviews)
      .where(
        and(
          eq(productReviews.productId, productId),
          eq(productReviews.userId, session.user.id),
        ),
      )
      .limit(1);

    if (existing.length) {
      return Response.json({ error: 'You have already reviewed this product' }, { status: 409 });
    }

    const review = await db
      .insert(productReviews)
      .values({
        productId,
        userId: session.user.id,
        orderId: orderId || null,
        rating,
        title: title || null,
        comment: comment || null,
        images: images ? JSON.stringify(images) : null,
        isApproved: false, // Require moderation
      })
      .returning();

    return Response.json({ review: review[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return Response.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
