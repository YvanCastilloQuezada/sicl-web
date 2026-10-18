# ARKI-SOLVER-MAP-001 — Cross-family synthesis

**Status:** Synthesis of the successful family reports in this directory, accessed 2026-09-24. **Aurora was not researched or used.** No solver was installed or executed; recommendations below are research selections, not execution evidence or approval.

## Executive synthesis

The reports converge on an **adapter-based, evidence-oriented solver platform**, not one universal solver. The strongest common pattern is: versioned input schemas and unit conventions; a family-specific adapter; headless execution where verified; retained native artifacts; normalized outputs; regression fixtures; and an explicit separation between **engine result**, **validation evidence**, and **professional interpretation**. Almost every report marks cross-platform bit-for-bit determinism as **UNKNOWN** and requires pinned versions, controlled environments, tolerances, and provenance instead of byte equality.

Open-source tools are sufficient for a broad first pilot, but they are specialized. IFC/BIM and geometry tools are not engineering solvers; EnergyPlus is not CFD; Radiance is not thermal or acoustic; EPANET is not complete building plumbing; OpenDSS/pandapower are not BIM electrical-design systems; crowd solvers are not fire physics; OR-Tools is not an LCA database; SciPy is not a complete MCDA/finance platform; and CFD is not wind-tunnel measurement. The platform should preserve these boundaries in both APIs and user-facing claims.

## Cross-family decision table

| Family | Successful open/research baseline | What it is good for | Boundary that must remain explicit |
|---|---|---|---|
| Spatial/BIM/CAD | **IfcOpenShell** for server-side IFC processing; **web-ifc** for browser/Node IFC; **Three.js** for visualization; GDAL/PROJ/GEOS for GIS context | IFC authoring/conversion/validation, geometry processing, scene presentation, CRS and 2D topology | Not structural, MEP, fire, code, or professional approval; no IFC4.3 round-trip claim; OCCT is needed only for exact CAD-kernel operations |
| Energy/thermal | **EnergyPlus + OpenStudio** | Whole-building loads, HVAC/plant, weather-driven energy, workflow/measure automation | Accuracy depends on model, schedules, weather and controls; not general CFD, structural, or IAQ proof |
| Daylight/solar | **Radiance**, linked to EnergyPlus/OpenStudio where thermal consequences matter | Daylight, illuminance/luminance and solar-optical analysis; validated optical workflows | Not a thermal-balance or acoustics engine; `pyradiance`/Radiance version alignment must be governed |
| Acoustics | **pyroomacoustics** for Python research/fixtures; **I-Simpa** when 3D architectural acoustics and ISO 3382-style metrics are required | RIRs, room/array algorithms; particle tracing and room-acoustic parameters | pyroomacoustics is research-oriented; I-Simpa is GPLv3, pre/post-processing with numerical codes, and standalone headless use is not established |
| Airflow/fire/smoke | **CONTAM + FDS**, with Smokeview only for visualization | Whole-building multizone airflow/IAQ/smoke management plus appropriate fire-driven CFD | CONTAM is not near-field fire CFD; FDS is scenario/model/grid dependent; Smokeview is not a solver; official FDS-to-CONTAM production coupling was not verified |
| Wind CFD/aerodynamics | **OpenFOAM** for broad CFD; **SU2** for aero/adjoint/shape optimization | Scripted CFD, parametric studies, aerodynamic optimization and regression | Neither is a wind tunnel or certification evidence; physical correlation may require professional testing |
| Hydraulics/electrical networks | **EPANET** for pressurized water; **pandapower** for Python-native power studies; **OpenDSS** when utility-distribution fidelity is required | Water hydraulics/water quality; power flow, OPF, state estimation, short circuit, DER and time series | No verified native IFC/BIM translation; not complete building plumbing/electrical design or code compliance |
| Structural/geotechnical FEM | **OpenSeesPy** for script-first structural/seismic research; **Code_Aster** for broad open coupled engineering; **CalculiX** for structural regression fixtures | Nonlinear/dynamic structural and geotechnical studies; broad FEM; conventional structural benchmarks | OpenSees commercial redistribution requires UC licensing; none establishes design approval or code compliance |
| Transport/evacuation | **JuPedSim** for programmable microscopic research; **Vadere** for 2D console/model comparison; NIST Egress Estimator as analytical screen | Crowd movement, route/queue scenarios, transparent early egress screening | JuPedSim elevator and several V&V features are pending/unknown; Vadere is explicitly 2D; screening is not final life-safety analysis |
| Optimization/risk | **OR-Tools CP-SAT** for discrete scheduling; **SciPy** for numerical optimization/statistics/QMC | Resource-constrained scheduling, discrete alternatives, continuous optimization, sampling and numerical risk prototypes | CP-SAT is not LCA/carbon accounting or a digital twin; SciPy is not native AHP/TOPSIS/PROMETHEE, finance governance, or a complete risk platform |

## Minimum pilot stack

The smallest defensible cross-family pilot is a **shared orchestration/provenance layer plus one governed adapter per required evidence domain**:

1. **Shared platform contract:** Python-based adapter workers; versioned schemas and units; canonical model/input hashes; solver and platform metadata; options/tolerances; seed when applicable or explicit `UNKNOWN`; convergence/status; warnings; native outputs; normalized outputs; and fixture-based regression with tolerances. Treat failed convergence, `FEASIBLE` without optimality proof, and `UNKNOWN`/timeout as typed outcomes.
2. **Model and geometry boundary:** IfcOpenShell as the server-side IFC authority, with web-ifc only where browser/Node ingestion is needed and Three.js as presentation. Keep BIM-to-solver translations explicit and lossy transformations reviewable. Add GDAL/PROJ/GEOS only for site/GIS needs.
3. **Building performance lane:** EnergyPlus + OpenStudio for thermal/energy workflows and Radiance for daylight/solar optics. Keep optical, thermal, and acoustic inputs/outputs separate even when OpenStudio orchestrates them.
4. **Network lane:** EPANET for water distribution and pandapower for Python-native electrical studies. Add an OpenDSS adapter only when utility-distribution, multiphase, DER, harmonic, fault, or quasi-static time-series fidelity is a pilot requirement.
5. **Physics and safety lane:** CONTAM + FDS for the distinct multizone and fire-CFD questions; OpenFOAM for broad CFD/wind studies. Use Smokeview only as a retained visualization/post-processing step. Use OpenSeesPy for the initial script-first structural/seismic lane; reserve Code_Aster for cases requiring its broader coupled capabilities.
6. **Movement and decisions lane:** JuPedSim plus the NIST analytical egress baseline; OR-Tools CP-SAT for construction/discrete scheduling; SciPy for numerical optimization and sampling. Use pyroomacoustics for acoustic RIR/algorithm fixtures, adding I-Simpa only behind an explicit acoustic requirement and license/headless gate.

This is a **pilot selection**, not a claim that every listed component must ship in the first product release. The first implementation should select a smaller vertical slice—IFC input → one building/network model → one solver run → validation fixture → provenance record—before expanding to coupled workflows.

## Commercial tools to defer

Defer commercial/proprietary tools until an open baseline, required evidence gap, and procurement case are demonstrated:

- **PLAXIS 2D/3D:** strongest specialist professional geotechnical option in the reviewed material, but proprietary/subscription licensed; full unrestricted headless-service rights were not established and Bentley terms restrict commercial hosting absent appropriate arrangements.
- **Pathfinder:** strongest first professional egress evaluation candidate in the reviewed set, with documented scripting, batch execution, CSV/JSON and V&V material, but exact license/pricing and fixed-seed/replay contract remain unknown.
- **PTV Viswalk, LEGION, buildingEXODUS and AnyLogic Pedestrian Library:** viable professional alternatives for large, multimodal, specialist or hybrid models, but reviewed sources did not establish all required licensing, headless/API, deterministic, and public-V&V details.
- **Professional wind-tunnel testing:** defer until CFD identifies a decision requiring measured aerodynamic evidence. It is a physical facility, not a software solver; facility, instrumentation, correction, repeatability, and data-rights terms are facility-specific.

Commercial support, consulting, hosting, or vendor SLAs for otherwise open tools were not researched and remain separate procurement questions.

## Shared solver opportunities

The family reports support several reusable platform capabilities:

- **One run manifest and evidence envelope:** candidate, exact version/build or checksum where available, OS/architecture, adapter/schema version, input and dependency hashes, units, settings, seed, status, convergence, warnings, output hashes, fixture IDs, and human review state.
- **One adapter pattern:** `source model → validated solver model → run → native artifact retention → normalized result → validation/professional gate`. This is especially important for IFC-to-network, IFC-to-energy, geometry-to-CFD, and snapshot-to-optimization translations.
- **One regression strategy:** analytical or published benchmark, expected quantities with tolerances, known-failure/unsupported case, sensitivity or convergence check, and reproducible provenance. Do not use exact assignment equality where tied optimization solutions are valid.
- **One uncertainty vocabulary:** distinguish numerical convergence, verification, empirical validation, uncertainty, and professional interpretation. A solver’s test suite is not validation of every project model; validation is quantity-, regime-, and application-specific.
- **One shared Python orchestration layer:** most selected baselines expose Python directly or through scripts/bindings; CLI-native engines can remain isolated subprocesses. Do not assume a stable Python SDK where the family report marked only script orchestration or no API.
- **Cross-family optimization and coupling:** CP-SAT can select discrete design/procurement/sequencing alternatives using governed coefficients from energy, carbon, network, or schedule adapters; SciPy can perform continuous calibration/sensitivity/sampling; EnergyPlus callbacks can support controlled runtime data exchange. These are integration opportunities, not proof of a turnkey digital twin or closed-loop controller.
- **Evidence-aware UI:** present numerical results with solver version, assumptions, validation state, unsupported features and uncertainty, never as an unqualified “design approved” result.

## License and redistribution risks

The following are the principal risks requiring a dependency-level bill of materials and legal review before redistribution or hosted service deployment:

- **Copyleft or reciprocal obligations:** OpenFOAM (GPLv3-or-later), SU2 (LGPL-2.1), I-Simpa (GPLv3), IfcOpenShell (LGPL-3.0-or-later; ecosystem exceptions vary), CalculiX (GPL), OCCT (LGPL 2.1 with special exception), JuPedSim/Vadere (LGPLv3), and the exact bundled components of OpenStudio/Radiance integrations.
- **Special or mixed terms:** OpenSees/OpenSeesPy permits education/research/non-profit noncommercial and internal use, but commercial product redistribution requires a University of California license. EPANET materials document public-domain and MIT-licensed portions; inspect the exact files shipped. Radiance has its own permissive Radiance Software License with attribution/non-endorsement conditions. EnergyPlus and pandapower are BSD-family; OR-Tools is Apache 2.0, with optional commercial backends/dependencies requiring separate review.
- **Unresolved core license facts:** the current EPRI OpenDSS-C core license text was not verified; do not apply OpenDSSDirect.py’s wrapper license to the core engine. CONTAM is public domain per NIST, but the reviewed API paper described related source code in a private GitLab repository; binary/source provenance still needs deployment review.
- **Commercial EULA/entitlement:** PLAXIS and the deferred commercial egress products require product-specific entitlement checks. A free trial or open documentation is not a redistribution or hosted-service grant.
- **Disclaimer ≠ warranty:** open-source or public-domain status does not provide accuracy, safety, professional sign-off, or liability protection. Preserve notices, attribution, name-use provisions, patent/dependency obligations, and “as-is” disclaimers as applicable.

## Unknowns and follow-up gates

The reports intentionally leave these facts unresolved; they must not be filled by assumption:

1. The authoritative **C1–C80 definitions, scoring rubric, and evidence requirements** were not supplied/verified, so this synthesis does not assign C-number pass/fail claims.
2. **Bit-for-bit determinism** across platforms, compilers, hardware, MPI/thread counts, graphics backends, and solver versions is not established for the families; the project must test its pinned execution profiles.
3. Exact current **OS/version support matrices**, packaging, exit codes, and long-term support/SLA terms vary by release and remain incomplete for several candidates.
4. Stable, supported **Python APIs or standalone CLIs** are not established for OpenFOAM, SU2 as an importable SDK, CONTAM–CFD0 as a universal coupled headless workflow, I-Simpa, pyroomacoustics, some EPANET/OpenDSS variants, JuPedSim’s current CLI, and several commercial products.
5. **Native BIM/IFC ingestion and semantic fidelity** for EPANET, OpenDSS, pandapower and other discipline solvers were not verified; adapters and round-trip/translation fixtures are required.
6. **Coupled end-to-end validation**—especially Radiance–OpenStudio–EnergyPlus, CONTAM–FDS, geometry-to-CFD, IFC-to-networks, and snapshot-to-CP-SAT—is not established by the family reports.
7. Acoustic measured-room validation sufficient for professional architectural claims remains unknown for I-Simpa and pyroomacoustics; JuPedSim elevator/reduced-mobility/FED coverage is explicitly incomplete or pending.
8. Exact **OpenStudio bundled dependency**, `pyradiance` versus current Radiance compatibility, OpenDSS core, EPANET redistribution, and commercial-tool license compatibility require audit before shipping.
9. No candidate establishes **code compliance, stamped design, life-safety approval, certification, environmental declaration, financial regulation, or professional engineering authorization** without application-specific evidence and qualified review.

## Source reports

This synthesis is derived from the ten family reports in this directory: [airflow-fire](airflow-fire.md), [cfd-wind](cfd-wind.md), [energy](energy.md), [hydraulic-electrical](hydraulic-electrical.md), [lca-digitaltwin-construction](lca-digitaltwin-construction.md), [lighting-acoustics](lighting-acoustics.md), [optimization-risk](optimization-risk.md), [spatial-bim](spatial-bim.md), [structural-geotech](structural-geotech.md), and [transport-evacuation](transport-evacuation.md). Their cited official sources and access dates remain the evidence record; this document adds no external solver claims.

**Bottom line:** start with a pinned, provenance-first open stack and narrow vertical pilot. Keep commercial specialists deferred until an explicit evidence gap justifies them, and never collapse solver output into professional approval.

**Report path:** `/home/ubuntu/generador-familias/SOLVER_MAP_RESEARCH/00-synthesis.md`
**Aurora:** not used.
**Execution:** no software installed or executed during this synthesis.
