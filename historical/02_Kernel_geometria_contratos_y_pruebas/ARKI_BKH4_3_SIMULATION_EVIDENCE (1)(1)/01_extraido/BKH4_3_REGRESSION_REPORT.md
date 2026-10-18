# BKH4-3 Regression Report

**Order:** 96  
**Result:** all executed commands exited with code 0  
**Maximum status:** `IMPLEMENTED / PENDING INDEPENDENT VERIFICATION`

| Command | Result |
|---|---|
| `pnpm check` | PASS |
| `pnpm build` | PASS; chunk-size warning retained as non-blocking |
| BKH-1 relationship fabric | PASS; 130 migrated relationships, registry 14 |
| BKH-2 constraint engine | PASS; 28 required cases |
| BKH-3 regeneration engine | PASS; blocked state preserved |
| BKH-3 corrective / 92A | PASS; freshness, conditional propagation, aggregation and no canonical mutation |
| BKH-3 idempotence / 93C | PASS; semantic and output hashes equal |
| BKH4 foundation / 95A | PASS; canonical mutation not implemented |
| BKH4-3 simulation | PASS; isolation, determinism, stale, violation, unknown, blocked, failed and malformed cases |

Raw evidence is preserved in `BKH4_3_REGRESSION_OUTPUTS.txt`.

The pnpm warning about ignored legacy package settings is recorded as an existing tooling debt and is not reclassified as a BKH4-3 product failure.
