# ADR-0001: Arquitectura local-first

- **Estado**: aceptada
- **Fecha**: 2026-11-10

## Contexto

La app maneja datos financieros sensibles. Se quiere que cualquier persona pueda usarla y, a futuro, registrarse para sincronizar datos entre dispositivos. Pero el MVP no necesita cuentas, y la privacidad y el coste cero de infraestructura pesan más que la sincronización inmediata.

## Decisión

1. El MVP funciona **100% local** con SQLite en el dispositivo. Ninguna funcionalidad esencial requiere red, cuenta o servidor.
2. En la fase **M4** se añadirá registro de usuario **opcional** y sincronización cifrada de extremo a extremo (E2E) entre dispositivos.
3. El servidor de sincronización **nunca** podrá leer los datos en claro: el cifrado ocurre en el dispositivo del usuario.
4. La app sin cuenta seguirá siendo 100% funcional para siempre; la sincronización es un añadido, no un requisito.

## Consecuencias

- ✅ Privacidad por defecto, funcionamiento offline total, cero coste de infraestructura en el MVP.
- ✅ La app sigue siendo útil aunque M4 nunca llegue.
- ⚠️ La sincronización multi-dispositivo queda aplazada y será compleja (cifrado, resolución de conflictos).
- ⚠️ El respaldo de datos depende del usuario hasta los backups automáticos de M5.

## Detalles técnicos pendientes (fase M4)

La tecnología del backend, el esquema de cifrado y el protocolo de sincronización se decidirán en el spike correspondiente de M4. Nada de esto está decidido aún y es deliberado.
