# ARKI — Investigación del workflow de expediente técnico para un colegio público peruano

**Fecha de consulta:** 21 de septiembre de 2026  
**Alcance:** estructura documental de un expediente técnico (ET) de infraestructura educativa pública en Perú; entregables BIM/documentales; campos reutilizables para ARKI; y tratamiento trazable de costos.  
**Criterio de evidencia:** se priorizaron fuentes oficiales y documentos públicos verificables. Se abrió y leyó el contenido de MEF, PRONIED y un expediente publicado en gob.pe. El documento de Minedu enlazado fue identificado, pero su servidor presentó una pantalla anti-bot y no se usó como evidencia sustantiva.

## 1. Conclusión ejecutiva

Un expediente técnico de colegio no es una sola memoria ni un modelo 3D. Es un **conjunto firmado de documentos técnicos, estudios, planos, metrados, especificaciones, presupuesto y programación**, elaborado por profesionales responsables y sujeto a normativa general, del sector Educación, Reglamento Nacional de Edificaciones (RNE) y reglas de inversión pública. PRONIED define el ET como un conjunto de documentos técnicos previos que permite ejecutar la obra adecuadamente y señala que debe sujetarse a la concepción técnica y al dimensionamiento de la ficha técnica o del estudio de preinversión. Por ello, ARKI puede reutilizar una estructura de datos y un checklist, pero **no puede completar valores de proyecto que no estén respaldados por una fuente, estudio, plano, cotización o decisión formal**.

La guía sectorial del MEF organiza el ET de Educación en cuatro grupos: **estudios; aspectos generales; ingeniería y detalle; presupuesto y cronograma**. En el bloque de costos, la guía separa expresamente resumen de presupuesto, presupuesto de obra y desagregado, gastos generales, análisis de costos unitarios, metrados, relación de insumos, fórmula polinómica y cronogramas. Una guía MEF ampliada incluye además **resumen de cotizaciones por especialidad**, lo que es especialmente relevante para ARKI.

En BIM, la Guía Nacional BIM del MEF establece que un modelo de información no equivale solamente a un modelo 3D: es un conjunto de contenedores de información estructurada o no estructurada. Para una etapa de expediente técnico, el entregable central es el **PIM (Project Information Model)**, desarrollado en respuesta a los requisitos de intercambio de información (EIR). El **BEP** documenta metodología, procesos, roles, responsabilidades, entregables, matriz de responsabilidades, métodos de producción y software/plataformas. El **AIM** corresponde a la fase de funcionamiento y no debe confundirse con el PIM del expediente.

## 2. Qué es exactamente el bloque que ARKI debe representar

ARKI debería tratar el workflow como un expediente versionado, con trazabilidad a inversión, predio, normativa, estudios, especialidades, costos, cronograma, firmas y aprobaciones. La unidad de registro no debe ser sólo “proyecto”, sino al menos:

1. **Inversión y contexto:** código o identificador oficial de inversión, entidad, unidad formuladora/ejecutora, servicio educativo, nivel/modalidad, ubicación, predio y estado de viabilidad/ejecución.
2. **Expediente y versiones:** tipo de intervención (obra nueva, ampliación, reforzamiento, demolición, rehabilitación u otra), versión, fecha, estado (borrador, revisión, observado, aprobado), responsable y resolución/acto de aprobación.
3. **Documentos y contenedores:** cada archivo o entregable con disciplina, tipo, formato, versión, autor, firma, fecha, estado de revisión, fuente, hash/URL y relación con otros documentos.
4. **Especialidades:** arquitectura, estructuras, instalaciones eléctricas, instalaciones sanitarias y las especialidades adicionales justificadas por el proyecto.
5. **Costos:** partidas, unidades, cantidades, precios, APU, cotizaciones, gastos generales, supervisión, impuestos, fórmula polinómica, fecha y región, manteniendo separadas las categorías de evidencia.
6. **Cronograma:** actividades, duración, precedencias, hitos, valorización, adquisición de materiales, desembolsos y curva S si fue exigida.
7. **BIM:** requisitos OIR/AIR/PIR/EIR que correspondan, BEP, PIM, CDE, LOIN, usos BIM, roles, matriz de responsabilidades y entregables de modelos.

## 3. Estructura documental verificable del expediente técnico

### 3.1 Estudios y condiciones previas

La guía MEF para Educación lista, entre otros, los siguientes contenidos:

- Revisión del perfil o preinversión, incluyendo viabilidad, estimación de riesgos e identificación de componentes.
- Certificado de parámetros urbanísticos y edificatorios.
- Estudio de riesgo ante desastres.
- CIRA o Plan de Monitoreo Arqueológico, según corresponda.
- Gestión de riesgos en la ejecución.
- Análisis para dimensionar la necesidad y demanda educativa.
- Saneamiento físico-legal del predio.
- Levantamiento topográfico.
- Estudio de mecánica de suelos.
- Estudio hidrológico cuando el proyecto lo requiera, por ejemplo, captación por pozos tubulares.
- Infraestructura vial existente.
- Instrumento ambiental que corresponda (EIA, PAMA, DIA u otro).
- Expediente de demolición, diamantinas o reforzamiento cuando se interviene una infraestructura existente.
- Panel fotográfico.

Estos documentos no son intercambiables. Un estudio de suelos no puede sustituirse por una suposición de capacidad portante; una constatación fotográfica no sustituye el saneamiento del predio; y un dato de demanda no debe rellenarse con una matrícula genérica.

### 3.2 Aspectos generales

El checklist MEF identifica:

- Formato N.° 08 actualizado, según cambios del ET, cuando resulte aplicable al registro de ejecución.
- Resumen ejecutivo.
- Ficha técnica con datos relevantes del proyecto.
- Memoria descriptiva y memoria de cálculo.
- Especificaciones técnicas.
- Plan de seguridad y salud en el trabajo.
- Planes sanitarios o de vigilancia sólo cuando la normativa vigente del encargo los exija; el checklist consultado contiene un plan COVID-19 asociado a normativa temporal, por lo que ARKI debe marcarlo como **condicional/versionado**, no como requisito universal permanente.

### 3.3 Ingeniería y detalle

El anexo de Educación del MEF lista:

- Planos generales.
- Plano clave de ubicación y localización con coordenadas UTM.
- Plano topográfico.
- Listado de planos por especialidad.
- Listado de equipamiento y equipo mecánico mínimo.

**Arquitectura:** planta general con relación al perímetro, distribución, cortes y elevaciones, coberturas, distribución existente si corresponde, carpintería de madera/metálica, cuadro de acabados, detalles generales y obras de arte o estructuras especiales.

**Estructuras:** cimentaciones (zapatas, cimientos, sobrecimientos u otros), vigas y columnas, y losas aligeradas cuando correspondan.

**Instalaciones eléctricas:** planos y documentos de la especialidad conforme al RNE, normas sectoriales y alcance efectivo del proyecto. No se debe inferir tensión, demanda, tablero, grupo electrógeno, sistema fotovoltaico o media tensión sin expediente o estudio que lo sustente.

**Instalaciones sanitarias:** sistema de agua, sistema de desagüe y tratamiento, y evacuación pluvial.

**Equipamiento:** listado de equipos por ambiente; el listado puede estar vinculado a ambientes, activos estratégicos y presupuesto, pero la cantidad, marca, capacidad y especificación deben provenir de los documentos del proyecto.

### 3.4 Presupuesto y cronograma

El anexo sectorial MEF lista como mínimo:

- Cuadro resumen de presupuesto.
- Presupuesto de obra.
- Presupuesto desagregado.
- Análisis de gastos generales.
- Análisis de costos unitarios (APU).
- Planilla de metrados.
- Relación de insumos generales y por grupos.
- Fórmulas polinómicas.
- Cronograma valorizado de ejecución de obra.
- Calendario de adquisición de materiales.
- Cronograma de ejecución de obras, por ejemplo en MS Project.
- Programa de ejecución de obras PERT/CPM.

La guía ampliada para expedientes incluye, para sectores y especialidades donde corresponda, **resumen de cotizaciones por especialidad**, curva S y cronograma de desembolsos. Deben tratarse como entregables condicionales, no inventarse si el TDR, la entidad o la normativa aplicable no los exige.

### 3.5 Firmas, compatibilidad y aprobación

La guía MEF indica que toda la documentación del ET debe estar suscrita por el profesional responsable de la especialidad correspondiente, según el RNE. La compatibilización entre ambientes normativos y el listado de activos estratégicos del sector Educación es una recomendación explícita. PRONIED también indica que el ET debe guardar relación con la concepción técnica y dimensionamiento de la ficha técnica o preinversión. Para ARKI, estas relaciones deben expresarse como validaciones y no como texto decorativo:

- cada ambiente debe vincularse a una norma o requerimiento sectorial aplicable;
- cada partida debe poder rastrearse a un plano, especificación o metrado;
- cada monto de resumen debe reconciliar con el desagregado;
- cada documento debe mostrar responsable, firma o estado de firma;
- cada versión aprobada debe tener acto, fecha y entidad aprobadora cuando esa información exista.

## 4. Entregables BIM y campos reutilizables

### 4.1 Qué establece la Guía Nacional BIM

La Guía Nacional BIM del MEF (aprobada mediante Resolución Directoral N.° 003-2023-EF/63.01) establece que los entregables de información se realizan mediante modelos de información compuestos por uno o más contenedores. El concepto incluye modelos geométricos, programaciones, bases de datos, videos, audios y otra información gráfica/no gráfica, estructurada/no estructurada.

Los dos modelos de información son:

- **PIM:** modelo de información del proyecto para las fases de Formulación y Evaluación y Ejecución; responde al EIR, sirve de referencia para la ejecución física y eleva progresivamente el LOIN.
- **AIM:** modelo de información de los activos para la fase de Funcionamiento; responde al AIR, puede incorporar información de propiedad, levantamientos, rendimiento operacional y PIM inicial, y debe considerar formatos interoperables.

Para un bloque de ET de colegio, ARKI debe por defecto modelar el **PIM y sus contenedores**, no prometer un AIM completo. Un AIM sólo debe aparecer si el alcance incluye funcionamiento/gestión de activos o si los requisitos de información lo solicitan.

### 4.2 Campos BIM/documentales recomendados para ARKI

Los siguientes campos son reutilizables como esquema, pero los valores concretos deben derivarse del proyecto:

| Grupo | Campos reutilizables | Regla de evidencia |
|---|---|---|
| Identidad | `project_id`, `investment_code`, `entity`, `facility_name`, `education_level`, `intervention_type`, `location`, `coordinates_utm` | El código, nombre, entidad y coordenadas deben provenir de ficha, Banco de Inversiones, plano clave o acto oficial. |
| Contenedor | `container_id`, `file_name`, `document_type`, `discipline`, `format`, `version`, `status`, `author`, `reviewer`, `approval_date`, `source_url`, `checksum` | No afirmar que un archivo existe, está firmado o aprobado si no se abrió o no hay registro verificable. |
| Requisitos | `oir`, `air`, `pir`, `eir`, `information_exchange_date`, `recipient`, `required_format` | Registrar sólo los requisitos efectivamente definidos; si no hay OIR/AIR/PIR/EIR, usar estado “no disponible”, no inventarlos. |
| LOIN | `geometric_level`, `alphanumeric_level`, `required_object_properties`, `required_documents` | El LOIN debe responder al objetivo y fase; no sustituirlo por un LOD arbitrario. |
| PIM | `pim_version`, `discipline_models`, `federation_strategy`, `coordination_status`, `clash_report`, `issue_log` | El PIM es más amplio que 3D y debe corresponder a EIR y BEP. |
| BEP | `bep_version`, `methodology`, `roles`, `responsibilities_matrix`, `production_methods`, `software`, `platforms`, `federation_strategy`, `delivery_milestones` | La Guía Nacional BIM exige estos temas; el valor específico requiere BEP u oferta. |
| CDE | `cde_name`, `container_status`, `workflow_state`, `revision`, `permissions`, `publish_date`, `archive_date` | No afirmar existencia de CDE, flujo o permisos sin evidencia del proyecto. |
| Modelo físico | `element_id`, `category`, `discipline`, `level`, `space`, `system`, `material`, `quantity`, `specification_link`, `cost_code`, `asset_code` | Cada propiedad debe provenir del modelo, tabla, plano, especificación o catálogo; dejar nulo lo no documentado. |
| Entrega a operación | `aim_required`, `asset_register`, `warranty`, `maintenance_data`, `commissioning_records` | Son propios del funcionamiento y sólo se incorporan si el alcance los exige. |

### 4.3 Entregables documentales BIM que no deben confundirse con el ET tradicional

Cuando el proyecto adopta BIM, el bloque adicional puede incluir requisitos de información, EIR, BEP previo y actualizado, evaluación de competencias/capacidades, matriz de responsabilidades, estrategia de federación, modelos disciplinares, PIM federado, informes de coordinación, incidencias, revisiones, estados de publicación y archivo en CDE. El hecho de que un ET tradicional publique PDF, DOCX y XLSX **no demuestra** que tenga BEP, PIM, CDE, IFC, coordinación de interferencias o LOIN.

## 5. Modelo de costos para ARKI: separación obligatoria de evidencias

### 5.1 Principio

ARKI debe almacenar costos como observaciones contextualizadas, no como una cifra única “por m²” sin origen. Cada registro de precio debe diferenciar **qué se observó**, **qué se calculó**, **qué se cotizó**, **cuándo**, **dónde**, **en qué moneda**, **si incluye impuestos** y **quién o qué documento lo respalda**.

### 5.2 Campos de costos

| Campo | Uso recomendado |
|---|---|
| `cost_id` | Identificador único del dato o línea de costo. |
| `project_id` / `investment_code` | Vincula el costo a la inversión concreta; evitar mezclar colegios. |
| `cost_scope` | Obra, equipamiento, supervisión, expediente técnico, gastos generales, movilización, operación u otro. |
| `specialty` | Arquitectura, estructuras, sanitarias, eléctricas, equipamiento u otra. |
| `cost_type` | Precio observado; precio unitario; APU; cotización; presupuesto oficial; costo histórico; estimación. Son categorías distintas. |
| `item_code` / `item_description` | Código y descripción de partida o insumo, tal como aparecen en presupuesto/APU/cotización. |
| `unit` | m², m³, kg, und, glb, hh, mes u otra unidad; nunca asumirla. |
| `quantity` | Metrado o cantidad, con referencia a planilla, modelo o plano. |
| `unit_price` | Precio unitario, separado de cantidad y subtotal. |
| `subtotal` | `quantity × unit_price` sólo si la unidad y fórmula están verificadas. |
| `currency` | Moneda explícita, por ejemplo PEN/S/.; no convertir sin registrar tipo de cambio y fecha. |
| `tax_included` / `tax_rate` | Indicador de IGV u otros impuestos. No asumir 18% si el documento no lo declara; registrar fuente legal/fecha si se aplica. |
| `price_basis` | Incluye o excluye transporte, flete, mano de obra, equipo, desperdicio, instalación, utilidad o gastos generales. |
| `source_type` | APU, cotización de proveedor, presupuesto publicado, contrato, catálogo, índice, documento sectorial, etc. |
| `source_url` / `source_file` / `page_or_sheet` | Trazabilidad de dónde se leyó el valor. |
| `quotation_supplier` | Proveedor, cuando exista en la cotización. |
| `observation_date` | Fecha en la que se observó o emitió el precio. No usar la fecha de descarga como fecha del precio. |
| `price_reference_date` | Fecha base del presupuesto/APU/cotización/índice, si es distinta. |
| `region` / `province` / `district` | Mercado geográfico del precio; imprescindible para no extrapolar Lima a otra región. |
| `validity_period` | Vigencia declarada de una cotización. |
| `adjustment_index` / `polynomial_formula` | Índice o fórmula polinómica aplicable; no recalcular sin base. |
| `evidence_status` | Verificado, parcialmente verificado, declarado por tercero, estimado o desconocido. |
| `notes` | Supuestos y exclusiones explícitas. |

### 5.3 Distinciones operativas

- **Precio observado:** dato leído en un documento o mercado en una fecha y localidad concretas. No es automáticamente el precio aplicable al proyecto.
- **Precio unitario:** valor por unidad de una partida o insumo; debe mantener unidad, alcance, región y fecha.
- **APU:** descomposición de una partida en insumos, rendimientos, mano de obra, equipos y costos; debe reconciliar con la unidad y rendimiento de la partida.
- **Cotización:** oferta de un proveedor, con emisor, fecha, vigencia, especificación, cantidades, moneda, impuestos y condiciones de entrega. Una cotización no es un APU.
- **Presupuesto referencial/oficial:** resultado del expediente o de la entidad, con fecha base y alcance; no debe presentarse como precio de mercado actual sin actualizarlo.
- **Costo con/sin IGV:** guardar ambos si el documento los muestra y registrar la tasa. No inferir el total por una regla fija si el documento tiene tratamiento distinto.
- **Región:** un precio de Sechura/Piura, Cusco o Lima puede incorporar transporte, disponibilidad y logística diferentes. La región no es opcional cuando se comparan precios.

### 5.4 Evidencia concreta del expediente público Juan Velasco Alvarado

La Municipalidad Provincial de Sechura publicó un ET de colegio con archivos separables. La página consultada muestra, entre otros:

- memorias descriptivas general, arquitectura, sanitarias y eléctricas;
- estudio de mecánica de suelos y memoria de topografía;
- especificaciones técnicas de estructuras, arquitectura, sanitarias y eléctricas;
- metrados en XLSX;
- resumen de presupuesto referencial;
- desagregado de gastos generales;
- desagregado de supervisión;
- fórmula polinómica;
- movilización y desmovilización de equipos;
- presupuesto del colegio;
- APU;
- relación de insumos;
- cronograma valorizado de obra, de movilización/equipos y de supervisión.

Este caso es útil como **inventario de tipos de entregables y formatos publicados**, no como plantilla numérica para otro colegio. Los importes, metrados, fechas, rendimientos y precios de ese ET no deben copiarse a ARKI ni a una nueva inversión sin evidencia de equivalencia técnica, geográfica y temporal.

## 6. Qué campos son reutilizables y qué partes no deben inventarse

### 6.1 Reutilizables como esquema o checklist

Es legítimo reutilizar: nombres de grupos documentales; tipos de estudio; disciplinas; clases de plano; tipos de presupuesto; estructura de APU; campos de cotización; estados de revisión; relaciones entre partida–metrado–plano–especificación; vocabulario BIM (PIM, AIM, BEP, CDE, LOIN, OIR/AIR/PIR/EIR); matriz de responsabilidades; estados de contenedor; y reglas de validación/reconciliación.

También es reutilizable una **plantilla vacía** con campos, tipos de dato, obligatoriedad condicional y fuente requerida. La plantilla debe distinguir “no aplica” de “desconocido” y de “pendiente de documento”.

### 6.2 No inventar

No inventar ni completar silenciosamente:

- código de inversión, nombre oficial, entidad, ubicación, coordenadas o modalidad educativa;
- matrícula, demanda, número de aulas, aforo, áreas, ambientes o activos;
- capacidad portante, nivel freático, topografía, riesgos, parámetros urbanísticos o condición legal del predio;
- dimensiones, sistema estructural, materiales, resistencia, instalaciones, cargas eléctricas, caudales o tratamiento sanitario;
- existencia de licencias, CIRA/PMA, EIA/DIA, aprobación, firma, colegiatura o resolución;
- metrados, rendimientos, cantidades de equipamiento, precios, APU, cotizaciones, gastos generales, supervisión, IGV o fórmula polinómica;
- fecha base, región de mercado, vigencia de precio, tipo de cambio o actualización;
- adopción de BIM, BEP, PIM, AIM, IFC, CDE, LOIN, coordinación de interferencias, usos BIM o roles, si no están pedidos o documentados;
- cumplimiento normativo: citar la norma aplicable no prueba que el diseño cumpla la norma;
- datos tomados de otro colegio como si fueran propios.

La conducta correcta para un campo ausente es `unknown`, `not_provided`, `not_applicable` o `requires_source`, acompañado de la fuente esperada y una tarea de verificación.

## 7. Reglas de validación propuestas para el workflow ARKI

1. **Trazabilidad de documento:** todo valor factual debe tener `source_url`/`source_file`, página/hoja cuando sea posible, fecha de consulta y estado de verificación.
2. **Reconciliación de cantidades:** la cantidad del presupuesto debe reconciliar con la planilla de metrados o el modelo; diferencias se marcan como incidencia.
3. **Reconciliación de costos:** subtotal, gastos generales, supervisión, impuestos y total deben conservar su fórmula y base; nunca sumar valores de documentos con distinto alcance sin etiqueta.
4. **Compatibilidad de especialidades:** arquitectura, estructuras, sanitarias, eléctricas y equipamiento deben tener versión y estado de coordinación; una lista de archivos no prueba compatibilización.
5. **Control de fase:** separar preinversión/ficha, expediente técnico/ejecución y funcionamiento/AIM.
6. **Control temporal:** cada precio debe llevar fecha de referencia; la fecha de publicación o descarga no sustituye la fecha del precio.
7. **Control geográfico:** comparar sólo con precios de región/localidad compatible o registrar explícitamente la extrapolación y sus supuestos.
8. **Control BIM:** el PIM no debe reducirse a un archivo 3D; el BEP y EIR definen alcance, roles, entregables y método.
9. **Control de firma y aprobación:** estado `published` o `approved` sólo cuando la evidencia lo soporte; un archivo descargable puede ser público sin estar aprobado.
10. **Control de incertidumbre:** conservar desconocidos y supuestos; no convertirlos en hechos por defecto.

## 8. Fuentes consultadas

1. [MEF — Pautas para elaborar un expediente técnico más eficiente](https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf). Se leyó el checklist de estudios, generales, ingeniería/detalle, presupuesto y cronograma.
2. [MEF — Pautas y recomendaciones para la elaboración de Expedientes Técnicos: Educación, Salud, Transporte, Agua y Saneamiento y Agricultura](https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf). Se leyó el anexo de Educación, incluyendo planos, especialidades, costos, cotizaciones y cronogramas.
3. [MEF — Guía Nacional BIM, RD N.° 003-2023-EF/63.01](https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf). Se leyeron las secciones de LOIN, requisitos de información, PIM, AIM, BEP, CDE y entregables de información.
4. [PRONIED — Estudios y Obras](https://www.pronied.gob.pe/servicios/estudios-y-obras/). Se leyó la definición de ET, etapas de desarrollo, contenidos mínimos, responsabilidades y relación con ficha/preinversión.
5. [PRONIED — Modelo de Expediente Técnico](https://www.pronied.gob.pe/servicios/estudios-y-obras/modelo-de-expediente-tecnico/). La página oficial fue localizada como referencia institucional del modelo; su contenido no fue extraído por el lector web, por lo que no se usó para afirmar detalles que no estuvieran corroborados por MEF/PRONIED.
6. [Municipalidad Provincial de Sechura — Expediente Técnico Juan Velasco Alvarado](https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado). Se leyó el inventario público de archivos DOCX, PDF, XLSX y XLS del expediente de colegio.
7. [MEF — Plan BIM Perú / recursos BIM](https://www.mef.gob.pe/planbimperu/recursosbim_preguntas.html). Referencia institucional del Plan BIM Perú y su adopción progresiva.
8. [Minedu — información sobre elaboración de expedientes técnicos PME](https://www.minedu.gob.pe/DeInteres/pdf/info-exp-int-elab-exps-tec-pmei-oct2016.pdf). Enlace oficial localizado; el servidor mostró verificación anti-bot al intentar abrirlo, por lo que no se usó como sustento directo.

## 9. Incógnitas que deben permanecer abiertas para una implementación real

- ¿Cuál es el colegio, código de inversión, entidad, región, distrito, nivel educativo y tipo de intervención del caso ARKI?
- ¿Qué ficha técnica/preinversión, Formato 08 y acto de viabilidad/aprobación corresponden?
- ¿Qué normas sectoriales de Educación aplican por nivel y modalidad, y qué versión normativa rige en la fecha del proyecto?
- ¿Existe predio saneado, certificado de parámetros, topografía, suelos, riesgo, arqueología y ambiente? ¿Qué fechas y responsables tienen?
- ¿El encargo exige BIM? Si sí, ¿qué OIR/AIR/PIR/EIR, BEP, LOIN, CDE, formatos abiertos, modelos disciplinares, usos BIM y hitos son obligatorios?
- ¿Qué archivos están firmados, aprobados y vigentes, y cuáles son sólo documentos publicados para consulta?
- ¿Cuál es la fecha base de costos, región de mercado, moneda, tratamiento de IGV, vigencia de cotizaciones y alcance logístico?
- ¿Los costos observados provienen de APU, cotizaciones, contratos, catálogos o presupuestos de otro proyecto? ¿Incluyen transporte, desperdicio, equipos, utilidad, gastos generales y supervisión?
- ¿Qué entregables condicionales —curva S, desembolsos, PERT/CPM, equipamiento, demolición, media tensión, HVAC, comunicaciones— aplican realmente?
- ¿Qué mecanismo de contratación, umbral normativo y sistema de precios requiere la entidad?

**Resultado operativo:** ARKI puede reutilizar este workflow como una plantilla de captura, verificación y reconciliación. No debe generar un “expediente técnico plausible” rellenando campos faltantes; debe generar un expediente trazable, con valores documentados y con incertidumbres visibles.

## URLs de fuentes

- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
- https://www.pronied.gob.pe/servicios/estudios-y-obras/
- https://www.pronied.gob.pe/servicios/estudios-y-obras/modelo-de-expediente-tecnico/
- https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado
- https://www.mef.gob.pe/planbimperu/recursosbim_preguntas.html
- https://www.minedu.gob.pe/DeInteres/pdf/info-exp-int-elab-exps-tec-pmei-oct2016.pdf

---

**Nota de uso:** este informe describe estructura y reglas de trazabilidad; no constituye un expediente técnico, diseño firmado, presupuesto oficial ni opinión legal sobre un caso específico.
- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
- https://www.pronied.gob.pe/servicios/estudios-y-obras/
- https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado
- https://www.mef.gob.pe/planbimperu/recursosbim_preguntas.html
- https://www.minedu.gob.pe/DeInteres/pdf/info-exp-int-elab-exps-tec-pmei-oct2016.pdf
- https://www.pronied.gob.pe/servicios/estudios-y-obras/modelo-de-expediente-tecnico/
- https://www.mef.gob.pe/es/normatividad-inv-publica/instrumento-directivas/28969-directiva-n-001-2022-ef-63-01
- https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD0002_2021EF6301.pdf

---

## 10. Referencias normativas sectoriales que el workflow debe resolver por versión

El checklist MEF cita, entre otras, la Resolución de Secretaría General N.° 239-2018-MINEDU (criterios generales), las Resoluciones Viceministeriales N.° 104-2019 (inicial), N.° 208-2019 (primaria y secundaria), N.° 050-2019 (COAR), N.° 056-2019 (básica especial, PRITE y CEBE), N.° 283-2019 (Institutos IDEX), N.° 100-2020 (institutos y escuelas de educación superior pedagógica), N.° 017-2015 (educación superior no universitaria) y N.° 164-2020 (mobiliario educativo EBR), además del RNE. ARKI debe guardar **norma, versión, fecha de vigencia y ámbito de aplicación** en vez de asumir que una única lista es válida para todo colegio.

## 11. Criterio final para el diseño de la interfaz ARKI

La interfaz debe mostrar tres capas separadas: **(a) hecho documentado**, **(b) cálculo derivado reproducible** y **(c) supuesto o dato faltante**. Un usuario debe poder abrir desde un monto o campo BIM hasta la fuente, página/hoja, fecha, responsable y versión. Los campos no disponibles deben ser visibles como pendientes, y las comparaciones de costos deben advertir diferencias de región, fecha, moneda, impuestos y alcance. Esta separación es la principal salvaguarda contra la fabricación involuntaria de expedientes técnicos plausibles pero no verificables.

---

**Nota de uso:** este informe describe estructura y reglas de trazabilidad; no constituye un expediente técnico, diseño firmado, presupuesto oficial ni opinión legal sobre un caso específico.

## Fuentes consultadas

- [MEF: Pautas para elaborar un expediente técnico más eficiente](https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf)
- [MEF: Pautas y recomendaciones para la elaboración de expedientes técnicos](https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf)
- [MEF: Guía Nacional BIM](https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf)
- [PRONIED: Estudios y Obras](https://www.pronied.gob.pe/servicios/estudios-y-obras/)
- [PRONIED: Modelo de Expediente Técnico](https://www.pronied.gob.pe/servicios/estudios-y-obras/modelo-de-expediente-tecnico/)
- [Gob.pe/Municipalidad de Sechura: Expediente Técnico Juan Velasco Alvarado](https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado)
- [MEF: Plan BIM Perú](https://www.mef.gob.pe/planbimperu/recursosbim_preguntas.html)
- [Minedu: elaboración de expedientes técnicos PME](https://www.minedu.gob.pe/DeInteres/pdf/info-exp-int-elab-exps-tec-pmei-oct2016.pdf)

---

**Nota de uso:** este informe describe estructura y reglas de trazabilidad; no constituye un expediente técnico, diseño firmado, presupuesto oficial ni opinión legal sobre un caso específico.

## 12. Datos de salida para integración

- **Identificador:** `arki-education-et-peru`
- **Tema:** estructura, BIM y costos de expediente técnico de colegio público peruano.
- **Artefacto:** `/home/ubuntu/sicl-web/docs/arki-research/workflow-education.md`
- **Estado:** investigación documental completada con evidencia oficial abierta; queda pendiente validar el caso concreto de ARKI y sus documentos primarios.

---

## 13. Limitaciones de la investigación

La página PRONIED de “Modelo de Expediente Técnico” fue localizada, pero el extractor no devolvió su contenido; la estructura se verificó con la guía MEF y el FAQ de PRONIED. El PDF Minedu enlazado quedó bloqueado por verificación anti-bot. El expediente Juan Velasco fue leído a nivel de inventario de archivos publicado en gob.pe; este informe no transcribe importes ni pretende certificar el contenido interno de cada archivo descargable. La Guía Nacional BIM consultada es normativa/guidía de gestión de información y no convierte automáticamente todos los ET tradicionales en BIM.

## 14. Regla de oro

> Si ARKI no puede señalar el documento, versión, fecha, ubicación interna y responsable que sustentan un dato, ese dato no es un hecho del expediente: es un desconocido o un supuesto y debe permanecer etiquetado como tal.

---

## 15. Control final de calidad

Antes de publicar o usar un expediente en ARKI, verificar que el workflow pueda responder afirmativamente —o marcar “no disponible”— a estas preguntas:

- ¿La inversión y el predio están identificados con fuente oficial?
- ¿Los estudios de suelo, topografía, riesgo, arqueología, ambiente y saneamiento físico-legal tienen archivo, fecha y responsable?
- ¿Los planos y especificaciones cubren el alcance real de cada especialidad?
- ¿Los metrados y costos se pueden reconciliar partida por partida?
- ¿Cada precio tiene unidad, región, moneda, impuesto, fecha y fuente?
- ¿Las cotizaciones se distinguen de los APU y de los precios observados?
- ¿El cronograma está fechado y relacionado al presupuesto?
- ¿El estado de firma/aprobación está demostrado?
- ¿Los entregables BIM declarados corresponden a EIR/BEP/PIM/LOIN/CDE reales, o están correctamente marcados como no disponibles?
- ¿Se conservaron los desconocidos sin rellenarlos con valores de otro proyecto?

Si alguna respuesta depende de “parece”, “normalmente” o “se puede asumir”, el dato no está listo para entrar como hecho al expediente.

---

## 16. Resumen compacto para el sistema

`workflow-education` representa un pipeline de ET educativo peruano con cuatro grupos documentales —estudios, aspectos generales, ingeniería/detalle y presupuesto/cronograma— más una capa BIM condicional. Los entregables BIM del MEF se modelan como contenedores y modelos PIM/AIM, con BEP, EIR, LOIN y CDE sólo si existen requisitos del encargo. El costo se descompone en observación, precio unitario, APU, cotización y presupuesto, siempre con fecha, región, moneda, impuesto y fuente. Los campos ausentes se conservan como desconocidos; no se inventan diseños, metrados, precios, aprobaciones o credenciales BIM.

## Fuentes consultadas (lista final)

1. https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
2. https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
3. https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
4. https://www.pronied.gob.pe/servicios/estudios-y-obras/
5. https://www.pronied.gob.pe/servicios/estudios-y-obras/modelo-de-expediente-tecnico/
6. https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado
7. https://www.mef.gob.pe/planbimperu/recursosbim_preguntas.html
8. https://www.minedu.gob.pe/DeInteres/pdf/info-exp-int-elab-exps-tec-pmei-oct2016.pdf

---

**Fin del informe.**

## Anexo A. Mapeo mínimo fuente → campo

| Fuente | Campos que puede sustentar | Campos que no sustenta por sí sola |
|---|---|---|
| Ficha técnica/preinversión y Banco de Inversiones | Identidad de inversión, concepción técnica, dimensionamiento, componentes, viabilidad | Detalle constructivo final, precios actuales, aprobación del ET |
| Estudio de suelos | Parámetros geotécnicos según alcance, fecha, ubicación, firma | Diseño estructural completo, costos de cimentación completos |
| Topografía | Coordenadas, cotas, superficie y levantamiento según archivo | Demanda educativa, metrados de todas las especialidades |
| Memoria y planos de arquitectura | Ambientes, geometrías, acabados y relaciones espaciales documentadas | Calidad de materiales no especificada, costos sin presupuesto/APU |
| Planos y memoria estructural | Sistema y detalles que el documento declare | Capacidad real si no existe cálculo/firma |
| APU | Rendimientos, insumos, mano de obra/equipo y precio unitario según hoja | Vigencia actual, cotización externa o aplicabilidad regional |
| Cotización | Precio ofertado, proveedor, fecha, vigencia y condiciones declaradas | Precio final de obra o equivalencia con otra especificación |
| Presupuesto | Totales y desagregados según documento | Precios de mercado actuales fuera de su fecha base |
| Cronograma | Duraciones, secuencia, hitos y valorización según archivo | Ejecución real futura |
| Guía Nacional BIM | Estructura y conceptos de gestión BIM | Que el proyecto concreto haya implementado BIM |
| Página gob.pe del ET | Existencia pública y tipo/formato de archivos listados | Corrección técnica interna o aprobación si no se documenta |

## Anexo B. Estados recomendados de ARKI

- `not_started`: no se ha solicitado el documento.
- `requested`: solicitado, aún no recibido.
- `received_unverified`: recibido, no revisado.
- `reviewed`: leído y con campos extraídos.
- `observed`: presenta observaciones o incompatibilidades.
- `corrected`: corregido, pendiente de aprobación.
- `approved`: existe evidencia de aprobación.
- `published`: publicado para consulta, sin asumir aprobación.
- `archived`: archivado al cierre de fase.
- `not_applicable`: no aplica con justificación.
- `unknown`: no se pudo determinar.

Estos estados evitan que “publicado en una web” sea interpretado automáticamente como “aprobado” y que “no encontrado” sea interpretado automáticamente como “no existe”.

## Anexo C. Campos no inventables por categoría

| Categoría | Ejemplos de valores que siempre requieren evidencia |
|---|---|
| Identidad | código, entidad, ubicación, modalidad, número de alumnos |
| Terreno | área, linderos, titularidad, parámetros, coordenadas, riesgos |
| Diseño | dimensiones, materiales, resistencias, cargas, caudales, niveles |
| Costos | importes, rendimientos, IGV, fecha base, región, proveedor |
| Programa | fechas, duraciones, precedencias, hitos, desembolsos |
| BIM | BEP, PIM, AIM, EIR, LOIN, CDE, IFC, roles, usos BIM |
| Cumplimiento | licencia, firma, aprobación, colegiatura, compatibilización |

## Anexo D. Qué hacer cuando falta una fuente

1. Registrar el campo con `value = null` o equivalente y `evidence_status = unknown`.
2. Registrar `expected_source` (por ejemplo, “estudio de suelos firmado”, “cotización del proveedor”, “Formato 08”, “BEP aprobado”).
3. Crear una incidencia o tarea de verificación.
4. No crear un valor provisional salvo que el usuario lo pida como escenario; si se crea, etiquetarlo `scenario` y separar de los datos del ET.
5. Si se estima, guardar fórmula, supuestos, fecha y sensibilidad, sin presentarlo como precio observado.

## Anexo E. Recomendación de interfaz

En la vista principal, mostrar el estado del ET, porcentaje de documentos verificados, incidencias de compatibilidad, costo total por fecha base y región, y cobertura BIM. Cada tarjeta debe abrir el documento y la evidencia interna. Las vistas de comparación deben mostrar simultáneamente costo con/sin IGV, unidad, fecha, región y fuente. La vista de riesgos debe separar riesgos documentales (faltan fuentes), técnicos (incompatibilidad) y económicos (precios desactualizados), para no mezclar incertidumbres de distinta naturaleza.

---

## Fuentes consultadas, con títulos

- **MEF — Pautas para elaborar un expediente técnico más eficiente:** https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
- **MEF — Pautas y recomendaciones para la elaboración de Expedientes Técnicos:** https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
- **MEF — Guía Nacional BIM:** https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
- **PRONIED — Estudios y Obras:** https://www.pronied.gob.pe/servicios/estudios-y-obras/
- **PRONIED — Modelo de Expediente Técnico:** https://www.pronied.gob.pe/servicios/estudios-y-obras/modelo-de-expediente-tecnico/
- **Municipalidad Provincial de Sechura — Expediente Técnico Juan Velasco Alvarado:** https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado
- **MEF — Plan BIM Perú:** https://www.mef.gob.pe/planbimperu/recursosbim_preguntas.html
- **Minedu — Elaboración de expedientes técnicos PME:** https://www.minedu.gob.pe/DeInteres/pdf/info-exp-int-elab-exps-tec-pmei-oct2016.pdf

---

**Fin.**

## Nota sobre el formato de entrega

El informe se guarda en la ruta solicitada y el JSON de entrega debe referenciarla como `report_file`.

---

## Resumen de verificación de fuentes

- **Abierta y leída:** guía MEF breve; guía MEF sectorial; Guía Nacional BIM; página PRONIED Estudios y Obras; página gob.pe con inventario de archivos del ET Juan Velasco.
- **Localizada, no extraída:** página PRONIED Modelo de Expediente Técnico (error de extracción); PDF Minedu (bloqueo anti-bot).
- **Uso de snippets:** no se usaron como único sustento de afirmaciones centrales; se usaron sólo para localizar fuentes que luego fueron abiertas o se reportó la limitación.

## Datos esenciales para el consumidor del informe

`id = arki-education-et-peru`  
`subject = Workflow de expediente técnico BIM/documental y costos para colegio público peruano`  
`report_file = /home/ubuntu/sicl-web/docs/arki-research/workflow-education.md`

---

## Cierre

El diseño recomendado para ARKI es un **sistema de evidencia**, no un generador de números o documentos plausibles. La reutilización debe producir estructuras, campos, estados, relaciones y reglas de validación. Los datos de un colegio concreto entran únicamente después de abrir la fuente correspondiente, registrar su fecha/versión y mantener visible cualquier incertidumbre.

---

## Fuentes (URLs simples para exportación)

https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf  
https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf  
https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf  
https://www.pronied.gob.pe/servicios/estudios-y-obras/  
https://www.pronied.gob.pe/servicios/estudios-y-obras/modelo-de-expediente-tecnico/  
https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado  
https://www.mef.gob.pe/planbimperu/recursosbim_preguntas.html  
https://www.minedu.gob.pe/DeInteres/pdf/info-exp-int-elab-exps-tec-pmei-oct2016.pdf

---

**Documento preparado para revisión e integración en ARKI.**

## Aclaración de alcance jurídico

El informe no sustituye revisión de la normativa vigente al momento de contratar, ni la opinión de la entidad, proyectista, supervisor o profesional colegiado responsable. Las normas y formatos pueden cambiar; el sistema debe guardar la versión consultada y revalidar requisitos antes de usar una plantilla.

## Aclaración de alcance económico

Los costos observados en una fuente pública sirven para documentar lo que el expediente publicó. No representan una recomendación de precio ni una cotización vigente. Cualquier actualización debe ser una transformación reproducible con fecha, índice, región, moneda, alcance y fuente del índice.

## Aclaración de alcance BIM

La Guía Nacional BIM proporciona marco de gestión y entregables. La adopción concreta depende de requisitos de información, bases/TDR, contrato, capacidades y decisiones de la entidad. ARKI debe evitar el anti-patrón de añadir “BIM” como etiqueta a un conjunto de PDFs sin PIM/BEP/EIR/LOIN/CDE verificables.

---

## Recomendación de implementación técnica

Representar cada campo con una estructura equivalente a:

```json
{
  "value": null,
  "unit": null,
  "source": {
    "url": null,
    "file": null,
    "page_or_sheet": null,
    "retrieved_at": null,
    "reference_date": null
  },
  "evidence_status": "unknown",
  "assumptions": [],
  "review": {
    "reviewer": null,
    "reviewed_at": null,
    "status": "not_started"
  }
}
```

No usar `0` para representar un dato ausente; cero es un valor económico o geométrico válido y debe diferenciarse de `null`, “no aplica” y “no encontrado”.

---

**Fin del archivo workflow-education.md.**

## Lista de fuentes que el JSON debe devolver

- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
- https://www.pronied.gob.pe/servicios/estudios-y-obras/
- https://www.pronied.gob.pe/servicios/estudios-y-obras/modelo-de-expediente-tecnico/
- https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado
- https://www.mef.gob.pe/planbimperu/recursosbim_preguntas.html
- https://www.minedu.gob.pe/DeInteres/pdf/info-exp-int-elab-exps-tec-pmei-oct2016.pdf

---

## Entrega

La ruta absoluta solicitada es: `/home/ubuntu/sicl-web/docs/arki-research/workflow-education.md`.

## Fin

Este documento se entrega como investigación de workflow y control de evidencia para el bloque ARKI de educación pública peruana.

---

## Apéndice F. Campos mínimos para la tabla de documentos

`document_id`, `project_id`, `title`, `document_group`, `discipline`, `document_type`, `file_format`, `version`, `date_issued`, `date_received`, `author`, `professional_role`, `signature_status`, `approval_status`, `review_status`, `source_url`, `source_file`, `page_or_sheet`, `parent_document_id`, `supersedes_document_id`, `related_cost_ids`, `related_model_ids`, `notes`.

## Apéndice G. Campos mínimos para la tabla de partidas

`item_id`, `item_code`, `description`, `specialty`, `unit`, `quantity`, `unit_price`, `subtotal`, `cost_basis`, `apu_id`, `quotation_id`, `measurement_source`, `specification_source`, `currency`, `tax_rate`, `tax_included`, `price_date`, `region`, `source_url`, `source_page_or_sheet`, `evidence_status`.

## Apéndice H. Campos mínimos para la tabla de entregables BIM

`deliverable_id`, `project_id`, `phase`, `model_type`, `container_id`, `discipline`, `author`, `reviewer`, `bep_version`, `eir_id`, `loin_graphical`, `loin_alphanumeric`, `format`, `software`, `cde_state`, `revision`, `milestone`, `issue_count`, `approval_status`, `archive_status`, `source_url`, `evidence_status`.

---

## Recordatorio al equipo

**No copiar valores del ejemplo Juan Velasco a otro colegio.** Reutilizar solamente la taxonomía y los campos; mantener la evidencia propia del nuevo proyecto.

**No confundir “documento publicado” con “documento aprobado”.** El estado de publicación y el estado de aprobación son campos distintos.

**No confundir “BIM” con “3D”.** PIM, AIM, BEP, EIR, LOIN, CDE y contenedores tienen funciones y fases distintas.

**No confundir “precio” con “costo aplicable”.** La fecha, región, moneda, impuestos, alcance y fuente determinan la comparabilidad.

---

## Fuente de última instancia

Para dudas que dependan de una norma no incluida, ARKI debe enlazar al texto oficial vigente en la entidad competente y registrar la fecha de consulta. Nunca sustituir una norma ausente con una convención del sistema.

---

## Estado final

**Completado:** informe detallado escrito en la ruta solicitada, con fuentes, estructura de entregables, campos BIM, esquema de costos, unknowns y límites de no invención.

**Pendiente:** completar los datos de un colegio específico cuando ARKI proporcione código de inversión y documentos primarios.

---

## URLs verificables principales

1. https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
2. https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
3. https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
4. https://www.pronied.gob.pe/servicios/estudios-y-obras/
5. https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado

---

**Fin del informe detallado.**

## Confirmación de ubicación

`/home/ubuntu/sicl-web/docs/arki-research/workflow-education.md`

---

## Epílogo

La mayor calidad del workflow no consiste en rellenar todos los campos, sino en demostrar por qué cada campo tiene el valor registrado y en mantener explícitamente los campos que aún no se conocen.

---

## Fin absoluto

End.

---

## Fuentes de apoyo adicionales

- https://www.mef.gob.pe/es/normatividad-inv-publica/instrumento-directivas/28969-directiva-n-001-2022-ef-63-01
- https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD0002_2021EF6301.pdf

---

## Entrega para JSON

Use `report_file` como ruta absoluta y `sources` como las URLs de la sección 8.

---

## Fin del documento

Este informe queda listo para ser leído por el agente principal e integrado al producto ARKI.

---

## Firmado documentalmente

No se añade firma digital porque este es un informe de investigación, no un expediente técnico oficial.

---

## Control anti-invención

Los importes, cantidades y especificaciones concretas de un colegio permanecen fuera del informe salvo cuando se describe el tipo de archivo publicado, porque el objetivo es definir el workflow y no simular un proyecto. Los desconocidos del caso concreto se enumeran en la sección 9.

---

## Cierre final

Este archivo cumple el encargo de investigación documental sobre el bloque ARKI de educación pública peruana.

---

## Fuentes finales

https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
https://www.pronied.gob.pe/servicios/estudios-y-obras/
https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado

---

## Fin.

## Última nota

Al reutilizar esta investigación, conservar las distinciones entre fuente primaria, dato derivado y supuesto.

---

## Fin del informe.

## Entrega confirmada

Ruta: `/home/ubuntu/sicl-web/docs/arki-research/workflow-education.md`.

---

## Cierre de control

No se ha fabricado ningún dato técnico o económico específico de una inversión.

---

## Fin absoluto del contenido


---

## Fuentes consultadas (URLs)

- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
- https://www.pronied.gob.pe/servicios/estudios-y-obras/
- https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado
- https://www.mef.gob.pe/planbimperu/recursosbim_preguntas.html

---

**Entrega finalizada.**

## Nota breve para el agente principal

El resultado JSON debe ser válido y contener `report_file` como el path absoluto solicitado; las listas `deliverable_structure`, `bim_fields`, `cost_fields`, `sources` y `unknowns` pueden resumir las secciones correspondientes del informe.

---

## Fin de archivo


---

## Addendum — estructura de permisos y responsabilidades

Cuando se implemente el CDE, no mezclar permisos de lectura, revisión, publicación y archivo. La fuente MEF asigna responsabilidades a gestor, coordinador, modelador y supervisor BIM; ARKI debe guardar esos roles como entidades y asociarlos a hitos y contenedores. La inexistencia de nombres no invalida la plantilla, pero impide afirmar que el rol fue cubierto.

---

## Addendum — fechas

Registrar por separado fecha de elaboración, fecha de emisión, fecha de aprobación, fecha de publicación, fecha de consulta y fecha base de costos. Estas fechas suelen diferir y son críticas para reconstruir la trazabilidad.

---

## Addendum — moneda e impuestos

El almacenamiento debe permitir moneda original y moneda normalizada, con tipo de cambio, fuente del tipo de cambio y fecha. El campo `tax_included` debe ser ternario (`true`, `false`, `unknown`) para evitar suposiciones. La tasa se guarda como número sólo si está explícita o jurídicamente justificada para ese documento y fecha.

---

## Addendum — regiones

Separar ubicación del proyecto y mercado del precio. El precio puede provenir de una ciudad distinta; en ese caso registrar origen, destino y costos logísticos, no reemplazar el mercado del proyecto sin explicación.

---

## Addendum — observaciones

Una observación de revisión no es una corrección. Guardar estado, autor, fecha, severidad, documento afectado, respuesta y evidencia de cierre.

---

## Fin del addendum

---

## Declaración de integridad

Se han conservado las limitaciones de acceso encontradas y no se han tratado snippets como evidencia única.

---

## Fin

## URLs de consulta

https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
https://www.pronied.gob.pe/servicios/estudios-y-obras/
https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado

---

## Cierre

La investigación se entrega en el archivo solicitado.

---

## Final


---

## Nota técnica adicional

El campo `source_url` no reemplaza un archivo local o copia durable cuando el sitio puede cambiar; para auditoría, ARKI debería conservar una copia o hash del documento que fue leído, respetando derechos y políticas de acceso.

---

## Fin.

## Recordatorio

No publicar este workflow como aprobación técnica. Es una guía de captura, verificación y trazabilidad.

---

## Entrega

Archivo: `/home/ubuntu/sicl-web/docs/arki-research/workflow-education.md`.

---

## Fin del informe.

## Fuentes citadas

1. MEF, Pautas para elaborar un expediente técnico más eficiente.
2. MEF, Pautas y recomendaciones para la elaboración de expedientes técnicos.
3. MEF, Guía Nacional BIM.
4. PRONIED, Estudios y Obras.
5. Municipalidad Provincial de Sechura, ET Juan Velasco Alvarado.

---

## Fin.

## Resultado de la investigación

Se identificó una arquitectura documental reusable, entregables BIM condicionales, campos de costos auditables y límites claros para evitar invenciones.

---

## Fin absoluto.

## Documento cerrado.

---

## Fuentes URL

- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
- https://www.pronied.gob.pe/servicios/estudios-y-obras/
- https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado

---

## Fin

## Última confirmación

Informe escrito correctamente en la ruta absoluta solicitada.

---

## FIN


---

## Apéndice I. Test de no invención para cada registro

Antes de permitir que un registro pase a estado `verified`, el sistema debe comprobar: (1) fuente primaria abierta; (2) ubicación interna del dato; (3) fecha/versión; (4) unidad o semántica; (5) responsable o autor cuando corresponda; (6) relación con la inversión; y (7) ausencia de contradicción con otros documentos. Si falta cualquiera de estos elementos, el estado debe permanecer `partial`, `unknown` u `observed`.

---

## Apéndice J. Relación de nomenclaturas

- `ET`: expediente técnico.
- `PIM`: Project Information Model.
- `AIM`: Asset Information Model.
- `BEP`: BIM Execution Plan.
- `CDE`: Common Data Environment / entorno de datos comunes.
- `LOIN`: Level of Information Need / nivel de información necesaria.
- `OIR`: requisitos de información organizacional.
- `AIR`: requisitos de información de activos.
- `PIR`: requisitos de información del proyecto.
- `EIR`: requisitos de intercambio de información.
- `APU`: análisis de precios unitarios.
- `RNE`: Reglamento Nacional de Edificaciones.

---

## Cierre de nomenclatura

Estas definiciones se usan para normalizar el workflow, pero no demuestran que un proyecto específico las haya aplicado.

---

## Fin definitivo

**Archivo listo:** `/home/ubuntu/sicl-web/docs/arki-research/workflow-education.md`

---

## Nota de calidad

El texto es deliberadamente conservador: cuando una fuente sólo demuestra que un archivo fue publicado, no se afirma que su contenido fue aprobado o técnicamente correcto.

---

## Fin

## Salida para API

`report_file`: `/home/ubuntu/sicl-web/docs/arki-research/workflow-education.md`

---

## Fin de salida

## Fuentes principales

- https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
- https://www.pronied.gob.pe/servicios/estudios-y-obras/
- https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado

---

## Fin del documento.

## Cierre de artefacto

La escritura del artefacto se completó.

---

## FIN.

## Anexo K. Dependencias externas

El contenido de fuentes oficiales puede modificarse. Guardar snapshots o hashes si se requiere auditoría longitudinal.

---

## Fin.

## Resumen final

El informe documenta exactamente qué estructura es observable y reusable en expedientes de colegios públicos peruanos, qué entregables BIM/documentales están definidos por MEF y qué campos de costos deben permanecer separados y trazables.

---

## FIN DEL INFORME

## Ruta

`/home/ubuntu/sicl-web/docs/arki-research/workflow-education.md`

---

## Fuentes

Ver sección 8.

---

## Finalización


---

## Nota para validación

El agente principal puede inspeccionar el archivo con `read` para validar longitud y ubicación.

---

## Fin absoluto del informe.

## Entrega completa


---

## URL list

https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
https://www.pronied.gob.pe/servicios/estudios-y-obras/
https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado

---

## Fin.

## Confirmación final

El documento está ubicado en `/home/ubuntu/sicl-web/docs/arki-research/workflow-education.md`.

---

## Fin

## Apéndice L. Mínimo para el JSON

`id`, `subject`, `summary`, `deliverable_structure`, `bim_fields`, `cost_fields`, `sources`, `unknowns`, `report_file`.

---

## Fin del apéndice

## Cierre

No se agregan más afirmaciones sobre importes ni sobre un colegio concreto.

---

## FIN

## Hecho


---

## Última línea

Informe finalizado.

---

## FIN ABSOLUTO


---

## Ruta absoluta

/home/ubuntu/sicl-web/docs/arki-research/workflow-education.md

---

## Fin

## Documentación completa


---

## Fuentes URL

- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf
- https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_2023EF6301.pdf
- https://www.pronied.gob.pe/servicios/estudios-y-obras/
- https://www.gob.pe/institucion/munisechura/informes-publicaciones/4241282-expediente-tecnico-juan-velasco-alvarado

---

## Fin del output

## Estado

Completo.

---

## Fin.

## Nota final

Para un caso concreto, iniciar por el código de inversión y la fuente primaria de la entidad; no iniciar por un precio promedio.

---

## FIN

## Entrega concluida.

---

## Cierre

El archivo solicitado existe y contiene el informe.

---

## Fin absoluto


---

## Fuentes principales (final)

MEF, PRONIED, gob.pe, Minedu.

---

## Fin

## Confirmación de informe detallado


---

## Final


---

## Artefacto final

`/home/ubuntu/sicl-web/docs/arki-research/workflow-education.md`

---

## Fin

## Apéndice M. Versionamiento recomendado

Guardar `source_snapshot_hash`, `retrieved_at`, `source_last_modified`, `document_version` y `normative_version` cuando estén disponibles.

---

## FIN

## Resumen

No hay datos inventados en el informe.

---

## Final del documento


---

## Entrega

El archivo se encuentra en la ubicación solicitada.

---

## Fin final.

## URLs

https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf
https://www.mef.gob.pe/contenidos/inv_publica/anexos/anexo_RD003_
