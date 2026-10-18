# ARKI — BKH Kernel Invariant Master Matrix

**Orden:** 93 · **Estado:** revisión adversarial post-92A

| Invariante | Owner | Evidencia | Estado |
|---|---|---|---|
| RELATIONSHIP_IDENTITY_STABLE | BKH-1 Relationship Fabric | `test-bkh1-relationship-fabric.ts` | PASS — suite |
| CONSTRAINT_IDENTITY_STABLE | BKH-2 Constraint Engine | BKH-2 suite | PASS — suite |
| REVISION_NOT_IDENTITY | BKH-1/BKH-2 | revision tests | PASS — local |
| UNKNOWN_NOT_PASS | BKH-2/BKH-3 | corrective suite | PASS — demonstrated |
| GENERATED_NOT_FACT | epistemic contracts | partial evidence | DEFERRED_WITH_REASON |
| RESEARCHED_NOT_VERIFIED | epistemic contracts | partial evidence | DEFERRED_WITH_REASON |
| NO_SCALE_EXTRAPOLATION | BKH-1/BKH-2 | cross-scale fixtures | PASS — bounded |
| NO_DISCIPLINE_EXTRAPOLATION | BKH-1/BKH-2 | cross-discipline fixtures | PASS — bounded |
| EVALUATION_NO_MUTATION | BKH-2 | before/after corrective suite | PASS |
| SOURCE_STATE_NOT_SILENTLY_MUTATED | BKH-3 | corrective suite | PASS — local |
| NO_STALE_DATA_AS_CURRENT | BKH-3 | freshness tests | PASS — 92A |
| MINIMAL_DIRTY_SET | BKH-3 | chain/torture fixture | PASS — bounded |
| DEPENDENCY_TRACE_REQUIRED | BKH-3 | result provenance/diagnostics | PASS — bounded |
| DETERMINISTIC_WHEN_DECLARED | BKH-2/BKH-3 | repeated fixture runs | PASS — declared paths |
| IDEMPOTENT_WHEN_DECLARED | BKH-3 | `scripts/test-bkh93c-idempotence.ts`; RUN 1/RUN 2 semantic and output hash equality | PASS — 93C |
| CYCLE_NOT_SILENT | BKH-3 | original suite | PASS |
| PARTIAL_NOT_GLOBAL_SUCCESS | BKH-3 | aggregation tests | PASS |
| RELATIONSHIP_NOT_REGENERATION_DEPENDENCY | architecture boundary | static scan | PASS — scope guard |
| GENERATION_NOT_REGENERATION | architecture boundary | static scan | PASS — no claim of universal integration |
| REGENERATION_NOT_COMMIT | BKH-3 | no commit API; scope audit | PASS |
| RELATIONSHIP_FABRIC_NOT_DUPLICATED | BKH-1 | duplicate-engine scan | ARCHITECTURAL_DECISION_REQUIRED |
| CONSTRAINT_ENGINE_NOT_DUPLICATED | BKH-2 | duplicate-engine scan | ARCHITECTURAL_DECISION_REQUIRED |
| UNSUPPORTED_SOLVER_NOT_DEMONSTRATED | professional firewall | E7/E6 limits | PASS — fail-closed policy |
| HUMAN_AUTHORITY_PRESERVED | governance | scope guards | PASS — no approval engine added |

`PASS` significa evidencia disponible dentro del alcance auditado, no que todo ARKI esté productivamente terminado.
