# ARKI-K3 — Source-to-Knowledge Provenance & Controlled Ingestion

## A. Executive classification

ARKI-K3 is **PASS_WITH_OBSERVATIONS**. It proves a bounded deterministic source-to-knowledge contract using synthetic fixtures. It does not implement mass ingestion, source retrieval, Knowledge Federation, RAG, embeddings, storage infrastructure or specialist agents.

```text
SOURCE_TO_KNOWLEDGE_CONTRACT = PROVEN
SOURCE_IDENTITY = PROVEN
SOURCE_TYPE_CLASSIFICATION = PROVEN
SOURCE_LOCATION_TRACEABILITY = PROVEN
SOURCE_CONTENT_VS_KNOWLEDGE = SEPARATED
KNOWLEDGE_UNIT = PROVEN
CLAIM_CLASSIFICATION = PROVEN
K2_DOMAIN_INTEGRATION = PROVEN
MULTI_DOMAIN_KNOWLEDGE = PROVEN
CONTEXT_BOUNDING = PROVEN
PROVENANCE_CHAIN = PROVEN
HUMAN_VALIDATION = PROVEN
CONTROLLED_PROMOTION = PROVEN
AUTOMATIC_PROMOTION = PROHIBITED
```

## B. Baselines

```text
CORE = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB = 08e56363f897870128321a85e6533e568574646c
ARKI-K1 = CLOSED / FROZEN
ARKI-K2 = CLOSED / FROZEN
DL-ARKI-KNOWLEDGE-ARCHITECTURE-01 = APPROVED / CLOSED / ACTIVE / FROZEN
A21-P4E = REAL_GATE / FROZEN AT GATE
```

## C. Reuse audit

K3 composes K1 provenance, context bounding, controlled promotion and HumanReview-compatible actions. It reuses K2 domain IDs, evidence boundaries, canonical SpatialScopes and design-stage semantics. Existing A21 epistemic distinctions remain unchanged. No second Evidence, HumanReview, Provenance, DesignMemory, Regulation, Decision, SpatialScope or DesignStage system was created.

The implementation is one bounded in-memory read model with synthetic fixtures. No persisted canonical entity was necessary, so no REAL_GATE was triggered.

## D–H. Source model, location, content and knowledge unit

A source record carries source identity, source type, title, author, edition/version metadata, language, rights metadata, origin, deterministic fingerprint, metadata provenance and temporal validity.

A content unit is a bounded passage, statement, clause, precedent observation or measured result. It always references a source and a source location. A content unit is not itself knowledge.

A knowledge unit carries its own ID plus source ID, content-unit ID, source location, K2 domain IDs, ownership classification, topic, claim type, epistemic status, context, SpatialScope, design stage, typology, applicability, evidence requirement, validation state, provenance and output type.

```text
KNOWLEDGE UNIT
→ SOURCE CONTENT UNIT
→ SOURCE LOCATION
→ SOURCE ID
→ SOURCE METADATA
```

Orphan source-derived knowledge is rejected by the deterministic builder.

## I–J. Claim and epistemic classification

Supported claim types include definition, source statement, author position, design principle, strategy candidate, pattern candidate, method, precedent observation, measured result, regulatory requirement candidate, limitation, contradiction, open question and unknown.

The contract preserves `SOURCE_STATEMENT`, `AUTHOR_POSITION`, `FACT`, `INTERPRETATION`, `HYPOTHESIS` and `UNKNOWN` as distinct states. A source statement is not promoted to fact automatically.

## K–O. K2 integration and context control

The Housing fixture maps one knowledge unit to both `HOUSING` and `SPATIAL_COMPOSITION`. K3 reuses the canonical eleven SpatialScopes and uses `edificacion` plus the `CONCEPT` stage for the bounded fixture.

Context includes project, SpatialScope, typology, design stage, geography and other applicable dimensions. Missing applicability remains `UNKNOWN_APPLICABILITY`; contextual claims do not become global rules.

Room/building knowledge does not automatically become city, regional or country knowledge. Concept-stage strategy does not become construction-detail evidence.

## P. Provenance chain

Every fixture-derived candidate preserves:

```text
knowledgeUnitId
→ contentUnitId
→ sourceLocation
→ sourceId
→ source metadata
```

Provenance also preserves source class, source references, capture actor, deterministic timestamp and human-review state. Human corrections append provenance; they do not rewrite the original source content or extracted claim.

## Q–T. Extraction and human validation

K3 uses only `CONTROLLED_FIXTURE` and `DETERMINISTIC_TRANSFORMATION`. It does not use LLM extraction, OCR, PDF parsing or external providers.

The controlled lifecycle is:

```text
SOURCE
→ SOURCE CONTENT UNIT
→ KNOWLEDGE CANDIDATE
→ HUMAN VALIDATION
→ REUSABLE CONTEXT-BOUNDED KNOWLEDGE
```

Human actions supported by the proof are `CONFIRM`, `CORRECT`, `REJECT` and `LIMIT_CONTEXT`. Rejection leaves the candidate traceable but not reusable. Promotion requires explicit human validation through the existing K1 operation.

## U. Source authority control

Source type does not determine truth:

```text
BOOK ≠ TRUE BY DEFAULT
PAPER ≠ TRUE BY DEFAULT
STANDARD ≠ PROJECT APPLICABILITY
REGULATION ≠ APPLICABLE RULE
MANUAL ≠ UNIVERSAL REQUIREMENT
PRECEDENT ≠ PRESCRIPTION
```

The fixture source authority remains `UNKNOWN`; no source creates a requirement, compliance result or decision.

## V. Housing fixtures

`K3-FIXTURE-HOUSING-001` is a synthetic Book-type fixture stating that courtyard organization may support an interior-to-protected-outdoor relationship in some housing contexts.

Expected classification:

```text
SOURCE_STATEMENT = PRESENT
DOMAINS = HOUSING + SPATIAL_COMPOSITION
OUTPUT = STRATEGY_CANDIDATE
UNIVERSAL_RULE = NO
PROJECT_REQUIREMENT = NO
AUTOMATIC_DESIGN_OPERATION = NO
```

`K3-FIXTURE-HOUSING-002` is a synthetic source stating that compact organization may reduce circulation distance and external envelope in some housing contexts.

## W–AA. Bioclimatic, regulatory, precedent, author and measured-result boundaries

The K3 contract supports the following bounded classifications even though no external source is ingested:

| Fixture type | Classification | Prohibited inference |
|---|---|---|
| Bioclimatic cross-ventilation statement | Design principle / source statement | Project performance without computation or simulation |
| Controlled regulation clause | Regulatory requirement candidate | Automatic applicability or compliance |
| Synthetic precedent | Precedent observation / possible strategy candidate | Prescription or project requirement |
| Author opinion | Author position | Fact, universal rule or decision |
| Measured study result | Measured result with context and provenance | Same result for HOUSE-A21 |

## AB. Contradiction proof

Courtyard and compact positions coexist as separate knowledge units with separate provenance. K3 records a contradiction/trade-off:

```text
COURTYARD_POSITION = PRESERVED
COMPACT_POSITION = PRESERVED
CONTRADICTION = REPRESENTABLE
WINNER = NONE
```

No ranking, voting, consensus or source deletion occurs.

## AC–AE. Duplicate and multi-source controls

Sources with the same stable fingerprint are not duplicated. Identical source-derived claims from the same source and content unit are not duplicated. Similar claims from different sources would preserve separate provenance; multiple sources do not become a universal fact automatically.

## AF–AG. Temporal and rights metadata

Source metadata supports `CURRENT`, `UNKNOWN_VALIDITY` and `SUPERSEDED` without implementing a vigency engine. Rights metadata supports unknown, user-provided, licensed, public-domain, open-license, restricted, internal and other classifications. DRM, license enforcement and legal conclusions are not implemented.

## AH–AI. Shared library and specialist boundary

A single source identity may map to multiple K2 domains. Ownership is not assigned exclusively to ARKI, Housing or Bioclimatic specialists. K3 can classify future ownership as `ARKI_GENERAL`, `SPECIALIST_DEEP` or `CROSS_CUTTING`, but specialist agents and specialist routing remain inactive.

```text
SHARED SOURCE IDENTITY
→ MULTIPLE DOMAIN CLASSIFICATIONS
→ FUTURE MULTIPLE PERSPECTIVES
```

## AJ–AK. HOUSE-A21 and knowledge/design boundary

K3 can identify the Housing, Spatial Composition, Programming and Circulation relevance of the HOUSE-A21 question about moving KITCHEN farther from ACCESS while preserving LIVING_DINING.

It does not create:

```text
DESIGN DECISION
MOVE OPERATION
WINNER
```

The project-specific answer requires project evidence and Human Architect authority.

```text
SOURCE → KNOWLEDGE CANDIDATE → MAY INFORM REASONING
VALIDATED KNOWLEDGE → MAY INFORM STRATEGY
STRATEGY → MAY INFORM HYPOTHESIS
```

Knowledge is not a design operation, decision or winner.

## AL–AM. K1 and K2 compatibility

K1 remains unchanged and provides candidate creation, context bounding, human validation, rejection, feedback and provenance. K2 remains unchanged and provides domains, question taxonomy, SpatialScope mapping, design stages, output boundaries and evidence requirements. K3 does not fork either contract.

## AN. Federation and retrieval status

```text
KNOWLEDGE_FEDERATION = FROZEN / NOT ACTIVATED
SOURCE_LIBRARY = NOT IMPLEMENTED
FULL_SOURCE_STORAGE = NOT IMPLEMENTED
SOURCE_INGESTION_AT_SCALE = NOT_ACTIVATED
RETRIEVAL = NOT_ACTIVATED
RAG = NOT_ACTIVATED
EMBEDDINGS = NOT_ACTIVATED
VECTOR_DATABASE = NOT_ACTIVATED
SPECIALIST_AGENTS = NOT_ACTIVATED
SERVER_INFRASTRUCTURE = NOT_IMPLEMENTED
PERSISTENCE = NOT_IMPLEMENTED
```

No UI, source browser, upload page, knowledge dashboard or specialist selector was created.

## AO–AR. Validation

```text
FOCUSED_K3_TESTS = 8 passed
K1_REGRESSION = PASS
K2_REGRESSION = PASS
FULL_WEB_SUITE = 74 files / 364 tests passed
TYPESCRIPT = PASS
BUILD = PASS
git diff --check = PASS
```

## AS–AW. State and publication

```text
CORE_SHA = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE_SHA = 08e56363f897870128321a85e6533e568574646c
NEW_CANONICAL_ENTITY = NO
CORE_CONTRACT_CHANGED = NO
CORE_CHANGED = NO
WEB_CHANGED = YES
REAL_GATE = NOT_TRIGGERED
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

A single local commit is created after full validation. No publication is performed.
