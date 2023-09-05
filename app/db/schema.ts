import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  description: text('description'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .notNull()
    .default(sql`now()`),
});
