# ARKI / ARCHI — Mensaje maestro para el nuevo chat de DeepSeek

## Instrucción de lectura

Este documento es el **traspaso oficial** del proyecto. Debes leerlo completo antes de proponer código. El repositorio real es la fuente de verdad. Los documentos son contratos, decisiones y contexto; no sustituyen la inspección del código.

No debes asumir que algo está implementado porque aparece en un documento, en una conversación o en una interfaz. Debes distinguir entre `DOCUMENTED`, `CONCEPTUAL`, `IMPLEMENTED`, `VERIFIED` y `E2E VERIFIED`.

La primera entrega de este nuevo chat no será código. Será un **nuevo contrato maestro para cerrar todo lo que todavía falta**, basado en el estado real del repositorio y en las decisiones del Product Owner.

---

## 1. Identidad del producto

El nombre actual del producto es **Archi**. El proyecto original se llamaba Generador de Familias y en documentos antiguos también aparece como ARKI. Trátalos como el mismo producto, pero usa **Archi** como nombre operativo nuevo.

Archi no pretende clonar Archicad ni Revit. Es una estación profesional BIM propia para acompañar el ciclo de vida completo de un proyecto:

> concepción → generación paramétrica → espacios → modelo BIM → coordinación → metrados → costos 5D → planificación 4D → expediente técnico → construcción → operación y mantenimiento.

La interfaz debe ser profesional, minimalista y orientada a coordinación BIM. La paleta vigente es azul-negra, con fondo base cercano a `#080736`, texto blanco y acentos amarillo, naranja, verde y cian. Si propones una modificación de color, debes justificarla y dejarla como decisión del Product Owner; no cambies la paleta por iniciativa propia.

---

## 2. Forma de trabajo obligatoria

El Product Owner es el usuario. Su función es definir el propósito, prioridades, criterios de producto y decisiones de alcance.

DeepSeek cumple la función de arquitecto de solución, analista técnico y programador. Debe redactar contratos, ADRs, interfaces, pruebas y código cuando exista autorización.

Manus ejecuta el trabajo en el repositorio. Manus compila, ejecuta pruebas, inspecciona el preview, genera capturas y emite el veredicto contra el contrato.

La regla central es:

> **No se promueve un estado sin código real, prueba ejecutable y output real.**

El orden correcto es:

1. Auditoría del estado real.
2. Contrato ejecutable.
3. ADRs y límites de alcance.
4. Autorización del Product Owner.
5. Implementación por entregas pequeñas.
6. `pnpm check`, `pnpm build` y pruebas de dominio.
7. Verificación visual y capturas.
8. Veredicto `APPROVE`, `APPROVE WITH FIXES`, `REJECT`, `DEFER` o `PRODUCT OWNER DECISION REQUIRED`.

No debes mezclar funcionalidades de distintas fases ni modificar el motor shared para resolver problemas de interfaz sin una decisión explícita.

---

## 3. Estado real de partida

El último checkpoint canónico usado para UI-3A es `c62183a`. El árbol de trabajo puede contener cambios posteriores no necesariamente committeados. Por eso debes inspeccionar el árbol actual antes de escribir el nuevo contrato.

La base técnica es:

- React 19.
- TypeScript estricto.
- Vite.
- Tailwind 4.
- Lógica de dominio en `shared/`.
- Interfaz en `client/src/`.
- Pruebas ejecutables con scripts `tsx`.
- Ocho idiomas: `es`, `en`, `pt`, `fr`, `de`, `it`, `zh`, `ja`.

### Capacidades verificadas o parcialmente verificadas

Archi ya dispone de un generador paramétrico conceptual para varias tipologías de edificio. Produce un `GeneratedBuilding` y un `ConstructionModel` con espacios, muros, capas, aberturas, columnas, vigas, losas, cimentaciones, escaleras, cubiertas, particiones, metrados, costos, duración, relaciones e interferencias conceptuales.

La prueba constructiva verificada produjo, entre otros resultados:

- 16 muros.
- 16 espacios.
- 72 columnas.
- 16 vigas.
- 4 losas.
- 72 cimentaciones.
- 4 escaleras.
- 1 cubierta.
- 4 particiones.
- 16 puertas.
- 320 ventanas.
- 464 relaciones.
- Presupuesto conceptual de S/ 4,672,910.
- Duración conceptual de 93 días.

La serialización de `Muro` y `ConstructionModel` tiene pruebas de ida y vuelta. Las familias paramétricas de mamparas tienen pruebas de recalculación que demuestran cambios de ancho y alto en geometría, materiales, metrados, partidas, presupuesto, 4D, IFC conceptual y Markdown.

La UI-1 y UI-2 fueron verificadas en contratos anteriores. UI-3A añadió un `ContextPanel` izquierdo, un `CanvasPlanView` central, un `InfoBoxPanel` derecho y selección BIM semántica.

Existe comparación de versiones paramétricas mediante `compareDynamicBuildings()`. Compara parámetros y métricas de entre dos y cuatro versiones. La interfaz actual puede guardar versiones y mostrar diferencias numéricas.

Existe persistencia local de propuestas mediante `localStorage`. Esto es persistencia local del navegador, no persistencia real de sesiones, usuarios, aprobaciones o snapshots de servidor.

Existe un exportador IFC constructivo básico. Emite entidades como `IFCWALL`, `IFCDOOR`, `IFCWINDOW`, `IFCCOLUMN`, `IFCBEAM`, `IFCSLAB`, `IFCFOOTING`, `IFCSTAIR`, `IFCROOF`, `IFCSPACE` y propiedades ARKI. El propio contrato del exportador declara `conceptualGeometryOnly: true` y `nativeRvt: false`.

---

## 4. Límites que no debes ocultar

El visor `ProfessionalFamilyViewer.tsx` actual es SVG conceptual. No es Three.js, WebGL ni un visor IFC federado.

El `CanvasPlanView` actual es SVG 2D con selección semántica. No es todavía un modelo 3D navegable con malla, capas geométricas, zonas, clipping box, cámaras ni selección por superficies.

La comparación existente es una comparación de datos y parámetros. No es todavía comparación visual lado a lado de dos propuestas ni comparación sincronizada de dos plantas.

La persistencia existente utiliza `localStorage`. No existe todavía una sesión persistente de servidor, un repositorio de Project State, aprobación de snapshots, congelamiento de versión, historial de cambios por objeto ni auditoría inmutable completa.

El IFC existente es un exportador semántico/conceptual básico. No existe parser IFC4 productivo, lectura completa de IFC, round-trip ARKI ↔ IFC, pérdida de información, GlobalId gobernado, relación ARKI/Revit ni adaptación de BRep, CSG, swept solids y mallas trianguladas.

No existe adaptador DXF gobernado.

No existe cálculo estructural profesional con solver verificable. El estado actual es predimensionamiento y reglas conceptuales.

No existe coordinación MEP profesional calculada. Hay programación conceptual y algunos parámetros de servicios.

Luka y el Avatar ARKI son capacidades futuras registradas. El Avatar debe acompañar todo el ciclo de vida de Archi, usar visión inteligente, OCR, lectura de planos, AR y guía contextual, y mostrar tres tamaños: botón circular, tamaño mediano y tamaño semigrande. No debe declararse implementado sin un contrato independiente, modelo 3D GLB/glTF, rig, gestos, animaciones, límites de IA, contrato de datos y pruebas.

---

## 5. Los 16 módulos canónicos

La taxonomía vigente es:

1. Data.
2. Biblioteca.
3. Proyectos.
4. Generador.
5. Modelo BIM.
6. Planta.
7. Corte.
8. 3D.
9. Metrados.
10. PRESUP-5D.
11. GASTOS.
12. 4D.
13. Clashes.
14. EXP-TEC.
15. O-M.
16. ADM.

Cada módulo debe tener controles definidos según el flujo de trabajo de Archi. No se acepta una pantalla que solo tenga nombre de módulo, botones decorativos o estados conceptuales sin acciones verificables.

El informe `ARCHI_CONTROLES_FUNCIONALES_16_MODULOS.md` contiene la matriz de controles. Debes revisarla y ampliarla únicamente cuando detectes controles faltantes para las nuevas capacidades.

---

## 6. Lo que el nuevo contrato debe resolver

Debes redactar un contrato maestro nuevo para el trabajo pendiente. Como mínimo debe cubrir estas líneas.

### 6.1 Visor BIM 3D real

Debe definir la tecnología, el modelo de escena, el sistema de coordenadas, el árbol de modelo, zonas, niveles, disciplinas, categorías, capas, materiales, selección, ocultar, aislar, congelar, transparencias, clipping, cámaras ortográficas y perspectivas, vistas guardadas, medición, snapping, ejes, norte, unidades y rendimiento.

Debe decidir si el visor se alimenta directamente de `ConstructionModel`, de un modelo intermedio de escena o de IFC. Debe especificar cómo se conserva la identidad del elemento entre 2D, 3D, IFC y futuras familias Revit.

### 6.2 Comparación visual de propuestas

Debe definir una comparación lado a lado de dos propuestas paramétricas. Cada lado debe tener modelo, cámara, nivel, disciplina, filtros y estado de selección independientes o sincronizados de forma explícita.

Debe incluir estados nuevo, modificado, eliminado, sin cambios y pendiente de revisión. Debe distinguir cambios de parámetros, geometría, materiales, cantidades, costo, calendario y documentación.

### 6.3 Comparación visual de plantas

Debe definir dos plantas visuales lado a lado, con escala sincronizada, desplazamiento sincronizado opcional, nivel común, filtros por categoría, control de diferencias, leyenda, lista de cambios y navegación a elemento.

### 6.4 Persistencia real y snapshots aprobados

Debe definir sesión, usuario, proyecto, versión, snapshot, aprobación, congelamiento, restauración, permisos, auditoría, concurrencia, migraciones, almacenamiento, exportación y recuperación.

`localStorage` puede mantenerse como modo local o fallback, pero no debe presentarse como persistencia real.

El contrato debe incluir un gate que impida declarar un snapshot como aprobado si faltan datos, revisión, trazabilidad o firma/validación profesional cuando corresponda.

### 6.5 Familias constructivas y DSL

Debe definir cómo puertas, ventanas, columnas, vigas, losas, escaleras, cubiertas, mobiliario, equipamiento, MEP y otras familias se crean desde el DSL paramétrico.

Cada familia debe tener identidad estable, tipos, parámetros, restricciones, materiales, reglas de cantidad, reglas de costo, reglas de calendario, host, nivel, fase, relaciones y exportación.

Debe especificar importación y exportación de familias externas. La compatibilidad con Revit debe ser mediante adaptador gobernado, no mediante afirmaciones genéricas.

### 6.6 IFC4 real y DXF gobernado

Debe definir parser, exportador, round-trip, entidades admitidas, propiedades, materiales, relaciones espaciales, GlobalId, identidad ARKI, pérdida de información y pruebas de archivos reales.

DXF solo debe entrar al alcance si existe un adaptador gobernado y probado. Si no existe, debe quedar como `FUTURE` con contrato de interfaz, no como botón simulado.

### 6.7 Coordinación estructural, MEP, 5D, 4D y ciclo de vida

El contrato debe conectar arquitectura, estructura, MEP, costos, gastos, planificación, avances, clashes, expediente técnico, operación y mantenimiento. Debe diferenciar programación conceptual de cálculo profesional.

Para estructura debe incluir entradas, solver autorizado, combinaciones, resultados, derivas, modos, fuerzas, ratios, cimentación, memoria y salida para revisión profesional.

Para MEP debe incluir redes, sistemas, caudales, diámetros, pérdidas, tableros, HVAC, incendio, gases medicinales, telecomunicaciones, Wi-Fi, racks, cámaras, agua caliente y coordinación espacial.

Para operación y mantenimiento debe incluir activos, garantías, manuales, inspecciones, órdenes de trabajo, historial, repuestos, responsables y relación con elementos BIM.

---

## 7. Requisitos de la respuesta que debes entregar ahora

No escribas código todavía. Entrega un documento titulado:

**ARCHI — Orden Maestra para cerrar las capacidades BIM pendientes**

El documento debe contener:

1. Auditoría del repositorio real.
2. Baseline exacto y lista de archivos inspeccionados.
3. Estado por capacidad: `IMPLEMENTED`, `PARTIAL`, `CONCEPTUAL`, `NOT IMPLEMENTED` o `FUTURE`.
4. Arquitectura propuesta sin borrar el valor existente de `shared/`.
5. Contratos de datos.
6. ADRs necesarios.
7. División por fases y entregas pequeñas.
8. Dependencias entre fases.
9. Archivos autorizados y archivos protegidos.
10. Pruebas nuevas por entrega.
11. Outputs obligatorios de `pnpm check`, `pnpm build`, dominio, integración y preview.
12. Criterios de aceptación verificables.
13. Riesgos técnicos.
14. Limitaciones y decisiones que requieren al Product Owner.
15. Propuesta de orden de implementación, comenzando por el mayor valor y menor riesgo.
16. Regla explícita para no declarar visor BIM profesional, IFC profesional, persistencia real, DXF o cálculo profesional antes de contar con evidencia.

La orden debe separar al menos:

- Entrega A: visor 3D y escena semántica.
- Entrega B: comparación visual de propuestas y plantas.
- Entrega C: persistencia real, sesiones y snapshots.
- Entrega D: DSL de familias constructivas ampliado.
- Entrega E: IFC4 parser/exporter/round-trip.
- Entrega F: DXF mediante adaptador gobernado.
- Entrega G: coordinación estructural y MEP.
- Entrega H: ciclo de vida, O-M, Avatar y Luka.

No es obligatorio conservar estas letras si una mejor descomposición técnica las reemplaza, pero cualquier cambio debe justificarse.

---

## 8. Reglas de rigor

No inventes archivos que no hayas inspeccionado.

No declares una prueba por el simple hecho de que una función exista.

No uses `Math.random()`, `Date.now()` ni `any` nuevos en archivos críticos sin una decisión justificada. La persistencia debe usar identificadores y timestamps gobernados.

No sustituyas una capacidad real por una tarjeta de UI, un toast o un botón que descargue datos conceptuales.

No borres ni reemplaces `shared/` para evitar compatibilidad. Si necesitas cambiar el modelo, presenta un ADR y una estrategia de migración.

No mezcles UI, motor BIM, persistencia, IFC y Avatar en una sola entrega sin contratos separados.

No presentes un IFC conceptual como IFC profesional.

No presentes un SVG 3D como Three.js.

No presentes `localStorage` como sesión real.

No presentes comparación de métricas como comparación visual lado a lado.

No presentes una estructura conceptual de servicios como cálculo MEP profesional.

No presentes predimensionamiento como memoria de cálculo estructural.

---

## 9. Respuesta esperada de DeepSeek

La respuesta debe empezar con un **veredicto de auditoría**, continuar con la **Orden Maestra propuesta** y terminar con una lista de **decisiones que el Product Owner debe aprobar**.

Después de recibir esa orden, Manus revisará el contrato contra el repositorio real. Solo cuando exista aprobación explícita se podrá comenzar la siguiente implementación.

El paquete adjunto contiene los contratos anteriores, el roadmap corporativo, el flujo de trabajo, la matriz de controles, las auditorías, el veredicto UI-3A y la evidencia de la implementación actual.


## 10. Addenda E ampliada: cuatro partes y ocho entregas

La Addenda E ya no debe tratarse como una única entrega ni como una lista ambigua. Debes usar el documento adjunto `contracts/ARKI_ADDENDA_E_ORDEN_MAESTRA_4_PARTES_8_ENTREGAS.md` como ampliación obligatoria.

La nueva estructura corporativa es:

- **Parte I:** gobierno, accesos, arquitectura y wireflows.
- **Parte II:** catálogo P2 completo de disciplinas y familias.
- **Parte III:** visor BIM, comparación, persistencia e interoperabilidad.
- **Parte IV:** estructuras, MEP, costos, 4D, expediente, O-M, Avatar y gate final.

El catálogo P2 debe conservarse completo. Debe incluir como mínimo **18 disciplinas, 8 tipologías de escalera, 7 tipos de ascensor, 5 gases medicinales y 8 sistemas de seguridad**, además de familias de arquitectura, estructura, MEP, telecomunicaciones, Wi-Fi, racks, cámaras, equipamiento, mobiliario y sistemas hospitalarios.

La implementación debe dividirse en **ocho entregas secuenciales**, cada una con contrato, ADR, archivos protegidos, pruebas, outputs y veredicto independiente. No reduzcas el catálogo para hacerlo parecer una primera entrega pequeña y no intentes implementar todo en un solo bloque.

La respuesta inmediata solicitada sigue siendo una nueva Orden Maestra. No escribas código hasta que el Product Owner y Manus revisen y aprueben el contrato.


## 11. Nueva exigencia del Product Owner: todo en un solo documento unificado

No entregues por separado una lista de faltantes, una lista de capacidades tipo Revit y un roadmap inconexo. Todo debe integrarse en una única Orden Maestra actualizada con la Addenda E v2.

La respuesta debe contener también un **cuadro de mejoras propuestas por DeepSeek**. No basta con explicar qué le falta a Archi. Debes proponer qué debería hacer Archi mejor que una réplica de Revit, especialmente en generación de espacios, trazabilidad, decisiones paramétricas, coordinación, comparación, costos, 4D, expediente, operación, mantenimiento, interoperabilidad, accesibilidad, guía contextual y gobierno profesional.

Cada propuesta de mejora debe indicar problema, ventaja diferencial de Archi, módulos afectados, datos necesarios, entrega, prioridad, complejidad, riesgo, prueba de aceptación y decisión requerida.

La respuesta única debe reunir: auditoría, cobertura Archi/Arqui/Revit, inventario de 18 disciplinas, catálogo de 8 escaleras, 7 ascensores, 5 gases medicinales y 8 sistemas de seguridad, contratos de interoperabilidad, controles de los 16 módulos, cuatro partes, ocho entregas, decisiones pendientes, riesgos y cuadro de mejoras.


## 12. Paso obligatorio antes de seguir: saber qué existe realmente

Antes de proponer más código, usa `ARCHI_ESTADO_IMPLEMENTADO_Y_PENDIENTE_2026_09.md` como inventario inicial y conviértelo en una matriz verificada contra el repositorio real.

Debes separar con rigor:

- Implementado y probado.
- Implementado pero no verificado.
- Parcial.
- Conceptual.
- No implementado.
- Futuro.
- Decisión pendiente del Product Owner.

La primera evidencia visible solicitada es un cuadrado de cuatro muros con una puerta real de 0.90 × 2.10 m, relacionada con el muro norte, seleccionable y con inspector de capas, metrados, costo, dimensiones y trazabilidad. No confundas esta demostración mínima con un BIM profesional completo.

Pide a Manus ejecutar la prueba y captura de esa cadena antes de afirmar que la generación constructiva está visible y funcionando.


## 13. Alcance ampliado: pedir todo lo necesario para nivel profesional

La lista de faltantes debe incluir todo: no solo lo que hoy aparece en Archi, sino también las capacidades que Arqui/Revit puede hacer y que Archi todavía no tiene o no puede demostrar. Si Arqui no tiene una capacidad profesional importante, solicítala igualmente para Archi como brecha y futura entrega.

Incluye expresamente visión profesional, OCR profesional en ocho idiomas, lectura de planos y PDFs, reconocimiento de muros, puertas, ventanas, cotas, textos, niveles, ejes, espacios, mobiliario, equipos y redes; extracción de tablas y cantidades; conversión a entidades BIM con confianza y revisión; comparación de documentos; detección de inconsistencias; modelos IFC/RVT/DWG/DXF/GLB; agentes de asistencia; Avatar; guía contextual; trazabilidad; coordinación; documentación; costos; 4D; expediente; operación y mantenimiento.

La matriz debe decir qué hace Arqui, qué hace Archi hoy, qué falta, qué nivel profesional se exige, cómo mejorará Archi, en qué entrega entra y cómo se prueba. No omitas una capacidad por ser grande: subdivídela y manténla visible en E1-E8.


## 14. Documento adicional recibido: propuesta de Planta SVG

El Product Owner entregó una propuesta de `PlantaViewer` con zoom, pan, capas, tooltips, cotas, escala, regla, exportación SVG/PNG y símbolos de muros, puertas, ventanas, circulación e instalaciones.

Lee los archivos `09_PROPUESTA_PLANTA_SVG_ARQUI.md` y `10_RESUMEN_PLANTA_SVG_Y_ESTADO.md`. Trátalos como especificación funcional recibida, no como evidencia automática de implementación. Debes verificar cada capacidad contra el repositorio React/TypeScript actual y adaptarla a la arquitectura de Archi sin crear una aplicación Vue paralela.

La evidencia mínima es el cuadrado real de cuatro muros y la puerta de 0.90 × 2.10 m relacionada con el muro norte. Después debes contractar el resto de capas, medidas, hover, exportación y demás controles con pruebas y outputs reales.
