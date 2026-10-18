# ARKI — BKH-1 Relationship Fabric Contract Package

**Estado:** EN REVISIÓN / NO APROBADO  
**Implementación:** BLOQUEADA  
**Baseline:** BKH-0 VERIFIED sobre `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Contenido

Este paquete contiene exclusivamente el diseño contractual solicitado para BKH-1:

1. `BKH1_RELATIONSHIP_FABRIC_CONTRACT.md` — contrato principal.
2. `BKH1_RELATION_MIGRATION_MATRIX.md` — estrategia para absorber relaciones existentes.
3. `BKH1_RELATIONSHIP_SCHEMA.md` — esquema y campos de la relación.
4. `BKH1_TEST_PLAN.md` — pruebas positivas y negativas exigibles.
5. `BKH1_SCOPE_LIMITS.md` — límites y exclusiones.
6. `BKH1_IMPLEMENTATION_SEQUENCE.md` — secuencia futura, no autorizativa.

## Orden de revisión recomendado

Leer primero `BKH1_RELATIONSHIP_FABRIC_CONTRACT.md`, luego `BKH1_RELATION_MIGRATION_MATRIX.md`, `BKH1_RELATIONSHIP_SCHEMA.md`, `BKH1_TEST_PLAN.md`, `BKH1_SCOPE_LIMITS.md` y finalmente `BKH1_IMPLEMENTATION_SEQUENCE.md`.

## Fronteras protegidas

BKH-1 sólo diseña la infraestructura relacional. No implementa Constraint Engine, Regeneration Engine, Transaction Engine, HumanDecision authority, worksharing, nuevas escalas territoriales, solvers profesionales, Academy, Avatar, Luka ni BKH-2.

`ConstructionModel` permanece como candidato de owner constructivo. `SceneModel` permanece como representación derivada. Los conflictos de Geometry, Quantity, Cost, ProjectVersion, Snapshot y Schedule no se resuelven incidentalmente.

## Condición de aprobación

El paquete debe recibir uno de estos veredictos:

```text
APPROVE
APPROVE WITH FIXES
DEFER
```

No se autoriza implementación por la mera existencia de este ZIP. La implementación requiere revisión completa y autorización expresa posterior del Product Owner.
