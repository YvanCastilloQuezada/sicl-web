# ARKI 97A-0 — Knowledge Ownership Map

**Estado:** FORENSIC / CONFLICTS PRESERVED  
**No ownership conflict is resolved by this order.**

## Ownership principles

1. `AKI-001` owns the historical diagnostic audit and its historical interpretation.
2. `ARKI-LKS-001` owns the lifecycle of external knowledge records, source provenance, epistemic transitions, change detection, derived capability views and gap views, once the LKS is independently accepted.
3. `Human Authority` owns canonical promotion, scope, priorities and product decisions.
4. `Tutor` may own learning orchestration only after a separate Academy contract; it does not own canonical knowledge.
5. `Examiner` owns an independent assessment procedure only; it does not own the competency truth.
6. `Oracle` owns versioned reference cases/results only; it does not own ARKI claims.
7. `BKH` owns kernel evidence and invariants within its declared scope; it does not own curriculum or external standards.
8. External standards bodies own their standards; ARKI only records sourced representations and evidence.

## Map

| Concept / artifact | Current semantic owner | Evidence | LKS destination | Conflict / caution | Action |
|---|---|---|---|---|---|
| Historical curriculum | AKI-001 | `AKI001_HISTORICAL_CURRICULUM.md` | Historical curriculum view | Must not be rewritten as current competence | PRESERVE_HISTORICAL |
| Competency baseline | AKI-001 diagnostic | `AKI001_COMPETENCY_MATRIX.md` | Derived competency view | Matrix is not an executable registry | DERIVE_VIEW |
| Learning deficit | AKI-001 diagnostic + future proposal | `AKI001_KNOWLEDGE_GAPS.md` | Gap Register | Gap is not implementation authorization | INTEGRATE |
| External source | External institution + LKS record | LKS source register and evidence | SourceRecord equivalent in existing LKS | No URL-only truth | INTEGRATE |
| External claim | LKS record after curation | `arkiLivingKnowledge.ts` | LivingKnowledgeRecord | Needs evidence and epistemic status | REUSE_AS_IS |
| Knowledge Book lesson | Historical delta author / originating program | BKH/AKI deltas | Claim/evidence reference | Preserve original state and provenance | PRESERVE_HISTORICAL |
| Tutor role | Proposed Academy charter | Document 71 review | Role/protocol adapter | Not implemented | MIGRATE_LATER |
| Examiner role | Proposed Academy charter | Document 71 review | Assessment protocol adapter | Must be independent from Tutor | MIGRATE_LATER |
| Oracle/reference case | Proposed Academy charter | Tutor review | External oracle evidence | Not same as LLM output | MIGRATE_LATER |
| PCB-001 | Proposed Academy diagnostic | Review section D | Future diagnostic package | Dedicated executable artifact not found | UNKNOWN |
| BKH capability evidence | BKH program | BKH reports and outputs | Evidence refs only | BKH is not curriculum owner | DERIVE_VIEW |
| IFC standard meaning | buildingSMART / ISO | Official external sources | LKC-001-IFC | ARKI mapping not implied | INTEGRATE |
| Smart Cities meaning | ISO / ITU / UN-Habitat | Official external sources | LKC-002-SMART-CITIES | KPI semantics require provenance | INTEGRATE |
| UDT meaning | OGC / EU / national programmes | Official sources | LKC-003-URBAN-DIGITAL-TWIN | Model, sensor and twin are distinct | INTEGRATE |
| Canonical ARKI knowledge | Human Authority after governed review | LKS state machine | `CANONICAL` state | No automatic promotion | SUPERSEDE_WITH_TRACEABILITY only by explicit decision |

## Ownership gaps

- No previously implemented universal `HumanDecision` knowledge entity was found; the LKS Human Authority gate is a function, not a replacement for a cross-project entity.
- No dedicated executable Academy/Tutor/Examiner/Oracle registry was found.
- No dedicated PCB-001 implementation or Oracle corpus was found.
- No existing unified Standards Registry was found; existing standard references are distributed across contracts, maps, E6/IFC docs and LKS source register.
- No existing unified Knowledge Package was found.

These are findings, not authorization to create those structures in 97A-0.
