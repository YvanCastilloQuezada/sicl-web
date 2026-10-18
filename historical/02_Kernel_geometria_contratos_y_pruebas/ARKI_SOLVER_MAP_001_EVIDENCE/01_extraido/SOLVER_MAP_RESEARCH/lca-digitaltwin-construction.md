# Solver family research: OR-Tools CP-SAT for LCA, carbon, construction scheduling, and digital-twin integration

**Research identifier:** `ARKI-SOLVER-MAP-001`  
**Selected solver family:** **Google OR-Tools CP-SAT / CP-SAT-LP constraint-optimization family**  
**Research scope:** One solver family only. Brightway, classical CPM/PERT, and telemetry/time-series/control stacks were not evaluated as candidate solver families in this report. Aurora and Aurora artifacts were not researched or used.  
**Access date for all sources below:** **2026-09-24**.  
**Installation status:** No software was installed or executed. The assessment is based on current official documentation, the official repository and license, and primary validation sources.

## Executive conclusion

OR-Tools CP-SAT is a strong open-source choice for the **discrete optimization core of construction scheduling**. It models integer decisions, precedence relations, optional activities, resource capacity, disjunctive resources, cumulative resources, and objective functions. These primitives map well to resource-constrained project scheduling and construction sequencing. The official documentation also exposes Python, C++, Java, and C# APIs, and the source repository includes model validation, solution-feasibility checking, proof-output components for SAT infeasibility, examples, and continuous-integration workflows. [1] [2] [3] [4] [5]

It is **not an LCA or carbon-accounting engine**. It does not provide an emissions-factor database, life-cycle inventory, impact-assessment method, EPD workflow, carbon-boundary policy, or audit opinion. A suitable architecture can use external, governed LCA/carbon data as model coefficients and let CP-SAT choose discrete design, procurement, sequencing, or logistics decisions. The result is an optimization scenario, not a verified carbon inventory or environmental declaration.

It is also **not a digital-twin platform or telemetry/time-series/control stack**. It has no native building-information-model authority, asset graph, event broker, time-series database, sensor calibration workflow, state estimator, supervisory control loop, or twin-governance layer. It can be placed behind an adapter that converts a snapshot of twin state into a finite optimization model and converts the returned schedule or setpoints into an external system. Real-time control, streaming ingestion, identity, provenance, and actuation remain outside the solver boundary.

For headless execution, CP-SAT is suitable as a library invoked by a batch worker, service, or command-line wrapper. A stable, general-purpose CP-SAT command-line contract is **not established by the reviewed official documentation**. The repository documents file readers and a FlatZinc backend, but that is not equivalent to a supported universal CLI for arbitrary CP-SAT models. [4] [6]

The principal determinism limitation is that CP-SAT is a portfolio solver and can use parallel workers. The official parameter source states that one worker means no parallelism, exposes a random seed, and exposes deterministic-time limits; it does not provide a blanket guarantee that every platform, version, worker count, and model will produce byte-identical outputs. For regression tests, pin the OR-Tools version and platform, canonicalize the serialized model and input data, use one worker, set the seed explicitly, disable search randomization, record the full parameter set, and test objective value and constraint validity rather than relying only on the exact assignment of tied solutions. [7]

**Recommendation:** adopt OR-Tools CP-SAT as the scheduling and discrete-decision solver behind a documented adapter. Do not present it alone as an LCA/carbon calculator, digital twin, telemetry platform, safety controller, project-controls system of record, or professional environmental certification tool.

## What was evaluated

The evaluated family is the OR-Tools **CP-SAT solver and its current CP-SAT-LP evolution**, not every solver shipped in the broader OR-Tools suite. The broader suite also contains linear, routing, graph, and wrapper interfaces, but those were not treated as separate candidates here. The current official release information identifies v9.15 and reports ongoing CP-SAT work, including scheduling cuts, memory management, precedence handling, proof production, and Python-layer improvements. [1] [8]

CP-SAT is an integer constraint-programming solver using SAT technology. The official documentation requires CP-SAT constraints and expressions to be integer-valued; non-integer quantities must be scaled or otherwise represented as integers. The solver reports `OPTIMAL`, `FEASIBLE`, `INFEASIBLE`, `MODEL_INVALID`, and `UNKNOWN` statuses. `FEASIBLE` does not prove optimality, and `UNKNOWN` can result when a limit is reached without a proof of feasibility or infeasibility. [2]

## Capability assessment

| Dimension | Verified finding | Engineering interpretation |
|---|---|---|
| **Open-source status** | The official repository describes OR-Tools as open source and states that the suite is licensed under Apache License 2.0. [1] [9] | Suitable for internal and commercial integration subject to Apache 2.0 notice, attribution, patent, dependency, and third-party-solver obligations. Review bundled dependencies and optional commercial backends separately. |
| **Commercial status** | The core CP-SAT family is not presented as a paid hosted service or commercial solver license. The suite can wrap commercial solvers, but those are distinct dependencies and licenses. [1] [5] | Core solver cost is not the same as the cost of support, hosting, engineering, data, or optional commercial backends. A procurement claim about an entire solution remains UNKNOWN without a deployment-specific bill of materials. |
| **Operating systems** | Official installation materials list binary distributions for Linux, macOS, and Windows across C++, .NET, Java, and Python; the repository lists tested Ubuntu, macOS, and Windows environments and current release artifacts cover multiple architectures. [1] [5] [8] | Portable across the principal server and developer platforms. Exact supported matrix is release-specific; pin a version and verify the target image. |
| **Implementation language** | The core is written in C++; official wrappers are provided for Python, C#, and Java. [1] [5] | C++ is the native implementation. Python is the most convenient orchestration language for data pipelines; Java and .NET are supported alternatives. |
| **Python API** | Official examples import `ortools.sat.python.cp_model`, create `CpModel` and `CpSolver`, solve the model, inspect status, and read variable values. [2] [3] | A first-class Python API is available. It is appropriate for batch/headless workers and test harnesses, but version-pin the API because release notes document API and dependency changes. |
| **CLI** | Official sources document Python execution and native build systems. The SAT directory documents OPB/CNF readers, a FlatZinc backend, and `sat_runner`, but the reviewed docs do not define a stable, general-purpose CP-SAT CLI interface for arbitrary models. [4] [5] | **CLI: LIMITED/UNKNOWN as a supported universal contract.** Build a project-owned wrapper if a CLI boundary is required. Do not assume a file format or internal runner is a long-term public API without release-specific verification. |
| **Headless execution** | The library can be called from a Python, C++, Java, or C# process, with explicit time and solution limits and machine-readable status available through the API. [2] [3] [6] | **Yes, as an embedded library or service worker.** A production wrapper should emit model hash, solver version, parameters, status, objective, bounds, wall time, deterministic time where available, and validation results. |
| **Determinism** | The official parameter source exposes `random_seed`, search-randomization settings, `num_workers`, and `max_deterministic_time`; it states that one worker means no parallelism. The same source also describes seed variation as useful for robust benchmarks and documents a portfolio-search context. [7] | Reproducibility is configurable but not an unconditional guarantee. Use one worker and fixed parameters for tests. Parallel portfolio search may change search order, time to solution, and which tied optimum is returned. Exact cross-platform bitwise identity is **UNKNOWN**. |
| **Input/output** | Inputs are programmatically constructed CP models containing integer variables, Boolean literals, linear expressions, intervals, precedences, optional intervals, no-overlap constraints, cumulative constraints, and objectives. Outputs include status, assignments, objective values, bounds/statistics, callbacks, and serialized protocol-buffer representations. [2] [3] [6] | Strong for structured discrete decision models. It does not natively ingest IFC, BIM, EPD, LCI, MQTT, OPC UA, historian, or arbitrary time-series schemas; adapters and data validation are required. |
| **Active development** | Official release notes report v9.15 in January 2026, while the v9.15 release lists CP-SAT changes in no-overlap-2D, precedence processing, LRAT proof work, set constraints, workers, scheduling cuts, Python support, and bug fixes. [8] | Active development is verified. Pin versions and maintain migration tests because active solver evolution can change behavior, performance, APIs, dependencies, or platform support. |
| **Testability** | The repository documents `ValidateCpModel`, a model checker, a solution-feasibility checker, a solver API, examples, and automated workflow files covering multiple build and platform combinations. [4] [6] [10] | High testability at the model and integration levels. Tests should validate schema, units, integer scaling, feasibility, objective bounds, status semantics, and invariants. Exact schedules should not be the only oracle where tied solutions exist. |
| **Validation** | The 2023 CP conference primary source describes CP-SAT-LP as an integral constraint-programming solver on SAT with a simplex and portfolio of workers, and reports strong scheduling and integer-optimization results. Google's official MiniZinc report records two gold and two silver medals in the 2013 challenge. [11] [12] | There is credible solver-level validation and benchmark provenance. Those results do not validate a project's LCA factors, carbon boundaries, construction data, safety assumptions, or digital-twin state quality. |
| **Limitations** | Integer modeling is required; time or solution limits can yield merely feasible or unknown outcomes; large models can be computationally difficult; callbacks can affect performance; result choice can vary with portfolio search and equivalent optima; external data and adapters are not supplied. [2] [6] [8] | A production system needs explicit infeasibility handling, timeout policy, incumbent/bound reporting, integer-scaling policy, observability, and human review for material decisions. |
| **Professional boundary** | OR-Tools is an optimization library, not a licensed engineer, environmental verifier, scheduler-of-record, controls authority, or safety-certification body. No official source reviewed grants professional sign-off authority. | Use it to calculate candidate schedules or discrete plans. A qualified professional and the system owner must own assumptions, approvals, safety, carbon-accounting conformance, and contractual commitments. |

## Domain relevance

### LCA and carbon

**Relevance: indirect but useful.** CP-SAT can select among discrete alternatives when each alternative has supplied integer coefficients such as embodied-carbon factors, transport emissions, waste penalties, cost, or schedule impacts. It can optimize a weighted objective or use constraints such as a carbon cap, budget cap, material availability, or completion deadline. The solver does not determine whether the coefficients are scientifically appropriate. It does not calculate life-cycle stages, define system boundaries, reconcile biogenic carbon, select impact methods, validate EPD declarations, or produce an LCA report. Those functions require an external data and accounting layer, documented assumptions, and professional review.

A carbon-coupled model should therefore keep at least three separate artifacts: the governed factor dataset and provenance, the integer optimization model and scaling rules, and the solver result with status and bound. A result marked `FEASIBLE` must not be described as a proven minimum. A result marked `UNKNOWN` must not be used as if it were an optimization proof.

### Construction scheduling

**Relevance: high.** The scheduling documentation explicitly covers tasks, resources, times, fixed or variable durations, alternate ways to perform a task, mutual exclusivity, and temporal relations. Interval variables encode start, size, and end; optional intervals encode selected activities; precedence constraints express temporal relations; no-overlap models a shared disjunctive resource; cumulative constraints represent capacity-limited resources. [6]

These primitives map to common construction-scheduling abstractions: work packages, crews, equipment, work fronts, access windows, calendars represented as blocked intervals, alternative methods, material availability, and milestone objectives. The mapping remains a model-development responsibility. CP-SAT does not know construction means and methods, contract calendars, weather risk, safety rules, or local labor practice unless the project encodes them correctly.

### Digital twin

**Relevance: adapter-level.** A digital twin can provide a snapshot of asset state, work progress, resource availability, and measured conditions. An adapter can convert that snapshot into a bounded CP-SAT model, solve a rescheduling or what-if problem, and publish a proposed plan back to the twin platform. The solver itself does not provide the twin's identity model, spatial/semantic graph, temporal state history, sensor calibration, event processing, asset lifecycle, access control, or provenance.

The safe pattern is **snapshot → validate → model → solve → validate → publish proposal**. For closed-loop operation, add stale-data detection, command authorization, rate limits, rollback, simulation or digital shadow testing, and human approval. Direct actuation from an unreviewed optimization result is outside the solver's verified capability.

### Telemetry, time series, and control

**Relevance: low natively; possible through integration.** CP-SAT is not a stream processor, database, estimator, PID/MPC controller, or protocol endpoint. A separate telemetry layer must aggregate and quality-check observations, select a time horizon, and translate continuous or noisy measurements into discrete decisions. CP-SAT's integer requirement can be a natural fit for discrete work states and resource decisions, but it is not evidence that the solver is suitable for high-frequency continuous control.

## Headless and production contract

A production service should treat the solver as a pure-ish computation step surrounded by explicit input and output contracts. The input contract should include a model schema version, units, time origin, integer scaling factors, data timestamp, source identifiers, assumptions, and a canonical serialization. The output contract should include the solver version, parameter string, model hash, status, objective value, best bound where available, feasibility-check result, wall time, deterministic-time statistic where available, and the selected decision variables.

The service should distinguish at least four outcomes: proven optimum, feasible incumbent without optimality proof, proven infeasible, and unknown/limit/error. It should not silently substitute a stale plan when a model is infeasible or data is stale. For digital-twin use, the output should be a **proposal** until an external approval and controls layer accepts it.

## Reproducibility and determinism protocol

The official parameter source verifies the relevant controls but does not establish a universal bit-for-bit guarantee. A defensible regression protocol is:

1. Pin the OR-Tools release, wrapper version, compiler/runtime, operating-system image, and optional backend set.
2. Canonicalize input ordering, variable naming, time units, integer scaling, and serialized model bytes.
3. Use one search worker to remove parallel search, set a fixed random seed, and explicitly set all search-randomization options used by the application.
4. Record the complete solver parameter text, model hash, data hash, and environment metadata.
5. Validate every returned assignment against the model and domain invariants.
6. Compare objective value, feasibility, bound, and status as the primary test oracle. Compare exact variable assignments only where the model has a unique expected solution.
7. Maintain benchmark and migration tests across every solver upgrade. Active release notes demonstrate that solver internals and APIs change over time. [7] [8]

## Limitations and failure modes

The integer-only CP-SAT model can require scaling for carbon factors, costs, rates, and durations. Poor scaling can create large coefficients or distort precision. The application must define rounding and conservatism rules; CP-SAT cannot decide whether a rounded carbon factor is acceptable.

Search can be difficult or incomplete. A time-limited solve can return a feasible solution without proving it best, or `UNKNOWN` if no useful conclusion was reached before stopping. Any user-facing plan should report this status and the optimality gap or bound when available.

The solver can return one of several equivalent optima. Parallel workers and heuristic search can alter which one appears first or is retained. This is a reproducibility concern, not necessarily a correctness defect.

Callbacks and excessive logging can slow search. The release notes explicitly warn that callbacks in Python, Java, and .NET can materially affect search performance. [8] Keep callbacks lightweight and move durable audit logging to the surrounding service where possible.

The solver cannot repair an incomplete domain model. Missing precedence, resource calendars, alternative-method logic, safety exclusions, or carbon-boundary assumptions can produce a mathematically valid but professionally unacceptable result. This is the primary boundary between solver correctness and project correctness.

## C1-C80 relevance

The brief supplies the labels `C1` through `C80` but does not supply their definitions. Exact criterion-by-criterion relevance is therefore **UNKNOWN**, and no label meaning has been inferred. The following table records that limitation explicitly rather than fabricating a mapping.

| Criteria | Exact relevance status | Reason |
|---|---|---|
| C1–C10 | UNKNOWN | Criterion definitions were not provided in the research brief. |
| C11–C20 | UNKNOWN | Criterion definitions were not provided in the research brief. |
| C21–C30 | UNKNOWN | Criterion definitions were not provided in the research brief. |
| C31–C40 | UNKNOWN | Criterion definitions were not provided in the research brief. |
| C41–C50 | UNKNOWN | Criterion definitions were not provided in the research brief. |
| C51–C60 | UNKNOWN | Criterion definitions were not provided in the research brief. |
| C61–C70 | UNKNOWN | Criterion definitions were not provided in the research brief. |
| C71–C80 | UNKNOWN | Criterion definitions were not provided in the research brief. |

At the domain level, the evidence supports the following non-criterion-specific statement: **construction scheduling is high relevance; LCA/carbon is indirect relevance through externally supplied coefficients; digital-twin integration is adapter-level relevance; and telemetry/time-series/control is not natively provided.** These statements must not be substituted for the missing C1-C80 definitions.

## Recommendation and adoption boundary

Adopt OR-Tools CP-SAT when the core problem is a discrete, constraint-heavy scheduling or allocation problem and the project can provide reliable integerized inputs. Wrap it in a project-owned service that owns data validation, unit conversion, provenance, model versioning, timeout policy, observability, and approval workflow.

Do not adopt CP-SAT alone as the system of record for LCA or carbon accounting. Pair it with a governed LCA/carbon data and reporting layer, and have qualified practitioners review system boundaries, factors, uncertainty, and claims.

Do not treat CP-SAT as a digital-twin platform or real-time controller. Pair it with a twin/telemetry stack and use a proposal-and-approval pattern unless an independently validated controls architecture establishes a different boundary.

## References

[1]: https://github.com/google/or-tools "Google OR-Tools official repository and README (accessed 2026-09-24)"

[2]: https://developers.google.com/optimization/cp/cp_solver "OR-Tools CP-SAT Solver official documentation (accessed 2026-09-24)"

[3]: https://developers.google.com/optimization/introduction/python "OR-Tools Python official guide (accessed 2026-09-24)"

[4]: https://github.com/google/or-tools/tree/stable/ortools/sat "OR-Tools official SAT/CP-SAT source documentation (accessed 2026-09-24)"

[5]: https://developers.google.com/optimization/introduction/installing "OR-Tools official installation and platform documentation (accessed 2026-09-24)"

[6]: https://github.com/google/or-tools/blob/stable/ortools/sat/docs/scheduling.md "OR-Tools official scheduling model documentation (accessed 2026-09-24)"

[7]: https://raw.githubusercontent.com/google/or-tools/stable/ortools/sat/sat_parameters.proto "OR-Tools official CP-SAT parameter source, including seed, workers, and deterministic-time settings (accessed 2026-09-24)"

[8]: https://github.com/google/or-tools/releases "OR-Tools official GitHub releases, including v9.15 (accessed 2026-09-24)"

[9]: https://github.com/google/or-tools/blob/stable/LICENSE "OR-Tools official Apache License 2.0 file (accessed 2026-09-24)"

[10]: https://github.com/google/or-tools/tree/stable/.github/workflows "OR-Tools official continuous-integration workflow directory (accessed 2026-09-24)"

[11]: https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.CP.2023.3 "Perron, Didier, and Gay, The CP-SAT-LP Solver, CP 2023 primary publication (accessed 2026-09-24)"

[12]: https://research.google/blog/the-minizinc-challenge/ "Google Research official MiniZinc Challenge validation report (accessed 2026-09-24)"

[13]: https://developers.google.com/optimization/support/cite "OR-Tools official citation guidance and solver provenance (accessed 2026-09-24)"

[14]: https://pypi.org/project/ortools/ "OR-Tools official PyPI package metadata for version 9.15.6755 (accessed 2026-09-24)"

[15]: https://developers.google.com/optimization/cp/cp_tasks "OR-Tools official solver-limit and callback task documentation (accessed 2026-09-24)"

[16]: https://github.com/google/or-tools/blob/stable/ortools/sat/README.md "OR-Tools official CP-SAT README with model-checking and input/output components (accessed 2026-09-24)"

[17]: https://developers.google.com/optimization/scheduling "OR-Tools official scheduling overview (accessed 2026-09-24)"

[18]: https://developers.google.com/optimization "OR-Tools official suite overview (accessed 2026-09-24)"

**Report status:** Complete for the single selected solver family. Unknowns are stated explicitly where the reviewed sources do not establish a fact.
