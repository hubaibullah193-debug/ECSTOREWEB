'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../admin.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  stock: number;
  sku: string;
}

const CATEGORIES = [
  'Serums',
  'Creams',
  'Cleansers',
  'Masks',
  'Eye Care',
  'Sun Care',
];

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const isNew = productId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: 0,
    sku: '',
  });

  useEffect(() => {
    if (!isNew) {
      fetchProduct();
    }
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setForm(data.product);
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'stock' || name === 'price'
          ? value
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const url = isNew
        ? '/api/admin/products'
        : `/api/admin/products/${form.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Failed to save product');

      router.push('/admin/inventory');
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingMessage}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '42rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        <h1 className={styles.dashboardTitle}>
          {isNew ? 'Add New Product' : 'Edit Product'}
        </h1>
        <Link href="/admin/inventory" style={{ color: 'var(--ink-secondary)', textDecoration: 'none' }}>
          ← Back
        </Link>
      </div>

      {error && (
        <div style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)', backgroundColor: 'var(--color-error)', color: 'var(--color-surface)', borderRadius: '0.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.actionsSection} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Product Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="e.g., Vitamin C Serum"
            />
          </div>

          {/* SKU */}
          <div className={styles.formGroup}>
            <label className={styles.label}>SKU *</label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="e.g., VIT-C-30ML"
            />
          </div>

          {/* Price */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Price (Rs) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              step="0.01"
              className={styles.input}
              placeholder="0.00"
            />
          </div>

          {/* Category */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              className={styles.input}
              placeholder="0"
            />
          </div>

          {/* Image URL */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Image URL</label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={styles.textarea}
            placeholder="Product description..."
          />
        </div>

        {/* Image Preview */}
        {form.image && (
          <div>
            <label className={styles.label}>Image Preview</label>
            <img
              src={form.image}
              alt={form.name}
              style={{ width: '12rem', height: '12rem', objectFit: 'cover', borderRadius: '0.5rem' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--ink-tertiary)' }}>
          <button
            type="submit"
            disabled={submitting}
            className={styles.buttonPrimary}
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'Saving...' : isNew ? 'Create Product' : 'Update Product'}
          </button>
          <Link href="/admin/inventory" className={styles.buttonSecondary}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
