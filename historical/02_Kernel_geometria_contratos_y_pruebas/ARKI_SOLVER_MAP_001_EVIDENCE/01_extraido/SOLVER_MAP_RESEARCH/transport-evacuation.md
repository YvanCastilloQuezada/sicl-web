# ARKI-SOLVER-MAP-001 — Vertical transportation, evacuation and crowd

**Access date for all URLs:** 2026-09-24. **Research status:** bounded source review; no software installed or executed. **Aurora:** not researched and no Aurora artifact used.

## Executive assessment

This solver family spans three different classes: microscopic pedestrian/crowd simulators, analytical egress screening, and commercial professional products. They are not interchangeable. A microscopic solver can study congestion, route choice, stair/lobby interaction, heterogeneity and scenario response, but requires calibration and validation. An analytical method is transparent and reproducible for early screening, but compresses occupant behavior and infrastructure detail. A professional product may provide maintained import/export, reporting, vendor verification material and support, but commercial status is not evidence of universal validity or code compliance.

**Recommended open programmable baseline:** JuPedSim, because its current official interface is Python over a C++ core, its architecture is single-threaded, and its public V&V dashboard exposes both passing tests and unsupported/pending features. **Recommended open console/model-comparison alternative:** Vadere, whose official repository provides Java console execution and multiple locomotion models, but explicitly scopes the framework to two-dimensional systems. **Recommended analytical baseline:** the NIST Egress Estimator described in TN 1722. **Recommended professional first evaluation:** Pathfinder, because its official documentation covers stairs/elevators, command-line execution, Python scripting, CSV/JSON output, Monte Carlo, and vendor-published V&V tests.

## C1–C80 relevance

The local ARKI registry and status matrix identify all C01–C80 as not demonstrated/verified. The mapping below is therefore **relevance only**, not implementation evidence.

| IDs | Relevant capabilities | Applicability and boundary |
|---|---|---|
| C01–C02 | Spatial Syntax; architectural circulation | Direct: route graphs, visibility, paths, queues, stairs, lifts, exits and transfer times. A crowd solver is not a complete space-syntax engine. |
| C05 | Normativa como Código | Egress assumptions and SFPE-style comparison are relevant. Solver output is not a legal determination; jurisdiction, code edition and AHJ review remain external. |
| C14 | Monte Carlo | Direct for uncertain initial conditions, occupant parameters and sensitivity. Seed/replay policy must be explicit. |
| C30–C32 | Avatar, Luka, contextual guidance | Results can support explanations and route narratives, but visualization does not establish physical-model validity. |
| C34–C38 | CAD/BIM/point cloud/IFC/gbXML | Professional tools advertise imports; open tools require adapters. Import fidelity and multi-storey topology need separate tests. |
| C44 | Dashboards | CSV/JSON and analysis exports can feed dashboards; provenance, units and schema must be governed. |
| C72 | Quantitative risk management | Evacuation time, density, queueing, route failure and sensitivity are useful inputs; risk still needs hazard, exposure, consequence and uncertainty models. |
| C74 | Specialized buildings | Direct for tall buildings, stations, airports, stadiums and hospitals, but validation must be building/domain specific. |
| C79 | Universal design | Mobility profiles, assisted evacuation, stairs and elevators are directly relevant; accessibility conclusions require explicit assumptions and professional review. |
| C80 | Wayfinding and signage | Route choice, exit closure, alerts and signage response may be modeled; comprehension and behavior require calibration. |

This family does not replace C03/C17–C22 (thermal, CFD, FDS, EnergyPlus or OpenFOAM), C06/C07 (structural/MEP) or C37 IFC governance. Coupling is possible in some products, but a complete ARKI integration was not verified.

## Comparison

| Candidate | License / class | OS / language | Python API | CLI / headless | Determinism | I/O and vertical scope | Tests / validation | Limitation / professional boundary |
|---|---|---|---|---|---|---|---|---|
| **JuPedSim** | Open source; official repository says GNU LGPLv3. | Python package with C++ core; build docs require C++20, CMake and Rust. Cross-platform support is not fully enumerated on reviewed pages. | **Yes**, primary current interface. | Current project is a Python library; old pre-0.10 CLI is historical. A current separately documented CLI contract is **UNKNOWN**. | Official history says current architecture is single-threaded. Formal deterministic replay/seed guarantee is **UNKNOWN**. | Python-defined geometry, agents, models, routes and conditions. Official docs describe Collision Free Speed and Generalized Centrifugal Force models and multi-step route decisions. | Public V&V dashboard covers IMO, RiMEA, NIST TN 1822 and ISO 20414-related tests. It explicitly marks elevator usage, FED/incapacitation, reduced mobility and some social/group/flow cases pending or XFAIL. | Strong research baseline, not turnkey professional code-compliance software. Native elevator/fire feature coverage is not established and several V&V items are pending. |
| **Vadere** | Open source; official repository states GNU LGPL; fetched license is LGPLv3 text. | Windows, macOS, Linux; Java 17; optional OpenCL. | **UNKNOWN** from reviewed official sources. | **Yes:** `vadere-console.jar`, including `scenario-run -f ... -o ...`, without GUI. | Formal replay/seed guarantee **UNKNOWN**. | Scenario/project files, SI units; optimal steps, gradient navigation and social force models. Official README scopes tools to two-dimensional systems. | Repository ships scenarios/tests; primary paper describes verification/validation as integral. | Good open console/model-comparison framework, but stairs, elevators and validated multi-floor behavior are **UNKNOWN**; 2D scope is an explicit limitation. |
| **NIST Egress Estimator** | Government analytical method in NIST TN 1722; implementation license/package status **UNKNOWN**. | Implementation OS/language **UNKNOWN**. | **UNKNOWN**. | **UNKNOWN**. | Equations are reproducible in principle; implementation and rounding contract **UNKNOWN**. | Analytical stair geometry/load/flow and elevator cycle assumptions produce combined egress timing. | NIST compares stair predictions with fire-drill data and reports elevator result within 1% of a cited ELVAC calculation for the sample problem. The report calls it an early-design **screening tool**, not detailed final analysis. | Does not model rich individual behavior, dynamic route choice, smoke/FED, detailed congestion or operational uncertainty. Not a final life-safety engine. |
| **Pathfinder** | Commercial; official site advertises fully featured 30-day trial. Exact license/pricing **UNKNOWN**. | Official batch docs use Windows `.bat`; engine language **UNKNOWN**. | **Yes:** Python scripting and Results Scripting API documented. | **Yes:** `testsim.bat` runs one PTH/TXT model or PTH files in directories. | Monte Carlo and randomized initial conditions supported; fixed-seed/replay guarantee **UNKNOWN**. Active scenario command-line runs do not randomize; exported variations are required. | PTH/TXT; official page documents CSV/JSON output, stairs, elevators, occupant profiles, maximum elevator wait and alternate stair route. | Vendor says it validates/publishes tests against research; official stair passing test is available. That test also says no experimental data existed for its specific impaired-occupant trend. | Best documented professional building-egress candidate in this review, but still needs model-suitability, calibration, uncertainty and qualified review. |
| **PTV Viswalk** | Commercial; exact terms/pricing **UNKNOWN**. | PTV Vissim ecosystem; exact OS/language **UNKNOWN**. | Scripting/programming advertised; exact Python/COM contract **UNKNOWN**. | **UNKNOWN**. | **UNKNOWN**. | Official page documents microscopic pedestrians, multi-story buildings, stairs, ramps, escalators, elevators, evacuation, RSET heat maps, FDS result processing, CAD/DWG and BIM/IFC, large models and route decisions. | Page claims code reviews and white-box algorithms; public primary V&V suite not verified. | Strong transport/multimodal professional alternative; automation, licensing and deterministic boundaries need vendor confirmation. |
| **LEGION** | Commercial Bentley software; exact terms/pricing **UNKNOWN**. | Exact OS/language **UNKNOWN**. | Official docs/search identify C++ Simulator API; Python **UNKNOWN**. | **UNKNOWN**. | **UNKNOWN**. | Official docs cover tall buildings, stations, stadiums, airports, evacuation routes, model/result files, maps, time series, histograms, video and tables. | Docs describe quantitatively verifiable movement; primary public validation protocol not verified. | Mature professional planning/visualization option; confirm vertical transport, API licensing, batch mode and replay semantics. |
| **buildingEXODUS** | Commercial; FSEG says licenses available for purchase. Exact terms **UNKNOWN**. | Exact current OS/language **UNKNOWN**. | **UNKNOWN**. | **UNKNOWN**. | **UNKNOWN**. | FSEG describes evacuation and pedestrian circulation, people–people, people–fire and people–structure interactions across building, maritime, rail and aircraft suites. | Primary literature includes systematic comparison/validation; current test harness and exact stair/elevator coverage **UNKNOWN**. | Specialist fire/egress and consultancy boundary; not an open-source substitute. |
| **AnyLogic Pedestrian Library** | Commercial platform; Personal Learning Edition advertised; production terms/pricing **UNKNOWN**. | Platform OS/language **UNKNOWN** in reviewed source. | Platform programming/API exists; pedestrian-specific Python **UNKNOWN**. | Cloud parallel execution and API access advertised; local headless contract **UNKNOWN**. | Stochastic/parallel execution advertised; fixed-seed semantics **UNKNOWN**. | 2D/3D pedestrian flows, density maps, queues, evacuation, transport/staffing/facility coupling and Cloud API. | Accessible primary pedestrian V&V suite not verified. | Best for hybrid enterprise models; general platform flexibility does not prove life-safety validity or native elevator semantics. |

## Evidence notes

### JuPedSim

The official documentation describes a Python package with a C++ core and two microscopic models, plus conditional multi-step routes. Its history explains the transition from the older XML/CLI application to a Python library and states that the current architecture is single-threaded, leaving performance-critical sections in C++. The repository states LGPLv3 and gives C++20/CMake/Rust build requirements; nothing was installed. The public V&V dashboard is particularly valuable because it exposes gaps: elevator usage is pending because an elevator component is needed; FED, reduced mobility and several behavior/flow tests are pending or XFAIL. **Recommendation:** primary open research/programming candidate for C02, C14, C44, C74, C79 and C80 only with an explicit ARKI multi-storey adapter and validation suite.

### Vadere

Vadere's official README describes microscopic pedestrian/crowd simulation, optimal steps, gradient navigation and social force models for two-dimensional systems. It supports Windows, macOS and Linux and provides a Java console JAR for GUI-free execution. The official paper presents the framework as a way to compare locomotion models and includes verification/validation as part of the framework approach. **Recommendation:** open headless baseline for 2D crowd, route and bottleneck studies. Do not infer native, validated stairs/elevators from the existence of a 2D simulator.

### NIST analytical baseline

NIST TN 1722 defines a simple combined stairwell/elevator estimator based on SFPE stair methods and elevator calculations associated with Klote and Alvord. It explicitly describes screening for early design. The elevator comparison is within 1% of the cited ELVAC calculation under its sample assumptions. NIST's stair publication provides primary reference data: over 22,000 measurements from 14 buildings (six to 62 stories), with mean movement speed 0.44 m/s ± 0.19 m/s and wide local-speed variation. **Recommendation:** use as a transparent early-stage oracle and regression baseline, not as a microscopic or final professional model.

### Pathfinder

Official pages document evacuation, assisted evacuation, threat awareness, fire exposure and egress-code analysis. The docs specify maximum elevator wait time and alternate stair use, command-line `testsim.bat`, scenario/variation export, Python scripting, CSV/JSON results and Monte Carlo. Its official stair test evaluates passing around slow occupants and warns that disabled/wounded occupant behavior is complex; it states no experimental data was available for that specific impaired-occupant trend. **Recommendation:** first professional product to evaluate for building egress where audit-friendly automation and vendor V&V material matter.

### Other professional alternatives

PTV Viswalk's official page is strongest for multimodal transport and large crowds: it lists multi-storey movement, stairs, escalators, elevators, evacuation, FDS-result processing, BIM/IFC and programming. LEGION's official Bentley docs cover tall buildings, stations, stadiums, airports, evacuation routes and rich result exports; official search documentation identifies a C++ Simulator API. FSEG's official EXODUS page covers performance-based evacuation/circulation and people–people/fire/structure interaction across building, maritime, rail and aircraft suites, with purchasable licenses and consultancy. AnyLogic's official Pedestrian Library page covers pedestrian flows, queues, evacuation, 2D/3D analysis, operational coupling and Cloud API/parallel execution. For each, the reviewed official pages did not verify every requested field, so unknowns remain explicit.

## Recommended ARKI adapter contract

1. **Geometry:** versioned multi-floor topology for rooms, corridors, stairs, ramps, escalators, elevators, doors, exits and refuge areas, with source IDs, units and connectivity.
2. **Occupants:** start locations, population, desired-speed distribution, pre-movement delay, mobility/accessibility profile, route policy, group behavior and assistance policy.
3. **Hazard separation:** distinguish movement-only, smoke/FED, fire, closure and operational assumptions; do not infer fire physics from an egress solver.
4. **Execution provenance:** solver/version, platform, input hash, configuration, seed or explicit UNKNOWN, replication count and warnings.
5. **Outputs:** completion times, trajectories when available, queues, density, flows, route changes and failures, preserving original solver artifacts plus normalized ARKI records.
6. **Validation fixtures:** corridor speed, up/down stair speed, bottleneck flow, exit closure, route allocation, high-rise stair data and elevator-cycle cases, including negative tests for unsupported features.
7. **Professional gate:** no compliance or life-safety claim without applicable code edition, AHJ context, suitability statement and qualified review.

## Unknown register

- JuPedSim current fixed-seed/replay guarantee, complete output schema and separately documented current CLI.
- JuPedSim native elevator implementation (the public V&V dashboard marks elevator usage pending).
- Vadere native multi-floor/stair/elevator semantics, Python API, fixed-seed policy and professional egress validation.
- NIST Egress Estimator current redistributable package, implementation language, CLI and license.
- Pathfinder exact license/pricing, full OS support, and fixed-seed/replay contract.
- PTV Viswalk exact headless/API procedure, license, deterministic semantics and public primary V&V suite.
- LEGION exact license, OS, SDK terms, batch/headless process, seed contract and primary public validation protocol.
- Current buildingEXODUS OS, API/CLI, deterministic contract and exact elevator implementation.
- AnyLogic production license, pedestrian-specific Python API, local headless process, seed semantics and public primary V&V suite.
- Suitability for any particular jurisdiction, occupancy, hazard, accessibility case or code edition without project-specific validation and qualified review.

## Sources (all accessed 2026-09-24)

### Open and analytical

- [JuPedSim documentation](https://www.jupedsim.org/)
- [JuPedSim stable documentation](https://www.jupedsim.org/stable/)
- [JuPedSim official repository](https://github.com/PedestrianDynamics/jupedsim)
- [JuPedSim history and Python API rationale](https://www.jupedsim.org/v1.0.3/history.html)
- [JuPedSim public V&V coverage](https://pedestriandynamics.org/jupedsim-web-community/)
- [Vadere official repository](https://github.com/pedestrian-dynamics-HM/vadere)
- [Vadere license file](https://github.com/pedestrian-dynamics-HM/vadere/blob/master/LICENSE)
- [Vadere primary framework paper](https://arxiv.org/abs/1907.09520)
- [NIST TN 1722, Simple Estimates of Combined Stairwell/Elevator Egress](https://nvlpubs.nist.gov/nistpubs/TechnicalNotes/NIST.TN.1722.pdf)
- [NIST Movement on Stairs During Building Evacuations](https://www.nist.gov/publications/movement-stairs-during-building-evacuations-0)

### Professional alternatives

- [Pathfinder product](https://www.thunderheadeng.com/pathfinder/)
- [Pathfinder life-safety analysis and V&V](https://www.thunderheadeng.com/pathfinder/life-safety/)
- [Pathfinder command-line simulation](https://www.thunderheadeng.com/docs/latest/pathfinder/simulation/starting/)
- [Pathfinder passing-on-stairs verification](https://www.thunderheadeng.com/docs/2026-1/pathfinder/appendices/verification-validation/behavior/passing-on-stairs/)
- [PTV Viswalk](https://www.ptvgroup.com/en/products/pedestrian-simulation-software-ptv-viswalk)
- [LEGION Model Builder](https://docs.bentley.com/LiveContent/web/LEGION%20Model%20Builder%20Help-v4/en/GUID-ADE9C4CC-03E0-4C16-A782-01C7C5E7B877.html)
- [LEGION Simulator](https://docs.bentley.com/LiveContent/web/LEGION%20Simulator%20Help-v5/en/GUID-ADE9C4CC-03E0-4C16-A782-01C7C5E7B877.html)
- [FSEG EXODUS](https://fseg.gre.ac.uk/exodus/)
- [AnyLogic Pedestrian Library](https://www.anylogic.com/features/libraries/pedestrian-library/)

**Final recommendation:** register JuPedSim, Vadere, NIST Egress Estimator and Pathfinder as the primary four candidates in ARKI-SOLVER-MAP-001, with PTV Viswalk, LEGION, buildingEXODUS and AnyLogic as professional alternatives. Preserve solver-specific limitations and unknowns; do not collapse the family into one solver truth.

**Report path:** `/home/ubuntu/generador-familias/SOLVER_MAP_RESEARCH/transport-evacuation.md`

**No software was installed or executed.**
**No Aurora artifacts or sources were used.**

[End of report]
