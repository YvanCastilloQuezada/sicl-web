# Micro-Orden de Identificación de Agentes

**Documento:** Orden Maestra 001 — Micro-Orden de Identificación de Agentes  
**Fecha de verificación:** 2026-09-11  
**Autoridad:** Human Authority  
**Alcance:** Identificación y documentación únicamente. No se crearon, activaron ni modificaron agentes.

## 1. Estado final

🟢 **COMPLETADA** dentro del alcance de identificación. Se revisaron el registry de agentes, el backlog de autonomía, el contrato de governance, el contrato de capabilities seguras, el Agent Router y la procedure administrativa `agentRoute`. La búsqueda no habilitó agentes, no cambió estados, no creó pantallas, no modificó MJP CORE y no inició Fase G.

## 2. Resultado cuantitativo

| Métrica | Resultado |
|---|---:|
| Agentes registrados en `AGENT_REGISTRY` | 16 |
| Agentes conectados al Agent Router | 6 intents / 6 agentes de ruta |
| Agentes registrados sin ruta directa | 10 |
| Estados IMPLEMENTED | 7 |
| Estados PARTIAL | 5 |
| Estados PREPARED | 3 |
| Estados PLANNED / DISABLED | 1 |
| Agentes con autoridad de ejecución | 0 |
| Agentes con capacidad de mutar MJP CORE | 0 |
| Agentes creados o activados durante esta micro-orden | 0 |

> “Identificar, no crear. Reportar, no modificar. Documentar, no activar.”

## 3. Agentes identificados en el registry

Todos los registros están limitados por `AGENT_AUTHORITY_BOUNDARY`, que incluye MJP CORE, RNG, RTP, WALLET, LEDGER, SETTLEMENT, RULES y MjpTvManifest. El modo indicado es el declarado en el registry; la conexión al Agent Router solo se marca como sí cuando existe en `ROUTE_MAP` y en la procedure administrativa `agentRoute`.

| # | Agente | Ubicación principal | Estado | Modo | Función | Conectado | Autoridad | Pendiente principal |
|---:|---|---|---|---|---|---|---|---|
| 1 | Audience Intelligence | `shared/agentRegistry.ts`, `shared/commercialOs.ts` | PARTIAL | PROPOSE_ONLY | Eventos y cohortes de audiencia | No | none | Datos productivos y consentimiento |
| 2 | Marketing Intelligence | `shared/marketingIntelligence.ts` | PARTIAL | PROPOSE_ONLY | Brand, truth gate y briefs | No | none | Claims, presupuesto y publicación |
| 3 | Social | `shared/distributionOs.ts` | PREPARED | PROJECTION_ONLY | Preparación de canales sociales | No | none | OAuth, proveedores y moderación |
| 4 | Content | Documentación de Entertainment OS | PREPARED | PROPOSE_ONLY | QA y moderación de contenido | No | none | Licencias y aprobación editorial |
| 5 | Lukita | `shared/characterOs.ts` | IMPLEMENTED | PROPOSE_ONLY | Identidad, estados y foundation del personaje | No | none | GLB final, derechos y voz |
| 6 | Sales | `shared/commercialOs.ts` | PARTIAL | PROPOSE_ONLY | Pipeline conceptual de leads | No | none | CRM, leads reales y contratos |
| 7 | Revenue | `shared/commercialOs.ts` | PREPARED | PROPOSE_ONLY | Métricas y escenarios source-bound | No | none | Pagos, ingresos y decisiones financieras |
| 8 | Financial Intelligence | `server/financial/FinancialIntelligenceAgent.ts` | IMPLEMENTED | PROPOSE_ONLY | Escenarios financieros y sensibilidad | Sí: `FINANCIAL_ANALYSIS` | none | Revisión profesional y decisiones fiscales |
| 9 | Experience Director | `server/experience/ExperienceDirector.ts` | IMPLEMENTED | PROPOSE_ONLY | Revisión y propuestas de experiencia | Sí: `EXPERIENCE_REVIEW` | none | Rediseño productivo y claims de conversión |
| 10 | Auditor | `server/auditor/AuditorAgent.ts` | IMPLEMENTED | READ_ONLY | Evidencia, invariantes y reportes append-only | Sí: `AUDIT` | none | Certificación independiente |
| 11 | Watchdog | `server/watchdog/WatchdogAgent.ts` | IMPLEMENTED | ALERT_ONLY | Reglas de alerta, deduplicación y cooldown | Sí: `OBSERVE` | none | Staging persistente y multiinstancia real |
| 12 | Recovery | `server/recovery/RecoveryEngine.ts` | IMPLEMENTED | PROPOSE_ONLY | Recuperación determinista y bounded retry | No | none | Continuidad multiinstancia |
| 13 | Supervisor | `shared/agentGovernance.ts` | PARTIAL | PROPOSE_ONLY | Escalamiento, conflictos y handoff | No | none | Coordinación autónoma, que está bloqueada |
| 14 | Business Strategy | Documentación Business Strategy Agent | IMPLEMENTED | PROPOSE_ONLY | Hipótesis, escenarios y recomendaciones | No | none | Presupuesto, precios y compromisos |
| 15 | Distribution | `shared/distributionOs.ts`, `client/src/components/DistributionOsPanel.tsx` | PARTIAL | PROJECTION_ONLY | Readiness de canales y QA | Sí: `DISTRIBUTION_REVIEW` | none | Proveedores, CDN/DRM y publicación |
| 16 | Legal & Compliance Intelligence Agent | `shared/legalComplianceAgent.ts` | PLANNED | PROPOSE_ONLY | Checklist legal y ruta de evidencia | Sí nominal: `LEGAL_REVIEW`, resultado NO_DATA | none | Revisión profesional, contratos, filings y licencias |

### Capacidades comunes verificadas

El contrato de capabilities seguras permite documentar `CONTRACT`, `EVIDENCE_PATH` y `AUTHORITY_BOUNDARY` cuando existen contrato y entregables catalogados. `VALIDATION`, `TESTS` y `OBSERVABILITY` requieren evidencia persistente o externa adicional y no deben presumirse. Ningún agente puede mutar el core: `noAgentCanWriteProtectedCore()` devuelve siempre `false`.

## 4. Agentes solicitados no encontrados como agentes independientes

La búsqueda distinguió entre **servicio/contrato funcional existente** y **agente registrado**. Cuando existe una capacidad equivalente, se reporta como equivalente no registrado, sin inventar un agente.

| # | Agente buscado | Estado | Nota |
|---:|---|---|---|
| 1 | Security Agent | NOT_FOUND | Existe infraestructura de seguridad y tests, pero no un agente registrado con ese nombre. |
| 2 | Governance Agent | NOT_FOUND / EQUIVALENT | Existe governance, Auditor, Watchdog y Supervisor; no existe un `Governance Agent` independiente. |
| 3 | Compliance Agent | NOT_FOUND / EQUIVALENT | Existe `Legal & Compliance Intelligence Agent`, pero está PLANNED / DISABLED. |
| 4 | World Agent | NOT_FOUND | Existe World Engine y runtime publicado, pero no un agente registrado. |
| 5 | Territorial Agent | NOT_FOUND | Existe `territorialTrust` y dominio territorial, pero no un agente registrado. |
| 6 | Mapper Agent | NOT_FOUND | Existe Mapper profesional y servicios de captura, pero no un agente registrado. |
| 7 | The Eye Agent | NOT_FOUND | Existe The Eye como dominio/procedures, pero no un agente registrado. |
| 8 | Gesture Agent | NOT_FOUND | Existen contratos de interacción y gestos, pero no un agente registrado. |
| 9 | Intent Agent | NOT_FOUND / EQUIVALENT | Existe Intent Engine, pero no un agente autónomo registrado. |
| 10 | UI Agent | NOT_FOUND | Existen componentes UI, pero no un agente registrado. |
| 11 | Voice Agent | NOT_FOUND / EQUIVALENT | Existe Voice Engine/Field Voice Copilot, pero no un agente registrado. |
| 12 | Discovery Agent | NOT_FOUND | No se encontró registro ni ruta de agente equivalente. |
| 13 | AR Agent | NOT_FOUND / EQUIVALENT | Existe AR Stage/AR Productive, pero no un agente registrado. |
| 14 | TV Agent | NOT_FOUND / EQUIVALENT | Existe TV Engine y simulación TV, pero no un agente registrado. |
| 15 | Games Agent | NOT_FOUND / EQUIVALENT | Existe Games/Gamepad, pero no un agente registrado y MJP CORE permanece aislado. |

## 5. Conexión real al Agent Router

La única ruta administrativa localizada es `admin.agentRoute`, que acepta `AUDIT`, `EXPERIENCE_REVIEW`, `FINANCIAL_ANALYSIS`, `DISTRIBUTION_REVIEW`, `LEGAL_REVIEW` y `OBSERVE`. Por tanto, seis agentes tienen conexión nominal al router: Auditor, Experience Director, Financial Intelligence, Distribution, Legal & Compliance y Watchdog. Legal & Compliance permanece `PLANNED`, por lo que su resolución devuelve `NO_DATA`; Distribution, declarado `PROJECTION_ONLY`, tampoco se considera una ejecución activa.

No existe una ruta de Agent Router para Audience, Marketing, Social, Content, Lukita, Sales, Revenue, Recovery, Supervisor, Business Strategy ni para los equivalentes funcionales de World, Territorial, Mapper, The Eye, Voice, AR, TV, Games, UI, Gesture, Intent, Discovery o Security.

## 6. Límites de autoridad

| Pregunta | Resultado verificable |
|---|---|
| ¿Algún agente tiene autoridad de ejecución? | **NO**. Todos declaran `authorityBoundary`; los modos son lectura, alerta, propuesta o proyección. |
| ¿Algún agente puede modificar MJP CORE? | **NO**. `canAgentMutateCore()` y `noAgentCanWriteProtectedCore()` devuelven `false`. |
| ¿Algún agente puede publicar sin autorización humana? | **NO**. Las funciones de publicación territorial, AR, Share y governance mantienen gates humanos. |
| ¿Se creó o activó algún agente? | **NO**. Esta micro-orden fue solo identificatoria. |
| ¿Se inició Fase G? | **NO**. Detención obligatoria respetada. |

## 7. Pendientes separados

**De esta micro-orden:** ninguno dentro del alcance de búsqueda y reporte. La única decisión pendiente es de Human Authority: si desea formalizar agentes equivalentes que hoy son servicios, no hacerlo automáticamente.

**De E.1:** Legal & Compliance continúa PLANNED / DISABLED; la validación tRPC de Agent Router y la revisión formal de límites permanecen pendientes.

**De Fase F:** validación física de GPS, cámara, sincronización offline, conflictos y operación Mapper/The Eye en Android/iOS reales.

**De Orden 60:** continúan pendientes la cobertura de abuso/IDOR ampliada, seguridad frontend, infraestructura productiva externa y validación de dominio/headers.

**Futuras:** Fase G y cualquier activación o creación de agentes requieren una orden independiente y decisión explícita de Human Authority.

## 8. MJP CORE

**SIN MODIFICACIÓN.** No se modificaron RNG, RTP, wallet, ledger, settlement, rules, créditos, juegos protegidos ni `MjpTvManifest`.

## 9. Estado de fases

**FASE F — CERRADA CON OBSERVACIONES / REQUIRES_HUMAN.** La implementación de Mapper fue guardada en el checkpoint `e249d069`; la validación física sigue pendiente.  
**FASE G — NO INICIADA.** La ejecución se detiene aquí por regla de la micro-orden.

## 10. Evidencia revisada

| Evidencia | Propósito |
|---|---|
| `shared/agentRegistry.ts` | Registry, estados, modos, boundaries y limitaciones. |
| `shared/agentAutonomyBacklog.ts` | Contratos, entregables seguros y human gates. |
| `shared/agentGovernance.ts` | Scorecards y estados de governance. |
| `shared/agentSafeCapability.ts` | Capabilities seguras y bloqueo de mutación del core. |
| `shared/agentRouter.ts` | Mapa de intents y routing registrado. |
| `server/routers.ts` | Procedure administrativa `admin.agentRoute`. |
| `server/auditor/AuditorAgent.ts` y servicios equivalentes | Existencia de implementaciones concretas. |

**Conclusión:** la micro-orden queda **COMPLETADA** como identificación. Manus no creó, activó ni modificó agentes; Human Authority conserva la decisión sobre cualquier siguiente paso.
