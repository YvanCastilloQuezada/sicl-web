# Hitos de ARKI-GIA

Registro histórico de hitos cerrados. Para el estado actual, ver `ESTADO.md`.


## 2026-11-12 — ARKI-GIA-β+ publicado

**Estado: ✅ LOGRADO (punto de partida).**

ARKI-GIA-β+ es la primera versión de ARKI que:
- Razona arquitectura (Función + Sensaciones + Forma).
- Evalúa ingeniería con 7 motores reales (`motores-api`).
- Tiene structural world-class (pórtico NTE E.030, cáscara ShellMITC4, time-history Newmark, no lineal Steel01).
- Optimiza con surrogate MIMO-FNN + NSGA-II.

**PR:** #133 (mergeado).

**Evidencia:**
- 7 motores responden en `/engines` con `pending: []`.
- `motores-api` activo (PID 951342).
- 22 tests de ciclo + divergencia + motores PASS.
- `docs/gia/ESTADO.md` con criterios de salida.

**Lo que NO tiene β+:**
- 3 tipologías (solo restaurante genérico).
- Expediente por alternativa.
- Autorización humana.
- CI verde.

---

## 2026-11-13 — Fase GIA-3-Tipologías cerrada

**Estado: ✅ LOGRADO.**

GIA-001 a GIA-010 probados en 3 tipologías reales:
- Hospital (`HOS-REG-001-001`): 200 camas, Z4/S3.
- Educativo (`EDU-COL-001-001`): colegio 800 alumnos, Z3/S2.
- Oficinas (`OFI-TOR-001-001`): torre 12 pisos, Z4/S3.

**Resultado:** 30/30 tests PASS.

- PRs: #152 (feat), #153 (docs).
- Fixtures: `server/gia/fixtures/{hospital,educativo,oficinas}.json`.
- Tests: `server/arkiGia.test.ts` (30), `server/gia/fixtures.test.ts` (9), `server/gia/divergence.test.ts` (5) = 44/44 PASS.

## 2026-11-13 — GIA-010 (Determinismo) declarado

**Estado: ✅ CERRADO** con deuda de Fase 4.

GIA-010 compara:
- Campos escalares (functional, regulatory, architecturalQuality, status).
- Motores deterministas (structural, geotech, hvac, acoustic, sewer).
- NO compara evacuation (jupedsim) ni fire (pycfast) hasta que se fije seed.

**TODO(Fase 4):** seed en jupedsim y pycfast en `motores-api`.

## 2026-11-13 — GIA-002 (Divergencia) cerrado

**Estado: ✅ CERRADO** con deuda de Fase GIA-Divergencia.

- `divergence.ts`: 5/5 PASS (GED aproximada, Levenshtein, ARI).
- `arkiGia.test.ts` GIA-002: 3/3 PASS (flowStrategy + organizingIdea en DynamicParti).

**Deuda:** conectar `DynamicParti` con `passesGIA002` cuando DynamicParti tenga la estructura de Parti (spaces, edges, accessOrder).

## 2026-11-13 — CI de GIA verde

**Estado: ✅ LOGRADO por primera vez.**

`gia-ci.yml` con 3 jobs:
- `type-check-gia`: tsc -p tsconfig.gia.json (28s).
- `test-gia-unit`: 30 tests de arkiGia + 5 de divergence + 9 de fixtures (21s).
- `test-gia-integration`: skip con warning si motores-api no responde (17s).

**PR:** #150.

## 2026-11-13 — Refactor async de ARKI

**Estado: ✅ CERRADO.**

`executeArkiUnifiedMotor` de sync a async. Consumidores ya eran async. `tsc` 0 errores. `arkiUnifiedMotor.test.ts` 3/3 PASS.

**PR:** #147.
