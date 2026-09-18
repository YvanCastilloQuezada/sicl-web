# SiMS-DeI — A17-G1
# Space Geometry Revision Capability Gate

## A. Executive classification

```text
A17_G1 = NEW_GENERIC_MUTATION_REQUIRED
OPERATION_REUSE_LEVEL = LEVEL 3
CURRENT_SPACE_REALIZATION = SUPPORTED
CURRENT_SPACE_MODIFICATION = UNSUPPORTED
REALIZE_SPATIAL_ELEMENT_REUSE = INSUFFICIENT AS-IS
DUPLICATE_SEMANTICS = BLOCKS_REVISION
ALTERNATIVE_STATE_REUSE = PARTIAL
EXPLICIT_REALIZATION_REPLACEMENT = UNSUPPORTED
SOURCE_IMMUTABILITY = PASS
SPACE_IDENTITY_PRESERVATION = PARTIAL
SPATIAL_ELEMENT_IDENTITY = RESULT_DERIVED BY DEFAULT; PRESERVE ONLY IF EXPLICITLY SUPPLIED
PROGRAM_LINEAGE = PASS FOR EXISTING FIELDS
PREVIEW_REUSE = PARTIAL
AUTHORIZATION_REUSE = PARTIAL
STALE_SOURCE_PROTECTION = UNSUPPORTED / NOT BOUND
WRONG_SUBJECT_PROTECTION = UNSUPPORTED / NOT BOUND
GEOMETRY_VALIDATION_REUSE = PASS FOR BASIC EXPLICIT POLYGONS
RESULT_ALTERNATIVE_CONSTRUCTION = PASS FOR DERIVATION, UNSUPPORTED FOR TARGET REPLACEMENT
SPATIAL_REPRESENTATION_COMPOSITION = PASS FOR APPEND, PARTIAL FOR REPLACEMENT
INDEPENDENT_READBACK = PARTIAL
A15_REUSE = PASS, PROVIDED A RESULT REPRESENTATION EXISTS
A16_RECRITIQUE = PASS, PROVIDED FRESH A15 INPUT EXISTS
FALSE_SUCCESS_PROTECTION = PARTIAL
RELATIONSHIP_CONSEQUENCES = REQUIRES_REVIEW
POST_REVISION_MASSING = UNCHANGED
REVERSIBILITY = SOURCE_RESULT_SELECTION
KNOWLEDGE_DEPENDENCY = NONE
REAL_GATE = MINIMUM_CAPABILITY_GATE
```

The current architecture safely represents **realization of a previously non-explicit space**, but it does not safely express:

```text
BEDROOM-01 / GEOMETRY A
→ BEDROOM-01 / GEOMETRY B
```

inside a new canonical result Alternative while preserving the same architectural-space identity and replacing exactly one explicit realization.

The exact minimum missing capability is:

```text
MISSING_CAPABILITY =
GENERIC EXPLICIT-SPATIAL-REALIZATION REPLACEMENT SEMANTICS
IN A DERIVED RESULT ALTERNATIVE, WITH SOURCE-STATE BINDING,
TARGET-IDENTITY VALIDATION, AND INDEPENDENT READBACK.
```

This is **not** a room editor, floor-plan engine, BIM editor or autonomous generator.

## B. Baseline verification

```text
CORE_EXPECTED = 4060b4f98224b4403ecbfee5e59042e736ccf5be
CORE_ACTUAL   = 4060b4f98224b4403ecbfee5e59042e736ccf5be

WEB_EXPECTED  = ecc5416faf0f061a115216b69a005abb283fa83c
WEB_ACTUAL    = ecc5416faf0f061a115216b69a005abb283fa83c
```

The Web worktree contains only previously untracked diagnostic documents. No product-code difference from the stated baseline was found. Core is clean.

Known Web untracked reports were preserved and not included in this diagnostic commit:

```text
docs/ARCHITECTURAL-SPACE-INTELLIGENCE-P2-REAL-GATE.md
docs/ARCHITECTURAL-SPACE-INTELLIGENCE-P2R-REAL-GATE.md
docs/ARCHITECTURAL-SPACE-INTELLIGENCE-P2R-V-FINAL.md
docs/ARQUI-A18-ARCHITECTURAL-CAPABILITY-GAP-DIAGNOSIS.md
```

## C. Existing realized-space state

The canonical existing state is carried by `Alternative.explicit_spatial_realizations`:

```text
Alternative
├── alternative_id
├── project_id
├── parameters
├── version
└── explicit_spatial_realizations: list[dict]
```

The realized-space record contains, at minimum:

```text
space_id
program_item_id
geometry
geometry_provenance
boundary_status
optional spatial_element_id
optional level
optional parent_id
optional labels
optional request_provenance
```

The generator composes each record into a `SpatialElement` of type `SpatialZone`, with metadata identifying:

```text
space_role = architectural_space
space_id
program_item_id
geometry_provenance
boundary_status
realization_provenance
```

For this diagnostic:

```text
PROGRAM_ITEM_ID = BEDROOM
SPACE_ID = BEDROOM-01
GEOMETRY A = polygon with area 12 m²
```

The specified rectangle A is:

```json
[[0,0],[4,0],[4,3],[0,3],[0,0]]
```

The attached test input B is not executed.

## D. Canonical state location

The canonical source state is the `Alternative` object and, after generation, its derived `SpatialRepresentation`. It is not canonical in:

```text
Web component state
A17 temporary plan
A16 hypothesis
preview payload
external cache
independent room store
renderer state
```

`SpatialRepresentation` is derived in memory from `Alternative`; the generator documentation explicitly describes it as an in-memory derived representation. Therefore a future revision must create a new result Alternative rather than silently modifying a rendered or temporary representation.

## E. Geometry A

```text
SPACE_ID = BEDROOM-01
PROGRAM_ITEM_ID = BEDROOM
GEOMETRY_TYPE = polygon
AREA = 12 m²
PROVENANCE = HUMAN_SUPPLIED_TEST_INPUT, for the diagnostic fixture
```

The geometry validator requires a polygon, closure, finite coordinates and positive area. The existing ASI-G1/G2 path can validate this class of geometry.

## F. Hypothetical geometry B

The diagnostic-only proposed geometry is:

```json
[[0,0],[5,0],[5,3],[0,3],[0,0]]
```

```text
EXPECTED AREA = 15 m²
DELTA = +3 m²
```

It is not executed, persisted, recommended, generated, evaluated as better, checked for regulatory compliance or interpreted as a design decision.

## G. Identity invariants

The intended future invariant is technically coherent:

```text
BEFORE:
  program_item_id = BEDROOM
  space_id = BEDROOM-01
  geometry = A

AFTER:
  program_item_id = BEDROOM
  space_id = BEDROOM-01
  geometry = B
```

The current data model can carry the same `space_id` in a result record, but current operation semantics reject a second record with that `space_id` inside one Alternative. Therefore identity preservation is possible as a target invariant but not currently executable as replacement.

No `BEDROOM-02` should be created merely because the geometry changes.

## H. SpatialZone identity semantics

`SpatialZone` is a generated representation element. Its default ID is derived from:

```text
alternative_id
+ element_type
+ semantic_key
+ generator_version
+ representation_version
```

For explicit spaces, the default semantic key is `space_id`. Because `alternative_id` participates in the digest, a derived result Alternative normally receives a different default `spatial_element_id` even when `space_id` is unchanged.

Current semantics therefore are:

```text
architectural space identity = metadata.space_id
SpatialZone representation identity = id field, derived per Alternative unless explicitly supplied
```

The safest future interpretation is:

```text
space_id = preserved architectural identity
spatial_element_id = result-state representation identity unless an explicit stable identity is supplied and validated
```

The current architecture does not define a complete cross-Alternative identity policy. It must not be inferred from array position or from the generated ID alone.

## I. Alternative source/result semantics

Existing GDI and spatial operation paths derive a child Alternative from a source Alternative. They preserve the source Alternative and return a distinct child identifier. This supports:

```text
SOURCE ≠ RESULT
SOURCE remains available
branch/replay is the current reversal model
```

For existing massing operations, the child copies `explicit_spatial_realizations` unchanged. This proves source/result derivation, but not replacement of a selected realization.

The required future behavior is:

```text
source Alternative: BEDROOM-01 / A
result Alternative: BEDROOM-01 / B
unrelated source state: preserved
source object: unchanged
```

Current machinery supports the first, third and fourth statements, but not the second.

## J. explicit_spatial_realizations behavior

Current behavior is effectively append-only at operation construction:

1. Read the existing list.
2. Validate the new realization.
3. Reject if an existing item has the same `space_id`.
4. Construct a child with `existing + [realization]`.
5. Generate a derived representation.

The relevant current invariant is:

```text
DUPLICATE space_id within one Alternative → SPATIAL_REALIZATION_CONFLICT
```

There is no current selector such as `replace_space_id`, no source realization version, no replacement lineage, no target geometry digest binding and no deterministic list substitution path.

## K. REALIZE_SPATIAL_ELEMENT reuse analysis

`REALIZE_SPATIAL_ELEMENT` can be reused for:

```text
semantic-only space
→ explicit geometry
```

It cannot be reused unchanged for:

```text
existing explicit geometry A
→ replacement explicit geometry B
```

Using it unchanged would cause the current duplicate-space conflict. Silently bypassing that conflict would weaken a valid ASI-G2 safety rule and would make accidental duplicate creation indistinguishable from legitimate revision.

Conclusion:

```text
REALIZE_SPATIAL_ELEMENT_REUSE = INSUFFICIENT AS-IS
```

A future operation may remain in the same generic spatial-operation family, but it needs explicit replacement semantics rather than treating replacement as a second realization.

## L. Duplicate protection analysis

Current duplicate detection applies to the `explicit_spatial_realizations` list of one Alternative. It compares `space_id` values already present in that Alternative with the incoming realization.

It protects:

```text
same-result-state duplicate space_id
multiple explicit realizations of the same space_id
accidental append of a second BEDROOM-01 record
```

It does not currently establish:

```text
source-vs-result revision semantics
cross-Alternative identity equivalence
stale-source detection
wrong-subject authorization binding
geometry replacement lineage
spatial_element_id identity across Alternatives
```

Therefore duplicate protection is valid but narrower than the revision problem.

## M. Legitimate revision vs duplicate

The current architecture does distinguish neither case explicitly at the operation level:

```text
DUPLICATE:
  same Alternative contains A and B for BEDROOM-01

LEGITIMATE REVISION:
  source Alternative contains A
  result Alternative contains B for BEDROOM-01
```

The data model can represent both lists, but the current `REALIZE_SPATIAL_ELEMENT` operation only permits the first kind of addition when the target `space_id` is absent. A future generic replacement operation must make the source/result boundary part of the contract.

## N. Operation reuse level

```text
LEVEL 3
```

The existing generic mutation infrastructure, Alternative derivation, preview shape, human confirmation gate, geometry validator, generator, metrics, readback components, A15 and A16 can be reused. However, a second generic spatial mutation semantic is required for **replacement of an existing explicit realization**.

This is not a new room-specific operation. It is a generic operation over canonical spatial elements or explicit spatial realizations.

## O. Revision request minimum

| Field | Classification | Reason |
|---|---|---|
| source project | REQUIRED | Binds the request to the project context. |
| source Alternative | REQUIRED | Establishes source/result lineage. |
| space_id | REQUIRED | Selects the architectural-space identity. |
| program_item_id | REQUIRED | Preserves program lineage and prevents subject drift. |
| current realization identity | REQUIRED | Confirms the target exists and is explicit. |
| new explicit geometry | REQUIRED | The revision cannot be inferred from an area target. |
| coordinate system | REQUIRED or DERIVED | Must match the source or be explicitly reviewed. |
| units | REQUIRED or DERIVED | Current spatial model supports metres only. |
| geometry provenance | REQUIRED | B must be traceable to human input or an authorized source. |
| finding_id | REQUIRED | Links the request to A16 evidence. |
| hypothesis_id | REQUIRED | Links the request to the bounded human-selected hypothesis. |
| request provenance | REQUIRED | Records origin and evidence. |
| Human Authority | REQUIRED | No execution without explicit bounded authorization. |
| current geometry digest/version | REQUIRED FUTURE BINDING | Prevents stale application after source change. |
| target area | UNNECESSARY AS SOURCE OF GEOMETRY | May be descriptive, never sufficient for mutation. |
| design quality judgment | FORBIDDEN | Not part of geometry mutation. |

## P. Source-state binding

```text
STALE_SOURCE_PROTECTION = UNSUPPORTED
```

The current operation payload contains parent/source alternative linkage, but the inspected path does not bind authorization to the exact current realization geometry or a realization version/digest. A request prepared against A could therefore lack a canonical guard if source state changes before execution.

The minimum future binding is one stable source-state reference, such as:

```text
source Alternative ID + target space_id + expected realization identity/version
```

A geometry digest may be used if the repository later establishes it as canonical. No cryptographic redesign is required by this diagnostic.

## Q. Human Authority binding

The current execution path requires `human_confirmed=True`, and the Web A17 design requires separate selection and authorization gates. This preserves the core principle that preview and hypothesis do not authorize execution.

However, current operation execution does not visibly bind confirmation to all future revision subjects:

```text
space_id
source realization identity
proposed geometry B
source-state version
```

Therefore:

```text
AUTHORIZATION_REUSE = PARTIAL
AUTHORIZATION_BINDING = PARTIAL / INSUFFICIENT FOR SPACE REVISION
```

No new authority system is required. Existing authority should be extended with bounded subject and source-state binding.

## R. Preview reuse

The current preview path already exposes:

```text
parent Alternative
proposed child
before representation
after representation
metrics before/after
deltas
human_confirmation_required
 decision_created = false
recommendation_created = false
```

It can therefore reuse the preview shell. It cannot currently produce a legitimate A→B replacement preview because the proposed child cannot replace an existing realization.

Future preview requirements are:

```text
CURRENT GEOMETRY = A
PROPOSED GEOMETRY = B
CURRENT AREA = 12 m²
PROPOSED AREA = 15 m²
DELTA AREA = +3 m²
SPACE_ID = BEDROOM-01
PROGRAM_ITEM_ID = BEDROOM
SOURCE ALTERNATIVE
EXPECTED RESULT ALTERNATIVE
PREVIEW ≠ RESULT
```

The preview must not claim improvement, compliance, optimality or recommendation.

## S. Geometry validation reuse

```text
GEOMETRY_VALIDATION_REUSE = PASS
```

Current ASI-G1/G2 validation can be reused for the fixture class:

```text
polygon
closed ring
finite coordinates
positive non-degenerate area
serializable geometry
supported units/context
```

It does not by itself validate:

```text
space replacement authorization
program compatibility
containment after revision
adjacency after revision
collision with other spaces
stale source
wrong subject
```

Those are operation and result-state checks, not a second geometry engine.

## T. Result Alternative construction

Current result construction passes for massing derivation and for appending a new realization. It does not provide deterministic replacement of one existing list entry while preserving all others.

Required future algorithmic semantics:

```text
copy/derive source Alternative
locate exactly one target by space_id and source realization identity
replace only that entry
preserve all unrelated explicit realizations
preserve unrelated massing parameters
preserve program lineage
assign result provenance
create a distinct result Alternative
leave source unchanged
```

Current status:

```text
RESULT_ALTERNATIVE_CONSTRUCTION = PARTIAL
```

## U. SpatialRepresentation composition

The generator already composes:

```text
generated site/massing elements
+
explicit spatial realizations
```

It can produce a representation containing a newly appended explicit space. It can also preserve explicit realizations copied unchanged by massing-derived children.

It does not currently provide the complete replacement path needed for:

```text
generated massing
+
revised BEDROOM-01 / B
+
unchanged other explicit spaces
```

No second SpatialRepresentation model is required.

## V. Unrelated realization preservation

The intended future behavior is clear and compatible with current Alternative lineage:

```text
BEDROOM-01 = changed
BATH-01 = unchanged if explicitly realized
semantic-only spaces = unchanged
massing = unchanged unless separately authorized
```

The current append/copy machinery preserves unrelated entries when it does not replace a target. Replacement-specific preservation remains unimplemented.

## W. Semantic-only preservation

A semantic-only space is not materialized into a polygon merely because another space changes. `BATH-01` must remain semantic-only unless a separate, explicitly authorized realization is requested.

```text
BATH-01 = NOT MATERIALIZED BY BEDROOM-01 REVISION
```

## X. Coordinate/unit handling

The spatial model has canonical defaults:

```text
coordinate_system = LOCAL_ENU
units = m
SUPPORTED_UNITS = {m}
```

A revision must use the same coordinate context and units as the source unless a separate transformation and review capability exists. Automatic coordinate transformation is not supported by this gate.

```text
COORDINATE_CONTEXT = SAME CONTEXT REQUIRED
```

## Y. Level/parent handling

`SpatialElement` supports optional `level` and `parent_id`, and the generator copies these from the realization record. A revision must preserve them unless an explicit future request allows change and validates the new parent/level.

```text
level = PRESERVE BY DEFAULT
parent_id = PRESERVE BY DEFAULT
silent change = FORBIDDEN
```

The current contract does not define a complete change policy for these fields, so explicit changes require review.

## Z. Independent readback

Current components can regenerate a representation from a result Alternative and A15 can read a fresh representation. This is sufficient in principle to verify a future result, but the current operation path does not yet produce a replacement result for BEDROOM-01.

Required future readback evidence:

```text
result Alternative exists
BEDROOM-01 exists in result
geometry B exists in result
geometry A is not the result geometry
program lineage preserved
provenance preserved/updated
actual result area = 15 m² from B
source Alternative remains A
```

```text
INDEPENDENT_READBACK = PARTIAL
```

Operation success alone is insufficient.

## AA. Geometry match / before-after

Current architecture can compare serialized representations and compute spatial metrics, but it lacks a canonical revision comparison record for target-space A→B. Two fresh reads can establish the evidence later; no new distance engine is required.

Minimum future evidence:

```text
GEOMETRY_CHANGED = YES
IDENTITY_CHANGED = NO
```

The existing design-distance capability should not be extended under this diagnostic.

## AB. Actual-area recomputation

The area must be computed from the result representation, not from:

```text
A16 hypothesis
requested target area
preview field
textual intent
```

Existing polygon area logic can compute B as 15 m². This is a deterministic derived metric, not a quality judgment.

## AC. A15' reuse

```text
A15_REUSE = PASS
```

A15 can freshly observe a result geometry if the result Alternative and generated SpatialRepresentation contain the revised explicit realization. It should observe:

```text
spaceId = BEDROOM-01
geometry = B
actualArea = 15 m²
realizationStatus = GEOMETRICALLY_REALIZED
```

No A15 code change is required merely to read a valid result representation.

## AD. A16' re-critique

```text
A16_RECRITIQUE = PASS
```

A16-GCR can consume a fresh A15 result and produce a new critique, assuming the result is actually available. For example, the before and after area relations can be compared descriptively:

```text
BEFORE actual = 12 m²
AFTER actual = 15 m²
```

This does not establish improvement, suitability or recommendation.

An explicit before/after transition object is not currently a canonical A16 entity. Two independent readings plus a future comparison adapter are sufficient; a second critique system is not needed.

## AE. A17 state-machine assessment

The prepared A17 design contains the intended gates:

```text
NOT_SELECTED
SELECTED
PREPARED
PREVIEW_READY
AUTHORIZED
EXECUTING
READBACK_PENDING
RECRITIQUE_PENDING
VERIFIED
```

The implemented Web helper is narrower and currently collapses some intermediate states. It can represent selection, preparation, authorization and a result/re-evaluation path, but it is not itself a Core execution contract.

```text
A17_STATE_MACHINE_DESIGN = SUFFICIENT FOR FUTURE PREPARATION
A17_RUNTIME_IMPLEMENTATION = NOT AUTHORIZED BY THIS GATE
```

## AF. False-success protection

Existing protections include:

```text
human confirmation required
preview status distinct from executed status
source/result Alternative identifiers
fresh representation generation
A15/A16 readback design
```

Missing for space revision:

```text
source-state binding
exact target realization binding
replacement proof
geometry A/B match proof
explicit independent readback record
wrong-subject rejection
```

Therefore:

```text
FALSE_SUCCESS_PROTECTION = PARTIAL
```

A future revision must not become `VERIFIED` because only preview succeeded, an operation returned success or a result ID exists.

## AG. Wrong-subject control

Current authorization is bound to an operation and parent Alternative, but the inspected operation path does not bind a future explicit-space replacement to `space_id` and the current realization identity.

```text
AUTHORIZATION FOR BEDROOM-01 → EXECUTION TARGET BATH-01
CURRENTLY NOT DEMONSTRATED AS PROTECTED
```

Minimum missing protection: compare the authorized target `space_id`, program item and source realization identity against the execution payload before deriving the result.

## AH. Stale-source control

```text
STALE_SOURCE_PROTECTION = UNSUPPORTED
```

The parent Alternative ID alone does not prove that the target geometry remains the same. A future request needs an expected source realization identity/version or equivalent stable state binding.

## AI. No-change semantics

The current architecture does not define an explicit no-change result for a replacement request where B equals A.

Safest architecture-consistent classification:

```text
NO_CHANGE_SEMANTICS = UNDEFINED / MUST BE DEFINED BEFORE IMPLEMENTATION
```

The future operation should not silently report a geometric revision when the canonical geometry is unchanged. It should reject as `NO_CHANGE` or explicitly return a non-mutating `NO_CHANGE` result, but that choice requires a future implementation order.

## AJ. Collision handling

Current duplicate protection rejects a second same-`space_id` realization in one Alternative. Future collisions with another explicit realization ID, space identity or generated element must remain:

```text
REJECT / CONFLICT / REQUIRES_REVIEW
```

No automatic conflict resolution is supported or authorized.

## AK. Relationship consequences

A change in a space polygon may affect:

```text
containment
adjacency
access
separation
circulation
relationship validity
```

The current examined representation carries `parent_id` and generated element metadata, but no complete relationship-recomputation engine for arbitrary architectural-space geometry was demonstrated.

```text
RELATIONSHIP_CONSEQUENCES = REQUIRES_REVIEW
```

No automatic relationship update should be inferred. Relationships must be preserved only when still valid, marked potentially stale, or explicitly reviewed under a future capability.

## AL. Massing interaction

Current architecture does not automatically transform explicit space geometry when massing changes. The reverse interaction is also not defined.

For the diagnostic target:

```text
space geometry revision → massing = UNCHANGED
```

Any massing change would require a separate authorized operation. A space revision must not silently alter site, footprint, mass dimensions, floor count or orientation.

## AM. Reversibility

Current reversible semantics are branch-based:

```text
SOURCE remains available
RESULT is a new Alternative
revert/select source rather than inverse mutation
```

This is sufficient as the conceptual reversal model. No undo engine is present or required by this gate.

## AN. Event/audit reuse

The repository already has an event/audit architecture and spatial operation events. A future revision should reuse it rather than create a second event store.

The event must include at least:

```text
source Alternative
result Alternative
space_id
program_item_id
source realization identity/version
geometry provenance
finding_id
hypothesis_id
human actor
authorization scope
result verification status
```

```text
EVENT_AUDIT_REUSE = PASS WITH FUTURE PAYLOAD EXTENSION
```

## AO. ARQUI boundary

ARQUI may:

```text
read A16 finding
explain it
prepare a revision request
validate explicit B
show A→B preview
request Human Authority
execute only after authority
read back
invoke fresh A15
invoke fresh A16
report result
```

ARQUI may not:

```text
invent B
select B autonomously
claim B is better
claim B solves the finding
create a Decision
turn a pattern into geometry
```

## AP. Knowledge-independence proof

A17-G1 does not require:

```text
bioclimatic retrieval
housing retrieval
precedents
books
RAG
embeddings
external fetch
```

Geometry B is an explicit human-supplied diagnostic input. Knowledge Federation remains:

```text
REGISTERED / FROZEN / NOT ACTIVATED
SOURCE_INGESTION = DISABLED
RETRIEVAL = DISABLED
```

```text
KNOWLEDGE_DEPENDENCY = NONE
```

## AQ. Reuse matrix

| Surface | Classification | Diagnostic finding |
|---|---|---|
| `Alternative` | REUSE WITH MINIMUM EXTENSION | Holds source/result state, but replacement semantics are absent. |
| `explicit_spatial_realizations` | REUSE WITH MINIMUM EXTENSION | Current list is append-only for operation purposes. |
| `REALIZE_SPATIAL_ELEMENT` | INSUFFICIENT | Rejects the same `space_id`; cannot express replacement as-is. |
| operation registry | REUSE WITH MINIMUM EXTENSION | Existing generic registry can host a future generic revision capability. |
| operation preview | REUSE WITH MINIMUM EXTENSION | Shell is usable; target A→B fields are missing. |
| Human Authority | REUSE WITH MINIMUM EXTENSION | Existing confirmation gate needs target/source binding. |
| result Alternative construction | REUSE WITH MINIMUM EXTENSION | Branching exists; selective replacement does not. |
| SpatialRepresentation composition | REUSE WITH MINIMUM EXTENSION | Append/composition exists; replacement composition is absent. |
| ASI-G1 geometry validation | REUSE AS-IS | Validates the basic explicit polygon class. |
| program-space identity | REUSE WITH MINIMUM EXTENSION | Fields exist; replacement preservation must be enforced. |
| SpatialZone identity | REUSE WITH MINIMUM EXTENSION | Default ID is result-derived; cross-result policy is incomplete. |
| provenance | REUSE WITH MINIMUM EXTENSION | Existing fields exist; A/B replacement lineage is needed. |
| Event Log/audit | REUSE WITH MINIMUM EXTENSION | Existing path exists; revision payload must be bound. |
| readback | REUSE WITH MINIMUM EXTENSION | Regeneration exists; replacement proof is absent. |
| A15 | REUSE AS-IS | Can read a valid result representation. |
| A16-GCR | REUSE AS-IS | Can critique fresh A15 output. |
| A17 state design | REUSE WITH MINIMUM EXTENSION | Prepared design is suitable; runtime contract is incomplete. |
| design distance | NOT NEEDED | Do not extend for this gate. |
| renderer | NOT NEEDED | No visual implementation is authorized. |
| Knowledge Federation | NOT NEEDED | Geometry revision is independent of retrieval. |

## AR. Exact missing capability

```text
MISSING_CAPABILITY =
GENERIC EXPLICIT-SPATIAL-REALIZATION REPLACEMENT SEMANTICS
IN A DERIVED RESULT ALTERNATIVE, INCLUDING:

1. target realization selection by space_id and current realization identity;
2. source-state binding;
3. replacement rather than append behavior;
4. preservation of unrelated realizations;
5. source immutability;
6. result provenance and source/result lineage;
7. bounded Human Authority binding;
8. independent A15/A16 readback evidence.
```

## AS. Minimum future change surface

Only if separately authorized, the minimum likely surfaces are:

```text
Core generic spatial mutation semantics
Alternative result derivation / explicit realization replacement
operation preview payload
authorization binding
source-state validation
readback verification
focused Core tests
minimal Web A17 integration
```

No new spatial model, geometry engine, event store, room-specific operation or knowledge system is justified by this gate.

## AT. Answers to all 54 central questions

| # | Answer |
|---:|---|
| 1 | `Alternative.explicit_spatial_realizations` contains BEDROOM-01 geometry A; the generator emits it as a `SpatialZone`. |
| 2 | Canonically in the source Alternative; SpatialRepresentation is derived. |
| 3 | Yes, source Alternative preserves it as list data; no persistence claim is made here. |
| 4 | Not through current `REALIZE_SPATIAL_ELEMENT`; result can carry a record only if replacement semantics are added. |
| 5 | Yes, replacing the target explicit realization. |
| 6 | No, not currently. |
| 7 | Yes; current same-state duplicate protection blocks append-based revision. |
| 8 | Within one Alternative's explicit realization list, by `space_id`. |
| 9 | No. |
| 10 | It rejects an existing `space_id` and has no replacement selector or lineage. |
| 11 | Possibly within the same generic family, but not without explicit replacement semantics and subject binding. |
| 12 | It must not; duplicate same-state protection remains mandatory. |
| 13 | Yes; a distinct generic replacement semantic is clearer than treating replacement as realization. |
| 14 | The existing operation registry/family can be reused; a new room-specific family is not required. |
| 15 | No new canonical entity is required by the evidence. |
| 16 | No new spatial model is required. |
| 17 | No new geometry engine is required. |
| 18 | Alternative is sufficient as the canonical container, with a minimum semantic extension. |
| 19 | Yes conceptually; current result derivation needs target replacement. |
| 20 | Yes for branch derivation; mutation path must keep it enforced. |
| 21 | Yes, `BEDROOM-01` should remain the architectural identity. |
| 22 | Current default is result-derived from Alternative ID; explicit stable identity policy is not fully defined. |
| 23 | Yes, `BEDROOM` can remain program lineage. |
| 24 | Partially; provenance fields exist, but A/B replacement lineage is not complete. |
| 25 | Yes for basic polygon validity. |
| 26 | Partially; preview shell exists but cannot build valid replacement child. |
| 27 | Partially; human confirmation exists, subject/state binding is incomplete. |
| 28 | Not demonstrated for explicit-space revision; minimum target binding is missing. |
| 29 | Not currently. |
| 30 | Yes, expected source realization identity/version is needed. |
| 31 | Conceptually yes; current replacement machinery is absent. |
| 32 | Yes; BATH-01 can remain semantic-only and unchanged. |
| 33 | Yes; massing should remain unchanged. |
| 34 | Partially; composition exists, replacement composition does not. |
| 35 | Partially; generator/readers can prove it once a result exists. |
| 36 | Yes descriptively through geometry/metrics; no new distance engine is needed. |
| 37 | Yes, from result geometry B. |
| 38 | Yes, A15 can read a valid result unchanged. |
| 39 | Yes, A16-GCR can consume fresh A15 output. |
| 40 | Partially; two independent readings suffice initially, comparison adapter may be needed later. |
| 41 | They may change and are not automatically recomputed. |
| 42 | Mark potentially stale or require review; no automatic dependency engine exists. |
| 43 | Sufficient as a prepared design, incomplete as an executable space-revision contract. |
| 44 | Result state, target identity, geometry match, actual change, fresh A15 and fresh A16. |
| 45 | Yes conceptually through source/result selection; no inverse mutation is needed. |
| 46 | Yes, reuse existing event/audit path. |
| 47 | No. |
| 48 | Yes, ARQUI can prepare and validate explicit B without inventing or selecting it. |
| 49 | Generic explicit-spatial-realization replacement semantics with source-state binding and readback. |
| 50 | Core operation semantics, result derivation, preview/authority binding, readback and focused tests; minimal Web integration later. |
| 51 | Level 3. |
| 52 | Next order should be a bounded implementation order only after explicit activation of the minimum capability gate. |
| 53 | One generic operation for replacing one existing explicit realization in one derived result Alternative. |
| 54 | No room-specific editing, automatic generation, bulk revision, relationship engine, knowledge activation, BIM authoring or deployment. |

## AU. Recommended next order

```text
RECOMMENDATION =
DO NOT IMPLEMENT UNDER A17-G1.

NEXT ORDER =
A BOUNDED IMPLEMENTATION ORDER FOR ONE GENERIC
EXPLICIT-SPATIAL-REALIZATION REPLACEMENT PATH,
ONLY IF THE PRODUCT OWNER ACTIVATES THE MINIMUM CAPABILITY GATE.
```

The next implementation, if authorized, must be restricted to:

```text
one source Alternative
one existing explicit space
one replacement geometry
one result Alternative
one human authorization
one independent readback
```

It must not include bulk room modification, adjacent-space propagation, automatic design improvement, relationship recomputation, knowledge retrieval, BIM, or deployment.

## AV. Exact out-of-scope list

```text
RESIZE_ROOM
MOVE_ROOM
RESHAPE_ROOM
EDIT_BEDROOM
CHANGE_BEDROOM_AREA AS A TARGET-ONLY COMMAND
CREATE_REVISED_ROOM
BULK SPACE MODIFICATION
MULTI-SPACE OPTIMIZATION
AUTOMATIC ADJACENCY OR CIRCULATION REPAIR
MASSING TRANSFORMATION FROM SPACE CHANGE
NEW SPATIAL MODEL
NEW GEOMETRY ENGINE
NEW AUTHORITY SYSTEM
NEW EVENT STORE
KNOWLEDGE FEDERATION ACTIVATION
SOURCE INGESTION
RAG / EMBEDDINGS / EXTERNAL FETCH
DESIGN QUALITY CLAIMS
REGULATORY CLAIMS
INVESTMENT RECOMMENDATIONS
AUTOMATIC DECISIONS
PUSH / PR / MERGE / DEPLOYMENT
```

## AW. Core SHA

```text
4060b4f98224b4403ecbfee5e59042e736ccf5be
```

## AX. Web SHA

```text
ecc5416faf0f061a115216b69a005abb283fa83c
```

## AY. Worktree states

```text
CORE = CLEAN
WEB = PRODUCT CODE CLEAN; previously untracked diagnostic documents present
```

## AZ. Explicit final status

```text
PRODUCT_CODE_CHANGED = NO
CORE_CHANGED = NO
WEB_PRODUCT_CODE_CHANGED = NO
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
HUMAN_AUTHORITY = PRESERVED
KNOWLEDGE_FEDERATION = REGISTERED / FROZEN / NOT ACTIVATED
```

## Final stop condition

```text
VERIFY BASELINE = PASS
INSPECT = PASS
DIAGNOSE = COMPLETE
REUSE LEVEL = LEVEL 3
EXACT GAP = IDENTIFIED
IMPLEMENTATION = NOT PERFORMED
STOP = YES
```
