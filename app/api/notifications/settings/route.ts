import { getDb } from '@/lib/db';
import { storeSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    // Get notification settings
    const settings = await db
      .select()
      .from(storeSettings)
      .where(eq(storeSettings.key, 'notification_settings'));

    if (!settings.length) {
      // Return default settings if none exist
      return NextResponse.json({
        notify_sms: true,
        notify_whatsapp: false,
        notify_email: true,
        notify_on_confirmation: true,
        notify_on_shipped: true,
        notify_on_delivered: true,
      });
    }

    try {
      const parsedValue = JSON.parse(settings[0].value);
      return NextResponse.json(parsedValue);
    } catch {
      return NextResponse.json({
        notify_sms: true,
        notify_whatsapp: false,
        notify_email: true,
        notify_on_confirmation: true,
        notify_on_shipped: true,
        notify_on_delivered: true,
      });
    }
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    // Upsert notification settings
    const existing = await db
      .select()
      .from(storeSettings)
      .where(eq(storeSettings.key, 'notification_settings'));

    if (existing.length) {
      await db
        .update(storeSettings)
        .set({
          value: JSON.stringify(body),
          updatedAt: new Date(),
        })
        .where(eq(storeSettings.key, 'notification_settings'));
    } else {
      await db.insert(storeSettings).values({
        key: 'notification_settings',
        value: JSON.stringify(body),
        description: 'Notification preferences and settings',
      });
    }

    return NextResponse.json({
      success: true,
      settings: body,
    });
  } catch (error) {
    console.error('Error saving notification settings:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
