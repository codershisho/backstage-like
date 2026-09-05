import {
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { apis } from './apis.js';
import { services } from './services.js';

export const serviceApiCalls = pgTable(
  'service_api_calls',
  {
    serviceId: uuid('service_id')
      .notNull()
      .references(() => services.id),

    apiId: uuid('api_id')
      .notNull()
      .references(() => apis.id),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    deletedAt: timestamp('deleted_at', {
      withTimezone: true,
    }),
  },
  (table) => [
    primaryKey({
      columns: [
        table.serviceId,
        table.apiId,
      ],
    }),
  ],
);