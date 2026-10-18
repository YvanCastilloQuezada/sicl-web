# ARKI-SOLVER-MAP-001 — Executive Report

**Verdict:** `SOLVER_MAP_PARTIAL`  
**Scope:** forensic mapping, architecture and technical evaluation only. No solver was installed, executed or integrated. Aurora was not run and Aurora solutions were not used for tool selection.  
**Access date:** 2026-09-24

## Finding

The repository contains computational contracts and bounded engines, but the forensic baseline does not establish a production scientific solver stack. The correct architecture is **one ARKI, many governed instruments**: problem definition, solver selection, input compiler, adapter, worker, output parser, validation, evidence, interpretation and dependency propagation.

No candidate solver output becomes a project fact automatically. Every future run must retain input and output hashes, units, method, solver/version, configuration, environment, warnings, errors, assumptions, uncertainty, validation and applicability.

## Recommended minimum pilot

Use a narrow vertical slice: **IFC input → validated model translation → one bounded solver run → independent fixture/oracle → provenance record**. The most defensible open pilot components are IfcOpenShell, EnergyPlus/OpenStudio, Radiance, EPANET, pandapower, OpenSeesPy, OpenFOAM/SU2, CONTAM/FDS, JuPedSim/NIST, OR-Tools and SciPy, each behind a separate adapter and professional boundary.

## Non-claims

This study does not install solvers, implement C1–C80, certify engineering competence, establish code compliance, provide professional sign-off, or authorize procurement. Exact C1–C80 domain contracts remain necessary before capability-specific mapping can be promoted beyond `UNKNOWN`.

## Research record

Ten family reports in `SOLVER_MAP_RESEARCH/` were produced from official documentation, repositories, license files and primary validation references. Their source URLs and access dates are preserved in the package. No marketing claim was treated as technical proof.
