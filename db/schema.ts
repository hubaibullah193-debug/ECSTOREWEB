import { pgTable, text, timestamp, boolean, integer, numeric, varchar, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// Better Auth Tables
// ============================================================================

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: boolean('emailVerified'),
  image: text('image'),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});

export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt'),
  token: text('token').unique(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});

export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt'),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});

// ============================================================================
// Products
// ============================================================================

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }),
  image: text('image'),
  stock: integer('stock').default(0),
  sku: varchar('sku', { length: 100 }).unique(),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// ============================================================================
// Orders
// ============================================================================

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  orderNumber: varchar('orderNumber', { length: 50 }).notNull().unique(),
  status: varchar('status', { length: 50 }).default('pending'), // pending, confirmed, shipped, delivered, cancelled
  paymentMethod: varchar('paymentMethod', { length: 50 }).notNull(), // cod, jazzcash, easypaisa
  paymentStatus: varchar('paymentStatus', { length: 50 }).default('pending'), // pending, completed, failed
  totalAmount: numeric('totalAmount', { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric('discountAmount', { precision: 10, scale: 2 }).default('0'),
  shippingCost: numeric('shippingCost', { precision: 10, scale: 2 }).default('0'),
  finalAmount: numeric('finalAmount', { precision: 10, scale: 2 }).notNull(),

  // Shipping info
  shippingName: text('shippingName').notNull(),
  shippingEmail: text('shippingEmail'),
  shippingPhone: text('shippingPhone').notNull(),
  shippingAddress: text('shippingAddress').notNull(),
  shippingCity: varchar('shippingCity', { length: 100 }).notNull(),
  shippingProvince: varchar('shippingProvince', { length: 100 }),
  shippingPostalCode: varchar('shippingPostalCode', { length: 20 }),

  // Payment reference
  paymentReference: text('paymentReference'), // Transaction ID from payment gateway
  notes: text('notes'),

  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('orderId')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('productId')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(), // Price at time of purchase
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
});

export const orderTracking = pgTable('order_tracking', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('orderId')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull(), // pending, confirmed, shipped, in_transit, delivered, cancelled
  description: text('description'),
  location: text('location'),
  timestamp: timestamp('timestamp').defaultNow(),
});

// ============================================================================
// Store Settings
// ============================================================================

export const storeSettings = pgTable('store_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(), // e.g., 'store_name', 'store_phone', etc.
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// ============================================================================
// Product Reviews & Ratings
// ============================================================================

export const productReviews = pgTable('product_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('productId')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  orderId: uuid('orderId').references(() => orders.id, { onDelete: 'set null' }), // Optional: track which order the review came from
  rating: integer('rating').notNull(), // 1-5 stars
  title: varchar('title', { length: 200 }),
  comment: text('comment'),
  isApproved: boolean('isApproved').default(false), // Admin moderation
  helpfulCount: integer('helpfulCount').default(0), // Users marking as helpful
  images: jsonb('images'), // JSON array of image URLs
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// ============================================================================
// Order Feedback
// ============================================================================

export const orderFeedback = pgTable('order_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('orderId')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  overallRating: integer('overallRating').notNull(), // 1-5 stars
  deliveryRating: integer('deliveryRating'), // 1-5 stars
  packagingRating: integer('packagingRating'), // 1-5 stars
  comment: text('comment'),
  issues: text('issues'), // Any issues faced
  wouldRecommend: boolean('wouldRecommend'), // Would they recommend?
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// ============================================================================
// Relations
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  orders: many(orders),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  tracking: many(orderTracking),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const orderTrackingRelations = relations(orderTracking, ({ one }) => ({
  order: one(orders, {
    fields: [orderTracking.orderId],
    references: [orders.id],
  }),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [productReviews.orderId],
    references: [orders.id],
  }),
}));

export const orderFeedbackRelations = relations(orderFeedback, ({ one }) => ({
  order: one(orders, {
    fields: [orderFeedback.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [orderFeedback.userId],
    references: [users.id],
  }),
}));
