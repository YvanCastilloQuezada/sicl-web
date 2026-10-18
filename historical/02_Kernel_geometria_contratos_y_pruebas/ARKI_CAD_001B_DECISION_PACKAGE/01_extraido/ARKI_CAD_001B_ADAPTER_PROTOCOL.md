# ARKI-CAD-001B — Adapter Protocol and ACIR Readiness

**Estado:** `DRAFT CONTRACT / ACIR NOT IMPLEMENTED / CAD_GEOMETRY_READY=NO`

## Propósito

El protocolo define cómo una futura integración CAD puede producir hechos trazables sin promover automáticamente esos hechos a BIM. La salida inmediata del adaptador será ACIR. ACIR conservará la procedencia, la geometría recuperada y la incertidumbre.

## Registro mínimo por entidad

Cada entidad recuperada debe conservar `sourceFile`, `sourceHash`, `sourceFormat`, `sourceEntityIdOrHandle`, `sourceLayer`, `sourceSpace`, `sourceLayout`, `adapter`, `adapterVersion`, `transformationHistory`, `geometry`, `properties` y `epistemicState`.

Los estados mínimos son `EXTRACTED`, `PARTIAL`, `UNKNOWN`, `NOT_DEMONSTRATED`, `LOSSY_DERIVATION`, `INVALID_SOURCE` y `UNSUPPORTED_ENTITY`.

## Firewalls semánticos

```text
LINE/POLYLINE → no es automáticamente WALL
BLOCK         → no es automáticamente DOOR/WINDOW/FURNITURE
POLYLINE      → no es automáticamente ROOM
CIRCLE        → no es automáticamente PIPE
TEXT          → no es automáticamente SPECIFICATION
```

La promoción a una entidad BIM exige una regla explícita, evidencia suficiente, revisión de conflictos y autoridad humana cuando la inferencia sea material.

## Condiciones de ACIR readiness

ACIR no puede considerarse listo para producción hasta demostrar serialización determinista, hash de fuente obligatorio, ausencia de handles sintéticos, ausencia de supuestos silenciosos de unidades o coordenadas, registro de pérdidas y rechazo fail-closed de entradas inválidas.

`CAD_GEOMETRY_READY=YES` exige además corpus congelado, versión exacta del adaptador, repetición determinista, comparación geométrica, cobertura de entidades, prueba de archivos corruptos, límites operativos y evidencia visual o matemática suficiente. La presente orden no ejecuta esas pruebas.

## Resultado actual

La arquitectura ACIR está documentada como contrato, pero no existe evidencia suficiente para afirmar runtime productivo. Por tanto, `ACIR_IMPLEMENTED` es `NO/UNVERIFIED`, `CAD_GEOMETRY_READY` es `NO` y ABB-001 continúa bloqueado para reconstrucción BIM ciega.

## Fuentes

[1] [ODA Drawings SDK](https://www.opendesign.com/products/drawings) [2] [Autodesk RealDWG API](https://aps.autodesk.com/developer/overview/realdwg-api) [3] [GNU LibreDWG](https://www.gnu.org/software/libredwg/) [4] [ODA security advisories](https://www.opendesign.com/security-advisories)
