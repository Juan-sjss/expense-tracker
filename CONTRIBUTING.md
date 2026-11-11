# 🤝 Guía de contribución

Gracias por contribuir a Expense Tracker. Estas son las reglas del juego.

## 🐛 Reportar un bug

Abre un issue con la plantilla **Reporte de bug** e incluye: pasos para reproducir, comportamiento esperado y tu entorno (modelo de teléfono y versión de Android).

## 💡 Proponer una funcionalidad

Abre un issue con la plantilla **Propuesta de funcionalidad**. Antes de picar código para una funcionalidad grande, discútelo primero en el issue.

## 🛠️ Entorno de desarrollo

Consulta los [requisitos previos y la instalación](README.md#-requisitos-previos) del README. En resumen: Node 20, JDK 17, Android Studio y `npm install`.

## 🌿 Flujo de trabajo

1. Elige un issue (los `good first issue` son buen primer contacto), asígnatelo y coméntalo.
2. Crea una rama desde `main`: `feat/nombre-corto`, `fix/nombre-corto`, `docs/nombre-corto`…
3. Haz commits siguiendo [commits convencionales](#-commits-convencionales).
4. Abre un **pull request** hacia `main` (la rama está protegida: solo se aceptan cambios vía PR).
5. El PR debe pasar **CI** (lint + typecheck + tests) y el checklist de la plantilla.
6. Enlaza el issue con `Closes #N` y asigna el milestone correcto.

## 📝 Commits convencionales

Formato: `tipo(ámbito opcional): descripción en imperativo y minúsculas`

```
feat(transactions): add swipe-to-delete
fix(summary): wrong monthly balance on month change
docs(readme): update installation steps
```

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Solo documentación |
| `refactor` | Cambio que no altera comportamiento |
| `test` | Añadir o corregir tests |
| `chore` | Mantenimiento (dependencias, config…) |
| `ci` | Pipelines de CI |

## 🧪 Reglas de tests

- **Obligatorio**: todo cambio en `src/utils/money.ts` o `src/utils/date.ts` debe venir con tests.
- La cobertura de esos módulos debe mantenerse ≥ 90%.
- Las pantallas nuevas incluyen al menos un test de render con React Native Testing Library.
- CI bloquea el PR si algo falla.

## 🏷️ Labels y milestones

- **M1–M5**: fases del roadmap (ver el [roadmap](README.md#️-roadmap)).
- `future`: planeado para una fase futura, no se pica todavía.
- `good first issue`: buen primer contacto con el repo.
- `spike`: investigación/diseño previo a implementar.
