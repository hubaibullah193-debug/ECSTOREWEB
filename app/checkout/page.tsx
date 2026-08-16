'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/useCart';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart, isLoaded } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);

  const [formData, setFormData] = useState({
    shippingName: '',
    shippingEmail: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingProvince: '',
    shippingPostalCode: '',
    paymentMethod: 'cod' as 'cod' | 'jazzcash' | 'easypaisa',
    notes: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted || !isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingMessage}>Loading...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div>
        <div className={styles.container}>
          <h1 className={styles.title}>Checkout</h1>

          <div className={styles.emptyCart}>
            <p className={styles.emptyMessage}>Your cart is empty</p>
            <Link
              href="/shop"
              className={styles.continuShoppingButton}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          ...formData,
          userId: 'guest',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create order');
      }

      const { data: order } = await response.json();
      setOrderCreated(true);
      clearCart();

      // Handle different payment methods
      if (formData.paymentMethod === 'cod') {
        // Direct to order confirmation for COD
        setTimeout(() => {
          router.push(`/order-confirmation/${order.orderId}`);
        }, 1500);
      } else if (formData.paymentMethod === 'jazzcash') {
        // Redirect to JazzCash payment initiation
        setTimeout(() => {
          router.push(`/api/payments/jazzcash/initiate?orderId=${order.orderId}`);
        }, 500);
      } else if (formData.paymentMethod === 'easypaisa') {
        // Redirect to Easypaisa payment initiation
        setTimeout(() => {
          router.push(`/api/payments/easypaisa/initiate?orderId=${order.orderId}`);
        }, 500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.layout}>
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={`${styles.alert} ${styles.errorAlert}`}>
                <p className={styles.errorText}>{error}</p>
              </div>
            )}

            {orderCreated && (
              <div className={`${styles.alert} ${styles.successAlert}`}>
                <p className={styles.successText}>✓ Order created successfully!</p>
              </div>
            )}

            {/* Shipping Information */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Shipping Information
              </h2>

              <div className={styles.formGrid}>
                <div className={styles.formGridTwoCols}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingName: e.target.value,
                        })
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.shippingEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingEmail: e.target.value,
                        })
                      }
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.shippingPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingPhone: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGridThreeCols}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingCity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingCity: e.target.value,
                        })
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Province
                    </label>
                    <input
                      type="text"
                      value={formData.shippingProvince}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingProvince: e.target.value,
                        })
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.shippingPostalCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingPostalCode: e.target.value,
                        })
                      }
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Payment Method
              </h2>

              <div className={styles.radioGroup}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value as 'cod' | 'jazzcash' | 'easypaisa',
                      })
                    }
                    className={styles.radioInput}
                  />
                  <div className={styles.radioContent}>
                    <p className={styles.radioTitle}>
                      Cash on Delivery (COD)
                    </p>
                    <p className={styles.radioDescription}>
                      Pay when you receive your order
                    </p>
                  </div>
                </label>

                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="jazzcash"
                    checked={formData.paymentMethod === 'jazzcash'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value as 'cod' | 'jazzcash' | 'easypaisa',
                      })
                    }
                    className={styles.radioInput}
                  />
                  <div className={styles.radioContent}>
                    <p className={styles.radioTitle}>JazzCash</p>
                    <p className={styles.radioDescription}>Pay securely with JazzCash</p>
                  </div>
                </label>

                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="easypaisa"
                    checked={formData.paymentMethod === 'easypaisa'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value as 'cod' | 'jazzcash' | 'easypaisa',
                      })
                    }
                    className={styles.radioInput}
                  />
                  <div className={styles.radioContent}>
                    <p className={styles.radioTitle}>Easypaisa</p>
                    <p className={styles.radioDescription}>Pay securely with Easypaisa</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Notes */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Order Notes (Optional)
              </h2>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any special instructions or notes for your order..."
                rows={4}
                className={styles.textarea}
              />
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
              <Link
                href="/cart"
                className={styles.backButton}
              >
                Back to Cart
              </Link>
            </div>
          </form>

          {/* Order Summary */}
          <div>
            <div className={styles.orderSummary}>
              <h2 className={styles.summaryTitle}>
                Order Summary
              </h2>

              <div className={styles.cartItems}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <span className={styles.cartItemName}>
                      {item.name} × {item.quantity}
                    </span>
                    <span className={styles.cartItemPrice}>
                      Rs {(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryLines}>
                <div className={styles.summaryLine}>
                  <span>Subtotal</span>
                  <span>Rs {total.toFixed(0)}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className={styles.totalLine}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalAmount}>
                  Rs {total.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
