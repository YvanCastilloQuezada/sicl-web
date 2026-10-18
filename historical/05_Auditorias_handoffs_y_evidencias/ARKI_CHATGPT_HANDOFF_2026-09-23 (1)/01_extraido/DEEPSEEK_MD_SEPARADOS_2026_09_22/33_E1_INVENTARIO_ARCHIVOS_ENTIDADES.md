# E1.5 — Inventario de archivos y entidades

## Entidades canónicas protegidas

| Entidad | Ubicación principal | Regla |
|---|---|---|
| Muro | `shared/arkiConstructionOntology.ts` | Extender; no duplicar |
| StructuralElement | `shared/arkiConstructionElements.ts` | Extender con ADR |
| ConstructionModel | `shared/arkiConstructionOntology.ts` | Fuente constructiva actual |
| GeneratedBuilding | `shared/arkiDynamicFamilies.ts` | Preservar compatibilidad |
| ArkiParametricFamily | `shared/arkiParametricFamilies.ts` | Complementar familias dinámicas |
| FamilyInstance | `shared/arkiParametricFamilies.ts` | No crear segunda identidad |
| PriceBook | `shared/arkiPriceBook.ts` | Referencial hasta catálogo contractual |
| TechnicalDossier | `shared/arkiTechnicalDossier.ts` | Extender expediente |
| BimSelection | `shared/arkiBimSelection.ts` | Fuente de selección |
| ContextPanelState | `shared/arkiContextPanel.ts` | Fuente de contexto |
| ProjectContext | `client/src/contexts/ProjectContext.tsx` | Adaptador de presentación |

## Regla de migración

Las capas nuevas, como `SceneModel`, adaptadores, persistencia, familias ampliadas, visión y MEP, deben derivarse o referenciar estas entidades. No pueden crear tipos paralelos con los mismos conceptos sin ADR-EXTENSIÓN y migración.

Los archivos de producto, contratos, evidencia y traspaso permanecen separados según `FASE_0_CLASIFICACION_ARCHIVOS.md`.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards" 
