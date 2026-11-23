import {
  parseAmountToCents,
  formatCents,
  addCents,
  subtractCents,
  sumCents,
} from '../src/utils/money';
import {
  toISODate,
  startOfMonth,
  endOfMonth,
  formatDateLabel,
  groupByDay,
  groupByMonth,
  daysInMonth,
  isLeapYear,
} from '../src/utils/date';

describe('money: parseAmountToCents', () => {
  it('parsea decimales con punto', () => {
    expect(parseAmountToCents('12.50')).toBe(1250);
    expect(parseAmountToCents('12.5')).toBe(1250);
    expect(parseAmountToCents('0.01')).toBe(1);
  });

  it('parsea decimales con coma', () => {
    expect(parseAmountToCents('12,50')).toBe(1250);
    expect(parseAmountToCents('12,5')).toBe(1250);
  });

  it('parsea enteros', () => {
    expect(parseAmountToCents('12')).toBe(1200);
    expect(parseAmountToCents('0')).toBeNull();
  });

  it('parsea decimales sueltos (.5, ,5)', () => {
    expect(parseAmountToCents('.5')).toBe(50);
    expect(parseAmountToCents(',5')).toBe(50);
    expect(parseAmountToCents('0.5')).toBe(50);
  });

  it('maneja separadores de miles', () => {
    expect(parseAmountToCents('1,234.56')).toBe(123456);
    expect(parseAmountToCents('1.234,56')).toBe(123456);
    expect(parseAmountToCents('1,234')).toBe(123400);
    expect(parseAmountToCents('1.234')).toBe(123400);
  });

  it('rechaza vacío, cero, negativos y no numéricos', () => {
    expect(parseAmountToCents('')).toBeNull();
    expect(parseAmountToCents('   ')).toBeNull();
    expect(parseAmountToCents('0')).toBeNull();
    expect(parseAmountToCents('0.00')).toBeNull();
    expect(parseAmountToCents('-5')).toBeNull();
    expect(parseAmountToCents('abc')).toBeNull();
    expect(parseAmountToCents('12.')).toBeNull();
    expect(parseAmountToCents('.')).toBeNull();
    expect(parseAmountToCents(',')).toBeNull();
    expect(parseAmountToCents('1.2.3')).toBeNull();
  });

  it('ignora espacios y símbolos de moneda', () => {
    expect(parseAmountToCents('  $12.50  ')).toBe(1250);
    expect(parseAmountToCents('€1,234.56')).toBe(123456);
  });

  it('rechaza null/undefined no-string', () => {
    // @ts-expect-error
    expect(parseAmountToCents(null)).toBeNull();
    // @ts-expect-error
    expect(parseAmountToCents(undefined)).toBeNull();
  });
});

describe('money: formatCents', () => {
  it('formatea en la moneda indicada', () => {
    const out = formatCents(1250, 'USD');
    expect(out).toContain('12.50');
  });

  it('formatea cero', () => {
    const out = formatCents(0, 'EUR');
    expect(out).toContain('0');
  });
});

describe('money: aritmética en centavos', () => {
  it('suma y resta sin floats', () => {
    expect(addCents(100, 200)).toBe(300);
    expect(subtractCents(300, 100)).toBe(200);
    expect(sumCents([100, 200, 300])).toBe(600);
    expect(sumCents([])).toBe(0);
  });

  it('evita el error clásico 0.1+0.2', () => {
    // 10 centavos + 20 centavos = 30 centavos, exacto
    expect(addCents(10, 20)).toBe(30);
  });
});

describe('date: toISODate / startOfMonth / endOfMonth', () => {
  it('formatea fecha ISO', () => {
    expect(toISODate(new Date(2026, 10, 5))).toBe('2026-11-05');
    expect(toISODate(new Date(2026, 0, 1))).toBe('2026-01-01');
  });

  it('calcula inicio y fin de mes', () => {
    const d = new Date(2026, 1, 15); // febrero
    expect(toISODate(startOfMonth(d))).toBe('2026-02-01');
    expect(toISODate(endOfMonth(d))).toBe('2026-02-28');
  });

  it('fin de mes en año bisiesto (febrero)', () => {
    const d = new Date(2024, 1, 10);
    expect(toISODate(endOfMonth(d))).toBe('2024-02-29');
  });
});

describe('date: formatDateLabel', () => {
  const now = new Date(2026, 10, 12); // 12 nov 2026

  it('Hoy y Ayer', () => {
    expect(formatDateLabel('2026-11-12', now)).toBe('Hoy');
    expect(formatDateLabel('2026-11-11', now)).toBe('Ayer');
  });

  it('día del mismo año sin año', () => {
    expect(formatDateLabel('2026-11-05', now)).toBe('5 de noviembre');
  });

  it('otro año incluye el año', () => {
    expect(formatDateLabel('2025-03-10', now)).toBe('10 de marzo de 2025');
  });
});

describe('date: groupByDay / groupByMonth', () => {
  const items = [
    { date: '2026-11-10', id: 1 },
    { date: '2026-11-10', id: 2 },
    { date: '2026-11-05', id: 3 },
    { date: '2026-10-31', id: 4 },
  ];

  it('agrupa por día en orden descendente', () => {
    const groups = groupByDay(items);
    expect(groups.map((g) => g.date)).toEqual(['2026-11-10', '2026-11-05', '2026-10-31']);
    expect(groups[0]!.items).toHaveLength(2);
  });

  it('agrupa por mes en orden descendente', () => {
    const groups = groupByMonth(items);
    expect(groups.map((g) => g.month)).toEqual(['2026-11', '2026-10']);
    expect(groups[0]!.items).toHaveLength(3);
  });

  it('lista vacía devuelve array vacío', () => {
    expect(groupByDay([])).toEqual([]);
    expect(groupByMonth([])).toEqual([]);
  });
});

describe('date: helpers', () => {
  it('daysInMonth', () => {
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2026, 1)).toBe(31);
  });

  it('isLeapYear', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
  });
});
