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
