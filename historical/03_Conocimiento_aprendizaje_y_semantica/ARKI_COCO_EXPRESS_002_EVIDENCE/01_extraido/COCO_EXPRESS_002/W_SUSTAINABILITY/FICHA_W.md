# COCO-EXPRESS-002 — Ficha W: Sostenibilidad

**Orden:** `COCO-EXPRESS-002 FULL ARSENAL PRETRAINING`  
**Alcance:** W1–W3: LEED/EDGE/BREEAM; Net Zero Carbon; economía circular.  
**Estado de esta ficha:** `PREREQUISITE_TESTED`. El estado sólo acredita el ejercicio de preservación epistemológica y trazabilidad ejecutado en `EXERCISES_W.txt`; no acredita competencia profesional, cumplimiento, certificación ni diseño emitible.

## CAPABILITY_ID

`W1`, `W2`, `W3`.

## NAME

**W — Sostenibilidad aplicada como conocimiento acotado y trazable.**

## PURPOSE

Preparar propuestas, comparaciones y registros de evidencia para decisiones de sostenibilidad en las tres subfamilias. El sistema debe distinguir requisito de certificación, objetivo de proyecto, observación, simulación, forecast, importación y evidencia auditada. Debe conservar procedencia, unidades, aplicabilidad, escala, proyecto, tiempo y escenario. Puede organizar información y señalar faltantes; no sustituye al equipo acreditado, al verificador, al calculista ni a la autoridad humana.

## CORE_CONCEPTS

**W1 — LEED/EDGE/BREEAM.** Son marcos o métodos de evaluación con ediciones, organizaciones, prerrequisitos, créditos, indicadores, documentación y reglas de aplicabilidad. `STANDARD_EXISTS ≠ REQUIREMENT_APPLIES`; una edición, jurisdicción, tipología, fase y ruta de certificación deben quedar identificadas. No se debe mezclar automáticamente el puntaje o lenguaje de un sistema con otro.

**W2 — Net Zero Carbon.** Es un objetivo o declaración cuyo significado depende del límite del sistema, gases incluidos, energía de operación y carbono incorporado, periodo de reporte, factores de emisión, calidad de datos, tratamiento de renovables, compensaciones y escenario. Una simulación o forecast de reducción no es consumo medido ni verificación de neutralidad.

**W3 — Economía circular.** Organiza flujos de materiales y activos mediante prevención, durabilidad, mantenimiento, reparación, reutilización, adaptación, desmontaje, recuperación y reciclaje. Requiere separar cantidad diseñada, cantidad instalada, observación de campo, potencial de recuperación y recuperación efectivamente demostrada. Un hash o una importación exitosa no prueban identidad, fidelidad ni trazabilidad material.

## PREREQUISITES

Se requiere conocer el modelo COCO de estados epistémicos (`FACT`, `ASSUMPTION`, `OBJECTIVE`, `RESTRICTION`, `REQUIREMENT`, `OBSERVATION`, `EVIDENCE`, `INFERENCE`, `DECISION`, `UNKNOWN`, `SIMULATION`, `FORECAST`, `IMPORT_SUCCESS`), provenance mínima, unidades, tolerancias cuando correspondan, escalas y regla de no extrapolación. También se requiere identificar proyecto, fecha o periodo, escenario, versión de fuente, autoridad, jurisdicción y aplicabilidad. Para una certificación real faltan además la edición oficial aplicable, documentación completa, cálculos y revisión de profesionales y verificadores competentes.

## INPUTS

1. Identificador del proyecto, tipología, ubicación, jurisdicción, fase y escala (`COMPONENT`, `BUILDING`, `SITE`, etc.).
2. Objetivo W1, W2 o W3, límite del sistema y escenario; fecha o periodo de referencia.
3. Fuente oficial o registro documental con organización, edición, versión, estado y fecha de consulta.
4. Datos cuantitativos con unidad, método de medición o estimación, tolerancia y calidad de datos.
5. Para W1: prerrequisitos, créditos, evidencias requeridas y ruta de evaluación, sin asumir que aplican.
6. Para W2: energía, actividad, factores de emisión y límites de carbono operativo e incorporado, con sus periodos.
7. Para W3: inventario de materiales, cantidades, composición, condición, uniones, desmontabilidad, destino y evidencia de recuperación.

## OUTPUTS

Registros de decisión y comparación con provenance, estado epistémico y contexto completo; matriz de requisitos y evidencia faltante; balance o indicador de escenario con unidades; inventario de circularidad; lista de supuestos, conflictos y `UNKNOWN`; y propuesta pendiente de revisión humana. Cada salida debe declarar `applicability_result`, límites y nivel de evidencia. Nunca debe emitir por sí sola certificado, sello, firma, cumplimiento legal, Net Zero verificado o afirmación de fidelidad de importación.

## CORE_RELATIONSHIPS

`framework edition → requirement/indicator → applicability → evidence → review status` para W1.  
`system boundary + activity data + emission factor + period + scenario → carbon result` para W2.  
`asset/material identity + quantity + condition + disassembly path + destination + evidence → circularity claim` para W3.  

En las tres familias, `claim → provenance → authority → version/date → scale/project/time/scenario → applicability → evidence → epistemic status`. Los resultados de escalas o escenarios distintos no se combinan sin una relación explícita y justificada. `OBSERVATION`, `SIMULATION`, `FORECAST`, `IMPORT_SUCCESS` y `hash` conservan su semántica y no se promueven a verdad o certificación.

## BASIC_METHODS_OR_ALGORITHMS

**W1:** normalizar el registro de marco y edición; clasificar prerrequisito, crédito, indicador o evidencia; comprobar tipología, ubicación, fase, fecha y ruta; construir una matriz `applies / does-not-apply / UNKNOWN`; y solicitar evidencia faltante. No inferir puntos ni cumplimiento desde una etiqueta o una importación.

**W2:** fijar unidad funcional y límite; normalizar datos con unidades y periodos; calcular transparentemente `actividad × factor de emisión` sólo cuando el factor sea aplicable; separar energía y carbono incorporado; comparar escenarios con supuestos y sensibilidad; etiquetar resultado como observado, calculado, simulado o forecast. Un resultado de escenario no equivale a verificación.

**W3:** construir un inventario por componente; conservar cantidad y unidad; clasificar estrategia circular; seguir identidad y condición mediante provenance; estimar potencial sólo como potencial; y separar recuperación planificada de recuperación observada o demostrada. Para cantidades agregadas, declarar la regla de agregación y su escala.

**Método transversal:** validación de campos obligatorios, detección de contexto incompatible, prueba de invariantes y revisión humana. El pequeño oráculo de `EXERCISES_W.txt` ejecuta estas invariantes y mata un mutante que promociona `IMPORT_SUCCESS` a fidelidad verificada.

## COMMON_FAILURES

Confundir LEED, EDGE y BREEAM o mezclar sus ediciones; tratar una guía o un borrador como norma vigente; asumir aplicabilidad por el nombre del edificio; declarar puntos sin evidencia; usar factores de emisión sin jurisdicción, fecha o unidad; presentar un forecast como consumo medido; omitir carbono incorporado o el límite del sistema; sumar potenciales de recuperación como recuperación real; perder unidades o escala; extrapolar de componente a edificio o de un proyecto a otro; tratar un hash como firma; tratar `import success` como fidelidad; y presentar una simulación como verdad física.

## LIMITS

La evidencia local no demuestra una base normativa de sostenibilidad mantenida por jurisdicción, integración oficial con registradores, cálculo profesional de energía o carbono, LCA/LCC validado, medición operacional, cadena de custodia material, verificación de circularidad, interoperabilidad semántica productiva ni certificación ambiental. No se memorizaron respuestas de DeepSeek/Lipsic. La ficha es pretraining acotado y no extrapola desde documentación conceptual a competencia completa.

## PROFESSIONAL_BOUNDARY

ARKI/COCO puede estructurar conocimiento, preparar escenarios, detectar `UNKNOWN`, comparar opciones y organizar evidencia para revisión. **No firma, certifica, registra, acredita, aprueba ni declara cumplimiento.** No implementa solvers profesionales ni sustituye a un profesional acreditado, un organismo certificador, un verificador de inventario o la autoridad competente. La autoridad humana decide, aprueba, firma o publica.

## ARKI_EXISTING_KNOWLEDGE

Se reutiliza el **COCO Core Doctrine** para separación epistemológica, provenance, unidades, determinismo y límite profesional (`COCO_EXPRESS_002/CORE/COCO_CORE_DOCTRINE.md`). Se reutilizan la auditoría de brechas AKI-001 y su regla de no extrapolación: sostenibilidad aparece en el corpus como `EXPOSED` o `STRUCTURED`, no como capacidad `PRACTICED` o `VERIFIED` (`AKI001_KNOWLEDGE_GAPS.md`). Se reutiliza el modelo de estándares, que mantiene estándares dentro del LKS y distingue `DRAFT`, `CURRENT`, requisito aplicable, ley, regulación y guía (`ARKI_STANDARDS_KNOWLEDGE_MODEL.md`). Se reutiliza el LKS como destino común; no se crea otro registro paralelo (`ARKI_EXISTING_KNOWLEDGE_TOPOLOGY.md`).

## ARKI_NEW_TRAINING

Se añade esta ficha W1–W3 como mapa compacto de conceptos, entradas, relaciones, métodos y límites. Se añaden tres microejercicios sintéticos y distintos de exámenes conocidos: un forecast energético W2, una importación W1 adversarial y una transferencia W3 entre escalas/tiempos/escenarios. Se ejecutan assertions sobre unidades, provenance, estado epistémico, aplicabilidad, escala, proyecto, tiempo y escenario. Se introduce un mutante controlado que afirma `fidelity=VERIFIED` tras `IMPORT_SUCCESS`; el oracle lo detecta (`MUTANT_KILLED=1`) y el código correcto queda intacto.

## GAPS_REMAINING

1. Falta una fuente oficial versionada y mantenida para cada esquema W1, con reglas jurisdiccionales, tipologías, ediciones, prerrequisitos, créditos, evidencias y cambios.
2. Falta validación independiente de resultados W2: límites acordados, datos medidos, factores trazables, incertidumbre, carbono incorporado, renovables y compensaciones.
3. Falta un modelo W3 operativo de pasaporte material, condición, desmontaje, custodia, destino y evidencia de recuperación.
4. Faltan ejercicios reproducibles a escala `SITE`, `DISTRICT` y regional, así como integración con modelo de proyecto real; la evidencia local se concentra en escalas menores y `BUILDING` parcial.
5. Faltan pruebas de interoperabilidad semántica, round-trip y revisión por profesional. Estas brechas permanecen `UNKNOWN` o `PARTIAL`; no son negativas convertidas artificialmente en `FALSE`.

## References

[1]: ../CORE/COCO_CORE_DOCTRINE.md "COCO-EXPRESS-002 Core Doctrine"
[2]: ../../../AKI001_KNOWLEDGE_GAPS.md "ARKI AKI-001 Mapa de deficiencias"
[3]: ../../../ARKI_STANDARDS_KNOWLEDGE_MODEL.md "ARKI Standards Knowledge Model v1.1"
[4]: ../../../ARKI_EXISTING_KNOWLEDGE_TOPOLOGY.md "ARKI Existing Knowledge Topology"
[5]: ../COCO_EXPRESS_002_ORDER_SOURCE.txt "COCO-EXPRESS-002 order source"
