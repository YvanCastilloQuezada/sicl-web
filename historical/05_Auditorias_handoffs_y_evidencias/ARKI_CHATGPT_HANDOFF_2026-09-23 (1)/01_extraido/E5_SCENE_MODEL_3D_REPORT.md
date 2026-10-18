# Archi — E5: SceneModel 3D — cierre de iteración

## Veredicto técnico

**E5-PREVIEW / IMPLEMENTATION FREEZE — DEFER FORMAL.** La iteración de implementación queda cerrada administrativamente y congelada para evitar seguir ampliando el alcance. Three.js/R3F, persistencia IndexedDB, comparación persistente, selección compartida, cámaras técnicas, medición, viewpoints, aislamiento y árbol disciplinar tienen código y validaciones parciales. E5 todavía no es `VERIFIED` porque faltan evidencias y cierres sustantivos definidos por el contrato.

## Entregas

| Bloque | Resultado | Evidencia |
|---|---|---|
| P1 | PNG WebGL con `preserveDrawingBuffer`, metadatos y SHA-256 | `evidence/E5_CAPTURAS/arki-scene-general.png` + JSON; 545 nodos; hash coincidente |
| P2 | IndexedDB local-first con estados `draft` / `approved` | Flujo navegador: `v001 guardado · DRAFT` y `v001 · APPROVED` |
| P3 | Comparación lado a lado de dos snapshots persistentes | `SceneComparisonSideBySide`; prueba `modified: 1`; DOM “Comparación persistente” |
| P4 | Selección compartida Planta 2D/3D | `test-plan-3d-sync.ts` PASS |
| P5 | Clipping por altura | Control habilitar/altura; prueba PASS |
| P6 | Perspectiva, ortográfica, planta, elevación y corte | `test-camera-modes.ts` PASS |
| P7 | Medición entre dos elementos con snap de centroide | `test-measure-snap.ts` PASS |
| P8 | Viewpoints serializables | Guarda modo, nivel, clipping, altura y selección; prueba PASS |
| P9 | Aislar, congelar y mostrar todo | Estados de visibilidad; prueba PASS |
| P10 | Árbol disciplina → nivel → categoría → elemento | `ContextTreeNode` ampliado; `check` y build PASS |

## Validación

`pnpm check` y `pnpm build` pasan después de las integraciones. También pasan las pruebas de persistencia, comparación, sincronización, clipping, cámaras, medición, viewpoints, aislamiento y contexto, además de la regresión de dominio previamente aprobada.

## Limitaciones declaradas

La persistencia actual es local-first y no sustituye una sesión multiusuario o backend remoto. La comparación opera sobre `SceneModel`, no es aún round-trip IFC productivo. La medición usa distancia entre centroides; todavía falta snapping profesional de vértices, caras y ejes. El clipping filtra nodos por altura y debe evolucionar a planos de recorte WebGL para cortar sólidos. Aislamiento y congelación son presentación local y deben evolucionar a visibilidad por disciplina/fase con permisos. Las cajas 3D siguen siendo una representación paramétrica, no B-rep ni RVT nativo.

## Cierre de iteración y deuda aceptada

La Product Owner puede considerar cerrada **esta iteración** de E5 para dejar de producir cambios y documentos intermedios. Este cierre no promueve el estado contractual a `VERIFIED` ni desbloquea E6.

Queda una lista única para una futura reapertura/corrección de E5: ocho capturas con hash, captura general correctamente encuadrada, `E5_MANIFEST.json`, `E5_SCOPE_LIMITS.md`, outputs crudos completos, prueba de restauración de snapshots, prueba de restauración de viewpoints, controles independientes en comparación, clipping geométrico real y snapping profesional. Hasta entonces, E6 permanece bloqueado.
