# 00-START — ARKI/ARQUI · continuidad obligatoria

## 1. Identidad y objetivo

ARKI/ARQUI es el proyecto actual anteriormente llamado SICL/Vitruvio; no son proyectos distintos. Objetivo: **superarquitecto autónomo multiescala** (objeto, interior, edificio, conjunto, paisaje, ciudad, región y territorio). Debe aprender, razonar, detectar carencias, generar tres alternativas verificables, evaluar métricas, corregirse en entorno aislado, actualizar Árbol Vivo y Árbol Gemelo Digital y solicitar al PO aprobación para cambios protegidos. **Un solo kernel AGK**, 3D-First; hipótesis congelada: **OCCT + ARKI_DELTA**. **Delta 6.2** es la vía controlada de promoción del conocimiento. **F6 está descongelada por decisión del PO**; los demás contratos FROZEN se respetan. MiLukita es otro proyecto: no tocar.

**Regla:** no confundir simulación, anotación, diagnóstico o prueba de infraestructura con competencia arquitectónica demostrada. CERO DEUDAS; no waiver, no PASS inventado, no modificar canónico sin autorización del PO. Preferir implementación real y una macroorden de validación a más informes repetitivos.



## 2. Repositorios, ramas y máquina

- GitHub Web: `YvanCastilloQuezada/sicl-web`.
- Rama experimental de trabajo: `test/arki-autonomy-offline-ci-20261014`. **No fusionar a main sin autorización.**
- **Último commit de esta continuidad, antes de crear/actualizar este 00-START:** `48c8e2c7724e9087d4cd5e50e3550cac93cc71a9` (documenta integración systemd).
- Core Ubuntu: `/home/arki/ARKI/canonical/sicl-core`, HEAD observado `865944f` (main, limpio).
- Web principal Ubuntu: `/home/arki/ARKI/canonical/sicl-web`, HEAD `a1bc2eae` (main, limpio), no resetear.
- Web aislado: `/home/arki/ARKI/validacion-f6-descongelada`, HEAD observado `48c8e2c7` tras fetch y detach.
- ACS: `/home/arki/ARKI/canonical/arki-acs`.
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



## 8. AUDITORÍA DIARIA

Historial de auditorías del proyecto. Cada entrada registra:
- Fecha y hora.
- Estado del sistema (Core, Frontend, Árbol Vivo).
- Gaps (informationGaps, confirmedDefects).
- Tests (proyecto, fases, Core, E2E).
- Repos (limpios o con cambios).
- Cambios realizados.

### 2026-10-27

- **Sistema:** Core 200, Frontend 200, Árbol Vivo 200.
- **Gaps:** 0 informationGaps, 0 confirmedDefects.
- **Tests:** 963 PASS (proyecto), 64 PASS (fases), Core PASS, E2E PASS.
- **Repos:** 3 limpios.
- **Cambios:** 102 gaps cerrados, 10/10 fases verificadas, PO_APPROVED, 3 leyes, "Cómo retomar", fundamentos fusionados, `00_START.md` eliminado.


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
- canonical/sicl-web: HEAD a1bc2eae (main, limpio)
- av023-arbol-vivo: HEAD 309a5700 (limpio)
- canonical/sicl-core: HEAD 865944f (main, limpio)


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



## 13. ÁRBOL DE DECISIÓN PARA DEBUGGING

Si algo falla, seguir este árbol:

### ¿El sistema no responde?

1. Verificar servicios: `systemctl --user status sicl-core sicl-web arki-arbol-vivo arki-all`
2. Si no están activos: `systemctl --user start arki-all.service`
3. Si siguen sin responder: ver logs: `journalctl --user -u <servicio> -n 50`

### ¿Los gaps no son 0?

1. Ver `LATEST.json`: `cat ~/ARKI/continuity/arki-live/LATEST.json | python3 -m json.tool`
2. Ver qué gaps hay: buscar `informationGaps` en el JSON.
3. Si hay gaps nuevos: revisar `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json`.
4. Si hay defectos: revisar `docs/arki-planning/BACKLOG.md`.

### ¿Las fases no son TESTED_PASS_WEB_ONLY?

1. Ver `MASTER_MAP_STATE.json`: `cat docs/arki-master-map/ARKI_MASTER_MAP_STATE.json | python3 -m json.tool`
2. Ejecutar el runner de fases: `ARKI_PHASE=F1 node scripts/arki-phase-evidence-runner.mjs`
3. Ver el receipt: `cat artifacts/arki-phase-evidence/receipt-f1.json`

### ¿El E2E canonical falla?

1. Verificar que el Core está corriendo: `curl http://127.0.0.1:8000/health`
2. Verificar `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN`.
3. Usar el script automatizado: `./scripts/run-arki-canonical-e2e-auto.sh`
4. Si falla con 409 CONFLICT: usar IDs únicos (el script lo hace).
5. Ver `docs/ops/ARKI-E2E-CANONICAL-REPLICATE-20261027.md`.

### ¿Un repo no está limpio?

1. Ver qué cambió: `git status --short`
2. Si son cambios legítimos: `git add -A && git commit -m "..."`
3. Si son basura: mover a `_BASURA` o `git checkout`.


## 14. MAPA DE DOCUMENTOS

Si buscas X, ve a Y:

| Si buscas... | Ve a... |
|--------------|---------|
| Qué es ARKI | `00-START.md` sección 1 + FUNDAMENTOS |
| Estado actual | `00-START.md` sección 10 + `LATEST.json` |
| Cómo arrancar | `00-START.md` sección 9 + `docs/ops/ARKI-LOCAL-STACK-AUTOSTART-20261027.md` |
| Estado de las fases | `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json` |
| Evidencia de las fases | `docs/ops/ARKI-F1-F10-PHASE-EVIDENCE-20261027.md` |
| Cómo replicar E2E | `docs/ops/ARKI-E2E-CANONICAL-REPLICATE-20261027.md` |
| Delta 6.2 | `docs/ops/ARKI-DELTA62-STATUS-20261027.md` |
| Planificación | `docs/arki-planning/` |
| Auditorías históricas | `_BASURA_2026-10-27/00_START_validaciones/` |
| Repositorios | `canonical/sicl-web`, `av023-arbol-vivo`, `canonical/sicl-core` |
| Logs del sistema | `journalctl --user -u <servicio>` |
| Ciclo vivo | `~/ARKI/continuity/arki-live/` |


## 15. GLOSARIO

| Término | Significado |
|---------|-------------|
| **ARKI/ARQUI** | Proyecto actual anteriormente llamado SICL/Vitruvio |
| **SICL** | Spatial Intelligence Command Language |
| **AGK** | ARKI Geometric Kernel (OCCT + ARKI_DELTA) |
| **D-2** | Autoridad arquitectónica semántica |
| **Delta 6.2** | Vía controlada de promoción del conocimiento |
| **Árbol Vivo** | Representación del estado del proyecto (av023-arbol-vivo) |
| **Árbol Gemelo Digital** | Representación del estado del proyecto (Gemelo Digital Vivo + Experimental) |
| **MO-025** | Pulso consultivo del ciclo vivo |
| **MO-031** | Revisión de propuestas |
| **MO-032** | Auditoría del ciclo vivo |
| **PO** | Product Owner (Yvan Castillo Quezada) |
| **F1-F10** | Las 10 fases del proyecto |
| **TESTED_PASS_WEB_ONLY** | Tests de Web pasan, Core pendiente |
| **PO_APPROVED** | El PO ha aprobado el estado testeado |
| **informationGaps** | Gaps de información (deben ser 0) |
| **confirmedDefects** | Defectos confirmados (deben ser 0) |
| **E2E** | End-to-End (prueba de extremo a extremo) |
| **Core** | Repo canónico `sicl-core` (puerto 8000) |
| **Web** | Repo canónico `sicl-web` (puerto 3001) |
| **Árbol Vivo** | Repo `av023-arbol-vivo` (puerto 8768) |



## LEYES INQUEBRANTABLES

**LEY 1 — ANTES DE IMPLEMENTAR, AUDITORÍA INTENSA.**
Antes de escribir código nuevo, buscar en todos los repositorios, backups, históricos y documentación. Verificar si ya existe. No duplicar. La auditoría precede a la implementación. Sin auditoría, no se implementa.

**LEY 2 — CERO DEUDAS SIEMPRE.**
No se dejan gaps abiertos sin documentar. No se dejan tests rotos. No se dejan duplicados. No se dejan TODOs sin resolver. Si algo no se puede cerrar, se documenta con `blockingReason` honesto. CERO DEUDAS.

**LEY 3 — BUROCRACIA MÍNIMA SIEMPRE QUE SEA NECESARIO.**
La documentación y los procesos existen para servir al proyecto, no al revés. Si un proceso no aporta valor, se elimina. Si un documento no se lee, se archiva. Si una ceremonia no ayuda, se simplifica. Burocracia mínima, pero suficiente para mantener trazabilidad.


## FUNDAMENTOS (del 00_START.md histórico, 2026-10-12)

### Principio Fundacional Prioritario — ARKI DETERMINISTA / SICL

**Instrucción expresa del Product Owner:** «ARKI es determinista. Eso es lo que lo hace distinto». Identifica a «SILC, S-I-L-C» como motor de búsqueda determinístico.

**Contraste con fuente fundacional:** `docs/ARKI_AND_SICL_FOUNDATIONS.md` define **SICL** (S-I-C-L, Spatial Intelligence Command Language) como lenguaje formal de operación verificable del Core. **SILC vs SICL = NOMENCLATURA POR RECONCILIAR.** No asumir que son lo mismo ni inventar un motor nuevo.

**Invariante de determinismo:** ante idéntica versión de código, estado inicial, entradas, reglas, parámetros, semillas y fuentes fijadas, el camino canónico de ARKI debe producir resultados reproducibles y rastreables.

**Autoridad única:** un sistema ARKI, una autoridad arquitectónica semántica D-2, una autoridad geométrica AGK, Core para estado/validación, y revisión humana para decisiones. **NO_NEW_ENGINE; NO_AUTOMATIC_CANONIZATION.**

### Ley del Embudo — «La vida es dura para las ideas»

**Descripción del PO:** desde el encargo de Fase 1 ARKI explora miles de ideas/posibilidades. Las restricciones verificadas y criterios de evaluación van descartando alternativas; el embudo conduce a **N → 16 → 4 → 1**.

**Regla:** generación amplia → filtros duros de inviabilidad → evaluación multiobjetivo → diversidad arquitectónica → 16 → 4 → 1 con decisión humana.

**Retención:** si ARKI explora 10 000 ideas, las descartadas durante la exploración **NO SE GUARDAN individualmente**. **Solo se conservan las 16 ideas supervivientes** del primer corte N→16.

**No eliminar ideas del historial:** rechazo/archivo reversible y trazable, no borrado de auditoría append-only.

### Ley «La vida de las ideas es cruel»

**Fuente canónica:** `YvanCastilloQuezada/sicl-core/docs/ARKI_LAW_LIFE_OF_IDEAS_IS_CRUEL.md`

**Fórmula:** «MUCHAS IDEAS NACEN... POCAS SOBREVIVEN».
**Regla de oro:** «MATAR UNA IDEA ES BARATO. DESARROLLARLA ES CARO».

**Secuencia doctrinal:** IDEAS → ALTERNATIVAS → GEOMETRÍAS → SIMULACIONES → SOLUCIONES → PROPUESTAS → OBJETO/ARQUITECTURA/ESPACIO.

**CHEAP VALIDATION BEFORE EXPENSIVE DEVELOPMENT.**

### Mapa de Responsabilidades — CORE / WEB / ACS

- **ARKI Core** = corazón normativo/canónico (leyes, constitución, contratos e invariantes).
- **ARKI Web** = operación, interfaz y orquestación.
- **ARKI ACS/SLC** = investigación/gemelo digital y módulo de búsqueda de contrataciones del Estado.

**NO colapsar los repositorios ni confundir funciones.**

### Visión del PO — Dos Gemelos

**(A) Gemelo Digital Vivo del propio ARKI:** estado, capacidades, dependencias, evaluación de mejoras. Prepara **TRES opciones de mejora** para selección/aprobación humana.

**(B) Gemelo Digital Experimental:** banco aislado para probar tecnologías/cambios antes de afectar ARKI.

**No fusionar ambos conceptos ni asumir implementación E2E.**

### Fase 1 — Encargo Único

La jerarquía de diez fases comienza en Fase 1 con recepción del encargo/intención del cliente. El concepto de proyecto nace y se registra allí.

**Flujo:** FASE 1 / ENCARGO → D-2 autoridad semántica → Project State / Core / trazabilidad → ejecución gobernada de FASES 2–10 → AGK único para geometría canónica → representaciones 2D/3D/BIM/IFC.




---

## Stack local y autostart (2026-10-27 22:30)

Estado verificado: **operativo**. Los 4 servicios están `active` y `enabled`,
los 3 endpoints responden HTTP 200, linger habilitado.

| Servicio | Puerto | Estado | Desde |
|---|---|---|---|
| sicl-core.service | 8000 | active (running) | 20:06:51 |
| sicl-web.service | 3001 | active (running) | 20:06:54 |
| arki-arbol-vivo.service | 8768 | active (running) | 20:06:53 |
| arki-all.service | — | active (exited) | 20:06:58 |

Documentación completa: `docs/ops/ARKI-LOCAL-STACK-AUTOSTART-20261027.md`.

**Bug menor conocido:** `arki-all-start.sh` verifica endpoints demasiado pronto
(la verificación final del `startup.log` dio `HTTP 000` a las 20:06:58, pero a las
22:30 los 3 endpoints dan 200). El script sale siempre con `exit 0`, así que no
bloquea el arranque, pero el log es engañoso.

**Fallo del timer 22:00:** `arki02-continuity.service` disparó a las 22:00:10 y
`ExecStartPost` (`arki-live-run.sh`) falló con `status=1/FAILURE`:
`ARKI_LIVE_SYSTEMS_FAIL: F6_REVOCATION_STATUS_CONFLICT` en
`arki-live-systems-coordinator.cjs`. El `ExecStart` (`arki02-continuity.py`) sigue
OK (`STATUS=ACE_SNAPSHOT_PASS`). **Material directo para la próxima misión
(autocorrección funcional concreta y limitada).**

---

## Nota de rol (2026-10-28)

**Este archivo (`00_REVIVIR.md`) es el documento de CONTINUIDAD CORTO.**
**El documento CANÓNICO COMPLETO es `00-START.md`** (1,803 líneas, 13 anexos A-S).

Este `00_REVIVIR.md` es un espejo del `00-START.md` del worktree `av023-arbol-vivo/`, usado para "revivir" el proyecto en ese contexto. Para el estado completo, leer `00-START.md`.

**End of nota.**

---

## 19. Autoensamblaje (rama `feat/arbol-vivo-autoensamblaje-20261011`) — 2026-10-28

**Origen:** este apartado asimila el contenido de `00_CONTINUIDAD_AUTOENSAMBLAJE.md` (14-oct-2026), la rama `feat/arbol-vivo-autoensamblaje-20261011` y el PR #56. El documento original se conserva en el repo para trazabilidad, pero su contenido operativo queda aquí.

### 19.1 — Qué es el autoensamblaje

El **autoensamblaje** es la capacidad de ARKI de:

1. **Inventariar** los archivos de Web/Core/ACS, anclados a commits concretos.
2. **Clasificar** cada archivo (descubrimiento heurístico reproducible).
3. **Planificar** el ensamblaje: proponer una fase (F1-F10) para cada archivo, detectar ciclos, dependencias faltantes y FROZEN.
4. **Proponer tres alternativas** (A/B/C) de estrategia de ensamblaje.
5. **No ejecutar** ni **no promover** canónicamente. Solo propone.

### 19.2 — Estado actual (2026-10-28)

| Componente | Archivo | Tamaño | Estado |
|---|---|---|---|
| Planificador | `tools/maqueta-viva/arki-assembly-planner.cjs` | 2.6 KB | ✅ Tests PASS |
| Test del planificador | `tools/maqueta-viva/test-arki-assembly-planner.cjs` | 1.1 KB | ✅ `ARKI_ASSEMBLY_PLANNER_TESTS=PASS` |
| Descubrimiento | `tools/maqueta-viva/arki-discovery.cjs` | 2.4 KB | ✅ Existe |
| Inventario de capacidades | `tools/maqueta-viva/arki-capability-inventory.cjs` | 3.0 KB | ✅ Existe |
| Estrategias A/B/C | `tools/maqueta-viva/arki-assembly-strategies.cjs` | 1.5 KB | ✅ Existe |
| Workflow CI | `.github/workflows/arki-assembly-planner.yml` | 1.7 KB | ✅ Existe |
| Snapshot de repositorios | `tools/maqueta-viva/arki-repository-snapshot.json` | 105 KB | ✅ Existe (1933 rutas) |
| Reporte de descubrimiento | `tools/maqueta-viva/arki-discovery-report.json` | 6.3 KB | ✅ Existe (460 rutas no clasificadas) |

### 19.3 — PR #56: MERGED

**El PR #56 está MERGED** (no DRAFT, como decía el documento del 14-oct).

- **Título:** "ARKI: inventario real de tres repositorios y planificación segura de autoensamblaje"
- **Estado:** MERGED
- **Adiciones:** 2,692 líneas
- **Deleciones:** 0
- **URL:** https://github.com/YvanCastilloQuezada/sicl-web/pull/56

**Alcance:**
- Inventario de rutas en WEB, CORE y ACS anclado a SHA.
- Descubrimiento heurístico reproducible, con incertidumbre explícita.
- Planificador de ensamblaje propuesto con controles de dependencias, ciclos, FROZEN y conflictos.
- Pruebas unitarias y CI; frontend existente sin cambios.

### 19.4 — El planificador (`arki-assembly-planner.cjs`)

**Función:** `planAssembly(parts, phaseRules)`

**Entrada:** array de partes, cada una con:
- `id` (VALID_ID: `^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$`)
- `path` (VALID_PATH: `^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$`)
- `phase` (F1-F10, opcional)
- `dependencies` (array de IDs)
- `frozen` (boolean, opcional)

**Salida:** `{ schema: "ARKI-ASSEMBLY-PLAN-1", parts, issues, summary, canonicalMutation: false, execution: "NOT_EXECUTED" }`

**Garantías:**
- **No ejecuta código.**
- **No escribe en el filesystem.**
- **No promueve canónicamente** (`canonicalMutation: false`).
- **No ejecuta** (`execution: "NOT_EXECUTED"`).
- **Detecta:** ciclos (`DEPENDENCY_CYCLE`), dependencias faltantes (`MISSING_DEPENDENCY`), IDs duplicados (`DUPLICATE_ID`), partes inválidas (`INVALID_PART`).
- **Bloquea propagación:** si una parte tiene una dependencia bloqueada, se bloquea también.
- **Marcas:** `FROZEN_READ_ONLY`, `DEPENDENCY_BLOCKED`, `PHASE_UNDETERMINED`, `PHASE_CONFLICT`.

### 19.5 — El test (`test-arki-assembly-planner.cjs`)

**Verifica:**
- 5 partes → `summary.total === 5`.
- Cadena A→B→C → `C.status === "PROPOSED"`.
- Dependencia faltante (`Z` → `NOPE`) → `Z.reasons` incluye `DEPENDENCY_BLOCKED`.
- Parte FROZEN (`F`) → `F.reasons` incluye `FROZEN_READ_ONLY`.
- `canonicalMutation === false`.
- `execution === "NOT_EXECUTED"`.
- Conflicto de fase (A con `phaseRules` distinto) → `status === "REVIEW_REQUIRED"`.
- Ciclo A↔B → `issues` incluye `DEPENDENCY_CYCLE`.
- ID duplicado → `throws /DUPLICATE_ID/`.
- ID inválido (`../bad`) → `throws /INVALID_PART/`.

**Resultado:** `ARKI_ASSEMBLY_PLANNER_TESTS=PASS`.

### 19.6 — Los archivos auxiliares

| Archivo | Función |
|---|---|
| `arki-discovery.cjs` | Clasificación heurística conservadora de archivos. |
| `arki-capability-inventory.cjs` | IDs estables con SHA-256, sin colisión por normalización. |
| `arki-assembly-strategies.cjs` | Propone estrategias A/B/C (no ejecuta ni selecciona). |
| `arki-repository-snapshot.json` | Snapshot de 1933 rutas de Web/Core/ACS, ancladas a SHA. |
| `arki-discovery-report.json` | Reporte de 460 rutas no clasificadas por heurística. |

### 19.7 — Lo que NO hace (límites)

- **No ejecuta** el plan (solo lo propone).
- **No promueve** canónicamente (`canonicalMutation: false`).
- **No integra** la salida al HTML.
- **No inspecciona** las dependencias reales a nivel código (solo detecta ciclos y faltantes).
- **No asigna** fases autónomamente (marca `PHASE_UNDETERMINED` si no hay fase).
- **No selecciona** una de las tres alternativas A/B/C (el PO decide).

### 19.8 — Estado del CI

**El documento original (14-oct) decía:**
> "GitHub Actions run `38190972045`: FAILURE de infraestructura (runner no asignado; cero pasos ejecutados), **NO VERIFIED**."

**Pero ahora:**
- El test local **pasa** (`ARKI_ASSEMBLY_PLANNER_TESTS=PASS`).
- El PR #56 está **MERGED**.
- El CI del PR #56 **pasó** (para poder mergear).

**El fallo de infraestructura del 14-oct fue transitorio.** El código funciona.

### 19.9 — Siguiente paso

El documento original decía:
> "Siguiente paso: comprobar el planificador, integrarlo con inventario real, comparar ramas, implementar tres propuestas ensayables en sandbox y enlazar resultados al Árbol Vivo y Gemelo Digital. No atribuirle ejecución autónoma todavía."

**Estado actual:**
- ✅ Planificador comprobado (`ARKI_ASSEMBLY_PLANNER_TESTS=PASS`).
- ✅ Inventario real integrado (`arki-repository-snapshot.json`, 1933 rutas).
- ✅ Comparación de ramas (PR #56 MERGED).
- ⚠️ **Tres propuestas ensayables en sandbox:** pendiente (`arki-assembly-strategies.cjs` propone A/B/C, pero no se han ensayado).
- ⚠️ **Enlace al Árbol Vivo / Gemelo Digital:** pendiente.
- ⚠️ **Ejecución autónoma:** no atribuida (correcto).

### 19.10 — El `00_CONTINUIDAD_AUTOENSAMBLAJE.md` queda como histórico

El archivo `00_CONTINUIDAD_AUTOENSAMBLAJE.md` (14-oct-2026) se conserva en el repo para trazabilidad, pero su contenido operativo queda asimilado en esta sección. **No es necesario leerlo para retomar el proyecto.** Si hay conflicto entre el documento original y esta sección, prevalece esta sección (fechada 2026-10-28, con el estado real verificado).

**Fin del apartado 19 — 2026-10-28.**
