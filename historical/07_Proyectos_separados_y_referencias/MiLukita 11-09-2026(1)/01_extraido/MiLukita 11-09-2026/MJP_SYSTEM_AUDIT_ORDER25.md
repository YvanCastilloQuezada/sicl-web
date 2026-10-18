# MJP Experience OS — Auditoría técnica inicial de la Orden 25

**Fecha de corte:** 26 de agosto de 2026  
**Estado:** auditoría inicial ejecutada antes de la ampliación de Orden 25  
**Alcance:** repositorio `ruleta-peru-online`, piloto de créditos virtuales  
**Regla:** no se considera una función operativa solo porque exista un archivo.

> El piloto permanece en modo virtual/staging/demo. No se activan dinero real, depósitos, retiros, Yape, tarjetas, conversión a soles, KYC/AML real, geolocalización regulatoria real, monetización, YouTube API, Avatar 3D ni TTS externo.

## 1. Criterios de evidencia

| Estado | Significado |
| --- | --- |
| `CODE_EXISTS` | Existe código identificable, pero no implica que esté completo o operativo. |
| `UNIT_TESTED` | Tiene pruebas unitarias o deterministas asociadas. |
| `E2E_TESTED` | Tiene una prueba de flujo de extremo a extremo. |
| `MANUALLY_VALIDATED` | Fue revisado mediante navegador o dispositivo y existe evidencia documentada. |
| `PRODUCTION_READY` | No se asigna en este piloto; requiere revisión externa, seguridad, operación y regulación. |
| `SIMULATED` | El contrato o flujo existe para demostración, sin operación externa o monetaria. |
| `BLOCKED` | Requiere credenciales, staging, proveedor, hardware o decisión independiente. |

## 2. Inventario de arquitectura existente

| Área | Evidencia | Estado inicial | Acción Orden 25 |
| --- | --- | --- | --- |
| Game Core | `server/pilot.ts`, `server/pilot.test.ts` | `CODE_EXISTS`, `UNIT_TESTED` | Reutilizar; no duplicar rondas ni resultados. |
| Event Engine | `shared/eventEngine.ts`, `shared/roundState.ts` | `CODE_EXISTS`, `UNIT_TESTED` | Mantener como fuente de estado derivada de rondas. |
| Experience Engine | `shared/experienceEngine.ts`, `shared/eventExperience.test.ts` | `CODE_EXISTS`, `UNIT_TESTED` parcial | Ampliar contrato de experiencias y plantillas. |
| Scheduler | `server/schedulerEngine.ts`, `server/scheduledGames.ts` | `CODE_EXISTS`, `UNIT_TESTED` parcial | Extender validaciones y lifecycle de publicación. |
| Event Store | `server/eventStore.ts`, tabla `operational_events` | `CODE_EXISTS`, `UNIT_TESTED` indirecto | Reutilizar para acciones, estados y trazabilidad. |
| TV / overlay | `client/src/pages/BroadcastPage.tsx`, `server/broadcast.ts` | `E2E_TESTED`, `MANUALLY_VALIDATED` | Consumir manifest y añadir contexto sin segunda fuente. |
| QR | `server/broadcast.ts`, `shared/tvManifest.ts` | `UNIT_TESTED`, `E2E_TESTED` | Evolucionar a QR contextual efímero. |
| Second Screen | `BroadcastPage`, `interactionEngine.ts`, analytics | `SIMULATED` / parcial | Añadir vínculo de experiencia y sesión temporal. |
| Contingencia | `shared/contingencyEngine.ts` | `UNIT_TESTED`, `SIMULATED` | Integrar detección, fallback y recuperación con auditoría. |
| Watchdog | `server/autonomy.ts` | `CODE_EXISTS` | Ampliar checks de componentes sin autoridad de resultados. |
| Kill Switch | `systemControlState`, `server/autonomy.ts` | `CODE_EXISTS`, `UNIT_TESTED` parcial | Mantener global, reversible y auditable. |
| Autonomy | `server/autonomy.ts` | `SIMULATED`, `CODE_EXISTS` | Conservar heartbeat seguro; no activar cambios irreversibles. |
| Avatar | `shared/avatarScripts.ts` | `CODE_EXISTS`, `UNIT_TESTED` | Mantener guiones deterministas; sin Avatar 3D. |
| Content | `experienceEngine.ts`, scripts | `SIMULATED` | Separar facts de copy y usar fallback seguro. |
| Mathematics | `gameRegistry.ts`, scripts RTP, reglas | `UNIT_TESTED` parcial | Evitar publicación si el expediente matemático está incompleto. |
| Analytics | `server/productAnalytics.ts`, tablas analytics | `UNIT_TESTED`, `SIMULATED` | Añadir funnel solo cuando exista evento medible. |
| Control Room | panel operativo y control state | `CODE_EXISTS` parcial | Consolidar semáforo accesible y event log. |
| Realtime | polling y BroadcastChannel | `CODE_EXISTS`, `SIMULATED` | Mantener polling como fallback; no activar WebSocket sin necesidad. |
| Persistencia de PROGRAM/BLOCK | `drizzle/schema.ts` | `MISSING` | Evaluar migración mínima y reversible. |
| Concurrencia staging | `scripts/run-concurrency-staging.mjs` | `BLOCKED` | Requiere `STAGING_DATABASE_URL` aislada. |

## 3. Hallazgos técnicos

El proyecto ya posee una base de monolito modular coherente: las rondas y liquidaciones se mantienen en `server/pilot.ts`, el estado público se proyecta mediante `shared/eventEngine.ts`, el canal TV usa `server/broadcast.ts` y `shared/tvManifest.ts`, y la operación registra eventos en `server/eventStore.ts`. La Orden 25 debe ampliar contratos y paneles, no crear motores paralelos.

El mayor faltante estructural es la persistencia de una jerarquía `PROGRAM → BLOCK → EVENT → EXPERIENCE`. El Scheduler actual crea propuestas en memoria y exige aprobación, pero no conserva aún una entidad de programa publicable ni un registro formal de bloque/experiencia. La implementación de esta fase debe priorizar contratos compartidos y validaciones puras; cualquier migración debe hacerse de forma explícita y solo contra staging antes de ejecutarse en la base del proyecto.

El Experience Engine actual traduce estados de `MjpEvent` a vistas de experiencia y mensajes virtuales. No modifica resultados ni reglas. La ampliación puede incorporar fases, plantillas y políticas de contingencia siempre que el Game Core siga siendo autoritativo.

## 4. Riesgos y bloqueos

| Riesgo | Nivel | Tratamiento |
| --- | --- | --- |
| Doble fuente de verdad entre experiencia y ronda | Crítico | Toda experiencia debe derivarse de Event Engine y manifest. |
| Scheduler publicando sin aprobación | Crítico | Mantener `DRAFT → APPROVED → PUBLISHED`; aprobación humana obligatoria. |
| Autonomía alterando resultados | Crítico | Autonomy Engine solo orquesta; nunca escribe matemáticas o premios. |
| Prueba de concurrencia sin staging | Alto | Runner bloquea ejecución si no existe URL aislada. |
| Realtime no disponible | Medio | Polling continúa como fallback verificable. |
| Avatar/TTS/YouTube | Medio | Mantener simulados o bloqueados por decisión de alcance. |
| Homologación y RNG | Crítico para dinero real | Revisión independiente y MINCETUR antes de monetización. |

## 5. Plan de implementación de Orden 25

La primera entrega debe consolidar contrato, estados y plantillas del Experience Engine. La segunda debe convertir Scheduler en una propuesta validable con conflicto, aprobación y publicación controlada. La tercera debe evolucionar QR/Second Screen y registrar latencias. La cuarta debe consolidar Control Room, autonomía supervisada, contingencia, contenido seguro y observabilidad. La quinta debe automatizar el flujo E2E en un entorno aislado y cerrar la auditoría final.

## 6. Evidencia reproducible

Las pruebas existentes se ubican en `shared/eventExperience.test.ts`, `server/tvManifest.test.ts`, `server/broadcast.test.ts`, `server/closeClaim.test.ts`, `server/tvOverlay.e2e.test.ts` y las suites de API. El build y TypeScript fueron verificados en el checkpoint documental previo. La prueba de concurrencia real continúa bloqueada hasta disponer de `STAGING_DATABASE_URL`; no se deben presentar métricas de staging inexistentes.

## 7. Conclusión inicial

La Orden 25 es técnicamente factible como evolución del monolito modular. La prioridad correcta es consolidar Experience Engine, Scheduler, Second Screen, contingencia y Control Room alrededor de las fuentes existentes, sin habilitar dinero real ni integraciones externas. El criterio de cierre no será el número de archivos, sino la demostración reproducible de un flujo `PROGRAM → EVENT → EXPERIENCE → TV → QR → MOBILE → LOCK → DRAW → RESULT → VERIFY`, con recuperación determinista y autoridad humana preservada.
