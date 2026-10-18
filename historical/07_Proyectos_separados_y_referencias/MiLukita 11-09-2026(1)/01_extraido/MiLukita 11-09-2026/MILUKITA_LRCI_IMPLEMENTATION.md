# MiLukita — Especificación histórica restrictiva de LRCI

**Estado vigente:** `PLANNED / NOT_STARTED / DISABLED`  

> **Nota de consistencia:** este documento conserva la especificación histórica de estados auditables. La fuente canónica vigente es `docs/LEGAL_COMPLIANCE_INTELLIGENCE_AGENT.md`; no existe un motor jurídico operativo.  
**Autoridad:** `ADVISORY_ONLY`  
**Autonomía:** `0`  
**Revisión humana:** `REQUIRED`  
**Integraciones externas:** `NONE`  
**Acceso a MJP CORE:** `NONE`

> **Aviso jurídico:** este documento es una especificación técnica y de gobernanza, no asesoría legal ni una opinión jurídica. Cualquier decisión jurídica, regulatoria, contractual, fiscal o de cumplimiento debe ser revisada por un profesional cualificado antes de utilizarse.

## Decisión de diseño

LRCI se reservó conceptualmente como un **contrato restrictivo de clasificación y control**, no como abogado automatizado. En esta fase no existe motor jurídico operativo. Puede registrar evidencia técnica, identificar ausencia de datos, detectar expiración de fuentes, aplicar políticas internas y escalar a revisión humana. No puede afirmar que MiLukita es legal, licenciada, certificada, segura o conforme en una jurisdicción determinada.

La especificación deliberadamente no activa fuentes normativas externas, no procesa contratos reales, no presenta documentos, no firma, no representa a MiLukita y no toma decisiones vinculantes. El contrato vigente se encuentra en `shared/legalComplianceAgent.ts`; permanece sin autoridad ejecutiva y con ejecución deshabilitada.

## Estados auditables

| Estado | Condición | Resultado permitido |
|---|---|---|
| `NO_DATA` | Falta fuente, evidencia, jurisdicción, vigencia, alcance o confianza suficiente. | No claim; solicitar datos o escalar. |
| `TECHNICAL_CONTROL_ONLY` | Existe un control de software, pero no una validación jurídica. | No declarar cumplimiento. |
| `REQUIRES_PROFESSIONAL_REVIEW` | Hay evidencia técnica suficiente para orientar, pero falta revisión profesional. | Detener publicación y escalar. |
| `POLICY_BLOCKED` | Una política interna prohíbe continuar. | Bloqueo obligatorio; sin bypass automático. |
| `SOURCE_EXPIRED` | La fuente perdió vigencia. | Suspender reutilización y renovar evidencia. |
| `HUMAN_APPROVED` | Existe una aprobación identificada, fechada y limitada por alcance y jurisdicción. | Sólo puede registrarse como aprobación de ese alcance; no habilita ejecución jurídica automática. |

La prioridad de bloqueo es estricta: `POLICY_BLOCKED` prevalece sobre estados favorables; la ausencia de información produce `NO_DATA`; una aprobación humana no convierte el resultado en una licencia ni en cumplimiento general.

## Operaciones

Las operaciones permitidas por el contrato son `READ`, `ANALYZE`, `CLASSIFY`, `COMPARE`, `DETECT`, `SCORE_RISK`, `PROPOSE`, `ALERT` y `ESCALATE`. En la fase actual, `canLrciExecute()` devuelve siempre `false`: la lista permitida describe el contrato futuro, no una autorización de ejecución.

Están prohibidas `SIGN_CONTRACT`, `ACCEPT_LIABILITY`, `REGISTER_COMPANY`, `FILE_LEGAL_DOCUMENT`, `REPRESENT_MILUKITA`, `MAKE_BINDING_LEGAL_DECISION`, `DECLARE_COMPLIANCE_DEFINITIVELY`, `OBTAIN_LICENSE_AUTONOMOUSLY`, `CHANGE_CORPORATE_STRUCTURE` y `MODIFY_MJP_CORE`.

## Métricas iniciales

Las métricas se expresan como `ZERO_BY_DESIGN` o `NO_DATA`. Cero por diseño significa que no hay casos procesados porque la capacidad está deshabilitada; no significa que el riesgo jurídico del negocio sea cero.

| Métrica | Estado inicial | Valor |
|---|---|---:|
| Regulatory Coverage | `NO_DATA` | `null` |
| Legal Risk Detection | `ZERO_BY_DESIGN` | `0` |
| Compliance Coverage | `NO_DATA` | `null` |
| Regulatory Change Detection | `ZERO_BY_DESIGN` | `0` |
| Contract Risk Detection | `ZERO_BY_DESIGN` | `0` |
| License Expiration Alerts | `ZERO_BY_DESIGN` | `0` |
| Claim Verification Rate | `NO_DATA` | `null` |
| Legal Escalation Rate | `NO_DATA` | `null` |
| False Legal Alert Rate | `NO_DATA` | `null` |
| Unresolved High-Risk Issues | `NO_DATA` | `null` |
| Legal Unknown Rate | `ZERO_BY_DESIGN` | `0` |

## Evidencia ejecutada

La evidencia histórica de pruebas se conserva como trazabilidad. La batería canónica vigente es `shared/legalComplianceAgent.test.ts`, que verifica estado `PLANNED`, `NOT_STARTED`, `DISABLED`, autonomía cero, revisión humana, dominios futuros y bloqueo de ejecución o mutación de MJP CORE. También se mantiene la regresión de aislamiento P0 en `shared/mjpCoreIsolation.test.ts`.

La implementación no modifica RNG, RTP, reglas, resultados, wallet, créditos, ledger, settlement ni `MjpTvManifest`. Tampoco activa el `Legal Claim Guard`, el Jurisdiction Engine, AML/KYC/CDD ni fuentes regulatorias externas.

## Próximo nivel autorizado

El siguiente avance sólo debería consistir en una interfaz de revisión humana y un registro auditable de casos, con datos de prueba claramente etiquetados. Antes de conectar fuentes reales o permitir cualquier claim externo, debe existir una decisión humana documentada sobre jurisdicción, fuente, vigencia, responsable profesional, política de publicación, retención de evidencia y procedimiento de escalamiento.


## Registro persistente de casos de revisión humana

Se implementó el registro administrativo persistente `lrci_review_cases` para documentar título, dominio, alcance, jurisdicción, vencimiento opcional, responsable, fuente, evidencia, comentario de revisión, estado y timestamps. El contrato inicia cada caso en `REQUIRES_PROFESSIONAL_REVIEW`; los estados `HUMAN_APPROVED` y `REJECTED` sólo se establecen mediante una mutación administrativa protegida y quedan acompañados de comentario y fecha de revisión.

La tabla se creó mediante `drizzle/0031_slippery_karnak.sql`, con índices por estado/vencimiento y jurisdicción/actualización, y referencias opcionales a usuarios responsables y creadores. `server/lrciReviewCases.ts` implementa listado filtrable, creación y actualización, registrando cada operación en `operational_events` mediante `appendOperationalEvent`. Los procedimientos tRPC son `operations.lrciCases`, `operations.createLrciCase` y `operations.updateLrciCase`, todos protegidos por `adminProcedure`.

La interfaz `client/src/components/LrciReviewCasesPanel.tsx`, integrada al Control Room, permite crear casos, filtrar por estado y jurisdicción, consultar alcance, vencimiento y responsable, cambiar estados y registrar comentarios. Una aprobación queda limitada al caso documentado y no habilita claims, firma, publicación, ejecución jurídica ni acceso a MJP CORE.

Se añadieron pruebas deterministas en `shared/lrciReviewCaseContract.test.ts` para estado inicial, normalización de jurisdicción, vencimiento y decisiones humanas. Resultado focalizado: **12/12 PASS**. La regresión completa y build finalizaron correctamente: **88 archivos PASS, 292 pruebas PASS, 4 omitidas**; `pnpm check` y `pnpm build` PASS. La vista no autenticada de `/control-room` mantiene el bloqueo correcto; la validación visual del panel autenticado requiere sesión de operador.


## Exportación y alertas operativas

El panel LRCI incorpora exportación CSV del conjunto actualmente filtrado y exportación PDF mediante `operations.exportLrciCasesPdf`. El PDF se genera en servidor con PDFKit, se almacena mediante la capa segura de storage y registra un evento `LRCI_REVIEW_CASES_EXPORTED_PDF`; no se exportan datos fuera de los casos autorizados por el filtro administrativo.

La interfaz muestra una alerta prioritaria cuando un caso no cerrado vence o vencerá dentro de siete días. El mensaje solicita escalar a un profesional y renovar la evidencia, sin ejecutar ningún claim ni alterar el estado del núcleo. El estado sigue siendo responsabilidad humana y la alerta es informativa/auditable.


## Historial por caso y notificaciones persistentes

Se añadió `operations.lrciCaseHistory`, que consulta los eventos del Event Store asociados al `publicId` del caso. El panel permite expandir el historial y descargarlo como CSV, conservando evento, actor, fuente, correlación, payload y fecha.

Se creó la tabla `lrci_review_notifications` mediante `drizzle/0032_needy_fat_cobra.sql`. La sincronización genera de manera idempotente alertas `EXPIRING_SOON` de severidad `HIGH` y `EXPIRED` de severidad `CRITICAL` para casos no cerrados. Las alertas son persistentes, pueden marcarse como leídas y cada creación/lectura deja un evento auditable. No constituyen decisión jurídica ni ejecutan acciones sobre el núcleo.

La prueba de frontera sin sesión contra `operations.lrciCases` devolvió HTTP 403, confirmando que el registro no se expone públicamente. La prueba autenticada con un caso real de staging queda preparada, pero no se declara ejecutada porque el sandbox no tiene una sesión administrativa interactiva disponible.


## Mejoras del panel de notificaciones e historial

El panel muestra ahora un contador visible de notificaciones no leídas, calculado sobre las alertas persistentes no leídas devueltas por `operations.lrciNotifications`. Se añadieron filtros por severidad (`HIGH`/`CRITICAL`) y por rango de fecha de creación, manteniendo la consulta restringida a operadores administrativos.

Cada historial individual puede exportarse a PDF mediante `operations.exportLrciCaseHistoryPdf`. El servidor genera el documento con PDFKit, lo almacena mediante storage seguro y registra `LRCI_CASE_HISTORY_EXPORTED_PDF` en el Event Store. El PDF incluye evento, actor, fuente, correlación, payload y fecha, junto con el aviso de que no constituye asesoría legal ni habilita claims.

Validación de esta ampliación: `pnpm check` PASS; pruebas focalizadas LRCI 12/12 PASS; regresión completa PASS; `pnpm build` PASS. Los endpoints continúan bajo `adminProcedure` y la autoridad de MJP CORE no cambia.
