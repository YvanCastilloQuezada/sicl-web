# ARKI — Registro de Decisiones del PO

**Fecha de creación:** 2026-10-27
**Actor:** Yvan Castillo Quezada (Product Owner)

## Formato

Cada decisión se registra con:
- **ID:** D-YYYYMMDD-NN
- **Fecha:** YYYY-MM-DD
- **Actor:** quién decide
- **Contexto:** qué motivó la decisión
- **Decisión:** qué se decide
- **Justificación:** por qué
- **Impacto:** qué cambia
- **Estado:** `ACTIVE`, `SUPERSEDED`, `REVERTED`

---

## D-20261027-01 — Crear repositorio canónico de planificación

**Fecha:** 2026-10-27
**Actor:** Yvan Castillo Quezada (Product Owner)
**Contexto:** El inventario (`ARKI_IDEA_AND_DECISION_INVENTORY.md`) marca I-01 como `NOT_FOUND / DISTRIBUTED_ARCHIVE`. La planificación vive distribuida en varios documentos sin estructura persistente.
**Decisión:** Crear `docs/arki-planning/` como repositorio canónico de planificación, con `BACKLOG.md`, `ROADMAP.md`, `DECISIONS.md` e `IDEAS.md`.
**Justificación:** Un repositorio canónico cierra I-01 por resolución estructural (no por declaración). Centraliza el backlog, el roadmap y las decisiones en un solo lugar trazable.
**Impacto:** I-01 pasa de `NOT_FOUND / DISTRIBUTED_ARCHIVE` a `RESOLVED`. El ciclo vivo debería detectar el nuevo directorio en la próxima ejecución.
**Estado:** `ACTIVE`

---

## D-20261027-02 — Bind 0.0.0.0 para el Árbol Vivo

**Fecha:** 2026-10-27
**Actor:** Yvan Castillo Quezada (Product Owner)
**Contexto:** El Árbol Vivo (`av023-arbol-vivo`) bindeaba a `127.0.0.1`, lo que impedía acceso desde LAN y Tailscale.
**Decisión:** Cambiar el bind a `0.0.0.0` en `tools/maqueta-viva/arki-av023-historical-ui.cjs`, en ambos repos (`canonical/sicl-web` y `av023-arbol-vivo`).
**Justificación:** Permitir acceso desde la LAN (`10.0.1.2:8768`) y Tailscale (`100.125.95.8:8768`) sin túneles SSH.
**Impacto:** El Árbol Vivo es accesible desde cualquier máquina autorizada.
**Estado:** `ACTIVE`

---

## D-20261027-03 — Verificar el disparo del timer y actualizar docs

**Fecha:** 2026-10-27
**Actor:** Yvan Castillo Quezada (Product Owner)
**Contexto:** El `00_REVIVIR.md` sección 5.1 pedía verificar el disparo del timer `arki02-continuity.timer` después de las 19:00.
**Decisión:** Verificar el disparo del 27-oct 19:00:12 y actualizar `docs/ops/ARKI-LIVE-SYSTEMD-INTEGRATION-20261014.md`, `00_REVIVIR.md` y `00_ARKI_EXPEDIENTE_MAESTRO.md` con la evidencia.
**Justificación:** El disparo fue exitoso (`ACE_SNAPSHOT_PASS` + `ADVISORY_PULSE_COMPLETED`). Es un hito verificable.
**Impacto:** `TIMER_TRIGGER_VERIFIED` para el disparo del 27-oct. El `00_REVIVIR.md` sección 5.1 se marca como completado.
**Estado:** `ACTIVE`

---

## D-20261027-04 — Cerrar I-02 (work ledger)

**Fecha:** 2026-10-27
**Actor:** Yvan Castillo Quezada (Product Owner)
**Contexto:** I-02 estaba en `PRESENT / PARTIALLY ACTIVE` porque el work ledger vivía distribuido en `todo.md` sin owner único ni autoridad de prioridad.
**Decisión:** Crear `docs/arki-planning/WORK_LEDGER.md` como work ledger canónico con owner, prioridad, estado y fechas.
**Justificación:** Un work ledger canónico cierra I-02 por resolución estructural.
**Impacto:** I-02 pasa de `PRESENT / PARTIALLY ACTIVE` a `RESOLVED`.
**Estado:** `ACTIVE`

---

## D-20261027-05 — Cerrar I-03 (RFC approvals)

**Fecha:** 2026-10-27
**Actor:** Yvan Castillo Quezada (Product Owner)
**Contexto:** I-03 estaba en `PRESENT / DOCUMENTARY` porque los RFCs existían como documentos pero sin registro de aprobación.
**Decisión:** Crear `docs/arki-planning/RFC_APPROVALS.md` como registro de aprobación por RFC.
**Justificación:** Un registro de aprobación cierra I-03 por resolución estructural.
**Impacto:** I-03 pasa de `PRESENT / DOCUMENTARY` a `RESOLVED`.
**Estado:** `ACTIVE`
