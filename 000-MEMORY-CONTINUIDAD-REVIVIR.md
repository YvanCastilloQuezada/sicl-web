# 000 — MEMORY, CONTINUIDAD y REVIVIR ARKI
## Auditoría arquitectónica y plan de cierre P0–P4

- **Fecha de corte:** 2026-10-30
- **Estado del documento:** propuesta de arquitectura y registro de auditoría; sujeto a revisión mediante PR.
- **Alcance:** SICL Core, SICL Web y ARKI-ACS.
- **Regla de evidencia:** *No Evidence = No Green*. Una declaración, documento, commit o CI aislado no demuestra por sí solo operación correcta en Arki-02.

---

## 1. Dictamen ejecutivo

Los tres dominios están relacionados, pero no son intercambiables:

1. **MEMORY** conserva conocimiento institucional y de diseño: decisiones, patrones, preferencias, evaluaciones, lecciones, fuentes, contexto, vigencia, procedencia y condiciones de uso.
2. **CONTINUIDAD** conserva y recupera el estado de trabajo y el flujo de eventos: secuencia, idempotencia, checkpoints, outbox, sincronización y backup/restore.
3. **REVIVIR ARKI** es el proceso de reconstrucción, reconciliación y reactivación del sistema. Consume información de MEMORY y mecanismos de CONTINUIDAD, pero no reemplaza a ninguno.

La auditoría identifica componentes reales en los tres repositorios. No demuestra todavía un ciclo cognitivo completo de MEMORY, ni un E2E integral ejecutado en Arki-02, ni el cierre formal de REVIVIR ARKI.

**Dictamen:** P0 ejecutado como auditoría remota; P1 especificado para revisión; P2 implementado parcialmente con evidencia de CI, pendiente de validación operacional; P3 documentado/en curso, sin cierre verificado; P4 bloqueado hasta ejecutar pruebas en Arki-02.

## 2. Autoridad y límites no negociables

| Componente | Autoridad / responsabilidad | No debe hacer |
|---|---|---|
| SICL Core | Autoridad institucional; único Event Store canónico; APIs y persistencia de eventos/memoria | Crear un segundo Event Store |
| SICL Web | Captura, orquestación, outbox local, presentación y proyecciones | Convertirse en fuente canónica de eventos o memoria |
| ARKI-ACS | Laboratorio de investigación, caracterización, pruebas y evidencia experimental | Ser runtime productivo, autoridad geométrica o promotor automático |
| AGK | Única autoridad geométrica operacional de ARKI | Tener motores geométricos paralelos |
| CONTINUIDAD | Mecanismo de persistencia/recuperación del estado y transporte fiable | Ser tratado como MEMORY |
| MEMORY | Conocimiento institucional contextualizado, trazable y gobernado | Ser reducido a logs, snapshots o historial de chat |
| REVIVIR ARKI | Proceso controlado de recuperación y reactivación | Alterar canónicos sin autorización y evidencia |

Las fases FROZEN, D-2 y la geometría canónica quedan fuera de cualquier modificación implícita de este plan.

## 3. Inventario auditado

### 3.1 SICL Core

**MEMORY**
- RFC-011 define Institutional Memory con categorías DECISION_PATTERN, PREFERENCE_PATTERN, EVALUATION_PATTERN, GENERATION_PATTERN y LESSON_LEARNED.
- Estados descritos: ACTIVE, SUPERSEDED y REVOKED.
- Confianza: HIGH, MEDIUM, LOW y UNKNOWN.
- Modelo versionado y append-only, con aprobación humana explícita; no debe mutar automáticamente proyectos destino.
- RFC-026 define Design Knowledge: fuentes bibliográficas/normativas, ítems atómicos, patrones, autoridad, licencia, revisión, escalas, tipologías, jurisdicciones, condiciones, evidencia, limitaciones y recuperación contextual.
- Existen implementación y pruebas en `src/sicl/memory.py`, `src/sicl/repository.py` y `tests/test_institutional_memory.py`.

**CONTINUIDAD**
- API de eventos:
  - `POST /v1/projects/{project_id}/continuity/events`
  - `GET /v1/projects/{project_id}/continuity/events?after_id=...`
  - `GET /v1/projects/{project_id}/continuity/checkpoint`
- Usa la tabla `events` existente como registro canónico y `continuity_event_keys` como índice de idempotencia. No constituye un segundo Event Store.
- Autenticación Bearer mediante `SICL_CORE_SERVICE_TOKEN`; sin configuración responde `503 CONTINUITY_AUTH_NOT_CONFIGURED`.
- La idempotencia debe distinguir repetición idéntica de conflicto de contenido para la misma clave.
- Existe utilidad de backup cifrado con Fernet, manifest SHA-256 y restauración aislada, diseñada para no sobrescribir el destino. Existe servicio/timer diario documentado.

**Riesgos que requieren pruebas**
- La extracción de MEMORY concatena campos de texto libre. La opción de anonimización elimina el identificador directo de proyecto, pero la auditoría estática no encontró prueba suficiente de saneamiento de PII embebida en texto. Es un riesgo por verificar, no una fuga demostrada.
- La selección de un tipo primario puede ocultar dimensiones simultáneas de un mismo conocimiento.
- La inferencia de confianza MEDIUM a partir de fragmentos no equivale a validar la calidad de la evidencia asociada.
- Verificar permisos, revocación, referencias de evidencia, persistencia y anonimización con casos adversariales.
- Se observó posible desalineación entre `COMMANDS_REFERENCE.md` y el RFC/CLI vigente; reconciliar documentación.

### 3.2 SICL Web

**MEMORY**
- `scripts/arki-memory-core-projection.mjs` genera una proyección de solo lectura desde Core; no es autoridad ni almacenamiento canónico.
- `tools/maqueta-viva/arki-living-memory.cjs` es un prototipo de memoria en proceso, sin persistencia canónica duradera.
- `tools/maqueta-viva/arki-autonomy-memory.cjs` mantiene un journal encadenado por hash en memoria de proceso; por sí solo no garantiza persistencia durable.
- Estos prototipos no deben presentarse como MEMORY institucional terminada.

**CONTINUIDAD**
- `server/continuityApi.ts` y `server/continuityOutbox.ts` implementan outbox SQLite separada de la base de datos general de Web.
- Outbox con AES-256-GCM, AAD, SHA-256, claves únicas de evento/idempotencia y estados PENDING_SYNC, SYNCED y BLOCKED.
- Worker de reintento y proyección desde Core; la outbox es cola local, no Event Store.
- Backup con `VACUUM INTO`, manifest SHA-256 y restauración aislada con comprobación de integridad.
- La base general de SICL Web continúa usando Drizzle/MySQL (`mysql2`); la presencia de outbox SQLite no significa que toda la aplicación haya migrado a SQLite.
- La documentación operativa está en `docs/MEMORY/WEB-OUTBOX-SQLITE.md`.

**Pruebas pendientes**
- E2E HTTP real Web → outbox → Core → secuencia/checkpoint → SYNCED.
- Caída y recuperación de Core; eventos pendientes deben sincronizarse sin duplicados.
- Restauración real de backup cifrado usando la clave original.
- Concurrencia multi-proceso e idempotencia bajo reintentos.
- Consistencia de identidad/proyecto entre Web y Core.
- Validar límites de payload, clasificación de datos sensibles y errores de autorización con pruebas negativas.

### 3.3 ARKI-ACS

ACS es un laboratorio para investigación, caracterización y evidencia de capacidades. El inventario incluye Artifact Intake, Static Inspector, Artifact Registry, Dependency Graph, Capability Registry/Graph, Evidence Store, Recommendation Layer, Isolated Worker, Runtime Adapters, Probe Engine, Test Corpus, Behavioral Characterization y Version Monitor.

- ACS puede aportar conocimiento tecnológico versionado y evidencia experimental.
- No es MEMORY institucional de proyectos, no es Event Store y no es runtime productivo.
- El nivel de aislamiento de proceso separado está implementado; el aislamiento por contenedor no está demostrado como implementado; el nivel microVM es desconocido/no acreditado.
- No afirmar aislamiento completo de filesystem o red sin evidencia específica.
- Ningún resultado experimental de ACS autoriza por sí solo promoción a producción o cambios en AGK/D-2/FROZEN.

## 4. P1 — Contrato arquitectónico de MEMORY

**Estado:** especificación propuesta; requiere revisión y aceptación antes de considerarse contrato aprobado. No se declara implementación integral.

### 4.1 Propósito

MEMORY debe permitir que ARKI recupere conocimiento útil y justificable en el contexto correcto, conservando procedencia, límites, vigencia y autoridad. No debe limitarse a almacenar texto o resumir conversaciones.

### 4.2 Unidad mínima de conocimiento

Cada unidad persistida debería contener, como mínimo:

- `memory_id`: identificador estable.
- `project_id` / ámbito: proyecto, organización, dominio o conocimiento general, según corresponda.
- `kind`: decisión, patrón, preferencia, evaluación, generación, lección, fuente normativa/bibliográfica u otro tipo aprobado.
- `statement`: afirmación atómica, no una mezcla de hechos y opiniones.
- `context`: condiciones y situación donde aplica.
- `source_ref`: referencia verificable al origen.
- `evidence_refs[]`: evidencias que sostienen la afirmación.
- `authority`, `license`, `jurisdiction`, `scale`, `typology`: cuando sean aplicables.
- `confidence`: HIGH / MEDIUM / LOW / UNKNOWN, con justificación explícita.
- `validity`: fecha de vigencia, revisión y caducidad si aplica.
- `lifecycle_status`: ACTIVE / SUPERSEDED / REVOKED.
- `approval`: identidad/rol autorizado, fecha y referencia de aprobación.
- `privacy_classification` y estado de anonimización.
- `version`, `created_at`, `supersedes` y huella de integridad.

Los campos pueden adaptarse al esquema Core existente; esta lista es un contrato lógico, no autorización para duplicar tablas o crear otro repositorio canónico.

### 4.3 Reglas de calidad y gobierno

1. Una afirmación sin fuente queda marcada como no verificada; no se convierte en conocimiento institucional aprobado.
2. Distinguir observación, inferencia, recomendación, decisión y norma.
3. No elevar confianza por mera presencia de texto o fragmentos.
4. Conservar múltiples dimensiones cuando una unidad represente más de un tipo de conocimiento; si el esquema exige tipo primario, registrar explícitamente los tipos secundarios.
5. Toda revocación o sustitución debe conservar trazabilidad; no borrar silenciosamente el historial.
6. La anonimización debe cubrir texto libre, metadatos, referencias y exportaciones, no solo el identificador directo del proyecto.
7. La recuperación debe devolver contexto, procedencia, vigencia, confianza, limitaciones, contradicciones y supuestos.
8. El consumo desde Web será una proyección/consulta autorizada de Core; nunca una segunda memoria canónica.
9. Las decisiones que afecten proyectos o geometría requieren aprobación explícita y autoridad competente.
10. ACS aporta evidencia experimental etiquetada como tal; no se convierte automáticamente en verdad institucional.

### 4.4 Ciclo de vida propuesto

`CAPTURED → NORMALIZED → EVIDENCE_LINKED → REVIEWED → APPROVED → ACTIVE`

Rutas de cambio:
- `ACTIVE → SUPERSEDED` cuando una versión posterior la reemplaza.
- `ACTIVE → REVOKED` cuando una autoridad revoca el conocimiento.
- `REVIEWED → REJECTED` si no alcanza el estándar de evidencia.
- `ACTIVE → REVIEW_REQUIRED` cuando caduca o cambia el contexto.

Los estados nuevos requieren compatibilidad con RFC-011 y aprobación de Core; no se deben introducir como cambios de código sin revisar migraciones y consumidores.

### 4.5 Criterios de aceptación P1

- [ ] Contrato lógico aprobado por responsables de SICL Core y ARKI.
- [ ] Mapeo campo por campo al modelo actual RFC-011/RFC-026.
- [ ] Política de fuentes, autoridad, licencia y evidencia.
- [ ] Pruebas adversariales de PII en texto libre y exportación.
- [ ] Pruebas de contradicción, supersesión, revocación y caducidad.
- [ ] Recuperación contextual con referencias verificables.
- [ ] Compatibilidad de API/proyección Web sin crear autoridad paralela.

**P1 no está cerrado** hasta que los criterios aplicables tengan evidencia y aprobación.

## 5. P2 — Continuidad: arquitectura y cierre de pruebas

**Estado:** componentes implementados en Core y Web; CI observado en verde para los SHAs registrados; validación E2E y producción Arki-02 pendientes.

### 5.1 Flujo canónico

1. Web recibe una acción autorizada.
2. Web registra el evento en su outbox local cifrada con clave idempotente.
3. Worker transmite el evento a SICL Core.
4. Core valida autenticación, alcance, esquema e idempotencia.
5. Core persiste en el Event Store canónico.
6. Core responde con identidad/orden canónico del evento.
7. Web marca el elemento como SYNCED solo tras confirmación válida.
8. La proyección Web consulta Core y reconstruye vistas; no reescribe el registro canónico.

### 5.2 Invariantes

- SICL Core mantiene el único Event Store canónico.
- La outbox Web es una cola durable de entrega, no un segundo registro institucional.
- La repetición del mismo evento no duplica efectos.
- La misma clave con contenido distinto debe producir conflicto explícito.
- No marcar SYNCED ante timeout, error o respuesta no verificable.
- No perder eventos pendientes ante caída/reinicio.
- Checkpoint y cursor deben permitir recuperación incremental sin saltos.
- Backup/restore debe preservar integridad, orden y capacidad real de descifrado.
- Secretos nunca se imprimen en logs, manifests o documentación.

### 5.3 Evidencia remota observada

| Repositorio | CI / ejecución observada | Resultado observado |
|---|---|---|
| sicl-core | ARKI MEMORY Continuity CI — run 41051733475 | SUCCESS |
| sicl-core | SICL Core CI — run 41051733704 | SUCCESS |
| sicl-web | SICL Web — run 41058342309 | SUCCESS |
| sicl-web | ARKI Continuity Map — run 41058342302 | SUCCESS |
| sicl-web | ARKI Continuity Snapshot — run 41060146992 | SUCCESS |
| arki-acs | CI | No se inspeccionó en esta auditoría; sin conclusión |

Estos resultados corresponden a la ejecución remota de GitHub y a los SHAs indicados en el registro. No son prueba de ejecución en Arki-02.

### 5.4 Pruebas de cierre P2

- [ ] E2E HTTP desde Web hasta persistencia canónica Core y retorno SYNCED.
- [ ] Repetición de mismo evento: un único efecto canónico.
- [ ] Misma idempotency key con payload distinto: conflicto y estado controlado.
- [ ] Core fuera de servicio: Web conserva PENDING_SYNC.
- [ ] Core restablecido: worker sincroniza sin duplicar ni perder eventos.
- [ ] Carrera de dos workers/procesos sobre el mismo evento.
- [ ] Checkpoint/cursor: lectura incremental sin omisiones ni duplicados.
- [ ] Backup real de outbox y restore aislado con clave original.
- [ ] Backup Core y restore aislado; comparar integrity_check, conteo y último ID.
- [ ] Verificar permisos, retención y rotación segura de claves.
- [ ] Repetir en Arki-02 y guardar logs, exit codes, SHAs, IDs y manifests.

No se debe declarar P2 operacionalmente cerrado hasta ejecutar y conservar esta evidencia.

## 6. P3 — REVIVIR ARKI: reconciliación y cierre

**Estado:** documentado/en curso; cierre formal no verificado.

### 6.1 Alcance

REVIVIR ARKI es el proceso de recuperar y reactivar el sistema con control de integridad. Puede utilizar:
- MEMORY para recuperar decisiones, conocimiento y contexto.
- CONTINUIDAD para recuperar secuencia, eventos, checkpoints y estado de trabajo.
- ACS para inspeccionar capacidades y aportar evidencia experimental.

No debe crear otra memoria canónica, otro Event Store ni un motor geométrico paralelo.

### 6.2 Evidencia documental revisada

- `00_REVIVIR.md`
- `docs/revivir-arki/REGISTRO-MAESTRO-REVIVIR-ARKI.md`
- `arki-live-cycle.cjs`
- Servicios/timers y recibos asociados al proceso.
- PR #105 y sus dos commits documentales:
  - `7f25fa819994cb55eb2095fcd52a8a7d75383826`: actualiza `00-START.md`, rutas/HEADs/stack local y registra el fallo histórico `F6_REVOCATION_STATUS_CONFLICT`.
  - `562cb6f1fd3e29a3ceba7b483428e189a2f0469f`: añade `docs/ops/ARKI-E2E-CANONICAL-REPLICATE-20261027.md`, procedimiento de replicación E2E canónica.

Los dos commits son documentales/contextuales; no implementan por sí mismos MEMORY ni prueban cierre de REVIVIR ARKI.

### 6.3 Bloqueos de cierre

- Reconciliar el fallo histórico `F6_REVOCATION_STATUS_CONFLICT`: identificar evento, estado esperado, estado observado, autoridad de revocación y causa raíz.
- Repetir la prueba en entorno controlado y guardar recibo verificable.
- Confirmar que el proceso de reactivación opera en modo consultivo/experimental cuando corresponda.
- Verificar rollback y que no existan mutaciones canónicas no autorizadas.
- Inspeccionar `ExecStart`, `ExecStartPost`, timers y servicios efectivos en Arki-02; no inferir comportamiento desde nombres o documentación.
- Reconciliar estado del registro maestro con estado real del servidor.
- Declarar cierre solo con evidencia reproducible, SHA, timestamp, resultado y responsable.

### 6.4 Criterios de cierre P3

- [ ] Causa raíz de F6 documentada y aceptada.
- [ ] Reproducción controlada y prueba de corrección PASS.
- [ ] Secuencia de recuperación reconciliada con Core.
- [ ] MEMORY y CONTINUIDAD consumidas sin duplicar autoridad.
- [ ] Rollback probado.
- [ ] `canonicalMutation=false` donde el procedimiento exige modo no mutante.
- [ ] Ninguna escritura en AGK, D-2 o FROZEN fuera de autorización explícita.
- [ ] Servicios/timers efectivos inspeccionados en Arki-02.
- [ ] Registro maestro actualizado con recibos y evidencia.
- [ ] Aprobación explícita de cierre.

No se declara REVIVIR ARKI terminado por tener un timer, un snapshot, un handoff o una rama documental.

## 7. P0–P4: estado consolidado

| Fase | Resultado | Estado |
|---|---|---|
| P0 — Inventario y autoridad | Auditoría remota de Core, Web y ACS; límites de autoridad identificados | EXECUTED_REMOTE_AUDIT |
| P1 — Contrato MEMORY | Contrato lógico y criterios de aceptación redactados en este documento | PO_REVIEW_REQUIRED |
| P2 — Continuidad | Componentes Core/Web y CI observados; faltan E2E, restore real y Arki-02 | IMPLEMENTED_WITH_CI_EVIDENCE / ARKI02_E2E_PENDING |
| P3 — REVIVIR ARKI | Registro y procedimiento documentados; F6 pendiente de reconciliación y cierre | DOCUMENTED_IN_PROGRESS / CLOSURE_NOT_VERIFIED |
| P4 — Validación local | Requiere ejecución en Arki-02, no disponible desde esta auditoría remota | BLOCKED_ON_LOCAL_EXECUTION |

## 8. P4 — Secuencia de ejecución en Arki-02

La ejecución debe realizarse en ventana autorizada. No ejecutar comandos destructivos ni modificar datos de producción durante la fase de diagnóstico.

1. Registrar `git status --short --branch` y HEAD de los checkouts Core, Web y ACS. Detenerse si hay cambios locales, archivos no rastreados o divergencia; no resetear, limpiar, stash automático, rebase ni sobrescribir.
2. Registrar versiones de Node/Python, servicios, timers y estado de salud, sin imprimir secretos.
3. Verificar solo presencia de variables requeridas y permisos de directorios persistentes; nunca volcar valores secretos.
4. Ejecutar suite institucional MEMORY y continuidad de Core.
5. Ejecutar pruebas de outbox, proyección y backup/restore Web.
6. Ejecutar E2E Web → outbox → Core → secuencia/checkpoint → SYNCED.
7. Probar caída/recuperación de Core en ventana autorizada; comprobar PENDING_SYNC y posterior sincronización sin duplicados.
8. Restaurar backups en directorios aislados y verificar descifrado con las claves originales.
9. Ejecutar REVIVIR ARKI en modo consultivo/experimental; verificar rollback y ausencia de mutaciones canónicas no autorizadas.
10. Guardar timestamp, SHA, comando, exit code, IDs de evento, checkpoint, manifests y logs redactados.

**Prohibido:** `git reset --hard`, `git clean`, force push, rebase/merge automático, cambios en DB de producción, rotación improvisada de claves, modificaciones AGK/D-2/FROZEN o promover resultados ACS automáticamente.

## 9. Registro de deuda y trabajo pendiente

| ID | Dominio | Deuda / acción | Criterio de cierre |
|---|---|---|---|
| M-01 | MEMORY | Aprobar contrato y mapearlo a RFC-011/RFC-026 | Revisión y mapping aprobado |
| M-02 | MEMORY | Probar PII en texto libre y anonimización integral | Suite adversarial PASS |
| M-03 | MEMORY | Probar múltiples dimensiones, confianza y evidencia | Casos y trazas verificables |
| M-04 | MEMORY | Recuperación contextual con conflictos, vigencia y procedencia | Tests de retrieval PASS |
| C-01 | Continuidad | E2E HTTP Web → Core | Recibo E2E reproducible |
| C-02 | Continuidad | Core down/up e idempotencia bajo concurrencia | Sin pérdida ni duplicados |
| C-03 | Continuidad | Backup/restore real cifrado | Restore aislado y descifrado PASS |
| C-04 | Continuidad | Checkpoint/cursor y consistencia proyecto | Tests de secuencia PASS |
| R-01 | REVIVIR | Reconciliar F6_REVOCATION_STATUS_CONFLICT | Causa raíz y repetición PASS |
| R-02 | REVIVIR | Validar rollback, servicios y cierre | Recibos Arki-02 y aprobación |
| A-01 | ACS | Acreditar nivel real de aislamiento | Prueba reproducible por nivel |
| G-01 | Gobierno | Impedir autoridades paralelas y promoción automática | Revisión de arquitectura y controles |

## 10. Registro de versiones auditadas

SHAs de `main` observados durante la auditoría remota:

| Repositorio | SHA |
|---|---|
| `sicl-web` | `d8ed5f792289e661e9242e3563024317fc918f5b` |
| `sicl-core` | `ed0badefec748842bcc5ac94693052dd91c76b6a` |
| `arki-acs` | `302f63d7c66126b248f03432fc402a4a1be6a7a6` |

Los SHAs son una fotografía de auditoría, no una afirmación de que los checkouts locales de Arki-02 estén sincronizados con ellos.

### PR #105 — REVIVIR ARKI

- Estado observado: OPEN, NOT MERGED, `mergeable=false`.
- Base observada: `ab1132f6706c20511c2d0506dbd4c1329c7367a3`.
- Head observado: `ed85a15541907a1c95d380710d80aa6ed29eb7e2`.
- La base era anterior a `main` en la auditoría. Requiere reconciliación antes de considerar integración.
- No se recomienda mergear PR #105 como sustituto de los criterios de cierre P3.

## 11. Secuencia recomendada de ejecución

1. Revisar y aprobar P1 como contrato; no implementar campos/estados nuevos sin mapping y compatibilidad.
2. Cerrar C-01 a C-04 con pruebas automatizadas y evidencia reproducible.
3. Resolver R-01 y R-02 en entorno controlado; actualizar el registro maestro.
4. Ejecutar P4 en Arki-02 y adjuntar los recibos al PR correspondiente.
5. Solo después, emitir dictamen por dominio: MEMORY, CONTINUIDAD y REVIVIR ARKI por separado.

## 12. Reglas para mantener este documento

- Actualizar el SHA auditado y la fecha de corte en cada nueva auditoría.
- Cada afirmación de estado debe indicar si es DECLARED, IMPLEMENTED, EXECUTED, VERIFIED, BLOCKED o UNKNOWN.
- Adjuntar evidencia primaria: commit, workflow/run, test, log redactado, manifest o recibo.
- No convertir un CI verde en verificación de producción.
- No mezclar MEMORY, CONTINUIDAD y REVIVIR ARKI en un único estado.
- No cerrar deuda por documentación solamente si el criterio requiere ejecución.
- No crear motores, Event Stores o memorias canónicas paralelas.

---

**Conclusión:** existe una base técnica real para los tres dominios, pero no existe evidencia suficiente para declararlos cerrados. Este documento establece el contrato propuesto de MEMORY, el flujo/invariantes de CONTINUIDAD y los criterios de reconciliación de REVIVIR ARKI. La aceptación del PR debe revisar el contenido y los límites de autoridad; la validación final requiere evidencia local de Arki-02.
