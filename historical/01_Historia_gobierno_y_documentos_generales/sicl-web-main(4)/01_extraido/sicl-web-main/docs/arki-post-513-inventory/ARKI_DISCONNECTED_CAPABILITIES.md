# ARKI Disconnected Capabilities

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Clasificación de activos

| Activo | Estado | Evidencia | No hacer |
|---|---|---|---|
| `server/_core/voiceTranscription.ts` | REACHABLE_BUT_UNUSED | exporta `transcribeAudio`; búsqueda no halló consumidor | no declararlo tutor/understanding |
| `server/_core/map.ts` y `Map.tsx` | REACHABLE_BUT_UNUSED/DISCONNECTED | tipos/proxy Google Maps sin ejecución verificada | no declarar GIS activo |
| Command Bar mic/camera affordances | IMPLEMENTED_INTERFACE | tests sólo cubren evento/affordance | no inferir pipeline multimodal |
| D6.1/D6.2/D6.3/E1-K | HISTORICAL/FROZEN | manifests y reports con heads históricos | no reabrir ni tratarlos como runtime actual |
| D6.4 OCR/Visual Field | DEMONSTRATED_PARTIAL | adapters y tests locales | no promover AI_PROPOSED a FACT |
| Cost simulation | HISTORICAL_ONLY/DOCUMENTED_ONLY | `docs/costs/*` | no usar como pricing |
| `docs/arki-inventory/*` | UNKNOWN provenance, untracked | `git status` | no atribuir autoría ni versionado |
| ARKI-BOOK ↔ knowledge/learning | DISCONNECTED | página no usa projectId/tRPC | no duplicar corpus ni declarar tutor |

## Duplicaciones potenciales

Existe riesgo `POTENTIAL_CANONICALIZATION_REQUIRED` entre contenido embebido del Book, M0-K records, learning candidates, project snapshots, representaciones 2D/3D y múltiples manifests. También hay varios conceptos de provenance y versiones entre Core local, docs y reportes. No se corrigió ninguno.

## Clasificación de futuro

**REUSE:** activos con tests y provenance. **CONNECT:** voice/Book/reasoning/evaluation y camera/project/geometry. **EXTEND:** canonical IDs, change sets y learning ledger. **BUILD:** capacidades sin modelo suficiente. **RESEARCH:** semántica multimodal y validación profesional. La clasificación `UNKNOWN` es una hipótesis auditable, no una autorización de reactivación; sólo Chief Architect/PO pueden decidir estado.

## Referencias
[1] `server/_core/voiceTranscription.ts`
[2] `server/_core/map.ts`
[3] `client/src/pages/arki-book.test.ts`
[4] `docs/arki-d64/manifest.json`
[5] `docs/arki-d61/manifest.json`
[6] `docs/arki-e1-k/manifest.json`
[7] `docs/costs/ARKI-HOUSE-A21-S1-COST-SIMULATION.md`
[8] `git status --short`
