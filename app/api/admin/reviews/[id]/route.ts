import { getDb } from '@/lib/db';
import { productReviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const hdrs = await headers();
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: hdrs });

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { isApproved } = body;

    if (typeof isApproved !== 'boolean') {
      return Response.json({ error: 'isApproved must be boolean' }, { status: 400 });
    }

    const review = await db
      .update(productReviews)
      .set({ isApproved })
      .where(eq(productReviews.id, id))
      .returning();

    if (!review.length) {
      return Response.json({ error: 'Review not found' }, { status: 404 });
    }

    return Response.json({ review: review[0] });
  } catch (error) {
    console.error('Error updating review:', error);
    return Response.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const hdrs = await headers();
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: hdrs });

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.delete(productReviews).where(eq(productReviews.id, id));
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return Response.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
