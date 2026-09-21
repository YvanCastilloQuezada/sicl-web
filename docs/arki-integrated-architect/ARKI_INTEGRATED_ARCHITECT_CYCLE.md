# ARKI Integrated Architect Cycle 1.0

## Purpose

This cycle assembles the existing ARKI capabilities into one bounded architectural workflow. It is not a new autonomous architect engine. It is an orchestration contract that reuses existing ingestion, SICL knowledge, D6.2 reasoning, PARTI-CONTRACT-1.0, D6.2-M topology, D6.3-G conceptual geometry, evaluation boundaries, provenance and Human Authority.

## Operational cycle

```text
PROJECT CONDITIONS
→ KNOWLEDGE RETRIEVAL
→ REASONING & TRANSFER
→ PARTI HYPOTHESES
→ TOPOLOGY
→ CONCEPTUAL GEOMETRY
→ FUNCTIONAL EVALUATION
→ REGULATORY EVALUATION
→ MUTATION / REJECTION / BACKTRACK
→ HUMAN REVIEW
```

Every stage preserves identifiers, source IDs, UNKNOWNs and lineage. Backtracking is available to `PARTI`, `TOPOLOGY` or `GEOMETRY`.

## What the assembled cycle can do

The cycle can accept a project brief with the required ARKI project identifier, context, typology, activities, relationships, constraints, conditions, evidence identifiers and explicit envelope. It can retrieve bounded knowledge, record transfer decisions, produce three documented parti hypotheses, connect them to topological and conceptual geometric artifacts, reject an adversarial candidate that violates its functional rules, record mutation/backtracking, and adapt a bounded principle to another typology.

The cycle has been exercised against residential, restaurant and library-shaped inputs. The restaurant case includes a 500-person occupancy value and independent service-flow requirements, but the cycle does not claim code compliance, egress compliance, professional approval or construction readiness.

## Capability summary

| Capability | Status |
|---|---|
| Brief interpretation | `DEMONSTRATED` |
| Knowledge retrieval and provenance | `DEMONSTRATED / BOUNDED` |
| Transfer and adaptation | `DEMONSTRATED / HUMAN REVIEW REQUIRED` |
| Three parti hypotheses | `DEMONSTRATED` |
| Parti → topology trace | `DEMONSTRATED` |
| Topology → conceptual geometry | `DEMONSTRATED` |
| Adversarial rejection | `DEMONSTRATED` |
| Mutation and backtracking | `DEMONSTRATED` |
| Functional validity | `UNKNOWN UNTIL ARCHITECT REVIEW` |
| Regulatory validity | `NOT_EVALUATED` |
| Structural validity | `NOT_EVALUATED` |
| BIM/DWG/Revit/GIS production | `NOT_DEMONSTRATED BY THIS CYCLE` |
| Professional authority | `NOT_CLAIMED` |

## Human Authority

Every generated parti remains `AI_PROPOSED`. The cycle returns `PENDING_HUMAN_REVIEW`. A human architect must evaluate functional fit, circulation, dimensions, normative requirements, structure, installations, accessibility, fire safety, cost and project-specific feasibility before any candidate can be accepted.

## Project identifiers

New projects must use the ARKI identifier format:

`XXX-XXX-XXX-XXX`

The first six characters are letters and the final six characters are numeric. The current cycle validates this format but does not replace the existing project persistence or project selector.

## Evidence and tests

Implementation: `server/arkiIntegratedArchitectCycle.ts`  
Tests: `server/arkiIntegratedArchitectCycle.test.ts`  
PARTI contract: `server/arkiPartiContract.ts`  
Validation: `9/9` focused integrated tests passed; the prior PARTI/D6.2/D6.3 focused suite also passed; TypeScript and production build passed.

## Claim boundary

The correct claim is:

> `BOUNDED_CONCEPTUAL_ARCHITECTURAL_SYNTHESIS_ONLY`

This cycle is a strong integrated demonstrator and a usable architectural reasoning scaffold. It is not yet a reliable autonomous professional architect and must not be represented as one. The next maturity step is architect-reviewed project cases with real source documents, explicit normative evidence, real dimensions, functional review and documented accept/reject decisions.
