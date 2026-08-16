'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';

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
    return <div className={styles.loadingMessage}>Loading settings...</div>;
  }

  return (
    <div style={{ maxWidth: '56rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <h1 className={styles.dashboardTitle}>Store Settings</h1>

      {error && (
        <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-error)', color: 'var(--color-surface)', borderRadius: '0.5rem' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-success)', color: 'var(--color-surface)', borderRadius: '0.5rem' }}>
          {success}
        </div>
      )}

      <div className={styles.actionsSection} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Business Information */}
        <div>
          <h2 className={styles.actionsTitle}>Business Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {settings
              .filter((s) => s.key.startsWith('store_'))
              .map((setting) => (
                <div key={setting.key} className={styles.formGroup}>
                  <label className={styles.label}>{setting.description}</label>
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className={styles.input}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Payment Gateway Configuration */}
        <div style={{ borderTop: '1px solid var(--ink-tertiary)', paddingTop: 'var(--space-6)' }}>
          <h2 className={styles.actionsTitle}>Payment Gateways</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* JazzCash */}
            <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--ink-quaternary)', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>JazzCash</h3>
              {settings
                .filter((s) => s.key.startsWith('jazzcash_'))
                .map((setting) => (
                  <div key={setting.key} className={styles.formGroup}>
                    <label className={styles.label}>{setting.description}</label>
                    <input
                      type={setting.key.includes('password') || setting.key.includes('token') ? 'password' : 'text'}
                      value={setting.value}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      className={styles.input}
                    />
                  </div>
                ))}
            </div>

            {/* Easypaisa */}
            <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--ink-quaternary)', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>Easypaisa</h3>
              {settings
                .filter((s) => s.key.startsWith('easypaisa_'))
                .map((setting) => (
                  <div key={setting.key} className={styles.formGroup}>
                    <label className={styles.label}>{setting.description}</label>
                    <input
                      type={setting.key.includes('password') || setting.key.includes('token') ? 'password' : 'text'}
                      value={setting.value}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      className={styles.input}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div style={{ borderTop: '1px solid var(--ink-tertiary)', paddingTop: 'var(--space-6)' }}>
          <h2 className={styles.actionsTitle}>Shipping</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {settings
              .filter((s) => s.key.startsWith('shipping_'))
              .map((setting) => (
                <div key={setting.key} className={styles.formGroup}>
                  <label className={styles.label}>{setting.description}</label>
                  <input
                    type="number"
                    value={setting.value}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className={styles.input}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Save Button */}
        <div style={{ borderTop: '1px solid var(--ink-tertiary)', paddingTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className={styles.buttonPrimary}
            style={{ opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <p style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)', margin: 0 }}>
            Settings are stored securely in the database
          </p>
        </div>
      </div>
    </div>
  );
}
