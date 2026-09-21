# ARKI — Estructuras, predimensionamiento e infraestructura civil

**Alcance:** predimensionamiento estructural, concreto, acero, geotecnia, puentes, carreteras, pavimentos, hidráulica y represas.  
**Estado de la investigación:** revisión documental orientada a especificar qué debería estudiar y pedir un motor de apoyo técnico. No constituye memoria de cálculo, expediente técnico, certificación, aprobación administrativa ni opinión legal. La vigencia exacta de una edición normativa debe verificarse contra el texto oficial aplicable al proyecto, su fecha y la autoridad competente.

## 1. Resumen ejecutivo

ARKI puede ser útil como **asistente de pre-diseño, trazabilidad y control de entradas**, pero no debe presentarse como sustituto del ingeniero responsable ni como mecanismo que “garantiza cumplimiento”. El alcance es heterogéneo: una edificación, una carretera, un puente, una obra de drenaje y una represa tienen objetivos, datos de campo, modos de falla, autoridades y marcos normativos distintos.

Para proyectos en Perú, la primera bifurcación del motor debe ser **jurisdicción + tipo de obra + fase**. El Reglamento Nacional de Edificaciones (RNE) es presentado por el Ministerio de Vivienda, Construcción y Saneamiento como norma técnica de cumplimiento obligatorio para entidades públicas y personas naturales o jurídicas privadas que proyecten o ejecuten habilitaciones urbanas y edificaciones en el territorio nacional. La página oficial de SENCICO identifica, entre otras, las normas E.020 Cargas, E.030 Diseño sismorresistente, E.050 Suelos y cimentaciones, E.060 Concreto armado y E.090 Estructuras metálicas, y enlaza sus actualizaciones publicadas. Estas referencias no deben extrapolarse automáticamente a carreteras, puentes o represas. [1] [2]

Para infraestructura vial peruana, el MTC publica un compendio de normas vigentes que incluye los manuales de Diseño Geométrico; Suelos, Geología, Geotecnia y Pavimentos; Ensayo de Materiales; Puentes; e Hidrología, Hidráulica y Drenaje. Las resoluciones consultadas califican varios de estos manuales como documentos normativos y de cumplimiento obligatorio conforme al artículo 18 del Reglamento Nacional de Gestión de Infraestructura Vial. [3] [4] [5] [6]

El motor debe separar tres productos distintos:

1. **Orientación educativa:** explicación de conceptos, alternativas y variables.
2. **Predimensionamiento:** rangos o propuestas preliminares con hipótesis visibles, sensibilidad y advertencias.
3. **Diseño verificable:** cálculos, planos, especificaciones, revisión independiente, control de calidad, firma y aprobación de profesionales y autoridades competentes. ARKI no debe etiquetar el segundo como el tercero.

Las referencias internacionales sirven para estudiar fundamentos y para proyectos cuyo contrato, propietario o autoridad las adopte. Entre las fuentes verificadas: ACI CODE-318-25 cubre requisitos mínimos para materiales, diseño y detallado de concreto estructural, con resistencia, servicio, durabilidad, combinaciones de carga, anclajes, empalmes, documentación, inspección y evaluación de estructuras existentes; AISC 360 establece requisitos generalmente aplicables al diseño y construcción de edificios y otras estructuras de acero e incorpora LRFD y ASD; la familia Eurocodes cubre bases de diseño, acciones, concreto, acero, geotecnia y sismo, con partes específicas para puentes; AASHTO LRFD se describe oficialmente como destinado al diseño, evaluación y rehabilitación de puentes; FHWA HEC-18 trata diseño, evaluación e inspección de puentes frente a socavación; y USBR ofrece estándares para represas de terraplén y otras instalaciones. [7] [8] [9] [10] [11] [12]

**Conclusión operativa:** el sistema debe fallar de forma segura cuando falten ubicación, uso, geometría, cargas, estudio de suelo, amenaza sísmica, hidrología, tránsito, materiales o edición normativa. “UNKNOWN” debe ser un estado explícito y bloqueante cuando no sea posible verificar un dato o una regla. La salida debe incluir hipótesis, fuente y versión; nunca una afirmación genérica de cumplimiento.

## 2. Materias curriculares que ARKI debe estudiar

La siguiente malla contiene **13 materias**. Cada materia debe enseñarse en dos capas: fundamentos generales y aplicación contextualizada a Perú, con comparación internacional sin mezclar reglas.

### 2.1 Bases de modelación, acciones y confiabilidad estructural

Debe cubrir equilibrio, compatibilidad, resistencia y servicio; idealizaciones de barras, placas, cascarones y sólidos; análisis lineal y no lineal; estados límite; combinaciones de carga; incertidumbre de acciones y resistencias; estabilidad global y local; y lectura crítica de resultados numéricos. El motor debe distinguir carga permanente, sobrecarga, viento, sismo, temperatura, retracción, fluencia, empujes, agua, construcción, impacto y acciones accidentales según la obra. E.020 es el ancla peruana identificada para cargas de edificaciones; EN 1990 y EN 1991 son referencias internacionales de bases y acciones, no sustitutos automáticos del RNE. [2] [9]

### 2.2 Predimensionamiento estructural y coordinación de sistemas

Debe estudiar selección de sistema resistente, rutas de carga, luces, apoyos, regularidad, juntas, diafragmas, derivas, esbeltez, continuidad, compatibilidad con arquitectura e instalaciones y constructibilidad. La salida debe ser un **rango condicionado**, no una dimensión única sin respaldo. Un predimensionamiento no puede resolver detalles de ductilidad, conexiones, anclajes, interacción suelo-estructura, fuego, durabilidad, ejecución ni cambios de uso.

### 2.3 Dinámica y diseño sismorresistente

Debe cubrir peligro sísmico, espectros, masa y rigidez, torsión, irregularidad, interacción modal, derivas, ductilidad, disipación, diseño por capacidad, aislamiento y evaluación de existentes. Para Perú, E.030 es la referencia del RNE identificada por las páginas oficiales; SENCICO también registra una actualización de E.030, por lo que el motor debe recuperar y congelar la edición oficial aplicable a la fecha del proyecto, no asumir que una copia histórica sigue vigente. Para comparación, EN 1998 trata estructuras en regiones sísmicas y AISC 341 es una referencia internacional especializada de acero sísmico; su uso no prueba cumplimiento peruano. [1] [2] [9]

### 2.4 Concreto armado, pretensado y durabilidad

Debe estudiar propiedades del concreto y acero de refuerzo, flexión, corte, punzonamiento, torsión, compresión, confinamiento, longitudes de desarrollo, empalmes, anclajes, fisuración, deformaciones, durabilidad, exposición, colocación, curado, control de calidad, prefabricado, shotcrete y pretensado. E.060 es el ancla peruana de concreto armado listada por SENCICO/MVCS. ACI 318-25 es una referencia internacional reconocida cuyo alcance incluye resistencia, servicio, durabilidad, combinaciones, análisis, anclajes, empalmes, documentación, inspección y evaluación de existentes; no debe ser mostrado como norma peruana. [1] [2] [8]

### 2.5 Acero estructural y conexiones

Debe cubrir propiedades y clasificación de perfiles, tracción, compresión, flexión, pandeo, pandeo lateral-torsional, placas, soldaduras, pernos, fatiga, estabilidad, corrosión, montaje y tolerancias. E.090 es el ancla peruana listada para estructuras metálicas. AISC 360 es referencia internacional de diseño y construcción de acero, con LRFD y ASD; deben solicitarse método, unidades, especificación de material, soldadura, pernos y norma de ejecución, porque una fórmula de acero no identifica por sí sola la norma aplicable. [1] [2] [8]

### 2.6 Geotecnia, exploración y cimentaciones

Debe cubrir investigación de campo y laboratorio, estratigrafía, clasificación, nivel freático, resistencia al corte, consolidación, asentamientos, capacidad portante, expansividad, colapsabilidad, licuación, estabilidad de taludes, excavaciones, sostenimiento, rellenos, pilotes, cimentaciones superficiales y profundas, interacción suelo-estructura y control de incertidumbre. E.050 es el ancla peruana de suelos y cimentaciones para el ámbito RNE. El Manual MTC de Suelos, Geología, Geotecnia y Pavimentos es ancla vial separada y fue aprobado como documento normativo y de cumplimiento obligatorio según la resolución consultada. EN 1997 es referencia internacional de geotecnia y se usa junto con EN 1990; su aplicación sísmica debe complementarse con EN 1998. [2] [4] [9]

### 2.7 Materiales, ensayos, control y aseguramiento de calidad

Debe estudiar muestreo, trazabilidad, ensayos de concreto, acero, suelos, agregados, asfalto y materiales de base; aceptación; incertidumbre de medición; inspección; no conformidades; y relación entre especificación, ensayo y decisión. En vialidad, el compendio MTC identifica un Manual de Ensayo de Materiales. El motor debe distinguir un resultado de laboratorio, una especificación contractual y una hipótesis de cálculo. Si falta certificado o ensayo requerido, debe emitir “UNKNOWN” y detener conclusiones de aceptación. [3]

### 2.8 Puentes y obras de paso

Debe cubrir concepción, superestructura, subestructura, apoyos, juntas, cargas de tránsito, fatiga, sismo, interacción con cauce, socavación, estribos, pilas, cimentaciones, construcción por etapas, inspección, evaluación y rehabilitación. En Perú, la RD N.° 19-2018-MTC/14 aprobó el Manual de Puentes y declara que es normativo y de cumplimiento obligatorio conforme al artículo 18 citado en la resolución. AASHTO LRFD es referencia internacional para diseño, evaluación y rehabilitación; FHWA HEC-18 es guía internacional para socavación y se complementa con HEC-20 y HEC-23. [3] [6] [11] [14]

### 2.9 Carreteras y diseño geométrico

Debe cubrir clasificación funcional, velocidad de diseño, alineamiento horizontal y vertical, sección transversal, visibilidad, intersecciones, drenaje, seguridad vial, tránsito, derecho de vía, topografía, geología y construcción. El Manual MTC de Diseño Geométrico fue aprobado como documento normativo y de cumplimiento obligatorio en la resolución consultada. No debe confundirse diseño geométrico con diseño estructural de pavimento ni con diseño hidráulico. [3] [5]

### 2.10 Pavimentos flexibles, rígidos y soluciones de bajo volumen

Debe estudiar tránsito acumulado y espectro de ejes, clima, drenaje, subrasante, materiales, capas, compactación, fatiga, ahuellamiento, erosión, juntas, transferencia de carga, mantenimiento y evaluación de condición. El Manual MTC de Suelos, Geología, Geotecnia y Pavimentos es referencia peruana vial identificada oficialmente; las metodologías AASHTO/FHWA mecanístico-empíricas son referencias internacionales que requieren calibración, datos locales y adopción contractual. ARKI no debe convertir CBR, ESAL o un espesor de catálogo en una garantía de vida útil. [3] [4] [15]

### 2.11 Hidrología, hidráulica, drenaje y erosión

Debe cubrir cuencas, series de lluvia y caudal, períodos de retorno, tormentas de diseño, tiempo de concentración, hidrogramas, flujo en canales y tuberías, alcantarillas, cunetas, subdrenaje, disipación, sedimentos, socavación, inundación, obstrucciones y mantenimiento. El Manual MTC de Hidrología, Hidráulica y Drenaje se describe como guía para parámetros hidrológicos e hidráulicos de obras viales; su texto reconoce incertidumbres y carácter general/orientativo, y la RD N.° 20-2011-MTC/14 lo califica como normativo y obligatorio en el marco vial consultado. El motor debe mostrar el origen de la lluvia, el método y el análisis de sensibilidad. [3] [7]

### 2.12 Represas, presas y seguridad de obras hidráulicas mayores

Debe cubrir selección del tipo de presa, geología y fundación, materiales, estabilidad estática y sísmica, filtración, drenaje interno, filtros, erosión interna, borde libre, aliviaderos, descargas, transitorios, deformaciones, instrumentación, auscultación, operación, emergencia y consecuencias aguas abajo. USBR Design Standards No. 13 incluye capítulos para represas de terraplén sobre diseño general, fundación, estabilidad, filtros, borde libre, riprap, filtración, deformación, construcción, instrumentación, investigación de fundación/materiales y análisis sísmico. USACE describe la seguridad de represas como un programa que abarca estructuras existentes y nuevas, evaluación, mejora, diseño, construcción y comunicación de seguridad. Estas fuentes son internacionales y voluntarias fuera de su ámbito institucional; no se verificó en esta investigación un reglamento peruano único y general de represas que ARKI pueda presentar como equivalente. Estado: **UNKNOWN** para un ancla peruana general de represas; se requiere consulta sectorial y del proyecto. [12] [13]

### 2.13 Gestión de proyecto, constructibilidad, mantenimiento y responsabilidad profesional

Debe estudiar fases del proyecto, bases de diseño, documentos IFC, revisión independiente, control de cambios, seguridad durante la construcción, inspección, mantenimiento, monitoreo, gestión de activos y responsabilidades profesionales. El RNE publicado por MVCS incluye G.050 Seguridad durante la construcción en el compendio consultado, pero su aplicación concreta debe verificarse según el tipo de obra y versión. ARKI debe registrar quién aportó cada dato y quién aprobó cada decisión; el software no debe firmar ni atribuirse responsabilidad profesional. [2]

## 3. Anclas normativas y separación Perú/internacional

### 3.1 Perú: edificación y habilitación urbana

- **RNE, MVCS:** la fuente oficial consultada lo describe como norma técnica de cumplimiento obligatorio para entidades públicas y sujetos privados que proyecten o ejecuten habilitaciones urbanas y edificaciones en territorio nacional. [2]
- **E.020 Cargas:** cargas de edificaciones; la página oficial del RNE la lista como norma de estructuras. [1] [2]
- **E.030 Diseño sismorresistente:** diseño sísmico de edificaciones; la página de SENCICO enlaza la norma y registra modificaciones publicadas. La edición aplicable debe ser verificada al abrir el proyecto. [1] [2]
- **E.050 Suelos y cimentaciones:** ancla del RNE para suelos y cimentaciones; no reemplaza una exploración geotécnica. [1] [2]
- **E.060 Concreto armado:** ancla del RNE para concreto armado. [1] [2]
- **E.090 Estructuras metálicas:** ancla del RNE para estructuras metálicas. [1] [2]
- **G.050 Seguridad durante la construcción:** aparece en el compendio oficial consultado; la aplicabilidad, edición y obligaciones específicas deben verificarse para el proyecto. [2]

### 3.2 Perú: infraestructura vial

- **Reglamento Nacional de Gestión de Infraestructura Vial y compendio MTC:** el MTC se identifica como autoridad nacional competente para normas de infraestructura vial y publica una lista de normas vigentes. [3]
- **RD N.° 03-2018-MTC/14, Manual de Carreteras: Diseño Geométrico:** la resolución consultada declara carácter normativo y cumplimiento obligatorio. [5]
- **RD N.° 10-2014-MTC/14, Manual de Carreteras: Suelos, Geología, Geotecnia y Pavimentos:** la resolución consultada aprueba la sección Suelos y Pavimentos y declara carácter normativo y cumplimiento obligatorio. [4]
- **RD N.° 19-2018-MTC/14, Manual de Carreteras: Puentes:** la resolución consultada declara carácter normativo y cumplimiento obligatorio. [6]
- **RD N.° 20-2011-MTC/14, Manual de Carreteras: Hidrología, Hidráulica y Drenaje:** la resolución consultada declara carácter normativo y cumplimiento obligatorio. [7]
- **Manual de Ensayo de Materiales, Especificaciones Técnicas Generales para Construcción, seguridad vial y mantenimiento:** el compendio MTC los identifica como documentos del sistema vial; la edición y aplicabilidad deben fijarse por proyecto y contrato. [3]

### 3.3 Internacionales: referencias comparativas o adoptadas expresamente

- **ACI CODE-318-25:** concreto estructural; incluye materiales, diseño, detallado, resistencia, servicio, durabilidad, inspección y evaluación. Es un código estadounidense/internacional de referencia, no el RNE. [7]
- **AISC 360:** acero estructural; requisitos generalmente aplicables a diseño y construcción, con LRFD y ASD. No sustituye E.090 ni una especificación contractual peruana salvo adopción expresa. [8]
- **Eurocodes EN 1990–EN 1999:** familia europea que cubre bases, acciones, concreto, acero, geotecnia, sismo y otros materiales; sus partes 2 tratan puentes en combinación con partes generales. No equivale automáticamente a la legislación peruana. [9]
- **AASHTO LRFD Bridge Design Specifications:** referencia para diseño, evaluación y rehabilitación de puentes. Debe usarse únicamente si la autoridad, propietario o contrato la adopta, y junto con requisitos locales. [10]
- **FHWA HEC-18, HEC-20 y HEC-23:** referencias de socavación, estabilidad del cauce y contramedidas; HEC-18 explicita que cubre diseño, evaluación e inspección frente a socavación. No reemplaza el Manual MTC en Perú. [11]
- **USBR Design Standards, especialmente DS 13:** referencia para represas de terraplén y componentes de diseño/seguridad; la propia fuente indica que fuera de Reclamation su uso es voluntario. [13]
- **USACE Dam Safety Program:** referencia institucional de gestión de seguridad de represas nuevas y existentes; no es norma peruana. [14]

**Regla de implementación:** cada cálculo debe portar `jurisdiccion`, `tipo_obra`, `norma`, `edicion`, `fecha_de_verificacion`, `seccion_aplicada`, `estado` y `responsable_de_revision`. Si no se puede verificar alguno, el motor debe mostrar **UNKNOWN** y no generar una afirmación de cumplimiento.

## 4. Entradas que el motor debe pedir

El formulario debe ser progresivo, pero no debe permitir que datos ausentes se rellenen silenciosamente con valores supuestos. Los valores por defecto, si se usan para una demostración educativa, deben estar marcados como **EJEMPLO NO VÁLIDO PARA DISEÑO**.

### 4.1 Identidad, alcance y gobernanza

- País, región, provincia, distrito, coordenadas y sistema de referencia.
- Tipo de obra: edificación, puente, carretera, pavimento, drenaje, canal, presa/represa, muro, cimentación u otra.
- Fase: concepto, anteproyecto, predimensionamiento, diseño básico, diseño definitivo, revisión, evaluación de existente, construcción u operación.
- Propietario, autoridad sectorial, uso, categoría de importancia, vida de diseño y consecuencias de falla.
- Norma contractual o reglamentaria indicada por el propietario, autoridad o expediente; edición exacta y fecha de vigencia.
- Profesional responsable, revisor independiente y nivel de revisión requerido.
- Sistema de unidades, convenciones de signos, datum vertical y horizontal, formato de intercambio.

### 4.2 Geometría y configuración

- Planta, elevaciones, luces, alturas, niveles, apoyos, juntas, diafragmas y restricciones.
- Secciones transversales, ejes, peraltes, pendientes, taludes, alineamiento y derecho de vía para carreteras.
- Geometría de cauce, puente, estribos, pilas, cimentaciones, alcantarillas y obras de protección.
- Para represas: tipo, altura, longitud, taludes, zonificación de materiales, fundación, embalse, aliviadero, descargas y obras auxiliares.
- Modelo BIM/CAD o croquis con escala, unidades y versión; historial de cambios.

### 4.3 Uso, cargas y acciones

- Uso y ocupación por ambiente; cargas permanentes y variables; equipos; almacenamiento; vehículos; grúas; temperatura; retracción; fluencia; viento; nieve si aplica; impacto; construcción; agua; sedimentos; empuje de tierras; presión hidrostática e hidrodinámica.
- Para puentes: clase y espectro de tránsito, frenado, fuerza centrífuga, peatones, viento, sismo, temperatura, fatiga, choque y cargas de construcción.
- Para carreteras/pavimentos: volumen y composición de tránsito, crecimiento, ejes equivalentes o espectro de ejes, velocidad, clima y drenaje.
- Combinaciones, factores, método de diseño y estados límite prescritos por la norma seleccionada.

### 4.4 Amenazas y acciones del sitio

- Zonificación o parámetros sísmicos de la norma adoptada, clase de suelo, sitio específico si procede y espectro.
- Viento, inundación, erosión, deslizamiento, licuación, expansión/colapso, corrosión, agresividad química, incendio y acciones geológicas.
- Para cauces: caudales observados y de diseño, lluvias, curvas IDF, niveles, velocidades, transporte sólido, vegetación, obstrucciones y socavación histórica.
- Para represas: avenida extrema, laminación, nivel máximo, operación, escenarios de falla, amenaza aguas abajo, sismo de diseño y sismo máximo considerado según el marco adoptado.

### 4.5 Geotecnia y topografía

- Informe geotécnico firmado, fecha, campaña, número y ubicación de sondeos/calicates/CPT/SPT, perfiles estratigráficos y nivel freático.
- Parámetros con unidades y rango: peso unitario, resistencia al corte, cohesión, fricción, módulo, permeabilidad, consolidación, CBR, granulometría, plasticidad, expansividad y roca.
- Perfil geológico, discontinuidades, fallas, rellenos, cavidades, canteras y fuentes de materiales.
- Topografía de precisión y secciones del cauce; control vertical/horizontal; superficie usada en el modelo.
- Parámetros de cimentación, excavación, sostenimiento, relleno y compactación.

### 4.6 Materiales y ejecución

- Concreto: resistencia especificada, edad, exposición, asentamiento, tamaño máximo, cemento, adiciones, temperatura, curado y control.
- Acero: grado, norma del producto, perfiles, pernos, soldadura, protección anticorrosiva y disponibilidad.
- Pavimento: subrasante, base, subbase, mezcla, ligante, drenaje, compactación, juntas y mantenimiento.
- Presa: materiales de núcleo, filtros, drenes, enrocado, compactación, permeabilidad, instrumentación y procedimiento constructivo.
- Plan de ensayos, criterios de aceptación, inspección, tolerancias, secuencia y restricciones de obra.

### 4.7 Datos de existentes y mantenimiento

- Planos conforme a obra, historial de intervenciones, inspecciones, daños, fisuras, deformaciones, instrumentación y lecturas.
- Calidad y edad de materiales, ensayos de campo, exposición, corrosión, asentamientos y cambios de uso.
- Para puentes y presas: inventario, condición, observaciones de socavación/filtración, planes de acción y registros de operación.
- Objetivo del análisis: diagnóstico, capacidad remanente, rehabilitación, ampliación o cambio de uso.

### 4.8 Metadatos de verificabilidad

- Fuente primaria de cada dato, autor, fecha, archivo, página/sección, método de medición y precisión.
- Estado: `verificado`, `aportado_por_usuario`, `estimado`, `pendiente` o `UNKNOWN`.
- Rango, distribución o sensibilidad cuando un valor no sea puntual.
- Registro de modificaciones y quién autorizó cada supuesto.

## 5. Gates preventivos del motor

Los siguientes gates son **controles de seguridad del producto**, no afirmaciones de que una ley específica los imponga en todos los casos.

1. **Gate de clasificación:** bloquear resultados de diseño hasta identificar jurisdicción, tipo de obra, fase, uso e importancia. Si el proyecto es represa o infraestructura especial y el marco peruano específico no está verificado, mostrar `UNKNOWN` y solicitar autoridad/contrato.
2. **Gate de norma y versión:** exigir una norma primaria y edición fechada. Prohibir mezclar factores de RNE, MTC, ACI, AISC, Eurocodes o AASHTO en una misma verificación sin mapa explícito de compatibilidad.
3. **Gate de datos mínimos:** bloquear predimensionamiento si faltan geometría, cargas principales, material, sistema resistente, suelo cuando haya cimentación, y amenaza dominante. El sistema debe enumerar faltantes, no rellenarlos en silencio.
4. **Gate de geotecnia:** no aceptar capacidad portante, asentamiento, pilote, talud, presa o pavimento como verificables a partir de un suelo genérico. Exigir informe/campaña y marcar parámetros no medidos como `UNKNOWN`.
5. **Gate hidrológico:** no dimensionar drenaje, puente, alcantarilla, aliviadero o protección de cauce sin cuenca, topografía, serie o fuente de lluvia/caudal, período de retorno adoptado y revisión de obstrucción/sedimentos. El resultado debe exponer incertidumbre.
6. **Gate de puente y socavación:** exigir geometría hidráulica, cauce, fundación, sedimentos y escenario de crecida antes de producir una recomendación de pila/estribo. HEC-18 o una guía equivalente no debe ocultar la necesidad de datos locales.
7. **Gate de represa:** bloquear cualquier salida que parezca autorización o diseño final si faltan investigación de fundación/materiales, estabilidad, filtración, sismo, avenida, borde libre, aliviadero, instrumentación, operación y evaluación de consecuencias aguas abajo. La ausencia de una norma peruana general verificada debe quedar explícita.
8. **Gate de unidades y consistencia:** validar unidades, signos, densidades, niveles, datum, escalas, conversiones, combinaciones y compatibilidad de mallas/modelos. Reportar incoherencias antes de calcular.
9. **Gate de plausibilidad:** revisar equilibrio, reacciones, mecanismos, derivas, pandeo, discontinuidades, singularidades, conservación de masa/energía cuando corresponda y sensibilidad a parámetros. Un resultado numérico convergente no equivale a un resultado correcto.
10. **Gate de rango y sensibilidad:** presentar intervalos y escenarios para cargas, suelo, agua, materiales y geometría. Si un cambio razonable altera la decisión, elevar a revisión de ingeniería y no resumirlo en un único número.
11. **Gate de constructibilidad:** advertir si la solución no tiene secuencia, acceso, tolerancias, juntas, drenaje, curado, soldadura, compactación, inspección o mantenimiento definidos.
12. **Gate de revisión humana:** impedir la etiqueta “aprobado”, “seguro”, “conforme” o equivalente sin revisión y firma del profesional competente y, cuando corresponda, aprobación de autoridad. ARKI solo debe generar un expediente de apoyo con trazabilidad.
13. **Gate de cambios:** invalidar resultados derivados cuando cambie geometría, uso, norma, versión, material, suelo, caudal, tránsito o condición existente; obligar a recalcular y mostrar diferencias.
14. **Gate de salida:** cada resultado debe incluir hipótesis, datos faltantes, método, norma/edición, rango, advertencias, responsable de revisión y una frase de no-certificación. Si un requisito no pudo verificarse, escribir literalmente `UNKNOWN`.

## 6. Cautelas y límites

**No inventar requisitos.** La lista curricular y los gates son recomendaciones de diseño del motor. No deben presentarse como obligaciones legales universales. Las obligaciones normativas dependen de jurisdicción, autoridad, tipo de obra, contrato, edición vigente y fase.

**No confundir Perú con referencias internacionales.** El RNE se vincula a edificaciones y habilitaciones urbanas; los manuales MTC citados se vinculan a gestión de infraestructura vial. ACI, AISC, Eurocodes, AASHTO, FHWA, USBR y USACE son referencias internacionales o institucionales. Una fuente internacional puede orientar el método, pero no demuestra cumplimiento peruano.

**No afirmar vigencia absoluta.** Las páginas oficiales muestran fechas y enlaces de publicación. La página de SENCICO registra una actualización de E.030 en 2026; no se debe asumir que un PDF histórico es la edición vigente sin validar la resolución, el texto consolidado y la fecha de aplicación. El motor debe comprobar la fuente oficial cada vez que se inicie un proyecto o se seleccione una edición.

**No usar predimensionamiento para aprobar una obra.** Las proporciones iniciales dependen de luz, sistema, cargas, material, ambiente, construcción y norma. Los resultados pueden ser útiles para iterar alternativas, pero no constituyen planos, memoria de cálculo, especificaciones, metrados, presupuesto, licencia ni permiso de operación.

**No sustituir la investigación de campo.** En geotecnia, hidrología, puentes y represas, un parámetro regional o una correlación no reemplaza sondeos, ensayos, topografía, aforos, inspección o datos de operación. Las correlaciones deben indicar fuente, rango de validez y sensibilidad.

**Incertidumbre hidráulica y geológica.** El Manual MTC de Hidrología, Hidráulica y Drenaje reconoce variables aleatorias, problemas complejos e incertidumbres/riesgos propios de cada proyecto. Por ello, ARKI debe presentar escenarios y no prometer exactitud de caudal, socavación, inundación o sección hidráulica. [7]

**Represas y seguridad pública.** Una presa combina geología, hidráulica, estructuras, operación, ambiente y consecuencias aguas abajo. No se verificó un código peruano general único para todo tipo de represas en esta investigación. Estado: **UNKNOWN**. La plataforma debe solicitar la autoridad sectorial, marco de licenciamiento, estándares contractuales y revisión de un especialista en seguridad de presas.

**Limitaciones de modelos.** Un análisis elástico no captura automáticamente daño, contacto, fisuración, pandeo inelástico, erosión, consolidación, interacción fluido-estructura o construcción por etapas. Toda simplificación debe quedar registrada y justificarse.

**Datos sensibles y responsabilidad.** Coordenadas, vulnerabilidades, planes de emergencia, puentes críticos y represas pueden ser información sensible. Deben aplicarse controles de acceso y retención. La responsabilidad por diseño, seguridad, firma y presentación corresponde a los profesionales y entidades que legalmente intervienen; el software no debe atribuírsela.

## 7. Recomendación de implementación para ARKI

El módulo debe comenzar con un asistente de alcance que elija una de cuatro rutas: **edificación/RNE**, **vial/MTC**, **obra hidráulica especial**, o **referencia internacional adoptada por contrato**. Después debe construir una matriz de trazabilidad que conecte cada entrada con cada cálculo y cada salida con una cláusula o sección verificable. Los valores no verificados deben conservarse como `UNKNOWN`, no como cero.

La interfaz debe diferenciar visualmente hipótesis, datos del usuario, mediciones, correlaciones y resultados. Los informes deben incluir un resumen de decisión, un cuadro de faltantes, sensibilidad de variables dominantes, versión normativa y límites de uso. La exportación debe ser un **paquete para revisión profesional**, no un certificado automático.

## Referencias

[1]: https://www.gob.pe/institucion/sencico/informes-publicaciones/887225-normas-del-reglamento-nacional-de-edificaciones-rne "Normas del Reglamento Nacional de Edificaciones (RNE), SENCICO"

[2]: https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne "Reglamento Nacional de Edificaciones - RNE, Ministerio de Vivienda, Construcción y Saneamiento"

[3]: https://www.gob.pe/institucion/mtc/informes-publicaciones/4504137-normas-vigentes-en-materia-de-infraestructura-vial "Normas vigentes en materia de Infraestructura Vial, MTC"

[4]: https://www.gob.pe/institucion/mtc/normas-legales/4441297-10-2014-mtc-14 "Resolución Directoral N.° 10-2014-MTC/14: Suelos, Geología, Geotecnia y Pavimentos"

[5]: https://www.gob.pe/institucion/mtc/normas-legales/10438-03-2018-mtc-14 "Resolución Directoral N.° 03-2018-MTC/14: Diseño Geométrico"

[6]: https://www.gob.pe/institucion/mtc/normas-legales/4441255-19-2018-mtc-14 "Resolución Directoral N.° 19-2018-MTC/14: Puentes" 

[7]: https://www.gob.pe/institucion/mtc/normas-legales/4443017-20-2011-mtc-14 "Resolución Directoral N.° 20-2011-MTC/14: Hidrología, Hidráulica y Drenaje"

[8]: https://www.concrete.org/store/productdetail.aspx?ItemID=318U25 "ACI CODE-318-25: Building Code for Structural Concrete"

[9]: https://www.aisc.org/aisc/explore-aisc/aisc-360/ "AISC 360: Specification for Structural Steel Buildings"

[10]: https://eurocodes.jrc.ec.europa.eu/en-eurocodes/eurocodes-family "Eurocodes family, European Commission Joint Research Centre"

[11]: https://www.fhwa.dot.gov/engineering/hydraulics/library_arc.cfm?id=151&pub_number=17 "Evaluating Scour at Bridges, HEC-18 Fifth Edition, FHWA"

[12]: https://www.usbr.gov/tsc/techreferences/designstandards-datacollectionguides/designstandards.html "Reclamation Design Standards, Bureau of Reclamation"

[13]: https://www.usace.army.mil/missions/civil-works/dam-safety-program/ "Dam Safety Program, U.S. Army Corps of Engineers"

[14]: https://store.transportation.org/item/collectiondetail/268 "AASHTO LRFD Bridge Design Specifications, 10th Edition"

[15]: https://www.fhwa.dot.gov/pavement/dgit/index.cfm "Mechanistic-Empirical Pavement Design Guide, FHWA"

> **Nota de control editorial:** En el cuerpo se citan algunas referencias por función temática. Antes de publicar una versión regulatoria, debe revisarse que cada número apunte al título exacto y que no haya cambios de URL o edición. La resolución de Puentes es [6]; la resolución de Hidrología, Hidráulica y Drenaje es [7].
