# BKH-3 — Forensic Findings

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Hallazgos observados

El repositorio contiene mecanismos de generación constructiva en `shared/arkiConstructionOntology.ts`, familias y reglas paramétricas en `shared/arkiDynamicFamilies.ts`, representación derivada en `shared/arkiSceneModel.ts`, cantidades y costos en `shared/arki5d/`, planificación en `shared/arki4d/`, coordinación en `shared/coordination/`, persistencia de snapshots en `shared/persistence/` y adaptadores IFC4 en `shared/ifc4/`.

Estos mecanismos prueban capacidades de dominio, pero no constituyen todavía un Regeneration Engine canónico. La auditoría no encontró un contrato único que reciba un ChangeSet, calcule un dirty set mínimo, ordene regeneradores y produzca una traza completa.

## Clasificación

| Mecanismo | Estado | Tratamiento contractual |
|---|---|---|
| Generación constructiva | EXISTS / DOMAIN GENERATOR | KEEP_AS_DOMAIN_REGENERATOR; no asumir regeneración idempotente sin prueba |
| Dynamic families | PARTIAL | ADAPT después de contrato; conservar reglas legacy |
| SceneModel derivation | PARTIAL | ADAPT; representación derivada, no owner semántico |
| 5D quantities/cost | PARTIAL | ADAPT; verificar dependencia e invalidación |
| 4D schedule | PARTIAL | ADAPT; no afirmar recálculo automático |
| Relationship Fabric | EXISTS / BKH-1 | REUSE; no duplicar |
| Constraint Engine | IMPLEMENTED / BKH-2 REVIEW | REUSE; consumir para pre/postconditions |
| IndexedDB snapshots | PARTIAL | ADAPT; metadata de regeneración futura |
| UI refresh/memoization | PRESENTATION | DEPRECATE_LATER as domain authority; no usar como regeneración |
| IFC derivation | PARTIAL | ADAPT; loss report y solver externo permanecen explícitos |

## Conclusión

La regla aplicable es **AUDIT FIRST → EXTEND SECOND → CREATE ONLY IF MISSING**. BKH-3 requiere primero los contratos de fuente/derivado, invalidación, plan y regenerador. No se autoriza seleccionar silenciosamente un owner geométrico pendiente de BKH-0.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine implementado, pendiente de revisión independiente.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
