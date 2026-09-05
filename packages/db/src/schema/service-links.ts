import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { services } from './services.js';

export const serviceLinks = pgTable(
  'service_links',
  {
    id: uuid('id')
      .primaryKey()
      .defaultRandom(),

    serviceId: uuid('service_id')
      .notNull()
      .references(() => services.id),

    name: varchar('name', {
      length: 255,
    })
      .notNull(),

    url: text('url')
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
  (table) => [
    index('idx_service_links_service_id')
      .on(table.serviceId),
  ],
);