# A0 — Registro de defectos y severidad

A0 no inventa defectos a partir de ausencia de evidencia. Usa estas categorías para la etapa de confirmación.

| Severidad | Definición | Ejemplo de evidencia requerida |
|---|---|---|
| P0 | Arranque imposible, ejecución arbitraria o mutación no autorizada | Consola, request y reproducción limpia |
| P1 | Acción crítica no funciona, pierde datos o cruza un gate | Pasos reproducibles y estado antes/después |
| P2 | Acción principal funciona parcialmente o feedback es insuficiente | Video/captura y payload |
| P3 | Defecto visual, texto, accesibilidad o ergonomía sin impacto de datos | Captura y criterio esperado |
| UNKNOWN | No hay evidencia suficiente para clasificar | Fuente y prueba pendiente |

Estado actual A0: `UNKNOWN` para los controles individuales. No se reproduce un bloqueo TypeScript en el baseline actual. Si reaparece en otro entorno, debe clasificarse como P0 de bootstrap y reproducirse con logs antes de corregirlo.
