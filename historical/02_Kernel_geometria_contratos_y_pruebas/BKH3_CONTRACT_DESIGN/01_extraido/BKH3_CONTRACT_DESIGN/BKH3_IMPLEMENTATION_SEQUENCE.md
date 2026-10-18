# BKH-3 — Future Implementation Sequence

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

1. **Gate 1 — Baseline Freeze.** Congelar repositorio, baseline, worktree y regresiones.
2. **Gate 2 — Schema and Registry.** Implementar ChangeSet, derived state, plan y registro sin domain side effects.
3. **Gate 3 — Dirty/Invalidation.** Probar invalidación mínima y stale-data semantics.
4. **Gate 4 — Impact Planner.** Consumir BKH-1, detectar transitividad y ciclos.
5. **Gate 5 — Domain Adapters.** Integrar sólo capacidades existentes autorizadas.
6. **Gate 6 — BKH-1/BKH-2 Integration.** Pre/postconditions, UNKNOWNs y provenance.
7. **Gate 7 — Determinism and Partial Failure.** Idempotencia, fallos y granularidad.
8. **Gate 8 — Contract Suite.** Ejecutar positivos, negativos y adversariales.
9. **Gate 9 — Regression and Torture Scenario.** Validar sin abrir BKH-7.
10. **Gate 10 — Evidence Closure.** Manifest, hashes, outputs y revisión independiente.

Ningún gate queda autorizado por esta orden.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine implementado, pendiente de revisión independiente.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
