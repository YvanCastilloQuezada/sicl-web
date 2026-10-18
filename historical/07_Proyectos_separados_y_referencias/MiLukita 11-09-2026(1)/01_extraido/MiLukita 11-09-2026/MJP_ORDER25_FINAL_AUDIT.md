# MJP Order 25 — Informe final de auditoría técnica

**Fecha de corte:** 26 de agosto de 2026  
**Proyecto:** `ruleta-peru-online` / Multi Juegos Perú  
**Estado operativo:** piloto de créditos virtuales; dinero real, pagos y retiros desactivados.  
**Regla de interpretación:** `CODE_EXISTS` no equivale a `PRODUCTION_READY`.

## Resumen ejecutivo

La Orden 25 fue implementada como una ampliación incremental del monolito modular existente. Se reutilizaron el Game Core, Event Engine, manifest TV, QR HMAC, Event Store, Scheduler previo, contingencia, watchdog y Kill Switch. No se introdujo una segunda fuente de verdad para resultados, reglas, premios o RTP.

La ampliación incorpora un Experience Engine formal con estados, fases y plantillas; validaciones de Scheduler con lifecycle `DRAFT → APPROVED → PUBLISHED`; contexto de experiencia en `MjpTvManifest v1`; QR contextual con expiración y sesión efímera firmada; contratos seguros para autonomía y contenido; contingencia con preservación explícita de la autoridad del resultado; y una ruta `/control-room` protegida por rol administrativo.

La validación técnica final de esta fase reporta **100 pruebas aprobadas y 4 omitidas**, en **34 archivos aprobados y 1 archivo omitido**. El build de producción terminó correctamente. La concurrencia real contra base de staging permanece bloqueada porque no se ha proporcionado una `STAGING_DATABASE_URL` aislada; no se inventan métricas de rendimiento.

## A. Estado anterior

Antes de la Orden 25 ya existían Game Core, Event Engine, broadcast TV/overlay, `MjpTvManifest v1`, QR firmado por ronda, Event Store, control operativo, watchdog básico, Kill Switch, Scheduler de propuestas, contingencia y analítica no-PII. El Scheduler era principalmente in-memory; no existía un contrato formal de Experience OS ni una ruta consolidada de Control Room.

## B. Estado posterior

El sistema ahora puede representar una experiencia virtual con `experienceId`, plantilla, fase, modo TV, modo móvil e interacción. El manifest conserva a MJP Core como fuente autoritativa y distribuye el contexto a TV, overlay y QR. El Scheduler valida prerequisitos y no permite aprobación/publicación de una propuesta bloqueada. La autonomía tiene niveles y allowlist; el modo `STOPPED` impide acciones de autopilot. El contenido tiene fallback seguro. La contingencia conserva snapshot y declara `resultAuthorityPreserved: true`.

## C. Componentes creados o modificados

| Componente | Evidencia | Resultado |
| --- | --- | --- |
| `MJP_SYSTEM_AUDIT_ORDER25.md` | Auditoría inicial | Creado |
| `shared/experienceEngine.ts` | Estados, fases, plantillas, transición | Ampliado |
| `shared/experienceEngine.test.ts` | 3 pruebas | Creado |
| `server/schedulerEngine.ts` | Validación y lifecycle | Ampliado |
| `shared/tvManifest.ts` | Contexto de experiencia | Ampliado |
| `server/broadcast.ts` | QR contextual y firma compatible | Ampliado |
| `server/routers.ts` | Inputs tRPC enriquecidos | Ampliado |
| `shared/autonomyEngine.ts` | Niveles y allowlist | Creado |
| `shared/contentEngine.ts` | Fact/content/fallback | Creado |
| `shared/contingencyEngine.ts` | Escenarios y pasos | Ampliado |
| `shared/order25Engines.test.ts` | 4 pruebas de seguridad | Creado |
| `client/src/pages/ControlRoom.tsx` | Centro operativo protegido | Creado |
| `client/src/App.tsx` | Ruta `/control-room` | Modificado |
| `docs/*.md` | Arquitectura, Scheduler, Second Screen, Autonomy, Content, Contingency, Test Matrix | Creados |

## D. Componentes reutilizados

Se conservaron `server/pilot.ts`, `shared/eventEngine.ts`, `server/eventStore.ts`, `server/autonomy.ts`, `shared/avatarScripts.ts`, `server/broadcast.ts`, `client/src/pages/BroadcastPage.tsx`, `shared/tvManifest.ts`, `server/tvOverlay.e2e.test.ts`, el esquema Drizzle existente y las políticas de créditos virtuales. No se creó otro motor de sorteo ni otra wallet.

## E. Pruebas ejecutadas

| Tipo | Resultado |
| --- | --- |
| TypeScript `pnpm check` | Aprobado |
| Suite completa `pnpm test -- --run` | 100 aprobadas, 4 omitidas |
| Archivos de prueba | 34 aprobados, 1 omitido |
| Pruebas nuevas Experience Engine | 3 aprobadas |
| Pruebas nuevas autonomía/contenido/contingencia/Scheduler | 4 aprobadas |
| TV manifest | 5 aprobadas |
| QR broadcast | 5 aprobadas |
| Build `pnpm build` | Aprobado |
| E2E completo Program→Block→Event→Next Event | No disponible: no existe persistencia completa de PROGRAM/BLOCK/EVENT |
| Concurrencia MySQL/TiDB staging | Bloqueada: falta `STAGING_DATABASE_URL` |

Las cuatro pruebas omitidas corresponden a la suite de navegador marcada para ejecución condicionada; no se cuentan como aprobadas. La suite HTTP y los tests de integración reversibles existentes sí forman parte de las aprobaciones reportadas.

## F. Matriz de madurez

| Componente | Código | Unit test | E2E | Validación manual | Producción | Bloqueo |
| --- | --- | --- | --- | --- | --- | --- |
| Game Core | Sí | Sí | Parcial | Sí | No | RNG independiente |
| Event Engine | Sí | Sí | Parcial | Sí | No | Persistencia E2E de programa |
| Experience Engine | Sí | Sí | No | No | No | E2E principal |
| Scheduler | Sí | Sí | No | Parcial | No | Tablas PROGRAM/BLOCK y aprobación E2E |
| TV | Sí | Sí | Sí | Sí | No | QA físico continuo |
| Mobile/Second Screen | Sí | Sí | Parcial | Sí | No | sesión persistida y latencia |
| QR | Sí | Sí | Sí | Sí | No | replay/expiración independiente |
| Realtime | Sí | Sí | Parcial | Parcial | No | WebSocket/SSE no activado |
| Autonomy | Sí | Sí | No | Parcial | No | staging y aprobación operacional |
| Avatar | Sí, guiones | Sí | No | No | No | Avatar 3D/TTS |
| Content | Sí, determinista | Sí | No | No | No | proveedor IA futuro |
| Contingency | Sí | Sí | No | Parcial | No | recovery testing staging |
| Watchdog | Sí | Sí | Parcial | Sí | No | métricas de todos los componentes |
| Control Room | Sí | No dedicado | No | Parcial | No | E2E admin |
| Mathematics | Sí | Sí | Parcial | Sí | No | certificación independiente |
| Security | Sí | Sí | Parcial | Sí | No | pentest y revisión externa |

## G. Qué está realmente operativo

Está operativo en el piloto virtual el flujo de rondas existente, la proyección de eventos, el manifest TV/overlay, QR firmado por ronda, polling, contingencia visual, control de modo, watchdog básico, Event Store, auditoría de rondas, pruebas de RTP, billetera virtual y claim transaccional de cierre. El nuevo Control Room es accesible para rol admin y observa APIs existentes.

## H. Qué está simulado

La publicación de programas y bloques sigue siendo una propuesta en memoria; Experience Engine y autonomía se prueban como contratos deterministas; contenido y Avatar son plantillas; las métricas móviles/latencia completas no están medidas; el realtime avanzado no está activado; y la continuidad autónoma completa no se ejecuta sin staging.

## I. Qué está bloqueado

La concurrencia real requiere `STAGING_DATABASE_URL`. La homologación peruana, certificación RNG independiente, operación con dinero real, pagos, KYC/AML real, geolocalización regulatoria, YouTube API oficial, Avatar 3D, TTS y monetización permanecen bloqueados o fuera de alcance.

## J. Riesgos restantes

El riesgo principal es presentar contratos in-memory como operación completa. También deben validarse carreras de dos procesos contra MySQL/TiDB real, replay de QR contextual, expiración bajo reloj distribuido, autorización administrativa, recuperación después de interrupción durante draw y matriz física por modelo de TV.

## K. Recomendaciones

La siguiente fase debe provisionar una base de staging aislada, ejecutar el runner `scripts/run-concurrency-staging.mjs`, persistir `PROGRAM/BLOCK/EXPERIENCE` mediante migración revisada, automatizar la prueba E2E completa y encargar revisión independiente del RNG, matemáticas, seguridad y marco regulatorio peruano. No se debe activar dinero real mientras estas condiciones no estén cerradas.

## Referencias internas

- `MJP_SYSTEM_AUDIT_ORDER25.md`
- `docs/MJP_EXPERIENCE_OS.md`
- `docs/SCHEDULER.md`
- `docs/SECOND_SCREEN.md`
- `docs/AUTONOMY.md`
- `docs/CONTENT_ENGINE.md`
- `docs/CONTINGENCY.md`
- `docs/TEST_MATRIX.md`
- `docs/STAGING_CONCURRENCY_PROTOCOL.md`
- `docs/RNG_REGULACION_PERU_INFORME_PRELIMINAR.md`
