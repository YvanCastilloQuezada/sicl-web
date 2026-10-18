# COCO-EXPRESS-002 — Familia A: Arquitectura e inteligencia espacial

**Orden:** COCO-EXPRESS-002 FULL ARSENAL PRETRAINING  
**Alcance:** A1–A13.  
**Estado de esta ficha:** `PARTIAL`; es una ficha de conocimiento y pruebas de invariantes, no un expediente técnico, cálculo profesional, certificación ni firma. No se usan respuestas de exámenes DeepSeek/Lipsic. No se implementan solvers profesionales.

## Guardas epistemológicas comunes

ARKI debe conservar, junto al resultado, **UNKNOWN**, `provenance`, unidades, aplicabilidad, escala, proyecto, tiempo, escenario y estado de evidencia. Una simulación sólo es simulación; una observación sólo es observación; un forecast sólo es forecast. Un hash, un `import_success` o un estado `COMPILED` prueban integridad o flujo, no verdad física, cumplimiento ni certificación. Cuando faltan espacios, geometría, mediciones, contexto o autoridad humana, el resultado es `UNKNOWN`, `NOT_APPLICABLE`, `PROFESSIONAL_VALIDATION_REQUIRED` o `PENDING REVIEW`, según corresponda.

## Fichas A1–A13

### A1 — Space syntax

- **CAPABILITY_ID:** `A1`
- **NAME:** Space syntax e inteligencia relacional del espacio.
- **PURPOSE:** Representar y comparar conectividad, integración, profundidad, elección y legibilidad de redes espaciales sin confundir índices de grafo con comportamiento humano garantizado.
- **CORE_CONCEPTS:** Grafo de espacios, nodos, aristas, axial/segmento, adyacencia, profundidad, integración, choice/betweenness, visibilidad, escala, configuración y uso observado.
- **PREREQUISITES:** Espacios identificados, relación espacial explícita, proyecto y escala, convención de representación, escenario de uso y datos geométricos suficientes.
- **INPUTS:** `ProgramSpaceRequirement`, relaciones `ADJACENT_TO`, `NEAR`, `VISUAL_CONNECTION_TO`, `FLOW_CONNECTED_TO`, geometría o mapa de nodos, `projectId`, `scenario`, unidades y provenance.
- **OUTPUTS:** Grafo y métricas descriptivas con unidades adimensionales, rutas candidatas, relaciones satisfechas/UNKNOWN y trazabilidad; nunca una predicción certificada de flujo.
- **CORE_RELATIONSHIPS:** Programa ↔ grafo; geometría ↔ visibilidad; circulación ↔ rutas; ocupación observada ↔ validación posterior; escenario ↔ comparabilidad.
- **BASIC_METHODS_OR_ALGORITHMS:** Construcción de grafo, BFS/Dijkstra para profundidad y rutas, normalización por tamaño de red, centralidades y análisis de sensibilidad a particiones; declarar supuestos y no extrapolar fuera de escala.
- **COMMON_FAILURES:** Confundir integración con calidad universal; mezclar escalas o proyectos; ignorar puertas/umbrales; tratar una ruta geométrica como ruta accesible o evacuación; ocultar desconexiones como cero.
- **LIMITS:** No modela por sí solo conducta, seguridad, congestión, humo, normativa, percepción ni cambios temporales; métricas son dependientes de la representación.
- **PROFESSIONAL_BOUNDARY:** Orientación analítica y comparación de alternativas. No sustituye diseño firmado, análisis de evacuación, simulación de incendios ni revisión de especialista.
- **ARKI_EXISTING_KNOWLEDGE:** Tipos y evaluación determinista de relaciones de programa; aislamiento por proyecto; estados `UNKNOWN`; evidencia y provenance en `shared/arkiArchitecturalProgram.ts`.
- **ARKI_NEW_TRAINING:** Vincular la red con escenario/escala/unidades, preservar UNKNOWN ante nodos ausentes y diferenciar métrica de grafo de afirmación conductual.
- **GAPS_REMAINING:** Sin motor space-syntax específico, geometría de visibilidad calibrada, validación empírica de ocupación ni análisis profesional de evacuación.

### A2 — Programa arquitectónico

- **CAPABILITY_ID:** `A2`
- **NAME:** Programa, requisitos y relaciones espaciales.
- **PURPOSE:** Convertir necesidades espaciales en requisitos trazables y evaluables sin inventar satisfacción.
- **CORE_CONCEPTS:** Espacio, actividad, usuario, área, dimensión, privacidad, acceso, ambiente, servicio, relación, prioridad, evidencia, aplicabilidad y estado epistémico.
- **PREREQUISITES:** `projectId`, espacios con identificadores estables, fuente del requisito, unidades, fase, tipo de edificio, escala, escenario y contexto de aplicabilidad.
- **INPUTS:** `ArchitecturalProgram`, `ProgramSpaceRequirement`, `ProgramRelationship`, `ObservedProjectState`, evidencia y provenance.
- **OUTPUTS:** Relaciones satisfechas, violadas, UNKNOWN, no aplicables, conflictos, requisitos ausentes, diagnósticos y provenance determinista.
- **CORE_RELATIONSHIPS:** Requisito ↔ evidencia; espacio ↔ relación; prioridad ↔ tratamiento del incumplimiento; aplicabilidad ↔ evaluación; Project State ↔ aislamiento.
- **BASIC_METHODS_OR_ALGORITHMS:** Normalización de relaciones, deduplicación estable, coincidencia exacta, detección de opuestos, conflicto por igual prioridad, evaluación fail-closed y orden determinista.
- **COMMON_FAILURES:** Rellenar evidencia faltante; tratar preferencia como obligación; mezclar estados entre proyectos; atribuir cumplimiento por importación o hash; omitir provenance.
- **LIMITS:** El evaluador existente no verifica la realidad geométrica, las unidades físicas ni el cumplimiento normativo; sus salidas son evaluación de datos aportados.
- **PROFESSIONAL_BOUNDARY:** No es programa aprobado, memoria de proyecto ni validación normativa firmada.
- **ARKI_EXISTING_KNOWLEDGE:** `shared/arkiArchitecturalProgram.ts` y `scripts/test-architectural-program.ts`; prueba existente `PASS` con determinismo, UNKNOWN, provenance, conflictos y aislamiento.
- **ARKI_NEW_TRAINING:** Uso explícito de `UNKNOWN`, `applicability`, `scale`, `scenario`, `projectId` y separación entre observación e inferencia.
- **GAPS_REMAINING:** Validación independiente del programa, control de unidades, normativa jurisdiccional, resolución de contradicciones por autoridad humana y cobertura de todas las familias de relación.

### A3 — Circulación

- **CAPABILITY_ID:** `A3`
- **NAME:** Circulación, accesos y rutas.
- **PURPOSE:** Describir rutas peatonales y de servicio, umbrales, jerarquías y conflictos de flujo para comparar alternativas conceptuales.
- **CORE_CONCEPTS:** Origen-destino, ruta, ancho, longitud, pendiente, giro, umbral, flujo, prioridad, accesibilidad, evacuación y escenario.
- **PREREQUISITES:** Grafo/geométría, puertas y escaleras identificadas, usuarios, dirección de flujo, unidades y escenario temporal.
- **INPUTS:** Nodos, aristas, longitudes/ancho/pendiente con unidades, restricciones de acceso, ocupación observada o supuesta y provenance.
- **OUTPUTS:** Rutas candidatas, distancias, cuellos de botella marcados y UNKNOWN donde falte geometría o medición; no aforo ni tiempo garantizado.
- **CORE_RELATIONSHIPS:** Circulación ↔ programa; ruta ↔ accesibilidad; ruta ↔ evacuación; ancho ↔ flujo; escenario ↔ ocupación.
- **BASIC_METHODS_OR_ALGORITHMS:** Dijkstra/BFS, comprobación de continuidad, detección de cuellos de botella, conteo de giros, análisis de alternativas y propagación de UNKNOWN.
- **COMMON_FAILURES:** Usar distancia como tiempo; ignorar sentido, puertas o obstrucciones; mezclar circulación cotidiana con evacuación; inferir capacidad normativa desde un croquis.
- **LIMITS:** Sin dinámica de peatones, humo, incendio, ascensores, comportamiento o autoridad normativa.
- **PROFESSIONAL_BOUNDARY:** No sustituye plan de evacuación, análisis de accesibilidad ni aprobación de autoridad competente.
- **ARKI_EXISTING_KNOWLEDGE:** Relaciones de acceso y dependencia en el programa; espacios constructivos con área y altura; contratos de estado/evidencia.
- **ARKI_NEW_TRAINING:** Registrar rutas como hipótesis contextualizadas por `scenario`, `scale`, unidades y estado de evidencia.
- **GAPS_REMAINING:** Motor de rutas geométricas, conteo de ocupación, normativa local, simulación de evacuación y revisión humana.

### A4 — Térmica

- **CAPABILITY_ID:** `A4`
- **NAME:** Desempeño térmico cualitativo y prediagnóstico.
- **PURPOSE:** Organizar variables térmicas y comparar hipótesis pasivas sin emitir cálculo energético certificado.
- **CORE_CONCEPTS:** Temperatura operativa, aire, superficies, radiación solar, ganancias, pérdidas, masa térmica, envolvente, confort, clima y periodo.
- **PREREQUISITES:** Ubicación/clima, orientación, geometría, materiales, ocupación, horarios, setpoints, unidades y modelo temporal.
- **INPUTS:** Área/volumen, U/R, ganancias internas, clima, ventilación, sombreado y mediciones o simulaciones etiquetadas.
- **OUTPUTS:** Balance conceptual, variables dominantes, rangos y UNKNOWN; simulación etiquetada como `SIMULATION`, no observación ni certificación.
- **CORE_RELATIONSHIPS:** Envolvente ↔ ganancias/pérdidas; orientación ↔ radiación; masa ↔ desfase; ventilación ↔ carga; escenario/tiempo ↔ comparabilidad.
- **BASIC_METHODS_OR_ALGORITHMS:** Balance estacionario simplificado, grados-día, comparación paramétrica y análisis de sensibilidad, siempre con unidades y supuestos explícitos.
- **COMMON_FAILURES:** Tratar clima típico como medición; omitir puentes térmicos/infiltración; mezclar °C, K y W; extrapolar un punto temporal a todo el año.
- **LIMITS:** No captura todos los fenómenos transitorios ni sustituye software, medición o revisión energética profesional.
- **PROFESSIONAL_BOUNDARY:** No es certificación energética ni garantía de confort, salubridad o cumplimiento.
- **ARKI_EXISTING_KNOWLEDGE:** Espacios con área/altura, requisitos ambientales genéricos y contratos de provenance/tiempo en auditorías existentes.
- **ARKI_NEW_TRAINING:** Separación obligatoria de observación, simulación y forecast; contexto `time`, `scenario`, escala y unidades.
- **GAPS_REMAINING:** Motor térmico, biblioteca climática validada, calibración con mediciones, puentes térmicos y revisión energética.

### A5 — Daylight

- **CAPABILITY_ID:** `A5`
- **NAME:** Luz natural y exposición diurna.
- **PURPOSE:** Razonar sobre acceso, distribución, deslumbramiento y sombreado en fase conceptual.
- **CORE_CONCEPTS:** Iluminancia, factor de luz diurna, autonomía, orientación, cielo, obstrucción, acristalamiento, luminancia y tiempo.
- **PREREQUISITES:** Geometría, aperturas, reflectancias, orientación, clima/cielo, obstrucciones, ocupación y unidades.
- **INPUTS:** Dimensiones, ventanas, materiales, latitud/fecha/hora, escenario y resultados de medición o simulación etiquetados.
- **OUTPUTS:** Mapas/rangos comparativos y variables inciertas; un factor simulado no es medición ni prueba de cumplimiento.
- **CORE_RELATIONSHIPS:** Apertura ↔ iluminancia; orientación ↔ sol; reflectancia ↔ distribución; obstrucción ↔ disponibilidad; hora/fecha ↔ resultado.
- **BASIC_METHODS_OR_ALGORITHMS:** Estimación geométrica, muestreo de puntos, comparación de escenarios y análisis de sensibilidad; conservar %/lux y origen de cada valor.
- **COMMON_FAILURES:** Confundir lux con confort; usar un cielo único; ignorar deslumbramiento y sombra; presentar simulación como observación.
- **LIMITS:** No representa por sí sola percepción, calidad visual, control solar real ni cumplimiento local.
- **PROFESSIONAL_BOUNDARY:** No sustituye daylight simulation validada, diseño de iluminación ni revisión normativa.
- **ARKI_EXISTING_KNOWLEDGE:** Espacios/relaciones programáticas y patrón de evidencia; no existe solver daylight acreditado.
- **ARKI_NEW_TRAINING:** Estado `SIMULATED` explícito, unidades `%`/`lux`, `time` y provenance inmutables; UNKNOWN ante apertura u orientación incompleta.
- **GAPS_REMAINING:** Geometría óptica, clima/cielo, materiales calibrados, deslumbramiento y validación independiente.

### A6 — Acústica

- **CAPABILITY_ID:** `A6`
- **NAME:** Acústica arquitectónica y separación sonora.
- **PURPOSE:** Identificar fuentes, receptores, trayectorias y decisiones espaciales que afectan privacidad y reverberación.
- **CORE_CONCEPTS:** Nivel sonoro, frecuencia, aislamiento, transmisión, absorción, reverberación, inteligibilidad, ruido exterior y tiempo de ocupación.
- **PREREQUISITES:** Fuentes/receptores, particiones, materiales, geometría, usos simultáneos, espectro, unidades y contexto.
- **INPUTS:** Relaciones `SEPARATED_FROM`, programa de actividades, materiales, mediciones o cálculos marcados por estado de evidencia.
- **OUTPUTS:** Mapa conceptual de conflictos, hipótesis de separación/absorción y UNKNOWN; no garantía de dB ni cumplimiento.
- **CORE_RELATIONSHIPS:** Actividad ↔ fuente; partición ↔ transmisión; volumen ↔ reverberación; horario ↔ conflicto; privacidad ↔ separación.
- **BASIC_METHODS_OR_ALGORITHMS:** Balance de fuentes simplificado, Sabine orientativo, rutas de transmisión y comparación de alternativas con incertidumbre.
- **COMMON_FAILURES:** Usar dB sin frecuencia ni ponderación; ignorar flancos; equiparar material con aislamiento; tratar un promedio como cumplimiento.
- **LIMITS:** Fenómeno dependiente de detalle constructivo, montaje, flancos y medición; el modelo conceptual no certifica desempeño.
- **PROFESSIONAL_BOUNDARY:** No sustituye medición acústica, especificación ni firma de especialista.
- **ARKI_EXISTING_KNOWLEDGE:** Relaciones de separación/privacidad y requisitos de espacio; no existe solver acústico profesional.
- **ARKI_NEW_TRAINING:** Contextualizar fuente, receptor, escala, tiempo, escenario y unidades; distinguir observación de cálculo.
- **GAPS_REMAINING:** Motor acústico, propiedades espectrales, flanqueo, medición in situ y normativa jurisdiccional.

### A7 — Ventilación

- **CAPABILITY_ID:** `A7`
- **NAME:** Ventilación, aire y estrategia de flujo.
- **PURPOSE:** Estructurar hipótesis de ventilación natural/mecánica y detectar datos faltantes.
- **CORE_CONCEPTS:** Caudal, ACH, presión, extracción, impulsión, recorrido, apertura, contaminante, viento, temperatura y escenario.
- **PREREQUISITES:** Volumen, aperturas, sistema, clima/viento, ocupación, contaminante objetivo, horarios y unidades.
- **INPUTS:** Volumen/área, aberturas, caudales, dirección, mediciones, simulación o forecast etiquetados.
- **OUTPUTS:** Rutas de aire y variables dominantes, cálculo orientativo si procede, estado UNKNOWN y provenance; no calidad garantizada del aire.
- **CORE_RELATIONSHIPS:** Aperturas ↔ caudal; viento ↔ presión; volumen ↔ ACH; ocupación ↔ carga; temperatura ↔ flotación.
- **BASIC_METHODS_OR_ALGORITHMS:** ACH = caudal/volumen con unidades consistentes; balance de caudales, comparación de orientaciones y análisis de sensibilidad.
- **COMMON_FAILURES:** Confundir apertura con caudal efectivo; mezclar m³/s y m³/h; asumir viento constante; inferir salubridad desde un esquema.
- **LIMITS:** Sin CFD validada, contaminantes, control, infiltración, clima real ni commissioning.
- **PROFESSIONAL_BOUNDARY:** No es diseño HVAC, cálculo sanitario ni certificación de calidad de aire.
- **ARKI_EXISTING_KNOWLEDGE:** Espacio, volumen aproximable por área/altura y estados de evidencia; no motor de ventilación.
- **ARKI_NEW_TRAINING:** Mantener `air_change_rate=UNKNOWN` si falta dato y preservar `1/h`, escenario, tiempo y fuente.
- **GAPS_REMAINING:** Modelo de flujo, pérdidas, control, clima, contaminantes, medición y revisión especialista.

### A8 — Proporción

- **CAPABILITY_ID:** `A8`
- **NAME:** Proporción, escala corporal y relaciones dimensionales.
- **PURPOSE:** Comparar relaciones ancho/profundidad/altura y su efecto espacial sin convertirlas en reglas universales.
- **CORE_CONCEPTS:** Relación dimensional, escala humana, módulo, ritmo, sección, campo visual, ocupación y tolerancia.
- **PREREQUISITES:** Dimensiones confiables, unidades, uso, usuarios, mobiliario/equipamiento, escala y fase.
- **INPUTS:** Ancho, profundidad, altura, ocupación, relaciones deseadas, referencias y límites de incertidumbre.
- **OUTPUTS:** Ratios, rangos comparativos, conflictos y UNKNOWN ante dimensiones faltantes; no juicio estético o ergonómico certificado.
- **CORE_RELATIONSHIPS:** Dimensión ↔ actividad; altura ↔ volumen/luz/aire; proporción ↔ percepción; usuario ↔ accesibilidad; módulo ↔ repetición.
- **BASIC_METHODS_OR_ALGORITHMS:** Ratios adimensionales, normalización de unidades, sensibilidad y comparación contra patrón declarado, nunca contra una norma implícita.
- **COMMON_FAILURES:** Mezclar unidades; asumir proporción “óptima”; borrar tolerancias; ignorar mobiliario, discapacidad o uso real.
- **LIMITS:** La proporción es contextual y cultural; no prueba confort, estructura, acústica ni cumplimiento.
- **PROFESSIONAL_BOUNDARY:** Herramienta de exploración; no reemplaza ergonomía, diseño universal, cálculo estructural o revisión profesional.
- **ARKI_EXISTING_KNOWLEDGE:** `area_m2`, `altura_libre_m`, dimensiones mínimas y tipos de usuario en el programa/ontología.
- **ARKI_NEW_TRAINING:** Ratios con unidades de origen y aplicabilidad; UNKNOWN en lugar de interpolación silenciosa.
- **GAPS_REMAINING:** Biblioteca contextual de patrones, usuarios diversos, mobiliario y validación ergonómica.

### A9 — Pattern language

- **CAPABILITY_ID:** `A9`
- **NAME:** Pattern language y composición de decisiones repetibles.
- **PURPOSE:** Relacionar problemas recurrentes, contexto, fuerzas y respuestas espaciales como hipótesis transferibles.
- **CORE_CONCEPTS:** Problema, contexto, fuerzas, patrón, escala, enlace entre patrones, consecuencias, alternativas y evidencia.
- **PREREQUISITES:** Problema bien definido, contexto, usuarios, proyecto, escala, patrón de referencia y límites de aplicabilidad.
- **INPUTS:** Fichas de patrón, relaciones programáticas, observaciones, restricciones climáticas/culturales y provenance.
- **OUTPUTS:** Candidatos de patrón, relaciones y consecuencias previstas, con grado de evidencia y UNKNOWN; no receta ni estilo obligatorio.
- **CORE_RELATIONSHIPS:** Contexto ↔ patrón; patrón ↔ programa; patrón ↔ clima/uso; patrón ↔ escala; consecuencia ↔ validación.
- **BASIC_METHODS_OR_ALGORITHMS:** Recuperación por atributos, grafo de patrones, comparación multicriterio cualitativa y registro de contraejemplos.
- **COMMON_FAILURES:** Copiar forma fuera de contexto; confundir popularidad con evidencia; usar patrón como norma; omitir consecuencias y alternativas.
- **LIMITS:** Conocimiento heurístico, sensible a cultura y proyecto; no garantiza desempeño ni aceptación del usuario.
- **PROFESSIONAL_BOUNDARY:** Apoyo a ideación y razonamiento, no autoría profesional ni justificación única de diseño.
- **ARKI_EXISTING_KNOWLEDGE:** Repositorio tiene glosario, conocimiento arquitectónico y relaciones de programa; no un catálogo canónico A9 validado.
- **ARKI_NEW_TRAINING:** Enlaces patrón-contexto con `applicability`, escala, escenario, provenance y contraejemplos explícitos.
- **GAPS_REMAINING:** Catálogo curado, evidencia empírica, gobernanza de versiones y evaluación con usuarios.

### A10 — Tipología

- **CAPABILITY_ID:** `A10`
- **NAME:** Tipología y comparación morfo-funcional.
- **PURPOSE:** Clasificar configuraciones espaciales por rasgos y uso sin imponer determinismo tipológico.
- **CORE_CONCEPTS:** Tipo, rasgo, morfología, organización, programa, contexto, transformación, híbrido y escala.
- **PREREQUISITES:** Taxonomía explícita, corpus/provenance, rasgos observables, periodo, ubicación, uso y nivel de abstracción.
- **INPUTS:** Plantas/esquemas, espacios, relaciones, programa, contexto climático/cultural y metadatos temporales.
- **OUTPUTS:** Etiquetas tipológicas, similitudes, diferencias y UNKNOWN ante corpus incompleto; no atribución autoral o histórica sin fuente.
- **CORE_RELATIONSHIPS:** Tipo ↔ programa; forma ↔ contexto; tipo ↔ escala; tradición ↔ transformación; rasgo ↔ evidencia.
- **BASIC_METHODS_OR_ALGORITHMS:** Taxonomía de rasgos, embeddings o similitud explicable si se dispone, clustering exploratorio y revisión humana de casos límite.
- **COMMON_FAILURES:** Confundir parecido con identidad; ocultar híbridos; mezclar periodos/escala; afirmar causalidad histórica desde forma.
- **LIMITS:** Clasificación depende del corpus y del esquema de rasgos; no predice desempeño ni valor patrimonial.
- **PROFESSIONAL_BOUNDARY:** No sustituye historiografía, inventario patrimonial, autoría ni dictamen profesional.
- **ARKI_EXISTING_KNOWLEDGE:** Conocimiento histórico/arquitectónico y modelos de espacios existentes; sin clasificador tipológico validado.
- **ARKI_NEW_TRAINING:** Tipología como hipótesis trazable con corpus, fecha, escala, applicability y UNKNOWN para casos híbridos.
- **GAPS_REMAINING:** Corpus curado, taxonomía estable, validación experta y control de sesgo regional/temporal.

### A11 — Multicriterio

- **CAPABILITY_ID:** `A11`
- **NAME:** Evaluación multicriterio espacial.
- **PURPOSE:** Hacer explícitos criterios, pesos, unidades, incertidumbre y trade-offs al comparar alternativas.
- **CORE_CONCEPTS:** Criterio, indicador, peso, normalización, umbral, dominancia, sensibilidad, incertidumbre, escala y decisión humana.
- **PREREQUISITES:** Alternativas comparables, criterios definidos, unidades y dirección, pesos justificados, contexto común y datos con estado.
- **INPUTS:** Indicadores espaciales, térmicos, daylight, acústicos, ventilación, accesibilidad, coste/tiempo si aplican, provenance y escenarios.
- **OUTPUTS:** Tabla/ranking exploratorio, Pareto, sensibilidad y criterios UNKNOWN; nunca decisión automática certificada.
- **CORE_RELATIONSHIPS:** Alternativa ↔ criterio; peso ↔ preferencia; unidad ↔ normalización; escenario ↔ comparabilidad; UNKNOWN ↔ no imputación silenciosa.
- **BASIC_METHODS_OR_ALGORITHMS:** Suma ponderada transparente, normalización declarada, Pareto, escenarios de peso, Monte Carlo sólo si sus distribuciones son justificadas y etiquetadas.
- **COMMON_FAILURES:** Pesos arbitrarios; mezclar % con m; convertir UNKNOWN en cero; doble conteo; ranking fuera de aplicabilidad; optimizar proxy como objetivo real.
- **LIMITS:** Resultado depende de criterios, pesos y calidad de evidencia; no resuelve conflictos de valor ni responsabilidad profesional.
- **PROFESSIONAL_BOUNDARY:** Herramienta de decisión asistida; no adjudica diseño, cumplimiento, seguridad o firma.
- **ARKI_EXISTING_KNOWLEDGE:** Motores de restricciones/evidencia y contratos de applicability/scale en el repositorio; no solver multicriterio profesional.
- **ARKI_NEW_TRAINING:** `UNKNOWN` bloquea score total cuando falta criterio crítico; conservar estado `SIMULATED`/`OBSERVED`, unidades y contexto.
- **GAPS_REMAINING:** Gobernanza de pesos, normalización auditada, análisis de incertidumbre validado y revisión humana independiente.

### A12 — Bioclimática

- **CAPABILITY_ID:** `A12`
- **NAME:** Estrategia bioclimática y respuesta pasiva.
- **PURPOSE:** Relacionar clima, orientación, masa, sombra, agua, vegetación y ventilación con decisiones espaciales preliminares.
- **CORE_CONCEPTS:** Zona climática, sol, viento, humedad, masa térmica, sombra, evaporación, orientación, adaptación y periodo.
- **PREREQUISITES:** Sitio/clima, orientación, topografía, vegetación, usos, horarios, recursos, objetivos y datos temporales.
- **INPUTS:** Geometría, aperturas, masa, sombra, viento, temperaturas, humedad, simulación/observación/forecast diferenciados.
- **OUTPUTS:** Matriz de estrategias y trade-offs, escenarios de desempeño y UNKNOWN; no garantía de confort, resiliencia o ahorro.
- **CORE_RELATIONSHIPS:** Clima ↔ forma; orientación ↔ sombra/ganancia; masa ↔ tiempo; vegetación/agua ↔ microclima; estrategia ↔ uso.
- **BASIC_METHODS_OR_ALGORITHMS:** Matriz clima-estrategia, balances simplificados, escenarios estacionales, sensibilidad y comparación cualitativa/semicuantitativa.
- **COMMON_FAILURES:** Copiar estrategia de otra latitud; usar clima promedio como futuro cierto; ignorar agua/mantenimiento; asumir que una táctica funciona todo el año.
- **LIMITS:** Alta dependencia de sitio, operación y cambio climático; no reemplaza modelado energético, hidrológico o de riesgo.
- **PROFESSIONAL_BOUNDARY:** Exploración bioclimática, no certificación ambiental ni garantía de resiliencia.
- **ARKI_EXISTING_KNOWLEDGE:** Requisitos ambientales genéricos, espacios y contratos de evidencia; no biblioteca climática validada ni solver bioclimático.
- **ARKI_NEW_TRAINING:** Matrices con escenario/tiempo, estado de dato y provenance; forecast nunca se convierte en observación.
- **GAPS_REMAINING:** Datos climáticos/locales, operación, agua, paisaje, calibración y revisión interdisciplinar.

### A13 — Accesibilidad y evacuación

- **CAPABILITY_ID:** `A13`
- **NAME:** Accesibilidad, inclusión espacial y evacuación conceptual.
- **PURPOSE:** Detectar barreras, discontinuidades y requisitos de ruta para distintos usuarios, manteniendo separación estricta entre screening y cumplimiento.
- **CORE_CONCEPTS:** Diseño universal, continuidad, ancho, pendiente, giro, alcance, contraste, señalización, refugio, egreso, ocupación y escenario de emergencia.
- **PREREQUISITES:** Usuarios y necesidades, geometría medida, puertas/rampas/escaleras, niveles, obstáculos, ocupación, jurisdicción y escenario.
- **INPUTS:** Dimensiones con unidades, rutas, relaciones de acceso, elementos constructivos, observaciones, normativa aplicable y provenance.
- **OUTPUTS:** Barreras y rutas candidatas, campos faltantes, conflictos y estado `PROFESSIONAL_VALIDATION_REQUIRED`; no certificado de accesibilidad/evacuación.
- **CORE_RELATIONSHIPS:** Usuario ↔ ruta; dimensión ↔ maniobra; acceso ↔ programa; salida ↔ ocupación; emergencia ↔ tiempo/escenario; norma ↔ jurisdicción.
- **BASIC_METHODS_OR_ALGORITHMS:** Chequeos de continuidad, cotas y unidades, conectividad por usuario, rutas alternativas y matriz de barreras; no cálculo normativo completo.
- **COMMON_FAILURES:** Confundir una cota aislada con accesibilidad; ignorar puertas, descansos, superficies y señalización; mezclar ruta cotidiana con emergencia; afirmar cumplimiento sin jurisdicción.
- **LIMITS:** Evacuación depende de incendio, humo, ocupación, tiempos y autoridad; accesibilidad depende de detalle y normativa local.
- **PROFESSIONAL_BOUNDARY:** No sustituye revisión de accesibilidad, seguridad contra incendios, plan de evacuación, autoridad competente ni firma profesional.
- **ARKI_EXISTING_KNOWLEDGE:** Relaciones `DIRECT_ACCESS_TO`/`CONTROLLED_ACCESS_TO`, dimensiones básicas de espacios, estados UNKNOWN y test de conflictos.
- **ARKI_NEW_TRAINING:** Microejercicios con unidades, proyecto, escenario y provenance; import/hash no equivalen a verdad ni certificación.
- **GAPS_REMAINING:** Reglas jurisdiccionales, ocupación y egreso, humo/incendio, usuarios diversos, medición de campo y revisión independiente.

## ARKI reutilizado y extensión de entrenamiento

La base más directa es el contrato de programa arquitectónico: `ProgramSpaceRequirement`, `ProgramRelationship`, `ObservedProjectState`, prioridades, aplicabilidad, evidencia, provenance y estados epistémicos. El evaluador existente deduplica relaciones, detecta opuestos con igual prioridad, conserva `UNKNOWN`, devuelve `NOT_APPLICABLE` cuando no hay aplicabilidad declarada y mantiene `projectId` y `computedAt=DETERMINISTIC`. El test existente cubre determinismo, aislamiento de proyectos, conflictos, duplicados, provenance y un test-the-test de mutación. También se reutilizan los contratos de restricciones/evidencia y las advertencias de auditoría sobre `UNKNOWN`, hash, snapshot, revisión y límites profesionales.

El entrenamiento añadido en esta ficha amplía el vocabulario hacia A1–A13, exige contexto de escala/proyecto/tiempo/escenario, conserva unidades y estados de evidencia, y fuerza la separación entre screening conceptual y competencia profesional. No se añadió un solver físico, normativo, de evacuación, acústico, energético, daylight, CFD o certificación.

## Gaps prioritarios

Persisten como brechas la calibración con datos de campo, la integración geométrica y temporal, las bibliotecas climáticas y normativas jurisdiccionales, la revisión independiente, la trazabilidad completa de transformaciones, la gobernanza de pesos multicriterio, y cualquier emisión firmada o certificada. Por tanto, la familia A queda en `PARTIAL`, apta para estructurar conocimiento, fixtures, preguntas y comparaciones internas; no apta para declarar competencia profesional.

## References

[1]: file:///home/ubuntu/generador-familias/shared/arkiArchitecturalProgram.ts "ARKI architectural program evaluator and epistemic states"
[2]: file:///home/ubuntu/generador-familias/scripts/test-architectural-program.ts "ARKI architectural program invariant tests"
[3]: file:///home/ubuntu/generador-familias/shared/arkiConstraintEngine.ts "ARKI constraint evidence and applicability engine"
[4]: file:///home/ubuntu/generador-familias/shared/arkiRelationshipFabric.ts "ARKI relationship, scale and provenance contracts"
[5]: file:///home/ubuntu/generador-familias/COCO/AUDIT/COCO-B_AUDIT.md "ARKI COCO-B audit: evidence, UNKNOWN and professional boundary"
[6]: file:///home/ubuntu/generador-familias/shared/arkiConstructionOntology.ts "ARKI construction ontology and space model"

**Control de cambios:** se crearon únicamente `COCO_EXPRESS_002/A_ARCHITECTURE/FICHA_A.md` y `COCO_EXPRESS_002/A_ARCHITECTURE/EXERCISES_A.txt`. No se modificaron Product State, BKH, TX, E5–E8 ni PF-H01.
