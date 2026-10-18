# SolverAdapter Contract

Required fields: `solverId`, `solverFamily`, `version`, `capabilities`, `inputSchema`, `outputSchema`, `units`, `executionMode`, `environment`, `configuration`, `timeout`, `determinism`, `provenance`, `validationProfile`, `professionalBoundary`.

Operations: `canSolve`, `validateInput`, `compileInput`, `execute`, `parseOutput`, `validateOutput`, `collectEvidence`, `dispose`.

Fail closed on wrong units, missing inputs, unsupported analysis, unknown version, invalid configuration, corrupt/NaN/Infinity output, non-convergence, partial-as-complete, stale inputs, hash mismatch or missing provenance. This is a contract design only; no production adapter is implemented.
