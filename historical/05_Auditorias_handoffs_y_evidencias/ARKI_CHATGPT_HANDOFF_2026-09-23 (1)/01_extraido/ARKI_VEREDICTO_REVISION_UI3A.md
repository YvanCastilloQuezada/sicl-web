# ARKI — Veredicto de revisión UI-3A contra código real

**Fecha:** 23 de septiembre de 2026  
**Contrato revisado:** `ARKI_CONTRATO_UI3A_CANVAS_SELECCION.md`  
**Resultado:** **DEFER — pendiente de correcciones y preparación de implementación**

## Conclusión

El contrato UI-3A es coherente como alcance de producto, pero todavía no coincide con el repositorio real. No se debe iniciar la implementación como si el canvas y el contrato de selección ya existieran.

La revisión confirma que UI-2 v1.7 está cerrada y que `EXP-TEC` monta `DossierModule`. Sin embargo, UI-3A aún no está implementada: faltan los contratos, componentes de canvas y pruebas específicas definidos en el documento.

## Hallazgos

| Área | Estado real | Impacto |
|---|---|---|
| `shared/arkiBimSelection.ts` | No existe | Falta el contrato semántico de selección |
| `client/src/canvas/types.ts` | No existe | Falta el contrato de viewport, vista y hit |
| `CanvasPlanView.tsx` | No existe | Planta 2D no implementada |
| `SelectionProvider.tsx` | No existe | No existe estado compartido de selección |
| `InfoBoxPanel.tsx` | No existe | Info Box no consume selección semántica |
| Tests UI-3A | No existen | No hay evidencia específica de selección y montaje |
| `ProjectContext` | Expone `building: GeneratedBuilding \| null` | No expone `constructionModel` directamente |
| Planta | No monta CanvasPlanView | La pestaña Planta todavía no existe como vista BIM funcional |
| Info Box derecho | Estado vacío estático | Aún no muestra ID, familia, tipo, métricas o costo de una selección |
| Info Box izquierdo | Espejo visual estático | Aún no consume un proveedor de selección |
| `ConstructionModel` | Existe en el dominio | Puede servir como fuente, pero falta el adaptador de renderizado |
| UI-2/i18n | Presentes | No deben modificarse para implementar UI-3A |

## Decisión

**DEFER**, no **REJECT**. El contrato no está mal planteado; simplemente describe una fase futura que aún no tiene código. Se autoriza continuar con una implementación UI-3A acotada únicamente después de registrar las correcciones indicadas abajo.

## Correcciones obligatorias antes de declarar UI-3A implementada

1. Crear el contrato determinista `shared/arkiBimSelection.ts` sin `any`.
2. Crear los tipos de canvas en `client/src/canvas/types.ts`.
3. Crear `CanvasPlanView`, `SelectionProvider` e `InfoBoxPanel`.
4. Definir cómo se convierten los elementos reales de `ConstructionModel` en `BimSelectionItem`.
5. Exponer el modelo constructivo mediante `ProjectContext` o mediante un adaptador tipado equivalente.
6. Montar el canvas únicamente en la pestaña `Planta`.
7. Conectar ambos Info Box al mismo estado de selección.
8. Añadir selección individual, Shift + click, click fuera, Escape, resaltado, zoom, pan y encuadre.
9. Crear los tres tests específicos del contrato.
10. Repetir los 17 tests de regresión y producir outputs reales.

## Restricciones confirmadas

UI-3A no debe modificar `MODULE_DEFINITIONS`, `isAccessAllowed`, `supportedLanguages` ni `catalog`. Tampoco debe implementar corte, elevación, 3D, vistas sincronizadas, edición paramétrica, cuadros de planificación, command palette, undo/redo, coordinación, BCF, importación nueva o backend.

Luka permanece como **FUTURE REFERENCE / NOT IMPLEMENTED**. No se debe usar como dependencia de UI-3A.

## Próximo paso aprobado

La revisión A queda completada. El siguiente paso puede ser preparar e implementar únicamente UI-3A con los diez puntos anteriores. UI-3B, UI-3C y UI-3D permanecen bloqueadas hasta obtener un veredicto `APPROVE` o `APPROVE WITH FIXES` sobre UI-3A.
