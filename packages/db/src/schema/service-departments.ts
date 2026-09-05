import {
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { departments } from './departments.js';
import { services } from './services.js';

export const serviceDepartments = pgTable(
  'service_departments',
  {
    serviceId: uuid('service_id')
      .notNull()
      .references(() => services.id),

    departmentId: uuid('department_id')
      .notNull()
      .references(() => departments.id),

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
        table.departmentId,
      ],
    }),
  ],
);