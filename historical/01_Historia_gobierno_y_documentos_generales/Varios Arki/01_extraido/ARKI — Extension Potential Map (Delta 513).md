# ARKI — Extension Potential Map (Delta 513)

Este mapa es prospectivo. No representa trabajo ejecutado ni autoriza implementación durante Delta 513. Cada extensión debe reutilizar el modelo canónico y SICL; no crear motores paralelos.

| Área potencial | Reutilizar | Extensión necesaria | Gate de demostración futuro | Riesgo/autoridad |
|---|---|---|---|---|
| Interprete conversacional de encargos | Command Bar, voice adapter, schema de reasoning | Parser de encargo, preguntas faltantes, resumen editable | Encargo ambiguo reproducible → datos faltantes correctos → input firmado por usuario | No inventar parámetros; autoridad humana |
| Corpus normativo por jurisdicción | M0-K, source/provenance, UNKNOWN | Fuentes RNE y ordenanzas versionadas, reglas con artículos | Cada regla cita fuente, vigencia, jurisdicción y contraejemplo | Arquitecto/especialista; no asesoría legal automática |
| Modelo espacial constructivo | SpatialRepresentation, topology, geometry bridge | Muros, vanos, niveles, materiales, uniones, tolerancias | Round-trip semántico y validación geométrica por elemento | Especialistas estructurales/MEP |
| DWG/DXF | Canonical geometry y labels | Exporter interoperable y mapeo de capas/unidades | Import/export golden files sin pérdida | No afirmar “nativo” sin software de destino |
| Revit/IFC/BIM | Element lineage y levels | Mapeo de familias, categorías IFC, propiedades y relaciones | Validación en herramientas externas y clash checks | BIM manager; responsabilidad profesional |
| MEP/estructura | Programa, hazards, geometry | Solvers y especialistas por disciplina | Criterios de cálculo, coordinación, revisión firmada | No autónomo sin especialistas |
| GIS territorial | SpatialRepresentation, Map, north/geospatial fields | Capas vectoriales, CRS/datum, topología de red, catastro | CRS explícito, fuente, precisión y análisis reproducible | Topógrafo/urbanista |
| AR geoespacial robusto | `ArkiRealityView`, estacas, WebXR | SLAM/anchors persistentes, datum, survey import, quality metric | Error de posición/rotación reportado y dentro de tolerancia | Seguridad en sitio; no usar GPS como survey |
| 3 realizaciones por PARTI | A/B strategies, mutations, gates | Generador parametrizado y trazabilidad común R-A/R-B/R-C | Mismo PARTI, diferencias significativas, rechazo/backtrack | Evitar hardcoding |
| Evaluación de flujos | Topology relationships, perturbations | Simulación de capacidad/tiempo/compatibilidad | Casos adversariales y regresión | Datos de operación |
| Presupuesto | Cost simulation artifact | Quantities from canonical elements, price sources, escalation | Reconciliación de cantidades y fuentes | Estimador/cliente |
| Libro Vivo adaptativo | `ArkiBookPage`, profiles, deltas | Registro versionado de conceptos/lecciones/casos | Cada delta produce diff curricular verificable | Editorial/human review |
| Multi-escala | Existing scope/levels | Contracts for unit, floor, building, campus, city, territory | Same lineage across scales | No mezclar forma, organización, topología y parti |

## Prioridad recomendada, sin ejecución

1. **Cerrar el contrato del modelo canónico constructivo** antes de prometer DWG/Revit.
2. **Probar tres realizaciones trazables** sin hardcoding y con rechazo/backtrack.
3. **Agregar normativa con provenance y jurisdicción**, no reglas sueltas.
4. **Separar exportadores CAD/BIM/GIS** como adaptadores verificables del mismo modelo.
5. **Hacer explícita la precisión geoespacial** antes de presentar AR como replanteo.
6. **Mantener el Libro Vivo como capa pedagógica**, separando su contenido interno del producto público.

## Regla de cierre

Una extensión pasa a `DEMONSTRATED` sólo cuando tiene: contrato, implementación, prueba reproducible, salida inspeccionable, provenance, estado epistémico, límites y revisión humana donde corresponda.
