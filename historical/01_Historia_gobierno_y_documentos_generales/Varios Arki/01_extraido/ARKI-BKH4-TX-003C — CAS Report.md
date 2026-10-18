# ARKI-BKH4-TX-003C — CAS Report

| Property | Result |
| --- | --- |
| CAS check inside durable transaction | VERIFIED |
| TOCTOU read/check/write split | NOT USED |
| Genesis semantics | Explicit `expectedRevisionId: null` |
| Stale expected revision | `STALE_BASE` |
| Wrong project expected revision | Rejected as `STALE_BASE` |
| Two writers from R0 | One winner, one `STALE_BASE` |
| Unique durable current after reopen | VERIFIED |
| Same revision ID across different projects | Allowed through scoped durable key |
| Missing current with existing revisions | `CORRUPTED_CURRENT` |
| Silent overwrite / last-write-wins | PROHIBITED |

The browser race used two concurrent writers against the same native IndexedDB database. Exactly one commit won and exactly one writer was rejected. The current pointer was read after a fresh connection and resolved to the winner.
