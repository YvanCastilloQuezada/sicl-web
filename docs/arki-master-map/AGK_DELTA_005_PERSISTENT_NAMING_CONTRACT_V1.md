# AGK-DELTA-005 — Persistent Topological Naming / Semantic Identity Bridge

Status: **FROZEN FOR MINIMAL IMPLEMENTATION**
Evidence gate: Phase 4 PASS 12/12.

## Authority

ARKI owns persistent semantic identity. OCCT remains the sole canonical BRep geometry authority. BRep enumeration order, transient implementation handles, raw world-coordinate signatures, and geometry-only matching MUST NOT become semantic identity authorities.

## Inputs

A correspondence decision may use, together:

1. stable ARKI semantic entity ID;
2. parametric feature/provenance lineage;
3. semantic role and context;
4. OCCT operation history when available;
5. geometric and topological evidence;
6. explicit tolerance envelope.

No single weak signal is sufficient when competing candidates exist.

## Pipeline

SEMANTIC_ID + FEATURE_PROVENANCE + ROLE_CONTEXT + OP_HISTORY + GEOM_TOPO_EVIDENCE
→ CORRESPONDENCE CANDIDATES
→ CONFIDENCE / AMBIGUITY
→ LINEAGE EVENT
→ ACCEPT OR FAIL_CLOSED
→ COMMIT

## Event model

PRESERVE | REMAP | SPLIT | MERGE | NEW | DELETED | AMBIGUOUS

SPLIT and MERGE require explicit lineage evidence. NEW and DELETED are first-class events, not matching failures.

## Hard gates

- Competing or insufficiently supported candidates => AMBIGUOUS.
- AMBIGUOUS => NO COMMIT and no silent semantic rebinding.
- Geometry proximity alone cannot preserve semantic identity.
- Rigid transforms do not destroy semantic identity when ARKI provenance preserves it.
- Same-domain normalization is geometric evidence, not semantic authority.
- Disconnected or gapped topology must not silently merge.
- Every committed mapping must retain evidence/provenance sufficient for audit.

## Demonstrated evidence

Discovery demonstrated exact regeneration, parametric edits, boolean edits, feature add/delete, rigid-transform ambiguity, true 1→N SPLIT, true N→1 MERGE with exact area conservation, near-gap negative control, symmetry ambiguity, and fail-closed governance. Phase 4 adversarial campaign passed 12/12.

## Boundary

This contract freeze authorizes implementation of a **minimal ARKI-owned naming service**. It does **not** assert that a production persistent-naming implementation already exists or is verified.

Implementation must remain above OCCT BRep, must not add a second geometry kernel, and must be tested independently before production/freeze claims.
