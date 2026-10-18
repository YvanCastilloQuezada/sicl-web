# ARKI-BKH4-TX-003B — Atomicity Report

## Atomic unit

The implemented unit is one IndexedDB `readwrite` transaction spanning:

- `canonicalRevisions`;
- `transactions`;
- `commitMetadata`;
- `audit`;
- structural `idempotency` store participation in the database schema.

The successful path writes canonical revision, transaction result, commit metadata, and audit/provenance before awaiting transaction completion. It does not call independent `saveRevision()`, `saveTransaction()`, or `saveAudit()` functions.

## Golden invariant in available environment

For the emulated IndexedDB suite, every controlled failure produced zero records in all required participant stores after the attempted transaction. The successful path produced one coherent record in each required store, with matching project, transaction, revision, provenance, and SHA-256 fingerprint references.

## Result classification

`ONE MULTI-STORE TRANSACTION = VERIFIED IN EMULATED ENVIRONMENT`

`ALL-OR-NOTHING = VERIFIED IN EMULATED ENVIRONMENT`

`REAL BROWSER DURABILITY = NOT_TESTED`

The global atomic-persistence claim remains `PARTIAL`, because the configured session did not provide a real browser/headless IndexedDB runtime.
