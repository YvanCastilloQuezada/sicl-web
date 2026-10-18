# ORDEN 97A — ARKI Living Knowledge Integration v1.1

## Status

```text
INTEGRATED / IMPLEMENTED FOR DECLARED SCOPE / PENDING INDEPENDENT VERIFICATION
```

## Existing versus new

Existing AKI-001, Knowledge Book deltas, BKH evidence, IFC evidence, LKS source register, Capability Atlas and Gap Register were reused or referenced. The implementation delta extends `shared/arkiLivingKnowledge.ts`; it does not create a second knowledge store.

Newly implemented: typed composition functions for curriculum views, standards knowledge records, CurriculumDelta, competency revalidation, conflict records, integrated package views and anti-parallel-owner checks. Newly documented: integrated architecture, migration decisions, standards/ISO family, propagation, package, invariants, test matrix and scope limits.

## Canonical authority

ADR-LKS-001 remains `ARCHITECTURAL_DECISION_REQUIRED`. The runtime does not automatically promote `CANONICAL_CANDIDATE` or `CANONICAL`.

## Evidence

`pnpm check`, the existing LKS test, the new integration test and `pnpm build` must pass before packaging. Historical artifacts remain unchanged in meaning. Any Kernel impact is out of scope and requires Human Decision.

STOP. Await independent review and Product Owner decision.
