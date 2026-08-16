import { getDb } from '@/lib/db';
import { orderFeedback } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return Response.json({ error: 'orderId required' }, { status: 400 });
  }

  const db = getDb();

  try {
    const feedback = await db
      .select()
      .from(orderFeedback)
      .where(eq(orderFeedback.orderId, orderId))
      .limit(1);

    return Response.json({ feedback: feedback[0] || null });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return Response.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const db = getDb();
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, overallRating, deliveryRating, packagingRating, comment, issues, wouldRecommend } = body;

    if (!orderId || !overallRating) {
      return Response.json({ error: 'orderId and overallRating required' }, { status: 400 });
    }

    if (overallRating < 1 || overallRating > 5) {
      return Response.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Check if feedback already exists
    const existing = await db
      .select()
      .from(orderFeedback)
      .where(eq(orderFeedback.orderId, orderId))
      .limit(1);

    if (existing.length) {
      return Response.json({ error: 'Feedback already submitted for this order' }, { status: 409 });
    }

    const feedback = await db
      .insert(orderFeedback)
      .values({
        orderId,
        userId: session.user.id,
        overallRating,
        deliveryRating: deliveryRating || null,
        packagingRating: packagingRating || null,
        comment: comment || null,
        issues: issues || null,
        wouldRecommend: wouldRecommend !== undefined ? wouldRecommend : null,
      })
      .returning();

    return Response.json({ feedback: feedback[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return Response.json({ error: 'Failed to create feedback' }, { status: 500 });
  }
}
