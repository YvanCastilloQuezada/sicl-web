# Archi — Resumen de conversaciones y decisiones

## Propósito del traspaso

El proyecto comenzó como un generador de familias y sólidos. El Product Owner decidió transformarlo en **Archi**, una estación BIM para generar espacios, reconocer elementos constructivos, cuantificar, presupuestar, planificar, documentar y acompañar la operación del edificio.

La prioridad no es imitar una aplicación existente. Archi debe tener una lógica propia, aunque puede aprender de los flujos de trabajo profesionales de Archicad, Revit y herramientas de coordinación BIM.

## Evolución del producto

Primero se pidió un frontend funcional para el generador paramétrico. Después se incorporaron familias de edificios, espacios, muros, capas, puertas, ventanas, materiales, tarrajeos, acabados, costos, tiempo, encofrados, especificaciones técnicas y expediente.

Luego se incorporaron módulos de Modelo BIM, Planta, Corte, 3D, Metrados, PRESUP-5D, GASTOS, 4D, Clashes, EXP-TEC, O-M y ADM. El módulo SILC fue absorbido por Modelo BIM.

La UI se organizó como un workspace de tres columnas. La columna izquierda contiene el contexto del modelo y herramientas. El centro contiene el canvas. La derecha contiene el inspector y trazabilidad. Se exige una interfaz minimalista azul-negra, con texto blanco y acentos de estado.

Se definieron ocho idiomas: español, inglés, portugués, francés, alemán, italiano, chino y japonés. El selector debe persistir el idioma y usar fallback.

## Decisiones de producto

El generador debe producir una propuesta conceptual que nunca se presente automáticamente como proyecto apto para construcción. Todo proyecto definitivo necesita datos completos, revisión de especialistas, cálculo, coordinación, normativa vigente, metrados conciliados, costos sustentados, documentación, aprobación y snapshot congelado.

El motor shared existente debe conservarse. La interfaz no debe inventar entidades duplicadas ni reemplazar `Muro`, `ConstructionModel`, `GeneratedBuilding` o los contratos ya verificados sin ADR y migración.

La evidencia es obligatoria. “Documentado” no significa “implementado”. “Implementado” no significa “verificado”. “Verificado” no significa “E2E verificado”.

## Funcionalidades adicionales solicitadas

El Product Owner añadió las siguientes necesidades:

- Visor 3D profesional con selección, capas, zonas, disciplinas, niveles y navegación.
- Comparación lado a lado de dos propuestas.
- Comparación lado a lado de dos plantas.
- Persistencia real de sesiones, proyectos, versiones y snapshots aprobados.
- Familias paramétricas de puertas, ventanas, columnas, estructuras metálicas, mamparas, vidrios, mobiliario, equipamiento, computadoras, televisores y otros elementos según tipología.
- Importación de familias y sólidos externos mediante adaptadores gobernados, incluyendo flujo con Revit cuando exista un adaptador real.
- IFC4 con entidades semánticas, propiedades, materiales, relaciones, identidad persistente y round-trip.
- DXF únicamente cuando exista un adaptador gobernado y probado.
- Cálculo estructural con solver verificable, sin sustituir el solver por IA.
- Coordinación MEP para sanitarias, eléctricas, HVAC, contra incendios, gases medicinales, telecomunicaciones, Wi-Fi, racks, cámaras y sistemas hospitalarios.
- Seguimiento de obra, gastos, avance, incidencias y mantenimiento.
- Avatar ARKI/Archi para acompañar al usuario durante todo el ciclo de vida, con GLB/glTF, rig, gestos, expresiones, visión, OCR, AR y tres tamaños de interfaz.
- Luka como agente futuro de visión y OCR, separado del alcance inmediato si aún no existe implementación verificable.

## Estado real que debe respetar DeepSeek

Existe un `ConstructionModel` conceptual semántico con resultados verificados de muros, espacios, columnas, vigas, losas, puertas, ventanas, costos y duración.

Existe un visor SVG conceptual. No existe aún un visor Three.js/BIM federado.

Existe comparación numérica de versiones. No existe aún comparación visual lado a lado.

Existe persistencia local con `localStorage`. No existe persistencia real de servidor ni snapshots aprobados.

Existe IFC semántico básico con geometría conceptual. No existe parser IFC4 productivo ni round-trip completo.

No existe DXF gobernado.

El nuevo contrato debe partir de estos hechos y convertir las capacidades pendientes en entregas verificables.

## Rol del nuevo chat

DeepSeek no debe intentar adivinar el estado ni continuar directamente con código. Debe auditar el repositorio, revisar los documentos incluidos y redactar una nueva Orden Maestra para completar lo pendiente.

La nueva Orden Maestra debe dividir el trabajo, proteger el motor existente, definir ADRs, contratos de datos, pruebas, outputs, capturas, riesgos, límites y criterios de promoción.
