# RFC-023 — Core Connectivity and Deployment Contract

**Estado:** APPROVED — AUTHORIZED FOR IMPLEMENTATION
**Tipo:** Infraestructura, integración y observabilidad
**Fecha:** 16 de septiembre de 2026
**Dependencias:** RFC-017, RFC-018, RFC-019, RFC-020, RFC-021 y RFC-022

**Aprobación:** Product Owner / arquitecto
**Fecha de aprobación:** 16 de septiembre de 2026

## 1. Problema

El frontend mostraba `Failed to fetch` al intentar consumir el Core remoto. La causa verificada fue que el fallback del cliente apuntaba a `https://web-production-a93fa.up.railway.app`, un hostname que actualmente responde `404 Application not found`. El frontend también realizaba llamadas REST directamente desde el navegador, lo que hacía depender la operación de CORS y exponía la topología del servicio.

## 2. Objetivo

Definir una integración reproducible entre ARKI Web y SICL Core que use una única URL server-side, mantenga el token fuera del navegador, produzca errores diagnosticables y falle cerrado cuando el Core sea obligatorio.

RFC-023 no cambia entidades ontológicas, no añade autoridad al frontend y no convierte una Recommendation en Decision.

## 3. Alcance propuesto

El alcance comprende un proxy same-origin `/api/core/*`, configuración obligatoria de `SICL_CORE_URL`, uso exclusivo server-side de `SICL_CORE_SERVICE_TOKEN`, una comprobación de salud autenticada y mensajes de error diferenciados para DNS, HTTP, autenticación, CORS y timeout.

El proxy debe reenviar únicamente métodos y rutas permitidos por el contrato `/v1/...` y las rutas legacy que aún estén explícitamente soportadas. No debe aceptar una URL enviada por el navegador ni reenviar cabeceras de autorización del cliente.

## 4. Corrección mínima autorizada y estado del RFC

La siguiente corrección mínima fue autorizada independientemente de la aprobación formal de este RFC:

1. El cliente browser usa siempre `/api/core` y ya no contiene una URL Railway muerta.
2. El servidor añade un proxy same-origin que incorpora `SICL_CORE_SERVICE_TOKEN` únicamente en el servidor.
3. El proxy conserva el status HTTP y el cuerpo JSON del Core para que la UI pueda presentar el error real.
4. La ausencia de `SICL_CORE_URL` produce `503 CORE_UNAVAILABLE` con el mensaje `Core no configurado. Contacta al administrador.`; no se usa un fallback local silencioso.

Estos cambios constituyen la primera implementación autorizada de RFC-023. La configuración del endpoint real, las pruebas contra producción y la observabilidad ampliada permanecen pendientes porque el Core todavía no está desplegado.

## 5. Configuración requerida

El entorno de ejecución del frontend debe definir:

```text
SICL_CORE_URL=https://<host-real-del-core>
SICL_CORE_SERVICE_TOKEN=<token-del-servicio>
```

`SICL_CORE_URL` debe ser el origen HTTPS real que sirve el Core v2 con `/v1/...`. No debe ser el dominio WebDev del frontend. El token debe ser independiente, con mínimo privilegio y rotación controlada.

No se debe definir `VITE_SICL_CORE_SERVICE_TOKEN`, ni incluir el token en `client/src`, en el bundle de Vite o en archivos `.env` versionados.

## 6. Diagnóstico reproducible

Antes de declarar una integración operativa se deben comprobar, desde el entorno de despliegue:

```bash
curl -i "$SICL_CORE_URL/openapi.json"
curl -i -H "Authorization: Bearer $SICL_CORE_SERVICE_TOKEN" "$SICL_CORE_URL/v1/scales"
curl -i -X OPTIONS "$SICL_CORE_URL/v1/projects"
```

El primer comando comprueba que el hostname apunta a una aplicación. El segundo comprueba disponibilidad, autenticación y contrato. El tercero permite distinguir una política CORS de un fallo de aplicación. Un `404 Application not found` del proveedor no debe interpretarse como un error ontológico del Core.

## 7. Estados de error

La capa de integración debe diferenciar al menos estos estados:

| Estado | Significado | Acción de la interfaz |
|---|---|---|
| `CORE_UNAVAILABLE` | Falta URL o no hay conexión | Mostrar bloqueo operativo y conservar datos locales no decisorios |
| `CORE_HTTP_ERROR` | El Core respondió con error | Mostrar status y código sin ocultar el envelope |
| `CORE_UNAUTHORIZED` | Token ausente o inválido | Solicitar corrección server-side; nunca pedir token al navegador |
| `CORE_TIMEOUT` | El Core no respondió a tiempo | Permitir reintento explícito |
| `CORE_CONTRACT_ERROR` | La respuesta no cumple el envelope | Detener la operación y registrar incompatibilidad |

## 8. Invariantes constitucionales

La conectividad no altera la autoridad humana. Una llamada fallida no crea una Recommendation, una HumanReview ni una Decision. Una respuesta válida del Core tampoco autoriza por sí sola una decisión.

El frontend debe distinguir los datos provenientes del Core de cualquier estado local de edición. Cuando `SICL_CORE_URL` está configurado, las operaciones que requieren Core deben fallar cerrado si el servicio no responde.

## 9. Observabilidad

El servidor debe registrar un identificador de correlación, método, ruta lógica, status, latencia y código de error. Nunca debe registrar el token ni cuerpos que contengan información sensible. La UI puede mostrar el identificador de correlación al usuario para soporte operativo.

La comprobación de salud debe ser de solo lectura. No debe crear proyectos, eventos o decisiones.

## 10. Criterios de aceptación

RFC-023 podrá pasar a `IMPLEMENTED` cuando exista un hostname real del Core configurado en WebDev, el endpoint `/v1/scales` responda con autenticación válida, el proxy same-origin funcione en preview y producción, y el flujo Camino A se pruebe contra el Core remoto real.

También se requiere cobertura de tests para URL por defecto, ausencia de configuración, propagación de status, no exposición del token, timeout y respuesta con envelope v1.

## 11. Bloqueo actual

La corrección mínima de transporte está integrada en `main@74bf4aed`, pero la validación remota permanece bloqueada porque el hostname Railway conocido responde `404 Application not found` y no existe todavía un `SICL_CORE_URL` vigente configurado en el proyecto WebDev. No se debe declarar E2E operativo hasta resolver esa configuración. La integración de transporte está implementada; la configuración productiva y el E2E remoto permanecen pendientes.

## 12. Plan de trabajo autorizado

La Fase A consiste en confirmar el servicio real y registrar `SICL_CORE_URL` server-side. La Fase B consiste en verificar el proxy y las rutas `/v1`. La Fase C consiste en ejecutar Camino A completo. La Fase D consiste en añadir health checks y observabilidad sin introducir cambios ontológicos.

## 13. Firma y decisión del Product Owner

**Autor:** Manus AI
**Revisión:** aprobada por el Product Owner / arquitecto el 16 de septiembre de 2026
**Estado:** `APPROVED — AUTHORIZED FOR IMPLEMENTATION`

## References

[1]: https://github.com/YvanCastilloQuezada/sicl-core "SICL Core repository"
[2]: https://github.com/YvanCastilloQuezada/sicl-web "ARKI Web repository"
[3]: https://fastapi.tiangolo.com/advanced/middleware/ "FastAPI middleware documentation"

## Apéndice A — Regla de despliegue

El despliegue del frontend debe incluir `SICL_CORE_URL` como secreto o variable protegida del servidor. El valor no debe compilarse con prefijo `VITE_`. Si el proveedor de hosting no permite configurar la variable, el despliegue debe marcarse como incompleto y la UI debe mostrar el bloqueo de infraestructura.

## Apéndice B — Compatibilidad

El proxy no modifica el contrato HTTP del Core. Solo cambia el transporte entre navegador, servidor WebDev y Core. Las respuestas v1 deben conservar `contract_version`, `status`, `code`, `message`, `project_id`, `observed_version` y `data` cuando el Core los produzca.

## Apéndice C — Seguridad

El proxy debe rechazar destinos arbitrarios, métodos no necesarios y cabeceras de salto. La lista de rutas permitidas debe mantenerse en código server-side. Los errores destinados al navegador no deben incluir secretos, variables de entorno completas ni trazas internas.

## Apéndice D — Cierre

La implementación inicial resuelve la dependencia del navegador respecto de CORS y elimina el fallback Railway obsoleto. No puede resolver por código un hostname de despliegue que ya no existe. La siguiente acción externa necesaria es proporcionar o configurar la URL HTTPS vigente del Core v2.

## Apéndice E — Nota de alcance

RFC-023 no implementa RFC-024, no modifica el modelo de decisión y no altera el catálogo de escalas de RFC-019. Cualquier ampliación posterior debe seguir el proceso de RFC-018 y recibir aprobación antes de modificar el contrato.

## Apéndice F — Prueba de no regresión

La prueba de no regresión debe verificar que el cliente usa `/api/core` cuando no hay `VITE_API_URL`. También debe verificar que los tests locales pueden inyectar una URL explícita sin afectar la configuración de producción.

## Apéndice G — Resultado esperado

El resultado operativo esperado es: navegador → `/api/core` same-origin → Core HTTPS v2. El navegador nunca conoce ni transporta el token de servicio. Si el Core falla, la interfaz informa un bloqueo verificable en vez de simular un resultado local.

## Apéndice H — Decisión registrada

RFC-023 fue aprobado formalmente por el Product Owner el 16 de septiembre de 2026. La aprobación autoriza la implementación del contrato de conectividad, pero no inventa ni configura una URL o token inexistentes. El hostname canónico y el token se incorporarán cuando el Core sea desplegado en producción.

## Apéndice I — Registro de cambios

- Diagnóstico: Railway hostname conocido devuelve `404 Application not found`.
- Cambio: fallback browser sustituido por `/api/core`.
- Cambio: proxy server-side añadido.
- Verificación: typecheck y suite frontend previamente verdes.
- Pendiente: configurar URL real y ejecutar E2E remoto.

## Apéndice J — Relación con RFC-022

RFC-022 puede mostrar catálogos y recorridos sin conexión, pero las operaciones canónicas deben pasar por el Core. El modo guiado no debe ocultar un fallo de conectividad ni presentar estados locales como estados confirmados por SICL.

## Apéndice K — Relación con autoridad humana

La disponibilidad del Core es una condición operativa. No es una autorización. El actor humano y su autoridad siguen siendo obligatorios para HumanReview y Decision.

## Apéndice L — Estado de revisión

Este documento registra la aprobación formal. La implementación inicial de transporte está en `main`; la configuración de producción y la prueba E2E quedan pendientes del despliegue del Core.

## Apéndice M — Firma del baseline

Baseline de frontend: `main@74bf4aed554555866aa58096f31b5444e47b8796`. Baseline de Core: `main@6b0bad78e1213d783c006ad13c54dd9a42c68a20`.

## Apéndice N — Conclusión

La solución correcta no es reactivar una URL Railway inexistente ni añadir un fallback silencioso. La solución es configurar el servicio real y transportar sus llamadas mediante un proxy server-side auditable.

## Apéndice O — Próximo paso

Con la URL HTTPS vigente disponible, se debe actualizar `SICL_CORE_URL`, ejecutar el test de salud autenticado, reiniciar el despliegue y repetir el Camino A completo.

## Apéndice P — Límite de este RFC

Este RFC no autoriza compra, cambio de dominio, cambio de permisos, rotación de credenciales ni publicación externa adicional. Esas acciones requieren sus respectivos permisos y procedimientos.

## Apéndice Q — Estado actual de RFC-023

**RFC-023:** aprobado y autorizado para implementación, con transporte server-side inicial aplicado; pendiente de configuración del endpoint remoto y verificación E2E de producción.

## Apéndice R — Reproducibilidad

Todos los comandos de diagnóstico deben ejecutarse contra una copia exacta del endpoint configurado. Los resultados deben conservarse con fecha, status HTTP y commit de frontend/Core, sin incluir tokens.

## Apéndice S — No equivalencias

`HTTP 200` del preview demuestra que el frontend está servido. No demuestra que el Core remoto esté conectado. `HTTP 404` del dominio WebDev tampoco demuestra un fallo del código frontend si el preview responde correctamente.

## Apéndice T — Criterio de cierre operativo

RFC-023 se considerará cerrado solo cuando el preview y el dominio de producción usen la misma configuración server-side, el Core responda desde el hostname canónico y Camino A produzca eventos auditables en el Core remoto.

## Apéndice U — Mantenimiento

La URL canónica debe mantenerse en la configuración protegida del entorno y en la documentación operativa. Los cambios de proveedor, hostname o versión de contrato requieren actualización de RFC-023 o un RFC sucesor.

## Apéndice V — Resumen ejecutivo

Se ha corregido el diseño de transporte para que la conexión sea server-side y diagnóstica. Falta una única dependencia externa crítica: un Core v2 desplegado y un hostname HTTPS vigente configurado en WebDev.

## Apéndice W — Cierre documental

La propuesta queda lista para revisión del Product Owner y para la ejecución de la configuración de entorno cuando se disponga del endpoint canónico.


## Apéndice Q — Estado RFC-022/RFC-024

RFC-022 está integrado en `sicl-web/main` y sus verificaciones locales están verdes. RFC-023 está aprobado y su transporte same-origin está integrado; la configuración del Core real sigue pendiente. RFC-024 no existe como rama, documento ni implementación en los repositorios seleccionados y no se fusiona ni se etiqueta como implementado.


## Estado vigente de integración con el Core

La interfaz guiada, la Command Bar y el Help Center son capacidades de presentación. Las llamadas al Core pasan por el proxy server-side. Nunca se expone `SICL_CORE_SERVICE_TOKEN` en el navegador.

El Core vigente incluye RFC-027 BIM/IFC, RFC-028 GIS/Catastro y RFC-029 Copiloto Ollama. El frontend puede presentar estados de `PREVIEW_ONLY`, `HUMAN_REVIEW_REQUIRED`, `CORE_UNAVAILABLE` y `CORE_UNAUTHORIZED`. La ausencia de `SICL_CORE_URL` debe mostrarse como infraestructura no configurada, no como un error ontológico.

La conexión productiva requiere configurar server-side `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN`. El manual de despliegue del Core define el procedimiento y la suite remota pendiente.
