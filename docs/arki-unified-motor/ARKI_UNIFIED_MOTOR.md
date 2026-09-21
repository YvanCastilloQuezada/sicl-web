# ARKI Unified Motor 1.0

## Decision

ARKI now has one orchestration motor over the existing system pieces. The motor is not a collection of parallel design engines. It routes every piece through one common project trace and preserves each piece's actual maturity state.

```text
PROJECT
→ SOURCES / OCR / PROVENANCE
→ KNOWLEDGE
→ REASONING
→ PARTI
→ TOPOLOGY
→ CONCEPTUAL GEOMETRY
→ EVALUATION
→ MUTATION / REJECTION / BACKTRACK
→ HUMAN REVIEW
```

## State handling

| State | Motor behavior |
|---|---|
| `ACTIVE` | Executes the existing validated contract in the common cycle. |
| `FROZEN_REFERENCE` | Includes the asset in the trace as evidence/reference; does not activate it silently. |
| `HISTORICAL_REFERENCE` | Preserves historical context without treating it as current capability. |
| `BLOCKED_GATE` | Holds the piece behind its explicit gate and records the reason. |
| `NOT_DEMONSTRATED` | Holds the claim until a dedicated proof exists. |

This is how the motor uses **all pieces** without destroying epistemic integrity: nothing is discarded, but no frozen or blocked item is promoted merely because the Product Owner requested a unified architecture.

## Included pieces

The registry includes D6.1 knowledge lineage, D6.2-M reasoning-to-topology, D6.3-G topology-to-conceptual-geometry, D6.4 multimodal ingestion, PARTI-CONTRACT-1.0, ARKI-INTEGRATED-ARCHITECT-1.0, MC-02 frozen future orders, MC-03 assembly context, DG-01B blocked applicability protocol, FKCG-02 preservation, DS-EVAL-001 external evaluation and the not-demonstrated BIM/DWG/Revit/GIS ambition.

## Proof

The motor was executed against a restaurant case for 500 people with public, service, supply and waste-flow conditions. It routed active capabilities for execution, frozen and historical assets as references, and blocked/not-demonstrated capabilities as holds. The same motor supports a requested subset of pieces without changing the orchestration contract.

Validation: `12/12` focused tests passed for the unified motor, integrated cycle and parti contract. TypeScript, production build and diff checks must remain green before release.

## Capability statement

The honest current statement is:

> ARKI is a unified, traceable, human-governed system for bounded conceptual architectural synthesis, evidence retrieval, typological reasoning, parti hypotheses, topology, conceptual geometry and controlled evaluation.

It is not yet a fully autonomous professional architect. Native construction documentation, verified code compliance, structural/MEP engineering, reliable BIM/DWG/Revit/GIS export and professional sign-off remain separate maturity gates.

## Human Authority

`HUMAN_AUTHORITY = FINAL` remains invariant. The motor may propose, trace, compare, reject, mutate, backtrack and preserve evidence. It may not approve a project, certify compliance or replace the architect.
