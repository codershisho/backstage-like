import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

import { services } from './services.js'

export const apis = pgTable(
  'apis',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    serviceId: uuid('service_id')
      .notNull()
      .references(() => services.id),

    name: varchar('name', {
      length: 255,
    }).notNull(),

    version: varchar('version', {
      length: 100,
    }).notNull(),

    openapiUrl: text('openapi_url'),

    openapiContent: text('openapi_content'),

    description: text('description'),

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
    unique('uq_apis_name_version').on(table.name, table.version),

    index('idx_apis_service_id').on(table.serviceId),
  ],
)
