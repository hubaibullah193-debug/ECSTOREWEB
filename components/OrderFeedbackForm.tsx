'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface OrderFeedbackFormProps {
  orderId: string;
  onSuccess?: () => void;
}

export default function OrderFeedbackForm({ orderId, onSuccess }: OrderFeedbackFormProps) {
  const [overallRating, setOverallRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [packagingRating, setPackagingRating] = useState(5);
  const [comment, setComment] = useState('');
  const [issues, setIssues] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          overallRating,
          deliveryRating,
          packagingRating,
          comment: comment || null,
          issues: issues || null,
          wouldRecommend,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        onSuccess?.();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <p className="text-green-800 font-medium">
          Thank you for your feedback! We appreciate your input.
        </p>
      </Card>
    );
  }

  const RatingInput = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl transition-colors ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold text-lg">Order Feedback</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Overall Rating */}
        <RatingInput
          label="Overall Satisfaction"
          value={overallRating}
          onChange={setOverallRating}
        />

        {/* Delivery Rating */}
        <RatingInput
          label="Delivery Experience"
          value={deliveryRating}
          onChange={setDeliveryRating}
        />

        {/* Packaging Rating */}
        <RatingInput
          label="Packaging Quality"
          value={packagingRating}
          onChange={setPackagingRating}
        />

        {/* Would Recommend */}
        <div>
          <label className="block text-sm font-medium mb-2">Would you recommend us?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={wouldRecommend === true}
                onChange={() => setWouldRecommend(true)}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={wouldRecommend === false}
                onChange={() => setWouldRecommend(false)}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium mb-2">Additional Comments (Optional)</label>
          <Textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
          />
        </div>

        {/* Issues */}
        <div>
          <label className="block text-sm font-medium mb-2">Any Issues? (Optional)</label>
          <Textarea
            value={issues}
            onChange={e => setIssues(e.target.value)}
            placeholder="Describe any problems you encountered..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </form>
    </Card>
  );
}
