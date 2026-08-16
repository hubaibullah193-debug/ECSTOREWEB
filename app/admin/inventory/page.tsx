'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  stock: number;
  sku: string;
  isActive: boolean;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
      console.error(err);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!response.ok) throw new Error('Failed to update product');

      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, isActive: !isActive } : p
        )
      );
    } catch (err) {
      alert('Failed to update product');
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  if (loading) {
    return <div className="text-center text-gray-500">Loading inventory...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className={styles.dashboardTitle}>Inventory Management</h1>
        <Link href="/admin/inventory/new" className={styles.buttonPrimary}>
          Add Product
        </Link>
      </div>

      {error && (
        <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-error)', color: 'var(--color-surface)', borderRadius: '0.5rem' }}>
          {error}
        </div>
      )}

      {/* Filters */}
      <div className={styles.actionsSection}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Search</label>
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.select}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th style={{ textAlign: 'right' }}>Stock</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 600 }}>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>Rs. {product.price}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={product.stock < 5 ? styles.badgeError : styles.badgeSuccess}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleToggleActive(product.id, product.isActive)}
                      className={product.isActive ? styles.badgeInfo : styles.badgeWarning}
                      style={{ cursor: 'pointer', border: 'none', padding: 'var(--space-1) var(--space-2)', borderRadius: '0.25rem' }}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'center', display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
                    <Link
                      href={`/admin/inventory/${product.id}`}
                      style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{ color: 'var(--color-error)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
