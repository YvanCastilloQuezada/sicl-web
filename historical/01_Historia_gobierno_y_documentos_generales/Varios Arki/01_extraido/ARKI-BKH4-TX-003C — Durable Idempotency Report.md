# ARKI-BKH4-TX-003C — Durable Idempotency Report

| Case | Result |
| --- | --- |
| Same transaction + same request | `REPLAYED` |
| Same transaction + different payload | `IDEMPOTENCY_CONFLICT` |
| Same transaction + different project | `IDEMPOTENCY_CONFLICT` |
| Same transaction + different actor | `IDEMPOTENCY_CONFLICT` |
| Same transaction + different expected revision | `IDEMPOTENCY_CONFLICT` |
| Retry after connection reopen | `REPLAYED` |
| Concurrent retry ×20 in native browser | 1 committed, 19 replayed |
| Concurrent retry ×100 emulated | 1 committed, 99 replayed |
| Duplicate canonical effect | Not observed |
| Duplicate audit | Not observed |
| Duplicate idempotency record | Not observed |

The fingerprint is canonicalized before SHA-256, so property ordering is not the identity mechanism. The transaction ID is not silently reusable for a different intent.
