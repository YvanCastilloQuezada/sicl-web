# MiLukita — Auditoría arquitectónica Entertainment OS

**Fecha de corte:** 27 de agosto de 2026  
**Proyecto:** `ruleta-peru-online`  
**Checkpoint de trabajo:** posterior a `2ed3f525`  
**Alcance:** auditoría conceptual y técnica local; no publicación, no staging persistente, no hardware físico y no dinero real.

> **Dictamen:** MiLukita ya implementa conceptualmente un **Entertainment OS** en una primera versión técnica. No es todavía una plataforma operativa 24/7 certificada. Su principal evidencia es la existencia de una cadena reusable basada en eventos, manifest, presentación, interacción, observabilidad y contingencia, con MJP CORE como autoridad.

## 1. Resumen del dictamen

El sistema dejó de ser solamente un catálogo de juegos porque contiene una capa de coordinación de eventos, contratos compartidos, experiencia TV, segunda pantalla, QR, contenido, anfitriona, analytics, agentes de observación y recuperación. La arquitectura puede proyectar distintos tipos de experiencia hacia TV y celular sin duplicar el contrato de presentación.

La conclusión debe expresarse con precisión: **Entertainment OS implementado conceptualmente y parcialmente operativo en entorno local**. La palabra “autónomo” debe limitarse a simulaciones y a los componentes que han sido probados localmente. Staging persistente, dos procesos reales, 24 horas reales, QA físico, certificación RNG y regulación continúan fuera de evidencia.

| Resultado | Estado |
|---|---|
| Entertainment OS conceptual | **IMPLEMENTADO** |
| Cadena reusable local | **PROBADA** |
| Operación local de TV y celular | **PROBADA LOCALMENTE** |
| Autonomía simulada | **VERIFICADA EN SIMULACIÓN** |
| Autonomía 24/7 real | **NO VERIFICABLE** |
| Multiinstancia real | **PAUSADA / NO VERIFICABLE** |
| Segundo juego adicional nuevo | **NO CREADO**, conforme a la orden |
| Producción regulada | **NO VERIFICADA** |

## 2. Definición operativa utilizada

Para esta auditoría, Entertainment OS significa una plataforma capaz de programar y ejecutar experiencias de entretenimiento heterogéneas mediante una cadena común:

`CORE → EVENT ENGINE → SCHEDULER → ORCHESTRATOR → TV → QR → SECOND SCREEN → AUDITOR/WATCHDOG → RECOVERY`

El juego concreto debe ser un contenido o adaptador de dominio, no la infraestructura completa. El evento puede ser un sorteo, una trivia, un reto cooperativo, una interacción promocional o un contenido de presentación; el contrato público debe mantener identidad, estado, tiempos, QR, participación, resultado y contingencia.

## 3. Inventario de módulos

| Módulo | Existe | Ubicación principal | Contrato o salida | Dependencias | Desacoplado del juego | Operación real/local |
|---|---|---|---|---|---|---|
| **CORE / MJP CORE** | Sí | `server/pilot.ts`, `server/routers.ts`, `server/db.ts` | Rondas, reglas, resultados, wallet, settlement | DB, reglas, Event Store | Es la autoridad; no debe depender de Lukita | Local probado |
| **Event Engine** | Sí, distribuido | `shared/liveChannel.ts`, `shared/live24.ts`, `server/live24Runtime.ts` | Estados, transiciones, evento actual/próximo | Agenda, tiempo, manifest | Sí; maneja eventos abstractos y juegos | Simulado/probado local |
| **Scheduler** | Sí | `server/scheduler/SchedulerService.ts`, `server/schedulerEngine.ts` | Claims y ciclos programados | Event Store, DB | Sí, mediante `operationalEvents` | Local; persistencia real pausada |
| **Supervised Worker** | Sí | `server/supervisedWorker.ts` | Ciclos idempotentes y claims | Scheduler, Event Store | Sí | Local/simulado |
| **Agent Orchestrator** | Parcial | `server/live24Runtime.ts`, runtime de agentes | Ejecuta o coordina health checks | Heartbeat, Watchdog, Auditor | Parcial; no existe un bus de agentes completo | Local |
| **TV Engine** | Sí | `client/src/pages/BroadcastPage.tsx`, `LiveChannelPanel.tsx` | Render de manifest, fases, temporizador y contingencia | MjpTvManifest, polling/realtime | Sí | Navegador local probado |
| **Second Screen** | Sí, primera versión | `client/src/pages/OnlineTvGamesPage.tsx`, `useRealtimePlayer.ts` | Lobby, JOIN, acciones, reconexión | WebSocket, sesión | Sí para juegos TV en línea | Local; hardware pendiente |
| **QR Engine** | Sí | `server/qr.ts`, `MiLukitaCircularQR.tsx`, contratos QR | Payload y presentación circular | MjpTvManifest, URL, expiración | Sí; presentación no decide payload | Código/pruebas; escaneo físico pendiente |
| **Content/Presentation Engine** | Sí | `shared/contentEngine.ts` | Contenido versionado, rotación, moderación y fallback | Banco de contenido | Sí | Local |
| **Lukita** | Sí como capa visual | `client/src/components/Brand`, `LukitaAvatar`, páginas TV | Guiones, identidad, cues y fallback | Content Engine, UI | Debe permanecer no autoritativa | Local/preview |
| **Lukita Director** | Parcial | `server/lukita/LukitaVoiceEngine.ts`, Script Lab | Cues y preview textual | Scripts, Content Engine | Parcial | Preview; voz/TTS productivo bloqueado |
| **Game Engine** | Sí, por familias | `server/onlineTvGames.ts`, `server/games`, `server/bossFightEngine.ts` | Sesiones, acciones, resultados y ledger virtual | DB, realtime, reglas | Sí por contratos de juego | Local; producción pública pendiente |
| **Analytics** | Sí, primera capa | `ProductAnalyticsBeacon`, `shared/analyticsResilience.ts`, eventos de retención | Eventos de uso y retry | Frontend, storage local/API | Sí | Local; métricas reales pendientes |
| **Auditor** | Sí | `server/auditorAgent.ts`, `server/auditor/AuditorAgent.ts` | PASS/WARN/FAIL, reportes READ_ONLY | Manifest, LIVE, health, Event Store | Sí | Local probado |
| **Watchdog** | Sí | `server/watchdog/WatchdogAgent.ts`, `live24Runtime.ts` | Alertas ALERT_ONLY | Heartbeat, Event Store | Sí | Local; staging persistente pausado |
| **Recovery** | Sí | `server/recovery/RecoveryEngine.ts`, `shared/contingencyEngine.ts` | DETECT/CLASSIFY/FALLBACK/RECOVER/REPORT | Health, snapshots, control | Sí, preservando autoridad | Simulado/local |
| **Kill Switch** | Sí | `server/live24Runtime.ts`, `TvMaintenanceScreen.tsx`, operaciones | STOPPED/KILL SWITCH y mantenimiento | Control de operación | Sí | Lógica/UI local; activación persistente pendiente |

## 4. Contratos clave y flujo de datos

### 4.1 `MjpTvManifest`

`shared/tvManifest.ts` define `MjpTvManifest`. El contrato contiene `schema`, marca, `source`, `experience`, `event`, `participation`, `countdown`, `qr`, `result`, `nextEvent`, `recovery`, `verification` y la extensión opcional `onlineTv`.

La propiedad crítica es `source.system = MJP_CORE` junto con `authoritative = true`. La TV no calcula premios ni resultados. El QR se proyecta en el manifest; la presentación circular no sustituye al payload autoritativo.

### 4.2 LIVE y Event Engine

`shared/liveChannel.ts` modela agenda, evento actual, próximo evento, estados de ciclo, duración y progreso. `shared/live24.ts` y `server/live24Runtime.ts` agregan transiciones, heartbeat, recuperación y reporte. El flujo funciona para un evento de juego y puede proyectar un `SPECIAL_EVENT` sin crear un juego nuevo.

### 4.3 Sesión TV en línea

`shared/onlineTvGames.ts` define `OnlineTvSession`, fases, dificultad, juegos individuales/cooperativos y acciones. `buildOnlineTvManifest` proyecta la sesión al mismo manifest, lo que demuestra reutilización de TV, QR, contador, recuperación y presentación.

### 4.4 Observabilidad

`shared/health.ts` define estados y datos operativos. `server/auditor/AuditorAgent.ts` compara fuentes sin mutarlas. `server/watchdog/WatchdogAgent.ts` permanece en `ALERT_ONLY`. La cadena de diagnóstico aplica `NO DATA → NO CLAIM`.

## 5. Prueba arquitectónica ejecutada

Se creó `shared/entertainmentOsArchitecture.test.ts`. La prueba no crea un segundo juego público ni modifica MJP CORE. Utiliza un evento abstracto con `SPECIAL_EVENT` y un `OnlineTvSession` existente para demostrar que ambos pasan por contratos de manifest, QR circular, marca, second screen y contingencia.

La prueba comprueba que:

1. El evento abstracto conserva `MJP_CORE` como fuente autoritativa.
2. `SPECIAL_EVENT` se representa sin cambiar la infraestructura de TV.
3. El QR se presenta mediante la capa circular sin cambiar su referencia de payload.
4. La sesión TV en línea se transforma en el mismo `MjpTvManifest`.
5. El destino QR contiene la sesión y no una autoridad paralela.
6. La contingencia `WEBSOCKET_DOWN → FALLBACK` preserva `resultAuthorityPreserved = true`.

Resultado local: **1 archivo aprobado, 1 prueba aprobada**. También pasó `pnpm check` después de la prueba.

## 6. Reutilización demostrada

| Cadena | ¿Reutilizable? | Evidencia |
|---|---|---|
| Scheduler → Event Engine | Sí, con limitación distribuida | SchedulerService y live24 |
| Event Engine → TV | Sí | `MjpTvManifest` y `BroadcastPage` |
| TV → QR | Sí | QR circular y payload del manifest |
| QR → Second Screen | Sí, primera versión | `OnlineTvSession` y WebSocket |
| Content → Presentation | Sí | Content Engine v2 y fallbacks |
| Lukita → Presentación | Sí como capa | Scripts/cues, sin autoridad |
| Auditor/Watchdog → Recovery | Sí en local | Health, contingencia y runtime |
| Cambiar juego sin duplicar TV | Sí | `buildMjpTvManifest` y `buildOnlineTvManifest` |
| Cambiar juego sin cambiar MJP CORE | Parcial | Es posible a nivel de contrato; falta prueba operativa distribuida |

## 7. Límites y gaps

| ID | Estado | Gap | Impacto | Prioridad |
|---|---|---|---|---|
| EOS-01 | Falta | Bus u orquestador formal de agentes con contratos de ejecución separados | La coordinación existe distribuida, no como plataforma única | P1 |
| EOS-02 | Parcial | Tokens de sesión específicos y autorización de participante para TV en línea | Riesgo de sesiones ambiguas al escalar | P1 |
| EOS-03 | No verificable | Locking multiinstancia real | Posibles carreras de estado | P1 |
| EOS-04 | No verificable | Heartbeat/Watchdog persistentes en staging | No se demuestra autonomía operativa | P1 |
| EOS-05 | No verificable | Prueba maestra de 15 minutos con usuario real | No se demuestra conversión TV→QR en condiciones reales | P1 |
| EOS-06 | No verificable | Prueba de 24 horas reales | No se puede afirmar canal autónomo continuo | P1 |
| EOS-07 | No verificable | Chaos test con red, DB, QR y agentes reales | Cobertura de fallos limitada a simulación | P1 |
| EOS-08 | Parcial | Origen único de verdad documental del expediente | Hay informes históricos y uno externo nuevo | P2 |
| EOS-09 | Parcial | Code splitting del visor 3D | Chunk grande y mayor carga inicial | P2 |
| EOS-10 | No verificable | QA físico en TV, móviles y navegadores objetivo | Riesgo de compatibilidad de mando, audio y QR | P1 |

## 8. Evidencia y separación de estados

### IMPLEMENTADO

Existen módulos de eventos, Scheduler, manifest, TV, QR circular, second screen, contenido, scripts, juegos, Auditor, Watchdog, Recovery y Kill Switch. Los permisos de agentes mantienen prohibiciones sobre resultados, wallet, RTP, reglas, créditos y manifest autoritativo.

### PARCIAL

La integración es coherente en local, pero el Agent Orchestrator formal, la autorización avanzada de sesiones TV en línea, la coordinación distribuida y la operación persistente todavía no están cerrados.

### FALTA

Falta demostrar el sistema con publicación controlada, dos procesos reales, base compartida, observabilidad persistente, prueba maestra de usuario, prueba real de 24 horas, chaos testing y QA físico. También faltan certificación RNG, revisión legal y homologación antes de cualquier dinero real.

### NO VERIFICABLE

No son verificables desde este entorno la disponibilidad continua, la compatibilidad universal, la resistencia ante fallos de proveedor, la experiencia de usuarios reales, la certificación regulatoria y el comportamiento con carga productiva.

## 9. Resultado de la auditoría P2 asociada

La prueba API E2E que fallaba por `games.confirmTicketBatchPreview` no reveló un bypass de seguridad. La causa fue que el fixture no abría las rondas universales antes de usarlas. Se corrigió en `server/api.e2e.test.ts`, se restauraron los snapshots y la prueba API pasó. La validación server-side de ronda cerrada se conserva como condición negativa.

La regresión posterior reportó 63 archivos aprobados, 1 omitido, 201 pruebas aprobadas y 4 omitidas; `pnpm check`, `pnpm simulate:live` y `pnpm build` pasaron. La simulación registró 15 eventos, 3 recuperaciones, 0 errores críticos y 100 % de continuidad simulada.

## 10. Decisión de arquitectura

Se recomienda denominar formalmente al sistema **MiLukita Entertainment OS — arquitectura de canal digital interactivo gobernado**. Esta denominación describe mejor lo que existe sin afirmar autonomía productiva ni certificación.

No se recomienda añadir nuevos módulos grandes ni otro juego en esta etapa. El siguiente avance debe cerrar evidencia, no aumentar catálogo: prueba maestra TV→QR→celular, staging persistente, multiinstancia, 24 horas reales y chaos testing.

## 11. Actividades pausadas

Por decisión del propietario quedan pausadas la publicación del checkpoint, la activación de Heartbeat/Watchdog persistentes, la certificación de dos procesos reales contra una base compartida, la prueba real de 24 horas y la QA física. Este documento no las presenta como ejecutadas.

## 12. Referencias internas

`shared/tvManifest.ts`, `shared/liveChannel.ts`, `shared/live24.ts`, `shared/onlineTvGames.ts`, `shared/health.ts`, `shared/contingencyEngine.ts`, `shared/entertainmentOsArchitecture.test.ts`, `server/live24Runtime.ts`, `server/scheduler/SchedulerService.ts`, `server/supervisedWorker.ts`, `server/eventStore.ts`, `server/watchdog/WatchdogAgent.ts`, `server/auditor/AuditorAgent.ts`, `server/recovery/RecoveryEngine.ts`, `server/realtime/playerSessionManager.ts`, `client/src/pages/BroadcastPage.tsx`, `client/src/pages/OnlineTvGamesPage.tsx`, `client/src/components/MiLukitaCircularQR.tsx` y `docs/MILUKITA_AUDITORIA_TOTAL_EXTERNA.md`.


## 13. Validación final de esta orden

La regresión ejecutada después de crear la prueba arquitectónica produjo **64 archivos de prueba aprobados, 1 omitido, 202 pruebas aprobadas y 4 omitidas**. `pnpm check` y `pnpm build` terminaron correctamente. La simulación `pnpm simulate:live` produjo 15 eventos programados y completados, 3 recuperaciones exitosas, 0 errores críticos y 100 % de continuidad simulada.

La prueba arquitectónica `shared/entertainmentOsArchitecture.test.ts` pasó y demuestra reutilización del manifest para un evento abstracto y una sesión TV en línea, además de fallback de contingencia preservando la autoridad del resultado. No se añadió un segundo juego público.

El build emitió una advertencia no bloqueante sobre un asset `/manus-storage/ruleta-peru-hero_7732dc7d.png` que queda para resolución en runtime y una advertencia de chunks grandes, incluido el visor 3D. Estas advertencias no invalidan el build, pero deben entrar en el backlog de rendimiento antes de una publicación.

## 14. Dictamen final solicitado

| Clasificación | Componentes |
|---|---|
| **IMPLEMENTADO** | MJP CORE, contratos de evento, manifest, TV, QR, second screen, contenido, juegos, Auditor, Watchdog, Recovery, Kill Switch y analytics inicial. |
| **PARCIAL** | Orchestrator formal, Lukita Director, operación persistente, autorización avanzada de sesiones y locking distribuido. |
| **FALTA** | Prueba maestra con usuario real, 24 horas reales, chaos testing real, certificación RNG, homologación y QA físico. |
| **NO VERIFICABLE** | Multiinstancia productiva, estabilidad de staging, compatibilidad física universal, carga productiva y operación regulada con dinero real. |

La arquitectura debe congelarse funcionalmente en este punto. El siguiente salto recomendado es demostrar el producto con usuarios y fallos controlados, no añadir más juegos.


## 15. Cierre de la Orden P3

La Orden P3 confirmó que la arquitectura actual puede considerarse un **Entertainment OS funcional en sentido arquitectónico local**, porque la cadena común existe y fue ejercitada sin introducir un segundo juego ni modificar MJP CORE. La evidencia concreta es la prueba `shared/entertainmentOsArchitecture.test.ts`: construye `TRIVIA_DEMO`, lo proyecta mediante `MjpTvManifest`, conserva `source.authoritative = true`, pasa por QR circular, invoca el Director de Lukita únicamente en modo `PREPRODUCTION_PREVIEW`, y valida la contingencia `WEBSOCKET_DOWN → FALLBACK` con `resultAuthorityPreserved = true`.

La afirmación no se extiende a operación productiva. La arquitectura es funcional como plataforma local y reutilizable; todavía no está certificada como servicio autónomo 24/7, multiinstancia ni regulado.

| Clasificación P3 | Dictamen |
|---|---|
| **IMPLEMENTADO** | Contratos comunes de evento, estado, manifest, TV, QR, second screen, contenido, observabilidad y recovery; MJP CORE como autoridad. |
| **PARCIAL** | Agent Orchestrator formal, Lukita Director como capa productiva, autorización avanzada de sesiones, locking distribuido y operación persistente. |
| **FALTA** | Prueba maestra con usuario real, 24 horas reales, chaos testing real, QA físico, certificación RNG, homologación y validación regulatoria. |
| **NO VERIFICABLE** | Staging persistente, dos procesos reales contra base compartida, compatibilidad física universal, carga productiva y disponibilidad continua. |

Validación P3: `pnpm check` aprobado; `pnpm test -- --run` con **64 archivos aprobados, 1 omitido, 202 pruebas aprobadas y 4 omitidas**; `pnpm simulate:live` aprobado con **15 eventos, 3 recuperaciones, 0 errores críticos y 100 % de continuidad simulada**; `pnpm build` aprobado. Las advertencias no bloqueantes del build —asset remoto resuelto en runtime y chunks grandes— quedan registradas como deuda técnica de rendimiento.

Por instrucción del propietario, permanecen pausados la publicación, Heartbeat/Watchdog persistentes en staging, certificación de dos procesos reales, QA físico y cualquier paso irreversible.
