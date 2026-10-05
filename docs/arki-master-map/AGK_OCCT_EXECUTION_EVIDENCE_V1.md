# AGK — OCCT EXECUTION EVIDENCE V1

**Date:** 2026-10-05  
**Scope:** HP Z840 local workstation / OCCT 8.0.1 / x64-windows  
**Epistemic rule:** bounded execution evidence only. This document does not declare the complete AGK VERIFIED or FROZEN.

## 1. Result

**OCCT is an EXECUTED BASE for AGK.**

Validated local evidence chain:

1. **Installation gate — PASS**
   - OCCT 8.0.1 installed through vcpkg.
   - Headers, libraries and CMake toolchain available.
2. **Basic G0/G1/G2 canary — PASS**
   - real BRep created;
   - 8 vertices, 12 edges, 6 faces, 1 solid;
   - volume 6000 and area 2200 invariants;
   - BRep validity PASS.
3. **Advanced canary — PASS (16/16)**
   - extrusion, transform, fuse/common/cut, curved edge;
   - STEP write/read;
   - volume and face-count preservation.
4. **Torture T1 — PASS (22/22)**
   - revolution, loft, sweep, fillet, chamfer, thickness, healing;
   - BREP round-trip;
   - 25 sequential cuts;
   - stressed BRep validity, volume and topology.
5. **T2 coordinate/tolerance discovery — EXECUTED**
   - local near-coincident boolean boundary reproduced: overlap 5e-7 resolves; 2.5e-7 collapses to zero in the tested configuration;
   - T2.2: local-frame strategy won 9/13 comparisons, direct-global won 0, 4 equal;
   - T2.3 origin sweep: first detectable degradation at origin magnitude 1e5 under the test criterion, severe degradation at 1e8, first tested collapse at 5e8;
   - consequence: large GIS/global coordinates must not be the canonical OCCT BRep working frame.
6. **T3 Degeneracy & Surface Torture — PASS within designed interpretation**
   - 12 tests executed;
   - 11 invariant PASS;
   - 1 invariant FAIL = T303, deliberately below the already observed tolerance boundary;
   - 0 invalid outputs;
   - 0 unexplained failures;
   - process exit code 0;
   - harness verdict: NO_NEW_UNEXPLAINED_BOUNDARY.

## 2. Harness corrections before valid T1 evidence

Earlier T1 attempts are explicitly **not kernel failures**:
- nested PowerShell here-string defect: TEST_HARNESS_DEFECT;
- OCCT 8.0.1 chamfer API misuse: API_MISUSE;
- missing TKOffset/TKFillet link dependencies: LINK_CONTRACT_DEFECT.

The final valid T1 run used the installed OCCT API contract and linked TKOffset and TKFillet.

## 3. T2 — first demonstrated ARKI kernel delta policy

### AGK-DELTA-001 — Local Engineering Frame

**Status: DEMONSTRATED / policy candidate; whole ARKI_KERNEL_DELTA remains NOT FINALIZED.**

Evidence supports the following architecture:

```text
SITE / TERRITORY / GIS
        |
        | CRS + global coordinates + provenance
        v
GLOBAL PLACEMENT FRAME
        |
        | explicit reversible transform
        v
LOCAL ENGINEERING FRAME
        |
        v
OCCT CANONICAL BREP OPERATIONS
```

Policy:
- canonical BRep geometry and geometric computation remain in a numerically conditioned local engineering frame;
- CRS/geolocation/global placement are retained as explicit placement metadata/transforms;
- AGK must not naively perform canonical BRep computation at very large GIS coordinate magnitudes.

The numerical thresholds observed in T2.3 are **benchmark observations, not universal constants**. They depend on geometry scale, tolerance and operation.

## 4. AGK-DELTA-002 — Geometric Acceptance Contract

**Status: DEMONSTRATED NEED / policy candidate.**

T2/T3 show that `IsDone()==true` and `BRepCheck_Analyzer::IsValid()==true` are not sufficient evidence of semantic geometric correctness near tolerance boundaries.

Candidate acceptance chain:

```text
operation completed
+ BRep validity
+ geometric invariants
+ topological invariants
+ expected relationships / semantic expectations
+ tolerance policy
= ACCEPT | REJECT | UNKNOWN
```

T303 is the canonical bounded counterexample in the current benchmark family: the operation executes and reports a valid result, but the tested 2.5e-7 overlap collapses to zero volume.

## 5. T3 detailed result

| Test | Result | Interpretation |
|---|---|---|
| T301 ultra-thin solid 1e-6 | PASS | RESOLVED |
| T302 sliver boolean 5e-7 | PASS | RESOLVED |
| T303 sliver 2.5e-7 | EXPECTED BOUNDARY | KNOWN_TOLERANCE_BOUNDARY |
| T304 near-coplanar shallow cut | PASS | RESOLVED |
| T305 exact tangential boolean | PASS | RESOLVED |
| T306 near-limit fillet r=4.999999 | PASS | RESOLVED |
| T307 fillet r=6 | VALID RESULT | OBSERVATION; not classified as limitation |
| T308 aggressive twisted loft | PASS | RESOLVED |
| T309 thin closed shell 1e-5 | PASS | RESOLVED |
| T310 healing after stressed chain | PASS | HEALING_STABLE |
| T311 near-coincident fuse 5e-7 | PASS | RESOLVED |
| T312 dense topology / 36 cuts | PASS | 42 faces, 240 edges |

T307 correction: the original assumption that r=6 must be geometrically impossible for the first enumerated edge was too simplistic. OCCT produced a valid result. Therefore this is not evidence of an OCCT limitation.

## 6. Current bounded status

`AGK architecture = FROZEN`  
`OCCT base = EXECUTED / VERIFIED IN BOUNDED LOCAL CANARIES`  
`AGK unified production integration = PARTIAL / NOT YET VERIFIED`  
`AGK-DELTA-001 Local Engineering Frame = DEMONSTRATED policy candidate`  
`AGK-DELTA-002 Geometric Acceptance Contract = DEMONSTRATED NEED / policy candidate`  
`ARKI_KERNEL_DELTA = NOT FINALIZED`

No evidence currently justifies adding CGAL, Manifold, OpenVDB, libfive, PicoGK, SolveSpace/libslvs or Topologic as a runtime dependency. Each must earn a role through a reproducible OCCT limitation.

## 7. Next benchmark family — T4 architectural freeform geometry

Next target is not more boxes. It must test geometry relevant to a superarchitect:
- B-Spline/NURBS surfaces;
- double curvature;
- ruled/freeform surfaces;
- shells derived from curved surfaces;
- nontrivial section-changing lofts;
- curved-path sweeps and torsion;
- curved-surface offsets and thickening;
- curved-solid booleans;
- curve/surface and surface/surface intersection behavior;
- continuity checks;
- parametrically regenerable deformation;
- BREP/STEP persistence;
- deterministic regeneration.

Acceptance must include validity plus geometric/topological invariants, continuity/repeatability where applicable, and tolerance-aware semantic expectations.

## 8. Architectural consequence

The hypothesis remains:

`AGK = OCCT + minimal evidence-derived ARKI_KERNEL_DELTA`

Not a runtime chain of geometry engines.

OCCT remains the only executed candidate for the canonical BRep body at this checkpoint. Specialized technologies remain teachers/oracles/delta candidates until evidence demonstrates a necessary role.


## 9. T4 — Architectural Freeform Geometry

**Status: EXECUTED / PASS 12 OF 12, with bounded interpretation.**

Local harness evidence:
- T401 B-Spline double-curvature surface — PASS.
- T402 twisted multi-section architectural loft — PASS.
- T403 sweep over a non-linear polygonal architectural trajectory — PASS.
- T404 offset double-curved surface — PASS.
- T405 boolean penetration through twisted architecture — PASS.
- T406 surface-solid intersection — PASS.
- T407 deterministic parametric regeneration — PASS under tested volume/topology-count invariants.
- T408 BREP persistence — PASS.
- T409 STEP round-trip — PASS.
- T410 rigid-transform volume invariance — PASS.
- T411 topological regeneration repeatability — PASS under tested face/edge counts.
- T412 composite freeform stress case — PASS.

Summary: `T4_TOTAL=12`, `T4_PASS=12`, `T4_FAIL=0`, process exit 0.

### T4-OBS-001 — OPEN_SURFACE_VOLUME_NOT_SEMANTIC

T401/T404 produced negative values when volume properties were requested on open faces. This is not classified as an OCCT defect. Volume is not a valid semantic invariant for an open surface. AGK-DELTA-002 therefore requires entity-appropriate acceptance invariants.

Evidence bounds:
- T403 does not demonstrate a smooth B-Spline trajectory.
- T401 does not prove rational NURBS weights.
- T407/T411 do not prove exact serialized identity or persistent topological naming.
- T4 does not yet prove G1/G2 continuity, rational NURBS, ruled surfaces, thickening, curve-curve intersection or true smooth parametric deformation.
- Production AGK should avoid the OCCT 8.0 deprecated `TColgp_Array2OfPnt` API and use `NCollection_Array2<gp_Pnt>`.

## 10. T5 — Parametric / Dependency / Editability Layer

**Status: EXECUTED / PASS 14 OF 14.**

Demonstrated in the bounded harness:
- deterministic regeneration from explicit building parameters;
- derived floor-height dependency;
- dimensional edits propagating to regenerated geometry;
- dependent boolean regeneration;
- twist edit changing freeform geometry;
- rejection of impossible core and floor-height constraints before geometry mutation;
- rejected edits preserving committed geometry;
- repeated edits returning exactly to the tested origin signature;
- 27/27 valid members of a deterministic architectural design family;
- explicit dirty/dependency propagation;
- semantic gate before geometry mutation.

Summary: `T5_TOTAL=14`, `T5_PASS=14`, `T5_FAIL=0`, process exit 0.

### AGK-DELTA-003 — Parametric Transaction Contract

**Status: PROVISIONAL / EVIDENCE-SUPPORTED.**

```text
PROPOSE
  -> DIRTY PROPAGATION
  -> SEMANTIC VALIDATION
  -> GEOMETRIC REGENERATION
  -> AGK-DELTA-002 ACCEPTANCE
  -> COMMIT | ROLLBACK
```

T5 demonstrates that ARKI can build a deterministic parametric layer over OCCT. It does not demonstrate that OCCT itself provides a production geometric-constraint solver.

## 11. T6 — Constraint-Math Prototype

**Status: EXECUTED / harness assertions 14 OF 14; production solver explicitly NOT demonstrated.**

The experimental ARKI solver demonstrated, in bounded mathematical cases:
- fully constrained, under-constrained and contradictory systems;
- coincidence, perpendicularity, equality, parallelism and line-circle tangency;
- driving dimensions and deterministic regeneration;
- compatible redundancy detection;
- equal-bay architectural systems;
- coupled nonlinear constraints.

T614 deliberately records: `Production geometric-constraint solver = NOT_DEMONSTRATED_BY_T6 / DELTA_CANDIDATE`.

### AGK-DELTA-004 — Constraint Solver Capability

**Status: SPECIALIZED DELTA CANDIDATE.**

Provisional contract:

```text
INTENT
  -> PARAMETERS
  -> CONSTRAINT GRAPH
  -> DOF / REDUNDANCY / CONFLICT ANALYSIS
  -> SOLVE
  -> SEMANTIC VALIDATION
  -> GEOMETRIC REGENERATION
  -> AGK-DELTA-002 ACCEPTANCE
  -> COMMIT | ROLLBACK
```

The constraint solver belongs above the OCCT geometric body. It is not a second canonical geometry kernel.

## 12. T7-A — ARKI Solver Stress / Gap Discovery

**Status: EXECUTED / 11 PASS / 0 FAIL / 1 OBSERVATION / 3 EXPLICIT GAPS.**

Demonstrated:
- 20-, 100- and 250-variable constrained graphs;
- large under-constrained DOF detection;
- redundant compatible constraints;
- global contradiction detection;
- incremental edit;
- nonlinear circle intersection;
- singular/redundant system handling;
- perturbation stability;
- deterministic large solve.

Observation:
- **T709 solution-branch sensitivity:** mathematically valid upper/lower branches were both observed. Production ARKI requires explicit solution intent / branch continuity rather than arbitrary flipping.

Explicit gaps:
- **T713:** minimal conflict localization — NOT_IMPLEMENTED / DELTA_CANDIDATE.
- **T714:** stable geometric entity identity across solve/regeneration — NOT_IMPLEMENTED / DELTA_CANDIDATE.
- **T715:** industrial sketch-constraint semantics — NOT_IMPLEMENTED / DELTA_CANDIDATE.

## 13. T7-B1 — SolveSpace/libslvs Oracle Probe

**Status: EXECUTED / BUILD PASS / ORACLE PROBE ONLY.**

Pinned upstream checkout:
- repository: `solvespace/solvespace`
- branch: `master`
- HEAD: `581f4cbf5617bf32ba5856e93ee06a25842128fd`
- local isolated root: `C:\\ARKI\\labs\\solvespace-t7b1`

Build evidence:
- CMake configure — PASS;
- Ninja graph generated — YES;
- target `slvs` — PASS;
- `slvs.dll` produced — YES (502272 bytes);
- `slvs.lib` produced — YES (13158 bytes);
- SolveSpace source modified — NO;
- AGK modified — NO.

A CMake 4 compatibility invocation was required using `CMAKE_POLICY_VERSION_MINIMUM:STRING=3.5`; this was a build-environment compatibility issue, not solver evidence.

### Current disposition

`SolveSpace/libslvs = KEEP_ORACLE / RESEARCH_MASTER (provisional)`

It is **not** admitted as an AGK runtime dependency. GPL licensing remains an architectural/legal boundary. No GPL implementation code is to be copied into proprietary ARKI code.

T7-B2 must compare the real libslvs API against T7-A, especially:
- T713 conflict diagnosis/localization;
- T715 industrial sketch semantics;
- T709 branch/solution continuity;
- DOF/redundancy behavior;
- incremental editing.

T714 remains separate: libslvs entity handles do not by themselves prove persistent topological naming across regenerated BRep geometry.

## 14. Updated bounded conclusion

Current evidence continues to support:

`AGK = OCCT canonical BRep body + minimal evidence-derived ARKI_KERNEL_DELTA`

No second canonical geometry kernel has earned admission. Constraint solving is being evaluated as a specialized intelligence/delta layer above OCCT, under **OWN CAPABILITY FIRST / EXTERNAL ENGINE WHEN NECESSARY**.

**Next exact action:** execute T7-B2 against the locally built libslvs oracle, then classify each demonstrated delta as INTERNALIZE_ROUTINE, KEEP_ORACLE, KEEP_BACKEND, REFERENCE_ONLY, REJECT or UNKNOWN.


## 15. T7-B2 — Real libslvs conflict-diagnosis oracle

**Status: EXECUTED / LOCAL ORACLE CAPABILITY DEMONSTRATED.**

The locally built libslvs oracle was linked and executed in two controlled specimens derived from the official C demo.

Execution evidence:
- baseline specimen compile — PASS;
- contradiction specimen compile — PASS;
- baseline run — PASS / process exit 0;
- baseline exposed solver DOF reporting;
- contradictory run reported `solve failed: problematic constraints are: 1819231068`;
- contradictory run reported `system inconsistent`;
- diagnostic extractor observed the conflict output;
- AGK modified — NO;
- SolveSpace source modified — NO;
- libslvs role — ORACLE ONLY.

### T713 update

T713 is no longer merely an external capability hypothesis. The local oracle demonstrated that libslvs can return at least a **problematic constraint handle** for the tested inconsistent system.

This does **not** yet prove:
- minimal conflicting-set extraction;
- quality of diagnosis for multiple simultaneous conflicts;
- semantic/architectural explanation of the conflict;
- automatic repair planning.

Therefore T713 becomes:

`PARTIAL — PROBLEMATIC_CONSTRAINT_LOCALIZATION_DEMONSTRATED / MINIMAL_CONFLICT_SET_NOT_YET_DEMONSTRATED`

### AGK-DELTA-004.1 — Constraint Conflict Diagnosis

**Status: PROVISIONAL CAPABILITY CONTRACT.**

```text
CONSTRAINT GRAPH
  -> SOLVE
  -> INCONSISTENT
  -> CONFLICT CANDIDATES
  -> MINIMAL / NEAR-MINIMAL CONFLICT SET
  -> SEMANTIC EXPLANATION
  -> REPAIR OPTIONS
  -> ARKI / HUMAN DECISION
```

The target for ARKI is deliberately stronger than returning opaque numeric handles: conflict evidence must be mapped back to architectural intent and actionable repair alternatives.

**Disposition remains:** `SolveSpace/libslvs = KEEP_ORACLE / RESEARCH_MASTER (provisional)`.

**Next exact action:** T7-B3 industrial constraint-semantics comparison (T715), followed by branch-continuity and richer conflict-set probes before any runtime dependency decision.


## 16. T7-B3.1R / T7-B3.2 / T7-B3.3 — libslvs constraint semantics

**Status: EXECUTED / T715 SUBSTANTIALLY DEMONSTRATED IN TESTED SCOPE.**

Local oracle evidence now demonstrates the following real constraint semantics: points coincident, point-point distance, equal line lengths, parallel, perpendicular, angle, horizontal in a real workplane, vertical in a real workplane, arc-line tangency, and curve-curve tangency. The earlier FREE_IN_3D horizontal/vertical assertion was a harness-context defect, not a solver defect.

T7-B3.3 execution:
- `ARC_LINE_TANGENT` — PASS, result=0, dof=6, failed=0;
- `CURVE_CURVE_TANGENT` — PASS, result=0, dof=7, failed=0;
- process exit — 0;
- AGK modified — NO;
- SolveSpace source modified — NO;
- GPL code copied into ARKI — NO;
- libslvs role — ORACLE_ONLY.

This demonstrates solver acceptance of the tested tangency relations. Production industrial-sketch completeness is still not established.

## 17. T7-B4 — Conflict and redundancy behavior

**Status: EXECUTED / CONFLICT LOCALIZATION BEHAVIOR DEMONSTRATED, MINIMALITY NOT PROVEN.**

Observed oracle behavior:
- single contradiction: result=1, failed handle `2`;
- two independent contradictions: result=1, failed handles `2,4`;
- compatible redundant constraints: result=4, failed handles `1,2`;
- redundant plus contradiction: result=1, failed handle `3`.

The evidence is stronger than T7-B2: libslvs can distinguish the tested inconsistent/redundant systems and return useful problematic handles. However, `failed[]` must not yet be described as a mathematically minimal conflict set. T713 therefore remains PARTIAL, now with richer localization evidence.

**AGK-DELTA-004.1 remains provisional.** ARKI's target remains stronger than the oracle: conflict candidates must be mapped to architectural intent, explained semantically, and paired with repair options before decision.

**Disposition:** `SolveSpace/libslvs = KEEP_ORACLE / RESEARCH_MASTER`. No runtime admission decision has been made.

**Next exact action:** T7-B5 branch/solution continuity, T7-B6 identity separation, then T7-B7 scale/performance comparison.


## 18. T7-B5 / B6 / B7 — Branch continuity, identity boundary and scale

**Status: EXECUTED / PHASE 2 COMPLETED.**

T7-B5: four branch specimens solved successfully. Positive initial guesses remained positive and negative initial guesses remained negative, including ±1e-6 perturbations. Solution intent is therefore an explicit ARKI requirement; this does not prove a general branch-selection policy.

T7-B6: solver handles 103/104 and constraint handle 1 remained stable across the tested driving edit; both solves returned result=0. This demonstrates solver-handle continuity only. BRep topological identity remains NOT_DEMONSTRATED; T714 stays open.

T7-B7: all chain systems passed with result=0, failed=0, dof=2. Reported local CPU times: 20 segments ~0 ms; 100 ~1 ms; 250 ~2 ms; 500 ~4 ms; 1000 ~7 ms. Whole harness wall time: 1301 ms. These are discovery measurements, not production benchmarks or matched comparisons to T7-A.

AGK-DELTA-004.2 Solution Intent / Branch Continuity is supported as a provisional contract. T7 now demonstrates own small-solver viability, real libslvs sketch semantics, conflict/problematic-handle diagnostics, branch sensitivity, solver-handle continuity, and local chain-scale behavior. Remaining material gap: T714 persistent BRep topological identity/naming across AGK regeneration.

Disposition remains: SolveSpace/libslvs = KEEP_ORACLE / RESEARCH_MASTER; no production runtime admission; no GPL code copied into ARKI. No evidence requires a second geometry kernel.

Next exact action: freeze evidence-supported portions of AGK-DELTA-003/004/004.1/004.2, keep T714 open as a separate topology-identity delta, and move discovery to that geometry-identity problem.


## 19. T714 — Persistent topological identity discovery

**Status: EXECUTED / GAP CONFIRMED / OWN DELTA JUSTIFIED.**

OCCT 8.0.1 harness configured, built and executed successfully (process exit 0). Exact regeneration preserved all tested geometric face/edge signatures (6/6, 24/24); exact boolean regeneration 10/10 faces and 48/48 edges; exact fillet regeneration 7/7 and 30/30; BREP roundtrip 10/10 and 48/48. Exact boolean regeneration also preserved same geometry at the same enumerated face index 10/10, but this is observation only and must not be treated as persistent identity.

Edits expose the identity problem: dimension edit retained only 1/6 face and 8/24 edge geometric matches; local boolean edit 4/10 and 24/48; fillet-radius edit 2/7 and 14/30. A rigid transform copy produced 0 world-coordinate geometric matches despite unchanged volume. These results show why raw geometry, enumeration order, or transient implementation identity cannot serve as ARKI semantic identity.

T714 conclusion: semantic identity and parametric identity must be ARKI-owned; solver handles remain solver-local; persistent BRep subshape identity is NOT provided by the tested evidence. This is not an OCCT failure: it is an architectural requirement above the BRep kernel.

**AGK-DELTA-005 — Persistent Topological Naming / Semantic Identity Bridge: JUSTIFIED FOR DESIGN.** Target contract: ARKI semantic entity ID + feature/provenance lineage + role/context signature + geometric/topological evidence -> correspondence candidates -> confidence/ambiguity -> preserve/remap/split/merge/new/deleted -> acceptance -> commit. Fail closed on ambiguous correspondence; never silently rebind architectural semantics to a different BRep subshape.

No second geometry kernel is justified. AGK remains OCCT canonical BRep body + evidence-derived ARKI_KERNEL_DELTA.


## 20. AGK-DELTA-005 Phase 1 — Evidence bridge discovery

**Status: EXECUTED / PHASE 1 PASS WITH EXPECTED AMBIGUITY.** Process exit 0; AGK product unchanged; no second kernel.

A deliberately simple discovery matcher classified face correspondence using geometric evidence. Exact regeneration and exact boolean regeneration mapped all faces HIGH. Parametric edit retained 1 HIGH + 5 MEDIUM. Local boolean movement retained 6 HIGH + 4 MEDIUM. Fillet-radius edit produced 4 HIGH + 2 MEDIUM + 1 NO_MATCH. Feature addition retained 5 HIGH + 1 MEDIUM while introducing new topology; feature deletion produced 5 HIGH + 1 MEDIUM + 5 NO_MATCH, correctly exposing deleted feature faces. Topology-role change produced 5 HIGH + 1 MEDIUM + 4 NO_MATCH.

Two deliberate ambiguity probes behaved correctly: rigid world-coordinate transform yielded 6 AMBIGUOUS, and symmetric area-only matching yielded 6 AMBIGUOUS. Therefore geometry-only matching is useful evidence but insufficient identity authority. Fail-closed on ambiguity is confirmed as a required policy.

**Delta-005 design direction confirmed:** ARKI owns semantic IDs. OCCT owns BRep representation. The bridge must combine provenance/feature lineage, architectural role/context, topology and geometry, explicitly handling PRESERVE / REMAP / SPLIT / MERGE / NEW / DELETED / AMBIGUOUS. Next phase must add provenance and role-aware matching rather than merely tune geometric thresholds.


## 21. AGK-DELTA-005 Phase 2 — provenance + role-aware discovery

**Status: EXECUTED / PASS WITH EXPECTED BOOLEAN AMBIGUITY.** Process exit 0; AGK product unchanged; no second kernel.

The enriched discovery matcher combined geometry with coarse role and feature/provenance evidence. Parametric role continuity preserved 6/6 faces. Feature addition preserved 6/6 predecessor faces while allowing five new faces. Feature deletion preserved 6/11 predecessor faces and classified the five removed feature faces as DELETED_OR_NO_MATCH. Role-change guard preserved the six surviving base faces and rejected four cut-specific faces. Boolean local-lineage continuity preserved six base faces but correctly left four generated side faces AMBIGUOUS: coarse role + shared feature label is insufficient to distinguish symmetric/generated boolean descendants.

Policies exercised: one-to-many and many-to-one require explicit lineage; ambiguity fails closed; semantic ID survives only through ARKI evidence, never BRep enumeration; event vocabulary PRESERVE / REMAP / SPLIT / MERGE / NEW / DELETED / AMBIGUOUS.

**Conclusion:** Phase 2 validates the architecture but does not yet demonstrate true SPLIT/MERGE lineage. Phase 3 must create an explicit lineage graph and test concrete 1->N and N->1 transformations, including conservation/coverage checks and ambiguity handling.


## 22. AGK-DELTA-005 Phase 3 — explicit lineage graph discovery

**Status: EXECUTED / PARTIAL.** Process exit 0; AGK product unchanged; no second kernel.

The lineage graph itself executed and accounted correctly for continuity/new/deleted topology: baseline-to-modified graph covered 6/6 predecessor faces and 6/11 successor faces; NEW accounting detected 5 faces; reverse DELETED accounting detected 5 faces. Governance invariants passed: semantic parentage is ARKI-owned, BRep index has no identity authority, silent ambiguous rebinding is forbidden, and the provisional event set remains PRESERVE / REMAP / SPLIT / MERGE / NEW / DELETED / AMBIGUOUS.

However, the intended concrete 1->N and N->1 tests were **NOT demonstrated**. D005P3-02 found only one TOP child (`children=1`) and D005P3-03 only one TOP parent (`parents=1`), so both correctly reported OBSERVATION. The selected cut changed topology but did not split the selected semantic TOP face into multiple disconnected descendants. This is a test-specimen defect/insufficiency, not evidence that OCCT cannot expose split/merge history.

**Decision:** do not advance to a production contract yet. Run Phase 3R with a geometry that actually partitions one source face into multiple descendants and the inverse merge, and inspect OCCT operation history (`Modified` / `Generated` / `IsDeleted`) where applicable. Only after true 1->N and N->1 are demonstrated should Delta-005 move to adversarial/product-contract work.


## 23. AGK-DELTA-005 Phase 3R V4

Status: PARTIAL. Configure/build succeeded; process exit 3 by the harness gate. Product AGK unchanged and no second kernel added.

True 1-to-N face lineage was demonstrated. Source roof area was 280; the cut produced 2 roof descendants with aggregate area 252, equal to expected remaining area 252. OCCT history reported Modified(sourceTop)=2, Generated(sourceTop)=2, IsDeleted=NO. Split coverage passed.

The inverse fill did not demonstrate N-to-1 merge. It produced 4 coplanar top faces with aggregate area 268 rather than one recovered face of area 280. This is NOT_DEMONSTRATED, not an OCCT limitation claim.

Governance remains: ARKI owns semantic lineage; OCCT operation history is evidence only; incomplete or ambiguous lineage fails closed. Next is a dedicated Phase 3M true N-to-1 merge specimen before any production-contract claim.


## 24. AGK-DELTA-005 Phase 3M — true N-to-1 merge demonstrated

**Status: PASS.** Configure/build/run all succeeded; process exit 0. AGK product unchanged; no second kernel.

Two adjacent semantic predecessor solids each exposed one coplanar roof face; total parent area was 280. Raw fuse preserved two top faces and area 280. Explicit `ShapeUpgrade_UnifySameDomain` normalization produced one valid top face with area 280. Therefore the tested N-to-1 event is demonstrated: parents `SEM:ROOF_A, SEM:ROOF_B` -> child `SEM:ROOF`, with coverage conserved exactly.

Negative control also passed: a 0.01 gap retained two top faces and no silent merge. This supports fail-closed behavior and shows same-domain normalization is geometric evidence, not semantic identity authority.

Combined with Phase 3R, Delta-005 discovery now has concrete tested evidence for both 1-to-N SPLIT and N-to-1 MERGE. This closes the specific split/merge discovery gap. Next gate: Phase 4 adversarial identity campaign and production contract. Do not yet claim production persistent naming is solved.


## 25. AGK-DELTA-005 Phase 4 — adversarial identity contract campaign

**Status: PASS (12/12), process exit 0.** Configure/build/run succeeded. AGK product unchanged; no second kernel.

Passed cases: exact regeneration; symmetry ambiguity guard; rigid-transform identity guard; true SPLIT; true MERGE; near-gap negative control; DELETE; ADD/NEW; BRep index/transient-handle non-authority; confidence/ambiguity fail-closed gate; complete event model; explicit production boundary.

The evidence supports freezing the Delta-005 production contract candidate as: `SEMANTIC_ID + FEATURE_PROVENANCE + ROLE_CONTEXT + OP_HISTORY + GEOM_TOPO_EVIDENCE -> CANDIDATES -> CONFIDENCE/AMBIGUITY -> EVENT -> ACCEPT OR FAIL_CLOSED`.

Event model: `PRESERVE, REMAP, SPLIT, MERGE, NEW, DELETED, AMBIGUOUS`. Semantic identity remains ARKI-owned. OCCT/BRep provides canonical geometry and operation/history evidence but BRep enumeration, transient handles and world-coordinate signatures are not semantic identity authorities.

**Boundary:** this closes the discovery/contract-evidence campaign; it does not demonstrate a production persistent-naming service. Next is contract freeze followed by the minimal ARKI-owned naming/identity service implementation and its own tests.


## 26. AGK-DELTA-005 minimal ARKI Naming Service — first executable verification

**Status: PASS.** Windows-native verification at branch HEAD `0218103f6ea7eac16d96ab00a49ea719a793f4ab`: Vitest executed `server/arkiPersistentNaming.test.ts`; 1 test file passed, 7/7 tests passed, exit 0. Duration 639 ms.

Verified behaviors: unique high-confidence PRESERVE; symmetric competing candidates fail closed as AMBIGUOUS; explicit SPLIT; explicit MERGE; NEW; DELETED; low-confidence evidence does not become authority. The earlier `shared/` test-discovery failure was a harness/configuration placement defect, corrected by placing the executable suite under the repository's configured `server/**/*.test.ts` scope.

Boundary: this verifies the minimal TypeScript decision service against its unit contract. It does not yet prove end-to-end OCCT/BRep integration, persistence across sessions, concurrent edit behavior, or production readiness. Next: integrate an evidence adapter/ledger boundary and test committed naming decisions without granting TypeScript or the web layer geometry authority.


## 27. AGK-DELTA-005 Naming Service + append-only ledger integration verification

**Status: PASS.** Windows-native verification at HEAD `694b8b2671f6569d7d76a2b3846e208555dcd300`: 2 Vitest files passed; 12/12 tests passed; exit 0; duration 628 ms.

The verified scope combines the seven naming-decision contract tests with five ledger integration gates: accepted decisions are recorded with evidence; AMBIGUOUS decisions are rejected fail-closed; duplicate record IDs are rejected; sequence gaps are rejected; snapshots expose an immutable boundary.

Boundary: this is executable TypeScript service/ledger verification, not yet OCCT/BRep end-to-end evidence ingestion or durable on-disk persistence. Next is a typed AGK evidence-envelope adapter that accepts geometry evidence produced by the canonical AGK/OCCT side, validates provenance, and feeds the ARKI-owned naming decision layer without granting the web layer geometry authority.


## 28. AGK-DELTA-005 geometry-evidence authority boundary verification

**Status: PASS.** Windows-native verification at HEAD `04f5b5588c5de2da901cc11cd2867eba7d43af05`: 3 test files passed; 17/17 tests passed; exit 0; duration 670 ms.

The accumulated executable suite now verifies naming decisions, append-only ledger gates, and the typed `ARKI_AGK_GEOMETRY_EVIDENCE_V1` authority boundary. The naming layer consumes validated AGK/OCCT evidence but does not become geometry authority.

Product-owner direction after this result: increase test density in an ordered progression rather than adding isolated cases. Next campaign is ordered P5: schema/provenance -> confidence thresholds -> lineage events -> ledger invariants -> replay/determinism -> adversarial/tamper -> transaction/concurrency boundaries.


## 29. AGK-DELTA-005 P5 ordered hardening + repository regression

**Status: PASS.** Windows-native execution at HEAD `fc4c2858a36aa89fcaa734e67e41962fac0cf1bd`: 24 test files passed; 146/146 tests passed; exit 0; duration 8.39 s. The four DELTA-005 suites all executed: 7 naming contract + 5 ledger + 5 AGK evidence-envelope + 12 ordered-hardening = 29/29 DELTA-005 tests PASS.

Incidental stderr observations from jsdom/chart rendering (`HTMLCanvasElement.getContext` unavailable without canvas package; zero-size chart warnings) did not fail tests and are not classified as DELTA-005 defects. The V1/V2 P5 runner attempts are recorded as test-filter harness defects / NOT_EXECUTED, superseded by this successful V3 execution.

Next ordered gate: P6 transaction/rollback atomicity. No production-readiness claim yet.


## 30. AGK-DELTA-005 P6 transaction / rollback atomicity

**Status: PASS.** Windows-native execution at HEAD `b113507bf68c542d427792ba100fffe7bd46c965`: `server/arkiPersistentNamingTransaction.test.ts` executed 10/10 tests PASS; 1/1 test file PASS; Vitest exit 0; duration 1.43 s. Demonstrated in the tested service boundary: staging does not mutate ledger, commit publishes staged records, rollback publishes nothing, AMBIGUOUS is fail-closed, nested/no-open transaction misuse is rejected, sequence gaps and stale bases are rejected, and duplicate staged record IDs are rejected.

The later interactive PowerShell `else` CommandNotFoundException occurred after Vitest had already returned exit 0 and after `ARKI_DELTA005_P6=PASS`; it is a shell-paste artifact and does not invalidate P6 evidence.

Boundary: unit/service transaction atomicity is demonstrated; durable persistence/restart replay is not yet demonstrated. Next ordered gate: **P7 persistence + replay**.


## 31. AGK-DELTA-005 P7 persistence / replay

**Status: PASS.** Windows-native execution at HEAD `46daeb3da039c8c985541785b6c11512f4cd43ef`: `server/arkiPersistentNamingPersistence.test.ts` executed 12/12 tests PASS; 1/1 test file PASS; Vitest exit 0; duration 643 ms. Demonstrated at the tested service boundary: canonical schema serialization, one/multi-record round-trip, deterministic replay, preservation of evidence payload, and fail-closed rejection of malformed JSON, wrong/missing schema, sequence gaps, duplicate record IDs, ambiguous decisions and blank record identity.

Boundary: in-memory serialization/replay contract is demonstrated. Durable filesystem/database crash recovery is not yet claimed. Next ordered gate: **P8 concurrency / stale-writer protection**.


## 32. AGK-DELTA-005 P8 concurrency / stale-writer protection

**Status: PASS.** Windows-native execution at HEAD `d43aa0c09cb571af932e287c7fbbad0e3d474da3`: `server/arkiPersistentNamingConcurrency.test.ts` executed 12/12 tests PASS; 1/1 test file PASS; Vitest exit 0; duration 634 ms. Demonstrated at the tested in-process service boundary: shared-base readers, first-writer commit, stale-writer rejection, no stale overwrite, retry from fresh base, duplicate-ID rejection across managers, no partial publication from failed stale batches, contiguous batch commit, competing semantic edit protection, independent rollback, local overlapping-transaction rejection, and deterministic order after conflict/retry.

Boundary: this is deterministic in-process optimistic-concurrency evidence, not yet multi-process/database/distributed concurrency. Next ordered gate: **P9 real OCCT/AGK geometry evidence integration**; mocks are not sufficient for that gate.
