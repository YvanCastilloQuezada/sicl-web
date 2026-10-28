# Investigación para ARKI: fuentes peruanas de expediente técnico, BIM, costos, precios unitarios y cotizaciones

**Fecha de investigación:** 21 de septiembre de 2026  
**Alcance:** fuentes peruanas oficiales o documentos públicos verificables, con prioridad a MEF, INEI, Contraloría y entidades públicas. El propósito es definir qué puede estructurar y reutilizar ARKI y qué datos debe exigir como evidencia, sin inventar precios, rendimientos, impuestos o entregables.

## 1. Conclusiones ejecutivas

Un expediente técnico peruano no es solamente un presupuesto. Las pautas del MEF lo organizan, con variaciones sectoriales, en **estudios**, **aspectos generales**, **ingeniería y detalle**, y **presupuesto y cronograma**. La lista transversal incluye resumen ejecutivo, ficha técnica o datos del proyecto, memoria descriptiva, memoria de cálculo, especificaciones técnicas, planos por especialidad, metrados, análisis de costos unitarios, presupuesto desagregado, gastos generales, relación de insumos, fórmula polinómica y cronogramas. Los contenidos concretos dependen de la tipología, sector, normativa sectorial y términos de referencia (TDR); ARKI debe tratar la lista como una plantilla parametrizable, no como un expediente automáticamente válido para cualquier obra.

Para BIM, la **Guía Nacional BIM del MEF** define los requisitos OIR, AIR, PIR y EIR; los modelos PIM y AIM; el BEP; los programas MIDP/TIDP; el CDE; el LOIN; roles, responsabilidades, formatos, hitos y entregables. La especificación pública de Contraloría/BID aporta un ejemplo verificable de cómo esos conceptos se convierten en entregables de un expediente: PEB/BEP, planos y modelos por especialidad, modelo coordinado LOD 300, metrados extraídos del modelo y contrastados manualmente, simulación 4D y modelo As Built LOD 350 con datos reales de control de calidad, cambios, garantías y proveedores. Es un **ejemplo de TDR**, no una exigencia universal para toda inversión.

En costos, ARKI debe separar estrictamente: **precio observado** (dato bruto de mercado o índice), **precio unitario de insumo** (dato utilizado en un APU), **APU** (composición de insumos, cantidades/rendimientos y costo directo de una partida), **cotización** (evidencia documental de un proveedor), y **presupuesto** (metrados por precios unitarios más gastos generales, utilidad, impuestos y otros componentes que correspondan). Cada registro debe conservar fecha, región/localidad, moneda, unidad, condición tributaria, flete, fuente y documento de respaldo. Nunca debe convertir una referencia estadística del INEI en un precio local de compra ni rellenar ausencias con valores inventados.

## 2. Fuentes leídas y qué permiten afirmar

### 2.1 MEF: pautas y recomendaciones para expedientes técnicos

La publicación del MEF [“Pautas y recomendaciones para la elaboración de Expedientes Técnicos”](https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf) indica que los contenidos se presentan para Educación, Salud, Transporte, Agua y Saneamiento y Agricultura y que se basan en normativa vigente. Su estructura consolidada distingue **Estudios**, **Aspectos generales**, **Ingeniería y detalle** y **Presupuesto y cronograma**.

En el bloque general aparecen, según tipo de inversión, revisión del perfil o preinversión, estimación de riesgos, viabilidad, identificación de componentes, resumen ejecutivo, ficha técnica, memoria descriptiva, memoria de cálculo, especificaciones técnicas y planes de seguridad/vigilancia cuando sean aplicables. Ingeniería y detalle incluye planos generales, plano clave de ubicación/localización con coordenadas UTM, topografía, delimitación del ámbito, listado de planos por especialidad, arquitectura, estructuras, instalaciones eléctricas y sanitarias, equipamiento y otros documentos según tipología.

El bloque presupuestal del MEF enumera expresamente: **cuadro resumen de presupuesto; presupuesto de obra; presupuesto desagregado; análisis de gastos generales; análisis de costos unitarios; planilla de metrados; relación de insumos generales y por grupos; fórmulas polinómicas; cronograma valorizado de ejecución, calendario de adquisición de materiales y cronograma en MS Project; y programa PERT-CPM**. La fuente también remite al Reglamento Nacional de Edificaciones, normas de metrados, normativa de contrataciones y normas sectoriales.

La presentación MEF [“Pautas para elaborar un expediente técnico más eficiente”](https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf) confirma la misma división por bloques y advierte que el listado se sostiene en normas generales y/o sectoriales. Es útil como lista de comprobación, no como sustituto de la norma o del TDR del sector.

### 2.2 MEF: Reglamento de la Ley de Contrataciones (documento público consultado)

El [Reglamento de la Ley de Contrataciones del Estado publicado por MEF](https://www.mef.gob.pe/contenidos/comunicado/RLCE/Proyecto_Reglamento_LCE.pdf), en el artículo 13 reproducido en el documento consultado, establece para ejecución de obras que el valor referencial corresponde al monto del **presupuesto de obra del expediente técnico aprobado**. Para obtenerlo, la entidad o consultor debe realizar indagaciones de mercado que permitan contar con APU por partida y subpartida, considerando insumos requeridos, cantidades, precios o tarifas, gastos generales variables y fijos y utilidad. El presupuesto debe estar suscrito por quienes participaron en su elaboración y/o aprobación.

Esta regla fundamenta el flujo ARKI: evidencia de mercado → precios de insumos → APU por partida → presupuesto de obra → valor referencial. También permite actualizar la estimación cuando varían sustancialmente las condiciones de mercado, pero una actualización debe conservar el motivo, fecha y evidencia; no debe sobrescribir silenciosamente el presupuesto anterior.

**Caveat jurídico:** el documento consultado se titula “Proyecto Reglamento LCE” en la URL del MEF; para una decisión contractual real ARKI debe verificar la versión vigente y sus modificatorias en el portal oficial correspondiente. No debe presentarse este PDF como la norma vigente sin esa comprobación.

### 2.3 INEI: índices de precios de construcción

La [Metodología de los Índices Unificados de Precios de la Construcción (IUPC)](https://www.inei.gob.pe/media/MenuRecursivo/6_1.pdf) del INEI define los IUPC como indicadores de la fluctuación promedio de los precios de los elementos que intervienen en el costo de obras civiles. El periodo base es julio de 1992; la cobertura se organiza en seis áreas geográficas: Área 1 (Tumbes, Piura, Lambayeque, La Libertad, Cajamarca, Amazonas y San Martín), Área 2 (Áncash, Lima, Callao e Ica), Área 3 (Huánuco, Pasco, Junín, Huancavelica, Ayacucho y Ucayali), Área 4 (Arequipa, Moquegua y Tacna), Área 5 (Loreto) y Área 6 (Cusco, Puno, Apurímac y Madre de Dios).

El INEI señala que estos índices se usan exclusivamente para reajustar presupuestos de obras públicas y privadas contratadas conforme a su estructura de costos. Se calculan mensualmente a partir de información de fabricantes y/o distribuidores; la metodología menciona aproximadamente 272 elementos, alrededor de 549 empresas informantes, 68 índices y formularios con características del bien para asegurar comparabilidad. Entre los índices aparecen acero, agregados, alambre, asfalto, cemento, cerámica, flete, mano de obra, maquinaria, diésel, pintura, tuberías y concreto premezclado.

**Uso correcto en ARKI:** IUPC = referencia/serie estadística para reajuste o análisis temporal; no equivale automáticamente a la cotización de un saco, tubería o equipo en una localidad determinada, ni contiene por sí mismo flete, IGV o condiciones de entrega de una compra concreta. Debe registrarse el código IUPC, área geográfica, periodo y boletín, y mantenerlo separado de observaciones directas.

### 2.4 MEF: Guía Nacional BIM

La [Guía Nacional BIM del MEF](https://www.mef.gob.pe/planbimperu/docs/recursos/guia_nacional_BIM.pdf) describe la gestión de información alineada con NTP-ISO 19650-1:2021 y NTP-ISO 19650-2:2021. Define:

* **OIR (Organizational Information Requirements):** requisitos de información organizacionales.
* **AIR (Asset Information Requirements):** requisitos de información de activos, orientados a la operación.
* **PIR (Project Information Requirements):** requisitos de información del proyecto para decisiones y hitos.
* **EIR (Exchange Information Requirements):** requisitos de intercambio ligados a una designación, que especifican contenido, estructura, metodología y entregables; se incorporan a TDR o documento equivalente.
* **PIM (Project Information Model):** modelo de información de formulación/evaluación y ejecución.
* **AIM (Asset Information Model):** modelo de información de la fase de funcionamiento.
* **CDE (Common Data Environment):** fuente acordada para recolectar, gestionar y difundir contenedores de información.
* **LOIN (Level of Information Need):** nivel de información necesaria, que cubre información gráfica y no gráfica; no debe confundirse mecánicamente con un LOD único.
* **MIDP/TIDP:** programa general de desarrollo de información y programa de desarrollo de información de una tarea, con entregable, formato, fecha y responsabilidad.

La guía insiste en que un modelo de información contiene contenedores estructurados y no estructurados; un contenedor puede ser un modelo 3D, documento, tabla, reporte, video, base de datos o subconjunto. La Parte que Designa verifica requisitos y aprueba entregables; la Parte Designada Principal responde a TDR, coordina equipos y controla calidad; las Partes Designadas producen la información. ARKI puede reutilizar esa cadena de responsabilidades, pero nunca debe inventar el EIR, LOIN, fecha/hito, formato, rol o nivel de seguridad si el TDR no los define.

### 2.5 MEF: instructivo del Formato N.° 05 — BEP

El [Instructivo del Formato N.° 05: Registro del Plan de Ejecución BIM (BEP)](https://www.mef.gob.pe/contenidos/inv_publica/anexos/instructivo_formato5_RD0005_2021EF6301.pdf) define BEP como el documento que establece metodología de trabajo, procesos, características técnicas, roles, responsabilidades y entregables que responden a los requisitos de información. Señala que puede actualizarse durante diseño y construcción con aprobación de las partes.

El formato BEP tiene tres secciones: **A**, aspectos generales de la inversión y del equipo de ejecución (características, alcance, objetivos y responsabilidades); **B**, estrategia de entrega de información (producción colaborativa, organización, recursos informáticos, federación, movilización y estrategia de entrega); y **C**, propuesta de modificación/adición de normas de información, métodos y procedimientos de producción. Esos campos son reutilizables para un formulario ARKI; sus valores concretos deben venir del proyecto.

### 2.6 Contraloría/BID: especificación pública de entregables BIM

El [Anexo de Especificaciones Técnicas Generales para el uso del BIM](https://doc.contraloria.gob.pe/BID/2022/BID_SCC280/Anexo02_Esp_Tecnicas_Generales_para_el_uso_del_BIM.pdf), publicado en el dominio de Contraloría, contiene un ejemplo de TDR BIM con cuatro entregables:

1. **Primer entregable:** PEB/BEP, que define alcance, objetivos, metodología, interacción, roles, funciones, hitos y productos para modelo de diseño y As Built; además, organigrama, flujograma, CDE, matriz de roles, aseguramiento de calidad, reuniones, coordinación y gestión de interferencias.
2. **Segundo entregable:** planos BIM del expediente técnico definitivo de arquitectura, estructuras, mobiliario e instalaciones (mecánicas, eléctricas, comunicaciones, sanitarias, alarma y seguridad) y modelo coordinado **LOD 300**.
3. **Tercer entregable:** actualización de los entregables anteriores; metrados obtenidos del software BIM en Excel, ordenados según el itemizado del presupuesto y contrastados con metrados manuales; video de simulación 4D/recorrido virtual.
4. **Cuarto entregable:** modelo BIM **As Built LOD 350**, planos exportados a PDF y CAD, información real de control de calidad y órdenes de cambio, especificaciones realmente ejecutadas, garantías y proveedor/contacto.

El mismo documento describe unidades sugeridas para modelos y cantidades (distancia m, área m², volumen m³, ángulos en grados y pendientes en porcentaje, con redondeos definidos), contenido nativo, coordinación y tolerancias. Es una referencia concreta para el esquema de campos, pero **no debe convertirse en una regla universal**: LOD, especialidades, software, formatos, tolerancias y número de entregables dependen de los EIR/TDR.

### 2.7 TDR público de la Municipalidad Provincial de Huaral: cotizaciones y costos

El [TDR público para elaboración de expediente técnico de la Municipalidad Provincial de Huaral](http://web.munihuaral.gob.pe/MuniHuaral/pdfs/SERVICIO%20DE%20CONSULTORIA%20DE%20OBRA%20PARA%20LA%20ELABORACION%20DE%20EXPEDIENTE%20TECNICO%20MEJORAMIENTO%20DEL%20SERVICIO%20DE%20ESPACIOS%20PUBLICOS%20URBANOS%20EN%20EL%20AA.HH%20SANTA%20HILDA%20LAS%20FLORES%20DE%20URB.%20HUANDO%20URB.%20CAPULLANA%202DA%20ETAPA%20ASO.pdf) es evidencia pública de una práctica documental, no una norma nacional automática. Exige sustentar el APU con mano de obra, materiales, herramientas y equipos; sustentar precios mediante cotizaciones originales (mínimo dos); presentar tres cotizaciones de diferentes proveedores locales, en proformas membretadas y firmadas; sustentar mano de obra; y calcular rendimientos de maquinaria.

Ese TDR desagrega costo directo, gastos generales, utilidad, costo parcial, IGV (18% en el formato consultado), costo de ejecución, gestión y supervisión. También exige relación de insumos por mano de obra, materiales y equipos, fórmula polinómica y cálculo detallado de flete terrestre/urbano, usando cotizaciones locales, declaraciones juradas o compromisos de beneficiarios cuando corresponda.

**Caveat:** ARKI debe guardar “dos cotizaciones mínimas” y “tres proveedores” como reglas configurables del TDR, no como una presunción jurídica para todas las entidades. El IGV de 18% y cualquier inclusión/exclusión de flete, transporte, seguros o entrega deben leerse del documento y la fecha aplicables.

## 3. Estructura de datos reutilizable para ARKI

### 3.1 Registro del expediente y documentos

| Campo | Uso | ¿Se puede reutilizar? |
|---|---|---|
| `project_id`, CUI, entidad, sector, modalidad, ubicación | Identificación y trazabilidad | Sí, como esquema; valores sólo si están documentados |
| `document_id`, nombre, tipo, versión, fecha de emisión, fecha de actualización | Control documental | Sí |
| `source_url`, entidad emisora, página/sección, hash o archivo | Evidencia verificable | Sí; obligatorio para datos sensibles |
| `approval_status`, acto/resolución, fecha y firmantes | Validez administrativa | Sólo desde el documento aprobado |
| `normative_basis` y `sector` | Determina requisitos aplicables | Sí como campo; no rellenar norma por defecto |
| `discipline`, especialidad, revisión, responsable | Coordinación técnica | Sí |
| `coordinates_utm`, datum, zona, área geográfica INEI | Ubicación y referencia de precios | Sí, con fuente |

### 3.2 Entregables técnicos/documentales

| Grupo | Campos mínimos recomendados |
|---|---|
| Estudios | topografía, suelos/geotecnia, hidrología/hidráulica, riesgos, impacto ambiental, disponibilidad de servicios, interferencias, sostenibilidad, diagnóstico y fecha de levantamiento |
| Memorias | resumen ejecutivo, ficha técnica, memoria descriptiva, memoria de cálculo, criterios de diseño, supuestos y límites |
| Especificaciones | código/nombre de partida, alcance, materiales, desempeño, procedimiento, control de calidad, unidad de medida, norma citada |
| Planos | código, título, especialidad, escala, sistema de coordenadas, revisión, fecha, autor, aprobador, formato, vínculo a partida/elementos |
| Metrados | partida, descripción, unidad, fórmula, dimensiones, ubicación, plano/modelo fuente, versión, método (manual/BIM), verificador |
| Presupuesto | itemizado, partida, unidad, metrado, PU, parcial, costo directo, gastos generales fijos/variables, utilidad, impuestos, fletes, total, fecha de determinación |
| Cronogramas | actividades, duración, precedencias, calendario, hitos, avance valorizado, compras, PERT-CPM/MS Project, versión |
| Anexos | cotizaciones, fotografías, permisos, ensayos, certificados, declaraciones, actas, cálculos de flete y fórmula polinómica |

## 4. Campos BIM para ARKI

Estos son campos reutilizables como metadatos y validaciones, no datos que deban inventarse:

* **Gobernanza:** `oir`, `air`, `pir`, `eir`, objetivos BIM, usos BIM aprobados, hitos de decisión, parte que designa, parte designada principal, partes designadas.
* **Planificación:** versión y estado del BEP/PEB, autor, aprobadores, alcance, objetivos de colaboración, estrategia de federación, recursos de software/hardware, capacitación y movilización.
* **Entregas:** `midp_id`, `tidp_id`, tarea, responsable, aprobador, fecha/hito, estado, formato, nombre de archivo, revisión, contenedor, ruta CDE, permisos y nivel de seguridad.
* **Modelo:** PIM/AIM, modelo disciplinar, modelo federado, software y versión, sistema de coordenadas, unidades, origen, tolerancias, LOIN (gráfico/no gráfico), LOD cuando el TDR lo exija, clasificación, codificación y parámetros.
* **Elementos:** GUID/identificador, categoría, especialidad, ubicación, geometría, material, tipo, sistema, especificación vinculada, partida/itemizado, unidad, cantidad, fase, fabricante/proveedor cuando esté confirmado, garantía y contacto para As Built.
* **Coordinación y calidad:** incidencias/interferencias, fecha, elementos afectados, tolerancia, responsable, resolución, evidencia de revisión, informes de reunión ICE, controles de calidad y aprobación.
* **Exportación:** PDF/CAD/IFC/RVT/Excel/video u otro formato sólo si aparece en EIR/TDR/BEP; conservar versión, fecha de exportación y modelo fuente.
* **As Built:** cambios aprobados, órdenes de cambio, control de calidad real, especificación instalada, pruebas, garantías, proveedor/contacto y fecha de actualización. Nunca transformar “diseñado” en “construido” sin acta, plano redline, certificado o registro de obra.

## 5. Modelo de costos: separación obligatoria

### 5.1 Tipos de dato

| Tipo | Definición operativa en ARKI | Evidencia requerida | No confundir con |
|---|---|---|---|
| **Precio observado** | Precio capturado de una fuente en una fecha y condición concreta; puede ser cotización, catálogo, factura pública, lista de proveedor o índice | URL/archivo, proveedor o entidad, fecha, producto exacto, unidad, lugar y condiciones | PU final de una partida |
| **Precio unitario de insumo** | Precio normalizado que entra al APU (por kg, m³, bolsa, hora, día, etc.) | Precio observado + conversión documentada, unidad y alcance de entrega | Precio total de compra sin normalizar |
| **APU / precio unitario de partida** | Composición de mano de obra, materiales, equipos y herramientas con cantidades/rendimientos, precio de cada insumo y costo directo | Hoja APU, especificación, metrado/rendimiento sustentado y fuentes de precios | Cotización de un proveedor |
| **Cotización** | Oferta/proforma de proveedor para un bien/servicio, con vigencia y condiciones | Documento original, membrete/firma cuando lo exija TDR, RUC/proveedor, fecha, vigencia, especificación, cantidad, entrega, moneda e impuestos | Índice estadístico INEI |
| **Presupuesto** | Suma de metrado × APU, más gastos generales, utilidad, impuestos, fletes y otros componentes aplicables | Presupuesto firmado/aprobado, fecha de determinación, itemizado, APU, metrados y anexos | Estimación preliminar sin aprobación |
| **Índice/referencia** | Serie oficial, por ejemplo IUPC INEI, usada para reajuste o comparación temporal | Código, periodo, área geográfica, boletín/metodología y fórmula | Precio local de mercado |

### 5.2 Campos mínimos por registro de costo

`cost_id`; `project_id`; `item_code`; `description`; `cost_type` (observed, input_unit_price, APU, quotation, budget, index); `discipline`; `specification_ref`; `unit`; `quantity`; `yield/rendimiento`; `unit_price`; `currency` (PEN/USD/etc.); `tax_status` (incluido/excluido/no informado); `IGV_rate` sólo si está explícito; `subtotal`; `freight`; `insurance`; `delivery_terms`; `location`; `region`; `INEI_area` si aplica; `supplier`; `supplier_ruc`; `quotation_number`; `quotation_date`; `valid_until`; `observed_date`; `budget_date`; `source_url`; `source_document`; `page`; `evidence_status`; `confidence`; `normalization_method`; `exchange_rate_source/date` si hay moneda extranjera; `approver`; `notes`.

### 5.3 Reglas de cálculo y procedencia

1. **No mezclar fechas.** `observed_date`, `quotation_date`, `budget_date` y `approval_date` son campos distintos. Si una cotización no tiene fecha, registrar `unknown`, no inferirla desde la URL.
2. **No mezclar regiones.** La ubicación de la obra y la del proveedor deben quedar separadas. Para IUPC guardar área INEI; para cotizaciones guardar ciudad/departamento y si el precio incluye traslado.
3. **No asumir moneda.** En Perú suele observarse PEN, pero ARKI debe leer el símbolo y el documento. Para USD registrar tipo de cambio, fecha y fuente sólo cuando se convierta.
4. **No asumir impuestos.** Separar base imponible, IGV y total. “IGV 18%” del TDR de Huaral es un dato de ese formato; no debe aplicarse universalmente ni duplicarse si la cotización ya es “incluido IGV”.
5. **No ocultar fletes.** Flete terrestre, urbano, transporte, seguro, descarga y entrega son componentes separados; su inclusión en el PU debe quedar explícita.
6. **No usar índices como cotizaciones.** Un IUPC no prueba que un proveedor local venda al mismo precio en la fecha del presupuesto.
7. **No extrapolar rendimientos.** El rendimiento de mano de obra o maquinaria debe proceder de APU, experiencia documentada, manual técnico, ensayo o criterio profesional firmado; si falta, marcar `unknown`/`requires_engineer`.
8. **Trazabilidad de APU.** Cada partida debe vincular su unidad y especificación con los insumos, cantidades, rendimiento y fuentes de precios. El metrado del modelo debe contrastarse con revisión manual cuando el TDR lo exige.
9. **Cotizaciones como evidencia.** Guardar el original y metadatos; registrar el número de cotizaciones exigido por el TDR. No contar capturas sin proveedor, fecha, especificación o condición comercial como cotización completa.
10. **Versionado.** Una actualización debe crear una revisión con causa, fecha, usuario y evidencia; no sobrescribir el costo histórico.

## 6. Qué no debe inventar ARKI

ARKI no debe fabricar CUI, ubicación, coordenadas, estudio de suelos, metrado, rendimiento, precio, proveedor, RUC, fecha, vigencia, moneda, IGV, flete, fórmula polinómica, firma, aprobación, LOD/LOIN, formato IFC/RVT, entregable BIM, tolerancia, modelo As Built, garantía, número de cotizaciones ni estado “aprobado”. Tampoco debe deducir que un plano existe porque aparece una disciplina en una plantilla; que un precio INEI es una cotización; que una cotización está vigente por ser reciente en internet; que el precio incluye impuestos o transporte; o que el expediente es legalmente convocable sólo porque todos los campos de una lista están completos.

Cuando falte información, el sistema debe mostrar explícitamente **No informado**, **Pendiente de evidencia**, **No aplica (justificar)** o **Requiere validación del especialista**, y conservar el motivo. Los valores calculados deben distinguirse de los valores observados y mostrar fórmula, fuente y fecha.

## 7. Lista de control sugerida para el producto ARKI

1. Clasificar inversión por sector, tipo, entidad y etapa.
2. Seleccionar la plantilla MEF/sectorial aplicable y registrar su fuente normativa.
3. Crear índice documental y matriz de entregables; asignar responsable, estado, revisión, fecha y evidencia.
4. Para BIM, capturar OIR/AIR/PIR/EIR, usos, LOIN, BEP, MIDP/TIDP, CDE, roles y formatos únicamente desde TDR/BEP/guía aprobada.
5. Vincular cada plano, especialidad, especificación, metrado y elemento BIM con su revisión y fuente.
6. Capturar precios observados y cotizaciones como registros independientes; normalizar unidades sin borrar el dato original.
7. Construir APU por partida con insumos, rendimientos, unidades, fuentes, fecha y región.
8. Calcular presupuesto conservando costo directo, gastos generales, utilidad, fletes, impuestos y total por separado.
9. Validar coherencia plano–especificación–metrado–APU–presupuesto y modelo BIM–Excel/manual.
10. Emitir lista de faltantes y advertencias, no completar silenciosamente.
11. Generar una matriz de aprobación y firmas; un expediente “completo” no equivale a “aprobado”.
12. Guardar archivos originales, URL, fecha de consulta, página y hash o identificador de versión.

## 8. Fuentes consultadas

* MEF, [Pautas y recomendaciones para la elaboración de Expedientes Técnicos](https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf).
* MEF, [Pautas para elaborar un expediente técnico más eficiente](https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Pautas_para_elaborar_expediente_tecnico.pdf).
* MEF, [Guía Nacional BIM](https://www.mef.gob.pe/planbimperu/docs/recursos/guia_nacional_BIM.pdf).
* MEF, [Instructivo del Formato N.° 05: Registro del Plan de Ejecución BIM – BEP](https://www.mef.gob.pe/contenidos/inv_publica/anexos/instructivo_formato5_RD0005_2021EF6301.pdf).
* Contraloría General de la República/BID, [Anexo: Especificaciones Técnicas Generales para el uso del BIM](https://doc.contraloria.gob.pe/BID/2022/BID_SCC280/Anexo02_Esp_Tecnicas_Generales_para_el_uso_del_BIM.pdf).
* INEI, [Metodología de los Índices Unificados de Precios de la Construcción](https://www.inei.gob.pe/media/MenuRecursivo/6_1.pdf).
* MEF, [Proyecto de Reglamento de la Ley de Contrataciones del Estado](https://www.mef.gob.pe/contenidos/comunicado/RLCE/Proyecto_Reglamento_LCE.pdf), consultado como documento público; comprobar versión vigente y modificatorias antes de usarlo jurídicamente.
* Municipalidad Provincial de Huaral, [TDR de consultoría para elaboración de expediente técnico](http://web.munihuaral.gob.pe/MuniHuaral/pdfs/SERVICIO%20DE%20CONSULTORIA%20DE%20OBRA%20PARA%20LA%20ELABORACION%20DE%20EXPEDIENTE%20TECNICO%20MEJORAMIENTO%20DEL%20SERVICIO%20DE%20ESPACIOS%20PUBLICOS%20URBANOS%20EN%20EL%20AA.HH%20SANTA%20HILDA%20LAS%20FLORES%20DE%20URB.%20HUANDO%20URB.%20CAPULLANA%202DA%20ETAPA%20ASO.pdf), usado como ejemplo público de requisitos de cotización, flete y APU.

## 9. Incertidumbres y límites de esta investigación

* La composición exacta del expediente varía por sector, tipología, entidad, modalidad, etapa y TDR; el MEF presenta listas por sectores, no una única plantilla universal.
* La guía BIM define el marco de información, pero el TDR/EIR del proyecto debe fijar usos, LOIN, formatos, software, tolerancias, hitos y entregables concretos.
* El anexo de Contraloría/BID muestra LOD 200/300/350, 4D, IFC/CAD/PDF y As Built como especificaciones de un proyecto; no prueba que esos valores sean obligatorios para toda obra peruana.
* El TDR de Huaral exige dos cotizaciones mínimas para sustentar precios y tres cotizaciones de proveedores para materiales; es una exigencia del documento consultado y debe parametrizarse, no generalizarse.
* La metodología IUPC del INEI es estadística y de reajuste; no reemplaza cotizaciones locales, ni determina automáticamente IGV, flete, entrega o precio final.
* Se consultó un documento denominado “Proyecto Reglamento LCE”; la vigencia normativa debe revisarse contra la versión oficial consolidada vigente antes de generar una recomendación legal o contractual.
* No se debe inferir precios actuales, disponibilidad, vigencia de cotizaciones ni aprobación del expediente a partir de esta investigación; esos datos requieren documentos del proyecto y validación del profesional responsable.

---

**Resultado operativo para ARKI:** construir un expediente como una red trazable de documentos, modelos, métricos, costos y aprobaciones. La interfaz puede reutilizar el esquema de campos, reglas y estados descrito aquí, pero los valores deben ser cargados desde fuentes del proyecto, con fecha, región, moneda, impuestos, flete, responsable y evidencia.
