# ARKI — Operational Architecture Freeze 1.0

Status: FROZEN FOR E2E VALIDATION
Date: 2026-10-01

## Decision

No new runtime layer may be added until one real end-to-end architectural case passes the chain below with evidence.

## Four operational layers

1. **Architectural Authority — D-2**
   Owns architectural meaning, intent, constraints and canonical architectural state.

2. **Operational Geometry — AGK**
   Sole authority for committed operational geometry. No provider, graph, Director, Atlas entry or Inventor candidate may create AgkCommittedState.

3. **Architectural Intelligence — Directors**
   Decomposes architectural problems, requests capabilities, evaluates returned evidence and coordinates architectural reasoning. Design Knowledge is an internal knowledge asset, not a separate runtime authority.

4. **Capability Fabric**
   Selects and executes non-canonical providers. Solvers, BIM hosts, graph runtimes and oracles live behind this boundary.

## Internal artifacts, not runtime layers

- Capability Atlas / Architectural Capability Repository: searchable knowledge index inside Architectural Intelligence/Fabric.
- Graph Knowledge Catalog: specialized Atlas index for graph-derived capabilities.
- Parametric Graph IR: interchange/execution representation.
- Enriched ARKI Graph: semantic envelope around Graph IR; descriptive proposal only.
- Topology Ecosystem Atlas: research/reference dataset.
- Harvest catalogs: research/reference datasets.
- ARKI Inventor / Capability Synthesis Lab: sandbox tool producing only CAPABILITY_CANDIDATE; it has no D-2 or AGK authority.
- Synthesis Sandbox: execution boundary of the Inventor, not an independent architectural layer.

## Frozen authority invariants

- D2 is the only architectural meaning authority.
- AGK is the only committed operational geometry authority.
- CapabilityResult.canonicalMutation is false.
- Inventor output is only CAPABILITY_CANDIDATE.
- Inventor geometryAuthority is NONE.
- Inventor architecturalAuthority is NONE.
- Unknown-license harvest cannot enter executable integration.
- GPL/AGPL harvest is REFERENCE_ONLY under current policy.
- Clean-room reimplementation of reference-only code requires independent provenance/evidence.

## Mandatory next milestone

Prove one simple real case end-to-end before adding architectural layers:

architectural intent -> Director -> capability lookup/selection -> Capability Fabric -> observed provider execution -> AGK operational geometry -> verification/oracle -> D-2-linked result/provenance

Minimum case should use existing observed COMPAS capability first. It must prove authority boundaries and evidence flow rather than design sophistication.

## Freeze rule

New libraries, harvest records and research may be queued, but no new runtime layer, Director family, geometry authority or semantic authority is introduced until the E2E milestone is green.
