# Archi — Informe de verificación UI-3A

## Veredicto técnico

**IMPLEMENTED AND VERIFIED — UI-3A Canvas BIM & Selection.** La entrega se ejecutó sobre el baseline `c62183a5`, conservó el motor de dominio `shared/` existente y añadió únicamente los contratos shared autorizados para selección y panel contextual. La presentación ahora dispone de tres columnas fijas: **ContextPanel izquierdo de 240 px, canvas central flexible e InfoBoxPanel derecho de 260 px**.

## Implementación realizada

Se eliminó `client/src/components/ArkiNavigator.tsx` y se limpiaron sus selectores CSS asociados. El antiguo panel flotante ya no existe. `ArkiWorkspaceShell` monta `SelectionProvider`, `ContextPanel`, `CanvasPlanView` en Planta e `InfoBoxPanel` en el inspector derecho. La ruta `EXP-TEC` conserva el montaje correcto de `DossierModule`.

El `ProjectContext` expone `constructionModel` derivado del `GeneratedBuilding`. Por tanto, una generación en el módulo Generador alimenta el canvas de Planta sin duplicar el motor constructivo. El Generador muestra además un indicador de sincronización con el ConstructionModel.

El canvas de Planta incluye grilla, ejes, zoom, pan, encuadre, filtros por nivel, disciplina, fase y categoría, selección individual, selección acumulativa con Shift y limpieza con Escape. Los elementos seleccionados se traducen al contrato semántico `BimSelectionItem`; el inspector muestra contexto, propiedades, materiales, metrados, costo y relaciones de trazabilidad.

## Archivos nuevos

| Área | Archivos |
|---|---|
| Contratos shared | `shared/arkiBimSelection.ts`, `shared/arkiContextPanel.ts` |
| Canvas | `client/src/canvas/types.ts`, `CanvasPlanView.tsx`, `ContextPanel.tsx`, `InfoBoxPanel.tsx`, `SelectionProvider.tsx` |
| Pruebas UI-3A | `scripts/test-bim-selection.ts`, `test-canvas-mount.ts`, `test-selection-info.ts`, `test-context-panel.ts` |

## Archivos modificados o eliminados

Se modificaron `ArkiWorkspaceShell.tsx`, `ProjectContext.tsx`, `GeneratorModule.tsx` e `index.css`. Las verificaciones heredadas `test-no-inherited-cleanup.ts` y `test-navigator-layout.ts` fueron actualizadas porque todavía intentaban abrir el archivo que el ADR-UI3A-001 exige eliminar; ahora prueban la ausencia del Navigator y la presencia del ContextPanel/canvas/inspector.

Se eliminó `client/src/components/ArkiNavigator.tsx`.

## Evidencia ejecutada

| Verificación | Resultado |
|---|---:|
| `pnpm check` | PASS |
| `pnpm build` | PASS |
| `test-bim-selection.ts` | PASS |
| `test-canvas-mount.ts` | PASS |
| `test-selection-info.ts` | PASS |
| `test-context-panel.ts` | PASS |
| `test-no-inherited-cleanup.ts` | PASS |
| `test-navigator-layout.ts` | PASS |
| `test-dossier-mount.ts` | PASS |
| Regresión de dominio 1A–1C y suite i18n/acceso/módulos | PASS en la suite existente |
| Verificación visual del preview | PASS |

La compilación produce únicamente el warning informativo existente de tamaño de chunks de Vite; no hay errores TypeScript ni errores de build.

## Capturas

La carpeta `evidence/ui3a/` contiene cinco capturas: generación con propuesta, Planta con modelo, muro seleccionado con inspector, Planta sin selección y gateway desktop. Las capturas se incluyen en `UI3A_EVIDENCE.zip`.

## Limitaciones declaradas

Esta entrega implementa la **capa de presentación y selección UI-3A**, no el ciclo completo de edición BIM. No incluye todavía edición paramétrica directa desde el inspector, restricciones geométricas interactivas, undo/redo transaccional, persistencia de selección, snapping, selección por ventana, cortes, 3D GLB, interferencias automáticas ni exportación IFC desde el canvas. Esas capacidades pertenecen a fases posteriores y no se deben declarar como implementadas por UI-3A.

Los elementos no lineales se visualizan con la geometría disponible en sus DTO actuales; cuando una familia no expone coordenadas uniformes, el canvas usa una representación de marcador determinista para mantener la lectura y la selección. Esto es una decisión de presentación, no una modificación del modelo BIM.

El contrato de selección ya está preparado para una futura selección múltiple, pero la interacción automatizada del preview se verificó principalmente con selección individual y limpieza; la prueba de contrato cubre el estado múltiple de forma determinista.

## Artefactos de entrega

- `UI3A_MANIFEST.json`: manifest con baseline, archivos y hashes.
- `UI3A_DIFF.patch`: diff reproducible de archivos nuevos, modificados y eliminados.
- `UI3A_EVIDENCE.zip`: paquete con código UI-3A, pruebas, capturas, manifest y diff.
- `UI3A_EVIDENCE.zip.sha256`: hash SHA-256 del paquete.
