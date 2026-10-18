# BKH-3 — Failure Semantics

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

| Situación | Resultado contractual |
|---|---|
| Dependencia ausente | UNKNOWN + MISSING_DEPENDENCY |
| Regenerador no registrado | BLOCKED + UNSUPPORTED_REGENERATOR |
| Constraint posterior violada | PARTIAL o BLOCKED + CONSTRAINT_VIOLATION |
| Source state inválido | FAILED + INVALID_SOURCE_STATE |
| Ciclo | BLOCKED + CYCLE_DETECTED |
| Fallo determinista | FAILED + DETERMINISTIC_FAILURE |
| Solver/oráculo externo | UNKNOWN + EXTERNAL_ORACLE_REQUIRED |
| Solver profesional no disponible | UNKNOWN + NOT_DEMONSTRATED |
| Derivado corrupto | FAILED + CORRUPTED_DERIVED_STATE |
| Regeneración incompleta | PARTIAL; nunca global success |

`UNKNOWN ≠ ERROR`, `BLOCKED ≠ FAILED`, `DIRTY ≠ FAILED`. Cada resultado debe conservar diagnostics, provenance y granularidad por nodo.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine implementado, pendiente de revisión independiente.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
