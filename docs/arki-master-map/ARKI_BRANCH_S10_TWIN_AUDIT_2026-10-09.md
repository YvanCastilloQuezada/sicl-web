# ARKI — Auditoría transversal de ramas, S10 y gemelo digital
**Fecha de revisión:** 2026-10-09 · **Repositorio:** `YvanCastilloQuezada/sicl-web` · **Base de comparación:** `feat/f7-f8-integral-closure` · **HEAD al iniciar auditoría:** `d27f1b004fca969289a4ffd9985bf694989cd434`.
**Alcance:** inspección remota de 73 referencias Git y comparación de ancestría de cada rama con la base; inspección de contratos, estado y archivos de código representativos. **No** equivale a revisión de cada línea, ejecución de las 73 suites, ni aceptación funcional de cada rama.
**Política:** solo lectura para fuentes canónicas, FROZEN, Core, D-2 y AGK; ninguna rama fusionada; ninguna promoción ni corrección automática autorizada.

## Resultado ejecutivo
- **73 ramas** observadas: **1 base**, **53 ramas cuyo HEAD es ancestro de la base**, **19 ramas divergentes con commits exclusivos**.
- `main` es ancestro: la base de integración está **388 commits por delante**, **0 por detrás** de `main` en el corte auditado. Esto no demuestra despliegue en producción.
- **No incorporar automáticamente las 19 divergentes.** Los commits exclusivos son trabajo potencial a comparar por contrato, alcance, pruebas y evidencia; no se puede equiparar `behind_by` con defectos o funcionalidades ausentes.
- Divergencias prioritarias: E2E-002/ACS (149 commits exclusivos cada rama en el corte), spatial pilot/media (196), capability fabric (103), AGK-003 (11), Education (5), frontend assembly (51), piloto Plano (2). Varias ramas comparten el mismo SHA: no duplicar inventario por nombre.
- La Maqueta Viva ya tiene diagnósticos deterministas, aprobación local para **evaluación**, circuito Autocorrectivo de preparación y gate de PR con SHA/Red Team. No tiene un agente autónomo que escriba y pruebe reparaciones ni sincronización viva entre GitHub y navegador.

## S10: veredicto
**IMPLEMENTACIÓN PARCIAL, INGESTA NATIVA REAL PENDIENTE.**
- `server/arkiS10Interop.ts`: tipos, validación y normalización estructurada, APU, recursos, nodos de presupuesto, totales, procedencia y proyección hacia baseline económico. `server/arkiProjectEconomicTwin.ts`: mutación económica calculada contra mapeos aceptados.
- `docs/arki-master-map/ARKI_F7_S10_PROJECT_COST_BASELINE_CONTRACT_V1.md` prohíbe asumir escritura nativa o round-trip sin evidencia.
- Estado canónico: respaldo real identificado como SQL Server `.S2K` con cabecera TAPE y referencias `S102000`; `RESTORE HEADERONLY` / `FILELISTONLY`, restauración aislada, lectura de presupuestos/APU y conciliación **NO EJECUTADOS**.
- Ruta de antecedentes: **F1** custodia, checksum y procedencia; **F7.6/F7.7** caracterización del backup y adaptador; **F7.8** conciliación de cantidades/costos; **F8** expediente; **F9** valorizaciones/cambios. No escribir sobre la fuente.

## Gemelo digital: veredicto
**GEMELO DE PROYECTO / PREPARACIÓN, NO GEMELO FÍSICO OPERATIVO.**
- `Verify-ARKI-TwinTimeline.mjs`: según estado canónico GDT-01 ejecutó replay de 35 snapshots Git, 35 checkpoints, 0 observaciones físicas; no debe confundirse tiempo de commit con evento de dominio.
- `Verify-ARKI-PhysicalEvidence.mjs`: GDT-02 implementado; faltan un registro de activo real y dos observaciones con fechas y fuentes hash verificadas; prueba física real pendiente.
- `server/arkiF9ConstructionLineage.ts`: baseline de campo y observaciones fail-closed como proyección, no autoridad as-built.
- `docs/arki-master-map/ideas/IDEA-MT-001_MULTISCALE_TWIN_FROZEN.md`: **idea estratégica congelada, no capacidad implementada ni contrato AGK congelado**. Es transversal F1–F10, no F11.
- Dependencias: F1 identidad/custodia → F6 D-2/AGK y objeto estable → F7/F8 estado aceptado → F9 observaciones → F10 operación. GDT-02 es la siguiente puerta de evidencia.

## Objetivo principal: planos técnicos multiescala
Se preserva una autoridad geométrica AGK única y semántica D-2. El objetivo abarca componente, espacio, edificio, conjunto y territorio. El código inspeccionado contiene adaptadores/proyecciones profesionales y contrato F8, **no prueba** producción verificable de planos técnicos multiescala completos, con cotas, cortes, elevaciones, estructura, MEP y normativa aplicable en cada jurisdicción/escala.
Puerta propuesta: un espécimen real, requisitos y fuentes normativas por escala, generación reproducible de vistas/planos y pruebas de consistencia con geometría, semántica, cantidades y dossier. Las decisiones profesionales requieren autoridad humana.

## Hallazgos de coherencia
1. **Roadmap documental desfasado:** `ARKI_TEN_PHASE_PRODUCT_INTEGRATION_ROADMAP_V1.md` aún declara F6 `IN_PROGRESS` y F7–F10 futuros, mientras `ARKI_MASTER_MAP_STATE.json` declara F6 `FROZEN`, F7/F8 `IN_PROGRESS`. No corregir silenciosamente la historia: registrar el documento como corte anterior y reconciliar referencias actuales.
2. **README de Maqueta Viva (corregido en esta campaña):** la guía anterior describía bandejas invertidas. Se actualizó para fases arriba, bandeja derecha, vertebral, aprobación humana y límites de S10/gemelo digital. La corrección documental no prueba E3 en Windows.
3. **Autonomía acotada:** `ARKI_CONTROLLED_GITHUB_EXECUTOR_V0.md` implementa un gate de PR de solo lectura; no ejecutor que repare código. Aprobación local `AUTORIZO` prepara una orden; **no autoriza** merge ni promoción.
4. **Pruebas:** hay dos workflow runs SUCCESS asociados al HEAD auditado `d27f1b0` (Maqueta Viva smoke y SICL Web CI). Son evidencia de ejecución CI en ese SHA, **no** prueba de Windows E3, restauración S10 ni GDT-02 real. Cualquier commit posterior exige nuevo SHA y comprobación.
5. **Consolidación:** 19 ramas divergentes no son 19 funcionalidades nuevas; se requiere análisis de diffs y pruebas por contrato antes de cualquier cherry-pick o merge.

## Prioridades propuestas a decisión humana
| Orden | Candidato | Fase primaria | Antecedentes | Puerta de aceptación |
|---|---|---|---|---|
| 1 | Inventario de autoridad y trazabilidad de ramas | F1 | SHA, PR, contratos, evidencia, FROZEN | Matriz por capacidad y conflicto, sin merges |
| 2 | S10 backup y baseline económico real | F7 | F1 custodia y SQL Server compatible | Restore aislado read-only + presupuesto/APU/totales conciliados |
| 3 | Gemelo físico GDT-02 | F9 | F1 identidad, F6 geometría, F7/F8 aceptación | Activo real + dos observaciones + replay y hashes |
| 4 | Producción de planos técnicos multiescala | F7/F8 | F2 normas por escala, F3 intención, F4 partido, F5 selección, F6 AGK | Espécimen y dossier coherentes con pruebas |
| 5 | Autocorrectivo controlado | F1/F3/F5 y ejecución transversal | Propuesta → impacto → autorización de alcance → PR → CI → Qwen → aceptación | Sin cambios sin autorización exacta |

## Inventario de 73 ramas
`ANCESTOR`: HEAD contenido en la historia de la rama base. `DIVERGED`: contiene commits exclusivos no incluidos por ancestría; la columna `Exclusivos` cuenta commits, **no** capacidades pendientes. `BASE`: rama examinada.

| Rama | HEAD (12) | Relación | Exclusivos |
|---|---|---|---:|
| `audit/deepseek-f5-f9-redteam-v1` | `4e8c6cc12d5b` | DIVERGED | 4 |
| `audit/l04-agk-only-trigger` | `94170fa14c56` | DIVERGED | 104 |
| `audit/l04-agk-only-trigger-v2` | `a56a5581b57a` | DIVERGED | 12 |
| `audit/l04-workflow-base-044707a` | `044707afd870` | DIVERGED | 103 |
| `docs/documentation-coherence-2.11` | `092f65be1cd4` | ANCESTOR | 0 |
| `docs/executive-presentation-2.15` | `6d8dd475de0b` | ANCESTOR | 0 |
| `docs/frontend-handoff-2.14` | `89bd162d8b5f` | ANCESTOR | 0 |
| `docs/frontend-handoff-2.14-fix` | `d0da03ace2dc` | ANCESTOR | 0 |
| `docs/rfc-015-frontend-v2` | `4255d1bf3a19` | ANCESTOR | 0 |
| `docs/rfc-024-system-completion` | `ca8e4f931c7d` | ANCESTOR | 0 |
| `docs/rfc015-026-coherence-audit` | `9a3bcec52b23` | ANCESTOR | 0 |
| `feat/acs-v1-integration-lab` | `7bf9786a99d2` | DIVERGED | 149 |
| `feat/agk-001-operational-spine` | `2bb70a433bec` | ANCESTOR | 0 |
| `feat/agk-002-causal-regeneration` | `a41cc8fb8bf0` | ANCESTOR | 0 |
| `feat/agk-003-parametric-family-unification` | `e8b47c31cdf7` | DIVERGED | 11 |
| `feat/agk-occt-benchmark-evidence-v1` | `4f1ee9cca287` | ANCESTOR | 0 |
| `feat/agk-t4-t7-evidence-v2` | `4e8c6cc12d5b` | DIVERGED | 4 |
| `feat/arki-architectural-developer-c7` | `c613f4ef84dd` | ANCESTOR | 0 |
| `feat/arki-education-motor-readiness` | `ca9b773010ca` | DIVERGED | 5 |
| `feat/arki-frontend-assembly-v1` | `36c630eb1cb9` | DIVERGED | 51 |
| `feat/arki-master-map-live-v1` | `2b7bfc8e1362` | ANCESTOR | 0 |
| `feat/browser-language-detection` | `8230cbd1c5da` | ANCESTOR | 0 |
| `feat/capability-fabric-001-contract` | `044707afd870` | DIVERGED | 103 |
| `feat/command-bar` | `45919c598520` | ANCESTOR | 0 |
| `feat/d63-to-d2-geometry-bridge` | `fe6f42b89a07` | DIVERGED | 1 |
| `feat/e2e001-red-team-hardening` | `d600b12d4df4` | DIVERGED | 95 |
| `feat/e2e002-spatial-reasoning-phase1` | `7bf9786a99d2` | DIVERGED | 149 |
| `feat/f7-f8-integral-closure` | `a5a89fe56d6d` | BASE | 0 |
| `feat/f7-f8-professional-delivery-v1` | `4e8c6cc12d5b` | DIVERGED | 4 |
| `feat/frontend-performance-cache-skeletons` | `4bcc28c1b811` | ANCESTOR | 0 |
| `feat/help-system` | `19f48f2cebd1` | ANCESTOR | 0 |
| `feat/i18n-core` | `a101fe08f69a` | ANCESTOR | 0 |
| `feat/i18n-full-consistency-gate` | `c05acb636a8f` | ANCESTOR | 0 |
| `feat/mv-p1-final-integration` | `3dfb03c9bd18` | ANCESTOR | 0 |
| `feat/mv-p1-location-picker-web` | `89529ef62f45` | ANCESTOR | 0 |
| `feat/night-blue-unified-header` | `b86b5fc6436f` | ANCESTOR | 0 |
| `feat/project-workspace-i18n-routes` | `c84541ab033e` | ANCESTOR | 0 |
| `feat/sims-dei-visible-identity-i18n` | `8ef3d93567ad` | ANCESTOR | 0 |
| `feat/spanish-default-top-navigation` | `e39692bcb12d` | ANCESTOR | 0 |
| `feat/spatial-pilot-media-studio-v1` | `a3065da9c30e` | DIVERGED | 196 |
| `feat/theme-i18n-consolidation` | `e4c563362911` | ANCESTOR | 0 |
| `feat/upao001-analytical-3d-s4` | `73ac44700a5d` | ANCESTOR | 0 |
| `feat/upao001-capability-ui-s7p05` | `e369ba168cd0` | ANCESTOR | 0 |
| `feat/upao001-pareto-spatial-sync-s6` | `6547b494524d` | ANCESTOR | 0 |
| `feat/upao001-solar-temporal-overlay-s7p0` | `3216efbe1520` | ANCESTOR | 0 |
| `feat/upao001-svg-spatial-viewer-s3` | `6e683ee6d96e` | ANCESTOR | 0 |
| `feat/upao001-visual-comparison-s5` | `9fa8dcd5b4d2` | ANCESTOR | 0 |
| `feat/vertical-developer-base-resolution-integration` | `5997f963ae1b` | ANCESTOR | 0 |
| `feat/vertical-dimension-authority` | `42a48afbe964` | ANCESTOR | 0 |
| `feat/vertical-special-volume-architectural-base` | `5034a262ced7` | ANCESTOR | 0 |
| `feat/vertical-special-volume-geometry-resolution` | `dd6783ebe5d1` | ANCESTOR | 0 |
| `feat/visualization-engine-phase-1` | `89ac3713beee` | ANCESTOR | 0 |
| `feat/web-developer-controlled-promotion-orchestration` | `b5628c0e2bec` | ANCESTOR | 0 |
| `feat/web-developer-properties-normalization` | `3ffb40f9f03c` | ANCESTOR | 0 |
| `fix/align-phase-a-pages` | `3e2b79dfa413` | ANCESTOR | 0 |
| `fix/help-button-and-i18n` | `2eb07c76cee1` | ANCESTOR | 0 |
| `fix/i18n-council-visible-copy` | `2fb10e54d7a3` | ANCESTOR | 0 |
| `fix/night-theme-card-contrast` | `33ce7db9c9b5` | ANCESTOR | 0 |
| `fix/phase-a-navigation-performance` | `e65d6a824f17` | ANCESTOR | 0 |
| `fix/phase-a-theme-styles` | `096a17805a84` | ANCESTOR | 0 |
| `fix/s3-svg-label-readability` | `5129c219bd45` | ANCESTOR | 0 |
| `fix/s3-svg-visual-rendering` | `b33d7f852c6a` | ANCESTOR | 0 |
| `main` | `ec6ede75a13e` | ANCESTOR | 0 |
| `perf/code-split-route-loading` | `15514403b7bf` | ANCESTOR | 0 |
| `perf/internal-route-navigation` | `8d0056822d01` | ANCESTOR | 0 |
| `pilot/arki-plano-content-gate-20261008` | `d47c88b41fbf` | DIVERGED | 2 |
| `redteam/deepseek/e2e002-phase1` | `89991017fe5b` | DIVERGED | 148 |
| `redteam/qwen/e2e002-phase1` | `89991017fe5b` | DIVERGED | 148 |
| `rfc-002-phase-d` | `c228a2ae2361` | ANCESTOR | 0 |
| `rfc-015-phase-a` | `9ab6c8b2ad20` | ANCESTOR | 0 |
| `style/command-bar-contrast` | `661b37094a6b` | ANCESTOR | 0 |
| `test/e2e001-agk-path-canary` | `746f2eebf176` | DIVERGED | 11 |
| `verify/commit-6` | `44a19eb49c02` | ANCESTOR | 0 |

## Próxima auditoría técnica (no ejecutada en este corte)
Para las ramas divergentes priorizadas: comparación por archivo y contrato, identificación de funciones efectivamente ausentes en base, pruebas en SHA exacto, matriz de licencias/autoridad, decisión `REUSE / SUPERSEDED / HOLD / CONFLICT` y revisión independiente Qwen. No fusionar ni alterar estados oficiales antes de estas puertas.
