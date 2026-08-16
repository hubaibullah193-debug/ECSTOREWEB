'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="">All Orders</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {order.shippingName}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-right text-gray-900 font-medium">
                        Rs. {order.totalAmount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Order Details
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase">Order Number</p>
                <p className="text-sm font-semibold text-gray-800">
                  {selectedOrder.orderNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Customer</p>
                <p className="text-sm font-semibold text-gray-800">
                  {selectedOrder.shippingName}
                </p>
                <p className="text-xs text-gray-600">{selectedOrder.shippingPhone}</p>
                <p className="text-xs text-gray-600">{selectedOrder.shippingCity}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Amount</p>
                <p className="text-lg font-bold text-slate-800">
                  Rs. {selectedOrder.totalAmount}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Payment Method</p>
                <p className="text-sm font-semibold text-gray-800">
                  {selectedOrder.paymentMethod.toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Payment Status</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    selectedOrder.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : selectedOrder.paymentStatus === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedOrder.paymentStatus.charAt(0).toUpperCase() +
                    selectedOrder.paymentStatus.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Date</p>
                <p className="text-sm text-gray-600">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Status Update */}
            <div className="border-t pt-4">
              <label className="block text-xs text-gray-500 uppercase font-semibold mb-2">
                Update Status
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleStatusChange(selectedOrder.id, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
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
}
