# ADR-0002: Android únicamente

- **Estado**: aceptada
- **Fecha**: 2026-11-10

## Contexto

El desarrollo se realiza en Windows, donde **no es posible compilar iOS** (Xcode solo existe en macOS). El público objetivo es hispanohablante y Android cubre la práctica totalidad de las necesidades del usuario principal.

## Decisión

La app es **solo Android**, tanto en el MVP como en el roadmap completo. No hay planes de iOS: no se dedicará esfuerzo a mantener compatibilidad, pipelines ni distribuciones para Apple.

## Consecuencias

- ✅ Foco total en una plataforma: menos fricción, CI más simple, sin necesidad de Mac ni cuenta de desarrollador de Apple.
- ✅ Distribución más simple: APK beta + Google Play.
- ⚠️ Sin presencia en App Store ni en iPad/iPhone.
- ℹ️ React Native mantiene la puerta abierta a iOS si algún día cambia la decisión, pero eso **no es un objetivo** de este proyecto y no se asume en ninguna fase.
