import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { transactions, categories, accounts } from './schema';
import type { Db } from './client';
import type { NewTransaction, Transaction, NewCategory, Category, NewAccount, Account } from './schema';

export async function insertTransaction(db: Db, data: NewTransaction): Promise<Transaction> {
  const rows = await db.insert(transactions).values(data).returning();
  return rows[0]!;
}

export async function getTransaction(db: Db, id: number): Promise<Transaction | undefined> {
  const rows = await db.select().from(transactions).where(eq(transactions.id, id));
  return rows[0];
}

export async function listTransactions(
  db: Db,
  filters?: { from?: string; to?: string; categoryId?: number; accountId?: number },
): Promise<Transaction[]> {
  const conditions = [];
  if (filters?.from) conditions.push(gte(transactions.date, filters.from));
  if (filters?.to) conditions.push(lte(transactions.date, filters.to));
  if (filters?.categoryId) conditions.push(eq(transactions.categoryId, filters.categoryId));
  if (filters?.accountId) conditions.push(eq(transactions.accountId, filters.accountId));

  const base = db.select().from(transactions);
  const query = conditions.length > 0 ? base.where(and(...conditions)) : base;
  return query.orderBy(desc(transactions.date), desc(transactions.id));
}

export async function updateTransaction(
  db: Db,
  id: number,
  data: Partial<Omit<NewTransaction, 'id'>>,
): Promise<void> {
  await db
    .update(transactions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(transactions.id, id));
}

export async function deleteTransaction(db: Db, id: number): Promise<void> {
  await db.delete(transactions).where(eq(transactions.id, id));
}

export async function listCategories(db: Db, kind?: 'expense' | 'income'): Promise<Category[]> {
  if (kind) {
    return db.select().from(categories).where(eq(categories.kind, kind));
  }
  return db.select().from(categories);
}

export async function insertCategory(db: Db, data: NewCategory): Promise<Category> {
  const rows = await db.insert(categories).values(data).returning();
  return rows[0]!;
}

export async function hideCategory(db: Db, id: number): Promise<void> {
  await db.update(categories).set({ isHidden: true }).where(eq(categories.id, id));
}

export async function listAccounts(db: Db): Promise<Account[]> {
  return db.select().from(accounts);
}

export async function insertAccount(db: Db, data: NewAccount): Promise<Account> {
  const rows = await db.insert(accounts).values(data).returning();
  return rows[0]!;
}

export { transactions, categories, accounts };
export type { Transaction, NewTransaction, Category, NewCategory, Account, NewAccount };
