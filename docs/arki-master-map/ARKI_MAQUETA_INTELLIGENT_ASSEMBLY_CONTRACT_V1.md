# ARKI Maqueta Viva — Contrato V1 de ensamblaje inteligente y sincronización

**Estado:** DESIGN_PROPOSED / NOT_IMPLEMENTED. **Rama:** `feat/f7-f8-integral-closure`.
**Alcance:** hoja de ruta oficial + escenarios alternativos + descubrimiento incremental de ideas/estados. Este contrato NO habilita cambios canónicos ni promete sincronización remota automática.

## 1. Autoridades y precedencia

1. `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json`: estados oficiales y evidencia limitada al corte local.
2. `docs/arki-master-map/ARKI_TEN_PHASE_PRODUCT_INTEGRATION_ROADMAP_V1.md`: significado y secuencia de las diez fases, puertas y dependencias.
3. Contratos aprobados, decisiones humanas, CI exacto, SHA, pruebas y evidencias: autoridad sobre capacidades concretas, respetando su alcance.
4. `tools/maqueta-viva/assembly-registry.json`: inventario de ideas/componentes **histórico y provisional**, no fuente canónica de integración.
5. `localStorage` / JSON exportado: borrador de distribución, relaciones y fichas, nunca autoridad de roadmap.

Conflicto entre fuentes => `CONFLICT_REQUIRES_RECONCILIATION`, nunca resolución silenciosa. No inferir que la fecha de una fuente más nueva vuelve canónico su contenido. No sobrescribir un contrato FROZEN.

## 2. Fases: nombres oficiales (roadmap V1)

- F1 — Identity, Trust & Project State.
- F2 — Knowledge & University (M0-K, D6.1, Delta 6.2, ARKI Book, tutoría, evaluación del aprendizaje).
- F3 — Architectural Intelligence (D6.2 reasoning, agentes, estrategias, déficit, jurisdicción y semántica).
- F4 — Parti, Topology & Generative Exploration.
- F5 — Evaluation & Design Funnel.
- F6 — AGK / 3D Constructive Spine.
- F7 — Professional Technical Development.
- F8 — Super Technical Dossier & Delivery.
- F9 — Construction, Field & Digital Twin.
- F10 — Operations, Learning Loop & Economic Ecosystem.

La columna vertebral de cada fase representa **hitos estructurales propuestos** hasta que se tracen a puertas oficiales verificables. No usar la expresión «ruta crítica calculada» sin dependencias y duraciones suficientes.

## 3. Modelo de una pieza

Campos mínimos:
- `piece_id` estable, `kind` (IDEA, CAPABILITY, ACTIVITY, CONTRACT, EVIDENCE, BLOCKER, FROZEN_REFERENCE), `title`, `description`.
- `source_ref`, `source_revision`, `source_date`, `discovered_at`, `last_seen_at`, `source_authority`.
- `historical_status`, `current_evidence_status`, `frozen_scope`, `frozen_contract_ref` cuando aplique.
- `candidate_primary_phase`, `candidate_milestone`, `secondary_phase_refs`, `phase_reasoning`, `unknowns`, `confidence_class` (SUPPORTED, PROPOSED, UNKNOWN).
- `dependencies`: aristas tipadas (REQUIRES, PRODUCES_FOR, BLOCKS, EVIDENCE_GATE, CROSS_PHASE, CONFLICTS_WITH), con `evidence_ref`, `status` (VERIFIED, PROPOSED, UNKNOWN) y `origin`.
- `promotion_state`: CAPTURED → UNDER_REVIEW → PRIORITIZED → SCHEDULED → IN_DEVELOPMENT → IMPLEMENTED → VERIFIED → INCORPORATED, o FROZEN/REJECTED/UNKNOWN cuando esté justificado.

Una pieza tiene una identidad y una fase primaria **propuesta**; puede tener referencias transversales en otras fases, sin duplicar el objeto.

## 4. Motor de propuesta de ensamblaje

Para cada novedad:
1. Resolver identidad y procedencia; si no es posible, crear candidato aislado `UNKNOWN_IDENTITY`.
2. Extraer función, entradas, salidas, restricciones, dependencias, contratos y evidencia.
3. Generar **hasta tres** ubicaciones candidatas: fase/hito, relaciones, razones a favor/en contra y pruebas faltantes.
4. Comparar con la hoja de ruta V1, puertas, semántica D-2, autoridad AGK y estados FROZEN.
5. No mover automáticamente una pieza que ya fue colocada por el usuario; ofrecer `KEEP / MOVE_IN_SCENARIO / REVIEW_CONFLICT`.
6. Prohibir autopromoción de IDEA a KNOWLEDGE, de geometría propuesta a geometría operacional, o de pieza ubicada a INTEGRATED.
7. Rechazar ciclos en dependencias `REQUIRES` y mostrar conflictos transversales; otras relaciones tipadas no implican precedencia temporal.
8. Cuando no exista evidencia suficiente, emitir `UNKNOWN` y camino de resolución. No inventar porcentajes de confianza.

## 5. Rutas oficiales y alternativas

- `OFFICIAL`: vista derivada de fuentes canónicas; **read-only**. Sus hitos, estados y FROZEN no se editan desde Maqueta Viva.
- `SCENARIO_A/B/C`: ramas locales aisladas con `base_state_revision`, `base_registry_revision`, piezas, asignaciones, conexiones, razones y eventos. Crear un escenario no crea una rama Git ni altera código.
- `DIFF`: piezas nuevas/retiradas, movimientos F#, relaciones nuevas/eliminadas, cambios de hito, conflictos FROZEN y gates sin evidencia.
- `PROMOTION_REQUEST`: exporta propuesta + trazabilidad + evidencia a flujo humano/auditoría; jamás escribe directamente al estado oficial.

## 6. Sincronización incremental (offline first)

**Actual:** el lanzador Windows lee `ARKI_MASTER_MAP_STATE.json` y `assembly-registry.json` del repositorio local al abrir, pero **no descubre automáticamente** nuevos registros dispersos de GitHub. La página HTML generada es una instantánea; el borrador local se conserva aparte.

**A implementar:** generador local determinista, ejecutado antes de crear `index.html`, que inspeccione **fuentes explícitamente permitidas** del repositorio local y emita `maqueta-discovery-manifest.json` con hashes/IDs/estados/procedencia. No requerir red para abrir. `git pull` o sincronización de Git remota sería un proceso aparte, explícito y auditable; no asumir conexión automática.

Flujo:
1. Leer manifiesto anterior + fuentes permitidas + HEAD/estado del working tree si está disponible.
2. Emitir eventos `ADDED / MODIFIED / STATUS_CHANGED / FROZEN_ADDED / FROZEN_CHANGED / REMOVED_FROM_SOURCE / CONFLICT / UNCHANGED` con `before`, `after`, `source_ref`, `hash`.
3. No borrar registros por ausencia en una fuente; marcar `REMOVED_FROM_SOURCE` pendiente de revisión.
4. Una declaración FROZEN nueva aparece automáticamente como referencia protegida. Si cambia un artefacto congelado, `FROZEN_CHANGED` es alerta de integridad, **nunca actualización silenciosa**.
5. Inyectar novedades en bandeja `POR CLASIFICAR` y mostrar sugerencias fase/hito/espinas; mantener borradores locales y rutas alternativas sin sobreescribir.
6. En caso de fuente inaccesible, manifiesto inválido, cambios de esquema o conflicto, `SYNC_PARTIAL / UNKNOWN` y último corte conocido. Sin falso verde.
7. Mostrar en pantalla `snapshot_date`, `source_revision`, `last_local_scan`, conteos de novedades/conflictos, y si la fuente remota fue consultada o no.

## 7. Puertas de aceptación mínimas

- F1–F10 exactamente; significado oficial F2 = Knowledge & University.
- Una pieza histórica puede aparecer en varias fases por relaciones, pero solo una identidad; sin duplicaciones.
- Idea nueva local => bandeja `POR CLASIFICAR`; clasificación propuesta no altera `OFFICIAL`.
- FROZEN nuevo => visible; cambio de contenido congelado => alerta, nunca sobreescritura.
- Estado canónico cambiado => vista oficial actualizada en nuevo lanzamiento, sin perder escenario local.
- Conflicto entre inventario histórico y evidencia reciente => `UNKNOWN/CONFLICT`, no reconciliación automática.
- Export/import conserva IDs, relaciones, escenario, fuente y procedencia.
- Pruebas adversariales: ciclo, identidad duplicada, fuente ausente, hash cambiado, estado degradado, revisión obsoleta, pieza eliminada de fuente, dependencia cruzada.
- E3 Windows/browser y verificación del repositorio exacto antes de declarar `VERIFIED`.

## 8. Secuencia de implementación sin deuda

1. **S1:** alinear etiquetas/hitos F1–F10 con roadmap y mostrar autoridad/procedencia de cada hito (F2 alineada en plantilla).
2. **S2:** generador de manifiesto local, detección incremental, bandeja novedades/FROZEN y pruebas de idempotencia.
3. **S3:** motor explicable de propuesta de fase/hito/relaciones; abstención ante UNKNOWN.
4. **S4:** escenarios A/B/C, comparación y solicitudes de promoción protegidas.
5. **S5:** relaciones transversales y puertas de evidencia, reconciliación de conflictos y auditoría E3.

**No se modifica el roadmap canónico, Core, D-2, AGK, contratos FROZEN ni main por este documento.**
