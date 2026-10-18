# Protocolo de concurrencia de cierre — staging

**Estado actual:** preparado; ejecución contra staging bloqueada por falta de `STAGING_DATABASE_URL` explícita.

## Objetivo

Comprobar que dos workers que intentan cerrar la misma ronda producen un único resultado, una única liquidación por ticket y una única cadena de auditoría, sin afectar la base del piloto.

## Guardas obligatorias

El runner solo continúa cuando existe `STAGING_DATABASE_URL`, `ALLOW_STAGING_DB_TEST=1` y la URL no coincide con `DATABASE_URL`. Si no se cumplen las condiciones, genera `audit-package/staging-concurrency-report.json` con estado `BLOCKED` y no ejecuta consultas. El fixture usa un `publicId` con prefijo `STG-CONC-` y se elimina en `finally`.

## Ejecución

```bash
cd /home/ubuntu/ruleta-peru-online
STAGING_DATABASE_URL='mysql://usuario:clave@host/base_staging' \
ALLOW_STAGING_DB_TEST=1 \
CONCURRENCY_REPORT_PATH=audit-package/staging-concurrency-report.json \
pnpm tsx scripts/run-concurrency-staging.mjs
```

La URL debe pertenecer a una base aislada de staging y nunca a producción ni al entorno del piloto. No se deben copiar datos personales o saldos de usuarios reales.

## Escenario

El runner localiza el ruleset más reciente de `ruleta`, crea una ronda `locked` con semilla aleatoria de fixture y lanza dos llamadas concurrentes a `closeAndDrawRound`. Mide duración total, cantidad de promesas cumplidas/rechazadas, estado final y evidencia devuelta. Luego elimina la ronda fixture.

## Criterios de aceptación

| Control | PASS cuando |
| --- | --- |
| Concurrencia | Dos workers terminan sin error no controlado |
| Estado | La ronda termina en `settled` |
| Idempotencia | Ambas respuestas refieren la misma evidencia de cierre |
| Movimientos | No hay movimientos virtuales duplicados por ticket |
| Auditoría | Existe un evento de cierre consistente con el hash de resultado |
| Rendimiento | Se registran p50/p95/p99 en una corrida de al menos 30 repeticiones |
| Recuperación | Deadlock/timeout controlado, rollback y reintento documentados |

La versión actual ejecuta una carrera doble de validación funcional. No afirma rendimiento p95 ni resistencia a carga hasta disponer de staging y una corrida repetida con métricas.

## Estado de la ejecución en este proyecto

La ejecución sin `STAGING_DATABASE_URL` produjo:

```json
{"status":"BLOCKED","reason":"STAGING_DATABASE_URL no está configurada; no se ejecutó ninguna consulta."}
```

Esta salida es intencional y evita tocar `DATABASE_URL` del piloto. Para activar el ensayo se requiere que el propietario o infraestructura proporcione una URL de staging segura mediante el mecanismo de secretos del proyecto.
