# ARKI Project Lifecycle, Cost and BIM 1.0

## Scope

ARKI now has a governed contract for participating in the project lifecycle from conception to post-occupancy evaluation. The lifecycle phases are conception, feasibility, brief/program, schematic design, developed design, permits/approvals, procurement/contracting, construction, commissioning/handover, operation, maintenance/renewal and post-occupancy evaluation.

The same Unified Motor remains the orchestration layer. It carries project identity, provenance, knowledge, alternatives, decisions, UNKNOWNs, cost assumptions, BIM entities and human review across phases.

## Costs and budgets

`calculateLifecycleBudget()` provides a transparent model with line items, quantities, unit costs, currency, source, confidence, contingency, initial cost, annual operations, annual maintenance and lifecycle horizon. It is suitable for conceptual estimates and scenario comparison. It does not replace a quantity surveyor, local price database, tax treatment, tender analysis or signed budget.

Cost claims must preserve confidence and source. Any line marked `UNKNOWN` remains visible in the budget result.

## BIM representation

`ARKI-BIM-SEMANTIC-1.0` represents sites, spaces, walls, doors, windows, slabs, roofs, structure, MEP and equipment with semantic properties, levels, source IDs and relationships. This creates a stable information model for coordination and future adapters.

JSON output is prepared. IFC, RVT, DWG and GIS outputs are represented as adapter targets but remain `REQUIRES_ADAPTER` until native round-trip fidelity, discipline coordination and exchange validation are demonstrated.

## Professional boundary

ARKI can participate in every phase as a traceable assistant and coordinator. It cannot sign, certify, approve, assume professional liability or claim that conceptual BIM is a construction-ready native model. Permit, structural, MEP, fire, accessibility, cost and commissioning decisions remain subject to qualified professionals and the relevant authority.
