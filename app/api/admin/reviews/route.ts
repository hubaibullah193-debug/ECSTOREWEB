import { getDb } from '@/lib/db';
import { productReviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  const db = getDb();
  const hdrs = await headers();
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: hdrs });

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const approved = searchParams.get('approved');

  try {
    let reviews;

    if (approved === 'true') {
      reviews = await db
        .select()
        .from(productReviews)
        .where(eq(productReviews.isApproved, true))
        .orderBy(productReviews.createdAt);
    } else if (approved === 'false') {
      reviews = await db
        .select()
        .from(productReviews)
        .where(eq(productReviews.isApproved, false))
        .orderBy(productReviews.createdAt);
    } else {
      reviews = await db
        .select()
        .from(productReviews)
        .orderBy(productReviews.createdAt);
    }

    return Response.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
