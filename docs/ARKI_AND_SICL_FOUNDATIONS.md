# Fundamentos de ARKI y SICL

## Qué es ARKI

ARKI es el **Sistema de Inteligencia de Diseño Espacial Multiescala**. Es un sistema de apoyo para organizar información espacial, comparar alternativas y documentar decisiones de diseño en distintas escalas. Su propósito es mejorar la trazabilidad y la calidad de la deliberación, no sustituir al arquitecto ni a la autoridad profesional.

El sistema puede representar un proyecto, su sitio, objetivos, restricciones, evidencia, alternativas, evaluaciones, recomendaciones, revisiones humanas, decisiones y eventos de auditoría. También puede relacionar escalas y tiempo cuando esas dimensiones se declaran explícitamente.

## Qué es SICL

SICL significa **Spatial Intelligence Command Language**. Es el lenguaje formal de operación del Core de ARKI. Una instrucción SICL expresa una operación verificable sobre una entidad o un análisis. El CLI y la interfaz web pueden presentar la misma operación, pero la validación canónica pertenece al Core.

Ejemplo:

```text
/PROJECT CREATE UPAO-001 "UPAO Plaza" parcela_sitio proyecto
```

La Command Bar ayuda a descubrir y completar comandos. Sus traducciones, sugerencias y ejemplos no alteran la sintaxis formal ni crean una autoridad alternativa.

## Relación entre ambos

ARKI define el **sistema y su modelo de decisión**. SICL define el **lenguaje que opera ese modelo**. El frontend `sicl-web` es una superficie de interacción; `sicl-core` es la superficie de dominio y persistencia.

Esta separación evita confundir una etiqueta visual con una entidad, una recomendación con una decisión o una ayuda de interfaz con una regla del Core.

## Invariantes constitucionales

La autoridad humana es obligatoria para las decisiones. Una `Recommendation` es una salida analítica y no una `Decision`. Una `Decision` requiere `HumanReview`, actor y authority. `Fact`, `Assumption` y `Preference` son categorías distintas y no deben mezclarse sin evidencia y trazabilidad.

Los eventos de auditoría son append-only. La interfaz puede mostrar un estado o un preview, pero no puede presentarlo como una mutación persistida sin confirmación del Core.

## Flujo de operación

El Camino A mínimo es:

```text
Project → Preference → Recommendation → HumanReview → Decision → Audit
```

El frontend expone diez módulos para que el usuario pueda llegar a cada superficie complementaria: contexto, objetivos, alternativas, evidencia, evaluaciones, comparaciones, consejo y gobernanza. El mapa de diez módulos amplía la navegación, pero no cambia el flujo constitucional de seis pasos.

## Responsabilidades

| Capa | Responsabilidad |
|---|---|
| ARKI | Modelo conceptual, escalas, trazabilidad y gobernanza de decisiones |
| SICL | Sintaxis formal de comandos y operaciones del Core |
| sicl-core | Validación, persistencia, invariantes, eventos y API `/v1` |
| sicl-web | Navegación, formularios, visualización, ayuda e interacción |
| Humano autorizado | Revisión, autoridad y decisión final |

## Alcance y límites

ARKI no es una certificación legal ni un sustituto de la revisión profesional. SICL no decide por el usuario. El frontend no debe guardar secretos server-side, crear decisiones automáticamente ni usar fallback silencioso para simular que el Core respondió.

## Referencias internas

La arquitectura detallada del frontend está en `docs/ARKI_FRONTEND_ARCHITECTURE.md`. La ayuda operativa vive en `docs/HELP_SYSTEM.md` y `docs/COMMAND_BAR.md`. La sintaxis canónica se mantiene en la referencia de comandos sincronizada desde el Core.
