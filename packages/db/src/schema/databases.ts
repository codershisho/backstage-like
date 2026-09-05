import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const databases = pgTable(
  'databases',
  {
    id: uuid('id')
      .primaryKey()
      .defaultRandom(),

    name: varchar('name', {
      length: 255,
    })
      .notNull(),

    type: varchar('type', {
      length: 100,
    })
      .notNull(),

    host: varchar('host', {
      length: 255,
    })
      .notNull(),

    port: integer('port')
      .notNull(),

    databaseName: varchar('database_name', {
      length: 255,
    })
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
    index('idx_databases_name')
      .on(table.name),
  ],
);