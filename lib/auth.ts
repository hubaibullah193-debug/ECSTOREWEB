import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";

export function createAuth() {
  const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
  const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;

  if (!BETTER_AUTH_SECRET) {
    throw new Error("Missing BETTER_AUTH_SECRET environment variable");
  }

  if (!BETTER_AUTH_URL) {
    throw new Error("Missing BETTER_AUTH_URL environment variable");
  }

  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: "pg",
      schema: {
        user: "user",
        session: "session",
        account: "account",
        verification: "verification",
      },
    }),
    secret: BETTER_AUTH_SECRET,
    baseURL: BETTER_AUTH_URL,
    trustedOrigins: process.env.NODE_ENV === "production"
      ? ["https://khan-glowcare.com", "https://www.khan-glowcare.com"]
      : ["http://localhost:3000"],
    emailAndPassword: {
      enabled: true,
      autoSignUpEmail: false,
    },
    plugins: [],
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  });
}
