# MiLukita — Agent Observability, Governance & Control Room

**Estado de esta iniciativa:** consolidación documental y observabilidad local verificable. No es una certificación productiva.

**Principio rector:** `OBSERVE → MEASURE → VERIFY → DETECT → EXPLAIN → ALERT → AUDIT → RECOVER → HUMAN OVERSIGHT`. La observabilidad no concede autoridad a los agentes y no altera la verdad de MJP CORE.

## Decisión de adaptación

La Orden Maestra se incorpora respetando la arquitectura vigente de MiLukita. Se reutiliza el Control Room existente en `/control-room`, el Agent Registry y los contratos de governance ya presentes. No se crean nuevos juegos, canales, wallets, sistemas de settlement, RNG, agentes operativos ni funcionalidades legales. Las capacidades de almacenamiento persistente, KPI central, incidentes y notificaciones externas quedan documentadas como futuras, no como implementadas.

| Capa | Función | Estado real | Fuente principal |
|---|---|---|---|
| MJP CORE | Verdad de juego, resultados y créditos virtuales | Protegido; no modificado | `shared/mjpCoreIsolation.test.ts` |
| Agents | Proponen, analizan, alertan o escalan según contrato | Registrados y acotados | `shared/agentRegistry.ts` |
| Governance | Autoridad, límites y revisión humana | Implementado como contratos y paneles | `shared/agentGovernance.ts`, `shared/agentRuntimeAutonomy.ts` |
| Observability | Estado, eventos, confianza de datos y límites | Contrato canónico + resumen UI | `shared/observabilityContract.ts`, `client/src/pages/ControlRoom.tsx` |
| Control Room | Observación y control humano | Implementado localmente con polling | `client/src/pages/ControlRoom.tsx` |

## Contrato canónico

`shared/observabilityContract.ts` define los estados de datos `REAL`, `SIMULATED`, `ESTIMATED`, `INFERRED` y `UNAVAILABLE`, junto con `AUTHORITATIVE`, `NON_AUTHORITATIVE` y `UNKNOWN`. Define además estados de resultado, ejecución, alertas, ciclo de incidentes, tendencias, rutas previstas y objetivos de integridad de CORE.

La regla `NO DATA → NO CLAIM` es obligatoria. Un valor inexistente no se transforma en cero, verde, saludable ni en una afirmación factual. La función `isCriticalOverride` obliga a que una violación de autoridad o una condición crítica de CORE prevalezca sobre cualquier promedio.

## Telemetría mínima propuesta

Cada evento observable debe conservar `event_id`, timestamp, agente y versión, tarea, acción, referencias de entrada y salida, autoridad, política, estado, duración, confianza, `data_status`, `data_trust`, necesidad de humano, acceso e impacto sobre CORE y error. La implementación actual contiene el tipo auditable y las rutas locales existentes; no afirma la existencia de un pipeline persistente universal.

## KPI y semáforos

La definición canónica exige nombre, fórmula, unidad, fuente, objetivo, umbrales configurables, agregación, ventana, baseline, versión y estado. En la UI actual, Business y Experience permanecen en `NO_DATA` cuando no existe evidencia suficiente; Agents se muestra como `INSPECT`; Governance como `BOUNDED`; CORE como `PROTECTED`. Un estado crítico no queda oculto por un score global.

No se publican porcentajes de salud, calidad, impacto, ROI, MTTD o MTTR si no existe una fuente y una fórmula verificables. `BASELINE_PENDING`, `NO_DATA` y `NOT_MEASURED` son estados válidos y preferibles a una métrica inventada.

## Alertas e incidentes

El contrato soporta severidades `OK`, `WARNING` y `CRITICAL`, y ciclo `OPEN`, `ACKNOWLEDGED`, `INVESTIGATING`, `MITIGATED`, `RESOLVED` y `CLOSED`. La deduplicación se agrupa mediante `correlation_id`; repetir el mismo incidente abierto no debe crear una alerta independiente. Las alertas de autoridad violada, acceso no autorizado o impacto de CORE deben ser críticas y requerir escalamiento humano.

La persistencia central de alertas e incidentes todavía no está implementada. El Control Room conserva historial local para sus superficies existentes; esto no equivale a un almacén append-only ni a una certificación operacional.

## Integridad de MJP CORE

Los objetivos contractuales son: supervivencia de CORE del 100 %, acceso no autorizado 0, intentos de modificación 0, alteración de resultados 0, impacto de wallet 0 e impacto de ledger 0. La orden exige detenerse y solicitar aprobación humana antes de modificar CORE. Esta iteración no modifica MJP CORE; las pruebas de aislamiento existentes y el nuevo contrato de observabilidad solo verifican la frontera.

## Estado de implementación

| Capacidad | Clasificación | Evidencia o razón |
|---|---|---|
| Agent Registry y autoridad granular | IMPLEMENTED / PARTIAL | Registro y contratos existentes; falta instrumentación universal por evento |
| Resumen visual en Control Room | IMPLEMENTED | Panel de Observability OS con `NO_DATA`, `BOUNDED` y `PROTECTED` |
| Data Trust y `NO DATA → NO CLAIM` | IMPLEMENTED AS CONTRACT | `shared/observabilityContract.ts` y pruebas |
| KPI central persistente | PENDING | Requiere modelo de almacenamiento, fórmulas y migraciones aprobadas |
| Historial append-only global | PENDING | El historial local existente no es un almacén central |
| Alert deduplication/correlation/cooldown | IMPLEMENTED AS CONTRACT | Contrato verificable; no pipeline productivo |
| Incident Center | PENDING | No se activa sin modelo persistente y autoridad de resolución |
| Notificaciones email/Slack/Telegram | EXTERNAL_REQUIRED | Requieren conectores, secretos y decisión operativa |
| Failure injection productiva | NOT_VERIFIABLE | Solo se permiten simulaciones aisladas en sandbox |
| Dos procesos contra base compartida | NOT_VERIFIABLE | No se certifica desde esta iteración |
| MJP CORE isolation | IMPLEMENTED / TESTED | Pruebas existentes; CORE no fue modificado |
| Legal & Compliance Agent | PLANNED / DISABLED / NOT_IMPLEMENTED | Contrato constitucional, autonomía 0 |

## Pruebas

La regresión específica de observabilidad está en `shared/observabilityContract.test.ts` y cubre `NO_DATA`, critical overrides, data trust, deduplicación, aislamiento de CORE y rutas previstas. La suite del proyecto debe ejecutarse con `pnpm exec tsc --noEmit`, `pnpm test -- --run` y `pnpm build` antes de cada checkpoint.

## No implementado deliberadamente

No se implementan durante esta iniciativa el pipeline persistente de telemetría, KPI histórico, incident store, alertas externas, retención configurable, particionamiento, certificación física, claims productivos, decisiones legales automáticas, ni cambios de MJP CORE. Cada elemento requiere diseño posterior, fuente de datos, política, revisión de autoridad y aprobación humana.

## Siguiente condición de avance

La siguiente etapa no debe ser otra expansión funcional. Primero debe seleccionar una capacidad de observabilidad prioritaria, definir su esquema y autoridad, instrumentarla de forma no invasiva, probarla con datos identificados, demostrar impacto cero sobre MJP CORE y documentar sus limitaciones antes de habilitarla.
