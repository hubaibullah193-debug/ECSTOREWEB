import type { Config } from 'drizzle-kit';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Parse connection string: postgresql://user:password@host:port/database
const url = new URL(connectionString);
const dbCredentials = {
  host: url.hostname,
  port: parseInt(url.port || '5432'),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: 'require' as const,
};

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials,
  verbose: true,
  strict: true,
} satisfies Config;
