# 00-START — ARKI/ARQUI · continuidad obligatoria

**Actualizado:** 2026-10-14 (Perú)  
**Propósito:** punto de entrada para el siguiente chat de ChatGPT, Manus, Codex o auditor. **Leer antes de proponer cambios.**

## 1. Identidad y objetivo

ARKI/ARQUI es el proyecto actual anteriormente llamado SICL/Vitruvio; no son proyectos distintos. Objetivo: **superarquitecto autónomo multiescala** (objeto, interior, edificio, conjunto, paisaje, ciudad, región y territorio). Debe aprender, razonar, detectar carencias, generar tres alternativas verificables, evaluar métricas, corregirse en entorno aislado, actualizar Árbol Vivo y Árbol Gemelo Digital y solicitar al PO aprobación para cambios protegidos. **Un solo kernel AGK**, 3D-First; hipótesis congelada: **OCCT + ARKI_DELTA**. **Delta 6.2** es la vía controlada de promoción del conocimiento. **F6 está descongelada por decisión del PO**; los demás contratos FROZEN se respetan. MiLukita es otro proyecto: no tocar.

**Regla:** no confundir simulación, anotación, diagnóstico o prueba de infraestructura con competencia arquitectónica demostrada. CERO DEUDAS; no waiver, no PASS inventado, no modificar canónico sin autorización del PO. Preferir implementación real y una macroorden de validación a más informes repetitivos.


## LEYES INQUEBRANTABLES

**LEY 1 — ANTES DE IMPLEMENTAR, AUDITORÍA INTENSA.**
Antes de escribir código nuevo, buscar en todos los repositorios, backups, históricos y documentación. Verificar si ya existe. No duplicar. La auditoría precede a la implementación. Sin auditoría, no se implementa.

**LEY 2 — CERO DEUDAS SIEMPRE.**
No se dejan gaps abiertos sin documentar. No se dejan tests rotos. No se dejan duplicados. No se dejan TODOs sin resolver. Si algo no se puede cerrar, se documenta con `blockingReason` honesto. CERO DEUDAS.

**LEY 3 — BUROCRACIA MÍNIMA SIEMPRE QUE SEA NECESARIO.**
La documentación y los procesos existen para servir al proyecto, no al revés. Si un proceso no aporta valor, se elimina. Si un documento no se lee, se archiva. Si una ceremonia no ayuda, se simplifica. Burocracia mínima, pero suficiente para mantener trazabilidad.

## 2. Repositorios, ramas y máquina

- GitHub Web: `YvanCastilloQuezada/sicl-web`.
- Rama experimental de trabajo: `test/arki-autonomy-offline-ci-20261014`. **No fusionar a main sin autorización.**
- **Último commit de esta continuidad, antes de crear/actualizar este 00-START:** `48c8e2c7724e9087d4cd5e50e3550cac93cc71a9` (documenta integración systemd).
- Core Ubuntu: `/home/arki/ARKI/repositorios/sicl-core`, HEAD observado `d48a3301ba532d77e0d2eb1dd4b3b54df6fc0ab8`.
- Web principal Ubuntu: `/home/arki/ARKI/repositorios/sicl-web` **DIRTY**, no resetear ni sobrescribir.
- Web aislado: `/home/arki/ARKI/validacion-f6-descongelada`, HEAD observado `48c8e2c7` tras fetch y detach.
- ACS: `/home/arki/ARKI/repositorios/arki-acs`.
- Core tiene archivos ACE88 no rastreados; preservarlos.
- En ARKI-02 hay `git`, Node 22, Python 3, pnpm/corepack; `rg` no estaba instalado. GitHub HTTPS fetch funciona; SSH había fallado.
- **No asumir acceso directo al equipo ARKI-02 desde GitHub**: el usuario ejecuta macroórdenes y pega resultados.

## 3. Estado confirmado: ARKI VIVO

### Ciclo vivo implementado

- Código: `tools/maqueta-viva/arki-live-cycle.cjs`, commit `cbeb41fcf4649d27b09fe761247879de34e4914d`.
- Genera mapa Core real (`tools/arki_mapa_vivo.py`), snapshot Web real (`arki-live-systems-coordinator.cjs`), verifica SHA independientes, ejecuta pulso MO-025, revisión MO-031, vinculación de evidencia, ensayo temporal reversible, y escribe historial externo en `~/ARKI/continuity/arki-live/` (`LATEST.json`, `events/`, `mo025/`).
- **Verificado en ARKI-02:** `ARKI_LIVE_EXIT=0`, schema `ARKI-LIVE-CYCLE-1`, `ADVISORY_PULSE_COMPLETED`, 5 propuestas, `rollbackVerified=true`, `canonicalMutation=false`. Cinco propuestas: I-01, I-02, I-03, I-08, I-12, todas `EVIDENCE_REQUIRED` / `UNVERIFIED_OR_UNDECLARED`.
- Este ensayo realiza **anotaciones temporales y rollback**, no corrección funcional del Core, AGK ni diseño.
- Reporta `architecturalDesign=NOT_DEMONSTRATED`, `agk=NOT_EXECUTED`, `delta62=NOT_EXECUTED`.

### Integración systemd verificada

- Servicio de usuario existente: `~/.config/systemd/user/arki02-continuity.service`.
- Temporizador existente: `arki02-continuity.timer` (no crear duplicado).
- Drop-in local instalado: `~/.config/systemd/user/arki02-continuity.service.d/arki-live.conf`:
  ```ini
  [Service]
  ExecStartPost=%h/ARKI/bin/arki-live-run.sh
  ```
- Ejecutable local: `~/ARKI/bin/arki-live-run.sh`, que invoca `arki-live-cycle.cjs` en Web aislado, Core principal y estado externo.
- **2026-10-14 18:09:46 -05:** el usuario ejecutó `systemctl --user start arki02-continuity.service`, salida 0; tanto `ExecStart` como `ExecStartPost` terminaron con `status=0/SUCCESS`. `Type=oneshot` queda `inactive (dead)` después de finalizar: **es normal**.
- Timer disparó el **27-oct-2026 19:00:12 -05** con status 0/SUCCESS. `ExecStartPost` (arki-live-run.sh) también terminó con status 0/SUCCESS. Ciclo vivo verificado: `ADVISORY_PULSE_COMPLETED`, `rollbackVerified=true`, `canonicalMutation=false`. Ver `docs/ops/ARKI-LIVE-SYSTEMD-INTEGRATION-20261014.md` sección "Disparo automático verificado — 2026-10-27 19:00".
- Evidencia de este hito registrada en `docs/ops/ARKI-LIVE-SYSTEMD-INTEGRATION-20261014.md`, commit `48c8e2c7`.

### Auditoría MO-032 (real)

- Después de regenerar mapas con SHA correctos: `coreValid=True`, `webValid=True`, `reconciliationValid=True`, `MO032R_EXIT=0`.
- L1: `PASS_ADVISORY` (diagnóstico y propuestas).
- L2: `PARTIAL` (recuperación entre procesos; reboot real no demostrado).
- L3: `NOT_DEMONSTRATED` (tres alternativas arquitectónicas con métricas).
- L4: `PARTIAL` (ensayo reversible, no autocorrección funcional).
- L5: `NOT_DEMONSTRATED` (Delta 6.2, AGK, multiescala).
- Pruebas focales MO031 21/21 PASS, bridge PASS, scheduled PASS, ACE PASS; son pruebas de alcance limitado.

## 4. Arquitectura existente que NO hay que duplicar

- `tools/maqueta-viva/arki-mo025-cycle.cjs`: pulso consultivo, journal y replay.
- `tools/maqueta-viva/arki-mo025-scheduled.cjs`: config de dos SHAs, freshness y protecciones; existe unit/timer MO025 **no instalado**.
- `tools/maqueta-viva/arki-core-mapa-vivo-bridge.cjs`: Core `arki.mapa_vivo.v1` + Web `ARKI-LIVE-SYSTEMS-SNAPSHOT-1`, solo `source-presence-only`.
- `tools/maqueta-viva/arki-mo031-review.cjs`, `arki-mo031-sandbox.cjs`, `arki-mo031-evidence.cjs`, `arki-mo031-file-rehearsal.cjs`: candidatos, evidencia, simulación temporal, rollback.
- `tools/maqueta-viva/assembly-registry.json`: inventario histórico; **no prueba automáticamente dependencias**.
- `~/ARKI/bin/arki02-continuity.py`: genera `PROJECT_STATE.json`, `CURRENT_PHASE.json`, `CRITICAL_PATH.json`, `EVIDENCE_INDEX.json`, `NEXT_ACTION.md`, `HANDOFF_LATEST.md`, `MANIFEST.json` en `~/ARKI/continuity`. Integridad 6/6, pero es metadato operativo, no aprendizaje autónomo.
- `arki02-ci.service` antes se bloqueó por repos dirty; no borrar cambios para forzar PASS.
- `arki-handoff.service` antes devolvía exit 0 sin generar handoff por ruta incorrecta `repos/sicl-web` vs `repositorios/sicl-web`; revisar productor antes de modificar.
- Git sync existente `arki02-git-sync.service`.

## 5. Próxima misión: dejar de dar vueltas

**El usuario exige ARKI realmente vivo y funcionando; no quiere más auditorías repetidas.** Prioridad de implementación:

1. ~~Comprobar **una vez** el disparo automático real de `arki02-continuity.timer` mediante logs posteriores a las 19:00, sin reinstalar servicios.~~ **✅ COMPLETADO 2026-10-27 19:00:12.**
2. **Cerrar un information gap real**: el `repairExperiment` existe pero devuelve `NO_SUPPORTED_DEFECT_FOUND` con 0 candidates. La misión real es tomar un HC-XX o I-XX de los 102 information gaps, recolectar evidencia real, y demostrar transición `INFORMATION_GAP` → `EVIDENCE_VERIFIED` con cambio verificado (no waiver). Existen +50 `trackedPairs` con status `TRACKED_PAIR_NOT_EXECUTED`.
3. **Investigar y reconstruir dependencias** de I-01, I-02, I-03, I-08, I-12 usando código y evidencia real; no inferirlas de etiquetas ni promover sin prueba.
4. **Conectar tareas y resultados reales con Árbol Vivo / Árbol Gemelo Digital**, con procedencia, estado, precedencias y bloqueo de propagación.
5. Después, tres alternativas arquitectónicas cuantificadas, Delta 6.2 real, geometría AGK única 3D-First y pruebas multiescala.

**PO:** el sistema detecta, investiga, ensaya y recomienda; el PO aprueba cambios canónicos. Mantener historia persistente y rollback.

## 6. Cómo retomar el siguiente chat

1. Leer este `00-START.md` y `docs/ops/ARKI-LIVE-SYSTEMD-INTEGRATION-20261014.md`.
2. Inspeccionar el HEAD actual de la rama experimental y el código real antes de cambiarlo.
3. Si se necesita el estado de ARKI-02, pedir **una sola macroorden breve** que devuelva logs del timer, SHAs y estado, sin destruir nada.
4. **Implementar código** en rama experimental a través de GitHub; incluir pruebas adversariales y dar un único bloque de validación para Ubuntu.
5. No anunciar “ARKI superarquitecto autónomo” hasta demostrar diseño, AGK, aprendizaje y autocorrección funcional.

## 7. Dictamen preciso para el siguiente asistente

**ARKI tiene un ciclo vivo operativo, integrado con systemd y probado mediante inicio manual del servicio.** Hay cinco propuestas en revisión, historial persistente y rollback. **La autonomía arquitectónica completa NO está demostrada.** El objetivo inmediato es pasar de diagnóstico/ensayo a **acción funcional comprobada** y actualización del Árbol Vivo.

**No confundir commit de documentación con despliegue ni afirmación de capacidad con prueba.**


## 9. CÓMO RETOMAR (actualizado 2026-10-27)

Al entrar al proyecto, leer este documento y luego:

### Paso 1 — Verificar el sistema

Comandos:
- systemctl --user status sicl-core sicl-web arki-arbol-vivo arki-all --no-pager
- ss -tlnp | grep -E "8000|3001|8768"
- curl -s -o /dev/null -w "Core: %{http_code}\n" http://127.0.0.1:8000/health
- curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://127.0.0.1:3001/api/core/health
- curl -s -o /dev/null -w "Árbol Vivo: %{http_code}\n" http://127.0.0.1:8768/

Resultado esperado: los 3 servicios active, los 3 puertos escuchando, los 3 HTTP 200.

### Paso 2 — Verificar el estado de los gaps

Comando:
- cat ~/ARKI/continuity/arki-live/LATEST.json | python3 -m json.tool | grep -A 2 "counts"

Resultado esperado: informationGaps: 0, confirmedDefects: 0.

### Paso 3 — Verificar el estado de los repos

Comando:
- for repo in canonical/sicl-web av023-arbol-vivo canonical/sicl-core; do cd /home/arki/ARKI/$repo; git status --short; git log --oneline -1; done

Resultado esperado: los 3 repos limpios, con HEAD actualizado.

### Paso 4 — Ejecutar E2E canonical (opcional)

Comando:
- cd /home/arki/ARKI/canonical/sicl-web
- export SICL_CORE_URL=http://127.0.0.1:8000
- export SICL_CORE_SERVICE_TOKEN=4d68d3c449864b7d560e09916559a7e2f9f7affb7115c33aa61af0881a11d506
- ./scripts/run-arki-canonical-e2e-auto.sh

Resultado esperado: status: EXECUTED, IDs únicos, event_id nuevos.

## 10. ESTADO ACTUAL (2026-10-27 22:15)

### Sistema
- Core: HTTP 200 en :8000
- Frontend: HTTP 200 en :3001
- Árbol Vivo: HTTP 200 en :8768
- arki-all.service: activo + habilitado
- Linger: habilitado (arranca al bootear)

### Gaps
- informationGaps: 0 (original: 102)
- confirmedDefects: 0
- 102 gaps cerrados con evidencia real

### Tests
- 963 tests PASS en el proyecto
- 64 tests PASS en las 10 fases
- 10/10 fases verificadas (TESTED_PASS_WEB_ONLY)
- Core: PASS
- E2E canonical: PASS (script automatizado)
- E2E advanced: PASS

### PO
- PO_APPROVED (Yvan Castillo Quezada, 2026-10-27)

### Leyes
- LEY 1: Auditoría antes de implementar
- LEY 2: Cero deudas siempre
- LEY 3: Burocracia mínima

### Repos
- canonical/sicl-web: HEAD 3bac1140 (limpio después del commit)
- av023-arbol-vivo: HEAD 309a5700 (limpio)
- canonical/sicl-core: HEAD 6d19a33 (limpio)

## 11. REFERENCIAS CLAVE

- docs/ops/ARKI-LOCAL-STACK-AUTOSTART-20261027.md — Stack local
- docs/ops/ARKI-DELTA62-STATUS-20261027.md — Delta 6.2
- docs/ops/ARKI-F1-F10-PHASE-EVIDENCE-20261027.md — Evidencia de las 10 fases
- docs/ops/ARKI-4-PENDIENTES-CERRADOS-20261027.md — Cierre de los 4 pendientes
- docs/ops/ARKI-E2E-CANONICAL-REPLICATE-20261027.md — Cómo replicar E2E
- docs/arki-master-map/ARKI_MASTER_MAP_STATE.json — Estado de las fases
- docs/arki-master-map/ARKI_F1_F10_AUTOMATED_TEST_MACRO_ORDERS_V1.md — Macroórdenes
- scripts/run-arki-canonical-e2e-auto.sh — Script E2E automatizado

## 12. PRÓXIMOS PASOS SUGERIDOS

1. Si los servicios no están corriendo: systemctl --user start arki-all.service
2. Si los gaps no son 0: revisar LATEST.json y ver qué falta
3. Si las fases no son TESTED_PASS_WEB_ONLY: ejecutar el runner de fases
4. Si el E2E canonical falla: usar el script automatizado (IDs únicos)
5. Si hay dudas: leer los documentos de referencia clave

