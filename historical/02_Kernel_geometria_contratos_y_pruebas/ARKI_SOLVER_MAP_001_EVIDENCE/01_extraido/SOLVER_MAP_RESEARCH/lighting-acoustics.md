# ARKI-SOLVER-MAP-001 — Daylight, Solar and Acoustics

**Research status:** completed for one solver family: **open, scriptable building-performance and room-acoustics solvers**. The scope covers Radiance, its EnergyPlus/OpenStudio links, and open room-acoustics tools. Aurora was not researched and no Aurora artifact was used.

**Access date for all sources:** 2026-09-24.

## Executive conclusion

The strongest foundation for ARKI’s **C04 Daylight + Acústica** is a governed adapter family rather than a single multiphysics engine. **Radiance** is the leading candidate for daylight and solar-optical simulation: it is an open source, command-line-oriented, validated lighting tool with current LBNL-maintained source mirroring, cross-platform installers, and automated unit tests. Its professional boundary is important: it is an optical/radiometric renderer and lighting-simulation suite, not a whole-building thermal model or a room-acoustics solver. [1] [2] [3]

**EnergyPlus** is the appropriate linked engine for whole-building thermal and energy consequences of solar gains, lighting, HVAC, and weather. Its official repository documents a BSD-3-like license, formal releases, unit/integration/API/regression testing, and a command-line interface. It exposes a C library through Python bindings, but it does not replace Radiance for detailed daylight distribution or an acoustics engine for room impulse responses. [4] [5] [6]

**OpenStudio** is the most practical integration layer in this scope. It links EnergyPlus workflows with advanced daylight analysis using Radiance, provides C++, Ruby, Python, and C# access, and offers a self-contained CLI for reproducible workflow execution. It is open source under BSD-3 terms for the application and SketchUp plug-in; the exact licensing of every bundled dependency and measure must still be audited before redistribution. [7] [8] [9]

For acoustics, **I-Simpa** is the more architecturally relevant open tool for room/building/environmental acoustics because it supports 3D geometry, particle tracing, reverberation theory, Python scripting, and ISO 3382-1-derived parameters including **C50 and C80**. It is GPLv3 and is explicitly a pre/post-processor that needs numerical codes; it should therefore be integrated as a governed specialist tool rather than treated as a self-contained general solver. **Pyroomacoustics** is a strong research and automated-test component for room impulse responses and audio-array algorithms, with a Python API and MIT license, but its official description positions it around rapid algorithm development rather than professional architectural acoustics certification. [10] [11] [12] [13]

**Recommendation:** implement a solver-neutral interface with separate adapters for (1) Radiance/OpenStudio daylight, (2) EnergyPlus thermal/solar-energy runs, and (3) I-Simpa or pyroomacoustics acoustics. Gate professional claims on validated input conventions, version pinning, numerical settings, geometry/material provenance, and comparison against measured or trusted reference cases. Do not label the resulting ARKI capability as a professional compliance result until those gates pass.

## Scope and C1–C80 relevance

This report maps directly to the repository’s registered capability matrix. The primary capability is **C04 Daylight + Acústica**. The supporting solver capabilities are **C19 EnergyPlus**, **C20 Radiance**, and **C61 Acústica Ray-Tracing**. The repository currently marks these capabilities as blocked until dependencies or external tools are available; this report documents candidate dependencies and does not claim that any solver has been installed or executed. [14]

| Capability | Solver-family relevance | Evidence boundary |
|---|---|---|
| C04 Daylight + Acústica | Radiance/OpenStudio for daylight; I-Simpa/pyroomacoustics for room acoustics | Integration candidates only; no ARKI solver execution demonstrated |
| C19 EnergyPlus | Whole-building thermal and energy consequences of weather and solar gains | EnergyPlus is the external engine; Radiance is not a substitute |
| C20 Radiance | Daylight, luminance/illuminance, solar-optical analysis | Validated lighting simulation; not thermal or acoustic analysis |
| C61 Acústica Ray-Tracing | Room/building acoustic propagation and ISO 3382-style metrics | I-Simpa includes particle tracing; pyroomacoustics includes image-source/ray-tracing components |

The report does not claim coverage for structural, CFD, fire, certification, or full life-cycle capabilities. Those are outside this solver family.

## Candidate comparison

| Candidate | License and openness | OS / language | Python API | CLI / headless execution | Determinism | Inputs and outputs | Testability and validation | Professional boundary |
|---|---|---|---|---|---|---|---|---|
| **Radiance v6.0 family** | Open source under the Radiance Software License v2.0, a permissive BSD-like license with attribution, non-endorsement, and disclaimer terms. | Official source mirror reports Windows, macOS x86-64/arm64, and Linux builds; primarily C with command-line tools. | Official `pyradiance` supplies a Python interface to common Radiance CLI tools and bundles binaries/libraries, but its repository describes Radiance v5.4 rather than v6.0; version alignment must be governed. | **Yes.** The official README documents `rad` and many command-line programs. Suitable for batch/headless use when invoked with fixed files and environment. | **UNKNOWN.** The official sources reviewed do not establish a general bit-for-bit determinism guarantee across versions, platforms, or rendering settings. | Radiance scene/material/sky files and command-line parameters; rendered images, irradiance/illuminance and matrix-method results depend on the selected toolchain and parameters. Exact ARKI schema is **UNKNOWN**. | LBNL describes it as validated; the current mirror says unit tests run on every build across Windows, macOS, and Linux. Primary validation includes measured-data validation of annual daylight and complex fenestration methods. | Strong candidate for daylight/solar-optical analysis. Not a thermal-balance engine, whole-building energy model, or room-acoustics solver. Professional use requires project-specific calibration, geometry/material QA, and documented settings. |
| **EnergyPlus + OpenStudio link** | EnergyPlus is open source under a BSD-3-like license with a special name-use clause. OpenStudio Application and SketchUp plug-in are BSD3; OpenStudio is described as open source. | EnergyPlus and OpenStudio are cross-platform; OpenStudio supports Windows, macOS, and Linux. EnergyPlus is primarily C++ with C/Python APIs; OpenStudio exposes C++, Ruby, Python, and C#. | EnergyPlus officially documents Python bindings around its C API: functional, runtime callback, and data-exchange APIs. OpenStudio officially exposes Python bindings. | **Yes.** EnergyPlus has an official CLI; OpenStudio CLI is self-contained and runs OSW workflows that translate models, apply measures, execute EnergyPlus, and write outputs. | **UNKNOWN** as a formal guarantee. EnergyPlus supports a `--jobs` option, but official documentation says its current configured use is limited to GroundHeatExchanger UBHWTcalc threading; floating-point and version effects still require project testing. | EnergyPlus IDF/epJSON plus EPW weather; outputs include simulation reports and time series. OpenStudio OSM/OSW/Measures and generated EnergyPlus outputs. | EnergyPlus documents unit, integration, API, and regression tests for every commit/release; official validation materials include ASHRAE 140 and IEA BESTEST reports. OpenStudio CLI includes measure tests and workflow outputs, but full end-to-end validation of a particular ARKI measure stack remains **UNKNOWN**. | Best for whole-building thermal/energy modeling and solar-gain consequences. It is not a detailed daylight renderer and is not a room-acoustics engine. OpenStudio is an integration/orchestration layer, not independent evidence that every linked model is professionally valid. |
| **I-Simpa** | Open source under GNU GPLv3 according to the official repository. | Official repository documents Linux and Windows build status; the project site also documents macOS distribution. C++/GUI application with Python scripting and pluggable numerical codes. | **Yes, in the form of Python scripting/extensions** inside I-Simpa. A stable external Python package API is **UNKNOWN**. | GUI-centered. Python scripting is documented, but an official standalone headless CLI contract was not verified; mark headless as **UNKNOWN / not established**. | **UNKNOWN.** Particle tracing and configurable numerical codes can be sensitive to settings and random sampling; no general deterministic guarantee was found in the reviewed official sources. | 3D geometry/material/source/receiver data; built-in TCR reverberation code and SPPS sound-particle tracing; sound maps and ISO 3382-style room-acoustic parameters. | Official documentation exposes formulas and parameter definitions. A project-specific empirical validation source must be supplied before professional claims; the reviewed official pages do not establish a complete, current validation benchmark. | Best open architectural-acoustics candidate in this set for room/building/environmental studies and C61 metrics. GPLv3 obligations and the fact that I-Simpa is a pre/post-processor with numerical codes must be handled in distribution and professional workflows. |
| **Pyroomacoustics** | Open source under the MIT license. | Python package with C/C++ accelerators; official README discusses Linux, macOS, and Windows support conditions. | **Yes.** Native object-oriented Python interface for 2D/3D rooms, RIR generation, propagation, beamforming, DOA, filtering, and related algorithms. | No official standalone CLI was verified. It is scriptable and can run without a GUI, so application-level headless execution is feasible, but a supported CLI contract is **UNKNOWN**. | **UNKNOWN.** The official sources reviewed do not promise bit-for-bit determinism across implementations, compiler builds, or any stochastic ray-tracing settings. | Python room/source/microphone definitions; room impulse responses, simulated propagated signals, and array-processing outputs. | The official paper and repository frame the package around rapid development/testing of audio-array algorithms and provide examples/reference implementations. A complete architectural-acoustics validation benchmark against measured rooms is **UNKNOWN**. | Excellent research/prototyping and regression-test component. Do not use it alone as evidence for code compliance, detailed concert-hall design, or a professional acoustic report without independent validation and specialist review. |

## Detailed findings

### 1. Radiance: primary daylight and solar-optical candidate

Radiance is explicitly presented by its official project site as “A Validated Lighting Simulation Tool.” The current LBNL-ETA repository is an automatically updated mirror of the official Radiance CVS source tree. It states that unit tests run for every build on Windows, macOS x86-64 and arm64, and Linux, and that installers are built for those platforms. The older NREL repository is archived and points users to the LBNL-ETA mirror; it should not be treated as the current development source. [1] [2] [3]

The official Radiance license page identifies version 6.0 and grants redistribution and use in source and binary forms, with or without modification, subject to attribution, license preservation, and non-endorsement conditions. The license includes an “as is” disclaimer and does not impose a requirement to publish modifications. It is therefore open source and commercially usable in the ordinary permissive-license sense, but downstream products must preserve notices and avoid unauthorized endorsement. [2]

Radiance is CLI-native. Its official README describes the `rad` controller and individual programs, as well as invocation without X11 to generate an image. That makes batch/headless execution technically suitable for a server adapter. The reviewed official sources do not provide a blanket reproducibility guarantee. ARKI should therefore pin the Radiance version, scene files, auxiliary libraries, sky model, command-line parameters, locale, and platform image; it should store hashes of all inputs and outputs. [3]

Validation evidence is substantive but should be interpreted by method and domain. The LBNL/DOE primary record for the three-phase method concerns annual daylight performance of optically complex fenestration systems. It identifies measured-data validation as the basis for the method’s accuracy claim. This supports C20 daylight capability, but it is not a blanket validation of every material model, geometry condition, sky model, annual metric, or downstream compliance use. [15]

`pyradiance` is useful as an integration convenience because its official repository says it provides a Python interface to common Radiance CLI tools and includes Radiance binaries and libraries. However, the repository text identifies bundled Radiance v5.4, while the current official license page identifies Radiance v6.0. ARKI must not silently combine wrapper and engine versions; the exact wrapper release, engine release, and license notices must be recorded in each run manifest. [16] [2]

### 2. EnergyPlus and OpenStudio: linked whole-building and workflow layer

EnergyPlus is a whole-building energy simulation program for energy and water use. The official development repository states that every commit and release undergoes build, unit, integration, API, and regression testing, and recommends formal public releases for production workflows. It also documents twice-yearly releases and a BSD-3-like license. [4]

The EnergyPlus CLI accepts IDF or related input and explicit weather, output-directory, prefix, suffix, design-day, annual, preprocessing, and postprocessing options. This is directly suitable for automated, headless execution. Its Python API is not merely a file wrapper: the official API documentation describes functional calls, runtime callbacks, and data exchange for getting sensor values and setting actuators during simulation. Those capabilities support an adapter that runs controlled parametric studies, but they also increase the need for API-version pinning and lifecycle tests. [5] [6]

EnergyPlus validation evidence includes official/primary test material based on ANSI/ASHRAE Standard 140-2001 and IEA SHC HVAC BESTEST, as well as reports on analytical, comparative, and empirical tests. The current repository’s automated testing statement is stronger evidence for software regression control than for the accuracy of any particular building model. A professional result still depends on correct envelope, schedules, HVAC, weather, calibration, and reporting conventions. [17] [4]

OpenStudio connects this energy engine to a higher-level model and workflow layer. The official project site describes it as a cross-platform collection supporting EnergyPlus and advanced daylight analysis using Radiance. It provides SDK/API access in C++, Ruby, Python, and C#, and a CLI that can apply Measures, translate models to EnergyPlus, execute the simulation, and generate reports. The official CLI guide documents `openstudio run --workflow`, debugging, measure tests, OSW JSON workflows, and generated output OSWs. This is a strong basis for a headless orchestration adapter. [7] [9]

OpenStudio is not evidence that an ARKI workflow is automatically correct. Measures can transform models, and an OSW can halt on errors, but the semantic correctness of a particular model, weather file, schedule, Radiance setting, or reporting measure must be tested. OpenStudio Application and SketchUp plug-in licensing is documented as BSD3; before shipping a combined product, ARKI should audit the SDK, embedded binaries, Ruby gems, Python packages, Radiance distribution, EnergyPlus distribution, and each Measure’s license separately. [8]

### 3. I-Simpa: room-acoustics and ray/particle-tracing candidate

I-Simpa is an open-source 3D sound-propagation project from Université Gustave Eiffel. Its official repository makes a critical architectural distinction: I-Simpa alone is not a calculation software; it is a pre/post-processor for acoustic codes, and it is distributed with TCR, based on classical reverberation theory, and SPPS, based on sound-particle tracing. This distinction should be preserved in ARKI’s model: the adapter must identify the GUI/pre/post layer and the numerical code separately. [10]

The official project documentation covers room and building acoustics, environmental noise, industrial spaces, 3D geometry, material absorption/transmission/scattering, sound sources and receivers, sound maps, and Python scripting. It exposes ISO 3382-1-derived metrics such as reverberation time, EDT, sound strength G, clarity **C50/C80**, definition D50, centre time, lateral energy fractions, and late lateral sound level. This directly supports C61 and the acoustics portion of C04, including C80 relevance. [10] [11]

I-Simpa is GPLv3. That is open source, but it is materially different from a permissive license: distribution of covered derivative works must follow GPLv3 conditions. The official pages document GUI workflows and Python scripting, but an independent, stable, supported headless command-line interface was not verified. ARKI should not promise server-side headless execution until a documented batch mode is tested and version-pinned. [10] [18]

### 4. Pyroomacoustics: research and test component

Pyroomacoustics is an MIT-licensed Python package intended for rapid development and testing of audio-array processing algorithms. Its official repository documents an object-oriented Python interface for 2D/3D rooms, a fast C++ implementation of image-source modeling and ray tracing for polyhedral rooms, room impulse-response generation, signal propagation, and reference implementations for beamforming, direction finding, adaptive filtering, source separation, and denoising. [12]

The primary package paper describes the same three-part design and frames the package as reducing implementation overhead for evaluation of audio algorithms. This makes it a useful deterministic-input regression fixture and a research/prototyping engine. The reviewed primary sources do not establish a complete measured-room validation suite for professional building acoustics, nor do they provide a formal standalone CLI contract. Those facts remain **UNKNOWN**, not assumed. [13]

The practical boundary is therefore clear: use pyroomacoustics for algorithm development, synthetic RIR generation, sensitivity tests, and automated acoustic pipeline tests. Use a validated specialist workflow and human acoustic review for professional reports, certification, detailed concert-hall design, or claims that depend on measured-room agreement.

## Open source, commercial status, APIs, CLI, and deployment implications

All four named candidates are open-source projects or open-source distributions in the reviewed sources. No commercial-only solver was included in this scope. “Open source” does not mean “unrestricted redistribution”: Radiance and EnergyPlus have attribution/name-use conditions, OpenStudio has component/dependency considerations, I-Simpa is GPLv3, and pyroomacoustics is MIT. A commercial ARKI deployment can use open-source components subject to their licenses, but the final product’s notices, source-offer obligations where applicable, trademarks, and bundled dependencies require legal review.

For server execution, Radiance and EnergyPlus provide the clearest direct CLIs. OpenStudio provides a self-contained workflow CLI and is the preferred orchestrator for EnergyPlus/Radiance workflows. Pyroomacoustics is naturally scriptable through Python but has no verified official CLI. I-Simpa has Python scripting but no verified official standalone headless contract. These distinctions should be represented in the solver registry instead of collapsing all “scriptable” tools into a single `headless=true` field.

## Determinism and testability policy for ARKI

The official sources reviewed do not provide a general bit-for-bit determinism guarantee for any candidate. Therefore the solver registry should record determinism as **UNKNOWN until tested**. A suitable ARKI acceptance test should run the same fixture twice in the same pinned container or machine image, compare raw outputs and normalized metrics, then repeat on each supported OS/architecture. Radiance rendering parameters, EnergyPlus release/build, OpenStudio Measures, weather files, acoustic ray/particle settings, compiler/runtime, and locale should be part of the run manifest.

Testability is stronger than determinism. Radiance reports automated unit tests; EnergyPlus reports unit, integration, API, and regression tests; OpenStudio provides Measure tests and workflow output; pyroomacoustics provides examples, reference algorithms, and a package paper focused on testing; I-Simpa documents formulas and parameters but a current complete validation benchmark was not verified. ARKI should maintain three distinct evidence classes: software regression evidence, numerical benchmark evidence, and professional project validation evidence.

## Professional boundary and C80 relevance

For C04/C20, Radiance can support daylight-factor, illuminance, luminance, solar-optical, and annual daylight studies when geometry, materials, sky/weather, and parameters are controlled. It should not be represented as a thermal or acoustic solver. EnergyPlus can support thermal and energy consequences of solar and lighting inputs, but it should not be represented as a detailed daylight-distribution or room-acoustics engine.

For C61 and the acoustics portion of C04, I-Simpa is the closest scoped candidate to a building-acoustics workflow because its documentation explicitly includes sound-particle tracing and ISO 3382-1-derived parameters. The **C80** metric is defined from impulse-response energy before and after an early-time threshold of 80 ms; I-Simpa documents C50/C80 and related metrics. This establishes relevance, not automatic professional validity. Pyroomacoustics can produce RIRs and is useful for test and research pipelines, but the reviewed evidence does not establish professional compliance validity.

A professional boundary gate should require: an identified responsible acoustic or building-performance professional; a fixed solver/version manifest; geometry and material provenance; weather/source/receiver assumptions; numerical convergence or sensitivity evidence; comparison with trusted analytical, benchmark, or measured data; explicit uncertainty and limitation statements; and a human sign-off. Without that gate, ARKI may expose exploratory results, not certified design conclusions.

## Recommended ARKI solver-family architecture

1. **Canonical input contract.** Define a solver-neutral scene/model record containing units, coordinate system, geometry provenance, surfaces/materials, openings, sky/weather, sources, receivers, frequencies, time basis, and requested metrics. Reject incomplete or ambiguous inputs rather than guessing.
2. **Radiance adapter.** Generate version-pinned Radiance scene and sky inputs, invoke CLI tools in a controlled environment, capture stdout/stderr and exit codes, and store input/output hashes. Prefer OpenStudio when the workflow also needs whole-building EnergyPlus coupling.
3. **EnergyPlus/OpenStudio adapter.** Generate or validate IDF/epJSON, EPW and OSW inputs, run the documented CLI, capture output OSW and reports, and record all Measures and their versions. Treat the resulting model as an energy/thermal simulation, not as an acoustic or detailed daylight proof.
4. **Acoustics adapter.** Offer I-Simpa where 3D room/building acoustics and ISO 3382-style metrics are needed, subject to GPLv3 and headless-mode verification. Offer pyroomacoustics for RIR generation, algorithm experiments, and automated fixtures where a research-grade component is sufficient.
5. **Evidence gate.** Every result should state `exploratory`, `engineering-review`, or `professional-validation-required`. Only the last state may be used in a professional dossier, and only after benchmark and human-review requirements are met.

## Unknowns requiring follow-up verification

- Bit-for-bit determinism guarantees across versions, platforms, architectures, compilers, and parallel settings for all candidates: **UNKNOWN**.
- A supported standalone headless CLI for I-Simpa: **UNKNOWN**.
- A supported standalone CLI for pyroomacoustics: **UNKNOWN**.
- A complete current measured-room validation benchmark for I-Simpa: **UNKNOWN**.
- A complete current measured-room validation benchmark for pyroomacoustics suitable for professional architectural acoustics: **UNKNOWN**.
- Exact license compatibility of every OpenStudio bundled dependency, Ruby gem, Python package, and Measure used in a redistributed ARKI product: **UNKNOWN** until dependency-level audit.
- Exact API/version compatibility between `pyradiance` and current Radiance v6.0: **UNKNOWN**; the reviewed wrapper repository text identifies Radiance v5.4.
- A single end-to-end official validation result for an ARKI-specific Radiance–OpenStudio–EnergyPlus workflow: **UNKNOWN**.

## References

[1]: https://www.radiance-online.org/ "Radiance — A Validated Lighting Simulation Tool"

[2]: https://www.radiance-online.org/download-install/license "The Radiance Software License, Version 2.0"

[3]: https://github.com/LBNL-ETA/Radiance "LBNL-ETA/Radiance official source mirror"

[4]: https://github.com/NatLabRockies/EnergyPlus "EnergyPlus official development repository"

[5]: https://github.com/NREL/EnergyPlus/blob/develop/doc/running-energyplus-from-command-line.md "EnergyPlus command-line documentation"

[6]: https://energyplus.readthedocs.io/en/latest/api.html "EnergyPlus Python API documentation"

[7]: https://openstudio.net/ "OpenStudio official project site"

[8]: https://openstudiocoalition.org/about/software_license/ "OpenStudio software license description and terms"

[9]: http://natlabrockies.github.io/OpenStudio-user-documentation/reference/command_line_interface/ "OpenStudio Command Line Interface documentation"

[10]: https://github.com/Universite-Gustave-Eiffel/I-Simpa "I-Simpa official source repository"

[11]: https://i-simpa-wiki.readthedocs.io/fr/latest/room_acoustics_parameters.html "I-Simpa room acoustics parameters"

[12]: https://github.com/LCAV/pyroomacoustics "Pyroomacoustics official source repository"

[13]: https://arxiv.org/abs/1710.04196 "Pyroomacoustics: A Python package for audio room simulation and array processing algorithms"

[14]: file:///home/ubuntu/generador-familias/C1_C80_WAVE0/02_C1_C80_CAPABILITY_MATRIX.md "ARKI C1–C80 Capability Matrix"

[15]: https://www.osti.gov/biblio/1184384 "A validation of the Radiance three-phase simulation method for modeling annual daylight performance of optically-complex fenestration systems"

[16]: https://github.com/LBNL-ETA/pyradiance "pyradiance official repository"

[17]: https://simulationresearch.lbl.gov/dirpubs/valid_ep.html "EnergyPlus validation reports and test results"

[18]: https://i-simpa-wiki.readthedocs.io/fr/latest/I_Simpa_overview.html "I-Simpa overview and capabilities"

## Access log

All URLs in the References section were accessed on **2026-09-24**. No software was installed, built, or executed during this research.

## Final recommendation

Adopt **Radiance + OpenStudio/EnergyPlus** as the daylight/solar backbone and **I-Simpa with pyroomacoustics as a complementary acoustics/test pair**, behind explicit versioned adapters and professional-validation gates. Do not implement one undifferentiated “daylight/acoustics solver.” Keep optical, thermal-energy, and acoustic calculations separate in the data model, run manifest, evidence record, and user-facing claims.

**Decision for ARKI-SOLVER-MAP-001:** **RECOMMEND — governed integration family, not native solver implementation.**

**No installation was performed. No Aurora research or Aurora artifact was used.**
'}Cannot use JSON? Wait. Need write correct JSON content. I accidentally included trailing weird. Need tool call properly. It may have not executed? Tool result shows content? Actually result not shown maybe malformed due quote? It says write request maybe not output? Let's see likely failed because content string ended weird. Need use write with full content maybe too long but okay. Need check file. Regardless tools calls count maybe. Let's read target.  天天中彩票网 to=functions.read 代开户网址  content  (json വേ?) Wait we need use commentary tool. Let's call read. [
