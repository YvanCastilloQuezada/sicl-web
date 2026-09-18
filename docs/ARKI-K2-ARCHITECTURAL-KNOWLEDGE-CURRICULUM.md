# ARKI-K2 — Architectural Knowledge Curriculum & Domain Model

## A. Executive classification

ARKI-K2 is a **declarative curriculum and domain model**, not a knowledge database. It defines what ARKI should be prepared to reason about before sources are ingested. The implementation is deterministic, in-memory and source-free. It does not retrieve, ingest, rank, recommend, decide, simulate or claim compliance.

```text
ARKI_K2 = PASS_WITH_OBSERVATIONS
ARCHITECTURAL_KNOWLEDGE_CURRICULUM = PROVEN
DOMAIN_REGISTRY = PROVEN
WORLD_CLASS_FACULTY_COVERAGE = COMPLETE
SPATIAL_SCOPE_MAPPING = PROVEN
DESIGN_STAGE_MAPPING = PROVEN
KNOWLEDGE_OUTPUT_BOUNDARIES = PROVEN
EVIDENCE_REQUIREMENT_MODEL = PROVEN
QUESTION_CLASSIFICATION = PROVEN
```

## B. Baselines

```text
CORE = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE = 7af55781ce02db3ce322c50fa80ed85dfa13aa51
ARKI_K1 = PASS_WITH_OBSERVATIONS / CLOSED / FROZEN
A21-P4 = CLOSED / FROZEN
A21-P4E = REAL_GATE / FROZEN AT GATE
```

## C. Reuse audit

K2 reuses the K1 epistemic boundaries, A21 program and relationship semantics, the existing eleven SpatialScope values, existing project vocabulary, A20-P3R regulatory principles, A27 capability profiles, DesignMemory and provenance. No second Evidence, HumanReview, SpatialScope, DesignStage, Regulation, Decision, Project, Alternative or DesignMemory ontology was created.

K2 adds one bounded registry because the existing implementation did not contain a complete professional curriculum with domain questions, scale applicability, stage applicability, output boundaries and evidence modes. It is not persisted and does not change Core.

## D. Curriculum architecture

The registry contains **28 domains**. Every domain declares an identity, questions, applicable scales, applicable design stages, legitimate output types, evidence modes, related world-class faculties and typology relevance.

The domains are:

| # | Domain | Primary emphasis |
|---:|---|---|
| 1 | Architectural Foundations | Space, form, mass, void, order, scale, threshold and character |
| 2 | Architectural History & Theory | Movements, schools, authors, criticism and historical context |
| 3 | Spatial Composition | Parti, hierarchy, adjacency, separation, courtyard, compact and sequence strategies |
| 4 | Human Needs & Brief | Users, activity, privacy, access, behavior and adaptability |
| 5 | Architectural Programming | Program, capacity, areas, relationships, access and conflicts |
| 6 | Site & Context | Morphology, access, orientation, surroundings, hazards and infrastructure |
| 7 | Climate & Bioclimatic Design | Sun, shade, daylight, wind, ventilation, thermal and rain principles |
| 8 | Circulation & Architectural Experience | Arrival, movement, thresholds, nodes, wayfinding and vertical circulation |
| 9 | Typologies | Classification without prescriptive solutions |
| 10 | Housing | Domestic routines, privacy, zones, access, flexibility and outdoor relations |
| 11 | Structure | Grids, spans, load paths, cores and stability concepts |
| 12 | Construction & Constructability | Assemblies, sequence, tolerances, interfaces and maintenance |
| 13 | Material Intelligence | Properties, durability, expression, availability and circularity |
| 14 | Building Envelope | Facades, roofs, openings, weather, daylight and ventilation interfaces |
| 15 | Building Systems | Water, sanitary, electrical, HVAC, fire, energy and maintenance coordination |
| 16 | Accessibility & Inclusive Design | Mobility, sensory, cognitive, clearance and inclusive-use principles |
| 17 | Life Safety | Egress, exit, travel, refuge and emergency-access concepts |
| 18 | Regulatory Intelligence | Jurisdiction, applicability, versions, requirements and exceptions |
| 19 | Sustainability | Passive design, energy, water, materials, ecology and resilience |
| 20 | Economics & Development | Area efficiency, phasing, flexibility and cost-driver questions |
| 21 | Urban Design | Block, street, plot, frontage, density, public realm and permeability |
| 22 | Landscape & Ecology | Terrain, vegetation, shade, water, soil, biodiversity and stormwater |
| 23 | Architectural Representation | Plans, sections, diagrams, massing, AR and BIM representation |
| 24 | Architectural Criticism | Coherence, hierarchy, circulation, context, character and trade-offs |
| 25 | Design Process & Iteration | Brief, intent, strategy, parti, critique, revision and selection |
| 26 | Precedent Intelligence | Identity, author, date, strategy, limitation and provenance |
| 27 | Post-Occupancy & Design Outcomes | Occupant feedback, measured performance, maintenance and adaptation |
| 28 | Professional Practice | Stages, coordination, responsibility, deliverables and quality control |

## E–H. Faculty, scale and stage mapping

All 12 registered world-class faculties are covered by one or more domains:

```text
BRIEF_HUMAN_NEEDS → Human Needs, Programming, Housing
SPATIAL_COMPOSITION → Foundations, Spatial Composition, Programming
ARCHITECTURAL_SYNTHESIS → Foundations, Composition, Programming, Process
SITE_CONTEXT → Site, Urban Design, Landscape, Climate
CIRCULATION_EXPERIENCE → Circulation, Housing, Accessibility, Life Safety
ENVIRONMENTAL_DESIGN → Climate, Envelope, Sustainability, Landscape
STRUCTURE_CONSTRUCTABILITY → Structure, Construction, Envelope
BUILDING_SYSTEMS → Building Systems, Construction
MATERIAL_INTELLIGENCE → Materials, Envelope, Sustainability
REGULATORY_SAFETY → Regulatory, Accessibility, Life Safety
ARCHITECTURAL_CRITICISM → Foundations, History, Criticism, Representation
DESIGN_EVOLUTION_MEMORY → History, Economics, Process, Precedent, Outcomes, Practice
```

The eleven canonical scopes are reused without creating a second scale ontology:

```text
pais → macro_region → region → provincia_metropoli → distrito_ciudad
→ zona_barrio_sector → parcela_sitio → edificacion → sistema → espacio → objeto
```

Domains use `PRIMARY`, `SECONDARY` or absence of mapping. A housing-room lesson may apply to `espacio` and `edificacion`; it does not silently become a country or city rule. Design stages use the existing compatible vocabulary: `STRATEGIC`, `PRE_DESIGN`, `BRIEF`, `SITE_ANALYSIS`, `CONCEPT`, `SCHEMATIC_DESIGN`, `DESIGN_DEVELOPMENT`, `DOCUMENTATION`, `CONSTRUCTION`, `OPERATION` and `POST_OCCUPANCY`.

## I–J. Outputs and evidence requirements

Legitimate outputs are `FACT`, `OBSERVATION`, `EXPERIENCE`, `SOURCE_STATEMENT`, `INTERPRETATION`, `PRECEDENT`, `STRATEGY_CANDIDATE`, `PATTERN_CANDIDATE`, `DESIGN_HYPOTHESIS`, `OPEN_QUESTION`, `CONTRADICTION` and `UNKNOWN`.

Evidence modes are `GENERAL_KNOWLEDGE_ALLOWED`, `SOURCE_REQUIRED`, `PROJECT_EVIDENCE_REQUIRED`, `COMPUTATION_REQUIRED`, `SIMULATION_REQUIRED`, `REGULATORY_SOURCE_REQUIRED`, `HUMAN_INPUT_REQUIRED`, `SPECIALIST_EVIDENCE_REQUIRED` and `UNKNOWN_IF_MISSING`.

The registry preserves these boundaries:

```text
BIOCLIMATIC PRINCIPLE ≠ PERFORMANCE RESULT
STRATEGY ≠ COMPLIANCE
PROXY ≠ SIMULATION
PRECEDENT ≠ PRESCRIPTION
REPRESENTATION ≠ UNDERLYING TRUTH
ARCHITECTURAL STRUCTURAL REASONING ≠ ENGINEERING CALCULATION
```

## K–L. Question taxonomy and knowledge/design boundary

The deterministic classifier recognizes definition, explanation, theory, precedent, design strategy, project interpretation, project fact, performance, regulatory, compliance, simulation, comparison, critique, constructability, material, typology and history questions.

For example, the HOUSE-A21 question about moving the kitchen farther from access is routed to Spatial Composition, Housing, Programming, Circulation and Design Process. It returns relevant domains and evidence requirements. It does not answer “move it” or “do not move it”. Knowledge may inform a strategy, and a strategy may inform a hypothesis, but knowledge does not automatically execute a design operation or create a decision.

## M–Q. Controlled proofs

### HOUSE-A21

The question is classified as a project interpretation requiring human input and project evidence. The curriculum identifies relevant domains and preserves the design question as open to human architectural judgment.

### Bioclimatic

“Would a courtyard improve daylight in this house?” is classified as a bioclimatic performance question. Without computation or simulation the state is `NOT_COMPUTED`; no performance claim is created.

### Regulatory

“Is this bedroom compliant?” is routed to Regulatory Intelligence with Accessibility and Life Safety context. Without jurisdiction, rule version, verified requirement and project evidence, the state is `NOT_ASSESSED`.

### Precedent

“Project X uses a courtyard” may become a source-backed precedent or strategy candidate. It does not create a project requirement.

### Contradictory theories

Compact organization and courtyard organization can both exist as knowledge positions. The contradiction and trade-off remain preserved; no winner is selected.

## R–W. Scale, stage and missing-evidence controls

A room-relationship lesson remains bounded to room/building contexts. A conceptual parti may inform concept or schematic design, but is not construction-detail evidence. Source-required questions without a source return `UNKNOWN` or `SOURCE_REQUIRED`. Computation-required questions return `NOT_COMPUTED` when no computation occurred. Simulation-required questions return `NOT_SIMULATED` when no simulation occurred. Human-input-required questions return `UNKNOWN` when the architect has not supplied the preference or brief.

## X. Housing profile

`HOUSING` is prepared and not source-populated. It organizes questions about household composition, routines, privacy gradients, social/service/private zones, kitchen, living/dining, bedrooms, bathrooms, storage, access, outdoor space, flexibility, daylight, ventilation, structure, systems, materials, constructability, accessibility, life safety, regulation, cost implications, iteration and post-occupancy.

## Y. Bioclimatic profile

`BIOCLIMATIC` is prepared and not source-populated. It organizes questions about climate, sun, shade, wind, ventilation, thermal response, daylight, humidity, rain, vegetation, water, passive strategies and renewables. It does not generate external-source recommendations.

## Z. Future source readiness

K2 defines where future sources would belong without ingesting them:

```text
housing book → HOUSING + SPATIAL_COMPOSITION + ARCHITECTURAL_PROGRAMMING
bioclimatic paper → CLIMATE_BIOCLIMATIC + evidence provenance
regulation → REGULATORY_INTELLIGENCE
precedent monograph → PRECEDENT_INTELLIGENCE
```

No source documents entered runtime knowledge.

## AA. K1 compatibility and federation status

K1 remains frozen and unregressed. K2 uses K1’s separation between experience, knowledge candidate, validated knowledge, contradiction and unknown. Knowledge Federation remains `FROZEN / NOT ACTIVATED`. Source ingestion, retrieval, RAG, embeddings, vector database, model training and specialist agents remain `NOT_ACTIVATED`.

## AB–AK. Validation and final state

```text
FOCUSED_K2_TESTS = 9 passed
TYPECHECK = PASS
FULL_WEB_SUITE = 73 files / 356 tests passed
BUILD = PASS
git diff --check = PASS
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_CANONICAL_ENTITY = NO
REAL_GATE = NOT_TRIGGERED
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

The full suite, build and diff check are executed after this document is written. One local commit is created only if all validation passes.
