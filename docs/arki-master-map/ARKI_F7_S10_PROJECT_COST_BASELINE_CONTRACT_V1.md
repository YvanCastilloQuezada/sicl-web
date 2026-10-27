# ARKI — F7 S10 Project Cost Baseline Contract V1

**Date:** 2026-10-06
**State:** CONTRACT + BOUNDED IMPLEMENTATION / EXECUTION VERIFICATION PENDING
**Owner decision:** S10 project economics are project-local evidence, never global ARKI cost truth.

## 1. Purpose

Make S10 a first-class economic ingestion source for F7 so ARKI can consume a project's native budget structure without requiring manual flattening into many spreadsheets.

## 2. Hard boundary

S10 data ingested for project P becomes:

`PROJECT_COST_BASELINE(P)`

It does NOT become:
- ARKI global cost knowledge;
- a universal price library;
- proof that a price is current/correct;
- authority over canonical geometry;
- authority over architectural semantics.

Source S10 values preserve project, date/currency/location when available, source identity/version, and ingestion provenance.

## 3. Preferred ingestion ladder

Use the highest-fidelity legally/technically available adapter:

1. **S10 native project/database transport adapter** — preferred when an authorized supported export/backup can be safely read.
2. **S10 structured database connector** — only if schema/access/licensing are authorized and characterized.
3. **S10 official/structured Excel export adapter** — supported fallback.
4. **Report/PDF extraction** — last-resort evidence path, not equivalent to native structured ingestion.

Never reverse-engineer proprietary internals merely to bypass access restrictions. ACS may characterize formats/interfaces under the project’s legal/governance rules before production use.

## 4. Canonical economic projection

Minimum normalized entities:

- ProjectCostBaseline
- Budget
- SubBudget
- WBS/Title
- CostItem/Partida
- Unit
- Quantity/Metrado
- UnitPrice
- Resource
- ResourceFamily
- APU
- APUComponent
- SubPartida
- DirectCost
- GeneralExpense
- Utility/Markup where applicable
- Tax/foot-of-budget concept where applicable
- PolynomialFormula where present
- Schedule/Period linkage where present
- Valuation/Progress record where present
- SourceProvenance
- MappingConfidence / UNKNOWN

## 5. Geometry-to-cost bridge

```
ARKI semantic entity
  -> AGK geometry
  -> quantity rule
  -> measured quantity
  -> S10 item/APU candidate mapping
  -> confidence + provenance
  -> accepted project-local mapping
  -> cost contribution
```

A cost item is never assigned solely because its text looks similar. Weak/ambiguous mapping remains UNKNOWN or requires Human Authority.

## 6. Mutation economics

For every accepted design mutation ARKI should eventually compute:

```
BASELINE quantity/cost
  -> geometry/semantic mutation
  -> quantity delta
  -> affected S10 partidas/resources
  -> project-local unit prices/APU
  -> direct cost delta
  -> downstream budget effects
  -> revised project total
  -> variance against budget envelope
  -> uncertainty / unmapped items
```

This supports cost-constrained architectural improvement and controlled redesign.

## 7. Versioning

The imported S10 baseline is immutable evidence:

- COST_BASELINE_0 = as received.
- Later S10 revisions/imports become COST_BASELINE_1, 2, ...
- ARKI-calculated scenarios are projections, not silent edits of the received S10 source.
- Reconciliation must identify added/deleted/changed partidas, quantities, prices and APU components.

## 8. Bidirectional future capability

Initial priority is READ / NORMALIZE / RECONCILE.

Future WRITE/EXPORT back to S10 is a separate gate. ARKI must not claim round-trip until a supported export path is executed and verified without semantic/economic loss.

## 9. F7 placement

- F7.0: source/provenance contract.
- F7.6: primary owner — Project Cost Baseline + quantities/APU/cost.
- F7.7: S10 interoperability adapter alongside BIM/IFC/CAD adapters.
- F7.8: cross-check model quantities vs S10 quantities/budget.
- F7.9: hand accepted economic state to F8.
- F8: generate dossier budget/metrado outputs from accepted state.
- F9: compare baseline/valuations/changes during construction.

## 10. First verification campaign

Obtain one legitimate S10 project export/backup plus, if possible, its Excel/report outputs. Characterize:
1. file/container/database type and version;
2. budget/subbudget hierarchy;
3. partidas and units;
4. metrados;
5. APU decomposition;
6. resources and prices;
7. budget totals;
8. formulas/foot-of-budget;
9. planning/valuation data if present;
10. deterministic reconciliation against an S10-generated report.

Acceptance requires totals and structure to reconcile within explicit rounding/tolerance rules. No evidence = no green.


## 11. Implementation checkpoint — 2026-10-07

Implemented on `feat/f7-f8-integral-closure` in `server/arkiS10Interop.ts`:

- source identity/checksum/effective date/currency/location;
- item/partida normalization;
- budget hierarchy nodes;
- APU and APU components;
- resources and resource prices;
- declared direct/general-expense/utility/tax/total structure;
- deterministic project-to-project reconciliation;
- direct-cost reconstruction versus S10-declared direct cost with explicit tolerance;
- immutable projection into `ProjectCostBaseline`;
- explicit `writeBackClaim:false`.

Fail-closed validation covers duplicate identities, missing provenance, invalid quantities/prices, orphan APU resources, orphan item/APU references, invalid budget parents/items and invalid totals.

**Not claimed:** native S10 database/backup parsing, native S10 WRITE, S10 round-trip, or successful execution against a real S10 specimen. Those remain external verification gates.
