# ARKI-BKH4-TX-003B.R — Invariant Report

| Invariant | Result |
| --- | --- |
| Native browser IndexedDB | VERIFIED |
| fake-indexeddb absent from real-browser bundle | VERIFIED |
| Productive persistence implementation tested | VERIFIED |
| One real multi-store transaction | VERIFIED |
| Real-browser all-or-nothing | VERIFIED |
| Failure injection | VERIFIED — 8/8 |
| Zero partial state after fresh connection | VERIFIED |
| Durable read after connection reopen | VERIFIED |
| Browser restart durability | NOT_DEMONSTRATED |
| SHA-256 after reopen | VERIFIED |
| Corruption detection | VERIFIED |
| Historical overwrite defense | VERIFIED |
| v3→v4 migration | VERIFIED |
| Legacy data preservation | VERIFIED |
| Two-connection contention | VERIFIED |
| TX-003A regression | PASS |
| TX-003B emulated regression | PASS |
| CAS | NOT_IMPLEMENTED |
| Durable idempotency | NOT_IMPLEMENTED |
| Crash recovery | NOT_IMPLEMENTED |
| Global canonical owner | NOT_VERIFIED |
| BKH4-4 ready | NO |

The real-browser evidence upgrades only the approved TX-003B atomic persistence boundary. It does not upgrade CAS, durable idempotency, crash recovery, writer migration, or global canonical ownership.
