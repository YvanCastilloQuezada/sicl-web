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


**Documentos de entrada canónicos adicionales (en `sicl-core/`):** `00_ARKI_EXPEDIENTE_MAESTRO.md` (índice navegable completo, 15 páginas, 10 niveles), `ARKI_HANDOFF.md` (handoff base documental), `DEMO_SCRIPT_V2.md` y `DEMO_SCRIPT_V3.md` (guiones reproducibles). Ver Anexos Q, R, S.

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
- canonical/sicl-core: HEAD 5dfd17a (main, limpio, con pypdf — commit del 27-oct-2026 que valida RFC-030)


## 11. REFERENCIAS CLAVE

- docs/ops/ARKI-LOCAL-STACK-AUTOSTART-20261027.md — Stack local
- docs/ops/ARKI-DELTA62-STATUS-20261027.md — Delta 6.2
- docs/ops/ARKI-F1-F10-PHASE-EVIDENCE-20261027.md — Evidencia de las 10 fases
- docs/ops/ARKI-4-PENDIENTES-CERRADOS-20261027.md — Cierre de los 4 pendientes
- docs/ops/ARKI-E2E-CANONICAL-REPLICATE-20261027.md — Cómo replicar E2E
- docs/arki-master-map/ARKI_MASTER_MAP_STATE.json — Estado de las fases
- docs/arki-master-map/ARKI_F1_F10_AUTOMATED_TEST_MACRO_ORDERS_V1.md — Macroórdenes
- scripts/run-arki-canonical-e2e-auto.sh — Script E2E automatizado
- `canonical/sicl-core/00_ARKI_EXPEDIENTE_MAESTRO.md` — Índice navegable completo (Anexo Q)
- `canonical/sicl-core/ARKI_HANDOFF.md` — Handoff base documental
- `canonical/sicl-core/DEMO_SCRIPT_V2.md` — Guión demo SICL v2.0 (Anexo R)
- `canonical/sicl-core/DEMO_SCRIPT_V3.md` — Guión demo Design Knowledge Agent (Anexo R)
- `SICL_HTTP_ADAPTER_CONTRACT.md` — Contrato HTTP del adaptador (Anexo S)
- `canonical/sicl-core/PHASE_4_5_ARCHITECTURE.md` — Diseño de fases 4-5 (Anexo S)


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
| Expediente Maestro | `canonical/sicl-core/00_ARKI_EXPEDIENTE_MAESTRO.md` (Anexo Q) |
| Guiones de demo | `canonical/sicl-core/DEMO_SCRIPT_V2.md` y `DEMO_SCRIPT_V3.md` (Anexo R) |
| Contrato HTTP adaptador | `SICL_HTTP_ADAPTER_CONTRACT.md` (Anexo S) |
| Arquitectura fases 4-5 | `canonical/sicl-core/PHASE_4_5_ARCHITECTURE.md` (Anexo S) |


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



---

# ANEXO H — Auditoría completa de capacidades reales de ARKI (2026-10-28)

**Estado:** Auditoría basada en código real de `sicl-core` y `sicl-web`. No en documentación. No en suposiciones.

**Metodología:** Se listaron todos los archivos Python (`sicl-core`) y TypeScript (`sicl-web`), se leyó la cabecera de cada módulo principal, se listaron los endpoints de API (FastAPI y tRPC), se listaron los tests, y se verificó el estado de `git log`.

**Conclusión general:** ARKI tiene **mucho más implementado de lo que su documentación sugiere**. Puede generar imágenes fotorrealistas, geometría conceptual, planos arquitectónicos, láminas, validar contra RNE, calcular costos, simular balance hídrico, ejecutar el embudo 16→4→1, federar ARKI-LUCA, interoperar con COMPAS, exportar IFC, y ejecutar APIs FastAPI + tRPC. **Lo que NO puede hacer es garantizar que la imagen generada sea evidencia geométrica** (es `AI_PROPOSED_VISUAL`, no evidencia).

---

## H.1 — `sicl-core`: el núcleo canónico (Python + FastAPI)

### Módulos implementados

| Módulo | Qué hace |
|---|---|
| `src/sicl/a002/` (authority, engine, gate, identity, model, persistence, policy, requirements) | Autoridad arquitectónica A-002, gobernanza, gates de decisión |
| `src/sicl/archi/` (creation_validation, identity, ifc_export, integrity, model, mutation, persistence, relationships, sufficiency, transaction) | Modelo arquitectónico canónico, mutaciones, export IFC, persistencia transaccional |
| `src/sicl/drawing/` (composer, projector, ifc_synthetic, drawing_rules, pdf_export, title_block, annotation, drawing_entities, http_api, paper) | **Generación de planos arquitectónicos** (plantas, techos, elevaciones, cortes), PDF, título de plano, anotaciones |
| `src/sicl/layout/` (layout_engine, case_study, collision, http_api, layout_report, margin_validator, sheet_format, sheet_grid, sheet_zone) | **Composición de láminas** (sheet layout), validación de márgenes, colisiones, formato de hoja |
| `src/sicl/dam/` (drawing_faculty, model) | **Drawing Faculty** — advisor + examiner para graduación de dibujo |
| `src/sicl/compliance/` (content_labeling, eu_ai_act, iso_42001) | Compliance EU AI Act + ISO 42001 |
| `src/sicl/design_knowledge.py`, `design_principles.py` | Conocimiento de diseño |
| `src/sicl/bim.py`, `bim_connectors.py` | Conectores BIM |
| `src/sicl/agents.py`, `actors.py` | Agentes y actores |
| `src/sicl/alternative.py`, `comparison.py` | Alternativas y comparación |
| `src/sicl/environmental.py` | Inteligencia ambiental (S7) |
| `src/sicl/multiscale.py` | Multiescala |
| `src/sicl/recommendation.py`, `capabilities.py`, `derivation.py` | Recomendación, capacidades, derivación |
| `src/sicl/developer_promotion.py` | Promoción de desarrollador |
| `src/sicl/v11.py`, `generation.py`, `site_intelligence.py`, `copilot.py` | V1.1, generación, inteligencia de sitio, copiloto |

### Endpoints FastAPI

| Endpoint | Qué hace |
|---|---|
| `/projects` (GET, POST, GET/:id, PUT/:id, DELETE/:id) | CRUD de proyectos |
| `/v1/health` | Healthcheck |
| `/v1/operations-research/methods` | Métodos de investigación operativa |
| `/v1/simulations/methods` | Métodos de simulación |
| `/v1/generations/methods` | Métodos de generación |
| `/v1/gis/catalogs` | Catálogos GIS |
| `/v1/projects/:id/gis/parcel-snapshots` (POST/GET) | Snapshots de parcela GIS |
| `/v1/projects/:id/gis/ogc-query` (POST) | Consulta OGC |
| `/v1/copilot/translate` (POST) | Traducción con copiloto |

### Tests (20+ archivos)

`test_feasibility.py`, `test_multiscale_wall_move_e2e.py`, `test_institutional_memory.py`, `test_agents_debate.py`, `test_monte_carlo.py`, `test_environmental_s7.py`, `test_d22_atomicity.py`, `test_archi_identity.py`, `test_optimization_phase5.py`, `test_schemas_developer.py`, `test_archi_mutation.py`, `test_simulation.py`, `test_contracts_pilar_viii.py`, `test_h005_fail_closed.py`, `test_design_intelligence.py`, `test_rfc028_029.py`, `test_ifc_import_http.py`, `test_archi_model.py`, `test_h005_contract_registry.py`, `test_rfc030_content.py`.

### Dependencias

---

## H.2 — `sicl-web`: la interfaz (TypeScript + React + tRPC)

### Módulos del servidor

| Módulo | Qué hace |
|---|---|
| `server/arkiVisualIntelligence.ts` | **Generación visual fotorrealista** (HD, 2K, FULL_HD, 4K, 8K, 16K) |
| `server/arkiDynamicFamilies.ts` | Familias dinámicas de edificios (salud, educación, comercio, deporte, oficinas, residencial, industria, transporte, cultura, hospitalidad, culto, paisaje) |
| `server/arkiSuperArchitectModel.ts` | Modelo paramétrico del superarquitecto (6 familias) |
| `server/arkiTypologyLibrary.ts` | 60+ tipologías arquitectónicas |
| `server/arkiTypologyExecution.ts` | Ejecución de tipologías |
| `server/arkiTypologyDsl.ts` | DSL declarativo para tipologías |
| `server/arkiCostBudgetS2.ts` | Presupuesto de costos S2 |
| `server/arkiDesignFunnel.ts` | Embudo de diseño 16→4→1 |
| `server/arkiNormativeEngine.ts` | Motor normativo RNE Perú (50+ reglas) |
| `server/arkiNormativeSources.ts` | Fuentes normativas |
| `server/arkiWaterBalance.ts` | Balance hídrico |
| `server/arkiProjectState.ts` | Estado del proyecto |
| `server/arkiSpatialSemantics.ts` | Semántica espacial |
| `server/arkiKnowledgeCorpusFoundation.ts` | Corpus de conocimiento |
| `server/arkiSpecializedGeometry.ts` | Geometría especializada (hospital, aeropuerto, estadio, etc.) |
| `server/arkiNativeGenerator.ts` | Generador nativo (plantillas) |
| `server/arkiGenerativeAssistant.ts` | Asistente generativo |
| `server/arkiFamilyComparison.ts` | Comparación de familias (export IFC/GeoJSON/SVG/CSV/HTML) |
| `server/arkiAdvancedRenderCapabilities.ts` | Capacidades de render avanzado |
| `server/arkiExecutionGovernance.ts` | Gobernanza de ejecución |
| `server/arkiCommandCenterMap.ts` | Mapa del Command Center |
| `server/arkiDeviceInteroperability.ts` | Interoperabilidad de dispositivos |
| `server/arkiDisplayLanguage.ts` | 8 idiomas |
| `server/arkiDeveloperProposal.ts` + test | Propuestas del desarrollador |
| `server/arkiLucaSecurityFederation.ts` | Federación ARKI-LUCA |
| `server/arkiMarketplaceGovernance.ts` | Marketplace |
| `server/arkiTvFrozenContract.ts` | ARKI-TV (frozen) |
| `server/arkiVerticalDecision.ts`, `arkiVerticalSystem.ts` | Decisiones verticales |
| `server/arkiAdvancedGeometry.ts` | Geometría avanzada |
| `server/arkiBimViewer.ts` | Visor BIM |
| `server/arkiArchitecturalDeveloper.ts` | Desarrollador arquitectónico |
| `server/agk/` (familyCompiler, regeneration, types) | AGK (Arkitechture Geometry Kernel) |
| `server/capabilityFabric/` (e2e001, defaultFabric, compasWorkerTransport, compasAdapter, etc.) | Capability Fabric con COMPAS |
| `server/spatialReasoning/` (core, smallOfficeVerticalSlice) | Razonamiento espacial |

### Endpoints tRPC (`server/routers.ts`)

| Endpoint | Qué hace |
|---|---|
| `federatedHandoffs` (list, create, review) | Handoffs federados AR-LU |
| `visualField` (analyze, ingest) | Análisis de campo visual (imágenes, OCR, documentos) |
| `spatialFieldBridge` (contract, openSession, observe) | Puente de campo espacial |
| `visualGeneration` (presets, generate) | **Generación visual fotorrealista** |
| `projectBrain` (analyze, executeCanonical) | Cerebro del proyecto |
| `superpowers` (run) | Superpoderes |
| `agents` (registry, orchestrate) | Agentes |
| `commercialApi` (contract, capabilities, register) | API comercial |
| `nativeAdapters` (registry) | Adaptadores nativos |
| `spatialAr` (catalog) | AR espacial |
| `architecture` (contract, layers, verticalProof) | Arquitectura |
| `costs` (contract, calculate) | Costos |

### Cliente React

- **Componentes:** `LocationPicker`, `SolarTemporalOverlay`, `IfcGeometryViewer`, `CanonicalOrthographicViewer`, `ProfessionalFamilyViewer`, `ProjectWorkspace`, `PhaseAPageLayout`, `GuidedShell`, `PwaInstallPrompt`, `OfflineSyncManager`, `ArkiRealityView`, `ArkiProfessionalBimShell`, `AIChatBox`, `CommandBar`, `ComparisonForm`, `EvaluationForm`, `EvidenceForm`, `FeasibilityPanel`, `GuidedCatalogPanel`, `ImagePanZoom`, `KnowledgeState`, `LanguageSelector`, `Map`, `SourceForm`, `AssemblyStatusPanel`, `ArkiFirstContact`, `HelpButton`, `SocialLoginOptions`, `ErrorBoundary`, `DashboardLayout`, `ManusDialog`, `Phase1Phase2Tools`, `rfc015-form-error-state`, `command-bar`, `spatialAuthority`, `CoreDataStates`, `CoreTableSkeleton`.
- **API:** `sicl-client.ts`, `visual-field.ts`, `mock-core.ts`.
- **Visualización:** `visualization/`, `paretoModel`.

### Tests

156 archivos de test (963 tests con COMPAS, 959 sin COMPAS).

---

## H.3 — Lo que ARKI **puede hacer hoy** (respuesta directa)

### ✅ Generar imágenes fotorrealistas

`server/arkiVisualIntelligence.ts` tiene:
- `VISUAL_PRESETS`: HD, 2K, FULL_HD, 4K, 8K, 16K.
- `generateArkiPhotorealisticVisual()`: genera imagen con prompt y preset.
- `visualGeneration.generate` (endpoint tRPC): acepta prompt, quality, purpose, language, referenceImageUrl, preserveGeometry.
- Propósitos: `EXTERIOR_RENDER`, `INTERIOR_RENDER`, `MATERIAL_STUDY`, `AR_OVERLAY`, `SITE_CONTEXT`.

**La imagen se marca como `AI_PROPOSED_VISUAL` (propuesta visual, no evidencia geométrica).**

### ✅ Generar geometría conceptual de edificios

- Familias dinámicas (12 categorías).
- Tipologías (60+).
- Superarquitecto (6 familias).
- Geometría especializada (hospital, aeropuerto, estadio, etc.).
- Comparación de familias (export IFC/GeoJSON/SVG/CSV/HTML).

### ✅ Generar planos arquitectónicos

`sicl-core/src/sicl/drawing/` → compositor de planos (plantas, techos, elevaciones, cortes). Export PDF. Título de plano. Anotaciones.

### ✅ Componer láminas

`sicl-core/src/sicl/layout/` → layout engine, márgenes, colisiones, formato de hoja.

### ✅ Validar contra RNE

`server/arkiNormativeEngine.ts` → 50+ reglas de referencia del RNE Perú.

### ✅ Calcular costos

`server/arkiCostBudgetS2.ts` → presupuesto de costos S2.

### ✅ Simular balance hídrico

`server/arkiWaterBalance.ts` → balance hídrico anual.

### ✅ Ejecutar el embudo de diseño

`server/arkiDesignFunnel.ts` → 16 → 4 → 1 con selección humana.

### ✅ Federar ARKI con LUCA

`server/arkiLucaSecurityFederation.ts`, `federatedAssistantDirector.ts`, `arluKnowledgeExchange.ts`, `arluPowerTransfer.ts`.

### ✅ Analizar campo visual

`server/visualField.ts`, `client/src/api/visual-field.ts` → análisis de imágenes, OCR, documentos.

### ✅ Interoperar con COMPAS

`server/capabilityFabric/` → COMPAS 2.15.0 (geometría 3D).

### ✅ Exportar IFC

`sicl-core/src/sicl/archi/ifc_export.py`, `server/arkiFamilyComparison.ts` (`exportDynamicBuilding(building, "IFC4")`).

### ✅ Ejecutar API FastAPI

10+ endpoints en `sicl-core/api/routes/`.

### ✅ Ejecutar API tRPC

12+ routers en `sicl-web/server/routers.ts`.

---

## H.4 — Lo que ARKI **NO puede hacer** (gaps reales)

| Limitación | Por qué |
|---|---|
| Generar 120 pisos de geometría paramétrica | El máximo es 80 pisos en `arkiDynamicFamilies.ts` y `arkiSuperArchitectModel.ts`. **La imagen sí puede mostrar 120 pisos.** |
| Generar 32 torres gemelas en geometría | El código genera **un edificio a la vez**. No hay concepto de "torres múltiples". **La imagen sí puede mostrarlas.** |
| Garantizar la resolución exacta de la imagen | `providerResolutionVerified: false` hasta que se verifique. |
| Garantizar que la imagen sea evidencia geométrica | La imagen es `AI_PROPOSED_VISUAL`, no evidencia. |

---

## H.5 — Cómo generar la imagen de un rascacielos de 120 pisos con 32 torres gemelas en un desierto

**Prompt:** "rascacielos de 120 pisos de 32 torres gemelas en un desierto rodeado de agua y árboles y parques"

**Cómo se hace:**
1. Estar logueado (el endpoint `visualGeneration.generate` es `protectedProcedure`).
2. Llamar a `visualGeneration.generate` con:
   - `projectId`: un ID de proyecto existente.
   - `prompt`: "rascacielos de 120 pisos de 32 torres gemelas en un desierto rodeado de agua y árboles y parques".
   - `quality`: "4K" (3840 × 2160) o "FULL_HD" (1920 × 1080).
   - `purpose`: "EXTERIOR_RENDER".
   - `language`: "es" (o el idioma que prefieras).
   - `preserveGeometry`: true (si hay una referencia geométrica).
3. El proveedor de imágenes (vía `generateImage()` de `server/_core/imageGeneration`) genera la imagen.
4. La imagen se marca como `AI_PROPOSED_VISUAL`, `providerResolutionVerified: false`, `humanReviewRequired: true`.

**La imagen NO es evidencia geométrica.** Es una propuesta visual para revisión humana.

---

## H.6 — Resumen ejecutivo

**ARKI tiene mucho más implementado de lo que su documentación sugiere.** Puede generar imágenes fotorrealistas, geometría conceptual, planos arquitectónicos, láminas, validar contra RNE, calcular costos, simular balance hídrico, ejecutar el embudo 16→4→1, federar ARKI-LUCA, interoperar con COMPAS, exportar IFC, y ejecutar APIs FastAPI + tRPC.

**Lo que NO puede hacer es garantizar que la imagen generada sea evidencia geométrica.** Es `AI_PROPOSED_VISUAL`, no evidencia.

**Para generar la imagen de un rascacielos de 120 pisos con 32 torres gemelas en un desierto, se usa `visualGeneration.generate` con `quality: "4K"`, `purpose: "EXTERIOR_RENDER"`, y el prompt.** La imagen se marca como propuesta visual para revisión humana.

**End of audit — Anexo H.**

---

# ANEXO I — CONSTITUCIÓN, CUERPO Y EVIDENCIA DE ARKI

**Origen:** Consolidación de 7 documentos canónicos de `docs/_CANONICAL_TRUTH_FOR_00_START/` (2026-10-28).
**Regla epistémica:** `CLAIM != DESIGN != IMPLEMENTED != EXECUTED != OBSERVED != VERIFIED != FROZEN`.

## I.1 — Fundamentos (ARKI y SICL)

- **ARKI** = Sistema de Inteligencia de Diseño Espacial Multiescala. Apoyo a la deliberación, **no sustituye** al arquitecto ni a la autoridad profesional.
- **SICL** = Spatial Intelligence Command Language. Lenguaje formal del Core.
- **Invariantes:** `Recommendation ≠ Decision`. `Decision` requiere `HumanReview` + actor + authority. Auditoría append-only. Frontend NO crea verdad, solo interactúa.
- **Flujo constitucional:** `Project → Preference → Recommendation → HumanReview → Decision → Audit`.

## I.2 — Mapa Maestro Vivo (`ARKI_MASTER_MAP_LIVE.md`)

- **32 dominios funcionales** (de intención a mantenimiento predictivo).
- **6 autoridades:** D-2 (semántica), Core (estado), AGK (geometría), Capability Fabric (ejecución externa), ACS (laboratorio), Humano (decisión final).
- **10 escalas:** pais → macro_region → region → provincia_metropoli → distrito_ciudad → zona_barrio_sector → parcela_sitio → edificacion → sistema → espacio → objeto.
- **Ciclo de vida:** `PERCEIVE → UNDERSTAND → PROJECT STATE → REASON → N→16→4→1 → HUMAN VALIDATION → GEOMETRY → BIM → CONSTRUCTION → OPERATE → LEARN → REPEAT`.

## I.3 — Evidencia AGK/OCCT (`AGK_OCCT_EXECUTION_EVIDENCE_V1.md`)

- **OCCT 8.0.1 es un BASE EJECUTADO** (no solo diseñado).
- **PASS:** Instalación, G0/G1/G2 canary, Advanced canary (16/16), Torture T1 (22/22), T3 (12 tests, 11 PASS, 1 FAIL controlado).
- **AGK-DELTA-001 (Local Engineering Frame):** Las operaciones BRep canónicas deben hacerse en un marco local, nunca en coordenadas GIS globales.
- **AGK-DELTA-002 (Geometric Acceptance Contract):** `IsDone()==true` NO es suficiente. Requiere validación de invariantes geométricos y topológicos.

## I.4 — Handoff Canónico Base (`ARKI_CANONICAL_HANDOFF_2026-10-05.md`)

- **Linaje:** SICL → Vitruvio → ARKI/ARQUI (mismo proyecto).
- **Corporación:** AR-LU Corporation.
- **Delta 6.2 (KR 6.2):** 4,118 filas consolidadas, 947 canonicalized, 458 UNKNOWN. Pipeline: `source → candidate → provenance → Delta 6.2 → Core → examination → transfer → competency`.
- **Doctrina:** OWN CAPABILITY FIRST. EXTERNAL ENGINE WHEN NECESSARY.

## I.5 — Decisión del Producto (`SICL_65_PRODUCT_DECISION.md`)

- **Roles:** PO (visión), Chief Architect (semántica/contratos), Implementation Engineer (código/pruebas).
- **Capability Gate Ledger:** `PROPOSAL → CONTRACT → AUTHORIZED → IMPLEMENTED → VERIFIED → AUDITED → RELEASED`.
- **PO-016 (RFC-023):** Aprobado. Proxy same-origin, sin fallback silencioso, `SICL_CORE_URL` obligatorio.

## I.6 — Protocolo Visual Fotorrealista (`ARKI_PHOTOREALISTIC_VISUAL_AND_EVIDENCE_PROTOCOL.md`)

- **Presets:** HD (1280x720), 2K, FULL_HD, 4K.
- **Controles:** `AI_PROPOSED_VISUAL`, `providerResolutionVerified: false`, `humanReviewRequired: true`.
- **Super Eyes:** Evidencia `VISIBLE_IN_IMAGE`, `LEGIBLE_TEXT`, `MEASURED_METADATA`, `NOT_OBSERVED`. Lo no soportado es `UNKNOWN`.

---

# ANEXO J — FASES, INVENTARIOS, SUPERPODERES Y AUTONOMÍA

**Origen:** Consolidación de 13 documentos de `docs/_CANONICAL_TRUTH_FOR_00_START/`.

## J.1 — Fases D6.1 a D6.4 (El Delta)

- **D6.1 (Persistencia):** PASS. Round-trip local de 30 records. 9 facts promovidos. 4 UNKNOWN. El "Restaurant Gate" quedó BLOCKED (no hay runtime honesto).
- **D6.2-M (Reasoning → Topología):** PASS. Cadena ejecutable: `Requirements → UNKNOWN → Strategies → Realizations → Topology`. No genera geometría.
- **D6.3-G (Topología → Geometría):** PASS. Genera Candidatos A/B (SVG) con mutaciones y validación. Sin ganador automático.
- **D6.4 (Ingesta Multimodal):** PASS local. Cámara/PDF → OCR (pdftotext/tesseract) → `AI_PROPOSED`. Revisión humana obligatoria.

## J.2 — Superpoderes (SP-01 a SP-05)

Implementados en `server/arkiSuperpowersPack.ts`:
1. **SP-01 Consequence Radar:** Clasifica consecuencias (DIRECT, SECONDARY, etc.).
2. **SP-02 Value of Information:** Prioriza UNKNOWNs por impacto.
3. **SP-03 Design Divergence:** Compara alternativas (no decide).
4. **SP-04 Architectural Debt:** Registra pasivos futuros.
5. **SP-05 Counterfactual Explorer:** Genera 8 escenarios `AI_PROPOSED`.

## J.3 — Agentes (ARKI Agent Registry 1.0)

- **12 agentes implementados/probados:** BRIEF, PARTI, REGULATION, COST, CONSEQUENCE, VOI, DIVERGENCE, DEBT, COUNTERFACTUAL, RED-TEAM, CONTRADICTION, TRANSFER.
- **Estado:** `EXECUTABLE_WITH_BOUNDS`. `COORDINATED_AGENT_CONTRACTS_NOT_DEMONSTRATED` (no es multi-agente autónomo real).

## J.4 — Autonomía (Escala L0-L10)

| Nivel | Estado |
|---|---|
| L6 (Genera candidatos) | `PARTIAL/DEMONSTRATED` |
| L7 (Genera geometría acotada) | `DEMONSTRATED_PARTIAL` |
| L8 (Reevaluación autónoma) | `NOT_DEMONSTRATED` |
| L9 (Comparación autónoma) | `NOT_DEMONSTRATED` |
| L10 (Generalización) | `NOT_DEMONSTRATED` |

**Conclusión:** ARKI NO es un superarquitecto autónomo. Es un sistema local acotado con humanos en el medio.

## J.5 — Capacidades Latentes (Composites)

Existen componentes, pero no el producto compuesto:
- **ARKI-BOOK adaptativo:** Componentes sí, falta curriculum/learner state. (CONNECT/EXTEND)
- **ARKI-CONSTRUCT / ARKI-BUILDING:** Componentes sí, falta as-built/telemetría. (EXTEND/RESEARCH)
- **CORPORATE ARKI (SaaS):** Falta tenancy/billing/CRM/legal. (BUILD)
- **SPECIALISTS (BIM/MEP/Structural):** Falta modelo disciplinar. (BUILD/RESEARCH)

## J.6 — Qué sabe y qué no sabe ARKI HOY (Post-513)

- **Sabe:** Aplicar invariantes M0-K, ejecutar reasoning acotado, generar topología/geometría conceptual, hacer OCR/ingesta, visualizar SVG/massing.
- **NO sabe:** Aprendizaje autónomo, generalización, coordinación BIM/MEP, normativa vigente, survey/GIS, costos contractuales, tutoría adaptativa, profesionalización.
- **Tipologías:** 27 mencionadas, 8 con fixtures, 6 con reasoning, 2 con geometría, **0 con evidencia profesional**.

## J.7 — Roadmap de 10 Fases (F1-F10)

| Fase | Propósito | Estado (declarado) |
|---|---|---|
| F1 | Identidad y Project State | RECONCILIATION_REQUIRED |
| F2 | Conocimiento y Universidad | RECONCILIATION_REQUIRED |
| F3 | Inteligencia Arquitectónica | RECONCILIATION_REQUIRED |
| F4 | Partido y Topología | RECONCILIATION_REQUIRED |
| F5 | Evaluación y Embudo | RECONCILIATION_REQUIRED |
| **F6** | **AGK / Geometría 3D** | **IN_PROGRESS** |
| F7 | Desarrollo Técnico | FUTURE |
| F8 | Expediente Técnico | FUTURE |
| F9 | Construcción y Gemelo Digital | FUTURE |
| F10 | Operación y Aprendizaje | FUTURE |

**Estado real:** F6 en progreso (OCCT ejecutado, DELTA-005 pendiente). F1-F5 requieren reconciliación con código/SHA. F7-F10 son futuro.

**End of Anexos I y J — 2026-10-28.**

---

# ANEXO K — GOBERNANZA UI (`docs/_UI_GOVERNANCE_ARCHIVE/`, 211 archivos)

**Estado global:** `UI_INTEGRITY_BASELINE_PARTIAL` — auditoría cerrada, **sin reparaciones ejecutadas**.
**Fuente:** 3 iteraciones A0 (auditoría), A0-V (visual 3002), A0.R2 (visual 4001), A0.R3 (forense final).

## K.1 — A0: auditoría de gobernanza (25 .md + 2 .zip + 1 .json)

| Archivo | Propósito | Estado |
|---|---|---|
| `01_SCOPE_AND_BASELINE.md` | Baseline 2026-09-24: 38 rutas, 1336 controles. | `SOURCE_VERIFIED` |
| `02_AUDIT_PROTOCOL.md` | Política conservadora: 5 niveles de evidencia. | `PROTOCOL` |
| `03_ROUTE_MAP.md` | 38 rutas declaradas en `client/src/App.tsx`. | `SOURCE_VERIFIED` |
| `04_SURFACE_INVENTORY.md` | 1336 controles, 797 de alto riesgo. | `INVENTORY` |
| `05_UI_ACTION_MATRIX.md` (432 KB) | Matriz de 1336 controles. | `UNKNOWN_UNVERIFIED` |
| `06_UI_ACTION_REGISTRY.json` (3.9 MB) | Registro JSON de controles. | `SOURCE_VERIFIED` |
| `07_SUCCESS_STATE_REGISTER.md` | No se canonizó ningún mensaje de éxito. | `POLICY` |
| `08_UNKNOWN_UNVERIFIED_REGISTER.md` | 1336/1336 clasificados `UNKNOWN_UNVERIFIED`. | `CLASSIFICATION` |
| `09_HIGH_RISK_CONTROL_REGISTER.md` | 797 candidatos de alto riesgo. | `CANDIDATES` |
| `10_ROUTE_RUNTIME_COVERAGE.md` | 38 rutas, 0 con sweep completo. | `PENDING` |
| `11_RUNTIME_TEST_PLAN.md` | Plan de barrido runtime. | `PLAN` |
| `12_RUNTIME_TEST_LOG.md` | No se ejecutó sweep. 434 tests PASS, build PASS. | `PARTIAL` |
| `13_PERSISTENCE_IMPACT_MATRIX.md` | Matriz de impacto de persistencia. | `MATRIX` |
| `14_AUTHORITY_AND_GATE_MATRIX.md` | Matriz de autoridad y gates. | `MATRIX` |
| `15_DEFECT_SEVERITY_REGISTER.md` | Severidades P0-P3. | `REGISTER` |
| `16_SECURITY_REVIEW.md` | Revisión de seguridad de interfaz. | `REVIEW` |
| `17_I18N_A11Y_REVIEW.md` | i18n y accesibilidad. | `REVIEW` |
| `18_EXPORT_DOWNLOAD_REVIEW.md` | Exportaciones y descargas. | `REVIEW` |
| `19_PLACEHOLDER_STUB_REVIEW.md` | Placeholders, mocks, stubs. | `REVIEW` |
| `20_ROOT_CAUSE_AND_BLOCKERS.md` | Causas raíz. | `ANALYSIS` |
| `21_REPRODUCTION_RUNBOOK.md` | Runbook reproducible. | `RUNBOOK` |
| `22_ACCEPTANCE_CHECKLIST.md` | Checklist de aceptación. | `CHECKLIST` |
| `23_EVIDENCE_MANIFEST.sha256.md` | Manifiesto SHA-256. | `INTEGRITY` |
| `24_A0_EXECUTIVE_REPORT.md` | **Veredicto: `PARTIAL / EVIDENCE_INSUFFICIENT`**. | `FINAL` |
| `A0R1_R2_A0V_RUNTIME_RECONCILIATION.md` | Reconciliación R2 ↔ A0-V. | `DIAGNOSTIC` |
| `ARKI_CURRENT_PRODUCT_MAP.md` | Mapa de producto A0.R3. | `PRODUCT_MAP` |
| `A0.zip` / `ARKI_UI_GOVERNANCE_001_A0_EVIDENCE.zip` | ZIP de evidencia. | `ARCHIVE` |
| `UI_SCREEN_REGISTRY_R2.json` | Registro JSON de pantallas. | `INTEGRITY` |
| `evidence/screens/` (3 .webp) | Capturas A0-V. | `EVIDENCE` |

## K.2 — PO_VISUAL_REVIEW (A0-V, 3002 dev runtime, 5 .md + 1 .pdf + 3 .webp)

| Archivo | Propósito | Estado |
|---|---|---|
| `00_VISUAL_INDEX.md` | 4 capturas, 34 rutas no capturadas. | `PARTIAL` |
| `ARKI_UI_VISUAL_ATLAS.md` | Bootstrap bloqueado. | `PARTIAL` |
| `UI_VISUAL_REVIEW_MATRIX.md` | 4 pantallas, 34 no capturadas. | `PARTIAL` |
| `UI_SCREEN_REGISTRY.json` | Registro JSON. | `INTEGRITY` |
| `ARKI_UI_VISUAL_CONTACT_SHEET.pdf` | PDF de contacto. | `EVIDENCE` |
| `screens/` (3 .webp) | Capturas. | `EVIDENCE` |

## K.3 — PO_VISUAL_REVIEW_FINAL (A0.R3, 4001 prod runtime, 14 .md + 2 .json + 110 .webp)

| Archivo | Propósito | Estado |
|---|---|---|
| `00_PRODUCT_VISUAL_INDEX.md` | Cierre forense de A0.R2. 110 capturas. | `FINAL` |
| `01_ROUTE_ACCOUNTING_38_OF_38.md` | 38/38 rutas contabilizadas. | `ACCOUNTING` |
| `02_ARKI_COMPLETE_VISUAL_ATLAS.md` | Atlas completo. | `ATLAS` |
| `03_SCREEN_REVIEW_MATRIX.md` | Matriz de revisión. | `MATRIX` |
| `04_SCREEN_REGISTRY.json` | Registro JSON. | `INTEGRITY` |
| `05_CONTROL_NORMALIZATION.md` | 1336 ocurrencias, 615 definiciones. | `NORMALIZATION` |
| `06_BLOCKED_ROUTE_CAUSAL_CLUSTERS.md` | 5 clusters (A-E). | `CAUSAL` |
| `07_APP_TSX_DIAGNOSTIC.md` | Sin conflictos. `pnpm check` PASS. | `DIAGNOSTIC` |
| `08_TYPESCRIPT_BASELINE.md` | `TYPECHECK_EXIT=0`. | `BASELINE` |
| `09_BUILD_RUNTIME_BASELINE.md` | Build PASS con warnings. | `BASELINE` |
| `10_VISUAL_ISSUES_REGISTER.md` | 6 issues. | `ISSUES` |
| `11_SCREEN_DISPOSITION_PROPOSALS.md` | KEEP para renderizadas. | `PROPOSAL` |
| `12_REPAIR_PROGRAM_PROPOSAL.md` | Propuesta futura, no ejecutada. | `PROPOSAL` |
| `A0R3_EVIDENCE_MANIFEST.sha256.md` | Manifiesto. | `INTEGRITY` |
| `A0R3_FINAL_VERDICT.md` | **`UI_INTEGRITY_BASELINE_PARTIAL`**. | `FINAL` |
| `repo-baseline.txt` | Baseline de repo. | `BASELINE` |
| `screens/` (110 .webp) | Capturas 4001. | `EVIDENCE` |

## K.4 — R2 (A0.R2, 4001 prod runtime, 6 .md + 108 .webp)

| Archivo | Propósito | Estado |
|---|---|---|
| `A0_R2_FINAL_REPORT.md` | 15 rutas renderizadas, 20 bloqueadas. | `FINAL` |
| `A0_STANDARD_RUNTIME_RUNBOOK.md` | Runbook 4001. | `RUNBOOK` |
| `ARKI_UI_VISUAL_ATLAS_R2.md` | Atlas R2. | `ATLAS` |
| `SCREEN_CONTROL_GRAPH_R2.md` | Grafo pantalla-control. | `GRAPH` |
| `UI_VISUAL_REVIEW_MATRIX_R2.md` | Matriz R2. | `MATRIX` |
| `A0R2_EVIDENCE_MANIFEST.sha256.md` | Manifiesto. | `INTEGRITY` |
| `screens/` (108 .webp) | Capturas. | `EVIDENCE` |

## K.5 — Estado real consolidado

- **38 rutas** declaradas y contabilizadas.
- **1336 controles** inventariados.
- **0 controles** clasificados como `FUNCTIONAL` con evidencia completa.
- **15 rutas** renderizadas en runtime 4001 (A0.R2).
- **20 rutas** bloqueadas por lazy-loading, Core o auth.
- **110 capturas** preservadas byte-for-byte.
- **Ninguna reparación ejecutada**. `A0.R3_FINAL_VERDICT = CLOSED — AUDIT ONLY — STOP`.

**Regla:** esta gobernanza es una línea base de integridad. No afirma funcionalidad. Para el estado vigente, ver `00-START.md §10`.

---

# ANEXO L — INVESTIGACIÓN (`docs/_RESEARCH_ARCHIVE/`, 52 archivos)

**Estado global:** `READY_FOR_HUMAN_REVIEW` / `CANDIDATE_KNOWLEDGE` / `NOT_CANONIZED`. Ninguna capacidad implementada.

## L.1 — `curriculum/` (23 archivos)

| Archivo | Tema | Estado |
|---|---|---|
| `ARKI_CURRICULUM_BATCH_A_COMPARISON_2026-09-21.md` | Urbanismo, planificación, BIM, alfarería. | `READY_FOR_HUMAN_REVIEW` |
| `ARKI_CURRICULUM_BATCH_B_COMPARISON_2026-09-21.md` | Ingenierías (civil, eléctrica, mecánica, sanitaria, estructural, puentes). | `READY_FOR_HUMAN_REVIEW` |
| `ARKI_MASTER_CURRICULUM_AND_LIBRARY_PLAN_2026-09-21.md` (61 KB) | Plan maestro consolidado. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-advanced-artificial-intelligence-2026-09-21.md` | IA. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-advanced-causal-models-2026-09-21.md` | Modelos causales. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-advanced-computational-models-2026-09-21.md` | Modelos computacionales. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-advanced-deterministic-models-2026-09-21.md` | Modelos determinísticos. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-advanced-mathematical-models-2026-09-21.md` | Modelos matemáticos. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-advanced-mechanics-quantum-2026-09-21.md` | Mecánica cuántica. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-advanced-operations-research-2026-09-21.md` | Investigación de operaciones. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-advanced-physics-quantum-2026-09-21.md` | Física cuántica. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-advanced-software-engineering-2026-09-21.md` | Ingeniería de software. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-advanced-white-hat-security-2026-09-21.md` | White hat. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-architecture-2026-09-21.md` | Arquitectura. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-civil-2026-09-21.md` | Ingeniería civil. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-electrical-2026-09-21.md` | Ingeniería eléctrica. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-landscape-2026-09-21.md` | Arquitectura paisajista. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-sanitary-2026-09-21.md` | Ingeniería sanitaria. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-structural-2026-09-21.md` | Ingeniería estructural. | `READY_FOR_HUMAN_REVIEW` |
| `curriculum-urbanism-2026-09-21.md` | Urbanismo. | `READY_FOR_HUMAN_REVIEW` |
| `ARKI_MASTER_LEARNING_COVERAGE_2026-09-21.md` | Cobertura de aprendizaje. | `ALL_REGISTERED_TOPICS_COVERED` |
| `ARKI_MASTER_CURRICULUM_5000.json` (6.5 MB) | 5000 temas (25 familias × 20 capacidades × 10 contextos). | `STRUCTURED` |
| `ARKI_CURRICULUM_INCREMENTAL_REGISTRY.json` | Registro incremental. | `REGISTRY` |

## L.2 — `workflows/` (5 archivos)

| Archivo | Tema | Estado |
|---|---|---|
| `workflow-bim-official.md` (58 KB) | Marco oficial BIM Perú. | `REFERENCE` |
| `workflow-costs.md` (29 KB) | Fuentes peruanas de costos. | `REFERENCE` |
| `workflow-education.md` (62 KB) | Expediente técnico de colegio. | `REFERENCE` |
| `workflow-hospital.md` (32 KB) | Expediente técnico de hospital. | `REFERENCE` |
| `workflow-transport.md` (26 KB) | Expediente técnico de transporte. | `REFERENCE` |

## L.3 — `research-specialties/` (24 archivos + 5 no-.md)

| Archivo | Tema | Estado |
|---|---|---|
| `ARKI_ADVANCED_CYCLES_MASTER_2026-09-21.md` | Informe maestro de ciclos. | `NOT_CANONIZED` |
| `ARKI_BIM_ETI_COSTS_IMPLEMENTATION_2026-09-21.md` | BIM, ETI, costos. | `CANDIDATE` |
| `ARKI_BIM_VISOR_AND_INTERFERENCES_2026-09-21.md` | Visor BIM. | `CANDIDATE` |
| `ARKI_IFC4_HOSTS_SELF_CARE_2026-09-21.md` | IFC4, round-trip. | `CANDIDATE` |
| `ARKI_INTERNET_LEASE_AND_ARCHIVE_POLICY_2026-09-21.md` | Política de acceso web. | `IMPLEMENTED_LOCALLY` |
| `ARKI_LONGEVITY_RESEARCH_PROPOSAL.md` | I-24, longevidad. | `AI_PROPOSED` |
| `ARKI_MASTER_LEARNING_COVERAGE_2026-09-21.md` | Cobertura. | `ALL_COVERED` |
| `ARKI_PERU_BIM_RNE_CONTRATACION_EXPEDIENTES_2026-09-21.md` | Normativa peruana. | `CANDIDATE` |
| `ARKI_REPRESENTACION_BIOCLIMA_PAISAJE_2026-09-21.md` | Representación, bioclima. | `CANDIDATE` |
| `ARKI_TRANSVERSAL_PREDIMENSIONING_IFC_2026-09-21.md` | Predimensionamiento. | `CANDIDATE` |
| `ARKI_TRANSVERSAL_SPECIALTIES_CURRICULUM_2026-09-21.md` | Matriz transversal. | `CANDIDATE` |
| `ARKI_TRIAD_AND_MASTER_CURRICULUM_INTEGRATION.md` | Triada. | `INTEGRATED` |
| `ARKI_UNIVERSITY_TO_MOTOR_ALIGNMENT.md` | Universidad → motores. | `IMPLEMENTED_CONTRACT` |
| `ARKI_VIVIENDA_MODERNA_MATERIALES_2026-09-21.md` | Vivienda. | `CANDIDATE` |
| `ARKI_WEB_RESEARCH_SUPERPOWER.md` | Investigación web. | `IMPLEMENTED` |
| `research-bim-delivery.md` (31 KB) | BIM, Revit, Dynamo. | `REFERENCE` |
| `research-civil-structure.md` (33 KB) | Estructuras. | `REFERENCE` |
| `research-environment-traffic.md` (32 KB) | SOMA, ambiente. | `REFERENCE` |
| `research-life-safety.md` (28 KB) | Seguridad. | `REFERENCE` |
| `research-mep-medical.md` (30 KB) | MEP hospitalaria. | `REFERENCE` |
| 3 `.json` + 2 `.txt` + 1 `.xlsx` | Staging, config, listas. | `MIXED` |

**Regla:** esta investigación es `CANDIDATE_KNOWLEDGE`. **No es conocimiento ingerido**. Para que una capacidad se considere implementada, requiere código + tests + evidencia de ejecución. Ver Anexos I/J.

---

# ANEXO M — EVIDENCIA (`docs/_EVIDENCE_ARCHIVE/`, 76 archivos)

**Estado global:** evidencia real ejecutada. 15 ataques BREAK, 3 exámenes ciegos, 1 especificación DG-01, 1 paquete de preservación AGK.

## M.1 — `break-001/` (32 archivos)

| Archivo | Propósito | Resultado |
|---|---|---|
| `ARKI_BREAK_001_FINAL_REPORT.md` | Resumen de 15 ataques. | **2 RESISTS, 8 DEGRADES, 0 FAILS, 5 KNOWS_IT_DOES_NOT_KNOW, 0 FABRICATES.** |
| `ARKI_BREAK_B01_REPORT.md` | Incomplete brief attack. | Input sufficiency → ASK_HUMAN. |
| `ARKI_BREAK_B02_REPORT.md` | Contradictory brief. | No contradiction detector. |
| `ARKI_BREAK_B03_REPORT.md` | Unknown typology. | 3 partis, no typology transfer. |
| `ARKI_BREAK_B04_REPORT.md` | Difficult site. | Site facts preserved, no geometry. |
| `ARKI_BREAK_B05_REPORT.md` | Capacity/area attack. | Capacity preserved, no solver. |
| `ARKI_BREAK_B06_REPORT.md` | Flow collision. | Separation recorded, no graph. |
| `ARKI_BREAK_B07_REPORT.md` | Late change. | No propagation ledger. |
| `ARKI_BREAK_B08_REPORT.md` | Regulatory conflict. | No rule-to-object chain. |
| `ARKI_BREAK_B09_REPORT.md` | Economic attack. | Cost UNKNOWN, no trade-off. |
| `ARKI_BREAK_B10_REPORT.md` | Engineering collision. | No engineering solver. |
| `ARKI_BREAK_B11_REPORT.md` | Kill the parti. | No kill-parti loop. |
| `ARKI_BREAK_B12_REPORT.md` | Multiscale attack. | No cross-scale graph. |
| `ARKI_BREAK_B13_REPORT.md` | Time attack. | No temporal scenario. |
| `ARKI_BREAK_B14_REPORT.md` | False evidence. | Conflicts preserved, no winner. |
| `ARKI_BREAK_B15_REPORT.md` | Impossible project. | UNKNOWN/PARTIAL, no impossibility proof. |
| `ARKI_BREAK_001_CAPABILITY_MATRIX.json` | Matriz de capacidades. | `MATRIX` |
| 15 `.json` evidence | Evidencia por ataque. | `EVIDENCE` |

## M.2 — `exams-json/` (18 archivos)

| Archivo | Propósito | Estado |
|---|---|---|
| `ARKI-CAUSAL-001_RESOLUCION_PROPUESTA_2026-09-21.md` (24 KB) | Hospital de Trujillo, 400→500 camas. | `AI_PROPOSED / HUMAN_REVIEW_REQUIRED` |
| `ARKI-E1-K-BLIND-LEARNING-EXAM-2026-09-20.md` (20 KB) | Refugio de animales. | `AI_PROPOSED` |
| `ARKI-RESTAURANT-500-EXAM-2026-09-20.md` (11 KB) | Restaurante para 500. | `AI_PROPOSED` |
| `house-two-floor-existing-arki/HOUSE-A21-S1-N1.svg` | Planta N1. | `SVG` |
| `house-two-floor-existing-arki/HOUSE-A21-S1-N2.svg` | Planta N2. | `SVG` |
| `house-two-floor-existing-arki/HOUSE-A21-S1-model.json` | Modelo canónico. | `CANONICAL` |
| `house-two-floor-existing-arki/README.md` | Descripción. | `README` |
| `intermodal-terminal-30000m2/INTERMODAL-250-AUTOS-50-CAMIONES-20-AUTOBUSES-model.json` | Modelo intermodal. | `MODEL` |
| `taxi-terminal-250-taxis/TAXI-250-A-LINEAL.svg` | Propuesta A. | `SVG` |
| `taxi-terminal-250-taxis/TAXI-250-B-PLAZA-CENTRAL.svg` | Propuesta B. | `SVG` |
| `taxi-terminal-250-taxis/TAXI-250-C-COMPACTO.svg` | Propuesta C. | `SVG` |
| `taxi-terminal-250-taxis/TAXI-250-model.json` | Modelo. | `MODEL` |
| `taxi-terminal-250-taxis/README.md` | Descripción. | `README` |
| `terminal-50-buses/TERMINAL-50-BUSES-S01-SITE.svg` | Sitio. | `SVG` |
| `terminal-50-buses/TERMINAL-50-BUSES-N1.svg` | N1. | `SVG` |
| `terminal-50-buses/TERMINAL-50-BUSES-N2.svg` | N2. | `SVG` |
| `terminal-50-buses/TERMINAL-50-BUSES-model.json` | Modelo. | `MODEL` |
| `terminal-50-buses/README.md` | Descripción. | `README` |

## M.3 — `agk/` (24 archivos + 13 .xlsx en preserved/)

| Archivo | Propósito | Estado |
|---|---|---|
| `README.md` (14 KB) | Knowledge Preservation Package v1.0. | `PRESERVED` |
| `package-manifest-v1.0.json` | Manifiesto. | `INTEGRITY` |
| `MACROORDEN_MANUS_ARKI_KNOWLEDGE_PRESERVATION_PACKAGE_v1.0.txt` | Instrucciones. | `REFERENCE` |
| `preserved/01-13_*.xlsx` | 13 workbooks preservados (constitución, investigación, historia, experimentos, capacidades, UNKNOWN, FROZEN, casos, fuentes, tipologías, ideas, libro maestro, formato IA). | `FROZEN` |
| `external-evaluations/DS-EVAL-01/README.md` | Evaluación externa DeepSeek. | `REVIEWED / DISPOSITIONED` |
| `fundamental-research/FKCG-02/FKCG-02_FUNDAMENTAL_KNOWLEDGE_PRESERVATION.md` | Preservación fundamental. | `PRESERVED / NOT_CANONIZED` |
| `demonstration-gates/DG-01/DG-01_APPLICABILITY_EXPERIMENTAL_SPECIFICATION.md` (33 KB) | Especificación DG-01. | `SPECIFIED / NOT_IMPLEMENTED` |
| `demonstration-gates/DG-01/DG-01B_BLIND_ADVERSARIAL_PROTOCOL.md` (24 KB) | Protocolo DG-01B. | `SPECIFICATION_CORRECTION_ONLY` |

## M.4 — `costs/` (2 archivos)

| Archivo | Propósito | Estado |
|---|---|---|
| `ARKI-HOUSE-A21-S1-COST-SIMULATION.md` | Simulación: PEN 728,384 (medio) sin IGV. | `SIMULATION` |
| `ARKI-HOUSE-A21-S1-COST-SIMULATION.xlsx` | Datos. | `DATA` |

**Regla:** esta evidencia es real y ejecutada. Pero **no prueba capacidad general**. BREAK-001 muestra 0 FAILS pero también 0 FABRICATES. Los exámenes ciegos son `AI_PROPOSED` y requieren revisión humana. DG-01 no se ha ejecutado. AGK está preservado, no ingerido.

---

# ANEXO N — HISTÓRICOS CLAVE (`docs/_ROOT_KEEP/`, 20 archivos)

**Estado:** documentos históricos de producto, RFCs aprobados o en draft, manuales operativos. **Importantes para entender decisiones pasadas, pero no son el estado actual** (el `00-START.md` + Anexos I/J son la verdad vigente).

## N.1 — Documentos de producto

| Archivo | Propósito | Estado |
|---|---|---|
| `ARKI_FIRST_CONTACT_MANUAL.md` | Manual de presentación. Camino A. | `REFERENCE` |
| `ARKI_OPERATIONAL_ARCHITECTURE_FREEZE_1_0.md` | 4 capas: D-2, AGK, Directors, Capability Fabric. | `FROZEN` |
| `COMMANDS_TRANSLATIONS_MATRIX.md` | 67 comandos SICL, 8 idiomas. | `REFERENCE` |
| `DOCUMENTATION_COHERENCE_2.11.md` | Frontend, Core, RFC-027/028/029. | `REFERENCE` |
| `EVALUACION_CONCEPTUAL_DOCUMENTO_63.md` | Evaluación crítica (visión vs madurez). | `EVALUATION` |
| `SICL_1_3_HIERARCHY.md` | Jerarquía espacial/temporal. | `REFERENCE` |
| `SICL_COORDINACION_CICLO_01.md` | Preference canónica. | `IMPLEMENTED` |
| `SICL_FRONTEND_SPEC_v1.md` | Spec UX/UI. | `APROBADO` |
| `SICL_GITHUB_RENDER_MIGRATION_v1.md` | Migración a Render. | `PREPARADO, NO DESPLEGADO` |
| `SICL_HTTP_CLIENT_EXPECTED_CONTRACT_v1.md` | Contrato HTTP. | `REFERENCE` |
| `SICL_IO_DECISION.md` | Investigación de Operaciones. | `DECISION` |
| `SICL_PUBLIC_DEPLOYMENT_MANUAL_RUNBOOK_v1.md` | Runbook manual. | `RUNBOOK` |
| `SICL_REST_FRONTEND_CONFIGURATION_v1.md` | Puente REST. | `REFERENCE` |
| `VISUALIZATION_ENGINE.md` | Motor de visualización F1. | `IMPLEMENTED` |

## N.2 — RFCs

| Archivo | Estado |
|---|---|
| `RFC-015_FRONTEND_V2.md` | FASE A IMPLEMENTED |
| `RFC-019_LOCALIZED_SICL_COMMAND_ALIASES.md` | DRAFT — PENDING PO |
| `RFC-019_PARSER_SPECIFICATION.md` | DRAFT |
| `RFC-022_FRONTEND_GUIDED_INTERFACE.md` | IMPLEMENTED ON MAIN |
| `RFC-023_CORE_CONNECTIVITY_AND_DEPLOYMENT.md` | APPROVED — AUTHORIZED |
| `RFC-024_SYSTEM_COMPLETION.md` | IMPLEMENTED — LOCAL/MOCK; REMOTE E2E BLOCKED |

**Regla:** estos documentos son historia. No están sincronizados con el estado vigente. Si hay conflicto, prevalece `00-START.md` + Anexos I/J.

---

# ANEXO O — ÍNDICE CRUZADO DE LOS 20 CANÓNICOS

**Propósito:** los 20 archivos de `docs/_CANONICAL_TRUTH_FOR_00_START/` ya están cubiertos por los Anexos I y J. Este anexo solo indica qué sección de I/J cubre cada uno.

| Archivo | Cubierto por | Sección |
|---|---|---|
| `AGK_OCCT_EXECUTION_EVIDENCE_V1.md` | Anexo I | I.3 |
| `ARKI_AGENT_REGISTRY_AND_ORCHESTRATOR.md` | Anexo J | J.3 |
| `ARKI_AND_SICL_FOUNDATIONS.md` | Anexo I | I.1 |
| `ARKI_AUTONOMY_EVIDENCE_MAP.md` | Anexo J | J.4 |
| `ARKI_BODY_MAP_TRIPLE_AUDIT_V1.md` | Anexo I | I.2 (implícito) |
| `ARKI_CANONICAL_HANDOFF_2026-10-05.md` | Anexo I | I.4 |
| `ARKI_DELTA_SYSTEM_AUDIT.md` | Anexo J | J.1 |
| `ARKI_F1_F10_AUTOMATED_TEST_MACRO_ORDERS_V1.md` | Anexo J | J.7 |
| `ARKI_INTELLIGENCE_CAPABILITY_INVENTORY.md` | Anexo J | J.4 / J.6 |
| `ARKI_LATENT_CAPABILITY_MAP.md` | Anexo J | J.5 |
| `ARKI_MASTER_MAP_LIVE.md` | Anexo I | I.2 |
| `ARKI_PHOTOREALISTIC_VISUAL_AND_EVIDENCE_PROTOCOL.md` | Anexo I | I.6 |
| `ARKI_POST_513_EXECUTIVE_SYNTHESIS.md` | Anexo J | J.4 / J.6 |
| `ARKI_SUPERPOWERS_PACK.md` | Anexo J | J.2 |
| `ARKI_TEN_PHASE_PRODUCT_INTEGRATION_ROADMAP_V1.md` | Anexo J | J.7 |
| `D6.1-REPORT.md` | Anexo J | J.1 |
| `D6.2-M-REPORT.md` | Anexo J | J.1 |
| `D6.3-G-REPORT.md` | Anexo J | J.1 |
| `D6.4-MULTIMODAL-SOURCE-INGESTION-REPORT.md` | Anexo J | J.1 |
| `SICL_65_PRODUCT_DECISION.md` | Anexo I | I.5 |

**Regla:** los 20 canónicos están consolidados. Este anexo es un índice cruzado. No requiere duplicar contenido.

---

# ANEXO P — VIVOS, RAÍZ Y BASURA

**Propósito:** mapear los 76 archivos vivos en subdirectorios + 8 archivos raíz de `docs/` + 165 archivos en `_BASURA_2026-10-28/` (fuera del repo).

## P.1 — `docs/arki-master-map/` (49 archivos, VIVO)

**Estado:** mapa canónico de continuidad. Referenciado en §11 del `00-START.md`.

| Archivo | Propósito | Estado |
|---|---|---|
| `ARKI_MASTER_MAP_LIVE.md` (38 KB) | Punto de entrada canónico. | `ACTIVE / LIVING MAP` |
| `ARKI_MASTER_MAP_STATE.json` (130 KB) | Estado F1-F10. | `ACTIVE` |
| `ARKI_CONTINUITY_EVENTS.jsonl` | Historial de eventos. | `ACTIVE` |
| `AGK_DELTA_005_PERSISTENT_NAMING_CONTRACT_V1.md` | Naming persistente. | `FROZEN` |
| `ARKI_ACE88_ADAPTER_IMPLEMENTATION_20261014.md` | ACE88 Core. | `CODE_INTEGRATED` |
| `ARKI_ACE88_WEB_CORE_BOUNDARY_20261014.md` | Frontera Web/Core. | `CONTRACT_PROPOSED` |
| `ARKI_AUTONOMOUS_RELATION_DISCOVERY_20261014.md` | Descubrimiento de relaciones. | `SOURCE_SCANNER_IMPLEMENTED` |
| `ARKI_BOLSA_IDEAS_*` (8 archivos BIC) | Bolsa de Ideas. | `INVENTARIO EXPERIMENTAL` |
| `ARKI_BRANCH_COMMIT_CATALOG_20261021.md` (378 KB) | Catálogo de ramas. | `INVENTORY` |
| `ARKI_BRANCH_S10_TWIN_AUDIT_2026-10-09.md` | S10/twin. | `AUDIT` |
| `ARKI_CAPABILITY_INSERTION_MAP_FROM_BUSINESS_PUBLIC_WORKS_V1.md` | 12 capacidades. | `TRIAGED` |
| `ARKI_CONTINUITY_NEW_CHAT_PROTOCOL.md` | P0 continuidad. | `IMPLEMENTED_PARTIAL` |
| `ARKI_CONTROLLED_GITHUB_EXECUTOR_V0.md` | Ejecutor V0. | `IMPLEMENTED` |
| `ARKI_DIGITAL_TWIN_REAL_DATA_GATE_2026-10-08.md` | GDT-01. | `NO APTO` |
| `ARKI_F5_F9_*` (2 archivos) | Red Team F5-F9. | `DOSSIER` |
| `ARKI_F6_AGK_INTEGRAL_CLOSURE_GATE_V1.md` | F6/AGK. | `CLOSURE_AUDIT_ACTIVE` |
| `ARKI_F7_F8_F9_EXECUTION_HANDOFF_2026-10-08.md` | F7-F9. | `IMPLEMENTED_PARTIAL` |
| `ARKI_F7_OECE_ACS_EVIDENCE_CONTRACT_V1.md` | F7 OECE. | `CONTRACT + BOUNDED IMPL` |
| `ARKI_F7_PROFESSIONAL_TECHNICAL_DEVELOPMENT_GATE_V1.md` | F7. | `OPEN / CONTRACT` |
| `ARKI_F7_S10_PROJECT_COST_BASELINE_CONTRACT_V1.md` | F7 S10. | `CONTRACT + BOUNDED IMPL` |
| `ARKI_JOURNAL_VERIFICATION_OFFLINE_20261014.md` | Journal offline. | `IMPLEMENTED_NOT_EXECUTED` |
| `ARKI_LIVE_MAP_TREE_TWIN_DOUBLE_AUDIT_20261014.md` | Reconciliación. | `AUDITORÍA ESTÁTICA` |
| `ARKI_LIVE_SYSTEMS_COORDINATOR_20261014.md` | Coordinador. | `IMPLEMENTED` |
| `ARKI_M10_001_MACROORDERS.md` | 10 macroórdenes. | `AUTHORIZED` |
| `ARKI_MAIN_INTEGRATION_GENEALOGY_2026-10-13.md` | Genealogía. | `PARCIAL` |
| `ARKI_MAPA_VIVO_CONTINUIDAD.md` (16 KB) | Proyección de Git + eventos. | `GENERADO` |
| `ARKI_MAQUETA_INTELLIGENT_ASSEMBLY_CONTRACT_V1.md` | Ensamblaje. | `DESIGN_PROPOSED` |
| `ARKI_OFFLINE_VALIDATION_20261014.md` | Validación offline. | `RUNNER_IMPLEMENTED` |
| `ARKI_RED_TEAM_A_DEEPSEEK_ORDER_V1.md` | Orden DeepSeek. | `ORDER` |
| `ARKI_RED_TEAM_B_QWEN_ORDER_V1.md` | Orden Qwen. | `ORDER` |
| `ARKI_RELATIONAL_LEARNING_20261014.md` | Aprendizaje relacional. | `CANDIDATE_ENGINE_IMPLEMENTED` |
| `ARKI_SICL_WEB_BRANCH_AUDIT_20261022.md` (17 KB) | Auditoría de ramas. | `PARCIAL` |
| `ARKI_SICL_WEB_BRANCH_CATALOG_20261021.md` (27 KB) | Catálogo de ramas. | `INVENTORY` |
| `ARKI_SUPERPOWERS_AUDIT_2026-10-12.md` | Superpoderes. | `AUDITORÍA ESTÁTICA` |
| `ARKI_THREE_LIVE_SYSTEMS_RECONCILIATION_20261014.md` | 3 sistemas. | `INSPECCIÓN ESTÁTICA` |
| `ARKI_TREE_PREREQUISITE_COVERAGE_20261014.md` | Cobertura. | `0/51` |
| `ARKI_TWIN_THREE_ALTERNATIVES_20261014.md` | Tres alternativas. | `EVALUATOR_IMPLEMENTED` |
| `ARKI_UNIFIED_TRACE_GRAPH_V1.md` | Trace Graph. | `IMPLEMENTED_AS_LOCAL` |
| `AV_UI_001_ARBOL_VIVO_PREPARATION.md` | Preparación UI. | `PREPARATION_ONLY` |
| `ideas/IDEA-MT-001_MULTISCALE_TWIN_FROZEN.md` | Multiscale Twin. | `IDEA_FROZEN` |
| `contracts/*.schema.json` (2) | Esquemas. | `SCHEMA` |

## P.2 — `docs/arki-planning/` (7 archivos, VIVO)

| Archivo | Propósito | Estado |
|---|---|---|
| `README.md` | Resuelve I-01. | `ACTIVE` |
| `BACKLOG.md` | 24 ideas (I-01 a I-24). | `ACTIVE` |
| `DECISIONS.md` | Registro PO. | `ACTIVE` |
| `IDEAS.md` | Ley del Embudo. | `ACTIVE` |
| `RFC_APPROVALS.md` | Registro. | `ACTIVE` |
| `ROADMAP.md` | F1-F10. | `ACTIVE` |
| `WORK_LEDGER.md` | Registro. | `ACTIVE` |

## P.3 — `docs/ops/` (8 archivos, VIVO)

| Archivo | Propósito | Estado |
|---|---|---|
| `ARKI-4-PENDIENTES-CERRADOS-20261027.md` | 4 pendientes. | `PASS` |
| `ARKI-DELTA62-STATUS-20261027.md` | Delta 6.2. | `IMPLEMENTED` |
| `ARKI-E2E-CANONICAL-REPLICATE-20261027.md` | E2E. | `RUNBOOK` |
| `ARKI-F1-F10-PHASE-EVIDENCE-20261027.md` | 10 fases. | `PASS_WEB_ONLY` |
| `ARKI-LIVE-SYSTEMD-INTEGRATION-20261014.md` | Systemd. | `PASS` |
| `ARKI-LOCAL-STACK-AUTOSTART-20261027.md` | Autostart. | `ACTIVE` |
| `ARKI-MO-025-ACTIVACION-ARBOL-VIVO.md` | MO-025. | `IMPLEMENTED` |
| `ARKI-MO-026-032-ACTIVACION-INTEGRADA.md` | MO-026..032. | `IMPLEMENTED` |

## P.4 — `docs/freeze/`, `docs/redteam/`, `docs/revivir-arki/`, `docs/security/` (4 archivos, VIVO)

| Archivo | Propósito | Estado |
|---|---|---|
| `freeze/ARKI_V0_6_E2E002_PHASE1_FREEZE.md` | Freeze Phase 1. | `FROZEN` |
| `redteam/ARKI_V0_6_RC_ROUND1_HANDOFF.md` | Round 1. | `RED_TEAM` |
| `revivir-arki/REGISTRO-MAESTRO-REVIVIR-ARKI.md` | Continuidad. | `EN CURSO` |
| `security/ARKI_RED_TEAM_VALIDATION_2026-09-21.md` | Validación defensiva. | `310 TESTS PASS` |

## P.5 — `docs/` raíz (8 archivos, VIVO)

| Archivo | Propósito |
|---|---|
| `ARKI_FRONTEND_ARCHITECTURE.md` | Arquitectura frontend. |
| `ARKI_FRONTEND_HANDOFF.md` | Handoff frontend. |
| `COMMANDS_COMPACT_REFERENCE.md` | Referencia de comandos. |
| `COMMAND_BAR.md` | Command Bar SICL. |
| `GUIA_USUARIO_PRODUCT_0_6.md` | Guía de usuario. |
| `HELP_SYSTEM.md` | Help system. |
| `PRODUCT_ACCEPTANCE_CONTRACT_SICL_0_6.md` | Contrato de aceptación. |
| `READINESS_LOCAL_PREDEPLOYMENT.md` | Readiness local. |

## P.6 — `_BASURA_2026-10-28/` (165 archivos, FUERA del repo)

**Ubicación:** `/home/arki/ARKI/_BASURA_2026-10-28/` (no en `canonical/sicl-web/`).
**Estado:** nada borrado. 165 archivos preservados.

| Subdirectorio | Archivos | Contenido |
|---|---|---|
| `DOCS_DUPLICADOS/` | 3 | Propuestas de render 34, 35, 33. |
| `DOCS_OBSOLETOS/` | 158 | Los 20 inventarios post-513, 9 pre-513, D6.x, KR6.2/6.3, MC01-04, PWA, Enterprise, Architecture (26), Predictive (28), etc. |
| `DOCS_DRAFT/` | 0 | (Vacío) |

**Regla:** `_BASURA` es backup, no basura eliminada. Nada se ha borrado. Si algo se necesita, se puede recuperar.

---

**End of Anexos K, L, M, N, O, P — 2026-10-28.**


---

# ANEXO Q — EXPEDIENTE MAESTRO (índice navegable)

**Ubicación canónica:** `/home/arki/ARKI/canonical/sicl-core/00_ARKI_EXPEDIENTE_MAESTRO.md` (21 KB) + `00_ARKI_EXPEDIENTE_MAESTRO.docx` (20 KB).
**Estado:** Vigente al 2026-10-27. Documento de referencia en `sicl-core`, no en `sicl-web`.
**Función:** índice navegable del proyecto completo. **No reemplaza** a los documentos que enlaza; los organiza.

## Q.1 — Estructura del Expediente Maestro (10 niveles)

| Nivel | Contenido |
|---|---|
| **Nivel 0** | Constitucional (Congelado): 5 invariantes duros (INV-000 Ley Cero, RECOMMENDATION ≠ DECISION, UNKNOWN BEFORE INVENTING, SOURCE ≠ KNOWLEDGE, HUMAN AUTHORITY) + 5 documentos fundacionales |
| **Nivel 1** | Auditoría y Estado Real: acta de cierre forense + revisión (5 capacidades que se decían inexistentes sí existen) |
| **Nivel 2** | Arquitectura y Diseño: SICL Core Contract v1.0, ADRs, órdenes maestras |
| **Nivel 3** | Implementación y RFCs: mapa completo de RFCs (001-037.1), con **RFC-016 como hueco definitivo** |
| **Nivel 4** | Dominio y Aplicación: catálogo de tipologías, exámenes ciegos, inventario de ideas |
| **Nivel 5** | Capacidades Críticas: PARTI, geometría avanzada, motor paramétrico (integrados) vs. modelo predictivo, arkiContextGate (no integrados) |
| **Nivel 6** | Evidencia Forense: `HISTORIA_EVIDENCIA_2026-10/` (19 archivos), `_ARCHIVO/validaciones-2026-10/` (622 MB), `_BASURA_2026-10-27/` (929 MB) |
| **Nivel 7** | Repositorios: 3 canónicos (sicl-web, sicl-core, arki-acs) con HEADs y fechas |
| **Nivel 8** | Decisiones Pendientes: 5 decisiones abiertas que requieren al PO |
| **Nivel 9** | Reglas de Navegación: cómo buscar por nivel vs tema, cómo agregar documentos, cómo distinguir canónico/derivado/histórico/basura |
| **Apéndice A** | Cronología: 12 hitos fechados (2026-08-24 a 2026-10-27) |
| **Apéndice B** | Estado del servidor al 27-oct-2026: documentación, repositorios, espacio (468 GB total, 178 usado, 267 libre) |

## Q.2 — Estado consolidado al 2026-10-27 (según Expediente Maestro)

| Métrica | Valor |
|---|---|
| Repos canónicos | 3 (`sicl-web`, `sicl-core`, `arki-acs`) |
| HEADs | `sicl-web` `5c03107c`, `sicl-core` `5dfd17a`, `arki-acs` `302f63d` |
| Documentación limpia | 607 archivos en `DOCS_LIMPIO/ARKI_DOCS_LAPTOP/` |
| Evidencia forense | 19 archivos en `HISTORIA_EVIDENCIA_2026-10/` |
| `_ARCHIVO/validaciones-2026-10/` | 16,058 archivos (622 MB) — **conservado por decisión** |
| `_BASURA_2026-10-27/` | 340 + 4 directorios (929 MB) — **recuperable** |
| `0-Copia/` | Backup completo — **no se toca** |
| Espacio | 468 GB total, 178 GB usado, 267 GB libre, 40% uso |

## Q.3 — Las 5 decisiones pendientes del PO (Nivel 8)

| # | Decisión | Opciones | Recomendación actual |
|---|---|---|---|
| 1 | Integrar `arkiContextGate` a `canonical/sicl-web` | A) Integrar / B) Documentar / C) Descartar | **B** |
| 2 | Integrar modelo predictivo (14 docs) a `canonical/` | A) A sicl-web/docs / B) A sicl-core/docs / C) Histórico | **C** |
| 3 | Redactar RFC-016 (hueco definitivo) | A) Redactar / B) Documentar como hueco / C) Ignorar | **B** |
| 4 | Desplegar Core a Cloud Computer (Fase 0-8 del 0.6) | A) Iniciar / B) Posponer / C) Cancelar | Pendiente |
| 5 | Mover `_ARCHIVO/validaciones-2026-10/` (622 MB) a `_BASURA` | A) Mover / B) Revisar antes / C) Conservar | **C** |

## Q.4 — Huecos conocidos del mapa vivo (27-oct-2026)

El generador `tools/arki_mapa_vivo.py` declara 4 documentos prerequisito (`REQUIRED`). De ellos:

| ID | Ruta esperada | Estado |
|---|---|---|
| `ACE88` | `docs/ace88/ACE88_ROOT_INTEGRATION.md` | ❌ No existe |
| `AUTO_V0` | `docs/arki-automejora/ARKI_AUTONOMOUS_IMPROVEMENT_CONTRACT_V0.md` | ❌ No existe |
| `INVENTORY` | `tools/arki_automejora_inventario.py` | ❌ No existe |
| `START` | `00-start.md` | ✅ Recuperado de `av023-arbol-vivo/00_START.md` |

Los 3 huecos restantes (ACE88, AUTO_V0, INVENTORY) requieren **decisión de contenido, no de organización**. Mientras no se resuelvan, el ciclo vivo reporta `UNKNOWN` en `LATEST.json`. **No es un fallo del ciclo vivo; es un hueco del corpus documental.**

## Q.5 — Deuda de entorno conocida

**MariaDB para test de integración (27-oct-2026):** el test `server/_core/arkiMo22RealIntegration.test.ts` de `sicl-web` requiere MariaDB local. MariaDB está instalado y corriendo, pero el usuario `sicl@127.0.0.1` no autentica por TCP (`Access denied`). **Impacto:** 1 test de integración falla. Los otros 947 tests de `sicl-web` pasan. **Estado:** deuda de entorno, no de código.

**Regla de lectura del Expediente Maestro:** fechas antes que nombres o versiones. Un archivo llamado "v2.0" puede ser más viejo que uno sin versión. La fecha de modificación y la fecha interna son el ancla.

---

# ANEXO R — GUIONES DE DEMOSTRACIÓN

**Ubicación:** `/home/arki/ARKI/canonical/sicl-core/DEMO_SCRIPT_V2.md` (8.7 KB, 22-oct-2026) y `DEMO_SCRIPT_V3.md` (2.7 KB, 22-oct-2026).
**Función:** permiten que cualquier arquitecto o auditor reproduzca las capacidades actuales de ARKI sin acceder al código.

## R.1 — DEMO_SCRIPT_V2 — Guión de demostración SICL v2.0

**Caso:** Edificio Yvan Trujillo. **Objetivo:** demostrar inteligencia trazable sin sustituir la decisión profesional humana.

**Regla:** SICL calcula, registra evidencia y formula recomendaciones. **La decisión sigue perteneciendo al arquitecto.** Los agentes no crean decisiones y Pareto no elige un ganador automático.

**Preparación:**


**5 bloques de la demo:**

| Bloque | Comando | Qué demuestra |
|---|---|---|
| 1. Site Intelligence | `/SITE INTELLIGENCE "Trujillo, Peru"` | Genera Facts (no Assumptions) con `source=OPEN_METEO_API` o fallback `SITE_INTELLIGENCE_FIXTURE` |
| 2. Agente bioclimático | `/AGENT RUN BIOCLIMATIC CONVENCIONAL_A` | Crea `Evaluation` (no `Decision`) con `source=EXPERT_SYSTEM` |
| 3. Frente de Pareto | `/PARETO ENERGY_SAVINGS CONSTRUCTION_COST` | Separa no dominadas/dominadas, respeta direcciones, no elige ganador |
| 4. Generación paramétrica | `/GENERATE CONVENCIONAL_A ENERGY_SAVINGS,CONSTRUCTION_COST` | Genera alternativas `PROPOSED` con `source=GENERATIVE_OPTIMIZER`, `decision_created=false` |
| 5. Matriz de trade-offs | `/TRADEOFF_MATRIX ENERGY_SAVINGS CONSTRUCTION_COST` | Incluye originales + generadas, deltas, Pareto, sin crear `Recommendation` ni `Decision` |

**Criterios PASS:** `OPEN_METEO_API` o fallback explícito; `Fact ≠ Assumption`; agente → `Evaluation` con `EXPERT_SYSTEM`; agente no crea `Decision`; Pareto devuelve no dominadas/dominadas/incompletas; historial append-only; solo humano registra `Decision`.

## R.2 — DEMO_SCRIPT_V3 — Design Knowledge Agent

**Objetivo:** demostrar que SiMS-DeI consulta conocimiento de diseño en escala urbana, mantiene separadas las referencias normativas del RNE y los patrones teóricos, genera preguntas abiertas y no crea una decisión automática.

**Precondición:** `export PYTHONPATH=.:src`

**3 pasos:**

| Paso | Endpoint | Qué demuestra |
|---|---|---|
| 1. Catálogo por escala | `GET /v1/design-knowledge/catalog?scope=edificacion` | Las 11 escalas en `data.scales`, items y patrones aplicables |
| 2. Consulta urbana | `POST /v1/design-knowledge/query` con `distrito_ciudad` + `vivienda` + objetivos | Respuesta con RNE `NO_VERIFICADA` (`reference_only`), patrones Alexander y Ching (`THEORETICAL`), `open_questions` |
| 3. Autoridad humana | Verificación de la respuesta | `decision_created: false`, `review_state: HUMAN_REVIEW_REQUIRED` |

**Criterios PASS:** `distrito_ciudad` aceptado; `REVIEW_REQUIRED` o `CONFLICTING` cuando hay normativa no verificada; RNE `reference_only`; Alexander y Ching `THEORETICAL`; `open_questions` presentes; `decision_created=false`; sin promoción normativa automática.

## R.3 — Estado real de los guiones

**Los guiones son del 22-oct-2026.** El estado actual del proyecto es del 27-oct-2026. **Los criterios de aceptación pueden haber cambiado.** Antes de usar un guion en una demo real, verificar:
- Que los endpoints (`/v1/design-knowledge/*`, `/v1/projects/*`) existan en el Core actual.
- Que los comandos (`/SITE INTELLIGENCE`, `/AGENT RUN`, `/PARETO`, `/GENERATE`, `/TRADEOFF_MATRIX`) estén implementados.
- Que las respuestas devuelvan los campos contractuales.

**Si algún criterio falla, se documenta como UNKNOWN, no se inventa un PASS.**

---

# ANEXO S — CONTRATO DE ADAPTADOR HTTP Y ARQUITECTURA DE FASES

**Función:** referenciar los contratos canónicos del adaptador HTTP y el diseño de las fases 4-5, sin duplicar contenido.

## S.1 — `SICL_HTTP_ADAPTER_CONTRACT.md` (en `sicl-web/`)

**Ubicación:** `/home/arki/ARKI/canonical/sicl-web/SICL_HTTP_ADAPTER_CONTRACT.md`
**Versión:** `sicl-core-http/0.2`

**Reglas clave del contrato:**

| Regla | Descripción |
|---|---|
| **Autenticación** | El web autentica la sesión del navegador. El adaptador recibe credencial server-to-server. Cookies, OAuth, JWT y aserciones de identidad **nunca cruzan** al payload de dominio. |
| **Project scope** | `spatial_scope` (scale, id, name, parent_id) + `temporal_scope` (horizon, scenario). Estos campos contextualizan el análisis; no crean forecasts ni autoridad. |
| **Read operations** | `GET /snapshot` (canonical persistido) + `POST /council/analyze` (read-only, acepta `observed_version`, **nunca crea** Recommendation/HumanReview/Decision). |
| **Human-boundary operations** | `POST /recommendations`, `POST /human-reviews`, `POST /decisions/prepare` (read-only), `POST /decisions` (requiere autoridad humana verificada). |
| **Error mapping** | `409` = optimistic concurrency failure; `422` = domain contract violation; `403` = insufficient access; `404` = missing project. |
| **Invariantes** | Council no escribe authority records. Authentication no se convierte en authority. Recommendation no se convierte en Decision implícitamente. Toda escritura durable incluye `observed_version` y `event_id`. El adaptador no acepta ni devuelve secretos. |

## S.2 — `PHASE_4_5_ARCHITECTURE.md` (en `sicl-core/`)

**Ubicación:** `/home/arki/ARKI/canonical/sicl-core/PHASE_4_5_ARCHITECTURE.md` (2.8 KB)
**Estado:** Documento de diseño; **no autoriza implementación** de agentes, optimización ni Pareto.

**3 pilares del diseño:**

| Pilar | Descripción |
|---|---|
| **Agente bioclimático** | Consume info explícita y trazable (ubicación, hechos climáticos, radiación, vientos, orientación, objetivos, restricciones). Produce `Evaluation` (no `Decision`). Si falta evidencia → `REQUIRES_HUMAN_DECISION`. |
| **Debate multi-agente** | Comparación de análisis independientes sobre la misma `Alternative` y los mismos `Objective`/`Constraint`. Orquestador **no promedia** sin regla aprobada. Salida: `Recommendation` o estado de insuficiencia; **nunca `Decision` automática**. |
| **Pareto básico** | Solo objetivos numéricos con dirección explícita (`MAXIMIZE`/`MINIMIZE`). Cada alternativa: dominada, no dominada, no evaluable. **No mezclar** con ponderaciones subjetivas. Frontera no dominada ≠ ganador automático. |

**Dependencias y límites:**
- **Fase 4** requiere contrato de fuentes y métodos, catálogo de unidades, política de datos faltantes, pruebas de no mutación de hechos.
- **Fase 5** requiere comparación multiobjetivo, algoritmo Pareto determinista y evidencia reproducible.
- **Site Intelligence actual** es un adaptador determinista y simulado. **No es** consulta en tiempo real a SENAMHI, NASA POWER o Municipalidad hasta implementar conectores, validación, versionado y manejo de disponibilidad.

## S.3 — Referencias cruzadas

| Documento | Repo | Función |
|---|---|---|
| `SICL_HTTP_ADAPTER_CONTRACT.md` | `sicl-web/` | Contrato HTTP del adaptador (v0.2) |
| `PHASE_4_5_ARCHITECTURE.md` | `sicl-core/` | Diseño de fases 4-5 (agente bioclimático, Pareto) |
| `00_ARKI_EXPEDIENTE_MAESTRO.md` | `sicl-core/` | Índice navegable completo (Anexo Q) |
| `DEMO_SCRIPT_V2.md`, `DEMO_SCRIPT_V3.md` | `sicl-core/` | Guiones de demo reproducibles (Anexo R) |

**End of Anexos Q, R, S — 2026-10-28.**
