import { pgTable, serial, text, timestamp, doublePrecision, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  price: doublePrecision('price').notNull(),
  oldPrice: doublePrecision('old_price'),
  rating: doublePrecision('rating').notNull(),
  reviews: integer('reviews').notNull(),
  image: text('image').notNull(),
  discount: text('discount'),
  isWide: boolean('is_wide').default(false),
  badge: text('badge'),
  category: text('category').default('general'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('user_id'),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  customerName: text('customer_name').notNull(),
  address: text('address').notNull(),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productReviews = pgTable('product_reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id),
  userId: text('user_id'),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const wishlists = pgTable('wishlists', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  productId: integer('product_id').references(() => products.id),
  createdAt: timestamp('created_at').defaultNow(),
});
