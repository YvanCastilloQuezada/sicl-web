# ARKI-SOLVER-MAP-001 — Hydraulics and Electrical Networks

**Research access date:** 2026-09-24  
**Scope:** EPANET, OpenDSS, pandapower, and building-design gaps.  
**Exclusions:** Aurora and Aurora artifacts were not researched or used.

## Executive conclusion

This solver family is best treated as a **set of specialized network-analysis engines**, not as a complete building-design solver. EPANET is the strongest open implementation for pressurized drinking-water distribution and water quality. OpenDSS is the strongest fit for detailed, multiphase electric-utility distribution, distributed-energy-resource studies, harmonics, faults, and quasi-static time series. pandapower is the strongest fit for Python-native automation, tabular network modeling, optimization, state estimation, short-circuit analysis, and reproducible research workflows.

None of the three candidates is a verified replacement for a building information modeling (BIM) authoring system, architectural/MEP coordination platform, building-code checker, or whole-building energy model. A building-design workflow would need an explicit translation layer from BIM/IFC and engineering schedules into solver-specific networks, followed by discipline-specific review. IFC can represent building and MEP information, but no native IFC-to-EPANET, IFC-to-OpenDSS, or IFC-to-pandapower capability was verified in the official sources reviewed.

For ARKI-SOLVER-MAP-001, the recommended architecture is **adapter-based**: use EPANET for water-distribution hydraulics, OpenDSS or pandapower for electrical studies according to the required fidelity, and keep building-design semantics, geometry, code compliance, equipment schedules, and multidisciplinary coordination outside these engines. Treat all claims of bitwise determinism as **UNKNOWN** unless a pinned version, platform, solver configuration, numerical tolerance, and regression corpus are specified and tested.

## Comparison at a glance

| Candidate | Primary domain | Open-source status | Main interface | Headless route | Best verified use | Important boundary |
|---|---|---|---|---|---|---|
| **EPANET 2.2 / EPA engine** | Pressurized water-distribution hydraulics and water quality | Openly available; official materials describe public-domain software, while the official repository contains public-domain and MIT-licensed material | C toolkit/API; Windows GUI; project/input/output files | Toolkit/API; command-line execution is documented in the official manual | Water-network design, operations, water age, reactions, fire-flow and resilience studies | Not a general building-plumbing, sanitary-drainage, BIM, or code-compliance engine |
| **OpenDSS** | Detailed electric utility-distribution simulation | Open-source implementation from EPRI is verified; exact current core-license terms were not verifiable from the official repository metadata reviewed | Stand-alone executable and text scripting; Windows COM; non-COM library interfaces; external Python/MATLAB/C#/R control | Official executable with `.dss` script and `/nogui`; DLL/API embedding | Multiphase distribution planning, DER, harmonics, faults, dynamics, quasi-static time series | Not a building electrical-design/documentation or electrical-code compliance product |
| **pandapower** | Python power-system modeling and automation | BSD 3-Clause, verified from official license file | Python API with pandas data structures; file converters; no dedicated first-party CLI verified | Python script/notebook/service process; exact dedicated CLI is UNKNOWN | Automated power flow, OPF, state estimation, short circuit, topology, time series and optimization | More abstract than a BIM/MEP design tool; fidelity depends on element models and selected solver |

## Candidate 1 — EPANET 2.2 / EPA engine

### Identity, license, platform, and language

The United States Environmental Protection Agency describes EPANET as a Windows-based application for drinking-water distribution systems and states on its public page that EPANET is public-domain software that may be freely copied and distributed [1]. The official `USEPA/epanet-engine` repository identifies itself as EPA-maintained, says the source is written in C, and describes EPANET as released under the MIT license [2]. The repository license file is more nuanced: original EPANET 2.0.12 material and U.S. Government material are marked public domain, while material from OpenWaterAnalytics is released under the MIT License [3]. Therefore, **open source: YES, with mixed/public-domain and MIT-licensed components as documented; a blanket single-license label would be inaccurate**.

The EPA web page explicitly lists the 2.2 source-code archive and Programmer’s Toolkit [1]. The official repository is not archived and its GitHub metadata reports C as the primary language; the repository metadata also reports recent updates, although repository activity alone is not a guarantee of feature velocity or support quality [4].

### API, CLI, headless execution, and input/output

EPANET has a C Programmer’s Toolkit/API intended for embedding and customization. The EPA page describes the toolkit as a dynamic-link library of functions that developers can incorporate into applications [1]. The 2.2 manual describes an enhanced API function library and documents project files, text export/import, scenarios, analysis execution, and reporting [5]. This makes API-driven, headless use a strong fit for a solver service or batch pipeline.

The official 2.2 manual includes a command-line topic, but the exact executable invocation and exit-code contract were not independently verified from the extracted official page content. **CLI: documented in the official manual; exact current CLI contract and cross-platform behavior: UNKNOWN.** The EPA-distributed GUI is Windows-based [1]. The C engine/toolkit can be built and embedded outside the GUI, but a supported, uniform binary distribution matrix was not verified here.

Typical input/output is a network project and associated text/scenario data containing junctions, pipes, pumps, valves, tanks, reservoirs, demands, controls, patterns, reactions, and reporting options. Outputs include pipe flows, node pressures, tank levels, energy usage, reaction quantities, concentration, water age, source tracing, tables, graphs, and reports [1] [5].

### Technical scope

EPANET performs extended-period simulation of hydraulic and water-quality behavior in pressurized pipe networks. The official capability list includes pressure-dependent demand, rule-based controls, Hazen–Williams, Darcy–Weisbach and Chezy–Manning friction, minor losses, variable-speed pumps, pump energy and cost, valves, variable-shape tanks, multiple demand categories, emitters, and robust handling of low or zero flow [1]. Its water-quality model covers complete-mix, plug-flow and two-compartment tanks; reactive and non-reactive constituents; water age; source tracing; bulk and wall reactions; mass-transfer limits; and time-varying sources [1].

This is a hydraulic network solver for **pressurized drinking-water distribution**, not a universal fluid solver. The official sources do not establish support for open-channel hydraulics, detailed building sanitary drainage, wastewater treatment, air systems, district heating, two-phase flow, CFD, or building-code compliance. Those are **out of scope or UNKNOWN**, rather than capabilities to infer from the general word “hydraulics.”

### Determinism and testability

A formal EPANET guarantee of bitwise determinism across operating systems, compilers, CPU architectures, or library builds was not found. **Determinism: UNKNOWN as a contractual guarantee.** For a fixed engine version, compiler, input text, options, and numerical environment, a conventional batch run is plausibly repeatable, but that engineering expectation is not a verified guarantee and must not be represented as one.

Testability is comparatively strong because the engine is source-available, has a documented toolkit, uses text-oriented model files, and exposes explicit numerical outputs. The official repository advertises automated build-and-test workflow status in its README [2], while the official manual states that installation programs were extensively tested and verified but may still contain errors and may not apply to all cases [5]. A project should add golden-file regression tests for hydraulic convergence, mass balance, controls, pressure-dependent demand, water quality, low-flow cases, and representative benchmark networks.

### Validation and primary evidence

The official EPA manual states that the installation programs were extensively tested and verified, while also disclaiming that complex software may contain errors or be inapplicable to some cases [5]. The EPA capability page identifies the production use cases and numerical features [1]. For independent or community benchmark evidence, the Centre for Water Systems at the University of Exeter publishes benchmark water-distribution problems and EPANET files [6]. Those benchmarks are useful for regression and cross-solver comparison, but they do not constitute an EPA certification of every model or application.

### Limitations and professional boundary

EPANET is appropriate as a computational engine for a qualified water engineer’s network analysis. It is not, by itself, a stamped design, permit package, construction document, asset-management system, or code-compliance determination. A professional workflow still needs verified field data, demand and fire-flow assumptions, material and roughness selection, calibration, boundary-condition review, transient/surge review where applicable, and engineering sign-off. The EPA repository explicitly provides the code “as is” and places responsibility for use on the user [2].

### Recommendation

**Recommend EPANET as the default open solver for the hydraulics portion of ARKI-SOLVER-MAP-001**, provided the target is a pressurized water-distribution network. Wrap the C API or a pinned engine build behind an adapter that records engine version, input hash, unit system, solver options, convergence status, warnings, and output hashes. Do not market the result as complete building plumbing design without additional domain models and professional review.

## Candidate 2 — OpenDSS

### Identity, license, platform, and language

EPRI’s official OpenDSS documentation describes OpenDSS as a comprehensive electrical-system simulation tool for utility distribution systems. It states that the open-source implementation derives from the DSS program developed in 1997 and made open source by EPRI in 2008 [7]. The official documentation describes a stand-alone executable, a Windows DLL exposed through COM, and standard-function-call DLLs for platforms that do not support COM [7]. EPRI also maintains a public `epri-dev/OpenDSS-C` repository containing OpenDSS version 10 translated from Delphi into C++ [8].

**Open-source status: YES for the EPRI OpenDSS implementation, based on EPRI’s explicit “open-source” description.** The exact current license text for the core EPRI OpenDSS-C repository could not be verified: GitHub API metadata reports no recognized SPDX license and the repository’s accessible README did not expose a license file [9]. Do not substitute the license of a wrapper for the core engine. For example, OpenDSSDirect.py has its own BSD-style license and explicitly says it is an alternative/customized implementation not supported by EPRI [10].

**Commercial status:** OpenDSS is not presented in the official sources as a paid commercial-only solver; it is openly distributed by EPRI. Whether a particular vendor product, support contract, or redistribution package is commercial is package-specific and **UNKNOWN**.

The EPRI repository metadata identifies C++ and reports that the public repository is not archived; its commit history and release/support policy were not established as a formal service-level commitment [9].

### API, CLI, headless execution, and input/output

OpenDSS provides a text-based scripting interface in the executable, COM automation on Windows, and library interfaces for other platforms [7]. EPRI documents that users commonly drive OpenDSS from MATLAB, Python, C#, R, and other languages [7]. The official command-line note gives the executable form `OpenDSS filename.dss`, recommends adding `QUIT`, and documents `/nogui` for suppressing forms so scripts can run without a graphical interface [11]. **CLI and headless execution: YES, directly verified.**

OpenDSS scripts define circuit elements, controls, solution modes, and export/show commands. The official command-line note warns that scripts should export results to files and use unique circuit names or folders to avoid collisions [11]. The executable, COM/DLL interface, and external language wrappers therefore support both batch and embedded workflows. Exact output schemas depend on the selected `Show`, `Export`, text, COM, or wrapper interface; a single universal schema was not verified.

### Technical scope

EPRI states that OpenDSS supports nearly all common RMS steady-state/frequency-domain analyses for utility distribution planning, plus analyses motivated by distributed generation and smart-grid applications [7]. Documented solution modes include snapshot, daily, yearly, harmonics, dynamics, fault, and Monte Carlo fault studies [7]. The documentation also describes distribution planning, multiphase AC circuit analysis, DER interconnections, wind plants, unusual transformer configurations, harmonics/interharmonics, neutral-to-earth voltage, and IEEE test-feeder development [7].

The official solution-technique documentation describes a fixed-point iterative solution using a system admittance matrix and compensation currents. It reports typical convergence in 4–10 iterations for initial power flow and 2–3 for subsequent time-series solutions, while emphasizing that fixed-point methods depend on an initial guess and a convergence criterion [12]. That is a useful implementation fact but not a guarantee that every circuit converges.

OpenDSS is optimized for utility distribution analysis. It is not a general building electrical-design authoring environment, panel-schedule generator, architectural coordination tool, or electrical-code compliance engine. Its state-estimation documentation identifies real distribution difficulties including limited measurements, unknown switch/regulator states, unbalance, low X/R, inconsistent measurements, and limited distributed-generation measurements [13]. Those are important professional limitations for operational or measurement-driven use.

### Determinism and testability

A formal bitwise-determinism promise was not found. **Determinism: UNKNOWN as a guarantee.** The iterative method, convergence state, floating-point implementation, platform-specific DLLs, parallel or external wrapper behavior, and model controls can all affect reproducibility. A deterministic project profile should pin the executable/library build, script order, solver mode, tolerances, random seeds for any Monte Carlo study, locale, output settings, and platform. Even then, bitwise identity must be tested rather than assumed.

Testability is strong for scripted use because a `.dss` file can be version-controlled, executed headlessly, and compared through exported output files. EPRI’s official IEEE test-feeder resources provide primary cases covering 4-bus, 13-bus, 34-bus, 37-bus, 123-bus, 8500-node, neutral-earth-voltage, short-circuit, low-voltage-network, and other distribution scenarios [14]. The IEEE page says that several short-circuit cases were validated using multiple software packages under the same assumptions [14]. This is a strong external regression basis, but it is not evidence that every OpenDSS feature is independently validated.

### Validation and primary evidence

The strongest primary validation resource found is the IEEE PES Distribution System Analysis Subcommittee test-feeder collection [14]. It describes intended algorithm-testing uses and supplies feeder characteristics, expected agreement targets for small cases, corrections, and cases for unbalance, regulators, capacitors, short circuit, and detailed neutral modeling. EPRI’s own documentation supplies the model equations and intended solution modes [7] [12]. A separate FAQ from DSS-Extensions reports cross-validation against the official engine, but that is not an EPRI primary source and was not used as the main validation claim.

### Limitations and professional boundary

OpenDSS is suitable for engineering studies of utility distribution circuits when the model, assumptions, and convergence behavior are understood. It is not a substitute for utility interconnection procedures, protection coordination approval, equipment ratings, arc-flash analysis, construction drawings, or a professional engineer’s review. Results for detailed unbalanced feeders are highly dependent on phase connectivity, regulator/tap logic, transformer data, grounding assumptions, load models, and measurement quality. The EPRI state-estimation discussion explicitly describes observability and measurement problems in real distribution systems [13].

### Recommendation

**Recommend OpenDSS when ARKI requires detailed multiphase utility-distribution fidelity, DER hosting studies, harmonics, faults, or quasi-static time series.** Prefer the official EPRI executable/DLL or a clearly identified compatible binding. Record exact engine build, wrapper version, script, working directory, exported files, convergence messages, and any random seed. Treat third-party wrappers and alternative engines as separate candidates, not as interchangeable proof of the EPRI core license or numerical identity.

## Candidate 3 — pandapower

### Identity, license, platform, and language

The official pandapower documentation describes a Python power-system calculation program that combines pandas with PYPOWER and targets automation of analysis and optimization [15]. The official repository identifies support for multiple solver backends, including an improved Newton–Raphson implementation, PYPOWER solvers, PowerGridModel, lightsim2grid, and PowerModels.jl [16]. The repository’s primary language is Python, and current GitHub metadata reports the project as active and not archived [17].

The official repository license file is the **BSD 3-Clause License** [18]. **Open source: YES.** Unlike the core OpenDSS repository metadata, pandapower’s license terms are directly available and unambiguous in the reviewed official file.

### API, CLI, headless execution, and input/output

pandapower is primarily a Python API. Networks are represented as pandas-backed element tables, and the official documentation exposes element models for buses, lines, transformers, loads, generators, storage, switches, measurements, controllers, and power-electronics-related components [15]. The documentation covers power flow, contingency, optimal power flow, short circuit, state estimation, controller simulation, time series, topology, plotting, and save/load [15].

pandapower supports time-series execution through controllers that update network values at each time step [19]. It also provides converters for exchanging network data with other power-system-analysis tools [20], while the detailed list and version-specific import/export behavior must be pinned to the selected release. **Python API: YES.** **Headless execution: YES through ordinary Python scripts or a service process.** **Dedicated first-party CLI: UNKNOWN; none was verified in the official documentation reviewed.**

Inputs are normally constructed or imported into the network data structure. Outputs are element-table results, convergence/status information, and exported network/result files. The exact schema depends on the selected calculation and version. This tabular representation is a strong fit for automated pipelines, data validation, comparison, and downstream analytics.

### Technical scope

The official project documentation and primary paper describe power flow, optimal power flow, state estimation, topological graph searches, short-circuit calculations according to IEC 60909, and static/quasi-static analysis of balanced power systems [15] [21]. The official documentation also lists asymmetric loads/generators, DC elements, three-winding transformers, storage, SVC/TCSC/SSC/VSC elements, contingency analysis, and time series [15]. The project can call several solver backends [16].

This breadth is valuable, but it also means results depend on the selected backend, element model, initialization, options, and version. The primary paper says the element models were validated against industry-standard software tools [21], and the official project page gives concrete comparison tolerances and examples against PowerFactory and PSS Sincal [22].

pandapower does not itself provide building geometry, BIM authoring, architectural spaces, panel schedules, cable-tray routing, electrical-code compliance, or a complete building energy model. Its sibling pandapipes project is recommended by the official repository for pipe networks, which confirms that core pandapower is an electrical solver rather than a combined water-and-electric building model [16].

### Determinism and testability

No formal bitwise-determinism guarantee was found. **Determinism: UNKNOWN as a guarantee.** The choice among multiple solver backends, BLAS/LAPACK implementations, JIT behavior, floating-point libraries, parallelism, controller order, and time-series inputs can affect exact output. Repeatability is achievable only as a project configuration and test objective, not as an assumed library promise.

Testability is the strongest of the three candidates for Python-centric CI. The official project page says pandapower is tested with pytest, reports more than 250 tests, and states that power-flow and short-circuit results are automatically validated against commercial software. It gives example maximum deviations for voltage magnitude, voltage angle, current, power, and element loading [22]. The official repository contains a structured test tree spanning API, contingency, control, converter, estimation, load flow, networks, OPF, plotting, protection, short circuit, time series, topology, and toolbox tests [23].

### Validation and primary evidence

The official validation statement is unusually specific: pandapower compares element behavior against DIgSILENT PowerFactory or PSS Sincal and supplies tolerances such as 0.000001 pu for voltage magnitude, 0.01 degrees for voltage angle, 0.000001 kA for current, 0.005 kW for power, and 0.001% for element loading [22]. The primary pandapower paper describes the solver, network representation, and validation against industry-standard tools [21]. The IEEE PES test-feeder collection provides additional independent cases that can be imported or recreated for distribution regression, although it is not a pandapower-specific certification [14].

### Limitations and professional boundary

pandapower is a powerful automation and analysis library, but its convenience does not remove engineering judgment. A model can converge while still being wrong because of incorrect topology, parameters, units, phase assumptions, measurement quality, or solver selection. Commercial-software agreement is model- and case-specific; it is not a guarantee for every element, backend, or operating regime. IEC 60909 short-circuit implementation is a calculation capability, not a complete protection study or code approval.

### Recommendation

**Recommend pandapower as the default Python orchestration layer for automated electrical studies, parameter sweeps, optimization, regression, and integration with data pipelines.** Pin pandapower and backend versions, explicitly select the solver, persist input/result tables, use a stable test corpus, and compare against golden outputs and independent reference cases. For highly detailed multiphase utility-feeder behavior, compare results against OpenDSS and IEEE feeders rather than assuming equivalence.

## Building-design gaps

### What the candidate engines do not provide

The reviewed engines solve network abstractions. They do not provide a complete building-design workflow covering architectural geometry, spaces and zones, BIM object authoring, equipment schedules, MEP coordination, constructability, quantity takeoff, permitting, or professional sign-off. IFC is a vendor-neutral, open international data model for the built environment. buildingSMART states that IFC can describe building and civil-infrastructure objects, MEP systems, energy-analysis models, processes, and relationships [24]. That makes IFC a possible exchange boundary, not proof of a native solver integration.

Building energy modeling is a separate discipline. The U.S. Department of Energy describes building energy modeling as supporting new-building and retrofit design, code compliance, tax-credit and utility-incentive qualification, real-time control, and policy analysis [25]. None of those official DOE claims establishes that EPANET, OpenDSS, or pandapower performs whole-building energy modeling. In particular, no reviewed source verifies native modeling of envelope heat transfer, zones, HVAC psychrometrics, occupancy schedules, daylight, indoor air quality, or building-code compliance in the three candidates.

### Discipline-specific gaps

| Gap | EPANET | OpenDSS | pandapower |
|---|---|---|---|
| BIM/IFC import and object identity | Not verified; UNKNOWN | Not verified; UNKNOWN | Not verified; UNKNOWN |
| Architectural geometry and spaces | Not a stated capability | Not a stated capability | Not a stated capability |
| Building water fixtures, sanitary drainage, venting, and code checks | Pressurized network model only; not verified for full building plumbing | Not applicable | Core project is electrical; pipe-network support belongs to sibling pandapipes |
| Building electrical layout, panels, branch circuits, cable routing | Not applicable | Utility-distribution focus; not a stated building-layout workflow | Network abstraction; not a stated building-layout workflow |
| HVAC, envelope, occupancy, whole-building energy | Not stated | Not stated | Not stated |
| Permitting, stamped design, or code compliance | No | No | No |
| Multidisciplinary coordination and clash detection | No | No | No |

### Practical integration boundary

A production building-design stack should treat IFC/BIM and engineering schedules as the source of semantic objects, then generate solver-specific network models. The generated model must retain traceability back to the source object, unit conversions, topology assumptions, equipment ratings, phase/pressure boundaries, and design options. After solving, results should be mapped back to the source model for review. This is an integration recommendation, not a claim that any candidate natively provides it.

## C1–C80 relevance

The request names “C1–C80” but does not supply the definitions of those criteria. Therefore, **an exact per-criterion C1–C80 mapping is UNKNOWN** and should not be invented. The evidence collected is directly relevant to the apparent categories implied by this research request: license and openness, operating systems, implementation language, API, CLI, headless execution, input/output, development activity, determinism, testing, validation, limitations, professional boundary, and building-design interoperability.

At the solver-family level, the relevance is as follows:

| Capability area likely represented in C1–C80 | EPANET | OpenDSS | pandapower |
|---|---|---|---|
| Hydraulics | **High**, for pressurized water distribution | **None** as a water solver | **Low in core**; use sibling pandapipes for pipe networks |
| Electrical networks | **None** | **High**, especially detailed multiphase utility distribution | **High**, especially Python automation and power-system studies |
| Water quality | **High** | **None** | **None in core** |
| Utility DER/harmonics/faults | **None** | **High** | **Medium to high**, depending on model/backend |
| Python-native automation | **Indirect** through C API/wrappers | **Available**, with official and third-party bindings; wrapper identity must be recorded | **High**, native Python |
| Scriptable/headless batch | **High via toolkit; exact CLI contract partly UNKNOWN** | **High, directly documented** | **High via Python; dedicated CLI UNKNOWN** |
| Regression and validation | **Good**, with text inputs, source, tests, and benchmarks | **Good**, with scripts and IEEE feeders; exact core test policy not fully verified | **Very good**, with pytest and commercial-tool comparisons |
| BIM/building-design completeness | **Low** | **Low** | **Low** |
| Professional design sign-off | **No** | **No** | **No** |
| Formal bitwise determinism guarantee | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** |

To complete a true C1–C80 scorecard, the criterion definitions, scoring scale, and evidence threshold must be supplied. Until then, this report should be treated as a source-backed family assessment rather than a completed numeric C1–C80 evaluation.

## Implementation and governance guidance

A solver adapter should persist the following fields for every run: candidate name; exact engine/library version; repository commit or binary checksum where available; operating system and architecture; selected backend; model-input hash; unit system; solver options and tolerances; controls and time-series ordering; random seed where applicable; convergence status; warnings; output-file hashes; and validation-case identifiers. A failed convergence should be a typed result, not silently converted into an engineering value.

The adapter should distinguish **engine result**, **validation status**, and **professional interpretation**. Engine output is not automatically a design decision. For water networks, include calibration and demand/roughness provenance. For electrical networks, include phase connectivity, grounding, transformer/regulator data, load model, fault assumptions, and DER controls. For building integration, preserve links between IFC/BIM objects and generated network elements and make all lossy transformations explicit.

## Verified unknowns and caveats

1. **C1–C80 definitions and scoring rules:** UNKNOWN because they were not provided.
2. **EPANET exact single-license classification:** the official EPA web page says public domain, while the official repository and license file document mixed public-domain and MIT-licensed material. Treat the distribution as mixed and inspect the exact files shipped in any redistribution.
3. **EPANET exact current CLI syntax and exit-code contract:** the official manual documents command-line use, but the precise current contract was not extracted and independently tested here.
4. **OpenDSS core EPRI license text:** UNKNOWN from the official repository metadata and accessible files reviewed. Do not apply OpenDSSDirect.py’s BSD-style license to the core EPRI engine.
5. **OpenDSS formal determinism guarantee:** UNKNOWN.
6. **pandapower dedicated first-party CLI:** UNKNOWN; Python headless execution is verified as the natural interface, but a supported standalone CLI command was not identified.
7. **Bitwise determinism for any candidate across platforms:** UNKNOWN.
8. **Native IFC/BIM integration for any candidate:** UNKNOWN/not verified.
9. **Building-code compliance, stamped design, permitting, clash detection, and whole-building energy modeling:** not provided by the reviewed candidate documentation; treat as outside solver scope.

## References

[1]: https://www.epa.gov/water-research/epanet "U.S. EPA EPANET official page"

[2]: https://github.com/USEPA/epanet-engine "USEPA epanet-engine official repository"

[3]: https://raw.githubusercontent.com/USEPA/epanet-engine/main/LICENSE.txt "EPANET engine license file"

[4]: https://api.github.com/repos/USEPA/epanet-engine "EPANET engine GitHub repository metadata"

[5]: https://usepa.github.io/EPANET2.2/ "EPANET 2.2 official user manual"

[6]: https://www.exeter.ac.uk/research/centres/cws/resources/benchmarks/ "University of Exeter Centre for Water Systems benchmarks"

[7]: https://opendss.epri.com/ "EPRI OpenDSS official documentation"

[8]: https://github.com/epri-dev/OpenDSS-C "EPRI OpenDSS-C official repository"

[9]: https://api.github.com/repos/epri-dev/OpenDSS-C "EPRI OpenDSS-C GitHub repository metadata"

[10]: https://github.com/dss-extensions/OpenDSSDirect.py "OpenDSSDirect.py official repository and wrapper license context"

[11]: https://opendss.epri.com/TechNoteCommandLine.html "EPRI OpenDSS command-line technical note"

[12]: https://opendss.epri.com/OpenDSSSolutionTechniques.html "EPRI OpenDSS solution techniques"

[13]: https://opendss.epri.com/OpenDSSandStateEstimation.html "EPRI OpenDSS and state estimation"

[14]: https://cmte.ieee.org/pes-testfeeders/resources/ "IEEE PES distribution test feeder resources"

[15]: https://pandapower.readthedocs.io/en/latest/ "pandapower official documentation"

[16]: https://github.com/e2nIEE/pandapower "pandapower official repository"

[17]: https://api.github.com/repos/e2nIEE/pandapower "pandapower GitHub repository metadata"

[18]: https://raw.githubusercontent.com/e2nIEE/pandapower/develop/LICENSE "pandapower BSD 3-Clause license file"

[19]: https://pandapower.readthedocs.io/en/latest/timeseries.html "pandapower time-series documentation"

[20]: https://pandapower.readthedocs.io/en/latest/converter.html "pandapower converter documentation"

[21]: https://arxiv.org/abs/1709.06743 "pandapower primary reference paper"

[22]: https://www.pandapower.org/about/ "pandapower official about, tests and validation page"

[23]: https://github.com/e2nIEE/pandapower/tree/develop/pandapower/test "pandapower official test tree"

[24]: https://technical.buildingsmart.org/standards/ifc/ "buildingSMART IFC introduction"

[25]: https://www.energy.gov/eere/buildings/building-energy-modeling "U.S. Department of Energy building energy modeling overview"

**Access date for all references:** 2026-09-24.
