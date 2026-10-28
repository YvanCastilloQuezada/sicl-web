# ARKI — Roadmap Canónico

**Fecha de creación:** 2026-10-27
**Fuente:** `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json`

## Fases (F1-F10)

| Fase | Estado | Subfase actual | Notas |
|------|--------|----------------|-------|
| F1 | `RECONCILIATION_REQUIRED` | Encargo / intención del cliente | Pendiente de reconciliación |
| F2 | (ver master map) | — | — |
| F3 | (ver master map) | — | — |
| F4 | (ver master map) | — | — |
| F5 | (ver master map) | — | — |
| F6 | `FROZEN_REVOKED_BY_PO` | — | F6 descongelada por decisión del PO el 2026-10-14 |
| F7 | `IN_PROGRESS` | F7.0→F7.9 integration spine | Fase actual |
| F8 | (ver master map) | — | — |
| F9 | (ver master map) | — | — |
| F10 | (ver master map) | — | — |

## Hitos completados

- **2026-10-14:** Integración systemd verificada (manual).
- **2026-10-27 19:00:12:** Primer disparo automático del timer `arki02-continuity.timer` verificado de punta a punta. Ver `docs/ops/ARKI-LIVE-SYSTEMD-INTEGRATION-20261014.md`.
- **2026-10-27:** Bind `0.0.0.0` aplicado al Árbol Vivo.
- **2026-10-27:** Repositorio canónico de planificación creado (resuelve I-01).

## Hitos pendientes (prioridad)

1. Cerrar information gaps I-02, I-03, I-08, I-12 (los 4 bloqueados).
2. Implementar autocorrección funcional (misión del `00-START.md` sección 5.2).
3. Investigar dependencias reales de I-01 a I-24.
4. Conectar tareas con Árbol Vivo / Árbol Gemelo Digital.
5. Tres alternativas arquitectónicas cuantificadas, Delta 6.2, AGK 3D-First, multiescala.

## Próximos 30 días

- [ ] Cerrar I-02 (work ledger).
- [ ] Cerrar I-03 (registro de aprobación de RFCs).
- [ ] Implementar un cambio real de autocorrección (no solo sandbox).
- [ ] Primera transición `INFORMATION_GAP` → `EVIDENCE_VERIFIED` verificada por el ciclo vivo.

## Próximos 90 días

- [ ] Delta 6.2 real (promoción controlada de conocimiento).
- [ ] AGK 3D-First con geometría OCCT + ARKI_DELTA.
- [ ] Tres alternativas arquitectónicas con métricas.
- [ ] Pruebas multiescala (objeto → territorio).
