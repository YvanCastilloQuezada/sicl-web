# Legal & Compliance Intelligence Agent

**Estado constitucional:** `PLANNED` · `NOT_STARTED` · `DISABLED` · `AUTONOMY 0`

**Proyecto:** MiLukita

**Naturaleza:** inteligencia consultiva futura, no asesoría jurídica autónoma y no sustituto de un abogado o profesional cualificado.

## 1. Decisión de arquitectura

MiLukita reconoce oficialmente una capacidad futura denominada **Legal & Compliance Intelligence Agent**. La incorporación realizada en esta fase es exclusivamente constitucional: registro, límites, dependencias, organigrama, matriz de autoridad, documentación y observabilidad conceptual. No se implementa un motor jurídico, no se conecta una fuente regulatoria, no se crea RAG, no se habilita un chatbot legal y no se autoriza ninguna presentación jurídica vinculante.

La cadena prevista es:

> READ → ANALYZE → CLASSIFY → DETECT → ASSESS RISK → PROPOSE → ALERT → ESCALATE → HUMAN / QUALIFIED PROFESSIONAL DECISION

La cadena prohibida es:

> AI → LEGAL DECISION → AUTONOMOUS EXECUTION

La regla constitucional es **Legal Intelligence informs authority; it does not become authority**. La capacidad de IA no equivale a autoridad legal autónoma.

## 2. Registro canónico

| Campo | Valor | Consecuencia |
|---|---|---|
| `id` | `legal_compliance_intelligence` | Identificador único; no se divide en subagentes ahora. |
| `status` | `PLANNED` | Existe como reserva arquitectónica, no como servicio operativo. |
| `implementation.state` | `NOT_STARTED` | No hay implementación funcional. |
| `enabled` | `false` | No puede activarse desde la interfaz. |
| `production` | `false` | No puede presentarse como disponible en producción. |
| `authority.level` | `ADVISORY_ONLY` | Futuras salidas serían recomendaciones no vinculantes. |
| `autonomy` | `0` | No ejecuta ni decide de forma autónoma. |
| `execution` | `DISABLED` | Incluso las acciones consultivas futuras están bloqueadas en esta fase. |
| `humanApproval.required` | `true` | Las decisiones jurídicas y regulatorias requieren persona o profesional cualificado. |
| `coreAccess` | `NONE` | No existe acceso al núcleo protegido. |

La definición ejecutable de este registro está en `shared/legalComplianceAgent.ts` y su prueba en `shared/legalComplianceAgent.test.ts`.

## 3. Posición en el organigrama

Legal & Compliance es una función transversal de **Governance OS**, no un módulo ordinario de Business OS. Mantiene interfaces conceptuales con Entertainment OS, Business OS, Experience/UX Intelligence, Data/Analytics, Agent Governance OS y Control Room. Todas las interfaces son futuras, documentales y deshabilitadas.

La secuencia institucional queda así:

```text
MiLukita
├── Entertainment OS
├── Business OS
├── Agent Governance OS
├── Legal & Compliance Intelligence
│   ├── PLANNED
│   ├── NOT_STARTED
│   ├── ADVISORY_ONLY
│   ├── AUTONOMY 0
│   └── EXECUTION DISABLED
├── Human Authority
├── KPI / Observability
├── Control Room
├── Authority Boundary
└── MJP CORE
    ├── RNG
    ├── Rules
    ├── Results
    ├── Wallet
    ├── Ledger
    └── Settlement
```

El organigrama de código se encuentra en `shared/milukitaMasterOrder.ts`; su representación visual reutiliza el organigrama constitucional existente.

## 4. Dominios reservados

Los siguientes dominios se reservan como mapa futuro del mismo agente: Corporate Legal, Regulatory Intelligence, Gaming Regulation, Advertising Compliance, Consumer Protection, Privacy & Data Protection, Intellectual Property, Contracts, Licensing, AI Governance, Digital Services / E-Commerce, International Expansion y Legal Claims & Representation Guard. No son agentes independientes ni módulos activos.

No se crea ahora ningún Gaming Agent, Privacy Agent, Contract Agent, IP Agent, Advertising Agent o Regulatory Agent. La fragmentación futura requeriría una justificación técnica, operativa o de gobernanza separada.

## 5. Autoridad futura permitida y autoridad prohibida

Si alguna vez se implementa, el máximo conceptual será leer, analizar, clasificar, comparar, detectar, monitorizar, puntuar riesgo, proponer, alertar, documentar y escalar. Todo resultado deberá identificarse como análisis, inferencia, recomendación o alerta, nunca como autorización jurídica.

El agente no podrá firmar contratos, aceptar responsabilidad, registrar empresas, modificar estructuras corporativas, presentar documentos jurídicos vinculantes, representar a MiLukita, emitir decisiones legales vinculantes, declarar cumplimiento definitivo, obtener licencias autónomamente, negociar términos vinculantes, aceptar settlements ni autorizar actividades reguladas. Tampoco podrá modificar MJP CORE, RNG, RTP, resultados, wallet, ledger o settlement.

## 6. Regla de riesgo y decisión

La escala conceptual será `L0_INFORMATIONAL`, `L1_LOW`, `L2_MODERATE`, `L3_HIGH` y `L4_CRITICAL`. Gaming regulado, licencias, sanciones potenciales, litigios, privacidad crítica y estructura societaria sensible pertenecen al nivel alto o crítico y requieren revisión humana o profesional.

Los gates futuros serán:

| Gate | Resultado | Requisito |
|---|---|---|
| `GREEN` | Continuar | Solo información suficientemente respaldada y no vinculante. |
| `YELLOW` | Human review | Revisión humana antes de avanzar. |
| `RED` | Bloquear | Bloqueo y escalamiento a humano/profesional. |

Se aplican además `NO DATA → NO CLAIM` y `NO VERIFIED EVIDENCE → NO LEGAL REPRESENTATION`. Una capacidad `PLANNED`, `SIMULATED` o `ESTIMATED` no puede presentarse como `AVAILABLE` o `PRODUCTION`.

## 7. Evidencia y auditabilidad futura

Toda salida futura deberá registrar consulta, fuente, jurisdicción, fecha, análisis, supuestos, evidencia, riesgo, recomendación, confianza, revisión humana, decisión, responsable, timestamp y versión. Las fuentes deberán distinguirse entre fuente legal primaria, secundaria, interpretación profesional, política interna, documento interno, supuesto e inferencia.

No se debe presentar una inferencia de IA como norma jurídica. La inteligencia legal futura deberá ser basada en evidencia y específica por jurisdicción.

## 8. Dependencias bloqueadas

La futura función dependería de fuentes legales actuales, jurisdicción explícita, profesionales cualificados, datos empresariales verificados, políticas internas, revisión de privacidad, derechos de propiedad intelectual y controles de publicación. Cualquier dependencia ausente se registra como `EXTERNAL_REQUIRED`, `HUMAN_REQUIRED` o `IMPLEMENTATION_BLOCKED`; no se sustituye con suposiciones.

La elección de jurisdicción nunca podrá reducirse a `LOW TAX → SELECT COUNTRY`. El análisis futuro deberá considerar modelo de negocio, legal, regulación, impuestos, licencias, datos, pagos, costos operativos, banca, inversión, sustancia y mercado, seguido de recomendación y decisión humana/profesional.

## 9. Lo que explícitamente no se construye

Permanecen `PLANNED / NOT_IMPLEMENTED / DISABLED`: RAG jurídico, base normativa, crawler jurídico, buscador normativo, análisis contractual, motor regulatorio, motor de licencias, privacy engine, IP engine, claim engine operativo, dashboard legal, chatbot legal, automatización de filings e integraciones con organismos reguladores.

## 10. Evidencia de implementación de esta orden

| Área | Evidencia |
|---|---|
| Contrato constitucional | `shared/legalComplianceAgent.ts` |
| Pruebas de estado y bloqueo | `shared/legalComplianceAgent.test.ts` |
| Registro maestro | `shared/agentRegistry.ts` |
| Pruebas del registry | `shared/agentRegistry.test.ts` |
| Orden y estado LRCI | `shared/milukitaMasterOrder.ts` |
| Matriz de autoridad | `docs/AGENT_AUTHORITY_MATRIX.md` |
| Arquitectura superior | `docs/LUKITA_LIVE_ARCHITECTURE.md` |
| Organigrama visual | `client/src/components/ConstitutionalOrgChartPanel.tsx` |
| Manual de límites y gobernanza | `docs/MILUKITA_CONTROLLER_LAB_MANUAL.md` |

**Conclusión:** la orden queda incorporada arquitectónicamente, pero el Legal & Compliance Intelligence Agent permanece **NOT IMPLEMENTED / DISABLED / AUTONOMY 0**. La incorporación no autoriza desarrollo funcional adicional ni abre un nuevo frente de producto.
