# ADR-LKS-001 — Canonical Candidate Authority

**Status:** ARCHITECTURAL_DECISION_REQUIRED  
**Decision:** intentionally not resolved by Order 97A

## Question

Who may produce `CANONICAL_CANDIDATE`?

## Option A — Human Authority required

Curator/ARKI can verify and stage knowledge, but Human Authority must create every canonical candidate. This minimizes epistemic, regulatory and safety risk and maximizes reversibility, at the cost of human workload and slower throughput.

## Option B — Curator may produce candidate

Curator/ARKI can create a reversible `CANONICAL_CANDIDATE`; Human Authority is required only for `CANONICAL`. This improves throughput but increases noise, governance and automation risk.

## Option C — Risk-class policy

Low-risk descriptive metadata may reach candidate automatically, while regulated, safety-relevant, jurisdictional or implementation-affecting knowledge requires Human Authority earlier. This is more expressive but adds policy complexity and classification risk.

## Analysis dimensions

Noise, safety, governance, automation, human workload, epistemic risk, regulatory risk and reversibility must be evaluated with examples and failure cases.

## Current policy

The runtime remains fail-closed and reports `ARCHITECTURAL_DECISION_REQUIRED`. No option was selected automatically.
