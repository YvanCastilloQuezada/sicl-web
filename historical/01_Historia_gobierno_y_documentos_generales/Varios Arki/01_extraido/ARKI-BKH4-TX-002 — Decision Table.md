# ARKI-BKH4-TX-002 — Decision Table

| Decision | Selected | Alternatives rejected | Evidence | Risk |
| --- | --- | --- | --- | --- |
| Canonical owner | `CanonicalProjectRepository` | ProjectContext, generator, snapshot function, simulation state | Current writers are split; no canonical owner demonstrated | Writer migration remains necessary |
| Persistence boundary | One IndexedDB readwrite transaction across required stores | Separate per-record writes, cloud DB, distributed transaction | Current adapter opens one transaction per store; IndexedDB supports multi-store transaction | Existing adapter must be refactored |
| Atomic unit | Canonical revision + transaction result + idempotency + commit metadata + audit | Partial writes, UI acknowledgment, read-model update | TX-002 audit of current stores and adapter | Recovery depends on keeping all records in one transaction |
| Revision strategy | Immutable canonical revision chain with parent revision | In-place mutable project object | Existing version/snapshot contracts and transaction identity separation | Payload contract must be reconciled |
| CAS strategy | Compare expected revision and current revision inside write transaction | Last-write-wins, automatic silent rebase | Transaction records already carry expected/base revision concepts | Requires one canonical revision record |
| Idempotency | Durable `transactionId` record in the same atomic unit | UI cache, memory set, duplicate detection after the fact | No current idempotency store found | New store and migration required |
| Recovery semantics | Read canonical revision, transaction result, idempotency and commit metadata after restart | UI memory, timestamps, heuristics | Current adapter has no recovery protocol | Failure injection must prove all cases |
| Event history strategy | Hybrid transaction log plus canonical revisions/snapshots | Full event sourcing now | Existing transaction/revision/snapshot contracts; no event store found | Replay granularity must be specified later |
| Read-model strategy | Canonical repository first, projections after commit | ProjectContext as authority | Current ProjectContext is in-memory state | Projection rebuild path required |

## Human decisions still required

The design is internally consistent. The next human authorization required is whether to open `TX-003A — Canonical Repository` implementation. This document does not open that implementation automatically.
