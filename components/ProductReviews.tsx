'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}&approved=true`);
      const data = await res.json();
      const reviews = data.reviews || [];
      setReviews(reviews);

      if (reviews.length > 0) {
        const avg = reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length;
        setAvgRating(avg);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center text-gray-500 py-8">No reviews yet</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
          <div className="text-yellow-500 text-lg">
            {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
          </div>
          <p className="text-sm text-gray-600">{reviews.length} reviews</p>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map(review => (
          <Card key={review.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="text-yellow-500">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <p className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            {review.title && <p className="font-semibold mb-1">{review.title}</p>}
            <p className="text-gray-700 text-sm">{review.comment}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
