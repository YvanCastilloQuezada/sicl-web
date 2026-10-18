# ARKI-BKH4-TX-003B — Invariant Report

| Invariant | Result | Evidence / limitation |
| --- | --- | --- |
| AP-INV-01 One IndexedDB transaction per commit | VERIFIED EMULATED | One multi-store readwrite transaction is used. |
| AP-INV-02 All required records commit together | VERIFIED EMULATED | Revision, transaction, metadata, and audit counts align. |
| AP-INV-03 Failed commit leaves zero partial state | VERIFIED EMULATED | 8/8 failure injections left zero participant records. |
| AP-INV-04 Revision survives reopen | VERIFIED EMULATED | Close/reopen read path recovered revision. |
| AP-INV-05 Fingerprint revalidates | VERIFIED EMULATED | `sha256:v1` recomputation detects tampered payload. |
| AP-INV-06 Historical overwrite defense | VERIFIED EMULATED | Duplicate primary key fails; original record remains. |
| AP-INV-07 Project isolation | VERIFIED EMULATED | A/B records retain project identity and are read separately. |
| AP-INV-08 Legacy data survives upgrade | VERIFIED EMULATED | v3 fixture records survived v4 upgrade. |
| AP-INV-09 UI state cannot create durability | PARTIAL | No UI migration was performed; no durable commit is exposed through ProjectContext. |
| AP-INV-10 TX-003A invariants preserved | VERIFIED | TX-003A adversarial suite remained green. |
| AP-INV-11 No CAS/idempotency false claim | VERIFIED | Both remain explicitly `NOT_IMPLEMENTED`. |
| AP-INV-12 No crash-recovery false claim | VERIFIED | Restart/reopen is not labeled crash recovery. |

Real browser IndexedDB was not available in this session, so all persistence-specific VERIFIED labels are qualified as emulated evidence.
