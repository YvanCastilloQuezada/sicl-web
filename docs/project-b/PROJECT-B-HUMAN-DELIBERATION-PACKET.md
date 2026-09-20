# Project B — Paquete de deliberación humana

**Project ID:** `PROJECT-B-COASTAL-MAKER-REFUGE-001`  
**Estado:** `HUMAN_DELIBERATION_REQUIRED`  
**Autoridad:** el arquitecto humano conserva la decisión final.

## Propósito

Este paquete permite revisar los dos candidatos semánticos producidos durante la ejecución ciega de P9.0. No crea un ganador, recomendación automática, decisión de diseño ni conocimiento K1. La deliberación debe registrar una preferencia razonada, aceptar una alternativa, solicitar una variante o declarar que la evidencia es insuficiente.

## Inputs congelados

El problema contiene un equipamiento comunitario costero para aprendizaje de reparación, reunión, apoyo mutuo y salida segura. El sitio, la jurisdicción, la orientación, el suelo, la ocupación máxima, el inventario de equipos, el perfil de eventos y las exigencias normativas específicas permanecen incompletos o desconocidos.

## Candidatos bajo revisión

### B-CANDIDATE-01 — Umbral compartido y secuencia de aprendizaje

La organización propone una secuencia **llegada → umbral compartido → aprendizaje → reunión**, con soporte controlado hacia el área de aprendizaje. Su virtud principal es una transición legible desde el acceso hacia la actividad comunitaria. Su riesgo es que el umbral compartido concentre demasiados flujos y que soporte, aprendizaje y reunión entren en conflicto durante eventos de alta demanda.

### B-CANDIDATE-02 — Reunión primero y soporte separado

La organización propone **llegada → reunión → aprendizaje**, con soporte y almacenamiento separados. Su virtud principal es proteger la operación de apoyo y reducir cruces entre servicio y actividad pública. Su riesgo es que la llegada a los espacios de aprendizaje sea menos directa y que la reunión se convierta en un filtro congestionado si no se verifica su capacidad.

## Matriz comparativa no decisoria

| Criterio | B-CANDIDATE-01 | B-CANDIDATE-02 | Evidencia actual | Decisión humana requerida |
|---|---|---|---|---|
| Legibilidad de llegada | Secuencia directa hacia el umbral | Llegada directa a reunión | Hipótesis semántica | ¿Cuál comunica mejor el propósito del edificio? |
| Relación aprendizaje–reunión | Aprendizaje precede a reunión | Reunión precede a aprendizaje | Hipótesis semántica | ¿Qué actividad debe tener mayor jerarquía? |
| Separación de soporte | Controlada, pero próxima al aprendizaje | Separada de manera explícita | Hipótesis semántica | ¿La operación requiere aislamiento fuerte? |
| Riesgo de congestión | Umbral compartido potencialmente crítico | Reunión potencialmente crítica | Sin aforo ni simulación | ¿Qué escenario de máxima demanda debe priorizarse? |
| Flexibilidad de eventos | No demostrada | No demostrada | Perfil de eventos desconocido | ¿Qué transformaciones debe admitir el edificio? |
| Accesibilidad | No demostrada | No demostrada | Ruta y topografía desconocidas | ¿Qué condiciones universales deben fijarse antes de geometrizar? |
| Evacuación | No demostrada | No demostrada | Jurisdicción y aforo desconocidos | Requiere datos normativos y especialista |
| Viabilidad constructiva | No evaluada | No evaluada | No existe geometría | No debe inferirse desde el diagrama |
| Adecuación climática | No evaluada | No evaluada | Orientación y clima específico incompletos | Requiere contexto ambiental |
| Preferencia arquitectónica | No definida | No definida | No se suministró intención formal | El arquitecto debe declarar criterio |

## Preguntas que debe responder el arquitecto

1. ¿Qué candidato se ajusta mejor a la intención principal del proyecto: **B-CANDIDATE-01**, **B-CANDIDATE-02** o ninguno?
2. ¿Qué actividad debe ocupar la posición jerárquica principal: aprendizaje, reunión, apoyo o transición?
3. ¿Debe el soporte estar separado físicamente del público o basta una relación controlada?
4. ¿Qué escenario debe gobernar la siguiente fase: uso cotidiano, evento comunitario, operación de reparación o emergencia?
5. ¿Qué datos faltantes deben recopilarse antes de generar geometría: aforo, orientación, accesibilidad, normativa, suelo, equipos u otros?
6. ¿Se autoriza explorar ambos candidatos geométricamente o solo uno?
7. ¿Qué consecuencias o riesgos deben vigilarse en la siguiente iteración?

## Registro de deliberación

```yaml
project_id: PROJECT-B-COASTAL-MAKER-REFUGE-001
status: HUMAN_DELIBERATION_REQUIRED
selected_candidate: PENDING_HUMAN_INPUT
selection_rationale: PENDING_HUMAN_INPUT
alternative_action: PENDING_HUMAN_INPUT
required_new_evidence: PENDING_HUMAN_INPUT
geometry_authorization: NOT_GRANTED
human_decision_recorded: FALSE
automatic_winner: NONE
recommendation_created: FALSE
k1_created: FALSE
```

## Acciones permitidas después de la respuesta humana

- **Solicitar información:** mantener ambos candidatos sin geometría.
- **Explorar ambos:** generar variantes geométricas comparables, sin ganador automático.
- **Seleccionar uno:** registrar una decisión humana explícita y generar únicamente la alternativa autorizada.
- **Rechazar ambos:** conservar el resultado como observación y abrir una nueva síntesis con intención adicional.

Ninguna opción produce por sí sola un proyecto ejecutivo, cumplimiento normativo, aprobación profesional o aprendizaje persistente.
