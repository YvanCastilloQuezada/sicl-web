# ARKI-K5 — Knowledge Need Detection & Specialist Consultation Planning

## A. Executive classification

K5 proves that ARKI can determine what knowledge and evidence a question requires before answering or acting. It composes K2 question classification with K4 deterministic retrieval and produces a bounded, explainable assessment plus a consultation plan. It does not execute specialists, create agents, mutate projects or make decisions.

```text
ARKI_K5 = PASS_WITH_OBSERVATIONS
KNOWLEDGE_NEED_ASSESSMENT = PROVEN
COMPETENCE_CLASSIFICATION = PROVEN
ARKI_GENERAL_DETECTION = PROVEN
SPECIALIST_DEEP_DETECTION = PROVEN
CROSS_CUTTING_DETECTION = PROVEN
MULTI_PERSPECTIVE_DETECTION = PROVEN
HUMAN_ONLY_DETECTION = PROVEN
INSUFFICIENT_INFORMATION_DETECTION = PROVEN
DOMAIN_VS_COMPETENCE = SEPARATED
QUESTION_DEPTH_CONTROL = PASS
EVIDENCE_NEED_DETECTION = PROVEN
KNOWLEDGE_AVAILABILITY = PROVEN
MISSING_INFORMATION = PROVEN
ANSWERABILITY = PROVEN
SPECIALIST_PERSPECTIVE_IDENTIFICATION = PROVEN
PERSPECTIVE_MINIMIZATION = PASS
SPECIALIST_NEED_EXPLANATION = PASS
SPECIALIST_NON_NEED_EXPLANATION = PASS
CONSULTATION_PLAN = PROVEN
CONSULTATION_PLAN_DETERMINISM = PASS
MULTI_PERSPECTIVE_PLAN = PROVEN
CONTRADICTION_PRESERVATION = PASS
SPECIALIST_VOTING = PROHIBITED
SPECIALIST_WINNER = NONE
SPECIALIST_EXECUTION = NOT_ACTIVATED
```

## B. Baselines

```text
CORE = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE = 6e59891fe616f5bd966c6245eb457a2be0058a2f
ARKI-K1 = CLOSED / FROZEN
ARKI-K2 = CLOSED / FROZEN
ARKI-K3 = CLOSED / FROZEN
ARKI-K4 = CLOSED / PASS_WITH_OBSERVATIONS / FROZEN
KNOWLEDGE_FEDERATION = FROZEN / NOT ACTIVATED
SPECIALIST_AGENTS = NOT ACTIVATED
SPECIALIST_ROUTING = NOT ACTIVATED
SOURCE_LIBRARY = NOT IMPLEMENTED
SERVER_INFRASTRUCTURE = NOT IMPLEMENTED
A21-P4E = REAL_GATE / FROZEN AT GATE
```

## C. Reuse audit

K5 reuses K2's question classification, canonical domains, evidence modes, faculties, SpatialScopes, stages and output boundaries. It consumes K4's deterministic query, match classification, eligibility, origin and provenance. It preserves K3 ownership and provenance and K1's human-authority boundary. No second question taxonomy, domain taxonomy, evidence taxonomy, knowledge store, provenance system, HumanReview or Decision model was created.

## D. KnowledgeNeedAssessment

The bounded assessment records:

- original question and stable question ID;
- K2 classification;
- relevant domains;
- competence class;
- evidence needs;
- K4 knowledge availability;
- available knowledge IDs and match results;
- missing information;
- answerability;
- whether specialist depth is required;
- consultation plan;
- explicit no-decision, no-design-operation and no-promotion invariants.

## E–F. Competence and domain separation

Supported competence classes are:

```text
ARKI_GENERAL
SPECIALIST_DEEP
CROSS_CUTTING
MULTI_PERSPECTIVE
HUMAN_ONLY
INSUFFICIENT_INFORMATION
```

A domain does not determine competence by itself. The same bioclimatic domain produces different outcomes depending on question depth:

| Question | Competence | Result |
|---|---|---|
| What is cross ventilation? | ARKI_GENERAL | General explanation possible |
| What strategies influence daylight? | ARKI_GENERAL / CROSS_CUTTING | Strategy discussion with stated limits |
| Will this room achieve required performance? | Specialist/deeper evidence | Project evidence, computation or simulation required |

## G. Question-depth control

K5 distinguishes definitions and general explanations from project-specific performance claims. Structural definition is not structural resistance assessment. A regulatory explanation is not project compliance. A material principle is not certified assembly performance.

No keyword-only routing is used as an authority mechanism. The assessment considers intent, depth, domains, context and evidence modes.

## H–K. Evidence, availability, missing information and answerability

K5 reuses K2 evidence modes:

```text
GENERAL_KNOWLEDGE_ALLOWED
SOURCE_REQUIRED
PROJECT_EVIDENCE_REQUIRED
COMPUTATION_REQUIRED
SIMULATION_REQUIRED
REGULATORY_SOURCE_REQUIRED
HUMAN_INPUT_REQUIRED
SPECIALIST_EVIDENCE_REQUIRED
UNKNOWN_IF_MISSING
```

It distinguishes relevant, partial, unavailable, context-insufficient and unvalidated knowledge from actual answerability. Available knowledge does not imply that a performance question is answerable.

Missing information is explicit, including project context, source, project evidence, computation, simulation, regulatory source, jurisdiction, human input and specialist evidence.

Answerability is bounded by states such as:

```text
ANSWERABLE_WITH_ARKI_GENERAL
ANSWERABLE_WITH_AVAILABLE_KNOWLEDGE
PARTIALLY_ANSWERABLE
REQUIRES_SPECIALIST_CONSULTATION
REQUIRES_ADDITIONAL_EVIDENCE
REQUIRES_COMPUTATION
REQUIRES_SIMULATION
REQUIRES_REGULATORY_SOURCE
REQUIRES_HUMAN_INPUT
NOT_CURRENTLY_ANSWERABLE
```

## L. Specialist perspective registry

Perspectives are conceptual competence requirements, not agents. K5 can identify perspectives such as Housing, Bioclimatic, Structural, Regulatory, Accessibility, Material and Economics while preserving the shared knowledge architecture.

No user account, agent identity, memory, prompt runtime, session or specialist chatbot is created.

## M–N. Consultation plan and questions

Every plan includes a stable question ID, domains, competence, required perspectives, evidence requirements, available knowledge IDs, missing information, questions for future consultation, expected outputs, human authority boundary and:

```text
executionStatus = PLANNED_NOT_EXECUTED
```

Consultation questions are neutral and non-leading. For example:

> Assess whether the available geometry, orientation, openings and climate evidence are sufficient to evaluate the environmental question.

The plan does not ask a specialist to confirm a preferred solution or select a winner.

## O. Expected outputs

Future consultation outputs may include:

```text
FACT
SOURCE_STATEMENT
INTERPRETATION
PERFORMANCE_RESULT
CONSTRAINT
TRADEOFF
RISK
OPEN_QUESTION
UNKNOWN
STRATEGY_CANDIDATE
```

`DECISION` is excluded. Specialist finding, specialist recommendation and specialist consensus remain distinct from Human Architect decision.

## P–Q. Perspective minimization and multi-perspective planning

K5 plans the minimum sufficient perspectives. A simple adjacency question does not summon structural, regulatory, material, accessibility, landscape and economic perspectives without a material reason.

An economic courtyard trade-off can produce a multi-perspective plan containing Architectural/Housing and Economics, with Bioclimatic only when the actual question requires it. Each perspective includes a reason, question, evidence requirement and expected output.

No voting, majority rule, consensus engine, hierarchy or winner selection exists.

## R–T. Determinism, contradictions and human authority

The same question, context and K4 state produce the same competence class, perspectives, evidence requirements, missing-information set and ordering.

Contradictory K4 knowledge remains available as a preserved trade-off. Human authority remains final for preference, acceptance, authorization, design selection and Decision creation.

## U–V. Housing and HOUSE-A21 proofs

A general kitchen/dining relationship question is classified as `ARKI_GENERAL` without specialist execution.

The HOUSE-A21 question about moving KITCHEN farther from ACCESS while preserving LIVING_DINING is classified as a general architectural question requiring project evidence and possibly human input. K4 retrieval remains available, but K5 creates no move operation, no Decision and no winner.

## W–X. Bioclimatic proofs

A definition of cross ventilation is answerable with general ARKI competence and does not require simulation. A question about whether a specific courtyard provides adequate natural ventilation requires project evidence and may require computation, simulation and specialist evidence. No adequacy result is produced.

## Y–Z. Structural proofs

A structural grid definition remains general. A question about earthquake resistance is classified as `SPECIALIST_DEEP`, requires project evidence, computation and specialist evidence, and is not answerable by ARKI general competence alone.

## AA–AB. Regulatory and accessibility proofs

A bedroom compliance question requires regulatory source, project evidence, jurisdiction and source version/applicability. Without them it is not currently answerable and no compliance result is created.

An accessibility question requires route geometry, route properties and applicable criteria. No accessibility claim is produced without evidence.

## AC–AD. Material and economic proofs

General facade-material considerations can be discussed by ARKI general competence. Exact fire performance of an assembly requires material, test/certification and potentially life-safety or regulatory evidence.

A courtyard enlargement question constrained by moderate construction cost is `MULTI_PERSPECTIVE`; it produces trade-off questions and a consultation plan, not a winner.

## AE–AF. Human preference and authorization

Preference questions are `HUMAN_ONLY`. ARKI may compare alternatives but cannot infer preference. Authorization questions require explicit Human Architect input; K5 never executes a modification.

## AG. Negative controls

The focused tests prove that:

- domain alone does not determine specialist need;
- keyword alone does not determine specialist need;
- general questions do not trigger unnecessary specialists;
- performance questions do not become general answers;
- knowledge availability does not imply answerability;
- missing evidence is not fabricated;
- missing source does not trigger ingestion;
- missing computation or simulation does not become a result;
- regulatory questions do not become compliance claims;
- plans do not execute specialists or create agents;
- expected outputs exclude Decision;
- multi-perspective plans do not vote;
- no winner, hierarchy or automatic promotion is created;
- projects, geometry, Decision and HumanReview are not mutated;
- no external search, RAG, embeddings, vector database, server, persistence or UI is added;
- A21-P4E is not continued.

## AH–AK. K1–K4 compatibility

K1, K2, K3 and K4 remain frozen and regression-tested. K5 composes their contracts without changing domains, evidence modes, source provenance, validation, knowledge identity, eligibility, query or retrieval.

## AL–AN. Federation, specialists and infrastructure

```text
KNOWLEDGE_FEDERATION = FROZEN / NOT ACTIVATED
SOURCE_INGESTION = NOT ACTIVATED
RAG = NOT ACTIVATED
EMBEDDINGS = NOT ACTIVATED
VECTOR_DATABASE = NOT ACTIVATED
SPECIALIST_AGENTS = NOT ACTIVATED
SPECIALIST_ROUTING_RUNTIME = NOT ACTIVATED
SERVER_INFRASTRUCTURE = NOT IMPLEMENTED
PRODUCTION_PERSISTENCE = NOT IMPLEMENTED
NEW_UI = NOT IMPLEMENTED
```

## AO–AR. Validation

```text
FOCUSED_K5_TESTS = 10 passed
K1_REGRESSION = PASS
K2_REGRESSION = PASS
K3_REGRESSION = PASS
K4_REGRESSION = PASS
FULL_WEB_SUITE = 76 files / 384 tests passed
TYPESCRIPT = PASS
BUILD = PASS
git diff --check = PASS
```

## AS–AW. Final state

```text
CORE_SHA = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE_SHA = 6e59891fe616f5bd966c6245eb457a2be0058a2f
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
