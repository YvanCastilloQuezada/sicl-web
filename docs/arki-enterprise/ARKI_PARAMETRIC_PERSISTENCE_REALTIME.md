# ARKI — Persistencia, progreso realtime y workers paramétricos

## Estado implementado

La biblioteca de archivos paramétricos ahora se persiste en `parametric_files`, asociando cada registro con `ownerId` y `projectId`. El original permanece en WebDev File Storage; la base de datos conserva el manifiesto, checksum, formato, tamaño, dependencias declaradas, capacidades, host requerido, estado de validación y requisito de revisión humana. El retiro desde la interfaz es un archivado lógico, no una eliminación destructiva del original.

La ruta `/parametric-files` carga la biblioteca del proyecto activo, permite cambiar el identificador de proyecto, y sincroniza subida, listado y archivado mediante procedimientos protegidos. El proyecto debe pertenecer al usuario autenticado mediante `ownedProject`; el modo de acceso directo temporal no debilita esta protección del backend.

## Progreso WebSocket

El servidor HTTP comparte un canal WebSocket en `/ws/parametric`. El cliente se suscribe a `project:<projectId>` y recibe `UPLOAD_STARTED`, `VALIDATION_PROGRESS`, `REVIEW_REQUIRED`, `UPLOAD_COMPLETED` o `UPLOAD_FAILED`. Los eventos no contienen el archivo, sólo el estado operacional y el vínculo de proyecto, y todos preservan `humanReviewRequired: true`. Si WebSocket está temporalmente desconectado, la persistencia por tRPC continúa disponible.

## Workers reales y gate externo

Se implementó `parametricHostWorkers.ts` como frontera única para despachar contratos hacia workers externos de Dynamo/Revit, Rhino/Grasshopper y Blender. Cada worker requiere endpoint HTTPS, token, proyecto, artefacto, comando explícito y aprobación humana. Sin esos parámetros, el resultado es `PENDING_EXTERNAL` o `MISCONFIGURED`; ARKI no simula que Revit, Rhino o Blender estén instalados en WebDev. Las variables previstas son `ARKI_DYNAMO_WORKER_URL/TOKEN`, `ARKI_RHINO_WORKER_URL/TOKEN` y `ARKI_BLENDER_WORKER_URL/TOKEN`.

## Rendimiento demostrado

El benchmark reproducible `tools/benchmark_parametric_runtime.ts` ejecuta 100 grafos permitidos del kernel propio. La última ejecución obtuvo **media 41.09 ms, p95 45.79 ms y p99 56.74 ms**, con `loadTest: PASS`, concurrencia 1 y `hardRealtime: false`. Estas métricas describen el worker determinista local; no constituyen una garantía de rendimiento para Revit, Rhino, Blender, una cola distribuida o producción multiusuario.

## Próximos gates

Quedan pendientes la provisión de un host autorizado para cada ecosistema, el contrato de salud/versionado del worker, mTLS o equivalente, colas durables con reintentos e idempotencia, observabilidad p95/p99 bajo concurrencia real, límites por tenant y revisión humana de los resultados importados. Ninguno de estos gates se declara resuelto por la existencia del adaptador.
