# Archi — Estado real de capacidades: implementado, parcial y pendiente

**Fecha:** 2026-09-22

**Propósito:** inventario de cierre para incorporar a la Addenda E v2 y entregar a DeepSeek. Este documento distingue lo que existe en el código o en pruebas de lo que solo está documentado, conceptual o pendiente.

> La existencia de una pantalla, tipo, tarjeta, botón o exportación textual no demuestra una capacidad profesional completa. El cierre requiere código real, prueba ejecutable, output real, captura cuando corresponda y veredicto.

## 1. Capacidades implementadas y verificadas

| Área | Estado | Evidencia actual | Alcance real |
|---|---|---|---|
| Generador paramétrico base | VERIFIED | `scripts/test-constructive.ts` | Genera un `ConstructionModel` con muros, espacios, columnas, vigas, losas, cimentaciones, escaleras, pisos, techo, particiones, puertas, ventanas y relaciones. |
| Modelo constructivo | VERIFIED | Output constructivo actual | La prueba reporta 16 muros, 16 espacios, 72 columnas, 16 vigas, 4 losas, 72 cimentaciones, 4 escaleras, 16 puertas, 320 ventanas y 464 relaciones. |
| Geometría rectangular base | VERIFIED | `generateConstructionModel()` | Cada nivel crea cuatro muros perimetrales: norte, este, sur y oeste. |
| Abertura de puerta en muro | VERIFIED en dominio | `Muro.aberturas`, `scripts/test-wall-door-canvas.ts` | El muro norte tiene una puerta de 0.90 × 2.10 m y la entidad `door-1` se relaciona con ese muro. |
| Capas y acabados de muro | VERIFIED en dominio | `Muro.capas`, `Muro.acabados`, pruebas constructivas | Incluye tarrajeo, albañilería, pintura y zócalo según el generador actual. |
| Metrados | VERIFIED | Pruebas constructivas y métodos de `Muro` | Calcula área, volumen, peso, aberturas, tarrajeos y pintura. |
| Presupuesto conceptual | VERIFIED | `APU_DATABASE`, partidas y output | Calcula partidas y presupuesto referencial. No es aún catálogo contractual corporativo. |
| Programación 4D conceptual | VERIFIED | `ConstructionModel.schedule` | Genera tareas y duración vinculadas a elementos. No es planificación de obra profesional completa. |
| Serialización Muro/ConstructionModel | VERIFIED | `test-serialization.ts`, `test-wall-coherence.ts` | Tiene conversión y pruebas de ida y vuelta. |
| Recalculo de familias | VERIFIED para alcance existente | Pruebas de mamparas y recalculación | Cambios paramétricos impactan geometría, materiales, cantidades, costos, 4D, IFC conceptual y Markdown. |
| IFC semántico conceptual | VERIFIED como conceptual | `exportConstructionIfc()` y pruebas | Emite entidades constructivas y propiedades ARKI. No equivale a IFC4 productivo completo. |
| UI-1 y gateway | VERIFIED documentalmente | Contratos y pruebas previas | Existe acceso por perfiles y gateway común. Requiere regresión contra árbol actual. |
| UI-2 y shell | VERIFIED documentalmente | Evidencia UI-2 | Existe workspace BIM, 16 módulos canónicos y paleta oscura. Requiere regresión contra árbol actual. |
| UI-3A | VERIFIED documentalmente | Evidencia UI-3A | ContextPanel, CanvasPlanView, InfoBoxPanel y selección BIM existen en la capa de presentación. |
| Canvas 2D semántico | PARTIAL/CONCEPTUAL | `CanvasPlanView.tsx` | Dibuja planta SVG, muros, categorías y selección. No es un visor BIM 3D. La demostración muro-puerta debe mantenerse como evidencia mínima. |
| Selección BIM | VERIFIED en contrato | `arkiBimSelection.ts`, `test-bim-selection.ts` | Selección simple, múltiple y vacía con propiedades, métricas, costos y relaciones. |
| Ocho idiomas | IMPLEMENTED documentalmente | Catálogo y pruebas previas | es, en, pt, fr, de, it, zh, ja. Requiere confirmar cobertura completa de UI y persistencia vigente. |

## 2. Capacidades implementadas parcialmente

| Área | Qué existe | Qué falta para cerrar |
|---|---|---|
| 16 módulos | Taxonomía, navegación y algunos módulos de presentación | Implementar controles funcionales completos, datos, operaciones, outputs y pruebas de cada módulo. |
| Familias paramétricas | Motor base y mamparas verificadas | DSL completo para puertas, ventanas, columnas, vigas, losas, escaleras, cubiertas, mobiliario, equipamiento y MEP. |
| Puertas y ventanas | Entidades constructivas y relaciones | Parámetros geométricos completos, edición visual, anfitrión real, abertura coordinada, familias tipológicas y exportación completa. |
| Modelo BIM | `ConstructionModel` semántico | SceneModel, identidad persistente, visor 3D, coordinación, federación y navegación profesional. |
| Metrados/5D | Metrados y APUs referenciales | Base contractual, versiones de precios, cotizaciones, gastos, contratos, valorizaciones, cambios y conciliación auditada. |
| 4D | Tareas y duración conceptual | Calendario profesional, recursos, ruta crítica, avance real, incidencias, costos de tiempo y actualización por obra. |
| IFC | Exportación conceptual | Parser IFC4, exportación productiva, GlobalId gobernado, relaciones, materiales, round-trip y reporte de pérdida. |
| O-M | Módulo y concepto registrados | Activos, garantías, manuales, inspecciones, órdenes de trabajo, repuestos, responsables e historial. |
| Importación de familias | Idea y contratos futuros | Adaptadores reales, validación de parámetros, mapeo, clasificación, cobertura y pérdida. |
| Comparación de propuestas | Comparación numérica | Comparación visual lado a lado, cámaras, diferencias de geometría, materiales, costos, plazo y documentación. |

## 3. Capacidades conceptuales o no finalizadas

| Capacidad | Estado actual honesto | Trabajo pendiente |
|---|---|---|
| Visor 3D BIM | CONCEPTUAL/NOT IMPLEMENTED como visor profesional | Three.js/R3F o alternativa aprobada, SceneModel, mallas, cámaras, clipping, capas, zonas, selección superficial, LOD y rendimiento. |
| Comparación visual de modelos | NOT IMPLEMENTED | Dos SceneModel lado a lado con diferencias navegables. |
| Comparación visual de plantas | NOT IMPLEMENTED | Dos plantas 2D sincronizadas con escala, filtros y leyenda de cambios. |
| Persistencia real | NOT IMPLEMENTED | Sesiones, proyectos, versiones, snapshots, permisos, auditoría, concurrencia y recuperación. `localStorage` es solo fallback local. |
| Snapshots aprobados | NOT IMPLEMENTED | Gate de aprobación, congelamiento, firma/validación, hash, auditoría y restauración. |
| IFC4 parser | NOT IMPLEMENTED | Lectura de archivos IFC reales, entidades, propiedades, relaciones y materiales. |
| IFC round-trip | NOT IMPLEMENTED | ARKI → IFC → ARKI e IFC → ARKI → IFC con reporte de pérdida. |
| DXF gobernado | NOT IMPLEMENTED | Adaptador autorizado, capas, bloques, mapeo, importación, exportación y pruebas con archivos reales. |
| Revit/RVT/RFA | NOT IMPLEMENTED como adaptador completo | Definir alcance de interoperabilidad y probar importación/exportación de familias, parámetros, geometría y pérdida. |
| Cálculo estructural profesional | NOT IMPLEMENTED | Solver verificable, cargas, combinaciones, derivas, modos, fuerzas, ratios, cimentación y memoria. |
| MEP profesional | NOT IMPLEMENTED | Redes calculadas, caudales, diámetros, pérdidas, tableros, HVAC, incendio, gases y coordinación. |
| Clashes profesionales | CONCEPTUAL | Detección espacial real, tipos de interferencia, responsables, estados, BCF o contrato equivalente y cierre. |
| Catálogo corporativo | DOCUMENTADO, no implementado completo | 18 disciplinas y bibliotecas con familias, parámetros, reglas, responsables y estados. |
| Ocho escaleras | CATALOGED/NOT IMPLEMENTED como sistema completo | Parametrización, restricciones, accesibilidad, evacuación, materiales, cantidades y exportación. |
| Siete ascensores | CATALOGED/NOT IMPLEMENTED | Familias, núcleo, recorrido, foso, sobre recorrido, puertas, capacidad, seguridad y mantenimiento. |
| Cinco gases medicinales | CATALOGED/NOT IMPLEMENTED | Redes, presión, puntos, alarmas, sectorización, redundancia, mantenimiento y coordinación. |
| Ocho sistemas de seguridad | CATALOGED/NOT IMPLEMENTED | CCTV, acceso, intrusión, incendio, voz, intercom, pánico y centro de monitoreo. |
| 18 disciplinas | CATALOGED/NOT IMPLEMENTED | Contratos de datos, familias, controles, especialistas, cálculo y evidencia por disciplina. |
| Avatar Archi | FUTURE | GLB/glTF, rig, gestos, animaciones, tres tamaños, guía contextual, visión, OCR y AR. |
| Luka | FUTURE | Agente separado con visión/OCR, contrato de datos, límites, pruebas y fuentes. |

## 4. Capacidades que DeepSeek debe pedir y cerrar desde la Addenda E

DeepSeek debe transformar cada pendiente en una fila de contrato con:

- Estado real.
- Archivo y función responsable.
- Dependencias.
- ADR requerido.
- Entrega E1-E8.
- Prueba de dominio.
- Prueba de integración.
- Output esperado.
- Captura esperada.
- Riesgo.
- Decisión del Product Owner.
- Regla de no emisión profesional.

Debe pedir especialmente la cobertura de todas las capacidades tipo Revit/Arqui que aún no existen en Archi:

1. Navegador de proyecto y organización de vistas.
2. Niveles, ejes, coordenadas, norte, fases y opciones de diseño.
3. Muros, puertas, ventanas, pisos, techos, cubiertas, cielos, cortinas, escaleras, rampas, barandas, ascensores, espacios, habitaciones y zonas.
4. Familias paramétricas y biblioteca con tipos, instancias, anfitriones, materiales y reglas.
5. Mobiliario, equipamiento, salud, industria, seguridad, telecomunicaciones y sistemas especiales.
6. Modelo estructural y modelo analítico.
7. Sistemas MEP calculables.
8. Vistas, filtros, plantillas, niveles de detalle, anotaciones, cotas, etiquetas, leyendas y detalles.
9. Hojas, cajetines, revisiones, impresión y expediente.
10. Tablas, metrados, materiales, costos, planificación y cambios.
11. Modelos vinculados, federación, coordinación y clashes.
12. Comparación de versiones y alternativas.
13. Colaboración, permisos, auditoría y snapshots.
14. Importación/exportación IFC, DXF, DWG, RVT, RFA, glTF, GLB y formatos tabulares mediante adaptadores gobernados.
15. Render, visualización, medición, secciones y navegación 3D.
16. Energía, sostenibilidad y análisis cuando se aprueben contratos específicos.
17. Operación, mantenimiento y activos.
18. Avatar contextual, Luka, visión, OCR y AR.

## 5. Criterio de cierre total

El trabajo no se considera terminado mientras exista una capacidad incluida en el alcance y marcada como pendiente sin:

- Contrato.
- Entrega asignada.
- Responsable técnico.
- Prueba.
- Output.
- Estado visible.
- Limitación declarada.

El sistema puede declarar una capacidad como futura por decisión del Product Owner, pero no puede ocultarla ni presentarla como terminada.

## 6. Evidencia mínima de la demostración solicitada

La primera demostración debe mostrar en el preview:

1. Un cuadrado formado por cuatro muros del `ConstructionModel`.
2. Una puerta real relacionada con el muro norte.
3. La abertura de 0.90 × 2.10 m.
4. Selección de muro con capas, acabados, metrados y costo.
5. Selección de puerta con familia, dimensiones, material, costo y muro anfitrión.
6. Conteo visible de muros y puertas.
7. Prueba ejecutable `scripts/test-wall-door-canvas.ts`.

Esta demostración no significa que Archi ya sea BIM profesional completo. Es la evidencia mínima de que la generación de un elemento constructivo y su relación anfitrión-abertura son reales y visibles.


## 7. Benchmark profesional obligatorio: capacidades de Arqui y capacidades que Archi debe alcanzar

La lista de cierre no se limita a las funciones que ya aparecen en el repositorio. DeepSeek debe incorporar toda capacidad que exista en Arqui, toda capacidad relevante de Revit/IFC/BIM profesional y toda capacidad que el Product Owner haya solicitado para el ciclo de vida de Archi. Si Arqui puede hacer algo que no está documentado aquí, debe añadirse durante la auditoría comparativa.

### 7.1. Visión, OCR y comprensión documental

Debe evaluarse y contractarse la capacidad de recibir planos, imágenes, fotografías, escaneos, PDFs, documentos técnicos, fichas, cuadros, etiquetas, nubes de puntos y modelos visuales; detectar líneas, muros, puertas, ventanas, columnas, vigas, losas, escaleras, cotas, textos, símbolos, niveles, ejes, ambientes, mobiliario, equipos, redes y leyendas; convertir esos hallazgos en entidades BIM con confianza, fuente, ubicación y revisión humana; leer y estructurar OCR en español y los ocho idiomas; conservar coordenadas y vínculo con la imagen original; detectar inconsistencias; comparar revisiones; identificar cambios; clasificar documentos; extraer tablas, cantidades, materiales, especificaciones y códigos; y generar un informe de cobertura y confianza.

El OCR profesional debe contemplar baja resolución, rotación, inclinación, sellos, manuscritos cuando se apruebe, tablas complejas, textos superpuestos, simbología técnica, planos escaneados y documentos multiformato. Ningún dato inferido por visión u OCR puede entrar automáticamente como dato constructivo aprobado sin revisión, trazabilidad y estado explícito.

### 7.2. Lectura inteligente de modelos y documentos

Debe pedirse análisis de modelos IFC, RVT/RFA mediante adaptadores autorizados, DWG/DXF, PDF, imágenes, GLB/glTF, nubes de puntos y documentos de expediente. El sistema debe identificar qué pudo leer, qué no pudo leer, qué transformó, qué perdió y qué requiere intervención humana.

Debe incluir detección de espacios, reconocimiento de tipologías, clasificación automática de familias, extracción de parámetros, vinculación de planos con niveles, búsqueda semántica, preguntas sobre el modelo, generación de listados, revisión cruzada de planos y memoria, y comparación entre documento emitido y modelo fuente.

### 7.3. Generación y edición profesional

Debe pedirse generación de alternativas de distribución, volumetría, estructura preliminar, envolvente, materiales, instalaciones conceptuales, accesibilidad, evacuación, iluminación, ventilación, costos, plazo, mantenimiento y cumplimiento. Cada alternativa debe mantener identidad, versión, reglas, restricciones, fuentes, impactos y comparación.

La edición debe permitir modificar parámetros, restricciones, materiales, capas, acabados, aberturas, familias, niveles, fases, sistemas, zonas, espacios, cantidades y relaciones, con actualización controlada de geometría, metrados, costos, calendario, documentación, IFC y activos.

### 7.4. Automatización, agentes y asistencia

Debe evaluarse un agente profesional capaz de guiar el flujo, explicar el modelo, proponer acciones, detectar pendientes, resumir cambios, preparar revisiones, generar consultas, preparar expedientes, revisar consistencia y derivar decisiones a especialistas. Debe tener permisos, límites, fuentes, memoria de proyecto, auditoría, confirmaciones y separación entre recomendación y aprobación.

El Avatar Archi debe ser una interfaz de asistencia durante generación, coordinación, presupuesto, programación, expediente, obra y mantenimiento. Luka debe tener su propio contrato de visión/OCR. Ambos deben poder trabajar con el contexto de selección BIM, pero no deben inventar resultados ni sustituir firma o cálculo profesional.

### 7.5. Capacidades profesionales de modelado y documentación

La auditoría debe verificar o exigir niveles, ejes, coordenadas, unidades, fases, opciones, vínculos, modelos federados, vistas, filtros, plantillas, detalles, anotaciones, cotas, etiquetas, tablas, leyendas, hojas, cajetines, revisiones, emisión, impresión, PDF, listados, modelos analíticos, sistemas, materiales, parámetros, familias, host, restricciones y reglas.

Debe incluir vistas de planta, corte, elevación, detalle, coordinación, estructura, MEP, cielos, techos, emplazamiento, perspectivas, axonometrías, secciones, renders, recorridos, vistas guardadas y documentación derivada de la versión exacta del modelo.

### 7.6. Capacidades profesionales de coordinación y control

Debe pedirse coordinación federada, detección de interferencias, revisión normativa, accesibilidad, evacuación, mantenimiento, constructibilidad, secuencia, espacios técnicos, reservas, pases, tolerancias, zonas de seguridad, rutas, cobertura de sistemas, pendientes, riesgos y decisiones.

Debe existir una matriz de incidencias con responsable, disciplina, evidencia, severidad, fecha, estado, comentario, vista, elemento, causa, solución, aprobación y cierre.

### 7.7. Capacidades profesionales de datos, colaboración y gobierno

Debe incluir organizaciones, usuarios, roles, permisos, especialidades, revisión, aprobación, auditoría, firmas, snapshots, versiones, comparación, comentarios, incidencias, trazabilidad, almacenamiento, recuperación, concurrencia, sincronización, exportación, retención, privacidad y seguridad.

### 7.8. Requisito de completitud ampliado

Si DeepSeek identifica que Arqui posee una capacidad profesional que no está en esta lista, deberá añadirla. Si una capacidad es demasiado amplia para una entrega, deberá subdividirla, asignarla a E1-E8, definir su contrato y mantenerla visible hasta su cierre. No se permite declarar “completo” por implementar solamente un subconjunto visual o conceptual.
