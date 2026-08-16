'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  subtotal: string;
  product?: {
    name: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: string;
  shippingName: string;
  shippingPhone: string;
  shippingCity: string;
  createdAt: string;
  items?: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update order');

      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      alert('Failed to update order status');
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(
    (o) => !filterStatus || o.status === filterStatus
  );

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  const paymentMethods = ['cod', 'jazzcash', 'easypaisa'];

  if (loading) {
    return <div className="text-center text-gray-500">Loading orders...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Order Management</h1>

      {error && (
        <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-error)', color: 'var(--color-surface)', borderRadius: '0.5rem' }}>
          {error}
        </div>
      )}

      {/* Filter */}
      <div className={styles.actionsSection}>
        <label className={styles.label}>Filter by Status</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.select}
        >
          <option value="">All Orders</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-6)' }}>
        {/* Orders List */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td style={{ fontWeight: 600 }}>{order.orderNumber}</td>
                    <td>{order.shippingName}</td>
                    <td>
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>Rs. {order.totalAmount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--ink-quaternary)', fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div className={styles.actionsSection} style={{ height: 'fit-content' }}>
            <h3 className={styles.actionsTitle}>Order Details</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <div>
                <p className={styles.statLabel}>Order Number</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink-primary)' }}>
                  {selectedOrder.orderNumber}
                </p>
              </div>

              <div>
                <p className={styles.statLabel}>Customer</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink-primary)' }}>
                  {selectedOrder.shippingName}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>{selectedOrder.shippingPhone}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>{selectedOrder.shippingCity}</p>
              </div>

              <div>
                <p className={styles.statLabel}>Amount</p>
                <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--ink-primary)' }}>
                  Rs. {selectedOrder.totalAmount}
                </p>
              </div>

              <div>
                <p className={styles.statLabel}>Payment Method</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink-primary)' }}>
                  {selectedOrder.paymentMethod.toUpperCase()}
                </p>
              </div>

              <div>
                <p className={styles.statLabel}>Payment Status</p>
                <span className={getPaymentStatusBadgeClass(selectedOrder.paymentStatus)}>
                  {selectedOrder.paymentStatus.charAt(0).toUpperCase() +
                    selectedOrder.paymentStatus.slice(1)}
                </span>
              </div>

              <div>
                <p className={styles.statLabel}>Date</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Status Update */}
            <div style={{ borderTop: '1px solid var(--ink-tertiary)', paddingTop: 'var(--space-4)' }}>
              <label className={styles.label}>Update Status</label>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleStatusChange(selectedOrder.id, e.target.value)
                }
                className={styles.select}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'delivered':
        return styles.badgeSuccess;
      case 'cancelled':
        return styles.badgeError;
      case 'shipped':
        return styles.badgeInfo;
      default:
        return styles.badgeWarning;
    }
  }

  function getPaymentStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return styles.badgeSuccess;
      case 'failed':
        return styles.badgeError;
      default:
        return styles.badgeWarning;
    }
  }
}
