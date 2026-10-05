# ARKI F6 / AGK — Integral Closure Gate V1

**State:** CLOSURE_AUDIT_ACTIVE  
**Scope:** F6 — AGK / 3D Constructive Spine  
**Rule:** F6 is assessed as a whole before any constituent delta is finally frozen.

## 1. Authority architecture

- D-2 remains Architectural Authority: semantic truth, intent, constraints, decisions and canonical architectural state.
- AGK remains the sole Operational Geometry Authority.
- OCCT remains the canonical BRep body of AGK.
- ARKI owns semantic/parametric identity; raw BRep indices, transient handles, world coordinates and geometry-only similarity are not semantic identity.
- No second runtime geometry kernel has been justified by the executed evidence.

## 2. Demonstrated capability body

| Capability | Evidence state |
|---|---|
| primitives / topology / area-volume invariants | PASS |
| extrusion / transforms / booleans | PASS |
| curves / revolution / loft / sweep | PASS |
| fillet / chamfer / thickness / healing | PASS |
| STEP and BREP round-trip | PASS |
| repeated booleans / thin solids / near-coplanar / tangency | PASS with bounded numerical limits recorded |
| aggressive loft / thin shell / dense topology | PASS |
| freeform T4 campaign | 12/12 PASS |
| ARKI parametric layer T5 | 14/14 PASS |
| constraint prototype T6 | 14/14 assertions PASS; production solver not claimed |
| sketch/constraint discovery T7 | progressive evidence through 1000 segments / 2000 constraints |
| persistent topology discovery T714 | raw BRep persistence NOT sufficient; own delta justified |
| DELTA-005 semantic naming service | 88/88 regression PASS plus native OCCT P9 8/8 |

## 3. Bounded limits, not silent failures

- T303 numerical tolerance boundary: overlap 2.5e-7 completed with valid shape but zero measured intersection instead of expected 0.0025.
- Huge-global-coordinate behavior has a bounded limit in the prior campaign.
- T307 fillet r=6 is an observation, not an OCCT limitation.
- T714 proves geometric correspondence is not persistent semantic identity.
- SolveSpace/libslvs remains an isolated GPL oracle/research master; it is not an AGK production backend.

## 4. Delta disposition at F6 gate

- DELTA-003 parametric transaction/regeneration capability: demonstrated in bounded campaign; final F6 disposition to reconcile.
- DELTA-004 constraint-solving capability: prototype demonstrated; production solver remains outside demonstrated boundary.
- DELTA-005 persistent naming/semantic identity: minimal contract is VERIFIED / READY_FOR_FREEZE, but final freeze waits for this integral F6 closure decision.
- Additional external geometry kernels: NOT JUSTIFIED by current evidence.

## 5. Remaining closure questions

These are the only questions allowed to block F6 closure; new feature invention is out of scope.

1. Is the current OCCT + ARKI_DELTA body sufficient for the F6 product boundary, with known numerical limits explicitly governed?
2. Does DELTA-003 require a separate freeze artifact or is its tested transaction/regeneration contract already sufficient?
3. Is DELTA-004 intentionally frozen as a bounded internal prototype plus oracle policy, or must a production constraint solver be a hard F6 gate?
4. Does F6 require the native P9 evidence envelope to be machine-ingested into the TypeScript naming service now, or is that an integration gate for F7/runtime packaging?
5. Are durable crash recovery and multi-process concurrency F6 geometry responsibilities, or later runtime/infrastructure responsibilities?
6. Is there any reproducible correctable defect inside the declared F6 boundary? UNKNOWN/future scale alone is not debt.

## 6. Closure decision rule

F6 may close only if:

- every capability claimed by the F6 boundary has executable evidence;
- every known reproducible correctable defect inside that boundary is fixed or explicitly causes NO-GO;
- all remaining items are classified as bounded limitation, later integration, future evolution, or explicit non-goal;
- OCCT remains sole canonical BRep authority unless counterevidence demonstrates a required delta it cannot satisfy;
- DELTA-005 is frozen only after this whole-body decision.

## 7. Immediate execution sequence

1. Reconcile DELTA-003 and DELTA-004 against their evidence.
2. Classify P9 C++->TypeScript ingestion, durable persistence and multiprocess concurrency by architectural ownership.
3. Run a focused F6 regression/gate only for unresolved closure claims; do not repeat already-proven campaigns without cause.
4. Issue F6 GO / NO-GO.
5. If GO: freeze constituent contracts, update Master Map, then move to F7 Professional Technical Development.


## 8. Reconciliation decision — DELTA-003 / DELTA-004 / runtime boundaries

### DELTA-003 — Parametric Transaction Contract

**Disposition: FREEZE_CANDIDATE / F6-SCOPE.** T5 executed 14/14 PASS and demonstrated deterministic regeneration, dirty/dependency propagation, semantic validation before mutation, dependent boolean regeneration, rejected-edit preservation, return-to-origin repeatability and a 27/27 architectural family. This is sufficient for the F6 contract it actually claims. It does not claim a geometric-constraint solver. No additional discovery test is required to close this bounded contract.

### DELTA-004 — Constraint Solver Capability

**Disposition: BOUNDED_INTERNAL_CAPABILITY + KEEP_ORACLE; NOT A HARD F6 PRODUCTION-SOLVER GATE.** T6 demonstrated ARKI's own bounded constraint-math capability (14/14 harness assertions). T7 then demonstrated stress behavior, real libslvs semantics, conflict/problematic-handle diagnostics, branch continuity evidence, solver-handle continuity and local chain scale through 1000 segments / 2000 constraints. The evidence does not justify embedding GPL libslvs as an AGK runtime backend, and F6 does not need to claim a production industrial sketch solver in order to close the canonical geometry spine. Production-grade solver expansion remains a later versioned capability gate above the OCCT body.

Subcontracts 004.1 conflict diagnosis and 004.2 solution intent/branch continuity remain evidence-supported bounded contracts. Minimal-conflict-set optimality, general branch-selection policy and complete industrial sketch semantics are not claimed.

### DELTA-005 — Persistent Naming

**Disposition: VERIFIED_FREEZE_CANDIDATE pending final whole-F6 GO.** P5-P10 evidence is sufficient for its minimal contract. It must not be expanded to absorb infrastructure responsibilities.

### Architectural ownership of remaining integration items

| Item | Ownership classification | F6 blocker? |
|---|---|---|
| native OCCT evidence -> TypeScript machine ingestion | runtime/integration adapter | NO for geometry-spine closure; required before claiming packaged end-to-end naming runtime |
| durable filesystem/database persistence + crash recovery | Project State / runtime infrastructure | NO |
| multi-process/database/distributed concurrency | runtime infrastructure / deployment | NO |
| long-duration industrial performance | production qualification | NO for bounded F6; YES before corresponding production-scale claim |
| semantic explanation/repair of constraint conflicts | Architectural Intelligence above solver | NO |

These classifications do not waive the work. They prevent unrelated runtime/infrastructure concerns from being mislabeled as defects in the geometry kernel boundary.

## 9. Current F6 closure audit result

**Preliminary verdict: GO_PENDING_FINAL_GATE.** No currently recorded reproducible correctable defect has been found inside the bounded F6 capability claims. The remaining items are either explicit numerical/semantic limits, deliberately unclaimed production capabilities, or responsibilities of later integration/infrastructure layers.

Before issuing final GO, run one focused repository regression covering the actual AGK/DELTA service tests available on this branch plus TypeScript/build integrity. Do not rerun the entire native discovery history unless that regression exposes counterevidence.


## 10. Final local repository gate — PASS

**Execution environment:** HP Z840 / Windows local repository.  
**Tested HEAD before evidence persistence:** `0d6bdd792e7d733622a31185f304bc189b80e7c5`.

Observed final gate:
- TypeScript: `pnpm.cmd exec tsc --noEmit` -> exit 0.
- DELTA-005 regression: 8/8 test files PASS, 88/88 tests PASS -> exit 0.
- Production build: Vite production build + server esbuild -> exit 0.
- Build completed with chunk-size warnings only; these are frontend performance/packaging observations, not F6 geometry failures.
- Working tree contained untracked `p9.obj`; this is a local native-test artifact and was not part of the tested committed source.

### Final F6 verdict

**F6 / AGK 3D Constructive Spine = GO at the bounded demonstrated product boundary.**

This verdict means the geometry spine has sufficient demonstrated capability and governance to become the stable base for F7. It does **not** mean every future production capability of AGK is complete.

Constituent disposition at this boundary:
- AGK-DELTA-001 Local Engineering Frame -> FREEZE at demonstrated policy boundary.
- AGK-DELTA-002 Geometric Acceptance Contract -> FREEZE at demonstrated policy boundary.
- AGK-DELTA-003 Parametric Transaction Contract -> FREEZE at demonstrated bounded contract.
- AGK-DELTA-004 Constraint Solver Capability -> FREEZE bounded internal-capability contract; production industrial solver not claimed.
- AGK-DELTA-004.1 Conflict Diagnosis -> FREEZE bounded evidence-supported contract; minimal conflict-set optimality not claimed.
- AGK-DELTA-004.2 Solution Intent / Branch Continuity -> FREEZE bounded evidence-supported contract; general branch policy not claimed.
- AGK-DELTA-005 Persistent Naming / Semantic Identity -> FREEZE minimal verified contract.
- OCCT -> sole canonical BRep geometry authority.
- SolveSpace/libslvs -> KEEP_ORACLE / RESEARCH_MASTER; not runtime backend.

### Explicit non-claims carried forward

Native C++ evidence-to-TypeScript packaged ingestion, durable crash recovery, multi-process/distributed concurrency, production industrial sketch completeness and long-duration industrial performance remain later integration/production gates. They must not be represented as already demonstrated.

**Transition:** F6 may now stop discovery-by-default. Reopening requires reproducible counterevidence or a new versioned requirement. Next product phase: F7 Professional Technical Development.
