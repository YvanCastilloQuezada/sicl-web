# ARKI — BKH Kernel Defect Ledger

**Orden:** 93 · **Estado:** post-92A audit

| defectId | discoveredBy | subsystem | invariantAffected | severity | reproduction / actual | proposed fix | finalStatus |
|---|---|---|---|---|---|---|---|
| D93-001 | baseline audit | repository | AUDITABLE_BASELINE | P2 | `git status` contiene modificaciones UI-3A y archivos históricos no versionados; procedencia no es completamente inferible desde Git | No resetear; separar HISTORICAL/PREEXISTING de 92A y 93 | DEFERRED_WITH_REASON |
| D93-002 | static scan | ownership | RELATIONSHIP_FABRIC_NOT_DUPLICATED | P1 risk | Existen `arkiRecalculation`, `arki4d`, `arki5d`, `arkiRegenerationEngine` y adapters con responsabilidades derivadas que deben auditarse conjuntamente | Clasificar bypasses; no consolidar owners sin decisión arquitectónica | ARCHITECTURAL_DECISION_REQUIRED |
| D93-003 | contract coverage review | serialization | REVISION_NOT_IDENTITY | P2 | BKH-1 cubre revision history; no existe aún un round-trip único que atraviese Relationship + Constraint + Derived metadata | Crear prueba de reload sólo si los contratos de persistencia existentes lo permiten | DEFERRED_WITH_REASON |
| D93-004 | cross-engine audit | BKH-3 | DEPENDENCY_TRACE_REQUIRED | P2 | 92A cubre cadena de dominio y gates, pero no todos los grafos branching/diamond/multiple-cycle | Añadir KITM-001 y graph torture | FIX_NOW |
| D93-005 | static scan | product UI | SOURCE_STATE_NOT_SILENTLY_MUTATED | P1 risk | `GeneratorModule` muta `ProjectContext` directamente; no es BKH-3 y queda fuera del kernel hardening | Registrar bypass; no introducir Transaction Engine | ARCHITECTURAL_DECISION_REQUIRED |
| D93-006 | scope audit | professional computation | UNSUPPORTED_SOLVER_NOT_DEMONSTRATED | P1 risk | OpenSees/MEP profesional no son hosts productivos en este entorno | Preservar UNKNOWN/UNSUPPORTED_SOLVER/EXTERNAL_ORACLE_REQUIRED | DEFERRED_WITH_REASON |
| D93-007 | evidence audit | package | MANIFEST_IS_EVIDENCE | P2 | Paquete 92A correcto; Orden 93 requiere paquete autosuficiente con diff y matriz completa | Generar paquete final con archivos físicos y hashes individuales | FIX_NOW |

No se inventan defectos de ejecución cuando sólo existe una brecha de cobertura. Las brechas no reproducidas permanecen como `DEFERRED_WITH_REASON` o `ARCHITECTURAL_DECISION_REQUIRED`.
