# ARKI — Advanced Design Intelligence D1–D8 Closeout

## Executive result

The D1–D8 macroorder is implemented as a bounded Web-side architectural design exploration layer. It reuses the frozen A21 configuration, canonical `SpatialRepresentation`, existing `SpatialSvgViewer`, K4–K7 knowledge flow and K8–K11 real-source pilot. Core, Core Contract, persistence, infrastructure and deployment were not changed.

The result proves controlled design exploration rather than autonomous architectural decision-making. Every alternative remains a hypothesis. Human Architect authority is preserved.

## D1 — Real vertical circulation

D1 adds the minimum spatial representation of a vertical connection between N1 and N2. The representation includes identity, source and destination levels, footprint, entry, exit, direction, occupied region, connection relationships, provenance and epistemic status.

It explicitly separates `STAIR_GEOMETRY` from `CODE_COMPLIANT_STAIR`, and `VERTICAL_CONNECTION` from `ACCESSIBLE_ROUTE`. Structural design, riser/tread compliance, fire compliance and accessibility compliance remain unassessed.

**Result:** `D1_VERTICAL_CIRCULATION = PROVEN` and `VERTICAL_CIRCULATION_REALIZATION = PROVEN` within the controlled representation boundary.

## D2 — Multiple architectural alternatives

Three alternatives are generated from the same HOUSE-A21 program, site envelope, relationships, zoning intent and constraints:

| Alternative | Strategy | Architectural distinction |
|---|---|---|
| `HOUSE-A21-D2-A` | Compact privacy | Reduced outdoor opening and stronger compact/private organization |
| `HOUSE-A21-D2-B` | Courtyard social | Enlarged protected outdoor relationship and social void |
| `HOUSE-A21-D2-C` | Separated masses | Stronger distinction between social and service groupings |

They differ in spatial organization and relationship emphasis. They are not random perturbations and are not the same geometry with new IDs. No winner is selected.

**Result:** `D2_MULTIPLE_ALTERNATIVES = PROVEN`, `MULTIPLE_DESIGN_ALTERNATIVES = PROVEN`, `MEANINGFUL_VARIATION = PASS`, `FAKE_VARIATION = NONE`.

## D3 — Explicit deterministic variation

The variation mechanism records explicit variables, values, basis and expected effect. The current proof includes outdoor relationship and organization variables. Variation is deterministic and preserves program identifiers, unknowns, provenance and hypothesis status.

**Result:** `D3_DESIGN_VARIATION = PROVEN`, `DESIGN_VARIABLES = EXPLICIT`, `VARIATION_DETERMINISM = PASS`.

## D4 — Multi-generation lineage

The proof extends parent/child into three generations:

`GENERATION 0 → GENERATION 1 → GENERATION 2`

Each generation stores parent IDs, configuration IDs, revision IDs, human authorization references, affected geometry, unchanged geometry, reason, fresh-readback fingerprint, evaluation, provenance and source knowledge IDs where applicable. Parent configurations remain immutable and no destructive overwrite occurs.

**Result:** `D4_MULTI_GENERATION_LINEAGE = PROVEN`, `MULTI_GENERATION_LINEAGE = PROVEN`, `ANCESTRY_TRACEBACK = PASS`, `PARENT_IMMUTABILITY = PASS`.

## D5 — Knowledge-grounded design

D5 composes the completed knowledge flow:

`PROJECT STATE → QUESTION → K4 RETRIEVAL → K5 NEED → K6 FINDINGS → K7 SYNTHESIS → CRITIQUE → PROVISIONAL IMPLICATION → HUMAN AUTHORIZATION → REVISION HYPOTHESIS → GEOMETRIC REVISION`

The bioclimatic source-derived knowledge IDs are attached to the authorized revision hypothesis and to the generation provenance. This is traceability, not automatic authorization. The proof does not promote a knowledge claim to a requirement or decision.

**Result:** `D5_KNOWLEDGE_GROUNDED_DESIGN = PROVEN`, `KNOWLEDGE_GROUNDED_REVISION = PROVEN`, `SOURCE_TO_GEOMETRY_TRACEABILITY = PASS` within the controlled fixture.

## D6 — Environmental and regulatory design pressures

The environmental pressure is classified as a `DESIGN_OPPORTUNITY`. It concerns orientation, openings, shading and cross-ventilation as design considerations. It does not claim thermal comfort, airflow or energy performance.

The regulatory pressure is classified as `UNKNOWN_APPLICABILITY`. The RNE source is present, but jurisdiction, version, project scope and applicable rule have not been established for HOUSE-A21. No compliance claim is made.

**Result:** `D6_DESIGN_PRESSURES = PROVEN`, `ENVIRONMENTAL_DESIGN_PRESSURE = PROVEN`, `REGULATORY_DESIGN_PRESSURE = UNKNOWN`.

## D7 — Multi-dimensional critique

Each alternative receives structured critique across the evidence-supported dimensions of function, spatial relationships, environmental response and regulatory pressure. Every item preserves observation, interpretation, evidence, knowledge support, unknowns, limitations and design implication.

The critique does not produce a score, ranking, recommendation or winner. Structural, economic, accessibility, constructability and performance claims remain unknown where evidence is absent.

**Result:** `D7_MULTI_DIMENSIONAL_CRITIQUE = PROVEN`.

## D8 — Iterative architectural design evolution

The integrated proof combines program, design pressures, real knowledge, three alternatives, canonical spatial representations, structured critique, trade-offs, human-authorized revision hypotheses, three generations, fresh readback fingerprints, re-evaluation and visual comparison through the existing `SpatialSvgViewer`.

The visual panel provides controlled A/B/C inspection and displays the design-pressure boundaries. The panel is UI-minimal and does not redesign the application.

The fixture contains explicit human authorization references. ARKI does not fabricate a human choice. The selected alternative field identifies the controlled revision path used by the proof; it is not a winner or recommendation.

**Result:** `D8_ITERATIVE_DESIGN_EVOLUTION = PROVEN`, `ITERATIVE_DESIGN_EVOLUTION = PROVEN`, `MULTI_GENERATION_DESIGN = PROVEN`.

## Evaluation and authority boundaries

ARKI returns differences, strengths, weaknesses, tensions, unknowns, evidence gaps and provisional implications. It does not return best design, optimal design or automatic ranking. No automatic Pareto winner, weighted utility function, genetic algorithm or autonomous optimization was added.

The following remain explicitly unestablished: structural performance, environmental performance, regulatory compliance, accessibility compliance, constructability and economic implication.

## Cross-scale traceability

The current proof preserves the supported chain `SITE → BUILDING/FOOTPRINT → LEVEL → SPACE → ARCHITECTURAL ELEMENT` through parent IDs, level IDs, placement IDs and element metadata. Full territorial or GIS cross-scale semantics are not present in this proof.

**Result:** `CROSS_SCALE_TRACEABILITY = PARTIAL`.

## Validation

The focused D1–D8 test suite contains five tests covering real vertical geometry, three meaningful alternatives, explicit variation, multi-generation lineage, knowledge traceability, environmental and regulatory pressure classification, multi-dimensional critique, visual inspectability and negative authority controls.

Before final closeout, the complete Web suite, the K1–K11 regressions, TypeScript, production build and `git diff --check` are run. Existing warnings about large chunks, Three.js deprecation and jsdom canvas support do not constitute failures.

## Final classification

```text
ARKI_ADVANCED_DESIGN_INTELLIGENCE = PASS_WITH_OBSERVATIONS
D1_VERTICAL_CIRCULATION = PROVEN
D2_MULTIPLE_ALTERNATIVES = PROVEN
D3_DESIGN_VARIATION = PROVEN
D4_MULTI_GENERATION_LINEAGE = PROVEN
D5_KNOWLEDGE_GROUNDED_DESIGN = PROVEN
D6_DESIGN_PRESSURES = PROVEN
D7_MULTI_DIMENSIONAL_CRITIQUE = PROVEN
D8_ITERATIVE_DESIGN_EVOLUTION = PROVEN
REAL_STAIR_GEOMETRY = PROVEN
VERTICAL_CIRCULATION_REALIZATION = PROVEN
MULTIPLE_DESIGN_ALTERNATIVES = PROVEN
MEANINGFUL_VARIATION = PASS
DESIGN_VARIABLES = EXPLICIT
VARIATION_DETERMINISM = PASS
MULTI_GENERATION_LINEAGE = PROVEN
ANCESTRY_TRACEBACK = PASS
KNOWLEDGE_GROUNDED_REVISION = PROVEN
SOURCE_TO_GEOMETRY_TRACEABILITY = PASS
ENVIRONMENTAL_DESIGN_PRESSURE = PROVEN
REGULATORY_DESIGN_PRESSURE = UNKNOWN
MULTI_DIMENSIONAL_CRITIQUE = PROVEN
ITERATIVE_DESIGN_EVOLUTION = PROVEN
CROSS_SCALE_TRACEABILITY = PARTIAL
STRUCTURAL_PERFORMANCE = UNKNOWN
ENVIRONMENTAL_PERFORMANCE = UNKNOWN
REGULATORY_COMPLIANCE = UNKNOWN
AUTOMATIC_WINNER = NONE
AUTOMATIC_DECISION = NOT_CREATED
AUTONOMOUS_DESIGN_DECISION = NO
HUMAN_AUTHORITY = PRESERVED
K1_K11 = FROZEN
CORE_CONTRACT_CHANGED = NO
CORE_CHANGED = NO
WEB_CHANGED = YES
REAL_GATE = NOT_TRIGGERED
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

## References

[1]: https://arb.org.uk/architect-information/architects-code-standards-of-conduct-and-practice/ "Architects Code: Standards of Conduct and Practice"
[2]: https://ases.org/passivesolardesign/ "Why Homeowners Should Use Passive Solar Design"
[3]: https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne "Reglamento Nacional de Edificaciones - RNE"
