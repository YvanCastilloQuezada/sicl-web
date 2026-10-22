# SICL Web — Auditoría comparativa de ramas (corte 2026-10-22)

**Repositorio:** `YvanCastilloQuezada/sicl-web`  
**Base comparada:** `main` (referencia remota consultada durante esta auditoría; no se ejecutaron pruebas de código en cada rama).  
**Estado:** PARCIAL — 30 comparaciones de ramas consultadas; inventario visible consultado: 98 ramas incluyendo `main`. Quedan 68 ramas sin comparación detallada en este corte.  
**Regla:** `ahead/behind` mide divergencia Git respecto a `main`; no certifica calidad, pruebas ni integración. `files` y `changes` son el resumen de la comparación que devuelve GitHub. No se ha fusionado ni eliminado ninguna rama.

## Resultados comparados

| Rama | Estado vs main | Ahead | Behind | Archivos cambiados | Cambios | Lectura preliminar |
|---|---:|---:|---:|---:|---:|---|
| `0-Historical` | diverged | 2 | 59 | 300 | 19362 | Archivo histórico aislado; no integrar sin auditoría de procedencia y contenido. |
| `ace85/local-sync-20261011T233918Z` | behind | 0 | 68 | 0 | 0 | Sin commits exclusivos respecto a main; rama atrasada. |
| `ace87/remove-qr` | behind | 0 | 61 | 0 | 0 | Sin commits exclusivos respecto a main; el cambio histórico aparece integrado/alcanzado. |
| `audit/arbol-vivo-continuidad-20261011` | diverged | 439 | 69 | 91 | 12807 | Mucha divergencia; revisar commits exclusivos por bloques antes de rescatar. |
| `audit/arki-continuity-daily-20261014` | diverged | 3 | 28 | 2 | 19 | Cambios de ledger/mapa de continuidad; reconciliar con el Event Store y mapa actual. |
| `audit/deepseek-f5-f9-redteam-v1` | diverged | 75 | 69 | 31 | 2731 | Auditoría/red-team; revisar evidencia de casos y resultados antes de integrar. |
| `audit/l04-agk-only-trigger` | diverged | 104 | 98 | 51 | 3679 | Rama AGK/COMPAS divergente; requiere auditoría técnica y de workflow. |
| `audit/l04-agk-only-trigger-v2` | diverged | 12 | 98 | 7 | 472 | Variante más pequeña de la anterior; comparar por SHA y cobertura antes de escoger. |
| `audit/l04-workflow-base-044707a` | diverged | 103 | 98 | 51 | 3678 | Muy próxima en alcance a l04-agk-only-trigger; posible duplicación, no demostrado. |
| `audit/mapa-arbol-gemelo-reconciliacion-20261014` | diverged | 706 | 69 | 138 | 20136 | Gran volumen de cambios; no fusionar en bloque. |
| `ci/arki-f1-f10-evidence-runner-v1` | diverged | 12 | 69 | 8 | 902 | Runner F1–F10; validar contra pruebas canónicas existentes antes de recuperar. |
| `ci/pr52-merge-candidate-e3-20261010` | diverged | 13 | 69 | 8 | 902 | Alcance muy similar al runner anterior; confirmar diferencia real de un commit. |
| `docs/av-ui-001-preparation-20261010` | diverged | 783 | 69 | 158 | 21641 | Rama con historial amplio, no tratar como rama solo documental por su nombre. |
| `docs/documentation-coherence-2.11` | behind | 0 | 418 | 0 | 0 | Sin commits exclusivos; atrasada. |
| `docs/executive-presentation-2.15` | behind | 0 | 412 | 0 | 0 | Sin commits exclusivos; atrasada. |
| `docs/frontend-handoff-2.14-fix` | behind | 0 | 413 | 0 | 0 | Sin commits exclusivos; atrasada. |
| `docs/frontend-handoff-2.14` | behind | 0 | 414 | 0 | 0 | Sin commits exclusivos; atrasada. |
| `docs/rfc015-026-coherence-audit` | behind | 0 | 416 | 0 | 0 | Sin commits exclusivos; atrasada. |
| `docs/rfc-015-frontend-v2` | behind | 0 | 478 | 0 | 0 | Sin commits exclusivos; muy atrasada. |
| `docs/rfc-024-system-completion` | behind | 0 | 420 | 0 | 0 | Sin commits exclusivos; atrasada. |
| `experiment/arki-ideas-mapa-vivo-20261015` | diverged | 62 | 67 | 46 | 4649 | Ideas/recuperación AV036; rescate selectivo con evidencia. |
| `experiment/arki-ideas-web-20261015` | diverged | 4 | 69 | 4 | 224 | Pocos commits exclusivos; inspeccionar esos commits y artefactos. |
| `feat/acs-v1-integration-lab` | diverged | 149 | 98 | 60 | 4474 | Laboratorio de integración; separar código reusable de configuración experimental. |
| `feat/agk-001-operational-spine` | behind | 0 | 114 | 0 | 0 | Sin commits exclusivos; atrasada. |
| `feat/agk-002-causal-regeneration` | behind | 0 | 99 | 0 | 0 | Sin commits exclusivos; atrasada. |
| `feat/agk-003-parametric-family-unification` | diverged | 11 | 98 | 7 | 471 | AGK parametrización; revisar cambios de familia/compiler/regeneración. |
| `feat/agk-occt-benchmark-evidence-v1` | behind | 0 | 73 | 0 | 0 | Sin commits exclusivos; atrasada. |
| `feat/agk-t4-t7-evidence-v2` | diverged | 75 | 69 | 31 | 2731 | Comparte huella de cambios con rama red-team; verificar SHA/duplicación. |
| `feat/arbol-vivo-autoensamblaje-20261011` | diverged | 707 | 69 | 138 | 20136 | Rama de gran volumen; no integrar en bloque. |
| `feat/arbol-vivo-functional-repair-20261014` | diverged | 851 | 69 | 222 | 13183 | Reparación funcional con amplia divergencia; revisar cambios exclusivos y pruebas. |
| `feat/arbol-vivo-precedencias-seguras-20261010` | diverged | 741 | 69 | 140 | 18889 | Rama clave para precedencias; priorizar revisión adversarial y diferencias exactas. |
| `feat/arki-architectural-developer-c7` | behind | 0 | 179 | 0 | 0 | Sin commits exclusivos; atrasada. |
| `feat/arki-autonomy-memory-main-20261013` | diverged | 8 | 69 | 4 | 1692 | Contiene catálogo de ramas y pruebas de memoria; rama elegida para alojar este informe de trabajo. |
| `feat/arki-autonomy-orchestrator-20261013` | diverged | 915 | 69 | 264 | 13943 | Gran divergencia; separar orquestación útil de cambios ya superados. |
| `feat/arki-education-motor-readiness` | diverged | 5 | 127 | 3 | 270 | Cambios acotados de alineación educativa/motor; revisar pruebas. |
| `feat/arki-frontend-assembly-v1` | diverged | 51 | 70 | 19 | 454 | Cambios de frontend/visor; revisar contra interfaz aprobada. |
| `feat/arki-integration-genealogy-20261013` | behind | 0 | 28 | 0 | 0 | Sin commits exclusivos; cambios alcanzados por main. |
| `feat/arki-live-readonly-pulse-20261013` | diverged | 3 | 54 | 3 | 132 | Pulso read-only; pequeño conjunto de cambios exclusivos. |
| `feat/arki-master-map-live-v1` | behind | 0 | 77 | 0 | 0 | Sin commits exclusivos; atrasada. |
| `feat/arki-operational-vitality-mo05-20261015` | diverged | 958 | 69 | 300 | 13966 | Gran volumen; requiere segmentación y pruebas, no integración masiva. |
| `feat/browser-language-detection` | behind | 0 | 381 | 0 | 0 | Sin commits exclusivos; muy atrasada. |
| `feat/capability-fabric-001-contract` | diverged | 150 | 98 | 60 | 4474 | Huella de cambios similar a ACS integration lab; comparar SHA para evitar duplicación. |

## Hallazgos y prioridades

1. **Ramas sin commits exclusivos:** cuando GitHub devuelve `ahead=0`, `files=0`, el contenido de la rama está contenido en la historia de `main` según la comparación realizada. No se propone borrarlas automáticamente.
2. **Ramas divergentes masivas:** `audit/arbol-vivo-continuidad`, `audit/mapa-arbol-gemelo-reconciliacion`, `docs/av-ui-001-preparation`, `feat/arbol-vivo-*`, `feat/arki-autonomy-orchestrator` y `feat/arki-operational-vitality` tienen cientos de commits exclusivos o grandes diffs. Deben revisarse por commits y archivos, no fusionarse completas.
3. **Posibles duplicados a comprobar:** `audit/l04-agk-only-trigger` vs `audit/l04-workflow-base-044707a`; `ci/arki-f1-f10-evidence-runner-v1` vs `ci/pr52-merge-candidate-e3-20261010`; `audit/deepseek-f5-f9-redteam-v1` vs `feat/agk-t4-t7-evidence-v2`; `feat/acs-v1-integration-lab` vs `feat/capability-fabric-001-contract`. Son similitudes de diff, no conclusión de equivalencia.
4. `0-Historical` es un archivo documental aislado. Su README indica que la carga masiva de archivos sigue pendiente; no es evidencia de que el archivo completo esté publicado.
5. Esta auditoría fue de **comparación Git**, no ejecución de las pruebas de cada rama. Los resultados de CI de una rama no deben atribuirse a otra SHA.

## Pendiente obligatorio para completar el inventario

- Comparar las ramas restantes del inventario contra el SHA vigente de `main`.
- Para cada rama divergente, extraer commits exclusivos y resumir archivos/objetivo/estado de pruebas.
- Consultar checks/Actions del SHA exacto cuando existan; sin evidencia, dejar `PENDIENTE`.
- Solo después de revisar commits exclusivos y pruebas, decidir qué rescatar en la integración existente. No crear ramas nuevas, no borrar ramas, no modificar FROZEN/Core ni integrar automáticamente.

## Evidencia de consultas GitHub

Las comparaciones se solicitaron mediante la función de comparación de commits del repositorio para cada rama de la tabla contra `main`. Los números reflejan la respuesta observada en esta sesión del 2026-10-22. No se alteraron refs de Git, no se fusionaron ramas y no se ejecutó código de las ramas auditadas.


## Segunda tanda de comparaciones (continuación del 2026-10-22)

| Rama | Estado vs main | Ahead | Behind | Archivos cambiados | Cambios | Lectura preliminar |
|---|---:|---:|---:|---:|---:|---|
| `feat/command-bar` | behind | 0 | 456 | 0 | 0 | Sin commits exclusivos; muy atrasada. |
| `feat/d63-to-d2-geometry-bridge` | diverged | 1 | 150 | 0 | 0 | Un commit exclusivo según el grafo, sin diff de archivos informado; inspeccionar commit y merge-base. |
| `feat/e2e001-red-team-hardening` | diverged | 95 | 98 | 51 | 3545 | Divergencia importante; revisar casos de seguridad y workflow antes de recuperar. |
| `feat/e2e002-spatial-reasoning-phase1` | diverged | 149 | 98 | 60 | 4474 | Rama de razonamiento espacial; comparar con E2E/CI actuales antes de integrar. |
| `feat/f7-f8-integral-closure` | diverged | 438 | 69 | 90 | 12751 | Mucho contenido exclusivo; revisar commits y evidencia de F7/F8, no fusionar completa. |
| `feat/f7-f8-professional-delivery-v1` | diverged | 75 | 69 | 31 | 2731 | Dif similar a otras ramas F5–F9; verificar si comparte commits/artefactos con red-team. |

El total de ramas con comparación documentada en este informe pasa de 24 a **30**. Las 68 restantes siguen pendientes; el informe no debe considerarse exhaustivo todavía.


## Código que genera documentos de continuidad — inspección estática

- **Mapa Vivo:** `tools/maqueta-viva/arki-continuity-snapshot.cjs`. Genera `docs/arki-master-map/ARKI_MAPA_VIVO_CONTINUIDAD.md` a partir del historial Git y `ARKI_CONTINUITY_EVENTS.jsonl`. El código declara que el mapa no verifica CI, arquitectura ni despliegue.
- **Pruebas del generador:** `tools/maqueta-viva/arki-continuity-snapshot.test.cjs`. Incluye validación de IDs/evidencias, estados no verificados, SHA/cronología, determinismo y ledger malformado/duplicado.
- **Workflow:** `.github/workflows/arki-continuity-map.yml`. Ejecuta pruebas, regenera y verifica el mapa; su publicación automática está limitada a `main` y `feat/arki-integration-genealogy-20261013`.
- **Verificador local:** `tools/maqueta-viva/arki-continuity-local-verify.cjs`. Ejecuta pruebas, generación y `--check`, y escribe `ARKI_CONTINUITY_LOCAL_VALIDATION.txt`.
- **ARKI-00.md, catálogo de ramas e informe de auditoría:** las búsquedas realizadas no identificaron un generador que produzca automáticamente esos tres documentos. Se actualizaron explícitamente en esta rama de memoria. La búsqueda de código no es una prueba exhaustiva de ausencia.
- **Validación:** se inspeccionaron las fuentes en GitHub; no se ejecutó el generador localmente ni se comprobó una ejecución CI del SHA recién escrito. Por tanto, estado **CÓDIGO IDENTIFICADO / EJECUCIÓN PENDIENTE**.
- **Precaución operativa:** no ejecutar el generador en un checkout con cambios locales sin revisar el estado de Git; el script escribe el mapa generado y podría reemplazar modificaciones manuales de ese archivo.
