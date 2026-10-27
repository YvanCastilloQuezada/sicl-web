# ARKI — F7 Professional Technical Development Gate V1

**State:** OPEN / CONTRACT FORMATION  
**Date:** 2026-10-05  
**Predecessor:** F6 / AGK = GO at bounded demonstrated boundary  
**Purpose:** convert the canonical 3D constructive spine into a coordinated professional technical model without creating parallel truths.

## 1. F7 product boundary

F7 is not “add BIM features.” It is the professional-development layer in which the selected architectural state is developed, coordinated and checked across disciplines while D-2 remains architectural semantic authority and AGK/OCCT remains operational geometry authority.

Target chain:

```
D-2 architectural intent / requirements
  -> AGK canonical 3D + persistent semantic lineage
  -> professional discipline projections
  -> jurisdiction / applicability evidence
  -> architecture + structure + MEP + life-safety + accessibility
  -> quantities / cost
  -> clash / consistency / completeness gates
  -> coordinated professional model
  -> F8 dossier generation
```

A discipline adapter may propose analysis, geometry or metadata. It may not silently create a second canonical building model.

## 2. Entry gate

F6 entry dependency is satisfied by the recorded local final gate:
- TypeScript exit 0;
- DELTA-005 8/8 files, 88/88 tests;
- production build exit 0;
- bounded AGK contracts frozen at their demonstrated boundary.

F7 therefore opens without reopening F6 discovery by default.

## 3. Work packages — ordered

| Order | Package | Goal | Initial state |
|---|---|---|---|
| F7.0 | Professional Model Contract | define one coordinated technical state and authority boundaries | ACTIVE |
| F7.1 | Jurisdiction & Applicability | project location -> applicable regulatory corpus -> evidence/UNKNOWN | RECONCILE |
| F7.2 | Architectural Technical Development | constructive assemblies, levels, openings, stairs, envelopes, rooms/spaces | RECONCILE |
| F7.3 | Structural Coordination | structural intent/model projection, interfaces, openings, conflicts | RECONCILE |
| F7.4 | MEP Coordination | discipline routes/reservations/clearances and conflict evidence | RECONCILE |
| F7.5 | Accessibility & Life Safety | accessibility, egress/fire checks with jurisdiction provenance | RECONCILE |
| F7.6 | Quantities & Cost | quantities derived from same canonical state; provenance to cost assumptions | RECONCILE |
| F7.7 | BIM / IFC / CAD Interoperability | exchange projections with semantic IDs and round-trip evidence | RECONCILE |
| F7.8 | Professional Coordination Gate | completeness, clash, consistency, UNKNOWN and specialist-review gates | DESIGN |
| F7.9 | F8 Handoff | freeze traceable coordinated state for dossier production | BLOCKED_BY_F7 |

## 4. Professional Model Contract — candidate invariants

1. **ONE PROJECT TRUTH:** professional disciplines reference the same project state; no discipline owns a hidden competing building truth.
2. **AGK GEOMETRY AUTHORITY:** canonical operational geometry mutations pass through authorized AGK interfaces.
3. **D-2 SEMANTIC AUTHORITY:** discipline calculations cannot silently rewrite architectural intent.
4. **PERSISTENT LINEAGE:** discipline objects and exchange entities reference stable ARKI semantic identity, not transient BRep indices.
5. **JURISDICTION IS EXPLICIT:** every normative check identifies jurisdiction, source/version/applicability and evidence state.
6. **UNKNOWN FAILS VISIBLE:** missing rule/data/discipline evidence remains UNKNOWN; it is never converted to PASS by absence.
7. **PROPOSAL != COMMIT:** analysis/coordination proposals do not mutate canonical state until accepted through the governed path.
8. **SPECIALIST AUTHORITY:** regulated professional validation/signature remains an explicit human/professional gate where legally required.
9. **DERIVED QUANTITIES:** quantities/cost reference canonical geometry/state and preserve assumptions/provenance.
10. **EXPORT != TRUTH:** IFC/CAD/BIM exports are projections/exchange artifacts, not independent canonical state.
11. **ROUND-TRIP IS EVIDENCE-BASED:** import/export claims require identity, geometry and semantic reconciliation evidence.
12. **F8 READS F7:** dossier outputs must be generated from the coordinated F7 state rather than independently redrawn.

## 5. Existing assets to reconcile before new implementation

Repository roadmap already identifies reusable surfaces/assets:
- BIM viewer;
- IFC/CAD adapters;
- historical research specialties;
- accessibility/fire;
- structure/MEP;
- quantities/cost;
- lifecycle documentation surfaces.

These are historical/repository candidates, not automatically current verified F7 capabilities. Each must be classified CLAIM / IMPLEMENTED / EXECUTED / VERIFIED / UNKNOWN before reuse.

## 6. Zero-debt gate

F7 cannot close with a known reproducible correctable defect inside its declared professional boundary. However:
- an explicit UNKNOWN is not automatically debt;
- a future discipline not claimed by the contract is not debt;
- a legally required specialist review is not a software defect;
- unsupported professional claims are a NO-GO.

## 7. Immediate execution sequence

1. Audit current repository for F7 assets rather than rebuilding them.
2. Produce an F7 capability matrix: asset -> authority -> current evidence -> missing contract/test -> target work package.
3. Reconcile jurisdiction/RNE handling separately from geometry.
4. Identify the smallest E2E professional slice that crosses architecture -> AGK -> one discipline -> coordination -> evidence without parallel truth.
5. Only then implement missing contracts/tests.

**Initial candidate E2E slice:** one architectural opening/penetration whose semantic intent is preserved through AGK geometry, structural/MEP coordination evidence, conflict/clearance evaluation, accepted mutation and IFC/BIM projection. This is a candidate until repository audit confirms the best existing path.


## 8. Product Owner decision — Existing-project intervention modes

**Decision date:** 2026-10-05

F7 must support existing projects as first-class inputs, not only projects generated natively by ARKI. The professional-development product is therefore organized by intervention depth over an immutable imported baseline.

### Input families

ARKI must be able to receive, subject to adapter support and evidence:
- a complete BIM model such as RVT/IFC;
- CAD project packages such as DWG/DXF and other supported exchange geometry;
- a complete technical dossier containing drawings, specifications, quantities, unit-price analyses, budgets and discipline documents;
- combinations of model + dossier.

An imported source is never silently overwritten. It becomes a versioned **BASELINE_0** with provenance, source files, extraction confidence and UNKNOWNs.

### Four intervention levels

| Level | Product mode | Required behavior |
|---|---|---|
| L1 | DIGITAL RECONSTRUCTION / NORMALIZATION | ingest the delivered project as-is; reconstruct/normalize it into ARKI's coordinated digital/3D representation while preserving provenance and without claiming design improvement |
| L2 | TECHNICAL COORDINATION / QA | inspect architecture and specialties; detect clashes, overlaps, missing clearances, inconsistencies and coordination problems; propose traceable corrections |
| L3 | ARCHITECTURAL IMPROVEMENT | evaluate the existing architecture and propose functional, spatial, environmental, regulatory and technical improvements while measuring consequences against baseline |
| L4 | CONTROLLED REDESIGN / VALUE IMPROVEMENT | generate architecturally better alternatives with controlled change, initially targeting roughly 5–10% modification where appropriate, while keeping the project inside an explicitly defined budget/cost envelope and other owner constraints |

The 5–10% range is an owner target/strategy, not a universal geometric rule. Each project must define what “modification percentage” means (cost, quantities, affected elements, area, scope or a composite metric).

### Technical-dossier reconstruction mode

A complete CAD/document dossier may be used to reconstruct a coordinated 3D project state. Drawings alone are not assumed to contain all semantics: ARKI must preserve source confidence and UNKNOWNs, cross-check plans/sections/elevations/schedules/specifications and use quantities/budgets as independent evidence where available.

Once reconstructed, the same L2–L4 pipeline applies.

### Project-local cost intelligence

Unit prices, quantities, analyses and budget values supplied in a technical dossier may form a **PROJECT_COST_BASELINE** for that project. They are not silently promoted to global canonical cost knowledge.

Every proposed mutation must be capable of producing a cost delta against the project baseline:

```
BASELINE DESIGN + PROJECT_COST_BASELINE
        -> proposed mutation
        -> quantity delta
        -> applicable unit-price mapping
        -> direct/derived cost delta
        -> uncertainty / missing-price evidence
        -> revised total + variance
```

This enables controlled questions such as: “Can ARKI produce a better architectural solution within the same budget?” A PASS requires demonstrated quantities, applicable prices and explicit uncertainty; missing cost mappings remain UNKNOWN.

### Comparison contract

Every improvement proposal preserves at least:
- BASELINE_0 immutable source state;
- proposal/version ID;
- changed semantic entities;
- geometric/discipline consequences;
- regulatory consequences;
- quantity changes;
- cost impact;
- quality/performance evaluation;
- rejected alternatives and rationale;
- Human Authority decision.

Thus ARKI can compare **AS-RECEIVED vs COORDINATED vs IMPROVED vs CONTROLLED-REDESIGN** without losing the original project.

### Architectural consequence for F7/F8

F7 owns reconstruction/normalization, technical coordination, professional analysis and cost-aware mutation evidence. F8 consumes the accepted coordinated/improved state to generate or regenerate the technical dossier. This prevents a separate dossier truth from diverging from the canonical project state.
