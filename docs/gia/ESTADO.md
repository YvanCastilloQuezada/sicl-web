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
