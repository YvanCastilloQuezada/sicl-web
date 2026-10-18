# ARKI Architectural Knowledge Corpus v0.1 — M0-K

## Estado de la orden

**Estado:** `LOCAL_INGESTION_COMPLETE_CORE_PERSISTENCE_BLOCKED`

M0-K implementa una base tipada, aditiva y reutilizable para representar el corpus sin crear un segundo motor de conocimiento, tipología, aprendizaje, provenance o modelo canónico. El workbook fue ingerido localmente como paquete trazable. La persistencia remota en SICL Core permanece bloqueada porque esta sesión no tiene `SICL_CORE_URL` ni `SICL_CORE_SERVICE_TOKEN`.

## A. Repository state

| Campo | Valor |
|---|---|
| Repository | ARKI / SICL Command Center (`/home/ubuntu/sicl-web`) |
| Branch | `main` |
| Baseline HEAD | `ec279e29caee44e1953ddd4dfa6b6690b5fb028c` |
| Final HEAD | Se fijará después de validación y commit |
| Push | Autorizado por M0-K; pendiente de cierre después de pruebas |

## B. Workbook

El workbook `ARKI_Architectural_Knowledge_Corpus_v0.1.xlsx` fue localizado y parseado con `openpyxl`. Contiene 22 hojas: `00_README` a `21_AUDIT`. Las hojas declaran capas DOMAIN, EPISTEMIC, REASONING y LEARNING, separación SOURCE/EVIDENCE/KNOWLEDGE/CASE, rationale graph, typology, transfer, counterexamples, unknowns y rights/provenance.

El workbook define explícitamente límites de derechos: accesibilidad pública no equivale a dominio público, licencia abierta ni autorización de reutilización. Las fuentes White, Neufert y Plazola se mantienen como referencia abstracta y visual parcial; no se realiza ingestión masiva.

## C. Compatibility audit

| Corpus concept | Existing ARKI structure | Coverage | Action |
|---|---|---:|---|
| SOURCE | `SourceForm`, `SourceInput`, SICL source records | PARTIAL | REUSE + EXTEND semantics |
| EVIDENCE | `EvidenceForm`, `EvidenceInput`, visual proposals | PARTIAL | REUSE + EXTEND semantics |
| KNOWLEDGE | `KnowledgeState`, audit/projection contracts | PARTIAL | EXTEND with typed corpus contract |
| DOMAIN | spatial/event records and project contracts | PARTIAL | EXTEND with discriminated records |
| RATIONALE | event model and audit traces | PARTIAL | EXTEND with typed rationale edge |
| SCOPE | project/typology/context fields | PARTIAL | EXTEND as optional scope object |
| TYPOLOGY | guided catalogs and typology chapters | PARTIAL | REUSE; no typology engine created |
| CASE | project, evidence and experiment artifacts | PARTIAL | REUSE; no case→knowledge promotion |
| REASONING | recommendations, comparisons and audit records | PARTIAL | EXTEND with rationale/strategy records |
| STRATEGY | design alternatives and generative contracts | PARTIAL | EXTEND; strategy remains separate |
| REALIZATION | spatial viewer/building representations | PARTIAL | EXTEND link only; no new canonical model |
| TRANSFER | P10 transfer infrastructure | PARTIAL | EXTEND enum semantics |
| COUNTEREXAMPLE | P8/P10 evidence contracts | PARTIAL | EXTEND preservation/refinement semantics |
| LEARNING | P9.4/P10/K-state evidence | PARTIAL | REUSE; human promotion gate preserved |
| UNKNOWN | existing UNKNOWN and epistemic UI states | PARTIAL | EXTEND resolution-path validation |
| RIGHTS/PROVENANCE | source/evidence metadata and ANEXO I | PARTIAL | EXTEND rights/ingestion distinction |

### Reused structures

`SourceInput`, `EvidenceInput`, `KnowledgeState`, existing event/audit records, P9.4/P10 learning contracts, R-PARTI artifacts, ANEXO I provenance, typology catalogues and the existing canonical spatial/building pipeline are reused conceptually. No second engine or second canonical knowledge store is introduced.

### New additive structure

`shared/arkiKnowledgeCorpusFoundation.ts` provides typed records and pure validation helpers for the missing cross-layer contract. It includes source/evidence/knowledge separation, scope, rationale edges, strategy/realization many-to-many links, transfer modes, counterexamples, unknown resolution paths, learning promotion gates and hazard non-canonization status. The ingestion bundle is `docs/arki-m0k/corpus-ingestion.json`; the human promotion review is `docs/arki-m0k/human-promotion-review.json`.

### Explicitly not implemented

Remote persistence in SICL Core until the connector is configured; a complete Manual of Forms database; automatic regulatory canonization; automatic selection of the best architecture; new UI; new 3D/BIM/IFC/DWG work; destructive persistence migrations; and any automatic human decision.

## D. Corpus coverage after M0-K foundation

| Layer | Status | Honest interpretation |
|---|---|---|
| SOURCE | PARTIAL | Existing source forms plus typed source contract |
| EVIDENCE | PARTIAL | Existing evidence forms plus typed evidence contract |
| KNOWLEDGE | PARTIAL | Candidate knowledge is represented but not mass-canonized |
| DOMAIN | PARTIAL | Generic primitives are represented; hazard remains provisional |
| RATIONALE | PARTIAL | Typed WHY edges and trace helper added |
| SCOPE | PARTIAL | Optional multidimensional scope added |
| TYPOLOGY | PARTIAL | Retrieval/context only; not a room-list generator |
| CASE | PARTIAL | Existing case/experiment artifacts remain separate |
| REASONING | PARTIAL | Strategy and rationale structures added |
| STRATEGY | PARTIAL | Separate from realization |
| REALIZATION | PARTIAL | Link contract only; canonical geometry unchanged |
| TRANSFER | PARTIAL | Four transfer modes remain distinct |
| COUNTEREXAMPLE | PARTIAL | Scope refinement preserves original knowledge |
| LEARNING | PARTIAL | Human review required before promotion |
| UNKNOWN | PARTIAL | Incomplete unknowns are detected |
| RIGHTS/PROVENANCE | PARTIAL | Availability is separated from ingestion permission |

## E. Ontology and epistemic invariants

- `SOURCE ≠ KNOWLEDGE` — tested.
- `EVIDENCE ≠ KNOWLEDGE` — tested.
- `CASE ≠ KNOWLEDGE` — preserved by fixture and existing contracts.
- `STRATEGY ≠ REALIZATION` — tested with two realizations for one strategy.
- `UNKNOWN ≠ license to invent` — tested through resolution-path validation.
- `AVAILABLE ≠ INGESTION_ALLOWED` — tested for copyrighted sources.
- `HAZARD` is not silently canonized — tested.
- Human authority remains outside automatic scores and promotion helpers.

## F. Semantic fixture

The generic fixture is intentionally domain-neutral. It represents:

`evidence → condition → requirement → design question → strategy → realization A / realization B → expected effect → evaluation → learning candidate`

It does not hardcode hospital, hotel, terminal, benchmark geometry or a room list. The same strategy produces two materially different realizations, preserving the anti-template requirement.

## G. Tests

The M0-K suite adds T1–T11 for source/knowledge separation, evidence linkage, rationale trace, unknown resolution paths, strategy/realization separation, transfer modes, counterexample preservation, rights gating, hazard status, Manual-as-view and human promotion authority. The pre-existing suite must be run as a regression gate before commit.

## H. ANEXO I / reproducibility

M0-K must be registered in ANEXO I only as experimental/reproducibility evidence. ANEXO I is not a source of architectural knowledge and does not canonize the workbook. The final package must record baseline, audit, mappings, delta, tests, fixture, epistemic states, unknowns, blockers, human decisions and regression status.

## I. Human decisions required

1. Whether `HAZARD` may enter the canonical ARKI ontology beyond provisional proposal status.
2. Whether any future source has rights sufficient for more than abstract/reference-only ingestion.
3. Whether the typed M0-K records should later be persisted additively in SICL Core.
4. Which jurisdictional and regulatory scopes may be promoted to project requirements.

## J. Remaining gaps

The current result is a complete local ingestion bundle, not a complete remote Core projection. Persistent storage in SICL Core, UI projection, full source registry reconciliation and broader transfer/counterexample fixtures remain future bounded work. Nine K3-supported invariants were promoted to `FACT`/`K7_CANONICAL_HUMAN_CONFIRMED` under the user's explicit human-authority instruction; one K2 pattern remains `HYPOTHESIS`.

## Final epistemic state

`LOCAL_INGESTION_COMPLETE_CORE_PERSISTENCE_BLOCKED`

`HUMAN ARCHITECT = FINAL AUTHORITY`
