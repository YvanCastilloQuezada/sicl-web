# Catálogo federado de asistentes ARKI–LUCA

## Hallazgo principal

MiLukita no tiene un único asistente: contiene un conjunto de **19 contratos de agente** distribuidos entre audiencia, marketing, contenido, personaje, finanzas, experiencia, auditoría, watchdog, recovery, supervisor, estrategia, distribución, legal, campo, territorio y control de dispositivos. ARKI mantiene **25 asistentes arquitectónicos y transversales** en su registro propio. No conviene duplicarlos ni fusionar sus núcleos; conviene federarlos mediante contratos y un director de orquesta.

## MiLukita: inventario revisado

| ID | Dominio | Estado observado | Disposición |
|---|---|---|---|
| audience-intelligence | Audiencia | PARTIAL | SHARED_READ_ONLY |
| marketing | Marketing | PARTIAL | SHARED_CONTRACT |
| social | Canales | PREPARED | ADAPTER_REQUIRED |
| content | Contenido | PREPARED | SHARED_CONTRACT |
| lukita | Personaje/presentadora | IMPLEMENTED | SHARED_CONTRACT |
| sales | Ventas | PARTIAL | ISOLATED |
| revenue | Ingresos | PREPARED | ISOLATED |
| financial-intelligence | Finanzas | IMPLEMENTED | SHARED_READ_ONLY |
| experience-director | Experiencia | IMPLEMENTED | SHARED_CONTRACT |
| auditor | Gobernanza | IMPLEMENTED | SHARED_READ_ONLY |
| watchdog | Alertas | IMPLEMENTED | SHARED_READ_ONLY |
| recovery | Recuperación | IMPLEMENTED | SHARED_CONTRACT |
| supervisor | Escalamiento | PARTIAL | ADAPTER_REQUIRED |
| business-strategy | Estrategia | IMPLEMENTED | SHARED_CONTRACT |
| distribution | Distribución | PARTIAL | ADAPTER_REQUIRED |
| legal-compliance-intelligence | Legal/compliance | PLANNED | PLANNED |
| field-voice-copilot | Campo/voz | IMPLEMENTED | SHARED_CONTRACT |
| territorial-trust | Evidencia territorial | IMPLEMENTED | SHARED_READ_ONLY |
| device-controller | Interoperabilidad | IMPLEMENTED | ADAPTER_REQUIRED |

Los módulos de ventas, ingresos y cualquier componente ligado a juegos, wallet, ledger, RNG, RTP o settlement permanecen aislados del intercambio arquitectónico. El catálogo no concede autoridad sobre ellos.

## ARKI: capacidades reutilizables para LUCA

ARKI puede aportar, con adaptación y sin entregar el Core, los contratos de `Project Brief`, consecuencia, VOI, deuda, contrafactual, red team, contradicciones, transferencia con provenance, software, economía, contabilidad, investigación de operaciones, seguridad y gobierno. Las capacidades normativas, BIM, ingeniería y profesionales requieren adaptadores, fuentes jurisdiccionales y revisión profesional.

## Director de orquesta

El contrato `ARKI-FEDERATED-ASSISTANT-DIRECTOR-1.0` selecciona asistentes por intención, registra commit de origen y evidencia, clasifica la disposición de intercambio y produce una traza. Su salida sólo puede ser `HUMAN_REVIEW` o `APPROVED` después de autoridad humana explícita. Sin commit o evidencia, la solicitud queda `BLOCKED`.

El director mantiene estas invariantes:

- `ONE_GOVERNED_DIRECTOR`;
- `CORE_WRITE: FORBIDDEN`;
- `SECRET_TRANSFER: FORBIDDEN`;
- cada asistente mantiene su producto de origen;
- `canMutateCore = false` para todos;
- toda propuesta conserva evidencia, limitaciones y revisión humana;
- compartir un contrato no significa compartir credenciales, base de datos, identidad o estado canónico.

## Arquitectura recomendada

```text
Usuario / Control Panel de ARKI
              |
              v
ARKI-FEDERATED-ASSISTANT-DIRECTOR
              |
     selección + provenance + gates
       /                         \
ARKI assistants              LUCA assistants
       |                         |
ARKI Unified Motor          LUCA runtime / field / campaign
       \                         /
        candidatos auditables
              |
      revisión humana final
              |
     Core propio de cada producto
```

El director puede ser manejado desde ARKI como **control plane**, pero no convierte a ARKI en dueño técnico del Core de MiLukita. LUCA puede seguir funcionando independientemente; ARKI sólo recibe contratos, resultados permitidos y evidencia trazable.

## Estado de implementación

La federación está implementada como catálogo tipado, selector por intención, trazabilidad de handoff, clasificación de disposición, bloqueo de secretos y prohibición de mutación de Core. La ejecución física de asistentes, la sincronización de bases de datos y los hosts externos siguen requiriendo adaptadores y autorización explícita.
