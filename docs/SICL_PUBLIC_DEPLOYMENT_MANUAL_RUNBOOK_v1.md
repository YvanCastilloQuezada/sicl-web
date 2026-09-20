# SICL 0.6 — Runbook de Despliegue Público Manual

## Estado

Este runbook publica el checkpoint `754718d0` del proyecto `sicl-web` en el dominio público `https://siclcc-cxipx7sy.manus.space`. No modifica el frontend ni el Core Contract. Debe ejecutarlo un operador con acceso al panel WebDev y permisos de publicación del proyecto `CXipx7sYZTwJNC2YkzrMGY`.

## Bloqueo identificado

La sesión de trabajo dispone de `webdev_save_checkpoint` y `webdev_check_status`, pero no expone una operación MCP de publicación directa. El checkpoint está guardado; la publicación debe ejecutarse desde la interfaz WebDev o por un operador con permisos equivalentes.

No se debe afirmar publicación exitosa hasta comprobar el dominio público, autenticación y flujo completo.

## Precondiciones

1. Confirmar que el proyecto seleccionado es `sicl-web` y que el checkpoint activo es `754718d0`.
2. Confirmar que el repositorio está limpio y que no se aplican cambios de `SICL_FRONTEND_SPEC_v1.md` al release 0.6.
3. Confirmar que los secretos, si son necesarios, están registrados como variables server-side y nunca como variables `VITE_*`.
4. No activar `SICL_ALLOW_LOCAL_CORE=true` en producción.
5. Si se usa núcleo remoto, registrar `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN` únicamente en el gestor server-side del proyecto.

## Procedimiento en el panel WebDev

1. Abrir el proyecto `sicl-web`.
2. Abrir la sección de checkpoints/versiones.
3. Seleccionar exactamente `754718d0`.
4. Revisar el diff y confirmar que corresponde al flujo UPAO-001 ya probado.
5. Ejecutar la acción **Publish/Deploy/Make public** que ofrece el panel para ese checkpoint. Si la acción no aparece, detenerse y solicitar permisos de publicación o habilitación de la función.
6. Seleccionar el dominio `siclcc-cxipx7sy.manus.space`.
7. Esperar a que el despliegue indique estado saludable.
8. No cambiar el dominio ni crear credenciales nuevas durante esta operación.

## Smoke test público

Desde una ventana nueva del navegador:

1. Abrir `https://siclcc-cxipx7sy.manus.space`.
2. Confirmar HTTP 200 y que se sirve la aplicación SICL.
3. Iniciar sesión mediante Manus OAuth. No existen credenciales de prueba embebidas; el Product Owner debe usar una cuenta autorizada o una invitación gestionada por el propietario del proyecto.
4. Confirmar que aparece `UPAO-001 · Plaza Center`.
5. Ejecutar o comprobar el recorrido:

```text
Project → Context → Objectives → Constraints → Preference
→ Alternatives → Evaluations → Comparison → Recommendation
→ HumanReview → Decision
```

6. Confirmar en la línea temporal, en ese orden lógico:

```text
PROJECT_CREATED
SICL_RECORD_ADDED
RECOMMENDATION_CREATED
HUMAN_REVIEW_RECORDED
HUMAN_DECISION_RECORDED
```

7. Confirmar que Recommendation y Decision son registros separados.
8. Confirmar que Decision muestra actor, autoridad y confirmación humana explícita.

## Verificación de seguridad

En DevTools del dominio público:

1. Revisar **Network** y filtrar por `token`, `secret`, `authorization`, `api-key` y `SICL_CORE_SERVICE_TOKEN`.
2. Confirmar que no aparecen secretos en URLs, cuerpos de respuesta, headers accesibles al navegador o respuestas tRPC.
3. Revisar **Application → Local Storage**, Session Storage y cookies visibles para JavaScript.
4. Confirmar que no existe `SICL_CORE_SERVICE_TOKEN`, `BUILT_IN_FORGE_API_KEY` ni bearer token server-to-server.
5. Revisar el HTML descargado y los bundles públicos buscando esos mismos nombres.
6. Si aparece un secreto, detener el despliegue y rotar el secreto antes de continuar.

## Criterios de aceptación

| Criterio | PASS cuando | FAIL cuando |
|---|---|---|
| Checkpoint | El panel y la evidencia identifican `754718d0` | Se sirve otra versión o no existe trazabilidad |
| Acceso | Un usuario autorizado puede autenticarse con Manus OAuth | Se requiere una credencial embebida o acceso anónimo no autorizado |
| UPAO-001 | El proyecto y sus registros aparecen en el dominio público | Solo aparece la pantalla vacía de creación |
| Autoridad | Recommendation → HumanReview → Decision permanece separado | Recommendation crea Decision o la decisión no exige autoridad |
| Seguridad | No hay secretos en HTML, Network, Storage o respuestas | Se expone cualquier token o clave server-side |
| Contrato | No aparecen nuevas entidades/endpoints fuera del release | El despliegue introduce cambios no aprobados |

## Diagnóstico de fallo

- **No aparece Publish/Deploy:** bloqueo de permisos o de capacidad del panel WebDev; no es un fallo del código.
- **Dominio muestra pantalla vacía:** el checkpoint no fue sincronizado o la sesión no está autenticada.
- **HTTP distinto de 200:** detenerse y revisar estado del despliegue y dominio.
- **UPAO-001 ausente tras login:** detenerse; no activar modo demo ni sembrar datos nuevos desde producción.
- **Secreto visible:** detenerse inmediatamente y rotar el secreto.
- **Decision automática:** detenerse inmediatamente; el release no cumple la constitución.

## Cierre

Solo después de que todos los criterios sean PASS se puede declarar: `PUBLIC E2E VERIFIED`. El preview autenticado no sustituye la verificación del dominio público.
