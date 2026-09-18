# ARKI — Design Genius Closeout

## Resultado ejecutivo

La macroorden de Design Genius queda implementada en el límite local autorizado. ARKI conserva un único motor compartido y ahora expone cuatro modos de exploración: **JUNIOR**, **ARCHITECT**, **MASTER** y **CRAZY**. Los modos modifican profundidad, amplitud, tolerancia a la novedad y amplitud de mutación. No modifican la verdad epistemológica, la evidencia disponible, las restricciones duras ni la autoridad humana.

La integración también expone un **Unified Architectural Design Read Model** derivado de las superficies existentes. Este read model conecta sitio, programa, concepto, parti, zoning, alternativas, lineage, plan, sección, massing, circulación, ingeniería, regulación, conocimiento, unknowns y vistas. No sustituye a A21, GDI, S1, S2, CanonicalBuildingModel, DesignMemory ni Delivery Orchestrator.

## Estado y límites

| Área | Estado | Límite |
|---|---|---|
| GDI-P9–P24 | PROVEN | Comparación geométrica profunda continúa limitada cuando no existe evidencia geométrica compatible |
| Cuatro modos | PROVEN_WITH_OBSERVATIONS | Son perfiles deterministas del mismo motor, no cuatro aplicaciones independientes |
| Fixture fresco `ARKI-DESIGN-GENIUS-E2E-001` | PROVEN_WITH_OBSERVATIONS | Prueba local de integración; no certificación profesional |
| Read model unificado | PROVEN_WITH_OBSERVATIONS | Vista derivada; no crea una segunda fuente de verdad |
| S1/S2 | PROVEN_WITH_OBSERVATIONS | Planta conceptual verificable; no documentación constructiva |
| Drawings / SVG | PROVEN_WITH_OBSERVATIONS | Vistas conceptuales derivadas del modelo |
| DXF | EXTERNAL_VALIDATION_REQUIRED | Round-trip CAD no ejecutado |
| IFC / Revit | EXTERNAL_VALIDATION_REQUIRED | IFC limitado a massing; Revit requiere entorno externo |
| GIS | REQUIRES_DATA | Requiere CRS, topografía, parcela y provenance georreferenciada |
| Engineering | PROVEN_WITH_OBSERVATIONS | Awareness y reservas; los cálculos requieren engines e inputs válidos |
| Regulation | PROVEN_WITH_OBSERVATIONS | No compliance claim |
| Cost | REQUIRES_DATA / UNKNOWN | No se inventan tarifas ni costos |
| Visual avanzado | EXTERNAL_VALIDATION_REQUIRED | Renderer fotorrealista y validación externa pendientes |

## Capacidades reutilizadas, extendidas y consolidadas

**Reutilizadas:** A21 program/relationships/zoning/circulation, A15 read, A16 critique, A17 controlled revision, DesignMemory, GDI-P9–P24, S1, S2, CanonicalBuildingModel, drawing views, SpatialSvgViewer, engineering S3–S20, knowledge K1–K11, persistence envelope y Delivery Orchestrator.

**Extendidas:** el registro `CapabilitySetV1` ahora registra los cuatro modos y el read model unificado. El panel ARKI permite seleccionar el modo de exploración. El engine GDI acepta un proyecto fresco con IDs project-scoped.

**Consolidadas:** la capacidad de exploración, la realización espacial, la coordinación técnica, la evidencia y la entrega permanecen conectadas por una sola cadena canónica.

**Duplicación evitada:** no se creó un nuevo floor-plan engine, BIM model, GIS model, DesignMemory, lineage system, distance engine ni decision engine.

## Prueba Design Genius

El fixture `ARKI-DESIGN-GENIUS-E2E-001` usa el motor GDI existente con un identificador de proyecto independiente de HOUSE-A21. Genera tres alternativas hipotéticas, conserva provenance, lineage y selección humana, y prohíbe ranking, winner, decision y mutation automáticos.

Las cuatro vistas de modo producen diferencias verificables:

| Modo | Profundidad | Novedad | Presupuesto de alternativas | Estado de autoridad |
|---|---:|---|---:|---|
| JUNIOR | 1 | LOW | 1 | Human selection required |
| ARCHITECT | 2 | BALANCED | 3 | Human selection required |
| MASTER | 4 | HIGH | 3 | Human selection required |
| CRAZY | 5 | RADICAL_BOUNDED | 3 | Human selection required |

`CRAZY` no significa absurdo ni ausencia de restricciones. Significa exploración radical acotada con crítica, provenance, unknowns y revisión humana obligatorias.

## Proof de entrega

La entrega local continúa funcionando mediante el `Delivery Orchestrator`. Design Basis, drawings, SVG y snapshot local pueden ser construidos desde el modelo canónico. CAD, BIM y GIS conservan estados honestos cuando falta validación externa o data georreferenciada.

Una transacción profesional completa requiere todavía validación de parser IFC, entorno Revit, round-trip DWG, datos GIS/catastro, revisión profesional de láminas y, cuando corresponda, solvers estructurales, ambientales y regulatorios. Estas dependencias no bloquean la implementación local y no deben simularse.

## Regresión y determinismo

La prueba fresca verifica que la misma entrada produzca el mismo conjunto de alternativas y que los modos no alteren los estados epistemológicos. La validación del Capability Set verifica la continuidad de GDI, S1, S2, authoring, engineering, persistence, human authority y no-automatic-decision controls.

## Validación ejecutada

La validación enfocada pasó con **14 tests en 3 archivos**. La suite Web completa pasó con **94 archivos y 484 tests**. El typecheck de TypeScript pasó. El build de producción Web pasó; el bundler emitió únicamente la advertencia existente de chunks grandes. La suite completa Core pasó con **360 casos** en la rama `feat/weather-environmental-context-p1`. `git diff --check` pasó.

## Inventario actual

El registro canónico contiene **15 capability groups**, contados por `CapabilityRecord.id`. El número no representa archivos ni tests. El cambio de esta macroorden añade un módulo de contrato de modos, un archivo de prueba enfocado, una extensión del registro, una integración visible en el panel y la actualización del mapa y organigrama.

## Dependencias externas

`EXTERNAL_VALIDATION_REQUIRED`: Revit, parser/readback IFC, round-trip DWG, renderer fotorrealista, CFD, simulación energética, structural solvers y certificación profesional.

`REQUIRES_DATA`: parcela georreferenciada, CRS, survey, terrain, catastro, corpus normativo aplicable y market rates.

`CALCULATION_REQUIRED`: cualquier claim de desempeño estructural, térmico, energético, acústico, evacuación certificada o costo validado.

## Política posterior

Después de este cierre no se crea una nueva familia de capacidades de manera automática. La siguiente etapa debe ser **verificar → diseñar proyectos reales → encontrar fallas → corregir → validar profesionalmente → conectar engines externos → endurecer el producto**.

ARKI no sustituye al arquitecto. ARKI debe ampliar la capacidad del arquitecto preservando la decisión humana final.
