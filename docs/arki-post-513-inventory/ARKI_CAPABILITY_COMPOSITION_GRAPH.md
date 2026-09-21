# ARKI Capability Composition Graph

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Grafo conceptual

```text
VOICE TRANSCRIPTION adapter ─┐
ARKI-BOOK UI/content ─────────┼─[missing adaptive dialogue + assessment contract]→ LIVING VOICE TUTOR
REASONING/EVALUATION ─────────┘

CAMERA/OCR ───────────────┐
VISUAL FIELD ──────────────┼─[missing architectural visual semantics + spatial correspondence]→ VISUAL PROJECT REVIEW
PROJECT GEOMETRY ──────────┘

USER IDENTITY ─────────────┐
BOOK + EVALUATION ──────────┼─[missing learner state, enrollment, sandbox]→ STUDENT PRODUCT
PROJECT SNAPSHOT ───────────┘

PROJECT VERSION ───────────┐
REASONING + REVIEW ──────────┼─[missing professional scope/signature/jurisdiction]→ PROFESSIONAL WORKFLOW
PROVENANCE ─────────────────┘

TOPOLOGY/GEOMETRY ─────────┐
STRUCTURAL/MEP absent ──────┼─[missing discipline model and coordination graph]→ SPECIALIST ECOSYSTEM
PROJECT STATE ──────────────┘
```

## Existing edges versus missing edges

Local edges already demonstrated are `snapshot→retrieval→reasoning`, `reasoning→topology`, `topology→diagnostic geometry`, `source→OCR→AI_PROPOSED`, and `project→version→human review`. Missing edges include `Book→assessment`, `audio→transcription consumer`, `vision→architectural semantics`, `geometry→change management`, and `identity→professional authority`.

## Classification

**REUSE:** existing nodes and local edges. **CONNECT:** Book, evaluation, project and reasoning. **EXTEND:** learner state, visual correspondence, professional review package. **BUILD:** discipline coordination, corporate services and strong identity. **RESEARCH:** causal semantic interpretation, regulatory reasoning and reliable generalization.

## Evidence and limitations

`client/src/pages/ArkiBookPage.tsx` is a frontend catalog; `voiceTranscription.ts` exports an adapter without an observed consumer; `_core/map.ts` exposes Google Maps types/proxy but no verified call path; `docs/arki-d63g/D6.3-G-REPORT.md` limits SVG to diagnostics. The graph is a planning artifact derived from audit evidence, not an implementation or authorization. Human gates remain mandatory.

## Referencias
[1] `server/_core/voiceTranscription.ts`
[2] `client/src/pages/ArkiBookPage.tsx`
[3] `server/_core/map.ts`
[4] `server/visualField.ts`
[5] `server/arkiD63GeometricBridge.ts`
[6] `docs/arki-d63g/D6.3-G-REPORT.md`
