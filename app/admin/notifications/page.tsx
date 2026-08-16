'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NotificationSettings {
  notify_sms: boolean;
  notify_whatsapp: boolean;
  notify_email: boolean;
  notify_on_confirmation: boolean;
  notify_on_shipped: boolean;
  notify_on_delivered: boolean;
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    notify_sms: true,
    notify_whatsapp: false,
    notify_email: true,
    notify_on_confirmation: true,
    notify_on_shipped: true,
    notify_on_delivered: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/notifications/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/notifications/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage('Settings saved successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      setMessage('Error saving settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-2xl">
          ←
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
      </div>

      <div className="max-w-2xl bg-white rounded-lg shadow p-6 space-y-6">
        {/* Notification Channels */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Channels</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_email}
                onChange={(e) =>
                  setSettings({ ...settings, notify_email: e.target.checked })
                }
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium text-gray-900">Email Notifications</div>
                <div className="text-sm text-gray-600">
                  Send order confirmations and updates via email
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_sms}
                onChange={(e) =>
                  setSettings({ ...settings, notify_sms: e.target.checked })
                }
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium text-gray-900">SMS Notifications</div>
                <div className="text-sm text-gray-600">
                  Send order updates via SMS (requires Twilio)
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_whatsapp}
                onChange={(e) =>
                  setSettings({ ...settings, notify_whatsapp: e.target.checked })
                }
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium text-gray-900">WhatsApp Notifications</div>
                <div className="text-sm text-gray-600">
                  Send order updates via WhatsApp (requires Twilio)
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Notification Events */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Events</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_on_confirmation}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notify_on_confirmation: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium text-gray-900">Order Confirmation</div>
                <div className="text-sm text-gray-600">
                  Notify customers when their order is confirmed
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_on_shipped}
                onChange={(e) =>
                  setSettings({ ...settings, notify_on_shipped: e.target.checked })
                }
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium text-gray-900">Order Shipped</div>
                <div className="text-sm text-gray-600">
                  Notify customers when their order is shipped
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_on_delivered}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notify_on_delivered: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium text-gray-900">Order Delivered</div>
                <div className="text-sm text-gray-600">
                  Notify customers when their order is delivered
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Service Credentials Status */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Status</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-gray-900">Resend API (Email)</span>
              <span className="text-green-700 font-medium">
                {process.env.NEXT_PUBLIC_RESEND_CONFIGURED ? '✓ Configured' : '○ Not configured'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-gray-900">Twilio (SMS/WhatsApp)</span>
              <span className="text-green-700 font-medium">
                {process.env.NEXT_PUBLIC_TWILIO_CONFIGURED ? '✓ Configured' : '○ Not configured'}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${
              message.includes('success')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
