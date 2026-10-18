# ARKI-SOLVER-MAP-001 — Optimization, MCDA, risk and finance

## Scope and conclusion

This report evaluates **exactly one solver family: SciPy**, with emphasis on `scipy.optimize`, `scipy.stats`, and `scipy.stats.qmc`. It does not research Aurora or use Aurora artifacts. The research uses official SciPy documentation, the official GitHub repository and license file, and a primary peer-reviewed validation source. URLs and access dates are recorded in the References section; all access dates are **2026-09-24**.

SciPy is a strong open-source numerical building block for continuous optimization, constrained optimization, linear programming and mixed-integer linear programming, probability distributions, statistical functions, Monte Carlo-adjacent sampling, and quasi-Monte Carlo. It is especially suitable when a professional workflow needs a programmable Python API, explicit inputs and outputs, local or global numerical methods, and tests that can run in a headless process. It is not a complete decision-analysis or finance platform: the official scope does not provide a dedicated AHP, TOPSIS, PROMETHEE, portfolio-governance, market-data, accounting, model-risk, or regulatory-control layer. Those capabilities would need to be implemented or supplied by other components.

SciPy's numerical results are not universally deterministic. Deterministic algorithms can generally be reproduced when inputs, versions, numerical environment, tolerances, and execution choices are held constant. Stochastic algorithms such as differential evolution require an explicit random-number generator for repeatable behavior; parallel execution and floating-point or backend differences can still affect bit-level reproducibility. SciPy's quasi-Monte Carlo documentation explicitly distinguishes deterministic QMC points from randomized QMC and explains that high-dimensional performance depends on assumptions about the integrand.

## Candidate assessed

| Candidate | Open-source status and license | Primary interface | CLI | Headless execution | Main relevance |
|---|---|---|---|---|---|
| SciPy (`scipy.optimize`, `scipy.stats`, `scipy.stats.qmc`) | Open source; BSD 3-Clause / modified BSD terms in the official repository license | Python API over NumPy arrays and Python callables | No dedicated official solver CLI was verified; use Python scripts or applications | Yes; ordinary Python execution is non-interactive and does not require a display | Optimization, constrained problems, LP/MILP, probability/statistics, MC/QMC sampling, numerical risk prototypes |

The official repository describes SciPy as open-source software for mathematics, science, and engineering and lists statistics and optimization among its modules.[1] The official FAQ states that SciPy is free for commercial and non-commercial use under its BSD license.[2] The repository API metadata identifies the repository as public, unarchived, Python-language code under the BSD 3-Clause license and shows recent update and push timestamps, which is evidence of active maintenance as of the access date.[3]

## Capability and API assessment

### Optimization

`scipy.optimize` covers minimization and maximization of objective functions, local and global nonlinear optimization, linear programming, mixed-integer linear programming, constrained optimization, nonlinear least squares, root finding, assignment, and related numerical utilities.[4] The `minimize` interface accepts a callable objective, an initial vector, optional derivatives, bounds, constraints, tolerances, callbacks, and method-specific options. It returns an `OptimizeResult` containing at least a solution array, a success flag, and a termination message.[5]

This makes SciPy a useful low-level solver family for numerical optimization. It can represent a wide range of continuous engineering, allocation, calibration, and risk-parameter problems. It can also handle some integer structure through the documented MILP interface and through integrality options in selected routines. The solver choice remains the user's responsibility: the API exposes many methods, but it does not automatically establish that a result is globally optimal, economically meaningful, or fit for a regulated decision.

The global `differential_evolution` method is stochastic and derivative-free. The official documentation notes that it can search large candidate spaces but often requires more function evaluations than conventional gradient-based methods.[6] It accepts bounds, constraints, population controls, callbacks, parallel-worker settings, and an `rng` argument. The documentation says that specifying `rng` provides repeatable function behavior, while the legacy `seed` behavior remains during a transition.[6] This is a reproducibility control, not a guarantee that every hardware, dependency, parallel-scheduling, or floating-point environment will produce identical bits.

### MCDA

SciPy does **not** present a dedicated official implementation of the named multi-criteria decision-analysis methods **AHP, TOPSIS, or PROMETHEE** in the reviewed `optimize`, `stats`, or repository sources. A user can build a custom scoring, weighting, ranking, or constrained optimization model from NumPy/SciPy primitives, but that is an implementation project rather than a verified built-in MCDA module. Therefore, built-in AHP/TOPSIS/PROMETHEE support is **UNKNOWN / not verified**, and should not be represented as a native SciPy feature.

For professional MCDA, the boundary matters. Weight elicitation, rank-reversal policy, preference thresholds, consistency checking, incomplete criteria, uncertainty in weights, sensitivity analysis, and audit trails are not established by calling `scipy.optimize.minimize`. They must be designed and tested at the application layer.

### Monte Carlo and quasi-Monte Carlo

`scipy.stats` contains probability distributions, summary statistics, statistical tests, and quasi-Monte Carlo functionality.[7] The `scipy.stats.qmc` module provides Sobol', Halton, Latin hypercube, Poisson disk, and related engines plus scaling and discrepancy helpers.[8] These are useful primitives for uncertainty propagation, scenario generation, sensitivity experiments, and numerical integration.

The QMC documentation is explicit about the distinction between deterministic QMC and randomized QMC. QMC points are deterministic; randomized QMC can use independent replications to estimate stability and approximate confidence intervals. The same documentation warns that QMC cannot avoid the curse of dimensionality and that improvement over independent random Monte Carlo depends on integrand properties such as smoothness and effective dimension.[8] Therefore, SciPy supports sampling and numerical experimentation, but it does not by itself provide a full risk engine with validated distribution fitting policy, dependence-model governance, stress scenario governance, capital calculations, or regulatory reporting.

### Risk and finance

SciPy supplies general mathematical and statistical primitives relevant to finance, including distributions, optimization, constrained allocation, sampling, and numerical functions. The reviewed official sources do not establish a dedicated market-data connector, portfolio accounting engine, trade/order workflow, pricing library with product coverage guarantees, model validation framework, or regulatory-reporting package. Such capabilities are **not verified** as part of SciPy and should not be inferred from the presence of probability distributions or optimization routines.

A professional finance implementation can use SciPy as a numerical component, but it must add domain controls: data lineage, calendars, conventions, benchmark definitions, parameter governance, scenario and stress controls, independent validation, numerical error tolerances, exception handling, model inventory, and evidence retention. The BSD license does not transfer responsibility for those controls.

## Engineering properties

### Language, operating systems, and deployment

The primary user-facing language is Python, with performance-critical code also implemented or wrapped in C, C++, Fortran, Cython, and Pythran according to the official FAQ.[2] The official repository says SciPy works on popular operating systems and the installation guide documents project-based, environment-based, system-package, and source-build workflows.[1] [9] The exact set of supported operating-system and Python-version combinations is release-specific; this report does not infer a universal matrix. Pin the SciPy, NumPy, Python, and platform versions in production.

SciPy is an in-process library rather than a separately managed solver service. It accepts Python callables and array-like numerical data and returns arrays, scalars, and result objects. This is well suited to embedding in services, batch jobs, notebooks, tests, and scheduled headless processes. The official documentation does not verify a dedicated command-line executable for optimization, MCDA, or risk. Consequently, CLI support is **not verified / no dedicated official CLI found in the reviewed sources**; a project can expose its own CLI around the Python API.

### Input and output contract

For `minimize`, the objective is a callable of the form `fun(x, *args) -> float`, `x0` is a one-dimensional initial vector, optional derivatives return arrays or Hessians, bounds and constraints are structured objects or documented sequences, and the result is an `OptimizeResult` with solution and termination information.[5] For differential evolution, the objective has the same basic callable shape, bounds define the candidate domain, and the result includes the best candidate and objective value through the optimization result contract.[6]

For distributions and QMC, inputs include distribution parameters, sample sizes, dimensions, random-number generators, and bounds or transforms. Outputs are numeric arrays or distribution/statistic results. SciPy does not prescribe a domain-neutral file format, audit record, model card, or decision log. Production systems must define serialization, schema validation, units, precision, missing-value policy, and provenance outside SciPy.

### Determinism and reproducibility

Determinism depends on the selected method. A deterministic function evaluation and a deterministic solver configuration can be repeatable under a pinned environment. Stochastic optimization is not inherently repeatable unless the random generator is controlled. Differential evolution documents `rng` for repeatable behavior and also exposes `workers` and update modes, so parallel execution should be treated as a reproducibility risk that requires project-specific testing.[6]

QMC sequences are deterministic by construction, while randomized QMC intentionally introduces replication-level randomness for error estimation.[8] Ordinary Monte Carlo based on random distributions requires explicit generator management if a repeatable scenario set is required. Exact cross-platform bitwise identity is **UNKNOWN** unless verified for the precise release, BLAS/LAPACK backend, hardware, thread settings, and execution mode.

### Testability and validation

SciPy is highly testable at the API boundary because objectives, constraints, random generators, bounds, tolerances, and callbacks are explicit. A project can use fixed seeds or generators, benchmark functions, golden numerical outputs with tolerances, invariant checks, feasibility checks, convergence diagnostics, and repeated-run stability tests.

The primary SciPy paper describes a component-level executable test suite and continuous integration in which proposed contributions are integrated and tests must pass before merging.[10] The official development workflow documents `spin test -v` and asks contributors to provide unit tests, coverage, benchmarks, documentation, and passing tests.[11] This is strong evidence of software validation practice, but it is not evidence that a particular user's optimization model is correct or that a financial model is fit for a regulated purpose.

The Nature Methods paper is also a primary validation source for SciPy's broad scientific-computing role. It describes SciPy as an open-source Python scientific-computing library with optimization and statistical capabilities, and explains the project's scope as fundamental algorithms and building blocks rather than every specialized domain.[10]

## Limitations and professional boundary

SciPy is not an optimizer oracle. Local methods can converge to local stationary points, derivative approximations can be sensitive to scaling and noise, and global methods can consume many evaluations without proving practical global optimality. Feasibility, conditioning, constraint qualification, stopping tolerances, and objective scaling must be checked by the application.

SciPy is not a complete MCDA package. Native AHP, TOPSIS, and PROMETHEE support was not verified. A custom implementation must define mathematical conventions and test them against primary literature or independent reference calculations.

SciPy is not a complete Monte Carlo risk platform. Sampling functions do not automatically validate distributional assumptions, dependence structures, tails, calibration windows, stress scenarios, or confidence-interval coverage for a specific model. The official QMC text itself documents dimensionality and smoothness limitations.[8]

SciPy is not a finance control framework. The reviewed sources do not verify market-data, accounting, order-management, valuation-product coverage, model inventory, approvals, audit logging, or regulatory-reporting controls. These are **UNKNOWN / outside the verified SciPy capability claim**.

SciPy is permissively licensed, but permissive licensing does not remove obligations to preserve notices, assess dependencies, manage vulnerabilities, validate numerical behavior, or meet professional and regulatory requirements. The official license includes the standard warranty disclaimer and limitation of liability.[12]

## C1–C80 relevance

The task names a C1–C80 relevance dimension but does not provide the C1–C80 taxonomy, definitions, or scoring rubric. A defensible mapping cannot be derived from the solver documentation alone. Therefore, the exact C1–C80 mapping is **UNKNOWN**.

At a high level, SciPy is directly relevant to any C-criterion that means programmable numerical optimization, constrained allocation, probability distributions, sampling, numerical integration, reproducible experiments, or automated testing. It is only indirectly relevant to criteria that require MCDA semantics, portfolio governance, market-data integration, financial controls, regulatory evidence, or business-process workflow. No individual C-number is assigned here because the underlying definitions were not provided or verified.

## Recommendation

Recommend SciPy as an **open-source numerical foundation** for ARKI-SOLVER-MAP-001 where the target is a Python-embedded, headless, testable optimization or sampling component and the project owns model governance. Use explicit method selection, pinned environments, controlled random generators, feasibility and sensitivity checks, numerical tolerances, independent validation, and retained run metadata.

Do not describe SciPy as a native AHP/TOPSIS/PROMETHEE engine, a turnkey Monte Carlo risk platform, or a complete professional finance solution. If those are hard requirements, treat SciPy as one component and separately source or build the missing MCDA, data, governance, validation, and reporting layers. Do not claim a dedicated CLI, universal bitwise determinism, or regulatory suitability without project-specific evidence.

## References

[1]: https://github.com/scipy/scipy "SciPy official GitHub repository" (accessed 2026-09-24)
[2]: https://scipy.org/faq/ "SciPy official FAQ" (accessed 2026-09-24)
[3]: https://api.github.com/repos/scipy/scipy "SciPy official GitHub repository API metadata" (accessed 2026-09-24)
[4]: https://docs.scipy.org/doc/scipy/reference/optimize.html "SciPy official optimization and root-finding reference" (accessed 2026-09-24)
[5]: https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html "SciPy official minimize API reference" (accessed 2026-09-24)
[6]: https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.differential_evolution.html "SciPy official differential_evolution API reference" (accessed 2026-09-24)
[7]: https://docs.scipy.org/doc/scipy/reference/stats.html "SciPy official statistical functions reference" (accessed 2026-09-24)
[8]: https://docs.scipy.org/doc/scipy/reference/stats.qmc.html "SciPy official quasi-Monte Carlo reference" (accessed 2026-09-24)
[9]: https://scipy.org/install/ "SciPy official installation guide" (accessed 2026-09-24)
[10]: https://www.nature.com/articles/s41592-019-0686-2 "SciPy 1.0: fundamental algorithms for scientific computing in Python" (Nature Methods, primary validation source; accessed 2026-09-24)
[11]: https://docs.scipy.org/doc/scipy/dev/contributor/development_workflow.html "SciPy official development workflow and testing guidance" (accessed 2026-09-24)
[12]: https://raw.githubusercontent.com/scipy/scipy/main/LICENSE.txt "SciPy official repository license file" (accessed 2026-09-24)

**Research boundary:** No software was installed. Aurora was not researched and no Aurora artifacts were used.
    
