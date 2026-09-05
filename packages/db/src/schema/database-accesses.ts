import { index, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core'

import { apis } from './apis.js'
import { databases } from './databases.js'
import { databaseOperationEnum } from './enums.js'

export const databaseAccesses = pgTable(
  'database_accesses',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    apiId: uuid('api_id')
      .notNull()
      .references(() => apis.id),

    databaseId: uuid('database_id')
      .notNull()
      .references(() => databases.id),

    operation: databaseOperationEnum('operation').notNull(),

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
    unique('uq_database_accesses_api_database_operation').on(
      table.apiId,
      table.databaseId,
      table.operation,
    ),

    index('idx_database_accesses_api_id').on(table.apiId),

    index('idx_database_accesses_database_id').on(table.databaseId),
  ],
)
