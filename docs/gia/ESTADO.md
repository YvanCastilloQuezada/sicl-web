# ESTADO ARKI-GIA

## Estado actual: ARKI-GIA-β+ (hito UI cerrado)

### Criterios de salida (todos obligatorios para llamarse ARKI-GIA)

| # | Condición | Estado | Evidencia |
|---|---|---|---|
| 1 | GIA-001 a GIA-010 aprobadas | ✅ en 1 caso genérico, ❌ en 3 tipologías | 10/10 tests razonamiento PASS |
| 2 | ≥3 motores EXECUTABLE con efecto en geometría | ✅ | structural (World-class, 4 modos), geotech (q_ultimate real), acoustic (T60 real) |
| 3 | Expediente por alternativa | ⏳ | Pendiente |
| 4 | Divergencia real entre PARTIs | ⏳ | Pendiente (Entregable 2) |
| 5 | Determinismo declarado | ⏳ | Pendiente (Entregable 3) |
| 6 | Autorización humana registrada | ⏳ | Pendiente |
| 7 | CI verde en los tres repos | ⚠️ | GIA CI verde; SICL Web CI en 14/15 tests (1 deuda documentada); sicl-core falla 5/5 |

### Catálogo de comandos (hito UI)

- **Catálogo unificado:** 155 comandos (131 Core + 24 motor), sin `compact`.
- **Catálogo del Core:** 131 comandos (todos los de `cli.py`), sin `compact`.
- **`cli.py`:** 131 comandos largos, 0 cortos.
- **`CommandBar`:** sin `compact`, usa solo `name` (comando largo).
- **Tests:** `command-bar.test.ts` 14/15 pass (1 deuda documentada), `help-system.test.ts` 7/7 pass, `sicl-client.test.ts` 6/6 pass.
- **`tsc --noEmit`:** 0 errores.

### Deuda documentada

Ver `docs/gia/DEUDA.md` para la lista completa de deudas (9 deudas, incluyendo el Test 4 de `command-bar`).

### Motores (según Fase 6, 2026-11-12)

| Motor | Estado | Nota |
|---|---|---|
| structural | ✅ World-class | 4 modos: pórtico NTE E.030, cáscara ShellMITC4, time-history Newmark, no lineal Steel01 |
| geotech | ✅ PASS | q_ultimate real |
| acoustic | ✅ PASS | T60 real |
| hvac | ⚠️ PARTIAL | Estimación conceptual (conectado, no real) |
| evacuation | ⚠️ PARTIAL | Estimación conceptual (conectado, no real) |
| fire | ⚠️ PARTIAL | Estimación conceptual (conectado, no real) |
| sewer | ⚠️ PARTIAL | Estimación conceptual (conectado, no real) |

### Tests

- 25/25 tests GIA (local, 22s): 10 de razonamiento + 15 de motores
- 10/10 tests GIA en CI (solo razonamiento)
- 14/15 tests de `command-bar` (1 deuda: `educationalCommand` no se actualiza con `/PROJECT CREATE`)
- 7/7 tests de `help-system`
- 6/6 tests de `sicl-client`

### Nomenclatura

- **ARKI-CORE**: ciclo funcional, sin motores especializados conectados.
- **ARKI-GIA-β**: ≥1 tipología con GIA-001..010 aprobadas y ≥1 motor EXECUTABLE.
- **ARKI-GIA-β+**: 7 motores conectados + structural world-class + NSGA-II. ← **estás aquí**
- **ARKI-GIA**: 3 tipologías + ≥3 motores EXECUTABLE + determinismo + aprobación humana.

### Próximos pasos (después del hito UI)

1. Arreglar el Test 4 de `command-bar` (deuda documentada).
2. Fase A: mockear motores para CI completo (15 tests de motores).
3. Fase sicl-core: investigar los 5/5 fallos.
4. Fase GIA: Entregable 2 (divergencia PARTIs), Entregable 3 (determinismo), 3 tipologías.
