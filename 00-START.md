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

# ANEXOS

## Anexo A — COMPAS (runtime no-canónico, 2.15.0)

**Qué es:** COMPAS es un proveedor **no-canónico** de capacidades geométricas (`COMPAS_RUNTIME_IDENTITY`, `TRANSFORM_POINTS_3D`). Se usa como oráculo externo para verificar geometría. **No crea estado canónico** (el canónico es AGK).

**Repo oficial:** https://github.com/compas-dev/compas (MIT, `compas-dev`). Framework Python open-source para investigación computacional en arquitectura/ingeniería.

**Ubicación:** `.venv-compas/` (venv aislado dentro de `canonical/sicl-web`).

**Versión pinneada:** `compas==2.15.0` (en `requirements-compas.txt`).

**Instalación (si no existe):**
cd /home/arki/ARKI/canonical/sicl-web
python3 -m venv .venv-compas
.venv-compas/bin/pip install -r requirements-compas.txt
.venv-compas/bin/python -c "import compas; print('COMPAS:', compas.__version__)"
.venv-compas/bin/python -m compas
echo '{"capability":"COMPAS_RUNTIME_IDENTITY","input":{}}' | .venv-compas/bin/python tools/arki_compas_worker.py

text

**Dependencias instaladas (transitivas):** `numpy 2.5.4`, `scipy 1.18.1`, `networkx 3.7`, `jsonschema 4.26.0`, `watchdog 6.0.0`, `attrs 26.1.0`, `referencing 0.37.0`, `rpds-py 2026.9.1`, `jsonschema-specifications 2025.9.1`.

**Archivos relevantes:**
- `requirements-compas.txt` — versión pinneada.
- `tools/arki_compas_worker.py` — worker stdin/stdout (JSON por línea).
- `tools/test_fixtures/arki_fake_compas_unobserved.py` — fixture de test.
- `.venv-compas/.gitignore` — contiene `*` (no se commitea).

**Cómo se invoca:** `server/capabilityFabric/compasWorkerTransport.ts` lanza `python [workerPath]` vía `spawn`. Usa `ARKI_PYTHON_EXECUTABLE` (si está) o `python3`. Timeout 10s.

**Tests que dependen de COMPAS (4, condicionales):**
- `server/capabilityFabric/e2e001.test.ts` (1 test).
- `server/capabilityFabric/defaultFabric.test.ts` (2 tests).
- `server/capabilityFabric/compasWorkerTransport.test.ts` (1 test).

**Cómo ejecutarlos:**
Con COMPAS (0 skipped)
ARKI_REQUIRE_COMPAS=1 ARKI_PYTHON_EXECUTABLE=.venv-compas/bin/python
pnpm test -- --run server/capabilityFabric

Sin COMPAS (4 skipped, resto pasa)
pnpm test -- --run

text

**CI:** `.github/workflows/compas-capability.yml` instala COMPAS con `python -m pip install -r requirements-compas.txt` y ejecuta con `ARKI_REQUIRE_COMPAS=1`.

**Estado verificado (2026-10-27):** 963 tests passed, 0 failed, 0 skipped con COMPAS. 959 passed, 4 skipped sin COMPAS (condicionales).

**Troubleshooting:**
- `COMPAS_RUNTIME_UNAVAILABLE` → `.venv-compas` no importa `compas`. Reinstalar.
- `COMPAS_RUNTIME_SPAWN_FAILED` → `ARKI_PYTHON_EXECUTABLE` inválido.
- `COMPAS_RUNTIME_TIMEOUT` → worker >10s. Aumentar `timeoutMs` (no recomendado).

---

## Anexo B — Prerrequisitos del sistema

| Componente | Versión instalada | Comando de verificación |
|---|---|---|
| OS | Ubuntu 26.04.1 LTS | `cat /etc/os-release` |
| Kernel | Linux 7.0.0-38-generic | `uname -a` |
| Node.js | v22.22.1 | `node --version` |
| pnpm | 10.15.1 | `pnpm --version` |
| Python | 3.14.4 | `python3 --version` |
| pip | 25.1.1 | `python3 -m pip --version` |
| Docker | 29.1.3 | `docker --version` |
| Docker Compose | 2.40.3 | `docker compose version` |
| git | 2.53.0 | `git --version` |
| systemd | 259 | `systemctl --version` |

**Instalación de herramientas base (si falta alguna):**
Node 22 (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

pnpm 10.15.1
npm install -g pnpm@10.15.1

Python 3.14 (viene con Ubuntu 26.04)
sudo apt install -y python3 python3-pip python3-venv

Docker (via repositorio oficial)
sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker

git
sudo apt install -y git

text

**Nota:** las versiones exactas de cada componente se verificaron el 2026-10-27. Si en el futuro se actualizan, actualizar esta tabla en el mismo commit que la actualización.

---

## Anexo C — Tests y setup (`server/test-setup.ts` + `vitest.config.ts`)

### `server/test-setup.ts`

Archivo de setup global para vitest. Define variables de entorno **aisladas** para los tests. **NO afecta a producción ni a `.env.local`.**

**Variables que define:**

| Variable | Valor | Por qué |
|---|---|---|
| `VITE_APP_ID` | `MO22_TEST_APP_ID` | Para que `ENV.appId` no sea `""` (rompería `verifySession`) |
| `JWT_SECRET` | `mo22-test-jwt-secret-for-vitest-only-32chars-min` | Para que `jose` no falle con `Zero-length key` |
| `DATABASE_URL` | `mysql://arki_web:<pass>@127.0.0.1:3307/arki_test` | Para que los tests de MO22 conecten a `arki_test` (no a `arki_web`) |
| `ARKI_STORAGE_ROOT` | `~/.arki-test-storage` | `createFileBackend` **rechaza** `/tmp/` y `/var/tmp/` por seguridad (`Unsafe root`) |
| `ARKI_STORAGE_MODE` | `local` | Requerido por `enabled()` en `arkiMo22Bridge.ts` |
| `ARKI_MO22_ENABLE` | `1` | Requerido por `enabled()` |
| `ARKI_DEV_OPEN` | `0` | Requerido por `enabled()` |
| `ARKI_IDENTITY_MODE` | `manus` | Activa la rama JWT de `enabled()` y de `authenticated()`. Con `local` se usa `authenticateLocalIdentity`, que **no verifica JWT** y rompe el test de MO22 |
| `NODE_ENV` | `test` | Requerido por `enabled()` |

**NO define** `SICL_CORE_URL` ni `SICL_CORE_SERVICE_TOKEN`. El test `coreHttpClient.test.ts` necesita que estén **vacíos por defecto** (test `"does not call a core service when no URL is configured"`). Cada test que los necesite los define con `vi.stubEnv(...)`.

**Creación del directorio de storage:** el setup hace `mkdirSync(root, { recursive: true, mode: 0o700 })` y `mkdirSync(root/objects, { recursive: true, mode: 0o700 })`. Permisos `0o700` requeridos por `createFileBackend` (`if ((s.mode & 0o022) !== 0) throw Error('Unsafe storage directory')`).

### `vitest.config.ts`
test: {
environment: "node",
setupFiles: ["./server/test-setup.ts"],
include: ["server//*.test.ts", "server//.spec.ts", "client/**/.test.ts", "client//*.spec.ts", "shared//.test.ts", "shared/**/.spec.ts"],
}

text

### Cómo ejecutar los tests
cd /home/arki/ARKI/canonical/sicl-web

Con COMPAS (0 skipped, recomendado)
ARKI_REQUIRE_COMPAS=1 ARKI_PYTHON_EXECUTABLE=.venv-compas/bin/python
pnpm test -- --run

Sin COMPAS (4 skipped, más rápido)
pnpm test -- --run

Solo COMPAS
ARKI_REQUIRE_COMPAS=1 ARKI_PYTHON_EXECUTABLE=.venv-compas/bin/python
pnpm test -- --run server/capabilityFabric

Solo MO22
pnpm test -- --run server/_core/arkiMo22

text

**Resultado esperado:**
- Con COMPAS: `156 passed (156)`, `963 passed (963)`, `0 skipped`.
- Sin COMPAS: `156 passed (156)`, `959 passed | 4 skipped (963)`.

---

## Anexo D — Troubleshooting consolidado (MO22 + COMPAS + SICL)

### MO22 — Tests de storage

| Síntoma | Causa | Fix |
|---|---|---|
| `TypeError: Cannot read properties of undefined (reading 'status')` en `coreHttpClient.test.ts` | `SICL_CORE_URL` global en `test-setup.ts` rompía el test "sin URL" | Quitar `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN` del setup global |
| `Zero-length key is not supported` en `jose` | `JWT_SECRET` vacío | Definir `JWT_SECRET` en `test-setup.ts` |
| `ECONNREFUSED 127.0.0.1:3306` | `DATABASE_URL` no definido → mysql2 usa 3306; MariaDB está en 3307 | Definir `DATABASE_URL=...3307/arki_test` en `test-setup.ts` |
| `Table 'sicl_projects' already exists` | Test no idempotente | Añadir `DROP TABLE IF EXISTS sicl_projects` y `DROP TABLE IF EXISTS arki_storage_objects` al inicio del test |
| `Unsafe root` | `ARKI_STORAGE_ROOT` en `/tmp/` o `/var/tmp/`. `createFileBackend` los rechaza por diseño | Usar `~/.arki-test-storage` con permisos `0o700` |
| `STORAGE_ACCESS_DENIED` (403) en POST | 1) `authenticate()` con `IDENTITY_MODE="local"` usa flujo no-JWT; 2) `createFileBackend` falla por `Unsafe root` | 1) `IDENTITY_MODE="manus"`; 2) `ARKI_STORAGE_ROOT` fuera de `/tmp/` |
| `404` en `POST /api/arki-storage/...` | `enabled()` requiere 6 variables, solo había 2 | Añadir `ARKI_STORAGE_MODE`, `ARKI_DEV_OPEN`, `ARKI_IDENTITY_MODE`, `NODE_ENV` al setup |
| `OAUTH_SERVER_URL is not configured` | Warning de OAuth, no bloqueante | Añadir `OAUTH_SERVER_URL` a `.env.local` si se necesita OAuth |

**Diagnóstico del 403 (logging temporal, ya revertido):** añadir `console.error(e?.message, e?.code, e?.sqlMessage)` en `failure()` de `arkiHttpRoutes.mjs` muestra el error real que el `catch` convierte en 403. Se revirtió después de diagnosticar.

### COMPAS — Runtime no-canónico

| Síntoma | Causa | Fix |
|---|---|---|
| `COMPAS_RUNTIME_UNAVAILABLE` | `.venv-compas` no importa `compas` | Reinstalar: `python3 -m venv .venv-compas && .venv-compas/bin/pip install -r requirements-compas.txt` |
| `COMPAS_RUNTIME_SPAWN_FAILED` | `ARKI_PYTHON_EXECUTABLE` apunta a python inválido | Verificar `which .venv-compas/bin/python` |
| `COMPAS_RUNTIME_TIMEOUT` | Worker tarda >10s | Aumentar `timeoutMs` en `createCompasWorkerTransport` (no recomendado) |
| Tests de COMPAS skipped | `ARKI_REQUIRE_COMPAS !== "1"` | `ARKI_REQUIRE_COMPAS=1 ARKI_PYTHON_EXECUTABLE=.venv-compas/bin/python pnpm test` |

### SICL Core / Web

| Síntoma | Causa | Fix |
|---|---|---|
| `sicl-web` recarga al cambiar `.env.local` | Comportamiento normal de Vite en development | No es un bug |
| `arki-all.service` falla | Algún endpoint no responde en 60s | Ver `journalctl --user -u arki-all -n 50` y `cat ~/ARKI/continuity/startup.log` |
| Servicios no arrancan al bootear | Falta linger | `sudo loginctl enable-linger arki` |
| `startup.log` dice `HTTP 000` pero los servicios están OK | `arki-all-start.sh` verifica demasiado pronto (15s) | Bug menor conocido, no bloquea. Documentado. |

### Árbol Vivo

| Síntoma | Causa | Fix |
|---|---|---|
| `ARKI_TREE_START_FAIL Command failed: git show HEAD:...` | Worktree huérfano | `cd canonical/sicl-web && git worktree prune && git worktree add /home/arki/ARKI/av023-arbol-vivo 2c476c37` |
| Puerto 8768 ocupado | Otro proceso usa el puerto | `ss -tlnp | grep 8768` y matar el proceso |

---

## Anexo E — Referencias cruzadas

- `docs/ops/ARKI-LOCAL-STACK-AUTOSTART-20261027.md` — Stack local y arranque automático (systemd).
- `docs/ops/ARKI-LIVE-SYSTEMD-INTEGRATION-20261014.md` — Integración del ciclo vivo con systemd.
- `docs/ops/ARKI-MO-025-ACTIVACION-ARBOL-VIVO.md` — Activación del Árbol Vivo (MO-025).
- `docs/ops/ARKI-MO-026-032-ACTIVACION-INTEGRADA.md` — Activación integrada MO-026..032.
- `.github/workflows/compas-capability.yml` — CI de COMPAS.
- `requirements-compas.txt` — Versión pinneada de COMPAS.
- `server/test-setup.ts` — Setup de tests (vitest).
- `vitest.config.ts` — Config de vitest con `setupFiles`.
- https://github.com/compas-dev/compas — Repo oficial de COMPAS.

---

## Anexo F — Registro de cambios de estos anexos

| Fecha | Cambio |
|---|---|
| 2026-10-27 | Creación. Anexos A (COMPAS), B (Prerrequisitos), C (Tests y setup), D (Troubleshooting), E (Referencias cruzadas), F (Registro). |

---

## Anexo G — Manual Maestro de Continuidad (histórico 2026-10-16, revisado 2026-10-28)

**Origen:** `ARKI-00.md` (raíz de `canonical/sicl-web`, trackeado en git, 430 líneas).
**Estado:** histórico. Este anexo integra en el `00-START.md` las secciones del Manual Maestro que **no estaban** en el documento de continuidad. El original completo se conserva en `ARKI-00.md` para trazabilidad.
**Regla:** para el estado **vigente**, leer el `00-START.md` (secciones 1-15 + Anexos A-G). Para el contexto histórico y la visión original del PO, leer `ARKI-00.md`.

### G.1 — Interfaz gráfica elegida por el PO (crítico)

**Instrucción del PO:** «Meter ahí y borrar, meter y borrar». Recuperar lo valioso de las ramas y módulos existentes, integrarlo en el **Árbol Vivo aprobado**, verificar conservación y luego eliminar solamente lo redundante. **No diseñar otra interfaz ni seguir abriendo ramas.**

**Repositorio GitHub:** `YvanCastilloQuezada/sicl-web`.

**Plantilla de interfaz aprobada que hay que completar:**

`tools/maqueta-viva/maqueta-viva.template.html`

**Ramas donde buscarla (no crear otras):**
- `integration/arki-av035-main-20261015` (integración AV035).
- `experiment/arki-ideas-mapa-vivo-20261015` (trabajo experimental posterior).
- `feat/arbol-vivo-precedencias-seguras-20261010` (precedencias y plantilla histórica).

**Diseño visual aprobado:**
- **Árbol central:** tronco vertical F1 (abajo) hasta F10 (arriba), ramas por fase, espinas/actividades, hojas/frutos de evidencia.
- **Al seleccionar una fase:** abrir columna vertebral/ruta crítica y espinas; mostrar dependencias, estado, alternativas, precedencia y urgencia.
- **Izquierda:** leyenda, aprobaciones, información; **derecha:** propuestas pendientes y alternativas; centro con scroll.
- **Madurez:** gradiente violeta→verde; rojo revisión; madurez separada de autorización. Nunca poner verde sin evidencia.
- **Vistas:** 01 Plano ARKI (estructura); 02 Maqueta Viva (piezas/fases/espinas/alternativas); 03 Gemelo Digital (estado real y sincronización); 04 Gemelo Predictivo (escenarios y métricas); 05 ARKI Autocorrectivo (diagnóstico/autorización/reversión).
- **Barra superior:** Estructura · Conexiones · Roadmap · Escenarios · Inventario · Flotantes · Pendientes · Ideas Dispersas · FROZEN · Ideas ARKI · Research & Trends · Historial fuentes · Pruebas E3 Windows · buscador PIEZA.
- **Ocultar** entradas técnicas Estado/Borrador/Inventario JSON del flujo de uso normal.

**Otros archivos visuales a localizar:**
- `client/src/App.tsx` — rutas React.
- `client/src/pages/ArkiControlCenterPage.tsx`.
- `client/src/pages/ArkiSuperarchitectCommandCenterPage.tsx`.
- `client/src/pages/ArkiSuperArchitectViewerPage.tsx`.
- `tools/maqueta-viva/av-ui-001-readonly-prototype.html`.

**Rutas del frontend:** `/control-center`, `/arki-command-center`, `/arki-super-architect`. **Estas rutas no están demostradas como la pantalla 3D oficial.** Examinar código de componentes, escena y datos antes de decidir dónde montar la integración.

**Servidor histórico encendido (AV023):**
- Ruta: `/home/arki/ARKI/av023-arbol-vivo/`
- Servidor Node: `tools/maqueta-viva/arki-av023-historical-ui.cjs`
- URL: `http://127.0.0.1:8768/`
- **No confundir con el puerto 3000 (Gitea).** El 8768 sirve AV023 histórico, no AV036 ni el frontend definitivo.

### G.2 — Tres repositorios técnicos y tres ramas web prioritarias

**Repositorios (todos en `YvanCastilloQuezada`):**
1. `sicl-web` — UI, Árbol Vivo, propuestas, coordinación web.
2. `sicl-core` — Core Python, autoridad/capacidades, contratos y pruebas.
3. `arki-acs` — frente ACS/CAD e integración geométrica.

**Tres ramas web prioritarias (NO crear otras):**
1. `main` — verdad publicada del repositorio, requiere contrastar SHA.
2. `integration/arki-av035-main-20261015` — integración candidata donde aparece la plantilla seleccionada.
3. `experiment/arki-ideas-mapa-vivo-20261015` — módulos recuperados REC-001/002/003/006 y pruebas MO-04..MO-07.

**Ramas históricas auxiliares (fuentes a revisar, no destinos):**
`feat/arbol-vivo-precedencias-seguras-20261010`, `feat/arbol-vivo-functional-repair-20261014`, `feat/arki-autonomy-orchestrator-20261013`, `feat/arki-autonomy-memory-main-20261013`, `feat/arki-master-map-live-v1`, `feat/agk-001-operational-spine`, `feat/arki-frontend-assembly-v1`, `audit/mapa-arbol-gemelo-reconciliacion-20261014`, `feat/arki-operational-vitality-mo05-20261015`, `experiment/arki-ideas-web-20261015`.

**Inventario de ramas (22-oct):** 98 ramas incluyendo `main`. Auditoría PARCIAL: 58 ramas comparadas contra `main`, quedan 39 por comparar. **NO borrar ramas por antigüedad ni por nombre.** Conservar blobs, historia y procedencia.

### G.3 — Dónde buscar los archivos fundacionales

**Mapa Maestro (entrada canónica documental):**
- `docs/arki-master-map/ARKI_MASTER_MAP_LIVE.md`
- `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json` (observado `updated_at=2026-10-07`, puede estar desactualizado).

**Otros puntos de entrada:**
- `README.md`
- `docs/ARKI_FRONTEND_HANDOFF.md`
- `docs/ARKI_PROJECT_HANDOFF_2026-09-16.docx`
- `docs/arki-knowledge/`
- `docs/arki-predictive/R1_ARCHITECTURE_ENGINEERING_HANDOFF.md`
- `docs/arki-architecture/`
- `tools/maqueta-viva/ARBOL-GEMELO-DIGITAL.md`

**Fuentes fundacionales de arquitectura profesional (PO priorizó):**
- Francis D. K. Ching (Forma, espacio y orden).
- Edward T. White (conceptos de formas arquitectónicas y partido).
- `101 Things I Learned in Architecture School`.

Los PDF se compartieron en conversaciones anteriores; **no están certificados dentro de los repositorios**. Recuperarlos desde adjuntos/Library si están disponibles, registrar autor, procedencia, derechos y alcance. Someter su aprendizaje a curaduría Delta 6.2. **No fingir que ARKI ya asimiló su contenido.**

**Concepto crucial del PO:** partido arquitectónico no es «acomodar habitaciones»; debe traducir programa, restricciones, relaciones espaciales, estructura, forma, orden, jerarquías y creatividad arquitectónica a conocimiento ejecutable y comprobable.

### G.4 — Mapa de módulos existentes del Árbol Vivo

Buscar en `sicl-web/tools/maqueta-viva/` (especialmente checkout local `~/ARKI/av023-arbol-vivo`):

| Archivo | Rol probable o probado | Límite |
|---|---|---|
| `maqueta-viva.template.html` | UI seleccionada y vistas del Árbol | No equivale por sí sola a 3D nativo |
| `av-ui-001-readonly-prototype.html` | Referencia gráfica aislada | No es producto final |
| `arki-av023-historical-ui.cjs` | Servidor de la UI histórica | Read-only; no es AV036 |
| `arki-av020-tree.cjs` | Estructura del árbol | Inspeccionar contrato real |
| `arki-av002-precedence.cjs` | Referencias, precedencias, ciclos | Tests locales aprobados |
| `arki-av017-proposal.cjs` | Propuestas y decisión PO | No autoaprobación |
| `arki-twin-three-alternatives.cjs` | Tres alternativas | Hipótesis ≠ medición |
| `arki-arbol-vivo-auto.cjs` | Inventario/automatización | Asignación de fase NO autónoma |
| `arki-live-pulse.cjs` | Pulso/observación | No prueba ciclo completo |
| `arki-core-mapa-vivo-bridge.cjs` | Puente Core↔mapa | Inspeccionar ejecución real |
| `arki-map-adn-bridge.cjs` | Puente mapa↔ADN | Inspeccionar |
| `arki-autonomy-orchestrator.cjs` | Orquestación | Ubicar rama/versión y verificar |
| `arki-autonomy-memory.cjs` | Memoria | Verificar persistencia/reinicio |
| `arki-multiscale-design.test.cjs` | Pruebas de diseño multiescala | Pruebas ≠ aprendizaje autónomo |
| `arki-f1-source-audit.cjs` | Fuentes F1 | No certificar otras fases |

**Módulos experimentales posteriores** (`experiments/arki-ideas/` en `experiment/arki-ideas-mapa-vivo-20261015`):
- REC-001: coordinador de sistemas vivos.
- REC-002: aprendizaje relacional.
- REC-003: gemelo digital con tres alternativas hipotéticas.
- REC-006: pulso de solo lectura.

**Regla de recuperación:** comparar interfaces, dependencias y evidencia; extraer capacidades probadas, integrarlas en los puntos existentes, eliminar duplicación **una vez demostrado que nada se perdió**. No encadenar motores ni inventar una autoridad paralela.


### G.5 — Hoja de ruta ejecutable: darle vida SIN abrir ramas

**Principio:** reutilizar repositorios y ramas existentes; integrar sobre un baseline aprobado por el PO, sin cambios destructivos prematuros. Cada fase debe entregar funcionalidad integrada.

**Paso A — Reconocer la casa existente (una vez):**
1. Leer este `00-START.md` + `ARKI-00.md`.
2. Revisar `ARKI_MASTER_MAP_LIVE.md` y `ARKI_MASTER_MAP_STATE.json`.
3. Identificar SHAs actuales de `main`, `integration/arki-av035-main-20261015` y `experiment/arki-ideas-mapa-vivo-20261015`.
4. Encontrar la **pantalla elegida** en `maqueta-viva.template.html`, su montaje y los archivos de datos; verificar si la página 3D final existe y dónde está. **No inventarla.**
5. Confirmar qué proceso sirve el puerto 8768. **No usar 3000 sin identificar servidor.**
6. Confeccionar un mapa **archivo → función → evidencia → ubicación actual → destino de integración → duplicado a retirar**.

**Paso B — Reunir piezas sin perder ideas:**
1. Comparar archivos y commits de las tres ramas web prioritarias.
2. Recuperar documentos, código, tests, UI, evidencias y procedencia **antes** de borrar.
3. Consolidar inventario de ideas en una sola ubicación existente de GitHub.
4. Integrar en la interfaz aprobada, no en un clon.
5. Eliminar ramas **solo** cuando su contenido exclusivo esté conservado y el PO autorice.

**Paso C — Primer ciclo vital REAL:**

Elegir una carencia real y de bajo riesgo detectada por el propio Árbol. El ciclo debe ser:
1. **Autoinspección:** inventario real y estado de capacidades.
2. **Autodiagnóstico:** carencia priorizada, causa, dependencias, restricciones FROZEN.
3. **Diseño de alternativas:** exactamente tres opciones diferenciadas, con hipótesis explícitas.
4. **Experimento real:** con Core/AGK cuando requiera geometría. Si no hay AGK, **bloquear y reportar**, no simular métricas falsas.
5. **Comparación:** resultados medidos, procedencia, costos/beneficios, rechazos.
6. **Aprobación PO:** la UI aprobada muestra opciones y solicita autorización vinculada a ID y SHA.
7. **Aplicación:** cambios permitidos, acotados, idempotentes y reversibles.
8. **Propagación:** actualizar dependencias, fases, árbol, evidencias, ideas, FROZEN y mapa maestro.
9. **Persistencia:** reiniciar y recuperar exactamente estado, decisión y prueba.
10. **Rollback y reevaluación:** revertir ante fallo, comparar con baseline.

**Criterio de «ARKI vivo»:** este ciclo funciona sobre código integrado y una UI real, con autoridad humana, motor real cuando corresponda, evidencia verificable y persistencia/reversión. Un HTTP 200, 22/22 tests o tres alternativas hipotéticas **no bastan**.

**Paso D — Prueba de aceptación única:** capturar SHAs exactos, diff integrado, interacción en navegador ARKI real, solicitud PO, decisión, ejecución Core/AGK, evidencia y métricas, reinicio, reversión, estado del árbol. Probar errores adversariales. Si algo falla, corregir **la misma base** y repetir solo las pruebas afectadas.

**Paso E — Limpieza final:** podar ramas redundantes, conservar trazabilidad y actualizar `ARKI-00.md`, mapa maestro y catálogo. **«Meter, verificar, borrar»** es el flujo. No borrar para ocultar deuda.

### G.6 — Autoridad, seguridad y no-negociables

- **Un solo AGK**, OCCT+DELTA como arquitectura aprobada; geometría 3D-First.
- **FROZEN:** contratos inmutables salvo autorización expresa y procedimiento de migración.
- **PO** decide promociones y mutaciones canónicas; ninguna sugerencia de ARKI equivale a autorización.
- **Tres alternativas** por propuesta; nunca declarar resultados hipotéticos como medidos.
- **Procedencia:** baseline, input, unknowns, reasoning, reused/new knowledge, deficits, candidates, rejected, geometry mutations, relationships, topology, scenario results, dependency propagation, coverage, evidence, UNKNOWN y ruta de resolución.
- **Seguridad de fuentes externas:** MO06 deshabilitó transporte real pendiente de canal HTTPS seguro y fijación de destino; no reactivar red sin hardening, DNS/IP controls y pruebas.
- **CERO DEUDA:** no maquillar limitaciones como `PASS`, no FUTURE_TEST para cerrar bloqueos críticos.
- **No tocar repositorios/proyectos hermanos** sin pedido del PO.

### G.7 — Guion de arranque para el siguiente chat/agente

1. Leer **`00-START.md` entero** (secciones 1-15 + Anexos A-G) y `ARKI-00.md` para contexto histórico.
2. Responder al PO en una frase: «ARKI tiene el Árbol Vivo AV023 encendido, pero falta el ciclo autónomo integrado; voy a completarlo en la interfaz aprobada, sin crear ramas».
3. Abrir **`tools/maqueta-viva/maqueta-viva.template.html`** de la rama `integration/arki-av035-main-20261015` y localizar dónde se monta. Inspeccionar también el checkout `~/ARKI/av023-arbol-vivo`.
4. Abrir el Mapa Maestro y archivos fundacionales; buscar código actual de Web/Core/ACS y la escena 3D real.
5. Producir una matriz concreta **existente → falta → archivo destino → cambio**; hacer cambios reales en la base autorizada, sin bifurcar.
6. Conectar primero una vertical completa (autodetección → 3 alternativas → PO → Core/AGK → persistencia → árbol). **No entregar otro plan interminable.**
7. Validar interacción en la **página correcta**, corregir fallos sobre la misma base, registrar evidencia y estado.
8. Consolidar contenido exclusivo de ramas y podar solo lo preservado.
9. Actualizar este archivo y mapa maestro tras cada hito real.

**Regla final del PO:** «Quiero que ARKI tenga vida. No más ramas. No más vueltas. Meter lo útil en la interfaz que decidí y borrar lo que ya no sirve». La medida del éxito no es la cantidad de tests ni documentos, sino **una ejecución real, conectada, segura, verificable y persistente en el ARKI existente**.

### G.8 — Actualizaciones 2026-10-22 (auditoría de ramas y generador)

- **Copia de continuidad:** `ARKI-00.md` se copió desde `main` a la rama de MEMORY para que el handoff maestro esté disponible. Se conserva el contenido original y se añade esta actualización.
- **Informe de ramas:** `docs/arki-master-map/ARKI_SICL_WEB_BRANCH_AUDIT_20261022.md`. Estado PARCIAL: 58 ramas comparadas contra `main`; quedan 39 por comparar de un inventario de 98 ramas.
- **Catálogo:** `docs/arki-master-map/ARKI_SICL_WEB_BRANCH_CATALOG_20261021.md`. Inventario de cabezas, no validación técnica de cada rama.
- **Generador del Mapa Vivo localizado:** `tools/maqueta-viva/arki-continuity-snapshot.cjs`. Lee `docs/arki-master-map/ARKI_CONTINUITY_EVENTS.jsonl`, extrae historia Git y genera `docs/arki-master-map/ARKI_MAPA_VIVO_CONTINUIDAD.md`. **No verifica CI, arquitectura ni despliegue.**
- **Pruebas del generador:** `tools/maqueta-viva/arki-continuity-snapshot.test.cjs`; runner local `tools/maqueta-viva/arki-continuity-local-verify.cjs`. Workflow `.github/workflows/arki-continuity-map.yml`.
- **Límite:** el generador solo produce el Mapa Vivo de continuidad. **No genera `ARKI-00.md`, catálogo ni auditoría.**
- **Estado de ejecución:** código y pruebas inspeccionados estáticamente, **no ejecutados en checkout local**.
- **Sin alteración de ramas de producto:** no se creó ninguna rama, no se fusionó ni eliminó ninguna, no se cambió `main`.
- **Siguiente paso:** completar comparación de ramas restantes, revisar commits exclusivos y CI por SHA, comprobar el generador con `node --test tools/maqueta-viva/arki-continuity-snapshot.test.cjs` y `node tools/maqueta-viva/arki-continuity-snapshot.cjs --check`.
- **Rama AGK prioritaria para inspección:** `feat/agk-003-parametric-family-unification` (11 commits exclusivos). Es prioridad de revisión, **no aprobación para integrar**.
- **Corrección de inventario (segundo lote):** auditoría comparativa documenta **58 ramas de 97 candidatas distintas de `main`**; quedan **39 ramas** por comparar. El conteo anterior de 48/49 pendientes queda reemplazado.

### G.9 — Referencias históricas

- `ARKI-00.md` (original completo, 430 líneas, histórico).
- `docs/arki-master-map/ARKI_SICL_WEB_BRANCH_AUDIT_20261022.md`
- `docs/arki-master-map/ARKI_SICL_WEB_BRANCH_CATALOG_20261021.md`
- `docs/arki-master-map/ARKI_BRANCH_COMMIT_CATALOG_20261021.md`
- `.github/workflows/arki-continuity-map.yml`
- `tools/maqueta-viva/arki-continuity-snapshot.cjs`
- `tools/maqueta-viva/arki-continuity-snapshot.test.cjs`
- `tools/maqueta-viva/arki-continuity-local-verify.cjs`
- `tools/maqueta-viva/maqueta-viva.template.html` (UI aprobada)
- `tools/maqueta-viva/av-ui-001-readonly-prototype.html`
- `tools/maqueta-viva/arki-av023-historical-ui.cjs` (servidor histórico)
- https://github.com/YvanCastilloQuezada/sicl-web (repo oficial)
