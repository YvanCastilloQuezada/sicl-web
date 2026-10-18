# ARKI-BKH4-TX-001 — Initial Invariant Test Report

This is an audit baseline, not a closure report. Existing tests prove contract-level properties only. They do not prove canonical mutation or durable transaction behavior.

| Invariant | Current evidence | Status |
| --- | --- | --- |
| INV-01 No partial canonical state | No canonical commit path exists. | NOT_DEMONSTRATED |
| INV-02 One committed transaction produces one revision transition | No commit implementation exists. | NOT_DEMONSTRATED |
| INV-03 Duplicate transaction cannot duplicate effects | Transaction identity exists; no durable idempotency store exists. | NOT_DEMONSTRATED |
| INV-04 Stale transaction cannot overwrite current state | Expected revisions exist in records; no canonical compare-and-swap writer exists. | PARTIAL / NOT_DEMONSTRATED |
| INV-05 Failed transaction leaves canonical state unchanged | Simulation preserves canonical state; commit path absent. | PARTIAL / NOT_DEMONSTRATED |
| INV-06 Every canonical mutation has provenance | Provenance exists in contracts; canonical mutation path absent. | CONTRACT_ONLY |
| INV-07 Undo preserves history | No undo implementation. | NOT_FOUND |
| INV-08 Redo revalidates preconditions | No redo implementation. | NOT_FOUND |
| INV-09 Crash recovery determines outcome deterministically | No recovery journal or restart test. | NOT_FOUND |
| INV-10 Replay does not invent canonical mutations | No event store/replay implementation. | NOT_FOUND |

The existing BKH4 foundation suite remains evidence for schema and state-machine constraints only. It must not be relabeled as evidence of transaction execution.
