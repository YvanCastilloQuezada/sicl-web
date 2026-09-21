# ARKI — Integración canónica Project Brain + D6.2 + SICL Core

## Estado

`IMPLEMENTED_AS_PROTECTED_ORCHESTRATION`

La ruta `projectBrain.executeCanonical` coordina el motor existente sin crear un segundo motor de diseño. Exige `SICL_CORE_URL`, lee el snapshot remoto, ejecuta Project Brain, registra la propuesta en el Core, vuelve a leer la versión canónica, ejecuta D6.2 y registra su resultado.

## Flujo

```text
protectedProcedure
→ ownership/session validation
→ GET /v1/projects/:id/snapshot
→ Project Brain
→ POST /v1/projects/:id/reasoning-executions
→ GET /v1/projects/:id/snapshot
→ D6.2
→ POST /v1/projects/:id/reasoning-executions
→ HUMAN_REVIEW_REQUIRED
```

## Invariantes

- No se ejecuta la ruta sin `SICL_CORE_URL`.
- No se habilita `SICL_ALLOW_LOCAL_CORE` como sustituto.
- No se usa `emptySnapshot()` dentro de la ruta canónica.
- Project Brain y D6.2 sólo producen resultados `AI_PROPOSED`.
- Cada escritura declara `expected_project_version`.
- Un cambio de versión obliga a detener la operación.
- La autoridad humana permanece final.
- Un error HTTP del Core no se transforma en éxito.
- El resultado canónico se conserva en el Core remoto, no en una copia local silenciosa.

## Endpoint tRPC

```text
projectBrain.executeCanonical
```

Entrada mínima:

```text
projectId
name
typology
brief
brainExecutionId
d62ExecutionId
requestedReasoningDepth
activities
relationships
```

## Endpoint remoto requerido

El SICL Core debe exponer:

```text
POST /v1/projects/{project_id}/reasoning-executions
```

El endpoint debe aceptar `execution_id`, `engine`, `runtime_version`, `expected_project_version`, `input`, `output`, `epistemic_status` y `human_review_required`, y devolver `observed_version`.

## Límites actuales

La integración está preparada y probada con un contrato HTTP simulado en pruebas unitarias, pero no se declara una ejecución remota real porque el entorno actual no tiene `SICL_CORE_URL` configurada. La activación de producción requiere un SICL Core HTTPS real, su endpoint de escritura de ejecuciones y pruebas E2E autenticadas.

## Correcciones aplicadas tras auditoría

Se añadieron pruebas directas para: rechazo de `409 CONCURRENCY_CONFLICT` durante el commit Brain, rechazo de `409` durante el commit D6.2, cambio de versión entre el commit Brain y la relectura canónica, y discrepancia de `project_id`.

El comando `dev` ya no activa `SICL_ALLOW_LOCAL_CORE=true` automáticamente. El fallback local sólo puede habilitarse mediante una configuración explícita de desarrollo y no participa en `projectBrain.executeCanonical`.

También se añadió el harness:

```bash
SICL_CORE_URL=https://core.example \
SICL_CORE_SERVICE_TOKEN=REDACTED \
pnpm run e2e:canonical -- /ruta/al/input.json
```

El harness se detiene antes de leer el payload si falta la URL o el token. No crea proyectos por sí mismo: ejecuta el payload entregado contra un Core existente y devuelve versiones, commits y `replay_fingerprint`.
