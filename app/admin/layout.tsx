'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/inventory', label: 'Inventory' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/reviews', label: 'Reviews' },
    { href: '/admin/settings', label: 'Settings' },
    { href: '/admin/notifications', label: 'Notifications' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen ? 'Khan Admin' : 'KA'}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm"
              title={item.label}
            >
              {sidebarOpen ? item.label : item.label.charAt(0)}
            </Link>
          ))}
        </nav>

        {/* Toggle button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">Khan Glowcare Admin</h2>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
