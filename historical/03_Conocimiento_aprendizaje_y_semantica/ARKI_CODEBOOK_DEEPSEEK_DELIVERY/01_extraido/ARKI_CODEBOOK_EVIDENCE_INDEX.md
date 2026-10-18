# ARKI Codebook Evidence Index v0.1

**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`  
**Worktree:** dirty before Codebook order; documentation-only files are added by this order.

## Primary evidence groups

| Evidence group | Files / sources | Used for |
|---|---|---|
| Kernel forensic mapping | `BKH0_*`, `BKH_KERNEL_*`, `BKH_KERNEL_CONSOLIDATION_REPORT.md` | BKH-0 status, ownership and historical boundaries |
| Relationship Fabric | `BKH1_*`, `shared/arkiRelationshipFabric.ts`, `BKH1_REPORT.md` | BKH-1 name, role and fixes |
| Constraint Engine | `BKH2_*`, `shared/arkiConstraintEngine.ts`, `BKH2_REPORT.md` | BKH-2 role and bounded status |
| Regeneration Engine | `BKH3_*`, `shared/arkiRegenerationEngine.ts`, `BKH_93C_FINAL_REPORT.md` | BKH-3 role, corrective closure and scope |
| Transaction Engine | `BKH4_TRANSACTION_ENGINE_CONTRACT_V1_1.md`, `BKH4_IMPLEMENTATION_BASELINE.md`, `BKH4_95A_SCOPE_LIMIT_REPORT.md`, `shared/arkiTransactionEngine.ts` | BKH-4 contract/foundation/hardening |
| Historical E-series | `E5_DEBT_INHERITED.md`, `E6_DEBT_INHERITED.md`, `E7_DEBT_INHERITED.md`, `E7_REPORT.md`, `E7_OPENING.md` | E5–E7 frozen/partial status |
| UI program | `ARKI_VEREDICTO_IMPLEMENTACION_UI*.md`, UI packages, UI contracts | UI-1/UI-2/UI-3A nomenclature and status |
| Knowledge program | `AKI001_*`, `ARKI_KNOWLEDGE_BOOK_*` | AKI-001 and curriculum |
| Internal tests | `scripts/test-*.ts`, `ARKI_INTERNAL_VERIFICATION_AUDIT.txt`, BKH outputs | Test names, bounded capabilities and evidence distinctions |
| Standards | IFC references, `shared/ifc4`, web-ifc fixtures | IFC/ISO distinction from ARKI internal codes |

## Forensic method

1. Search file names and contents for code tokens.
2. Compare first available usage against later contracts/reports.
3. Preserve historical names and statuses.
4. Mark insufficient evidence `UNKNOWN`.
5. Do not infer equivalence from numeric similarity.

## Evidence limitations

The repository is a working historical worktree with many untracked artifacts. File presence is not treated as proof of implementation. A test fixture is not treated as professional capability. A contract is not treated as code. A report is not treated as independent verification unless its scope says so.

## Current draft metrics

- Canonical code families explicitly registered in `ARKI_MASTER_CODEBOOK.md`: 40+ grouped entries.
- Raw token families detected by repository search: D*, E*, UI*, AKI*, BKH*, FIX*, OI*, ORDEN 92A–95A and related variants.
- Current/active program entries: BKH-0 through BKH-4 foundation, with BKH-5–7 blocked.
- Historical/frozen entries: D-series, E-series and completed UI phases.
- Unknown or not fully recovered: individual D-series meanings and several isolated historical tokens.

These metrics describe this draft and are not a claim of a final canonical count.
