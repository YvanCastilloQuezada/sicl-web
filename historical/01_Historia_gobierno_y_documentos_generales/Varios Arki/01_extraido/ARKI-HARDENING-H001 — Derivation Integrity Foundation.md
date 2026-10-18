# ARKI-HARDENING-H001 — Derivation Integrity Foundation

## A. Baseline

- **Repository:** `YvanCastilloQuezada/sicl-core`
- **Local path:** `/home/ubuntu/projects/arki-sicl-core`
- **Branch:** `main`
- **Starting HEAD:** `1ef0db8420f268a43ae3c92d86a4443a5514359c`
- **Worktree before work:** clean
- **Scope:** H-001 only; no frontend, deployment, push, merge, ARKI repository rewrite, or provider call.

## B. Existing mechanisms reused

- Existing append-only SQLite `events` table and `SQLiteRepository.add_event/events`.
- Existing `Event` domain record and `now_iso()` timestamp helper.
- Existing project versioning, Simulation, GeneratedAlternative, SpatialRepresentation/input fingerprints, BIM, Human Authority, and existing domain contracts were left intact.

## C. Files changed

- `src/sicl/derivation.py` — new minimal contract and compatibility adapter over the existing Event Store.
- `tests/test_derivation.py` — focused tests for deterministic serialization, validation, semantic domains, WHY traversal, cycles, missing references, mismatch detection, project scoping, and non-mutation.
- `H001_DERIVATION_INTEGRITY_REPORT.md` — this evidence report.

No existing core module, public API route, migration, frontend file, Event Store schema, Project Brain implementation, BIM implementation, or provider integration was rewritten.

## D. Contracts implemented

### `VersionedRef`

Fields:

- `entity_type`
- `entity_id`
- positive integer `version`

JSON serialization uses `entityType`, `entityId`, and `version`. It is deterministic, round-trippable, and rejects empty identifiers, booleans, strings, zero, and negative versions.

### `TypedRelation`

Fields:

- `from_ref`
- `to_ref`
- `relation_type`
- `relation_domain`

Initial relation types are deliberately limited to `DERIVED_FROM`, `COMPUTED_FROM`, and `SUPPORTS`. Initial domains are limited to the existing justified vocabulary: `ARCHITECTURAL`, `COMPUTATIONAL`, `EPISTEMIC`, `NORMATIVE`, and `GOVERNANCE`.

Validation preserves semantic separation:

- `COMPUTED_FROM` requires `COMPUTATIONAL`.
- `SUPPORTS` requires `EPISTEMIC`.
- self-relations and unsupported types/domains are rejected.

### `DerivationRecord`

Fields:

- `id`
- `output: VersionedRef`
- `inputs: tuple[VersionedRef, ...]`
- `method`
- `method_version`
- explicit `relations`
- optional `fingerprint`
- optional `project_context_version`
- optional `assumptions`

Every input must be connected to the output by an explicit typed relation. Canonical JSON and a stable SHA-256 fingerprint are provided.

### `DerivationLedger`

A compatibility adapter over the existing Event Store:

- `record(project_id, record, actor=...)` appends `DERIVATION_RECORDED` only.
- `list(project_id)` reconstructs records from events.
- `why(project_id, output)` traverses recorded derivations with cycle protection.
- `explain(project_id, output)` returns the deterministic record chain and leaf references with no registered derivation.
- `version_mismatches(project_id, current_versions)` performs an explicit comparison only; it does not invalidate or mutate anything.

## E. Compatibility adapters

- Existing string references remain untouched in all legacy modules.
- Existing `SpatialRepresentation.input_fingerprint` remains untouched.
- Existing `Simulation.inputs`, `GeneratedAlternative.inputs`, BIM change sets, and Project Brain-related mechanisms are not migrated in H-001.
- `DerivationLedger` is the bridge for future integrations without a schema rewrite.

## F. Tests and verification

### Commands executed

```bash
PYTHONPATH=src python3 -m py_compile src/sicl/derivation.py
PYTHONPATH=src python3 -m compileall -q src api tests
```

Results:

- `SMOKE_H001=PASS`
- `SQLITE_EVENT_STORE_H001=PASS`
- `COMPILEALL=PASS`

The SQLite smoke test used the real `SQLiteRepository`, recorded the chain `G1@3 → A1@1 → Q1@2 → C1@4`, reconstructed `WHY C1?`, detected `G1@3` versus current `G1@4`, and confirmed only append-only events were added.

The repository's documented command is `python -m pytest -ra`. It was attempted for the new test file but is **BLOCKED** in this sandbox because `pytest` is not installed (`No module named pytest`). No dependency was installed silently.

## G. Demonstration

### `WHY C1?`

The real SQLite adapter returned the deterministic record order:

```text
D-C → D-Q → D-A
Cost C1@4 ← Quantity Q1@2 ← RoomArea A1@1 ← Geometry G1@3
```

`Geometry G1@3` is reported as a leaf with no registered derivation, not as an automatically inferred fact.

### `WHY H1?`

The focused test constructs and traverses:

```text
Source S1@1 → Evidence E1@2 → Claim C1@1 → Hypothesis H1@3
```

All links are `EPISTEMIC`; `SUPPORTS` cannot be registered as `COMPUTATIONAL` or `ARCHITECTURAL`.

### Version mismatch

An explicit comparison with current `Geometry:G1 = 4` reports:

```text
VERSION_MISMATCH: derivation D-A consumes Geometry G1@3 while current version is 4
```

No record is revoked, rewritten, recomputed, or propagated.

## H. Explicit non-capabilities

H-001 does **not** demonstrate or implement:

- transitive impact propagation;
- automatic invalidation;
- automatic recomputation;
- architectural causal reasoning;
- wall-move E2E;
- professional BIM propagation;
- generalized learning;
- geometry mutation;
- autonomous decision-making or Human Authority bypass;
- frontend behavior or deployment.

## I. Risks / technical debt

- The adapter stores derivations inside the existing event payload rather than a dedicated normalized table; this is intentional to avoid a migration in H-001 and is a future query/indexing consideration.
- Existing legacy entity contracts do not yet expose `VersionedRef[]`; future phases need explicit adapters per module.
- `missing_inputs` identifies leaf references without a recorded derivation, not invalid data. A base artifact can therefore be a legitimate leaf.
- Full pytest execution remains unverified until the repository's declared test dependency is provisioned by an authorized environment.

## J. Git state

- **Ending HEAD:** unchanged at `1ef0db8420f268a43ae3c92d86a4443a5514359c` (no commit created).
- **Push/merge/deploy:** none.
- **Expected changed files:** `src/sicl/derivation.py`, `tests/test_derivation.py`, this report.
- **Remote branches:** untouched.

## Status

**H-001 implementation:** complete within the authorized bounded scope.

**Verification status:** local smoke/integration/compile checks PASS; pytest suite BLOCKED by absent dependency.

**STOP:** no H-002/H-003/H-004/H-005/H-006 work performed.
