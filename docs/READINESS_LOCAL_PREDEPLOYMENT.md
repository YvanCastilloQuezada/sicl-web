# SICL — Readiness local previa al despliegue

**Fecha:** 2026-08-24
**Alcance:** comprobación no invasiva antes de disponer de Cloud Computer

## Conclusión

La integración server-side está preparada para recibir `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN` mediante el entorno del servidor. El cliente HTTP lee ambos valores exclusivamente desde `process.env`; el bearer se añade en la solicitud server-to-server y no se expone como variable `VITE_*`, payload de dominio, snapshot, auditoría ni respuesta de la interfaz. La ausencia de `SICL_CORE_URL` mantiene el fallo cerrado en producción; el fallback local solo se habilita con `SICL_ALLOW_LOCAL_CORE=true` fuera de producción.

## Verificación realizada

| Área | Resultado | Alcance real |
|---|---|---|
| `SICL_CORE_URL` | Preparada | Se consume desde el cliente HTTP server-side; no existe URL inventada |
| `SICL_CORE_SERVICE_TOKEN` | Preparada | Se exige para las solicitudes canónicas; no se entrega al navegador |
| Fallback local | Restringido | Solo desarrollo explícito mediante `SICL_ALLOW_LOCAL_CORE=true` |
| Contrato HTTP | Preparado | `sicl-core-http/0.3`, incluyendo escritura canónica de `Preference` |
| UPAO-001 | Reproducible | Se ejecutó en SQLite temporal y terminó `OK` |
| Datos persistentes reales | Pendiente | Requiere Cloud Computer y `/data/sicl/core.sqlite` |
| HTTPS y DNS | Pendiente | Requiere máquina, dominio y certificado reales |
| E2E web poblado | Pendiente | Requiere servicio remoto y sesión autorizada |

## Caso UPAO-001

El fixture existente `examples/upao_vertical_slice.py` se ejecutó con `PYTHONPATH=src python3 ./examples/upao_vertical_slice.py`. El script crea una base temporal, usa datos declarados como sintéticos/ilustrativos, ejecuta la cadena Evaluation → Comparison → Recommendation → Human Decision y elimina la base al finalizar. No modifica una base compartida ni representa evidencia profesional real.

El resultado observado fue `UPAO-001 vertical slice 0.2.4: OK`, con recomendación analítica separada de la decisión humana. Este resultado confirma reproducibilidad del ejemplo del núcleo, pero no sustituye una prueba de navegador contra el adaptador HTTP desplegado.

## Decisiones de seguridad

No se poblaron proyectos demo en la base WebDev, no se creó una puerta trasera, no se fabricó una URL, no se registraron secretos y no se marcó como completado ningún criterio que requiera Cloud Computer, HTTPS, persistencia externa o E2E remoto.

## Siguiente acción válida

Cuando el Cloud Computer esté conectado, ejecutar el runbook real y registrar la URL HTTPS resultante como `SICL_CORE_URL` mediante el gestor de secretos. Después se debe probar la persistencia tras reinicio, la autenticación 401, los conflictos 409, las violaciones 422, la lectura read-only de Council y el flujo completo con datos autorizados.
