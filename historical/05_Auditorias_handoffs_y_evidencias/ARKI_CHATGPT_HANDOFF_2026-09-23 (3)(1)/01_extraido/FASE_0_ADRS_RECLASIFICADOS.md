# Fase 0 — Mapa de ADRs: nuevos y extensiones

**Baseline:** `c62183a5904f02aa0a935572454a5a35f9d167aa`

## Regla

Si existe un contrato, entidad o módulo equivalente, el ADR no crea una segunda identidad: se clasifica como `ADR-EXTENSIÓN` y referencia el contrato existente.

| ADR | Tema | Contrato existente | Clasificación preliminar | Acción |
|---|---|---|---|---|
| ADR-001 | Tecnología visor 3D | No se encontró visor 3D productivo gobernado | ADR-NUEVO | Elegir tecnología antes de E5 |
| ADR-002 | SceneModel | `shared/arkiConstructionOntology.ts`, `ConstructionModel` | ADR-EXTENSIÓN | Derivar SceneModel sin duplicar ConstructionModel |
| ADR-003 | Identidad de elemento | `arkiBimSelection.ts`, ids de elementos constructivos, IFC conceptual | ADR-EXTENSIÓN | Definir ArchiElementId y GlobalId gobernados |
| ADR-004 | Persistencia | No se encontró sesión/servidor/snapshot productivo equivalente | ADR-NUEVO | Definir IndexedDB y adaptador servidor |
| ADR-005 | Snapshots aprobados | No se encontró gate productivo de snapshot | ADR-NUEVO | Definir aprobación, congelamiento y auditoría |
| ADR-006 | DSL de familias | `arkiParametricFamilies.ts`, `arkiDynamicFamilies.ts`, `arkiMamparaFamily.ts` | ADR-EXTENSIÓN | Ampliar sin reemplazar familias existentes |
| ADR-007 | IFC4 parser/exporter | `arkiConstructionOntology.ts::exportConstructionIfc` | ADR-EXTENSIÓN | Separar IFC conceptual de IFC4 productivo |
| ADR-008 | DXF gobernado | No se encontró adaptador DXF productivo | ADR-NUEVO | Mantener bloqueado hasta adaptador autorizado |
| ADR-009 | Solver estructural | Predimensionamiento y elementos constructivos existentes | ADR-EXTENSIÓN | No declarar cálculo profesional |
| ADR-010 | Coordinación MEP | Parámetros y disciplinas conceptuales | ADR-NUEVO | Definir modelo MEP y norma base |
| ADR-011 | Avatar ARKI | No se encontró Avatar implementado | ADR-NUEVO | Mantener contrato independiente |
| ADR-012 | Luka | No se encontró Luka implementado | ADR-NUEVO | Mantener agente separado |
| ADR-013 | Compatibilidad Revit | No se encontró adaptador productivo RVT/RFA | ADR-NUEVO | Mantener FUTURE/BLOCKED |
| ADR-014 | Migración/protección shared | Contratos canónicos actuales en `shared/` | ADR-EXTENSIÓN | No borrar ni reemplazar entidades |
| ADR-015 | Planta/Corte SVG | `CanvasPlanView.tsx`, `client/src/canvas/types.ts` | ADR-EXTENSIÓN | Migrar propuesta sin crear Vue paralelo |
| ADR-016 | Gate de no emisión | `ConstructionModel.gates`, dossier y notas de revisión | ADR-EXTENSIÓN | Formalizar gate y estados |
| ADR-017 | Desbloqueo temporal | `ARKI_PROTOCOLO_DESBLOQUEO_TEMPORAL_Y_REBLOQUEO.md` | ADR-EXTENSIÓN | Mantener fail-closed |
| ADR-018 | Home → Shell BIM | `ArkiWorkspaceShell.tsx`, `ProjectContext.tsx` | ADR-EXTENSIÓN | Documentar transición actual |

## Contratos revisados

Existen y deben preservarse `arkiBimSelection.ts`, `arkiContextPanel.ts`, `arkiDynamicFamilies.ts`, `arkiParametricFamilies.ts`, `arkiMamparaFamily.ts`, `arkiPriceBook.ts`, `arkiRecalculation.ts`, `arkiTechnicalDossier.ts`, `ConstructionModel`, `Muro`, `StructuralElement` y la capa UI-3A.

No se debe crear una segunda definición de `ProjectSnapshot`, `ConstructionModel`, `Muro`, `FamilyInstance`, `PriceBook`, `TechnicalDossier`, `BimSelection` o `ContextPanelState` sin ADR-EXTENSIÓN y migración.

## Estado

Esta reclasificación es un artefacto de Fase 0. Requiere aprobación del Product Owner antes de abrir E1.
