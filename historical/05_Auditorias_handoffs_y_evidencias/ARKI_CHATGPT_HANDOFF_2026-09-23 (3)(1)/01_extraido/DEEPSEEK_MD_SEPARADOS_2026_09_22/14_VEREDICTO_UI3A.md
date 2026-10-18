# ARKI — Veredicto del contrato UI-3A v2

**Contrato:** `ARKI_CONTRATO_UI3A_CANVAS_CONTEXT_PANEL_V2.md`  
**Estado del contrato:** APPROVE  
**Estado de implementación en el repositorio:** NOT IMPLEMENTED  
**Fecha:** 23 de septiembre de 2026

## Decisión

El contrato UI-3A v2 queda aprobado como contrato ejecutable. Reemplaza al contrato v1.0 y corrige la contradicción detectada en el flujo de trabajo.

El panel izquierdo ya no será un Info Box espejo. Será `ContextPanel` y controlará nivel, disciplina, fase, filtros, árbol del modelo, herramientas y viewport. El panel derecho será `InfoBoxPanel` y consumirá `BimSelection` para mostrar propiedades e impactos del elemento seleccionado.

## Revisión contra el código actual

La revisión confirma que el repositorio todavía no contiene la implementación UI-3A v2:

- No existen `arkiBimSelection.ts`, `arkiContextPanel.ts`, `CanvasPlanView.tsx`, `ContextPanel.tsx`, `InfoBoxPanel.tsx` ni `SelectionProvider.tsx`.
- `ProjectContext` expone `building`, pero todavía no expone `constructionModel`.
- La pestaña Planta todavía no monta un canvas semántico.
- `ArkiNavigator` continúa siendo el panel izquierdo actual y deberá ser reemplazado o convertido en componente interno del `ContextPanel`.
- El Info Box derecho sigue siendo un estado vacío estático.
- Los cuatro tests específicos de UI-3A v2 aún no existen.

Estos hallazgos no invalidan el contrato: describen el trabajo autorizado para implementarlo.

## Alcance autorizado

Se autoriza únicamente la implementación de UI-3A v2: canvas 2D, planta, selección semántica, `ContextPanel`, `InfoBoxPanel`, sincronización árbol-canvas, zoom, pan, encuadre y pruebas específicas.

No se autoriza todavía UI-3B, UI-3C, UI-3D, backend, importaciones nuevas, edición paramétrica, 3D, cortes, elevaciones, command palette, undo/redo, BCF, clash detection visual ni autenticación real.

## Contratos protegidos

No deben modificarse `MODULE_DEFINITIONS`, `isAccessAllowed`, `supportedLanguages`, `catalog`, `t`, `useTranslation`, `ConstructionModel`, `Muro`, `StructuralElement` ni DTOs existentes, salvo que Manus reporte una incompatibilidad imprescindible y solicite decisión.

## Próximo veredicto

Después de implementar UI-3A, Manus debe entregar código, diff, manifest, hash, 21 outputs reales y las capturas definidas en el contrato. Solo entonces se emitirá el veredicto de implementación: `APPROVE`, `APPROVE WITH FIXES`, `REJECT` o `DEFER`.
