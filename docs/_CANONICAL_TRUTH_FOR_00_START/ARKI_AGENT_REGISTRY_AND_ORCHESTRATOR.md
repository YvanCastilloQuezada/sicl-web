# ARKI Agent Registry and Orchestrator 1.0

## Purpose

ARKI now exposes a **single governed Agent Registry** and a **single Agent Orchestrator** over `ARKI-UNIFIED-MOTOR-1.0`. The orchestrator does not create a second architectural brain. It selects bounded specialist contracts, sends one common project state through the Unified Motor, and returns structured artifacts that preserve project identity, scale, scenario, provenance references, dependencies, unknowns and human authority.

The source of the registry is the KR-6.3 workbook at [`../arki-kr63/ARKI_Canonical_Knowledge_and_Reasoning_v6.3_MULTI_AGENT.xlsx`](../arki-kr63/ARKI_Canonical_Knowledge_and_Reasoning_v6.3_MULTI_AGENT.xlsx). The implementation is deliberately narrower than the workbook's future architecture: it includes the twelve named agents recovered from the workbook and keeps the A00–A59 specialist catalog as an explicit target boundary because the exact names were not present in the order record.

## Known registry

| Agent | Family | Current status | Evidence | Boundary |
|---|---|---|---|---|
| AGENT-BRIEF | Direction/Coordination | IMPLEMENTED / TESTED | Project Brain | No autonomous approval |
| AGENT-PARTI | Architecture | IMPLEMENTED / TESTED | PARTI contract and Integrated Cycle | Parti is not form, topology or construction proof |
| AGENT-REGULATION | Professional Feasibility | PARTIAL / TESTED | Advanced Geometry and source protocol | Does not certify compliance |
| AGENT-COST | Production/Real World | PARTIAL / TESTED | Project Lifecycle | No market quote or professional estimate |
| AGENT-CONSEQUENCE | Critical Intelligence/Learning | IMPLEMENTED / TESTED | Superpowers Pack | Heuristic classification |
| AGENT-VOI | Critical Intelligence/Learning | IMPLEMENTED / TESTED | Superpowers Pack | Prioritization, not probability |
| AGENT-DIVERGENCE | Architecture | IMPLEMENTED / TESTED | Superpowers Pack | Analysis, not design selection |
| AGENT-DEBT | Production/Real World | IMPLEMENTED / TESTED | Superpowers Pack | Professional review required |
| AGENT-COUNTERFACTUAL | Critical Intelligence/Learning | IMPLEMENTED / TESTED | Superpowers Pack | AI_PROPOSED scenarios, no solver claim |
| AGENT-RED-TEAM | Critical Intelligence/Learning | PARTIAL / TESTED | Project Brain and DG protocols | Not independent external review |
| AGENT-CONTRADICTION | Critical Intelligence/Learning | PARTIAL / TESTED | Project Brain and epistemic rules | Bounded to supplied inputs |
| AGENT-TRANSFER | Critical Intelligence/Learning | PARTIAL / TESTED | Unified Motor and L2 runtime | No automatic canonization or false analogy |

The Engineering/Performance and Production/Real World families retain an `A00–A59 target catalog` boundary. Those names are not fabricated by this implementation.

## Runtime flow

```text
PROJECT STATE
  → one Unified Motor execution
  → deterministic specialist selection by brief / phase / scale / UNKNOWNs / dependencies
  → structured agent artifacts
  → unknown and dependency propagation
  → human review and decision
```

The `agents.orchestrate` tRPC procedure is protected and verifies project ownership before execution. The `agents.registry` procedure is public and read-only. The commercial API remains a separate façade: it may expose a product catalog or registration envelope, but it is not the architectural brain and cannot silently promote evidence or authorize a project.

## Artifact contract

Every produced artifact carries `agentId`, `projectId`, timestamp/version, scale, scenario, epistemic state, evidence references, dependencies, unknowns and `humanReviewRequired: true`. The implementation currently emits bounded coordination analysis; it does not claim independent model execution, autonomous specialist reasoning, professional sign-off, or multi-agent learning.

## Validation status

`ARKI-MULTI-AGENT-ORCHESTRATOR-1.0` is **EXECUTABLE_WITH_BOUNDS** when the common motor passes. This means the registry, selection logic, structured artifact contract and protected API are implemented and tested. It does not mean that ARKI has demonstrated a distributed autonomous multi-agent system. The explicit claim remains:

> `COORDINATED_AGENT_CONTRACTS_NOT_DEMONSTRATED`

Human authority remains final. UNKNOWN remains UNKNOWN until appropriate evidence, simulation, professional review or external adapter execution is available.
