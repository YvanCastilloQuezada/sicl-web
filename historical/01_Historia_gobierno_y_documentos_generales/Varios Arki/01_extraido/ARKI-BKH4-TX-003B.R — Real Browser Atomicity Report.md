# ARKI-BKH4-TX-003B.R — Real Browser Atomicity Report

The browser test used the same production `CanonicalDurablePersistence` boundary as TX-003B. It opened one `readwrite` transaction spanning `canonicalRevisions`, `transactions`, `commitMetadata`, `audit`, and the structural `idempotency` store.

The successful commit was closed and read through a new connection. All four required records were present and cross-referenced the same project, transaction, revision, provenance, and fingerprint.

Failure injection was repeated at all eight mandated points:

| Point | Result after close and fresh reopen |
| --- | --- |
| AP-FAIL-01 before transaction | Zero partial records |
| AP-FAIL-02 after transaction open | Zero partial records |
| AP-FAIL-03 after first write | Zero partial records |
| AP-FAIL-04 after revision write | Zero partial records |
| AP-FAIL-05 after transaction record | Zero partial records |
| AP-FAIL-06 after metadata write | Zero partial records |
| AP-FAIL-07 during audit | Zero partial records |
| AP-FAIL-08 before completion | Zero partial records |

Result: `8/8`, with `ZERO PARTIAL RECORDS` on native browser IndexedDB.
