# ARKI Actual Learning Ledger

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Ledger de claims

| Capacidad | Origen → destino | Diferencias/adaptación | Resultado | Persistencia y validación |
|---|---|---|---|---|
| EXECUTION | snapshot/contexto → `SiclReasoningExecution` | perturbación P1, fallo F1 y contraejemplo C1 | DEMONSTRATED_IN_CONTROLLED_TEST; refine/degraded/partial | ejecución local versionada; revisión humana requerida. |
| RETRIEVAL | `snapshot.knowledge` → IDs recuperados | token overlap, FACT weighting, scope/applicability | DEMONSTRATED_PARTIAL; no adquisición | local; no promoción automática. |
| KNOWLEDGE_ACQUISITION | source/media → OCR/AI_PROPOSED | campos confidence/language/page y UNKNOWN | DEMONSTRATED_PARTIAL; M0-K promotion humana | Core remoto BLOCKED; `AI_PROPOSED ≠ FACT`. |
| ADAPTATION | E1 animal rescue → E1B | cambian capacidad, acceso, demanda y recursos | DEMONSTRATED_PARTIAL; `ADAPT` | manifest/exam local; no regla persistente. |
| TRANSFER | invariant/strategy/hospital → library | TRANSFER para invariant, ADAPT para strategy, DO_NOT_TRANSFER para hospital | DEMONSTRATED_PARTIAL | trace local; no generalización. |
| LEARNING | observación >4 entregas/15 min → K2 case candidate | no es regla universal; requiere más jornadas | DEMONSTRATED_CASE_SCOPED | `HUMAN_REVIEW_REQUIRED`, persistence BLOCKED. |
| GENERALIZATION | E1/E1B/E1C/archive | contextos, actores, riesgos y controles cambian | NOT_DEMONSTRATED | no hay métrica ni validación. |

## Regla de interpretación

No es válido afirmar “ARKI aprendió X” para los renglones de ejecución, retrieval, OCR o transferencia. El único aprendizaje observado es un **candidato semántico case-scoped**, con `K2_CANDIDATE`, `universalCanonization=false` y sin replay persistente sin reintroducir la observación.

## Evidencia y estado

`server/arkiD62ReasoningHarness.test.ts` prueba recuperación, transferencia, perturbación y counterexample. `docs/exams/ARKI-E1-K-BLIND-LEARNING-EXAM-2026-09-20.md` y `docs/arki-e1-k/manifest.json` registran diferencias y estados. `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` fija replay local y bloquea remote write. `docs/arki-m0k/human-promotion-review.json` muestra que la promoción de M0-K fue humana y que KN-000008 no fue promovido.

## Reutilización y límites

**REUSE:** ledger de observación, UNKNOWN, counterexample y replay local. **CONNECT:** ledger↔Core↔Book↔project. **EXTEND:** persistencia longitudinal y métricas. **BUILD:** si se exige aprendizaje autónomo verificable. **RESEARCH:** generalización causal y cross-typology. HUMAN_REVIEW_REQUIRED permanece en toda promoción; no hay autoridad automática.

## Referencias
[1] `server/arkiD62ReasoningHarness.ts`
[2] `server/arkiD62ReasoningHarness.test.ts`
[3] `docs/arki-e1-k/manifest.json`
[4] `docs/exams/ARKI-E1-K-BLIND-LEARNING-EXAM-2026-09-20.md`
[5] `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md`
[6] `docs/arki-m0k/human-promotion-review.json`

## Excel evidence addendum — what the Deltas actually establish

The Excel lineage establishes **research acquisition and formalization**, not autonomous learning. It records candidate invariants, typological abstractions, transfer contracts, learning classes, promotion states, UNKNOWN resolution paths, curriculum exercises and regression protocols. It also records explicit non-claims: retrieval is not learning; execution is not learning; a stored solution is not learning; similarity is not transferability; and generalization requires both positive transfer and transfer restraint.

The strongest retained learning evidence remains the human-promoted M0-K subset (9 FACT/K7 records), while the runtime learning evidence remains case-scoped: E1-K records a K2 candidate with human review required, persistence blocked/not demonstrated and generalization not demonstrated. Excel rows that describe `SUPPORTED`, `TRANSFER_TESTED` or `GENERALIZED_CANDIDATE` are therefore treated as schema/state vocabulary and research targets unless a corresponding runtime event, evidence package, challenge/transfer test and human promotion record exists.

This preserves the required epistemic boundary: **the Deltas taught ARKI what must be represented and tested; they do not, by themselves, prove that ARKI learned every principle they specify.**
