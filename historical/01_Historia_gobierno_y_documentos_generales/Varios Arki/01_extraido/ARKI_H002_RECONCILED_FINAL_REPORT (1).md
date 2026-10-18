# ARKI --- H-002 Reconciled Closure + H-003 Pre-Implementation Gate

## Executive status

-   **H-002:** `CLOSED_ACCEPTED_WITH_GAPS`
-   **Current reproducible runtime snapshot:** `340 passed / 0 failed`
-   **Historical acceptance count requested by DeepSeek:** `327` ---
    retained as a historical ledger value only, not relabeled as the
    current runtime count.
-   Prior conversation counts `332`, `336`, `337` are recorded as prior
    snapshots/claims. The exact per-test deltas cannot be reconstructed
    from the currently available artifacts and are therefore
    **UNKNOWN**, not invented.
-   **Package has no Git commit.** This workspace was reconstructed from
    `sicl-core-main.zip` plus hardened H-001 artifacts; no `.git`
    directory is present.
-   H-003 contract and TDD exist, but implementation is **BLOCKED
    pending DeepSeek pre-implementation Red Team**.

## Reconciliation of Qwen discrepancies

### D1 --- 327 / 332 / 336 / 337

Qwen was correct that these numbers cannot be treated as one verified
fact.

Resolution: - 327 is retained as the **historical acceptance ledger
count requested by DeepSeek**. - 340 is the **current reproduced runtime
count** for this exact reconciled snapshot, excluding: -
`tests/test_ifc_adapter.py` - `tests/test_ifc_import_http.py` -
`tests/test_validity_h003.py` (intentionally RED pre-implementation) -
The exact identity of tests responsible for old deltas is not supported
by the currently available old snapshots. Status:
`UNKNOWN_HISTORICAL_DELTA`.

### D2 --- RT-A

Qwen was correct about the uploaded earlier code: it rejected multiple
derivations for one `output@version` and `why()` collapsed outputs.

RT-A is now actually implemented and tested: - multiple independent
`DerivationRecord`s may share one output; - record IDs remain unique and
conflicting reuse of an ID fails closed; - `why()` traverses all
independent derivations deterministically; - H-002 impact analysis
preserves impact from either independent derivation.

### D3 --- RT-D / F-1 identity gap

Qwen was correct that the earlier code did not expose
`IDENTITY_UNCERTAIN` or `IDENTITY_UNVERIFIABLE`.

F-1 is now implemented and tested: - both hashes absent →
`IDENTITY_UNVERIFIABLE` - exactly one hash absent →
`IDENTITY_UNCERTAIN` - same version, different hashes →
`CONTENT_HASH_MISMATCH` - version differs → `VERSION_MISMATCH` - exact
version+hash match → no integrity issue

No validity state is inferred by H-001/H-002 from these observations.

### D4 --- roles

Resolved by explicit Human Authority instruction in the conversation:
Yvan authorized ChatGPT to take primary implementation/testing
responsibility and advance automatically except when his participation
is indispensable. Qwen remains second opinion; DeepSeek remains Red
Team.

## H-002 contract implemented

H-002 is read-only transitive impact analysis.

It answers: - what exact artifacts consume a changed exact
`VersionedRef`; - transitive downstream impact; - minimum depth; - every
retained derivation path up to an explicit bounded path limit; - cycle
evidence in canonical form; - project isolation.

It does NOT: - mark STALE; - invalidate; - recompute; - mutate; - write
BIM; - execute a reaction.

`IMPACT DETECTED != CHANGE EXECUTED`.

## H-002 iterative hardening

The impact work was attacked repeatedly, including: 1. exact-version
traversal; 2. branching and joins; 3. multiple causal paths; 4. RT-A
multiple derivations for one output; 5. identity-gap interactions; 6.
cycles and canonical cycle representation; 7. path explosion
fail-closed; 8. deterministic report serialization; 9. repeated
read-only analysis; 10. full Core regression.

Current runtime: **340 passed / 0 failed**.

## Remaining H-002 gaps

### G1 --- concurrency / TOCTOU

H-001 Event Store write uniqueness remains non-atomic across concurrent
writers. RT-A reduces the need for output uniqueness but record-ID
collision is still check-before-write. Deferred to
persistence/transaction design.

### G2 --- scaling

Ledger reconstruction and impact traversal are in-memory/read-model
style and will require indexing/materialized graph support at scale.

### G3 --- semantic ontology

Typed relation vocabulary is intentionally bounded. H-002 proves graph
traversal, not full architectural causal understanding.

### G4 --- path explosion

H-002 fails closed when `max_paths_per_artifact` is exceeded. This
prevents silent truncation but does not solve combinatorial explosion.

### G5 --- IFC environment

Two IFC test modules remain environment-blocked because `ifcopenshell`
is not provisioned. No silent install was performed.

## H-003 gate

H-003 is **not implemented**.

Created: - `H003_PREIMPLEMENTATION_CONTRACT.md` -
`tests/test_validity_h003.py`

The TDD suite is intentionally RED:
`ModuleNotFoundError: No module named 'sicl.validity'`.

This is expected and proves implementation has not preceded external
review.

## Required next action

Send the included H-003 pre-implementation bundle to DeepSeek. DeepSeek
must attack the contract and TDD before any `sicl.validity`
implementation begins.

The primary unresolved design question is aggregation across multiple
derivations: - one justification fails while another remains valid; -
computational vs epistemic vs architectural derivations may require
different aggregation semantics; - H-003 must not collapse these into a
universal ANY/ALL rule without explicit policy.

## Evidence labels

-   H-002 code: IMPLEMENTED
-   H-002 tests: RUNTIME_EVIDENCE
-   H-002 current suite: 340 PASS / 0 FAIL
-   H-002 status: CLOSED_ACCEPTED_WITH_GAPS
-   H-003 contract: DOCUMENTED / PRE-IMPLEMENTATION
-   H-003 TDD: RED AS EXPECTED
-   H-003 implementation: ABSENT
-   Git commit: ABSENT --- package without commit
