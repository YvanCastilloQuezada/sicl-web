# SICL después del documento 65: decisión de producto y arquitectura

## Decisión ejecutiva

El documento 65 aporta dos innovaciones compatibles pero distintas. La primera es un **método de construcción con separación de responsabilidades**: el Product Owner define visión y prioridades; el Chief Architect protege semántica, contratos e invariantes; el Implementation Engineer ejecuta, prueba y documenta. La segunda es el **producto SICL como motor de inteligencia espacial y decisión multiescalar**, desde el espacio arquitectónico hasta el territorio nacional.

Ambas ideas se incorporan, pero con una precisión: esos roles describen responsabilidades del proceso de construcción y no crean, por sí mismos, permisos ni autoridad decisoria dentro del software. La autoridad sobre una decisión SICL continúa dependiendo de una identidad verificada, una base de autoridad explícita y una confirmación humana.

| Aporte del documento 65 | Estado actual | Decisión |
|---|---|---|
| Separación Product Owner / Chief Architect / Implementation Engineer | Parcialmente implícita en el flujo de trabajo | Formalizarla como artefacto de gobernanza del desarrollo, no como jerarquía de decisión del dominio |
| Flujo propuesta → contrato → autorización → implementación → pruebas → auditoría → release | Disperso entre documentos, tests y checkpoints | Convertirlo en un registro de gates trazable |
| Spatial Entity desde espacio hasta país | SICL 1–3 ya está representado mediante scopes | Mantener `Project` como unidad de trabajo actual y preservar `Spatial Entity` como dirección evolutiva |
| PEDN 2050 y escenarios nacionales | No son doctrina ni hechos del Core | Modelarlos como referencias y escenarios externos con evidencia, versión y procedencia |
| Comunicación directa entre modelos | No existe una conversación permanente garantizada | No acoplar el Core a una IA concreta; usar artefactos verificables y contratos reproducibles |

## Mejora distintiva incorporada

SICL adopta un **Capability Gate Ledger**: cada capacidad nueva debe declarar qué problema resuelve, qué contrato la limita, quién autoriza su entrada al roadmap, qué pruebas la verifican y qué evidencia permite liberarla. Esto diferencia a SICL de un generador de funciones: la creatividad puede proponer, pero solo una capacidad contractual y verificable puede avanzar.

El ledger no decide por el Product Owner, no sustituye la auditoría técnica y no transforma una recomendación analítica en una Decision. Es un control de coherencia del producto.

## Fronteras

SICL no incorporará “Perú 2050” como doctrina codificada. Podrá evaluar un escenario PEDN, una estrategia alternativa u otros escenarios comparables siempre que cada uno tenga fuente, versión, fecha, escala, horizonte y supuestos explícitos.

SICL tampoco presentará prototipos, cifras ilustrativas, predicciones o resultados de IA como hechos. BIM, GIS, sensores, gemelos digitales, optimización y modelos de lenguaje entran como adaptadores o capas analíticas; no modifican la autoridad humana ni el núcleo semántico.

## Ruta priorizada

La prioridad inmediata es cerrar el navegador con un proyecto real pequeño y mantener el núcleo estable. En paralelo, el ledger de capacidades protege la evolución hacia Spatial Intelligence. Después podrán entrar Site Intelligence, GIS, BIM y solvers IO individuales, cada uno con su propio contrato y evidencia. La escala nacional es una capacidad futura habilitada por la abstracción espacial, no una promesa de producción actual.


## PO-016 — RFC-023 Core Connectivity and Deployment Contract

**Decisión:** APROBADO.

**Fecha:** 16 de septiembre de 2026.

**Alcance autorizado:**

- Proxy same-origin `/api/core/*`.
- Configuración obligatoria de `SICL_CORE_URL` sin valor por defecto.
- Uso exclusivo server-side de `SICL_CORE_SERVICE_TOKEN`.
- Comprobación de salud autenticada y read-only.
- Mensajes diferenciados para `CORE_UNAVAILABLE`, `CORE_HTTP_ERROR`, `CORE_UNAUTHORIZED`, `CORE_TIMEOUT` y `CORE_CONTRACT_ERROR`.
- Observabilidad con correlation ID, método, ruta lógica, status, latencia y código de error, sin token ni cuerpos sensibles.

**Condiciones constitucionales:**

- No modifica el Core.
- No modifica el Core Contract.
- No crea endpoints nuevos en el Core.
- No añade fallback silencioso.
- No expone el token al navegador ni al bundle de Vite.
- Mantiene `Recommendation ≠ Decision` y `Conectividad ≠ Autoridad`.
- Mantiene fail-closed cuando el Core es obligatorio.

**Implementación y estado:**

- Corrección de transporte: aplicada en `sicl-web` mediante el commit `6156a310`.
- Aprobación formal documentada en `sicl-web` mediante el commit `357e59d1`.
- Implementación formal ampliada: autorizada, pero pendiente de despliegue real del Core.
- `SICL_CORE_URL`: pendiente; no existe todavía una URL de producción vigente.
- `SICL_CORE_SERVICE_TOKEN`: pendiente; no se ha emitido ni configurado.
- E2E Camino A: bloqueado por infraestructura.

**Estado:** CERRADA — 16 de septiembre de 2026, como decisión de aprobación; el cierre operativo de RFC-023 queda condicionado al despliegue del Core y a la verificación E2E.

> Esta decisión no autoriza inventar una URL, emitir credenciales, reactivar el hostname Railway obsoleto ni declarar el E2E como verificado.

## Estado documental relacionado

RFC-023 permanece aprobado y autorizado para implementación. La propuesta de alias localizados de RFC-019 (`RFC-019_LOCALIZED_SICL_COMMAND_ALIASES.md`) es un documento distinto y conserva su propio estado de propuesta; no se modifica por PO-016.
