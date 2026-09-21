# ARKI Autonomy Evidence Map

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Escala L0–L10

| Nivel | Estado auditado | Evidencia y razón |
|---|---|---|
| L0 | NOT_VERIFIED | no se asigna por ausencia de autonomía. |
| L1 | NOT_VERIFIED | no hay claim reproducible de asistencia general. |
| L2 | NOT_VERIFIED | la UI no prueba autonomía cognitiva. |
| L3 | NOT_VERIFIED | no hay agente general probado. |
| L4 | NOT_VERIFIED | no se demostró planificación autónoma general. |
| L5 | NOT_VERIFIED | ejecución local no equivale a autonomía contextual. |
| L6 | PARTIAL/DEMONSTRATED | D6.3/E1-K generan candidatos y estrategias, siempre acotados. |
| L7 | DEMONSTRATED_PARTIAL | D6.3-G sólo lo declara en microcaso controlado; dos geometrías A/B y gates. |
| L8 | NOT_DEMONSTRATED | no hay reevaluación autónoma post-mutación general. |
| L9 | NOT_DEMONSTRATED | no hay comparación autónoma generalizada ni selección de ganador. |
| L10 | NOT_DEMONSTRATED | E1-K declara generalization NOT_DEMONSTRATED. |

La aceptación humana está fuera de la escala. No se eleva un nivel por existencia de código, pantalla o reportes históricos.

## Evidencia técnica

`server/arkiD62ReasoningHarness.ts` y sus tests prueban transferencias, perturbaciones, fallos y contraejemplos. `server/arkiD63GeometricBridge.ts`, `docs/arki-d63g/D6.3-G-REPORT.md` y los SVG prueban candidatos conceptuales con lineage. `docs/arki-e1-k/manifest.json` fija `highestAutonomy=L6_GENERATES_CANDIDATES`, generalization NOT_DEMONSTRATED y human review. `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` limita la capacidad a replay y candidatos razonados.

## Clasificación futura

**REUSE:** harness, gates, mutation lineage. **CONNECT:** re-evaluation, comparison y review. **EXTEND:** métricas adversariales y replay poblacional. **BUILD:** autonomía profesional segura sólo si faltan componentes de base. **RESEARCH:** L8–L10, causalidad y generalización. Human Architect, especialistas y regulator conservan autoridad.

## Referencias
[1] `docs/arki-e1-k/manifest.json`
[2] `docs/arki-d63g/D6.3-G-REPORT.md`
[3] `server/arkiD62ReasoningHarness.ts`
[4] `server/arkiD62ReasoningHarness.test.ts`
[5] `server/arkiD63GeometricBridge.ts`
[6] `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md`
