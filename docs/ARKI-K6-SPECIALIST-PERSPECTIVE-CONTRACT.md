# ARKI-K6 — Specialist Perspective Contract & Controlled Domain Consultation

## A. Executive classification

K6 proves a controlled specialist perspective contract using the shared K4 Knowledge Store and K5 consultation assessment. It executes only deterministic Housing and Bioclimatic fixtures, returns domain-bounded findings to ARKI, preserves provenance and unknowns, and keeps Human Authority final.

```text
ARKI_K6 = PASS_WITH_OBSERVATIONS
SPECIALIST_PERSPECTIVE_CONTRACT = PROVEN
CONSULTATION_PLAN_CONSUMPTION = PROVEN
PERSPECTIVE_IDENTITY = PROVEN
DOMAIN_BOUNDARY = PASS
OUT_OF_SCOPE_CONTROL = PASS
BOUNDED_KNOWLEDGE_ACCESS = PASS
SHARED_KNOWLEDGE_STORE_REUSE = PASS
EVIDENCE_SUFFICIENCY = PROVEN
KNOWLEDGE_VS_PROJECT_EVIDENCE = SEPARATED
SPECIALIST_FINDING = PROVEN
FINDING_IDENTITY = PROVEN
FINDING_TRACEABILITY = PASS
EPISTEMIC_CONTROL = PASS
UNKNOWN_PRESERVATION = PASS
LIMITATION_REPORTING = PASS
CONTRADICTION_PRESERVATION = PASS
ADDITIONAL_PERSPECTIVE_DETECTION = PROVEN
HOUSING_PERSPECTIVE = PROVEN
BIOCLIMATIC_PERSPECTIVE = PROVEN
SAME_QUESTION_DIFFERENT_PERSPECTIVE = PASS
PROJECT_PERFORMANCE_WITHOUT_EVIDENCE = PROHIBITED
SPECIALIST_FACT_WITHOUT_SUPPORT = PROHIBITED
SPECIALIST_DECISION = PROHIBITED
SPECIALIST_WINNER = NONE
SPECIALIST_VOTING = PROHIBITED
SPECIALIST_SELF_PROMOTION = PROHIBITED
RETURN_TO_ARKI = PASS
```

## B. Baselines

```text
CORE = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE = da0fec4ec0d0748f3e8483957f4045f135c0f1e4
ARKI-K1 = CLOSED / FROZEN
ARKI-K2 = CLOSED / FROZEN
ARKI-K3 = CLOSED / FROZEN
ARKI-K4 = CLOSED / FROZEN
ARKI-K5 = CLOSED / PASS_WITH_OBSERVATIONS / FROZEN
KNOWLEDGE_FEDERATION = FROZEN / NOT ACTIVATED
SPECIALIST_AGENT_RUNTIME = NOT ACTIVATED
SPECIALIST_ROUTING_RUNTIME = NOT ACTIVATED
REAL_SOURCE_INGESTION = NOT ACTIVATED
A21-P4E = REAL_GATE / FROZEN AT GATE
```

## C. Reuse audit

K6 consumes K5's `KnowledgeNeedAssessment` and consultation-plan context rather than reclassifying the question independently. It reuses K4's shared store, eligibility, structured query, context matching, source traceback and project-experience traceback. It reuses K2 domains, evidence modes and output boundaries and K3 provenance/ownership.

No parallel specialist store, evidence system, HumanReview, Decision, domain taxonomy, provenance, source library or SpatialScope model was created.

## D–E. Generic contract and perspective identity

`SpecialistPerspective` is a bounded competence contract containing:

- perspective ID;
- domain IDs;
- competence depth;
- accepted question types;
- required evidence modes;
- allowed output types;
- K4 access scope;
- non-final authority boundary;
- controlled deterministic execution mode.

The two controlled identities are:

```text
HOUSING_PERSPECTIVE
BIOCLIMATIC_PERSPECTIVE
```

They are not personas, users, assistants, sessions, memories or agent identities.

## F–G. Domain boundary and consultation input

A consultation consumes the K5 question, relevant domains, selected perspective, project context, knowledge requirements, evidence requirements, available knowledge, available evidence, missing information, expected outputs and authority boundary.

Housing addresses domestic program, privacy, functional relationships, domestic circulation, spatial organization and housing typology. It does not assess seismic resistance, fire certification, legal compliance or HVAC performance.

Bioclimatic addresses climate-design relationships, orientation, solar/daylight principles, natural ventilation and passive strategies. It does not issue regulatory compliance findings.

## H–J. Bounded knowledge and evidence access

Each perspective queries the shared K4 store only for its declared domains and supplied project context. It does not receive the complete store by default. Only eligible validated K4 records are provided to the controlled consultation.

Evidence access is currently an explicit bounded list. Because no project evidence ingestion or computation engine is activated, project-specific performance remains unknown or open.

## K. Evidence sufficiency

The contract distinguishes:

```text
SUFFICIENT_FOR_GENERAL_INTERPRETATION
SUFFICIENT_FOR_CONTEXTUAL_INTERPRETATION
PARTIAL_EVIDENCE
INSUFFICIENT_EVIDENCE
COMPUTATION_REQUIRED
SIMULATION_REQUIRED
REGULATORY_SOURCE_REQUIRED
HUMAN_INPUT_REQUIRED
SPECIALIST_EVIDENCE_REQUIRED
```

Knowledge about cross ventilation is not evidence that HOUSE-A21 has adequate cross ventilation. Missing simulation does not become a simulated result.

## L–N. Finding contract, identity and types

`SpecialistFinding` contains a stable finding ID, consultation ID, perspective ID, domain IDs, finding type, statement, epistemic status, evidence sufficiency, knowledge IDs used, evidence IDs used, retrieved knowledge IDs, context, limitations, unknowns, contradictions, additional perspectives, answerability, non-final authority and explicit no-mutation flags.

Allowed controlled outputs include interpretation, source statement, trade-off, open question, unknown and strategy candidate. `DECISION`, `FINAL_RECOMMENDATION` and `APPROVED_SOLUTION` are not finding types.

A finding is not HumanReview, Decision or authorization.

## O–P. Epistemic control and provenance

Unsupported interpretations are never labeled as `FACT`. Project performance findings require actual project evidence and computation/simulation; otherwise K6 emits `UNKNOWN`, `OPEN_QUESTION` or a limitation.

Source-derived findings preserve:

```text
FINDING
→ KNOWLEDGE ID
→ KNOWLEDGE UNIT
→ SOURCE CONTENT
→ SOURCE LOCATION
→ SOURCE ID
```

Project-experience findings preserve:

```text
FINDING
→ PROJECT EXPERIENCE
→ PROJECT CONTEXT
→ HUMAN FEEDBACK / RESULT
→ PROVENANCE
```

Retrieved knowledge and knowledge used in the finding are exposed separately.

## Q–T. Limitations, unknowns, out-of-scope and additional perspectives

Every controlled finding reports what is assessed, available evidence, missing evidence, what is not assessed and remaining unknowns.

Housing structural resistance returns:

```text
OUT_OF_SCOPE
ADDITIONAL_PERSPECTIVE_NEEDED = STRUCTURAL
```

Bioclimatic legal compliance returns:

```text
OUT_OF_SCOPE
ADDITIONAL_PERSPECTIVE_NEEDED = REGULATORY
```

The perspective identifies the need; it does not impersonate the other domain.

## U–X. Housing perspective proofs

The Housing general fixture about the relationship between kitchen and dining produces a bounded contextual interpretation about domestic program, privacy, zoning and circulation.

The HOUSE-A21 fixture about moving KITCHEN farther from ACCESS preserves a trade-off between arrival/circulation, privacy and the Kitchen–Living/Dining relationship. It creates no move operation, no Decision and no winner.

The Housing structural question is explicitly out of scope and returns the need for Structural perspective.

## Y–AB. Bioclimatic perspective proofs

The general cross-ventilation fixture produces a general/domain interpretation involving pressure differences, openings, orientation, airflow paths and passive strategy. No simulation is required for this explanatory result.

The courtyard performance fixture returns `UNKNOWN` / `OPEN_QUESTION`. It preserves:

```text
PROJECT_PERFORMANCE = NOT_ESTABLISHED
NOT_COMPUTED
NOT_SIMULATED
```

No yes/no adequacy claim is produced. The regulatory fixture is out of scope and requests a Regulatory perspective.

## AC–AD. Same question and contradiction coexistence

The same courtyard question can be executed independently through Housing and Bioclimatic perspectives. Housing focuses on domestic organization and circulation; Bioclimatic focuses on environmental principles and missing performance evidence. Neither perspective synthesizes a winner.

Contradictory compact and courtyard positions remain traceable and coexist as possible trade-offs.

## AE–AF. Return to ARKI and authority

Every controlled finding includes:

```text
returnedToArki = true
authorityBoundary = NON_FINAL
noDecision = true
noHumanReview = true
noAuthorization = true
noKnowledgePromotion = true
```

ARKI remains the primary interlocutor. K6 does not expose a specialist as a mandatory user-facing assistant and does not implement synthesis of multiple findings; that belongs to K7.

## AG. Negative controls

The focused tests prove that:

- specialists do not become final authority;
- findings do not become Decisions, HumanReview or authorization;
- Housing does not assess structural resistance;
- Bioclimatic does not issue regulatory compliance;
- knowledge is not treated as project evidence;
- general knowledge is not promoted to performance result;
- missing computation/simulation remains missing;
- insufficient support does not become FACT;
- source and project experience remain bounded and traceable;
- contradictory knowledge is not collapsed;
- no winner, vote or final recommendation is created;
- no geometry or project mutation occurs;
- no knowledge promotion or specialist self-learning occurs;
- no specialist memory or source library is created;
- no source ingestion, RAG, embeddings or vector database is activated;
- no external LLM or multi-agent framework is used;
- no routing runtime, server, persistence or UI is created;
- A21-P4E is not continued.

## AH–AL. K1–K5 compatibility

K1, K2, K3, K4 and K5 remain frozen and regression-tested. K6 composes their contracts without altering validation, domains, evidence modes, source units, ownership, knowledge identity, retrieval, answerability or plan semantics.

## AM–AO. Federation and infrastructure status

```text
KNOWLEDGE_FEDERATION = FROZEN / NOT ACTIVATED
SPECIALIST_RUNTIME = NOT ACTIVATED
SPECIALIST_ROUTING_RUNTIME = NOT ACTIVATED
SOURCE_SERVER = NOT IMPLEMENTED
REAL_SOURCE_INGESTION = NOT ACTIVATED
RAG = NOT ACTIVATED
EMBEDDINGS = NOT ACTIVATED
VECTOR_DATABASE = NOT ACTIVATED
MULTI_AGENT_FRAMEWORK = NOT INSTALLED
PERSISTENCE = NOT IMPLEMENTED
UI = NOT IMPLEMENTED
```

## AP–AS. Validation

```text
FOCUSED_K6_TESTS = 11 passed
K1_REGRESSION = PASS
K2_REGRESSION = PASS
K3_REGRESSION = PASS
K4_REGRESSION = PASS
K5_REGRESSION = PASS
FULL_WEB_SUITE = 77 files / 395 tests passed
TYPESCRIPT = PASS
BUILD = PASS
git diff --check = PASS
```

## AT–AX. Final state

```text
CORE_SHA = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE_SHA = da0fec4ec0d0748f3e8483957f4045f135c0f1e4
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
