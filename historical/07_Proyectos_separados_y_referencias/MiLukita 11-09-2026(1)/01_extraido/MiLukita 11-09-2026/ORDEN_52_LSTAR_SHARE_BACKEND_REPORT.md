# Orden 52 — reporte técnico L★/QR backend-only

## Alcance ejecutado

Se implementó el contrato compartido `shared/lukaShare.ts`, el servicio server-side `server/lukaShare.ts`, la persistencia Drizzle de `ShareTarget` y `ShareSession`, y procedimientos tRPC bajo `share.*`. El trabajo no modifica componentes frontend, rutas visuales ni el generador actual; deja preparada una superficie API para una integración posterior.

## Capacidades

El servicio soporta targets públicos, destinos contextuales, sesiones opacas con TTL limitado, expiración, revocación, ownership por usuario, capability gates, prioridad determinista, auditoría operacional y rechazo explícito de rutas protegidas de MJP CORE. Los destinos aceptados son rutas internas seguras; no se aceptan URLs externas, traversal, rutas de API ni marcadores de wallet, RNG, rules, settlement o core.

## API

| Procedimiento | Acceso | Función |
|---|---|---|
| `share.resolve` | Público | Resuelve un `publicId` y, cuando aplica, un token de sesión opaco. |
| `share.listMine` | Usuario autenticado | Lista targets cuyo owner es el usuario actual. |
| `share.createTarget` | Usuario autenticado | Crea un target sujeto a validación de destino y capability. |
| `share.createSession` | Usuario autenticado | Crea una sesión temporal asociada a un target propio. |
| `share.revokeTarget` | Usuario autenticado | Revoca únicamente un target propio. |

## Persistencia

La migración `drizzle/0046_steady_ben_grimm.sql` crea `share_targets` y `share_sessions` con identificadores públicos separados de IDs internos, índices de resolución y expiración, estado de revocación, ownership, capability, prioridad y timestamps.

## Validación

Las pruebas focalizadas cubren normalización, prioridades, TTL, expiración, traversal, rutas protegidas, marcadores MJP CORE, validación de IDs y límites de sesión. Resultado: **9 pruebas PASS** en `shared/lukaShare.test.ts` y `server/lukaShare.test.ts`. TypeScript PASS. La suite completa y build fueron ejecutados previamente sin cambios frontend en esta orden.

## Límites

La integración UI del QR Studio, L★, deep links, resolución visual de destinos, Web Share, escaneo físico y experiencia AR queda deliberadamente pendiente para una orden frontend posterior. No se modifica MJP CORE ni se concede autoridad sobre RNG, wallet, reglas, settlement, manifest o resultados oficiales.
