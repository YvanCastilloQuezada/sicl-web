# E8-B — Operación y mantenimiento básico

**Estado máximo:** `IMPLEMENTED / PENDING INDEPENDENT REVIEW`  
**Fecha:** 23 de septiembre de 2026  
**Alcance:** un ciclo único; sólo O-M local-first.

## Resultado

Se implementó el flujo mínimo autorizado:

```text
snapshot aprobado + ArchiElementId
→ activo BIM
→ garantía + manual
→ inspección
→ orden de trabajo abierta/cerrada
→ historial cronológico
→ persistencia IndexedDB y reapertura
```

El activo conserva `assetId`, `elementId`, `snapshotId`, `version`, tipo, ubicación y datos de mantenimiento. Las entidades derivadas se guardan en stores separados de IndexedDB: `assets`, `warranties`, `manuals`, `inspections`, `workOrders` y `assetHistory`.

## Entregables

| Componente | Ruta | Estado |
|---|---|---|
| Contrato e implementación O-M | `shared/arkiOperationMaintenance.ts` | IMPLEMENTED |
| Persistencia IndexedDB versión 3 | `shared/persistence/arkiPersistence.ts` y `client/src/persistence/arkiIndexedDb.ts` | IMPLEMENTED |
| Pruebas obligatorias | `scripts/test-e8b-assets.ts` | IMPLEMENTED |
| Capturas documentales | `E8_B_CAPTURAS/` | GENERATED |
| Outputs crudos | `E8-B_OUTPUTS.txt` | GENERATED |

## Pruebas ejecutadas

- **E8B-01 PASS:** snapshot no aprobado rechazado.
- **E8B-02 PASS:** elemento inexistente rechazado.
- **E8B-03 PASS:** ciclo activo → garantía → manual → inspección → orden abierta/cerrada → historial.
- **E8B-04 PASS:** cierre y reapertura del store IndexedDB restauran activo, garantía e historial cronológico.

La prueba de persistencia usa la API IndexedDB mediante `fake-indexeddb` como harness reproducible de Node; la implementación de producto usa el mismo contrato IndexedDB local-first y amplía la base E6 de versión 2 a versión 3.

## Capturas

Las dos capturas son paneles de evidencia documental generados por script, no screenshots de una interacción del preview. Representan un activo con garantía/manual/inspección y una orden abierta/cerrada trazable al mismo `elementId`. Sus versiones WEBP tienen hashes en `E8_MANIFEST.json`.

## Límites

No se implementan CMMS/ERP externos, firma digital, notificaciones, reportes PDF, multiusuario ni backend productivo. No se modifican BKH-1, E5, E6 ni E7. El módulo no declara competencia profesional de mantenimiento ni aprobación para operación real.

**Manus reporta la evidencia; no emite el veredicto final.**
