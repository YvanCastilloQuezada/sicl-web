# Archi — E5: SceneModel 3D, capas, zonas y comparación

## Veredicto técnico

**E5 — IMPLEMENTED / VERIFIED WITH LIMITATIONS.** La entrega añade un visor BIM 3D real basado en Three.js, React Three Fiber y Drei. El modelo 3D se deriva de `ConstructionModel` mediante un contrato determinista, sin reemplazar el motor constructivo existente.

La aplicación compila con TypeScript estricto, la regresión de dominio permanece verde y el DOM del preview confirmó la presencia de un `<canvas>` WebGL, el panel `SCENE MODEL`, el visor `Visor BIM 3D` y once capas seleccionables después de abrir el módulo 3D con una propuesta generada.

## Implementado

| Capacidad | Estado | Evidencia |
|---|---|---|
| Conversión `ConstructionModel → SceneModel` | Implementado y probado | `shared/arkiSceneModel.ts`, `test-scene-model.ts` |
| Muros, puertas, ventanas y elementos estructurales 3D | Implementado | 57 nodos en el fixture de prueba, incluidos `wall`, `door`, `window`, `column`, `beam`, `slab` |
| Espacios / zonas BIM | Implementado | Nodos `space` con relación a muros y selección semántica |
| Órbita, pan y zoom | Implementado | `OrbitControls` y controles de cámara |
| Capas por categoría | Implementado | Filtros de muros, puertas, ventanas, estructura, escaleras, cubiertas, zonas, etc. |
| Filtro por nivel | Implementado | Selector de nivel en el visor |
| Selección 3D sincronizada con Info Box | Implementado | `selectionFromElement` + `SelectionProvider` |
| Estado vacío sin modelo | Implementado | Mensaje explícito en `SceneModel3D` |
| Comparación contra referencia capturada | Implementado | `arkiSceneComparison.ts`, botón `Capturar referencia`, resumen de añadidos/modificados/eliminados/sin cambios |
| Módulo `3D` | Montado | `SceneModelModule` integrado en `ArkiWorkspaceShell` |
| `Modelo BIM` | Montado | Conserva su contenido y añade el visor 3D real |

## Archivos principales

- `shared/arkiSceneModel.ts`: contrato `ARKI-SCENE-MODEL-1.0` y conversión de entidades.
- `shared/arkiSceneComparison.ts`: comparación determinista de dos escenas.
- `client/src/canvas/SceneModel3D.tsx`: visor WebGL, capas, niveles, selección y comparación.
- `client/src/modules/SceneModelModule.tsx`: módulo de presentación 3D.
- `client/src/components/ArkiWorkspaceShell.tsx`: montaje de `3D` y extensión de `Modelo BIM`.
- `client/src/index.css`: estilo Blue-Black del visor.
- `scripts/test-scene-model.ts`: prueba de nodos, niveles, geometría y zonas.
- `scripts/test-scene-model-mount.ts`: prueba de montaje y controles.
- `scripts/test-scene-comparison.ts`: prueba de cambios geométricos entre propuestas.
- `E5_SCENE_MODEL_3D_OUTPUTS.txt`: salidas reales de check, pruebas, regresión y build.

## Evidencia ejecutada

| Comando / verificación | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm tsx scripts/test-scene-model.ts` | PASS; 57 nodos, niveles 0/1/2 y 12 tipos de elemento |
| `pnpm tsx scripts/test-scene-model-mount.ts` | PASS |
| `pnpm tsx scripts/test-scene-comparison.ts` | PASS |
| `test-constructive.ts` | PASS |
| `test-professional.ts` | PASS |
| `test-technical-dossier.ts` | PASS |
| `test-serialization.ts` | PASS |
| `test-wall-coherence.ts` | PASS |
| `test-wall-door-canvas.ts` | PASS |
| `test-bim-selection.ts` | PASS |
| `pnpm build` | PASS |

El fixture de regresión confirmó, entre otros datos, 16 muros, 16 espacios, 72 columnas, 16 vigas, 16 puertas, 320 ventanas y 108 interferencias.

## Limitaciones declaradas

**No se debe declarar todavía un BIM productivo equivalente a Revit.** El visor es una primera capa 3D funcional sobre el modelo constructivo de Archi.

La comparación implementada es una comparación contra una referencia capturada en sesión; todavía no es una vista lado a lado con dos documentos persistidos, ni incluye diff visual por fases o snapshots aprobados.

La persistencia de sesiones y snapshots sigue siendo local/parcial. Esta entrega no implementa IndexedDB, sincronización remota, colaboración multiusuario ni control de versiones persistente.

La geometría se representa como cajas paramétricas derivadas de los elementos disponibles. Todavía no es una representación de sólidos B-rep, no calcula booleanas de aberturas en el mesh y no constituye exportación nativa RVT/IFC productiva.

La captura automática de screenshot del navegador no pudo subir una imagen WebGL en esta sesión; la verificación se completó por DOM y consola del preview: existe un canvas WebGL y se detectaron el panel SceneModel, el visor 3D y once botones de capas. Esto queda como evidencia visual pendiente de captura limpia en un entorno que soporte la subida del canvas.

## Próximo bloque recomendado

El siguiente bloque debe separar la comparación en dos viewports, conectar snapshots persistentes aprobados por usuario, incorporar selección de subgeometrías y preparar el adaptador gobernado de IFC. No se debe abrir exportación RVT/DGN ni declarar round-trip productivo hasta disponer de hosts y fixtures reales.
