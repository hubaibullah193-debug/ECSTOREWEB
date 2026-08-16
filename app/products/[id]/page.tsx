'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/useCart';
import ProductReviews from '@/components/ProductReviews';
import ProductReviewForm from '@/components/ProductReviewForm';
import styles from '../product-detail.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          setError('Product not found');
          return;
        }
        const { data } = await response.json();
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingMessage}>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error || 'Product not found'}</p>
        <Link href="/shop" className={styles.errorLink}>
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/shop" className={styles.breadcrumbLink}>
            ← Back to Shop
          </Link>
        </div>

        <div className={styles.layout}>
          {/* Product Image */}
          <div>
            <div className={styles.imageContainer}>
              <div className={styles.imageContent}>
                <div className={styles.imagePlaceholder}>Product Image</div>
                <div className={styles.imageIcon}>📦</div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className={styles.detailsSection}>
            <div>
              <span className={styles.categoryBadge}>
                {product.category}
              </span>
            </div>

            <h1 className={styles.title}>
              {product.name}
            </h1>

            <div className={styles.price}>
              Rs {product.price.toFixed(0)}
            </div>

            <p className={styles.description}>
              {product.description}
            </p>

            <div className={styles.specPanel}>
              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <p className={styles.specLabel}>SKU</p>
                  <p className={styles.specValue}>{product.sku}</p>
                </div>
                <div className={styles.specItem}>
                  <p className={styles.specLabel}>Stock Available</p>
                  <p className={styles.specValue}>
                    {product.stock > 0 ? (
                      <span className={styles.stockAvailable}>{product.stock} units</span>
                    ) : (
                      <span className={styles.stockUnavailable}>Out of Stock</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            {product.stock > 0 && (
              <div className={styles.addToCartSection}>
                <div className={styles.quantityGroup}>
                  <label className={styles.quantityLabel}>
                    Quantity:
                  </label>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() =>
                        setQuantity(Math.max(1, quantity - 1))
                      }
                      className={styles.quantityButton}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(
                            product.stock,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        )
                      }
                      className={styles.quantityInput}
                    />
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={styles.addToCartButton}
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>

                <Link
                  href="/cart"
                  className={styles.goToCartButton}
                >
                  Go to Cart
                </Link>
              </div>
            )}

            {product.stock === 0 && (
              <div className={styles.outOfStockAlert}>
                <p className={styles.outOfStockTitle}>Out of Stock</p>
                <p className={styles.outOfStockMessage}>
                  Check back soon for availability
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
          <div className={styles.reviewsLayout}>
            <div className={styles.reviewsList}>
              <ProductReviews productId={productId} />
            </div>
            <div className={styles.reviewForm}>
              <ProductReviewForm productId={productId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
