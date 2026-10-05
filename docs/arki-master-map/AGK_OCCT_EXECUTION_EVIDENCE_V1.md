# AGK — OCCT EXECUTION EVIDENCE V1

**Date:** 2026-10-05  
**Scope:** HP Z840 local workstation / OCCT 8.0.1 / x64-windows  
**Epistemic rule:** bounded execution evidence only. This document does not declare the complete AGK VERIFIED or FROZEN.

## 1. Result

**OCCT is now an EXECUTED BASE for AGK.**

The local evidence chain has three successful bounded gates:

1. **Installation gate — PASS**
   - OCCT 8.0.1 installed through vcpkg.
   - Headers, libraries and CMake toolchain available.

2. **Basic G0/G1/G2 canary — PASS**
   - Real BRep created.
   - Unique topology: 8 vertices, 12 edges, 6 faces, 1 solid.
   - Box volume invariant: 6000.
   - Box area invariant: 2200.
   - BRep validity PASS.

3. **Advanced canary — PASS (16/16)**
   - extrusion;
   - transform;
   - boolean fuse/common/cut;
   - curved edge;
   - STEP write/read round-trip;
   - volume and face-count preservation.

4. **Torture T1 — PASS (22/22)**
   - revolution;
   - multi-section loft;
   - sweep/pipe;
   - fillet;
   - chamfer;
   - shell/thickness;
   - shape healing;
   - native BREP write/read round-trip;
   - 25 sequential boolean cuts;
   - post-stress BRep validity;
   - volume invariant;
   - substantial topology.

Observed T1 values:
- revolution volume: 2450.44;
- loft volume: 5768.55;
- fillet faces: 10;
- chamfer faces: 7;
- sequential cuts: 25;
- stressed faces: 31;
- stressed volume: 185863;
- expected stress volume: 185863;
- process exit code: 0.

## 2. Harness corrections before valid T1 evidence

Earlier T1 attempts are explicitly **not kernel failures**. They were harness/integration defects and are excluded from OCCT capability scoring:

- nested PowerShell here-string defect: TEST_HARNESS_DEFECT;
- OCCT 8.0.1 chamfer API misuse: API_MISUSE;
- missing TKOffset/TKFillet link dependencies: LINK_CONTRACT_DEFECT.

The final valid run used the installed OCCT API contract and linked:
- TKOffset for ThruSections / MakePipe / MakeThickSolid;
- TKFillet for MakeFillet / MakeChamfer.

## 3. Status transition

Previous body-map status:

`AGK = FROZEN ARCHITECTURE / PARTIAL IMPLEMENTATION`

Evidence-bounded refinement:

`AGK architecture = FROZEN`  
`OCCT base = EXECUTED / VERIFIED IN BOUNDED LOCAL CANARIES`  
`AGK unified production integration = PARTIAL / NOT YET VERIFIED`  
`ARKI_KERNEL_DELTA = NOT YET FINALIZED`

This does **not** justify claiming the whole AGK is production-ready.

## 4. What OCCT has demonstrated

The current evidence supports retaining OCCT as the principal body of the AGK hypothesis. It has demonstrated a substantial architectural solid-modeling surface without requiring another runtime kernel for these tested operations.

No CGAL, Manifold, OpenVDB, libfive, PicoGK, SolveSpace/libslvs or Topologic dependency should be added merely because it was previously listed as a candidate. Each candidate must earn a delta role through a reproducible gap.

## 5. Next benchmark family — DELTA DISCOVERY

The next benchmark must stop proving ordinary happy-path features and begin searching for real OCCT limits relevant to ARKI:

- difficult/near-coincident booleans;
- tolerance sensitivity and accumulated numerical drift;
- self-intersection and degenerate input handling;
- complex double-curvature and nontrivial loft/sweep cases;
- shell/thickness failure boundaries;
- fillet/chamfer failure boundaries;
- healing effectiveness and topology preservation;
- repeated transforms/regeneration;
- BREP/STEP persistence under complex geometry;
- determinism/repeatability;
- performance under architectural-scale topology.

Every failure must be classified before any new backend is admitted:

`TEST_DEFECT | API_MISUSE | NUMERICAL_TOLERANCE | INPUT_INVALID | OCCT_LIMITATION | AGK_DELTA_CANDIDATE`

Only reproducible `OCCT_LIMITATION` evidence can promote another engine/algorithm into `ARKI_KERNEL_DELTA`.

## 6. Architectural consequence

The AGK hypothesis remains:

`AGK = OCCT + minimal evidence-derived ARKI_KERNEL_DELTA`

Not:

`AGK = runtime chain of multiple geometry engines`

OCCT remains the sole tested candidate for the canonical BRep body at this checkpoint. Specialized technologies remain potential teachers/oracles/delta sources until a benchmark demonstrates a necessary role.
