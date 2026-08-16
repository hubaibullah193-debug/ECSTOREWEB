'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/useCart';
import styles from './cart.module.css';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, total, isLoaded } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingMessage}>Loading cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div>
        <div className={styles.container}>
          <h1 className={styles.title}>Shopping Cart</h1>

          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2 className={styles.emptyTitle}>
              Your cart is empty
            </h2>
            <p className={styles.emptyMessage}>
              Start shopping to add items to your cart
            </p>
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

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.title}>Shopping Cart</h1>

        <div className={styles.layout}>
          {/* Cart Items */}
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <div
                key={item.id}
                className={styles.cartItem}
              >
                <div className={styles.itemHeader}>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>
                      {item.name}
                    </h3>
                    <p className={styles.itemPrice}>
                      Rs {item.price.toFixed(0)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>

                <div className={styles.itemFooter}>
                  <span className={styles.quantityLabel}>Quantity:</span>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.quantityButton}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      className={styles.quantityInput}
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>
                  <span className={styles.subtotal}>
                    Subtotal: Rs{' '}
                    {(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className={styles.orderSummary}>
              <h2 className={styles.summaryTitle}>
                Order Summary
              </h2>

              <div className={styles.summaryLines}>
                <div className={styles.summaryLine}>
                  <span>Subtotal</span>
                  <span>Rs {total.toFixed(0)}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className={styles.totalLine}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalAmount}>
                  Rs {total.toFixed(0)}
                </span>
              </div>

              <Link
                href="/checkout"
                className={styles.checkoutButton}
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className={styles.secondaryButton}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
