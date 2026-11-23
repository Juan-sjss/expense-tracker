/**
 * Utilidades de dinero. Todos los montos se manejan como **enteros en centavos**
 * (ADR-0003): jamás se usa punto flotante en la lógica de negocio.
 */

export function parseAmountToCents(input: string): number | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (trimmed === '') return null;

  // Quitar símbolos de moneda y espacios, conservar dígitos, separadores y signo
  let s = trimmed.replace(/[^\d.,+-]/g, '');
  if (s === '') return null;

  // Rechazar negativos explícitamente
  if (s.includes('-')) return null;
  // Quitar signo positivo suelto
  s = s.replace(/^\+/, '');

  if (s === '' || s === '.' || s === ',') return null;

  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');

  let decimalSep: ',' | '.' | null = null;
  if (lastComma !== -1 && lastDot !== -1) {
    decimalSep = lastComma > lastDot ? ',' : '.';
  } else if (lastComma !== -1) {
    const after = s.length - lastComma - 1;
    if (after > 0 && after <= 2) decimalSep = ',';
  } else if (lastDot !== -1) {
    const after = s.length - lastDot - 1;
    if (after > 0 && after <= 2) decimalSep = '.';
  }

  if (decimalSep === ',') {
    s = s.replace(/\./g, '');
    s = s.replace(',', '.');
  } else if (decimalSep === '.') {
    s = s.replace(/,/g, '');
  } else {
    // Sin separador decimal: eliminar solo separadores de miles (seguidos de 3 dígitos)
    s = s.replace(/([.,])(?=\d{3}(?:[.,]|$))/g, '');
  }

  // Permitir decimales sueltos como .5 o ,5
  if (s.startsWith('.')) s = `0${s}`;
  if (s === '' || s === '.') return null;
  if (!/^\d+(\.\d+)?$/.test(s)) return null;

  const num = Number(s);
  if (!Number.isFinite(num) || num <= 0) return null;

  const cents = Math.round(num * 100);
  if (cents <= 0) return null;
  return cents;
}

export function formatCents(cents: number, currency: string): string {
  const value = cents / 100;
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(value);
}

export function addCents(a: number, b: number): number {
  return a + b;
}

export function subtractCents(a: number, b: number): number {
  return a - b;
}

export function sumCents(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}
