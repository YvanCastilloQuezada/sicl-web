# COCO-EXPRESS-002 — Ficha G: Agentes, Avatar y percepción

**Orden:** `COCO-EXPRESS-002 FULL ARSENAL PRETRAINING`  
**Alcance:** G1–G5.  
**Resultado:** `PARTIAL`. La base sintética y los contratos epistemológicos son reutilizables; no existe evidencia de Avatar final, Luka productivo, OCR/visión productivos ni WebXR validado. Esta ficha no declara competencia profesional, firma, certificación ni capacidad de emisión.

## Regla transversal de la familia G

Una salida de agente o sensor es un registro situado, no una verdad canónica. Cada observación debe conservar `UNKNOWN` cuando falte evidencia y registrar `provenance`, autoridad, dominio, jurisdicción, fecha/versión, aplicabilidad, escala, proyecto, tiempo, escenario y unidades cuando haya magnitudes. **OCR no es verdad; observación no es hecho; forecast no es hecho; simulación no es estado físico; hash no es firma; import success no es fidelity; preview no es decisión.** La decisión y cualquier aprobación quedan bajo autoridad humana.

## Fichas de capacidad

### G1

| Campo | Contenido |
|---|---|
| **CAPABILITY_ID** | `G1` |
| **NAME** | Avatar de agente y presencia multimodal gobernada |
| **PURPOSE** | Representar a un agente en una interfaz espacial, con identidad, estado, comandos y observaciones separados; facilitar interacción sin atribuir al avatar autoridad o competencia profesional. |
| **CORE_CONCEPTS** | Identidad de agente; avatar visual; escena jerárquica; transform local/mundial; comando versus observación; estado epistemológico; accesibilidad; evidencia y trazabilidad. |
| **PREREQUISITES** | Proyecto y revisión identificables; contrato de provenance; unidades de transform; asset versionado; permisos de cámara/micrófono; fallback no-XR; criterio humano de aceptación. |
| **INPUTS** | `AvatarAsset`; nodos y transforms; clips; `DeviceCommand`; contexto de proyecto/escenario/tiempo; preferencias de interacción; evidencia de asset. |
| **OUTPUTS** | Render/preview; estado de comando; `DeviceObservation`; lista de errores; referencia de asset y evidencia. La salida no es firma, aprobación ni certificación. |
| **CORE_RELATIONSHIPS** | Avatar → agente/UI; comando → observación; asset → provenance; nodo hijo → transform mundial; observación → evidencia solo si existe `evidenceRef` y calidad válida. |
| **BASIC_METHODS_OR_ALGORITHMS** | Validación de IDs y duración de clips; composición jerárquica de transforms; máquina de estados de intención; control de permisos; determinismo por versión/seed cuando haya generación. |
| **COMMON_FAILURES** | Nodo duplicado; ciclo de padres; escala sin unidad; clip inválido; comando tratado como acción ejecutada; observación sin fuente; asset importado tratado como fiel. |
| **LIMITS** | El módulo existente es abstracto y sintético. No cubre GLB real, rigging productivo, captura facial, latencia, seguridad biométrica, voz productiva ni validación de dispositivo. |
| **PROFESSIONAL_BOUNDARY** | No es Avatar final, representación profesional, certificación de identidad, inspector, diseñador firmante ni autoridad de proyecto. |
| **ARKI_EXISTING_KNOWLEDGE** | `shared/arkiCocoAvatar.ts`: `AvatarAsset`, `SceneNode`, `Transform`, `AnimationClip`, `DeviceCommand`, `DeviceObservation`, `PerceptionObservation`, `worldTransform`, `validateAvatarAsset`, `commandResult` y `perceptionIsEvidence`. `client/src/canvas/SceneModel3D.tsx` aporta visualización Three.js. COCO-C declara expresamente que la base no incluye GLB/rig productivo. |
| **ARKI_NEW_TRAINING** | Envolvente G para separar intención, render y observación; prueba de que una respuesta del avatar conserva `UNKNOWN`, provenance, proyecto/tiempo/escenario y no se convierte en decisión humana. |
| **GAPS_REMAINING** | Asset real validado; rig/animación; pruebas de accesibilidad y permisos; browser/device matrix; identidad, voz y privacidad; persistencia canónica de estados del agente; evaluación humana independiente. |

### G2

| Campo | Contenido |
|---|---|
| **CAPABILITY_ID** | `G2` |
| **NAME** | Luka y guía contextual situada |
| **PURPOSE** | Ofrecer explicaciones y próximos pasos contextuales sobre el proyecto sin rellenar faltantes ni convertir sugerencias en hechos, órdenes, aprobación o asesoría profesional. |
| **CORE_CONCEPTS** | Context window; grounding por proyecto/revisión; intención; explicación; pregunta aclaratoria; citación de evidencia; applicability; escalation a autoridad humana; memoria separada de estado canónico. |
| **PREREQUISITES** | Contexto con `projectId`, revisión, tiempo y escenario; fuentes trazables; política de desconocidos; límites de dominio/jurisdicción/escala; canal de revisión humana. |
| **INPUTS** | Pregunta; selección espacial o de plano; estado documental; observaciones OCR/visión; fuentes y restricciones; rol del usuario; idioma y accesibilidad. |
| **OUTPUTS** | Respuesta contextual; fuentes/evidenceRefs; `UNKNOWN` y gaps; pregunta aclaratoria; acción propuesta no ejecutada; nivel de confianza explicable. |
| **CORE_RELATIONSHIPS** | Luka usa contexto y evidencia; no muta Product State; guía → propuesta; propuesta → revisión humana; memoria conversacional ≠ verdad canónica; fuente fuera de jurisdicción/escala/fecha no se extrapola. |
| **BASIC_METHODS_OR_ALGORITHMS** | Recuperación por `projectId`/revisión; filtrado de aplicabilidad; clasificación epistemológica; respuesta con abstención; ranking de evidencia; detección de conflicto; handoff humano. |
| **COMMON_FAILURES** | Alucinación de dimensión o norma; pérdida de revisión; mezclar proyectos; falsa certeza por OCR; respuesta genérica sin escala; memoria que sobrescribe el estado; instrucción presentada como aprobación. |
| **LIMITS** | No hay implementación Luka localizada en el repositorio inspeccionado ni evaluación conversacional productiva. El entrenamiento aquí es contrato y test sintético, no modelo desplegado. |
| **PROFESSIONAL_BOUNDARY** | Luka no sustituye arquitecto, ingeniero, inspector, operador de seguridad, asesor normativo ni autoridad que aprueba, firma o publica. |
| **ARKI_EXISTING_KNOWLEDGE** | `COCO_CORE_DOCTRINE.md` separa KNOWLEDGE/PROJECT_STATE/EVIDENCE/MEMORY/STRATEGY y exige Human Authority. `arkiCocoDossier.ts` conserva `projectId`, `revisionId`, provenance, traceability y `unknowns`; E8-A/E8-C aportan gates documentales. |
| **ARKI_NEW_TRAINING** | Microcasos de guía para un centro ferroviario ficticio: responder con fuente, escala y applicability; pedir evidencia ante conflicto; mantener `UNKNOWN`; distinguir preview/sugerencia de decisión. |
| **GAPS_REMAINING** | Luka real; grounding cuantitativamente evaluado; memoria gobernada; red-teaming de prompt injection; privacidad/retención; telemetría; evaluación multilingüe; integración segura con estado canónico. |

### G3

| Campo | Contenido |
|---|---|
| **CAPABILITY_ID** | `G3` |
| **NAME** | Lectura contextual de planos y correspondencia dibujo–modelo |
| **PURPOSE** | Interpretar elementos visibles o semánticos de un plano para navegación, consulta y trazabilidad, sin afirmar que el dibujo sea as-built ni que una importación conserve toda su semántica. |
| **CORE_CONCEPTS** | Escala; sistema de coordenadas; leyenda; niveles; cotas; ejes; puertas/ventanas; vínculos dibujo–elemento; revisión; raster/vector; correspondencia e incertidumbre. |
| **PREREQUISITES** | Documento y revisión; unidades declaradas; escala explícita o `UNKNOWN`; orientación; leyenda; fuente y jurisdicción; tolerancia; modelo candidato; evidencia de correspondencia. |
| **INPUTS** | SVG/DWG/IFC/raster; viewport; escala; niveles; selección del usuario; elementos del `ConstructionModel`; metadatos de proyecto/tiempo/escenario. |
| **OUTPUTS** | Navegación de plano; geometría visual; selección de elemento; vínculos de trazabilidad; conflictos dibujo–modelo; `UNKNOWN` y solicitud de medición/evidencia. |
| **CORE_RELATIONSHIPS** | Plano ↔ modelo mediante `traceability`; escala ↔ unidades; revisión ↔ consistencia; símbolo ↔ elemento solo con evidencia; vista ↔ contexto. |
| **BASIC_METHODS_OR_ALGORITHMS** | Normalizar coordenadas; transformar por escala/origen; segmentar muros y aberturas; indexar elementos; hit testing; comparar revisión; devolver estado `FOUND/UNKNOWN/CONFLICT` en vez de completar silenciosamente. |
| **COMMON_FAILURES** | Escala asumida; unidades mezcladas; orientación invertida; símbolos desconectados; DWG importado tratado como semánticamente fiel; diseño tratado como as-built; revisión antigua mezclada; cotas sin tolerancia. |
| **LIMITS** | Hay vista de plano y modelo de construcción, pero no evidencia de lector universal DWG ni validación semántica de importación. No se implementa solver de planos profesional. |
| **PROFESSIONAL_BOUNDARY** | No sustituye levantamiento, revisión de planos, coordinación BIM, inspección de obra ni emisión de planos profesionales. |
| **ARKI_EXISTING_KNOWLEDGE** | `client/src/canvas/CanvasPlanView.tsx` dibuja muros, puertas, ventanas y elementos con geometría/aberturas; `shared/arkiConstructionDTOs.ts` serializa `ConstructionModel`; `arkiCocoDossier.ts` aporta `DossierLink` y detección de consistencia. |
| **ARKI_NEW_TRAINING** | Caso sintético de lectura de una puerta en el centro ferroviario con escala declarada, bbox en píxeles, posible conflicto de revisión y vínculo a `elementId`; el oráculo impide declarar medición o fidelidad por import success. |
| **GAPS_REMAINING** | Lectura DWG/ PDF robusta; OCR de cotas; tolerancias; multi-plano/nivel; validación humana; prueba con documentos reales autorizados; manejo de símbolos y anotaciones; preservación completa de metadatos. |

### G4

| Campo | Contenido |
|---|---|
| **CAPABILITY_ID** | `G4` |
| **NAME** | OCR y percepción visual gobernada |
| **PURPOSE** | Convertir imagen, vídeo o profundidad en observaciones estructuradas para revisión posterior, conservando incertidumbre y provenance en cada detección. |
| **CORE_CONCEPTS** | OCR; detección; segmentación; pose; profundidad; bounding box; confidence; calidad; falsos positivos/negativos; calibración; observación versus hecho; evidencia. |
| **PREREQUISITES** | Fuente autorizada; timestamp; calibración; unidad de imagen/escena; modelo y versión; seed si aplica; dominio/escala; ground truth o revisión humana; política de privacidad. |
| **INPUTS** | Frame/raster; cámara; metadatos; ROI; modelo OCR/visión; contexto de plano; idioma; iluminación; proyecto, tiempo y escenario. |
| **OUTPUTS** | Texto o clase detectada; bbox/máscara/pose/profundidad; confidence; calidad; modelo/version; evidenceRef; `UNKNOWN` cuando la lectura no es verificable. |
| **CORE_RELATIONSHIPS** | Imagen → observación; observación → evidencia solo con referencia; OCR → candidato textual; candidato → hecho solo después de corroboración; depth/pose → magnitud solo con calibración y unidades. |
| **BASIC_METHODS_OR_ALGORITHMS** | Preprocesado reproducible; detección/segmentación; OCR con language pack; NMS/threshold; calibración; evaluación precision/recall; abstención por baja calidad; doble revisión en campos críticos. |
| **COMMON_FAILURES** | Texto ilegible; perspectiva; glare; escala desconocida; caracteres confundidos; confidence mal calibrada; bbox en píxeles presentada como metros; forecast/score presentado como hecho; fuente ausente. |
| **LIMITS** | `arkiCocoAvatar.ts` sólo define `PerceptionObservation` sintética y `perceptionIsEvidence`; COCO-C dice que no incluye OCR ni visión productivos. No se validan modelos, datasets ni tasas de error para uso profesional. |
| **PROFESSIONAL_BOUNDARY** | No es inspección certificada, medición topográfica, diagnóstico de seguridad, vigilancia autorizada ni prueba única para decisión profesional. |
| **ARKI_EXISTING_KNOWLEDGE** | `PerceptionObservation` conserva `source`, `timestamp`, `confidence`, `kind`, `value` y `evidenceRef`; doctrina COCO exige que OCR no sea verdad y que la ausencia de evidencia no sea FALSE. |
| **ARKI_NEW_TRAINING** | Oráculos que fuerzan `kind`, confidence acotada, bbox con unidad `px`, source/evidenceRef y estado `OBSERVATION`; una observación OCR sin corroboración queda `UNKNOWN` para la proposición factual. |
| **GAPS_REMAINING** | Modelos OCR/visión; dataset y métricas; calibración; privacidad; tracking temporal; condiciones adversas; reproducibilidad en dispositivos; revisión humana; auditoría de sesgos y seguridad. |

### G5

| Campo | Contenido |
|---|---|
| **CAPABILITY_ID** | `G5` |
| **NAME** | AR y WebXR con anclaje espacial no autoritativo |
| **PURPOSE** | Superponer una representación o anotación sobre una vista del entorno y registrar su estado de tracking, sin presentar el overlay como medición, construcción ejecutada o aprobación. |
| **CORE_CONCEPTS** | `XRSession`; `immersive-ar`; cámara; hit-test; anchor; plane/depth detection; world/local coordinates; tracking quality; drift; occlusion; permission; fallback; provenance. |
| **PREREQUISITES** | HTTPS y dispositivo compatible; permisos; referencia espacial; escala/unidades; modelo/revisión; política de privacidad; indicador de tracking; fallback 2D/3D; revisión humana. |
| **INPUTS** | `XRSession`; poses y frames; hit-test/planes; modelo de escena; escala; anchor id; proyecto/tiempo/escenario; anotaciones; seed/version si hay contenido generado. |
| **OUTPUTS** | Overlay/preview; pose y anchor con timestamp; calidad de tracking; drift/occlusion warnings; evidenceRefs; estado `UNKNOWN` si no hay soporte o calibración. |
| **CORE_RELATIONSHIPS** | Mundo físico ↔ modelo sólo mediante registro de referencia y tolerancia; anchor ↔ overlay; tracking ↔ calidad, no verdad; simulación ↔ propuesta; import success ↔ no fidelity; preview ↔ no decision. |
| **BASIC_METHODS_OR_ALGORITHMS** | Feature/plane detection; hit-test; pose update; anchor lifecycle; coordinate transforms; drift checks; frustum/occlusion; session permission; fallback; logging de versión/dispositivo/timestamps. |
| **COMMON_FAILURES** | Scale/origin wrong; drift; tracking loss; occlusion falsa; anchor persistido entre proyectos; permiso denegado; WebXR no soportado; overlay interpretado como as-built; frame desactualizado. |
| **LIMITS** | Dependencia de `three` y visualización no equivale a WebXR implementado. COCO-C declara WebXR fuera del alcance realizado; no hay prueba browser/dispositivo WebXR ni calibración física. |
| **PROFESSIONAL_BOUNDARY** | No es replanteo, control dimensional, inspección de seguridad, commissioning ni certificación de instalación. AR sólo presenta información para revisión. |
| **ARKI_EXISTING_KNOWLEDGE** | `client/src/canvas/SceneModel3D.tsx` y la dependencia `three` aportan una base de escena; `arkiCocoAvatar.ts` aporta transforms jerárquicos y observaciones. `COCO_SCOPE_LIMITS.md` excluye WebXR productivo. |
| **ARKI_NEW_TRAINING** | Transferir una anotación de puerta del plano a un anchor AR, conservando escala, timestamp, tracking quality, provenance y `UNKNOWN`; comprobar que un overlay no cambia el estado canónico. |
| **GAPS_REMAINING** | Sesiones WebXR reales; matriz de dispositivos; persistencia segura de anchors; calibración y error bounds; occlusion/depth; privacidad; browser tests; recuperación ante tracking loss; revisión humana en sitio. |

## Estado y evidencia

Se inspeccionó sólo lo necesario: `shared/arkiCocoAvatar.ts`, `shared/arkiCocoDossier.ts`, `shared/arkiCocoSpatial.ts`, `shared/arkiConstructionDTOs.ts`, `client/src/canvas/CanvasPlanView.tsx`, `client/src/canvas/SceneModel3D.tsx`, la doctrina y el escenario COCO-EXPRESS-002. El repositorio sí contiene fundamentos sintéticos de avatar, transforms, percepción, planos, dossier, provenance y `UNKNOWN`. No se encontró implementación Luka ni evidencia de OCR, visión o WebXR productivos. Los microejercicios independientes están en `EXERCISES_G.txt`.

La familia queda en **PARTIAL**: hay prerrequisitos y oráculos de seguridad epistemológica probados, pero faltan integración real, validación independiente, dispositivos/datasets y revisión profesional. No se modificaron Product State, BKH, TX, E5–E8 ni PF-H01.

## References

[1]: ../CORE/COCO_CORE_DOCTRINE.md "COCO-EXPRESS-002 Core Doctrine"
[2]: ../CORE/ANTI_CONTAMINATION_FIREWALL.md "Anti-Contamination Firewall"
[3]: ../../shared/arkiCocoAvatar.ts "ARKI COCO Avatar and Perception Foundations"
[4]: ../../shared/arkiCocoDossier.ts "ARKI COCO Dossier Contract"
[5]: ../../client/src/canvas/CanvasPlanView.tsx "ARKI Canvas Plan View"
[6]: ../../client/src/canvas/SceneModel3D.tsx "ARKI Three.js Scene Model"
[7]: ../../COCO/COCO_SCOPE_LIMITS.md "COCO Scope Limits"
[8]: ../EXERCISES/TRANSVERSE_SCENARIO.md "COCO-EXPRESS-002 Transfer Scenario"

> Las referencias internas documentan el estado del repositorio inspeccionado. No son certificaciones ni validaciones profesionales.
