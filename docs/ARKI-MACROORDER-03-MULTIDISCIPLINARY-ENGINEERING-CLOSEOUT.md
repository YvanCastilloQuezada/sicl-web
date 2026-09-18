# ARKI — Macroorden 03
## Complete Multidisciplinary Building Engineering — S3–S11

## Result

Macroorden 03 establishes a coordinated multidisciplinary engineering intelligence layer connected to the existing ARKI architectural model and GDI. It extends E1–E48 rather than creating a parallel building geometry engine.

```text
ARCHITECTURAL MODEL
→ COMMON ENGINEERING SEMANTICS
→ RESERVATIONS / ROUTES / DEPENDENCIES / CONFLICTS
→ IMPACT READBACK
→ SPECIALIST REVIEW
→ RE-EVALUATION
```

## S3–S11 coverage

The existing 48-discipline registry is reused across the authorized families:

| Family | State in this macroorder |
|---|---|
| S3 Structural | Conceptual coordination and affected-system awareness; calculations remain UNKNOWN |
| S4 Water / sanitary / hydraulic | Conceptual reservations and routes; capacities and pipe sizing remain UNKNOWN |
| S5 Electrical / critical power | Conceptual system/dependency awareness; loads and cable sizing remain UNKNOWN |
| S6 HVAC / ventilation / smoke | Conceptual routes and dependencies; airflow and duct sizing remain UNKNOWN |
| S7 Fire & life safety | Conceptual fire-system reservation and impact awareness; fire-flow verification remains UNKNOWN |
| S8 Digital building systems | ICT/BMS dependencies and conceptual routes; final device/network design remains UNKNOWN |
| S9 Gases / special utilities | Applicability-aware registry; specialist systems remain UNKNOWN or NOT_APPLICABLE where justified |
| S10 Vertical transportation | Elevator reservation/dependency awareness; traffic and performance remain UNKNOWN |
| S11 Building physics / environmental performance | Performance state remains UNKNOWN without calculation or measurement |

## Common engineering model

The new model uses common records for:

```text
SYSTEM
COMPONENT
SOURCE
TERMINAL
ROUTE
ZONE
RESERVATION
TECHNICAL_SPACE
DEPENDENCY
CONSTRAINT
PRESSURE
CONFLICT
OPPORTUNITY
INTERFACE
CONTINUITY
APPLICABILITY
```

Each record preserves stable identity, source, relations, provenance and an epistemic state. Existing technical reservations and conceptual routes are reused as the source surfaces.

## Architecture ↔ engineering propagation

A sample human-authorized S2 architectural operation produces an impact readback without mutating geometry:

```text
ARCHITECTURAL CHANGE
→ AFFECTED SYSTEMS
→ IMPACT IDENTIFIED
→ SPECIALIST REVIEW REQUIRED
→ RE-EVALUATION REQUIRED
→ GEOMETRIC MUTATION NOT EXECUTED
```

The readback includes affected architectural concerns such as geometry, adjacency, containment, circulation, access, technical reservations, dependencies, constraints, critique and evaluation. It preserves unknowns including member sizes, pipe diameters, airflows, fire flows, energy performance and regulatory compliance.

Engineering issues do not create automatic design decisions, winners, recommendations or mutations. Human architectural authority remains superior.

## BIM / visual integration

The coordination model references the existing `CanonicalBuildingModel`, Building Authoring Model, SVG viewer and massing exports. It does not create parallel engineering geometry. Engineering elements remain semantic reservations, routes and coordination records until sufficient project data and specialist calculations exist.

The existing visual panel now exposes:

- discipline count;
- common semantic record count;
- systems affected by a sample architectural change;
- specialist-review and re-evaluation requirements;
- explicit non-mutation and UNKNOWN boundaries.

## Epistemic safeguards

```text
CONCEPTUAL ≠ CALCULATED
CALCULATED ≠ SIMULATED
SIMULATED ≠ MEASURED
MEASURED ≠ VERIFIED
VERIFIED ≠ PROFESSIONALLY_SIGNED
UNKNOWN remains valid
CALCULATION_REQUIRED remains explicit
```

No member sizes, soil capacity, pipe diameters, pump heads, tank volumes, electrical loads, cable sizes, airflows, duct sizes, fire flows, gas flows, elevator performance, energy performance or acoustic ratings were invented.

## Validation

```text
FOCUSED S3–S11 / E1–E48 / ARKI / S1 / S2 = 32 passed
FULL WEB SUITE = REQUIRED AT CLOSE
TYPESCRIPT = REQUIRED AT CLOSE
BUILD = REQUIRED AT CLOSE
GIT DIFF CHECK = REQUIRED AT CLOSE
```

## Frozen / not claimed

This macroorder does not claim professionally signed engineering, authority approval, construction coordination, final BIM engineering authoring, code compliance, structural adequacy or measured environmental performance.

## Files added or changed

- `client/src/components/arkiMultidisciplinaryEngineering.ts`
- `client/arki-macroorder-03-engineering.test.ts`
- `client/src/components/ArkiAdvancedDesignIntelligencePanel.tsx`
- `docs/ARKI-MACROORDER-03-MULTIDISCIPLINARY-ENGINEERING-CLOSEOUT.md`
