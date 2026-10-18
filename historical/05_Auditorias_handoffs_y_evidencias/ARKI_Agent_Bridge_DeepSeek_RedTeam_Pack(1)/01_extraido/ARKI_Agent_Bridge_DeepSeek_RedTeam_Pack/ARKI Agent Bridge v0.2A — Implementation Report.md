# ARKI Agent Bridge v0.2A — Implementation Report

**Orden:** `AB-V02A-IMPLEMENT-001`  
**Resultado:** implementación autorizada de fases 0–4 completada  
**Fecha:** 2026-09-25

## VERSION:

`0.2.0-alpha.1` — v0.2A.

## FILES CREATED:

- `README.md`
- `package.json`
- `migrations/001_initial.sql`
- `src/store.mjs`
- `src/state-machine.mjs`
- `src/policy.mjs`
- `src/schemas.mjs`
- `src/security.mjs`
- `src/manus.mjs`
- `src/orchestrator.mjs`
- `src/fake-openai.mjs`
- `src/server.mjs`
- `tests/policy-state.test.mjs`
- `tests/store.test.mjs`
- `tests/security.test.mjs`
- `tests/manus-orchestrator.test.mjs`
- `tests/server.test.mjs`
- `tests/requirements.test.mjs`
- `tests/no-touch.test.mjs`

## FILES MODIFIED:

Ninguno fuera del directorio aislado `bridge-v0.2a/`. No se modificó ARKI, el ZIP de v0.1 ni la especificación aprobada.

## DATABASE:

SQLite durable mediante `node:sqlite`, con WAL y foreign keys. Se implementaron tablas para decisiones, tareas, eventos, mensajes, transiciones, escalaciones, audit log e idempotencia. La migración crea nueve tablas incluyendo `schema_migrations`.

## MIGRATIONS:

`migrations/001_initial.sql` implementada y ejecutada en pruebas sobre bases nuevas y existentes. Se verificó recuperación después de cerrar y reabrir SQLite.

## STATE MACHINE:

Implementados los estados `CREATED`, `AUTHORIZED`, `DISPATCHED`, `RUNNING`, `WAITING_EXTERNAL`, `RESULT_RECEIVED`, `REVIEW_REQUIRED`, `CORRECTION_REQUIRED`, `HUMAN_DECISION_REQUIRED`, `COMPLETED`, `FAILED` y `CANCELLED`. Las transiciones ilegales son rechazadas.

## POLICY ENGINE:

Implementadas las clases `AUTO_ALLOWED`, `REVIEW_ALLOWED`, `HUMAN_REQUIRED` y `PROHIBITED`, con escalamiento para categorías materiales y cambios de scope.

## GATEWAY SECURITY:

Gateway privado autenticado mediante `BRIDGE_INTERNAL_SECRET`, con validación de schemas, límite de cuerpo de 128 KiB, límite de mensajes de 16 KiB, idempotency keys y errores públicos estructurados. Sin autenticación, el Gateway responde rechazo.

## WEBHOOK SECURITY:

Implementado fail-closed. Ausencia de clave pública, firma inválida, timestamp expirado, URL no HTTPS o URL canónica inválida producen rechazo. La firma se verifica mediante RSA-SHA256 sobre `{timestamp}.{canonical_url}.{sha256_hex(body)}`.

## IDEMPOTENCY:

Implementada persistencia SQLite de `idempotency_keys`, conflictos por reutilización con payload diferente y deduplicación de webhooks por `external_event_id` o hash de payload. Los eventos duplicados no producen un segundo efecto material.

## MANUS ADAPTER:

Implementados `task.create`, `task.sendMessage`, `task.detail`, `task.listMessages`, `webhook.create` y `webhook.publicKey`, junto con timeout, retries acotados, backoff exponencial, manejo de 429/5xx y paginación por cursor.

## ORCHESTRATOR:

Implementada la correlación `decision_id ↔ task_id ↔ event_id ↔ correlation_id`, creación y autorización de decisiones, dispatch, reconciliación Manus, persistencia de mensajes, transiciones y recuperación desde SQLite. `stopped` no se trata automáticamente como final cuando los trabajos de fondo están activos o desconocidos.

## FAKE OPENAI ADAPTER:

Implementado únicamente para contratos y pruebas. No contiene cliente real, runtime real, modelo ni llamada OpenAI.

## AUDIT LOG:

Implementado audit log append-only a nivel de aplicación. Registra actores, acciones, objetos, decisiones, hashes, correlaciones y transiciones. La redacción evita almacenar valores de API keys, tokens, autorizaciones, secretos, cookies o contraseñas.

## TESTS:

`npm test` pasó:

```text
ℹ tests 16
ℹ pass 16
ℹ fail 0
```

También pasó `node --check` para todos los módulos fuente y tests.

## SECURITY TESTS:

Pasaron las pruebas de autenticación ausente/inválida, fail-closed sin public key, firma válida, firma inválida, timestamp expirado, URL no canónica, límite de payload, redacción de secretos, replay y deduplicación.

## RESTART RECOVERY:

PASS. La suite cierra y reabre SQLite y verifica que decisiones, tareas, audit log e idempotency keys se conservan.

## ARKI NO-TOUCH:

PASS. La prueba de frontera no encuentra rutas de producto ARKI ni operaciones de mutación ARKI en el código del Bridge. La implementación está físicamente contenida en `bridge-v0.2a/`.

## REAL MANUS CALLS:

`0`. Se utilizaron únicamente fakes. No se registró webhook real y no se ejecutó ninguna tarea Manus real.

## REAL OPENAI CALLS:

`0`. Solo se utilizó `FakeOpenAIAdapter` en pruebas de contrato.

## CREDENTIALS USED:

Ninguna. No se solicitaron, leyeron ni expusieron credenciales. Las pruebas usan secretos sintéticos y claves RSA efímeras generadas dentro del proceso de test.

## BLOCKERS:

No hay bloqueadores para el alcance v0.2A autorizado. La API `node:sqlite` emite una advertencia experimental en Node 22.13.0; el comportamiento está cubierto por la suite, pero deberá revisarse al fijar el runtime operativo.

## UNRESOLVED:

El runtime OpenAI real, modelo, API key, conversación o interfaz de retorno permanecen deliberadamente diferidos. La validación E2E real, el webhook público y el despliegue permanecen fuera del alcance autorizado de v0.2A.

## READY FOR V0.2B:

**NO.** v0.2A cumple su criterio de aceptación, pero no se debe avanzar a v0.2B hasta que el propietario autorice la fase siguiente y se cierre explícitamente el runtime OpenAI y el plan E2E. Esta orden termina aquí.
