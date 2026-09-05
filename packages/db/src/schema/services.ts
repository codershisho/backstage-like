import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const services = pgTable(
  'services',
  {
    id: uuid('id')
      .primaryKey()
      .defaultRandom(),

    name: varchar('name', {
      length: 255,
    })
      .notNull()
      .unique(),

    description: text('description')
      .notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    deletedAt: timestamp('deleted_at', {
      withTimezone: true,
    }),
  },
);