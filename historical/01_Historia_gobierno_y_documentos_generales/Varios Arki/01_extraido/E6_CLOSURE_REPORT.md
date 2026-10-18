# E6 — Reporte de reapertura quirúrgica

**Estado máximo:** `EVIDENCE PACKAGE COMPLETE / PENDING INDEPENDENT REVIEW`

## Evidencia generada

Se generaron seis paneles documentales SVG y seis WEBP con datos reales de los contratos y fixtures IFC4. El parser `web-ifc` abrió los tres fixtures: `fixture_01_simple_wall.ifc`, `fixture_02_room_with_door.ifc` y `fixture_03_multi_storey.ifc`. El exportador produjo un fixture IFC4 con 28 entidades y el round-trip preservó las 28 identidades sin elementos faltantes.

El GlobalId determinista producido para el elemento de prueba tiene 22 caracteres y se obtiene sin `Math.random()`. El gate de snapshot aprobado fue evaluado con los seis requisitos presentes y devolvió una lista de faltantes vacía. La captura de persistencia documenta los stores separados de proyectos, versiones, snapshots y auditoría. El lossReport de identidad registra 28 elementos preservados y cero pérdidas de identidad en el round-trip contractual.

Los viewpoints persistidos se consideran resueltos por E5-CLOSE-02 usando IndexedDB emulado; la restauración en navegador real permanece como deuda declarada, igual que la restauración de snapshots en navegador real.

## Regresión

`E6_OUTPUTS.txt` contiene la regresión E6, la regeneración de evidencia, regresiones seleccionadas E5, E7 y E8, `pnpm check` y `pnpm build`.

## Límites

La evidencia no demuestra geometría IFC completa, materiales completos, relaciones espaciales completas, propiedades IFC completas ni lossReport geométrico/propiedades. Esas capacidades quedan expresamente como `DECLARED_DEBT / FUTURE`.

Este documento no emite el veredicto contractual independiente. El estado máximo es `EVIDENCE PACKAGE COMPLETE / PENDING INDEPENDENT REVIEW`.
