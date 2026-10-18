# Ficha Y — Colaboración y gobierno

**Orden:** COCO-EXPRESS-002 FULL ARSENAL PRETRAINING  
**Alcance:** exclusivamente Y1–Y5. **Estado:** `PARTIAL`; prerrequisitos conceptuales y contratos locales verificados, pero faltan servicios productivos, interoperabilidad completa y validación profesional.  
**Higiene:** no se usaron ni memorizaron respuestas de exámenes DeepSeek/Lipsic. Los ejercicios son sintéticos, independientes y no reutilizan fixtures de examen.

## Invariantes de la familia Y

- Separar siempre `FACT`, `ASSUMPTION`, `OBJECTIVE`, `REQUIREMENT`, `OBSERVATION`, `EVIDENCE`, `INFERENCE`, `DECISION` y `UNKNOWN`; ausencia de evidencia no es `FALSE`.
- Cada afirmación operativa lleva `provenance` (fuente, autoridad, dominio, jurisdicción, escala, fecha, versión), `applicability`, `project_id`, `time`/vigencia y `scenario` cuando corresponda.
- Toda magnitud lleva `value`, `unit`, `scale` y tolerancia si aplica. Un hash demuestra integridad de bytes canónicos, no autoría, aprobación, semántica ni certificación. Un import exitoso no demuestra fidelidad. Una observación, simulación o forecast no se convierte en verdad canónica.
- `ONE PROJECT STATE`, autoridad humana y cierre explícito de incertidumbre. Ningún componente Y firma, certifica, autoaprueba o publica por sí mismo.

## Y1

| Campo | Ficha |
|---|---|
| **CAPABILITY_ID** | `Y1` |
| **NAME** | Colaboración multiusuario y estado canónico |
| **PURPOSE** | Coordinar usuarios, disciplinas y agentes sobre un único estado de proyecto, con identidad, roles, permisos, versiones, concurrencia y resolución humana de conflictos. |
| **CORE_CONCEPTS** | `user`, `organization`, `project`, `role`, `permission`, `presence`, `operation`, `version`, `optimistic concurrency`, `canonical Project State`, conflicto, revisión, provenance. |
| **PREREQUISITES** | Identidad estable; `project_id`; modelo de autorización; versión/ETag o revisión; esquema de operación idempotente; reloj y actor registrados; autoridad humana. |
| **INPUTS** | Operación propuesta, actor/rol, proyecto y escenario, `base_version`, entidad/relación afectada, unidades y provenance, permisos y política de conflicto. |
| **OUTPUTS** | Aceptada/rechazada/`UNKNOWN`; nueva revisión o solicitud de resolución; diff auditable; actor, tiempo, motivo, aplicabilidad y conflictos preservados. |
| **CORE_RELATIONSHIPS** | Identidad→actor; actor→rol→permiso; operación→versión; operación→Project State; conflicto→revisión humana; toda salida→audit event. No hay “merge mágico” de verdades incompatibles. |
| **BASIC_METHODS_OR_ALGORITHMS** | Control optimista `base_version == current_version`; idempotency key; orden causal; detección de write/write conflict; ACL/RBAC como filtro; diff de campos; cola de revisión; commit transaccional. |
| **COMMON_FAILURES** | Última escritura gana sin aviso; identidad local duplicada; permiso confundido con aprobación profesional; presencia confundida con autoría; datos offline sobrescriben estado; pérdida de unidades/provenance. |
| **LIMITS** | ARKI inspeccionado contiene identidad determinista y persistencia/local contracts, no evidencia de backend multiusuario, presencia, ACL productiva, locking distribuido ni resolución operativa a escala. |
| **PROFESSIONAL_BOUNDARY** | No demuestra coordinación contractual, seguridad corporativa, control de acceso legal, autoría profesional ni decisión/ aprobación de expediente. |
| **ARKI_EXISTING_KNOWLEDGE** | `shared/identity/arkiGlobalId.ts`: mapeo determinista `archiElementId/projectId/versionNumber` mediante SHA-256 truncado; `COCO_EXPRESS_002/CORE/COCO_CORE_DOCTRINE.md`: un Project State y autoridad humana; `shared/coordination/index.ts`: detección local de clashes con disciplinas, volumen, severidad y estado. |
| **ARKI_NEW_TRAINING** | Contrato pedagógico de operación multiusuario con `base_version`, actor, permiso, idempotencia, diff y resolución; regla fail-closed: conflicto o provenance/aplicabilidad incompleta no se convierte en commit/verdad. |
| **GAPS_REMAINING** | Backend persistente, sesiones/ACL reales, sincronización offline, pruebas de concurrencia distribuida, recuperación, segregación organizacional, trazabilidad legal y revisión humana integrada. |

## Y2

| Campo | Ficha |
|---|---|
| **CAPABILITY_ID** | `Y2` |
| **NAME** | BCF: issues, markup, viewpoints y coordinación |
| **PURPOSE** | Intercambiar incidencias de coordinación de forma portable, con tópico, componentes, viewpoint, estado, responsable, fechas, comentarios y evidencia vinculada sin convertir un clash en decisión constructiva. |
| **CORE_CONCEPTS** | BCF topic, GUID, title, description, priority, type, status, assignee, due date, comment, viewpoint, camera, selection, clipping, component/globalId, snapshot, document reference, version y provenance. |
| **PREREQUISITES** | Identidad estable de elementos; modelo federado o referencia; unidades/sistema de coordenadas; permisos; esquema BCF compatible; evidencia visual y límites de aplicabilidad. |
| **INPUTS** | Detección/observación, IDs y disciplinas, viewpoint, snapshot opcional, severidad/prioridad, actor, proyecto/versión, estado, responsables, fechas con timezone, unidades y provenance. |
| **OUTPUTS** | Topic BCF o registro equivalente; import/export report; estado (`open`, `reviewed`, `accepted`, `resolved`, `rejected`); historial de comentarios; discrepancias y `UNKNOWN` si faltan viewpoint, semántica o evidencia. |
| **CORE_RELATIONSHIPS** | Clash→topic; topic→components/globalIds; topic→viewpoint/evidence; topic→workflow/audit; BCF snapshot→observación visual, no medición; resolved→decisión humana y evidencia, no sólo cambio de estado. |
| **BASIC_METHODS_OR_ALGORITHMS** | Generar GUID estable; validar campos obligatorios; mapear GlobalId; validar coordenadas/unidades; detectar componentes ausentes; importar/exportar de forma round-trip con reporte de pérdida; máquina de estados monotónica sólo con autoridad. |
| **COMMON_FAILURES** | Comentario sin viewpoint; GlobalId inexistente; snapshot tomado como modelo; severidad sin unidad/contexto; estado `resolved` sin evidencia; exportación exitosa tratada como fidelidad semántica. |
| **LIMITS** | ARKI tiene `detectClashes` local y tipos `Clash`, pero el propio inventario indica que no hay BCF completo con viewpoints, responsables, vencimientos, comentarios y ciclo de cierre productivo. |
| **PROFESSIONAL_BOUNDARY** | Un issue BCF es coordinación/información; no constituye RFI contractual, aprobación de diseño, aceptación de obra ni certificación de ausencia de interferencias. |
| **ARKI_EXISTING_KNOWLEDGE** | `shared/coordination/index.ts`: nodos por disciplina, intersección volumétrica, severidad y estados; `shared/identity/arkiGlobalId.ts`: identidad determinista; `COCO_EXPRESS_002/EXERCISES/TRANSVERSE_SCENARIO.md`: explícitamente exige distinguir comentario BCF sin viewpoint y preview de decisión. |
| **ARKI_NEW_TRAINING** | Esquema mínimo de topic con campos obligatorios, preservación de unidades/provenance/aplicabilidad y oracle que rechaza `resolved` sin evidencia y BCF sin componentes/viewpoint cuando el escenario lo requiere. |
| **GAPS_REMAINING** | Parser/serializador BCF probado, federación real, snapshots/viewpoints interoperables, permisos, notificaciones, SLA, vínculo contractual y validación con herramientas externas. |

## Y3

| Campo | Ficha |
|---|---|
| **CAPABILITY_ID** | `Y3` |
| **NAME** | CDE y flujo documental alineado con ISO 19650 |
| **PURPOSE** | Gobernar información por estados, contenedores, revisiones, suitability, transmittals y permisos; hacer explícita la aplicabilidad de la norma sin afirmar certificación. |
| **CORE_CONCEPTS** | CDE, contenedor de información, WIP, Shared, Published/Issued, Archived, naming convention, metadata, revision, status/suitability, approval, transmittal, exchange information requirements, audit trail, change control. |
| **PREREQUISITES** | Requisitos de información acordados; convención de nombres; roles y autoridad; repositorio con versionado; calendario/zona horaria; matriz de estados y revisiones; jurisdicción y edición normativa identificadas. |
| **INPUTS** | Documento/modelo, autor, disciplina, proyecto, estado CDE, revisión, suitability, clasificación, fecha, permisos, transmittal, destino, fuente normativa y alcance de aplicabilidad. |
| **OUTPUTS** | Contenedor versionado, metadatos validados, transición permitida/rechazada/`UNKNOWN`, transmittal y evento de auditoría; nunca “ISO certificado” por pasar validaciones de campos. |
| **CORE_RELATIONSHIPS** | Requisito→metadato; contenedor→revisión; revisión→suitability; estado→permiso; transmittal→destinatario/fecha; aprobación→autoridad humana; todo cambio→audit event y hash opcional. |
| **BASIC_METHODS_OR_ALGORITHMS** | Máquina de estados WIP→Shared→Published/Issued→Archived con precondiciones; validación de nombres/metadatos; control de revisión; checksum de contenido; comparación de versión; matriz de aplicabilidad normativa. |
| **COMMON_FAILURES** | Carpeta llamada CDE confundida con CDE gobernado; `Published` sin aprobación; suitability ausente; revisión sobrescrita; norma extrapolada de otra jurisdicción/fecha; hash usado como aprobación o firma. |
| **LIMITS** | La auditoría ARKI inspeccionada describe manifiestos/demostraciones locales, pero falta CDE productivo con autenticación, roles, permisos, control documental, transmittals, estados ISO 19650, revisiones, aprobaciones, comentarios y persistencia. |
| **PROFESSIONAL_BOUNDARY** | Esto es una guía de gobernanza e intercambio; no es certificación ISO 19650, auditoría de organización, control contractual ni autorización para emitir documentos de obra. |
| **ARKI_EXISTING_KNOWLEDGE** | `COCO_EXPRESS_002/CORE/COCO_CORE_DOCTRINE.md`: normas no se extrapolan entre jurisdicciones/escala/fechas y hash no es firma; `ARKI_ESTADO_COMPLETO_Y_PENDIENTES.md`/auditoría inspeccionada: flujo local/manifiesto, ausencia de CDE productivo; persistencia canónica local en `shared/arkiCanonicalPersistence.ts` (inventariada, no modificada). |
| **ARKI_NEW_TRAINING** | Contrato de transición CDE con metadatos, applicability y authority; casos que distinguen `Shared` de `Published`, import success de fidelity y `UNKNOWN` de rechazo normativo. |
| **GAPS_REMAINING** | Servicio CDE persistente, seguridad/retención, revisión y aprobación humanas, transmittals reales, nomenclatura configurable, evidencias de auditoría y assessment independiente de ISO 19650. |

## Y4

| Campo | Ficha |
|---|---|
| **CAPABILITY_ID** | `Y4` |
| **NAME** | Hashes, integridad y auditoría trazable |
| **PURPOSE** | Detectar cambios en una representación canónica y registrar quién/qué/cuándo/por qué cambió, conservando evidencia y límites epistemológicos. |
| **CORE_CONCEPTS** | Canonical serialization, SHA-256, digest, manifest, content identity, event log, append-only, hash chain, actor, timestamp, before/after, provenance, retention, clock uncertainty, tamper evidence. |
| **PREREQUISITES** | Esquema estable; normalización determinista; unidades y precisión declaradas; reloj con zona/precisión; identidad del actor; almacenamiento protegido; política de retención; separación hash/firma. |
| **INPUTS** | Bytes/contenido, versión, proyecto/escenario, unidades, serialización, actor, acción, motivo, fuente, fecha, autoridad y política de auditoría. |
| **OUTPUTS** | Digest y manifest; comparación igual/distinto; evento auditable con enlace previo y evidencia; `UNKNOWN` cuando falta autenticidad, reloj fiable, semántica o provenance. |
| **CORE_RELATIONSHIPS** | Contenido→canonical bytes→hash; operación→before/after digest; evento→actor/tiempo/provenance; cadena→detección de alteración; firma PKI, si existe, es una capa separada que prueba una afirmación de clave bajo su política, no la validez del contenido. |
| **BASIC_METHODS_OR_ALGORITHMS** | Canonical JSON ordenado, UTF-8; SHA-256; manifest por archivo; hash chain `H_i = SHA256(H_{i-1}|event_i)`; verificación de igualdad; fail-closed ante serialización/unidades desconocidas. |
| **COMMON_FAILURES** | Hash de JSON no canónico; truncamiento sin registrar; bytes iguales tratados como semántica igual; timestamp inventado; log mutable; digest tratado como firma/certificación; falta de actor o jurisdicción. |
| **LIMITS** | ARKI contiene baselines/manifestos SHA-256 y funciones deterministas de GlobalId; no hay evidencia aquí de WORM, reloj confiable, servicio de auditoría regulado, key management ni firma PKI productiva. |
| **PROFESSIONAL_BOUNDARY** | Integridad técnica y trazabilidad de cambios no equivalen a autenticidad legal, custodia probatoria, firma digital, certificación o aprobación profesional. |
| **ARKI_EXISTING_KNOWLEDGE** | `shared/identity/arkiGlobalId.ts`: SHA-256 determinista; `FASE_0_BASELINE_HASHES.txt` y `ARKI_DEEPSEEK_CURRENT_AUDIT/SHA256SUMS.txt`: baselines/manifestos existentes (consultados sólo como evidencia de patrón); doctrina COCO establece que hash no es firma. |
| **ARKI_NEW_TRAINING** | Oracle de integridad que exige serialización, unidades, provenance, actor y alcance; mutante controlado que transforma `UNKNOWN` en `FALSE` debe fallar, y mutante que elimina provenance debe ser detectado. |
| **GAPS_REMAINING** | Auditoría append-only operativa, almacenamiento resistente a manipulación, sincronización temporal, retención legal, cadena de custodia, firma separada, verificación semántica y controles externos. |

## Y5

| Campo | Ficha |
|---|---|
| **CAPABILITY_ID** | `Y5` |
| **NAME** | PKI, confianza y firma como frontera de autoridad |
| **PURPOSE** | Explicar y validar, sin implementar un certificador profesional, la cadena de confianza, uso de claves, firma/verificación, revocación y relación con la aprobación humana. |
| **CORE_CONCEPTS** | clave privada/pública, certificado X.509, CA raíz/intermedia, cadena, key usage/extended key usage, firma detached, digest, trust store, validity, revocation (CRL/OCSP), timestamp, identidad, consentimiento humano. |
| **PREREQUISITES** | Política de confianza; identidad verificada; gestión segura de claves; CA y trust store; algoritmo/parámetros; formato firmado; reloj; estado de revocación; documento/afirmación y autoridad claramente delimitados. |
| **INPUTS** | Bytes canónicos, firma, certificado/cadena, política, identidad declarada, key usage, vigencia, revocación, timestamp y aprobación humana requerida. |
| **OUTPUTS** | Verificación criptográfica `valid/invalid/UNKNOWN` con razón y evidencia; estado de confianza aplicable; nunca “certificado profesional” ni autoaprobación. |
| **CORE_RELATIONSHIPS** | Hash→digest firmado; clave→certificado→CA/trust; certificado→identidad bajo política; firma→integridad/autorización limitada; revocación/vigencia→aplicabilidad temporal; aprobación humana→decisión de publicar. |
| **BASIC_METHODS_OR_ALGORITHMS** | Parsear cadena; validar firma sobre bytes exactos; validar fechas y key usage; comprobar revocación; comparar algoritmo/política; registrar resultado y `UNKNOWN` ante trust/revocación no demostradas. No generar claves ni firmar entregables de ARKI. |
| **COMMON_FAILURES** | Certificado válido confundido con contenido válido; self-signed confundido con confianza; hash confundido con firma; firma válida fuera de vigencia; revocación ignorada; identidad del certificado confundida con competencia profesional; importación exitosa confundida con validación. |
| **LIMITS** | No se implementa PKI, HSM, CA, firma ni certificación; el repositorio no aporta evidencia de trust service productivo. Sólo se entrena el razonamiento y el contrato de verificación. |
| **PROFESSIONAL_BOUNDARY** | No emitir, sellar, certificar, firmar ni afirmar autoría/competencia profesional. La autoridad humana y la infraestructura PKI autorizada quedan fuera de esta ficha. |
| **ARKI_EXISTING_KNOWLEDGE** | Doctrina COCO: autoridad humana, hash≠firma y límites explícitos; `shared/identity/arkiGlobalId.ts`: identidad determinista no criptográfica de autoría; auditoría del repositorio: flujo local y falta de backend/controles productivos. |
| **ARKI_NEW_TRAINING** | Matriz de verificación que separa digest, firma, certificado, confianza, revocación y aprobación; salida tri-estado `valid/invalid/UNKNOWN` y rechazo de cualquier claim de certificación automática. |
| **GAPS_REMAINING** | Integración con proveedor de confianza, custodia de claves, políticas legales, revocación en tiempo real, timestamping, segregación de funciones y evaluación/validación externa. |

## Evidencia y decisión de alcance

Se reutilizaron únicamente `shared/identity/arkiGlobalId.ts`, `shared/coordination/index.ts`, la doctrina y firewall COCO, el escenario transversal y la auditoría local que explicita la ausencia de CDE productivo/BCF completo. No se modificaron **Product State, BKH, TX, E5–E8 ni PF-H01**. Los microejercicios y el oracle sintético están en `EXERCISES_Y.txt`; incluyen assertions, un mutante controlado detectado y dejan intacta la lógica correcta. Resultado: `PARTIAL`, no competencia profesional.

## GAPS_REMAINING globales

Faltan backend multiusuario y permisos reales; BCF interoperable; CDE persistente alineado a requisitos de información; auditoría resistente a manipulación; PKI/firmas bajo una política autorizada; pruebas de interoperabilidad y seguridad; y revisión humana/profesional externa. Estas carencias impiden declarar CDE productivo, firma/certificación, conformidad ISO 19650 o competencia profesional.
