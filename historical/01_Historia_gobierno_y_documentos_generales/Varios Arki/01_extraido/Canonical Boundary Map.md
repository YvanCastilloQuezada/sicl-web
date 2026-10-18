# Canonical Boundary Map

```text
Human Authority
      ↓ approves / rejects / authorizes
Intent + declarative mutation
      ↓
Transaction Engine / Canonical Durable Persistence
      ↓ only authorized canonical project-state commit
Canonical Project State
      ↓
Derived scene · quantities · schedules · costs · documents · exports
      ↓
Evidence / provenance / explanations
```

Rules:

- Domain capabilities may propose, calculate, validate, simulate, compare, and explain.
- No C1–C80 capability may create a new canonical writer.
- Semantic Curator may propose/validate/map/detect conflicts; it may not commit canonical state.
- CAD ACIR and IFC representations are not semantic ownership of the canonical project state.
- Legacy/local UI writers require a future `CANONICAL_WRITER_MIGRATION_REQUIRED` gate; Wave 0 does not migrate them.
- TX-005 is not authorized by this program.
