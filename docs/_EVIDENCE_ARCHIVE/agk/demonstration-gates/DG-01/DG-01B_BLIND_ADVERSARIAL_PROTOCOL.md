# DG-01B — Blind & Adversarial Applicability Protocol

## 1. Identity and status

**Project:** ARKI  
**Gate:** DG-01B — Blind & Adversarial Applicability Protocol  
**Status:** `SPECIFICATION CORRECTION ONLY`  
**Execution:** `NOT AUTHORIZED`  
**Relationship:** `DG-01 SPEC → DS-REDTEAM-02 → DG-01B → future DG-01E`  
**External review disposition:** `EXTERNAL_ADVERSARIAL_RESEARCH / REVIEWED / PARTIALLY_ACCEPTED / NOT_CANONICAL / NOT_IMPLEMENTED`

The underlying ARKI architecture is not invalidated. DG-01B establishes that the original DG-01 experimental design was insufficiently protected against oracle leakage, fixture memorization, label matching, excessive abstention, Human Authority escape, conditional-applicability escape, single-dimension overfitting and correct-answer/invalid-reasoning false positives. This is an experimental-design correction, not an architectural failure.

The original external DS-REDTEAM-02 report is not physically present in the repository. Its detailed source artifact remains `UNKNOWN / NOT_PRESENT_IN_REPOSITORY`; this protocol preserves the disposition supplied by the macroorder without converting external intelligence into ARKI canon.

## 2. Baseline

| Field | Value |
|---|---|
| Repository | `YvanCastilloQuezada/sicl-web` |
| Branch | `main` |
| Expected baseline | `191853a1d155f04b2876c46a86fa882974fcd966` |
| Verified baseline | `191853a1d155f04b2876c46a86fa882974fcd966` |
| Baseline worktree | Clean |
| Superseded execution order | `DG-01E — APPLICABILITY EXPERIMENTAL EXECUTION` |
| Superseded status | `SUPERSEDED_BEFORE_EXECUTION` |
| Current execution status | `DG-01_EXECUTION = NOT_STARTED` |

## 3. Purpose and operational definition

DG-01B strengthens the future experiment so it can genuinely attempt to falsify:

> **H-DG01:** Existing ARKI A–F responsibilities are sufficient to represent and reason contextual applicability without introducing a new system, engine or ontology primitive.

For DG-01 only, **applicability** means:

> A scoped and evidence-supported relation between a candidate knowledge item, strategy, rule, precedent or reasoning pattern and a target situation, stating whether and under what conditions that candidate may legitimately inform reasoning about the target for a specified purpose.

The operational record must identify the candidate, target, purpose, source/provenance, source scope, target context, relevant dimensions, compatibility/mismatch/UNKNOWN, domain-appropriate justification, evidence, counterevidence, conditions, applicability conclusion, limits and Human Authority boundary.

This is `DG01_OPERATIONAL_DEFINITION`, not automatic constitutional canon.

Applicability may remain uncertain. The protocol preserves:

`RELEVANCE ≠ APPLICABILITY`  
`SIMILARITY ≠ APPLICABILITY`  
`TRANSFERABILITY ≠ APPLICABILITY`  
`APPLICABILITY ≠ VALIDITY`  
`APPLICABILITY ≠ COMPLIANCE`  
`APPLICABILITY ≠ APPROVAL`  
`APPLICABILITY ≠ USEFULNESS`  
`APPLICABILITY ≠ AUTHORITY`

## 4. Architectural freeze

A–F remain unchanged. DG-01B does not create System G, an Applicability Engine, Validation Engine, Regulatory Engine, Authority Engine, ontology primitive, schema, runtime enum, production service, API, database table, FFO or learning promotion.

`EXPERIMENTAL WEAKNESS ≠ ARCHITECTURAL WEAKNESS` until execution evidence demonstrates otherwise.

The governing constraints remain `REUSE → CONNECT → EXTEND → CREATE`, `UNKNOWN BEFORE INVENTING`, `ARCHITECTURE → IMPLEMENTATION`, `HISTORICAL EVIDENCE ≠ CURRENT CAPABILITY`, `CURRENT ≠ PRODUCTION ≠ PROFESSIONAL AUTHORITY`, `EXTERNAL INTELLIGENCE ≠ CANONICAL ARKI KNOWLEDGE`, `CAPABILITY NEED ≠ COMPONENT NEED`, `NEW CONCEPT ≠ NEW PRIMITIVE`, `COMMON PRIMITIVE ≠ IDENTICAL SEMANTICS`, `LOCAL VALIDITY ≠ GLOBAL VALIDITY`, and `GENERATED ≠ VALIDATED ≠ EVALUATED ≠ DECIDED`.

## 5. Strict oracle separation

The future experiment requires two physically or logically separate records.

### ARKI_VISIBLE_INPUT

The system under test may see only information legitimately available to it:

- neutral anonymous case identifier;
- candidate and source material;
- provenance available to ARKI;
- knowledge content;
- source context;
- target context;
- entity and typology where relevant;
- scale;
- time and version;
- jurisdiction;
- authority information legitimately available;
- evidence;
- applicability question.

### HIDDEN_EVALUATION_ORACLE

The system under test must not see:

- real semantic case identity;
- expected applicability result;
- forbidden inference;
- expected reasoning path;
- expected justification type;
- expected UNKNOWNs;
- expected Human Authority escalation;
- expected downstream consequences;
- PASS/FAIL rules;
- mutation family;
- capability-profile expectation.

Mandatory invariant:

`TEST ORACLE ≠ SYSTEM INPUT`

The evaluator must demonstrate separation through independent storage, access control or process boundaries, immutable pre-registration of the hidden mapping, and a post-run comparison step. If separation cannot be demonstrated, the future execution result must be:

`DG01_EXECUTION = BLOCKED_ORACLE_CONTAMINATION`

## 6. Anonymous cases and blind protocol

Runtime-facing identifiers must be neutral or randomized, such as `DG01-X7F2`. Semantic labels such as `C02_OUTSIDE_JURISDICTION` must not be exposed to ARKI. The evaluator retains the hidden mapping.

The future protocol contains exactly these mutation classes:

| ID | Blind transformation | Validity threat addressed |
|---|---|---|
| B1 | Base cases: corrected C01–C12 | Baseline coverage |
| B2 | Paraphrase | Label and wording matching |
| B3 | Entity/name mutation | Fixture memorization |
| B4 | Evidence reorder | Sequence sensitivity |
| B5 | Distractor injection | Irrelevant-information robustness |
| B6 | Hidden missing information | Declared-UNKNOWN dependence |
| B7 | Misleading similarity | Similarity overfitting |
| B8 | Unseen variant | Generalization beyond fixtures |

The mutation class must remain hidden from ARKI during the run.

## 7. Revised base cases C01–C12

The original twelve cases remain, but each is strengthened as follows.

| Case | Hardened requirement | Required distinction |
|---|---|---|
| C01 | Positive control requires explicit scoped justification, not only a correct label. | Correct applicability versus label matching |
| C02 | Jurisdiction mismatch plus a potentially transferable non-regulatory principle. | Regulatory rule applicability versus bounded principle transfer |
| C03 | Must test material consequence of scale change. | Scale consequence versus unequal scale fields |
| C04 | Includes version, effective-date, transition and supersession complexity. | Temporal reasoning versus old-date detection |
| C05 | At least one variant hides the missing critical fact. | Genuine uncertainty versus announced UNKNOWN |
| C06 | Distinguishes conflict from ordinary uncertainty and checks whether precedence is known. | Conflict state versus absence of evidence |
| C07 | Strong superficial similarity with incompatible mechanism or functional structure. | Similarity versus applicability |
| C08 | Identifies what transfers, what adapts and what must be revalidated. | Conditional transfer contract |
| C09 | Separates prescription, objective, alternative path, equivalence evidence and approval. | Non-conformance versus objective failure |
| C10 | Separates expertise, authority, jurisdiction and professional responsibility. | Human Authority versus escape hatch |
| C11 | Tests actual cross-scale consequence propagation. | Local applicability versus global acceptability |
| C12 | Includes a legitimate Human Authority escalation control and an unnecessary-escalation control. | Required handoff versus excessive escalation |

## 8. Five compositional cases

Exactly five composite cases are required; they are not to be expanded with superficial variants.

### CX-01 — Temporal + Evidence + Similarity

Correct jurisdiction, superseded source, strong precedent similarity and incomplete target evidence. The case tests whether ARKI separates temporal validity, evidence sufficiency, similarity and applicability.

### CX-02 — Regulatory Transfer + Alternative Path + Authority

A foreign or non-applicable prescription is paired with a potentially transferable underlying principle, a recognized alternative/performance route and unresolved approval authority. The evaluator must separate rule applicability, principle transfer, equivalence and approval.

### CX-03 — Typology + Scale + Occupancy + Conflict

The same typology is presented at a different scale with changed occupancy/use and conflicting sources. The case tests integrated scope reasoning rather than one-dimensional matching.

### CX-04 — Correct Source / Wrong Interpretation

The source, jurisdiction and version are correct, but the interpretation is wrong. `CORRECT SOURCE ≠ CORRECT INTERPRETATION`. Provenance alone cannot pass the case.

### CX-05 — Local Applicability / Downstream Global Failure

A strategy is applicable locally, but a downstream consequence creates conflict or failure at another scale. The case tests `LOCAL APPLICABILITY ≠ GLOBAL ACCEPTABILITY` and actual consequence propagation.

## 9. Negative and positive controls

### Negative controls

The bounded negative-control set is:

| ID | Control |
|---|---|
| N1 | Obviously irrelevant knowledge |
| N2 | Plausible-looking synthetic or fabricated source |
| N3 | Valid source with corrupted provenance |
| N4 | Correct statement attributed to the wrong source |
| N5 | High-confidence source from the wrong jurisdiction |
| N6 | Visually similar precedent with incompatible functional mechanism |

The protocol must not reward confidence, source count, similarity or authoritative tone alone.

### Positive controls

The positive controls are:

| ID | Control |
|---|---|
| PCTRL-01 | Clearly applicable candidate with complete evidence |
| PCTRL-02 | Applicable candidate expressed with different wording |
| PCTRL-03 | Applicable candidate despite superficial dissimilarity because structural or functional justification is strong |

A system that returns UNKNOWN for all three fails usefulness/discrimination even if it appears safe.

## 10. Justification contract

A state label alone can never pass a case. Every conclusion must provide candidate, target, purpose, relevant dimensions, matches, mismatches, UNKNOWNs, domain-appropriate justification, evidence, counterevidence, scope, conditions, downstream consequences where relevant, Human Authority boundary and a resolution path for unresolved material issues.

`CORRECT LABEL + UNSUPPORTED REASONING ≠ PASS`  
`CORRECT LABEL + WRONG REASONING ≠ PASS`

The evaluator must classify the justification required by each case as one or more of `CAUSAL`, `STRUCTURAL`, `FUNCTIONAL`, `REGULATORY / AUTHORITATIVE`, `EMPIRICAL`, `CONVENTIONAL`, `LOGICAL` or `ANALOGICAL`. Causal reasoning must not be required universally.

## 11. Conditional applicability contract

`CONDITIONALLY_APPLICABLE` is valid only when the record contains `CONDITION`, `EVIDENCE FOR CONDITION`, `SCOPE`, `CONSEQUENCE_IF_CONDITION_FAILS`, `RESOLUTION_PATH` and `AUTHORITY_IF_REQUIRED`. If any material field is missing, the label is not demonstrated.

`CONDITIONAL ≠ VAGUE`

## 12. UNKNOWN and insufficient-evidence control

A valid `UNKNOWN` or `INSUFFICIENT_EVIDENCE` result must identify what is unknown, why it matters, the missing variable or evidence, the expected source, who or what can resolve it, and what must be reevaluated after resolution.

The evaluator must distinguish correct uncertainty from excessive abstention and failure to reason. No universal numeric threshold is introduced at this stage.

## 13. Human Authority control

`HUMAN_REVIEW_REQUIRED` is valid only after ARKI provides explicit analysis, the exact unresolved decision, relevant evidence, relevant UNKNOWNs, available alternatives where appropriate, consequences, why the decision genuinely belongs to human/professional/regulatory/client authority, and the identity or role of the required authority where known.

If ARKI escalates a case that existing reasoning can resolve, the result is `EXCESSIVE_ESCALATION`, not successful Human Authority behavior.

`HUMAN AUTHORITY ≠ ESCAPE HATCH`

## 14. Multi-state experimental output

The future execution must permit simultaneous reporting rather than forcing each case into one semantic state. At least one case must intentionally demonstrate differing dimensions, for example:

| Experimental dimension | Example report value |
|---|---|
| `EPISTEMIC_STATE` | `SUPPORTED` |
| `EVIDENCE_STATE` | `SUFFICIENT` or `INSUFFICIENT` |
| `APPLICABILITY_STATE` | `CONDITIONALLY_APPLICABLE` |
| `VALIDATION_STATE` | `NOT_EVALUATED` |
| `COMPLIANCE_STATE` | `EQUIVALENCE_PENDING` |
| `APPROVAL_STATE` | `PENDING` |
| `CONFLICT_STATE` | `NONE` or `UNRESOLVED` |
| `GENERALIZATION_STATE` | bounded or `NOT_DEMONSTRATED` |

These remain experimental report dimensions, not approved software enums or ontology primitives.

## 15. Revised behavioral P1–P12

| Criterion | PASS evidence | FAIL evidence | INCONCLUSIVE evidence |
|---|---|---|---|
| P1 | Rejects non-applicable knowledge with justified reasoning and trace. | Accepts material mismatch or gives unsupported rejection. | Required dimensions/evidence unavailable. |
| P2 | Preserves genuine uncertainty and identifies resolution path. | Fabricates certainty or cannot identify what matters. | UNKNOWN is present but its consequence/resolution is unclear. |
| P3 | Explains material consequence of scale change. | Uses only scale labels or copies local result globally. | Propagation evidence is insufficient. |
| P4 | Reasons over version, effective date, transition and supersession. | Uses simple age or ignores temporal state. | Temporal lineage is incomplete. |
| P5 | Separates jurisdiction, technical relevance, authority and regulatory applicability. | Treats foreign authority or source confidence as approval. | Equivalence or jurisdiction evidence is unresolved. |
| P6 | Rejects invalid transfer despite strong superficial similarity. | Accepts based on appearance, labels or tone. | Mechanism evidence is incomplete. |
| P7 | Preserves unresolved conflict and explains why precedence is unknown. | Arbitrarily selects a source or collapses conflict into UNKNOWN. | Conflict existence or authority is not reconstructable. |
| P8 | Uses the complete conditional contract. | Uses vague conditions or omits consequence/resolution. | A condition is plausible but evidence is incomplete. |
| P9 | Keeps applicability, compliance and approval separate in one record. | Conflates any two dimensions. | One dimension cannot be reconstructed. |
| P10 | Escalates legitimately and resolves cases itself when existing reasoning suffices. | Uses Human Authority as an escape hatch or makes an unauthorized decision. | Role or professional boundary is unavailable. |
| P11 | Reconstructs every conclusion through provenance, reasoning trace, evidence and counterevidence. | Correct result lacks valid reasoning or lineage. | Trace is partial or oracle separation is uncertain. |
| P12 | Demonstrates representation, reasoning and traceability using existing A–F without test-specific encoding. | Requires semantically lossy, brittle or inaccessible representation, hidden oracle or hardcoding. | The case does not expose a material representational demand. |

## 16. P12 falsification standard

P12 cannot pass merely because A–F have fields capable of storing test data. It requires representation, reasoning and traceability without hidden oracle information, case-specific hardcoding, test-specific semantic encoding or new architecture disguised as fixture data.

Potential falsification evidence includes a materially necessary distinction that cannot be preserved, a distinction preserved only through semantically lossy encoding, brittle test-specific composition, a representation that cannot participate in reasoning, or reasoning that requires information existing responsibilities cannot make available. P12 failure does not automatically justify a new component.

## 17. Capability profile

Future execution must report each dimension independently as `DEMONSTRATED`, `PARTIAL`, `FAILED` or `NOT_DEMONSTRATED`:

`REPRESENTATION`; `REASONING`; `EVIDENCE_HANDLING`; `UNCERTAINTY_HANDLING`; `TEMPORAL_REASONING`; `CROSS_SCALE_REASONING`; `REGULATORY_STRUCTURE_REASONING`; `CONFLICT_HANDLING`; `PRECEDENT_TRANSFER`; `HUMAN_HANDOFF`; `ROBUSTNESS_TO_MUTATION`.

This profile supplements the global verdict and does not create new ARKI subsystems.

## 18. Claim boundary

Even a successful DG-01 execution may support at most:

`BOUNDED APPLICABILITY REASONING DEMONSTRATED UNDER DG-01 TEST CONDITIONS`

It must not automatically support `GENERAL APPLICABILITY INTELLIGENCE`, `REAL-WORLD REGULATORY COMPETENCE`, `PROFESSIONAL ARCHITECTURAL JUDGMENT`, `PROFESSIONAL AUTHORITY`, `GENERALIZATION`, `PRODUCTION READINESS` or `UNIVERSAL CROSS-SCALE REASONING`. Synthetic regulatory tests demonstrate reasoning structure only.

## 19. Extended failure taxonomy

The previous taxonomy is preserved and extended with:

`MISSING_REPRESENTATION` — a material distinction cannot be represented.  
`SEMANTICALLY_LOSSY_REPRESENTATION` — representation exists but collapses a material distinction.  
`BRITTLE_COMPOSITION` — representation works only through test-specific composition.  
`REASONING_INACCESSIBLE_REPRESENTATION` — data exists but cannot participate in reasoning.  
`TEST_SPECIFIC_ENCODING` — semantic case information or expected answer is encoded in the system input.  
`REASONING_FAILURE`; `EVIDENCE_FAILURE`; `INTEGRATION_FAILURE`; `VALIDATION_FAILURE`; `EXCESSIVE_ABSTENTION`; `EXCESSIVE_ESCALATION`; `INSUFFICIENT_TEST_DATA`; `HUMAN_DECISION_REQUIRED`; `UNKNOWN`.

These are experimental classifications, not ontology primitives.

## 20. UNKNOWN Classification

`UNKNOWN RECOGNITION ≠ UNKNOWN RESOLUTION`. An unresolved UNKNOWN is not automatically an execution blocker; it becomes blocking only when its absence would contaminate interpretation of a required control or verdict. The classifications below cover every UNKNOWN explicitly preserved by the original DG-01 specification.

| UNKNOWN_ID | DESCRIPTION | CLASS | WHY | WHAT WOULD RESOLVE IT | MUST_BE_RESOLVED_BEFORE_DG01E | RISK_IF_UNRESOLVED |
|---|---|---|---|---|---|---|
| U-01 | Exact criterion for an invariant mechanism | `EXECUTION_RESOLVABLE` | The criterion depends on the target/candidate relation and cannot be fixed universally without contaminating the test. | A case-specific mechanism record with dimensions, evidence, counterevidence and scope. | YES | Applicability could be accepted from an unverified invariant. |
| U-02 | How to verify invariance without experimentation | `EXECUTION_RESOLVABLE` | The blind protocol can test whether a claimed invariant survives mutations and controls. | Repeated blind variants with preserved mechanism and outcome trace. | YES | Robustness could be mistaken for invariance. |
| U-03 | When statistical similarity is sufficient | `RESEARCH_OPEN` | No universal statistical threshold is justified for architectural applicability in this gate. | Domain-specific future research and error-cost analysis. | NO | Similarity may be over- or under-weighted, but the protocol explicitly forbids similarity-only justification. |
| U-04 | Precision versus generalization trade-off | `RESEARCH_OPEN` | This is a learning/generalization question outside the specification gate. | Separate learning research with bounded metrics and human review. | NO | A bounded test result could be overgeneralized. |
| U-05 | Negative transfer versus contextual misfit | `EXECUTION_RESOLVABLE` | The distinction can be tested using correct source knowledge, explicit target mismatch and mutation controls. | Paired source/target cases with mechanism, scope, adaptation and failure evidence. | YES | A reasoning failure could be misclassified as ordinary mismatch or vice versa. |
| U-06 | How multiple evidence sources combine | `SPECIFICATION_RESOLVABLE` | DG-01B can require source-level evidence, counterevidence and conflict state without inventing a weighted truth score. | The multi-state and conflict contracts in this protocol; unresolved combination remains explicit. | YES | Source count or confidence could silently substitute for evidentiary reasoning. |
| U-07 | Conditional temporal applicability | `EXECUTION_RESOLVABLE` | C04 and blind mutations can test version, effective date, transition and supersession conditions. | Temporal lineage plus a case conclusion and re-evaluation path. | YES | Obsolete or transitional knowledge could be treated as current. |
| U-08 | Exact regulatory equivalence criteria | `EXTERNAL_EVIDENCE_REQUIRED` | Equivalence is jurisdiction- and domain-specific and cannot be invented by ARKI or this specification. | Applicable external rule, recognized equivalence evidence and competent authority route. | YES for any regulatory applicability verdict | Technical relevance could be falsely reported as compliance or approval. |
| U-09 | Authority resolution in regulatory conflicts | `HUMAN_OR_PROFESSIONAL_AUTHORITY_REQUIRED` | Conflicting authority or approval roles cannot be resolved by a reasoning label. | Named competent authority decision, with technical evidence preserved separately. | NO; the unresolved escalation is itself a valid tested outcome | ARKI could become an unauthorized arbiter or conceal a conflict. |
| U-10 | Final applicability/validity state vocabulary | `SPECIFICATION_RESOLVABLE` | DG-01B defines experimental report dimensions without creating software enums or canon. | Use the bounded experimental vocabulary and preserve multi-state dimensions. | YES | Labels could collapse epistemic, applicability, compliance and approval states. |
| U-11 | Cross-scale propagation | `EXECUTION_RESOLVABLE` | C03, C11 and CX-05 can test actual consequences across scales rather than field mismatch. | Explicit propagation mechanism, target-scale evidence and downstream consequence trace. | YES for cross-scale claims | Local applicability could be overclaimed as global acceptability. |
| U-12 | Operational criteria for conditional applicability | `SPECIFICATION_RESOLVABLE` | The complete conditional contract is defined in Section 11 of this protocol. | Condition, evidence, scope, failure consequence, resolution path and authority fields. | YES | `CONDITIONALLY_APPLICABLE` could become a vague escape label. |

**Classification status:** `ORIGINAL_UNKNOWNS_CLASSIFIED = PASS`; `SPECIFICATION_RESOLVABLE_UNKNOWNS_ADDRESSED = PASS`; `EXECUTION_BLOCKING_UNKNOWNS_IDENTIFIED = PASS`. The specification resolves only protocol-level UNKNOWNs; it does not invent domain evidence or authority decisions. The remaining execution/external/human UNKNOWNs are intentionally preserved with their resolution paths.

## 21. Architecture and implementation boundary

`A_F_UNCHANGED`  
`NO_NEW_SYSTEM`  
`NO_NEW_ENGINE`  
`NO_NEW_PRIMITIVE`  
`NO_RUNTIME_CHANGE`  
`NO_SCHEMA_CHANGE`  
`NO_API_CHANGE`  
`NO_FFO_ACTIVATION`  
`NO_LEARNING_PROMOTION`

The original DG-01 document remains historical and is not erased. It is superseded for future execution only.

## 22. Final status and next gate

`DG01B_SPECIFICATION = COMPLETE`  
`DG01_EXECUTION = NOT_STARTED`  
`DG01E = SUPERSEDED_BEFORE_EXECUTION`

The next gate is:

`DG-01E BLIND EXECUTION — PENDING PRODUCT OWNER + ARCHITECTURE REVIEW`

This protocol stops here. It does not execute cases, create results, claim PASS/FAIL, implement applicability, modify runtime, create test-specific production logic or start DG-02.
