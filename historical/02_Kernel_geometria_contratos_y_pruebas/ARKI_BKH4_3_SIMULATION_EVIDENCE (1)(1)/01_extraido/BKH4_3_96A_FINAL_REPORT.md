# ORDEN 96A — BKH4-3 Adversarial Closure

## Verdict

```text
FIX-BKH43-01: CLOSED
FIX-BKH43-02: CLOSED
BKH4-3: HARDENED / PENDING INDEPENDENT VERIFICATION
```

## FIX-BKH43-01 — Canonical Isolation Proof

The test now captures an independent deep snapshot and fingerprint before simulation, executes the simulation, captures a second independent snapshot and fingerprint, and compares semantic state, project version, relationships and derived state. The test also mutates a nested proposed payload after simulation to probe reference aliasing. The canonical object remains unchanged.

Result: `PASS`.

## FIX-BKH43-02 — Execution Status Precedence

The global status precedence is explicitly implemented as:

```text
INVALID > FAILED > BLOCKED > UNKNOWN > COMPLETED
```

BKH-3 failure and blocked outputs can carry UNKNOWN diagnostics without being downgraded to UNKNOWN. Both the global status and the UNKNOWN diagnostics remain observable.

Results:

```text
STATUS_PRECEDENCE_FAILED_OVER_UNKNOWN: PASS
STATUS_PRECEDENCE_BLOCKED_OVER_UNKNOWN: PASS
```

## Scope guard

No BKH-1, BKH-2 or BKH-3 source was modified. No commit, atomic persistence, rollback, undo, redo, crash recovery, HumanDecision authority, ownership consolidation, legacy migration, BKH5/6/7 or E8 was implemented.

## Required regression

`pnpm check`, `pnpm build`, BKH-1, BKH-2, BKH-3, 92A, 93C, BKH4 foundation/95A and BKH4-3 all exited with code 0.

STOP. Independent verification remains required.
