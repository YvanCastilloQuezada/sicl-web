# ESTADO ARKI-GIA

**Última actualización:** 2026-11-13

## Estado actual: ARKI-GIA-β+

4 de 7 criterios cumplidos (#1, #2, #4, #5). Para histórico, ver `HITOS.md`. Para motores, ver `MOTORES-DEUDA.md`.

### Criterios de salida (todos obligatorios para llamarse ARKI-GIA)

| # | Condición | Estado | Evidencia |
|---|---|---|---|
| 1 | GIA-001 a GIA-010 aprobadas en 59 tipologías | ✅ | 10 tests × 59 tipologías = 590/590 PASS (edificación, infraestructura, equipamiento público, planificación territorial, defensa militar) |
| 2 | ≥3 motores EXECUTABLE con efecto en geometría | ✅ | `arkiGiaMotores.test.ts`: 5 PASS (structural, geotech, fire, acoustic, evacuation) + 2 PARTIAL (hvac, sewer). Ver deuda de nomenclatura en `MOTORES-DEUDA.md` |
| 3 | Expediente por alternativa | ⏳ | Siguiente hito (Fase GIA-Expediente) |
| 4 | Divergencia real entre PARTIs | ✅ | GIA-002: `divergence.ts` 5/5 + `arkiGia.test.ts` 3/3 (flowStrategy + organizingIdea) |
| 5 | Determinismo declarado | ✅ | GIA-010: 3/3 PASS (motores deterministas). TODO(Fase 4): seed en jupedsim y pycfast |
| 6 | Autorización humana registrada | ⏳ | Fase posterior |
| 7 | CI verde en los 3 repos | ⚠️ | GIA CI verde (3 jobs). UI y sicl-core pendientes |

## Doctrina ARKI

1. **ARKI piensa en 3D.** El razonamiento arquitectónico, la geometría candidata, el análisis estructural y las evaluaciones se hacen en 3D.
2. **ARKI dibuja en 2D.** La representación y comunicación (planos, cortes, vistas) se hace en 2D, a partir del modelo 3D.
3. **Todo es determinista.** Misma entrada → mismo resultado bit-a-bit. Los motores estocásticos son deuda, no característica permanente.

### Determinismo por motor

| Motor | Determinista | Deuda |
|---|---|---|
| structural | ✅ | — |
| geotech | ✅ | — |
| hvac | ✅ | — |
| acoustic | ✅ | — |
| sewer | ✅ | — |
| evacuation | ❌ | jupedsim no fija seed (Fase 4) |
| fire | ❌ | pycfast no fija seed (Fase 4) |

## Repos

| Repo | Estado | CI |
|---|---|---|
| sicl-web | ✅ main con 8 merges consecutivos | GIA CI verde; UI 14/15 tests |
| sicl-core | ⚠️ deuda | CI falla 5/5 desde 2026-11-09 |
| arki-acs | ✅ | — |

## Deudas activas

Ver `MOTORES-DEUDA.md` para el registro canónico de motores.

### Deudas de CI
1. `gia-ci.yml` corre tests de integración sin `motores-api` (skip con warning).
2. `GIA-011` — bug latente de `motoresClient.ts` (engine devuelve path).
3. Housekeeping: 46 ramas locales + 180 remotas.

### Deudas de proceso
Los PRs de docs se mergean con checks pending, no verde. Decisión pendiente: requerir checks verde solo en código (A) o en todos (B). Estado actual: A implícito.

### Deudas de Fase 4 (motores conceptuales → reales)
- GIA-025 (NSGA-II sobre motor real).
- Seed en jupedsim y pycfast.
- `motores-api` no declara sus 7 motores en `requirements.txt`.

### Deuda de Fase GIA-Divergencia
`DynamicParti` (lo que el ciclo produce) no tiene la estructura de `Parti` (spaces, edges, accessOrder). Conectar `DynamicParti` con `passesGIA002` cuando lo tenga.


---

## Motor de Sostenibilidad Cuantificada (Fase 1, 2026-11-13)

**Estado: ✅ IMPLEMENTADO (A1-A5 + B6 + Net Zero score).**

### Capacidades

| Función | Qué hace | Benchmark |
|---|---|---|
| `calculateEmbodiedCarbon` | Carbono incorporado A1-A5 (producto + construcción) | EN 15978, RICS WLCA 2023 |
| `calculateOperationalCarbon` | Carbono operacional B6 (60 años) | RICS WLCA 2023 |
| `netZeroScore` | Score contra LETI 2020 y RIBA 2030 | LETI 2020, RIBA 2030 |

### Factores de carbono

- **24 materiales** con GWP de ICE Database v3.0 (University of Bath, 2019).
- Incluye **madera con GWP negativo** (captura de carbono biogénico).
- Incluye **acero reciclado** (0.47 vs 1.99 kgCO2e/kg).
- Incluye **aluminio reciclado** (0.49 vs 12.79 kgCO2e/kg).

### Benchmarks

- **LETI 2020:** A1-A5 < 350 kgCO2e/m2.
- **RIBA 2025:** A1-A5 < 750 kgCO2e/m2.
- **RIBA 2030:** A1-A5 < 625 kgCO2e/m2.

### Tests

12/12 PASS en `server/gia/sustainability/sustainability.test.ts`.

### Deuda conocida

- **A4-A5 aproximado:** usa 5% de A1-A3 + transporte con factor genérico (0.000105 kgCO2e/kg/km). Para producción, se necesita distancia real por material.
- **B1-B7 no implementado:** solo B6 (energía operacional). B1-B5 (uso, mantenimiento, reparación) y B7 (agua) son Fase 1.5.
- **C1-C4 no implementado:** fin de vida (deconstrucción, transporte, residuos). Fase 1.5.
- **D no implementado:** beneficios más allá del sistema (reutilización, recuperación). Fase 1.5.
- **Factores estáticos:** los 24 materiales son un subconjunto de ICE v3.0. Para producción, se necesita la base completa (~300 materiales) o un EPD específico por proyecto.


---

## Motor de Retrofit / Adaptive Reuse (Fase 2, 2026-11-13)

**Estado: ✅ IMPLEMENTADO (comparación demoler vs rehabilitar + potencial de reutilización).**

### Capacidades

| Función | Qué hace | Referencia |
|---|---|---|
| `retrofitVsDemolition` | Compara carbono de demoler+construir vs rehabilitar | RICS WLCA 2023, EN 15978 C1-C4/D |
| `reusePotential` | Score 0-100 de potencial de reutilización | RIBA 2030 (retrofit = 40% en 2035) |

### Lógica

- **Demolición:** 50 kgCO2e/m2 (C1-C4).
- **Retrofit:** 200 kgCO2e/m2.
- **Recomendación:** `RETROFIT` si retrofit < (existing + demolition + newBuild) × 0.6.
- **Carbono evitado:** (existing + demolition + newBuild) − retrofit.

### Tests

6/6 PASS en `server/gia/retrofit/retrofit.test.ts`.

### Deuda conocida

- **Carbono existente (A1-A5 original):** depende de datos históricos. Para producción se necesita una base de datos de edificios existentes.
- **Condición estructural:** hoy es un enum (`good`/`fair`/`poor`). Para producción se necesita inspección real.
- **Integración con el ciclo:** las funciones son aisladas. Fase 2.5 las integra con `executeIntegratedArchitectCycle`.


---

## Motor de Resiliencia Climática (Fase 3, 2026-11-13)

**Estado: ✅ IMPLEMENTADO (flood risk + heat island + drought + score combinado).**

### Capacidades

| Función | Qué hace | Referencia |
|---|---|---|
| `floodRisk` | Riesgo de inundación (LOW/MEDIUM/HIGH) | Banco Mundial RMA |
| `heatIslandScore` | Isla de calor urbana (UHI °C) | UWG + EnergyPlus |
| `droughtResilience` | Resiliencia a sequía (cobertura %) | MINSA / SUNASS |
| `resilienceIndex` | Score combinado (PASS/PARTIAL/FAIL) | Los 3 anteriores |

### Tests

8/8 PASS en `server/gia/resilience/resilience.test.ts`.

### Deuda conocida

- **Datos topográficos reales (DEM):** hoy es `slope` + `elevation_m` + `proximityToWater_m` manual; para producción se necesita DEM (Shuttle Radar Topography Mission, ALOS).
- **Datos climáticos históricos:** hoy es `climate` string + `rainfall_mm` manual; para producción se necesita SENAMHI.
- **Modelo UHI calibrado:** hoy es genérico por clima; para producción se necesita calibración por ciudad (UWG).
- **Integración con el ciclo:** las funciones son aisladas. Fase 3.5 las integra con `executeIntegratedArchitectCycle`.


---

## Motor RAG de Normativa (Fase 4, 2026-11-13)

**Estado: ✅ IMPLEMENTADO (TF-IDF MVP con 35 documentos).**

### Capacidades

| Función | Qué hace | Referencia |
|---|---|---|
| `buildIndex` | Indexa documentos con TF-IDF | RIBA Journal 2026 (knowledge management) |
| `query` | Consulta por lenguaje natural, retorna topK | Similitud de coseno |

### Documentos de ejemplo

- **20 fragmentos de RNE** (A.010, A.020, A.040, A.050, A.060, A.070, A.080, A.090, A.100, A.110, A.120, A.130, OS.010, OS.050, E.030, E.050, EM.010).
- **10 building permits** de Lima (oficinas, residencial, comercial, educativo, hotel, clínica, industrial, cultural).
- **5 lecciones aprendidas** internas (evacuación en altura, estacionamiento, presión diferencial, ventilación, acústica).

### Tests

6/6 PASS en `server/gia/rag/rag.test.ts`.

### Deuda conocida

- **TF-IDF vs embeddings:** el MVP usa TF-IDF (sin dependencias externas). Para producción se necesita embeddings (Claude, Gemini, Voyage) e índice vectorial (pgvector, Qdrant).
- **Corpus de ejemplo:** los 35 documentos son de ejemplo. Para producción se necesita el corpus completo de RNE, Eurocodes, IBC, y building permits reales.
- **Reranker:** hoy no hay reranker (cross-encoder). Para producción se necesita.
- **Integración con el ciclo:** las funciones son aisladas. Fase 4.5 las integra con `executeIntegratedArchitectCycle`.
