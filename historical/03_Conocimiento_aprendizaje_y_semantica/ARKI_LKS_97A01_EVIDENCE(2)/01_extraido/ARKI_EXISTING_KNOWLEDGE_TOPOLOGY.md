# ARKI 97A-0 — Existing Knowledge Topology

**Estado:** FORENSIC BASELINE / NO NEW KNOWLEDGE STRUCTURE IMPLEMENTED  
**Fecha:** 23 de septiembre de 2026  
**Regla:** AKI-001 se reutiliza; no se repite.

## Findings

ARKI no tiene una única biblioteca computable de conocimiento anterior al LKS. Tiene un conjunto de artefactos documentales, contratos, evidencias de código y propuestas de aprendizaje con owners y estados distintos. La mayor parte de Academy/Tutor/Examiner/Oracle y PCB-001 es contractual o estratégica; no existe evidencia de un runtime ejecutable equivalente en el repositorio.

## Forensic inventory

| Artifact/module | Location | Purpose | Semantic owner | Data model | Current status | Evidence | Overlap | Proposed LKS destination | Action |
|---|---|---|---|---|---|---|---|---|---|
| AKI-001 report | `AKI001_REPORT.md` | Cerrar auditoría diagnóstica del conocimiento existente | AKI-001 / Human Authority | Markdown + manifest | VERIFIED AS DIAGNOSTIC AUDIT | Report and 10+ AKI files | Baseline for all learning maps | `LKS evidence / historical baseline` | PRESERVE_HISTORICAL |
| AKI-001 knowledge inventory | `AKI001_KNOWLEDGE_INVENTORY.md` | Listar competencias por disciplina y escala | AKI-001 | Markdown table | VERIFIED as audit artifact | Local code/test references | Overlaps capability atlas | `capability assessment inputs` | INTEGRATE |
| AKI-001 competency matrix | `AKI001_COMPETENCY_MATRIX.md` | Separate exposure, practice, test and verification | AKI-001 | Markdown matrix | VERIFIED as diagnostic | Matrix with confidence and deficits | Overlaps LKS Capability Atlas | `competency baseline view` | DERIVE_VIEW |
| AKI-001 knowledge gaps | `AKI001_KNOWLEDGE_GAPS.md` | Record computational, disciplinary, normative and scale gaps | AKI-001 | Markdown register | VERIFIED as diagnostic | Explicit unknowns and limits | Overlaps LKS Gap Register | `gap evidence / historical source` | INTEGRATE |
| Historical curriculum | `AKI001_HISTORICAL_CURRICULUM.md` | Reconstruct what was studied, not what should be studied | AKI-001 | Markdown narrative | VERIFIED as historical reconstruction | Eight observed learning areas | Must not become new curriculum engine | `historical curriculum source` | PRESERVE_HISTORICAL |
| Future curriculum proposal | `AKI001_FUTURE_CURRICULUM_PROPOSAL.md` | Propose future levels and gates | Human Authority / proposal | Markdown | PROPOSAL / NOT IMPLEMENTED | Explicit contract requirement | Overlaps future Academy curriculum | `candidate learning roadmap` | MIGRATE_LATER |
| Multiscale knowledge map | `AKI001_MULTISCALE_KNOWLEDGE_MAP.md` | Bound knowledge by scale | AKI-001 | Markdown table | VERIFIED as diagnostic | No-extrapolation rule | Overlaps applicability fields in LKS | `applicability metadata` | INTEGRATE |
| Architect mentor knowledge | `AKI001_ARCHITECT_MENTOR_KNOWLEDGE.md` | Separate Product Owner vision from external facts | Human Authority | Markdown table | STRUCTURED / not universal truth | Explicit provenance warning | Overlaps source/provenance model | `human-origin knowledge claims` | INTEGRATE |
| AKI evidence index | `AKI001_EVIDENCE_INDEX.md` | Point to code, tests, docs and mentor evidence | AKI-001 | Markdown lists | VERIFIED as index | Source paths and limits | Overlaps LKS Evidence refs | `evidence references` | INTEGRATE |
| Knowledge Book deltas | `ARKI_KNOWLEDGE_BOOK_DELTA_BKH1.md`, `...BKH4_95A.md`, `...BKH4_3.md` | Record kernel lessons and bounded principles | BKH / AKI-001 | Markdown deltas | Historical, mixed implementation states | BKH reports and tests | Overlaps claims and lessons | `historical claim evidence` | PRESERVE_HISTORICAL |
| LKS framework | `shared/arkiLivingKnowledge.ts` | Version, curate and compare external knowledge | ARKI-LKS-001 | TypeScript records/functions | IMPLEMENTED / PENDING REVIEW | LKS test PASS, no canonical promotion | Intended common destination | `canonical LKS runtime` | REUSE_AS_IS |
| LKS source register | `ARKI_LKS_SOURCE_REGISTER.md` | List initial official external sources | ARKI-LKS-001 | Markdown tables | STAGED / NOT CANONICAL | IFC, Smart Cities, UDT sources | Overlaps standards registry concept | `source records / staged` | INTEGRATE |
| LKS Capability Atlas | `ARKI_LKS_CAPABILITY_ATLAS.md` | Compare external concepts to ARKI capabilities | ARKI-LKS-001 | Markdown derived view | STAGED / DERIVED | Ten initial assessments | Overlaps AKI competency matrix | `derived capability view` | DERIVE_VIEW |
| LKS Gap Register | Same Capability Atlas | Record gaps and decisions | ARKI-LKS-001 | Markdown derived register | OPEN / not implementation authorization | Six initial gaps | Overlaps AKI gaps | `gap register` | INTEGRATE |
| Academy / Tutor / Examiner / Oracle charter | `REVISION_DOCUMENTO_71_ARKI_ACADEMY_ADVISORY.md`, `REVISION_CUIDADOSA_TUTOR_Y_E5_2026-09-23.md` | Govern teaching, advising and independent examination | Human Authority / proposed Academy | Markdown contract/review | APPROVE WITH FIXES / NOT IMPLEMENTED | Review explicitly says no implementation | High overlap with future LKS curation and competency records | `role/protocol requirements` | MIGRATE_LATER |
| PCB-001 diagnostic | Documented in Academy review; no dedicated executable artifact located | Define diagnostic baseline | Human Authority / proposed Academy | Contract concept | NOT SPECIFIED / NOT IMPLEMENTED | Required fields listed, no test runner | Overlaps competency baseline | `future diagnostic package` | UNKNOWN |
| Computational Fabric knowledge pipeline | `ARKI_COMPUTATIONAL_INTELLIGENCE_ADDENDUM_V1.md` | Source → extraction → candidate → provenance → validation → graph → competency tests | Architecture proposal | Markdown architecture | STRUCTURED / NOT DEMONSTRATED | Detailed pipeline and states | High overlap with LKS | `architecture reference and future adapters` | INTEGRATE |
| BKH capability evidence | `BKH_KERNEL_CONSOLIDATION_REPORT.md`, BKH reports/packages | Demonstrate kernel capabilities and boundaries | BKH program | Reports, tests, manifests | BKH-1/2 verified scope; BKH-3 review-bound | PASS outputs and explicit firewalls | Overlaps capability evidence, not curriculum | `evidence refs only` | DERIVE_VIEW |
| IFC/interoperability | `shared/ifc4/`, `E6_REPORT.md`, IFC fixtures/tests | Export/parse bounded IFC4 capability | E6 / IFC adapter | TypeScript + fixtures + outputs | PARTIAL / bounded | Fixtures and web-ifc tests | Overlaps LKC-001-IFC | `external/source + capability evidence` | INTEGRATE |
| Standards/domain references | Master Project Map and LKS register | Identify IFC, CityGML, Smart Cities, Digital Twin references | Human Authority / LKS | Markdown references | External references, not ARKI facts | URLs and cautions | Candidate Standards Registry | `LKS source records` | INTEGRATE |

## Topology conclusion

The existing system is a **federation of evidence-bearing documents**, not a pre-existing unified Knowledge Package. The only current reusable runtime destination is the LKS framework. Academy/Tutor/Examiner/Oracle and PCB-001 must not be recreated inside LKS as duplicate modules; their future requirements should become adapters, roles and contracts after a separate authorization.
