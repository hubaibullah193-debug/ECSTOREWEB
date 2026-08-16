'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';

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
    return <div className={styles.loadingMessage}>Loading settings...</div>;
  }

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Link href="/admin" style={{ color: 'var(--color-accent)', fontSize: '1.5rem', textDecoration: 'none' }}>
          ←
        </Link>
        <h1 className={styles.dashboardTitle}>Notification Settings</h1>
      </div>

      <div className={styles.actionsSection} style={{ maxWidth: '42rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Notification Channels */}
        <div>
          <h2 className={styles.actionsTitle}>Notification Channels</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', border: '1px solid var(--ink-tertiary)', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color var(--dur-mid) var(--ease-out)' }}>
              <input
                type="checkbox"
                checked={settings.notify_email}
                onChange={(e) =>
                  setSettings({ ...settings, notify_email: e.target.checked })
                }
                style={{ width: '1rem', height: '1rem' }}
              />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>Email Notifications</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
                  Send order confirmations and updates via email
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', border: '1px solid var(--ink-tertiary)', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color var(--dur-mid) var(--ease-out)' }}>
              <input
                type="checkbox"
                checked={settings.notify_sms}
                onChange={(e) =>
                  setSettings({ ...settings, notify_sms: e.target.checked })
                }
                style={{ width: '1rem', height: '1rem' }}
              />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>SMS Notifications</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
                  Send order updates via SMS (requires Twilio)
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', border: '1px solid var(--ink-tertiary)', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color var(--dur-mid) var(--ease-out)' }}>
              <input
                type="checkbox"
                checked={settings.notify_whatsapp}
                onChange={(e) =>
                  setSettings({ ...settings, notify_whatsapp: e.target.checked })
                }
                style={{ width: '1rem', height: '1rem' }}
              />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>WhatsApp Notifications</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
                  Send order updates via WhatsApp (requires Twilio)
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Notification Events */}
        <div>
          <h2 className={styles.actionsTitle}>Notification Events</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', border: '1px solid var(--ink-tertiary)', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color var(--dur-mid) var(--ease-out)' }}>
              <input
                type="checkbox"
                checked={settings.notify_on_confirmation}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notify_on_confirmation: e.target.checked,
                  })
                }
                style={{ width: '1rem', height: '1rem' }}
              />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>Order Confirmation</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
                  Notify customers when their order is confirmed
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', border: '1px solid var(--ink-tertiary)', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color var(--dur-mid) var(--ease-out)' }}>
              <input
                type="checkbox"
                checked={settings.notify_on_shipped}
                onChange={(e) =>
                  setSettings({ ...settings, notify_on_shipped: e.target.checked })
                }
                style={{ width: '1rem', height: '1rem' }}
              />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>Order Shipped</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
                  Notify customers when their order is shipped
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', border: '1px solid var(--ink-tertiary)', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color var(--dur-mid) var(--ease-out)' }}>
              <input
                type="checkbox"
                checked={settings.notify_on_delivered}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notify_on_delivered: e.target.checked,
                  })
                }
                style={{ width: '1rem', height: '1rem' }}
              />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>Order Delivered</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
                  Notify customers when their order is delivered
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Service Credentials Status */}
        <div>
          <h2 className={styles.actionsTitle}>Service Status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', backgroundColor: 'var(--color-success)', border: `1px solid var(--color-success)`, borderRadius: '0.5rem' }}>
              <span style={{ color: 'var(--color-surface)' }}>Resend API (Email)</span>
              <span style={{ color: 'var(--color-surface)', fontWeight: 600 }}>
                {process.env.NEXT_PUBLIC_RESEND_CONFIGURED ? '✓ Configured' : '○ Not configured'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', backgroundColor: 'var(--color-success)', border: `1px solid var(--color-success)`, borderRadius: '0.5rem' }}>
              <span style={{ color: 'var(--color-surface)' }}>Twilio (SMS/WhatsApp)</span>
              <span style={{ color: 'var(--color-surface)', fontWeight: 600 }}>
                {process.env.NEXT_PUBLIC_TWILIO_CONFIGURED ? '✓ Configured' : '○ Not configured'}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div
            style={{
              padding: 'var(--space-3)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: message.includes('success') ? 'var(--color-success)' : 'var(--color-error)',
              color: 'var(--color-surface)',
              border: `1px solid ${message.includes('success') ? 'var(--color-success)' : 'var(--color-error)'}`,
            }}
          >
            {message}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={styles.buttonPrimary}
          style={{ width: '100%', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
