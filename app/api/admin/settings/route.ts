import { getDb } from '@/lib/db';
import { storeSettings } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDb();

    const settings = await db
      .select()
      .from(storeSettings)
      .orderBy(storeSettings.key);

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'Settings must be an array' },
        { status: 400 }
      );
    }

    // Upsert each setting
    const results = await Promise.all(
      settings.map(async (setting) => {
        const existing = await db
          .select()
          .from(storeSettings)
          .where(eq(storeSettings.key, setting.key));

        if (existing.length > 0) {
          // Update
          return db
            .update(storeSettings)
            .set({
              value: setting.value,
              updatedAt: new Date(),
            })
            .where(eq(storeSettings.key, setting.key))
            .returning();
        } else {
          // Insert
          return db
            .insert(storeSettings)
            .values({
              key: setting.key,
              value: setting.value,
              description: setting.description,
            })
            .returning();
        }
      })
    );

    return NextResponse.json({ settings: results.flat() });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
