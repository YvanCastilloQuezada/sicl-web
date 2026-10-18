# COCO-EXPRESS-002 — Ficha Z: Analítica

**Orden:** `COCO-EXPRESS-002 FULL ARSENAL PRETRAINING`  
**Alcance:** sólo Z1–Z3: dashboards, predicción de desviaciones y benchmarking.  
**Estado de evidencia:** **PREREQUISITE_TESTED** para los invariantes ejercitados; **PARTIAL** como capacidad ARKI integral. Esta ficha no declara competencia profesional, validación física, certificación ni autorización de decisión humana.

## Z1 — Dashboards con estado epistémico

**CAPABILITY_ID:** `Z1`  
**NAME:** Dashboard analítico con contexto y estado de evidencia  
**PURPOSE:** Resumir indicadores por proyecto, tiempo y escenario sin borrar incertidumbre ni confundir cálculo interno con verdad, cumplimiento o certificación.  
**CORE_CONCEPTS:** métrica; dimensión; serie temporal; snapshot; `KNOWN`; `UNKNOWN`; `OBSERVED`; `FORECAST`; `STALE`; `PROPOSED`; `AUTHORIZED`; provenance; unidad; escala; aplicabilidad; frescura; filtro; agregación descriptiva.  
**PREREQUISITES:** esquema de métrica; identificador de proyecto; período o timestamp; escenario; unidad y escala; fuente/provenance; estado epistémico; regla de valores faltantes; versión del dato; autoridad humana para interpretar y decidir.  
**INPUTS:** registros con `project`, `time`, `scenario`, `metric`, `value` nullable, `unit`, `provenance`, `epistemic`, `applicability` y `scale`; filtros declarados; tolerancia y zona temporal cuando sean relevantes.  
**OUTPUTS:** tarjetas, tablas o series con conteos y agregaciones trazables; etiqueta de estado; fuente y versión; `UNKNOWN` explícito; alerta de incompatibilidad o stale; exportación de revisión, no decisión automática.  
**CORE_RELATIONSHIPS:** un dashboard visualiza una proyección de datos y no crea hechos; una agregación hereda contexto y debe declarar su regla; `UNKNOWN` no es cero; forecast no es observación; preview no es aprobación; hash no es firma; import success no demuestra fidelidad semántica.  
**BASIC_METHODS_OR_ALGORITHMS:** validación de envolvente mínima; filtros por proyecto/tiempo/escenario; agregación por unidad y escala compatibles; conteo separado de conocidos y desconocidos; control de frescura; detección de mezcla de provenance; series descriptivas. Para datos estocásticos: registrar semilla y versión.  
**COMMON_FAILURES:** imputar faltantes sin marcarlo; mezclar `m`, `mm`, `kWh` o escalas incompatibles; mostrar forecast como hecho; ocultar la fuente; sumar métricas de aplicabilidad distinta; llamar “cumplido”, “elegible”, “certificado” o “pagado” a un indicador interno; tratar observación visual u OCR como medición canónica.  
**LIMITS:** no demuestra exactitud física, completitud del proyecto, cumplimiento normativo, calidad de as-built ni suficiencia de datos; no sustituye control estadístico, revisión de dominio ni autoridad humana.  
**PROFESSIONAL_BOUNDARY:** no implementa ni declara solver profesional, firma, certificación, expediente emitible, decisión regulatoria, aprobación, publicación o asesoría legal/financiera/contable.  
**ARKI_EXISTING_KNOWLEDGE:** `ARLU_CORPORATE_DASHBOARD_SPEC.md` documenta paneles Funding, Validation, Corporate Brain, Financial OS, IP y Risk & Decisions, junto con estados `KNOWN`, `UNKNOWN`, `STALE`, `PROPOSED`, `AUTHORIZED` y `NOT_APPLICABLE`; también delimita crear ≠ publicar y calcular ≠ declarar [1]. `client/src/modules/MetricsModule.tsx` contiene un componente visual mínimo `MetricsModule({label,value,icon})`, evidencia de UI reutilizable pero no de semántica analítica, provenance ni runtime demostrado [2].  
**ARKI_NEW_TRAINING:** contrato mínimo de registro analítico con contexto completo; separación de valores observados y desconocidos; dashboard descriptivo fail-closed ante unidad, escala o aplicabilidad incompatibles; preservación de provenance al resumir; assertions NORMAL/ADVERSARIAL/TRANSFER y un mutante que intenta contar `UNKNOWN` como conocido.  
**GAPS_REMAINING:** no se inspeccionó ni se demostró un dashboard Z productivo con almacenamiento/versionado, permisos, filtros auditables, freshness automática, intervalos de confianza o evidencia de runtime; falta definir catálogo de métricas, política de imputación y reglas de reconciliación por dominio.

## Z2 — Predicción y detección de desviaciones

**CAPABILITY_ID:** `Z2`  
**NAME:** Predicción de desviaciones con incertidumbre explícita  
**PURPOSE:** Comparar observado, baseline, plan o forecast para detectar una diferencia contextualizada y priorizar revisión; no convertir una predicción en hecho.  
**CORE_CONCEPTS:** baseline; residual/delta; horizonte; forecast; observado; ventana temporal; tolerancia; intervalo de predicción; drift; anomalía; escenario; escala; aplicabilidad; UNKNOWN; provenance; semilla y versión de modelo.  
**PREREQUISITES:** series suficientemente completas y comparables; unidad común o transformación documentada; definición de baseline; timestamp y zona; horizonte; criterio de desviación; provenance de datos y modelo; evaluación retrospectiva; autoridad humana para aceptar una alerta.  
**INPUTS:** `observed`, `baseline` o `forecast`; métrica y unidad; proyecto; tiempo; escenario; escala; aplicabilidad; fuente; versión del modelo; tolerancia; opcionalmente intervalo de confianza/predicción y semilla.  
**OUTPUTS:** delta o residual con unidad; estado `COMPUTED_DEVIATION`, `UNKNOWN` o `INCOMPARABLE`; contexto completo; provenance compuesto; alerta priorizable; intervalo y calidad del modelo si existen; recomendación de evidencia faltante. No produce certificación ni causa física por sí sola.  
**CORE_RELATIONSHIPS:** desviación = comparación condicionada, no sentencia causal; forecast y baseline son roles distintos de observado; falta de valor o contexto produce `UNKNOWN`; cambio de unidad, escala o aplicabilidad bloquea comparación; una alerta requiere revisión y evidencia independiente.  
**BASIC_METHODS_OR_ALGORITHMS:** delta absoluto y relativo con unidades; reglas de tolerancia; rolling baseline; medias móviles; regresión o modelos de series temporales sólo como propuestas condicionadas a datos y validación; backtesting temporal; partición train/test; intervalos de predicción; detección robusta de outliers. Registrar fórmula, versión, seed, horizonte y métricas de error.  
**COMMON_FAILURES:** leakage temporal; baseline elegido después de ver el resultado; comparar proyecto con portfolio sin declarar escala; comparar `kWh` con `MJ`; confundir residual con causa; dar punto estimado sin intervalo; tratar un forecast como medición; ocultar cambios de modelo; producir alerta con provenance desconocido.  
**LIMITS:** una desviación no prueba incumplimiento, defecto, riesgo estructural ni causalidad; la calidad depende de cobertura, sesgo, estacionalidad, tolerancia y aplicabilidad; sin validación retrospectiva la predicción queda en propuesta/UNKNOWN.  
**PROFESSIONAL_BOUNDARY:** no sustituye ingeniería, commissioning, inspección, auditoría, diagnóstico clínico, asesoría financiera ni revisión normativa; no firma, certifica ni autoriza intervención.  
**ARKI_EXISTING_KNOWLEDGE:** el escenario transversal de COCO exige separar “forecast de consumo sin intervalo de confianza” de hecho y solicitar evidencia faltante [3]. La doctrina COCO establece que forecast no es hecho, observación no es hecho canónico y ausencia de evidencia no es `FALSE` [4]. Los tipos de familias existentes incluyen `QuantityRule`, `CostRule`, `ScheduleRule`, `QuantityResult`, `CostResult` y `ScheduleLink`, útiles como fuentes de cálculo contextual, pero no constituyen motor de forecasting [5].  
**ARKI_NEW_TRAINING:** contrato de salida que devuelve `UNKNOWN` ante valor ausente o contexto incomparable; cálculo reproducible de delta conservando unidad, provenance, aplicabilidad, escala, proyecto, tiempo y escenario; separación explícita entre `OBSERVED`, `FORECAST` y `UNKNOWN`; rechazo de promoción epistemológica.  
**GAPS_REMAINING:** no hay evidencia inspeccionada de modelo temporal productivo, backtesting, intervalos, monitorización de drift, calibración, catálogo de tolerancias ni integración con datos reales; faltan criterios de aceptación por dominio y política de revisión humana de alertas.

## Z3 — Benchmarking descriptivo

**CAPABILITY_ID:** `Z3`  
**NAME:** Benchmarking contextual y no certificante  
**PURPOSE:** Comparar métricas entre pares o períodos sólo cuando comparten definición, unidad, escala y aplicabilidad; describir diferencias sin convertir ranking o importación en verdad o certificación.  
**CORE_CONCEPTS:** peer group; cohort; normalización; denominador; unidad; escala; aplicabilidad; período; scenario; provenance; missingness; percentil; mediana; dispersión; comparabilidad; `DESCRIPTIVE_ONLY`; UNKNOWN.  
**PREREQUISITES:** definición común de métrica; población comparable; periodo y escenario; unidad/transformación; escala declarada; denominador; cobertura; reglas de exclusión; provenance; versión; advertencias de sesgo y confidencialidad.  
**INPUTS:** observaciones de varios proyectos o snapshots; metadatos de métrica, unidad, escala, aplicabilidad, proyecto, tiempo, escenario y fuente; reglas de cohort y normalización; límites de datos faltantes.  
**OUTPUTS:** n conocido/desconocido; mediana, media, percentiles o delta sólo en grupos comparables; distribución y advertencias; grupo excluido por incompatibilidad; provenance agregado; estado `DESCRIPTIVE_ONLY` o `UNKNOWN`. No emite “mejor”, “conforme”, “líder” o “certificado” sin criterio y autoridad externa aprobados.  
**CORE_RELATIONSHIPS:** comparabilidad precede agregación; normalizar no elimina sesgo; ranking depende de cohorte, período y denominador; `UNKNOWN` permanece separado; benchmark no equivale a estándar, norma, auditoría ni aceptación contractual; éxito de importación/hash no demuestra fidelidad ni autoría.  
**BASIC_METHODS_OR_ALGORITHMS:** agrupación por `(metric, unit, scale, applicability)`; filtros de cohort; tasas con denominador explícito; mediana y cuantiles robustos; z-score/IQR sólo con supuestos declarados; análisis de sensibilidad; conteo de faltantes; bootstrap con seed si aplica; reporte de intervalos y tamaño muestral.  
**COMMON_FAILURES:** comparar escalas de proyecto y portfolio; mezclar escenarios plan/observado/forecast; usar promedio con outliers sin advertencia; rankear con missingness desigual; presentar un benchmark interno como norma; ocultar transformaciones; usar import success como fidelity o hash como firma.  
**LIMITS:** no prueba causalidad, superioridad, cumplimiento, seguridad, valor de mercado ni equivalencia de proyectos; muestras pequeñas, sesgo de selección y cambios de definición pueden invalidar la comparación.  
**PROFESSIONAL_BOUNDARY:** no es auditoría, certificación, valoración profesional, compliance, licitación ni recomendación de inversión; requiere revisión de dominio y decisión humana antes de cualquier uso externo.  
**ARKI_EXISTING_KNOWLEDGE:** `ARLU_CORPORATE_DASHBOARD_SPEC.md` permite reconciliar, calcular, proponer y exportar un expediente de revisión, pero deja fuera postulación, firma, declaración y pago [1]. La doctrina fija determinismo, unidades, contexto, tolerancia y autoridad humana [4]. El plan CAD existente usa estados de benchmark `PASS`, `PASS_WITH_LOSS_DECLARED`, `BLOCKED`, `UNKNOWN` y `FAIL`, y declara que `UNKNOWN` no se convierte en éxito; se reutiliza sólo como patrón de estados, no como solver CAD ni como evidencia de Z productivo [6].  
**ARKI_NEW_TRAINING:** benchmark agrupado por comparabilidad explícita; estado `DESCRIPTIVE_ONLY`; provenance por peer; conteo conocido/desconocido; bloqueo de unidades, escalas o aplicabilidades incompatibles; transferencia a un caso energético sintético distinto de cualquier examen conocido.  
**GAPS_REMAINING:** no hay evidencia de dataset curado, gobernanza de cohortes, anonimización, intervalos, pruebas estadísticas, control de sesgo, versionado de definiciones ni runtime de benchmarking Z; tampoco existe criterio aprobado para nombrar peers o declarar una referencia externa.

## Invariantes transversales de Z

Los ejercicios de esta entrega preservan siempre `UNKNOWN`, provenance, units, applicability, scale y, cuando corresponde, `project`, `time` y `scenario`. Un cálculo puede ser reproducible y aun así no ser verdad física. Una observación, simulación, forecast, hash o import success conserva su rol original. La única salida de autoridad es una propuesta para revisión humana.

## Estado y trazabilidad

La prueba ejecutada en `EXERCISES_Z.txt` cubre tres microejercicios propios: `NORMAL`, `ADVERSARIAL` y `TRANSFER`. Todos pasaron. Un mutante controlado que cuenta un `UNKNOWN` como conocido fue detectado por la assertion (`MUTANT_KILLED=1`) y el código correcto permaneció intacto. Esto prueba invariantes de contrato, no competencia profesional ni implementación integral de Z.

**References**

[1]: `../../ARLU_CORPORATE_DASHBOARD_SPEC.md` "AR-LU Corporate Dashboard — Especificación v0.1"
[2]: `../../client/src/modules/MetricsModule.tsx` "ARKI MetricsModule"
[3]: `EXERCISES/TRANSVERSE_SCENARIO.md` "COCO-EXPRESS-002 — Transfer Scenario"
[4]: `CORE/COCO_CORE_DOCTRINE.md` "COCO-EXPRESS-002 — Core Doctrine"
[5]: `../../shared/arkiParametricFamilies.ts` "ARKI parametric family and quantity/cost/schedule types"
[6]: `../../ARKI_CAD_001B_BENCHMARK_PLAN.md` "ARKI-CAD-001B — ABB-001 Adapter Benchmark Plan"

**Anti-contaminación:** no se usaron respuestas de exámenes DeepSeek/Lipsic. Los fixtures son sintéticos, propios y separados de cualquier fixture de examen.

**Protecciones respetadas:** no se modificaron Product State, BKH, TX, E5–E8 ni PF-H01.
