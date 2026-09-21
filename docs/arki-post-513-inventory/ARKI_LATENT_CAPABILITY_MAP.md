# ARKI Latent Capability Map

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Resultado

Los componentes existen por separado, pero no constituyen los productos compuestos. Todos los siguientes son `LATENT_COMPOSITE_CAPABILITY`, no IMPLEMENTED.

| Target | Componentes existentes | Falta | Esfuerzo |
|---|---|---|---|
| ARKI-BOOK adaptativo | Book UI/content + reasoning + evaluation + OCR/visual | curriculum/learner state, assessment, adaptive dialogue, media contract | CONNECT/EXTEND — HIGH |
| STUDENT | users + Book + projects + evaluations | enrollment, progression, sandbox, privacy and E2E | CONNECT/EXTEND — HIGH |
| PROFESSIONAL | project/version + reasoning + review + provenance | scope, licensure, sign-off, responsibility package | CONNECT/EXTEND — HIGH |
| ARKI-PARTNERS | users + project history + Book | capabilities, education, sharing, status and consent | EXTEND — HIGH |
| SPECIALISTS | conceptual geometry + reasoning + project snapshot | discipline models, interfaces, coordination graph | BUILD/RESEARCH — VERY_HIGH |
| TRUST | identity + version + provenance + audit | strong identity, signatures, revocation, custody | CONNECT/EXTEND — HIGH |
| PRICING | cost simulation + Pareto/evaluations | quantities, rates, region/date, quote and approval | RESEARCH — HIGH |
| ARKI-CONSTRUCT | geometry + visualField/OCR + camera-capable adapters | spatial correspondence, change set, site E2E | CONNECT/EXTEND — VERY_HIGH |
| ARKI-BUILDING | history + geometry + evidence + learning primitives | as-built, operations, telemetry and closed loop | EXTEND/RESEARCH — VERY_HIGH |
| CORPORATE ARKI | auth/context + users + projects + storage | tenancy, billing, CRM, legal, finance, webhooks | BUILD/RESEARCH — VERY_HIGH |

## Evidence and controls

`drizzle/schema.ts` sólo ofrece users y siclProjects básicos. `server/siclCore.ts`, `server/routers.ts`, `server/arkiD62ReasoningHarness.ts`, `server/arkiD63GeometricBridge.ts`, `server/visualField.ts` y `shared/arkiKnowledgeCorpusFoundation.ts` prueban piezas reutilizables. `docs/VERIFICACION_E2E_PENDIENTE.md` impide declarar composites conectados. La autoridad de cada composite requiere Product Owner, Chief Architect y especialistas.

## Criterio de clasificación

**CONNECT** significa que faltan principalmente enlaces y contratos. **EXTEND** exige nuevos estados, datos y pruebas sobre una base existente. **BUILD** indica ausencia de modelo suficiente. **RESEARCH** indica incertidumbre sustantiva de conocimiento o validación. No reactivar adapters ni iniciar construcción bajo esta orden.

## Referencias
[1] `drizzle/schema.ts`
[2] `server/siclCore.ts`
[3] `server/routers.ts`
[4] `server/visualField.ts`
[5] `shared/arkiKnowledgeCorpusFoundation.ts`
[6] `docs/VERIFICACION_E2E_PENDIENTE.md`
[7] `docs/arki-inventory/ARKI_TOTAL_SYSTEM_INVENTORY.md`
