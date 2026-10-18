# ARKI — BKH-2 Constraint Engine Contract Design

## Estado

`BKH-2 CONTRACT v1.2 — IN REVIEW / IMPLEMENTATION BLOCKED`.

Este paquete responde a la Orden 89. Es exclusivamente contractual: no contiene implementación de producto, no modifica BKH-1 y no abre BKH-3 ni BKH-4.

La versión 1.2 incorpora cuatro fixes: separación de hardness/applicability/severity, estado único de evaluación, aplicabilidad concreta de instancia y predicate declarativo con operadores registrados.

## Entregables

1. `BKH2_CONSTRAINT_ENGINE_CONTRACT.md` — contrato principal.
2. `BKH2_CONSTRAINT_OWNERSHIP_MAP.md` — ownership observado y owner futuro.
3. `BKH2_CONSTRAINT_MIGRATION_MATRIX.md` — mecanismos legacy y destino contractual.
4. `BKH2_CONSTRAINT_SCHEMA.md` — modelo de datos y resultados.
5. `BKH2_CONSTRAINT_TYPE_REGISTRY_CONTRACT.md` — autoridad única de tipos.
6. `BKH2_INVARIANT_REGISTRY.md` — invariantes exigibles.
7. `BKH2_TEST_PLAN.md` — pruebas positivas, negativas y adversariales.
8. `BKH2_SCOPE_LIMITS.md` — límites formales.
9. `BKH2_IMPLEMENTATION_SEQUENCE.md` — gates futuros, no autorizados.
10. `BKH2_FORENSIC_FINDINGS.md` — auditoría contractual del repositorio.
11. `BKH2_BOUNDARY_MATRIX.md` — fronteras BKH-1/BKH-2/BKH-3/BKH-4.
12. `BKH2_MANIFEST.json` — hashes del paquete.

## Decisión pendiente

El Product Owner debe revisar este paquete y emitir únicamente `APPROVE`, `APPROVE WITH FIXES` o `DEFER`. Ninguna decisión autoriza implementación automáticamente si no lo declara de forma expresa.

## Scope guard

BKH-1 permanece `VERIFIED — BKH-1 SCOPE`. BKH-2 permanece `IMPLEMENTATION BLOCKED`. BKH-3, BKH-4, BKH-5, BKH-6 y BKH-7 permanecen bloqueados. E5, E6 y E7 permanecen congelados. E8 no ha iniciado.
