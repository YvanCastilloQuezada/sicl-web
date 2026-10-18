# SICL 0.6 — Product Acceptance Contract

## Estado

**Aprobado conceptualmente por el Product Owner:** 24/08/2026
**Naturaleza:** Contrato de aceptación del producto; no sustituye ni modifica el SICL Core Contract.
**Caso de validación:** UPAO Plaza Center, utilizado como laboratorio controlado y no como solución arquitectónica atribuida al software.

## 1. Propósito

SICL 0.6 será considerado el **Primer Proyecto Arquitectónico Ejecutable** cuando una persona que no participó en su programación pueda abrir el sistema desde un navegador, crear o recuperar un proyecto, completar un flujo de decisión profesional delimitado y comprender de dónde proviene cada resultado principal.

“Ejecutable” significa que el flujo puede realizarse de principio a fin con persistencia, referencias, estados y auditoría. No significa que SICL diseñe autónomamente, certifique una solución, seleccione una decisión profesional ni sustituya la responsabilidad humana.

## 2. Frontera de producto

SICL 0.6 incluye un flujo vertical completo y una representación espacial contextual mínima. No incluye todavía GIS profesional, CAD o generación de planos terminados, BIM/IFC completo, Digital Twin vivo, IoT, SCADA, agentes autónomos, optimización nacional ni planificación automática del Perú.

La frontera obligatoria es:

```text
Proyecto
  → Contexto espacial y temporal
  → Evidencia
  → Objetivos
  → Restricciones
  → Preferencias
  → Alternativas
  → Evaluation
  → Comparison
  → Recommendation
  → HumanReview
  → Decision
  → Audit
  → Report
```

## 3. Criterios de aceptación

| ID | Criterio | Evidencia requerida | Autoridad del sistema |
|---|---|---|---|
| PA-01 | Identidad y acceso | Usuario autenticado y limitado a proyectos autorizados. | El sistema controla acceso; no decide por el usuario. |
| PA-02 | Proyecto persistente | Proyecto creado, recuperado y actualizado con versión. | El Core conserva identidad y concurrencia. |
| PA-03 | Contexto espacial | Ubicación, alcance espacial y horizonte temporal explícitos. | El sistema muestra contexto; no infiere precisión inexistente. |
| PA-04 | Evidencia | Fuentes, evidencias, referencias y estado diferenciados. | El sistema conserva provenance; no convierte supuestos en hechos. |
| PA-05 | Objetivos | Objetivos relacionados con requisitos y dirección explícita. | El sistema rechaza dirección ausente. |
| PA-06 | Restricciones | Métrica, operador, umbral y alcance explícitos. | El sistema valida estructura y referencias. |
| PA-07 | Preferencias | Preferencias separadas de requisitos y restricciones, con autor y justificación. | No pueden elevarse silenciosamente a obligación. |
| PA-08 | Alternativas | Dos o más alternativas distinguibles y trazables. | El sistema registra; no genera ganador automático. |
| PA-09 | Evaluation | Alternativa, objetivo, criterio, valor, unidad, método, inputs, provenance y factibilidad. | El resultado es un registro analítico, no una decisión. |
| PA-10 | Comparison | Evaluation IDs válidos, objetivo, dirección, tipo y factibilidad explícita. | No se permite dirección implícita ni referencia cruzada. |
| PA-11 | Recommendation | Razón, alternativa, referencia analítica, tipo de base y versión. | Recommendation no equivale a Decision. |
| PA-12 | HumanReview | Actor, versión observada, confirmación y autoridad de revisión. | Solo registra revisión humana explícita. |
| PA-13 | Decision | Autoridad humana, confirmación, alternativa elegida y motivo. | Nunca se crea automáticamente desde Recommendation. |
| PA-14 | Audit | Eventos, versiones, actores y datos seguros reconstruibles. | Se filtran secretos y no se reescriben eventos previos. |
| PA-15 | Report | Informe que distingue hechos, supuestos, análisis, Recommendation, HumanReview y Decision. | Exporta trazabilidad; no certifica validez profesional. |
| PA-16 | Spatial view | Mapa o representación contextual mínima con origen y precisión declarados. | No se presenta como GIS/CAD profesional. |
| PA-17 | Usabilidad | Persona no programadora completa el flujo y comprende resultados principales. | La usabilidad no sustituye la prueba de integridad. |
| PA-18 | Integridad | Las referencias, versiones, estados de factibilidad, autoridad y eventos permanecen consistentes. | La integridad se verifica con pruebas, no con opinión. |

## 4. Pruebas obligatorias

SICL 0.6 requiere dos pruebas distintas. La **prueba de uso** debe ser ejecutada por una persona no participante en la programación, usando un proyecto de validación poblado. La **prueba de integridad** debe verificar referencias, versiones, pertenencia al proyecto, errores, estados de factibilidad, separación entre Recommendation y Decision, seguridad de payloads y preservación de eventos.

La aceptación completa no se obtiene con una captura de pantalla, un mock, una prueba unitaria aislada ni una API que responda correctamente. Debe existir evidencia del flujo completo y de sus invariantes.

## 5. División de responsabilidades

| Capa | Responsabilidad en 0.6 |
|---|---|
| SICL Core | Entidades, referencias, estados, versiones, persistencia y frontera de autoridad. |
| Adaptador HTTP | Transporte versionado, autenticación server-to-server y normalización mínima. |
| Aplicación web | Flujo de usuario, formularios, navegación, estados de error y representación. |
| Usuario responsable | Aportar datos, validar interpretaciones, revisar Recommendation y emitir Decision. |
| Motores analíticos | Todavía limitados a registros y métodos controlados; no se convierten en autoridad. |

## 6. Reglas de no aceptación

No se considerará cumplido PA-17 si el flujo solo funciona para la persona que conoce la implementación. No se considerará cumplido PA-18 si existen referencias cruzadas silenciosas, dirección por defecto, factibilidad implícita, eventos mutables o secretos en payloads.

Tampoco se considerará SICL 0.6 terminado si se presenta una Recommendation como decisión automática, si el mapa muestra precisión no respaldada, si una cifra probabilística no tiene inputs reproducibles o si UPAO Plaza Center se presenta como una solución profesional generada y certificada por SICL.

## 7. Estado inicial de implementación

El proyecto ya cuenta con una parte importante del contrato: autenticación, proyectos persistentes, scopes espaciales y temporales, entidades de evidencia y objetivos, alternativas, evaluaciones y comparaciones explícitas, Recommendations, HumanReview, Decision, auditoría, gobernanza read-only y pruebas de integración local. La verificación contra un núcleo Python remoto real, el proyecto poblado en navegador y la persistencia remota continúan siendo criterios abiertos hasta disponer de la infraestructura correspondiente.

Este documento fija el objetivo de producto; no declara que todos los criterios ya estén cumplidos.
