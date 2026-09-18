# SiMS-DeI — Frozen Future Order

## SITE-DEVELOPMENT-OPPORTUNITY-INTELLIGENCE-01

### Context-Aware Site Use & Development Opportunity Exploration

**Status:** `REGISTERED / APPROVED AS PRODUCT DIRECTION / FROZEN`

**Implementation status:** `NOT AUTHORIZED`

**Authority:** Product Owner / Human Authority

**Assistant:** ARQUI

## Product direction

SiMS-DeI shall preserve a future direction in which ARQUI can receive or identify a site and help explore what could reasonably be developed there. The capability is intended to produce multiple **plausible site-use opportunities** and development scenarios from the site, its location, urban and territorial context, accessibility, surrounding uses, facilities, transport, site conditions, available evidence, verified regulatory information, and architectural or urban knowledge.

Potential uses include housing, multifamily housing, offices, retail, food service, health, education, hospitality, community or institutional uses, mixed use, and other contextually relevant uses. The future system must not be limited to a fixed list.

The intended reasoning chain is:

`SITE → CONTEXT → EVIDENCE → NEED / OPPORTUNITY HYPOTHESIS → POSSIBLE USE → DEVELOPMENT SCENARIO → BASIS → LIMITATIONS → UNKNOWN → HUMAN EXPLORATION`

The capability must eventually connect to the existing architectural sequence:

`SITE OPPORTUNITY ANALYSIS → HUMAN SCENARIO SELECTION → A11 DESIGN PROBLEM → A12 STRATEGY / PARTI → SPATIAL ORGANIZATION → GEOMETRIC ALTERNATIVES → ANALYSIS → CRITIQUE → ITERATION`

It must remain part of SiMS-DeI and must not become a separate product.

## Non-equivalence rules

The future capability shall preserve the following distinctions:

- **Plausible use** is not an investment recommendation.
- **Contextual opportunity** is not demonstrated market demand.
- A nearby facility is not proof of unmet need.
- Urban context is not zoning permission.
- A possible use is not a legally permitted use.
- Architectural plausibility is not financial feasibility.
- Financial feasibility is not an investment recommendation.
- External context is evidence with limitations, not unquestioned truth.
- A map is not an analysis.
- A pattern observed in data is not a verified causal explanation.

No automatic winner, best use, best investment, best business, or best project may be created. Human authority remains final over the scenario to study, objectives, risk tolerance, program, design direction, assumptions, final use, final design, and investment decision.

## Reuse potential

**Current architecture reuse potential:** `HIGH`

The future capability should preferentially compose, rather than duplicate, the following existing or already established SiMS-DeI surfaces:

- Site Intelligence and `SpatialLocation`.
- Georeferenced Site Intelligence.
- Real-World Spatial Context and provider-neutral context, including OpenStreetMap-derived roads, buildings, points of interest, water, green areas, transport, and elevation where available.
- Field Capture, Media Evidence Persistence, Visual Field Intelligence, and Spatial Evidence.
- Project State, Spatial Hierarchy, Spatial Relationships, and the 11 SpatialScopes.
- Design Knowledge / RFC-026.
- Objectives, Constraints, Preferences, Evidence, and HumanReview.
- The A11 Architectural Design Problem and A12 Architectural Synthesis pipeline.
- Future specialist routing and knowledge federation only when separately authorized.

No second site-intelligence system, evidence system, georeference system, agent family, or provider is implied by this registration.

## Future analytical boundaries

When separately authorized, future reasoning may examine urban fabric, surrounding buildings and use indicators, road and pedestrian access, public transport, facility distribution, activity corridors, parks, services, site characteristics, environmental conditions, and verified regulatory information. Appropriate context windows must be determined by the implementation; the illustrative distances in the source order are not universal constants.

All context-dependent conclusions must preserve provenance, including provider, dataset, feature, retrieval date, geographic scope, relationship or distance, confidence, limitations, and human-confirmed evidence where relevant. Missing information must remain explicitly unknown. Facility location is not facility capacity, facility existence is not service quality, and absence in a dataset is not real-world absence.

Regulatory status may only be stated when the applicable current rule has been verified. Market and economic conclusions require separately verified sources and specialist capability; context alone cannot support investment conclusions.

A future controlled pilot should use at least one real georeferenced site and demonstrate:

`REAL SITE → REAL EXTERNAL CONTEXT → FACILITY DISTRIBUTION → ACCESS → MULTIPLE USE HYPOTHESES → HUMAN REVIEW → SELECTED SCENARIO → A11 / A12`

## Explicit freeze

This registration authorizes documentation only. It does **not** authorize:

- product, Core, Web, API, database, UI, map, test, or architecture implementation;
- external POI queries or new providers;
- new agents or specialist agents;
- market integrations;
- book ingestion, RAG, vector databases, or knowledge graphs;
- modifications to A11, A12, or the active A13 baseline;
- push, pull request, merge, or deployment.

The current A13 Spatial Realization baseline remains active and is not interrupted.

## Required registration result

| Field | Registered value |
|---|---|
| `SITE_DEVELOPMENT_OPPORTUNITY_INTELLIGENCE` | `REGISTERED / FROZEN` |
| `PRODUCT_DIRECTION` | `APPROVED` |
| `IMPLEMENTATION` | `NOT AUTHORIZED` |
| `NEW_ARCHITECT_AGENT_REQUIRED` | `NO` |
| `SITE_INTELLIGENCE_REUSE` | `YES` |
| `REAL_WORLD_CONTEXT_REUSE` | `YES` |
| `SPATIAL_EVIDENCE_REUSE` | `YES` |
| `A11_A12_PIPELINE_REUSE` | `YES` |
| `SPECIALIST_ROUTING` | `FUTURE` |
| `MARKET_INTELLIGENCE` | `FUTURE` |
| `REGULATORY_INTELLIGENCE` | `REUSE_WHERE_VERIFIED / FUTURE_EXTENSION_AS_NEEDED` |
| `CORE_CHANGED` | `NO` |
| `WEB_CHANGED` | `NO` |
| `REAL_GATE` | `NOT TRIGGERED` |
| `PUSH` | `NO` |
| `PR` | `NO` |
| `MERGE` | `NO` |
| `DEPLOYMENT` | `NO` |

**Registration conclusion:** `SITE-DEVELOPMENT-OPPORTUNITY-INTELLIGENCE-01 = REGISTERED / APPROVED AS PRODUCT DIRECTION / FROZEN / NOT AUTHORIZED FOR IMPLEMENTATION`.

**Stop condition:** No new phase begins under this order. Future activation requires a separate explicit Product Owner execution order identifying the capability or an authorized subset.
