# ARKI — AKI-001: Plan de estudios histórico

## Método de lectura

Este currículo no describe lo que ARKI debería saber. Reconstruye los temas que aparecen en documentos, código, fixtures, pruebas, decisiones del Product Owner y contratos del proyecto.

## Secuencia histórica observada

### 1. Generación geométrica y familias

El punto de partida fue un generador de familias y sólidos conceptuales. La evidencia disponible incluye familias dinámicas, parámetros de variantes, geometría de edificios y generación de elementos constructivos. El aprendizaje estructurado avanzó desde sólidos hacia muros, capas, aberturas, puertas, ventanas, columnas, vigas, losas, escaleras, cubiertas, pisos y espacios.

**Estado:** STRUCTURED; PRACTICED; TESTED para casos concretos.

### 2. Modelo constructivo semántico

La ontología constructiva incorporó `Muro`, `ConstructionModel`, capas, acabados, aberturas, relaciones, metrados y elementos estructurales. La prueba de coherencia de muros y la prueba muro-puerta demuestran ejercicios concretos.

**Estado:** PRACTICED; TESTED; PROFESSIONAL_VALIDATION_REQUIRED.

### 3. Interfaz BIM y flujo de trabajo

El proyecto estructuró cuatro accesos, 16 módulos, shell BIM, panel contextual, canvas, inspector y ocho idiomas. La documentación registra decisiones de layout, módulos, roles y estados.

**Estado:** STRUCTURED; PRACTICED; TESTED para el alcance de UI auditado.

### 4. Representación 2D y 3D

Se incorporaron planta 2D, selección semántica, SceneModel, visor Three.js/React Three Fiber, capas, zonas, cámaras, clipping, medición, viewpoints, aislamiento y comparación.

**Estado:** PRACTICED; TESTED parcialmente; E5 congelado como PREVIEW/FREEZE.

### 5. Persistencia e interoperabilidad

Se estudiaron snapshots, IndexedDB, gates draft/approved, auditoría, migraciones, GlobalId, exportación IFC4, parser textual y adaptador web-ifc.

**Estado:** STRUCTURED; PRACTICED; TESTED en fixtures; round-trip productivo completo NOT_DEMONSTRATED.

### 6. Cantidades, costos y planificación

E7 incorporó cantidades, PriceBook, presupuesto 5D, reconciliación, actividades 4D, precedencias y ruta crítica.

**Estado:** PRACTICED; TESTED en fixtures E7; PROFESSIONAL_VALIDATION_REQUIRED.

### 7. Coordinación, estructura y MEP

Se definieron clashes volumétricos, StructuralModel, MEPModel, gases medicinales, seguridad y sanitarias en alcance mínimo.

**Estado:** STRUCTURED; PRACTICED en contratos y fixtures; cálculo profesional NOT_DEMONSTRATED.

### 8. Arquitectura computacional

ARKI Computational Fabric separó Knowledge Fabric, Computation Fabric, reasoning, generation, evaluation y learning. Se añadieron propuestas de BIM Kernel, inteligencia computacional y gobierno epistemológico.

**Estado:** STRUCTURED; UNDERSTOOD_NOT_DEMONSTRATED como arquitectura de producto.

## Materias presentes sin evidencia suficiente de ejercicio profesional

Geotecnia, sismorresistencia validada, hidráulica avanzada, electricidad de diseño, HVAC de ingeniería, acústica, energía, bioclimática, paisaje, urbanismo, GIS, movilidad, ferrocarriles, puertos, aeropuertos, patrimonio, hidrología y gestión integral de riesgos.

## References

[1]: ARKI_CONTROLES_FUNCIONALES_16_MODULOS.md "Controles funcionales locales"
[2]: E7_VERDICT_CYCLE1.md "Veredicto local de E7 ciclo 1"
[3]: E5_SCENE_MODEL_3D_REPORT.md "Reporte local de E5"
