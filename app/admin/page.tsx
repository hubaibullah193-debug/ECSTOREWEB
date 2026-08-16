'use client';

import { useEffect, useState } from 'react';
import styles from './admin.module.css';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className={styles.loadingMessage}>Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className={styles.errorMessage}>Failed to load dashboard</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Dashboard</h1>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {/* Products Section */}
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Total Products</h3>
          <p className={styles.statValue}>{stats.totalProducts}</p>
          <p className={styles.statSubtext}>{stats.activeProducts} active</p>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Low Stock</h3>
          <p className={`${styles.statValue} ${styles.statValueWarning}`}>{stats.lowStockProducts}</p>
          <p className={styles.statSubtext}>Products with stock &lt; 5</p>
        </div>

        {/* Orders Section */}
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Total Orders</h3>
          <p className={styles.statValue}>{stats.totalOrders}</p>
          <p className={styles.statSubtext}>{stats.pendingOrders} pending</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.actionsSection}>
        <h2 className={styles.actionsTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <a href="/admin/inventory/new" className={styles.actionCard}>
            <p className={styles.actionCardTitle}>Add Product</p>
            <p className={styles.actionCardDescription}>Create a new product</p>
          </a>
          <a href="/admin/inventory" className={styles.actionCard}>
            <p className={styles.actionCardTitle}>Manage Inventory</p>
            <p className={styles.actionCardDescription}>Edit products and stock</p>
          </a>
          <a href="/admin/orders" className={styles.actionCard}>
            <p className={styles.actionCardTitle}>View Orders</p>
            <p className={styles.actionCardDescription}>Manage customer orders</p>
          </a>
        </div>
      </div>
    </div>
  );
}
