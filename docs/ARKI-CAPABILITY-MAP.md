# ARKI — Capability Map V1

**Estado:** CURRENT / CANONICAL / GENERATED FROM ACTUAL IMPLEMENTATION  
**Fecha de corte:** 2026-09-19
**Autoridad de estado:** `ARKI-Research-Implementation-Handoff-Manus-v1.0(2).xlsx` y su reconciliación canónica.
**Regla:** `IMPLEMENTED` no significa `PROFESSIONALLY CERTIFIED`; los estados externos, la cobertura parcial y los datos faltantes permanecen explícitos.

## 1. Identidad y repositorios

La raíz canónica es **ARKI — Architectural Design Intelligence**. ARKI reutiliza los contratos SICL, A21, GDI, S1/S2, el modelo canónico de edificio, la evidencia y el orquestador de entrega. No existe un segundo motor de generación, un segundo modelo BIM, un segundo sistema de memoria ni un segundo motor de distancia.

| Repositorio | Rama | HEAD | Estado |
|---|---|---|---|
| Core | `feat/weather-environmental-context-p1` | `646dae525dd1db4b9f357aced21cc1302fc791a0` | sin cambios de esta macroorden |
| Web | `feat/spatial-pilot-media-studio-v1` | se actualiza en el commit de reconciliación | push autorizado por instrucción posterior; sin PR, merge ni deploy |

## 2. Organigrama funcional

```text
ARKI — ARCHITECTURAL DESIGN INTELLIGENCE
├── FOUNDATION
│   ├── SICL Core
│   ├── Human Authority
│   ├── Evidence / Provenance / Lineage
│   └── Epistemic Integrity: HYPOTHESIS / UNKNOWN / no winner
├── ARCHITECTURAL INTELLIGENCE
│   ├── Program / Relationships / Zoning / Circulation
│   ├── Concept / Parti / Privacy / Views
│   ├── A15 Read / A16 Critique / A17 Revision
│   └── DesignMemory / Unified Architectural Design Read Model
├── GENERATIVE INTELLIGENCE
│   ├── GDI-P9 → GDI-P24
│   ├── Alternatives / DNA / Branches / Replay
│   ├── Comparison / Challenge / Trade-offs
│   └── GDI → S2 controlled loop
├── DESIGN MODES
│   ├── JUNIOR
│   ├── ARCHITECT
│   ├── MASTER
│   └── CRAZY
├── BUILDING REALIZATION
│   ├── S1 conceptual floor plan
│   ├── S2 controlled spatial editing
│   ├── CanonicalBuildingModel
│   └── Plan / Section / Massing / Circulation views
├── TECHNICAL + PROFESSIONAL INTELLIGENCE
│   ├── S3–S11 engineering awareness
│   ├── S12–S20 regulation / knowledge / site / cost / persistence
│   └── External calculation and certification gates
├── AUTHORING + INTEROPERABILITY
│   ├── Drawings / SVG / PDF conceptual source
│   ├── DXF adapter
│   ├── IFC massing-only adapter
│   ├── GeoJSON / GIS when georeferenced data exists
│   └── Visual / GLB / 2D / 3D conceptual representations
└── DELIVERY
    ├── Design Basis
    ├── Drawings / CAD / BIM / GIS / Visual
    ├── Project Data snapshot
    └── Explicit external dependencies
```

## 3. Shared engine and modes

All four modes point to the same GDI, A21, S1/S2 and CanonicalBuildingModel contracts. The mode changes exploration depth, breadth, critique depth, novelty tolerance and bounded mutation amplitude. It does not change truth status, invent evidence, bypass hard constraints, create a decision or select a winner.

| Mode | Reasoning depth | Alternative budget | Novelty | Mutation boundary | Intended use |
|---|---:|---:|---|---|---|
| JUNIOR | 1 | 1 | LOW | LOW | Conservative educational exploration |
| ARCHITECT | 2 | 3 | BALANCED | MEDIUM | Balanced professional exploration |
| MASTER | 4 | 3 | HIGH | HIGH | Deep multi-domain exploration |
| CRAZY | 5 | 3 | RADICAL_BOUNDED | RADICAL_BOUNDED | Radical but bounded hypotheses |

## 4. Capability inventory

The registry currently contains **15 bounded capability groups**. Counting is by canonical `CapabilityRecord.id`, not by file count, test count or historical phase count. Typology coverage is **23/23 present**, but the source-derived knowledge corpus, multiscale evidence, regulatory corpus and professional validation remain partial or unknown. Core remains unchanged.

| Branch | Capability groups | Main capabilities | Status distribution |
|---|---:|---|---|
| Foundation / epistemic controls | 1 | Human Authority, provenance, UNKNOWN, no automatic decision | PROVEN |
| Architectural intelligence | 3 | A21, A15–A17, DesignMemory, unified read model | PROVEN / PROVEN_WITH_OBSERVATIONS |
| Generative intelligence | 1 | GDI-P9–P24, alternatives, DNA, branches, comparison, challenge | PROVEN |
| Spatial realization | 1 | S1/S2, boundaries, openings, routes, parent/child readback | PROVEN_WITH_OBSERVATIONS |
| Visual/documentation | 2 | V-A and V-B | PROVEN_WITH_OBSERVATIONS |
| BIM/GIS interoperability | 2 | V-C, GIS-CADASTRE | EXTERNAL_VALIDATION_REQUIRED / REQUIRES_DATA |
| Engineering | 1 | S3–S11 conceptual registry and impact readback | PROVEN_WITH_OBSERVATIONS |
| Professional intelligence | 1 | S12–S18 knowledge, regulation, site, cost, persistence | PROVEN_WITH_OBSERVATIONS |
| Integrated product | 1 | S19–S20 local foundation and restoration | PROVEN_WITH_OBSERVATIONS |
| Delivery boundary | 1 | Delivery package and external dependency register | UNKNOWN / EXTERNAL_VALIDATION_REQUIRED |
| **Total** | **15** | **Canonical registry records** | — |

## 5. Capability truth table

| Capability | Status | Limit |
|---|---|---|
| Program, relationships, zoning and circulation | PROVEN | Hypothesis-based architectural intent; human review remains required |
| Concept, parti and mode adaptation | PROVEN_WITH_OBSERVATIONS | Derived and revisable; not an automatic architectural decision |
| Alternatives, trade-offs and challenge | PROVEN | Descriptive comparisons; no ranking or winner |
| S1 conceptual floor plan | PROVEN_WITH_OBSERVATIONS | Geometrically verified conceptual plan; not construction documentation |
| S2 spatial editing | PROVEN_WITH_OBSERVATIONS | Human authorization, immutable parent and fresh readback |
| Canonical building model | PROVEN | Single derived model for current local scope |
| Drawings and visual output | PROVEN_WITH_OBSERVATIONS | Conceptual plan/site/section/elevation and SVG source |
| DXF | EXTERNAL_VALIDATION_REQUIRED | Adapter exists; round-trip requires external CAD validation |
| IFC/Revit | EXTERNAL_VALIDATION_REQUIRED | Massing-only adapter; native Revit runtime is external |
| GIS/cadastre | REQUIRES_DATA | CRS, surveyed parcel, terrain and provenance are required |
| Engineering | PROVEN_WITH_OBSERVATIONS | Conceptual reservations and impacts; verified calculations require engines and data |
| Regulation | PROVEN_WITH_OBSERVATIONS | Applicability chain exists; no compliance claim |
| Cost | PROVEN_WITH_OBSERVATIONS | Quantities may be derived; rates and costs remain UNKNOWN |
| Persistence | PROVEN_WITH_OBSERVATIONS | Deterministic local snapshot; production persistence not claimed |
| Delivery | PROVEN_WITH_OBSERVATIONS | Packages outputs and declares external gates |

## 6. Fresh Design Genius proof

The bounded fixture `ARKI-DESIGN-GENIUS-E2E-001` is generated through the shared GDI engine and is not selected from the HOUSE-A21 identity. It produces three hypothesis alternatives with stable project-scoped identifiers, descriptive comparisons, lineage, challenge questions and human-selection requirements. The proof covers the four modes and confirms that mode variation preserves human authority, hard constraints and unknown states.

The fixture is a local architectural intelligence proof. It does not prove professional certification, regulatory compliance, structural adequacy, Revit round-trip, surveyed GIS correctness, photoreal rendering or construction readiness.

## 7. Canonical dependency flow

```text
KNOWLEDGE + SITE + PROGRAM + HUMAN INTENT
                    ↓
       ARCHITECTURAL INTELLIGENCE + MODE
                    ↓
           GENERATIVE INTELLIGENCE
                    ↓
             SPATIAL REALIZATION
                    ↓
              BUILDING MODEL
                    ↓
                ENGINEERING
                    ↓
         PROFESSIONAL INTELLIGENCE
                    ↓
             DELIVERY ORCHESTRATOR
                    ↓
       PLAN / CAD / BIM / GIS / VISUAL / DATA
```

## 8. External and data-dependent boundaries

Revit runtime, IFC parser/readback, DWG round-trip, photoreal renderer, CFD, energy simulation, structural solvers, detailed MEP, official GIS/cadastre, survey/terrain, current regulatory corpus, market rates and professional certification remain external gates. The local system reports `EXTERNAL_VALIDATION_REQUIRED`, `REQUIRES_DATA`, `CALCULATION_REQUIRED` or `UNKNOWN` rather than fabricating results.

## 9. Next stage

After this macroorder, ARKI broad capability expansion is frozen. The next work should use real architectural projects to verify the existing capabilities, find failures, fix those failures, validate professionally and connect external engines. No new capability alphabet is created automatically.
