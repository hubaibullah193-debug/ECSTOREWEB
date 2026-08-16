'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface OrderData {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  shippingCost: number;
  finalAmount: number;
  paymentMethod: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const { data } = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg border-2 border-green-500 p-8 text-center mb-8">
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            {order && (
              <p className="text-2xl font-bold text-rose-500">
                Order #{order.orderNumber}
              </p>
            )}
          </div>

          {/* Order Details */}
          {order && (
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Details
              </h2>

              <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-semibold text-gray-800">
                    {order.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-semibold text-gray-800 capitalize">
                    {order.paymentMethod === 'cod'
                      ? 'Cash on Delivery'
                      : order.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    Rs {order.totalAmount.toFixed(0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-800">
                    Rs {order.shippingCost.toFixed(0)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-3xl font-bold text-rose-500">
                  Rs {order.finalAmount.toFixed(0)}
                </span>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-blue-900 mb-4">What's Next?</h3>
            <ul className="space-y-2 text-blue-800">
              <li>✓ Order confirmation has been sent to your email</li>
              <li>✓ Your order will be prepared for shipment</li>
              <li>✓ You'll receive a tracking number via SMS and email</li>
              <li>✓ Estimated delivery: 3-5 business days</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href="/shop"
              className="flex-1 text-center bg-rose-500 text-white py-3 rounded-lg font-bold hover:bg-rose-600 transition"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 text-center bg-white text-rose-500 border-2 border-rose-500 py-3 rounded-lg font-bold hover:bg-rose-50 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
