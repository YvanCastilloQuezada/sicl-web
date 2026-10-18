# COCO-EXPRESS-002 — Ficha P: Construcción y proceso

**Orden:** COCO-EXPRESS-002 FULL ARSENAL PRETRAINING  
**Alcance:** P1–P8; fundamentos transferibles, no competencia profesional.  
**Evidencia inspeccionada:** `COCO_EXPRESS_002_ORDER_SOURCE.txt`, `CORE/COCO_CORE_DOCTRINE.md`, `COCO/COCO_SCOPE_LIMITS.md`, `EXERCISES/TRANSVERSE_SCENARIO.md`, y directorio `P_PROCESS` (vacío antes de esta entrega). No se usaron respuestas de exámenes DeepSeek/Lipsic.

## Convenciones epistemológicas de esta ficha

`UNKNOWN` significa desconocido o no demostrado; no significa falso. Cada dato operativo debe conservar **provenance, autoridad, fuente, fecha/versión, proyecto, tiempo, escenario, escala, aplicabilidad, unidades y tolerancia** cuando correspondan. Una simulación, observación, forecast, hash o `import_success` no se eleva a verdad, certificación, fidelidad o aprobación. La autoridad humana decide y firma; esta ficha sólo prepara razonamiento.

## Fichas de capacidad

### P1
- **CAPABILITY_ID:** P1
- **NAME:** Lean Construction
- **PURPOSE:** Mejorar flujo y valor reduciendo esperas, retrabajo, sobreprocesamiento, inventario, transporte, defectos y trabajo no planificado.
- **CORE_CONCEPTS:** valor para el cliente; flujo; pull; desperdicio; variabilidad; mejora continua; trabajo fiable; restricciones.
- **PREREQUISITES:** alcance y entregables definidos; unidades y calendario; estado epistémico de observaciones; mapa de proceso; autoridad y límites del proyecto.
- **INPUTS:** actividades, duraciones con unidad/fecha; restricciones; handoffs; recursos; observaciones de espera y defectos con fuente y escala.
- **OUTPUTS:** mapa de flujo/propuesta; desperdicios clasificados; hipótesis de mejora; indicadores y decisiones pendientes. No garantiza productividad real.
- **CORE_RELATIONSHIPS:** P1 alimenta P2 (compromisos fiables), P3 (flujo por zonas), P4 (secuencia) y P5 (constructibilidad); LCA/LCC sólo comparan alternativas con límites equivalentes.
- **BASIC_METHODS_OR_ALGORITHMS:** value-stream map; clasificación 8 desperdicios; 5-Why como hipótesis; PDCA; razón de valor/lead time sólo si numerador, denominador y unidades son comparables.
- **COMMON_FAILURES:** confundir actividad ocupada con valor; optimizar una cuadrilla aislada; borrar variabilidad; usar un KPI como verdad causal; mezclar observación con hecho canónico.
- **LIMITS:** no predice producción ni sustituye medición de campo, contrato, seguridad o planificación profesional.
- **PROFESSIONAL_BOUNDARY:** no emite método constructivo, programa contractual, seguridad, costo ni certificación de desempeño.
- **ARKI_EXISTING_KNOWLEDGE:** La doctrina COCO exige separación `KNOWLEDGE ≠ PROJECT_STATE ≠ EVIDENCE`, provenance y UNKNOWN; el escenario transversal marca una secuencia que invade montaje. No se encontró implementación Lean específica.
- **ARKI_NEW_TRAINING:** vocabulario mínimo, clasificación de desperdicio, métrica con unidades y ejercicio de separación entre observación e inferencia.
- **GAPS_REMAINING:** datos de producción longitudinales; validación estadística; integración con CDE/ERP; gobernanza de cambios y seguridad.

### P2
- **CAPABILITY_ID:** P2
- **NAME:** Last Planner System
- **PURPOSE:** Convertir planificación por hitos en compromisos ejecutables mediante pull planning, make-ready, weekly work plan y aprendizaje de causas.
- **CORE_CONCEPTS:** should/could/will/did; planificación colaborativa; restricciones; promesas; PPC; causas de no cumplimiento; lookahead.
- **PREREQUISITES:** red de actividades; responsables identificables; horizonte temporal; definición de listo; evidencia de restricciones y compromisos.
- **INPUTS:** hitos y precedencias; restricciones con owner/fecha; promesas semanales; hechos de terminación; causas codificadas y provenance.
- **OUTPUTS:** plan pull; lista make-ready; compromisos; PPC = completadas/prometidas (con periodo y unidad); razones de variación; acciones. PPC no prueba calidad ni causalidad.
- **CORE_RELATIONSHIPS:** depende de P4 para precedencias, de P3 para ritmo y de P5 para restricciones físicas; P1 aporta mejora; P8 aporta readiness de sistemas antes de handover.
- **BASIC_METHODS_OR_ALGORITHMS:** descomponer milestone a actividades; filtrar por restricciones; comprometer sólo trabajo listo; calcular PPC por periodo; revisar causas sin convertir correlación en causalidad.
- **COMMON_FAILURES:** contar promesas ambiguas; cambiar alcance retrospectivamente; no registrar restricciones; PPC sin denominador; tratar plan como as-built.
- **LIMITS:** no certifica avance, calidad, seguridad, contrato o cumplimiento normativo; depende de registros honestos y comparables.
- **PROFESSIONAL_BOUNDARY:** no firma programa contractual ni valida reclamos de plazo.
- **ARKI_EXISTING_KNOWLEDGE:** La doctrina exige estado epistémico, autoridad humana, determinismo y no confundir preview/observación con decisión; no hay LPS implementado localizado.
- **ARKI_NEW_TRAINING:** contrato mínimo de compromiso, make-ready, PPC con periodo/unidad y bloqueo por UNKNOWN.
- **GAPS_REMAINING:** integración con control de obra real, codificación de causas, resolución de conflictos, multiempresa y evidencia auditada.

### P3
- **CAPABILITY_ID:** P3
- **NAME:** Takt Planning y control de ritmo
- **PURPOSE:** Coordinar equipos y zonas mediante un ritmo objetivo explícito, haciendo visibles desbalances, buffers y handoffs.
- **CORE_CONCEPTS:** zonas; takt time; duración por zona; tren de trabajo; buffers; capacidad; variabilidad; handoff.
- **PREREQUISITES:** zonificación estable; alcance por zona; calendario y turnos; duraciones con unidades; dependencias y restricciones; definición de terminado.
- **INPUTS:** número de zonas; ventana disponible; demanda de unidades; duraciones por lote/zona; recursos; observaciones de avance con tiempo y fuente.
- **OUTPUTS:** takt declarado (p. ej. días/zona); secuencia por zonas; matriz equipo-zona-tiempo; conflictos y buffers. Es una propuesta, no una garantía.
- **CORE_RELATIONSHIPS:** P3 usa P4; P2 convierte intervalos en compromisos; P1 identifica espera; P5 verifica acceso/espacio; P8 evita entregar zonas sin pruebas.
- **BASIC_METHODS_OR_ALGORITHMS:** `takt = tiempo disponible / unidades de demanda` con unidades compatibles; comparar duración de cada actividad con takt; detectar sobrecarga y huecos; propagar restricciones.
- **COMMON_FAILURES:** mezclar días calendario y laborales; dividir duración sin capacidad demostrada; ignorar zonas no repetitivas; llamar forecast a un plan; ocultar buffers.
- **LIMITS:** no modela por sí solo productividad, clima, seguridad, interfaces complejas o cambios de diseño.
- **PROFESSIONAL_BOUNDARY:** no autoriza secuencia de obra, recursos ni condiciones seguras.
- **ARKI_EXISTING_KNOWLEDGE:** La doctrina contiene reglas de unidades, determinismo y aplicabilidad; el escenario documenta una secuencia en conflicto, pero no contiene cálculo Takt validado.
- **ARKI_NEW_TRAINING:** cálculo dimensional mínimo, propagación de UNKNOWN y detección de mezcla de escalas/periodos.
- **GAPS_REMAINING:** calibración con datos reales, simulación validada, integración 4D productiva y reglas de replanificación.

### P4
- **CAPABILITY_ID:** P4
- **NAME:** Secuencia, precedencias y dependencias
- **PURPOSE:** Representar el orden lógico/espacial/temporal de trabajos y localizar bloqueos sin afirmar que el grafo describe la realidad completa.
- **CORE_CONCEPTS:** actividad; evento; precedencia FS/SS/FF; lag; camino crítico como análisis condicionado; dependencia espacial; handoff; restricción.
- **PREREQUISITES:** actividades identificadas; IDs estables; relaciones y calendario; supuestos explícitos; validación humana de límites.
- **INPUTS:** grafo de actividades; relaciones tipadas; duraciones y unidades; zonas; restricciones; versiones y fuentes.
- **OUTPUTS:** orden topológico cuando exista; ciclos detectados; rutas candidatas; conflictos; preguntas de validación. No es programa profesional emitible.
- **CORE_RELATIONSHIPS:** base de P2/P3; recibe constructibilidad P5; condiciona LCA/LCC por escenarios temporales; P8 agrega pruebas y mantenimiento como gates.
- **BASIC_METHODS_OR_ALGORITHMS:** validación de IDs y unidades; detección de ciclos; topological sort; earliest/latest sólo con calendario y supuestos declarados; análisis de sensibilidad a lags.
- **COMMON_FAILURES:** tratar un grafo incompleto como as-built; borrar ciclos para forzar solución; omitir zona/escala; confundir ruta calculada con decisión.
- **LIMITS:** no resuelve logística, seguridad, permisos, clima, rendimiento ni interfaces no modeladas.
- **PROFESSIONAL_BOUNDARY:** no sustituye planificación, dirección ni revisión de constructibilidad por especialistas.
- **ARKI_EXISTING_KNOWLEDGE:** COCO declara algoritmos genéricos de grafos dentro de prerrequisitos y exige UNKNOWN; existe escenario con invasión de zona de montaje. No se halló motor P productivo.
- **ARKI_NEW_TRAINING:** contrato de grafo trazable, relaciones tipadas, ciclos visibles y salida con incertidumbre.
- **GAPS_REMAINING:** datos de campo, calendario multiempresa, recursos, incertidumbre probabilística y validación contractual.

### P5
- **CAPABILITY_ID:** P5
- **NAME:** Constructibilidad
- **PURPOSE:** Detectar tempranamente si una solución puede ser fabricada, transportada, montada, inspeccionada y mantenida bajo restricciones conocidas.
- **CORE_CONCEPTS:** secuencia de montaje; acceso; tolerancias; interfaces; prefabricación; logística; seguridad; mantenibilidad; revisión interdisciplinaria.
- **PREREQUISITES:** diseño/versiones; especificaciones; geometría y tolerancias confiables; medios de obra; restricciones de sitio; roles de revisión.
- **INPUTS:** modelo/dibujo con alcance y versión; método propuesto; zonas y accesos; equipos; observaciones; incidencias con evidencia y aplicabilidad.
- **OUTPUTS:** issues de constructibilidad priorizados; supuestos; alternativas; evidencia faltante; decisión humana pendiente. No certifica que sea construible.
- **CORE_RELATIONSHIPS:** P5 valida supuestos de P4/P3; informa P1/P2; conecta P6/P7 con reemplazabilidad y residuos; P8 con acceso a pruebas y mantenimiento.
- **BASIC_METHODS_OR_ALGORITHMS:** revisión por secuencia; matriz interfaz-responsable; checklist de acceso/tolerancia/izaje/inspección; clash conceptual; registro issue–evidencia–owner–fecha.
- **COMMON_FAILURES:** asumir fidelidad semántica de un import; revisar sólo geometría; ignorar mantenimiento; cerrar issue sin evidencia; confundir preview con aprobación.
- **LIMITS:** no calcula ingeniería de detalle, seguridad laboral, resistencia, normativa ni medios de izaje.
- **PROFESSIONAL_BOUNDARY:** no aprueba planos, método, seguridad, tolerancias ni expediente.
- **ARKI_EXISTING_KNOWLEDGE:** La doctrina prohíbe tratar `import success` como fidelity y separa diseño/as-built; el escenario incluye DWG con pérdida semántica posible y montaje invadido. No hay checker P5 identificado.
- **ARKI_NEW_TRAINING:** issue trazable, aplicabilidad por escala/proyecto y gates para no cerrar por mera importación.
- **GAPS_REMAINING:** revisión de especialistas, tolerancias reales, logística, BIM/CDE productivo, seguridad y validación in situ.

### P6
- **CAPABILITY_ID:** P6
- **NAME:** LCA — evaluación de ciclo de vida
- **PURPOSE:** Comparar impactos ambientales de alternativas con objetivo, unidad funcional, límites de sistema, inventario, método y escenarios explícitos.
- **CORE_CONCEPTS:** objetivo/alcance; unidad funcional; límites; ACV/LCA; inventario; factores; categorías de impacto; asignación; sensibilidad; incertidumbre.
- **PREREQUISITES:** alternativa definida; unidad funcional; periodo y escala; datos de cantidades con unidades; fuentes y geografía; método/versiones; escenarios fin de vida.
- **INPUTS:** cantidades; EPD/factores con fuente y vigencia; transporte/energía; vida útil; mantenimiento/reemplazo; escenarios; calidad de dato.
- **OUTPUTS:** inventario y resultados por unidad funcional; supuestos; rango/sensibilidad; UNKNOWN; comparación sólo bajo límites equivalentes. No es certificación ambiental.
- **CORE_RELATIONSHIPS:** P6 recibe cantidades de P5 y secuencia de P4; comparte vida útil/reemplazos con P7 y P8; Lean puede reducir desperdicio, pero no se infiere impacto sin inventario.
- **BASIC_METHODS_OR_ALGORITHMS:** definir FU y frontera; normalizar flujos; multiplicar cantidad × factor con unidades; sumar por etapa; documentar asignación; análisis de sensibilidad y calidad de datos.
- **COMMON_FAILURES:** comparar kgCO2e sin FU; mezclar fronteras; usar factores sin fuente/vigencia; tratar forecast como hecho; doble conteo; olvidar incertidumbre.
- **LIMITS:** no sustituye herramienta/metodología LCA acreditada ni datos verificados; no infiere cumplimiento de esquema de certificación.
- **PROFESSIONAL_BOUNDARY:** no declara EPD, certificación, cumplimiento ambiental ni huella oficial.
- **ARKI_EXISTING_KNOWLEDGE:** El escenario dice impacto LCA/LCC no cuantificado; la doctrina exige unidades, provenance, escala, fecha y aplicabilidad; no se localizó LCA computada.
- **ARKI_NEW_TRAINING:** contrato mínimo FU–frontera–fuente–unidad–escenario, con comparación bloqueada si faltan campos.
- **GAPS_REMAINING:** factores regionales, bases verificadas, metodología escogida, incertidumbre cuantitativa, revisión experta y certificación externa.

### P7
- **CAPABILITY_ID:** P7
- **NAME:** LCC — costo de ciclo de vida
- **PURPOSE:** Comparar costo total relevante durante un horizonte definido, haciendo explícitos CAPEX, OPEX, reemplazos, energía, mantenimiento, fin de vida, descuento y riesgo.
- **CORE_CONCEPTS:** coste inicial; coste operativo; horizonte; valor temporal; descuento; reemplazo; residual; sensibilidad; coste del riesgo; perspectiva del decisor.
- **PREREQUISITES:** alcance y perspectiva; moneda/fecha/base; vida útil; cantidades; precios/fuentes; calendario de mantenimiento y reemplazo; tasa y escenarios.
- **INPUTS:** CAPEX/OPEX; consumos con unidades; frecuencias; precios y escalación; horizonte; tasa; residuos/valor residual; incertidumbres y provenance.
- **OUTPUTS:** flujos por año/periodo; NPV o total no descontado claramente rotulado; sensibilidad y UNKNOWN; comparación condicionada. No es presupuesto ni oferta.
- **CORE_RELATIONSHIPS:** P7 comparte FU temporal y reemplazos con P6/P8; P5 aporta mantenibilidad; P2/P4 aportan calendario, no precios inventados.
- **BASIC_METHODS_OR_ALGORITHMS:** normalizar moneda y fecha; `PV_t = CF_t/(1+r)^t` si r y periodo son compatibles; sumar por escenario; sensibilidad a tasa, vida, precio y disponibilidad.
- **COMMON_FAILURES:** mezclar precios nominales/reales; ocultar horizonte; presentar forecast como gasto observado; doble contar CAPEX/OPEX; omitir unidades o perspectiva.
- **LIMITS:** no reemplaza presupuesto, licitación, auditoría ni decisión financiera; resultados son dependientes de supuestos.
- **PROFESSIONAL_BOUNDARY:** no certifica viabilidad económica, precio contractual ni retorno de inversión.
- **ARKI_EXISTING_KNOWLEDGE:** El escenario declara LCA/LCC no cuantificado y el núcleo exige unidades, provenance y UNKNOWN; no se localizó modelo LCC específico.
- **ARKI_NEW_TRAINING:** ledger temporal de costos, separación observación/forecast, y oracle que rechaza moneda/horizonte/tasa ausentes.
- **GAPS_REMAINING:** precios de mercado auditados, energía regional, riesgo, impuestos, financiación, horizonte contractual y revisión financiera.

### P8
- **CAPABILITY_ID:** P8
- **NAME:** Commissioning y mantenimiento predictivo (fundamentos separados)
- **PURPOSE:** Preparar la transición de sistemas desde instalación a operación mediante requisitos, pruebas y handover; distinguir una señal de mantenimiento predictivo de un diagnóstico confirmado.
- **CORE_CONCEPTS:** requisitos verificables; prefunctional/functional test; issue y retest; trend; baseline; alarma; health indicator; condición; false positive/negative; handover; plan de mantenimiento.
- **PREREQUISITES:** sistemas/activos identificados; requisitos y criterios de aceptación; instrumentos y calibración; responsables; datos temporales con unidad; garantía y contexto operativo.
- **INPUTS:** submittals/as-built; listas de puntos; procedimientos; resultados de prueba; observaciones y sensores; históricos; contexto, versión y aplicabilidad.
- **OUTPUTS:** matriz requisito–prueba–evidencia–estado; punch list; handover condicionado; indicador/alerta de condición con UNKNOWN cuando falte validación. No entrega diagnóstico ni certificación.
- **CORE_RELATIONSHIPS:** P8 es gate de P2 y P4; P5 verifica acceso; P6/P7 consumen vida útil y reemplazos; un forecast o simulación sólo alimenta hipótesis, no verdad.
- **BASIC_METHODS_OR_ALGORITHMS:** trazabilidad requisito→prueba→resultado; repetir prueba tras corrección; series temporales con unidades y baseline; umbral o tendencia documentados; clasificar alerta como `OBSERVATION`/`INFERENCE`, no `FACT` sin validación.
- **COMMON_FAILURES:** importar con éxito y declarar sistema listo; sensor sin calibración; forecast sin intervalo; hash como firma; alarma como fallo confirmado; observación visual como medición.
- **LIMITS:** no BMS productivo, sensores reales, modelo ML validado, diagnóstico de seguridad ni mantenimiento predictivo operativo.
- **PROFESSIONAL_BOUNDARY:** no certifica commissioning, aceptación, garantía, seguridad, cumplimiento ni intervención de mantenimiento.
- **ARKI_EXISTING_KNOWLEDGE:** `COCO_SCOPE_LIMITS.md` excluye O&M productivo, BMS, sensores reales y mantenimiento predictivo; el escenario incluye activo sin garantía y forecast sin intervalo. La doctrina conserva UNKNOWN y separa simulación/observación/forecast.
- **ARKI_NEW_TRAINING:** dos carriles (commissioning y condición), estados de evidencia, unidades/tiempo y gate de aceptación humana.
- **GAPS_REMAINING:** protocolos por sistema, instrumentación calibrada, datos longitudinales, validación de modelos, ciberseguridad, O&M y especialistas autorizados.

## Relaciones transversales y estado de entrega

El flujo conceptual es **P5/P4 → P3/P2 → P1 → P6/P7 → P8**, con retroalimentación de P8 a secuencia, mantenimiento, costo e impacto. Todas las relaciones son propuestas de razonamiento, no un solver profesional. La evidencia real permite preparar prerrequisitos verificables y microtests de preservación semántica; no permite declarar P1–P8 implementados profesionalmente. Los ejercicios y sus resultados quedan en `EXERCISES_P.txt`.

**Estado recomendado:** `PREREQUISITE_TESTED` para esta ficha y sus oráculos sintéticos únicamente; **no equivale a competencia profesional, certificación ni validación de obra**.

**Protecciones respetadas:** no se modificaron Product State, BKH, TX, E5–E8 ni PF-H01; no se crearon solvers profesionales ni se usaron respuestas de exámenes conocidas.
