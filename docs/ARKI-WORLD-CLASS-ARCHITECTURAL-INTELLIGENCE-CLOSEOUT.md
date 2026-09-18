# ARKI — World-Class Architectural Intelligence Foundation

## 1. Scope and result

This macroorder consolidated the existing A21, D1–D32, K1–K11, GDI, S1/S2, building authoring, engineering, professional-intelligence and delivery surfaces. It did not create a second generative architecture, second building model, second evidence system, second BIM/GIS model or automatic decision layer.

**Target state:** `ARKI_ARCHITECTURAL_INTELLIGENCE = IMPLEMENTED / INTEGRATED / READY_FOR_RIGOROUS_VALIDATION`.  
**Delivery state:** `IMPLEMENTED_WITH_EXPLICIT_EXTERNAL_GATES`.  
**Human architect:** final authority.  
**Production deployment:** not performed.

## 2. Repository state

| Repository | Branch | Baseline at start | Final after commit |
|---|---|---|---|
| Core | `feat/weather-environmental-context-p1` | `646dae525dd1db4b9f357aced21cc1302fc791a0` | unchanged by this order |
| Web | `feat/spatial-pilot-media-studio-v1` | `04939e492e9bf0ed248c396771de83712b762ad9` | reported after local commit |

Core contract was not changed. Existing unrelated/untracked historical documents were not deleted or reset.

## 3. Changes completed in this order

The implementation surface is intentionally small:

| Change | Purpose |
|---|---|
| `arkiAdvancedSpatialEditing.ts` | Corrected the S2 parent immutability proof so it compares the parent against a snapshot of itself rather than regenerating a HOUSE-A21 fixture. |
| `a21SpatialConfiguration.ts` | Generalized configuration/project identifiers from HOUSE-A21-only literals to strings, preserving the same canonical model and epistemic rules. |
| `arkiAdvancedDesignIntelligence.ts` / `arkiGenerativeDesignContinuum.ts` | Scoped generated GDI alternative and representation IDs to the requested project; avoids cross-project identity collisions. |
| `arkiDeliveryOrchestrator.ts` | Added a bounded delivery package over the canonical model: design basis, drawings, SVG, CAD, BIM, GIS and persistence states. It does not fabricate external validation. |
| `arki-delivery-orchestrator.test.ts` | Proves model-version consistency, conceptual views, external-state honesty and human authority. |
| `ARKI-CAPABILITY-MAP.md` / `.svg` | Current organigram, branch inventory, factual scoreboard, dependency view and no-duplication rules. |

## 4. Reused capabilities

A21 program, relationships, zoning and circulation; A15 reading; A16 critique; A17 controlled revision; DesignMemory; GDI-P9–P24; K1–K11 knowledge/provenance; S1 conceptual spatial realization; S2 controlled mutation; the CanonicalBuildingModel; SpatialRepresentation; derived plan/site/section/elevation views; engineering S3–S11; professional foundation S12–S20; spatial export adapters; local persistence envelope; and existing viewers were reused.

## 5. Capability status

The canonical map records factual status rather than a subjective quality score. The operational mechanisms exist for program, relationships, flow, site context, concept, parti, plan, section, massing, circulation, alternatives, critique, trade-offs, change impact and conceptual documentation. Environmental, structural, systems and constructability reasoning are available as bounded context, reservations, pressures and unknowns, not as universal professional calculations.

## 6. Delivery outputs

The new delivery orchestrator produces four conceptual drawing views, SVG artifacts, a canonical model version, identity checks and explicit states for DXF, IFC, GeoJSON and persistence. IFC remains massing-only. DXF and IFC round-trip validation, Revit runtime verification, surveyed GIS/CRS validation, signed professional sheets and construction documentation remain external or data-dependent.

## 7. External dependency register

| Dependency | Local state | External requirement |
|---|---|---|
| Revit / IFC round-trip | Adapter and massing semantics | Revit-compatible runtime and round-trip test |
| DWG/CAD | DXF adapter | CAD parser and professional review |
| GIS/cadastre | GeoJSON semantics | surveyed geometry, CRS, terrain and official sources |
| Structural / MEP solvers | conceptual pressures/reservations | verified inputs and specialist engines |
| CFD / energy / advanced simulation | not claimed | validated simulation stack |
| Regulatory compliance | source/applicability chain | jurisdiction, current corpus and human professional review |
| Cost | estimated quantities where available | verified rates, market data and scope |
| Photoreal renderer / animation | conceptual visual source | external renderer/runtime |
| Production persistence | deterministic local serialization | deployed database, auth, recovery and multi-user validation |

## 8. Epistemic and authority controls

Generated configurations, alternatives, child mutations, drawings and delivery artifacts remain hypotheses or conceptual derivatives. `UNKNOWN`, `REQUIRES_DATA`, `EXTERNAL_VALIDATION_REQUIRED` and `NO_COMPLIANCE_CLAIM` are not silently converted into facts. No automatic winner, ranking, recommendation, decision or mutation is created.

## 9. Validation plan and final result

Validation executed for the changed surface:

- TypeScript check: PASS.
- Focused GDI/S2/Capability Set tests before Delivery Orchestrator: 15/15 PASS.
- Delivery Orchestrator tests: executed in final validation.
- Full Web suite, build and diff check: executed in final validation.
- Core suite: executed without changing Core.

Final verified results:

- Web suite: **93 test files / 481 tests PASS**.
- Web TypeScript: **PASS**.
- Web production build: **PASS**; Vite emitted only the existing large-chunk advisory.
- Web `git diff --check`: **PASS**.
- Core `.venv/bin/pytest -q`: **PASS**.
- Focused changed-surface tests: **17/17 PASS** (15 pre-orchestrator regression tests plus 2 delivery tests).

A failure caused by an external runtime is reported as an observation, not relabeled as a product success.

## 10. Final limitations

ARKI is not presented as an autonomous licensed architect, permit issuer, structural engineer or construction-document generator. It is an integrated architectural-intelligence foundation with controlled synthesis, spatial realization, critique, engineering awareness and professional-output boundaries. Real project validation, specialists, authoritative data and human approval remain mandatory.
