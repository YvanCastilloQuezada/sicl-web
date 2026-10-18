# ARKI-SOLVER-MAP-001 — Energy, thermal and building physics

**Research scope.** This report covers one solver family: **EnergyPlus with OpenStudio as its modeling, workflow, and automation layer**. It includes the weather and input-file requirements that determine whether the family can be used reproducibly. Aurora and Aurora artifacts are intentionally out of scope. Sources were accessed **2026-09-24**. No software was installed or executed for this research.

## Executive conclusion

EnergyPlus is an open-source, whole-building energy and thermal-load simulation engine. It is primarily a **console/CLI solver** that consumes textual building descriptions and weather data and emits text, tabular, and optional SQLite outputs. OpenStudio is an open-source SDK and CLI that supplies a higher-level model, measure, and workflow layer, translates OpenStudio Models to EnergyPlus input, runs EnergyPlus, and post-processes results. Together they are a strong candidate for batch, headless, inspectable building-energy studies and for programmatic design alternatives.

The family is not a general-purpose CFD solver, a complete structural/indoor-air-quality platform, or a substitute for professional engineering judgment. Its results depend on the quality and applicability of the building model, schedules, controls, constructions, equipment data, design days, and weather file. The official sources reviewed describe extensive automated testing and historical ASHRAE 140/BESTEST validation, but they do **not** establish a universal accuracy guarantee for every building, climate, HVAC configuration, or current release. Bit-for-bit determinism is **UNKNOWN** from the reviewed official sources; OpenStudio’s regression resources explicitly compare repeated runs and tolerate percentage differences, which supports testability but is not a determinism guarantee.

## Candidates in this family

| Candidate | Role | License/open-source status | OS and implementation | Programmatic access | CLI/headless execution | Primary input/output |
|---|---|---|---|---|---|---|
| **EnergyPlus** | Core whole-building energy and thermal-load simulation engine | Open source; BSD-3-like license with attribution, disclaimer, and EnergyPlus naming provisions | Official quick start lists compiled Windows, macOS, and Linux releases. Core implementation language is **UNKNOWN** from the reviewed sources; the project exposes C and Python API layers. | Python bindings around a C API. Runtime callbacks and data exchange permit sensor/actuator interaction during a run. | Yes. `energyplus` is a console program with input, weather, output-directory, prefix/suffix, design-day, annual, preprocessing, and postprocessing options. This supports headless batch use. | IDF or epJSON building input, optionally IMF through EPMacro, and EPW weather; outputs include ESO, optional SQLite, RDD, MDD, EIO, ERR, MTR, and MTD files. |
| **OpenStudio SDK/CLI** | Higher-level model, measure, workflow, translation, and reporting layer that uses EnergyPlus; it is not a replacement physics engine | Open source; SDK repository contains a BSD-style license with additional OpenStudio designation provisions. The OpenStudio Coalition separately states that the Application and SketchUp Plug-in are under Revised BSD/BSD3. | Cross-platform Windows, macOS, and Linux. The reviewed official project sources state access through C++, Ruby, Python, and C#; exact implementation-language split is **UNKNOWN**. | SDK/API access through C++, Ruby, Python, and C#; OpenStudio Measures use Ruby and have phase-1 Python support in v3.5.0 according to the official project page. | Yes. The self-contained CLI applies measures, translates OSM to IDF, runs EnergyPlus, and applies reporting measures from an OSW workflow. | OSM seed model plus OSW workflow; weather file and design days; generated EnergyPlus IDF and downstream EnergyPlus/OpenStudio result files. |

## EnergyPlus: verified capabilities and boundaries

### What it is and what it computes

The official documentation defines EnergyPlus as an energy-analysis and thermal-load simulation program. From a building description, it calculates heating and cooling loads, conditions needed to maintain thermal control setpoints, secondary HVAC and coil loads, primary plant energy consumption, and related simulation details. It is explicitly described as a command-line tool that takes input files and produces output files [1].

EnergyPlus is therefore appropriate when the target is **whole-building energy and thermal behavior over time**, including envelope, internal loads, schedules, HVAC, plant, controls, and related water-use/energy reporting. It should not be described as a universal physical truth model. The documentation itself frames the model as a simulation that must be checked against whether it performs like the actual building; the reviewed sources do not provide a blanket accuracy guarantee.

### License, openness, and commercial status

EnergyPlus is open source under a BSD-3-like license. The official license permits redistribution and modification subject to source/binary notices, non-endorsement terms, an EnergyPlus name provision, and an “AS IS” warranty disclaimer [3]. The official documentation describes the project as open source and says there are no “give back” provisions [1].

No proprietary runtime license was found in the reviewed official sources. This report therefore classifies EnergyPlus as **open source**, not as a commercial-only solver. Commercial engineering support, consulting, or products built around it may exist, but a specific commercial support contract or vendor service was not researched and is **UNKNOWN**.

### Operating systems and execution model

The official quick start says compiled EnergyPlus releases are provided for Windows, Mac, and Linux [1]. The command-line guide documents the executable syntax and options [2]. The solver can run without a graphical interface, so a CI worker, job queue, container, or other batch process can invoke it as a process. This is a practical headless capability, not a claim that every wrapper or GUI is headless.

Important CLI controls include `--weather`, `--idd`, `--output-directory`, `--output-prefix`, `--output-suffix`, `--annual`, `--design-day`, `--epmacro`, `--expandobjects`, `--readvars`, and `--jobs` [2]. The official guide notes that, as of version 9.6, `--jobs` is configured to increase thread usage only for a specified GroundHeatExchanger:System calculation method; it should not be interpreted as a general parallel-simulation switch [2].

### APIs and automation

The official EnergyPlus Python API documentation describes Python bindings around a C API. It exposes a functional API, a runtime API for callbacks at defined points in a simulation, and a data-exchange API for getting sensor values and setting actuator values from runtime callbacks [4]. This makes EnergyPlus suitable for test harnesses, supervisory-control experiments, parameter sweeps, and controlled co-simulation-style integrations where the supported callback/data-exchange semantics are sufficient.

The API documentation also says the API evolves, usually by adding functionality, while a whole-number API-version change indicates a breaking change [4]. A production integration should therefore pin a release and test the exact API/runtime combination rather than assume indefinite compatibility.

### Inputs and weather requirements

A normal simulation needs a building model and, when weather-driven simulation is required, a weather file. The quick start identifies the **IDF (Input Data File)** as the principal textual building model and the **EPW (EnergyPlus Weather)** file as the common weather input [1]. The Essentials guide also documents IDF or epJSON use and shows the weather path as a CLI argument, defaulting to `in.epw` in the current directory in its example [5].

The EPW is not merely a location label. It supplies the time-varying weather data used by the simulation. The model must also contain or reference the necessary geometry, constructions, loads, schedules, HVAC/plant objects, controls, output requests, and any required supporting data. Design-day-only runs are possible through the CLI, but a design-day run is not equivalent to an annual weather-year simulation [2].

Weather and input provenance are consequently part of the experiment definition. A reproducible run should record at least the EnergyPlus release, input file hash, EPW file hash and source, design-day file or objects, IDD/schema version, CLI flags, output requests, and any preprocessing or measures. The reviewed official documentation does not specify a universal rule for selecting a weather file for every professional use case; that selection remains a domain decision.

### Outputs and testability

EnergyPlus produces output files based on requested outputs and run settings. The quick start lists ESO standard output, optional SQLite, RDD and MDD dictionaries, EIO invariant output, ERR diagnostics, MTR meter output, and MTD meter details [1]. This is favorable for automated pipelines because both machine-readable and diagnostic artifacts can be retained.

The current official documentation states that every EnergyPlus commit and release is exercised by unit, integration, API, and regression tests [6]. This is strong evidence of project-level testability. It does **not** mean a user’s model is validated automatically, nor does it establish that all physical configurations have equal coverage.

### Determinism

**Bit-for-bit or cross-platform deterministic output: UNKNOWN.** The official sources reviewed do not promise deterministic output across operating systems, compilers, versions, thread settings, or floating-point environments. A pinned version, fixed inputs, fixed flags, isolated output directory, and controlled environment are prudent for reproducible experiments, but those controls are engineering recommendations rather than a documented EnergyPlus guarantee.

The documented availability of a `--jobs` option and the existence of multiple output/reporting paths are additional reasons to test the exact execution configuration [2]. If numerical reproducibility matters, compare selected outputs under a project-defined tolerance and preserve diagnostic files instead of assuming byte equality.

### Validation and professional boundary

A primary validation source hosted by Lawrence Berkeley National Laboratory reports EnergyPlus results for ANSI/ASHRAE Standard 140-2001 and IEA SHC HVAC BESTEST suites, including comparisons with other simulation programs [7]. This is valuable evidence that the solver has been subjected to recognized analytical/comparative test suites. The page is historical and identifies EnergyPlus version 1.2.0 build 29; it must not be presented as a current-release validation certificate.

EnergyPlus documentation also includes an engineering reference and a compliance guide among its supporting materials [5]. Those resources support model review and application-specific use, but the reviewed sources do not authorize a general claim that an EnergyPlus result alone constitutes a stamped design, code approval, safety determination, guaranteed savings value, or commissioning conclusion.

The professional boundary is therefore: **use EnergyPlus for transparent, reviewable building-energy and thermal simulation, scenario comparison, and analysis workflows; require qualified building-physics/MEP professionals to select assumptions, judge applicability, review inputs, interpret uncertainty, and make consequential design or compliance decisions.**

## OpenStudio: verified capabilities and boundaries

### Role in the family

OpenStudio is described by the official project site as a cross-platform collection of tools for whole-building energy modeling with EnergyPlus and advanced daylight analysis with Radiance [8]. The site distinguishes the SDK/CLI from graphical applications. The SDK supplies a version-controlled interface and language bindings, while the CLI runs OpenStudio workflows on Linux, Windows, and macOS [8]. OpenStudio therefore acts as a higher-level orchestration and authoring layer around EnergyPlus rather than an independent competing thermal engine.

The official CLI guide describes the run sequence: load an OpenStudio Model, apply OpenStudio Measures, translate to EnergyPlus IDF, apply EnergyPlus Measures, run EnergyPlus, and apply reporting Measures [9]. An error at any point halts the workflow and an output OSW is written. This explicit sequence is useful for audit trails and test harnesses.

### License, APIs, and platform support

The OpenStudio SDK repository license permits source and binary redistribution and modification under BSD-style terms, while adding rules about retaining the OpenStudio designation and avoiding confusing naming for modified versions [11]. The OpenStudio Coalition states that the OpenStudio Application and SketchUp Plug-in are licensed under Revised BSD/BSD3 and are free for use and development [10]. The repository README identifies OpenStudio as open source and cross-platform and names C++, Ruby, Python, and C# access points [12].

The official introductory documentation states that the 64-bit OpenStudio Application is supported on Windows, OS X, and Ubuntu, including 64-bit ARM versions of OS X, and that the package includes EnergyPlus, Ruby and C# APIs, the CLI, and Radiance [13]. The exact support matrix is release-specific; a deployment should use the matrix for the pinned release rather than generalize from this page.

### CLI and headless workflows

The OpenStudio CLI is a self-contained executable containing what is needed to apply measures to an OpenStudio Model and run an EnergyPlus simulation [9]. The `run --workflow path/to/workflow.osw` command executes the OSW workflow. The CLI also supports `--debug`, `--measures_only`, and `--postprocess_only`, which are useful for diagnosing or separating transformation, simulation, and reporting stages [9]. This is a documented headless execution route.

The OSW is JSON and can specify a seed OSM, a weather file, and ordered measure steps [9]. The OpenStudio API exposes `WorkflowJSON` for reading, modifying, and writing OSW files [9]. Measures are a programmable transformation layer; the official project page describes Ruby measures and phase-1 Python support in v3.5.0 [8]. Because measures can modify geometry, schedules, constructions, HVAC, controls, and reporting, the measure source and version are part of the effective model and must be versioned.

### Weather and model inputs

OpenStudio’s workflow example includes a `weather_file` entry in the OSW and uses an OSM seed file [9]. The OpenStudio Coalition’s simulation guide directs users to add weather files and design days under the Site tab and explains that EnergyPlus weather files can be downloaded from the EnergyPlus site [14]. OpenStudio thus inherits the core EnergyPlus weather and input dependency; adding a weather file in the UI does not remove the need to assess whether that file is representative and correctly formatted.

OpenStudio supports higher-level building abstractions and geometry import paths, including gbXML and IFC according to the official project site [8]. Imported geometry and library data still require review. Translation success is not proof that geometry, space boundaries, constructions, schedules, plant topology, controls, or intended system operation are physically correct.

### Testability and validation

The official OpenStudio-resources repository contains simulation tests for OpenStudio model objects. It recommends Ruby tests for the Ruby API and OSM tests to verify that models can be loaded in future versions; both should produce simulation-ready models that can be simulated with EnergyPlus [15]. The repository documents CLI execution, parallel test jobs, test filtering, saved OSW/IDF artifacts, and regression comparison of total site energy against a prior official run with a stated 0.5% threshold in the described test suite [15].

This is strong evidence of practical regression-test infrastructure. It also shows that OpenStudio testing is not limited to unit tests: model loading, translation, simulation, reporting, and result comparison are exercised. The source documents cleanup of timestamps and rounding of values in committed outputs, which improves diffability but means committed regression artifacts should not be treated as raw, byte-for-byte simulation traces [15].

### Determinism

**Bit-for-bit determinism: UNKNOWN.** The reviewed OpenStudio sources do not promise byte-identical results across platforms or releases. The resources repository explicitly supports repeated runs, custom tags, comparison of total site energy, and tolerance-based regression checks [15]. Those practices demonstrate testability and stability monitoring; they do not establish deterministic physics output under every environment or measure order.

OpenStudio workflows can vary with SDK version, bundled EnergyPlus version, measure code, Ruby/Python runtime behavior, imported libraries, weather files, and parallel test settings. A reproducibility harness should pin all of these and retain the generated IDF, OSW, measure source, EnergyPlus logs, and SQL/CSV outputs.

### Professional boundary and limitations

OpenStudio simplifies model creation and automation, but it does not remove the need for building-physics expertise. The user must still verify that the abstract model represents the real building and that the selected EnergyPlus objects and controls are applicable. Imported geometry, default libraries, measure arguments, weather data, and reporting measures can all introduce errors without necessarily preventing the CLI from completing.

OpenStudio is not a guarantee that every EnergyPlus feature is exposed at the same abstraction level, and the reviewed official sources do not provide a complete feature-parity matrix for all releases. The exact limitations of a given measure, translator path, language binding, or bundled EnergyPlus version are **release- and workflow-specific** and should be verified before committing to production use.

## Suitability against the ARKI solver-map dimensions

The family is a strong fit for a solver map entry that values source availability, CLI operation, headless execution, API access, explicit input/output files, and testable batch workflows. EnergyPlus provides the physical simulation engine; OpenStudio supplies a structured model and workflow layer that can reduce direct IDF authoring and make transformations reusable.

| Dimension | Assessment | Evidence or caveat |
|---|---|---|
| Open source | **Yes** for EnergyPlus and OpenStudio, subject to their respective BSD-style license notices and naming provisions. | Official licenses and project pages [3] [10] [11] [12]. |
| Commercial-only dependency | **No identified dependency.** Specific paid support offerings are UNKNOWN. | No commercial runtime requirement was found in reviewed official sources. |
| API access | **Yes.** EnergyPlus exposes C/Python runtime and data-exchange APIs; OpenStudio exposes C++, Ruby, Python, and C# access points. | Binding/version compatibility must be pinned [4] [8] [12]. |
| CLI | **Yes** for both. | EnergyPlus CLI [2]; OpenStudio CLI [9]. |
| Headless | **Yes**, through direct executables and OSW workflows. | GUI is optional for the documented command-line paths [1] [9]. |
| Determinism | **UNKNOWN** as a guarantee. | Use pinned versions and tolerance-based regression tests [15]. |
| Testability | **High**, at project and workflow levels. | EnergyPlus unit/integration/API/regression tests [6]; OpenStudio simulation/regression tests [15]. |
| Validation | **Established but bounded.** Historical ASHRAE 140/BESTEST evidence exists; current universal accuracy is not established by reviewed sources. | LBNL validation page identifies EnergyPlus 1.2.0 build 29 [7]. |
| Weather/input burden | **Material.** EPW/weather provenance and IDF/epJSON/OSM/OSW contents affect results. | Official quick start and workflow docs [1] [5] [9] [14]. |
| Professional use | **Appropriate as an analysis engine and workflow component; not a substitute for qualified review.** | Engineering judgment is required for assumptions, calibration, compliance, and consequential decisions. |

### C1–C80 relevance

The task does not provide the definitions of the **C1–C80** criteria. Exact criterion-by-criterion scoring or ID assignment is therefore **UNKNOWN** and should not be inferred. On the evidence available, the family is plainly relevant to criteria concerning whole-building energy/thermal simulation, weather-driven input, building-model translation, CLI/headless operation, open-source licensing, APIs, regression testing, validation evidence, machine-readable outputs, and professional-use boundaries. It may be relevant to other C1–C80 criteria, but those mappings require the governing ARKI rubric.

## Recommendation

**Include EnergyPlus + OpenStudio as one solver-family candidate for ARKI-SOLVER-MAP-001.** Use EnergyPlus when direct, transparent, version-pinned simulation is wanted. Use OpenStudio when a higher-level OSM/OSW model, reusable Measures, translation, reporting, or multi-variant workflow is valuable. For any production or decision-support use, pin the exact versions, preserve all model/weather/measure inputs, run the project’s own regression cases, inspect warnings and errors, and require qualified domain review for the assumptions and conclusions.

## Unknowns retained rather than inferred

1. The exact EnergyPlus core implementation-language breakdown was not established by the reviewed sources.
2. Neither project’s official reviewed sources guarantee bit-for-bit deterministic outputs across operating systems, compilers, releases, thread settings, or floating-point environments.
3. A complete current-release validation certificate or universal accuracy claim was not established. The primary LBNL page reviewed is historical and names EnergyPlus 1.2.0 build 29.
4. Exact C1–C80 criterion definitions and therefore exact criterion IDs/scores were not supplied.
5. Current commercial support/service terms and pricing were not researched; only open-source runtime/licensing status was assessed.
6. Complete release-specific feature parity across EnergyPlus, OpenStudio SDK, CLI, language bindings, Measures, and imported geometry formats was not established.

## References

[1]: https://energyplus.readthedocs.io/en/v24.2.0/quick_start/quick_start.html "EnergyPlus Quick Start Guide, version 24.2 documentation (accessed 2026-09-24)"
[2]: https://github.com/NREL/EnergyPlus/blob/develop/doc/running-energyplus-from-command-line.md "EnergyPlus command-line execution guide (accessed 2026-09-24)"
[3]: https://github.com/NREL/EnergyPlus/blob/develop/LICENSE.txt "EnergyPlus LICENSE.txt (accessed 2026-09-24)"
[4]: https://energyplus.readthedocs.io/en/latest/api.html "EnergyPlus Python API documentation (accessed 2026-09-24)"
[5]: https://energyplus.readthedocs.io/en/latest/essentials/essentials.html "EnergyPlus Essentials documentation (accessed 2026-09-24)"
[6]: https://energyplus.readthedocs.io/ "EnergyPlus Documentation overview: quality, licensing, and contributions (accessed 2026-09-24)"
[7]: https://simulationresearch.lbl.gov/dirpubs/valid_ep.html "Lawrence Berkeley National Laboratory EnergyPlus validation reports (accessed 2026-09-24)"
[8]: https://openstudio.net/ "OpenStudio official project website (accessed 2026-09-24)"
[9]: https://natlabrockies.github.io/OpenStudio-user-documentation/reference/command_line_interface/ "OpenStudio Command Line Interface documentation (accessed 2026-09-24)"
[10]: https://openstudiocoalition.org/about/software_license/ "OpenStudio Coalition software license description and terms (accessed 2026-09-24)"
[11]: https://github.com/NatLabRockies/OpenStudio/blob/develop/LICENSE.md "OpenStudio SDK LICENSE.md (accessed 2026-09-24)"
[12]: https://github.com/NatLabRockies/OpenStudio/blob/develop/README.md "OpenStudio SDK repository README (accessed 2026-09-24)"
[13]: https://openstudiocoalition.org/getting_started/getting_started/ "OpenStudio installation and introductory tutorial (accessed 2026-09-24)"
[14]: https://openstudiocoalition.org/getting_started/running_your_simulation/ "OpenStudio Coalition: Running Simulations and Viewing Results (accessed 2026-09-24)"
[15]: https://github.com/NREL/OpenStudio-resources/blob/develop/README.md "OpenStudio resources simulation and regression test suite README (accessed 2026-09-24)"

---

**Report identity:** `ARKI-SOLVER-MAP-001 / energy`

**Research date:** 2026-09-24

**Installation status:** No software installed.

**Artifact path:** `/home/ubuntu/generador-familias/SOLVER_MAP_RESEARCH/energy.md`

---

**Note on source currency.** The official OpenStudio site reports OpenStudio SDK 3.11.0 released 2026-01-15 and 3.10.0 released 2025-06-18 [8]. The EnergyPlus documentation landing page describes twice-yearly releases and recommends formal releases for production workflows [6]. Exact versions used in any downstream implementation should be selected and pinned separately.

[8]: https://openstudio.net/ "OpenStudio official project website (accessed 2026-09-24)"
[6]: https://energyplus.readthedocs.io/ "EnergyPlus Documentation overview: quality, licensing, and contributions (accessed 2026-09-24)"

---

**End of report.**
