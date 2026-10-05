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
