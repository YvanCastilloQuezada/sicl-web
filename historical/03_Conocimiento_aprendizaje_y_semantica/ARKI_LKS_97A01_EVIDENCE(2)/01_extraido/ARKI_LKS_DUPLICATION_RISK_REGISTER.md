# ARKI 97A-0 — LKS Duplication Risk Register

**Severity:** HIGH means a new parallel structure could create conflicting truth.

| ID | Duplication candidate | Existing structure | Risk | Detection evidence | Decision/action |
|---|---|---|---|---|---|
| DR-001 | New curriculum | `AKI001_HISTORICAL_CURRICULUM.md` + future proposal | HIGH | AKI-001 already owns historical curriculum | PRESERVE_HISTORICAL; derive views only |
| DR-002 | New competency registry | `AKI001_COMPETENCY_MATRIX.md` + LKS Capability Atlas | HIGH | Two matrices could disagree on confidence/state | DERIVE_VIEW; no new registry yet |
| DR-003 | New learning deficit store | `AKI001_KNOWLEDGE_GAPS.md` + LKS Gap Register | HIGH | Same gaps represented in two places | INTEGRATE into LKS with source refs |
| DR-004 | New Knowledge Book | Existing AKI/BKH Knowledge Book deltas | HIGH | Historical deltas already exist | PRESERVE_HISTORICAL; link, do not copy |
| DR-005 | New Standards Registry | References in Codebook, E6/IFC docs and LKS Source Register | HIGH | Scattered standard references and versions | INTEGRATE through existing LKS source records |
| DR-006 | New Knowledge Package | Computational Fabric pipeline proposal | HIGH | Candidate source/claim/package stages already specified conceptually | MIGRATE_LATER; no package runtime yet |
| DR-007 | Academy knowledge store | Academy/Tutor/Examiner/Oracle charter | HIGH | Proposed SourceRecord and KnowledgeClaim overlap LKS | MIGRATE_LATER as adapters; no duplicate core |
| DR-008 | New PCB-001 database | PCB-001 diagnostic concept | MEDIUM-HIGH | No executable PCB-001 found, but required fields are documented | UNKNOWN; contract before implementation |
| DR-009 | New evidence registry | AKI Evidence Index + BKH manifests + LKS Evidence | HIGH | Multiple evidence inventories already exist | INTEGRATE references; preserve local ownership |
| DR-010 | New IFC knowledge base | E6 IFC adapter and LKC-001-IFC | HIGH | Product capability and external standard can be confused | Separate source claims from product evidence |
| DR-011 | New UDT/Smart Cities ontology | LKS source register + Master Project Map references | HIGH | Domain references are not ARKI entities | STAGED only; no ontology creation |
| DR-012 | New Tutor/Advisor agent | Document 71 role charter | MEDIUM-HIGH | Roles are governance functions, not current modules | MIGRATE_LATER; no parallel agent |
| DR-013 | New professional certification state | Academy proposal and competency states | HIGH | `VERIFIED` could be confused with professional authorization | Preserve `PROFESSIONAL_VALIDATION_REQUIRED` gate |
| DR-014 | New external-source crawler | LKS 15-day cycle concept | MEDIUM-HIGH | Scheduler intentionally not demonstrated | Do not implement in 97A-0 |

## Required anti-duplication controls

- Every future artifact must declare its predecessor or `NO_PREDECESSOR_FOUND`.
- Every migrated claim must retain source path, original state, evidence references and historical date.
- Derived views cannot become owners of semantic truth.
- A new registry requires an explicit Product Owner decision showing why the existing LKS or AKI source cannot be reused.
- Unknowns remain `UNKNOWN`; they cannot be filled by naming a new module.

## 97A-0 result

No duplicate curriculum, Standards Registry, competency registry or Knowledge Package was implemented by this order.
