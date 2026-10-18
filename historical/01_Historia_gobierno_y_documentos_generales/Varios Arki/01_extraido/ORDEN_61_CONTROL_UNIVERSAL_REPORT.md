# ORDEN 61 — MiLukita Control API + Control Universal + LUKA TV Receiver

**Estado:** IMPLEMENTACIÓN BACKEND COMPLETADA EN SANDBOX; PRUEBA FÍSICA EXTERNA PENDIENTE.  
**Frontend modified:** NO.  
**MJP CORE modified:** NO.

## A. Código creado

Se crearon `shared/controlApi.ts`, `server/controlApi.ts`, `server/controlAdapters.ts` y `shared/controlApi.test.ts`. Se extendió `server/routers.ts` con el router protegido `controlApi` y se extendió `server/realtime/websocketServer.ts` con el canal `/control-receiver`.

Se añadieron `drizzle/0052_uneven_nextwave.sql`, `drizzle/0053_naive_black_bolt.sql` y sus snapshots. La primera migración crea las tablas de Control API; la segunda añade el hash del token limitado del receiver.

## B. Código reutilizado

Se reutilizaron `getDb`, `appendOperationalEvent`, `protectedProcedure`, la autenticación existente, los limitadores HTTP existentes, `ws`, el servidor realtime existente y la cadena de auditoría operacional. No se creó una segunda infraestructura de autenticación ni una segunda cadena de auditoría.

## C. API real implementada

El router `controlApi` expone `capabilities`, `commandTypes`, `adapterKinds`, `adapters`, `registerDevice`, `getDevice`, `createPairing`, `approvePairing`, `sendCommand`, `acknowledgeCommand` y `revokeSession`. Todos los procedimientos mutantes y de lectura de dispositivos requieren sesión protegida.

La API valida ownership, no concede Human Authority, no reutiliza endpoints de MJP y bloquea comandos sin capability declarada.

## D. Persistencia

Se crearon cuatro tablas nuevas: `control_devices`, `control_pairing_sessions`, `control_sessions` y `control_commands`. La migración fue aplicada correctamente mediante la herramienta de base de datos. No se modificaron tablas de juegos, resultados, wallet, ledger, settlement, reglas ni sorteos.

## E. WebSocket

Se añadió `/control-receiver` al servidor WebSocket existente. El protocolo implementa `RECEIVER_AUTH`, `RECEIVER_READY`, `RECEIVER_PING`, `RECEIVER_PONG`, `RECEIVER_ACK`, `RECEIVER_ACK_ACCEPTED` y `RECEIVER_ERROR`.

La sesión se autentica mediante `receiverTokenHash`. El heartbeat actualiza la actividad. El ACK se valida contra la sesión y el dispositivo y persiste `RECEIVED`, `EXECUTED` o `FAILED`. El servidor no registra `EXECUTED` únicamente porque el comando fue encolado.

## F. LUKA TV Receiver

Está implementado el contrato backend, el registro de receiver, el pairing, la sesión, el token limitado, el heartbeat y los ACKs. No se construyó interfaz visual ni se afirmó control físico del sistema operativo, HDMI, volumen, canales o power del TV.

## G. Adapters

`LUKA_RECEIVER` está declarado como `SUPPORTED` e implementado a nivel de protocolo. `CAST` y `DLNA` están en `PREPARED` y requieren soporte externo y pruebas físicas. `AIRPLAY` y `VENDOR` están en `EXTERNAL_REQUIRED`. No se simuló compatibilidad universal.

## H. Seguridad

Se implementaron o conservaron ownership, protección contra IDOR, expiración de pairing y sesiones, revocación, deduplicación `(sessionId, requestId)`, capability negotiation, token de receiver limitado y auditoría sin secretos. Las pruebas previas de ORDEN-001 siguen PASS, incluyendo JWT expirado, JWT malformado y firma manipulada.

## I. Audit

La integración emite `DEVICE_REGISTERED`, `PAIR_REQUESTED`, `PAIR_APPROVED`, `SESSION_CREATED`, `COMMAND_SENT`, `COMMAND_RECEIVED`, `COMMAND_EXECUTED`, `COMMAND_FAILED`, `SESSION_REVOKED` y `DEVICE_REVOKED`. Los tokens se redactan y los payloads declaran `coreAccess: NONE`.

## J. Tests

La suite completa terminó con:

| Resultado | Cantidad |
|---|---:|
| Test files PASS | 155 |
| Test files SKIPPED | 1 |
| Tests PASS | 563 |
| Tests SKIPPED | 4 |
| Tests FAIL | 0 |
| TypeScript | PASS |
| Build | PASS |

El build produjo `dist/index.js` y finalizó correctamente. Las pruebas focalizadas de Control API, ORDEN-001, cabeceras y request metadata también terminaron PASS.

## K. Frontend

**FRONTEND MODIFIED = NO.** No se modificaron `*.tsx`, `*.jsx`, CSS, páginas, layouts, Controller Lab visual, TouchRemotePage, QR Studio, LUKA AR, Mapper, The Eye, Portal ni Field Gate.

## L. MJP CORE

**MJP CORE MODIFIED = NO.** No se modificaron RNG, RTP, resultados, wallet, ledger, settlement, juegos, reglas, sorteos ni autoridad del núcleo. La persistencia de Control API no tiene foreign keys hacia esas áreas. La prueba de aislamiento de contratos confirma que los límites de MJP CORE no son capabilities ejecutables por Control API.

## M. Limitaciones y external required

La operación física con televisores reales todavía requiere pruebas externas. También requieren validación externa los adapters Cast, DLNA, AirPlay y Vendor. El sandbox no demuestra compatibilidad universal, control de volumen físico, canales, HDMI, power o funcionamiento LAN/Cloud en todos los fabricantes.

La orden no creó una nueva superficie visual y no corrigió el error histórico de Vite en `TerritorialTrustPage.tsx`, porque esa corrección habría violado el alcance explícito de ORDEN 61.

## Estado final

ORDEN 61 queda técnicamente implementada en su columna vertebral backend, con persistencia, pairing, sesiones, protocolo de comandos, WebSocket, ACKs, adapters declarativos, auditoría, seguridad y pruebas. Queda pendiente una validación física posterior y una orden frontend separada para la interfaz visual del receiver.
