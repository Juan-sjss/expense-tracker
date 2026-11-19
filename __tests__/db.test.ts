import * as schema from '../src/db/schema';
import { SEED_CATEGORIES, DEFAULT_ACCOUNT_NAME } from '../src/db/seed';
import { CREATE_TABLES_SQL } from '../src/db/sql';
import * as queries from '../src/db/queries';

describe('Database schema & seed (logica pura)', () => {
  it('define las tres tablas del MVP', () => {
    expect(schema.accounts).toBeDefined();
    expect(schema.categories).toBeDefined();
    expect(schema.transactions).toBeDefined();
  });

  it('siembra 19 categorias: 16 de gasto + 3 de ingreso', () => {
    expect(SEED_CATEGORIES).toHaveLength(19);
    expect(SEED_CATEGORIES.filter((c) => c.kind === 'expense')).toHaveLength(16);
    expect(SEED_CATEGORIES.filter((c) => c.kind === 'income')).toHaveLength(3);
    expect(SEED_CATEGORIES.every((c) => c.name.length > 0 && c.icon.length > 0)).toBe(true);
  });

  it('la cuenta por defecto se llama "General"', () => {
    expect(DEFAULT_ACCOUNT_NAME).toBe('General');
  });

  it('el SQL de creacion de tablas incluye las 3 tablas', () => {
    expect(CREATE_TABLES_SQL).toContain('CREATE TABLE IF NOT EXISTS accounts');
    expect(CREATE_TABLES_SQL).toContain('CREATE TABLE IF NOT EXISTS categories');
    expect(CREATE_TABLES_SQL).toContain('CREATE TABLE IF NOT EXISTS transactions');
  });

  it('exporta las funciones de consulta esperadas', () => {
    expect(typeof queries.insertTransaction).toBe('function');
    expect(typeof queries.listTransactions).toBe('function');
    expect(typeof queries.updateTransaction).toBe('function');
    expect(typeof queries.deleteTransaction).toBe('function');
    expect(typeof queries.listCategories).toBe('function');
    expect(typeof queries.listAccounts).toBe('function');
  });
});
