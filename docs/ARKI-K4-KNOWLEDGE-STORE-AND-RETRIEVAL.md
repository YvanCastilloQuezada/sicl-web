# ARKI-K4 — Knowledge Store & Deterministic Retrieval

## A. Executive classification

K4 proves a bounded in-memory logical knowledge store composed from K1, K2 and K3. It stores eligible knowledge records, builds transparent indexes, applies explicit metadata filters, classifies context compatibility, retrieves deterministically and preserves source/project provenance. It is not semantic AI search and does not activate infrastructure.

```text
ARKI_K4 = PASS_WITH_OBSERVATIONS
KNOWLEDGE_STORE_CONTRACT = PROVEN
KNOWLEDGE_IDENTITY = PROVEN
KNOWLEDGE_ORIGIN = PROVEN
KNOWLEDGE_ELIGIBILITY = PROVEN
K2_DOMAIN_INDEX = PROVEN
MULTI_DOMAIN_INDEX = PROVEN
KNOWLEDGE_QUERY = PROVEN
CONTEXT_FILTERING = PROVEN
SPATIAL_SCOPE_FILTERING = PROVEN
TYPOLOGY_FILTERING = PROVEN
DESIGN_STAGE_FILTERING = PROVEN
GEOGRAPHIC_FILTERING = PROVEN
JURISDICTION_FILTERING = PROVEN
TEMPORAL_FILTERING = PROVEN
VALIDATION_FILTERING = PROVEN
OWNERSHIP_FILTERING = PROVEN
DETERMINISTIC_RETRIEVAL = PROVEN
DETERMINISTIC_ORDERING = PROVEN
MATCH_CLASSIFICATION = PROVEN
CONTRADICTION_PRESERVATION = PASS
PROVENANCE_TRACEBACK = PASS
```

## B. Baselines

```text
CORE = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE = 7b316dc18c9f05153e143b62c6f8df1b82ec5d84
ARKI-K1 = CLOSED / FROZEN
ARKI-K2 = CLOSED / FROZEN
ARKI-K3 = CLOSED / PASS_WITH_OBSERVATIONS / FROZEN
KNOWLEDGE_FEDERATION = FROZEN / NOT ACTIVATED
SPECIALIST_AGENTS = NOT ACTIVATED
SOURCE_LIBRARY = NOT IMPLEMENTED
SERVER_INFRASTRUCTURE = NOT IMPLEMENTED
A21-P4E = REAL_GATE / FROZEN AT GATE
```

## C. Reuse audit

K4 reuses K1 candidate status, human validation, project experience, Human Feedback, context and provenance. It reuses K2's 28-domain registry, SpatialScopes, design stages and evidence boundaries. It reuses K3 source identity, source location, content units, knowledge units, claim classifications, rights metadata and provenance reconstruction.

No `KnowledgeV2`, `KnowledgeDomainV2`, second DesignMemory, second HumanReview or second provenance system was created. The implementation is a Web-side deterministic read model and does not alter Core.

## D–G. Store model, eligibility, identity and origin

The logical store contains one stable `knowledgeId` per record. A multi-domain record is indexed under several domains but remains one record. Stable IDs and source/project provenance are never regenerated at query time.

Origins are explicit:

```text
SOURCE_DERIVED
PROJECT_EXPERIENCE
HUMAN_FEEDBACK
```

Origin does not imply authority. A record exists in the store independently from whether it is eligible for default reusable retrieval.

Default eligibility excludes rejected, superseded and unknown-validity records. Candidates require an explicit `INCLUDE_CANDIDATES` query option. Source-derived records also require intact source traceback. Retrieval never promotes, validates, mutates or decides.

## H–I. K2 and multi-domain indexes

The store builds deterministic indexes for:

- K2 domain;
- SpatialScope;
- design stage;
- typology;
- origin.

One K3 housing record can be found through both `HOUSING` and `SPATIAL_COMPOSITION` without duplicate results. Unknown domain IDs are rejected by query validation rather than invented.

## J–K. Query contract and context filtering

`KnowledgeQuery` supports optional filters for domain IDs, topic, SpatialScope, typology, design stage, geography, jurisdiction, epistemic status, validation requirement, ownership, source identity, origin and project identity.

Each result is classified as one of:

```text
EXACT_CONTEXT_MATCH
COMPATIBLE_CONTEXT
PARTIAL_CONTEXT
UNKNOWN_CONTEXT
CONTEXT_MISMATCH
```

Matching reasons and context limits are returned explicitly. No hidden chain-of-thought or semantic relevance score is exposed.

## L–Q. Scope, stage, typology, geography, jurisdiction and time

The existing eleven SpatialScopes are used without a parallel taxonomy. A Housing record at `edificacion` is not direct evidence for `pais`. Concept-stage strategy knowledge does not become construction evidence. Housing-specific knowledge does not directly match Hospital or Education queries.

Known geography and jurisdiction are preserved and filtered when present. Missing geography or jurisdiction remains an explicit limitation. Regulatory knowledge requires jurisdiction compatibility; K4 does not make compliance claims. Temporal status preserves `CURRENT`, `UNKNOWN_VALIDITY` and `SUPERSEDED`; superseded records are excluded from current default reuse while remaining traceable.

## R–S. Validation and ownership

Validation filtering distinguishes validated knowledge, candidates, rejected records, superseded records and unknown validity. Ownership is retained as `ARKI_GENERAL`, `SPECIALIST_DEEP` or `CROSS_CUTTING`.

`SPECIALIST_DEEP` is retrievable as a metadata classification only. Specialist agents, routing and execution remain inactive. Ownership is not authority.

## T–V. Deterministic retrieval and ordering

Retrieval uses explicit metadata filtering followed by transparent ordering:

1. exact context matches;
2. non-exact compatible results;
3. stable `knowledgeId` ordering.

The ordering is technical presentation only. It does not mean best, truest or most correct. Identical store-plus-query inputs produce the same IDs, order and match classifications.

No vector search, embeddings, LLM relevance scorer, semantic broadening or stochastic ranking is used.

## W–X. Contradictions and multiple sources

Contradictory courtyard and compact housing positions remain separate records with separate provenance. K4 returns compatible records together and never averages, votes, deletes or selects a winner.

Similar claims from different sources retain independent source identities and provenance. Number of sources is not a truth score.

## Y–Z. Traceback

Source-derived retrieval supports:

```text
KNOWLEDGE RESULT
→ KNOWLEDGE UNIT
→ SOURCE CONTENT UNIT
→ SOURCE LOCATION
→ SOURCE ID
→ SOURCE METADATA
```

Project-derived retrieval supports:

```text
KNOWLEDGE RESULT
→ PROJECT EXPERIENCE
→ PROJECT CONTEXT
→ HUMAN FEEDBACK / OUTCOME
→ PROVENANCE
```

## AA–AB. Mixed origins and rights metadata

A single query can return source-derived knowledge, project experience and human-feedback-derived knowledge while preserving each origin. K3 rights metadata is retained in source-derived records. K4 does not implement DRM, legal enforcement or legal conclusions.

## AC. HOUSE-A21 proof

The controlled query uses the existing question about moving `KITCHEN` farther from `ACCESS` while preserving its relationship with `LIVING_DINING`. Relevant Housing and Spatial Composition knowledge can be retrieved when compatible.

```text
SOURCE_PROVENANCE = PRESERVED
PROJECT_EXPERIENCE = PRESERVED
CONTRADICTIONS = PRESERVED
DESIGN_DECISION = NOT_CREATED
MOVE_OPERATION = NOT_CREATED
WINNER = NONE
```

## AD–AF. Bioclimatic, regulatory and precedent boundaries

Bioclimatic knowledge can be found as contextual knowledge about courtyards, ventilation and airflow drivers, but project ventilation performance remains `NOT_COMPUTED / NOT_SIMULATED`.

Regulatory candidates may be retrieved only as candidates. Compliance remains `NOT_ASSESSED` unless a separate applicable evidence workflow exists.

Precedent observations may be retrieved, but precedent does not become a requirement or prescription.

## AG. Negative controls

The focused tests prove:

- existence does not imply eligibility;
- candidates are not default reusable knowledge;
- rejected and superseded records are excluded by default;
- unknown validity remains explicit;
- wrong domain, typology, stage and scope do not match directly;
- missing context is not broadened globally;
- source and project provenance are not lost;
- multi-domain indexes do not duplicate results;
- contradictions do not create winners;
- retrieval is read-only;
- retrieval does not promote or validate;
- no Decision, design operation, compliance claim or simulation claim is created;
- specialist agents, RAG, embeddings, vector database, server, persistence and ingestion remain inactive;
- empty queries return no fabricated knowledge.

## AH–AJ. K1, K2 and K3 compatibility

K1, K2 and K3 remain frozen and regression-tested. K4 composes their contracts without changing their ontologies or persistence boundaries.

## AK–AM. Federation, specialists and infrastructure

```text
KNOWLEDGE_FEDERATION = FROZEN / NOT ACTIVATED
SPECIALIST_AGENTS = NOT ACTIVATED
SPECIALIST_ROUTING = NOT ACTIVATED
SOURCE_LIBRARY = REGISTERED / NOT IMPLEMENTED
FULL_SOURCE_STORAGE = NOT IMPLEMENTED
SERVER_INFRASTRUCTURE = NOT IMPLEMENTED
LOCAL_CACHE = NOT IMPLEMENTED
PERSISTENCE = NOT IMPLEMENTED
VECTOR_DATABASE = NOT ACTIVATED
EMBEDDINGS = NOT ACTIVATED
RAG = NOT ACTIVATED
```

No database migration, server, cache, source file storage or UI was added.

## AN–AQ. Validation

```text
FOCUSED_K4_TESTS = 10 passed
K1_REGRESSION = PASS
K2_REGRESSION = PASS
K3_REGRESSION = PASS
FULL_WEB_SUITE = 75 files / 374 tests passed
TYPESCRIPT = PASS
BUILD = PASS
git diff --check = PASS
```

## AR–AV. Final state

```text
CORE_SHA = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE_SHA = 7b316dc18c9f05153e143b62c6f8df1b82ec5d84
NEW_CANONICAL_ENTITY = NO
CORE_CONTRACT_CHANGED = NO
CORE_CHANGED = NO
WEB_CHANGED = YES
REAL_GATE = NOT_TRIGGERED
LOCAL_COMMIT = CREATED_AFTER_VALIDATION
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```
