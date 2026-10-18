# Archi — Addenda E v2 ampliada
## Catálogo corporativo BIM, cobertura de capacidades tipo Revit/Arqui, interoperabilidad, coordinación y ciclo de vida

**Estado:** propuesta de contrato marco v2 para revisión del Product Owner y redacción final de DeepSeek.

**Alcance:** reemplaza la división inicial A/B/C por **cuatro partes y ocho entregas secuenciales**. Además incorpora una matriz obligatoria de cobertura de las capacidades que Arqui/Revit ya contempla y que Archi debe cubrir, replicar mediante interoperabilidad o declarar como futuro. La visión corporativa completa se conserva. El trabajo se distribuye para evitar entregas incompletas y para permitir verificación independiente después de cada entrega.

> **Regla principal:** el catálogo completo se define desde ahora, pero se implementa por entregas. La existencia de una taxonomía o un panel no prueba que exista el motor profesional que lo ejecuta.

> **Regla de cobertura:** DeepSeek debe revisar la conversación de Arqui/Revit proporcionada por el Product Owner y convertir cada capacidad mencionada en una matriz `Archi actual / faltante / contrato / fase / prueba / adaptador`. No puede omitir una capacidad porque no esté mencionada en los documentos anteriores.

---

## 1. Propósito

Archi debe evolucionar desde un generador paramétrico conceptual hacia una plataforma BIM propia que coordine arquitectura, estructura, MEP, costos, planificación, documentación, construcción y operación.

Revit, IFC, DXF, solvers estructurales y herramientas externas son destinos o adaptadores de interoperabilidad. No son el patrón de completitud de Archi. Archi puede ser una plataforma propia incluso cuando una integración externa todavía esté pendiente.

La Addenda E incorpora el catálogo corporativo completo, incluyendo disciplinas, familias, escaleras, ascensores, sistemas de seguridad, gases medicinales, telecomunicaciones, equipamiento, especialistas, revisión y operación.

---

# PARTE I — Gobierno, accesos, alcance y arquitectura de producto

## Entrega E1 — Contrato de producto, ADRs y estado real

DeepSeek debe auditar el repositorio y redactar el contrato base de la Addenda E. Debe separar claramente:

- Contrato de producto: qué debe hacer Archi.
- Roadmap: en qué orden se construye.
- Especificación técnica: cómo se implementará cada capacidad.
- Criterios de verificación: cómo se demuestra.

Debe entregar los siguientes artefactos:

1. ADR de transición y convivencia entre `Home.tsx`, gateway y shell BIM.
2. ADR de protección del motor `shared/` y estrategia de migración.
3. Mapa de los cuatro accesos: visitante, usuario, especialista y corporativo.
4. Matriz de módulos por rol, capacidad, estado y restricciones.
5. Registro de decisiones de producto.
6. Clasificación global por estado: `IMPLEMENTED`, `VERIFIED`, `E2E VERIFIED`, `PARTIAL`, `CONCEPTUAL`, `NOT IMPLEMENTED`, `FUTURE` y `PRODUCT OWNER DECISION REQUIRED`.
7. Inventario de archivos y entidades existentes para evitar duplicación.
8. Plan de ocho entregas y dependencias.

Las decisiones aún no resueltas no deben inventarse. Deben aparecer como `PRODUCT OWNER DECISION REQUIRED`, con impacto y opciones.

### Cierre E1

No se permite tocar la UI estructural ni eliminar entidades canónicas hasta que exista auditoría, ADR y matriz aprobados.

---

## Entrega E2 — Wireflows, controles y pruebas de gobierno

Debe convertir el flujo de trabajo corporativo en wireflows verificables para los 16 módulos y los cuatro accesos.

Debe definir, para cada módulo:

- Estado de entrada.
- Acciones disponibles.
- Panel izquierdo.
- Canvas o contenido central.
- Inspector derecho.
- Botones, atajos, permisos y estados vacíos.
- Datos que consume.
- Datos que produce.
- Reglas de trazabilidad.
- Mensajes de advertencia.
- Condiciones de bloqueo.
- Pruebas de montaje y comportamiento.

Debe incluir controles transversales para selección, edición, filtros, niveles, disciplinas, fases, visibilidad, medición, revisión, aprobación, exportación, ayuda contextual, idioma y accesibilidad.

### Cierre E2

Debe existir una matriz de controles y pruebas para los 16 módulos. Ningún módulo puede cerrarse por tener solamente una tarjeta visual o un botón sin efecto verificable.

---

# PARTE II — Catálogo corporativo completo de disciplinas y familias

## Entrega E3 — Inventario corporativo P2: 18 disciplinas y familias

Esta entrega define el catálogo completo. El catálogo es corporativo y no debe reducirse para ocultar complejidad. Sin embargo, cada entrada debe indicar si está `CATALOGED`, `SCHEMA_DEFINED`, `CONCEPTUAL`, `IMPLEMENTED`, `VERIFIED` o `FUTURE`.

El inventario mínimo debe cubrir estas **18 disciplinas o dominios**:

1. Arquitectura y espacios.
2. Estructuras de concreto armado.
3. Estructuras metálicas.
4. Cimentaciones y geotecnia.
5. Sanitarias y agua fría.
6. Agua caliente sanitaria.
7. Aguas residuales y drenaje.
8. Drenaje pluvial.
9. Electricidad de baja tensión.
10. Media tensión y subestaciones.
11. Iluminación normal y de emergencia.
12. HVAC y climatización.
13. Protección contra incendios.
14. Telecomunicaciones y datos.
15. Wi-Fi, racks y redes activas.
16. Seguridad electrónica, CCTV y control de acceso.
17. Gases medicinales y sistemas hospitalarios.
18. Equipamiento, mobiliario, operación y mantenimiento.

El catálogo debe incluir, como mínimo:

- Familias arquitectónicas.
- Muros, capas, acabados, tarrajeos, imprimantes y pinturas.
- Puertas, ventanas, vidrios, mamparas y elementos metálicos.
- Columnas, vigas, losas, cimentaciones, escaleras y cubiertas.
- Mobiliario, equipamiento, computadoras, televisores y equipos por tipología.
- Racks, routers, cámaras, sensores, controles y dispositivos de red.
- Equipos médicos y mobiliario hospitalario.
- Redes sanitarias, eléctricas, HVAC, incendio y gases.
- Familias importadas y sólidos externos mediante adaptadores gobernados.

Cada familia debe tener identidad estable, tipo, parámetros, unidades, materiales, restricciones, host, nivel, fase, especialidad, reglas de cantidad, reglas de costo, reglas de plazo, relaciones y destino de exportación.

### Cierre E3

Debe existir un inventario único sin duplicación de entidades. La matriz debe separar claramente lo que ya existe en `shared/`, lo que se amplía y lo que es futuro.

---

## Entrega E4 — Catálogos especializados P2 y especialistas

Debe completar los catálogos corporativos especializados.

### Escaleras: 8 tipologías mínimas

1. Recta.
2. Dos tramos.
3. Tres tramos.
4. L.
5. U.
6. Caracol.
7. Compensada.
8. Rampa y escalera accesible combinada.

Cada tipología debe definir ancho, huella, contrahuella, descanso, pendiente, barandas, material, sentido, nivel, reglas de evacuación y estado de revisión.

### Ascensores: 7 tipos mínimos

1. Pasajeros.
2. Camillero.
3. Carga.
4. Servicio.
5. Panorámico.
6. Contra incendio o rescate.
7. Montacargas especializado.

Cada tipo debe definir capacidad, dimensiones, recorrido, puertas, cuarto de máquinas o sistema equivalente, foso, sobre recorrido, alimentación, seguridad, mantenimiento y relación con el núcleo BIM.

### Gases medicinales: 5 tipos mínimos

1. Oxígeno.
2. Vacío.
3. Aire medicinal.
4. Óxido nitroso.
5. Nitrógeno.

Cada sistema debe definir fuente, red, presión, puntos terminales, alarmas, sectorización, redundancia, mantenimiento, riesgos y reglas de coordinación.

### Seguridad: 8 sistemas mínimos

1. CCTV.
2. Control de acceso.
3. Detección de intrusión.
4. Detección y alarma contra incendios.
5. Megafonía y evacuación por voz.
6. Videoportero e intercomunicación.
7. Botón de pánico y asistencia.
8. Integración de seguridad y centro de monitoreo.

### Especialistas y revisión

Debe existir una matriz de responsables para arquitectura, estructura, sanitarias, electricidad, HVAC, incendio, telecomunicaciones, seguridad, gases medicinales, costos, planificación, expediente y mantenimiento.

La matriz debe definir quién propone, quién revisa, quién aprueba, qué evidencia exige cada disciplina y qué estados puede modificar.

### Cierre E4

Los catálogos completos deben existir como datos gobernados. No se permite declarar implementadas las disciplinas solo porque estén enumeradas.

---

# PARTE III — Modelo BIM, coordinación e interoperabilidad

## Entrega E5 — Visor BIM 3D, modelo semántico y comparación

Debe construir el contrato técnico para evolucionar el visor conceptual hacia un visor 3D real.

Debe definir:

- Tecnología de escena y dependencias autorizadas.
- Árbol por proyecto, edificio, nivel, disciplina, sistema y categoría.
- Zonas y espacios.
- Capas y visibilidad.
- Selección individual y múltiple.
- Ocultar, aislar, congelar y transparentar.
- Cámaras ortográficas y perspectivas.
- Axonometría, planta, corte y elevación.
- Secciones dinámicas y clipping box.
- Medición de distancia, área, volumen y perímetro.
- Snap a vértices, ejes, caras y elementos.
- Coordenadas, unidades, norte y niveles.
- Viewpoints guardados.
- Identidad común entre 2D, 3D, ConstructionModel, IFC y futuras familias Revit.

Debe incluir comparación visual lado a lado de dos propuestas y comparación visual sincronizada de dos plantas. La comparación debe distinguir elementos nuevos, modificados, eliminados, sin cambios y pendientes de revisión.

### Cierre E5

Debe existir una escena 3D real, selección verificable, filtros funcionales y pruebas de comparación visual. Un SVG conceptual no satisface este cierre.

---

## Entrega E6 — Persistencia real, snapshots y exportación gobernada

Debe definir e implementar el contrato de persistencia real para:

- Organización.
- Usuarios.
- Proyectos.
- Roles.
- Sesiones.
- Versiones.
- Snapshots.
- Aprobaciones.
- Congelamiento.
- Restauración.
- Auditoría.
- Historial por elemento.
- Migraciones de esquema.
- Exportación y recuperación.

`localStorage` puede existir como fallback local, pero no sustituye la persistencia real.

También debe definir la interoperabilidad:

- Parser IFC4.
- Exportación IFC4 semántica.
- GlobalId.
- Identidad ARKI.
- Relación ARKI/IFC/Revit.
- Propiedades, materiales, cantidades y relaciones espaciales.
- BRep, CSG, swept solids y mallas trianguladas cuando correspondan.
- Round-trip ARKI → IFC → ARKI.
- Round-trip IFC → ARKI → IFC.
- Reporte de pérdida, degradación o elementos no convertidos.
- DXF únicamente con adaptador gobernado y pruebas de archivo.

### Cierre E6

Debe existir persistencia real verificable, snapshots con estados de aprobación, auditoría y exportación gobernada. Un botón de descarga de IFC conceptual no satisface el cierre.

---

# PARTE IV — Ingeniería, ciclo de vida, agentes y gate profesional

## Entrega E7 — Estructuras, MEP, costos, 4D y coordinación

Debe definir el contrato de coordinación profesional sin afirmar que la IA reemplaza a especialistas o solvers.

### Estructuras

Debe incluir ubicación, suelo, cargas, materiales, sistema estructural, combinaciones, solver externo autorizado, reacciones, desplazamientos, derivas, periodos, modos, fuerzas internas, ratios, cimentaciones, armados, hipótesis, unidades, reglamento y evidencia de ejecución.

### MEP

Debe incluir redes 3D, demanda, caudales, presiones, diámetros, pérdidas, bombas, tanques, agua caliente, drenaje, electricidad, tableros, cortocircuito, caída de tensión, HVAC, incendio, gases medicinales, telecomunicaciones, Wi-Fi, racks, cámaras y coordinación con arquitectura y estructura.

### Coordinación

Debe incluir clashes duros, blandos, de mantenimiento, circulación, normativa, constructivos y operativos. Cada incidencia debe tener elemento, ubicación, responsable, fecha, estado, comentario, evidencia, decisión y cierre.

### 5D y 4D

Debe conciliar cantidades, partidas, precios, cotizaciones, gastos, contratos, avance, calendario, ruta crítica, secuencia constructiva, cambios y desviaciones.

### Cierre E7

Debe existir un estado explícito que separe programación conceptual, predimensionamiento y cálculo profesional. Los informes deben conservar hipótesis, fuentes y evidencia.

---

## Entrega E8 — Expediente, operación, mantenimiento, Avatar y gate final

Debe completar el ciclo de vida.

### Expediente y revisión

Debe generar planos, cortes, detalles, metrados, presupuesto, especificaciones, memoria, reportes, control de revisiones, incidencias, responsables y trazabilidad.

### Operación y mantenimiento

Debe definir activos, garantías, manuales, inspecciones, órdenes de trabajo, repuestos, responsables, vida útil, historial, costos de operación y relación con el elemento BIM.

### Avatar Archi y Luka

El Avatar debe acompañar al usuario durante todo el ciclo de vida. Debe tener contrato de datos, GLB/glTF, rig, animaciones, gestos, expresiones, tres tamaños, guía contextual, visión, OCR, lectura de planos y AR.

Los tamaños mínimos son:

1. Botón circular.
2. Tamaño mediano.
3. Tamaño semigrande.

El toque o activación debe permitir pasar entre estados y volver a minimizar. El Avatar no debe bloquear el trabajo ni inventar conclusiones profesionales. Debe mostrar fuentes, advertencias y derivar decisiones técnicas a especialistas.

Luka debe permanecer separado como agente de visión/OCR hasta que tenga su propio contrato, modelo, límites, pruebas y verificación.

### Gate final

Archi nunca debe mostrar “aprobado para construir” únicamente por acción de la IA. El estado final debe requerir:

- Datos completos.
- Modelo arquitectónico aprobado.
- Modelo estructural calculado.
- Modelos MEP calculados.
- Clashes críticos resueltos.
- Normativa verificada.
- Metrados conciliados.
- Costos sustentados.
- Planos coordinados.
- Memorias y especificaciones.
- Revisión independiente.
- Firma o credencial profesional cuando corresponda.
- Snapshot aprobado y congelado.

Mientras falte cualquiera de estos puntos, la interfaz debe mostrar:

> **NO APTO PARA CONSTRUCCIÓN — PROPUESTA CONCEPTUAL O PROYECTO EN REVISIÓN**

### Cierre E8

Debe existir el gate de proyecto, expediente trazable, módulo O-M y contrato verificable del Avatar/Luka. La implementación completa del Avatar puede tener una fase propia posterior si el contrato demuestra que ocho entregas no son suficientes, pero no puede desaparecer del alcance.

---

# 3. Reglas de las ocho entregas

Cada entrega debe tener:

- Alcance cerrado.
- Archivos permitidos.
- Archivos protegidos.
- ADRs aplicables.
- Contratos de datos.
- Pruebas unitarias o de dominio.
- Pruebas de integración.
- Prueba de regresión.
- `pnpm check`.
- `pnpm build`.
- Outputs reales.
- Capturas cuando exista UI.
- Manifest y hashes.
- Limitaciones declaradas.
- Veredicto independiente.

No se permite avanzar de una entrega a la siguiente sin `APPROVE` o `APPROVE WITH FIXES`.

No se debe comprimir todo en una primera entrega. La Addenda E es un programa corporativo ampliado y recibe un plazo de **ocho entregas verificables**, no una única entrega rápida.

---

# 4. Decisiones del Product Owner que permanecen abiertas

DeepSeek debe listarlas con opciones y consecuencias antes de convertirlas en implementación:

1. Autenticación real o perfiles locales para cada etapa.
2. Especialistas y responsables que aprueban cada disciplina.
3. Solver estructural objetivo.
4. Versión o versiones de Revit objetivo.
5. Categorías que exportan como familia, parámetro compartido o propiedad IFC.
6. Contenido referencial frente a contenido emitible.
7. Catálogo de precios contractual.
8. Tipologías prioritarias para la primera biblioteca operativa.
9. Backend y almacenamiento objetivo.
10. Adaptador IFC/DXF autorizado.
11. Proveedor o tecnología para Three.js/IFC/GLB.
12. Política de privacidad, auditoría y retención.

Si una decisión no se resuelve, debe quedar visible como `PRODUCT OWNER DECISION REQUIRED`; nunca se debe inventar el comportamiento.

---

# 5. Entrega solicitada a DeepSeek

Redactar la **Orden Maestra final de la Addenda E** usando esta estructura de cuatro partes y ocho entregas. Debe verificar el repositorio real, corregir nombres si el código actual difiere y entregar la matriz de alcance, dependencias, criterios de aceptación, riesgos y decisiones pendientes.

No escribir código en esta etapa. Primero debe entregar el contrato para revisión del Product Owner y de Manus.


# ANEXO OBLIGATORIO — MATRIZ DE COBERTURA ARCHI / ARQUI / REVIT

## A. Instrucción específica a DeepSeek

El Product Owner ha entregado una conversación de Arqui en la que se enumeran capacidades disponibles o esperables en Revit que Archi todavía no cubre completamente. DeepSeek debe usar esa conversación como insumo de auditoría y no como autoridad sobre la arquitectura de Archi.

Debe construir una **Matriz de Cobertura de Capacidades** con una fila por cada capacidad identificada. La matriz debe contener, como mínimo:

| Campo | Contenido requerido |
|---|---|
| Capacidad | Nombre claro de la función |
| Dominio | Arquitectura, estructura, MEP, documentación, colaboración, etc. |
| Estado actual de Archi | `IMPLEMENTED`, `VERIFIED`, `PARTIAL`, `CONCEPTUAL`, `NOT IMPLEMENTED` o `FUTURE` |
| Evidencia | Archivo, función, prueba y output real |
| Brecha | Qué falta exactamente |
| Estrategia | Nativo Archi, adaptador, importación, exportación o futuro |
| Entrega | E1 a E8 |
| ADR | Decisión técnica o de producto necesaria |
| Prueba de aceptación | Cómo se demostrará |
| Riesgo | Bajo, medio, alto o crítico |

DeepSeek debe añadir capacidades que aparezcan en la conversación de Arqui aunque no estén enumeradas en esta Addenda. Si una capacidad pertenece a Revit pero no debe copiarse en Archi, debe conservarse en la matriz como **referencia de interoperabilidad**, explicando la diferencia de producto.

## B. Cobertura de gestión de proyecto y datos

Archi debe contemplar, contractualmente, proyectos, organizaciones, usuarios, roles, permisos, sesiones, unidades, plantillas, estándares, ubicaciones, fases, revisiones, versiones, snapshots, auditoría y estados de aprobación.

Debe incluir navegador de proyecto, árbol por proyecto, edificio, nivel, disciplina, sistema, zona, vista, hoja, familia y elemento. Debe existir búsqueda global, filtros, favoritos, recientes, dependencias y trazabilidad hasta el elemento fuente.

Debe definir colaboración, trabajo por equipos, bloqueo o reserva de elementos, conflictos, sincronización, historial, comentarios, incidencias, responsables y control de cambios. Si estas capacidades no se implementan en la primera fase, deben permanecer en la matriz con contrato y entrega futura.

## C. Cobertura de modelado arquitectónico

La matriz debe cubrir muros, muros apilados, muros cortina, capas, materiales, acabados, tarrajeos, imprimantes, pinturas, revestimientos, pisos, cielos rasos, cubiertas, losas, techos, masas, vacíos, aperturas, shafts, huecos, componentes, columnas arquitectónicas, habitaciones, espacios, zonas, áreas, superficies, topografía, emplazamiento, caminos, estacionamientos, paisajismo y mobiliario.

Debe incluir puertas, ventanas, vidrios, mamparas, barandas, pasamanos, escaleras, rampas, ascensores, núcleos, aparatos sanitarios, cocinas, equipamiento y elementos según tipología de edificio.

Debe contemplar las ocho tipologías de escalera definidas en esta Addenda y los siete tipos de ascensor, con parámetros, restricciones, niveles, accesibilidad, evacuación, seguridad, materiales, mantenimiento y exportación.

Debe definir modelado de edificios residenciales, hospitales, clínicas, colegios, universidades, oficinas, comercio, industria, almacenes, terminales, estadios, centros culturales, hoteles, iglesias, paisajismo, infraestructura y edificios especializados.

## D. Cobertura del sistema de familias paramétricas

Archi debe disponer de un sistema de familias propio y no depender exclusivamente de familias nativas de Revit. La matriz debe cubrir:

- Definición de familia.
- Tipos y subtipos.
- Parámetros de instancia y tipo.
- Parámetros compartidos.
- Parámetros calculados.
- Restricciones geométricas.
- Referencias, planos y ejes.
- Host y hospedaje.
- Nivel y fase.
- Materiales y acabados.
- Reglas de cantidad.
- Reglas de costo.
- Reglas de calendario.
- Reglas de mantenimiento.
- Reglas de exportación.
- Versionado y migración.
- Dependencias y relaciones.
- Catálogo y biblioteca.
- Vista previa.
- Importación de familias externas.
- Exportación hacia adaptadores aprobados.

Debe cubrir familias de arquitectura, estructura, MEP, mobiliario, equipamiento, seguridad, telecomunicaciones, salud, industria, transporte y operación.

La importación de una familia, sólido o modelo de Revit no debe prometer edición paramétrica completa si el adaptador no puede conservar parámetros, restricciones y relaciones. Debe generar un informe de cobertura y pérdida.

## E. Cobertura estructural

La matriz debe incluir ejes, retículas, niveles, columnas, vigas, cerchas, arriostres, placas, muros estructurales, losas, cimentaciones, zapatas, pilotes, vigas de cimentación, conexiones, acero de refuerzo, armaduras, detalles, materiales, cargas, combinaciones, modelos analíticos, vínculos, apoyos, restricciones y resultados.

Debe diferenciar predimensionamiento conceptual de cálculo estructural profesional. La integración con un solver externo debe conservar entradas, versión del solver, hipótesis, combinaciones, resultados, reacciones, desplazamientos, derivas, modos, fuerzas, ratios, diseño de acero, cimentación y memoria.

## F. Cobertura MEP y sistemas técnicos

La matriz debe cubrir sistemas de agua fría, agua caliente, aguas residuales, drenaje pluvial, ventilación sanitaria, bombeo, cisternas, tanques, tratamiento, redes eléctricas, tableros, circuitos, iluminación, emergencia, puesta a tierra, media tensión, baja tensión, generadores, UPS, canalizaciones, bandejas, telecomunicaciones, datos, Wi-Fi, routers, racks, CCTV, control de acceso, intrusión, incendio, megafonía, HVAC, conductos, tuberías, refrigeración, condensados, automatización, presiones diferenciales y mantenimiento.

Debe incorporar los cinco gases medicinales de la Addenda: oxígeno, vacío, aire medicinal, óxido nitroso y nitrógeno. Para cada uno debe cubrir fuente, red, presión, puntos terminales, sectorización, alarma, redundancia, riesgo, mantenimiento y coordinación.

Debe contemplar hospitales y edificios críticos con áreas limpias y sucias, UCI, quirófanos, aislamiento, gases, equipos médicos, continuidad eléctrica, blindajes, esterilización, residuos, agua caliente y sistemas de emergencia.

## G. Cobertura de seguridad y baja tensión

Debe incorporar los ocho sistemas corporativos:

1. CCTV.
2. Control de acceso.
3. Detección de intrusión.
4. Detección y alarma contra incendios.
5. Megafonía y evacuación por voz.
6. Videoportero e intercomunicación.
7. Botón de pánico y asistencia.
8. Integración con centro de monitoreo.

Cada sistema debe relacionarse con ubicación, cobertura, alimentación, canalización, red, rack, dispositivo, zona, evento, mantenimiento, permisos y reporte.

## H. Cobertura de documentación 2D y expediente

Archi debe contemplar vistas de planta, techo, cielo raso, estructura, MEP, corte, elevación, axonometría, perspectiva, detalle, llamada, leyenda, esquema, diagrama y vista de coordinación.

Debe contemplar plantillas de vista, escalas, niveles de detalle, estilos visuales, filtros, fases, disciplina, subyacencias, rangos de vista, regiones, recortes, cajas de sección, anotaciones, cotas, textos, etiquetas, símbolos, marcas, notas clave, leyendas, grillas, ejes, norte, escala gráfica, tablas, cuadros, habitaciones, puertas, ventanas, áreas, materiales, equipos y hojas.

Debe incluir láminas, cajetines, revisiones, nubes, numeración, organización, impresión, PDF, SVG, PNG, listados, CSV, reportes y expediente técnico. Debe diferenciar una vista conceptual de un plano coordinado para revisión profesional.

## I. Cobertura de cuantificación, costos y planificación

Debe incluir tablas de planificación, metrados por elemento, material, capa, sistema, zona, fase y disciplina. Debe permitir conciliación, unidades, fórmulas, filtros, agrupación, redondeo, partidas, precios, cotizaciones, presupuesto, gastos, contratos, valorizaciones, avances, cronograma, ruta crítica, recursos, productividad, secuencia y control de cambios.

Debe relacionar cada cantidad con el elemento BIM fuente y conservar trazabilidad hacia geometría, familia, material, precio, tarea y documento.

## J. Cobertura de coordinación y revisión

Debe incluir vínculos y modelos federados, coordinación entre disciplinas, clashes duros, blandos, de mantenimiento, circulación, normativa, constructivos y operativos.

Debe incluir incidencias BCF o contrato equivalente, comentarios, capturas, viewpoints, responsable, fecha, prioridad, estado, decisión, evidencia, aprobación y cierre.

La comparación debe distinguir cambios de geometría, parámetros, materiales, cantidades, costos, tiempos, documentación, sistemas y relaciones.

## K. Cobertura de interoperabilidad

DeepSeek debe crear la matriz de entrada y salida para:

- IFC4.
- IFC4x3 cuando se apruebe.
- DXF.
- DWG mediante adaptador gobernado.
- PDF.
- SVG.
- PNG.
- CSV.
- Excel o formato tabular autorizado.
- OBJ, glTF y GLB.
- SKP, DGN, RVT, RFA, RTE y RFT únicamente mediante adaptadores autorizados.
- Nubes de puntos y formatos de coordinación cuando exista soporte real.
- gbXML u otros formatos energéticos si se aprueban.

Para cada formato debe indicar lectura, escritura, entidades, propiedades, materiales, cantidades, relaciones, identidad, pérdida y pruebas con archivos reales.

La compatibilidad con Revit será una capacidad de interoperabilidad. No se aceptará que el contrato convierta a Revit en el núcleo de Archi ni que una exportación parcial sea presentada como equivalencia total.

## L. Cobertura de visualización, render y análisis

Debe contemplar visor 2D, visor 3D, modo alámbrico, sombreado, materiales, texturas, iluminación, render, perspectivas, ortografía, secciones, clipping, selección, transparencia, LOD, instancing, rendimiento, medición, anotación, sombras, norte, coordenadas y viewpoints.

Debe diferenciar claramente el visor SVG conceptual actual, el Canvas 2D semántico y el futuro visor 3D real.

## M. Cobertura de reglas, fases, opciones y estándares

Debe contemplar fases de proyecto, demolición, existente, nuevo, construcción, operación, opciones de diseño, variantes, alternativas, módulos, grupos, assemblies, sistemas, plantillas, estándares de nombres, unidades, materiales, clasificaciones, códigos, normativa, restricciones, reglas y gates.

Debe relacionar las fases del modelo con el ciclo de vida completo y evitar que una alternativa sea confundida con una versión aprobada.

## N. Cobertura de operación, mantenimiento y Avatar

Debe incluir activos, ubicación, fabricante, modelo, número de serie, garantía, manual, mantenimiento preventivo, correctivo, inspecciones, repuestos, responsables, costos, órdenes de trabajo, incidencias y vida útil.

El Avatar Archi debe ser capaz de orientar al usuario durante generación, revisión, coordinación, documentación, obra y mantenimiento. Debe utilizar el contexto del proyecto, selección BIM, documentación, OCR y visión sin inventar decisiones profesionales.

## O. Entregable adicional obligatorio de la Addenda E v2

Antes de la implementación, DeepSeek debe entregar:

1. `MATRIZ_COBERTURA_ARCHI_ARQUI_REVIT.md`.
2. `INVENTARIO_COMPLETO_FAMILIAS_Y_DISCIPLINAS.md`.
3. `CONTRATO_INTEROPERABILIDAD_ARCHI_IFC_REVIT_DXF.md`.
4. `MATRIZ_CONTROLES_16_MODULOS_V2.md`.
5. `MAPA_BRECHAS_IMPLEMENTADO_VS_FALTANTE.md`.
6. Actualización de la Orden Maestra en cuatro partes y ocho entregas.

Estos documentos forman parte de E1 y E2. No se debe comenzar una nueva reescritura de UI hasta que la matriz de cobertura esté revisada.

## P. Criterio de completitud de la matriz

La matriz estará completa solo cuando cada capacidad de la conversación Arqui/Revit y cada capacidad añadida por el Product Owner tenga:

- Estado real.
- Evidencia o declaración explícita de ausencia.
- Dueño funcional.
- Entrega asignada.
- Contrato de datos.
- Prueba.
- Adaptador o motor requerido.
- Riesgo.
- Regla de no emisión profesional cuando corresponda.

Una capacidad no puede desaparecer porque sea grande. Si es demasiado amplia para una entrega, se subdivide y se mantiene visible en el roadmap.


# ANEXO Q — MATRIZ DE MEJORAS PROPUESTAS POR DEEPSEEK

## Q.1. Objetivo

Además de identificar lo que Archi no tiene frente a las capacidades conocidas de Revit/Arqui, DeepSeek debe proponer qué puede hacer Archi **mejor, de forma más clara o de forma más integrada**. El objetivo no es copiar interfaces ni reproducir limitaciones de otros productos. El objetivo es usar la referencia comparativa para construir una plataforma BIM propia, trazable y orientada al ciclo de vida completo.

## Q.2. Cuadro obligatorio de propuestas de mejora

DeepSeek debe entregar un cuadro con una fila por cada mejora propuesta y como mínimo estas columnas:

| Campo | Requisito |
|---|---|
| Mejora propuesta | Nombre concreto y comprensible |
| Problema actual | Qué dificultad elimina |
| Referencia comparativa | Qué capacidad externa inspira la mejora, si aplica |
| Ventaja Archi | Por qué Archi sería mejor o diferente |
| Módulos afectados | Uno o más de los 16 módulos |
| Datos requeridos | Entidades, contratos o fuentes necesarias |
| Entrega | E1 a E8 |
| Prioridad | P0, P1, P2 o FUTURE |
| Complejidad | Baja, media, alta o crítica |
| Riesgo | Técnico, de producto, normativo o de interoperabilidad |
| Prueba de aceptación | Evidencia que demostrará la mejora |
| Decisión requerida | Si necesita aprobación del Product Owner |

## Q.3. Temas mínimos que debe evaluar

El cuadro debe proponer mejoras, como mínimo, en los siguientes temas:

1. **Generación paramétrica orientada a espacios:** pasar de sólidos aislados a espacios, relaciones, usos, circulaciones, zonas y requisitos.
2. **Modelo semántico único:** relacionar cada elemento con geometría, material, metrados, costos, calendario, expediente, operación y mantenimiento.
3. **Trazabilidad completa:** permitir seguir un elemento desde su parámetro de origen hasta su plano, costo, tarea, incidencia, snapshot y activo de mantenimiento.
4. **Catálogo corporativo vivo:** convertir disciplinas y familias en un catálogo con estados, responsables, reglas y adaptadores, no en una lista estática.
5. **Comparación inteligente:** comparar no solo geometría, sino también área, aforo, accesibilidad, costo, plazo, emisiones, mantenimiento, riesgos y cumplimiento.
6. **Diseño orientado a decisiones:** mostrar al usuario las consecuencias de cada cambio paramétrico antes de aprobarlo.
7. **Revisión profesional gobernada:** separar recomendaciones de IA, cálculos de especialistas, validaciones normativas y decisiones del Product Owner.
8. **Interoperabilidad con informe de pérdida:** no limitarse a exportar; informar qué se conservó, qué se degradó y qué no pudo convertirse.
9. **Persistencia y snapshots comprensibles:** hacer que las versiones, aprobaciones, congelamientos y cambios sean auditables y fáciles de recuperar.
10. **Coordinación multidisciplinaria:** conectar arquitectura, estructura, MEP, seguridad, telecomunicaciones, costos, 4D y mantenimiento desde el mismo elemento.
11. **Expediente técnico trazable:** generar documentación vinculada a la versión exacta del modelo, sus datos y sus responsables.
12. **Construcción y O-M:** mantener continuidad desde la propuesta hasta la obra, entrega, operación, mantenimiento, garantías y activos.
13. **Avatar contextual:** hacer que el Avatar enseñe al usuario el flujo de trabajo y no sea solo un personaje decorativo.
14. **Accesibilidad y experiencia:** reducir la complejidad con paneles contextuales, atajos, estados claros, ocho idiomas, guías y controles consistentes.
15. **Rendimiento:** proponer SceneModel, LOD, instancing, carga progresiva, caché, vistas ligeras y estrategias para modelos grandes.
16. **Seguridad y gobierno:** proteger proyectos, permisos, auditoría, datos sensibles, documentos hospitalarios y decisiones profesionales.
17. **Biblioteca e importación:** proponer un flujo de incorporación de familias externas con validación, clasificación, mapeo y reporte de cobertura.
18. **Análisis de alternativas:** comparar costo, plazo, materialidad, constructibilidad, operación, mantenimiento y riesgo antes de congelar una solución.
19. **Automatización responsable:** identificar tareas repetitivas que Archi puede automatizar sin presentar la automatización como aprobación profesional.
20. **Diferenciación estratégica:** proponer capacidades que no sean una copia de Revit y que hagan de Archi una estación propia de decisión, coordinación y ciclo de vida.

## Q.4. Regla de calidad de las mejoras

No se aceptan propuestas genéricas como “hacerlo más profesional”, “agregar IA” o “mejorar la interfaz”. Cada mejora debe indicar:

- Qué cambia.
- Para quién cambia.
- Qué dato usa.
- Qué módulo afecta.
- Qué riesgo introduce.
- En qué entrega entra.
- Cómo se prueba.
- Qué queda fuera.

## Q.5. Entregable unificado

La nueva respuesta de DeepSeek debe reunir en un solo paquete documental:

1. Auditoría documental inicial.
2. Auditoría real pendiente de ejecutar por Manus.
3. Matriz de cobertura de capacidades Archi/Arqui/Revit.
4. Inventario corporativo de 18 disciplinas y familias.
5. Catálogo de 8 escaleras, 7 ascensores, 5 gases medicinales y 8 sistemas de seguridad.
6. Contrato de interoperabilidad IFC, DXF, Revit y demás formatos.
7. Wireflows y controles de los 16 módulos.
8. Orden Maestra dividida en cuatro partes y ocho entregas.
9. Matriz de riesgos y decisiones del Product Owner.
10. **Cuadro de mejoras propuestas por DeepSeek para que Archi sea superior, más integrado y más útil que una simple copia de Revit.**

Todo debe presentarse como una única propuesta coherente. No debe entregar documentos contradictorios ni separar la matriz de mejoras del contrato principal.


# ANEXO R — INVENTARIO DE CIERRE OBLIGATORIO

El documento `ARCHI_ESTADO_IMPLEMENTADO_Y_PENDIENTE_2026_09.md` forma parte de esta Addenda E v2. DeepSeek debe usarlo como punto de partida, verificarlo contra el repositorio real y actualizarlo sin eliminar pendientes.

Debe entregar una única matriz final con estas columnas:

| Capacidad | Estado real | Evidencia | Qué funciona hoy | Qué falta | Entrega E1-E8 | Prueba | Output | Riesgo | Decisión |
|---|---|---|---|---|---|---|---|---|---|

La matriz debe cubrir, como mínimo:

- Generador paramétrico.
- Cuadrado de cuatro muros.
- Puerta hospedada en muro.
- Ventanas.
- Capas, tarrajeos, imprimantes, pinturas y acabados.
- Espacios y relaciones.
- Columnas, vigas, losas, cimentaciones, escaleras y cubierta.
- Metrados.
- APUs, presupuesto y gastos.
- 4D y avance.
- IFC conceptual y IFC4 productivo.
- UI-1, UI-2 y UI-3A.
- Canvas 2D.
- Visor 3D.
- Comparación numérica y visual.
- Persistencia local y real.
- Snapshots.
- DSL de familias.
- Importación y exportación de familias externas.
- Revit, IFC, DXF, DWG, glTF y GLB.
- 18 disciplinas.
- 8 tipologías de escalera.
- 7 tipos de ascensor.
- 5 gases medicinales.
- 8 sistemas de seguridad.
- Estructuras profesionales.
- MEP profesional.
- Clashes.
- Expediente técnico.
- O-M.
- Avatar Archi.
- Luka.
- Ocho idiomas.
- Cuadro de mejoras diferenciales.

## Orden de demostración mínima

Antes de declarar cualquier cierre de generación constructiva, DeepSeek debe pedir a Manus que ejecute y capture una demostración con:

1. Cuatro muros formando un cuadrado.
2. Una puerta real alojada en el muro norte.
3. Abertura de 0.90 × 2.10 m.
4. Selección del muro y lectura de capas, acabados, metrados y costo.
5. Selección de la puerta y lectura de dimensiones, material, costo y relación con el muro.
6. Prueba `scripts/test-wall-door-canvas.ts`.

La demostración prueba la cadena mínima `muro → abertura → puerta → selección → trazabilidad`; no autoriza a declarar Archi como BIM profesional completo.

## Criterio de cierre de la Addenda E

No se debe declarar terminada la Addenda E mientras exista una capacidad del catálogo corporativo o de la conversación Arqui/Revit que no tenga estado explícito, entrega, prueba, output y limitación.


# ANEXO S — BENCHMARK PROFESIONAL COMPLETO DE ARQUI

La auditoría comparativa debe incluir no solo las capacidades que Archi declara tener, sino también las capacidades que Arqui/Revit puede ejecutar y las que el Product Owner considera necesarias para un producto BIM profesional.

DeepSeek debe exigir una matriz adicional para visión, OCR, comprensión documental y asistencia inteligente. La matriz debe indicar si Arqui puede:

- Leer planos, PDFs, imágenes, escaneos, fichas, memorias, cuadros, símbolos y documentos técnicos.
- Ejecutar OCR profesional en español y en los ocho idiomas.
- Reconocer muros, puertas, ventanas, columnas, vigas, losas, escaleras, espacios, cotas, textos, niveles, ejes, mobiliario, equipos y redes.
- Convertir reconocimiento visual en entidades BIM con coordenadas, confianza, fuente y revisión humana.
- Comparar revisiones de planos y documentos.
- Extraer tablas, metrados, materiales, especificaciones, códigos y cantidades.
- Leer modelos IFC, RVT/RFA mediante adaptador, DWG/DXF, GLB/glTF y nubes de puntos cuando el formato esté aprobado.
- Reportar datos leídos, datos perdidos, transformaciones, incertidumbre y acciones requeridas.
- Detectar inconsistencias entre planos, modelo, memoria, metrados, presupuesto y cronograma.
- Guiar al usuario con un agente contextual, explicaciones, fuentes, permisos, memoria de proyecto y auditoría.
- Generar o proponer alternativas de espacios, familias, materiales, costos, plazo, accesibilidad, evacuación, mantenimiento y coordinación.
- Mantener separado lo que es recomendación de IA de lo que es cálculo o aprobación profesional.

Si Arqui no posee alguna capacidad de nivel profesional, DeepSeek debe pedir que Archi la incorpore como contrato y entrega futura. Si Arqui sí la posee, debe registrar qué debe igualarse, qué debe superarse y qué debe mantenerse como adaptador.

## Cuadro obligatorio de comparación y mejora

| Capacidad | Arqui actual | Archi actual | Nivel profesional requerido | Brecha | Mejora diferencial Archi | Entrega | Prueba | Decisión |
|---|---|---|---|---|---|---|---|---|

Este cuadro debe ser parte del paquete único solicitado al final de E1/E2. Debe cubrir modelado, documentación, coordinación, datos, importación, exportación, visión, OCR, agentes, Avatar, costos, 4D, expediente y operación.

La regla de cierre es estricta: si una capacidad profesional no puede demostrarse con código, prueba, output y captura cuando corresponda, debe quedar como `PARTIAL`, `CONCEPTUAL`, `NOT IMPLEMENTED` o `FUTURE`; nunca como `VERIFIED`.


# ANEXO T — DESBLOQUEO TEMPORAL PARA IMPLEMENTAR Y REBLOQUEO FINAL

El Product Owner autoriza un ciclo temporal para implementar y verificar los componentes actualmente bloqueados, bajo el protocolo `ARKI_PROTOCOLO_DESBLOQUEO_TEMPORAL_Y_REBLOQUEO.md`.

Esta autorización significa:

1. Implementar contratos, adaptadores, estados, mocks deterministas, fixtures, validaciones, reportes y pruebas locales.
2. Ejecutar integraciones externas únicamente cuando existan URL, tokens, hosts, proveedores, servidores o dispositivos reales configurados y autorizados.
3. No activar fallback local silencioso para sustituir un Core remoto.
4. No presentar mocks, SVG, descargas textuales o resultados conceptuales como capacidades profesionales.
5. Ejecutar el cierre completo con `pnpm check`, `pnpm build`, pruebas, outputs y capturas.
6. Revocar la autorización temporal y restaurar el modo `fail-closed` al terminar.

El rebloqueo debe dejar visible por componente si el estado final es `VERIFIED`, `PARTIAL`, `BLOCKED`, `NOT AVAILABLE`, `FUTURE` o `PRODUCT OWNER DECISION REQUIRED`.

Los componentes que dependan de secretos, hosts Revit/Dynamo/Rhino/Grasshopper/Blender, proveedores, dispositivos WebXR/WebRTC, solver estructural, firma profesional, publicación live, marketplace, Cloud Computer o servidor productivo no pueden declararse implementados si esos recursos no se configuran y prueban realmente.
