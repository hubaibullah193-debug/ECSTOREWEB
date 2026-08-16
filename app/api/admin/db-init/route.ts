import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import postgres from 'postgres';

// This endpoint runs database initialization (create tables if they don't exist)
// Only accessible with admin authorization
export async function POST(request: Request) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.DB_INIT_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🚀 Starting database initialization...');

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not configured');
    }

    // Create SQL client directly
    const sql = postgres(databaseUrl);

    // Check if tables exist, if not create them
    console.log('📊 Creating tables...');

    // Create user table
    await sql`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text,
        "email" text UNIQUE,
        "emailVerified" boolean,
        "image" text,
        "createdAt" timestamp,
        "updatedAt" timestamp
      );
    `;

    // Create session table
    await sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" text PRIMARY KEY NOT NULL,
        "expiresAt" timestamp,
        "token" text UNIQUE,
        "createdAt" timestamp,
        "updatedAt" timestamp,
        "ipAddress" text,
        "userAgent" text,
        "userId" text NOT NULL,
        CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action
      );
    `;

    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS "products" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "description" text,
        "price" numeric(10, 2) NOT NULL,
        "category" varchar(100),
        "image" text,
        "stock" integer DEFAULT 0,
        "sku" varchar(100) UNIQUE,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      );
    `;

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "userId" text NOT NULL,
        "orderNumber" varchar(50) NOT NULL UNIQUE,
        "status" varchar(50) DEFAULT 'pending',
        "paymentMethod" varchar(50) NOT NULL,
        "paymentStatus" varchar(50) DEFAULT 'pending',
        "totalAmount" numeric(10, 2) NOT NULL,
        "discountAmount" numeric(10, 2) DEFAULT '0',
        "shippingCost" numeric(10, 2) DEFAULT '0',
        "finalAmount" numeric(10, 2) NOT NULL,
        "shippingName" text NOT NULL,
        "shippingEmail" text,
        "shippingPhone" text NOT NULL,
        "shippingAddress" text NOT NULL,
        "shippingCity" varchar(100) NOT NULL,
        "shippingProvince" varchar(100),
        "shippingPostalCode" varchar(20),
        "paymentReference" text,
        "notes" text,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT "orders_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action
      );
    `;

    // Create order_items table
    await sql`
      CREATE TABLE IF NOT EXISTS "order_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "orderId" uuid NOT NULL,
        "productId" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "price" numeric(10, 2) NOT NULL,
        "subtotal" numeric(10, 2) NOT NULL,
        CONSTRAINT "order_items_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action,
        CONSTRAINT "order_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action
      );
    `;

    // Create order_tracking table
    await sql`
      CREATE TABLE IF NOT EXISTS "order_tracking" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "orderId" uuid NOT NULL,
        "status" varchar(50) NOT NULL,
        "description" text,
        "location" text,
        "timestamp" timestamp DEFAULT now(),
        CONSTRAINT "order_tracking_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action
      );
    `;

    // Create store_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS "store_settings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "key" varchar(100) NOT NULL UNIQUE,
        "value" text NOT NULL,
        "description" text,
        "updatedAt" timestamp DEFAULT now()
      );
    `;

    // Create account table
    await sql`
      CREATE TABLE IF NOT EXISTS "account" (
        "id" text PRIMARY KEY NOT NULL,
        "accountId" text NOT NULL,
        "providerId" text NOT NULL,
        "userId" text NOT NULL,
        "accessToken" text,
        "refreshToken" text,
        "idToken" text,
        "accessTokenExpiresAt" timestamp,
        "refreshTokenExpiresAt" timestamp,
        "scope" text,
        "password" text,
        "createdAt" timestamp,
        "updatedAt" timestamp,
        CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action
      );
    `;

    // Create verification table
    await sql`
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" text PRIMARY KEY NOT NULL,
        "identifier" text NOT NULL,
        "value" text NOT NULL,
        "expiresAt" timestamp,
        "createdAt" timestamp,
        "updatedAt" timestamp
      );
    `;

    // Create product_reviews table (check schema for this one)
    await sql`
      CREATE TABLE IF NOT EXISTS "product_reviews" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "productId" uuid NOT NULL,
        "userId" text NOT NULL,
        "rating" integer NOT NULL,
        "title" text,
        "comment" text,
        "helpful" integer DEFAULT 0,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT "product_reviews_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action,
        CONSTRAINT "product_reviews_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action
      );
    `;

    // Close the connection
    await sql.end();

    console.log('✅ Database initialization completed successfully');
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully - all tables created'
    });
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
