# COCO-C — Auditoría de fundamentos de avatar

**Repositorio auditado:** `/home/ubuntu/generador-familias`  
**Alcance:** fundamentos de avatar: `SceneModel`, Three.js, glTF/GLB, rig, animación, percepción, OCR, AR y Human Authority.  
**Tipo de revisión:** inspección estática de archivos reales del repositorio; no se construyó avatar productivo, no se ejecutaron implementaciones y no se usaron servicios externos.  
**Exclusión explícita:** se excluyeron del razonamiento los exámenes y artefactos conocidos de DeepSeek (`DEEPSEEK*`, `deepseek` y materiales equivalentes); no son evidencia de esta auditoría.

## 1. Dictamen ejecutivo

El repositorio contiene un fundamento **BIM/escena 3D interactiva**, no un fundamento de avatar humano. `SceneModel` está implementado como un modelo de nodos constructivos con cajas (`wall`, `door`, `window`, `space`, etc.); el visor usa `@react-three/fiber`, `@react-three/drei` y `three`, con cámaras, luces, rejilla, selección, filtros, snapshots, viewpoints y comparación. Esto permite reutilizar parte de la infraestructura de escena y de gobernanza, pero no constituye un pipeline de avatar.

No se encontró en el código activo un importador/exportador glTF o GLB, un asset humano, un esqueleto, un `SkinnedMesh`, un `AnimationMixer`/`AnimationClip`, un retargeting, un detector de pose, una canalización de percepción, OCR o WebXR/AR. La presencia de `three` y `web-ifc` en `package.json` demuestra disponibilidad de dependencias de render/IFC, no la existencia de esas capacidades.

Los contratos de gobernanza son el activo más reutilizable: `TransactionProvenance`, `evidenceRefs`, estados `UNKNOWN`, `projectId`, revisiones, huellas, idempotencia, escalas, applicability, scenario y autoridad canónica (`SYSTEM_PROPOSED`, `HUMAN_AUTHORIZED`, `SYSTEM_EXECUTED`). Sin embargo, esos contratos no están conectados al `SceneModel` ni a una entidad/avatar. Hay una inconsistencia concreta: `SceneModel3D` conserva `scene.projectId`, pero guarda snapshots y viewpoints usando el literal `"active-project"`; eso puede mezclar evidencia entre proyectos.

**Resultado global COCO-C:** fundamentos gráficos reutilizables y extendibles; avatar productivo, glTF/GLB, rig, animación, percepción, OCR y AR faltantes; gobernanza parcialmente existente pero no integrada al dominio avatar. Cualquier construcción futura debe comenzar por contratos y trazabilidad, no por un mesh humano aislado.

## 2. Criterio de estados

| Estado | Significado aplicado en este informe |
|---|---|
| **EXISTS** | Evidencia directa de implementación o contrato en archivos activos inspeccionados. |
| **PARTIAL** | Hay una parte demostrable, pero faltan propiedades, integración o garantías necesarias para el dominio avatar. |
| **REUSABLE** | Se puede reutilizar sin cambiar su propósito esencial; se señalan límites. |
| **EXTENDABLE** | Tiene una seam/abstracción razonable para extender, pero requeriría diseño y código nuevo. |
| **MISSING** | No se encontró evidencia implementada en el alcance inspeccionado. |
| **CONFLICT** | Dos contratos, identificadores o comportamientos existentes se contradicen o pueden producir resultados inválidos. |
| **UNKNOWN** | No hay evidencia suficiente para afirmar presencia, ausencia operacional, compatibilidad o garantía. |

## 3. Evidencia primaria inspeccionada

| Archivo | Evidencia relevante |
|---|---|
| [`shared/arkiSceneModel.ts`](../../shared/arkiSceneModel.ts) | `SceneNode` con id, kind, category, level, posición, dimensiones, rotación Y, color, opacity, selección y `relatedIds`; `SceneModel` versión `ARKI-SCENE-MODEL-1.0`, `projectId`, nodos, niveles y bounds. Conversión desde `ConstructionModel`. |
| [`client/src/canvas/SceneModel3D.tsx`](../../client/src/canvas/SceneModel3D.tsx) | `Canvas`, `OrbitControls`, cámaras ortográfica/perspectiva, cajas `boxGeometry`, selección, filtros, capturas PNG+SHA-256, snapshots, viewpoints y comparación. |
| [`package.json`](../../package.json) | Dependencias `three`, `@react-three/fiber`, `@react-three/drei`, `web-ifc`; no evidencia de un loader glTF/GLB, OCR, pose/percepción o WebXR dedicado. |
| [`shared/persistence/arkiPersistence.ts`](../../shared/persistence/arkiPersistence.ts) | `ArkiSnapshot`, `ArkiViewpoint`, `ArkiProject`, `ArkiVersion`, `FormalSnapshot`, hash y audit chain. |
| [`shared/arkiTransactionEngine.ts`](../../shared/arkiTransactionEngine.ts) | `TransactionProvenance`, estados `UNKNOWN`/`AWAITING_HUMAN_DECISION`/`AUTHORIZED`, `projectId`, `baseProjectVersion`, transiciones y validación de evidencia. |
| [`shared/arkiCanonicalProjectRepository.ts`](../../shared/arkiCanonicalProjectRepository.ts) | revisiones encadenadas, `projectId`, `revisionId`, `timestamp`, `stateFingerprint`, provenance, actor y autoridad canónica. |
| [`shared/arkiCanonicalPersistence.ts`](../../shared/arkiCanonicalPersistence.ts) | persistencia durable, SHA-256, commit CAS, audit, idempotencia, recuperación y clasificación `UNKNOWN_RECOVERY_REQUIRED`. |
| [`shared/arkiRelationshipFabric.ts`](../../shared/arkiRelationshipFabric.ts) | evidencia, provenance, epistemología `UNKNOWN`, escalas, disciplinas, `projectVersion`, `validFrom`/`validTo`, `scenario`, relaciones estables y revisiones. |
| [`shared/arkiConstraintEngine.ts`](../../shared/arkiConstraintEngine.ts) | `ApplicabilityCondition`, escalas, disciplinas, fase, tipo de proyecto, `scenario`, validez temporal, evidencia, provenance y evaluación `UNKNOWN`. |
| [`shared/ifc4/arkiIfc4.ts`](../../shared/ifc4/arkiIfc4.ts), [`shared/ifc4/webIfcAdapter.ts`](../../shared/ifc4/webIfcAdapter.ts) | IFC4 textual/Web-IFC, round-trip de identidad y reporte de pérdida; no glTF/GLB. |
| [`shared/arki4d/index.ts`](../../shared/arki4d/index.ts) | actividades, duración, predecesores y ruta crítica; soporte de tiempo de planificación, no tiempo de animación. |
| [`shared/arki5d/index.ts`](../../shared/arki5d/index.ts) | cantidades, precios y presupuesto; no soporte de avatar. |

## 4. Matriz COCO-C por capacidad

### 4.1 SceneModel y representación espacial

**Estado: EXISTS + REUSABLE + EXTENDABLE; PARTIAL para avatar.**

Existe un contrato concreto y probado de escena BIM. `SceneNode` es suficientemente explícito para un render estático: identidad, categoría, nivel, posición tridimensional, dimensiones, rotación Y, color, opacidad, selección y relaciones. `sceneModelFromConstruction` genera nodos para muros, espacios y elementos estructurales; `SceneModel3D` los monta en un `Canvas` y sincroniza selección con el contexto BIM.

Es reutilizable como **escena anfitriona**, coordenadas, bounds, capas, selección y relaciones. Es extendible mediante nuevos tipos de nodo o una capa de representación separada. No debe tratarse como contrato de avatar sin una extensión de dominio: no tiene transform local/global jerárquico, parent/child, joints, bind pose, skin weights, materiales PBR, morph targets, clips, locomoción, orientación semántica del cuerpo, anclajes humano-escena ni unidad/convención formal de coordenadas para assets externos.

**Limitaciones observadas:** el cálculo de bounds usa máximos positivos de posición más media dimensión; no conserva mínimos ni garantiza encuadre correcto para geometría con coordenadas negativas. `SceneNode` mezcla datos semánticos y de presentación (`color`, `opacity`) y no tiene `revision`, `evidence` o `provenance`. El `level * 3.6` es una convención fija de altura, no una calibración de avatar o de escala real verificable.

### 4.2 Three.js / render 3D

**Estado: EXISTS + REUSABLE + EXTENDABLE; PARTIAL para avatar.**

`package.json` declara `three`, `@react-three/fiber` y `@react-three/drei`. `SceneModel3D.tsx` usa `Canvas`, `Grid`, `OrbitControls`, `OrthographicCamera`, `PerspectiveCamera`, luces, `axesHelper`, `Text`, `mesh`, `boxGeometry` y `meshStandardMaterial`. También hay selección por pointer, filtros de nivel/altura/categoría, aislamiento y congelación visual.

El canvas, control de cámara, selección, captura y HUD son reutilizables para una escena con avatar. La arquitectura es extendible porque `SceneContent` recibe nodos y el mesh se encapsula en `SceneNodeMesh`. No existe evidencia de optimización específica para personajes: LOD, frustum/occlusion policy, instancing de partes, bounds de skinned mesh, control de frame budget, carga asíncrona de assets, disposal de recursos de avatar o gestión de errores de assets.

`preserveDrawingBuffer: true` facilita captura, pero puede tener coste de rendimiento; no hay benchmark ni presupuesto de frames en el repositorio auditado. La fidelidad visual del render humano, iluminación PBR, sombras de piel/ropa y compatibilidad con dispositivos son **UNKNOWN**.

### 4.3 glTF / GLB

**Estado: MISSING en integración; UNKNOWN en compatibilidad accidental; EXTENDABLE por la base Three.js.**

No se encontró `GLTFLoader`, `useGLTF`, `GLTFExporter`, lectura de `.gltf`/`.glb`, manifest de asset 3D, validación de buffers/texturas, control de versiones de asset ni archivos `.gltf`, `.glb`, `.vrm`, `.fbx` u `.obj` en las rutas activas revisadas. `web-ifc` y los archivos `shared/ifc4/*` son IFC, no glTF/GLB.

La dependencia `three` permite diseñar posteriormente un adaptador, pero eso no es una capacidad existente. Son **MISSING**: política de MIME/URI, carga local segura, validación de extensión y versión, límites de tamaño, caché, hash de asset, provenance del asset, soporte de Draco/Meshopt/KTX2, fallback, disposal y relación asset->project/revision.

### 4.4 Rig / esqueleto

**Estado: MISSING.**

No hay evidencia de `SkinnedMesh`, `Skeleton`, bones/joints, bind matrices, pesos de vértices, humanoid mapping, rig profile, retargeting, IK/FK, constraints de articulación, foot locking o validación de pose. `SceneNode.rotationY` es una rotación de caja constructiva y no una articulación.

El `RelationshipFabric` podría registrar relaciones semánticas entre avatar, persona, escena y evidencia, pero no sustituye un rig geométrico. El contrato de rig debe conservar al menos identidad estable del joint, jerarquía, bind pose, unidades, handedness, convención de ejes, límites y provenance del asset.

### 4.5 Animación

**Estado: MISSING como animación de avatar; PARTIAL solo como tiempo de planificación.**

No se encontró `AnimationMixer`, `AnimationClip`, tracks, keyframes, state machine, blend tree, locomoción, gesto, voz sincronizada, ciclo de actualización ni exportación de animación. `shared/arki4d/index.ts` calcula duración y ruta crítica de actividades de construcción; no representa tiempo de reproducción ni transformaciones de joints. `shared/arki5d/index.ts` es presupuesto.

El control de cámara/viewport es interactivo, pero no es animación de personaje. Es **REUSABLE** la semántica de tiempo de proyecto y la revisión; es **EXTENDABLE** la separación entre `SceneModel` y una futura capa de runtime, pero una implementación de animación sería trabajo nuevo.

### 4.6 Percepción

**Estado: MISSING; UNKNOWN respecto a capacidades del dispositivo.**

No se encontraron pipelines de cámara, pose/landmarks, detección de cuerpo/manos/cara, tracking espacial, calibración, confidence scores, asociación temporal, sensor fusion ni modelos de percepción. El canvas recibe un modelo BIM ya generado; no observa el mundo.

Los contratos de `evidence`, `epistemicStatus`, `UNKNOWN`, `scenario`, `validFrom`/`validTo` y provenance son reutilizables para representar observaciones. No existe contrato activo para distinguir observación del sensor, inferencia, predicción y decisión humana, ni para registrar cámara, timestamp monotónico, intrínsecos/extrínsecos, frame ID, precisión, latencia o retención de imagen.

### 4.7 OCR

**Estado: MISSING.**

No se encontró `Tesseract`, OCR, extracción de bounding boxes de texto, confianza por token, idioma/script, imagen de entrada, corrección humana o enlace texto->evidencia en el código activo inspeccionado. Hay contratos documentales/BIM y `BIMSourceDocument`, pero describen documentos/fuentes y no implementan OCR.

`evidenceRefs`, hashes, `UNKNOWN` y revisión humana son reutilizables para un resultado OCR. Debe evitarse afirmar que una cadena extraída es verdad geométrica: la aplicabilidad y el estado epistemológico tendrían que conservar fuente, página/región, método, confianza y corrección humana.

### 4.8 AR / WebXR

**Estado: MISSING; UNKNOWN en soporte de plataforma.**

No se encontró `WebXR`, `immersive-ar`, hit-test, anchors, camera passthrough, session lifecycle, permisos, tracking state, world scale, occlusion ni fallback AR. `three` y `@react-three/fiber` no demuestran soporte AR por sí solos.

El sistema sí contiene coordenadas, niveles, bounds y captura de escena, que son una base parcial para una futura vista espacial. No hay contrato para origen del mundo, relación cámara/escena, calibración métrica, drift, relocalización, anchor identity, pérdida de tracking, privacidad de cámara o consentimiento. En consecuencia, la aptitud AR del producto actual es **UNKNOWN**, no `PARTIAL` demostrada.

### 4.9 Human Authority

**Estado: EXISTS en gobernanza general + PARTIAL/no conectado al avatar; REUSABLE + EXTENDABLE.**

`CanonicalAuthority` define `SYSTEM_PROPOSED`, `HUMAN_AUTHORIZED` y `SYSTEM_EXECUTED`. `TransactionStatus` contempla `AWAITING_HUMAN_DECISION`, `AUTHORIZED`, `REJECTED`, `COMMITTED` y otros estados. `ArkiProjectGate` exige evidencia, verificador y timestamp para criterios. `CanonicalProjectRepository` conserva actor, autoridad, revisión, fingerprint y cadena; `CanonicalPersistence` añade auditoría, CAS, idempotencia y recuperación.

Esto es reutilizable como guardrail: un avatar, una pose derivada de percepción, una importación de asset o una alineación AR no debe elevarse automáticamente a hecho autorizado. Es extendible con un `AvatarHumanReview` o una decisión específica, siempre enlazada a `projectId`, `revisionId`, `transactionId`, evidencia y motivo.

La integración actual es insuficiente: `ArkiSnapshot` solo conserva `projectId`, `version`, `scene`, `gateStatus`, `createdAt` y `contentHash`; no conserva actor, autoridad, provenance, evidence refs, scenario ni revisión canónica. Además, el botón `approveLatestSnapshot` en el visor usa una aprobación local de snapshot, no demuestra por sí solo autorización humana canónica de un resultado de avatar.

## 5. Contratos compartidos y cobertura semántica

| Contrato solicitado | Evidencia real | Estado | Cobertura/límite para avatar |
|---|---|---|---|
| `provenance` | `TransactionProvenance` (`source`, `actorId`, `evidenceRefs`, `transformations`, opcionales de transacción); provenance propia en relaciones, restricciones y revisiones. | **EXISTS / REUSABLE / PARTIAL** | Reutilizable como contrato de linaje. Las formas no son una única interfaz universal: `RelationshipProvenance` y `ConstraintProvenance` son más pequeñas y distintas. No está en `SceneModel` ni `ArkiSnapshot`. |
| `evidence` | `evidenceRefs` en transacciones; `RelationshipEvidence`; `ConstraintEvidence`; gates y audit trail. | **EXISTS / REUSABLE** | Tipos de evidencia incluyen fixture, cálculo, fuente, revisión humana y legacy. Falta evidencia específica de frame de sensor, asset glTF, pose, token OCR y anchor AR. |
| `UNKNOWN` | Estado transaccional, epistemic status, evaluación de restricciones, recuperación canónica y varios modelos de conocimiento. | **EXISTS / REUSABLE** | Debe impedir que avatar/percepción se publique como hecho. Falta una política única de propagación/visualización de UNKNOWN para escena/avatar. |
| `applicability` | `ApplicabilityCondition` en constraints: escalas, disciplinas, entidades, jurisdicción, fase, tipo de proyecto y condiciones. | **EXISTS / REUSABLE / EXTENDABLE** | Buena base para decidir en qué escena, proyecto o contexto aplica una regla. No se conecta a `SceneNode` ni al runtime de avatar. |
| `scale` | `RelationshipScale` y `ConstraintScale`, incluyendo `HUMAN`, `COMPONENT`, `OBJECT`, `SPACE`, `BUILDING`, etc. | **EXISTS / REUSABLE** | Permite distinguir escala humana y constructiva. Hay duplicación de vocabularios entre módulos; no existe escala formal de rig/asset/frame. |
| `time` | `timestamp` en revisiones/transacciones/auditoría; `validFrom`/`validTo` en relaciones y constraints; duración en 4D. | **EXISTS / PARTIAL** | Sirve para validez de evidencia y revisión. No es tiempo monotónico de sensor ni timeline de animación; no define zona horaria/clock source para percepción. |
| `scenario` | Campo opcional `scenario` en relaciones y constraints; contexto de simulación en otros módulos. | **EXISTS / PARTIAL** | Reutilizable para AR/percepción condicionada. No hay objeto de escenario canónico compartido con reglas de identidad, estado o ciclo de vida. |
| `projectId` | `SceneModel`, snapshots, viewpoints, sesiones, proyectos, versiones, transacciones y revisiones. | **EXISTS / REUSABLE** | Debe ser clave de aislamiento. Hay una violación operativa en el visor: persistencia usando `active-project` en vez del `scene.projectId`. |
| `revision` | `revisionId`, parent chain, `projectVersion`, relación/constraint revision IDs, CAS y fingerprints. | **EXISTS / REUSABLE** | Base sólida para versionar assets, poses y observaciones. `SceneModel` no lleva `revisionId` ni fingerprint propio; el snapshot usa `version` local. |
| `determinism` | Serialización estable/fingerprints en repositorio canónico, SHA-256 de snapshot/captura y detección de ciclos en regeneración/4D. | **EXISTS / PARTIAL** | Adecuado para contenido JSON y evidencia. No garantiza render determinista, inferencia determinista, decodificación glTF determinista o animación frame-exact. `generatedAt` se genera en captura y es variable. |
| `Human Authority` | `CanonicalAuthority`, estados de transacción, gates, actor, auditoría y aprobación formal. | **EXISTS / PARTIAL** | Gobernanza reutilizable y explícita. No enlazada de forma obligatoria a cada resultado de escena/avatar/percepción; aprobación local de snapshot no equivale a autoridad canónica. |

## 6. REUSABLE y EXTENDABLE

### 6.1 REUSABLE

1. **Render base:** `Canvas`, cámaras, luces, `OrbitControls`, selección, filtros y HUD de [`SceneModel3D.tsx`](../../client/src/canvas/SceneModel3D.tsx).
2. **Identidad espacial:** `projectId`, IDs estables de nodos, `relatedIds`, niveles, bounds y selección sincronizada.
3. **Persistencia local:** snapshots, viewpoints, versiones, hash de contenido, audit chain y IndexedDB.
4. **Gobernanza:** `TransactionProvenance`, evidencia, estados `UNKNOWN`, revisiones, fingerprints SHA-256, CAS, idempotencia y recovery report.
5. **Semántica contextual:** escalas, applicability, disciplinas, `scenario`, intervalos de validez y estados epistemológicos de relaciones/restricciones.
6. **Intercambio existente:** adaptadores IFC4 e identidad round-trip, como patrón de adapter y loss report; no como sustituto de glTF.

### 6.2 EXTENDABLE

1. **Capa de asset:** añadir un adaptador glTF/GLB independiente de `SceneModel`, enlazado por `assetId`, hash, versión, provenance y `projectId`.
2. **Capa de avatar:** entidad jerárquica separada para skeleton/mesh/materials/animations; la geometría del avatar no debe forzarse a `SceneNode` constructivo.
3. **Runtime temporal:** usar los contratos de revisión/tiempo existentes, pero añadir clock source, sample time, playback time y determinismo de reproducción.
4. **Percepción:** representar cada observación como evidencia con sensor/frame/calibración/confianza, conservar `UNKNOWN` y distinguir inferencia de decisión humana.
5. **AR:** añadir sesión, world origin, anchor, hit-test, tracking quality, scale calibration y privacy/permission state.
6. **Human Authority:** crear una decisión explícita por resultado sensible (pose, identidad, alineación, publicación), enlazada a revisión y evidencia.

## 7. GAPS / MISSING prioritarios

| Prioridad | Gap | Impacto |
|---|---|---|
| P0 | No existe contrato/avatar entity para mesh, skeleton, pose, animation, asset y runtime. | Imposible auditar o versionar un avatar de forma trazable. |
| P0 | No existe pipeline glTF/GLB ni asset humano real. | No hay modelo cargable ni formato de entrega. |
| P0 | No existe rig/skeleton/retargeting ni animación. | No se puede representar postura o movimiento humano. |
| P0 | No existe percepción/OCR/AR/WebXR. | No hay entrada sensorial ni colocación en mundo real. |
| P0 | `SceneModel3D` persiste con `"active-project"` en vez del `projectId` real de la escena. | Riesgo de contaminación cruzada de snapshots/viewpoints y evidencia. |
| P1 | `SceneModel` carece de revision, provenance, evidence, epistemic status, scale, scenario y determinism metadata. | La escena no puede ser una unidad de evidencia completa. |
| P1 | `ArkiSnapshot` carece de provenance, actor/authority, revision canónica, evidence refs, scenario y determinism declaration. | La aprobación y el hash no son suficientes para gobernanza de avatar. |
| P1 | Provenance/evidence están duplicados como tipos no idénticos en transacciones, relaciones y constraints. | Riesgo de adaptaciones ad hoc y pérdida de campos al cruzar dominios. |
| P1 | No hay política de unidades/ejes/origen para interoperabilidad humano-escena. | Riesgo de escala, handedness y colocación incorrectas. |
| P1 | No hay políticas de privacidad/retención/consentimiento para cámara, OCR o datos biométricos. | Bloqueo de cualquier percepción/AR responsable. |
| P2 | No hay pruebas de rendimiento, compatibilidad de dispositivo, carga/descarga de assets o disposal. | Viabilidad operacional desconocida. |
| P2 | No hay pruebas de determinismo de render, percepción, animación o importación. | Reproducibilidad insuficiente para evidencia. |
| P2 | Bounds y altura fija de SceneModel no cubren geometría general negativa o calibrada. | Encuadre y escala pueden fallar al incorporar avatar/AR. |

## 8. CONFLICTS identificados

1. **Aislamiento por proyecto:** [`SceneModel3D.tsx`](../../client/src/canvas/SceneModel3D.tsx) calcula `scene` desde `model.projectId`, pero en `useEffect`, `saveSnapshot`, `approveLatestSnapshot` y `saveViewpoint` utiliza el literal `"active-project"`. Esto contradice el contrato de `ArkiSnapshot.projectId`/`ArkiViewpoint.projectId` y el aislamiento exigido por `CanonicalProjectRepository`.
2. **Aprobación local vs autoridad canónica:** el visor muestra `approveLatestSnapshot` y `gateStatus: "approved"`, mientras que la autoridad canónica distingue `SYSTEM_PROPOSED`, `HUMAN_AUTHORIZED` y `SYSTEM_EXECUTED`. No existe enlace obligatorio entre la aprobación local y una revisión/actor/decisión canónica; tratarlas como equivalentes sería un conflicto semántico.
3. **Contratos paralelos de provenance/evidence:** `TransactionProvenance`, `RelationshipProvenance` y `ConstraintProvenance` no tienen el mismo shape ni las mismas garantías. Por ejemplo, transacciones exigen `actorId` y `evidenceRefs`, mientras que relaciones y constraints usan `source` y listas de evidence propias. Un adaptador no documentado puede perder autoridad, refs o identidad.
4. **Versionado paralelo:** `ArkiSnapshot.version`, `ArkiVersion.number/modelHash`, `CanonicalProjectRevision.revisionId` y `projectVersion` de relaciones/constraints coexisten sin un contrato de correspondencia explícito. Esto puede producir una escena visual "aprobada" cuya revisión canónica no sea identificable.
5. **Escala duplicada:** `RelationshipScale` y `ConstraintScale` son vocabularios parecidos pero no idénticos (`METROPOLITAN_PROVINCIAL` aparece en relaciones y no en constraints). No debe asumirse intercambiabilidad automática al modelar avatar/AR.
6. **Semántica de tiempo:** `timestamp`/`validFrom`/`validTo`, duración 4D y `createdAt` no son el mismo reloj. Usarlos como sample time de percepción o playback de animación crearía una contradicción de semántica temporal.
7. **Evidencia de captura incompleta:** la captura del canvas calcula SHA-256 de bytes PNG y guarda metadata local, pero no enlaza de forma canónica `projectId`, `revisionId`, provenance, actor, authority, scenario ni fuente de datos de la escena. El hash prueba bytes, no veracidad ni aprobación.

## 9. UNKNOWN que deben permanecer explícitos

- No se puede afirmar compatibilidad con glTF/GLB solo por tener `three`; no hay loader ni asset.
- No se puede afirmar soporte WebXR/AR por usar `Canvas` de React Three Fiber.
- No se conoce rendimiento de una futura escena con avatar, ni límites de memoria/texturas o frame rate.
- No se conoce compatibilidad con sensores, cámaras, permisos, dispositivos móviles o gafas AR.
- No se conoce precisión de escala/origen para una persona respecto al modelo BIM.
- No se conoce la política de datos biométricos, consentimiento o retención porque no hay pipeline de percepción.
- No se conoce si render, decodificación, inferencia o animación serían deterministas.
- No se conoce cómo una decisión humana se representaría para una observación/avatar individual; la infraestructura general existe, la integración no.
- No se conoce qué `revision` canónica corresponde a un `ArkiSnapshot` creado por el visor, porque el visor usa `version` local y `active-project`.

## 10. No-propuesta de implementación

Este documento no propone ni ejecuta código de avatar productivo. La conclusión operativa de la auditoría es únicamente de preparación: antes de cualquier implementación habría que resolver los conflictos de identidad/versionado y definir un contrato de avatar trazable que reutilice los contratos de provenance, evidence, UNKNOWN, applicability, scale, time, scenario, projectId, revision, determinism y Human Authority. La ausencia de esos pasos impide considerar el repositorio listo para un avatar productivo.

## 11. Conclusión

**COCO-C no está implementado como avatar.** El repositorio sí aporta una base real y reutilizable de escena BIM 3D, selección, persistencia, comparación, IFC y gobernanza. La frontera está clara: reutilizar render/escena y contratos de evidencia; no reutilizar `SceneNode` como sustituto de rig ni asumir que IFC/Three.js implican glTF, animación, percepción u AR. El bloqueo inmediato es contractual y de trazabilidad, no la falta de una geometría de ejemplo.

**Estado recomendado:** `PARTIAL — FOUNDATIONAL SCENE ONLY; AVATAR PIPELINE MISSING; GOVERNANCE REUSABLE BUT NOT INTEGRATED`.

---

**Archivos de producto no modificados por esta auditoría.** El único artefacto producido es este reporte en `COCO/AUDIT/COCO-C_AUDIT.md`.
