# ESTADO ARKI-GIA

## Estado actual: ARKI-GIA-β+

### Criterios de salida (todos obligatorios para llamarse ARKI-GIA)

| # | Condición | Estado | Evidencia |
|---|---|---|---|
| 1 | GIA-001 a GIA-010 aprobadas | ✅ en 1 caso genérico, ❌ en 3 tipologías | 25/25 tests PASS, pero `grep` de tipologías vacío |
| 2 | ≥3 motores EXECUTABLE con efecto en geometría | ⚠️ | geotech PASS, acoustic PASS, structural PARTIAL |
| 3 | Expediente por alternativa | ⏳ | Pendiente |
| 4 | Divergencia real entre PARTIs | ⏳ | Pendiente (Entregable 2) |
| 5 | Determinismo declarado | ⏳ | Pendiente (Entregable 3) |
| 6 | Autorización humana registrada | ⏳ | Pendiente |
| 7 | CI verde en los tres repos | ⚠️ | sicl-core falla 5/5 desde 2026-11-09 |

### Motores (según `/engines`, 2026-11-12 23:05)

| Motor | Estado endpoint | Nota |
|---|---|---|
| structural | PARTIAL | Doc dice World-class; endpoint dice PARTIAL. Unificar. |
| geotech | PASS | q_ultimate real |
| hvac | PARTIAL | Estimación conceptual |
| evacuation | PARTIAL | Estimación conceptual |
| fire | PARTIAL | Estimación conceptual |
| acoustic | PASS | T60 real |
| sewer | PARTIAL | Estimación conceptual |

### Nomenclatura

- **ARKI-CORE**: ciclo funcional, sin motores especializados conectados.
- **ARKI-GIA-β**: ≥1 tipología con GIA-001..010 aprobadas y ≥1 motor EXECUTABLE.
- **ARKI-GIA-β+**: 7 motores + structural world-class + NSGA-II. ← **estás aquí**
- **ARKI-GIA**: 3 tipologías + ≥3 motores EXECUTABLE + determinismo + aprobación humana.

### Bloqueos activos

1. **Regla de protección en `main`**: todo cambio debe entrar por PR. No se puede `git push origin main`.
2. **Tests sin cobertura de tipologías**: los 5 archivos `arkiGia*.test.ts` no mencionan hospital/educativo/oficinas.
3. **Vocabulario de estado no unificado**: endpoint usa PASS/PARTIAL; docs usan EXECUTABLE/PARTIAL.

### Próximos pasos (en orden)

1. Crear PR `feat/gia-fase-6-hito` con los 15 commits locales. ✅ (PR #133)
2. Añadir fixtures de 3 tipologías y parametrizar GIA-001 a GIA-010.
3. Unificar vocabulario de estado (`/engines` ↔ docs).
4. Implementar Entregable 2 (divergencia PARTIs) y Entregable 3 (determinismo).
5. Arreglar CI de sicl-core (5/5 fallos desde 2026-11-09).
