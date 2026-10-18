# ARKI-SEM-001 — Semantic Curator Foundation Integration

## Mission

Integrate the attached `arki-semantic-curator-v0.1` starter into the actual ARKI repository **without creating a second canonical Project State, second BIM model, or bypass around BKH4**.

## Baseline truths to preserve

- `CanonicalProjectRepository` is the bounded canonical revision authority.
- Global writer migration is not complete; do not worsen writer fragmentation.
- `ProjectContext` is a UI/working projection, not canonical authority.
- CAD/ACIR preserves source evidence and has `semanticPromotion: PROHIBITED`.
- Existing canonical building representation and stable ARKI identity must be reused where compatible.
- No canonical mutation outside the transaction boundary.
- Human Authority remains final authority.

## Phase 1 — Audit before integration

Inspect actual repository and report exact paths/types for:

- `CanonicalProjectRepository`
- transaction engine
- canonical revision payload
- `CanonicalBuildingModel`
- `arkiBuildingAuthoring.ts`
- `ProjectContext`
- `constructionModel`
- `SceneModel`
- CAD/ACIR types and `semanticPromotion`
- IFC importer/exporter/mappings
- existing stable IDs / `arkiId`
- quantities/properties/relationships
- provenance and epistemic types

Do not guess names that differ from the repository.

## Phase 2 — Reconciliation

Compare starter contracts with existing contracts.

For every starter type classify:

- REUSE_EXISTING
- EXTEND_EXISTING
- ADAPT
- REJECT_DUPLICATE
- NEW_REQUIRED

Prefer reuse. Do not create peer-level duplicate models.

Produce:

`ARKI_SEMANTIC_RECONCILIATION.md`

## Phase 3 — Semantic Registry

Implement the minimum compatible registry.

Required invariants:

1. one ARKI semantic concept has one stable canonical semantic ID;
2. aliases do not create new concepts;
3. external IDs do not become ARKI canonical identity;
4. exact external mapping collision fails closed;
5. mappings are version-aware;
6. provenance is mandatory for canonical semantic definitions/mappings;
7. scale applicability is explicit;
8. UNKNOWN cannot be silently promoted to canonical fact;
9. deprecated concepts retain lineage;
10. no semantic change directly mutates canonical Project State.

## Phase 4 — Semantic Curator

Implement curator as a governed service, **not another autonomous agent**.

Responsibilities:

- resolve existing concepts;
- detect duplicates/synonyms;
- detect alias collisions;
- detect external mapping collisions;
- check scale;
- check provenance;
- check applicability;
- propose mapping/reuse/new concept;
- emit findings;
- require Human Authority for new canonical concepts or materially changed definitions.

The curator may recommend.

The curator may not autonomously canonize.

## Phase 5 — IFC 4.3 alignment

Use IFC 4.3 ADD2 / 4.3.2.0 as the initial mapping baseline.

Do NOT import the entire IFC schema into ARKI blindly.

Audit existing ARKI concepts and produce:

`ARKI_IFC43_ALIGNMENT_MATRIX.csv`

Columns:

ARKI_ID
ARKI_NAME
ARKI_DEFINITION
ARKI_SCALE
IFC43_ENTITY_OR_CONCEPT
MAPPING_KIND
IFC_VERSION
RELATIONSHIP_MAPPING
PROPERTY_MAPPING
QUANTITY_MAPPING
IDENTITY_MAPPING
PROVENANCE
LOSS
ROUNDTRIP_EXPECTATION
DECISION
NOTES

Decision values:

ALIGN
RENAME_OR_ALIAS
EXTEND
ARKI_NATIVE
REFACTOR
REVIEW
UNKNOWN

Where IFC adequately represents a built-environment concept, prefer semantic alignment instead of inventing incompatible parallel vocabulary.

But preserve:

`ARKI ≠ IFC`

IFC is an interoperability semantic standard, not the whole ARKI world model.

## Phase 6 — Identity

Reconcile and implement:

`ARKI_ENTITY_ID ↔ IFC GlobalId ↔ Revit ID ↔ CAD handle ↔ GIS feature ID ↔ other external IDs`

Rules:

- ARKI identity remains canonical inside ARKI.
- external identity is mapped, not substituted.
- no duplicate object creation from repeated imports.
- preserve lineage.
- external change = observed external change until governed acceptance.

## Phase 7 — CAD semantic firewall

Preserve existing rule:

`CAD GEOMETRY ≠ BIM SEMANTIC FACT`

Examples:

two parallel lines → `WallCandidate`
not → canonical `Wall`.

No change to `semanticPromotion: PROHIBITED` without a separately authorized gate.

## Phase 8 — Quantity semantics

Create or reconcile canonical quantity definitions.

Every quantity requires:

- semantic key;
- dimension;
- canonical unit;
- source or derivation;
- dependency;
- provenance;
- validity/revision.

Geometry change must invalidate dependent derived quantities instead of silently leaving stale values.

Do not yet build full 5D.

## Phase 9 — Transaction integration

Semantic canonical changes must ultimately use:

`PROPOSE → CURATOR REVIEW → HUMAN AUTHORITY where required → VALIDATION → TRANSACTION → DURABLE COMMIT → CANONICAL REVISION`

Do not direct-write `CanonicalProjectRepository` internals.
Do not route through `ProjectContext.setBuilding` as authority.
Do not create a second repository.

If current BKH4/TX scope cannot safely support semantic registry persistence, implement registry as non-canonical/read-only/proposal infrastructure and report:

`SEMANTIC_CANONICAL_COMMIT_BLOCKED_BY_WRITER_MIGRATION`

Do not bypass the blocker.

## Tests

At minimum:

- exact duplicate concept
- alias duplicate
- multilingual alias reuse
- external exact mapping collision
- IFC version distinction
- missing provenance
- UNKNOWN promotion
- scale leakage
- deprecated lineage
- external identity collision
- CAD wall candidate does not become Wall
- Project/Building/Space/Wall/Door mapping smoke tests
- deterministic registry serialization
- no canonical mutation from curator review
- existing BKH/TX/CAD regressions

Add adversarial mutants:

`ALIAS_TO_NEW_ENTITY`
`IFC_ID_TO_ARKI_ID`
`CAD_GEOMETRY_TO_FACT`
`UNKNOWN_TO_CANON`
`IGNORE_SCALE`
`IGNORE_PROVENANCE`
`IFC_VERSION_COLLAPSE`
`CURATOR_DIRECT_COMMIT`

All must be killed.

## Required evidence

Return:

- baseline branch / HEAD / worktree
- exact files changed
- reconciliation report
- IFC alignment matrix
- tests and outputs
- mutant report
- regression results
- remaining UNKNOWNs
- blockers
- diff summary
- manifest with SHA-256

## Allowed status

`SEMANTIC_CURATOR_FOUNDATION_VERIFIED`
only for the bounded implemented scope.

Otherwise:

`PARTIAL`
`BLOCKED`
`FAILED`

Never claim:

- complete IFC interoperability;
- complete BIM;
- enterprise platform complete;
- professional validation;
- global canonical writer migration complete.

## Stop conditions

No push.
No PR.
No merge.
No deployment.
No TX-005 writer migration unless separately authorized.
No mass rename of existing ARKI code before the alignment matrix is reviewed.

STOP after report + evidence.
