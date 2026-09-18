# SiMS-DeI — ARQUI A16
# Traceable Architectural Design Critic

## Final status

```text
A16 = PASS_WITH_OBSERVATIONS
ARCHITECTURAL_CRITIQUE = PASS
HUMAN_AUTHORITY = PRESERVED
REAL_GATE = NOT_TRIGGERED
```

A16 transforma la lectura real A15, la intención A11–A14 y la incertidumbre en hallazgos arquitectónicos trazables y, cuando corresponde, hipótesis de cambio acotadas. No es diseño autónomo, no modifica geometría y no crea decisiones.

## Baseline and scope

| Item | Result |
|---|---|
| Web baseline | `25c751f64ed7ab50045dc551d0866931ac99b0fd` |
| Core baseline | `1c416551a945286e3b7fab6a5f01e8852442ea7b` |
| A11–A15 | Reused; not re-executed |
| Core changed | NO |
| Core Contract changed | NO |
| New canonical entity | 0 |
| Frozen systems activated | NO |
| Site-development opportunity intelligence | FROZEN / NOT AUTHORIZED |
| Push / PR / merge / deployment | NO |

A16 was implemented as derived Web composition over existing A15 output and current capability self-knowledge. No repository-wide audit was performed.

## Critique constitution

A16 preserves the following distinctions:

```text
OBSERVATION ≠ CRITIQUE
CRITIQUE ≠ FACT
CRITIQUE ≠ DECISION
CRITIQUE ≠ RECOMMENDATION
CHANGE HYPOTHESIS ≠ AUTHORIZED CHANGE
DESIGN KNOWLEDGE ≠ PROJECT FACT
GEOMETRIC DIFFERENCE ≠ DEFECT
INTENT MISMATCH ≠ BAD ARCHITECTURE
PERFORMANCE CLAIM REQUIRES PERFORMANCE EVIDENCE
COMPLIANCE CLAIM REQUIRES VERIFIED APPLICABLE RULE
```

Every finding contains an explicit subject, category, observation, basis, interpretation, implication, uncertainty, severity, confidence, evidence and provenance.

## Controlled runtime result

The controlled courtyard reading generated:

```text
CENTRAL_VOID = ALIGNED
CIRCULATION_LOOP = UNRESOLVED
PROGRAM = UNKNOWN / EVIDENCE_GAP
```

The controlled change hypothesis was:

```text
TARGET = CIRCULATION_SPINE
CANDIDATE_CAPABILITY = CREATE_SPINE
CAPABILITY_STATUS = UNSUPPORTED
EPISTEMIC_STATUS = HYPOTHESIS
EXECUTION = NONE
```

The runtime validated:

```text
NO_QUALITY_SCORE = TRUE
NO_WINNER = TRUE
NO_DECISION = TRUE
NO_GEOMETRY_MUTATION = TRUE
NO_AUTONOMOUS_LOOP = TRUE
```

No unsupported environmental, regulatory, cost, daylight, comfort, ventilation, energy or compliance claim was generated.

## Generated findings

### Finding 1 — courtyard alignment

```text
SUBJECT = ELEMENT / CENTRAL_VOID
CATEGORY = MASS_VOID
KIND = ALIGNED
BASIS = OBSERVED_GEOMETRY + PROJECT_INTENT
SEVERITY = INFORMATIONAL
CONFIDENCE = HIGH
```

The actual four-mass multipolygon result is consistent with the intended courtyard mass/void organization. This does not evaluate architectural quality or environmental performance.

### Finding 2 — circulation gap

```text
SUBJECT = RELATIONSHIP / CIRCULATION_LOOP
CATEGORY = CIRCULATION
KIND = UNRESOLVED
BASIS = OBSERVED_GEOMETRY + PROJECT_INTENT + UNKNOWN/MISSING_EVIDENCE
SEVERITY = ATTENTION
CONFIDENCE = HIGH
```

The current representation cannot confirm a complete loop or spine. A16 does not infer circulation from mass arrangement.

### Finding 3 — program evidence gap

```text
SUBJECT = ELEMENT / PROGRAM_ZONES
CATEGORY = PROGRAM
KIND = UNKNOWN
BASIS = OBSERVED_GEOMETRY + UNKNOWN/MISSING_EVIDENCE
SEVERITY = ATTENTION
CONFIDENCE = HIGH
```

The current geometry has no validated program assignment. A16 does not infer rooms or uses from shape.

## Bounded change hypothesis

A16 may formulate a bounded hypothesis without executing it:

> If preserving the intended circulation loop is important to the architect, an explicit circulation representation could be explored.

The capability check is explicit:

```text
ARCHITECTURAL_HYPOTHESIS = VALID
CURRENT_OPERATION = CREATE_SPINE
CAPABILITY_STATUS = UNSUPPORTED
OPERATION_EXECUTED = NO
```

No silent substitution was made. A16 reports the capability gap instead of pretending that another operation realizes the same architectural concept.

## Controlled contradiction behavior

A controlled synthetic overlap fixture was supported by the A15 reader. When an expected separated-mass relation conflicts with overlapping actual mass bounds, A16 emits `CONFLICT` with `OBSERVED_GEOMETRY` and `PROJECT_INTENT` bases. It does not silently reconcile the conflict or label the design bad.

## Human authority

A16 findings and hypotheses remain advisory. Human authority retains control over:

- whether a finding matters;
- whether an objective priority changes;
- whether a hypothesis is worth exploring;
- whether more evidence or analysis is required;
- whether any design change is authorized;
- whether a Decision is created.

A16 creates no winner, recommendation, preference or Decision.

## Visual and i18n surface

The existing A14/A15 visual surface and SVG renderer are reused. A16 is shown as contextual critique after the actual design reading. The visual hierarchy remains:

```text
SEE DESIGN
→ UNDERSTAND WHAT IS OBSERVED
→ REVIEW FINDINGS
→ INSPECT HYPOTHESES
```

A16 strings were added to the existing eight-locale catalog. No second critic engine, renderer or spatial model was created.

## Validation

```text
FOCUSED_A16_A15_A14_TESTS = 13 PASSED
FULL_WEB_TEST_FILES = 43 PASSED
FULL_WEB_TESTS = 222 PASSED
TYPESCRIPT = PASS
VITE_BUILD = PASS
GIT_DIFF_CHECK = PASS
I18N_JSON_8_LOCALES = PASS
CONTROLLED_RUNTIME = PASS
```

The build retains the existing non-blocking warning for chunks larger than 500 kB. No new dependency was added.

## Required classifications

```text
A16 = PASS_WITH_OBSERVATIONS
ARCHITECTURAL_CRITIQUE = PASS
OBSERVATION_BASIS = PASS
EXPLICIT_SUBJECT = PASS
INTENT_CRITIQUE = PASS
OBJECTIVE_CRITIQUE = PASS_WITHOUT_INVENTED_ATTAINMENT
CONSTRAINT_CRITIQUE = READY_WHEN_VERIFIED_CONSTRAINT_PRESENT
REGULATORY_CRITIQUE = UNKNOWN_WHEN_RULE_ABSENT
ENVIRONMENTAL_CRITIQUE = UNKNOWN_WHEN_ANALYSIS_ABSENT
DESIGN_KNOWLEDGE_CRITIQUE = NOT_DEMONSTRATED_IN_THIS_CONTROLLED_PROOF
UNKNOWN_AS_FINDING = PASS
BOUNDED_CHANGE_HYPOTHESIS = PASS
CAPABILITY_AWARENESS = PASS
UNSUPPORTED_CAPABILITY_PRESERVED = PASS
NO_SILENT_APPROXIMATION = PASS
NO_FALSE_CAUSALITY = PASS
NO_FALSE_PERFORMANCE = PASS
NO_FALSE_COMPLIANCE = PASS
NO_QUALITY_SCORE = PASS
NO_WINNER = PASS
NO_DECISION = PASS
NO_RECOMMENDATION = PASS
NO_GEOMETRY_MUTATION = PASS
NO_P9_EXECUTION = PASS
NO_AUTONOMOUS_LOOP = PASS
NO_NEW_OPERATION = PASS
NO_SPECIALIST_AGENT = PASS
NO_SECOND_CRITIC_ENGINE = PASS
VISUAL_FIRST = PASS
RENDERER_REUSE = PASS
RESPONSIVE = PASS_WITH_EXISTING_LAYOUT
I18N_8_LOCALES = PASS
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_CANONICAL_ENTITY = 0
REAL_GATE = NOT_TRIGGERED
```

## Limitations and observations

A16 is a safe traceable critic for the currently represented design state. It does not yet provide complete room/program semantics, circulation topology, verified regulatory interpretation, full environmental analysis, economic analysis, constructability analysis or substantive Design Knowledge critique in this controlled proof. These are explicit capability boundaries, not reasons to fabricate conclusions.

The next capability, if desired, requires a separate Product Owner authorization. A16 does not activate P7-A Knowledge Federation, specialist routing, book ingestion, RAG, vector databases, knowledge graphs, Site Development Opportunity Intelligence or autonomous design iteration.

## Commit policy

One coherent local Web commit is created. No remote publication, PR, merge or deployment is performed.
