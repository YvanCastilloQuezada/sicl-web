# DG-01 — Applicability Experimental Specification

## 1. Identity and status

**Project:** ARKI  
**Gate:** DG-01 — Applicability Experimental Specification  
**Status:** `SPECIFIED / NOT IMPLEMENTED / NOT DEMONSTRATED`  
**Execution status:** `DG-01 ORIGINAL SPEC SUPERSEDED FOR EXECUTION BY DG-01B`
**Type:** Architecture mapping and adversarial experiment specification only  
**Authority:** Product Owner Yvan Castillo; Architecture Authority ChatGPT; Implementation Agent Manus AI  
**Result discipline:** This document defines how a later execution may demonstrate PASS or FAIL. It does not declare DG-01 PASS and does not authorize implementation.

## 2. Baseline

| Field | Value |
|---|---|
| Repository | `YvanCastilloQuezada/sicl-web` |
| Branch | `main` |
| Baseline HEAD | `448fd7b88bd6a291f899c6afd39eef40313b02f2` |
| Baseline worktree | Clean before this specification |
| Predecessor | FKCG-02 Fundamental Knowledge Preservation |
| Next gate | `DG-01 EXECUTION — PENDING PRODUCT OWNER REVIEW` |

## 3. Purpose and falsifiable hypothesis

DG-01 prepares the question: **Can ARKI determine whether available knowledge is applicable, non-applicable, conditionally applicable, conflicted, or unresolved for a concrete project situation while preserving scope, provenance, evidence, uncertainty, scale, time, jurisdiction and Human Authority?**

The experiment must attempt to falsify:

> **H-DG01:** Existing ARKI responsibilities A–F are sufficient to represent and reason contextual applicability without introducing a new system, engine or ontology primitive.

A demonstrated failure is a valid result. A successful execution would not authorize canonization, generalized learning, professional approval, regulatory automation or a new component.

## 4. Constitutional boundaries

DG-01 applies `REUSE → CONNECT → EXTEND → CREATE`, `UNKNOWN BEFORE INVENTING`, and `ARCHITECTURE → IMPLEMENTATION`. It preserves the distinctions `HISTORICAL EVIDENCE ≠ CURRENT CAPABILITY`, `CURRENT ≠ PRODUCTION ≠ PROFESSIONAL AUTHORITY`, `EXTERNAL INTELLIGENCE ≠ CANONICAL ARKI KNOWLEDGE`, `CAPABILITY NEED ≠ COMPONENT NEED`, `NEW CONCEPT ≠ NEW PRIMITIVE`, `COMMON PRIMITIVE ≠ IDENTICAL SEMANTICS`, `LOCAL VALIDITY ≠ GLOBAL VALIDITY`, and `GENERATED ≠ VALIDATED ≠ EVALUATED ≠ DECIDED`.

It also preserves `SOURCE ≠ RULE ≠ INTERPRETATION ≠ APPLICABILITY ≠ COMPLIANCE ≠ APPROVAL`, `AUTHORITY ≠ EXPERTISE ≠ PROFESSIONAL RESPONSIBILITY`, `AUTHORITY TO APPROVE ≠ TECHNICAL CORRECTNESS`, `EQUIVALENCE CLAIM ≠ EQUIVALENCE DEMONSTRATED ≠ EQUIVALENCE APPROVED`, `INSUFFICIENT EVIDENCE ≠ INVALIDITY`, and `PRESCRIPTIVE NON-CONFORMANCE ≠ OBJECTIVE FAILURE`.

**Prohibited by this gate:** new system G, Applicability Engine, Validation Engine, Regulatory Engine, Authority Engine, ontology primitive, schema, enum, runtime endpoint, learning promotion, FFO activation, DG-02 or later gate, or professional authority claim.

## 5. Repository evidence map

| Required responsibility or behavior | Classification | Evidence | A–F home | Current maturity | Missing behavior / gap type |
|---|---|---|---|---|---|
| Project context, entities, relationships, conditions | `EXISTING_PARTIAL` | `server/arkiD62ReasoningHarness.ts`, `BridgeProjectInput`, `BridgeActivity`, `BridgeRelationship` | A — WORLD | Implemented input contract; bounded | Jurisdiction, authority and temporal semantics are not uniformly modeled; representational/integration gap |
| Knowledge retrieval and source lineage | `EXISTING` | `server/siclCore.ts`, `executeArchitecturalReasoning()`; `sourceIds`, `evidenceIds`, `scopeId` in trace | B — KNOWLEDGE | Demonstrated in D6.2 and D6.4 reports | Applicability conclusion must preserve a complete target-to-source reconstruction; execution evidence required |
| Epistemic state and UNKNOWN preservation | `EXISTING` | D6.2 `unknowns`, `epistemicStatus`; `server/arkiOcr.ts` uses `UNVERIFIED`; FKCG-02 UNKNOWN Register | B/C | Demonstrated for bounded reasoning and ingestion | Multiple state dimensions must coexist without collapse; validation gap |
| Bounded transfer / applicability-like reasoning | `EXISTING_PARTIAL` | `TransferMode = TRANSFER / ADAPT / DO_NOT_TRANSFER / UNKNOWN`; `decideTransfer()` in D6.2 | C — REASONING | Demonstrated as hypothesis-level transfer handling | Not yet a general applicability experiment across jurisdiction, time, conflict and regulatory equivalence; reasoning/integration gap |
| Constraints and requirements | `EXISTING_PARTIAL` | `ArchitecturalReasoningInput.constraints`; `deriveRelationshipRequirement()` and D6.3 hard constraints | C/E | Demonstrated for project inputs and geometric gates | Applicability of a requirement must be distinguished from compliance and approval; representational gap |
| Cross-scale relation | `EXISTING_PARTIAL` | D6.2 bridge topology and D6.3 traceability; FKCG-02 P0-R2 lineage | A/C | Conceptually preserved; execution not demonstrated for applicability | Cross-scale propagation evidence is absent; validation gap |
| Time/version context | `DOCUMENTED_NOT_RUNTIME` | FKCG-02 Cross-Cutting and UNKNOWN Register; D6.2 relationship `time` input can be present | A/B/C | Documented, partial input field | No demonstrated temporal applicability decision or supersession protocol; reasoning/integration gap |
| Jurisdiction and regulatory context | `DOCUMENTED_NOT_RUNTIME` | FKCG-02 P1-R1, DG-04 and corrections; D6.3 `regulatoryValidity = NOT_EVALUATED` | A/B/C/E | Documented boundary only | No regulatory applicability or equivalence execution; evidence/authority gap |
| Human Authority | `EXISTING_PARTIAL` | D6.2 `humanAuthority: FINAL`, `HUMAN_ARCHITECT`, `HUMAN_REVIEW_REQUIRED`; UI review boundaries | E/F | Preserved and demonstrated as a boundary | Authority role, expertise and approval actor need explicit case evidence; integration gap |
| Candidate generation | `EXISTING` | D6.2 `deriveStrategies()`; D6.3 `makeRepresentation()` | D — GENERATION | Demonstrated as AI-proposed conceptual candidates | Applicability must constrain or qualify generation without treating generation as validity; evaluation required |
| Evaluation and hard-constraint checks | `EXISTING_PARTIAL` | D6.3 `validate()` and gates G1–G12 | E — EVALUATION | Geometric/topological checks demonstrated; functional/regulatory often UNKNOWN/NOT_EVALUATED | Need applicability-specific evidence and state separation; validation gap |
| Learning and transfer boundary | `EXISTING_PARTIAL` | D6.2 `NEW_LEARNING_CANDIDATE`, promotion `HUMAN_REVIEW_REQUIRED`; FKCG-02 learning principles | F — LEARNING | Candidate learning and human promotion boundary demonstrated | DG-01 result must not generalize automatically; learning/promotion remains outside this gate |
| Conflict handling | `EXISTING_PARTIAL` | D6.2 `counterexamples`, `CONFLICTED` preserved in FKCG-02 conceptual model | C/E | Conceptually represented; no applicability conflict execution | No approved resolution/precedence rule; evidence/authority gap |
| Experimental applicability state vocabulary | `DOCUMENTED_NOT_RUNTIME` | FKCG-02 State Decomposition and DG-01 input order | B/C/E | Specification-only | Must test semantic usefulness without software enums; representational test pending |
| New applicability engine or primitive | `NOT_FOUND` by design | FKCG-02 explicit negatives; no authorization in this gate | None | Intentionally absent | Absence is not a defect unless execution produces representational failure; architecture gate |

**Interpretation:** The current repository contains a partial bounded transfer and traceability capability, not a demonstrated general applicability capability. The distinction is deliberate and remains unresolved until execution evidence exists.

## 6. A–F responsibility mapping

### A — WORLD
Represents target context, entities, activities, relationships, conditions, scale and time when supplied. DG-01 must test whether jurisdiction, actor/authority, temporal validity and cross-scale context can be attached without inventing a new primitive. A does not decide applicability or validity.

### B — KNOWLEDGE
Retrieves and preserves source identity, evidence, scope, provenance, limitations, counterexamples and epistemic state. Stored knowledge is not automatically applicable. The experiment must reconstruct every applicability conclusion from source to target.

### C — REASONING
Compares source and target, distinguishes similarity from relevance and applicability, handles adaptation, conflict, constraints, uncertainty, equivalence and temporal conditions. The existing transfer decision family is evidence to reuse, not authorization for a new engine.

### D — GENERATION
Produces candidate strategies or representations informed by bounded knowledge. Generation may expose a candidate but cannot establish applicability, validity, compliance or approval.

### E — EVALUATION
Tests evidence, performance, scenarios, hard constraints, failure conditions and alternatives. Evaluation must keep applicability distinct from compliance and approval and must allow `UNKNOWN`, `CONFLICTED` and conditional results.

### F — LEARNING
Records scope, conditions, failures, counterexamples and generalization boundaries. A successful application is not generalized knowledge; DG-01 cannot promote results into the canon.

## 7. Applicability conceptual model

For a candidate knowledge item `K`, target situation `T`, context `C`, source/provenance `P`, evidence `E`, conditions `Q`, scale `S`, time/version `τ`, jurisdiction `J`, authority context `A`, and counterevidence `X`, the experimental record should preserve:

`K + P + scope + E + T + C + Q + S + τ + J + A + X → applicability conclusion + explanation + uncertainty + human boundary`

The conclusion must answer **whether and under what conditions** the knowledge can inform the target. It must not silently convert similarity into authorization. It must distinguish:

- direct target relevance from transfer or reuse;
- source validity from target applicability;
- applicability from compliance;
- compliance from approval;
- insufficient evidence from invalidity;
- conflict from UNKNOWN;
- local validity from global validity;
- professional authority from technical reasoning.

A conclusion without reconstructable provenance, explicit scope, evidence limits and forbidden inferences is not a passing DG-01 result.

## 8. Experimental state vocabulary

The following labels are experimental and are **not canonical, not approved enums and not software types**:

`APPLICABLE_SUPPORTED` · `NOT_APPLICABLE_SUPPORTED` · `CONDITIONALLY_APPLICABLE` · `CONFLICTED` · `INSUFFICIENT_EVIDENCE` · `NOT_EVALUATED` · `HUMAN_REVIEW_REQUIRED`

They are evaluated for usefulness only. They must not collapse the conceptual dimensions:

`EPISTEMIC_STATE ≠ APPLICABILITY_STATE ≠ COMPLIANCE_STATE ≠ APPROVAL_STATE ≠ CONFLICT_STATE`.

A later execution may use these labels in an experiment report, but not in schema, migrations, runtime unions or canon.

## 9. Twelve-case adversarial matrix

Each case must be executed with the complete record fields shown below. The cases are intentionally adversarial and must be allowed to fail.

### DG01-C01 — Clearly applicable knowledge

- **INPUT:** A source-backed design rule explicitly scoped to the target building type, jurisdiction, time and activity.
- **KNOWN KNOWLEDGE:** A FACT with defined scope and evidence.
- **SOURCE/PROVENANCE:** Source ID, evidence IDs, version, retrieval trace and scope.
- **CONTEXT:** Concrete project situation with target activity and conditions.
- **SCALE:** Same scale as the source claim.
- **TIME:** Source current for the project date.
- **JURISDICTION:** Matching jurisdiction.
- **AUTHORITY:** Source authority and human reviewer recorded separately.
- **APPLICABILITY QUESTION:** Can the source inform this target under its declared scope?
- **REASONING REQUIRED:** Scope match, dimension match, evidence sufficiency and counterevidence check.
- **EVIDENCE REQUIRED:** Source, target facts, conditions and reconstruction trace.
- **UNKNOWN:** Any unobserved project condition.
- **EXPECTED STATE:** `APPLICABLE_SUPPORTED` if all required evidence is present; otherwise `INSUFFICIENT_EVIDENCE`.
- **FORBIDDEN INFERENCE:** Do not infer compliance or approval from applicability.
- **DOWNSTREAM CONSEQUENCE:** Candidate generation may use the knowledge within scope; evaluation remains separate.
- **HUMAN DECISION REQUIREMENT:** Confirm use where professional responsibility applies.

### DG01-C02 — Known knowledge outside jurisdiction

- **INPUT:** A valid source from jurisdiction J1 applied to a project in J2.
- **KNOWN KNOWLEDGE:** Source is known and possibly technically relevant, but jurisdiction differs.
- **SOURCE/PROVENANCE:** Source jurisdiction, date, version and target jurisdiction.
- **CONTEXT:** Target project governed by J2.
- **SCALE:** Same physical scale, different regulatory context.
- **TIME:** Both dates recorded.
- **JURISDICTION:** Explicit mismatch J1/J2.
- **AUTHORITY:** J1 source authority does not become J2 approval authority.
- **APPLICABILITY QUESTION:** Is the source applicable, transferable, or only informative in J2?
- **REASONING REQUIRED:** Jurisdictional scope and equivalence analysis.
- **EVIDENCE REQUIRED:** J2 rule/source or qualified equivalence evidence.
- **UNKNOWN:** Exact equivalence criteria if not available.
- **EXPECTED STATE:** `NOT_APPLICABLE_SUPPORTED` or `CONDITIONALLY_APPLICABLE`; never automatic approval.
- **FORBIDDEN INFERENCE:** Do not treat source existence as J2 compliance.
- **DOWNSTREAM CONSEQUENCE:** Regulatory conclusion remains pending or is excluded from compliance claims.
- **HUMAN DECISION REQUIREMENT:** Competent J2 authority/professional review where required.

### DG01-C03 — Similar typology, incompatible scale

- **INPUT:** A housing precedent retrieved for a district-scale intervention, or a room precedent retrieved for a campus-scale decision.
- **KNOWN KNOWLEDGE:** Similar label/typology but different scale semantics.
- **SOURCE/PROVENANCE:** Source scale, target scale and relation type.
- **CONTEXT:** Target has materially different entities, capacity or dependencies.
- **SCALE:** Explicitly incompatible source and target scales.
- **TIME:** Recorded but not decisive.
- **JURISDICTION:** Recorded if relevant.
- **AUTHORITY:** Reviewer identified.
- **APPLICABILITY QUESTION:** Does any principle survive the scale change, and which parts require revalidation?
- **REASONING REQUIRED:** Cross-scale relation, not containment assumption; identify scope loss.
- **EVIDENCE REQUIRED:** Scale-specific mechanism or performance evidence.
- **UNKNOWN:** Cross-scale propagation and aggregation effects.
- **EXPECTED STATE:** `CONDITIONALLY_APPLICABLE` or `NOT_APPLICABLE_SUPPORTED`.
- **FORBIDDEN INFERENCE:** Typology similarity is not multiscale reasoning.
- **DOWNSTREAM CONSEQUENCE:** Only bounded abstractions may be candidates; no copied arrangement.
- **HUMAN DECISION REQUIREMENT:** Human review of scale interpretation.

### DG01-C04 — Wrong, obsolete or superseded temporal context

- **INPUT:** A source with an obsolete version, changed rule, expired condition or uncertain timestamp.
- **KNOWN KNOWLEDGE:** Source identity known; temporal validity problematic.
- **SOURCE/PROVENANCE:** Version, publication date, effective date, supersession chain.
- **CONTEXT:** Project date and required current version.
- **SCALE:** Same unless temporal change affects scale.
- **TIME:** Material mismatch or UNKNOWN.
- **JURISDICTION:** Explicit.
- **AUTHORITY:** Authority attached to source version, not assumed current.
- **APPLICABILITY QUESTION:** Can this source inform the target, and under what historical or comparative purpose?
- **REASONING REQUIRED:** Temporal applicability and supersession.
- **EVIDENCE REQUIRED:** Current source or explicit historical-use justification.
- **UNKNOWN:** Effective status if source metadata is incomplete.
- **EXPECTED STATE:** `NOT_APPLICABLE_SUPPORTED`, `CONDITIONALLY_APPLICABLE` or `INSUFFICIENT_EVIDENCE`.
- **FORBIDDEN INFERENCE:** Historical evidence is not current capability or current compliance.
- **DOWNSTREAM CONSEQUENCE:** May be retained for history/comparison, not current normative generation.
- **HUMAN DECISION REQUIREMENT:** Confirm intended historical or current use.

### DG01-C05 — Insufficient contextual evidence

- **INPUT:** A plausible precedent with missing site, users, capacity, climate, access or operational conditions.
- **KNOWN KNOWLEDGE:** Source may be valid in its origin context.
- **SOURCE/PROVENANCE:** Preserved, but target facts incomplete.
- **CONTEXT:** Material UNKNOWNs remain.
- **SCALE:** Recorded.
- **TIME:** Recorded.
- **JURISDICTION:** Recorded or UNKNOWN.
- **AUTHORITY:** Human reviewer remains visible.
- **APPLICABILITY QUESTION:** Is there enough evidence to conclude applicability?
- **REASONING REQUIRED:** Identify missing dimensions and test whether they are material.
- **EVIDENCE REQUIRED:** Target facts or a bounded justification for proceeding conditionally.
- **UNKNOWN:** Every missing material condition remains explicit.
- **EXPECTED STATE:** `INSUFFICIENT_EVIDENCE` or `HUMAN_REVIEW_REQUIRED`.
- **FORBIDDEN INFERENCE:** Do not fill missing facts from defaults or typical architecture.
- **DOWNSTREAM CONSEQUENCE:** Defer or label any generated strategy as hypothesis.
- **HUMAN DECISION REQUIREMENT:** Decide whether evidence collection or conditional exploration is acceptable.

### DG01-C06 — Unresolved source conflict

- **INPUT:** Two sources both potentially applicable but inconsistent on a material requirement or interpretation.
- **KNOWN KNOWLEDGE:** Source A and B with separate provenance and evidence.
- **SOURCE/PROVENANCE:** Independent lineage, versions, jurisdictions and authority.
- **CONTEXT:** Target where the conflict matters.
- **SCALE:** Explicit.
- **TIME:** Explicit, including supersession.
- **JURISDICTION:** Explicit.
- **AUTHORITY:** Distinguish source authority, expertise and approval authority.
- **APPLICABILITY QUESTION:** Can either source be accepted, conditioned or rejected without hiding the conflict?
- **REASONING REQUIRED:** Conflict detection, scope comparison and escalation; no invented precedence.
- **EVIDENCE REQUIRED:** Both claims, contradiction and resolution authority.
- **UNKNOWN:** Precedence/equivalence if not established.
- **EXPECTED STATE:** `CONFLICTED` or `HUMAN_REVIEW_REQUIRED`.
- **FORBIDDEN INFERENCE:** Do not choose the more convenient source.
- **DOWNSTREAM CONSEQUENCE:** Block unqualified compliance or generation claim.
- **HUMAN DECISION REQUIREMENT:** Explicit conflict resolution by competent authority.

### DG01-C07 — Visual similarity without functional transferability

- **INPUT:** A visually similar plan or form whose activities, flows, hazards or causal mechanism differ.
- **KNOWN KNOWLEDGE:** Image/precedent with provenance but no demonstrated transfer mechanism.
- **SOURCE/PROVENANCE:** Visual source, interpretation and evidence type separated.
- **CONTEXT:** Target activities and conditions.
- **SCALE:** Recorded.
- **TIME:** Recorded.
- **JURISDICTION:** Recorded if applicable.
- **AUTHORITY:** Human reviewer identified.
- **APPLICABILITY QUESTION:** Does visual similarity support functional applicability?
- **REASONING REQUIRED:** Compare mechanisms, not appearance; identify counterexample.
- **EVIDENCE REQUIRED:** Functional/causal evidence or explicit adaptation.
- **UNKNOWN:** Transfer mechanism.
- **EXPECTED STATE:** `NOT_APPLICABLE_SUPPORTED` or `INSUFFICIENT_EVIDENCE`.
- **FORBIDDEN INFERENCE:** Similar geometry is not proof of transferability.
- **DOWNSTREAM CONSEQUENCE:** Do not copy geometry; at most retain as visual reference.
- **HUMAN DECISION REQUIREMENT:** Approve any interpretive use.

### DG01-C08 — Transfer only after contextual adaptation

- **INPUT:** A source strategy relevant in principle but requiring changes to users, flows, climate, scale, operations or code.
- **KNOWN KNOWLEDGE:** Strategy with explicit source scope and adaptation burden.
- **SOURCE/PROVENANCE:** Source and adaptation lineage.
- **CONTEXT:** Target-specific differences enumerated.
- **SCALE:** Source and target scales recorded.
- **TIME:** Effective conditions recorded.
- **JURISDICTION:** Target rules recorded.
- **AUTHORITY:** Adaptation reviewer and approval actor separated.
- **APPLICABILITY QUESTION:** What survives adaptation, and what must be revalidated?
- **REASONING REQUIRED:** Dimension-specific compatibility and side effects.
- **EVIDENCE REQUIRED:** Adaptation rationale, target evidence and counterevidence.
- **UNKNOWN:** Performance after adaptation.
- **EXPECTED STATE:** `CONDITIONALLY_APPLICABLE`.
- **FORBIDDEN INFERENCE:** Adaptation is not proof of success.
- **DOWNSTREAM CONSEQUENCE:** Generate only an AI-proposed hypothesis with required evaluation gates.
- **HUMAN DECISION REQUIREMENT:** Review adaptation before decision or promotion.

### DG01-C09 — Prescriptive non-conformance with authorized alternative

- **INPUT:** Candidate does not follow a prescriptive path but may satisfy a recognized performance or alternative route.
- **KNOWN KNOWLEDGE:** Requirement, alternative path and evidence status separated.
- **SOURCE/PROVENANCE:** Rule source, interpretation, performance evidence and authority.
- **CONTEXT:** Project conditions and alternative mechanism.
- **SCALE:** Explicit.
- **TIME:** Current rule/version.
- **JURISDICTION:** Explicit.
- **AUTHORITY:** Approval authority distinct from technical evaluator.
- **APPLICABILITY QUESTION:** Does the prescriptive rule apply directly, and is the alternative path recognized/evidenced?
- **REASONING REQUIRED:** Applicability, equivalence and performance reasoning.
- **EVIDENCE REQUIRED:** Applicable rule, alternative basis, performance data and authority route.
- **UNKNOWN:** Equivalence or approval if not established.
- **EXPECTED STATE:** `CONDITIONALLY_APPLICABLE`, `CONFLICTED` or `HUMAN_REVIEW_REQUIRED`.
- **FORBIDDEN INFERENCE:** Prescriptive non-conformance is not automatically objective failure.
- **DOWNSTREAM CONSEQUENCE:** No automatic rejection or compliance claim.
- **HUMAN DECISION REQUIREMENT:** Competent authority decides acceptance.

### DG01-C10 — Expertise and approval authority differ

- **INPUT:** Expert recommends a course while another actor holds approval authority.
- **KNOWN KNOWLEDGE:** Technical opinion, source evidence and approval role separated.
- **SOURCE/PROVENANCE:** Identity and role of each contributor.
- **CONTEXT:** Decision requiring professional or regulatory responsibility.
- **SCALE:** Recorded.
- **TIME:** Recorded.
- **JURISDICTION:** Recorded.
- **AUTHORITY:** Explicitly split between expertise and approval.
- **APPLICABILITY QUESTION:** Can technical relevance be reported without claiming authorization?
- **REASONING REQUIRED:** Role separation and uncertainty communication.
- **EVIDENCE REQUIRED:** Recommendation basis and approval pathway.
- **UNKNOWN:** Final decision until authority acts.
- **EXPECTED STATE:** `HUMAN_REVIEW_REQUIRED`.
- **FORBIDDEN INFERENCE:** Expertise is not approval; ARKI cannot sign or authorize.
- **DOWNSTREAM CONSEQUENCE:** Preserve recommendation as advisory only.
- **HUMAN DECISION REQUIREMENT:** Mandatory.

### DG01-C11 — Conclusion supported at one scale only

- **INPUT:** Evidence supports a room-level conclusion but target decision is building, campus or territorial scale.
- **KNOWN KNOWLEDGE:** Local result with explicit scope.
- **SOURCE/PROVENANCE:** Evidence and scale scope.
- **CONTEXT:** Target scale and cross-scale relation.
- **SCALE:** Source and target differ.
- **TIME:** Recorded.
- **JURISDICTION:** Recorded where relevant.
- **AUTHORITY:** Reviewer of cross-scale interpretation.
- **APPLICABILITY QUESTION:** Does local validity propagate to target scale?
- **REASONING REQUIRED:** Cross-scale mechanism and propagation evidence.
- **EVIDENCE REQUIRED:** Target-scale evidence or justified relation.
- **UNKNOWN:** Propagation and emergent effects.
- **EXPECTED STATE:** `CONDITIONALLY_APPLICABLE` or `INSUFFICIENT_EVIDENCE`.
- **FORBIDDEN INFERENCE:** Local validity is not global validity.
- **DOWNSTREAM CONSEQUENCE:** Limit claim to source scale.
- **HUMAN DECISION REQUIREMENT:** Review any extrapolation.

### DG01-C12 — Closure legitimately requires Human Authority

- **INPUT:** Evidence and reasoning narrow the options but a professional, ethical, regulatory or client decision remains.
- **KNOWN KNOWLEDGE:** All available source, evidence, uncertainty and alternatives.
- **SOURCE/PROVENANCE:** Complete reconstruction record.
- **CONTEXT:** Concrete decision with material consequences.
- **SCALE:** Explicit.
- **TIME:** Explicit.
- **JURISDICTION:** Explicit if applicable.
- **AUTHORITY:** Named human decision actor.
- **APPLICABILITY QUESTION:** Can ARKI state the bounded recommendation and what remains for the human?
- **REASONING REQUIRED:** Summarize applicable evidence, alternatives, unknowns and consequences.
- **EVIDENCE REQUIRED:** Audit trail and decision payload.
- **UNKNOWN:** Items that only the human can resolve.
- **EXPECTED STATE:** `HUMAN_REVIEW_REQUIRED`.
- **FORBIDDEN INFERENCE:** No silent closure, approval or professional representation.
- **DOWNSTREAM CONSEQUENCE:** Pause or hand off with explicit decision record.
- **HUMAN DECISION REQUIREMENT:** Mandatory and final for the unresolved decision.

## 10. Evidence requirements for later execution

Every case record must preserve: source and target identifiers; source version and date; jurisdiction; scale and relation type; time state; relevant dimensions; candidate scope; evidence and counterevidence; applicability rationale; forbidden inference; UNKNOWNs; conflict state; human role; downstream effect; and an immutable reconstruction trace. A test result without these fields is `INSUFFICIENT_TEST_DATA`, not PASS or FAIL.

## 11. PASS criteria P1–P12

These are criteria for a later execution only. DG-01 does not declare them passed.

| ID | Later evidence required |
|---|---|
| P1 | Available knowledge can be rejected as non-applicable with an explicit, traceable reason. |
| P2 | UNKNOWN or insufficient evidence survives without fabricated certainty. |
| P3 | Scale can alter applicability and the change is explained. |
| P4 | Time/version context can alter applicability and supersession is visible. |
| P5 | Jurisdiction and authority can affect regulatory applicability without false authority. |
| P6 | Similarity alone is insufficient evidence of transferability. |
| P7 | Unresolved conflict can remain explicit and does not silently collapse. |
| P8 | Conditional applicability can be represented with conditions and limits. |
| P9 | Applicability remains distinct from compliance. |
| P10 | Human Authority remains authoritative where required. |
| P11 | Provenance permits reconstruction of the applicability conclusion. |
| P12 | P1–P11 can be represented using existing A–F responsibilities without unauthorized architecture. |

## 12. Failure taxonomy

| Failure class | What failed | Expected responsibility | Evidence | Workaround/extension first | New architecture justified? |
|---|---|---|---|---|---|
| `REPRESENTATIONAL_FAILURE` | Existing records cannot express a material distinction even with bounded composition | A/B/C/E | Missing field/relationship demonstrated in a case | Reuse existing provenance, scope, UNKNOWN and trace first | Only after repeated concrete failure and explicit authorization |
| `REASONING_FAILURE` | Inputs are representable but reasoning reaches an unsupported or wrong conclusion | C | Reproducible trace and adversarial counterexample | Extend reasoning within existing family; preserve failure | Not automatically |
| `EVIDENCE_FAILURE` | Required evidence is absent, contradictory or not trustworthy | B/E | Source/evidence gap | Mark UNKNOWN or INSUFFICIENT_EVIDENCE | No |
| `INTEGRATION_FAILURE` | Existing responsibilities do not connect in the experiment | A–F boundaries | Broken trace or handoff | Connect/reuse before creating | Not automatically |
| `VALIDATION_FAILURE` | Candidate cannot demonstrate required condition | E | Failed or UNKNOWN gate | Preserve failure and revise/test candidate | No |
| `INSUFFICIENT_TEST_DATA` | Case lacks data needed to distinguish hypotheses | A/B | Missing input inventory | Collect data; do not infer | No |
| `HUMAN_DECISION_REQUIRED` | Closure belongs to professional, regulatory, ethical or client authority | E/F + Human Authority | Named unresolved decision | Hand off with complete evidence | No |
| `UNKNOWN` | The system cannot responsibly classify the issue | B/C/E | Explicit unresolved condition | Preserve UNKNOWN and resolution path | No |

A failure class never automatically authorizes a new component, primitive or engine.

## 13. Human Authority boundary

ARKI may retrieve, compare, explain, qualify, generate hypotheses and expose evidence. It may not approve a permit, certify compliance, replace a professional, resolve a jurisdictional conflict by fiat, or convert a recommendation into a decision. Expertise, technical correctness, approval authority and professional responsibility remain separate records.

## 14. UNKNOWN register

The following remain open from FKCG-02 and are directly relevant to DG-01: invariant mechanism criterion; invariance verification; statistical similarity sufficiency; precision/generalization trade-off; negative transfer versus contextual misfit; combination of multiple evidence sources; temporal applicability; regulatory equivalence; authority conflict resolution; final applicability/validity vocabulary; cross-scale propagation; and operational criteria for conditional applicability. They must not be resolved by inference during specification or execution.

## 15. Representational failure criteria

A representational failure may be claimed only if a later adversarial case has complete available evidence and demonstrates that the existing A–F records cannot simultaneously preserve at least one material distinction among provenance, epistemic state, applicability condition, evidence state, compliance, approval, conflict, scale, time, jurisdiction or authority. A missing convenience field, terminology mismatch or absent automation is not sufficient. The test must first attempt composition and extension of existing responsibilities.

## 16. Implementation implications — explicitly non-authorizing

This specification does not authorize an Applicability Engine, new schema, enum, API, service, ontology primitive, regulatory automation, learning promotion, FFO activation or runtime change. The experimental labels are report vocabulary only. If execution finds a gap, the result must first be classified and reviewed; architecture changes require a later explicit gate and Product Owner authorization.

## 17. Recommended future execution protocol

1. Product Owner reviews this specification and authorizes or rejects execution.
2. Freeze the execution baseline and case dataset.
3. Prepare one provenance-complete record per C01–C12.
4. Execute cases against existing responsibilities and runtime only.
5. Preserve traces, evidence, UNKNOWNs, conflicts and human handoffs.
6. Evaluate P1–P12 without changing the system during the experiment.
7. Classify each outcome using the failure taxonomy.
8. Produce an execution report with counterexamples and reproducibility data.
9. Hold all learning promotion and architecture changes for a separate gate.

## 18. Final gate assessment

`DG01_SPECIFIED = PASS`  
`DG01_EXECUTED = NO`  
`DG01_PASS = NOT_DECLARED`  
`DG01_IMPLEMENTED = NO`  
`DG02_STARTED = NO`

Validation flags for this specification: `DG01_SPEC_CREATED = PASS`; `REPOSITORY_EVIDENCE_MAPPED = PASS`; `A_F_RESPONSIBILITIES_PRESERVED = PASS`; `12_ADVERSARIAL_CASES_SPECIFIED = PASS`; `P1_P12_DEFINED = PASS`; `UNKNOWN_PRESERVED = PASS`; `STATE_DIMENSIONS_NOT_COLLAPSED = PASS`; `NO_NEW_SYSTEM = PASS`; `NO_NEW_ENGINE = PASS`; `NO_NEW_PRIMITIVE = PASS`; `NO_RUNTIME_IMPLEMENTATION = PASS`; `NO_AUTOMATIC_CANONIZATION = PASS`; `NO_FFO_ACTIVATION = PASS`; `HUMAN_AUTHORITY_PRESERVED = PASS`; `DG02_NOT_STARTED = PASS`.

**Architectural finding:** `POTENTIAL_REPRESENTATIONAL_GAP_REQUIRES_EXECUTION_EVIDENCE`

The repository contains sufficient existing responsibility homes to specify and attempt the experiment, including bounded retrieval, provenance, UNKNOWN handling, transfer decisions, candidate generation, evaluation boundaries and Human Authority. However, applicability across jurisdiction, time, conflict, regulatory equivalence, cross-scale propagation and state separation is not demonstrated. This finding is not authorization for architecture changes.

## 19. Exact next-step recommendation

`DG-01 EXECUTION — PENDING PRODUCT OWNER REVIEW`

Stop after this specification. Do not execute DG-01, begin DG-02, implement applicability, modify the ontology, activate learning, activate FFOs or continue automatically.
