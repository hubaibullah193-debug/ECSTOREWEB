import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  if (!db) {
    const client = postgres(databaseUrl);
    db = drizzle(client);
  }

  return db;
}
