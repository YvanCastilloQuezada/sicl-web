# Verificación funcional pendiente — ARKI Command Center

## Estado actual

La interfaz inicial carga correctamente en escritorio y móvil, y el contrato estático de `Alternatives & Evaluation` está cubierto por Vitest. La verificación funcional poblada todavía no debe marcarse como completada porque el entorno actual no dispone de un proyecto canónico cargado en la sesión de navegador ni de `SICL_CORE_URL`.

## Flujo que debe ejecutarse cuando exista infraestructura

| Paso | Acción | Evidencia requerida |
|---|---|---|
| 1 | Crear o seleccionar un proyecto con alcance espacial y temporal explícitos. | Snapshot y versión observada. |
| 2 | Registrar dos Alternatives, un Objective y sus referencias de Context/Evidence. | Registros visibles y eventos de auditoría. |
| 3 | Registrar dos Evaluations con método, inputs, unidades, provenance y factibilidad. | Evaluations persistidas sin inferencias. |
| 4 | Registrar una Comparison con `evaluationIds`, dirección y `feasibilityStatus`. | Comparison trazable y separada de `multiComparisons`. |
| 5 | Crear una Recommendation analítica basada en la Comparison. | `basedOn`, `basedOnKind`, razón y versión explícitos. |
| 6 | Abrir Council. | Vista read-only; no se crea autoridad. |
| 7 | Ejecutar HumanReview y preparar/registrar Decision. | Confirmación humana, autoridad y auditoría. |
| 8 | Repetir en escritorio y móvil. | Capturas de cada viewport y ausencia de desbordamiento. |

## Condición de ejecución

La prueba no debe resolverse mediante una ruta demo, datos ficticios en producción, una URL inventada ni un bypass de autenticación. Requiere un proyecto de prueba creado mediante el flujo autorizado y, para la ruta canónica, un servicio Python real detrás de HTTPS. Hasta entonces, las pruebas Vitest y las verificaciones visuales de la pantalla inicial son la evidencia local válida, pero no sustituyen el E2E poblado.
