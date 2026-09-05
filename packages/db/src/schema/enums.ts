import { pgEnum } from 'drizzle-orm/pg-core'

export const databaseOperationEnum = pgEnum('database_operation', [
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
])
