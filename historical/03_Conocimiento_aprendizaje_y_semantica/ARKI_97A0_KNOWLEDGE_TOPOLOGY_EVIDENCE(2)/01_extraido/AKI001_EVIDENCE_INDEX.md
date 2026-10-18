# ARKI — AKI-001: Índice de evidencia

## Evidencia de código

- `shared/arkiConstructionOntology.ts`: Muro, ConstructionModel, generación constructiva, capas, aberturas, metrados y relaciones.
- `shared/arkiConstructionElements.ts`: elementos estructurales, relaciones y geometría.
- `shared/arkiDynamicFamilies.ts`: familias dinámicas, variantes, parámetros y generación.
- `shared/arkiSceneModel.ts`: representación derivada de escena 3D.
- `shared/arki5d/index.ts`: cantidades y presupuesto 5D.
- `shared/arki4d/index.ts`: actividades y planificación 4D.
- `shared/coordination/index.ts`: detección de clashes.
- `shared/structural/index.ts`: contrato estructural y estado no demostrado.
- `shared/mep/index.ts`: contrato MEP y subset hospitalario.
- `shared/ifc4/`: exportador/parser IFC4 y adaptador web-ifc.
- `shared/persistence/`: sesiones, versiones, snapshots, gates y auditoría.

## Evidencia de pruebas

- `scripts/test-constructive.ts`
- `scripts/test-wall-coherence.ts`
- `scripts/test-wall-door-canvas.ts`
- `scripts/test-serialization.ts`
- `scripts/test-scene-model.ts`
- `scripts/test-scene-comparison.ts`
- `scripts/test-ifc4-exporter.ts`
- `scripts/test-ifc4-web-ifc.ts`
- `scripts/test-persistence-formal.ts`
- `scripts/test-e7.ts`
- Suite completa conservada en `BKH0_TEST_RUN_RAW.txt`.

## Evidencia documental

- `RESUMEN_IMPLEMENTACION_ARKI_2026-09-23.md`
- `ARKI_CONTROLES_FUNCIONALES_16_MODULOS.md`
- `ARKI_FLUJO_TRABAJO_Y_PANELES.md`
- `ARKI_ROADMAP_CORPORATIVO_V1.md`
- `ARKI_COMPUTATIONAL_FABRIC_V1.md`
- `ARKI_COMPUTATIONAL_INTELLIGENCE_ADDENDUM_V1.md`
- `E5_SCENE_MODEL_3D_REPORT.md`
- `E6_REPORT.md`
- `E7_REPORT.md`
- `BKH0_REPORT.md`
- Carpetas `E1_CONTRATO_PRODUCTO_ADRS`, `E2_WIREFLOWS_CONTROLES_PRUEBAS`, `E3_CATALOGO_CORPORATIVO_P2` y `E4_CONTRATOS_ESPECIALIZADOS`.

## Evidencia del mentor

Los aportes del Product Owner están reconstruidos en `AKI001_ARCHITECT_MENTOR_KNOWLEDGE.md` y en las decisiones históricas del corpus de conversación conservado por el proyecto.

## Límites de la evidencia

La presencia de una fuente local demuestra disponibilidad o exposición. Una prueba demuestra únicamente el criterio que ejecuta. Un contrato no demuestra implementación. Un cálculo reproducible no equivale a autoridad profesional.
