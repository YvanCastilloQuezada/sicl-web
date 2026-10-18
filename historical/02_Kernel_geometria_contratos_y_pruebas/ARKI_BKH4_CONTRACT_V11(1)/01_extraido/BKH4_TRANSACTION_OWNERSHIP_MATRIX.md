# BKH-4 Transaction Ownership Matrix v1.1

**Estado:** contractual; conflicts remain explicit.

| Concept | Current evidence | BKH-4 role | Classification | Decision |
|---|---|---|---|---|
| ConstructionModel | Closest constructive aggregate | Transaction target/context | CANONICAL_SOURCE candidate | OWNERSHIP_UNRESOLVED |
| Geometry | Multiple constructive and scene paths | Mutation target and derived output boundary | OWNERSHIP_UNRESOLVED | ARCHITECTURAL_DECISION_REQUIRED |
| Relationship | BKH-1 Relationship Fabric | Canonical relationship contract | CANONICAL_SOURCE | Reuse BKH-1; no duplicate |
| Constraint | BKH-2 Constraint Engine | Gate/evaluation authority | CANONICAL_METADATA | Reuse BKH-2; no duplicate |
| Quantity | 5D and constructive quantity paths | Derived consequence | OWNERSHIP_UNRESOLVED | ARCHITECTURAL_DECISION_REQUIRED |
| Cost | PriceBook/budget paths | Derived consequence | OWNERSHIP_UNRESOLVED | ARCHITECTURAL_DECISION_REQUIRED |
| Schedule | 4D activity and critical-path paths | Derived consequence | OWNERSHIP_UNRESOLVED | ARCHITECTURAL_DECISION_REQUIRED |
| ProjectVersion | Version and persistence contracts | Transaction base/commit boundary | CANONICAL_METADATA candidate | IMPLEMENTATION_PREREQUISITE |
| Snapshot | Persistence/viewpoint artifacts | Recovery/audit/supporting artifact | CACHE / REPRESENTATION | Role must be decided before recovery |
| SceneModel | 3D representation model | Representation of semantic state | REPRESENTATION | Never semantic owner |
| HumanDecision | Decision fields and governance contracts | Authorization evidence | CANONICAL_METADATA candidate | Transversal owner unresolved |

BKH-4 may consume these boundaries, but it may not silently promote a candidate to canonical owner. Any unresolved owner that blocks atomic commit is `ARCHITECTURAL_DECISION_REQUIRED`.
