# BKH-3 — Invariant Registry

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

Los siguientes invariantes son contractuales y no se declaran PASS de implementación en esta fase:

1. `SOURCE_STATE_NOT_SILENTLY_MUTATED`
2. `DERIVED_STATE_EXPLICIT`
3. `NO_STALE_DATA_AS_CURRENT`
4. `MINIMAL_DIRTY_SET`
5. `DEPENDENCY_TRACE_REQUIRED`
6. `DETERMINISTIC_WHEN_DECLARED`
7. `IDEMPOTENT_WHEN_DECLARED`
8. `CYCLE_NOT_SILENT`
9. `UNKNOWN_NOT_SUCCESS`
10. `PARTIAL_NOT_GLOBAL_SUCCESS`
11. `NO_RELATIONSHIP_FABRIC_DUPLICATION`
12. `NO_CONSTRAINT_ENGINE_DUPLICATION`
13. `NO_SCALE_EXTRAPOLATION`
14. `NO_DISCIPLINE_EXTRAPOLATION`
15. `GENERATION_NOT_REGENERATION`
16. `REGENERATION_NOT_COMMIT`
17. `HUMAN_AUTHORITY_PRESERVED`
18. `GENERATED_NOT_FACT`
19. `UNSUPPORTED_SOLVER_NOT_DEMONSTRATED`

La implementación futura deberá probarlos con fixtures positivos y negativos. La presencia documental de un invariante no constituye evidencia de cumplimiento.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine VERIFIED.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
