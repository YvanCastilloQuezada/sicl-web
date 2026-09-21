# ARKI — Conocimiento transversal, predimensionamiento y ARK-IFC

## Decisión conceptual

La calidad del diseño no se verifica únicamente después de modelar. ARKI debe aplicar conocimiento transversal durante la concepción, el predimensionamiento y la coordinación. Arquitectura, estructura, sanitaria, eléctrica, mecánica, seguridad, operación, costos y BIM comparten el mismo `Project State` y el mismo motor.

El objetivo no es que cada especialidad exista como una isla. El objetivo es que una decisión arquitectónica active sus consecuencias: columnas y vigas, luces y espesores, ductos y shafts, cuartos técnicos, accesos de mantenimiento, instalaciones, costos, secuencia de construcción y operación.

## Predimensionamiento

Se implementó `ARKI-PREDIMENSIONING-1.0` para revisar preliminarmente:

- columnas, vigas y losas en pórticos de concreto;
- luces y rangos dimensionales de coordinación;
- continuidad vertical de áreas húmedas y shafts sanitarios;
- cuartos eléctricos y risers;
- requerimientos HVAC y reservas técnicas;
- coordinación especial para hospitales.

El resultado distingue `PASS_PRELIMINARY`, `WARNING` y `BLOCKED_UNKNOWN`. Las reglas son heurísticas de coordinación; no son un cálculo estructural, no sustituyen la norma local, no determinan armados y no producen una firma profesional.

La regla operativa queda así:

`PARTI → GRILLA Y LUCES → PREDIMENSIONAMIENTO → RESERVAS MEP → MODELO ARK → COORDINACIÓN → CÁLCULO ESPECIALIZADO`

## Formato ARK con propiedades IFC

El formato ARK ahora puede contener un sobre `ARKI-IFC-COMPAT-1.0` con:

- `globalId` estable;
- clase IFC y tipo predefinido;
- disciplina y nivel;
- property sets con valor, fuente y confianza;
- cantidades con unidad y origen;
- referencias de geometría ARK;
- sistemas de coordenadas y unidades;
- provenance y estado de revisión humana.

Esto permite que una entidad ARK preserve información equivalente a un modelo IFC semántico. El paquete paramétrico añade un **IFC4 semantic bridge** junto con ARK, Dynamo y Grasshopper. El puente conserva propiedades y cantidades, pero declara `REQUIRES_ADAPTER_VALIDATION` para la geometría nativa y la fidelidad del intercambio.

No se afirma todavía que ARKI produzca un RVT nativo ni un IFC constructivo completo con todas las representaciones geométricas, materiales, familias, sistemas y relaciones requeridas por cualquier receptor. Esa capacidad necesita un adaptador IFC validado, pruebas de round-trip y verificación en Revit/soluciones openBIM.

## Principio de coordinación

Si ARKI está correctamente configurado, la detección de interferencias debe convertirse en una capa de verificación y aprendizaje, no en el mecanismo principal de corrección. El modelo debe anticipar conflictos por medio de reglas de predimensionamiento, reservas técnicas, continuidad de shafts, trazados de instalaciones, acceso de mantenimiento, secuencia constructiva y requisitos de operación.

Aun así, una revisión de interferencias permanece necesaria porque los conflictos pueden provenir de cambios posteriores, modelos externos, errores de interpretación, coordenadas, tolerancias o decisiones de especialistas. Una incidencia no implica automáticamente que ARKI haya fallado; se conserva como evidencia para mejorar el ciclo.

## Estado

Implementado en el motor único, conectado al router protegido, al visor BIM y al intercambio ARK-Parametric. Validación focalizada: TypeScript PASS, 9 pruebas focalizadas PASS y build PASS. Pendiente: parser IFC real, round-trip con Revit/IFC, cálculo estructural especializado, validación MEP y pruebas con modelos de producción.
