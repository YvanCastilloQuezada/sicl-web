# E5 — Reporte de reapertura quirúrgica

**Estado máximo:** `EVIDENCE PACKAGE COMPLETE / PENDING INDEPENDENT REVIEW`  
**Fecha:** 23 de septiembre de 2026  
**Baseline funcional:** SceneModel 3D y comparación lado a lado existentes.

## Resultado de la reapertura

Se generaron ocho paneles documentales SVG y ocho conversiones WEBP en `E5_CAPTURAS/`. El primer panel fue regenerado con el edificio completo del `SceneModel`, no con la captura plana histórica. Los paneles cubren visor general, selección e Info Box, comparación, sincronización 2D/3D, filtro por altura, cámaras, medición entre centroides y árbol semántico.

Los tests nuevos E5-CLOSE-01, E5-CLOSE-02 y E5-CLOSE-03 pasan. Los dos primeros ejecutan guardado y restauración mediante IndexedDB emulado por `fake-indexeddb`; cada operación abre y cierra la base de datos, demostrando la ruta de persistencia local reproducible. El tercero verifica que el lado izquierdo y el derecho mantienen controles separados de cámara, nivel y filtro por altura.

Los renombres cosméticos fueron aplicados en `SceneModel3D.tsx` y sus tests: `clippingActive`/`clipHeight` pasaron a `heightFilterActive`/`heightFilter`, y `snap: centroide` pasó a `medición entre centroides`.

## Regresión

`E5_OUTPUTS.txt` consolida la regresión existente de E5, los tres tests nuevos, la regresión seleccionada de E6 y E7, la regresión E8-A/E8-B/E8-C, `pnpm check` y `pnpm build`.

## Deuda explícita

El filtro por altura sigue siendo una visibilidad por coordenada Y y no clipping geométrico de sólidos. La medición sigue siendo distancia entre centroides y no snapping profesional de vértices, caras o ejes. Ambas deudas quedan declaradas como `DECLARED_DEBT / FUTURE`.

## Límite del reporte

Este documento no emite el veredicto contractual. Entrega la evidencia para revisión de DeepSeek/Product Owner. El estado máximo es `EVIDENCE PACKAGE COMPLETE / PENDING INDEPENDENT REVIEW`.
