# ARKI / ARQUI — 11 macroórdenes de pruebas F1–F10 + E2E transversal
**Versión:** 1.0 · **Fecha:** 2026-10-09 · **Estado:** ÓRDENES DE PRUEBA PREPARADAS / NO EJECUTADAS
**Autoridad:** declaración del PO: F1–F10 implementadas; ejecutar pruebas, entregar evidencia y solicitar aprobación del PO EN EL CHAT.
**Repositorio de integración:** `YvanCastilloQuezada/sicl-web@feat/f7-f8-integral-closure`.
**Repositorio Core:** `YvanCastilloQuezada/sicl-core` (resolver rama y SHA exactos antes de probar).
**Límite:** ninguna macroorden implica aprobación, merge, cambio de estado, reescritura FROZEN ni promoción canónica.

## CONTRATO DE EJECUCIÓN COMÚN (obligatorio para las 11 macroórdenes)
**Objetivo:** VERIFICAR lo ya implementado, no reimplementarlo. Primero inventariar, luego ejecutar, diagnosticar y, sólo si se autoriza, proponer corrección mínima en rama aislada.

1. **Baseline:** registrar UTC, host/OS, Node/pnpm/Python, repositorio, rama, SHA HEAD exacto, estado git limpio, manifiestos, dependencias y permisos. Nunca mezclar salidas de SHA distintos.
2. **Descubrimiento real:** mapear código, contratos, tests y workflows existentes para la fase. No inferir ausencia por una búsqueda vacía. Registrar HECHO / SUPUESTO / UNKNOWN.
3. **Preparación reproducible:** instalar desde lockfile sin actualizar dependencias ni ejecutar migraciones destructivas; separar entornos Web/Core; secretos fuera de logs; fixtures sintéticos.
4. **Pruebas estáticas y focales:** Web `pnpm check`, `pnpm exec vitest run <rutas de tests existentes>`; Core `python -m pytest <rutas existentes> -q`. Primero confirmar rutas y entorno; **no inventar archivos**.
5. **Regresión:** `pnpm test`, `pnpm build`, `python -m pytest -q` según repositorio y entorno. Ejecutar E2E reales sólo si sus dependencias/servicios están disponibles. No declarar PASS si falta runner.
6. **Adversarial:** inputs inválidos, UNKNOWN, autorización, integridad de fingerprint, concurrencia, rollback, idempotencia, reinicio, dependencias cruzadas, aislamiento y provenance. No tocar producción.
7. **Recibo por prueba:** ID, fase, hipótesis, repo@SHA, comando exacto, hora, fixture, expected, actual, PASS/FAIL/BLOCKED/NOT_RUN, log/artefacto, cobertura, limitación y reproducibilidad.
8. **Correcciones:** si FAIL, crear issue o propuesta de parche mínimo; NO cambiar Core/D-2/AGK/FROZEN sin autorización específica. El ejecutor controlado V0 sólo verifica PR y no corrige autónomamente. Re-ejecutar regresión y revisión Qwen cuando aplique.
9. **Cierre:** emitir informe de fase, riesgos y **pregunta de validación al PO en ChatGPT**. Opciones: APROBAR / RECHAZAR / SOLICITAR CORRECCIÓN; aprobación siempre referida a SHA y alcance.
10. **Estados separados:** IMPLEMENTADO_DECLARADO_PO; TESTED_PASS/FAIL/BLOCKED/NOT_RUN; PO_APPROVED/REJECTED/PENDING; FREEZE no equivale a aprobado.
11. **Política de CI:** registrar checks de GitHub Actions y logs verificables; status `success` aislado no acredita calidad profesional, ejecución física ni integración end-to-end.

## MO-00 — Preparación y descubrimiento transversal
**Entrada:** ambos repositorios y ramas de integración; mapa maestro F1–F10.
**Automatizar:** inventario de ramas/PR, SHA, CI, rutas de tests, cobertura por fase, diferencias con mapa maestro, contratos Core/Web, matriz de dependencias y FROZEN. Identificar pruebas existentes y requisitos de ejecución (Windows E3, SQL Server/S10, servicios Core, IFC/OCCT). Preparar una cola reproducible, sin cambios de código.
**Salida:** `00_inventory.json`, `00_coverage.md`, `00_environment.md`, lista de BLOCKED. Gate: ninguna fase puede declararse probada sin identificar su HEAD exacto.

## MO-01 — F1 Identidad, confianza y Project State
**Pruebas:** unicidad y persistencia de IDs, Project Snapshot, versiones, autoridad Core, ledger/event log append-only, restart/rollback, provenance, HumanReview, acceso no autorizado, replay/idempotencia y aislamiento entre proyectos.
**Negativos:** evento duplicado, fingerprint alterado, proyecto cruzado, mutación desde UI, decisión humana sin binding.
**Gate:** sólo Core altera verdad canónica; evidencia reproducible de identidad, custodia y trazabilidad. No equivaler a firma legal auténtica sin integración verificada.

## MO-02 — F2 Conocimiento y Universidad
**Pruebas:** ingestión de fuentes, clasificación KNOWLEDGE vs IDEA, D6.1/D6.2, citas, vigencia, jurisdicción, curaduría, Book/Tutor/Professor/Examiner si existen, examen y Version Watcher, autorización de promoción del conocimiento.
**Negativos:** fuente inexistente, contenido contradictorio, obsoleto, alucinación normativa, transferencia entre jurisdicciones/escalas sin evidencia, entrada de texto promovida automáticamente a conocimiento.
**Gate:** aprendizaje y uso de fuentes gobernados, provenance y UNKNOWN conservados; no confundir respuestas de modelo con verificación normativa.

## MO-03 — F3 Inteligencia arquitectónica
**Pruebas:** interpretación de encargo, hechos/supuestos/restricciones/preferencias, D6.2 reasoning, agentes especializados, razones WHY, cobertura, trazabilidad causal y registro de razonamiento sin mutación D-2.
**Negativos:** restricciones contradictorias, dato ausente, fallo de fuente, dependencia desconocida, prioridad incompatible y supuesto presentado como hecho.
**Gate:** propuestas razonadas y auditables; decisión humana explícita; ausencia de canonización silenciosa.

## MO-04 — F4 Partido, topología y exploración generativa
**Pruebas:** programa, relaciones funcionales/circulación/espaciales, PartiContract, candidatos divergentes, coherencia multiescala, D6.3 bridge, geometría hipotética vs canónica, backtracking y UNKNOWN de puertas/accesos.
**Negativos:** relación circular inválida, espacio desconectado, candidato sin provenance, default de puerta inventado, topología que viola restricciones, promoción desde hipótesis.
**Gate:** genealogía y relaciones verificables; ninguna hipótesis escribe D-2 por sí misma.

## MO-05 — F5 Evaluación y embudo
**Pruebas:** evaluación multiobjetivo, Pareto, genealogía N→16→4→1 como estrategia y no cuotas fijas, diversidad, contraejemplos, selección humana, cobertura y comparación reproducible.
**Negativos:** candidato rechazado reaparece como seleccionado, puntuación sin evidencia, colapso prematuro, UNKNOWN tratado como cero, cambio de criterios sin versionar.
**Gate:** decisión trazable con candidatos rechazados preservados, no ganador implícito.

## MO-06 — F6 AGK / geometría 3D [FROZEN — SÓLO LECTURA/PRUEBAS]
**Pruebas:** OCCT/AGK, geometría operacional, extrusiones y operaciones existentes, restricciones paramétricas, persistent naming DELTA-005, regeneración, estabilidad de IDs, concurrencia, transacciones, puente D6.3→D-2, roundtrip CAD/IFC según soporte, G12 no-template-hardcoding y casos degenerados.
**Negativos:** NaN, dimensiones negativas/cero, auto-intersección, orientación incorrecta, referencias rotas, input forjado, rollback, concurrencia.
**Gate:** identidad estable y mutación canónica sólo por API autorizada; respetar frontera FROZEN. Tests destructivos sólo sobre fixtures aislados, nunca datos reales.

## MO-07 — F7 Desarrollo técnico profesional
**Pruebas:** `BASELINE_0` inmutable, `arkiProfessionalState`, coordinación estructura/MEP, normas RNE con evidencia/jurisdicción, accesibilidad/incendio, cantidades/costos, `arkiProjectEconomicTwin`, OECE/S10, procedencia y conflictos disciplinares.
**Negativos:** baseline alterado, proyección duplicada, evidencia profesional ausente, costo sin cantidades, cambio de disciplina sin propagación, input S10 no confiable.
**Gate:** desarrollo coordinado y evidencia de origen; sin afirmar aceptación profesional automática. Incluir pruebas OECE y S10 si servicios/fixtures disponibles.

## MO-08 — F8 Expediente técnico y entrega
**Pruebas:** `arkiTechnicalDossier`, planos/secciones/elevaciones, especificaciones, metrados, presupuesto, cronograma, versiones y firmas/revisiones, linaje D-2→F7→F8, consistencia de artefactos y exportaciones disponibles.
**Negativos:** dossier alterado, IDs duplicados, artefacto de otro proyecto, F7 no aceptado, plano desactualizado, export que no corresponde al SHA de origen, firma no verificable.
**Gate:** dossier derivado reproducible y verificable, con revisión humana; no inventar firma ni expediente profesional real.

## MO-09 — F9 Construcción, campo y gemelo digital
**Pruebas:** `arkiF9ConstructionLineage`, design→field→review, baseline liberada, observaciones de obra con procedencia, cambios/as-built, sincronización de evidencias, captura AR/GPS/WebXR sólo si hay hardware y dataset real.
**Negativos:** observación de otro proyecto, evidencia manipulada, liberación ausente, geometría de campo que intenta escribir D-2, revisión sin autoridad, conflicto as-built.
**Gate:** evidencia real de campo o BLOCKED explícito; no declarar gemelo físico validado por mocks.

## MO-10 — F10 Operación, mantenimiento y aprendizaje
**Pruebas:** inventario de activos, O&M, telemetría, alarmas, mantenimiento preventivo, costos de ciclo de vida, permisos/privacidad, retroalimentación a conocimiento por D6.2, compatibilidad con estado F9 y versionado.
**Negativos:** sensor ausente o espurio, evento repetido, datos personales filtrados, mantenimiento no autorizado, recomendación que altera D-2, aprendizaje sin curaduría, reinicio/replay.
**Gate:** lazo operacional verificable con fuente real o fixture claramente rotulado; no declarar operación real si sólo hay simulación.

## MO-11 — E2E de un solo organismo y aceptación global
**Cadena:** F1 encargo/Project State → F2 fuentes → F3 razonamiento → F4 Parti → F5 selección → F6 AGK → DeveloperProposal → HumanReview exacta → Core promotion → D-2 persistido → F7 desarrollo → F8 dossier → F9 cambio de campo → F10 operación y feedback.
**Pruebas:** una sola autoridad Core/Project Snapshot/D-2/event log/AGK; fingerprints entre fases; eventos→derivación→dependencias→impacto→reacción→recomputación selectiva; rehidratación; fail-closed; idempotencia; rollback; performance y aislamiento. MICROCASE-DEV-001 y CASE-001 cuando sus fixtures sean ejecutables. Contrastar vistas Maqueta Viva con fuente canónica sin declararlas ejecución.
**Negativos:** sustitución de propuesta después de HumanReview, bypass, escritura desde representación, UNKNOWN inventado, divergencia de versiones, FROZEN modificado.
**Gate:** NO cierre global mientras alguna fase esté FAIL/BLOCKED/NOT_RUN o sin decisión PO; conservar evidencia de cada salto.

## Entrega de resultados al PO EN ESTA CONVERSACIÓN
Por cada fase:
```text
ARKI TEST RECEIPT — MO-XX / FXX
Web: repo@SHA | Core: repo@SHA | Fecha/entorno:
Casos: total / PASS / FAIL / BLOCKED / NOT_RUN:
Pruebas y comandos ejecutados:
Evidencia enlazada (CI, logs, capturas, artefactos):
Defectos y riesgos:
Conclusión técnica: PASS / FAIL / BLOCKED / NOT_RUN
Decisión PO solicitada: APROBAR / RECHAZAR / SOLICITAR CORRECCIÓN
```
La aprobación en el chat no sustituye las autorizaciones de merge, publicación o mutación canónica previstas por sus contratos.

## Implementación del automatizador — condición
Este archivo define **órdenes ejecutables por un agente/runner con acceso a los repositorios**, pero no instala ni dispara por sí solo GitHub Actions, CI, tareas programadas o runners Windows. Reusar workflows y scripts existentes. Para automatización sin intervención, crear **un workflow read-only separado** únicamente tras verificar rutas, permisos, secretos, fixtures, coste y límites; nunca auto-merge ni auto-approve. No declarar ejecuciones que no hayan ocurrido.
