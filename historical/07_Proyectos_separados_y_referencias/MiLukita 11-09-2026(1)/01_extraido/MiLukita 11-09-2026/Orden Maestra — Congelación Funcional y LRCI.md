# Orden Maestra — Congelación Funcional y LRCI

**Versión:** 1.0 · **Estado:** propuesta histórica supersedida por `docs/LEGAL_COMPLIANCE_INTELLIGENCE_AGENT.md` · **Fecha:** 27 de agosto de 2026

> **Nota de consistencia:** la definición vigente de LRCI es `PLANNED / NOT_STARTED / DISABLED / ADVISORY_ONLY / AUTONOMY 0 / MJP_CORE_ACCESS NONE`. Este documento conserva su trazabilidad histórica y no autoriza implementación funcional.

## 1. Cláusula oficial

> **CLÁUSULA CONSTITUCIONAL DE CONGELACIÓN FUNCIONAL, GOBERNANZA Y LRCI**
>
> MiLukita entra en **MODO CONSOLIDACIÓN**. Queda congelada la expansión de nuevos agentes, juegos, funcionalidades públicas, integraciones externas, proveedores, campañas y capacidades autónomas que no sean estrictamente necesarias para corregir defectos, mejorar seguridad, mantener compatibilidad, ejecutar pruebas, preservar continuidad, completar auditoría o actualizar documentación.
>
> Todo cambio posterior deberá tener requisito identificado, alcance limitado, responsable, evaluación de impacto, evidencia, pruebas de regresión y revisión humana. Ningún cambio podrá conceder a un agente autoridad directa o indirecta sobre MJP CORE, RNG, reglas, resultados, RTP, wallet, créditos, ledger, settlement, estado autoritativo de juego o MjpTvManifest.
>
> Se incorpora al organigrama constitucional **LEGAL, REGULATORY & COMPLIANCE INTELLIGENCE (LRCI)** como capacidad definida y planificada, pero no operativa: `STATUS = PLANNED`, `IMPLEMENTATION = NOT_STARTED`, `EXECUTION = DISABLED`, `AUTONOMY = 0`, `AUTHORITY = ADVISORY_ONLY`, `HUMAN_REVIEW = REQUIRED`, `EXTERNAL_INTEGRATIONS = NONE` y `MJP_CORE_ACCESS = NONE`.
>
> LRCI podrá, únicamente en una futura implementación autorizada, leer, analizar, clasificar, comparar, detectar riesgos, proponer, alertar y escalar. No podrá firmar contratos, aceptar responsabilidad, representar a MiLukita, registrar sociedades, presentar documentos jurídicos, emitir opiniones legales vinculantes, declarar cumplimiento definitivo, obtener licencias autónomamente, cambiar estructuras corporativas ni modificar MJP CORE.
>
> Quedan reservados, pero no implementados, los contratos de Legal Intelligence, Regulatory Intelligence, Compliance Operations, Privacy & Data, Contracts, IP & Licensing, Advertising & Consumer, Gaming & Promotions, AI Governance, AML/KYC/CDD y Legal Claim Guard.
>
> Ninguna interfaz, agente o documento podrá presentar LRCI como abogado, licencia, certificación, cumplimiento legal verificado o autoridad jurídica. La ausencia de implementación deberá mostrarse como `NOT_IMPLEMENTED`, `DISABLED` o `NO_DATA`, según corresponda.
>
> La congelación sólo podrá levantarse para un alcance concreto mediante aprobación humana trazable que indique motivo, riesgo, evidencia, pruebas, dependencia, responsable, fecha de inicio y fecha de expiración. Una aprobación no amplía la autoridad del agente ni altera las protecciones de MJP CORE.

## 2. Esquema técnico LRCI

```ts
type LrciStatus = "DEFINED" | "PLANNED" | "DISABLED" | "NOT_IMPLEMENTED";
type LegalAuditState =
  | "NO_DATA"
  | "TECHNICAL_CONTROL_ONLY"
  | "REQUIRES_PROFESSIONAL_REVIEW"
  | "POLICY_BLOCKED"
  | "SOURCE_EXPIRED"
  | "HUMAN_APPROVED";

type LrciMetric = {
  id: string;
  value: number | null;
  unit: "count" | "ratio" | "percentage";
  state: "ZERO_BY_DESIGN" | "NO_DATA" | "OBSERVED";
  source: string;
  observedAt: number | null;
};
```

### Estado inicial obligatorio

| Campo | Valor inicial | Interpretación |
|---|---|---|
| `status` | `PLANNED` | La arquitectura está registrada como reserva, no como operación |
| `implementation` | `NOT_STARTED` | No existe motor jurídico operativo |
| `execution` | `DISABLED` | No puede ejecutarse |
| `autonomy` | `0` | No toma decisiones autónomas |
| `authority` | `ADVISORY_ONLY` | Sólo podrá recomendar en una fase futura |
| `humanReview` | `REQUIRED` | Revisión profesional obligatoria |
| `externalIntegrations` | `NONE` | No hay fuentes normativas conectadas |
| `mjpCoreAccess` | `NONE` | No existe acceso al núcleo |

### Estados auditables

| Estado | Regla | Resultado permitido |
|---|---|---|
| `NO_DATA` | Falta fuente, jurisdicción, vigencia o evidencia | No claim; escalar o solicitar información |
| `TECHNICAL_CONTROL_ONLY` | Existe un control de software, no una validación jurídica | No declarar cumplimiento |
| `REQUIRES_PROFESSIONAL_REVIEW` | La materia requiere abogado o responsable cualificado | Detener publicación y escalar |
| `POLICY_BLOCKED` | Una política interna impide la operación | Bloqueo obligatorio; no bypass automático |
| `SOURCE_EXPIRED` | La fuente perdió vigencia o no fue revisada | Suspender reutilización y renovar evidencia |
| `HUMAN_APPROVED` | Persona autorizada aprobó un alcance concreto | Sólo válido para ese alcance, fecha y jurisdicción |

### Métricas iniciales

Las métricas de LRCI deben estar en **cero verificable o `NO_DATA`**, nunca en porcentajes inventados.

| KPI futuro | Estado inicial | Valor inicial | Fuente requerida |
|---|---|---:|---|
| Regulatory Coverage | `NO_DATA` | `null` | Inventario normativo versionado |
| Legal Risk Detection | `ZERO_BY_DESIGN` | `0` | Casos analizados reales |
| Compliance Coverage | `NO_DATA` | `null` | Obligaciones y controles evidenciados |
| Regulatory Change Detection | `ZERO_BY_DESIGN` | `0` | Feed jurídico confiable |
| Contract Risk Detection | `ZERO_BY_DESIGN` | `0` | Contratos reales analizados |
| License Expiration Alerts | `ZERO_BY_DESIGN` | `0` | Registro de licencias |
| Claim Verification Rate | `NO_DATA` | `null` | Claims con evidencia y jurisdicción |
| Legal Escalation Rate | `NO_DATA` | `null` | Casos escalados a profesionales |
| False Legal Alert Rate | `NO_DATA` | `null` | Revisión de falsos positivos |
| Unresolved High-Risk Issues | `NO_DATA` | `null` | Registro de riesgos vigente |
| Legal Unknown Rate | `ZERO_BY_DESIGN` | `0` | No existen casos procesados |

`ZERO_BY_DESIGN` significa que el contador es cero porque la capacidad está deshabilitada; no significa que el riesgo legal del negocio sea cero. `NO_DATA` significa que no hay base suficiente para calcular la métrica.

## 3. Legal Claim Guard reservado

El `Legal Claim Guard` queda definido como contrato futuro y deshabilitado. Deberá verificar `claim`, `source`, `evidence`, `jurisdiction`, `effectiveDate`, `confidence`, `scope` y `humanReview`. Si falta cualquiera de los elementos esenciales, el estado será `NO_DATA` o `REQUIRES_PROFESSIONAL_REVIEW`. No podrá convertir un análisis técnico en “licenciado”, “certificado”, “legal”, “seguro”, “garantizado”, “oficial”, “24/7” o “disponible mundialmente”.

## 4. Regla de colaboración con MJP CORE

MJP CORE determina los resultados del juego. LRCI, en una fase futura, podría revisar cómo comunicar una afirmación o qué condiciones legales afectan una operación; jamás determinará si el usuario ganó, cambiará el resultado, alterará créditos o ejecutará liquidaciones.

```text
MJP CORE → resultado autoritativo
LRCI → revisión de claim y riesgo
Human / Professional → decisión jurídica vinculante
```

## 5. Roadmap congelado

La secuencia aprobada es **consolidación → pruebas → auditoría → documentación → revisión humana**. No se crearán nuevos agentes durante el congelamiento. El próximo trabajo deberá demostrar integración, autoridad, recuperación, trazabilidad y veracidad de estados de los componentes existentes.


## 6. Anexo de ejecución del Documento 82

El Documento 82 queda incorporado como actualización del organigrama constitucional. Se separan explícitamente `EXPERIENCE OS`, `BUSINESS OS`, `AGENT OS`, `GOVERNANCE OS`, `LEGAL / REGULATORY / COMPLIANCE`, `FINANCIAL / TAX INTELLIGENCE`, `HUMAN AUTHORITY` y `PROTECTED CORE`.

LRCI mantiene trece dominios futuros: `CORPORATE_LEGAL`, `REGULATORY_INTELLIGENCE`, `GAMING_REGULATION`, `ADVERTISING_COMPLIANCE`, `CONSUMER_PROTECTION`, `PRIVACY_DATA_PROTECTION`, `INTELLECTUAL_PROPERTY`, `CONTRACTS`, `LICENSING`, `AI_GOVERNANCE`, `DIGITAL_SERVICES_ECOMMERCE`, `INTERNATIONAL_EXPANSION` y `LEGAL_CLAIMS_REPRESENTATION_GUARD`. Se reservan adicionalmente `JURISDICTION_ENGINE`, `AML_KYC_CDD` y `TRUTH_CLAIMS_GOVERNANCE` como dominios futuros, sin motor ni integraciones activas.

Tax no queda subordinado a Legal. `Tax Intelligence` pertenece a Business OS junto con Finance, Accounting, Revenue, Treasury y Financial Planning. Legal y Tax colaborarán en el futuro mediante un business case sujeto a decisión humana, sin que ninguno pueda modificar MJP CORE.

El `Jurisdiction Engine` futuro deberá clasificar país, ubicación del usuario, actividad, producto, flujo económico, premio, datos, publicidad y distribución antes de proponer requisitos. No podrá emitir una conclusión jurídica definitiva. AML/KYC/CDD queda reservado dentro de Compliance, y Truth & Claims Governance se conserva como política transversal para impedir que estados simulados, técnicos o incompletos se presenten como hechos.

La operación final queda definida conceptualmente como: `PROPOSAL → DATA VALIDATION → POLICY CHECK → LEGAL / REGULATORY CHECK → FINANCIAL CHECK → AUTHORITY CHECK → HUMAN APPROVAL WHEN REQUIRED → EXECUTE WITHIN SCOPE → AUDIT → MEASURE`. Si falta evidencia, el resultado debe ser `NO_DATA`, `REQUIRES_PROFESSIONAL_REVIEW`, `SOURCE_EXPIRED` o `POLICY_BLOCKED`; nunca una afirmación favorable inventada.

La implementación de esta actualización es arquitectónica y contractual. No se activó un agente legal, no se conectaron fuentes regulatorias, no se añadieron integraciones externas y no se crearon agentes operativos nuevos. MJP CORE permanece como única autoridad sobre RNG, reglas, resultados, wallet, créditos, ledger, settlement, integridad y MjpTvManifest.


## 7. Cierre de la ejecución del Documento 82

La actualización queda aplicada en el contrato `shared/milukitaMasterOrder.ts`. El organigrama ahora distingue explícitamente Entertainment OS, Experience OS, Business OS, Agent OS, Governance OS, Legal/Regulatory/Compliance, Financial/Tax Intelligence, Human Authority y Protected Core. LRCI conserva trece dominios internos y tres dominios reservados: Jurisdiction Engine, AML/KYC/CDD y Truth & Claims Governance.

La prueba focalizada verificó cuatro invariantes: expansión congelada, LRCI planificado y deshabilitado, límites legales sin ejecución y prohibición de acciones sobre MJP CORE. Resultado: **8/8 pruebas aprobadas**. La validación TypeScript también fue aprobada.

El build final transformó **1.927 módulos** y terminó en **5,22 segundos**. Se mantienen advertencias no bloqueantes de chunks grandes, especialmente el visor 3D de Lukita; esta advertencia no cambia la autoridad ni la integridad del núcleo.

Clasificación de cierre: organigrama y contratos constitucionales **IMPLEMENTADOS**; motor jurídico, fuentes normativas, Jurisdiction Engine, AML/KYC/CDD operativo y Legal Claim Guard operativo **NO IMPLEMENTADOS / RESERVADOS**; MJP CORE, RNG, reglas, resultados, wallet, créditos, ledger, settlement, integridad y MjpTvManifest **PROTEGIDOS SIN CAMBIOS**.


## 8. Evaluación actual de MiLukita

MiLukita ya no debe evaluarse como una colección de juegos, sino como una plataforma de entretenimiento digital gobernada. La arquitectura actual muestra una separación útil entre experiencia, negocio, agentes, gobierno, autoridad humana y núcleo protegido. La incorporación de Human Authority y Financial/Tax Intelligence mejora la capacidad de revisión, pero no convierte los datos simulados en telemetría productiva ni crea cumplimiento legal automático.

El nuevo panel de Human Authority gestiona documentos de revisión local con estados `PENDING_REVIEW`, `HUMAN_APPROVED` y `REJECTED`, comentario opcional y timestamp. El panel Financial/Tax Intelligence separa observación financiera, auditoría de premios, Tax Intelligence y costos externos; los elementos sin fuente siguen en `NO_DATA` o `PLANNED`. El organigrama interactivo reutiliza `MASTER_ORGANIGRAM` y permite explorar capas sin conceder permisos.

La conclusión estratégica es positiva, con una condición: MiLukita está bien encaminada como **Entertainment Network gobernada y piloto virtual**, pero todavía no debe describirse como operación regulada, plataforma de dinero real, canal FAST operativo ni sistema autónomo productivo 24/7. La prioridad correcta continúa siendo consolidación, evidencia, pruebas de autoridad, revisión humana y auditoría independiente.

### Resultado técnico de esta fase

| Control | Resultado |
|---|---|
| TypeScript | PASS |
| Pruebas focalizadas | PASS |
| Casos focalizados | 16/16 aprobados |
| Build | PASS |
| Módulos transformados | 1.930 |
| Tiempo de build | 4,96 s |
| MJP CORE | Sin cambios |
| Datos reales / pagos | No activados |
| Motor jurídico LRCI | Deshabilitado |
| Organigrama interactivo | Implementado como vista de revisión |
| Aprobación documental | Local, manual y auditable |

La advertencia restante del build corresponde a chunks grandes, especialmente el visor 3D de Lukita, y debe tratarse como mejora de rendimiento posterior, no como fallo funcional. Las aprobaciones locales de Human Authority no deben confundirse con una aprobación legal profesional vinculante.


## 9. Ruta pública de revisión y evaluación final

Se habilitó la ruta pública de solo lectura `/organigrama-constitucional`, basada en el mismo contrato `MASTER_ORGANIGRAM` utilizado en Control Room. La vista expone navegación por capas, zoom entre 80% y 160%, desplazamiento limitado, restablecimiento de cámara y detalle de módulos. No requiere autenticación y no concede permisos operativos.

La evaluación actual de MiLukita es la siguiente: la identidad arquitectónica está consolidada; Entertainment OS, Experience OS, Business OS, Agent OS, Governance OS, Human Authority y Protected Core tienen representación documental y visual; Financial/Tax Intelligence mantiene estados de observación; LRCI permanece planificado y deshabilitado; los agentes no gobiernan MJP CORE; y el piloto continúa siendo virtual. Permanecen fuera de alcance operativo los pagos reales, retiros, proveedores externos, cumplimiento legal automático, operación 24/7 productiva, certificación independiente y QA físico.

Las prioridades inmediatas son: revisión humana de contratos, pruebas de regresión y autoridad, control de claims, evidencia persistente de auditoría, optimización del bundle del visor 3D y preparación legal profesional antes de cualquier monetización o expansión jurisdiccional.


## 10. Mejoras de revisión pública del organigrama

La ruta `/organigrama-constitucional` incorpora una búsqueda de texto que compara el nombre de cada capa y todos sus roles o departamentos. El resultado muestra únicamente las capas coincidentes y comunica el conteo visible para evitar interpretaciones ambiguas.

Cada nodo dispone de tooltip al pasar el cursor o enfocarlo con teclado. El tooltip presenta la descripción de la capa y el inventario de módulos asociado; el atributo accesible `aria-label` conserva la misma información para tecnologías asistivas.

La vista actual puede exportarse como PNG mediante una composición SVG generada en el navegador, respetando la búsqueda activa, la capa seleccionada, el zoom y el desplazamiento. También existe una opción `Imprimir / PDF`, que abre una versión preparada para impresión y guardado como PDF desde el diálogo del navegador. Ambas operaciones son informativas y no escriben en contratos, agentes, MJP CORE ni datos operativos.
