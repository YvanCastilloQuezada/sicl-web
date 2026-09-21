# Investigación para ARKI: BIM, Revit, Dynamo, IFC y expedientes técnicos

**Fecha de corte:** 21 de septiembre de 2026  
**Propósito:** definir qué debe estudiar ARKI y qué información debe solicitar antes de generar, revisar o prometer entregables BIM y de expediente técnico.  
**Regla de interpretación:** este informe separa las fuentes peruanas de las referencias internacionales. Las materias, entradas y gates propuestos para ARKI son controles de diseño del motor; no constituyen por sí mismos requisitos legales ni acreditan cumplimiento.

## 1. Resumen ejecutivo

ARKI debe tratar BIM como **gestión de información para una inversión**, no como sinónimo de modelar en Revit. En el marco peruano, la Guía Nacional BIM del Ministerio de Economía y Finanzas (MEF) articula requisitos de información, usos BIM, roles, entorno de datos comunes (CDE), plan de ejecución BIM (BEP), programas MIDP/TIDP y entregables. La guía define el LOIN o **nivel de información necesaria** como la combinación del detalle geométrico y la información no gráfica que necesita cada entregable, de acuerdo con el objetivo de la fase de inversión. [1]

Revit es una herramienta de autoría de modelos; Dynamo es una interfaz de programación visual para personalizar flujos de trabajo de Revit y está distribuido con Revit junto con nodos específicos. Ninguno sustituye la definición contractual de requisitos, la revisión profesional, la coordinación entre especialidades ni la validación normativa. [2]

IFC es un estándar abierto y neutral de buildingSMART, publicado también como ISO 16739. La versión oficial más reciente indicada por buildingSMART es IFC 4.3.2.0, también denominada IFC 4.3 y publicada como ISO 16739-1:2024. La compatibilidad depende de la versión, la vista o MVD y la implementación concreta del software; por tanto, ARKI debe pedir siempre versión, vista, esquema de exportación y evidencia de validación. [3]

openBIM es un enfoque de intercambio y colaboración entre plataformas. Su ecosistema incluye IFC, IDS, BCF, bSDD y servicios de validación. IDS 1.0 es un estándar oficial de buildingSMART desde el 1 de junio de 2024 para expresar requisitos de información en forma interpretable por computadora y comprobar datos alfanuméricos de modelos IFC. IDS **no cubre la geometría**, por lo que no reemplaza una revisión geométrica o una detección de interferencias. [4] [5]

En Perú, el Reglamento Nacional de Edificaciones (RNE) es de cumplimiento obligatorio para entidades públicas y para personas naturales o jurídicas privadas que proyecten o ejecuten habilitaciones urbanas y edificaciones en el territorio nacional. El RNE y las normas sectoriales son la referencia de diseño y construcción; una comprobación BIM no demuestra por sí sola el cumplimiento del RNE. [6]

El expediente técnico debe manejarse como un conjunto documental y técnico que cambia según la tipología, sector, entidad y mecanismo de contratación. La pauta oficial del MEF agrupa su contenido básico en **estudios; documentos generales; ingeniería y detalle; presupuesto y cronograma**, e incluye ejemplos como riesgos, topografía, suelos, geología, hidrología, tránsito, ambiente, memoria descriptiva, memoria de cálculo, especificaciones, planos, metrados, costos unitarios, presupuesto y cronogramas. La propia pauta advierte que el listado se sustenta en normativa general y/o sectorial y que la tipología del proyecto agrega documentos. No debe convertirse en una lista universal automática. [7]

### Conclusión operativa

Antes de producir cualquier salida, ARKI debe identificar el país y régimen aplicable, la tipología de inversión, fase y hito, entidad y contrato, requisitos de información, especialidades, formatos, coordenadas, unidades, versión de software y criterios de aceptación. Si faltan esos datos, el motor debe marcar **UNKNOWN**, pedir aclaración y limitarse a una lista de pendientes o a un borrador no certificable. No debe afirmar “cumple RNE”, “cumple ISO 19650”, “IFC válido” o “expediente listo para licitar” sin evidencias y revisión responsable.

## 2. Qué debe entender ARKI por cada bloque

### 2.1 Revit

Revit debe estudiarse como entorno de autoría paramétrica y documental: categorías, familias, tipos e instancias; niveles, ejes, fases, opciones, habitaciones o espacios; vínculos y coordenadas compartidas; worksharing; vistas, plantillas, filtros y tablas; parámetros, unidades y materiales; láminas, detalles, familias cargables y modelos por disciplina. El resultado no es solo un 3D: es un modelo de información cuya geometría, propiedades, vistas y tablas deben poder relacionarse con los entregables requeridos.

ARKI debe diferenciar el archivo nativo de Revit de los contenedores de intercambio. Un RVT puede ser la fuente de autoría de una disciplina, pero el contrato puede exigir IFC, PDF, DWG, XLSX/CSV, imágenes, reportes, modelos federados o formatos de la entidad. No se debe deducir el formato de entrega a partir de la herramienta usada.

### 2.2 Dynamo

Autodesk describe Dynamo for Revit como una interfaz de programación gráfica para personalizar flujos de trabajo BIM; se accede desde la pestaña Manage y usa nodos específicos de Revit. [2] ARKI debe estudiar Dynamo para automatizar tareas repetibles, por ejemplo:

- normalizar nombres, parámetros, unidades y códigos;
- detectar elementos sin datos obligatorios o con valores fuera de catálogo;
- generar revisiones de consistencia, listados y reportes;
- crear o actualizar elementos cuando exista una regla aprobada;
- preparar exportaciones y trazabilidad de versiones.

Dynamo no debe usarse como autoridad autónoma para decidir soluciones de ingeniería, interpretar una norma ambigua, aprobar un expediente o resolver una interferencia sin criterio profesional. Cada grafo debe tener versión de Dynamo/Revit, dependencias, entradas, salidas, alcance, advertencias, logs y una prueba con archivo de muestra. ARKI debe pedir confirmación antes de efectuar escrituras masivas o modificaciones irreversibles.

### 2.3 IFC y openBIM

IFC proporciona descripciones digitales estandarizadas del entorno construido, tiene interpretación por máquina, es neutral respecto del proveedor y se publica como estándar abierto e ISO 16739. [3] Una exportación IFC puede perder o transformar geometría, relaciones, clasificación, cantidades o propiedades; la pérdida no puede inferirse únicamente mirando un visor. Por ello, el flujo correcto exige comparar el requisito con el archivo exportado y registrar una validación.

El estándar no garantiza que dos programas intercambien toda la información de un proyecto. buildingSMART señala que la implementación es específica de versión y vista/MVD. [3] ARKI debe pedir, como mínimo, **IFC2x3 o IFC4/IFC4.3, esquema o MVD, unidades, sistema de coordenadas, origen, clasificación, propiedades, reglas de exportación y herramienta de verificación**.

IDS 1.0 puede expresar y comprobar requisitos alfanuméricos sobre entidades, propiedades, clasificaciones, materiales, cantidades y valores. Su alcance no incluye aspectos geométricos. [4] Por tanto, un gate IFC completo separa:

1. validación sintáctica y estructural del archivo;
2. comprobación IDS de información alfanumérica;
3. revisión geométrica, espacial y de relaciones;
4. coordinación y resolución de incidencias;
5. comprobación documental y contractual.

BCF es un formato/protocolo de comunicación de incidencias de coordinación dentro del ecosistema openBIM, no un detector de colisiones ni un sustituto del expediente. [5]

### 2.4 EIR, BEP y LOIN

ISO 19650-1 establece conceptos y principios para gestionar información usando BIM a lo largo del ciclo de vida del activo, incluyendo intercambio, registro, versionado y organización de la información. [8] El documento es internacional y debe adaptarse al contexto contractual y nacional; no es por sí solo una autorización para usar un entregable en Perú.

La Guía Nacional BIM 2023 del MEF indica que la jerarquía de requisitos parte de OIR y AIR y conduce a PIR/EIR para el proyecto; los requisitos determinan qué datos producir, cuándo, cómo y para quién. [1] En el contexto peruano, ARKI debe pedir los requisitos oficiales o contractuales de la inversión, no “rellenarlos” a partir de un template.

El BEP es la respuesta de ejecución del equipo a los requisitos de información. La guía peruana señala que debe explicar la metodología de ejecución del modelo y puede actualizarse durante diseño y construcción con aprobación de las partes. El MIDP es la lista completa de entregables, responsables y fechas; debe incluir tipo de contenedor, identificación, formato, escala, LOIN, tiempo estimado y plazo. Cada equipo desarrolla su TIDP. [1]

LOIN no equivale automáticamente a LOD. En la definición peruana, LOD se refiere al nivel de detalle gráfico y LOI a información no gráfica; el LOIN combina el nivel de necesidad de información adecuado al propósito del entregable. [1] El motor debe evitar pedir “LOD 300/350/400” como única especificación cuando el contrato requiere geometría, alfanuméricos y documentos con distintos propósitos.

### 2.5 Coordinación e interferencias preventivas

La comprobación de interferencias debe empezar por objetivos, zonas, tolerancias, reglas y responsables. Autodesk muestra el Interference Check de Revit configurando dos listas de categorías del proyecto actual y, en otro ejemplo, comprobando categorías contra un modelo estructural Revit vinculado colocado con coordenadas compartidas. También muestra que algunas incidencias pueden ser múltiples representaciones de una misma condición y que el reporte debe actualizarse después de corregir. [9]

Ese alcance no equivale a una coordinación integral de un modelo federado heterogéneo. La detección de “hard clash” no cubre automáticamente tolerancias de montaje, accesos, mantenimiento, secuencia, zonas de seguridad, reservas, constructibilidad, requisitos contra incendio, desempeño, códigos ni conflictos de datos. ARKI debe etiquetar cada revisión como **geométrica, informacional, normativa, constructiva o de operación**, y no convertir “cero colisiones” en una conclusión de calidad total.

### 2.6 Expediente técnico y entregables por especialidad

Para Perú, la pauta MEF revisada propone verificar el contenido antes de convocar la selección y agrupa el expediente en estudios, generales, ingeniería/detalle y presupuesto/cronograma. [7] Como base de coordinación, ARKI puede mapear cada documento al modelo, pero no sustituirlo:

| Bloque del expediente | Entregables que ARKI puede organizar o revisar | No debe asumir |
|---|---|---|
| Estudios y condiciones previas | topografía, suelos, geología, hidrología, tránsito, riesgos, ambiente, predios/servidumbres, CIRA o monitoreo arqueológico cuando corresponda, panel fotográfico y estudios sectoriales | que todos apliquen a toda tipología; que un modelo sustituya estudios de campo, certificados o aprobaciones |
| Generales | resumen ejecutivo, ficha, memoria descriptiva, memorias de cálculo, especificaciones técnicas, seguridad y salud, documentos administrativos aplicables | que una memoria generada por IA sea cálculo firmado o documento aprobado |
| Arquitectura | planos de ubicación/localización con coordenadas, plantas, cortes, elevaciones, detalles, cuadros, acabados, accesibilidad y metrados según alcance | que Revit valide por sí mismo RNE, licencia, accesibilidad o seguridad |
| Estructuras | modelo y planos estructurales, detalles, memoria y cálculo, especificaciones, metrados y entregables de acero/concreto según diseño | que la detección de interferencias sustituya revisión del ingeniero estructural |
| Instalaciones sanitarias, eléctricas y mecánicas/HVAC | modelos o planos por sistema, esquemas, detalles, equipos, especificaciones, cuadros, cargas, metrados y pruebas según requerimiento | que una exportación IFC conserve toda la lógica de sistemas o que el motor diseñe sin datos y firma responsable |
| Civil, terreno e infraestructura | superficie, ejes, alineamientos, perfiles, secciones, drenaje, pavimentos, estructuras y estudios sectoriales cuando correspondan | que los objetos de edificación sean suficientes para carreteras, saneamiento, riego u otra infraestructura |
| Costos y plazo | metrados, presupuesto, análisis de costos unitarios, gastos generales, insumos, fórmulas polinómicas y cronogramas valorizado, de adquisiciones y de ejecución | que cantidades automáticas sean correctas sin reglas de medición, versión de modelo y revisión contractual |
| Cierre y archivo | modelos nativos y abiertos, PDFs, datos, reportes de validación, incidencias cerradas, versiones, permisos y lecciones aprendidas | que entregar un RVT o IFC sea equivalente a entregar el AIM o la documentación contractual completa |

La matriz es una **estructura de estudio y control**, no una lista universal de requisitos. La guía MEF señala explícitamente que el contenido se apoya en normativa general y/o sectorial y que existen documentos adicionales según tipología. [7]

## 3. Materias curriculares que ARKI debe estudiar

La siguiente propuesta contiene 12 materias. Está alineada con la malla curricular BIM publicada por el MEF, que organiza el aprendizaje en gestión integrada y colaborativa, fundamentos BIM y modelado de información, y propone cursos de conceptos BIM, normativa y estándares, CDE/BEP, documentación por disciplina, herramientas de modelación, costos y planificación. La malla es una propuesta educativa y no debe presentarse como certificación ni como requisito único para ejercer. [10]

1. **Fundamentos BIM, ciclo de vida y usos BIM.** Conceptos, objetivos, usos, fases de inversión, roles, autoría, colaboración y límites entre modelo, documento y decisión.
2. **Gestión de información según ISO 19650 y marco peruano.** OIR, AIR, PIR, EIR, CDE, estados, metadatos, versionado, aprobación, archivo, seguridad y trazabilidad; estudiar NTP-ISO 19650-1:2021 y NTP-ISO 19650-2:2021 solo mediante fuentes INACAL/MEF vigentes.
3. **LOIN y especificación de requisitos.** Geometría, datos alfanuméricos, documentación, propósito, hito, responsabilidad y criterios de aceptación; relación entre LOIN, LOD y LOI.
4. **BEP, MIDP, TIDP y matriz de responsabilidades.** Respuesta a requisitos, estrategia de producción, calendario de entregables, tareas, competencias, software, revisión y aprobación.
5. **Revit arquitectónico y documentación.** Modelo paramétrico, familias, parámetros, fases, vistas, tablas, láminas, plantillas, unidades y control de calidad de documentación.
6. **Revit estructural e ingeniería.** Elementos estructurales, vínculos, coordinación con arquitectura, documentación y límites entre modelado y cálculo estructural especializado.
7. **Revit MEP y sistemas.** Espacios, sistemas sanitarios, eléctricos y mecánicos/HVAC, conectores, rutas, equipos, parámetros, tablas y documentación por especialidad.
8. **Dynamo y automatización segura.** Lógica de grafos, listas, selección, transacciones, Python cuando proceda, lectura/escritura de parámetros, pruebas, logs, gestión de dependencias y revisión antes de cambios masivos.
9. **IFC, openBIM, IDS, BCF y bSDD.** Esquema IFC, entidades, relaciones, propiedades, MVD/vistas, exportación/importación, IDS 1.0, incidencias BCF, diccionarios y validación; incluir casos de pérdida de información.
10. **Coordenadas, georreferenciación y federación.** Sistema de referencia, unidades, origen, norte, coordenadas compartidas, vínculos, modelos federados, tolerancias y control de desplazamientos.
11. **Coordinación multidisciplinaria e interferencias preventivas.** Reglas por zona y especialidad, hard/soft clashes, prioridades, tolerancias, reservas, accesos, mantenimiento, secuencia, revisión visual, issue management y cierre de incidencias.
12. **Expediente técnico, mediciones, costos y planificación.** Estudios previos, memoria, especificaciones, planos, metrados, presupuesto, costos unitarios, cronogramas, entregables por especialidad, vinculación 3D/4D/5D y revisión documental conforme a tipología y sector.

Como complemento transversal, ARKI debe estudiar **RNE y normas sectoriales peruanas**, lectura de contratos y TDR, gestión de riesgos, control de cambios, protección de datos/seguridad de la información, redacción técnica y revisión profesional. La malla MEF recomienda que cada institución defina sus propios indicadores de desempeño; por tanto, no existe evidencia aquí para afirmar que ARKI o su equipo ya los cumple. [10]

## 4. Anclas normativas y de buenas prácticas

### Perú

- **Reglamento Nacional de Edificaciones (RNE).** Norma técnica de cumplimiento obligatorio para proyectos de habilitaciones urbanas y edificaciones en el territorio nacional. Debe revisarse la versión y las normas específicas vigentes para cada proyecto. [6]
- **Plan BIM Perú y Guía Nacional BIM 2023.** Marco nacional para gestionar información de inversiones con BIM. La guía trata usos BIM, LOIN, roles, requisitos, CDE, BEP, MIDP/TIDP y entregables; la página oficial del Plan BIM indica que su uso es obligatorio para entidades y empresas públicas durante la adopción progresiva y referencial para privados. ARKI no debe extender automáticamente esa obligatoriedad a un cliente privado ni a un proyecto fuera del alcance aplicable. [1] [11]
- **Guía Técnica BIM para edificaciones e infraestructura, aprobada por R.D. N.° 0005-2023-EF/63.01.** Orienta a las partes involucradas en la producción colaborativa de información y en los modelos vinculados al ciclo de inversión; la resolución indica aplicación al sector público sujeto al Sistema Nacional de Programación Multianual y Gestión de Inversiones. [12]
- **NTP-ISO 19650-1:2021 y NTP-ISO 19650-2:2021.** La Guía Nacional BIM las identifica como referencias nacionales adaptadas de ISO 19650. El texto íntegro, alcance, estado y eventuales actualizaciones deben verificarse con INACAL y el contrato; **UNKNOWN** para el estado de cualquier otra NTP no revisada en esta investigación. [1] [11]
- **Pautas MEF para expediente técnico.** Lista de verificación oficial de contenido básico y de estudios, generales, ingeniería/detalle, presupuesto y cronograma. Es orientación de control y no reemplaza normativa sectorial ni las bases/TDR del proyecto. [7]
- **RD N.° 0007-2025-EF/63.01 y lineamientos publicados por Plan BIM Perú.** La página oficial lista una resolución con tipologías seleccionadas de adopción obligatoria y lineamientos progresivos. El alcance exacto frente a ARKI, entidad, fecha y proyecto es **UNKNOWN** hasta revisar el texto vigente y la ficha del proyecto. [11]

### Internacionales

- **ISO 19650-1:2018.** Conceptos y principios de gestión de información con BIM durante todo el ciclo de vida; ISO indica que la edición sigue vigente tras revisión de 2024. Es una norma internacional, no una prueba automática de cumplimiento peruano. [8]
- **ISO 19650-2 y UK BIM Framework.** Guía reconocida para procesos de entrega, requisitos, CDE y BEP; el documento consultado es una guía del Reino Unido y no una disposición peruana. [13]
- **ISO 16739-1:2024 / IFC 4.3.2.0.** Estándar abierto y neutral de intercambio de datos del entorno construido; versión, vista/MVD e implementación deben declararse. [3]
- **buildingSMART IDS 1.0.** Especificación computable para requisitos y comprobaciones de información alfanumérica IFC; no comprueba geometría. [4]
- **buildingSMART openBIM, BCF, bSDD y servicio de validación IFC.** Ecosistema de interoperabilidad, diccionarios y gestión de incidencias; debe usarse según el requisito de intercambio y la herramienta disponible. [5]
- **EN 17412-1 / ISO 7817-1.** Referencias internacionales al concepto de nivel de información necesaria. **UNKNOWN** para la edición que deba aplicar a un contrato peruano concreto; no se debe sustituir la NTP, Guía Nacional BIM o TDR aplicables sin confirmación.

## 5. Entradas que el motor ARKI debe pedir

ARKI debe bloquear la generación de una salida certificable si falta una entrada crítica. Debe devolver la entrada faltante como **UNKNOWN** y explicar el impacto.

### Identidad y alcance

- país, región, municipalidad, entidad y régimen contractual;
- tipología y sector: edificación, transporte, saneamiento, salud, educación, agricultura u otra;
- fase del ciclo de inversión y hito de entrega;
- alcance: anteproyecto, diseño, expediente técnico, obra, as-built, operación o mantenimiento;
- TDR, bases, contrato, adendas y criterios de aceptación;
- responsables con competencia profesional y quién aprueba cada especialidad.

### Requisitos de información

- OIR/AIR/PIR/EIR disponibles, o confirmación explícita de que no existen;
- BEP vigente, matriz de responsabilidades, CCA, MIDP y TIDP;
- LOIN por entregable: geometría, propiedades, clasificación, documentación y propósito;
- usos BIM acordados, niveles de revisión y tolerancias;
- nomenclatura, clasificación, codificación, estados, revisiones, permisos y reglas del CDE;
- formato requerido: RVT, IFC, PDF, DWG, XLSX/CSV, BCF u otro; versión y MVD de IFC.

### Datos técnicos de proyecto

- modelos y documentos de entrada por especialidad, fecha y revisión;
- unidades, sistema de coordenadas, datum, georreferenciación, origen, norte y tolerancias;
- topografía, nube de puntos, levantamiento, suelos, geología, hidrología, tránsito y riesgos disponibles;
- programa arquitectónico, criterios de diseño, cargas, sistemas, equipos, materiales, códigos y catálogos aprobados;
- reglas de medición para metrados, partidas, unidades, precios, moneda, fecha base y estructura de presupuesto;
- calendario, WBS, hitos, restricciones, secuencias y vínculos 4D/5D si se requieren;
- requisitos de operación, mantenimiento, activos, garantías y datos de cierre cuando se solicite AIM.

### Herramientas y evidencias

- versiones exactas de Revit, Dynamo, complementos, exportador IFC y validadores;
- archivos nativos, IFC de prueba, manual de exportación y mapa de parámetros;
- dependencias y permisos de cada grafo Dynamo;
- matriz de pruebas, reportes previos, incidencias BCF y decisiones cerradas;
- evidencia de revisión humana, firma o visado requerido; sin ella ARKI solo puede generar borrador o asistencia.

## 6. Gates preventivos que ARKI debe aplicar

Estos gates son controles recomendados de prevención. No deben presentarse como obligaciones legales salvo que el contrato, una norma peruana o una directiva aplicable los convierta en tales.

1. **Gate de jurisdicción y aplicabilidad.** Confirmar país, entidad, tipología, fase, contratación, RNE, normas sectoriales, Guía Nacional BIM y lineamientos aplicables. Si no se confirma, estado **UNKNOWN**.
2. **Gate de requisitos.** No modelar “a nivel 300” por defecto. Aceptar solo después de identificar EIR/PIR/TDR, usos BIM, LOIN, formatos, hitos, responsables y criterios de aceptación.
3. **Gate de datos de emplazamiento.** Verificar coordenadas, unidades, topografía, orientación, datum y calidad de levantamientos. No producir coordenadas “corregidas” sin autorización.
4. **Gate de estructura del proyecto.** Validar nombres, revisiones, códigos, carpetas/estados del CDE, archivos vinculados, unidades y autoría por especialidad antes de federar.
5. **Gate de autoría y especialidad.** Cada elemento crítico debe tener propietario y responsable profesional. ARKI debe separar “elemento modelado”, “cálculo verificado” y “documento aprobado”.
6. **Gate Dynamo.** Ejecutar primero en copia controlada; revisar grafo, dependencias, alcance y log; comparar antes/después; obtener confirmación para escrituras masivas; conservar versión y salida reproducible.
7. **Gate de federación.** Federar por coordenadas compartidas y revisar desplazamientos, duplicados, unidades, niveles, ejes y zonas de análisis. Registrar archivos y revisiones utilizadas.
8. **Gate geométrico preventivo.** Definir pares de categorías, zonas, tolerancias y exclusiones. Ejecutar revisión de hard clashes y, cuando corresponda, holguras, mantenimiento, accesos, reservas y secuencia. No declarar “sin interferencias” si solo se revisó un subconjunto.
9. **Gate informacional.** Ejecutar reglas de parámetros, clasificación, cantidades y valores. Usar IDS cuando el requerimiento IFC sea compatible; registrar aprobados, fallos, ausencias y excepciones. Recordar que IDS no cubre geometría.
10. **Gate de interoperabilidad.** Exportar IFC con versión/MVD declarados, comprobar sintaxis y validación, comparar elementos y propiedades contra el modelo fuente y revisar pérdida de información. Si el contrato exige RVT, DWG, PDF u otros, verificar cada salida por separado.
11. **Gate de coordinación y cierre de incidencias.** Cada issue debe tener ubicación, prioridad, autor, responsable, fecha, estado, decisión y evidencia de cierre. BCF puede transportar la incidencia, pero no prueba que la solución sea correcta.
12. **Gate de expediente técnico.** Usar la lista MEF solo como punto de partida; cruzar estudios, memorias, planos, especificaciones, metrados, presupuesto, cronograma y documentos sectoriales con TDR y normas vigentes. Verificar coherencia entre planos, modelo, cantidades y texto.
13. **Gate de revisión profesional.** Antes de emitir para aprobación, licitación, construcción o firma, requerir revisión de los responsables competentes de arquitectura, estructura, MEP, civil, costos, seguridad y demás especialidades que correspondan.
14. **Gate de publicación y archivo.** Emitir solo la revisión autorizada, con código de estado, fecha, historial, archivos fuente, exportaciones, reportes, incidencias cerradas y limitaciones conocidas. No mezclar WIP, compartido, publicado y archivado.

## 7. Cautelas, límites y UNKNOWN

- **No se verificó el contrato de ARKI, sus clientes, tipologías ni jurisdicciones.** Por ello, ningún entregable de este informe prueba cumplimiento ni define un alcance contractual.
- **No existe una lista universal de entregables por especialidad.** La pauta MEF se adapta a tipología, sector, entidad y normativa; un proyecto de transporte, saneamiento o agricultura puede requerir estudios y modelos distintos de una edificación. [7]
- **La obligatoriedad BIM es contextual.** La documentación oficial distingue el sector público y la adopción progresiva; para un encargo privado o una entidad no comprendida, el alcance es **UNKNOWN** hasta revisar contrato y norma aplicable. [11] [12]
- **RNE no es un motor BIM.** Revit, Dynamo, IFC o un visor no otorgan aprobación, licencia, firma, cálculo ni conformidad normativa. [6]
- **Revit no es IFC.** Una familia, parámetro o sistema de Revit puede no mapearse de forma equivalente al IFC; la única afirmación defendible requiere comparar el archivo y ejecutar validaciones.
- **IDS no es clash detection.** Comprueba información alfanumérica de IFC; no cubre geometría. [4]
- **Interference Check no es coordinación total.** Depende de categorías, modelos, vínculos y reglas elegidas; puede reportar piezas múltiples para una misma condición y no analiza automáticamente constructibilidad o cumplimiento legal. [9]
- **Dynamo no elimina el juicio profesional.** Un grafo puede automatizar una regla incorrecta a gran escala. Debe ejecutarse en copia, con pruebas y revisión humana.
- **Metrados y costos son sensibles a reglas.** Un número extraído del modelo no es defendible sin versión, alcance, fase, parámetros, unidades, filtros, regla de medición y reconciliación con presupuesto.
- **Documentos generados por lenguaje no son memorias de cálculo firmadas.** ARKI puede ayudar a estructurar o revisar, pero no debe atribuir autoría, colegiatura, firma ni aprobación inexistente.
- **Códigos y estándares cambian.** Antes de una emisión se debe reconfirmar la versión vigente del RNE, NTP, Guía Nacional BIM, directivas, lineamientos, formatos MEF, contrato y normas sectoriales.
- **UNKNOWN obligatorio:** si faltan versión de IFC/MVD, sistema de coordenadas, LOIN, TDR, norma sectorial, responsable de especialidad, evidencia de validación o criterio de aceptación, ARKI debe declarar el dato desconocido en vez de inferirlo.

## 8. Fuentes

[1]: https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf "Guía Nacional BIM: Gestión de la información para inversiones desarrolladas con BIM, MEF, versión 2023"
[2]: https://help.autodesk.com/view/RVT/2024/ENU/?guid=RevitDynamo_Dynamo_for_Revit_html "Dynamo for Revit, Autodesk Help"
[3]: https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/ "Industry Foundation Classes (IFC), buildingSMART International"
[4]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-specification-ids/ "Information Delivery Specification (IDS), buildingSMART International"
[5]: https://www.buildingsmart.org/about/openbim/ "openBIM standards and services, buildingSMART International"
[6]: https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne "Reglamento Nacional de Edificaciones, Ministerio de Vivienda, Construcción y Saneamiento"
[7]: https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf "Pautas para elaborar un expediente técnico, MEF"
[8]: https://www.iso.org/standard/68078.html "ISO 19650-1:2018, Organization and digitization of information about buildings and civil engineering works"
[9]: https://www.autodesk.com/learn/ondemand/tutorial/use-interference-checking "Use interference checking, Autodesk Learn"
[10]: https://cdn.www.gob.pe/uploads/document/file/7742800/6546018-rd004_2025ef6301_anexo_malla_curricular_bim.pdf?v=1741399310 "Malla Curricular BIM, Plan BIM Perú / MEF"
[11]: https://www.mef.gob.pe/planbimperu/recursosbim.html "Recursos oficiales del Plan BIM Perú, MEF"
[12]: https://www.mef.gob.pe/es/normatividad-inv-publica/temas/plan-bim-peru/31114-resolucion-directoral-n-0005-2023-ef-63-01-5/file "Resolución Directoral N.° 0005-2023-EF/63.01: Guía Técnica BIM para edificaciones e infraestructura"
[13]: https://ukbimframework.org/wp-content/uploads/2020/05/ISO19650-2Edition4.pdf "Information management according to BS EN ISO 19650, Guidance Part 2: Processes for Project Delivery"

**Nota final:** la fecha de corte y las URL deben volver a verificarse antes de convertir este informe en requisitos de producto, TDR, contrato o declaración de cumplimiento.
