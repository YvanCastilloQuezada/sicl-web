# MiLukita — Marco Constitucional de Governance OS

**Versión:** 1.0 · **Estado:** propuesta arquitectónica para aprobación humana · **Agente Legal:** `PLANNED / NOT_STARTED / DISABLED`

## 1. Cláusula constitucional de congelación funcional

> **CLÁUSULA DE CONGELACIÓN FUNCIONAL, AUTORIDAD Y CONTRATOS FUTUROS**
>
> Desde la aprobación de esta Orden Maestra, MiLukita entra en **MODO CONSOLIDACIÓN**. Queda congelada la expansión de nuevos agentes, juegos, superficies públicas, integraciones externas, proveedores, campañas y capacidades autónomas que no sean indispensables para corregir defectos, mejorar seguridad, ejecutar pruebas, mantener compatibilidad, completar auditoría o preservar la continuidad del sistema.
>
> Durante el MODO CONSOLIDACIÓN, todo cambio deberá estar vinculado a un registro de requisito, responsable, evidencia, prueba de regresión, impacto sobre la autoridad y resultado de revisión. Ningún cambio podrá conceder a un agente autoridad sobre RNG, reglas, resultados, RTP, wallet, créditos, ledger, settlement, MjpTvManifest o cualquier otra superficie protegida de **MJP CORE**.
>
> **Legal & Compliance Intelligence** queda incorporado al organigrama constitucional de Governance OS exclusivamente como capacidad planificada: `STATUS = PLANNED`, `IMPLEMENTATION = NOT_STARTED`, `AUTHORITY = ADVISORY_ONLY`, `EXECUTION = DISABLED`, `AUTONOMY = 0`, `HUMAN_REVIEW = REQUIRED` y `MJP_CORE_ACCESS = NONE`. Su inclusión no constituye asesoría legal, opinión jurídica, licencia, certificación ni declaración de cumplimiento.
>
> Los contratos futuros de Legal Intelligence, Regulatory Intelligence, Compliance Operations, Legal Claim Guard, IP & Licensing Intelligence y Privacy & Data Governance quedan **reservados y documentados, pero no implementados ni activados**. Todo contrato futuro deberá preservar la separación entre evidencia técnica y cumplimiento jurídico, exigir fuente, jurisdicción, vigencia, responsable y revisión profesional, y prohibir afirmaciones jurídicas sin base verificable.
>
> Sólo una aprobación humana autorizada y trazable podrá levantar parcialmente el congelamiento para un cambio concreto. La aprobación deberá especificar alcance, motivo, riesgo, evidencia, pruebas, dependencia, responsable y fecha de expiración. Una aprobación no autoriza cambios fuera de su alcance ni modifica la autoridad constitucional de MJP CORE.

## 2. Organigrama congelado

| Capa | Unidades | Estado |
|---|---|---|
| Producto | MiLukita.com, MiLukita LIVE, Lukita | En consolidación |
| Entertainment OS | Experience, Content, Audience, Character | Operativo/simulado según evidencia |
| Business OS | Finance, Revenue, Sales, Accounting & Tax, Commercial, Distribution | Mixto; integraciones externas no activas |
| Governance OS | Agent Governance, Legal & Compliance, Audit, Watchdog, Recovery, Authority | Legal planificado y deshabilitado |
| Control | KPI & Observability, Control Room, Human Authority | Supervisión y evidencia |
| Núcleo protegido | MJP CORE, RNG, Rules, Results, Wallet, Ledger, Settlement | Autoridad exclusiva del núcleo |

## 3. Esquema de estados auditables del Agente Legal

```ts
type LegalAuditState =
  | "NO_DATA"
  | "TECHNICAL_CONTROL_ONLY"
  | "REQUIRES_PROFESSIONAL_REVIEW"
  | "POLICY_BLOCKED"
  | "SOURCE_EXPIRED"
  | "HUMAN_APPROVED";
```

| Estado | Significado | Permite publicación jurídica | Revisión profesional |
|---|---|---:|---:|
| `NO_DATA` | Faltan fuente, jurisdicción, vigencia o evidencia suficiente | No | Sí, si se desea avanzar |
| `TECHNICAL_CONTROL_ONLY` | Existe un control técnico, pero no demuestra cumplimiento legal | No | Requerida para cualquier claim |
| `REQUIRES_PROFESSIONAL_REVIEW` | El análisis puede orientar, pero el asunto requiere abogado o responsable cualificado | No | Obligatoria |
| `POLICY_BLOCKED` | Una política interna predefinida impide continuar | No | Puede revisar la política; no se desbloquea automáticamente |
| `SOURCE_EXPIRED` | La fuente o norma registrada perdió vigencia o requiere actualización | No | Requerida antes de reutilizar el análisis |
| `HUMAN_APPROVED` | Una persona autorizada revisó la evidencia y aprobó el alcance concreto | Sólo dentro del alcance aprobado | Debe quedar identificada y fechada |

**Regla de prioridad:** `POLICY_BLOCKED` prevalece sobre estados favorables; `NO_DATA` impide cualquier claim; `HUMAN_APPROVED` nunca significa “legal en todos los países” ni sustituye una licencia, registro u opinión jurídica formal.

## 4. Contrato futuro reservado

Todo futuro objeto legal deberá contener, como mínimo: `id`, `domain`, `jurisdiction`, `source`, `legalBasis`, `effectiveFrom`, `effectiveTo`, `obligation`, `owner`, `evidence`, `confidence`, `risk`, `state`, `lastReviewedAt`, `nextReviewAt`, `humanReviewer` y `scope`.

Las operaciones permitidas serán `READ`, `ANALYZE`, `CLASSIFY`, `COMPARE`, `DETECT`, `SCORE_RISK`, `PROPOSE`, `ALERT` y `ESCALATE`. Quedan prohibidas `SIGN_CONTRACT`, `ACCEPT_LIABILITY`, `REGISTER_COMPANY`, `FILE_LEGAL_DOCUMENT`, `REPRESENT_MILUKITA`, `MAKE_BINDING_LEGAL_DECISION`, `DECLARE_COMPLIANCE_DEFINITIVELY`, `OBTAIN_LICENSE_AUTONOMOUSLY`, `CHANGE_CORPORATE_STRUCTURE` y `MODIFY_MJP_CORE`.

## 5. Legal Claim Guard reservado

El `Legal Claim Guard` no se implementa todavía. Su contrato futuro deberá examinar cualquier afirmación como “licenciado”, “certificado”, “legal”, “seguro”, “garantizado”, “oficial”, “24/7” o “disponible mundialmente”. Si falta evidencia vigente y jurisdicción definida, el resultado será `NO_DATA` o `REQUIRES_PROFESSIONAL_REVIEW`, nunca una afirmación favorable.

## 6. Decisión de consolidación

La prioridad posterior a esta orden es: **consolidación → pruebas → auditoría → documentación → revisión humana**. No se crearán nuevos agentes por el solo hecho de que exista un dominio conceptual pendiente. La arquitectura queda congelada hasta que una revisión independiente determine qué debe mantenerse, simplificarse, corregirse o eliminarse.

## 7. Alineación con la Orden Maestra de Reorientación — 27-08-2026

Este marco queda subordinado al contrato constitucional `shared/milukitaMasterOrder.ts` y al documento `docs/MILUKITA_MASTER_CONSTITUTION.md`. La nueva secuencia superior es **MiLukita Network → Experience OS / Content OS / Business OS → Agent OS → Governance OS → KPI / Observability → Control Room → Authority Boundary → MJP CORE**.

La constitución registra tres experiencias con separación de audiencia y permisos: **MiLukita Kids** en `PLANNED / DISABLED`, **MiLukita** en `PARTIALLY_IMPLEMENTED / READY` y **MiLukita 55+** en `PLANNED / DISABLED`. Esta clasificación no autoriza expansión funcional ni monetización real. LRCI continúa con autonomía cero, autoridad consultiva, ejecución deshabilitada y revisión profesional humana requerida.

La regla de verdad permanece: **NO DATA → NO CLAIM** y **NO LEGAL BASIS → NO LEGAL CLAIM**. FAST, OTT, IPTV y cable no deben presentarse como distribución activa sin integraciones externas demostradas. Cualquier cambio futuro debe superar los quality gates de producto, experiencia, contenido, seguridad, legal/compliance, política, autoridad, aprobación humana cuando corresponda, ejecución, auditoría y KPI.
