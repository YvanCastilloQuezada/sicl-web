# ARKI VIVO — Hito de integración systemd (2026-10-14)

## Evidencia observada en ARKI-02

- Hora local: 2026-10-14 18:09:46 -05:00.
- Servicio: `arki02-continuity.service` (systemd --user, Type=oneshot).
- Drop-in: `~/.config/systemd/user/arki02-continuity.service.d/arki-live.conf`.
- `ExecStart=/usr/bin/python3 /home/arki/ARKI/bin/arki02-continuity.py run`: status 0/SUCCESS.
- `ExecStartPost=/home/arki/ARKI/bin/arki-live-run.sh`: status 0/SUCCESS.
- `systemctl --user start arki02-continuity.service`: exit 0.
- `arki02-continuity.timer`: listado como activo, próximo disparo 19:00 -05, último disparo anterior 18:00:13 -05.
- `~/ARKI/continuity/arki-live/LATEST.json`: schema `ARKI-LIVE-CYCLE-1`, heartbeat `ADVISORY_PULSE_COMPLETED`.
- Core SHA: `c68b44514dc4a4574be0ed73df041f51ed5075a9`.
- Web SHA: `cbeb41fcf4649d27b09fe761247879de34e4914d`.
- Cinco propuestas procesadas: I-01, I-02, I-03, I-08, I-12; todas `EVIDENCE_REQUIRED`, dependencias `UNVERIFIED_OR_UNDECLARED`.
- Ensayo temporal: cinco anotaciones, `rollbackVerified=true`.
- `canonicalMutation=false`, `sourceWrites=0`, `poApproval=PENDING`.
- Receipt SHA-256 reportado: `e7f085cbcc15acbcab8840d76d928625a465a88e7c8a6660c816d54c41626935`.

## Dictamen

`ARKI_LIVE_SERVICE_INTEGRATION_PASS`: **verificado para una ejecución iniciada manualmente mediante systemd**, con ejecución correcta de `ExecStartPost`.

**Aún no verificado:** un disparo posterior efectivo del timer, recuperación tras reboot, autocorrección funcional, alternativas arquitectónicas medidas, ejecución AGK o aprendizaje Delta 6.2. El temporizador existente aparece activo; no se ha instalado otro temporizador mediante este commit.

## Alcance y precauciones

Este commit registra evidencia aportada por la salida de ARKI-02; no constituye una reproducción remota de los logs ni una certificación de autonomía completa. No modifica archivos de producto ni contratos FROZEN. La configuración systemd es local a ARKI-02 y no queda desplegada por este documento.

## Próximo control de aceptación

Tras las 19:00 -05:00, verificar `journalctl --user -u arki02-continuity.service --since '2026-10-14 19:00:00' --no-pager` y `systemctl --user list-timers --all`; exigir `ExecStartPost status=0/SUCCESS` en un disparo de temporizador y nueva evidencia de ejecución antes de declarar `TIMER_TRIGGER_VERIFIED`.


## Disparo automático verificado — 2026-10-27 19:00:12 -05

**Hito:** primer disparo del timer `arki02-continuity.timer` verificado de punta a punta, posterior al control de aceptación del 14-oct.

**Evidencia observada en Arki-001:**

- Timer disparó a las 19:00:12 -05.
- `ExecStart` (arki02-continuity.py): status 0/SUCCESS, `MANIFEST_INTEGRITY=PASS`, `FROZEN_MUTATION=NONE`, `REMOTE_WRITES=NONE`, `STATUS=ACE_SNAPSHOT_PASS`.
- `ExecStartPost` (arki-live-run.sh): status 0/SUCCESS, `ADVISORY_PULSE_COMPLETED`.
- `LATEST.json` actualizado: 38235 bytes, schema `ARKI-LIVE-CYCLE-1`.
- Core SHA: `d48a3301ba532d77e0d2eb1dd4b3b54df6fc0ab8`.
- Web SHA: `e51170b3ffff152b7a250038520f86ff285638b5`.
- 5 propuestas procesadas: I-01, I-02, I-03, I-08, I-12; todas `EVIDENCE_REQUIRED`, dependencias `UNVERIFIED_OR_UNDECLARED`.
- `repairExperiment`: `NO_SUPPORTED_DEFECT_FOUND`, candidates=[], `canonicalMutation=false`.
- `precedenceDiagnosis`: 51 nodos, 102 information gaps, 0 confirmed defects.
- `sandbox`: 5 correcciones temporales, `rollbackVerified=true`.
- Política: `canonicalMutation=false`, `sourceWrites=0`, `poApproval=PENDING`.
- Receipt SHA-256: `3a616934a50d7c6918573d3f7624a174b4c1865085d7d893bdda53ad045ffb5d`.
- Servicio `arki-arbol-vivo.service`: active (running), bind `0.0.0.0:8768`.
- HTTP 200 desde `127.0.0.1:8768`.

**Dictamen:** `TIMER_TRIGGER_VERIFIED` para esta ejecución. El ciclo vivo completó un disparo automático real con evidencia persistente y rollback verificado.

**No declarado:** autonomía arquitectónica, AGK, Delta 6.2, recuperación tras reboot. Persisten 102 information gaps y 0 confirmed defects.

**Cambio de SHAs respecto al 14-oct:** Core pasó de `c68b4451...` a `d48a3301...`. Web pasó de `cbeb41fc...` a `e51170b3...` (main de `canonical/sicl-web`).

**Hallazgo para próxima misión:** el `repairExperiment` existe y funciona, pero devuelve `NO_SUPPORTED_DEFECT_FOUND` con 0 candidates. La misión "autocorrección funcional" del `00_START.md` sección 5.2 requiere reinterpretarse como **cierre de information gaps**: tomar un HC-XX o I-XX, recolectar evidencia real, y demostrar transición `INFORMATION_GAP` → `EVIDENCE_VERIFIED` con cambio verificado (no waiver). Existen +50 `trackedPairs` con status `TRACKED_PAIR_NOT_EXECUTED`.


