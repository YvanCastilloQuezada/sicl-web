# SiMS-DeI — ARQUI A31
# Passage, Threshold and Door Semantics

## Executive result

**A31 = PASS_WITH_OBSERVATIONS.** A31 extends the validated A30 opening read model with explicit semantics for passages, thresholds and doors. It does not promote legacy `kind = DOOR` metadata into a verified door, and it does not fabricate construction, accessibility or regulatory information.

The implementation is a derived Web read model. It introduces no persistent building-element entity and does not modify Core or the Core Contract.

## Scope

A31 adds the following explicit evidence fields:

- passage role: internal, entry, service or unknown;
- door operation: swing, sliding, folding, automatic or unknown;
- clear width in metres;
- threshold state and optional measured height;
- leaf count;
- swing direction;
- optional fire-rating evidence;
- source opening, alternative and geometry-version binding;
- provenance, evidence references and human-review state.

The semantic states are `OBSERVED`, `UNVERIFIED`, `STALE` and `NOT_ESTABLISHED`.

## Relationship with A30

A31 is valid only when its evidence references an A30 opening. For an observed door semantic, the source opening must have a current valid A30 boundary binding, the alternative ID must match, the geometry version must match and the clear width must be positive and finite.

A stale A30 opening or changed source geometry prevents A31 from presenting an observed door. The result becomes `STALE` and carries explicit warnings.

A30 connection state is preserved. A31 does not create a connection merely because a door is declared. A passage can be observed only when its source opening also supports the corresponding A30 connection evidence.

## HOUSE-001 result

HOUSE-001 contains six legacy opening records. They remain `NOT_ESTABLISHED` for A31 because their existing `kind`, nominal width and status are not sufficient as explicit passage or door evidence.

```text
LEGACY_OPENINGS = 6
EXPLICIT_A31_DOORS_IN_HOUSE_001 = 0
ACCESSIBILITY = NOT_ASSESSED
REGULATORY_STATUS = NOT_ASSESSED
HUMAN_REVIEW = REQUIRED
```

The A31 positive test fixture is separate from the legacy plan. It binds a passage to an A30-valid boundary and supplies explicit evidence for swing operation, clear width, a threshold and provenance. It is not silently inserted into HOUSE-001.

## Threshold semantics

A threshold may be `PRESENT`, `ABSENT` or `UNKNOWN`. A present threshold without measured height is retained as an explicit warning rather than being assigned an assumed height. A negative measured height is rejected. A threshold state does not imply accessibility compliance.

## Door semantics

A31 distinguishes door identity from opening identity. A door operation, swing direction, leaf count and fire rating are reported only when supplied by explicit A31 evidence. A `DOOR` label in the existing residential fixture remains legacy metadata and is not promoted automatically.

```text
OPENING ≠ DOOR
DOOR ≠ ACCESSIBLE
CLEAR_WIDTH ≠ ACCESSIBILITY_COMPLIANCE
FIRE_RATING_EVIDENCE ≠ FIRE_COMPLIANCE
THRESHOLD_STATE ≠ CODE_APPROVAL
HUMAN_REVIEW ≠ CONSTRUCTION_DOCUMENTATION
```

## Controls

The tests cover legacy non-promotion, valid A30 binding with explicit passage and door evidence, invalid clear width, missing evidence, stale alternative or geometry version, and preservation of accessibility as `NOT_ASSESSED`.

A31 does not infer door swing, threshold height, clear width, fire rating, accessible route compliance, egress compliance or regulatory applicability.

## A28 presentation integration

A31 is exposed through the existing A28 overlay pipeline as `PASSAGE_DOOR_EVIDENCE`. No renderer was created. The overlay reports the number of explicit A31 door semantics and the number of legacy openings that remain unverified.

## Capability classification

| Capability | State |
|---|---|
| Passage role evidence | IMPLEMENTED as derived evidence |
| Door operation evidence | IMPLEMENTED when explicitly supplied |
| Clear width evidence | IMPLEMENTED with positive finite validation |
| Threshold evidence | IMPLEMENTED with unknown-preserving states |
| Door-to-A30 binding | IMPLEMENTED |
| Stale protection | IMPLEMENTED |
| Legacy DOOR promotion | FORBIDDEN |
| Accessibility certification | NOT_IMPLEMENTED |
| Fire compliance | NOT_IMPLEMENTED |
| Regulatory compliance | NOT_IMPLEMENTED |
| Construction BIM door authoring | NOT_IMPLEMENTED |
| Persistent canonical door entity | NOT_CREATED |

## Validation

```text
Focused A31 + A28 tests = 9 passed
Full Web suite = 66 test files, 323 tests passed
TypeScript = PASS
Build = PASS
Build duration = 12.41 s
Diff check = PASS
Core changed = NO
Core status = CLEAN
```

The build emitted only the existing bundle-size warning for large chunks. No build error occurred.

## Required final classification

```text
A31 = PASS_WITH_OBSERVATIONS
A31_P0 = PASS
A31_P1 = PASS
A31_P2 = PASS
PASSAGE_SEMANTICS = PASS
THRESHOLD_SEMANTICS = PASS
DOOR_SEMANTICS = PARTIAL
CLEAR_WIDTH = PASS
DOOR_OPERATION = PASS_WITH_EXPLICIT_EVIDENCE
A30_BINDING = PASS
STALE_PROTECTION = PASS
HOUSE_001_DOORS_OBSERVED = 0
ACCESSIBILITY_COMPLIANCE = NOT_ASSESSED
REGULATORY_COMPLIANCE = NOT_ASSESSED
CORE_CHANGED = NO
WEB_CHANGED = YES
NEW_CANONICAL_ENTITY = NO
NEW_DERIVED_READ_MODEL = YES
NEW_GEOMETRY_ENGINE = NO
NEW_RENDERER = NO
NEW_CIRCULATION_GRAPH = NO
HUMAN_AUTHORITY = PRESERVED
REAL_GATE = NOT_TRIGGERED
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

## Next causal boundary

The next capability should remain separate from A31: **measured door and passage geometry for accessibility and egress review**. A31 provides the semantic foundation, but the system still lacks validated measurements, jurisdiction binding and human-reviewed compliance assessment. No A32 or additional capability is implemented by this order.

**A31_STATUS = PASS_WITH_OBSERVATIONS**
