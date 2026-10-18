# ARKI Knowledge Book — Delta BKH-1

## Entrada

**Nombre:** Relationship Fabric canónica.

**Función:** expresar, validar, consultar, serializar y adaptar relaciones BIM sin crear un segundo motor relacional.

**Entradas legacy:** `ConstructionModel.relations`, `StructuralElement.tracesTo`, `ConstructionSpace.wallIds`, `ScheduleTask.elementIds`.

**Tipos iniciales:** `HOSTS`, `HOSTED_BY`, `BOUNDS`, `BOUNDED_BY`, `SUPPORTS`, `RESTS_ON`, `OPENS_TO`, `OPENED_BY`, `CONNECTS_TO`, `PRECEDES`, `FOLLOWS`, `APPLIES_TO`, `IMPACTS`, `DERIVED_FROM`.

**Regla de identidad:** la identidad semántica no cambia por una nueva revisión del proyecto cuando el significado de la relación permanece igual.

**Regla de evidencia:** una relación observada, calculada, importada o derivada conserva origen, transformaciones y estado epistémico. `VERIFIED` exige evidencia.

**Regla de ownership:** la Fabric posee los vínculos; no absorbe Geometry, Quantity, Cost, Schedule, Snapshot, SceneModel ni HumanDecision.

**Capacidades aún pendientes:** registry universal de entidades, detección global de ciclos, migración física completa de todos los consumidores legacy y autoridad humana transversal.

## Clasificación

`IMPLEMENTED / PENDING EVIDENCE REVIEW`.
