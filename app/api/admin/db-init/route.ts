import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

// This endpoint runs database migrations and seeding
// Only accessible with admin authorization
export async function POST(request: Request) {
  try {
    // Verify this is being called from Vercel deployment
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.DB_INIT_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🚀 Starting database initialization...');

    const db = getDb();

    // Run migrations
    console.log('📊 Running migrations...');
    await migrate(db, { migrationsFolder: './db/migrations' });
    console.log('✅ Migrations completed');

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
