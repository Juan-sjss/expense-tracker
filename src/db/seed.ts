import { accounts, categories } from './schema';
import type { Db } from './client';

export interface SeedCategory {
  name: string;
  icon: string;
  kind: 'expense' | 'income';
}

export const SEED_CATEGORIES: SeedCategory[] = [
  // Gastos
  { name: 'Comida y supermercado', icon: '🛒', kind: 'expense' },
  { name: 'Restaurantes', icon: '🍽️', kind: 'expense' },
  { name: 'Transporte', icon: '🚗', kind: 'expense' },
  { name: 'Hogar y alquiler', icon: '🏠', kind: 'expense' },
  { name: 'Servicios (luz, agua, internet)', icon: '💡', kind: 'expense' },
  { name: 'Teléfono', icon: '📱', kind: 'expense' },
  { name: 'Salud', icon: '🏥', kind: 'expense' },
  { name: 'Farmacia', icon: '💊', kind: 'expense' },
  { name: 'Ocio', icon: '🎮', kind: 'expense' },
  { name: 'Suscripciones', icon: '📺', kind: 'expense' },
  { name: 'Ropa', icon: '👕', kind: 'expense' },
  { name: 'Educación', icon: '📚', kind: 'expense' },
  { name: 'Regalos', icon: '🎁', kind: 'expense' },
  { name: 'Viajes', icon: '✈️', kind: 'expense' },
  { name: 'Mascotas', icon: '🐾', kind: 'expense' },
  { name: 'Otros gastos', icon: '💸', kind: 'expense' },
  // Ingresos
  { name: 'Salario', icon: '💰', kind: 'income' },
  { name: 'Ventas', icon: '💵', kind: 'income' },
  { name: 'Otros ingresos', icon: '💳', kind: 'income' },
];

export const DEFAULT_ACCOUNT_NAME = 'General';

export async function seedDatabase(db: Db): Promise<void> {
  const existingAccounts = await db.select().from(accounts);
  if (existingAccounts.length === 0) {
    await db.insert(accounts).values({
      name: DEFAULT_ACCOUNT_NAME,
      type: 'cash',
      isDefault: true,
    });
  }

  const existingCategories = await db.select().from(categories);
  if (existingCategories.length === 0) {
    await db.insert(categories).values(
      SEED_CATEGORIES.map((c) => ({
        name: c.name,
        icon: c.icon,
        kind: c.kind,
        isSeed: true,
      })),
    );
  }
}
