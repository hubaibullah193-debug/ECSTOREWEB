'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Khan Glowcare Center
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Premium skincare products for radiant, healthy skin
          </p>
          <Link
            href="/shop"
            className="inline-block bg-white text-rose-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
            Featured Products
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500">Product Image</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-rose-500 font-semibold mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-rose-500 transition">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-rose-500">
                          Rs {product.price.toFixed(0)}
                        </span>
                        <button className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Discover Your Glow
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our complete collection of premium skincare products designed
            to enhance your natural beauty.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-600 transition"
          >
            Browse All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
