# ARKI — PROTOCOLO DE CONTINUIDAD ENTRE CHATS (P0)

**Estado:** IMPLEMENTED_PARTIAL; validación automática y prueba en chat nuevo PENDING.

## Inicio obligatorio de cualquier chat nuevo

1. Abrir `docs/arki-master-map/ARKI_MAPA_VIVO_CONTINUIDAD.md` en esta rama. Confirmar SHA y fecha del corte.
2. Abrir `docs/arki-master-map/ARKI_CONTINUITY_EVENTS.jsonl`; recuperar todas las decisiones y bloqueos recientes, no solo el último resumen.
3. Verificar en GitHub si hay commits posteriores al corte, PR/CI actuales y documentos relacionados; no tomar el mapa como evidencia de verde.
4. Continuar desde el último pendiente verificable. No reiniciar inventarios ni volver a proponer ideas ya documentadas sin contrastarlas.
5. Mantener la autoridad del Core sobre D-2, Event Store y AGK. El mapa es una **proyección documental** y nunca sustituye los eventos canónicos.

## Después de cada acción significativa

Registrar un evento JSONL con `id`, `at`, `kind`, `summary`, `evidence`, `status`; `sha`/URL de evidencia si existe, `blocker` y `next` cuando corresponda. Los eventos son **declaraciones documentales**, no pruebas técnicas por sí solos. No reescribir registros previos para ocultar errores; añadir corrección con ID nuevo y `supersedes`.

Registrar explícitamente: decisiones del propietario, modificaciones, pruebas, CI, rechazos, contratos FROZEN, UNKNOWN, dependencias, cierre y próximas acciones. Distinguir fecha de concepción de idea, fecha del commit, fecha de validación y fecha de cierre.

## Regla de no invención

No inventar resultados de tests, aprobaciones, acceso a chats pasados, fechas de idea, capacidad cognitiva o autocorrección. La lectura automática de Git no captura conversaciones. La automatización recurrente no garantiza que cada acción del chat se incorpore hasta que exista integración y prueba E2E.

## Criterio de aceptación de P0

- Generador y tests pasan en SHA exacto.
- GitHub Actions regenera y publica el mapa sin bucles ni conflictos.
- Una nueva sesión lee el documento, reconstruye decisiones y retoma el último pendiente correctamente.
- Una decisión nueva se registra y reaparece en el mapa actualizado.
- Un CI fallido permanece bloqueado, sin falso VERIFIED.
- La memoria documental no duplica el Event Store Core.

**No declarar P0 CLOSED hasta completar todas las pruebas.**
