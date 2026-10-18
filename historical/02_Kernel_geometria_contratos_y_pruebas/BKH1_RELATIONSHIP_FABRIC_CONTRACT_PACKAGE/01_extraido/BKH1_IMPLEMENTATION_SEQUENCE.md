# BKH-1 — Implementation Sequence

**Estado actual:** diseño contractual únicamente. La secuencia no autoriza implementación.

## Gate 0 — Revisión del diseño

El Product Owner revisa el contrato, el esquema, la matriz de migración, el plan de pruebas y los límites. Si existe desacuerdo sobre ownership, escala, causalidad o compatibilidad, el estado queda `DEFER` y no se escribe código.

## Gate 1 — Congelación del baseline

Tras la autorización, se debe registrar branch, HEAD, worktree, hashes de los seis documentos y estado de BKH-0. No se deben mezclar cambios de E5, E6, E7 o E8.

## Gate 2 — Registro y tipos

Implementar primero los tipos de `RelationshipRecord`, familias, enumeraciones, provenance, evidencia, estado epistémico, escala y referencias legacy. En este gate no se migran consumidores ni se eliminan contratos.

## Gate 3 — Validación aislada

Implementar validadores para entidades existentes, tipos permitidos, direcciones, ciclos, duplicados, cross-discipline, cross-scale, causalidad, provenance y estados epistémicos. Ejecutar pruebas positivas y negativas.

## Gate 4 — Adaptadores legacy

Crear adapters explícitos para `ConstructionModel.relations`, `ElementRelation`, `tracesTo`, `wallIds`, `elementIds`, `relatedIds`, relaciones MEP, estructurales, 4D, 5D, clashes, impactos e IFC. Cada adapter debe conservar referencias legacy y ser idempotente.

## Gate 5 — Proyección y compatibilidad

Actualizar primero lecturas para que los consumidores puedan consultar la Fabric sin romper sus APIs. Las proyecciones legacy deben derivarse de la Fabric. No mantener escrituras dobles indefinidas.

## Gate 6 — Migración de fixtures

Migrar fixtures representativos de arquitectura, puerta-muro, estructura, MEP, 4D, 5D, clash, impacto, SceneModel e IFC. Comparar conteos, IDs, dirección, provenance, estados y relaciones inversas antes y después.

## Gate 7 — Persistencia

Persistir relaciones con `projectVersion`, `scenario`, validFrom/validTo y provenance. Probar save/close/reopen y corrupción. No implementar aquí rollback o autoridad de commit; eso pertenece al contrato transaccional posterior.

## Gate 8 — Deprecación controlada

Sólo después de aprobar compatibilidad, eliminar o marcar como deprecated las escrituras legacy. Mantener lectura adaptada durante el periodo definido por el Product Owner. No borrar relaciones sin migración verificable.

## Gate 9 — Evidencia y veredicto

Generar outputs crudos, manifest, hashes, diff, pruebas completas y capturas si aplica. Emitir `APPROVE`, `APPROVE WITH FIXES`, `REJECT` o `DEFER`. No declarar `VERIFIED` sólo por compilar.

## STOP

Después del diseño contractual, detenerse y esperar autorización explícita. No iniciar BKH-2 ni implementar BKH-1 dentro de esta entrega.
