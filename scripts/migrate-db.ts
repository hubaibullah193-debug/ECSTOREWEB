import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { getDb } from '@/lib/db';

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');

    const db = getDb();

    // Run migrations
    await migrate(db, { migrationsFolder: './db/migrations' });

    console.log('✅ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    // Exit with error code but don't crash the build
    process.exit(1);
  }
}

runMigrations();
