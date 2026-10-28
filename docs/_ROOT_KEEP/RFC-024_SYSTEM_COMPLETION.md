# RFC-024 — ARKI System Completion

**Estado:** IMPLEMENTED — LOCAL/MOCK VALIDATED; REMOTE E2E BLOCKED
**Tipo:** Integración final, operación y cierre de release
**Fecha:** 16 de septiembre de 2026
**Autor:** Manus AI
**Dependencias:** RFC-017, RFC-018, RFC-019, RFC-020, RFC-021, RFC-022 y RFC-023

## 1. Resumen

RFC-024 define las capacidades que todavía faltan para considerar ARKI operable como un sistema integrado. No introduce una nueva ontología por defecto. Su propósito es cerrar la distancia entre un frontend funcional, un Core versionado y un flujo remoto verificable con autoridad humana explícita.

La propuesta se centra en cinco resultados: un Core remoto disponible, una integración autenticada y observable, una ejecución E2E reproducible del Camino A, una demostración operativa para usuarios y un proceso de release que permita declarar con precisión qué está implementado y qué sigue bloqueado.

Este RFC es una propuesta inicial. No autoriza por sí solo cambios de código, despliegues, creación de credenciales, cambios de dominio ni modificaciones del Core Contract.

## 2. Problema

El proyecto dispone de un frontend con modo guiado, catálogos localizados, Command Bar, visualizaciones, documentación y manejo explícito de errores. El Core dispone de las entidades y capacidades consolidadas hasta RFC-021. Sin embargo, la integración remota todavía no puede declararse operativa porque el frontend no tiene configurados un `SICL_CORE_URL` vigente y un `SICL_CORE_SERVICE_TOKEN` válido.

La ausencia de esta configuración impide verificar contra un servicio remoto real el flujo completo `Project → Preference → Recommendation → HumanReview → Decision → Audit`. También impide comprobar en producción la propagación de envelopes, errores, autenticación, persistencia y trazabilidad.

El proyecto necesita además un criterio único para diferenciar entre una capacidad implementada, una capacidad disponible solo en preview, una capacidad bloqueada por infraestructura y una capacidad todavía propuesta.

## 3. Objetivo

El objetivo de RFC-024 es establecer un plan verificable para completar la operación integrada de ARKI sin debilitar sus invariantes constitucionales.

La implementación eventual deberá permitir que un actor autorizado pueda abrir el frontend, conectarse al Core remoto real, ejecutar el Camino A, revisar los resultados y verificar el registro de auditoría. Cada etapa deberá conservar la distinción entre hechos, supuestos, preferencias, recomendaciones, revisiones humanas y decisiones.

## 4. No objetivos

RFC-024 no crea nuevas entidades ontológicas sin un RFC específico. No convierte una `Recommendation` en una `Decision`. No permite que el frontend decida, apruebe o autorice por sí mismo. No reemplaza la revisión humana profesional ni constituye certificación normativa o legal.

Tampoco autoriza la publicación del Core como servicio público sin una decisión de producto específica. No autoriza rotación de credenciales, cambios de facturación, compra de infraestructura ni cambios de dominio.

## 5. Capacidades faltantes

### 5.1 Core remoto verificable

Debe existir un servicio HTTPS real que ejecute el Core compatible con `/v1/...`. Como mínimo debe exponer un endpoint de salud, `/openapi.json` y `/v1/scales` según la política de autenticación vigente.

La URL debe registrarse únicamente como configuración server-side del frontend. No debe compilarse en variables `VITE_` cuando contenga información operativa sensible.

### 5.2 Integración autenticada

El puente server-side debe utilizar `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN`. El token no debe aparecer en el navegador, el bundle, los logs, las capturas ni los commits.

La integración debe diferenciar `CORE_UNAVAILABLE`, `CORE_UNAUTHORIZED`, `CORE_TIMEOUT`, `CORE_HTTP_ERROR` y `CORE_CONTRACT_ERROR`. Cada estado debe permitir una acción comprensible para el usuario sin ocultar el código técnico necesario para diagnóstico.

### 5.3 Camino A remoto

Debe verificarse el siguiente flujo contra el Core remoto real:

1. Crear un `Project` con escalas válidas.
2. Registrar una `Preference` explícita de un actor humano.
3. Obtener o registrar una `Recommendation` sin presentarla como decisión.
4. Crear una `HumanReview` con actor, autoridad, estado y trazabilidad.
5. Registrar una `Decision` únicamente después de una revisión humana válida.
6. Consultar `Audit` y verificar el orden de eventos append-only.
7. Consultar `Council` o la vista equivalente como lectura, sin autoridad automática.

La prueba debe conservar identificadores, envelopes, códigos HTTP y versiones observadas para permitir reproducción.

### 5.4 Persistencia y reinicio

La verificación debe incluir un reinicio controlado del servicio remoto. Después del reinicio, el proyecto, la preferencia, la recomendación, la revisión humana, la decisión y los eventos deben seguir siendo recuperables conforme a la política de persistencia del entorno.

Si el entorno es efímero y no garantiza persistencia, el resultado debe declararse como bloqueo de infraestructura y no como PASS del E2E.

### 5.5 Observabilidad

Cada solicitud del puente debe poder asociarse con un identificador de correlación. Deben registrarse método, ruta lógica, estado, latencia y código de error sin registrar tokens ni cuerpos sensibles.

La pantalla de error debe mostrar el identificador de correlación cuando exista. Debe ofrecer reintento explícito para fallos transitorios, pero nunca reintentar automáticamente una decisión.

### 5.6 Modo demostración

El frontend puede conservar un modo de datos sintéticos para demostraciones locales. Debe identificarse visualmente como `MOCK` o `DATOS SIMULADOS` y nunca presentarse como evidencia del Core remoto.

El modo mock no puede crear una falsa confirmación de Recommendation, HumanReview o Decision.

### 5.7 Release y documentación

Debe existir un runbook que documente variables, smoke tests, rollback, persistencia, restart test y criterios de bloqueo. Los manuales deben distinguir entre capacidades implementadas en código, verificadas en preview y verificadas contra el Core remoto.

El tag de release debe apuntar a un commit cuyo código, documentación y resultados de prueba sean reproducibles.

## 6. Invariantes constitucionales

RFC-024 mantiene estas reglas:

- `Fact` no es `Assumption`.
- `Preference` no es `Constraint`.
- `Recommendation` no es `Decision`.
- `HumanReview` precede a una `Decision` autorizada.
- Factibilidad no equivale a autorización.
- Un catálogo de la interfaz no constituye un hecho del proyecto.
- Un error de conectividad no crea estado ontológico.
- El modo mock no puede confundirse con el Core remoto.
- Ninguna operación automática puede sustituir al actor humano autorizado.
- El Event Log permanece append-only.

## 7. Criterios de aceptación

RFC-024 podrá pasar de `DRAFT` a `PROPOSED` cuando el Product Owner confirme el alcance. Podrá pasar a `IMPLEMENTED` únicamente cuando se cumplan todos los criterios siguientes:

| Criterio | Evidencia requerida |
|---|---|
| Core remoto disponible | URL HTTPS vigente y respuesta de salud |
| Autenticación | Smoke test de `/v1/scales` con token server-side |
| Proxy seguro | Tests que demuestren que el token no llega al navegador |
| Contrato | Envelope v1 válido y rutas documentadas |
| Camino A | Ejecución remota completa con identificadores trazables |
| Human Authority | Decision rechazada sin HumanReview válida |
| Persistencia | Datos recuperables después de reinicio |
| Auditoría | Eventos ordenados y no eliminables |
| Frontend | 120/120 tests, typecheck y build PASS |
| Documentación | Runbook, manual y RFC sincronizados |
| Release | Tag anotado y commit reproducible |

Un fallo en cualquiera de los criterios críticos impide declarar el sistema E2E operativo.

## 8. Pruebas previstas

Las pruebas remotas deben utilizar identificadores de demostración claramente prefijados. No deben modificar proyectos productivos ni ejecutar decisiones reales sin autorización expresa para el entorno de prueba.

Como mínimo se requieren pruebas de disponibilidad, autenticación, envelope, creación de proyecto, preferencia, recomendación, revisión humana, decisión autorizada, rechazo de decisión sin revisión, auditoría, reinicio y recuperación.

## 9. Estados operativos

El sistema deberá reportar uno de estos estados:

- `LOCAL_VERIFIED`: pruebas locales verdes, sin Core remoto configurado.
- `PREVIEW_VERIFIED`: frontend disponible en WebDev y pruebas locales verdes.
- `CORE_DEPLOYED`: Core remoto disponible, pero Camino A no verificado.
- `E2E_VERIFIED`: Camino A remoto completo y persistencia comprobada.
- `RELEASE_CANDIDATE`: código y documentación congelados para revisión final.
- `RELEASED`: tag publicado con criterios completos.
- `BLOCKED_INFRASTRUCTURE`: falta URL, token, persistencia o acceso operativo.

La existencia de un checkpoint no basta para declarar `E2E_VERIFIED`.

## 10. Seguridad y secretos

Los secretos deben configurarse mediante el proveedor de despliegue o un mecanismo protegido equivalente. Nunca deben escribirse en documentos, scripts versionados, logs, capturas o tickets públicos.

El frontend no debe recibir el token como variable `VITE_`. El proxy debe rechazar destinos enviados por el navegador y limitar métodos, rutas y cabeceras reenviadas.

La rotación de credenciales debe ejecutarse como una acción independiente con su propio registro y aprobación.

## 11. Dependencias y orden de ejecución

La ejecución recomendada es secuencial:

1. Confirmar la implementación y el baseline de RFC-022.
2. Configurar y verificar RFC-023 en el entorno de despliegue.
3. Ejecutar smoke tests de solo lectura.
4. Ejecutar el Camino A con datos de demostración.
5. Ejecutar restart test y recuperación.
6. Revisar evidencias y actualizar manuales.
7. Congelar el release candidate.
8. Obtener aprobación final del Product Owner.
9. Crear y publicar el tag de release.

No debe ejecutarse el paso siguiente si el anterior presenta un bloqueo crítico.

## 12. Decisiones pendientes

El Product Owner debe resolver:

1. Qué proveedor y servicio constituyen el Core remoto canónico.
2. Si el Core será público durante la validación o estará restringido.
3. Qué política de persistencia es aceptable para el E2E.
4. Qué actor y autoridad se utilizarán en los proyectos de demostración.
5. Qué nombre tendrá el tag final de cierre.
6. Si las características futuras requieren RFC-025 u otra extensión separada.

La aprobación de RFC-024 no presume ninguna de estas decisiones.

## 13. Fuera de alcance

Quedan fuera de RFC-024 la ampliación de las once escalas de RFC-019, nuevos algoritmos de optimización, Regulatory Intelligence, revisión jurídica externa, cambios de visibilidad de repositorios, cambios de facturación y nuevas capacidades de IA generativa.

Cada materia que modifique el contrato, la ontología, la autoridad o la infraestructura debe tener un RFC independiente.

## 14. Riesgos

El principal riesgo es declarar un PASS E2E usando el modo mock o un preview sin comprobar el Core remoto real. Se controla separando estados operativos y exigiendo evidencias de URL, autenticación, persistencia y auditoría.

Otro riesgo es que un entorno efímero pierda SQLite después de reiniciar. Se controla con un restart test obligatorio y un bloqueo explícito cuando la persistencia no esté garantizada.

También existe riesgo de exposición de credenciales durante la configuración. Se controla manteniendo los secretos server-side, evitando variables `VITE_` y revisando logs antes de publicar.

## 15. Resultado esperado

Al completar RFC-024, ARKI deberá demostrar de forma reproducible que la interfaz guiada y el Core remoto operan como un sistema único, que los errores de infraestructura se muestran honestamente y que ninguna automatización suplanta la autoridad humana.

El criterio de cierre será una cadena verificable desde la entrada del usuario hasta el evento de auditoría, con separación ontológica, control de autoridad y evidencia suficiente para repetir la prueba.

## 16. Firma y estado

**Estado actual:** `IMPLEMENTED — LOCAL/MOCK VALIDATED; REMOTE E2E BLOCKED`
**Implementación:** fase operativa inicial implementada; E2E remoto pendiente
**Cambios de código autorizados:** fase inicial autorizada explícitamente por el Product Owner
**Despliegue autorizado por este documento:** ninguno
**Revisión requerida:** Product Owner / arquitecto para desbloquear el E2E remoto

## 17. Registro de implementación inicial

La primera fase ejecutable de RFC-024 se implementó en `sicl-web` sin configurar todavía un Core remoto real. Esta fase añade controles operativos seguros y valida el Camino A localmente con mocks; no declara el E2E remoto como completado.

Se añadieron un health check server-side de solo lectura sobre `/v1/scales`, identificadores de correlación mediante `x-correlation-id`, un timeout de quince segundos para solicitudes del proxy y clasificación explícita de `CORE_UNAVAILABLE`, `CORE_UNAUTHORIZED`, `CORE_TIMEOUT` y `CORE_HTTP_ERROR`.

También se añadieron pruebas unitarias para configuración ausente, autenticación ausente, errores HTTP, health check autenticado y timeout del proxy. El checkpoint WebDev de esta fase es `e5725781`.

La verificación local produjo `126/126` tests PASS, incluyendo la simulación completa del Camino A, typecheck PASS, build PASS y `git diff --check` PASS. El estado operativo remoto continúa siendo `BLOCKED_INFRASTRUCTURE` porque faltan `SICL_CORE_URL`, un Core remoto vigente y una prueba de persistencia después de reinicio. El token existente no se considera suficiente sin un destino HTTPS válido.

## 18. Configuración para desbloquear el Core remoto

El Core debe desplegarse primero como un servicio HTTPS vigente. El origen debe servir el contrato `/v1/...` y debe conservar la persistencia requerida por el entorno. La URL no debe apuntar al frontend, a un preview temporal ni al hostname Railway obsoleto que devolvía `404 Application not found`.

En el entorno server-side de WebDev deben configurarse exactamente estas variables protegidas:

```text
SICL_CORE_URL=https://<host-https-real-del-core>
SICL_CORE_SERVICE_TOKEN=<token-de-servicio-del-core>
```

No deben crearse `VITE_SICL_CORE_URL`, `VITE_SICL_CORE_SERVICE_TOKEN` ni valores equivalentes en `client/src`, archivos `.env` versionados o variables públicas del navegador. El token debe tener mínimo privilegio, estar limitado al servicio y poder rotarse sin modificar el bundle.

Después de configurar las variables, el procedimiento de verificación es:

```bash
curl -i "$SICL_CORE_URL/openapi.json"
curl -i -H "Authorization: Bearer $SICL_CORE_SERVICE_TOKEN" "$SICL_CORE_URL/v1/scales"
curl -i "https://<dominio-del-frontend>/api/core/health"
```

Los resultados esperados son un `200` para `openapi.json`, un envelope v1 válido para `/v1/scales` y un `200` del health check del proxy. Después debe ejecutarse el Camino A remoto con un proyecto sintético, comprobarse el rechazo de Decision sin HumanReview, reiniciarse el Core y repetirse la lectura de snapshot e historial.

Si `SICL_CORE_URL` falta, el health check debe devolver `503 CORE_UNAVAILABLE`. Si el token falta o es inválido, debe devolver un estado de autenticación. Ninguno de esos casos debe convertirse en un PASS falso.

## References

[1]: https://github.com/YvanCastilloQuezada/sicl-core "SICL Core repository"
[2]: https://github.com/YvanCastilloQuezada/sicl-web "ARKI Web repository"
[3]: https://fastapi.tiangolo.com/ "FastAPI documentation"
[4]: https://owasp.org/www-project-application-security-verification-standard/ "OWASP Application Security Verification Standard"
[5]: https://12factor.net/config "The Twelve-Factor App: Config"

## Apéndice A — Relación con RFC-022 y RFC-023

RFC-022 define la experiencia guiada y los catálogos del frontend. RFC-023 define el transporte server-side y sus estados de error. RFC-024 coordina su verificación operativa, pero no reemplaza ninguno de los dos contratos.

## Apéndice B — Regla de no sobreafirmación

Una capacidad solo puede declararse implementada cuando existe código versionado. Solo puede declararse verificada cuando existe una ejecución reproducible. Solo puede declararse operativa cuando la ejecución utiliza el Core remoto real y satisface los criterios de aceptación de este RFC.

## Apéndice C — Baseline de la propuesta

Esta propuesta parte de `sicl-web/main@30ebf5370fc99a63c61db85038c9c4dbb98e37d3` y del Core `main@6b0bad78e1213d783c006ad13c54dd9a42c68a20`.

El baseline frontend mantiene RFC-022 y RFC-023 integradas, con 120 tests pasando, typecheck PASS, build PASS y `git diff --check` PASS.

RFC-024 no modifica dichos baselines. Su función inicial es definir el cierre verificable del sistema.

## Apéndice D — Próximo paso

El próximo paso es que el Product Owner revise el alcance, confirme el proveedor del Core y decida si esta propuesta pasa a `PROPOSED`. Hasta entonces, la rama y el documento permanecen como propuesta documental sin implementación.

## Apéndice E — Regla de compatibilidad

Si durante la implementación se identifica que el E2E requiere nuevos endpoints, campos o entidades, la modificación debe detenerse y abrir un RFC específico antes de continuar.

## Apéndice F — Control de cambios

Cualquier cambio de alcance debe registrarse en el proceso definido por RFC-018. La aprobación del Product Owner debe quedar asociada al commit o tag que formalice el cambio de estado.

## Apéndice G — Checklist inicial

- [ ] Product Owner aprueba el alcance.
- [ ] Se identifica el Core remoto canónico.
- [ ] Se configura `SICL_CORE_URL` server-side.
- [ ] Se configura `SICL_CORE_SERVICE_TOKEN` server-side.
- [ ] Se ejecutan smoke tests de solo lectura.
- [ ] Se ejecuta Camino A remoto.
- [ ] Se verifica rechazo de Decision sin HumanReview.
- [ ] Se verifica persistencia después de reinicio.
- [ ] Se revisa el Event Log.
- [ ] Se actualiza el informe de cierre.
- [ ] Se crea el release tag con aprobación final.

## Apéndice H — Límite de implementación pendiente

Mientras RFC-024 permanezca en estado `DRAFT`, no se crearán nuevas entidades, migraciones, credenciales ni automatizaciones de producción bajo este identificador. La fase operativa inicial registrada en la sección 17 se limita al proxy, health check, observabilidad mínima y pruebas.

## Apéndice I — Registro inicial

- 2026-09-16: creación de la propuesta documental y rama de revisión.

## Apéndice J — Firma de la propuesta

**Manus AI:** redacción inicial.
**Product Owner / arquitecto:** aprobación pendiente.
**Estado:** `IMPLEMENTED — LOCAL/MOCK VALIDATED; REMOTE E2E BLOCKED`.

**Fin de RFC-024 — ARKI System Completion.**
