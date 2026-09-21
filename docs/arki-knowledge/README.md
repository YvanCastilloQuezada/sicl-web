# ARKI Knowledge Preservation Package v1.0

**Status:** preserved documentary layer · **runtime ingestion:** disabled · **Control Center:** read-only

This directory preserves the supplied package exactly as versioned Excel sources. The files are indexed for retrieval and traceability; they are not automatically promoted into the canonical runtime knowledge corpus, and no workbook has been rewritten.

## Boundaries

- `RESEARCH ≠ CANONICAL KNOWLEDGE ≠ IMPLEMENTATION`.
- `HISTORICAL ≠ CURRENT`.
- `DOCUMENTED ≠ AUTHORIZED ≠ IMPLEMENTED ≠ INTEGRATED ≠ DEPLOYED`.
- `CURRENT ≠ PRODUCTION ≠ PROFESSIONAL AUTHORITY`.
- `IDEA ≠ ROADMAP`; `PRECEDENT ≠ TEMPLATE`; `SOURCE ≠ KNOWLEDGE`.
- `UNKNOWN BEFORE INVENTING`.
- The Frozen workbook remains documentary/frozen. The External AI Research Format is a template only.

## Preserved workbooks

| # | File | Domain | Purpose / role | Version | Status | Repository path | Rule / boundary |
|---:|---|---|---|---|---|---|---|
| 1 | [01_ARKI_Decisiones_y_Constitucion_v1.0.xlsx](preserved/01_ARKI_Decisiones_y_Constitucion_v1.0.xlsx) | Governance | Constitution/decisions | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/01_ARKI_Decisiones_y_Constitucion_v1.0.xlsx` | Do not rediscuss without evidence/decision |
| 2 | [02_ARKI_Investigacion_y_Hallazgos_v1.0.xlsx](preserved/02_ARKI_Investigacion_y_Hallazgos_v1.0.xlsx) | Research | Findings/provenance | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/02_ARKI_Investigacion_y_Hallazgos_v1.0.xlsx` | Research ≠ canon |
| 3 | [03_ARKI_Historia_y_Evolucion_v1.0.xlsx](preserved/03_ARKI_Historia_y_Evolucion_v1.0.xlsx) | History | Genealogy | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/03_ARKI_Historia_y_Evolucion_v1.0.xlsx` | Historical ≠ current |
| 4 | [04_ARKI_Experimentos_y_Evidencia_v1.0.xlsx](preserved/04_ARKI_Experimentos_y_Evidencia_v1.0.xlsx) | Evidence | Experiments/A–AV | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/04_ARKI_Experimentos_y_Evidencia_v1.0.xlsx` | Result ≠ universal knowledge |
| 5 | [05_ARKI_Capacidades_y_Madurez_v1.0.xlsx](preserved/05_ARKI_Capacidades_y_Madurez_v1.0.xlsx) | Capability | Maturity truth | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/05_ARKI_Capacidades_y_Madurez_v1.0.xlsx` | Research ≠ production ≠ authority |
| 6 | [06_ARKI_UNKNOWN_Gaps_Preguntas_Abiertas_v1.0.xlsx](preserved/06_ARKI_UNKNOWN_Gaps_Preguntas_Abiertas_v1.0.xlsx) | Unknowns | Open gaps | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/06_ARKI_UNKNOWN_Gaps_Preguntas_Abiertas_v1.0.xlsx` | UNKNOWN before inventing |
| 7 | [07_ARKI_Frozen_Future_Architecture_v1.0.xlsx](preserved/07_ARKI_Frozen_Future_Architecture_v1.0.xlsx) | Frozen | FFO/V1–V24 | v1.0 | `FROZEN` | `docs/arki-knowledge/preserved/07_ARKI_Frozen_Future_Architecture_v1.0.xlsx` | Documented ≠ authorized |
| 8 | [08_ARKI_Casos_y_Precedentes_Arquitectonicos_v1.0.xlsx](preserved/08_ARKI_Casos_y_Precedentes_Arquitectonicos_v1.0.xlsx) | Architecture | Cases/precedents | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/08_ARKI_Casos_y_Precedentes_Arquitectonicos_v1.0.xlsx` | Precedent ≠ template |
| 9 | [09_ARKI_Fuentes_y_Biblioteca_Arquitectonica_v1.0.xlsx](preserved/09_ARKI_Fuentes_y_Biblioteca_Arquitectonica_v1.0.xlsx) | Sources | Library | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/09_ARKI_Fuentes_y_Biblioteca_Arquitectonica_v1.0.xlsx` | Source ≠ knowledge |
| 10 | [10_ARKI_Tipologias_Arquitectonicas_v1.0.xlsx](preserved/10_ARKI_Tipologias_Arquitectonicas_v1.0.xlsx) | Architecture | Typology knowledge | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/10_ARKI_Tipologias_Arquitectonicas_v1.0.xlsx` | Typology ≠ occupancy |
| 11 | [11_ARKI_Ideas_No_Implementadas_v1.0.xlsx](preserved/11_ARKI_Ideas_No_Implementadas_v1.0.xlsx) | Ideas | Idea parking lot | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/11_ARKI_Ideas_No_Implementadas_v1.0.xlsx` | Idea ≠ roadmap |
| 12 | [12_ARKI_Libro_Arquitectura_Conocimiento_Maestro_v1.0.xlsx](preserved/12_ARKI_Libro_Arquitectura_Conocimiento_Maestro_v1.0.xlsx) | Book | Master architectural book knowledge | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/12_ARKI_Libro_Arquitectura_Conocimiento_Maestro_v1.0.xlsx` | Book knowledge stays traceable |
| 13 | [13_ARKI_Formato_Investigacion_IA_Externa_v1.0.xlsx](preserved/13_ARKI_Formato_Investigacion_IA_Externa_v1.0.xlsx) | Research Ops | External AI delivery template | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/13_ARKI_Formato_Investigacion_IA_Externa_v1.0.xlsx` | External AI ≠ canonical authority |

## Package manifest

The machine-readable manifest with SHA-256 hashes is [`package-manifest-v1.0.json`](package-manifest-v1.0.json). The supplied macroorder is preserved as [`MACROORDEN_MANUS_ARKI_KNOWLEDGE_PRESERVATION_PACKAGE_v1.0.txt`](MACROORDEN_MANUS_ARKI_KNOWLEDGE_PRESERVATION_PACKAGE_v1.0.txt).

## Control Center registration

The package is registered read-only under **Knowledge → Preserved Registers** and **Documents**. The Control Center exposes metadata and repository paths only; it does not duplicate workbook contents into the database.

## External evaluation evidence

The external evaluation **DS-EVAL-01 / EXTERNAL_EVALUATION_EVIDENCE_001** is preserved separately under [`external-evaluations/DS-EVAL-01/`](external-evaluations/DS-EVAL-01/). The workbook is attributed to **DeepSeek** with `CONSULTATIVE ONLY` authority and `REVIEWED / DISPOSITIONED` status. It is indexed in the Control Center as **External Evaluation Evidence #001 — DS-EVAL-01**. The original external report was not provided and remains `NOT PROVIDED / UNKNOWN`; no finding, candidate constitutional rule or research package is automatically canonized or implemented.

## Fundamental knowledge preservation

The FKCG-02 workbook is preserved under [`fundamental-research/FKCG-02/`](fundamental-research/FKCG-02/) as **PRESERVED / REVIEWED / NOT CANONIZED / NOT IMPLEMENTED**. It records the A–F responsibility map, source genealogy, surviving principles, corrections, UNKNOWNs and DG-01–DG-05 demonstration gaps. It does not create a new system, engine, primitive, schema or runtime capability; DG-01 remains `SPECIFICATION_PENDING_PRODUCT_OWNER_AUTHORIZATION`.

## Demonstration gates

The original DG-01 applicability specification is preserved under [`demonstration-gates/DG-01/`](demonstration-gates/DG-01/) as **SPECIFIED / NOT IMPLEMENTED / NOT DEMONSTRATED**, with execution superseded by DG-01B. The DG-01B protocol is a documentary correction that adds strict oracle separation, anonymous cases, B1–B8 blind mutations, five composite cases, positive/negative controls, justification and conditional-applicability contracts, multi-state reporting and revised P1–P12 falsification criteria. It does not authorize execution, a new applicability engine, ontology changes, runtime work, learning promotion or DG-02.

## Parti documentary contract

The typed `PARTI-CONTRACT-1.0` is implemented in [`server/arkiPartiContract.ts`](../../server/arkiPartiContract.ts) and documented in [`arki-parti/PARTI_CONTRACT_REPORT.md`](../../arki-parti/PARTI_CONTRACT_REPORT.md). It records the organizing hypothesis and its provenance, topology and geometry lineage without creating a new design engine. The focused proof covers three parti hypotheses, an adversarial functional rejection, mutation/backtracking and bounded typology adaptation; functional validity remains subject to human review.

The assembled `ARKI-INTEGRATED-ARCHITECT-1.0` cycle is documented in [`arki-integrated-architect/ARKI_INTEGRATED_ARCHITECT_CYCLE.md`](../../arki-integrated-architect/ARKI_INTEGRATED_ARCHITECT_CYCLE.md). It reuses the existing ingestion, knowledge, D6.2, PARTI, topology, D6.3 geometry, evaluation and Human Authority boundaries. Its claim is limited to bounded conceptual architectural synthesis.

The `ARKI-UNIFIED-MOTOR-1.0` registry is documented in [`arki-unified-motor/ARKI_UNIFIED_MOTOR.md`](../../arki-unified-motor/ARKI_UNIFIED_MOTOR.md). It routes active, frozen, historical, blocked and not-demonstrated pieces through one trace while preserving their states and activation gates.

The total activation run `ACT-TER-250-001` is recorded in [`arki-unified-motor/ARKI_ACTIVATION_RUN_REPORT.md`](../../arki-unified-motor/ARKI_ACTIVATION_RUN_REPORT.md) and its machine-readable ledger in [`arki-unified-motor/ARKI_ACTIVATION_RUN_ACT-TER-250-001.json`](../../arki-unified-motor/ARKI_ACTIVATION_RUN_ACT-TER-250-001.json). It reports six proven pieces executed, four frozen references retained, one blocked gate retained and one not-demonstrated capability retained.

The explicit authority profile is documented in [`arki-unified-motor/ARKI_AUTHORITY_PROFILE.md`](../../arki-unified-motor/ARKI_AUTHORITY_PROFILE.md). It grants operational permission to MC-02, MC-03, FKCG-02, DS-EVAL-001 and DG-01B while preserving their evidence, review and human-authority gates.

The broader `ARKI-SYSTEM-AUTHORITY-2.0` profile is documented in [`arki-unified-motor/ARKI_SYSTEM_AUTHORITY_2.0.md`](../../arki-unified-motor/ARKI_SYSTEM_AUTHORITY_2.0.md). It grants the remaining orchestration, research, synthesis, evaluation, representation and audit powers within the one-motor rule.

The lifecycle, budget and BIM contract is documented in [`arki-lifecycle/ARKI_PROJECT_LIFECYCLE_COST_BIM.md`](../../arki-lifecycle/ARKI_PROJECT_LIFECYCLE_COST_BIM.md). It extends ARKI from conception through operation, maintenance and post-occupancy while keeping costs traceable and native BIM exports adapter-dependent.

Advanced geometry and jurisdictional regulation retrieval are documented in [`arki-advanced-geometry/ARKI_ADVANCED_GEOMETRY_AND_JURISDICTION.md`](../../arki-advanced-geometry/ARKI_ADVANCED_GEOMETRY_AND_JURISDICTION.md). The current official Peru source is the Ministry of Housing RNE page; country-specific rules remain source-reviewed and professionally verified.

Photorealistic visual generation, Full HD/4K selection, AR overlay limits and evidence-bounded vision are documented in [`arki-visual-intelligence/ARKI_PHOTOREALISTIC_VISUAL_AND_EVIDENCE_PROTOCOL.md`](../../arki-visual-intelligence/ARKI_PHOTOREALISTIC_VISUAL_AND_EVIDENCE_PROTOCOL.md).

## Gate

`GATE_ARKI_KNOWLEDGE_PRESERVATION_PACKAGE_V1 = PASS`


## Project Brain — Corporation Wave 1

`server/arkiProjectBrain.ts` implements the Wave 1 canonical project state, input-sufficiency gate, problem frame, tension analysis, dynamic parti alternatives, evaluation matrix, Devil's Architect attacks, genealogy and why/removal traces. It is exposed through the protected `projectBrain.analyze` procedure and registered in the Control Center as `ARKI-PROJECT-BRAIN-WAVE-1`. The implementation preserves FACT/ASSUMPTION/UNKNOWN/CONFLICT distinctions and does not claim professional completion, native BIM delivery, or automatic regulatory approval. See `docs/arki-corporation/ARKI_CORPORATION_WAVE1_AND_ROADMAP.md`.


## Corporation Waves 2–5

`server/arkiCorporationWaves.ts` adds the governed Wave 2–5 contract on top of the single `ARKI-UNIFIED-MOTOR-1.0`: measurable performance evidence, lifecycle delivery boundaries, jurisdiction/collaboration readiness, and advisory ecosystem/learning structures. The consolidated state is documented in `docs/arki-corporation/ARKI_CORPORATION_WAVES_2_TO_5.md`. It does not promote UNKNOWN to FACT, certify professional compliance, or claim native BIM/CAD/GIS export.


## Enterprise platform and commercial API

The enterprise boundary is documented in [`arki-enterprise/ARKI_ENTERPRISE_PLATFORM_AND_COMMERCIAL_API.md`](../arki-enterprise/ARKI_ENTERPRISE_PLATFORM_AND_COMMERCIAL_API.md). `server/arkiEnterpriseArchitecture.ts` registers CAD/documentation, simulation, digital twin, cross-project transfer, global multiscale, external ecosystem, Python plugins and enterprise security with maturity and limits. It reuses the single unified motor; it does not create a second brain.

The commercial facade is implemented in [`server/arkiCommercialApi.ts`](../../server/arkiCommercialApi.ts) and exposed through the `commercialApi` tRPC router. Version `v1` requires tenant, actor, plan and idempotency metadata, returns a request/audit envelope, and preserves mandatory human review. The public capability catalog is not a billing or payment system, and planned integrations remain `CONTRACT_ONLY` or `NOT_DEMONSTRATED` until independently connected and tested.


## ARKI Superpowers Pack 1.0

`server/arkiSuperpowersPack.ts` adds five bounded transversal capabilities over the Unified Motor: consequence radar, value-of-information ranking, design divergence, architectural debt and counterfactual exploration. Evidence: `server/arkiSuperpowersPack.test.ts`. Status: `PASS_WITH_BOUNDS / HUMAN_REVIEW_REQUIRED`; no professional, regulatory, structural or construction completion claim.


The external enterprise boundary and unresolved infrastructure gates are recorded in [`arki-enterprise/ARKI_ENTERPRISE_READINESS_GAPS.md`](../arki-enterprise/ARKI_ENTERPRISE_READINESS_GAPS.md). Local contracts and tests are validated; real SICL Core hosting, persistent storage, host firewall/HTTPS, native CAD/BIM/GIS adapters and commercial billing remain external gates and are not claimed as deployed.


## ARKI Multi-Agent Professional System — KR-6.3

The KR-6.3 workbook and its runtime companion are documented in [`arki-agents/ARKI_AGENT_REGISTRY_AND_ORCHESTRATOR.md`](../arki-agents/ARKI_AGENT_REGISTRY_AND_ORCHESTRATOR.md). `server/arkiAgentRegistry.ts` preserves the twelve named agents, six families and the explicit A00–A59 target boundary; `server/arkiAgentOrchestrator.ts` selects bounded specialists and emits structured artifacts over one Unified Motor execution. The protected `agents.orchestrate` procedure is executable with bounds; the public `agents.registry` procedure is read-only. Multi-agent autonomous intelligence is not claimed as demonstrated, and Human Authority remains final.
