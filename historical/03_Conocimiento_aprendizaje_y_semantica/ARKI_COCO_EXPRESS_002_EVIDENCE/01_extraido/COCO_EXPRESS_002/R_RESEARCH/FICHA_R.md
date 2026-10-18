# Ficha R — Investigación y evolución

**Orden:** COCO-EXPRESS-002 FULL ARSENAL PRETRAINING  
**Alcance:** R1 benchmark, R2 generación adversarial, R3 meta-learning.  
**Estado:** `PARTIAL` — los prerrequisitos epistemológicos y el test pequeño están ejecutados; no existe todavía un subsistema R canónico ni evidencia de competencia profesional.

## CAPABILITY_ID

`R1`, `R2`, `R3`.

## NAME

**R — Investigación y evolución:** evaluación reproducible, búsqueda de casos límite y transferencia entre tareas sin confundir adaptación con memorización.

## PURPOSE

R1 mide comportamiento sobre particiones y oráculos explícitos. R2 produce perturbaciones controladas que intentan romper invariantes de provenance, epistemología, unidades, aplicabilidad y escala. R3 estudia adaptación a tareas nuevas mediante pocos ejemplos y separación entre soporte y consulta. El propósito es entrenar razonamiento auditable, no resolver expedientes profesionales, firmar, certificar ni convertir un resultado experimental en verdad canónica.

## CORE_CONCEPTS

`benchmark`, conjunto de referencia, partición normal/adversarial/transfer, oracle, métrica, reproducibilidad, semilla, mutación controlada, metamorfismo, generación de casos límite, task distribution, support/query, adaptación, generalización, UNKNOWN, provenance, units, applicability, scale, project, time, scenario, Human Authority.

La doctrina existente impone la separación `KNOWLEDGE ≠ PROJECT_STATE ≠ EVIDENCE ≠ MEMORY ≠ STRATEGY`. También distingue `FACT`, `ASSUMPTION`, `OBJECTIVE`, `RESTRICTION`, `PREFERENCE`, `REQUIREMENT`, `OBSERVATION`, `EVIDENCE`, `INFERENCE`, `DECISION` y `UNKNOWN`.[1]

## PREREQUISITES

Se requiere un contrato de registro con identidad estable, fuente, autoridad, versión, escala, fecha o intervalo temporal, aplicabilidad, proyecto, escenario, unidades y estado epistémico. El benchmark necesita etiquetas u oracle independiente, casos sintéticos separados de cualquier examen y una política de partición que evite fuga entre train/support y test/query. Los cálculos deterministas deben fijar versión, condiciones y seed; toda magnitud debe conservar unidades y contexto.[1] [2]

## INPUTS

Registros o tareas sintéticas con `id`, valor o `null`, estado epistémico, tipo de evidencia, unidades, provenance y contexto `{project, time, scenario, scale, applicability}`. Para R1 se añaden etiqueta esperada y predicción. Para R2 se añade un operador de mutación explícito y una propiedad que el oracle debe rechazar. Para R3 se añaden tareas fuente, conjuntos support/query, cambio de identificadores, magnitudes, orden, dominio o topología y seed cuando haya aleatoriedad.

## OUTPUTS

Un resultado reproducible con casos evaluados, versión, seed, partición, oracle, métricas y conteo de UNKNOWN preservados. R2 produce el caso mutado, la propiedad violada y el diagnóstico; no lo promueve a verdad. R3 produce adaptación y error en query junto con provenance de la tarea, sin declarar aprendizaje profesional. Un resultado `PASS` sólo significa que pasó el oracle definido para el ejercicio.

## CORE_RELATIONSHIPS

R1 establece una línea base para R2 y R3. R2 prueba si R1 detecta pérdida de metadatos, promoción epistemológica o confusión de evidencia. R3 reutiliza el contrato de R1 pero cambia contexto para probar transferencia y no coincidencia literal. `UNKNOWN` se conserva cuando falta evidencia; `OBSERVATION`, `SIMULATION`, `FORECAST`, `HASH` e `IMPORT_SUCCESS` no se convierten automáticamente en `FACT`, medición, firma, fidelidad o certificación. `project`, `time`, `scenario`, `scale` y `applicability` delimitan qué comparación es válida.

## BASIC_METHODS_OR_ALGORITHMS

**R1 — Benchmark.** Construir fixtures sintéticos versionados; separar normal, adversarial y transfer; ejecutar un oracle determinista; informar exactitud o cobertura sólo sobre etiquetas conocidas; reportar UNKNOWN aparte. Incluir pruebas de serialización y de preservación de provenance.

**R2 — Adversarial generation.** Aplicar mutaciones acotadas: eliminar escala o unidades, intercambiar proyecto/escenario, usar una fuente sin autoridad/version, reordenar entradas, duplicar identificadores o promover una observación a `FACT`. El oracle debe rechazar el registro inválido o mantenerlo como no canónico. Las mutaciones no deben copiar fixtures de exámenes.

**R3 — Meta-learning/transfer.** Muestrear tareas sintéticas relacionadas; adaptar una regla o representación con support; medir en query no visto; cambiar nombres, orden, magnitudes y dominio; comparar contra una línea base. Registrar seed y tarea. El método demuestra una propiedad experimental de transferencia, no inteligencia general ni competencia profesional.

## COMMON_FAILURES

Memorizar fixtures o respuestas; mezclar train y test; optimizar sólo el score y ocultar UNKNOWN; tratar ausencia de evidencia como `FALSE`; perder provenance durante serialización; comparar escalas o jurisdicciones incompatibles; aceptar importación como fidelidad; tratar hash como firma; convertir forecast o simulación en hecho; usar mutantes que no representan una propiedad real; informar adaptación sin query independiente; extrapolar una norma o resultado fuera de su aplicabilidad.

## LIMITS

La evidencia actual es un test pequeño sobre fixtures sintéticos, no un benchmark estadísticamente representativo. No hay suite canónica R ni entrenamiento meta-learning persistente. El score normal observado es ilustrativo (`1/2` casos conocidos) y no es una tasa de competencia. Los ejercicios no validan física, normativa, seguridad, estructura, MEP, energía, LCA/LCC, operación ni cualquier solver profesional.

## PROFESSIONAL_BOUNDARY

Esta ficha prepara investigación y evaluación transferibles. No declara competencia profesional de ARKI ni de un agente. No emite expediente, informe firmado, certificado, aprobación, decisión legal o publicación. Sólo la Human Authority decide, aprueba, firma o publica. Ningún hash, preview, import success, simulación, observación o forecast sustituye evidencia y revisión competente.[1]

## ARKI_EXISTING_KNOWLEDGE

La inspección real encontró `COCO_EXPRESS_002/CORE/COCO_CORE_DOCTRINE.md`, que ya fija separación epistemológica, provenance mínimo, determinismo, unidades y frontera profesional. `COCO_EXPRESS_002/CORE/ANTI_CONTAMINATION_FIREWALL.md` ya exige fixtures sintéticos independientes y prohíbe respuestas, valores, assertions y lógica de exámenes DeepSeek/Lipsic. COCO-001 aporta `UNKNOWN`, provenance/evidence, applicability, scale y determinismo en sus contratos y matriz de pruebas; su auditoría establece la política `REUSE > EXTEND > CREATE` y estado parcial.[2] [3] [4]

No se encontró una implementación o ficha R dedicada en `COCO_EXPRESS_002` durante la inspección acotada. Por ello esta entrega añade conocimiento de entrenamiento en un archivo de investigación, sin crear propietario paralelo del Project State y sin modificar Product State, BKH, TX, E5-E8 o PF-H01.

## ARKI_NEW_TRAINING

Se fijó el contrato operativo R1-R3, con separación normal/adversarial/transfer y un envelope común de metadatos. Se añadieron tres microejercicios propios en `EXERCISES_R.txt`: benchmark de clasificación térmica sintética, mutación adversarial de una observación de válvula y transferencia a forecast/import/hash de demanda hídrica. El test ejecutado conserva UNKNOWN, units, provenance, applicability, scale, project, time y scenario; detecta dos mutantes controlados: escala eliminada y promoción indebida de observación a FACT.

## GAPS_REMAINING

Falta una suite R versionada con más tareas y particiones, un oracle independiente revisado por Human Authority, métricas de intervalos de confianza y pruebas de fuga entre tareas. Falta implementar generación adversarial reproducible a escala, registro de seeds y corpus de mutantes con cobertura. Falta un protocolo R3 con soporte/query, baselines y evaluación de transferencia fuera del dominio sintético. También falta revisión independiente de aplicabilidad por jurisdicción, tiempo y escala. Estos gaps impiden elevar el estado a competencia profesional o certificación.

## References

[1]: ../CORE/COCO_CORE_DOCTRINE.md "COCO-EXPRESS-002 Core Doctrine"
[2]: ../CORE/ANTI_CONTAMINATION_FIREWALL.md "Anti-Contamination Firewall"
[3]: ../../COCO/COCO_SCOPE_LIMITS.md "ARKI-COCO-001 Scope Limits"
[4]: ../../COCO/COCO_AUDIT.md "COCO-001 Auditoría consolidada"
[5]: ../../COCO/COCO_TEST_MATRIX.csv "COCO Test Matrix"
