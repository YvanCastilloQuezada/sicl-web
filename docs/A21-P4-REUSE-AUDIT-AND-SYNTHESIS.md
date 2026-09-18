# A21-P4 — Reuse Audit and Controlled Spatial Configuration Synthesis

## Scope

A21-P4 produces `HOUSE-A21-CONFIG-A`, a deterministic **HYPOTHESIS** of 2D space placement across N1 and N2. It consumes the frozen A21 program, adjacency/zoning, parti and A21-P3 circulation intent. It does not read or reconstruct `HOUSE-001` geometry.

## Reuse audit

| Surface | Decision | Use in P4 |
|---|---|---|
| A21 program and relationships | Reuse | Program IDs, human relationship records, zones, epistemic states and unknowns are direct inputs. |
| A21-P3 `A21P3Graph` | Reuse | Route sequence, hierarchy, vertical intent and warnings constrain placement; no geometry is inferred from observed HOUSE-001 geometry. |
| `ArchitecturalParti` / GDI-P3 | Reuse | Parti identity and organizing idea are provenance-bearing inputs. |
| ASI / spatial realization operations | Preserve boundary | These surfaces validate explicit human-supplied geometry and human-confirmed replacement; P4 does not call them to fabricate construction elements. |
| S2 spatial generator | Not used as input | Its UPAO-001 synthetic geometry is unrelated to HOUSE-A21 and cannot be used to reverse-engineer intent. |
| `residentialConstructivePlan.ts` | Comparison only | It remains a separate explicit HOUSE-001 model and is not a synthesis source. |

## Contract

The output is a derived configuration hypothesis with stable ID, version, input fingerprint, level-aware placements, deterministic metrics, constraint evaluations, warnings, provenance and preserved unknowns. Every placement remains `HYPOTHESIS`; the model contains no decision, winner, recommendation, wall, door, window, stair or other construction element.

The placement logic is a bounded architectural rule set, not a general floor-plan engine: N1 receives access, social, service, transition and patio roles; N2 receives the private cluster and aligned upper transition; required relationships are evaluated; absent requirements remain `UNKNOWN`.

## Proof obligations

The module includes deterministic repeatability, anti-copy provenance, input ablation, conflict preservation and construction-generation negative controls. Human selection remains required and no automatic ranking is performed.
