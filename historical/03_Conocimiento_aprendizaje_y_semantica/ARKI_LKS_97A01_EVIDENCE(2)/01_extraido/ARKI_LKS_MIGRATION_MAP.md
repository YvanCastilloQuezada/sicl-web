# ARKI 97A-0 — LKS Migration Map

**Rule:** migrate references and views before migrating data structures. Do not duplicate AKI-001 or create a parallel registry.

| Existing artifact | Source location | Proposed LKS destination | Migration mode | Preconditions | Status |
|---|---|---|---|---|---|
| AKI-001 report and manifest | `AKI001_REPORT.md`, `AKI001_MANIFEST.json` | Historical audit evidence | PRESERVE_HISTORICAL | None; retain hashes | Ready as reference |
| AKI-001 inventory | `AKI001_KNOWLEDGE_INVENTORY.md` | Capability Atlas source view | INTEGRATE | Map each row to evidence refs and state | Candidate |
| AKI-001 competency matrix | `AKI001_COMPETENCY_MATRIX.md` | Derived competency view | DERIVE_VIEW | Do not create duplicate competency truth | Candidate |
| AKI-001 gaps | `AKI001_KNOWLEDGE_GAPS.md` | Gap Register evidence | INTEGRATE | Preserve historical wording and date | Candidate |
| Historical curriculum | `AKI001_HISTORICAL_CURRICULUM.md` | Historical curriculum view | PRESERVE_HISTORICAL | No rewriting | Ready as reference |
| Future curriculum proposal | `AKI001_FUTURE_CURRICULUM_PROPOSAL.md` | Candidate roadmap claims | MIGRATE_LATER | Separate contract and PO authorization | Blocked |
| Multiscale map | `AKI001_MULTISCALE_KNOWLEDGE_MAP.md` | Applicability metadata | ADAPT | Preserve no-extrapolation rule | Candidate |
| Mentor knowledge | `AKI001_ARCHITECT_MENTOR_KNOWLEDGE.md` | Human-origin claims | INTEGRATE | Preserve mentor provenance and non-universal status | Candidate |
| Evidence index | `AKI001_EVIDENCE_INDEX.md` | Evidence references | REUSE_AS_IS | Paths/hashes must remain resolvable | Candidate |
| BKH Knowledge Book deltas | `ARKI_KNOWLEDGE_BOOK_DELTA_*.md` | Historical claim/evidence references | PRESERVE_HISTORICAL | Preserve BKH status and scope | Candidate |
| BKH capability reports | BKH reports/packages | Capability evidence refs | DERIVE_VIEW | Never convert PASS into curriculum mastery | Candidate |
| IFC source register | `ARKI_LKS_SOURCE_REGISTER.md` / IFC docs | LKC-001-IFC source records | INTEGRATE | Source authority and version fields | Staged |
| Smart Cities source register | Same | LKC-002-SMART-CITIES source records | INTEGRATE | Indicator provenance and jurisdiction | Staged |
| UDT source register | Same | LKC-003-URBAN-DIGITAL-TWIN source records | INTEGRATE | Distinguish model, sensor, twin, simulation | Staged |
| LKS runtime | `shared/arkiLivingKnowledge.ts` | Common LKS runtime | REUSE_AS_IS | Independent evidence review | Implemented / pending review |
| Academy/Tutor/Examiner/Oracle roles | Document 71 reviews | LKS role/protocol adapters | MIGRATE_LATER | Academy contract, independent Examiner/Oracle | Not implemented |
| PCB-001 concept | Academy review | Future diagnostic package | UNKNOWN | Dedicated specification, cases, oracle and metrics | Not found |
| Computational Fabric pipeline | `ARKI_COMPUTATIONAL_INTELLIGENCE_ADDENDUM_V1.md` | Architecture reference and future adapters | INTEGRATE | Do not create second graph or second claim store | Candidate |
| Standards references scattered in contracts | UI/BIM contracts, E6, Codebook | LKS source register | CONSOLIDATE through LKS only | Reconcile versions and ownership before consolidation | Candidate |

## Migration order

1. Preserve AKI-001 and historical deltas unchanged.
2. Link existing evidence to LKS records without copying it into a second store.
3. Derive Capability Atlas and Gap Register views.
4. Reconcile standards references into the existing LKS source register.
5. Design Academy/Tutor/Examiner/Oracle adapters only after a separate contract.
6. Define PCB-001 only after the ownership and evidence model is approved.
7. Promote claims to canonical only through Human Authority.

## Prohibited migration shortcuts

- Do not rename AKI-001 as a new curriculum.
- Do not create `StandardsRegistry` beside the LKS source register.
- Do not create `CompetencyRegistry` beside the AKI matrix and LKS derived view.
- Do not copy Knowledge Book deltas into a new Knowledge Package without traceability.
- Do not treat a contract, source URL or generated explanation as verified competency.
