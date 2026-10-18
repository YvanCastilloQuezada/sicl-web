# COCO-D — Auditoría de fundamentos de O&M

**Repositorio auditado:** `/home/ubuntu/generador-familias`  
**Fecha de auditoría:** 2026-09-23  
**Identificador:** `D`  
**Alcance:** fundamentos de operación y mantenimiento (O&M): activos, sistemas, O&M básico, órdenes de trabajo, historial, as-built y sensores.  
**Base de reutilización:** E8-B y contratos compartidos ya existentes.  
**Regla de alcance:** no se implementa O&M productivo, mantenimiento predictivo, telemetría, sensores ni un CMMS/ERP.

## 1. Dictamen ejecutivo

El repositorio contiene una **base E8-B real y reutilizable para O&M local-first**, pero no contiene un sistema productivo de gestión de instalaciones. E8-B implementa el recorrido mínimo **snapshot aprobado → activo BIM → garantía/manual → inspección → orden de trabajo → historial**, con persistencia IndexedDB y cuatro pruebas contractuales. La implementación está explícitamente limitada a un ciclo local, queda pendiente de revisión independiente y no demuestra restauración en un navegador real (`E8-B_REPORT.md:3-5, 40-50`; `E8_SCOPE_LIMITS.md:51-59`).

La auditoría clasifica **activos, órdenes de trabajo e historial como EXISTS/PARTIAL**: existen modelos, validaciones, stores y pruebas, pero faltan garantías de integridad operacional, eventos automáticos, relación con sistemas y contratos compartidos de contexto. El soporte de O&M es **PARTIAL**. Los **sistemas** y **sensores** son **MISSING como capacidad O&M**. El dominio **as-built es PARTIAL sólo como frontera documental/conceptual**: el contrato de Construction BIM separa evidencia de campo y modelo, y el servicio `AS_BUILT_BIM` está declarado no aprobado; no existe un flujo as-built productivo (`ARKI_CONSTRUCTION_BIM_WORKSPACE.md:1-3`; `shared/arkiProfessionalServiceWorkspaces.ts:3-5, 29-39`).

No se propone ni ejecuta código en esta auditoría. No se usan los exámenes ni artefactos conocidos de DeepSeek como fuente de evaluación. La evidencia utilizada procede de E8-B, sus fuentes compartidas, el código `shared/`, el cliente y documentación contractual del repositorio.

## 2. Método y estados utilizados

Se inspeccionaron archivos reales antes de formular cualquier brecha. Las etiquetas significan:

| Estado | Significado en esta auditoría |
|---|---|
| **EXISTS** | Hay código o contrato identificable que cubre el punto y existe evidencia directa en el repositorio. |
| **PARTIAL** | Hay una implementación o frontera contractual limitada, pero no cubre el fundamento completo o no está demostrada en producción. |
| **REUSABLE** | El artefacto existente puede reutilizarse sin cambiar su semántica central para una futura extensión COCO-D. |
| **EXTENDABLE** | El artefacto ofrece un punto de extensión claro, pero requiere un contrato adicional y validación; no implica implementación actual. |
| **MISSING** | No se encontró una entidad, flujo o evidencia productiva en las fuentes inspeccionadas. |
| **CONFLICT** | Dos contratos o capas existentes usan semánticas incompatibles o pueden producir una lectura ambigua. |
| **UNKNOWN** | El repositorio no demuestra el hecho; debe permanecer explícitamente desconocido, no inferirse. |

## 3. Matriz de capacidad COCO-D

| Área auditada | Clasificación | Evidencia real | Lectura técnica |
|---|---|---|---|
| **Activos** | **EXISTS / PARTIAL** | `shared/arkiOperationMaintenance.ts:9-23, 45-49`; `E8-B_REPORT.md:20-21` | Existe `Asset` con `id`, `elementId`, `snapshotId`, `version`, tipo, nombre, ubicación, fabricante/modelo opcionales, número de serie, fecha de instalación y vida útil. Se crea sólo desde snapshot aprobado y elemento existente. Es parcial porque el activo no contiene `projectId`, `systemId`, revisión canónica, estado operacional, evidencia común, applicability, scale ni autoridad humana. |
| **Garantías y manuales** | **EXISTS / PARTIAL** | `shared/arkiOperationMaintenance.ts:24-25, 51-59`; `client/src/persistence/arkiIndexedDb.ts:9-10` | Hay contratos, referencias documentales y stores separados. Las validaciones comprueban vínculo al activo, rango de garantía y referencias mínimas. No hay verificación de contenido, hash, revisión documental, vigencia común o provenance común. |
| **Inspecciones** | **EXISTS / PARTIAL** | `shared/arkiOperationMaintenance.ts:26, 61-64`; `scripts/test-e8b-assets.ts:28-34` | Existe inspección con fecha, inspector, resultado y evidencia opcional. Se prueba el registro básico. No hay catálogo de puntos de inspección, lecturas de sensores, severidad normalizada, aprobación profesional ni transición operacional gobernada. |
| **Sistemas** | **MISSING** como entidad O&M; **EXTENDABLE** por relaciones | No hay `System`/`systemId` en `Asset` ni en el contrato O&M (`shared/arkiOperationMaintenance.ts:9-30`). El fabric sí reconoce escala `SYSTEM`, disciplina y `CONNECTS_TO` (`shared/arkiRelationshipFabric.ts:1-7, 28-52, 67-72`). | La ontología relacional permite expresar relaciones entre entidades, pero no existe un modelo de sistema mantenible, jerarquía sistema-componente, disciplina operativa, criticidad, límites, responsables ni inventario de componentes. No debe confundirse la capacidad relacional genérica con un módulo de sistemas O&M. |
| **O&M básico** | **PARTIAL** | `E8-B_REPORT.md:7-21, 48-52`; `E8_CONTRATO_PROPUESTO_V1.md:50-66` | El ciclo mínimo local-first está implementado y probado. No es CMMS/ERP, no tiene backend productivo, multiusuario, notificaciones, reportes PDF, firma digital ni competencia profesional de mantenimiento. |
| **Work orders** | **EXISTS / PARTIAL** | `shared/arkiOperationMaintenance.ts:27-30, 66-77, 92-94`; `scripts/test-e8b-assets.ts:30-36, 46-53` | Existe orden preventiva/correctiva, estados `open/in_progress/closed/cancelled`, responsable, fechas y descripción, además de apertura/cierre y persistencia. La función de cierre valida existencia, activo y orden temporal, pero no devuelve ni persiste una transición; el store permite `saveWorkOrder` directo. No hay prioridad, causa, recursos, repuestos, SLA, permisos, coste, seguridad, adjuntos o evidencia común. |
| **Historial** | **EXISTS / PARTIAL** | `shared/arkiOperationMaintenance.ts:30, 79-80, 94-95, 139-140`; `scripts/test-e8b-assets.ts:37-44, 53-61` | Existe historial por activo y ordenamiento determinista por `timestamp` y `refId`. El caso probado construye manualmente tres entradas y las guarda. No existe una bitácora inmutable o automática que capture todas las mutaciones; la persistencia IndexedDB permite sobrescritura por clave y no aplica una cadena de auditoría al historial O&M. |
| **As-built** | **PARTIAL como frontera, MISSING como flujo productivo** | `ARKI_CONSTRUCTION_BIM_WORKSPACE.md:1-3`; `shared/arkiProfessionalServiceWorkspaces.ts:32-37` | El repositorio expresa correctamente que fotos/notas son evidencia de campo y no hechos as-built automáticos. `AS_BUILT_BIM` es servicio conceptual, no aprobado, con evidencia y verificación futuras. No existe reconciliación diseño-aprobado-campo-modelo, revisión de fidelidad, aceptación de cambios construidos ni expediente as-built operativo. |
| **Sensores / telemetría** | **MISSING** | No se encontró entidad, store, API, ingesta, lectura, unidad, calidad, timestamp de medición, dispositivo o gateway de sensores en `shared/`, `client/`, `server/` y `scripts/` inspeccionados. | No hay base para monitoreo en tiempo real ni para mantenimiento predictivo. Las inspecciones y `evidenceRef` de E8-B no son telemetría. |
| **Mantenimiento predictivo** | **MISSING y fuera de alcance** | `E8-B_REPORT.md:48-50`; `E8_SCOPE_LIMITS.md:22-37` | No se implementa ni se debe inferir desde inspecciones, historial o `usefulLifeYears`. No hay series temporales, modelos de condición, umbrales, predicción, alertas o decisión automática. |

## 4. Reutilización específica de E8-B

### 4.1 Reusable

1. **Contrato de activo vinculado al modelo.** `createAssetFromElement` requiere snapshot aprobado, aprobación con responsable y fecha, y existencia del elemento; el identificador se deriva determinísticamente de schema, snapshot y elemento (`shared/arkiOperationMaintenance.ts:32-49`). Es reutilizable como base de identidad modelo → activo.
2. **Stores local-first separados.** La separación `assets`, `warranties`, `manuals`, `inspections`, `workOrders` y `assetHistory` está documentada y materializada en IndexedDB (`shared/arkiOperationMaintenance.ts:4-7`; `client/src/persistence/arkiIndexedDb.ts:6-11`). Es una buena frontera para preservar O&M básico sin mezclarlo con snapshots.
3. **Pruebas E8-B y outputs crudos.** E8B-01 a E8B-04 cubren rechazo de snapshot no aprobado, elemento inexistente, ciclo básico y reapertura contractual mediante `fake-indexeddb` (`E8-B_OUTPUTS.txt:2-21`). Son evidencia reutilizable de regresión, no evidencia de operación productiva.
4. **Identidad de proyecto, snapshot y versión en persistencia general.** `ArkiSnapshot`, `ArkiVersion`, `ArkiProject` y `ArkiSession` contienen `projectId`, versión, snapshot y esquema (`shared/persistence/arkiPersistence.ts:27-79`). El contrato O&M puede referenciar esta base, pero hoy `Asset` no la consume directamente.
5. **Provenance y determinismo de snapshots.** `ProjectSnapshot.provenance`, `sourceVersion`, `generatedAt` y `stableHash` proveen una base de derivación determinista (`shared/arkiRecalculation.ts:58-99`). Esta base debe conservarse sin convertir el historial de O&M en una copia informal del snapshot.
6. **Relaciones con evidencia, escala, disciplina y revisión.** `RelationshipRecord` incluye evidencia, provenance, estado epistémico, `projectVersion`, fechas, scenario y applicability scale; sus IDs y revision IDs son deterministas (`shared/arkiRelationshipFabric.ts:28-52, 75-89`). Es reusable para enlazar activo–sistema y activo–documento cuando exista un contrato O&M explícito.
7. **Repositorio canónico y persistencia durable.** `CanonicalProjectRevision` y `CanonicalDurablePersistence` ya modelan `projectId`, `revisionId`, padre, transacción, fingerprint, provenance, actor, authority, estado y auditoría (`shared/arkiCanonicalProjectRepository.ts:9-22`; `shared/arkiCanonicalPersistence.ts:35-49, 72-99`). Es la base reusable para cambios O&M gobernados; no está conectada hoy a las funciones E8-B.
8. **Human Authority y fail-closed.** El gate rechaza actor IA, exige snapshot aprobado, evidencia por criterio y firma profesional (`shared/arkiProjectGate.ts:36-49, 81-125`). Esta semántica es reusable para decisiones materiales de mantenimiento, pero no está integrada al ciclo de órdenes E8-B.

### 4.2 Extendable, sin implementación autorizada en esta auditoría

| Punto de extensión | Motivo |
|---|---|
| `Asset` | Puede extenderse con `projectId`, `systemId`, referencias de revisión, provenance y estado epistémico, siempre que se defina compatibilidad de esquema. |
| `RelationshipFabric` | Puede expresar `ASSET_PART_OF_SYSTEM`, `ASSET_SERVES_SYSTEM`, `DOCUMENT_APPLIES_TO_ASSET` o equivalentes, pero cada tipo requiere definición, evidencia mínima, escalas permitidas y revisión. |
| `CanonicalDurablePersistence` | Puede envolver cambios O&M transaccionales con CAS, idempotencia, fingerprint y auditoría, en vez de escribir órdenes directamente. |
| `JobEvidenceLedger` y `TraceabilityLink` | Ofrecen una base de ledger de evidencia y trazabilidad de fuentes, pero no son todavía contratos del dominio O&M. |
| Stores IndexedDB de versión 4 | Ya incluyen stores O&M y canónicos en `shared/persistence/arkiPersistence.ts:3-20`; esto facilita convergencia, pero existen dos capas de persistencia con contratos diferentes. |

## 5. Contratos compartidos requeridos por COCO-D

La auditoría no encuentra un único contrato que reúna todos los campos solicitados. El estado por contrato es el siguiente.

| Contrato | Estado | Evidencia y limitación |
|---|---|---|
| **provenance** | **EXISTS / CONFLICT** | `ProvenanceRecord` de snapshots contiene entidad, tipo, acción, causa, snapshot y timestamp (`shared/arkiRecalculation.ts:58-65`). `TransactionProvenance` contiene source, actorId, evidenceRefs y transformations (`shared/arkiTransactionEngine.ts:12, 58-69`). `RelationshipProvenance` usa source, adapter y transformations (`shared/arkiRelationshipFabric.ts:25-26`). Son tres formas válidas para contextos distintos, pero no unificadas; reutilizar una sin adaptador produciría ambigüedad. |
| **evidence** | **EXISTS / PARTIAL** | `RelationshipEvidence` clasifica fixture, calculation, source, human_review y legacy; el contrato transaccional usa `evidenceRefs`; E8-B usa `documentRef` y `evidenceRef` simples. Falta un envelope común con ID, tipo, hash, fuente, fecha, revisión, alcance y autoridad. |
| **UNKNOWN** | **EXISTS en capas generales / MISSING en O&M** | Existe `EpistemicStatus.UNKNOWN` en relaciones y estados `UNKNOWN` en transacciones/workspaces (`shared/arkiRelationshipFabric.ts:4, 44`; `shared/arkiTransactionEngine.ts:4-10`; `shared/arkiProfessionalServiceWorkspaces.ts:5-10`). `Asset`, `Inspection`, `WorkOrder` y `AssetHistoryEntry` no tienen estado epistémico ni unknowns. |
| **applicability** | **EXISTS / EXTENDABLE** | `RelationshipRecord.applicabilityScale` es explícito (`shared/arkiRelationshipFabric.ts:37-39`). No existe campo equivalente en activos, órdenes, inspecciones o documentos O&M. |
| **scale** | **EXISTS / EXTENDABLE** | `RelationshipScale` cubre component/object/activity/space/system/building/site y más (`shared/arkiRelationshipFabric.ts:5, 54`). El contrato O&M no declara escala del activo, sistema u orden. |
| **time** | **PARTIAL** | Hay `timestamp`, `validFrom`, `validTo`, fechas de instalación, garantía, inspección, apertura y cierre. No hay un tipo temporal común que defina zona horaria, precisión, intervalo de validez, tiempo de medición versus tiempo de registro o reloj confiable. |
| **scenario** | **PARTIAL** | `RelationshipRecord.scenario` es opcional (`shared/arkiRelationshipFabric.ts:45-49`). O&M no diferencia escenario de diseño aprobado, construido, operación normal, contingencia o mantenimiento. |
| **projectId** | **EXISTS / CONFLICT** | Está presente en snapshots, proyectos, sesiones, versiones y persistencia canónica (`shared/persistence/arkiPersistence.ts:27-79`; `shared/arkiCanonicalProjectRepository.ts:9-22`). No está presente en `Asset`, `Warranty`, `Manual`, `Inspection`, `WorkOrder` ni `AssetHistoryEntry`; estos dependen indirectamente de `snapshotId` o `assetId`. |
| **revision** | **EXISTS / CONFLICT** | Existen `revisionId`, parent, historial canónico y `relationshipRevisionId`; el activo usa `version: number` y el snapshot usa `version: number`. No hay un puente formal entre la revisión canónica del proyecto y la versión del activo/orden. |
| **determinism** | **EXISTS / PARTIAL** | `stableHash`, IDs de relación, IDs de activo y ordenamiento de historial son deterministas (`shared/arkiRecalculation.ts:92-100`; `shared/arkiOperationMaintenance.ts:48, 79-80`; `shared/arkiRelationshipFabric.ts:75-79`). La apertura de gate usa por defecto `new Date()` y el store O&M no fingerprinta registros; por eso la determinación no es transversal. |
| **Human Authority** | **EXISTS / PARTIAL** | E8-B exige aprobación humana del snapshot; el gate rechaza actor IA y exige firma profesional (`shared/arkiOperationMaintenance.ts:34-37`; `shared/arkiProjectGate.ts:81-125`). El activo y la orden no llevan `authority`, decisión humana, aprobador ni firma; una orden puede guardarse directamente. |

## 6. Conflictos y riesgos de contrato

1. **Dos versiones de base de datos y dos capas de creación de stores.** `shared/arkiOperationMaintenance.ts` declara `ARKI_OM_DB_VERSION = 3` y sólo seis stores O&M (`líneas 4-7, 99-105`), mientras `shared/persistence/arkiPersistence.ts` declara `ARKI_PERSISTENCE_VERSION = 4` con stores O&M, canónicos, transacciones e idempotencia (`líneas 3-20`) y el cliente abre versión 4 (`client/src/persistence/arkiIndexedDb.ts:4-11`). Ambos apuntan a `arki-local-first`. Esto es un **CONFLICT** operativo de ownership/versionado: el mismo nombre de base se abre con contratos de esquema diferentes.
2. **Estado de aprobación incompatible.** E8-B consume `snapshot.approval.gateStatus === "passed"` y exige `approvedBy/approvedAt` (`shared/arkiOperationMaintenance.ts:32-37`), mientras `ArkiSnapshot` usa `gateStatus: "draft" | "approved"` (`shared/persistence/arkiPersistence.ts:22, 27-35`). Es un **CONFLICT** de vocabulario que requiere adaptador explícito; no debe resolverse por coerción silenciosa.
3. **Identidad indirecta de proyecto.** Los activos se identifican por `snapshotId` y `elementId`, pero no por `projectId`; la persistencia canónica exige `projectId`. Es un **CONFLICT** de particionado y seguridad de datos: un activo no puede demostrar aislamiento de proyecto sólo con su contrato E8-B.
4. **Historial manual versus auditoría canónica.** E8-B permite guardar `AssetHistoryEntry` directamente. La persistencia canónica exige revisión, transactionId, fingerprint, provenance y authority. Es un **CONFLICT** semántico entre evento O&M simple y cambio canónico gobernado.
5. **Provenance no uniforme.** Snapshot, transacciones y relaciones usan shapes diferentes. Es **CONFLICT** si un consumidor trata `source`, `sourceSnapshotId` y `evidenceRefs` como intercambiables.
6. **Evidencia documental no equivalente a evidencia operacional.** `documentRef`/`evidenceRef` son strings no verificadas; `RelationshipEvidence` exige clasificación, pero no se usa en E8-B. Es **PARTIAL** y puede convertirse en afirmación falsa si una referencia se presenta como evidencia validada.

## 7. Gaps críticos

- **GAP-D01 — Entidad de sistema:** no hay `System`, jerarquía, disciplina operativa, criticidad, función, composición ni vínculo sistema-activo.
- **GAP-D02 — Contexto completo del activo:** faltan `projectId`, revisión canónica, estado epistémico, applicability, scale, scenario y provenance/evidence común.
- **GAP-D03 — Ciclo de vida de work order:** faltan transiciones gobernadas, permisos, historial automático, prioridad, severidad, causa, recursos, repuestos, seguridad y aceptación de cierre.
- **GAP-D04 — Historial inmutable:** el historial se guarda como registros simples y no como ledger append-only con hash/fingerprint y autoridad.
- **GAP-D05 — Evidencia:** no existe envelope común con identidad, hash, fuente, tipo, fecha, revisión, aplicabilidad y revisión humana.
- **GAP-D06 — As-built:** no existe flujo de reconciliación de evidencia de campo con modelo, ni aceptación profesional de estado construido.
- **GAP-D07 — Sensores:** faltan dispositivo, punto, lectura, unidad, calidad, intervalo, timestamp de medición, ingestión, retención y seguridad.
- **GAP-D08 — Predicción:** no existen series temporales, features, modelos, umbrales, alertas o explicabilidad; queda explícitamente fuera de COCO-D.
- **GAP-D09 — Persistencia:** no hay un owner único entre `arkiOperationMaintenance.ts` versión 3 y la persistencia general versión 4.
- **GAP-D10 — Prueba productiva:** `fake-indexeddb` demuestra el contrato de persistencia, pero E8-B declara que no se demostró restauración en navegador real (`E8-B_REPORT.md:40-42`; `E8_SCOPE_LIMITS.md:53-57`).
- **GAP-D11 — Human Authority:** el gate general existe, pero las mutaciones O&M no lo invocan ni almacenan decisión humana.

## 8. Conclusión por objeto auditado

| Objeto | Veredicto COCO-D |
|---|---|
| Activo BIM/O&M | **EXISTS / PARTIAL**. Reutilizable para el fundamento local-first; no suficiente para un inventario productivo multi-sistema. |
| Sistema | **MISSING / EXTENDABLE**. Hay fabric relacional genérico, no entidad O&M. |
| O&M | **PARTIAL**. E8-B cubre un ciclo mínimo documentado y probado. |
| Work order | **EXISTS / PARTIAL**. Hay tipos, validaciones básicas y persistencia; falta workflow gobernado. |
| Historial | **EXISTS / PARTIAL**. Hay historial ordenado y persistido; falta inmutabilidad y captura automática. |
| As-built | **PARTIAL como contrato de frontera; MISSING como producto**. La separación de evidencia es correcta y el servicio está no aprobado. |
| Sensores | **MISSING**. No se encontró implementación ni contrato O&M de telemetría. |
| Mantenimiento predictivo | **MISSING / fuera de alcance**. No debe implementarse ni inferirse en COCO-D. |

## 9. Decisión de auditoría

**Estado general: PARTIAL — reutilización de E8-B autorizable sólo como fundamento, no como O&M productivo.** La base más segura para una futura extensión es conservar la identidad modelo → activo, el almacenamiento separado, los estados UNKNOWN visibles, el fabric relacional, la persistencia canónica, los fingerprints deterministas y la Human Authority. Antes de cualquier código futuro debe resolverse el conflicto de versionado/ownership de IndexedDB y aprobarse un contrato común de provenance/evidence/contexto. Esta auditoría no implementa ninguna de esas extensiones.

## 10. Fuentes internas inspeccionadas

- `E8-B_REPORT.md`
- `E8-B_OUTPUTS.txt`
- `E8_SCOPE_LIMITS.md`
- `E8_DEBT_INHERITED.md`
- `E8_MANIFEST.json`
- `E8_CONTRATO_PROPUESTO_V1.md`
- `shared/arkiOperationMaintenance.ts`
- `shared/persistence/arkiPersistence.ts`
- `client/src/persistence/arkiIndexedDb.ts`
- `scripts/test-e8b-assets.ts`
- `shared/arkiRecalculation.ts`
- `shared/arkiRelationshipFabric.ts`
- `shared/arkiTransactionEngine.ts`
- `shared/arkiCanonicalProjectRepository.ts`
- `shared/arkiCanonicalPersistence.ts`
- `shared/arkiProjectGate.ts`
- `shared/arkiTechnicalDossierCompiler.ts`
- `ARKI_CONSTRUCTION_BIM_WORKSPACE.md`
- `shared/arkiProfessionalServiceWorkspaces.ts`

**Nota de evidencia:** los documentos y líneas citadas son archivos del repositorio real. No se modificó código de producto ni se ejecutó una implementación de O&M, sensores o mantenimiento predictivo.
