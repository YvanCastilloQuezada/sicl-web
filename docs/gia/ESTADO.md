# ESTADO ARKI-GIA

## Estado actual: ARKI-GIA-β+ (hito UI cerrado, Fase 4 con 5/7 motores)

### Criterios de salida (todos obligatorios para llamarse ARKI-GIA)

| # | Condición | Estado | Evidencia |
|---|---|---|---|
| 1 | GIA-001 a GIA-010 aprobadas | ✅ en 1 caso genérico, ❌ en 3 tipologías | 10/10 tests razonamiento PASS |
| 2 | ≥3 motores EXECUTABLE con efecto en geometría | ✅ | 5 motores PASS: structural, geotech, fire, acoustic, evacuation |
| 3 | Expediente por alternativa | ⏳ | Pendiente |
| 4 | Divergencia real entre PARTIs | ⏳ | Pendiente (Entregable 2) |
| 5 | Determinismo declarado | ⏳ | Pendiente (Entregable 3) |
| 6 | Autorización humana registrada | ⏳ | Pendiente |
| 7 | CI verde en los tres repos | ⚠️ | GIA CI verde; SICL Web CI en 14/15 tests; sicl-core falla 5/5 |

### Catálogo de comandos (hito UI)

- **Catálogo unificado:** 179 comandos (131 Core + 24 motor + 24 frontend pending).
- **Catálogo del Core:** 131 comandos (todos los de `cli.py`), sin `compact`.
- **`cli.py`:** 131 comandos largos, 0 cortos.
- **`CommandBar`:** sin `compact`, usa solo `name` (comando largo).
- **Tests:** `command-bar.test.ts` 14/15 pass, `help-system.test.ts` 7/7 pass, `sicl-client.test.ts` 6/6 pass.
- **`tsc --noEmit`:** 0 errores.

### Fase 4 — Motores (2026-11-13)

| Motor | Librería | Estado | Evidencia |
|---|---|---|---|
| **structural** | `openseespy` | ✅ **PASS** | `T1_s: 2.0487` (pórtico NTE E.030) |
| **geotech** | `bearing_capacity` | ✅ **PASS** | `q_ultimate_kPa: 1460.8` |
| **fire** | `pycfast` + CFAST 8.0 | ✅ **PASS** | 2 pisos, `342.6°C` |
| **acoustic** | `pyrato` | ✅ **PASS** | `T60: 0.3s` |
| **evacuation** | `jupedsim` 1.4.2 | ✅ **PASS** | 5 pisos, 50/50 en 11.2s, ancho normativo RNE A.130 |
| **hvac** | `opensimula` | ⚠️ **PARTIAL** | `cooling_load_kw: 3.5` (conceptual) |
| **sewer** | `pysewer` | ⚠️ **PARTIAL** | `estimated_pipe_diameter_m: 0.304` (conceptual) |

### Motores conceptuales (deuda documentada en `DEUDA.md`)

- **`sewer`:** reescrito con `pysewer`, pero falla por bug de `pysewer` 0.3.1 con `networkx` 3.x.
- **`hvac`:** reescrito con `openstudio`, pero el proceso muere con `SEGV` (crash nativo de OpenStudio). Requiere aislamiento en subprocess.

### Tests

- 25/25 tests GIA (local, 22s): 10 de razonamiento + 15 de motores.
- 10/10 tests GIA en CI (solo razonamiento).
- 14/15 tests de `command-bar` (1 deuda documentada).
- 7/7 tests de `help-system`.
- 6/6 tests de `sicl-client`.

### Nomenclatura

- **ARKI-CORE**: ciclo funcional, sin motores especializados conectados.
- **ARKI-GIA-β**: ≥1 tipología con GIA-001..010 aprobadas y ≥1 motor EXECUTABLE.
- **ARKI-GIA-β+**: 5/7 motores PASS + structural world-class + NSGA-II. ← **estás aquí**
- **ARKI-GIA**: 3 tipologías + ≥3 motores EXECUTABLE + determinismo + aprobación humana.

### Repos

- **`sicl-web`:** catálogo unificado, UI, tests. `main` con `tsc = 0`.
- **`sicl-core`:** `cli.py` con 131 comandos, catálogo de 131 comandos. PR #57 pendiente.
- **`motores-api`:** 7 motores (5 PASS, 2 PARTIAL), versionado en GitHub (`YvanCastilloQuezada/motores-api`).

### Próximos pasos (después de la Fase 4)

1. Arreglar `sewer` (pysewer 0.2.x o RSPH manual).
2. Arreglar `hvac` (aislar OpenStudio en subprocess).
3. Mergear `DEUDA.md` y `ESTADO.md` en `sicl-web`.
4. Fase GIA: Entregable 2 (divergencia PARTIs), Entregable 3 (determinismo), 3 tipologías.
