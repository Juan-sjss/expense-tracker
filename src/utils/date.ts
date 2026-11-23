/**
 * Utilidades de fechas para agrupar y formatear transacciones.
 */

export interface Dated {
  date: string; // YYYY-MM-DD
}

const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseISO(dateStr: string): Date {
  const parts = dateStr.split('-');
  const y = Number(parts[0] ?? 0);
  const m = Number(parts[1] ?? 1);
  const d = Number(parts[2] ?? 1);
  return new Date(y, m - 1, d);
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function formatDateLabel(dateStr: string, now: Date = new Date()): string {
  const today = toISODate(now);
  const yesterdayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yesterday = toISODate(yesterdayDate);

  if (dateStr === today) return 'Hoy';
  if (dateStr === yesterday) return 'Ayer';

  const d = parseISO(dateStr);
  const day = d.getDate();
  const month = MONTHS_ES[d.getMonth()] ?? '';
  if (d.getFullYear() === now.getFullYear()) {
    return `${day} de ${month}`;
  }
  return `${day} de ${month} de ${d.getFullYear()}`;
}

export function groupByDay<T extends Dated>(
  items: T[],
): { date: string; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const list = map.get(item.date);
    if (list) {
      list.push(item);
    } else {
      map.set(item.date, [item]);
    }
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a > b ? -1 : a < b ? 1 : 0))
    .map(([date, its]) => ({ date, items: its }));
}

export function groupByMonth<T extends Dated>(
  items: T[],
): { month: string; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const month = item.date.slice(0, 7);
    const list = map.get(month);
    if (list) {
      list.push(item);
    } else {
      map.set(month, [item]);
    }
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a > b ? -1 : a < b ? 1 : 0))
    .map(([month, its]) => ({ month, items: its }));
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
