'use client';

import { useEffect, useState } from 'react';

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
    return <div className="text-center text-gray-500">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center text-red-500">Failed to load dashboard</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold uppercase">Total Products</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{stats.totalProducts}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.activeProducts} active</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold uppercase">Low Stock</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats.lowStockProducts}</p>
          <p className="text-xs text-gray-500 mt-1">Products with stock &lt; 5</p>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold uppercase">Total Orders</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{stats.totalOrders}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.pendingOrders} pending</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/inventory/new"
            className="block p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-center"
          >
            <p className="font-semibold text-slate-800">Add Product</p>
            <p className="text-sm text-gray-600 mt-1">Create a new product</p>
          </a>
          <a
            href="/admin/inventory"
            className="block p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-center"
          >
            <p className="font-semibold text-slate-800">Manage Inventory</p>
            <p className="text-sm text-gray-600 mt-1">Edit products and stock</p>
          </a>
          <a
            href="/admin/orders"
            className="block p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-center"
          >
            <p className="font-semibold text-slate-800">View Orders</p>
            <p className="text-sm text-gray-600 mt-1">Manage customer orders</p>
          </a>
        </div>
      </div>
    </div>
  );
}
