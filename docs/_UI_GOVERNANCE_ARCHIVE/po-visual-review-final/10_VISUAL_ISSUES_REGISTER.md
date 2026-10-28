# Visual issues register — evidence only

No product repairs were executed. The entries below are observations or unknowns, not defects automatically confirmed.

| ID | Area | Observation | Evidence class |
|---|---|---|---|
| V-001 | Lazy routes | `Cargando módulo` remains visible for multiple declared routes. | RUNTIME_EVIDENCE |
| V-002 | Core-dependent routes | Explicit fail-closed/503 messages are visible when Core transport is unavailable. | RUNTIME_EVIDENCE |
| V-003 | Build | Several production chunks exceed the 500 kB advisory threshold. | BUILD_EVIDENCE |
| V-004 | Controls | Static inventory contains 1,336 occurrences, but runtime functionality is not proven for all. | CODE_EVIDENCE + UNKNOWN |
| V-005 | Screenshot association | Raw browser filenames do not encode route identity. | TOOL_EVIDENCE |
| V-006 | App.tsx | Prior conflict diagnostic is not reproducible in current source/check/build. | CODE_EVIDENCE |
