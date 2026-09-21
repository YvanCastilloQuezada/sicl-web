# ARKI — Expediente técnico / proyecto público peruano de hospital

## Conclusión ejecutiva

Para ARKI, un expediente técnico hospitalario peruano debe modelarse como un **conjunto trazable de documentos técnicos, estudios, planos, metrados, presupuesto, cronograma, equipamiento, aprobaciones y anexos**, no como un único archivo ni como un modelo 3D. La guía sectorial del Ministerio de Economía y Finanzas (MEF) organiza el expediente en cuatro bloques: **estudios; aspectos generales; ingeniería y detalle; presupuesto y cronograma**. Para salud, el listado incorpora además arquitectura hospitalaria, evacuación y señalización, estructuras, instalaciones eléctricas y sanitarias, instalaciones electromecánicas, comunicaciones y data, equipamiento, equipamiento médico y media tensión.[1]

La guía debe utilizarse como **estructura de referencia y checklist**, mientras que los Términos de Referencia (TDR), la Norma Técnica de Salud (NTS) aplicable al nivel del establecimiento, el Reglamento Nacional de Edificaciones (RNE), el contrato y las aprobaciones del proyecto determinan el alcance vinculante. La propia guía identifica como referencias sanitarias NTS 113 para primer nivel, NTS 110 para segundo nivel y NTS 119 para tercer nivel; no permite inferir la categoría o nivel de un hospital sin evidencia del proyecto.[1]

Cuando se adopta BIM en la etapa de elaboración del expediente técnico, la Guía Nacional BIM 2023 del MEF contempla una cadena documental explícita: **AIR/PIR → EIR y TDR → BEP → CCA y matriz de responsabilidades → MIDP/TIDP → modelos de información y contenedores en CDE → revisión, aceptación, publicación y archivo**.[2] La salida BIM no es sólo un modelo federado: incluye modelos geométricos, tablas, bases de datos, reportes, planos, documentos y otra información estructurada o no estructurada.[2]

Para costos, ARKI debe mantener separados los valores observados en el mercado, las cotizaciones, los precios de insumos, los análisis de precios unitarios, los metrados, los gastos generales, la utilidad, impuestos, moneda, fecha base, región y fuente. No debe completar un precio ausente con una cifra “razonable”. Un caso de control de la Contraloría en el Hospital de Los Algarrobos mostró que la discordancia entre precios unitarios y cotizaciones, la falta de cotizaciones y la inclusión de partidas sin sustento podía sobreestimar el presupuesto en aproximadamente S/ 700 mil.[8]

## 1. Alcance y jerarquía de evidencia

Este informe se refiere al **expediente técnico o documento equivalente de una inversión pública peruana de infraestructura hospitalaria**, con énfasis en lo reutilizable en ARKI. Se priorizaron documentos oficiales del MEF, MINSA/PCRIS, EsSalud y Contraloría. Un TDR de otro sector se usa sólo para corroborar prácticas de entrega documental y de costos; no se transforma en requisito hospitalario automático.

La jerarquía práctica para registrar un proyecto es la siguiente:

1. **Documentos del proyecto concreto:** TDR, contrato, bases, expediente aprobado, acto resolutivo, adendas, informes de revisión, actas de conformidad y anexos publicados por la entidad.
2. **Normativa sectorial y de inversión:** NTS aplicable, RNE, directivas del MEF, reglamentación de contrataciones y normas ambientales, arqueológicas, de seguridad y de servicios públicos.
3. **Guías oficiales:** la guía MEF de contenidos es una lista de verificación sectorial; la Guía Nacional BIM explica el sistema de gestión de información.
4. **Fuentes de control y académicas:** sirven para identificar errores frecuentes, prácticas de revisión o ejemplos, pero no sustituyen al documento contractual del proyecto.

La publicación PCRIS del MINSA sobre la RIS Ate Vitarte (CUI 2466824) demuestra el patrón de publicación de un proyecto real: la entidad difunde el aviso oficial y enlaza TDR, documentos de diseño y construcción, pliegos y enmiendas.[6] La existencia de una publicación no implica que todos los entregables técnicos finales estén disponibles en la página; ARKI debe registrar el enlace exacto al archivo que realmente leyó.

## 2. Estructura verificable del expediente técnico hospitalario

### 2.1 Estudios y condiciones previas

La sección de salud de la guía MEF exige o verifica, según corresponda al proyecto:

- revisión del perfil de preinversión, incluyendo riesgos, viabilidad y componentes;
- certificado de parámetros urbanísticos y de usos;
- estudio de riesgo ante desastres;
- CIRA o Plan de Monitoreo Arqueológico;
- gestión de riesgos en la ejecución de obra;
- análisis de dimensionamiento de la necesidad, nivel de atención, disponibilidad hídrica y dimensionamiento;
- saneamiento físico-legal del predio, con actas, pases, servidumbres y verificaciones registrales;
- estudio topográfico, con informe, planimetría general y anexos;
- estudio de mecánica de suelos, con memoria descriptiva, memoria de cálculo, planimetría y anexos;
- estudio hidrológico cuando la captación sea por pozos tubulares;
- estudio de tránsito e infraestructura vial existente;
- instrumento ambiental aplicable, como EIA, PAMA o DIA;
- expediente de demolición, diamantinas o reforzamiento cuando se modifique infraestructura previa;
- panel fotográfico.[1]

Estos elementos son campos de **existencia, estado, fecha, emisor, versión, cobertura y enlace**, no sólo nombres de archivos. Un registro ARKI debe distinguir, por ejemplo, “requerido”, “presentado”, “observado”, “subsanado”, “aprobado” y “no aplica”, con sustento documental.

### 2.2 Aspectos generales

El bloque general comprende:

- Formato 08 actualizado conforme a los cambios del expediente técnico;
- resumen ejecutivo;
- ficha técnica con datos relevantes;
- memoria descriptiva;
- memoria de cálculo;
- especificaciones técnicas;
- plan de vigilancia y monitoreo cuando corresponda al instrumento o periodo normativo;
- plan de seguridad y salud en el trabajo.[1]

Toda documentación debe conservar el **responsable, especialidad, firma o validación, fecha y versión**. La guía MEF señala expresamente que la documentación del expediente debe estar suscrita por el profesional responsable de la especialidad correspondiente, de acuerdo con el RNE.[1]

### 2.3 Ingeniería y detalle por especialidad

El bloque hospitalario verificable es el siguiente:

| Especialidad / componente | Entregables que la guía MEF enumera |
|---|---|
| Generales | Planos generales; plano clave de ubicación y localización con coordenadas UTM; plano topográfico; listado de planos por especialidad; listado de equipamiento y equipo mecánico mínimo. |
| Arquitectura, evacuación y señalización | Plano de ubicación/localización; planta general; memoria descriptiva; plantas de distribución; cortes y elevaciones; coberturas; distribución actual si corresponde; detalles de carpintería, pisos y zócalos; cuadro de acabados; especificaciones; hojas resumen y detallada de metrados; detalles generales; obras de arte o estructuras especiales; memoria, plano y especificaciones de evacuación/señalización; plan de contingencia; anexos. |
| Estructuras | Memoria descriptiva; memoria de cálculo; plano general; cimentación; vigas y columnas; losas cuando corresponda; detalles; especificaciones; hoja resumen y hoja detallada de metrados; anexos. |
| Instalaciones eléctricas | Memoria descriptiva y de cálculo; plano general y de detalles; especificaciones; hoja resumen y detallada de metrados; anexos. |
| Instalaciones sanitarias | Memoria descriptiva y de cálculo; plano general y de detalles; especificaciones; hoja resumen y detallada de metrados; anexos; sistema de desagüe/tratamiento; evacuación pluvial. |
| Electromecánicas | Memoria descriptiva y de cálculo; planos de aire acondicionado; planos de gases medicinales; planos electromecánicos; especificaciones; hojas de metrados; anexos. |
| Seguridad | Planos de seguridad y evacuación; plan de seguridad y evacuación; planos de seguridad y señalización. |
| Comunicaciones y data | Memoria descriptiva y de cálculo; planos general y de detalle; especificaciones; hojas resumen y detallada de metrados; anexos. |
| Aire acondicionado | Planos de instalaciones electromecánicas de aire acondicionado. |
| Equipamiento | Memoria descriptiva; listado de equipos por ambiente; plano general; especificaciones técnicas. |
| Equipamiento médico | Memoria descriptiva; listado de equipos por ambiente; plano general de equipamiento; plano general de preinstalación; especificaciones técnicas. |
| Media tensión | Expediente de media tensión e informe de media tensión. |

La guía MEF es particularmente útil para ARKI porque repite un patrón de campos por especialidad: **memoria, cálculo, planos, especificaciones, metrados y anexos**. El patrón no significa que se pueda inventar un plano o una memoria faltante; sólo permite detectar el faltante y solicitar el documento fuente.[1]

Un TDR de supervisión de un hospital especializado de EsSalud en Piura confirma, en un proyecto real, la presencia de Programa Médico Arquitectónico, planos de todas las especialidades y detalles, especificaciones, memorias descriptivas y de cálculo, metrados, presupuestos, maqueta volumétrica y vistas 3D, cronograma de obra, listados y cronograma de equipamiento y planes.[5] El mismo TDR exige evaluación del levantamiento de observaciones por especialidad y trazabilidad hasta la página o plano donde se ubica cada observación.[5]

### 2.4 Presupuesto y cronograma

La guía MEF enumera para salud:

- cuadro de resumen total de presupuesto por especialidades;
- presupuesto desagregado por especialidades;
- presupuesto desagregado por especialidades, según el formato contractual requerido;
- análisis de gastos generales por especialidades;
- análisis de costos unitarios por especialidades;
- resumen de cotizaciones por especialidades;
- planilla de metrados;
- relación de materiales e insumos generales y por grupos, por especialidad;
- fórmulas polinómicas generales y por agrupamiento de especialidades;
- cronograma valorizado de ejecución, calendario de adquisición de materiales, cronograma de avance en MS Project, curva S y cronograma de desembolsos;
- programa de ejecución de obra PERT-CPM;
- anexos.[1]

El TDR oficial del Gobierno Regional de Puno muestra cómo una entrega completa puede exigir planilla general de metrados, sustento de metrados, presupuestos, análisis de precios unitarios, relación de materiales, fórmulas polinómicas, consolidado, resumen, cuadro de desembolsos, calendario valorizado, gastos generales, comparación entre costo del perfil y costo del expediente, presupuesto por especialidad y componente en formatos de software y Excel.[7] Es una evidencia de práctica pública verificable, pero al no ser hospitalaria debe clasificarse como **referencia de entrega**, no como requisito universal.

## 3. Entregables BIM y documentales

### 3.1 Qué entiende el MEF por BIM

La Guía Nacional BIM define BIM como una metodología colaborativa de gestión de información que usa un modelo de información para apoyar la programación, formulación, diseño, construcción, operación y mantenimiento. El modelo integra información gráfica y no gráfica, incluidos presupuestos.[2] Por ello, ARKI no debe reducir “BIM” a “archivo RVT” o “modelo 3D”.

El **PIM** (Project Information Model) corresponde a la información producida en formulación/evaluación y ejecución; la elaboración del expediente técnico se encuentra en esta fase. El **AIM** (Asset Information Model) corresponde a operación y gestión del activo. No debe etiquetarse como AIM un expediente de diseño si el proyecto no entregó información de operación ni existe un AIR que lo requiera.[2]

### 3.2 Cadena de gestión de información para un expediente técnico

Cuando el proyecto aplica BIM durante la elaboración del expediente técnico, los campos y entregables reutilizables son:

1. **AIR — requisitos de información de activos.** Datos del activo, requisitos para mantenimiento, sostenibilidad y operación, documentos normativos internos, códigos de activos, clasificación, métodos de captura de existentes, revisión, aprobación, seguridad, distribución y entrega.[2]
2. **PIR — requisitos de información del proyecto.** CUI, denominación, objetivo, localización, objetivos BIM, equipo, información de referencia, órganos responsables, responsabilidad funcional, plan de trabajo y acciones de gestión de riesgos.[2]
3. **EIR — requisitos de intercambio de información.** Objetivos BIM y usos BIM; listado de documentos de respuesta; requisitos y plazos; seguridad; coordinación entre especialidades; indicadores; normas; atributos de contenedores; LOIN; formatos a intercambiar; recursos informáticos; asignación de funciones; información de referencia; levantamiento de activos existentes y métodos de coordinación.[2]
4. **TDR alineado al EIR.** En contrataciones bajo la Ley de Contrataciones del Estado, el EIR forma parte de los TDR o documento equivalente del servicio.[2]
5. **BEP — Plan de Ejecución BIM.** Descripción del proyecto y responsables; estrategia de desarrollo; estrategia de federación; matriz de responsabilidades; propuestas de normas; métodos y procedimientos; software y plataformas.[2] El BEP puede actualizarse durante diseño y construcción con aprobación de las partes.[3]
6. **CCA — evaluación de competencias y capacidades.** Experiencia, miembros, formación, tecnología disponible y experiencia en los usos BIM exigidos.[2]
7. **Matriz de responsabilidades.** Quién produce, revisa, coordina, aprueba y entrega cada contenedor o requisito.
8. **MIDP — programa general de desarrollo de información.** Lista completa de contenedores, responsable, fecha/hito de entrega, formato, escala, identificación, estado y nivel de información necesaria. Agrupa los TIDP.[2]
9. **TIDP — programa de desarrollo de una tarea.** Entregables de cada equipo o tarea, con formato, fecha y responsabilidades.[2]
10. **CDE — Entorno Común de Datos.** Fuente acordada para colección, gestión y difusión de contenedores. Debe conservar estados, versiones, revisiones, permisos y trazabilidad.[2]
11. **Modelos y contenedores.** PIM con modelos de arquitectura, estructuras, MEP, equipamiento y otros modelos requeridos; modelo federado; tablas, reportes, planos, documentos, bases de datos y archivos abiertos cuando sean exigidos.
12. **Revisión y aceptación.** Control de calidad; revisión contra EIR, MIDP, TIDP y LOIN; coordinación de interferencias; observaciones; subsanaciones; transición a estado Publicado; aceptación y autorización por la entidad.[2]
13. **Cierre.** Archivo de contenedores aprobados y lecciones aprendidas.[2]

La Guía Nacional BIM identifica el **LOIN** como combinación de nivel de detalle gráfico (LOD), nivel de información alfanumérica (LOI) y documentación asociada. Un LOIN no debe inferirse por costumbre: debe responder a objetivos y requisitos del proyecto. Por ejemplo, una barra puede requerir poca geometría pero más información para cuantificación y costo.[2]

### 3.3 Formatos y usos BIM que pueden registrarse

Los usos BIM sólo deben registrarse cuando estén definidos en EIR/TDR, BEP o contrato. Entre los usos observados en recursos oficiales se encuentran visualización, coordinación, detección de interferencias, revisión de diseño, generación de planos, extracción/verificación de cantidades, control de avance y apoyo a costos/programación.[4]

El instructivo oficial del Formato BEP muestra entregables en PDF/DOC, DWG/PDF, hojas de cálculo, imágenes y modelos RVT/IFC en un ejemplo de equipo de diseño; esos formatos son **ejemplo de respuesta y no una obligación automática para todo hospital**.[3] ARKI debe guardar el formato efectivamente solicitado en el EIR/TDR y separar:

- formato de autoría o nativo, por ejemplo RVT, si fue requerido;
- formato de intercambio abierto, por ejemplo IFC, si fue requerido o acordado;
- PDF de emisión y planos/documentos firmados;
- tablas de cuantificación, hojas de cálculo y reportes;
- evidencias de coordinación: informes, incidencias, actas, BCF u otro formato sólo si el proyecto lo exige;
- versión, revisión, estado CDE, fecha, autor, revisor y aprobador.

## 4. Campos reutilizables en ARKI

### 4.1 Identidad del proyecto y control documental

| Campo | Regla de reutilización |
|---|---|
| `project_id` / CUI | Copiar exactamente de Formato 08, PIR, EIR o ficha oficial; no construir un código alternativo. |
| `project_name` | Mantener denominación oficial completa y una etiqueta corta separada. |
| `entity`, `UEI`, `UF`, `OPMI`, `UEP` | Registrar nombre, código y fuente de cada órgano. |
| `location` | Registrar departamento, provincia, distrito, dirección y coordenadas sólo cuando estén publicados. |
| `health_level` / categoría | Sólo si consta en NTS aplicable, ficha, TDR o acto aprobado. |
| `document_id`, `title`, `discipline`, `document_type` | Identificar cada contenedor, no sólo el expediente completo. |
| `version`, `revision`, `status` | Usar estado documental fuente: borrador, revisión, observado, subsanado, publicado, aprobado u otro. |
| `issue_date`, `approval_date`, `approval_act` | Separar fecha de emisión de fecha de aprobación y guardar resolución/acta. |
| `author`, `specialty`, `reviewer`, `approver` | Registrar personas, cargo, colegiatura o firma sólo cuando figure en la fuente. |
| `source_url`, `source_file`, `page_reference` | Enlazar URL estable y página/sección; guardar copia o hash cuando sea posible. |
| `applicability`, `evidence_status`, `unknown_reason` | Distinguir confirmado, inferido por guía, no encontrado, no aplica y pendiente de verificación. |

### 4.2 Estructura técnica y BIM

| Campo | Descripción |
|---|---|
| `discipline` | Arquitectura, estructuras, eléctricas, sanitarias, electromecánicas, gases medicinales, comunicaciones/data, seguridad, equipamiento, equipamiento médico, media tensión u otra. |
| `deliverable_family` | Memoria, cálculo, plano, especificación, metrado, presupuesto, estudio, cronograma, modelo, reporte, acta o anexo. |
| `container_id` | Identificador conforme al estándar de información del proyecto; no inventar si no existe. |
| `model_type` | PIM, AIM, modelo de especialidad, modelo federado u otro; respaldar con el documento BIM. |
| `file_format` | RVT, IFC, DWG, PDF, XLS/XLSX, DOC/DOCX, imagen, base de datos u otro sólo si consta. |
| `open_format` | Booleano o clasificación que refleje si el formato es abierto; no asumir que todo IFC fue entregado. |
| `LOIN`, `LOD`, `LOI` | Registrar el nivel exigido y su fuente; no convertir automáticamente un LOD comercial en LOIN. |
| `BIM_use` | Uso BIM específico y fuente EIR/TDR/BEP. |
| `CDE_path`, `CDE_state`, `revision`, `security_level` | Ruta, estado, revisión y acceso conforme al CDE. |
| `responsible_party`, `task_team`, `reviewer`, `approver` | Roles y responsables; diferenciar autoría técnica de roles BIM. |
| `delivery_milestone`, `planned_date`, `actual_date` | Hito MIDP/TIDP y fechas real/planificada. |
| `coordination_status`, `clash_count`, `open_issues`, `closed_issues` | Sólo con reporte de coordinación verificable; no generar conteos por estimación. |
| `quantity_source` | Modelo BIM, planilla de metrados, plano, medición de campo u otra fuente. |
| `asset_id`, `room_id`, `system_id`, `manufacturer`, `maintenance_data` | Sólo cuando estén en AIR/PIR, modelo, ficha o documentación de fabricante. |

### 4.3 Reglas para no inventar

ARKI debe mostrar el valor **“no encontrado en la fuente”** o **“pendiente de verificación”** cuando no exista evidencia. No debe completar categoría hospitalaria, área construida, número de camas, programa médico arquitectónico, especialidades, cantidades, metrajes, costos, cronograma, nivel LOD/LOI/LOIN, formatos BIM, responsables, aprobación, coordenadas o desempeño de equipos a partir de un patrón de otros proyectos.

Tampoco debe convertir una recomendación de la guía en obligación contractual. Por ejemplo, el TDR de EsSalud Piura menciona maqueta volumétrica, vistas 3D, equipamiento y Programa Médico Arquitectónico, pero esa evidencia no demuestra que esos entregables formen parte de cualquier hospital peruano.[5] La guía MEF sí sirve para identificar que deben verificarse planos, memorias, especificaciones, metrados y equipamiento en un expediente de salud, pero el proyecto concreto puede ampliar, adaptar o excluir componentes con sustento normativo.

## 5. Esquema de costos verificable

### 5.1 Separación obligatoria de conceptos

| Campo de costo | Qué representa | Evidencia mínima |
|---|---|---|
| `observed_price` | Precio observado en una fuente de mercado, compra, contrato o catálogo. | Documento, fecha de consulta/emisión, proveedor o entidad, lugar, unidad y condición comercial. |
| `unit_price_input` | Precio unitario del insumo utilizado en un APU. | APU o presupuesto y vínculo a cotización/base/estudio de mercado. |
| `unit_price_item` | Precio unitario de una partida de obra. | APU de la partida, unidad, rendimiento, cuadrilla/equipo/materiales y fecha base. |
| `quantity` / `measurement` | Cantidad o metrado. | Planilla y sustento por plano, modelo, memoria o medición. |
| `quote` | Cotización específica, no equivalente automáticamente a precio adoptado. | Cotización íntegra, emisor, fecha, vigencia, alcance, marca/modelo, entrega y condiciones. |
| `market_study` | Estudio de mercado que compara fuentes y justifica la selección. | Informe o cuadro de cotizaciones y metodología. |
| `price_date` / `base_date` | Fecha del precio observado y fecha base del presupuesto. | Encabezado del APU/presupuesto, cotización o documento de actualización. |
| `region` / `locality` | Región o localidad a la que se refiere el precio. | Cotización, proveedor, obra, transporte y fuente. |
| `currency` | Moneda del valor. | Documento fuente; registrar PEN, USD u otra sin conversión silenciosa. |
| `tax_status` | Incluye IGV, excluye IGV, exonerado, no informado u otro. | Cotización, presupuesto, APU o regla contractual. |
| `transport`, `freight`, `installation` | Componentes logísticos o de instalación. | Cotización o análisis específico; no incorporarlos por porcentaje genérico sin sustento. |
| `direct_cost` | Costo directo de partida o especialidad. | Presupuesto y suma de APU. |
| `general_expenses` | Gastos generales, desagregados y por especialidad si corresponde. | Análisis de gastos generales. |
| `profit` | Utilidad. | Presupuesto/TDR/criterio contractual aplicable. |
| `tax_amount` | Monto de impuestos, si se calcula. | Base imponible y tasa aplicable de la fuente o contrato. |
| `total_budget` | Total del presupuesto, con desglose de componentes. | Cuadro resumen, presupuesto desagregado y acto/versión. |
| `price_source_type` | Cotización, estudio de mercado, base institucional, contrato, catálogo, observación de campo u otro. | Fuente primaria enlazada. |
| `source_url`, `source_page`, `source_file` | Trazabilidad. | URL y ubicación exacta. |
| `confidence` / `support_status` | Soportado, parcial, inconsistente, no soportado. | Regla de validación y evidencia. |

### 5.2 Reglas de cálculo y presentación

- No mezclar un precio observado con un precio unitario adoptado. Registrar ambos y la decisión que los conecta.
- No convertir USD a soles ni aplicar IGV si la fuente no declara la tasa, la moneda o el criterio de conversión. Si el presupuesto está en soles y la cotización en dólares, conservar el original y registrar por separado tipo de cambio, fecha y fuente del tipo de cambio cuando el expediente lo documente.
- No atribuir una cotización de Lima a una obra de otra región sin registrar transporte, disponibilidad, fecha y condición de entrega.
- No reutilizar un precio antiguo como vigente sin indicar fecha y método de actualización.
- Los metrados deben enlazar a su planilla y sustento. Un número tomado de un modelo BIM no reemplaza automáticamente la planilla aprobada.
- Los APU deben conservar partida, unidad, rendimiento, mano de obra, materiales, equipos, desperdicio si aplica, precio de cada recurso, subtotal y fecha base.
- Las fórmulas polinómicas deben quedar como entregable independiente y no reconstruirse a partir del total si faltan índices o agrupamientos.
- La moneda y el tratamiento tributario deben mantenerse por cada registro de precio; el total puede tener un resumen separado.

### 5.3 Evidencia de fallas que el sistema debe detectar

La Contraloría reportó en 2025, para el expediente técnico del saldo del Hospital de Los Algarrobos, inconsistencias entre precios unitarios y cotizaciones de mercado; omisiones de equipos e instalaciones; ausencia de detalles técnicos; partidas sin sustento; falta de cotizaciones de insumos; y precios de movilización, desmovilización y transporte sin estudio de mercado visible.[8] ARKI debe convertir esos hallazgos en validaciones:

1. cada recurso de APU debe poder rastrearse a una fuente o quedar marcado como no sustentado;
2. el precio adoptado debe ser comparable con la cotización registrada;
3. cada partida debe tener unidad, metrado, APU y sustento;
4. equipos e instalaciones del alcance deben cruzarse con planos, especificaciones, listados y presupuesto;
5. el sistema debe señalar cambios de fecha, región, moneda, IGV o alcance entre cotización y presupuesto;
6. una partida sin detalle técnico debe generar una observación, no una descripción inventada.

## 6. Entregables documentales sugeridos para el bloque ARKI

La ficha de un proyecto debería permitir navegar, como mínimo, por estas carpetas lógicas:

1. **Identificación y preinversión:** CUI, ficha/perfil, viabilidad, Formato 08, objetivos, componentes, nivel/categoría y localización.
2. **Predio y estudios:** saneamiento físico-legal, parámetros, topografía, suelos, riesgos, tránsito, hidrología, ambiente, arqueología, demolición y fotos.
3. **Expediente técnico general:** resumen, ficha, memoria descriptiva, memorias de cálculo, especificaciones, seguridad y anexos.
4. **Especialidades:** arquitectura; evacuación/señalización; estructuras; eléctricas; sanitarias; electromecánicas; aire acondicionado; gases medicinales; comunicaciones/data; seguridad; media tensión.
5. **Equipamiento:** equipamiento general, equipamiento médico, preinstalaciones, fichas, listados por ambiente y especificaciones.
6. **Cantidades y costos:** metrados y sustento, APU, insumos, cotizaciones, estudio de mercado, gastos generales, utilidad, impuestos, fórmulas polinómicas y cuadros resumen.
7. **Programación:** cronograma valorizado, adquisición, MS Project, curva S, desembolsos y PERT-CPM.
8. **BIM:** OIR/AIR/PIR cuando correspondan, EIR, TDR, BEP, CCA, matriz, MIDP, TIDP, modelos, federado, CDE, reportes de interferencias, incidencias y actas de revisión.
9. **Aprobación y cambios:** observaciones, respuestas, versiones, informes de revisión, conformidad, acto resolutivo, adendas, expediente de subsanación y archivo final.

## 7. Unknowns y límites que deben quedar visibles

- La guía MEF no identifica un hospital único ni sustituye el TDR o contrato del proyecto concreto.
- No se debe elegir entre NTS 110, 113 o 119 sin conocer el nivel de atención y la evidencia del establecimiento.
- La disponibilidad de modelos RVT, IFC, DWG, hojas de cálculo o CDE no puede inferirse de que un proyecto diga “BIM”; debe verificarse en EIR, BEP, TDR o archivos publicados.
- La guía MEF no fija un LOD/LOI/LOIN universal para hospitales. El LOIN es específico a los objetivos y requisitos del intercambio.
- No se puede asumir que un Programa Médico Arquitectónico, maqueta, vistas 3D, gases medicinales, media tensión, sistemas especiales o equipamiento estén incluidos si el documento del proyecto no los menciona o la normativa aplicable no los exige.
- No se puede recuperar un precio actual a partir de una cotización histórica sin fecha, región, moneda, impuestos y método de actualización.
- Una cifra de resumen no valida por sí sola metrados, APU, cotizaciones o consistencia entre planos y presupuesto.
- La Guía Nacional BIM es una guía de orientación; las obligaciones del proyecto dependen de la adopción normativa, TDR, contrato y documentos aprobados.
- El TDR de Puno prueba una práctica pública de entregables y soportes de costo, pero no constituye requisito hospitalario.
- Los documentos oficiales pueden tener enlaces temporales, versiones o anexos no visibles en la página principal; ARKI debe registrar URL, nombre de archivo, fecha de acceso y página leída.

## 8. Fuentes consultadas

[1] [MEF, Pautas y recomendaciones para la elaboración de Expedientes Técnicos — sectores Educación, Salud, Transporte, Agua y Saneamiento y Agricultura](https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf) "Pautas y recomendaciones para la elaboración de Expedientes Técnicos"

[2] [MEF, Guía Nacional BIM — Gestión de la información para inversiones desarrolladas con BIM, versión 2023](https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf) "Guía Nacional BIM: Gestión de la información para inversiones desarrolladas con BIM"

[3] [MEF, Instructivo del Formato N.º 05: Registro del Plan de Ejecución BIM — BEP](https://www.mef.gob.pe/contenidos/inv_publica/anexos/instructivo_formato5_RD0005_2021EF6301.pdf) "Instructivo del Formato N.º 05: Registro del Plan de Ejecución BIM - BEP"

[4] [MEF, Usos BIM: casos de éxito nacionales e internacionales](https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/usos_BIM_casos_de_exito.pdf) "Usos BIM: Casos de éxito nacionales e internacionales"

[5] [EsSalud, TDR 2023 para supervisión de diseño, construcción y equipamiento del Hospital Especializado de la Red Asistencial Piura](https://www.essalud.gob.pe/wp-content/uploads/TDR_2023_Piura.pdf) "Términos de Referencia de supervisión de diseño, construcción y equipamiento — Piura"

[6] [PCRIS/MINSA, convocatoria del proyecto RIS Ate Vitarte, CUI 2466824](https://www.gob.pe/institucion/pcris/informes-publicaciones/6014365-elaboracion-del-diseno-expediente-tecnico-y-construccion-ejecucion-de-las-obras-del-proyecto-de-inversion-publica-denominado-mejoramiento-y-ampliacion-de-los-servicios-de-salud-del-primer-nivel-de-atencion-de-la-red-integrada-de-salu) "Elaboración del diseño (expediente técnico) y construcción de la RIS Ate Vitarte"

[7] [MEF/Gobierno Regional de Puno, TDR para elaboración de expediente técnico](https://www.mef.gob.pe/contenidos/conv/TDR_PUNO_P005.pdf) "Términos de Referencia para elaboración de expediente técnico"

[8] [Contraloría General de la República, advertencia sobre inconsistencias en el expediente técnico para saldo del Hospital de Los Algarrobos](https://www.gob.pe/institucion/contraloria/noticias/1219065-advierten-inconsistencias-en-parte-del-expediente-tecnico-para-saldo-de-obra-del-hospital-de-los-algarrobos) "Advierten inconsistencias en parte del expediente técnico para saldo de obra del hospital de Los Algarrobos"

## Nota de trazabilidad

Las afirmaciones de estructura hospitalaria proceden de la sección “Salud” de la guía MEF, especialmente sus apartados 2.1 a 2.4. Las afirmaciones BIM proceden de la Guía Nacional BIM 2023 y del instructivo BEP. Los ejemplos de hospital concreto proceden del TDR de EsSalud Piura y de la publicación PCRIS/MINSA. Los campos de costos y las validaciones de control se apoyan en la lista presupuestal de la guía MEF, el TDR público de Puno y el hallazgo publicado por Contraloría. Ningún valor monetario se presenta aquí como precio reutilizable: los ejemplos monetarios de la fuente de Contraloría son hallazgos históricos del caso citado, no una estimación para ARKI.

**Autor:** Manus AI  
**Archivo:** `/home/ubuntu/sicl-web/docs/arki-research/workflow-hospital.md`
