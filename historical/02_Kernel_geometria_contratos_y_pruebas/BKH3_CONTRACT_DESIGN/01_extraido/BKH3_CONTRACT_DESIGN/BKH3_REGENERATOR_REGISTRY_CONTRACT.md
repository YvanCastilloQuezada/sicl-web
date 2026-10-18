# BKH-3 — Regenerator Registry Contract

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Registro único

Cada regenerador registrado debe declarar `regeneratorId`, domain, acceptedInputs, producedOutputs, dependencies, deterministic, version, preconditions, postconditions, constraintChecks, evidence policy y failure semantics.

## Regeneradores conceptuales

Geometry, Quantity, Cost, Schedule, Scene y IFCRepresentation son nombres de dominios potenciales, no autorizaciones para crear motores nuevos. La auditoría debe decidir si cada capacidad existente se REUSE, EXTEND, ADAPT, CONSOLIDATE, KEEP_AS_DOMAIN_REGENERATOR o CREATE.

## Reglas

No se registra un regenerador probabilístico como determinista sin evidencia. Un regenerador que requiere solver externo debe producir UNKNOWN/NOT_DEMONSTRATED cuando el solver no está conectado. Los regeneradores no pueden escribir source state ni modificar Relationship Fabric o Constraint definitions.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine implementado, pendiente de revisión independiente.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
