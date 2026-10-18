# ARKI Codebook Reconciliation Delta v1.0 Candidate

**Baseline:** ARKI Master Codebook v0.1, based on `main@c62183a5904f02aa0a935572454a5a35f9d167aa`.  
**Current status:** `APPROVED / CANONICAL`.  
**Approval:** 23 September 2026 — Product Owner / Human Authority.  
**Scope:** documentation only. Product, kernel and source code were not modified.

## Reconciled promotions

| Item | Previous documented state | Reconciled state | Evidence boundary |
|---|---|---|---|
| BKH-2 | IMPLEMENTED / PENDING EVIDENCE REVIEW | VERIFIED | Approved BKH-2 contract and corrective closure; no professional solver claim |
| BKH-3 | IMPLEMENTED / PENDING INDEPENDENT EVIDENCE REVIEW | VERIFIED | 92A, 93A and 93C corrective/evidence closure; no canonical commit or professional solver claim |
| BKH4-0/1/2 | HARDENED / PENDING INDEPENDENT VERIFICATION | VERIFIED FOR APPROVED SCOPE | Orders 95 and 95A; identity, revision, state machine and declarative mutation foundation only |
| Orden 95A | HARDENED / PENDING INDEPENDENT VERIFICATION | CLOSED / VERIFIED FOR APPROVED SCOPE | F1, F2 and F3 regression outputs |
| F1 | Pending reconciliation | CLOSED | Restricted `TransactionRevision.status` |
| F2 | Pending reconciliation | CLOSED | Structural JSON-only and closed mutation schema |
| F3 | Pending reconciliation | CLOSED | Seven operation-specific mutation invariants |

## History preservation

The prior reports are not rewritten. Their historical states remain valid as the states recorded at the time of publication. This delta adds a later reconciliation layer after independent verification. No historical meaning is reconstructed for D-series codes or other tokens without sufficient evidence.

## Boundaries that remain open

BKH4-3 and later transaction stages remain blocked. Simulation, canonical mutation, commit, rollback, undo/redo, crash recovery, atomic persistence, legacy migration and ownership consolidation remain outside the verified scope. E5, E6 and E7 remain frozen/partial where their own ledgers state that condition. The Codebook does not promote bounded IFC, MEP or structural fixtures into professional signed capability.

## Files reconciled

`ARKI_MASTER_CODEBOOK.md`, `ARKI_MASTER_PROJECT_MAP.md`, `ARKI_CODEBOOK_FOR_ARCHITECT.md`, `ARKI_CODE_CROSSWALK.md`, `ARKI_CODEBOOK_EVIDENCE_INDEX.md`, `ARKI_CODEBOOK_OPEN_ITEMS.md` and `ARKI_CODEBOOK_MANIFEST.json` were aligned with this delta. `ARKI_TECHNICAL_GLOSSARY_FOR_ARCHITECT.md` required no status correction and remains included in the candidate package.

## Approval gate

The Product Owner approved this Codebook as canonical on 23 September 2026. Future code identifiers must be registered or referenced by the Codebook. Historical identifiers are not renumbered or deleted, and `UNKNOWN` meanings remain `UNKNOWN`.
