# ARKI — Backlog Canónico

**Fecha de creación:** 2026-10-27
**Última actualización:** 2026-10-27
**Fuente:** `docs/arki-inventory/ARKI_IDEA_AND_DECISION_INVENTORY.md`

## Estado del backlog

- **Total de ideas:** 24 (I-01 a I-24)
- **Resueltas:** 1 (I-01, ver `DECISIONS.md`)
- **En progreso:** 0
- **Bloqueadas:** 5 (I-01, I-02, I-03, I-08, I-12 — requieren reconciliación)
- **Pendientes:** 18

## Ideas por estado

### ✅ Resueltas (1)

| ID | Idea | Estado | Resolución |
|----|------|--------|------------|
| I-01 | A distinct canonical idea/backlog repository or planning domain should exist | `RESOLVED` | Creado `docs/arki-planning/` (2026-10-27) |

### 🔄 En progreso (0)

(vacío)

### 🚫 Bloqueadas (5)

| ID | Idea | Estado | Bloqueo |
|----|------|--------|---------|
| I-02 | A chronological project work ledger should capture backlog and roadmap work | `PRESENT / PARTIALLY ACTIVE` | Falta owner único y autoridad de prioridad |
| I-03 | RFCs should define future architecture, proposals, and promotion criteria | `PRESENT / DOCUMENTARY` | Falta registro de aprobación por RFC |
| I-08 | Multimodal sources should enter a provenance-oriented Visual Field/OCR flow | `PARTIAL / IMPLEMENTED LOCALLY` | Falta validación final remota |
| I-12 | (ver inventario) | `HISTORICAL_BLOCKED_REVERIFY` | Requiere reverificación histórica |

### ⏳ Pendientes (18)

| ID | Idea | Estado | Próximo paso |
|----|------|--------|--------------|
| I-04 | M0-K should preserve epistemic separation, provenance, rights, uncertainty, and human-gated canonization | `DEMONSTRATED_LOCAL` | Completar proyección Core |
| I-05 | Corpus knowledge should round-trip through retrieval with provenance, scope, rights, validation | `PARTIAL / PASS WITH BLOCKED RUNTIME EXAM` | Desbloquear runtime exam |
| I-06 | Reasoning should transform retrieved knowledge into requirements, unknowns, deficits | `DEMONSTRATED_LOCAL / BOUNDED PROJECT-SCOPED` | Verificar equivalencia de ejecución actual |
| I-07 | Topology should yield multiple controlled conceptual geometry candidates | `DEMONSTRATED_LOCAL / PARTIAL CONTROLLED MICROCASE` | Validar funcional y operacionalmente |
| I-09 | L1 knowledge should transfer to L2 with explicit TRANSFER, ADAPT, DO_NOT_TRANSFER, UNKNOWN | `DEMONSTRATED_LOCAL / REMOTE PERSISTENCE NOT DEMONSTRATED` | Implementar `POST /projects/{id}/reasoning-executions` |
| I-10 | SPACE/ROOM and SPATIAL_BOUNDARY/WALL should remain distinct provisional semantics | `HYPOTHESIS / K2_CANDIDATE / HUMAN_REVIEW_REQUIRED` | Revisión humana |
| I-11 | ARKI-BOOK should become an adaptive tutor | `IMPORTANT UNIMPLEMENTED` | Decisión del PO sobre linkage Delta-to-Book |
| I-13 a I-24 | (ver inventario) | Varios | Varios |

## Priorización

**Prioridad 0 (crítico):**
- I-01 ✅ Resuelto

**Prioridad 1 (alta):**
- I-02, I-03, I-08, I-12 (los 4 bloqueados restantes)

**Prioridad 2 (media):**
- I-04, I-05, I-06, I-07, I-09

**Prioridad 3 (baja):**
- I-10, I-11, I-13 a I-24

---

## Nota sobre autocorrección funcional (2026-10-27)

**Estado del `repairExperiment`:** implementado y funcional.

**Lo que hace:** prueba 3 variantes de parche sobre un fixture controlado (`calculation.cjs`), verifica que la baseline falla, y devuelve las variantes que pasan.

**Lo que devuelve:** `NO_SUPPORTED_DEFECT_FOUND` con `candidates: []` cuando no hay defecto.

**Por qué:** los 60 tests del proyecto pasan (60/60 PASS). No hay defecto real que reparar.

**Qué falta para autocorrección real:**
1. Un defecto verificable (test que falla, bug reportado, error en logs).
2. Un "detector de defectos" (que identifique el defecto automáticamente).
3. Un "generador de parches" (que proponga el parche basado en el error).
4. Validación del PO.

**Decisión:** no inventar un defecto para probar la autocorrección. Documentar el estado `NOT_APPLICABLE` (no hay defecto) y esperar a que aparezca un defecto real.
