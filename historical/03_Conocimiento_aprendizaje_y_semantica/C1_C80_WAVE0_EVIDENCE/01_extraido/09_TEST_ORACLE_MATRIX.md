# Test and Oracle Matrix

| Test layer | Required for every promoted capability | Wave 0 result |
|---|---|---|
| Contract/schema | typed input/output and status | registered, not capability-tested |
| Normal | representative valid case | planned per Cn |
| Negative/adversarial | invalid input, missing dependency, forbidden execution | planned per Cn |
| Mutant | deliberately broken implementation detected | required before promotion |
| Transfer | unseen case, not training fixture | required before promotion |
| Determinism | repeated run same input | required where computable |
| Analytical/numerical/trusted oracle | LLM judgment is not oracle | required where computable |
| Runtime | actual tool/process output | required for solver/runtime claims |
| Regression | existing suite remains green | baseline check/build PASS |
| Human gate | professional or legal boundary | required where marked |
