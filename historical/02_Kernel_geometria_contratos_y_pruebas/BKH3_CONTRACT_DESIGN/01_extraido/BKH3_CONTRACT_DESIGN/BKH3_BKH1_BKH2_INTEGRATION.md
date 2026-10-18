# BKH-3 — Integration with BKH-1 and BKH-2

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## BKH-1

BKH-3 consulta Relationship Fabric para obtener dependencias semánticas, inversas, escala, disciplina y provenance. No replica RelationshipTypeRegistry, identidad ni almacenamiento de relaciones. Si falta una relación requerida, el plan registra `MISSING_DEPENDENCY`.

## BKH-2

BKH-3 usa BKH-2 para preconditions, postconditions, constraints afectadas, violaciones y UNKNOWNs. BKH-3 no altera definiciones ni evidencia de constraints para forzar `SATISFIED`. Una violación puede bloquear o dejar el resultado parcial según política registrada.

## Orden

`ChangeSet → BKH-1 impact → dirty set → plan → authorized regenerators → BKH-2 evaluation → result`. La integración no implementa commit, rollback ni HumanDecision.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine implementado, pendiente de revisión independiente.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
