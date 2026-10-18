# WAVE 1 — Legacy Writer Inventory

**Estado:** INVENTORIED / MIGRATION NOT AUTHORIZED

WAVE 1 no migra ni reescribe legacy writers. La frontera canónica autorizada continúa siendo `TX003C_CAS` para persistencia canónica durable. Cualquier writer fuera de esa frontera se trata como deuda o adaptador legacy y no puede ser promovido a owner por inferencia.

| Writer / ruta | Responsabilidad observada | Clasificación WAVE 1 | Acción permitida |
|---|---|---|---|
| `CanonicalDurablePersistence.commitWithCas` | Persistencia durable, CAS e idempotencia | AUTHORIZED_CANONICAL_BOUNDARY | REUSE |
| `CanonicalProjectRepository` | Lineage, revisiones y current pointer en memoria | FOUNDATION_DEPENDENCY | REUSE / EXTEND LATER |
| `client/src/persistence/arkiIndexedDb.ts` | Adaptador IndexedDB de cliente | LEGACY_ADAPTER | ISOLATE |
| `ProjectContext` setters | Estado de presentación/proyecto local | LEGACY_UI_WRITER | ISOLATE; no canonicalize |
| Snapshot/version helpers | Construcción de snapshots y versiones | LEGACY_DOMAIN_WRITER | TRACE; no migrate |
| Import/export adapters | Entrada/salida CAD/IFC | EXTERNAL_BOUNDARY | MAP / VALIDATE |

## Guard

Si una capacidad de WAVE 1 requiere una mutación canónica fuera de `TX003C_CAS`, el resultado es `BLOCK + DECISION_REQUIRED`. No se ejecuta migración silenciosa y no se crea un segundo writer.
