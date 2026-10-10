# ARKI — ADN de mejora continua (contrato arquitectónico propuesto)

**Estado:** PROPOSED / NOT CANONICALLY PROMOTED / NOT IMPLEMENTED IN CORE
**Ámbito:** ARKI/ARQUI, transversal a F1–F10, diseño arquitectónico, AGK, agentes, evidencia y operación.
**No confundir:** el ÁRBOL Gemelo Digital observa esta capacidad; no es su motor ni su fuente de verdad.
**Restricciones:** no modificar FROZEN, no promover automáticamente, no modificar Core/AGK sin autorización y pruebas.

## Invariante ADN-MC-001

> Toda capacidad de ARKI debe poder observar su resultado, detectar déficits, formular hipótesis de mejora, proponer alternativas, someterlas a pruebas reproducibles, evaluar diferencias y registrar aprendizaje trazable; ninguna propuesta puede presentarse como mejora verificada sin evidencia suficiente.

La mejora continua **es una propiedad intrínseca del núcleo unificado**, no un microservicio opcional, un agente independiente ni un motor encadenado en runtime. Su semántica debe incorporarse a Project State y a los contratos de ejecución, y no solo a la interfaz.

## Dos verdades distintas

1. **Regla canónica del sistema:** ARKI está obligado a intentar detectar y corregir deficiencias cuando tenga observaciones válidas y recursos autorizados. Este principio debe pasar por aprobación formal antes de congelarse como contrato del Core.
2. **Contenido de una mejora:** una idea o mutación empieza como hipótesis. Solo puede pasar a resultado verificado cuando su prueba real, trazabilidad y controles superen las puertas establecidas. El aprendizaje experimental no equivale a mutación canónica.

## Máquina de estados mínima

`OBSERVED → DEFICIT_IDENTIFIED → HYPOTHESIS → CANDIDATES → EXPERIMENT_AUTHORIZED → EXECUTED → EVALUATED → LEARNING_RECORDED → [PROPOSED_FOR_PROMOTION | REJECTED]`

Rutas de fallo explícitas: `UNKNOWN`, `INSUFFICIENT_EVIDENCE`, `TEST_FAILED`, `REGRESSION_DETECTED`, `AUTHORIZATION_REQUIRED`, `ROLLBACK_REQUIRED`.

- Las observaciones deben vincularse a datos, versión, timestamp, agente/productor y contexto.
- Cada déficit debe tener criterio objetivo de detección y severidad.
- Las alternativas deben compararse contra baseline y restricciones, no solo entre sí.
- Los experimentos de arquitectura pueden operar en escenarios aislados; los cambios del código, permisos y verdad canónica requieren autorización separada.
- El aprendizaje debe registrar también hipótesis rechazadas y causas, evitando repetir errores.
- Ninguna evaluación de una sola métrica puede ocultar degradación en seguridad, normativa, exactitud geométrica o cobertura.

## Contrato mínimo de evidencia por iteración

`baseline`, `input`, `initialUnknowns`, `deficit`, `hypothesis`, `candidates`, `rejectedCandidates`, `testPlan`, `authorization`, `executionReceipt`, `metricsBefore`, `metricsAfter`, `regressions`, `dependencyPropagation`, `newUnknowns`, `evidence`, `decision`, `learning`, `rollbackPlan`, `producerIdentity`, `sourceCommit`.

## Autonomía gradual

- **A0 — Diagnóstico:** ARKI identifica déficits y emite propuestas. No cambia estado.
- **A1 — Experimentación aislada:** ejecuta pruebas y alternativas dentro de un presupuesto y un sandbox autorizado.
- **A2 — Aprendizaje experimental:** conserva conocimiento versionado con procedencia y prueba de restauración; no muta FROZEN.
- **A3 — Promoción supervisada:** solicita aprobación de cambios canónicos con evidencia y revisión independiente.
- **A4 — Operación autónoma acotada:** solo para clases de cambios previamente autorizadas, reversibles, con límites y parada automática. Nunca autoriza por sí mismo ampliar sus propios permisos.

## Puertas de cierre

1. Esquema de eventos y estado único integrado al Core, sin segundo motor de verdad.
2. Recolección autenticada de resultados reales de Core/AGK y agentes.
3. Evaluación reproducible multiobjetivo, con pruebas adversariales y regresión.
4. Historial append-only, rollback, versionado, límites de recursos y aislamiento.
5. Pruebas E2E de ciclos consecutivos **iniciados por ARKI**, sin instrucción manual entre ciclos.
6. Auditoría Red Team (Qwen) y aprobación explícita del contrato canónico.

## Criterio de demostración

Una prueba de mejora continua autónoma debe comenzar con un encargo o déficit inicial, permitir que ARKI identifique al menos una oportunidad **no predefinida por el operador**, genere alternativas, ejecute pruebas autorizadas, compare contra baseline y conserve una decisión justificable. Repetir el ciclo sobre la observación nueva demuestra continuidad; un único script que reordena tareas no la demuestra.

**Estado real a 2026-10-10:** esta definición está documentada en la rama experimental; no se afirma que la autonomía esté ejecutándose ni que la regla esté ya integrada al estado canónico.

## Referencia ejecutable experimental A0/A1

Se añadieron `arki-adn-mejora-continua.cjs`, `arki-adn-mejora-continua.test.cjs` y `Run-ARKI-ADN-MC.cjs` en `tools/maqueta-viva/`. Detectan deficits en métricas verificadas, generan hipótesis de mejora deterministas y producen un reporte de solo lectura. No ejecutan geometría, no modifican FROZEN ni promueven resultados al Core.

`iterate()` se detiene tras la primera observación; para continuar exige observaciones independientes nuevas. `evaluate()` mantiene las mejoras como pendientes de revisión externa. El runner se inicia manualmente; no existe todavía un disparador autónomo persistente.

Prueba: `node tools/maqueta-viva/arki-adn-mejora-continua.test.cjs`.

**Estado:** IMPLEMENTED_EXPERIMENTALLY / NOT_CANONICAL / AUTONOMOUS_RUNTIME_NOT_IMPLEMENTED / NOT_VERIFIED.
