# BKH-4 Legacy Mutation Migration Matrix v1.1

**Clasificación contractual; no modifica código.**

| Ruta | Current writer | Target state | Classification | Transaction relevance | Migration requirement | Bypass risk | Future treatment |
|---|---|---|---|---|---|---|---|
| GeneratorModule → ProjectContext | UI module / context setter | Building and construction model state | BYPASS_RISK / CANONICAL_CANDIDATE | High | Route through governed intent and mutation set | Direct canonical mutation | Adapter first; then migration |
| arkiRecalculation | Legacy recalculation path | Derived geometry/quantities | LEGACY / DERIVED | High | Declare inputs and derived disposition | May write derived state outside BKH-3 | Governed adapter; deprecate duplicate writer |
| arki4d | Schedule domain writer | Schedule and critical path | DERIVED / OWNERSHIP_UNRESOLVED | Medium | Define schedule owner and revision input | Parallel schedule authority | Architectural decision before migration |
| arki5d | Cost/quantity writer | Quantity, cost and budget | DERIVED / OWNERSHIP_UNRESOLVED | High | Define quantity/cost boundary | Partial updates and stale cost | Governed adapter; no automatic owner consolidation |
| legacy adapters | Compatibility layer | Domain objects and imports | SAFE_ADAPTER or LEGACY per route | Medium/high | Preserve provenance and reject unsupported loss | Silent semantic loss | Loss-reporting adapter and explicit migration |
| persistence writers | IndexedDB/snapshot writers | Snapshots, viewpoints, derived metadata | PERSISTENCE_ADAPTER | High | Atomic durable primitive required | False atomicity from snapshots | Implementation prerequisite; no snapshot shortcut |
| IFC import/export writers | IFC adapters and exporter | External representation/artifact | EXTERNAL / SAFE_ADAPTER | Medium | Separate internal commit from external effect | External effect mistaken for commit | Effect journal and explicit side-effect state |

No row is declared migrated. `ATOMIC_COMMIT_PERSISTENCE` remains an implementation prerequisite for BKH4-6 and crash recovery.
