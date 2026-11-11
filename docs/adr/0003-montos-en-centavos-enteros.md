# ADR-0003: Montos en centavos enteros

- **Estado**: aceptada
- **Fecha**: 2026-11-10

## Contexto

La aritmética de punto flotante (IEEE 754) no representa la mayoría de los decimales exactamente: `0.1 + 0.2 === 0.30000000000000004`. Una app de dinero que sume con floats acumula errores de redondeo invisibles que rompen saldos, presupuestos y totales.

## Decisión

1. Todo monto se almacena y opera como **entero en centavos** (`amount_cents`, tipo INTEGER de SQLite).
2. La conversión texto ↔ centavos ocurre **solo en los bordes** (input del usuario y formateo de UI), con funciones puras en `src/utils/money.ts`.
3. El formateo al usuario usa `Intl.NumberFormat` con la moneda configurada.
4. Ninguna lógica de negocio (sumas, presupuestos, saldos) toca floats.
5. `src/utils/money.ts` exige cobertura de tests ≥ 90%.

## Consecuencias

- ✅ Aritmética monetaria exacta y testeada de forma determinista.
- ✅ Comparaciones e igualdad entre montos fiables (`===` funciona).
- ⚠️ El parseo del input del usuario debe ser cuidadoso (separadores decimales `,`/`.`, montos parciales como `12.5`) y está cubierto por tests.
- ℹ️ El rango de SQLite INTEGER (64 bits) es de sobra para finanzas personales.
