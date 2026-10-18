# ARKI-BKH4-TX-003B — Failure Injection Report

## Executed failure points

| Failure | Injection point | Result |
| --- | --- | --- |
| AP-FAIL-01 | Before opening transaction | No durable participant records |
| AP-FAIL-02 | After opening transaction | No durable participant records |
| AP-FAIL-03 | After first write request | No durable participant records |
| AP-FAIL-04 | After canonical revision write | No durable participant records |
| AP-FAIL-05 | After transaction record write | No durable participant records |
| AP-FAIL-06 | After commit metadata write | No durable participant records |
| AP-FAIL-07 | During audit write | No durable participant records |
| AP-FAIL-08 | Before transaction completion | No durable participant records |

Result: `8/8` controlled failures rejected and aborted without partial durable state in `fake-indexeddb`.

## Test-the-test controls

The test reads all participant stores after the failure, not only the revision store. Each failure uses a separate database name, and the persistence method opens and closes a connection per operation. The failure is injected inside the actual IndexedDB transaction path, after the selected write boundary where applicable.

This proves the emulated transaction path rather than an in-memory object. It does not prove behavior after process termination in a real browser, which belongs to TX-003D and remains unimplemented.
