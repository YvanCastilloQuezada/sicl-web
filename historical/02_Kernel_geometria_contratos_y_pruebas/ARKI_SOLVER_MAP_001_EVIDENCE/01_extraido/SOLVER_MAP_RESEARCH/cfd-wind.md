# ARKI-SOLVER-MAP-001 — Wind CFD and Aerodynamics

**Research status:** Current-source review completed **2026-09-24**. The scope is one solver family: open computational fluid dynamics (CFD) and aerodynamic solvers, represented by **OpenFOAM** and **SU2**, with a separate professional boundary for physical wind-tunnel testing. No Aurora material or artifact was used. No software was installed.

## Executive conclusion

OpenFOAM and SU2 are **open-source CFD solver suites**, not wind tunnels. They can run from the command line and therefore support scripted, batch, and headless execution. Both expose source code and reproducible case/configuration inputs, but neither official project source reviewed here promises bit-for-bit deterministic output across compilers, processor counts, MPI implementations, hardware, or floating-point environments. Their official verification and validation material demonstrates that solver implementation and selected physical models can be checked; it does not turn a simulation into a substitute for measured aerodynamic evidence.

For a wind-aerodynamics capability, the defensible boundary is therefore: use OpenFOAM or SU2 for model-based flow prediction, parametric studies, optimization, and automated regression; use professionally operated wind-tunnel testing when empirical force, pressure, transition, separation, unsteady-flow, or facility-effect evidence is required. NASA primary sources explicitly frame CFD validation as dependent on physical measurements and emphasize facility and model effects. A CFD run should not be represented as a wind-tunnel measurement.

## Scope and interpretation

This report treats **OpenFOAM** and **SU2** as two implementations within the same solver family. OpenFOAM is a broad, extensible finite-volume CFD toolbox with many application solvers. SU2 is an open-source C++ suite centered on CFD and aerodynamic shape optimization, with Python orchestration scripts. The professional distinction is included because the requested family name combines computational wind analysis with aerodynamics, but a wind tunnel is an experimental facility rather than a software solver.

The requested **C1–C80 relevance** labels cannot be assigned to individual controls because the C1–C80 control definitions were not supplied in the research brief and could not be verified from the official sources reviewed. Any specific mapping would be an inference. The report instead identifies the capability areas that can be mapped once the authoritative C1–C80 catalogue is available: command-line automation, reproducible inputs, numerical verification, physical validation, uncertainty, data lineage, and professional sign-off.

## Candidate comparison

| Candidate | License and openness | OS / language | Python API and CLI | Headless use | Determinism | Inputs and outputs | Testability and validation | Professional boundary |
|---|---|---|---|---|---|---|---|---|
| **OpenFOAM Foundation line** | Free and open source under GPLv3 or later according to the official repository license file. [1] | Official source compilation guidance is for Linux distributions; source is publicly developed. C++ implementation is evidenced by the source repository and programmer/developer documentation, but a complete supported-language matrix was not found in the reviewed pages. [1] [4] | Official documentation describes many applications as primarily command-line driven, with `application [OPTIONS] arguments` syntax. A supported official Python API was not verified. [2] | **Yes, operationally.** The command-line and batch-processing design supports non-interactive execution. [2] | **No formal bitwise-determinism guarantee verified.** Results can depend on discretization, convergence criteria, compiler, hardware, parallel decomposition, and floating-point order; this is an engineering caveat, not a project-stated guarantee. | Case directories assemble mesh, fields, boundary conditions, models, numerics, and system controls. Applications write fields, time directories, logs, and sampled/post-processed data. The official guide describes case assembly and pre-/post-processing. [3] | Official documentation links verification/validation tutorial cases whose predictions are compared with reference datasets. This supports regression and model-evidence workflows, but case coverage is not a universal validation certificate. [5] | Suitable for engineering analysis when the user owns meshing, model selection, convergence, uncertainty, and correlation. It is not a physical measurement and does not by itself establish flight-worthiness, certification evidence, or facility-corrected aerodynamic truth. NASA’s validation guidance requires comparison with physical measurements and attention to wind-tunnel effects. [8] [9] |
| **SU2** | Freely available under the GNU Lesser General Public License v2.1 according to the official download page and repository license. [6] [7] | Official project materials identify a C++ solver suite with Python 3 as a build/runtime requirement and support Linux, macOS, and Windows distributions or build paths. [6] [10] | Official execution documentation provides direct C++ module commands such as `SU2_CFD config.cfg`, MPI launch, and Python automation scripts for adjoints, finite differences, and shape optimization. A stable, importable Python API contract was not verified; the verified interface is Python scripts that coordinate executables. [10] | **Yes.** Serial and MPI executables accept configuration files from a terminal, and Python scripts automate multi-step workflows. [10] | **No formal bitwise-determinism guarantee verified.** MPI decomposition, compiler, BLAS/MPI implementation, convergence settings, and floating-point reduction order can affect numerical output; this is a caveat rather than an official SU2 guarantee. | Configuration files define problem and solver parameters. Mesh, restart, and solution files are read and written by the modules; during parallel execution the official documentation notes that SU2_CFD writes restart files and SU2_SOL can generate solution files. [10] | The official V&V collection covers manufactured-solution verification, grid-convergence and code-to-code checks, and comparisons with experimental data for selected cases. The separate TestCases repository supports automated regression for a subset, while explicitly warning that the suite carries no performance or expected-result guarantee. [11] [12] | Strong candidate for aerodynamic CFD, adjoints, and optimization. It remains a numerical model. Professional use requires independent verification, validation against appropriate measurements, uncertainty treatment, and engineering review; it cannot replace a wind-tunnel campaign where physical evidence is required. [8] [9] |
| **Professional wind-tunnel testing** | Not a software solver and therefore not classifiable as open source or commercial software. Facility ownership, access, test hours, instrumentation, and data rights vary; no specific facility or commercial supplier was evaluated. | Physical facility with a model, flow system, instrumentation, data acquisition, and test operators. OS, programming language, CLI, and Python API are **not applicable** to the facility itself. | No solver CLI/API. Automation and data-acquisition interfaces are facility-specific and **UNKNOWN** for an unspecified tunnel. | A tunnel may support automated test sequences, but headless operation for an unspecified professional facility is **UNKNOWN**. | Measurement repeatability and uncertainty are experimental properties, not bitwise software determinism. They must be characterized through calibration, repeat runs, instrumentation uncertainty, and facility corrections. | Physical model and test conditions in; measured forces/moments, pressures, flow visualization, wake/velocity data, and uncertainty information out. Exact modalities depend on the facility and instrumentation, so unspecified details are **UNKNOWN**. | This is the primary empirical boundary for validating aerodynamic predictions. NASA sources state that CFD validation relies heavily on physical measurements and that facility/model effects can influence the measured flow. [8] [9] | Required when the decision needs measured aerodynamic evidence, especially for flow physics not confidently represented by the selected CFD models. A tunnel does not remove scaling, blockage, support interference, instrumentation, or uncertainty issues; those must be documented and corrected where appropriate. [9] |

## OpenFOAM findings

OpenFOAM’s official documentation describes a broad toolbox whose functionality is exposed through guides, tutorials, pre-processing, boundary conditions, models, numerical solvers, and post-processing. [3] The Foundation repository describes it as a free, open-source CFD package with applications spanning complex fluid flow, chemical reactions, turbulence, heat transfer, solid dynamics, and electromagnetics. [1] For wind and aerodynamics, that breadth means OpenFOAM can represent external aerodynamics and atmospheric or environmental flows when the user chooses an appropriate mesh, turbulence/transition model, boundary condition, time integration scheme, and convergence protocol.

The official command-line page is unusually clear about automation: applications are primarily driven by the command line, and this is presented as a flexible mechanism for case setup, execution, evaluation, automation, and batch processing. [2] This supports container or job-runner integration in principle, although container behavior, scheduler integration, and a supported Python SDK were not verified in the reviewed official sources. The reliable automation unit is the case directory plus explicit application commands and logs.

OpenFOAM’s official verification-and-validation page says that tutorial cases compare predictions with reference datasets. [5] That is useful evidence for testability, but it should be read narrowly. A reference comparison for one case does not validate every solver, turbulence model, geometry, Reynolds number, Mach number, or transient phenomenon. The NASA materials make the same professional point from the validation side: validation is a claim about a model for a situation of interest, not a blanket property of software.

The Foundation license file is GPLv3 or later. [1] That establishes open-source availability and copyleft obligations for conveyed covered works. It does not provide a warranty, accuracy guarantee, or certification status. A separate OpenCFD/ESI distribution exists, but this report does not merge its release, license, or feature claims with the Foundation line; the candidate is explicitly the OpenFOAM family, and the license statement above is for the Foundation repository reviewed.

## SU2 findings

SU2’s official repository identifies a C++ open-source suite for numerical solution of partial differential equations and PDE-constrained optimization, with CFD and aerodynamic shape optimization as primary applications. [10] The official download page states LGPL-2.1 licensing and offers serial and MPI binaries, source access, tutorials, and a separate test-case repository. [6] The repository’s license file is the primary license record. [7]

SU2’s execution model is well suited to headless studies. The official execution documentation shows direct module invocation with a configuration file, MPI launch with `mpirun`, and Python scripts that coordinate direct, adjoint, finite-difference, and shape-optimization workflows. [10] This is more than a GUI batch mode: it is a file-and-process interface that can be placed in a CI job or parameter sweep. However, the reviewed sources do not establish a version-stable Python library API with semantic compatibility guarantees. The safe statement is that SU2 supplies Python automation scripts, not that it provides a general-purpose supported SDK.

SU2’s V&V collection explicitly distinguishes verification from validation. It includes manufactured-solution and grid-convergence work, code-to-code comparisons, and selected comparisons with experimental data. [11] This is strong primary evidence for a testable research and engineering workflow. The TestCases repository adds automated regression for a subset of cases but warns that the full suite is not guaranteed for performance or expected results and that small configuration changes can materially alter outputs. [12] That warning is directly relevant to determinism and test design: regression baselines must pin versions, inputs, mesh, solver settings, MPI layout, and acceptance tolerances.

## Professional wind-tunnel distinction

A wind tunnel produces measurements from a physical flow around a model or article. CFD produces numerical predictions from discretized equations, constitutive and turbulence models, boundary conditions, and numerical algorithms. The two are complementary evidence streams, not interchangeable product labels.

NASA’s CFD/wind-tunnel material states that CFD predictions should be compared with wind-tunnel measurements and discusses the need to understand discrepancies near difficult regimes such as high lift. [8] The NASA Common Research Model high-lift validation requirements paper is more specific: it states that CFD validation comparisons rely heavily on physical measurements acquired during wind-tunnel testing, and it discusses facility boundary layers, model/facility interactions, balance forces, frequency data, and off-body flow measurements as relevant to validation. [9] Those observations establish the professional boundary for this map:

1. **CFD is appropriate for prediction and exploration.** It is useful for design-space exploration, flow-field inspection, sensitivity analysis, optimization, and pre-test planning.
2. **Wind-tunnel testing is appropriate for physical correlation.** It measures forces, moments, pressures, flow structures, or unsteady content under specified facility conditions, subject to its own corrections and uncertainty.
3. **Validation is conditional.** A CFD model is validated for a defined regime and quantity of interest against suitable measurements. A solver name alone is not validated.
4. **Neither method is automatically authoritative.** CFD has model-form, discretization, convergence, and boundary-condition uncertainty. Wind tunnels have scaling, blockage, support interference, facility boundary-layer, instrumentation, calibration, and repeatability uncertainty.
5. **Professional claims require traceability.** The evidence package should retain geometry and mesh versions, solver/configuration version, model choices, convergence history, residual and force histories, uncertainty assumptions, measurement metadata, and review decisions.

## Determinism and reproducibility assessment

The official materials verify scriptable execution and public source/configuration inputs, but they do not promise bitwise reproducibility. Therefore the appropriate classification is **reproducible by controlled protocol, determinism not guaranteed** for both OpenFOAM and SU2. A practical protocol should pin the source release or commit, compiler and dependency versions, mesh and case/configuration files, MPI implementation and rank count, hardware class, random seeds where any stochastic component exists, stopping criteria, and post-processing code. It should compare engineering quantities with declared tolerances rather than assume byte-identical logs or fields.

For SU2, the official TestCases note that changes in configuration can produce large output changes and that only a subset is used for regular internal regression. [12] For OpenFOAM, the official case-driven command-line design makes the inputs auditable, but the reviewed pages do not state a cross-platform deterministic-output guarantee. Those are **limitations of the evidence**, not proof that either code is inherently nondeterministic in every configuration.

## Testability, APIs, and interface boundary

The minimum testable unit for either solver is a versioned case, mesh, configuration, launch command, and expected metric set. A robust test suite should include a smoke test for process completion, mesh and boundary-condition checks, conservation or residual checks, convergence or statistical-stationarity checks, and selected quantity-of-interest tolerances. Verification should include manufactured or analytic solutions where available, order-of-accuracy or grid studies, and code-to-code comparisons. Validation should compare with independent physical data and preserve uncertainty budgets.

OpenFOAM’s verified interface is its command-line application family and case structure. An official supported Python API was **not verified** in this review. SU2’s verified interface includes command-line C++ modules and supplied Python orchestration scripts; a stable importable Python API was **not verified**. In both cases, external wrappers should be treated as separate software with their own maintenance and license review.

## Limitations and recommendation

Neither OpenFOAM nor SU2 is a turnkey answer to every wind problem. Common limitations include mesh-generation burden, sensitivity to boundary conditions and turbulence/transition models, convergence failure or non-uniqueness, model-form error in separated and massively unsteady flows, high computational cost for scale-resolving approaches, and the need for expert interpretation. The official sources reviewed do not provide a universal accuracy percentage, universal Reynolds-number envelope, or professional certification claim; those values are **UNKNOWN** and must not be invented.

**Recommendation:** classify **OpenFOAM** as the broader open CFD toolbox when multiphysics breadth, custom models, and case-level extensibility matter. Classify **SU2** as the stronger open candidate when aerodynamic analysis, adjoints, shape optimization, and a documented V&V/test-case workflow are central. For ARKI-SOLVER-MAP-001, record both under the single **Wind CFD and aerodynamics** solver family, but keep a separate **professional wind-tunnel** capability boundary. Do not count a CFD result as physical validation unless it has been correlated against suitable measurements with documented uncertainty and facility/model effects.

## C1–C80 relevance

A verified C1–C80 control catalogue was not provided. The following relevance statement is therefore intentionally capability-level rather than a fabricated control-by-control mapping:

- **Likely relevant once the catalogue is supplied:** reproducible execution, CLI/API integration, headless operation, test fixtures, version pinning, data lineage, numerical verification, validation evidence, uncertainty tracking, and human approval for professional aerodynamic decisions.
- **Likely solver-family-specific:** mesh and boundary-condition provenance, convergence criteria, turbulence/transition model selection, grid/time-step studies, MPI configuration, quantity-of-interest tolerances, and regression baselines.
- **Likely wind-tunnel-specific:** facility calibration, model metrology, blockage/support corrections, instrumentation traceability, repeatability, test matrix, and measurement uncertainty.
- **Currently UNKNOWN:** the exact C1–C80 labels, required evidence for each control, and whether any control is intended to distinguish open-source CFD from commercial solvers or physical testing.

## Sources and access dates

All URLs below were accessed on **2026-09-24**. The list intentionally prioritizes official project documentation, official repositories/license files, and NASA primary validation material.

[1]: https://github.com/OpenFOAM/OpenFOAM-12 "OpenFOAM Foundation OpenFOAM-12 repository and README"
[2]: https://doc.openfoam.com/2212/getting-started/command-line/ "OpenFOAM command-line interface documentation"
[3]: https://www.openfoam.com/documentation/overview "OpenFOAM official documentation overview"
[4]: https://openfoam.org/download/source/ "OpenFOAM Foundation compiling from source"
[5]: https://doc.openfoam.com/2306/examples/verification-validation/ "OpenFOAM verification and validation examples"
[6]: https://su2code.github.io/download.html "SU2 official download, license, binaries, tutorials, and test cases"
[7]: https://raw.githubusercontent.com/su2code/SU2/master/LICENSE.md "SU2 repository LGPL-2.1 license file"
[8]: https://ntrs.nasa.gov/api/citations/20120016316/downloads/20120016316.pdf "NASA Role of Computational Fluid Dynamics and Wind Tunnels in the Design Process"
[9]: https://commonresearchmodel.larc.nasa.gov/wp-content/uploads/sites/7/2023/02/AIAA-2020-2772-Requirements.pdf "NASA Common Research Model high-lift CFD validation requirements"
[10]: https://su2code.github.io/docs/Execution/ "SU2 execution documentation: CLI, MPI, and Python scripts"
[11]: https://su2code.github.io/vandv/home/ "SU2 verification and validation collection"
[12]: https://github.com/su2code/TestCases "SU2 official test-case and regression repository"
[13]: https://github.com/su2code/SU2 "SU2 official source repository and project overview"
[14]: https://www.grc.nasa.gov/www/wind/valid/tutorial/tutorial.html "NASA tutorial on CFD verification and validation"

## Unknowns recorded explicitly

The following facts were not verified from the cited official sources and remain **UNKNOWN**: a stable official OpenFOAM Python API; a stable importable SU2 Python SDK/API contract; bitwise determinism guarantees for either suite; a universal accuracy or certification claim; complete current OS/version support matrices for every release; exact commercial support terms; exact professional wind-tunnel automation interfaces for an unspecified facility; and the definitions and evidence requirements for C1–C80.

**Report author:** Manus AI

**Report path:** `/home/ubuntu/generador-familias/SOLVER_MAP_RESEARCH/cfd-wind.md`

[1]: https://github.com/OpenFOAM/OpenFOAM-12 "OpenFOAM Foundation OpenFOAM-12 repository and README"
[2]: https://doc.openfoam.com/2212/getting-started/command-line/ "OpenFOAM command-line interface documentation"
[3]: https://www.openfoam.com/documentation/overview "OpenFOAM official documentation overview"
[4]: https://openfoam.org/download/source/ "OpenFOAM Foundation compiling from source"
[5]: https://doc.openfoam.com/2306/examples/verification-validation/ "OpenFOAM verification and validation examples"
[6]: https://su2code.github.io/download.html "SU2 official download, license, binaries, tutorials, and test cases"
[7]: https://raw.githubusercontent.com/su2code/SU2/master/LICENSE.md "SU2 repository LGPL-2.1 license file"
[8]: https://ntrs.nasa.gov/api/citations/20120016316/downloads/20120016316.pdf "NASA Role of Computational Fluid Dynamics and Wind Tunnels in the Design Process"
[9]: https://commonresearchmodel.larc.nasa.gov/wp-content/uploads/sites/7/2023/02/AIAA-2020-2772-Requirements.pdf "NASA Common Research Model high-lift CFD validation requirements"
[10]: https://su2code.github.io/docs/Execution/ "SU2 execution documentation: CLI, MPI, and Python scripts"
[11]: https://su2code.github.io/vandv/home/ "SU2 verification and validation collection"
[12]: https://github.com/su2code/TestCases "SU2 official test-case and regression repository"
[13]: https://github.com/su2code/SU2 "SU2 official source repository and project overview"
[14]: https://www.grc.nasa.gov/www/wind/valid/tutorial/tutorial.html "NASA tutorial on CFD verification and validation"

> Note: The reference definitions are repeated at the end to keep the report self-contained after the final rewrite; the first occurrence is the authoritative reference list.
