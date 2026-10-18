# E6 — Límites de reapertura quirúrgica

**Estado de implementación:** `REOPENED FOR EVIDENCE CLOSURE / PENDING INDEPENDENT REVIEW`

## Dentro del alcance

Esta reapertura cierra únicamente la evidencia de capacidades IFC4 ya existentes: parser `web-ifc` sobre tres fixtures, exportación IFC4 del fixture contractual, preservación de identidad, GlobalId determinista, separación de stores IndexedDB, validación fail-closed del gate de snapshot aprobado y clasificación de pérdida de identidad.

Se generan seis paneles documentales SVG y seis conversiones WEBP. Se regeneran `E6_OUTPUTS.txt`, `E6_MANIFEST.json` y el paquete ZIP.

Los viewpoints persistidos quedan documentados como resueltos por `E5-CLOSE-02`; la deuda residual de restauración en navegador real permanece declarada.

## Deuda declarada

| Capacidad | Estado |
|---|---|
| Geometría IFC completa BRep/CSG/swept solids | `DECLARED_DEBT / FUTURE` |
| Materiales IFC completos | `DECLARED_DEBT / FUTURE` |
| Relaciones espaciales IFC completas | `DECLARED_DEBT / FUTURE` |
| Propiedades IFC completas | `DECLARED_DEBT / FUTURE` |
| lossReport geométrico y de propiedades | `DECLARED_DEBT / FUTURE` |
| Restauración en navegador real | `DECLARED_DEBT / FUTURE` |
| Viewpoints restaurados en navegador real | `DECLARED_DEBT / FUTURE` |

## Fuera del alcance

No se agregan features IFC4, no se modifica E5, E7, E8 ni BKH-1, no se implementan BRep, materiales, relaciones espaciales completas, propiedades completas, exportación nativa adicional ni persistencia remota.

**Manus reporta evidencia. DeepSeek/Product Owner emite el veredicto.**
