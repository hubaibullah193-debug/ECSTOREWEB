'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './shop.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const CATEGORIES = [
  'All',
  'Serums',
  'Creams',
  'Cleansers',
  'Masks',
  'Eye Care',
  'Sun Care',
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const { data } = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Our Shop</h1>
          <p className={styles.headerDescription}>
            Explore our complete collection of premium skincare products
          </p>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.layout}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Search */}
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Categories */}
            <div className={styles.categoriesPanel}>
              <h3 className={styles.categoriesTitle}>
                Categories
              </h3>
              <div className={styles.categoriesList}>
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`${styles.categoryButton} ${
                      selectedCategory === category ? styles.categoryButtonActive : ''
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={styles.productsSection}>
            {loading ? (
              <div className={styles.loadingMessage}>
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.emptyMessage}>
                <p>No products found</p>
              </div>
            ) : (
              <>
                <div className={styles.resultCount}>
                  <p>
                    Showing {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className={styles.productGrid}>
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className={styles.productCard}
                    >
                      <div className={styles.productImageContainer}>
                        <span className={styles.productImagePlaceholder}>Product Image</span>
                        {product.stock < 10 && product.stock > 0 && (
                          <div className={styles.stockBadge}>
                            Only {product.stock} left
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className={styles.outOfStockOverlay}>
                            <span className={styles.outOfStockText}>
                              Out of Stock
                            </span>
                          </div>
                        )}
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
                          <button
                            className={styles.viewButton}
                            disabled={product.stock === 0}
                          >
                            {product.stock === 0 ? 'OOS' : 'View'}
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
