# ARKI-K1 — Architectural Learning & Knowledge Feedback Foundation

## A. Executive classification

ARKI-K1 is **PASS_WITH_OBSERVATIONS**. A minimum deterministic architectural learning contract was implemented as an in-memory read model. It records project-specific experience and human feedback with context and provenance. It prevents automatic generalization, automatic promotion, silent contradiction resolution and conversion of hypotheses into validated knowledge.

This is not source ingestion, retrieval, RAG, a vector database, a knowledge graph, a training system or a new UI. Knowledge Federation remains frozen. A21-P4E remains an independent `REAL_GATE / FROZEN AT GATE`.

## B. Baselines

| Repository | Branch | SHA | Change |
|---|---|---|---|
| Core | `feat/weather-environmental-context-p1` | `646dae525dd1db4b9f357aced21cc1302fc791a0` | None |
| Web | `feat/spatial-pilot-media-studio-v1` | `e8ae98ca9fc00f4a2f278056b09daf3fa08a9418` before K1 | K1 implementation |

## C. Reuse audit

K1 reuses `DesignMemory` for project memory, A21 program and relationship semantics for the HOUSE-A21 context, existing epistemic vocabulary such as `HUMAN_CONFIRMED`, `AI_PROPOSED`, `HYPOTHESIS`, `UNKNOWN` and `CONFLICTING`, existing provenance arrays, and existing A21 human-authority invariants. HumanReview remains the existing conceptual boundary; K1 does not create a second review system. Existing Evidence remains the evidence boundary; K1 does not create a second evidence system.

The minimum K1 read model was necessary because the existing contracts did not provide a single deterministic, typed composition for experience, source authority, context-bounded reuse and controlled knowledge-candidate promotion. No persisted entity was required.

## D. Existing epistemic infrastructure

The current system already distinguishes human-confirmed intent, observed geometry, derived relations, AI proposals, hypotheses, unknowns and conflicts. DesignMemory preserves branches, entries, trade-offs, unresolved questions, provenance and explicit human decisions. A21 preserves program, relationship, zoning and circulation intent without mutating geometry. K1 composes those surfaces rather than replacing them.

## E. Minimum K1 representation

The implementation provides typed records for `K1Context`, `K1Provenance`, `K1HumanFeedback`, `K1ExperienceRecord`, `K1KnowledgeCandidate`, `K1Contradiction` and `K1LearningReadModel`. The model carries project, scale, typology, stage, context, problem, intent, proposal, human action, observations, changes, unknowns, conflicts, source references and review status.

The implementation is deterministic. Timestamps in the bounded fixture are fixed. Persistence is intentionally absent, as authorized by K1.

## F–I. Experience, context, provenance and feedback

An experience is always project-specific at capture. Its default reuse state is `PROJECT_ONLY`. Missing context yields `UNKNOWN_APPLICABILITY`; it does not yield applicability by inference. Provenance records source class, source references, capture actor, capture time, evidence references and human review state.

Human feedback is represented separately from experience and is then linked into the project memory composition. A correction is a human action in a project context. It is not a universal rule.

## J–K. Knowledge candidate and promotion

A knowledge candidate remains `KNOWLEDGE_CANDIDATE`, `NOT_VALIDATED` and `CANDIDATE` until an explicit human validation operation is supplied. The model exposes a separate `validateKnowledgeCandidate` operation that requires `humanConfirmed = true`. ARKI cannot promote its own hypothesis.

No score, ranking, winner or automatic recommendation was introduced.

## L. Reuse eligibility

Eligibility is bounded by project, spatial scope, typology and design stage. A matching HOUSE-A21 context remains `PROJECT_ONLY`, because project memory is not general knowledge. A different project or incomplete context returns `UNKNOWN_APPLICABILITY`.

## M–R. Contradictions, unknowns and separation boundaries

Compact-mass and courtyard-mass strategies are preserved together as a contradiction with an unresolved trade-off. No winner or decision is created. Incomplete applicability remains `UNKNOWN_APPLICABILITY`. Regulation, simulation and design decisions remain separate from knowledge candidates. A knowledge statement may inform a hypothesis; it is not a simulation result, compliance claim or project decision.

Project memory remains distinct from general knowledge. Human selection remains a project decision and does not create general knowledge.

## S. HOUSE-A21 learning fixture

The fixture reuses the HOUSE-A21 semantic context without depending on P4E. It records the following controlled correction:

> Increase the separation between KITCHEN and ACCESS while preserving the preferred relationship between KITCHEN and LIVING_DINING.

The original ARKI proposal is recorded as `KITCHEN placed near ACCESS`. The human action is `CORRECTED`. The experience remains `PROJECT_ONLY`, with unknowns for construction-level containment and regulatory applicability.

## T. Positive control

The positive control proves:

```text
HUMAN_FEEDBACK
→ PROJECT_EXPERIENCE
→ TRACEABLE_PROVENANCE
→ CONTEXT_BOUNDARY
→ PROJECT_ONLY REUSE ELIGIBILITY
```

The A21 proof remains read-only with no geometry creation, decision creation, winner creation or regulatory claim.

## U–Z. Negative controls

| Control | Expected result | Result |
|---|---|---|
| Generalization | HOUSE-A21 correction does not become a global kitchen rule | Pass |
| Source authority | A hypothetical book statement remains a candidate and does not create a requirement | Pass |
| Contradiction | Compact and courtyard strategies both remain; no winner | Pass |
| Unknown applicability | Incomplete or different context remains unknown | Pass |
| AI self-learning | ARKI hypothesis may enter experience but cannot become validated knowledge | Pass |
| Human selection | Selecting an alternative remains a project decision and creates no general knowledge | Pass |

## AA–AD. Validation

```text
FOCUSED_K1_TESTS = 4 passed
FULL_WEB_SUITE = 72 files / 347 tests passed
TYPESCRIPT = PASS
BUILD = PASS
git diff --check = PASS
```

## AE–AI. State and publication

```text
CORE_SHA = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE_SHA = e8ae98ca9fc00f4a2f278056b09daf3fa08a9418
WEB_FINAL_SHA = recorded in the K1 local commit
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

K2, source ingestion, retrieval, books, RAG, Knowledge Federation, specialist activation, A21-P4R and P4E continuation are not activated.

## Final classification

```text
ARKI_K1 = PASS_WITH_OBSERVATIONS
ARCHITECTURAL_LEARNING_CONTRACT = PROVEN
PROJECT_EXPERIENCE = PROVEN
HUMAN_FEEDBACK_CAPTURE = PROVEN
CONTEXT_BOUNDING = PROVEN
PROVENANCE = PROVEN
KNOWLEDGE_CANDIDATE = PROVEN
CONTROLLED_PROMOTION = PROVEN
AUTOMATIC_PROMOTION = PROHIBITED
GENERALIZATION_CONTROL = PASS
CONTRADICTION_PRESERVATION = PASS
UNKNOWN_PRESERVATION = PASS
PROJECT_MEMORY_VS_GENERAL_KNOWLEDGE = SEPARATED
SOURCE_AUTHORITY_CONTROL = PASS
AI_SELF_REINFORCEMENT_CONTROL = PASS
HUMAN_AUTHORITY = PRESERVED
KNOWLEDGE_FEDERATION = FROZEN
SOURCE_INGESTION = NOT_ACTIVATED
RETRIEVAL = NOT_ACTIVATED
RAG = NOT_ACTIVATED
EMBEDDINGS = NOT_ACTIVATED
VECTOR_DATABASE = NOT_ACTIVATED
MODEL_TRAINING = NOT_ACTIVATED
A21_P4E = REAL_GATE_FROZEN
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
