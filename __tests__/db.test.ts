import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/db/schema';
import { CREATE_TABLES_SQL } from '../src/db/sql';
import { seedDatabase, SEED_CATEGORIES, DEFAULT_ACCOUNT_NAME } from '../src/db/seed';
import {
  insertTransaction,
  listTransactions,
  updateTransaction,
  deleteTransaction,
  listCategories,
  listAccounts,
  getTransaction,
} from '../src/db/queries';
import type { Db } from '../src/db/client';

function makeDb() {
  const sqlite = new Database(':memory:');
  sqlite.exec(CREATE_TABLES_SQL);
  return drizzle(sqlite, { schema }) as unknown as Db;
}

describe('Database schema & seed', () => {
  it('crea las tablas y permite insertar', async () => {
    const db = makeDb();
    const accs = await listAccounts(db);
    expect(accs).toHaveLength(0);
  });

  it('siembra la cuenta General y las 19 categorías (idempotente)', async () => {
    const db = makeDb();
    await seedDatabase(db);

    const accounts = await listAccounts(db);
    expect(accounts).toHaveLength(1);
    expect(accounts[0]!.name).toBe(DEFAULT_ACCOUNT_NAME);
    expect(accounts[0]!.isDefault).toBe(true);

    const cats = await listCategories(db);
    expect(cats).toHaveLength(SEED_CATEGORIES.length);
    expect(cats.filter((c) => c.kind === 'expense')).toHaveLength(16);
    expect(cats.filter((c) => c.kind === 'income')).toHaveLength(3);
    expect(cats.every((c) => c.isSeed)).toBe(true);

    // Idempotencia: volver a sembrar no duplica
    await seedDatabase(db);
    const accounts2 = await listAccounts(db);
    const cats2 = await listCategories(db);
    expect(accounts2).toHaveLength(1);
    expect(cats2).toHaveLength(SEED_CATEGORIES.length);
  });
});

describe('Transactions (CRUD)', () => {
  async function setup() {
    const db = makeDb();
    await seedDatabase(db);
    const cats = await listCategories(db, 'expense');
    const accs = await listAccounts(db);
    return { db, category: cats[0]!, account: accs[0]! };
  }

  it('inserta y lista transacciones', async () => {
    const { db, category, account } = await setup();
    const tx = await insertTransaction(db, {
      amountCents: 1250,
      type: 'expense',
      date: '2026-11-10',
      note: 'café',
      categoryId: category.id,
      accountId: account.id,
    });
    expect(tx.id).toBeGreaterThan(0);
    expect(tx.amountCents).toBe(1250);

    const list = await listTransactions(db);
    expect(list).toHaveLength(1);
    expect(list[0]!.note).toBe('café');
  });

  it('actualiza una transacción', async () => {
    const { db, category, account } = await setup();
    const tx = await insertTransaction(db, {
      amountCents: 1000,
      type: 'expense',
      date: '2026-11-10',
      categoryId: category.id,
      accountId: account.id,
    });
    await updateTransaction(db, tx.id, { amountCents: 2000, note: 'editado' });
    const updated = await getTransaction(db, tx.id);
    expect(updated?.amountCents).toBe(2000);
    expect(updated?.note).toBe('editado');
  });

  it('elimina una transacción', async () => {
    const { db, category, account } = await setup();
    const tx = await insertTransaction(db, {
      amountCents: 500,
      type: 'expense',
      date: '2026-11-10',
      categoryId: category.id,
      accountId: account.id,
    });
    await deleteTransaction(db, tx.id);
    const list = await listTransactions(db);
    expect(list).toHaveLength(0);
  });

  it('filtra por rango de fechas', async () => {
    const { db, category, account } = await setup();
    await insertTransaction(db, { amountCents: 100, type: 'expense', date: '2026-11-05', categoryId: category.id, accountId: account.id });
    await insertTransaction(db, { amountCents: 200, type: 'expense', date: '2026-11-15', categoryId: category.id, accountId: account.id });
    await insertTransaction(db, { amountCents: 300, type: 'expense', date: '2026-11-25', categoryId: category.id, accountId: account.id });

    const mid = await listTransactions(db, { from: '2026-11-10', to: '2026-11-20' });
    expect(mid).toHaveLength(1);
    expect(mid[0]!.amountCents).toBe(200);
  });
});
