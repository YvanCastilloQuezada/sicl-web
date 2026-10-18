# ARKI — Contrato UI-3A: Canvas BIM y selección semántica

**Estado:** Aprobado por Product Owner; pendiente de verificación contra el repositorio real  
**Alcance:** solo canvas 2D, selección y montaje  
**No inicia código hasta cerrar la revisión A.**

## 1. Incluye

UI-3A debe incorporar un canvas 2D funcional con grilla, ejes y niveles. La planta se genera desde `ConstructionModel` y representa al menos muros, puertas, ventanas, columnas, vigas y losas cuando existan.

Debe existir selección individual con click, selección múltiple con Shift + click, selección vacía explícita, resaltado visual, zoom, pan y encuadre. Ambos Info Box deben consumir el mismo contrato de selección y mostrar propiedades del elemento seleccionado.

El contrato de selección debe conservar identificador determinista, tipo, categoría, familia, tipo, disciplina, nivel, fase, propiedades, métricas, costo y relaciones cuando estén disponibles.

## 2. Nuevos contratos propuestos

`shared/arkiBimSelection.ts` debe definir `BimElementKind`, `BimSelectionItem` y `BimSelection`, además de constructores puros para selección vacía, individual y múltiple.

`client/src/canvas/types.ts` debe definir `CanvasViewport`, `CanvasView` y `CanvasHit`.

## 3. Archivos propuestos

- `shared/arkiBimSelection.ts`
- `client/src/canvas/types.ts`
- `client/src/canvas/CanvasPlanView.tsx`
- `client/src/canvas/SelectionProvider.tsx`
- `client/src/canvas/InfoBoxPanel.tsx`
- `scripts/test-bim-selection.ts`
- `scripts/test-canvas-mount.ts`
- `scripts/test-selection-info.ts`

## 4. Archivos que podrían modificarse

- `client/src/components/ArkiWorkspaceShell.tsx`: montar `CanvasPlanView` en Planta.
- `client/src/components/ArkiNavigator.tsx`: conservar el Info Box espejo izquierdo y conectarlo al contrato de selección.
- `client/src/contexts/ProjectContext.tsx`: exponer `constructionModel` si el contrato actual no lo ofrece.

No se deben modificar `MODULE_DEFINITIONS`, `isAccessAllowed`, `supportedLanguages` ni `catalog` salvo que la revisión contra código real demuestre una incompatibilidad imprescindible.

## 5. Criterios de aceptación

`pnpm check`, `pnpm build` y los 17 tests actuales deben continuar pasando. También deben pasar `test-bim-selection.ts`, `test-canvas-mount.ts` y `test-selection-info.ts`.

La pestaña Planta debe renderizar elementos disponibles del `ConstructionModel`. Click sobre un muro debe seleccionarlo; Shift + click debe añadirlo; click fuera debe limpiar la selección; Escape debe limpiar la selección. Ambos Info Box deben mostrar ID, familia, tipo, disciplina, nivel, materiales, metrado y costo cuando existan.

La misma entrada debe producir la misma selección. Ningún elemento puede carecer de `elementId` determinista. No se permite introducir `any` nuevo en `client/src/canvas/` ni en `shared/arkiBimSelection.ts`.

## 6. Exclusiones

UI-3A no incluye corte, elevación, 3D, vistas sincronizadas, edición paramétrica, cuadros de planificación, command palette, undo/redo, reglas de coordinación, BCF, importación nueva ni backend.

Esas capacidades quedan reservadas para UI-3B, UI-3C, UI-3D o fases posteriores mediante contratos separados.

## 7. Procedimiento de revisión

Antes de implementar, Manus debe comparar este contrato con `ConstructionModel`, los elementos reales, `ProjectContext`, `ArkiWorkspaceShell`, ambos Info Box y los tests existentes. Debe reportar discrepancias, archivos duplicados, capacidades ausentes y cualquier cambio de alcance.

El resultado de esta revisión debe ser `APPROVE`, `APPROVE WITH FIXES`, `REJECT`, `DEFER` o `PRODUCT OWNER DECISION REQUIRED`. La implementación UI-3A solo comienza después de ese resultado y de la confirmación del Product Owner si aparecen decisiones materiales.
