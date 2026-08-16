'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=6');
        const { data } = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Khan Glowcare Center
          </h1>
          <p className={styles.heroSubtitle}>
            Premium skincare products for radiant, healthy skin
          </p>
          <Link
            href="/shop"
            className={styles.ctaButton}
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Featured Products
          </h2>

          {loading ? (
            <div className={styles.loadingMessage}>
              <p>Loading products...</p>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className={styles.productCard}
                >
                  <div className={styles.productImage}>
                    <span className={styles.productImagePlaceholder}>Product Image</span>
                  </div>
                  <div className={styles.productContent}>
                    <p className={styles.productCategory}>
                      {product.category}
                    </p>
                    <h3 className={styles.productTitle}>
                      {product.name}
                    </h3>
                    <p className={styles.productDescription}>
                      {product.description}
                    </p>
                    <div className={styles.productFooter}>
                      <span className={styles.productPrice}>
                        Rs {product.price.toFixed(0)}
                      </span>
                      <button className={styles.viewButton}>
                        View
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaSectionContent}>
          <h2 className={styles.ctaSectionTitle}>
            Discover Your Glow
          </h2>
          <p className={styles.ctaSectionDescription}>
            Explore our complete collection of premium skincare products designed
            to enhance your natural beauty.
          </p>
          <Link
            href="/shop"
            className={styles.primaryButton}
          >
            Browse All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
