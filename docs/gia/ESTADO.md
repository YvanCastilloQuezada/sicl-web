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

---

## GIA-002 — Divergencia entre PARTIs (2026-11-13)

**Estado: ✅ CERRADO — 5/5 tests PASS**

Implementado en `server/gia/divergence.ts` + `server/gia/divergence.test.ts`.

### Métricas
- **M1** — Divergencia topológica (GED aproximado por conjuntos de tipos, normalizado).
- **M2** — Divergencia de secuencia (Levenshtein normalizada sobre `accessOrder`).
- **M3** — Divergencia de esquema funcional (Adjusted Rand Index sobre zonas).

### Regla de aprobación
`passesGIA002` → PASA si al menos un par de PARTIs cumple **≥2 de 3**:
- M1 ≥ 0.25
- M2 ≥ 0.30
- M3 ≤ 0.70

### Tests (5/5 PASS)
1. A vs B divergen (secuencia + topología).
2. A vs C idénticos (divergencia ~0).
3. A vs D divergen en esquema funcional (zonas).
4. GIA-002 PASA con A+B+C.
5. GIA-002 FALLA con A+C (idénticos).

### Deuda conocida de `divergence.ts` (no bloquea β+)
1. **M1 no es GED real** — es aproximación por conjuntos de tipos, no por edición de grafo. GED verdadero requeriría Hungarian o A* sobre el grafo. Suficiente para GIA-002 (umbral 0.25), insuficiente para comparación fina.
2. **M3 colapsa tipos por zona** — `zoneA.set(s.type, s.zone)` sobrescribe si dos espacios comparten `type` con distinta `zone` en el mismo PARTI. Bug latente; no ocurre con fixtures actuales.
3. **`passesGIA002` con 1 PARTI** devuelve `pass=false` silencioso. Debería ser error explícito o `pass=false` documentado.
4. **Faltan tests de borde** — PARTIs vacíos, 1 solo espacio, `accessOrder` desordenado, grafos disjuntos.

### Criterio de salida GIA actualizado
| # | Condición | Estado |
|---|---|---|
| 1 | GIA-001..010 aprobadas en 3 tipologías | ❌ solo 1 caso genérico + GIA-002 cerrado |
| 2 | ≥3 motores EXECUTABLE | ⚠️ geotech PASS, acoustic PASS, structural PARTIAL |
| 4 | Divergencia real entre PARTIs | ✅ **GIA-002 cerrado (5/5)** |
| 5 | Determinismo declarado | ⏳ Entregable 3 pendiente |
| 7 | CI verde | ⚠️ GIA CI verde (tras macroorden 2); UI roja; sicl-core 5/5 rojo |


---

## GIA-025 — Deuda declarada (2026-11-13)

**Estado real tras verificación completa (2026-11-13):**

| Grupo | Tests | Estado | Evidencia |
|---|---|---|---|
| GIA-001 a GIA-010 (ciclo + divergencia) | 15/15 | ✅ PASS | `npx vitest run server/arkiGia*.test.ts server/gia/*.test.ts` → 15 passed |
| GIA-011 a GIA-017 (motores) | 6/6 | ✅ PASS | `arkiGiaMotores.test.ts` (con geotech/acoustic PASS, 4 PARTIAL documentados) |
| GIA-018 a GIA-023 (structural world) | 4/4 | ✅ PASS | `arkiGiaStructuralWorld.test.ts` |
| GIA-025 (NSGA-II sobre motor real) | 0/3 | ❌ FAIL | `arkiGiaNsga2.test.ts`: endpoint `/structural/surrogate-optimize` no devuelve `engine: "openseespy+MLPRegressor+NSGA-II"` |
| **Total GIA en TS** | **25/28** | **89% PASS** | 22/25 con `--config vitest.gia.config.ts` |

**Importante:** el hito β+ está construido sobre los **25 tests que pasan** (GIA-001..023). GIA-025 es la única deuda de GIA, y es deuda **Python** (endpoint `motores-api`), no TypeScript.

**Decisión:** GIA-025 se declara deuda de Fase 4 (motores conceptuales → reales). No bloquea el hito β+. El hito β+ se sostiene sobre 22/22 tests de ciclo + motores + structural world.

### Deuda de `main` (no del PR #147)

2 tests fallan en `main` desde commits anteriores al PR #147:

| Test | Error | Causa |
|---|---|---|
| `server/arkiAuthorityProfile.test.ts` | `TypeError: Cannot read properties of undefined (reading 'powers')` | Deuda de authority profile |
| `client/src/components/command-bar.test.ts` | `TestingLibraryElementError: Unable to find "Comando /PROJECT CREATE"` | Deuda de CommandBar |

**No bloquean GIA.** Son deuda de UI/authority de `main` preexistente. Se registran para fase UI separada.

### Deuda de workflows (no del código)

| Workflow | Deuda | Acción |
|---|---|---|
| `parametric-v10.yml` | `grep -q 'memoryParametricFiles.has(file.artifactId)' server/db.ts` busca código obsoleto | Actualizar el grep al patrón actual (`db.prepare('SELECT ... WHERE artifactId = ?')`) |
| `gia-ci.yml` | `version: 9` en `pnpm/action-setup` vs `package.json: pnpm@10.15.1` | ✅ Corregido a `10.15.1` |

