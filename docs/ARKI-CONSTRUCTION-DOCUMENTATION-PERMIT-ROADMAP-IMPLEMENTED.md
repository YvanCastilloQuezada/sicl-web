# ARKI — Construction Documentation and Permit Preparation

## Estado de implementación

Se implementó un **orquestador canónico de preparación constructiva y documental** conectado al `IntegratedProductFoundation` y al `ArkiDeliveryPackage`. No se creó un segundo motor geométrico ni se declaró aprobación automática.

El paquete expone seis gates: **P0 modelo constructivo**, **P1 documentación arquitectónica**, **P2 coordinación de ingeniería**, **P3 aplicabilidad normativa**, **P4 exportación y láminas**, y **P5 revisión profesional**.

## Resultado actual

El estado por defecto es `NOT_READY_FOR_PERMIT`. El paquete puede alcanzar `PREPARED_FOR_HUMAN_REVIEW` solamente cuando existe información suficiente para cada gate, pero conserva siempre:

```text
permitReady = false
constructionReady = false
noAutomaticApproval = true
noAutomaticDecision = true
humanAuthority = PRESERVED
```

Esto evita convertir geometría conceptual, reservas de ingeniería, fuentes normativas incompletas o exportaciones interoperables en una afirmación falsa de cumplimiento.

## Fases

| Fase | Implementación | Estado actual |
|---|---|---|
| P0 | Readiness constructivo derivado del `CanonicalBuildingModel`, entradas faltantes y candidatos trazables | `REQUIRES_DATA` para el fixture base |
| P1 | Plantas, sitio, secciones y elevaciones derivadas del mismo modelo canónico | `PASS_WITH_OBSERVATIONS` cuando las vistas existen |
| P2 | Enlace con registros de ingeniería multidisciplinar y lista explícita de cálculos pendientes | `REQUIRES_DATA` |
| P3 | Enlace con la cadena de aplicabilidad normativa, jurisdicción, versión, uso y etapa | `REQUIRES_DATA` sin corpus/proyecto verificado |
| P4 | DXF, IFC massing, GLB y GeoJSON condicionados a validación externa y CRS | `EXTERNAL_VALIDATION_REQUIRED` |
| P5 | Revisión profesional, registro de revisiones y firma humana | `BLOCKED` hasta asignación y confirmación humana |

## Límites que permanecen activos

El sistema no fabrica espesores, materiales, familias Revit, cálculos estructurales, sistemas MEP, datos geotécnicos, cumplimiento normativo, DWG nativo, modelo Revit nativo ni aprobación municipal. `IFC` sigue siendo intercambio de massing o geometría disponible; no equivale a autoría BIM nativa.

La siguiente evolución requiere datos de proyecto y especialistas: jurisdicción, levantamiento, topografía, uso, normativa vigente, estructura, instalaciones, seguridad, accesibilidad, coordinación de disciplinas y revisión profesional.

## Archivos principales

- `client/src/components/arkiPermitDocumentationOrchestrator.ts`
- `client/src/components/arkiDeliveryOrchestrator.ts`
- `client/arki-permit-documentation-orchestrator.test.ts`
- `docs/ARKI-CONSTRUCTIVE-READINESS-AND-PROFESSIONAL-EXPORT-BOUNDARY.md`

## Criterio de cierre

ARKI queda preparado para **orquestar y auditar** la transición hacia un expediente constructivo. No queda autorizado ni técnicamente justificado afirmar que genera automáticamente planos listos para licencia sin activar los datos, validaciones y revisiones profesionales de los gates P0–P5.
