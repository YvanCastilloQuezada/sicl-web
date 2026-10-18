# ARKI Agent Bridge v0.2B — Implementation Report

**Orden:** `AB-V02B-IMPLEMENT-001`  
**Alcance:** OpenAI Agents API Adapter simulado, ARKI Architect contract e integración gobernada  
**Estado:** completado sin llamadas externas, sin credenciales y sin E2E

## VERSION:

`0.2.0-alpha.2`.

## FILES CREATED:

- `src/openai-adapter.mjs`
- `migrations/002_openai_sessions.sql`
- `tests/openai-adapter.test.mjs`
- `V02B_IMPLEMENTATION_REPORT.md`

## FILES MODIFIED:

- `src/store.mjs`: migraciones múltiples, sesiones/eventos OpenAI y persistencia.
- `src/orchestrator.mjs`: revisión ARKI Architect, eventos, policy enforcement, correcciones y escalamiento.
- `src/manus.mjs`: no lee `MANUS_API_KEY` implícitamente.
- `package.json`: versión `0.2.0-alpha.2`.
- `README.md`: documentación del alcance v0.2B.

No se modificó ARKI ni el ZIP de v0.1.

## OPENAI ADAPTER:

Implementada una interfaz `OpenAIAgentsAPIAdapter` para OpenAI Agents API con transporte inyectable. No se utiliza Agents SDK como runtime principal. No se usa MCP como cerebro u orquestador. No se intenta despertar ni automatizar una conversación específica de ChatGPT.

El adapter permite crear sesiones, enviar contexto al agente y recibir resultados estructurados. La implementación actual requiere un transporte explícito; no realiza llamadas HTTP OpenAI por sí misma.

## ARKI ARCHITECT CONTRACT:

Implementado el agente lógico `ARKI Architect` con funciones de architect, reviewer, supervisor y planner. No tiene ejecución directa sobre ARKI.

La entrada estricta contiene:

`decision_id`, `task_id`, `project`, `authorized_scope`, `context`, `why`, `objective`, `do_not_touch`, `acceptance`, `manus_status`, `manus_result`, `evidence`, `blockers`, `questions`, `policy_version` y `correlation_id`.

La salida estricta contiene:

`decision_id`, `classification`, `assessment`, `next_action`, `scope_delta`, `requires_human`, `reason`, `evidence_to_preserve` y `acceptance_status`.

Se rechazan campos desconocidos, campos ausentes, tipos inválidos y enums no reconocidos.

## SESSION MODEL:

Añadidas las tablas `openai_sessions` y `openai_events`. Cada sesión queda vinculada de forma única a una decisión y conserva `session_id`, `decision_id`, `agent_name`, estado, metadata y timestamps.

La correlación queda persistida como:

`decision_id ↔ OpenAI session_id ↔ Manus task_id ↔ correlation_id`.

Los eventos lifecycle normalizados son:

- `session.created`
- `session.in_progress`
- `session.action_required`
- `session.idle`
- `session.failed`

Los eventos duplicados no producen un segundo efecto material. La sesión y sus eventos sobreviven al reinicio del proceso.

## ORCHESTRATOR INTEGRATION:

El Orchestrator ahora puede:

1. Construir el contexto mínimo del proyecto y decisión.
2. Crear o reutilizar una sesión OpenAI correlacionada.
3. Marcar resultados Manus como datos externos no confiables.
4. Normalizar eventos lifecycle.
5. Validar la salida estricta del agente.
6. Aplicar `Decision Policy Engine` antes de cambiar estado.
7. Completar, corregir, escalar o detener según el resultado.
8. Preservar `REVIEW_REQUIRED` si OpenAI no está disponible.

No se copia memoria histórica completa. El contexto se limita a decisión, alcance autorizado, evidencia relevante, policy y estado actual.

## POLICY ENFORCEMENT:

El output OpenAI nunca se ejecuta directamente. El flujo implementado es:

```text
OPENAI OUTPUT
  -> SCHEMA VALIDATION
  -> DECISION POLICY ENGINE
  -> STATE MACHINE
  -> AUTHORIZED ACTION
```

`scope_delta`, `requires_human`, categorías materiales, `PARTIAL` y `UNKNOWN` llevan a `HUMAN_DECISION_REQUIRED`. `PROHIBITED` lleva a detención con estado `FAILED`. `PASS` dentro de alcance lleva a `COMPLETED`.

## MANUS CORRECTION LOOP:

Un resultado `FAIL` con acción correctiva dentro de alcance y clasificación no prohibida:

1. Pasa a `CORRECTION_REQUIRED`.
2. Genera una corrección acotada con `decision_id` y `task_id`.
3. Incluye `DO NOT EXPAND SCOPE`.
4. Envía el mensaje al task Manus mediante el adapter existente.
5. Registra el mensaje y transiciones.
6. Vuelve a `DISPATCHED`.

No se ejecuta una corrección si el resultado amplía scope o entra en una categoría material.

## HUMAN ESCALATION:

Se implementó `HUMAN_DECISION_REQUIRED` para scope delta, security boundary, decisiones materiales, resultados parciales/desconocidos y clasificación `HUMAN_REQUIRED`. Las escalaciones quedan persistidas con pregunta, categoría y acción requerida.

Las decisiones ya autorizadas no se reconfirman dentro de su alcance.

## PROMPT INJECTION BOUNDARY:

El resultado Manus, archivos, logs, repositorios y contenido web se envían como `untrusted_data`. No pueden modificar `authorized_scope`, `do_not_touch`, `policy_version` ni la identidad de la decisión.

Una salida OpenAI con `scope_delta: true` no se ejecuta; se escala a Yvan. La salida OpenAI tampoco puede cambiar `decision_id` sin producir `CORRELATION_MISMATCH`.

## TESTS:

`npm test` pasó completamente:

```text
ℹ tests 23
ℹ pass 23
ℹ fail 0
```

La suite incluye la cobertura previa de v0.2A y las nuevas pruebas de v0.2B. También pasó `node --check` para todos los módulos y tests.

## SECURITY TESTS:

PASS para schema estricto, campos desconocidos, tipos/enums inválidos, aislamiento de decisiones, eventos duplicados, output con scope delta, security boundary, `PROHIBITED`, OpenAI unavailable y prompt injection como datos no confiables.

## RESTART RECOVERY:

PASS. `openai_sessions` y `openai_events` se conservan tras cerrar y reabrir SQLite. La correlación con la decisión se mantiene.

## AUDIT:

Las sesiones, eventos OpenAI, revisiones, correcciones, escalaciones y transiciones se registran en el audit log existente. No se almacenan API keys, tokens ni secretos.

## ARKI NO-TOUCH:

PASS. No se añadieron rutas de mutación, imports externos de ARKI ni operaciones sobre el producto ARKI. El Bridge continúa aislado en `bridge-v0.2a/`.

## REAL OPENAI CALLS:

`0`. No se utilizó runtime, modelo, API key ni transporte HTTP OpenAI real. Las pruebas utilizan `FakeAgentsTransport`.

## REAL MANUS CALLS:

`0`. Las pruebas utilizan fakes para Manus. No se registró webhook público ni se ejecutó una tarea real.

## CREDENTIALS USED:

Ninguna. Se eliminó la lectura implícita de `OPENAI_API_KEY` y `MANUS_API_KEY` en las instancias utilizadas por esta fase.

## BLOCKERS:

No hay bloqueadores para el alcance autorizado de v0.2B. La validación E2E real permanece fuera del alcance por orden explícita.

## READY FOR ISOLATED E2E:

**NO.** La implementación simulada y sus pruebas están completas, pero esta orden exige detenerse antes de E2E. La selección del runtime está cerrada, pero todavía no se deben introducir credenciales, webhook público ni llamadas reales.
