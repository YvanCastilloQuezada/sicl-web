# SICL 0.2.5 — Implementation Evidence

## Scope

This patch implements only semantic-integrity corrections approved by the Product Owner. It does not introduce professional profiles, weights, GIS, BIM, autonomous agents, natural-language interpretation, normative certification, causal reconstruction, or automatic professional feasibility assessment.

## Reproducible baseline

The audited 0.2.4 codebase was frozen in Git before modification:

| Artifact | Value |
|---|---|
| Baseline commit | `e0029fc` |
| Baseline tag | `v0.2.4-audit` |
| Repository | `/home/ubuntu/SICL_0_2_1` |

## Implemented contract changes

| Finding | Implementation | Evidence |
|---|---|---|
| C-001 / P0 | Objective direction is mandatory; comparison never defaults to `MINIMIZE`. Missing direction returns `INSUFFICIENT_DATA` and does not create a comparison. | `tests/test_semantic_integrity_025.py` |
| I-006 / P1 | Closed `EvaluationMethod` catalog with required inputs, output name, unit, valid directions, division policy, missing-data policy, and method version. | `src/sicl/domain/evaluation_methods.py` |
| I-002 / P1 | Evaluation now records `project_id`, explicit direction when known, output unit, contract version, and feasibility status. Unknown evidence references are rejected. | `src/sicl/domain/model.py`, `services.py` |
| O-002 / P1 | Performance evaluation is not treated as feasibility evaluation. New evaluations start at `FeasibilityStatus.UNKNOWN`. | `src/sicl/domain/model.py`, SQLite round-trip regression |
| Payload boundary / P2 | Alternative payloads reject nested collections and require non-empty scalar keys. | `Alternative.__post_init__` |
| Event log scope | Snapshot plus append-only-at-application-level event log remains explicitly unchanged; this is not Event Sourcing. | Existing architecture preserved |

## Verification commands

```bash
cd /home/ubuntu/SICL_0_2_1
pytest -q
PYTHONPATH=src python3 tools/verify_025.py
```

Expected verification: all tests pass; the UPAO-001 pressure case returns `TRADE_OFF` with non-dominated alternatives `A`, `B`, and `C`; the analytical recommendation remains separate from the human decision; an unconfigured criterion returns `INSUFFICIENT_DATA`.

The machine-readable run is stored in `evidence_0_2_5.json`.
