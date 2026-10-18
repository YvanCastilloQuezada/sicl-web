# ARKI-BKH4-TX-003A — Invariant Report

| Invariant | Result | Evidence / limit |
| --- | --- | --- |
| CR-INV-01 One canonical owner | NOT_VERIFIED | Repository owner exists, but legacy writers remain unmigrated. |
| CR-INV-02 Revision identity stable | VERIFIED | IDs are assigned once; duplicate and collision cases reject. |
| CR-INV-03 Project isolation | VERIFIED | Cross-project revision and lookup attempts reject. |
| CR-INV-04 Revision history immutable | VERIFIED FOR ISOLATED REPOSITORY | Deep-cloned payloads, internal deep freeze, and aliasing tests protect stored history. |
| CR-INV-05 Parent lineage valid | VERIFIED | Missing parent, self-parent, cycles, and incorrect parents reject. |
| CR-INV-06 No silent forks | VERIFIED | Competing children and ambiguous current state reject. |
| CR-INV-07 Current revision unambiguous | VERIFIED | Explicit current pointer; no timestamp/array heuristic. |
| CR-INV-08 Fingerprint deterministic | VERIFIED | Stable sorted-key serialization and repeated fingerprint tests. |
| CR-INV-09 Corruption detectable | VERIFIED | Payload, fingerprint, parent, project, malformed, and property tampering detected. |
| CR-INV-10 Provenance preserved | VERIFIED | Required provenance is validated and retained. |
| CR-INV-11 UNKNOWN not promoted | VERIFIED | Unsupported/unknown revision statuses reject. |
| CR-INV-12 Self-certification rejected | VERIFIED | Supplied `VERIFIED` status is not accepted as evidence. |
| CR-INV-13 ProjectContext not promoted | VERIFIED | No ProjectContext migration; repository is isolated. |
| CR-INV-14 No atomic-persistence false claim | VERIFIED | Reports and output explicitly retain atomic commit as not implemented/not verified. |

## Global verdict

Because CR-INV-01 is not proven for the whole application and persistence remains outside scope, TX-003A is **PARTIAL globally**, while the isolated repository contract and adversarial behavior are **VERIFIED FOR APPROVED SCOPE**.
