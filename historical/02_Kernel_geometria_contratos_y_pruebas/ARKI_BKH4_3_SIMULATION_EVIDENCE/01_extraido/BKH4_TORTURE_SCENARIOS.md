# BKH-4 Transaction Torture Scenarios v1.1

## 1. Stale concurrent transaction torture

Create T1 and T2 from project version V10. T1 and T2 target the same semantic wall and carry the same expected revision. Simulate both without canonical mutation. Commit T1 to V11. Attempt to commit T2.

Expected result: T1 may become `COMMITTED` only if every declared gate passes. T2 becomes `STALE` or `CONFLICT`; it cannot overwrite V11, retry silently, merge silently or become `COMMITTED` against V10. The journal must retain both transaction identities and the reason for T2's result.

Required evidence: base-version capture, entity revision comparison, transaction state trace, no-overwrite assertion and journal entries.

## 2. Partial commit / crash torture

Create a mutation set with at least two canonical changes and one derived consequence. Enter `COMMITTING`, persist the first internal step, then interrupt the process before completion.

Expected result: the system must return `NOT_COMMITTED`, `RECOVERY_REQUIRED` or `UNKNOWN_COMMIT_STATE` according to the durable evidence. It must never report `COMMITTED` while only part of the canonical mutation set exists. Derived state must receive an explicit disposition and cannot conceal a partial canonical commit.

Required evidence: durable journal, before/after canonical state, recovery decision, atomic-boundary declaration and failure diagnostics.

## 3. Dependent undo torture

Commit T1 that moves a wall. Commit T2 that changes a dependent relationship or quantity. Request undo of T1 after T2 exists.

Expected result: undo cannot load an old snapshot and erase T2. The system must create a governed reversal transaction, reject it, or require human decision after dependency analysis. Redo must revalidate against the current world. History, provenance and both original transactions remain preserved.

Required evidence: transaction chain, dependency graph, revalidation result, history preservation and canonical-state comparison.

These scenarios remain design gates. They are not current implementation evidence.
