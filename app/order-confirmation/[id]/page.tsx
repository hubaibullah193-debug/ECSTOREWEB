'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import OrderFeedbackForm from '@/components/OrderFeedbackForm';
import styles from '../order-confirmation.module.css';

interface OrderData {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  shippingCost: number;
  finalAmount: number;
  paymentMethod: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const { data } = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingMessage}>Loading order details...</p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Success Message */}
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.successTitle}>
              Order Confirmed!
            </h1>
            <p className={styles.successSubtitle}>
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            {order && (
              <p className={styles.orderNumber}>
                Order #{order.orderNumber}
              </p>
            )}
          </div>

          {/* Order Details */}
          {order && (
            <div className={styles.orderDetails}>
              <h2 className={styles.orderDetailsTitle}>
                Order Details
              </h2>

              <div className={styles.detailLines}>
                <div className={styles.detailLine}>
                  <span className={styles.detailLabel}>Order Number</span>
                  <span className={styles.detailValue}>
                    {order.orderNumber}
                  </span>
                </div>

                <div className={styles.detailLine}>
                  <span className={styles.detailLabel}>Payment Method</span>
                  <span className={styles.detailValue}>
                    {order.paymentMethod === 'cod'
                      ? 'Cash on Delivery'
                      : order.paymentMethod}
                  </span>
                </div>

                <div className={styles.detailLine}>
                  <span className={styles.detailLabel}>Subtotal</span>
                  <span className={styles.detailValue}>
                    Rs {order.totalAmount.toFixed(0)}
                  </span>
                </div>

                <div className={styles.detailLine}>
                  <span className={styles.detailLabel}>Shipping</span>
                  <span className={styles.detailValue}>
                    Rs {order.shippingCost.toFixed(0)}
                  </span>
                </div>
              </div>

              <div className={styles.totalLine}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalAmount}>
                  Rs {order.finalAmount.toFixed(0)}
                </span>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className={styles.nextSteps}>
            <h3 className={styles.nextStepsTitle}>What's Next?</h3>
            <ul className={styles.nextStepsList}>
              <li className={styles.nextStepsItem}>✓ Order confirmation has been sent to your email</li>
              <li className={styles.nextStepsItem}>✓ Your order will be prepared for shipment</li>
              <li className={styles.nextStepsItem}>✓ You'll receive a tracking number via SMS and email</li>
              <li className={styles.nextStepsItem}>✓ Estimated delivery: 3-5 business days</li>
            </ul>
          </div>

          {/* Feedback Form */}
          <div className={styles.feedbackSection}>
            <h3 className={styles.feedbackTitle}>Share Your Feedback</h3>
            <OrderFeedbackForm orderId={orderId} />
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <Link
              href="/shop"
              className={styles.primaryButton}
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className={styles.secondaryButton}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
