# ARKI-BKH4-TX-003D — Crash/Restart Recovery Evidence Report

## Verdict

`TX-003D = VERIFIED FOR BOUNDED CRASH/RESTART RECOVERY SCOPE`

The verified scope is deterministic, fail-closed recovery of the canonical persistence boundary after application page reload, browser restart, and real process termination with `SIGKILL` over a persistent Chromium profile. The implementation does not silently repair incomplete or contradictory durable state.

## Implemented boundary

`CanonicalDurablePersistence.recoverTransaction(transactionId, projectId)` reads the canonical revision, current pointer, transaction record, commit metadata, audit record and idempotency record in one read-only IndexedDB transaction. It returns one of `COMMITTED`, `NOT_COMMITTED`, `CORRUPTED` or `UNKNOWN_RECOVERY_REQUIRED`.

A transaction is `COMMITTED` only when all six durable records exist, the current pointer resolves to the requested project and revision, project and revision identities agree, the state fingerprint matches the state payload, and transaction, metadata, audit and idempotency records are coherent. No record produces `NOT_COMMITTED`. Partial or contradictory evidence produces `CORRUPTED`; recovery never fabricates missing history.

Crash hooks are test-only observability points. They do not provide a production bypass, callback mutation API, commit override or automatic repair path.

## Real process campaign

The campaign executed **20 real cycles** with a persistent Chromium profile per case. Each cycle navigated to the production persistence code, reached a named crash boundary through CDP console evidence, terminated the browser process with `SIGKILL`, launched a fresh browser process over the same profile, and invoked recovery.

| Property | Result |
| --- | --- |
| Real process termination | PASS |
| Fresh process recovery | PASS |
| Persistent profile | PASS |
| Cycles | 20 |
| Passed | 20 |
| Failed | 0 |
| `COMMITTED` recovered | 3 |
| `NOT_COMMITTED` recovered | 17 |
| `CORRUPTED` recovered | 0 |
| `UNKNOWN_RECOVERY_REQUIRED` recovered | 0 |

The boundary between the final writes and browser transaction completion is intentionally treated as an observation window: depending on when the operating system terminates the process, recovery correctly reports either the durable commit or no durable commit. Neither outcome is guessed.

## Page and browser restart

A separate browser test committed a transaction, performed a page-level reload/recovery in the same browser, then terminated the browser and recovered the same transaction in a fresh browser process using the same persistent profile. Both recoveries returned `COMMITTED` with all six evidence records present and coherent.

## Inverse and corruption attacks

Nine independent attacks were executed against durable evidence: missing revision, missing current pointer, missing idempotency, missing audit, corrupted payload, forged fingerprint, pointer to a missing revision, wrong project identity and deceptive timestamp/metadata. All were rejected as `CORRUPTED`. A clean commit returned `COMMITTED`; an empty transaction returned `NOT_COMMITTED`.

The independent oracle executed **20 deterministic seeds and 140 event cases** covering commit, retry, conflict, stale writer, crash, restart and replay. It confirmed that recovery status is derived from durable evidence rather than timestamps, process history or optimistic inference.

## Regression gate

The final raw runner completed with exit code zero for `pnpm check`, `pnpm build`, BKH-1, BKH-2, BKH-3, BKH-3 corrective, BKH4 foundation, BKH4-3, persistence tests, TX-003A, TX-003B, TX-003B.R, TX-003C, TX-003C real browser, TX-003D inverse attacks and TX-003D page/browser restart.

## Scope limits

This closure does not implement power-loss or filesystem-fsync proof, distributed recovery, writer migration, undo/redo, rollback, commit authorization, HumanDecision authority, ownership consolidation, BKH-5/6/7 or E8. `powerLoss = NOT_TESTED` remains explicit. BKH4-4 and later remain blocked unless separately authorized.

No E5, E6 or E7 phase was reopened. No existing Kernel phase was reinterpreted as complete beyond its own bounded evidence.
