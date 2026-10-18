# AGENT_INVENTORY_EVIDENCE_001

## 1. Estado final de las micro-órdenes complementarias

**Estado: COMPLETADA dentro del alcance documental.** Se ejecutaron conjuntamente las versiones 1.0 y 1.1 de la Micro-Orden Complementaria de Agentes. El trabajo se limitó a inventariar, clasificar y documentar evidencia existente. **No se crearon, activaron ni modificaron agentes; no se modificó MJP CORE; no se inició Fase G.**

La versión 1.1 añade evidencia verificable a la versión 1.0. Por ello este documento conserva una tabla completa de los 16 registros, una tabla de los seis intents del Agent Router, una tabla de los diez registros sin ruta directa, una tabla de los 13 servicios/contratos y una matriz de evidencia. La palabra «conectado» significa **ruta nominal existente en `ROUTE_MAP` y expuesta por `admin.agentRoute`**; no significa autonomía, ejecución productiva ni autoridad.

## 2. Método y límites de evidencia

La verificación se realizó leyendo el registry, el backlog de autonomía, el contrato de capabilities seguras, el contrato del Agent Router, la procedure tRPC administrativa, los agentes concretos y las suites de tests existentes. Los enlaces de esta entrega son rutas relativas al repositorio porque no se verificó un remoto GitHub público en este entorno. El checkpoint anterior de identificación queda como evidencia adicional: [`manus-webdev://765782f9`](manus-webdev://765782f9).

> **Regla constitucional aplicada:** identificar, no crear; reportar, no modificar; documentar, no activar; Human Authority decide cualquier activación posterior.

## 3. Tabla completa de los 16 agentes registrados

| # | Nombre | Ubicación | Enlace | Estado | Modo | Función | Conectado | Autoridad | Dependencias | Pendientes |
|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | Audience Intelligence | `shared/agentRegistry.ts`; `shared/commercialOs.ts` | [`registry`](../shared/agentRegistry.ts) | PARTIAL | PROPOSE_ONLY | Eventos y cohortes de audiencia | NO | none | Contrato comercial, eventos tipados, consentimiento | Datos de usuarios reales y aprobación de consentimiento |
| 2 | Marketing Intelligence | `shared/agentRegistry.ts`; `shared/marketingIntelligence.ts`; `client/src/components/MarketingIntelligencePanel.tsx` | [`registry`](../shared/agentRegistry.ts) | PARTIAL | PROPOSE_ONLY | Marca, truth gate y briefs de campaña | NO | none | Brand system, truth gate, revisión humana | Claims, presupuesto, atribución y publicación autorizada |
| 3 | Social | `shared/agentRegistry.ts`; `shared/distributionOs.ts` | [`registry`](../shared/agentRegistry.ts) | PREPARED | PROJECTION_ONLY | Preparación de canales sociales y exportación | NO | none | Matriz de proveedores y metadata | OAuth, proveedores, moderación y publicación |
| 4 | Content | `shared/agentRegistry.ts`; `docs/MILUKITA_ENTERTAINMENT_OS.md` | [`registry`](../shared/agentRegistry.ts) | PREPARED | PROPOSE_ONLY | QA, versionado y moderación de contenido | NO | none | Contrato de contenido y claims | Licencias y aprobación editorial |
| 5 | Lukita | `shared/agentRegistry.ts`; `shared/characterOs.ts`; `client/src/components/CharacterExperiencePanel.tsx` | [`registry`](../shared/agentRegistry.ts) | IMPLEMENTED | PROPOSE_ONLY | Foundation, identidad, estados y fallback del personaje | NO | none | Character OS, assets y revisión humana | GLB final, derechos, voz e integración pública |
| 6 | Sales | `shared/agentRegistry.ts`; `shared/commercialOs.ts`; `client/src/pages/CommercialPage.tsx` | [`registry`](../shared/agentRegistry.ts) | PARTIAL | PROPOSE_ONLY | Pipeline conceptual de leads y scoring explicable | NO | none | Commercial OS y registro local | Leads reales, CRM y contratos |
| 7 | Revenue | `shared/agentRegistry.ts`; `shared/commercialOs.ts`; `docs/MILUKITA_COMMERCIAL_AUDIT.md` | [`registry`](../shared/agentRegistry.ts) | PREPARED | PROPOSE_ONLY | Métricas source-bound y escenarios | NO | none | Fórmulas, escenarios y guard NO_DATA | Pagos, ingresos reales y decisiones financieras |
| 8 | Financial Intelligence | `shared/agentRegistry.ts`; `server/financial/FinancialIntelligenceAgent.ts` | [`registry`](../shared/agentRegistry.ts) | IMPLEMENTED | PROPOSE_ONLY | Escenarios financieros, sensibilidad y flags de conflicto | SÍ nominal: `FINANCIAL_ANALYSIS` | none | Agent Router, escenarios trazables, revisión profesional | Asesoría profesional y decisiones fiscales |
| 9 | Experience Director | `shared/agentRegistry.ts`; `server/experience/ExperienceDirector.ts` | [`registry`](../shared/agentRegistry.ts) | IMPLEMENTED | PROPOSE_ONLY | Revisión y propuestas de experiencia | SÍ nominal: `EXPERIENCE_REVIEW` | none | Agent Router, checklist UX, aprobación manual | Rediseño productivo y claims de conversión |
| 10 | Auditor | `shared/agentRegistry.ts`; `server/auditor/AuditorAgent.ts` | [`registry`](../shared/agentRegistry.ts) | IMPLEMENTED | READ_ONLY | Evidencia, invariantes y reportes append-only | SÍ nominal: `AUDIT` | none | Agent Router, evidencia y auditoría append-only | Certificación independiente |
| 11 | Watchdog | `shared/agentRegistry.ts`; `server/watchdog/WatchdogAgent.ts`; `server/autonomy.ts` | [`registry`](../shared/agentRegistry.ts) | IMPLEMENTED | ALERT_ONLY | Reglas de alerta, deduplicación y cooldown | SÍ nominal: `OBSERVE` | none | Agent Router, políticas de alerta y autonomía acotada | Staging persistente y operación multiinstancia |
| 12 | Recovery | `shared/agentRegistry.ts`; `server/recovery/RecoveryEngine.ts` | [`registry`](../shared/agentRegistry.ts) | IMPLEMENTED | PROPOSE_ONLY | Recuperación determinista y reintentos acotados | NO | none | Matriz de fallos y retry bounded | Continuidad multiinstancia |
| 13 | Supervisor | `shared/agentRegistry.ts`; `shared/agentGovernance.ts` | [`registry`](../shared/agentRegistry.ts) | PARTIAL | PROPOSE_ONLY | Escalamiento, conflictos y handoff | NO | none | Governance, conflictos y quorum | Coordinación autónoma, expresamente bloqueada |
| 14 | Business Strategy | `shared/agentRegistry.ts`; `docs/BUSINESS_STRATEGY_AGENT.md`; `docs/BUSINESS_COMMAND_CENTER.md` | [`registry`](../shared/agentRegistry.ts) | IMPLEMENTED | PROPOSE_ONLY | Hipótesis, escenarios y recomendaciones | NO | none | Documentación estratégica y fuentes declaradas | Presupuesto, precios y compromisos comerciales |
| 15 | Distribution | `shared/agentRegistry.ts`; `shared/distributionOs.ts`; `client/src/components/DistributionOsPanel.tsx` | [`registry`](../shared/agentRegistry.ts) | PARTIAL | PROJECTION_ONLY | Readiness de canales, provider matrix y QA | SÍ nominal: `DISTRIBUTION_REVIEW` | none | Agent Router, gates de proveedor y QA | Proveedores, CDN/DRM, playout y publicación |
| 16 | Legal & Compliance Intelligence Agent | `shared/agentRegistry.ts`; `shared/legalComplianceAgent.ts` | [`registry`](../shared/agentRegistry.ts) | PLANNED / DISABLED | PROPOSE_ONLY | Checklist legal, frontera constitucional y ruta de evidencia | SÍ nominal: `LEGAL_REVIEW`, devuelve NO_DATA | none | Agent Router, checklist y revisión profesional | Contratos, filings, licencias y revisión legal profesional |

**Nota de conteo:** el registry fuente contiene exactamente 16 entradas. La distribución observada es: 7 IMPLEMENTED, 5 PARTIAL, 3 PREPARED y 1 PLANNED. Ninguna entrada declara autoridad de ejecución.

## 4. Tabla de los seis agentes conectados al Agent Router

La conexión se verifica en [`shared/agentRouter.ts`](../shared/agentRouter.ts), en el mapa `ROUTE_MAP`, y en [`server/routers.ts`](../server/routers.ts#L1440-L1442), donde `admin.agentRoute` expone exactamente seis intents administrativos. El test de comportamiento está en [`shared/agentRouter.test.ts`](../shared/agentRouter.test.ts).

| # | Agente | Intent conectado | Función | Modo | Ubicación | Enlace | Evidencia de conexión |
|---:|---|---|---|---|---|---|---|
| 1 | Auditor | `AUDIT` | Auditoría de evidencia e invariantes | READ_ONLY | `server/auditor/AuditorAgent.ts` | [`agente`](../server/auditor/AuditorAgent.ts) | `ROUTE_MAP.AUDIT = auditor`; procedure `admin.agentRoute`; test de routing PASS |
| 2 | Experience Director | `EXPERIENCE_REVIEW` | Revisión de experiencia y propuestas UX | PROPOSE_ONLY | `server/experience/ExperienceDirector.ts` | [`agente`](../server/experience/ExperienceDirector.ts) | `ROUTE_MAP.EXPERIENCE_REVIEW = experience-director`; procedure administrativa; test de routing PASS |
| 3 | Financial Intelligence | `FINANCIAL_ANALYSIS` | Escenarios y sensibilidad financiera | PROPOSE_ONLY | `server/financial/FinancialIntelligenceAgent.ts` | [`agente`](../server/financial/FinancialIntelligenceAgent.ts) | `ROUTE_MAP.FINANCIAL_ANALYSIS = financial-intelligence`; procedure administrativa; test de routing PASS |
| 4 | Distribution | `DISTRIBUTION_REVIEW` | Readiness y QA de distribución | PROJECTION_ONLY | `shared/distributionOs.ts`; `client/src/components/DistributionOsPanel.tsx` | [`contrato`](../shared/distributionOs.ts) | `ROUTE_MAP.DISTRIBUTION_REVIEW = distribution`; la decisión es NO_DATA por PROJECTION_ONLY; test de límite PASS |
| 5 | Legal & Compliance Intelligence Agent | `LEGAL_REVIEW` | Checklist y ruta de revisión legal | PROPOSE_ONLY | `shared/legalComplianceAgent.ts` | [`agente`](../shared/legalComplianceAgent.ts) | `ROUTE_MAP.LEGAL_REVIEW = legal_compliance_intelligence`; la decisión es NO_DATA por PLANNED; test de límite PASS |
| 6 | Watchdog | `OBSERVE` | Alertas, deduplicación y cooldown | ALERT_ONLY | `server/watchdog/WatchdogAgent.ts` | [`agente`](../server/watchdog/WatchdogAgent.ts) | `ROUTE_MAP.OBSERVE = watchdog`; procedure administrativa; test de routing PASS |

**Distinción importante:** hay seis rutas nominales, pero no seis agentes autónomos activos. Distribution produce `NO_DATA` por `PROJECTION_ONLY` y Legal & Compliance produce `NO_DATA` por `PLANNED`. El router es administrativo y protegido; no es una API pública ni una autorización de ejecución.

## 5. Tabla de los diez agentes registrados sin ruta directa

Estos diez registros pertenecen al registry, pero no aparecen como valores de `ROUTE_MAP`. No se deben confundir con los 15 equivalentes funcionales no registrados de la micro-orden anterior.

| # | Nombre | Ubicación | Enlace | Estado | Función | Modo | Razón de no conexión | Pendientes |
|---:|---|---|---|---|---|---|---|---|
| 1 | Audience Intelligence | `shared/agentRegistry.ts`; `shared/agentAutonomyBacklog.ts` | [`registry`](../shared/agentRegistry.ts) | PARTIAL | Eventos y cohortes | PROPOSE_ONLY | No existe intent en `ROUTE_MAP` | Datos reales, consentimiento y ruta aprobada |
| 2 | Marketing Intelligence | `shared/marketingIntelligence.ts` | [`servicio`](../shared/marketingIntelligence.ts) | PARTIAL | Brand y truth gate | PROPOSE_ONLY | No existe intent en `ROUTE_MAP` | Claims, presupuesto, atribución y publicación humana |
| 3 | Social | `shared/distributionOs.ts` | [`contrato`](../shared/distributionOs.ts) | PREPARED | Readiness social | PROJECTION_ONLY | No existe intent en `ROUTE_MAP`; proveedores externos no conectados | OAuth, moderación, proveedores y aprobación |
| 4 | Content | `docs/MILUKITA_ENTERTAINMENT_OS.md` | [`documento`](MILUKITA_ENTERTAINMENT_OS.md) | PREPARED | QA y moderación | PROPOSE_ONLY | No existe intent en `ROUTE_MAP` | Licencias y aprobación editorial |
| 5 | Lukita | `shared/characterOs.ts` | [`contrato`](../shared/characterOs.ts) | IMPLEMENTED | Foundation y estados de personaje | PROPOSE_ONLY | No existe intent en `ROUTE_MAP` | GLB final, derechos, voz e integración pública |
| 6 | Sales | `shared/commercialOs.ts` | [`contrato`](../shared/commercialOs.ts) | PARTIAL | Pipeline de leads | PROPOSE_ONLY | No existe intent en `ROUTE_MAP` | Leads, CRM y contratos |
| 7 | Revenue | `shared/commercialOs.ts` | [`contrato`](../shared/commercialOs.ts) | PREPARED | Métricas y escenarios | PROPOSE_ONLY | No existe intent en `ROUTE_MAP` | Pagos, ingresos reales y decisiones financieras |
| 8 | Recovery | `server/recovery/RecoveryEngine.ts` | [`motor`](../server/recovery/RecoveryEngine.ts) | IMPLEMENTED | Recuperación determinista | PROPOSE_ONLY | No existe intent en `ROUTE_MAP` | Continuidad multiinstancia |
| 9 | Supervisor | `shared/agentGovernance.ts` | [`governance`](../shared/agentGovernance.ts) | PARTIAL | Escalamiento y handoff | PROPOSE_ONLY | No existe intent en `ROUTE_MAP`; coordinación autónoma bloqueada | Quorum, handoff y decisión humana |
| 10 | Business Strategy | `docs/BUSINESS_STRATEGY_AGENT.md` | [`documento`](BUSINESS_STRATEGY_AGENT.md) | IMPLEMENTED | Hipótesis y recomendaciones | PROPOSE_ONLY | No existe intent en `ROUTE_MAP` | Presupuesto, precios y compromisos |

## 6. Tabla de los 13 elementos clasificados como servicios o contratos

Estos elementos no son agentes porque no aparecen como entradas de `AGENT_REGISTRY`, no tienen `agentId` en el registry ni una ruta autónoma propia. Son dominios, servicios, contratos o componentes de interfaz.

| # | Nombre | Clasificación | Ubicación | Enlace | Función | Por qué NO es agente | Dependencias |
|---:|---|---|---|---|---|---|---|
| 1 | World | Servicio/contrato | `server/territorialTrust.ts`; `shared/territorialTrust.ts` | [`territorial`](../server/territorialTrust.ts) | WorldObjects, snapshots, estados y runtime publicado | No está en `AGENT_REGISTRY`; es dominio territorial | Drizzle, RBAC territorial, Human Authority |
| 2 | Territorial | Servicio/contrato | `server/territorialTrust.ts`; `shared/territorialTrust.ts` | [`contrato`](../shared/territorialTrust.ts) | CaptureSession, Claims, Sources, Evidence, sync y auditoría | Es un servicio de confianza y persistencia | DB, auditoría, roles Mapper/The Eye |
| 3 | Mapper | Servicio/contrato | `client/src/pages/TerritorialFieldEntryPage.tsx`; `server/territorialTrust.ts` | [`entrada`](../client/src/pages/TerritorialFieldEntryPage.tsx) | Captura de campo, GPS, evidencia y cola offline | Es herramienta humana; no tiene `agentId` | CaptureSession, GPS, cámara, RBAC |
| 4 | The Eye | Servicio/contrato | `client/src/pages/TerritorialTrustPage.tsx`; `server/territorialTrust.ts` | [`superficie`](../client/src/pages/TerritorialTrustPage.tsx) | Review Queue, dossier, matriz, conflictos y decisiones | Es revisión humana; no publica automáticamente | Claims, Evidence, Human Authority |
| 5 | Voice | Servicio/contrato | `server/voiceEngine.ts`; `shared/fieldVoiceCopilot.ts` | [`motor`](../server/voiceEngine.ts) | STT, intents controlados, fallback y TTS | Voice no aparece como agente registrado | Voice provider, Field Voice, capability gate |
| 6 | AR | Servicio/contrato | `client/src/pages/LukitaARStagePage.tsx`; `shared/arProductive.ts` | [`AR`](../client/src/pages/LukitaARStagePage.tsx) | WebXR, GPS, POIs publicados y fallback 2D | AR es runtime/experiencia, no agente | World Engine, asset registry, GPS/WebXR |
| 7 | TV | Servicio/contrato | `client/src/pages/BroadcastPage.tsx`; `shared/tvGamesProductive.ts` | [`TV`](../client/src/pages/BroadcastPage.tsx) | TV Engine, conectividad simulada y fallback móvil | TV es superficie de interacción | Smart TV simulator, QR, Universal Controller |
| 8 | Games | Servicio/contrato | `client/src/pages/OnlineTvGamesPage.tsx`; `server/onlineTvGames.ts` | [`Games`](../server/onlineTvGames.ts) | Participación virtual y Gamepad con autoridad server-side | Games no tiene registro de agente y MJP CORE queda fuera | Sesiones virtuales, server-side authority |
| 9 | Intent | Contrato | `shared/lukaOsContract.ts`; `shared/fieldVoiceCopilot.ts` | [`OS contract`](../shared/lukaOsContract.ts) | Normaliza intenciones y confirmaciones | Es contrato, no entidad del registry | Context Engine, capability gate |
| 10 | Gesture | Contrato | `shared/interactionEngine.ts`; `shared/universalInteraction.ts` | [`interaction`](../shared/interactionEngine.ts) | Convergencia de tacto, gesto, voz y controlador | No tiene agentId ni route map | Universal Interaction, MobileShell |
| 11 | UI | Servicio/componente | `client/src/components/MobileShell.tsx`; `client/src/components/LukaUniversalEntry.tsx` | [`shell`](../client/src/components/MobileShell.tsx) | Shell común, presencia pública y navegación | Componente de interfaz, no agente | React, App, providers y rutas |
| 12 | Discovery | Contrato/servicio | `shared/lukaLaunchRegistry.ts`; `shared/lukaRuntimeContract.ts` | [`launch registry`](../shared/lukaLaunchRegistry.ts) | Launch registry y resolución de entrada/contexto | No existe entrada de agente independiente | ShareService, launch registry y capabilities |
| 13 | Security | Servicio/contrato | `server/_core/security.ts`; `server/auditGovernance.ts` | [`security`](../server/_core/security.ts) | Headers, rate limits, eventos de seguridad y gates | Seguridad es infraestructura transversal, no agente | Express, Audit/Governance, auth |

## 7. Evidencia verificable

| # | Hallazgo | Tipo | Enlace | Descripción |
|---:|---|---|---|---|
| 1 | Registry contiene 16 entradas | Archivo + test | [`agentRegistry.ts`](../shared/agentRegistry.ts) · [`agentRegistry.test.ts`](../shared/agentRegistry.test.ts) | El array `AGENT_REGISTRY` contiene 16 registros y los tests verifican el conteo y el boundary común. |
| 2 | Backlog contiene 16 work items | Archivo + test | [`agentAutonomyBacklog.ts`](../shared/agentAutonomyBacklog.ts) · [`agentAutonomyBacklog.test.ts`](../shared/agentAutonomyBacklog.test.ts) | Contratos, entregables seguros, gates humanas y estados actuales. |
| 3 | Existen seis intents del router | Archivo + procedure | [`agentRouter.ts`](../shared/agentRouter.ts) · [`routers.ts#L1440-L1442`](../server/routers.ts#L1440-L1442) | `AUDIT`, `EXPERIENCE_REVIEW`, `FINANCIAL_ANALYSIS`, `DISTRIBUTION_REVIEW`, `LEGAL_REVIEW`, `OBSERVE`. |
| 4 | Routing y límites PASS | Test | [`agentRouter.test.ts`](../shared/agentRouter.test.ts) | Verifica Auditor, Financial Intelligence, Legal `NO_DATA`, Distribution `NO_DATA` y `canMutateCore=false`. |
| 5 | Capabilities seguras | Archivo + test | [`agentSafeCapability.ts`](../shared/agentSafeCapability.ts) · [`agentSafeCapability.test.ts`](../shared/agentSafeCapability.test.ts) | Las capabilities requieren evidencia; `noAgentCanWriteProtectedCore()` devuelve false. |
| 6 | Aislamiento MJP CORE | Test | [`mjpCoreIsolation.test.ts`](../shared/mjpCoreIsolation.test.ts) | Verifica las barreras del core sin cambiar sus reglas. |
| 7 | Agentes concretos conectados | Archivos | [`AuditorAgent.ts`](../server/auditor/AuditorAgent.ts), [`ExperienceDirector.ts`](../server/experience/ExperienceDirector.ts), [`FinancialIntelligenceAgent.ts`](../server/financial/FinancialIntelligenceAgent.ts), [`WatchdogAgent.ts`](../server/watchdog/WatchdogAgent.ts) | Implementaciones server-side existentes. Distribution y Legal se verifican por sus contratos y estados `PROJECTION_ONLY`/`PLANNED`. |
| 8 | Resultado de las pruebas de esta entrega | Log | Ejecución local del 2026-09-11 | 5 suites PASS y 21 tests PASS: registry, backlog, router, safe capabilities y MJP isolation. |
| 9 | Checkpoint anterior | Checkpoint | [`manus-webdev://765782f9`](manus-webdev://765782f9) | Reporte de identificación previo, sin cambios de código ni activación de agentes. |

## 8. Resumen

| Métrica | Resultado |
|---|---:|
| Total de agentes registrados | 16 |
| Total de agentes conectados nominalmente | 6 |
| Total de agentes registrados sin ruta directa | 10 |
| Total de servicios/contratos clasificados | 13 |
| Agentes con autoridad de ejecución | 0 |
| Agentes que pueden modificar MJP CORE | 0 |
| Agentes creados o activados durante estas micro-órdenes | 0 |
| Fase G iniciada | NO |

## 9. Límites de autoridad

Ningún agente tiene autoridad de ejecución. Los modos registrados son `READ_ONLY`, `ALERT_ONLY`, `PROPOSE_ONLY` o `PROJECTION_ONLY`. Ningún agente puede modificar MJP CORE: `canAgentMutateCore()` y `noAgentCanWriteProtectedCore()` devuelven `false`. Ningún agente puede publicar sin autorización humana; los gates territoriales, AR, Share y governance permanecen separados del routing nominal.

## 10. Pendientes separados

**De estas micro-órdenes:** no quedan campos documentales dentro del alcance. Queda únicamente la revisión de Human Authority de la exactitud de la clasificación.

**De la micro-orden anterior:** confirmar formalmente la diferencia entre ruta nominal y conexión operativa; Legal y Distribution permanecen `NO_DATA` por sus gates.

**De E.1:** revisión tRPC adicional de `agentRoute` y decisión sobre Legal & Compliance; no se activa automáticamente.

**De Fase F:** pruebas físicas de GPS, cámara, offline, conflictos y operación real de Mapper/The Eye.

**De Orden 60:** cobertura ampliada de abuso/IDOR, seguridad frontend, infraestructura productiva externa y validación de dominio/headers.

**Futuras:** Fase G y cualquier creación o activación de agentes requieren una orden independiente y autorización explícita.

## 11. MJP CORE

**SIN MODIFICACIÓN.** No se modificaron RNG, RTP, wallet, ledger, settlement, rules, créditos, juegos protegidos ni `MjpTvManifest`. El inventario solo verificó boundaries existentes.

## 12. Estado de Fase G

**FASE G — NO INICIADA.** La detención obligatoria de ambas micro-órdenes fue respetada.

## 13. Limitaciones

No existe en el estado revisado un remoto GitHub público que permita generar enlaces `github.com/...` verificables. Por eso este reporte usa rutas relativas al repositorio y enlaces a tests/lineas. Tampoco se realizó publicación, activación, prueba física ni verificación de proveedores externos, porque ambas micro-órdenes lo prohíben.

## 14. Referencias internas

1. [`AGENT_REGISTRY`](../shared/agentRegistry.ts) — estados, modos, boundaries y ubicaciones declaradas.
2. [`AGENT_AUTONOMY_BACKLOG`](../shared/agentAutonomyBacklog.ts) — contratos, entregables seguros y gates humanas.
3. [`Agent Router`](../shared/agentRouter.ts) — `ROUTE_MAP` y límites de routing.
4. [`admin.agentRoute`](../server/routers.ts#L1440-L1442) — procedure administrativa protegida.
5. [`agentRegistry.test.ts`](../shared/agentRegistry.test.ts), [`agentAutonomyBacklog.test.ts`](../shared/agentAutonomyBacklog.test.ts), [`agentRouter.test.ts`](../shared/agentRouter.test.ts), [`agentSafeCapability.test.ts`](../shared/agentSafeCapability.test.ts), [`mjpCoreIsolation.test.ts`](../shared/mjpCoreIsolation.test.ts) — evidencia de tests PASS.

**Cierre:** inventariar, demostrar y detenerse. Human Authority conserva la decisión sobre cualquier fase o activación posterior.
