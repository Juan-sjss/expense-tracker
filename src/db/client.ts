import { drizzle } from 'drizzle-orm/op-sqlite';
import { open } from '@op-engineering/op-sqlite';
import * as schema from './schema';
import { CREATE_TABLES_SQL } from './sql';
import type { OPSQLiteDatabase } from 'drizzle-orm/op-sqlite';

export type Db = OPSQLiteDatabase<typeof schema>;

let dbInstance: Db | null = null;

export function openDatabase(name = 'expense_tracker.db'): Db {
  if (dbInstance) return dbInstance;
  const sqlite = open({ name });
  sqlite.executeSync(CREATE_TABLES_SQL);
  dbInstance = drizzle(sqlite, { schema });
  return dbInstance;
}

export function getDb(): Db {
  if (!dbInstance) {
    throw new Error('Database not opened. Call openDatabase() first.');
  }
  return dbInstance;
}

export function closeDatabase(): void {
  dbInstance = null;
}
