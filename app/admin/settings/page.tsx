'use client';

import { useEffect, useState } from 'react';

interface StoreSetting {
  key: string;
  value: string;
  description: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const defaultSettings = [
    {
      key: 'store_name',
      value: 'Khan Glowcare Center',
      description: 'Store name',
    },
    {
      key: 'store_phone',
      value: '',
      description: 'Store contact phone number',
    },
    {
      key: 'store_email',
      value: '',
      description: 'Store email address',
    },
    {
      key: 'store_address',
      value: '',
      description: 'Store physical address',
    },
    {
      key: 'store_city',
      value: '',
      description: 'Store city',
    },
    {
      key: 'store_province',
      value: '',
      description: 'Store province',
    },
    {
      key: 'jazzcash_merchant_id',
      value: '',
      description: 'JazzCash Merchant ID',
    },
    {
      key: 'jazzcash_password',
      value: '',
      description: 'JazzCash Password (keep confidential)',
    },
    {
      key: 'easypaisa_store_id',
      value: '',
      description: 'Easypaisa Store ID',
    },
    {
      key: 'easypaisa_auth_token',
      value: '',
      description: 'Easypaisa Auth Token (keep confidential)',
    },
    {
      key: 'shipping_cost',
      value: '0',
      description: 'Default shipping cost (Rs)',
    },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();

      // Merge existing settings with defaults
      const merged = defaultSettings.map((def) => {
        const existing = data.settings.find(
          (s: StoreSetting) => s.key === def.key
        );
        return existing || def;
      });

      setSettings(merged);
      setError('');
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Store Settings</h1>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">{success}</div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Business Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h2>
          <div className="space-y-4">
            {settings
              .filter((s) => s.key.startsWith('store_'))
              .map((setting) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {setting.description}
                  </label>
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Payment Gateway Configuration */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Gateways</h2>

          <div className="space-y-6">
            {/* JazzCash */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-800">JazzCash</h3>
              {settings
                .filter((s) => s.key.startsWith('jazzcash_'))
                .map((setting) => (
                  <div key={setting.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {setting.description}
                    </label>
                    <input
                      type={setting.key.includes('password') || setting.key.includes('token') ? 'password' : 'text'}
                      value={setting.value}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                ))}
            </div>

            {/* Easypaisa */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-800">Easypaisa</h3>
              {settings
                .filter((s) => s.key.startsWith('easypaisa_'))
                .map((setting) => (
                  <div key={setting.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {setting.description}
                    </label>
                    <input
                      type={setting.key.includes('password') || setting.key.includes('token') ? 'password' : 'text'}
                      value={setting.value}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping</h2>
          <div className="space-y-4">
            {settings
              .filter((s) => s.key.startsWith('shipping_'))
              .map((setting) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {setting.description}
                  </label>
                  <input
                    type="number"
                    value={setting.value}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t pt-6 flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-400 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <p className="text-xs text-gray-500 py-2">
            Settings are stored securely in the database
          </p>
        </div>
      </div>
    </div>
  );
}
