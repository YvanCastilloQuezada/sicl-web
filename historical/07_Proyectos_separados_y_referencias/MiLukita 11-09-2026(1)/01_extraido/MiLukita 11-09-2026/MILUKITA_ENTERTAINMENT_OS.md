# MiLukita Entertainment OS

**Versión de arquitectura:** P3 consolidada  
**Estado:** funcional local y reutilizable; operación productiva pendiente  
**Autoridad absoluta:** MJP CORE  
**Fecha de corte:** 27 de agosto de 2026

## 1. Propósito y límites

MiLukita Entertainment OS es la capa de experiencia que organiza programación, presentación, contenido, TV, QR, second screen, agentes, observabilidad y recuperación alrededor de estados autorizados por MJP CORE. Su objetivo de producto es que siempre exista una experiencia programada, sin transformar la IA, Lukita o los agentes en autoridades sobre sorteos, premios o créditos.

El piloto permanece estrictamente virtual. No se habilitan dinero real, pagos, retiros ni conversión de créditos. La publicación, el staging persistente, la prueba multiinstancia real y el QA físico permanecen pausados a pedido del propietario.

## 2. Regla de autoridad

| Dominio | Autoridad | Entertainment OS |
|---|---|---|
| RNG, reglas y resultados | MJP CORE | Solo observa |
| RTP, wallet, créditos, ledger y liquidación | MJP CORE | Sin acceso de modificación |
| MjpTvManifest autoritativo | MJP CORE | Consume la proyección |
| Agenda, presentación, contenido y UI | Entertainment OS | Coordina mediante contratos |
| Alertas y recuperación segura | Watchdog/Recovery bajo política | Alerta, reintenta lectura o escala; no altera resultados |
| Auditoría | Auditor READ_ONLY | Compara y reporta PASS/WARN/FAIL |

La política transversal es **NO DATA → NO CLAIM**. Cuando no existe evidencia, el sistema informa ausencia o incertidumbre; no completa datos de forma especulativa.

## 3. Módulos y contratos reales

| Módulo | Ubicación principal | Entradas y salidas | Autoridad y reutilización |
|---|---|---|---|
| MJP CORE | `server/pilot.ts`, `server/routers.ts` | Solicitudes de juego; rondas, resultados y créditos | Autoridad autoritativa; específico para juegos y financiero |
| Event Engine | `shared/liveChannel.ts`, `shared/live24.ts` | Agenda y reloj; proyección de evento/estado | Reutilizable para eventos programados |
| Scheduler | `server/schedulerEngine.ts`, `server/scheduler/SchedulerService.ts` | Definiciones y claims; eventos programados | Determinista e idempotente; no decide resultados |
| Event Store | `server/eventStore.ts` | Eventos operativos; trazabilidad | Persistencia de observabilidad y claims |
| TV Engine | `client/src/pages/BroadcastPage.tsx`, componentes LIVE | Manifest, estados y agenda; presentación TV | Reutilizable por eventos con manifest |
| Second Screen | `shared/tvManifest.ts`, `shared/onlineTvGames.ts` | Sesión, QR y evento; interacción móvil | Reutilizable; mantiene payload autorizado |
| QR Engine | `shared/circularQr.ts`, `server/broadcast.ts` | Payload firmado/proyección; variantes visuales | Presentación reutilizable; no cambia payload |
| Content Engine | `shared/contentEngine.ts` | Banco y contexto; contenido validado/fallback | Presentacional, con moderación y fallback |
| Lukita Director | `server/lukita/LukitaVoiceEngine.ts` y capas de Script Lab | Estado autorizado; decisión/cues de presentación | Preproducción y presentación; nunca resultados |
| Agent Orchestrator | `server/agentRuntime.ts`, `shared/agentRuntimeAutonomy.ts` | Observaciones y políticas; propuesta/estado | Parcialmente consolidado; permisos explícitos |
| Analytics | `server/productAnalytics.ts`, `shared/entertainmentOs.ts` | Eventos operativos y experiencia; métricas | Separado de datos financieros sensibles |
| Auditor | `server/auditor/AuditorAgent.ts`, `server/auditorAgent.ts` | LIVE, manifest, heartbeat y persistencia; PASS/WARN/FAIL | READ_ONLY |
| Watchdog | `server/watchdog/WatchdogAgent.ts`, `server/autonomy.ts` | Salud y señales; alertas | ALERT_ONLY |
| Recovery | `server/recovery/RecoveryEngine.ts`, `shared/contingencyEngine.ts` | Falla; plan/fallback/reporte | Sin autoridad de resultado |
| Kill Switch | `server/autonomy.ts`, `server/live24Runtime.ts` | Estado de control; STOPPED/maintenance | Detiene experiencia no autorizada, conserva auditoría |

## 4. Flujo común

La cadena reutilizable es:

`SCHEDULE → EVENT → EVENT STATE → EXPERIENCE/PRESENTATION → TV + WEB + SECOND SCREEN`.

La prueba P3 utiliza `TRIVIA_DEMO` como evento sintético no monetario. Se construye una proyección con `MjpTvManifest`, se representa el QR, se invoca Lukita en modo `PREPRODUCTION_PREVIEW`, se simula la contingencia de WebSocket y se verifica el fallback. El flujo no toca RNG, RTP, wallet, créditos, ledger, liquidación, reglas ni el manifest autoritativo.

La decisión de presentación se modela en `shared/entertainmentOs.ts`. Devuelve `showLukita`, mensaje, duración, animación y `contentKey`, pero el campo `result` es siempre `null` y la autoridad queda fijada en `PRESENTATION_ONLY`.

## 5. Agenda viva y autonomía

La agenda determinista de LIVE-24 se encuentra en `shared/liveChannel.ts` y `server/live24Runtime.ts`. La proyección expone evento actual, próximo evento, estados, QR, countdown y contingencia. El worker utiliza claims idempotentes y el simulador de autonomía verifica claves estables y duplicados omitidos.

El panel operativo de `/auditoria-resumen` muestra el reporte `operations.autonomySimulationPreview` con actualización periódica. Debe leerse como simulación local, nunca como disponibilidad productiva. La simulación no ejecuta cron real, red pública, hardware, base compartida multiinstancia ni Watchdog persistente.

## 6. Permisos de agentes

`shared/entertainmentOs.ts` define permisos explícitos para LUKITA_DIRECTOR, EXPERIENCE_AGENT, AUDITOR, WATCHDOG y RECOVERY. Todos tienen lectura; solo Director y Experience Agent proponen; Watchdog alerta; Recovery puede proponer recuperación; ninguno puede modificar juego o resultado. Los campos `rng`, `rules`, `result`, `rtp`, `wallet`, `credits`, `ledger`, `liquidation` y `mjpTvManifest` se tratan como autoritativos y protegidos.

## 7. Chaos y recuperación

El catálogo controlado de escenarios está declarado en `CHAOS_SCENARIOS`: QR, TV, WebSocket, avatar, scheduler, contenido, agente, red, base de datos, stream y Heartbeat. La política requerida es:

`FAILURE → DETECT → CLASSIFY → SAFE FALLBACK → RECOVER → VERIFY → REPORT`.

Cuando la recuperación no es segura, el resultado correcto es `SAFE STOP → ALERTA`. La implementación local existente cubre contingencia, recuperación lógica y preservación de autoridad; la ejecución de cada escenario contra infraestructura real continúa pendiente.

## 8. Clasificación de implementación

| Estado | Alcance |
|---|---|
| **IMPLEMENTADO** | Manifest, TV/QR/second screen, agenda LIVE, scheduler idempotente local, Content Engine v2, Watchdog ALERT_ONLY, Auditor READ_ONLY, Recovery lógico, Kill Switch lógico, panel operativo, permisos explícitos y contrato P3 |
| **PARCIAL** | Orquestación formal de todos los agentes, Director productivo, Experience Agent persistente, chaos engine ejecutable contra servicios reales y observabilidad distribuida |
| **FALTA** | Prueba maestra con usuario real, prueba de 24 horas reales, chaos testing físico, certificación independiente RNG, homologación y revisión regulatoria |
| **NO VERIFICABLE** | Staging persistente, Heartbeat/Watchdog real, dos procesos contra base compartida, QA Smart TV/iOS/Android físico, carga productiva y disponibilidad 24/7 |

## 9. Evidencia local

La prueba `shared/entertainmentOsArchitecture.test.ts` y la prueba contractual `shared/entertainmentOs.test.ts` verifican reutilización, presentación sin autoridad, safe-stop, permisos y catálogo de chaos. La simulación `pnpm simulate:live` produjo 15 eventos, 3 recuperaciones y 0 errores críticos. La simulación de autonomía usa ventana de 24 horas, claims deterministas y duplicados controlados.

Validación de cierre: `pnpm check` aprobado; `pnpm test -- --run` con 64 archivos aprobados, 1 omitido, 202 pruebas aprobadas y 4 omitidas; `pnpm build` aprobado. Las advertencias no bloqueantes del build sobre asset remoto y chunks grandes permanecen registradas como deuda técnica.

## 10. Operación pendiente y gobernanza

| Categoría | Estado |
|---|---|
| Local verificado | Implementación, contratos y suites automatizadas |
| Simulado | LIVE-24, autonomía, claims, recovery y TRIVIA_DEMO |
| Staging | Pendiente; pausado a pedido del propietario |
| Multiinstancia | Pendiente; el harness lógico no sustituye dos procesos reales |
| Hardware | Pendiente; requiere Samsung Tizen, LG webOS, Android/Google TV, iOS y Android reales |
| Producción | Pendiente; no publicar ni activar automáticamente |

El orden de avance recomendado es **integrar → automatizar → testear → romper → recuperar → auditar → documentar**. Antes de habilitar cualquier monetización o publicación se requieren staging persistente, locking distribuido certificado, pruebas de carga, QA físico, revisión legal/regulatoria y certificación independiente del RNG.


## 11. Consolidación adicional de la Orden Maestra

Se añadieron contratos compartidos en `shared/entertainmentOs.ts` para estados de experiencia, decisión de presentación, permisos explícitos, métricas de experiencia y catálogo de escenarios Chaos. La función `buildPresentationDecision` es deliberadamente no autoritativa: recibe estado autorizado, devuelve una decisión de presentación y fija `result: null`.

Se implementó `server/experience/ExperienceAgent.ts` como agente de observación y propuesta. Calcula señales de experiencia a partir de métricas y devuelve recomendaciones con `mode: PROPOSE_ONLY` y `actionsExecuted: false`. No cambia agenda, juegos, resultados ni configuración productiva.

Se implementó `server/chaos/ChaosEngine.ts` como harness local determinista. Ejecuta los 11 escenarios declarados, clasifica cada falla, produce `SAFE_FALLBACK` o `SAFE_STOP`, reporta el resultado y afirma `coreIntact: true` dentro del modelo de prueba. Este harness no sustituye chaos testing de infraestructura real.

Las pruebas `shared/entertainmentOs.test.ts` y `server/entertainmentOsAgents.test.ts` verifican safe-stop, permisos, ausencia de resultado autoritativo, propuestas sin ejecución y cobertura de los 11 escenarios. El estado de operación real no cambia: staging persistente, multiinstancia, hardware, producción y publicación siguen pausados a pedido del propietario.


## 12. Cierre de la Orden Maestra

Se completó la consolidación local segura solicitada. La nueva capa contractual no duplica MjpTvManifest ni crea microservicios; añade únicamente tipos y políticas reutilizables. `ExperienceAgent` queda en `PROPOSE_ONLY`, `ChaosEngine` queda restringido a ejecución local determinista y Lukita permanece limitada a presentación/preproducción.

La cadena reutilizable queda demostrada por `TRIVIA_DEMO` y por las pruebas de contratos. La autoridad de MJP CORE se preserva mediante campos autoritativos protegidos, resultados nulos en decisiones de presentación y recuperación sin autoridad de resultado.

El cierre local de la Orden Maestra fue validado con `pnpm check`, `pnpm test -- --run`, `pnpm simulate:live` y `pnpm build`. Resultado: **66 archivos de prueba aprobados, 1 omitido; 208 pruebas aprobadas, 4 omitidas**; simulación LIVE-24 con **15 eventos, 3 recuperaciones, 0 errores críticos y 100 % de continuidad**; build aprobado. Las advertencias del asset remoto y del chunk del visor 3D son no bloqueantes y quedan como deuda técnica.

No se ejecutaron publicación, staging persistente, Heartbeat/Watchdog productivo, dos procesos reales contra base compartida, QA físico ni producción. Todos permanecen **PAUSADOS / BLOCKED — HUMAN ACTION REQUIRED** por la instrucción del propietario.


## 13. Herramientas administrativas de experiencia

Control Room incorpora tres herramientas de operación humana. `ExperienceAgentProposalsPanel` muestra una observación local y una recomendación del ExperienceAgent con estados PENDIENTE, APROBADA y RECHAZADA. La aprobación solo registra una decisión local de interfaz; no publica configuración ni ejecuta cambios, y mantiene `PROPOSE_ONLY` y `actionsExecuted: false`.

`MasterFlowMonitor` representa el recorrido TV → Lukita → QR → celular → interacción → resultado → TV siguiente. El botón inicia una simulación visual controlada que no crea rondas, no reserva boletos, no mueve créditos y no sustituye el E2E ni la operación real.

`EntertainmentOsHelpPanel` integra dentro de Control Room un resumen consultable de la documentación oficial `docs/MILUKITA_ENTERTAINMENT_OS.md`, incluyendo autoridad, cadena TV→celular, permisos, evidencia y política NO DATA → NO CLAIM. Se declara como solo lectura.


## 14. Mejoras de revisión del Control Room

El panel de propuestas del ExperienceAgent ahora permite filtrar por `PENDIENTE`, `APROBADA` y `RECHAZADA`, además de ordenar por fecha ascendente o descendente. Estas decisiones continúan siendo locales y manuales; no existe publicación automática ni escritura en MJP CORE.

La ayuda de Entertainment OS incorpora búsqueda textual sobre sus temas documentados y abre los resultados cuando existe una consulta. El monitor de la prueba maestra incluye tooltip visual y etiqueta accesible para cada paso, desde TV hasta el siguiente evento, sin afirmar que la simulación sea operación real.

## 15. Character OS y Commercial OS

La entrega de Character OS añade `shared/characterOs.ts`, `CharacterExperiencePanel.tsx` y pruebas de registro, transiciones, canales, silencio, fallback y trazabilidad. Lukita es el único personaje activo; los demás permanecen como `SPEC/MOCK` en revisión. La presentación sigue siendo no autoritativa y no puede modificar MJP CORE.

La entrega Commercial OS añade `/comercial`, `shared/commercialOs.ts`, métricas explícitas `NO_DATA`, inventario filtrable y ordenable, gráfico de pipeline de leads/propuestas y exportación CSV. No se inventan ingresos, audiencia ni conversiones; no hay scraping, campañas externas, proveedores, dinero real ni contratos automáticos.

Regresión actual: `pnpm check` aprobado; 68 archivos de prueba aprobados, 1 omitido; 214 pruebas aprobadas, 4 omitidas; simulación LIVE-24 con 15 eventos, 3 recuperaciones y 0 errores críticos; `pnpm build` aprobado. Permanece una advertencia no bloqueante sobre asset remoto no resuelto en build y chunks grandes del visor 3D.

## 16. Observabilidad avanzada

Control Room incorpora `CharacterEventLogPanel`, un registro local de revisión con filtros por tipo de evento y personaje, y exportación CSV de las filas filtradas. Incluye decisiones de casting, activación de fallback, cambios de estado y acciones Kill/Restore. El registro está etiquetado como `SIMULACIÓN LOCAL` y no se presenta como telemetría productiva.

`CharacterDecisionMonitor` ofrece una ventana determinista de 24 horas simuladas, con frecuencia de aparición por personaje, últimas decisiones y controles de reproducción/pausa. Los datos son un escenario de validación; no son audiencia, retención, disponibilidad ni decisiones autónomas productivas.

Se añadió una verificación de seguridad en `canCharacterAppear`: el personaje debe tener estado activo, evento autorizado, canal permitido y ningún veto de evento o canal. Las apariciones en canales prohibidos se rechazan.

## 17. Revisión temporal y contexto de decisiones

El monitor local de Character OS incorpora una línea de tiempo seleccionable H+1, H+4, H+8, H+12, H+16 y H+20 dentro de la ventana simulada de 24 horas. Cada punto muestra acción, personaje, razón y estado de reproducción; la información se identifica como escenario local y no como operación autónoma productiva.

El mismo monitor resalta los vetos activos de eventos y los canales bloqueados definidos en el registro tipado. La política exige que una aparición cumpla estado, evento, canal y ausencia de veto. El registro de eventos incorpora un modal de contexto que muestra timestamp, evento, personaje, origen, versión de policy, identificador y razón; su exportación CSV conserva los filtros aplicados.

## 18. Distribution OS y ShowState

Se añadió una capa local de `Distribution OS` para clasificar canales, proyectar el master feed desde `MjpTvManifest`, detectar conflictos de programación y bloquear publicación cuando existen conflictos críticos. Los canales Web, Smart TV y Mobile se identifican como clientes internos o preparados para staging; FAST, OTT, IPTV y cable permanecen como `EXTERNAL_REQUIRED` o `BLOCKED` porque no hay proveedor, CDN, DRM, operador, homologación ni publicación externa configurados.

`shared/showState.ts` define una proyección unificada para TV, Web y Mobile con fase, countdown, QR, estado móvil, contingencia, siguiente evento, secuencia e integridad diagnóstica. La proyección declara `MJP_CORE` como fuente autoritativa y `virtualOnly: true`; no crea una fuente de verdad paralela.

La evidencia local se limita a compilación y pruebas de contratos. No se declara operación real FAST/OTT/IPTV/cable, playout profesional, 24/7 productivo, multiinstancia real, QA físico ni homologación.
