'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const query = filter === 'all' ? '' : `?approved=${filter === 'approved'}`;
      const res = await fetch(`/api/admin/reviews${query}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true }),
      });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: true } : r));
      } else {
        alert('Failed to approve review');
      }
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Failed to approve review');
    }
  };

  const rejectReview = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: false }),
      });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: false } : r));
      } else {
        alert('Failed to reject review');
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
      alert('Failed to reject review');
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className={styles.dashboardTitle}>Product Reviews</h1>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            className={filter === 'all' ? styles.buttonPrimary : styles.buttonSecondary}
            onClick={() => setFilter('all')}
            style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' }}
          >
            All
          </button>
          <button
            className={filter === 'pending' ? styles.buttonPrimary : styles.buttonSecondary}
            onClick={() => setFilter('pending')}
            style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' }}
          >
            Pending
          </button>
          <button
            className={filter === 'approved' ? styles.buttonPrimary : styles.buttonSecondary}
            onClick={() => setFilter('approved')}
            style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' }}
          >
            Approved
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--ink-secondary)' }}>
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className={styles.actionsSection} style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--ink-secondary)' }}>
          No reviews found
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {reviews.map(review => (
            <div key={review.id} className={styles.actionsSection} style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>{review.title || 'Untitled'}</span>
                    <span style={{ color: 'var(--color-warning)' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', margin: 0 }}>Product: {review.productId}</p>
                  <p style={{ marginTop: 'var(--space-2)', color: 'var(--ink-primary)' }}>{review.comment}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--ink-tertiary)', marginTop: 'var(--space-2)', margin: 0 }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={review.isApproved ? styles.badgeSuccess : styles.badgeWarning}>
                  {review.isApproved ? 'Approved' : 'Pending'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--ink-quaternary)' }}>
                {!review.isApproved && (
                  <button
                    className={styles.buttonPrimary}
                    onClick={() => approveReview(review.id)}
                    style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' }}
                  >
                    Approve
                  </button>
                )}
                {review.isApproved && (
                  <button
                    className={styles.buttonSecondary}
                    onClick={() => rejectReview(review.id)}
                    style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' }}
                  >
                    Reject
                  </button>
                )}
                <button
                  className={styles.buttonDanger}
                  onClick={() => deleteReview(review.id)}
                  style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
