# ARKI-K7 — Multi-Perspective Synthesis & Architectural Trade-Off Integration

## A. Executive classification

K7 integrates two or more valid K6 findings for one architectural question. It classifies their relationship, preserves epistemic differences and limitations, structures trade-offs, and returns a provisional synthesis to ARKI and the Human Architect. It does not vote, rank, select a winner, create a Decision, execute follow-up consultation, or modify geometry.

```text
ARKI_K7 = PASS_WITH_OBSERVATIONS
MULTI_PERSPECTIVE_INPUT = PROVEN
FINDING_RELATIONSHIP_MODEL = PROVEN
AGREEMENT = PROVEN
COMPLEMENTARITY = PROVEN
INDEPENDENCE = PROVEN
DEPENDENCY = PROVEN
TENSION = PROVEN
CONTRADICTION = PROVEN
INSUFFICIENT_TO_RELATE = PROVEN
EPISTEMIC_ALIGNMENT = PASS
UNKNOWN_PRESERVATION = PASS
LIMITATION_PRESERVATION = PASS
PROVENANCE_PRESERVATION = PASS
SYNTHESIS_TRACEABILITY = PASS
ARCHITECTURAL_TRADEOFF = PROVEN
ARKI_INTEGRATED_SYNTHESIS = PROVEN
PROVISIONAL_ARCHITECTURAL_IMPLICATION = PROVEN
ADDITIONAL_PERSPECTIVE_DETECTION = PROVEN
AGREEMENT_CREATES_FACT = NO
TENSION_VS_CONTRADICTION = PASS
CONTRADICTION_CREATES_WINNER = NO
SPECIALIST_VOTING = PROHIBITED
WINNER = NONE
DECISION = NOT_CREATED
DESIGN_OPERATION = NOT_EXECUTED
HUMAN_AUTHORITY = PRESERVED
```

## B. Baselines

```text
CORE = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB = b872cca97cb57ad442d0b78c6dea4cac00798c0f
K1–K6 = CLOSED / FROZEN
KNOWLEDGE_FEDERATION = FROZEN / NOT ACTIVATED
SPECIALIST_AGENT_RUNTIME = NOT ACTIVATED
SPECIALIST_ROUTING_RUNTIME = NOT ACTIVATED
REAL_SOURCE_INGESTION = NOT ACTIVATED
A21-P4E = REAL_GATE / FROZEN AT GATE
```

## C. Inputs and reuse

K7 consumes one architectural question/context and at least two valid K6 `SpecialistFinding` records. It reuses K2 domain and output boundaries, K3 provenance, K4 identity and traceback, K5 consultation semantics and K6 authority, unknown, limitation and additional-perspective fields.

No parallel domain system, provenance system, specialist store, evidence model, decision model or agent runtime was created.

## D. Relationship taxonomy

The bounded relationship model supports:

- `AGREEMENT`: compatible claims about a comparable issue; it does not create fact or increase authority;
- `COMPLEMENTARY`: distinct but mutually informative dimensions;
- `INDEPENDENT`: relevant findings with no material support, opposition or dependency;
- `DEPENDENT`: a strategy or conclusion remains conditional on unresolved evidence;
- `TENSION`: legitimate considerations pull design in different directions without incompatible factual claims;
- `CONTRADICTION`: comparable findings make materially incompatible claims; both are preserved;
- `INSUFFICIENT_TO_RELATE`: context or evidence is insufficient to classify further.

The relationship records preserve both finding IDs, a structured reason and whether epistemic status differs.

## E. Epistemic alignment

K7 does not flatten findings into equal confidence. A contextual interpretation and an unknown performance result remain distinct. Agreement between interpretations does not become `FACT`; an interpretation plus `UNKNOWN` does not become a performance result; two source statements do not become a project fact.

## F. Trade-off model

`ArchitecturalTradeoff` records the question, finding IDs, domains, opportunity, cost/risk, dependency, required evidence, unknowns and `humanChoiceRequired = true`.

It contains no weighted score, ranking, utility function, majority vote, winner or automatic Pareto selection.

## G. Integrated synthesis contract

`ArkiIntegratedSynthesis` contains:

- stable synthesis identity;
- question and context;
- ordered finding IDs;
- perspectives consulted;
- relationship records;
- supported points;
- complementary points;
- tensions;
- contradictions;
- dependencies;
- independent points;
- unknowns;
- missing evidence;
- additional perspectives needed;
- trade-offs;
- provisional architectural implications;
- Human Architect authority boundary.

Every synthesis is marked as non-decisional and returned to ARKI.

## H. Courtyard proof: Housing + Bioclimatic

For the controlled courtyard question, Housing contributes domestic organization, privacy and circulation considerations. Bioclimatic contributes ventilation/passive-design considerations and preserves the absence of project-specific performance evidence.

The two findings are classified as `COMPLEMENTARY`, not as agreement. The environmental performance state remains:

```text
UNKNOWN
NOT_ESTABLISHED
NOT_COMPUTED
NOT_SIMULATED
```

No courtyard alternative is selected.

## I. Controlled relationship proofs

The focused tests prove:

- compatible Housing interpretations can be `AGREEMENT` without becoming fact;
- Housing privacy and Bioclimatic ventilation can be `COMPLEMENTARY`;
- openness versus privacy/separation can be `TENSION`;
- explicit open/closed claims can be `CONTRADICTION` with both preserved;
- a strategy candidate pending unknown performance can be `DEPENDENT`;
- unrelated relevant domains can be `INDEPENDENT`;
- incomparable project contexts produce `INSUFFICIENT_TO_RELATE`.

## J. Traceability and limitations

Finding IDs are preserved in each relationship and synthesis. K6 knowledge IDs, evidence IDs, context, limitations and unknowns remain attached to the input findings and are not replaced by synthetic claims.

K7 may report missing computation, simulation, regulatory evidence, project evidence or another perspective. It does not execute any of them.

## K. Additional perspectives and Human Authority

If a finding reports `STRUCTURAL` or `REGULATORY` as an additional perspective, K7 carries that requirement forward. It does not automatically consult or create another perspective.

The final boundary remains:

```text
HUMAN_ARCHITECT = FINAL_AUTHORITY
HUMAN_CHOICE_REQUIRED = true
```

A provisional architectural implication is not a Decision, design operation, authorization, approved solution or knowledge promotion.

## L. Negative controls

K7 explicitly prohibits:

- voting, majority, consensus score or specialist weighting;
- ranking, winner selection or hidden ARKI preference;
- conversion of agreement into fact;
- conversion of tension into contradiction;
- resolution of contradiction by confidence or majority;
- removal of `UNKNOWN` or limitations;
- unsupported performance claims;
- automatic additional-specialist execution;
- computation, simulation, source search or regulatory lookup;
- design modification or geometry mutation;
- HumanReview, Decision or authorization creation;
- knowledge promotion or self-reinforcement;
- source ingestion, RAG, embeddings or vector database;
- production agent runtime, routing runtime, server, persistence or UI;
- continuation of A21-P4E.

## M. Non-activated capability status

```text
KNOWLEDGE_FEDERATION = FROZEN / NOT ACTIVATED
REAL_SOURCE_INGESTION = NOT ACTIVATED
RAG = NOT ACTIVATED
EMBEDDINGS = NOT ACTIVATED
VECTOR_DATABASE = NOT ACTIVATED
SPECIALIST_AGENT_RUNTIME = NOT ACTIVATED
MULTI_AGENT_FRAMEWORK = NOT IMPLEMENTED
SPECIALIST_ROUTING_RUNTIME = NOT ACTIVATED
SERVER_INFRASTRUCTURE = NOT IMPLEMENTED
PRODUCTION_PERSISTENCE = NOT IMPLEMENTED
UI = NOT IMPLEMENTED
CORE_CONTRACT_CHANGED = NO
NEW_CANONICAL_ENTITY = NO
```

## N. Validation record

```text
FOCUSED_K7_TESTS = 10 passed
K1_REGRESSION = PASS
K2_REGRESSION = PASS
K3_REGRESSION = PASS
K4_REGRESSION = PASS
K5_REGRESSION = PASS
K6_REGRESSION = PASS
FULL_WEB_SUITE = 78 files / 405 tests passed
TYPESCRIPT = PASS
BUILD = PASS
GIT_DIFF_CHECK = PASS
```

## O. Final state before commit

```text
CORE_SHA = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE_SHA = b872cca97cb57ad442d0b78c6dea4cac00798c0f
LOCAL_COMMIT = CREATED_AFTER_VALIDATION
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```
