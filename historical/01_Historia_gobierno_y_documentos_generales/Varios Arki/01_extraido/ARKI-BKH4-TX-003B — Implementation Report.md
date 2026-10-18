# ARKI-BKH4-TX-003B — Implementation Report

## Scope

TX-003B adds a durable canonical revision persistence boundary over the existing IndexedDB architecture. It creates the minimum versioned stores required by the design lock: `canonicalRevisions`, `transactions`, `commitMetadata`, `audit`, and structural `idempotency`, while preserving all pre-existing stores.

A canonical commit writes revision, transaction record, commit metadata, and audit/provenance inside one IndexedDB `readwrite` transaction. A failure aborts the transaction rather than opening one transaction per record.

## Existing adapter audit

The existing database is `arki-local-first`, originally schema version 3. Its adapter opened separate transactions for individual records. Schema version 4 now adds stores idempotently without deleting existing object stores. The previous `saveArkiVersion → ARKI_PROJECT_STORE` route was classified as a **legacy compatibility defect / bug**: `ArkiVersion` has its own contract and now writes to `ARKI_VERSION_STORE`. This decision is recorded rather than silently hidden.

## Fingerprint hardening

TX-003A's in-memory fingerprint remains unchanged for regression compatibility. Durable TX-003B records use `sha256:v1` over the existing deterministic sorted-key canonical serialization. This is a cryptographic digest available through Web Crypto; the implementation does not claim collision resistance beyond SHA-256's standard properties or replace historical fingerprints silently.

## Evidence boundary

The repository has no Playwright/Puppeteer/browser runner configured. The executable suite uses `fake-indexeddb`, which exercises the IndexedDB API and real transaction semantics in an emulated environment. Therefore this order's result is **PARTIAL / EMULATED_EVIDENCE**, not real-browser verification.

No CAS, durable idempotency proof, crash recovery, rollback, undo/redo, ProjectContext migration, or writer migration was implemented.
