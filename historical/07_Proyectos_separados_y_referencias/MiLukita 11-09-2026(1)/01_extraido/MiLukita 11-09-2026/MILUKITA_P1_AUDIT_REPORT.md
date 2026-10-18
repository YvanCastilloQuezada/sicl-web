# MiLukita — Orden P1: auditoría, Watchdog y recuperación E2E

**Estado:** implementación y validación local; staging y dispositivos físicos no certificados.

## Principios conservados

MJP CORE continúa siendo la autoridad de resultados. El sistema mantiene `virtualOnly: true`; no se modificaron RNG, RTP, rulesets, wallet, créditos, settlement ni `MjpTvManifest`. Watchdog permanece `ALERT_ONLY` y Auditor permanece `READ_ONLY`. Ningún componente de esta orden ejecuta correcciones automáticas.

## Entregables

| Área | Estado | Evidencia |
|---|---|---|
| Contrato común de health | IMPLEMENTADO | `shared/health.ts` |
| Auditor PASS/WARN/FAIL | IMPLEMENTADO Y PROBADO | `server/auditor/AuditorAgent.ts` y prueba asociada |
| Política NO DATA → NO CLAIM | IMPLEMENTADA Y PROBADA | Caso `NO_DATA` con mensaje “No hay detalles adicionales disponibles.” |
| Kill Switch / STOPPED | PROBADO EN LÓGICA | `server/p1HealthRecovery.test.ts` |
| Recovery conserva eventId y autoridad | PROBADO EN LÓGICA | `server/p1HealthRecovery.test.ts` |
| Doble claim lógico | PROBADO | `server/scheduler/dualInstanceSimulation.test.ts` |
| Dos procesos contra MySQL/TiDB compartido | NO VERIFICADO | Requiere staging desplegado |
| Heartbeat persistente y Kill Switch operativo | PREPARADO, NO ACTIVADO | Runbook de staging |
| QA físico | NO VERIFICABLE | Requiere hardware real |

## Resultado de pruebas

La suite focalizada de la Orden P1 pasó **9 pruebas**: cuatro del Auditor, cuatro de salud/recuperación y una de doble instancia. La prueba de doble claim produjo un único claim adquirido, una única clave de idempotencia y un único registro en el almacenamiento compartido del harness.

La regresión anterior del proyecto también fue ejecutada: `pnpm check` y `pnpm build` pasan; la suite general se mantiene aprobada según el último checkpoint. El build conserva advertencias no bloqueantes sobre un asset runtime y chunks grandes.

## Cadena E2E validada localmente

La secuencia cubierta es `HEALTHY → STOPPED/NETWORK FAILURE → DISCONNECTED → WATCHDOG ALERT_ONLY → MAINTENANCE UI → /estado-sistema → RECOVERING → AUDITOR PASS → LIVE`. La prueba confirma que no se cambia el eventId, no se autoriza una mutación del resultado y no se reanuda automáticamente un estado STOPPED.

## Próxima validación requerida

La evidencia local no debe presentarse como certificación productiva. El cierre de staging requiere publicar primero el proyecto, crear una tarea Heartbeat persistente, comprobar logs de Watchdog y ejecutar dos procesos reales contra la misma base. El QA físico requiere la matriz de `docs/MILUKITA_STAGING_QA_RUNBOOK.md`.


## Decisión del propietario — pausa operativa

A pedido del propietario, quedan **PAUSADAS** la activación persistente de Heartbeat/Watchdog en staging y la certificación de dos procesos reales contra una base compartida. No se ejecutará publicación, activación de tareas ni prueba operativa externa hasta recibir una nueva autorización explícita. El harness local de doble claim permanece disponible como evidencia preliminar y no se considera certificación productiva.

El resto de la Orden P1 —contrato de health, Auditor READ_ONLY, Watchdog ALERT_ONLY, recuperación lógica, Kill Switch lógico, caso de información inexistente, política `NO DATA → NO CLAIM`, documentación y regresión local— queda cerrado en el alcance permitido.
