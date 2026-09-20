# SICL 0.6 — Migración a GitHub CI/CD + Render

**Versión:** 1.0
**Estado:** PREPARADO — NO DESPLEGADO
**Fecha:** 2026-09-14
**Objetivo:** sustituir la dependencia operativa de un Cloud Computer por GitHub como centro de control y una plataforma gestionada para ejecutar `sicl-core-http`.

## 1. Decisión arquitectónica

La arquitectura de migración será:

```text
GitHub
  ├── repositorio canónico
  ├── commits y tags reproducibles
  ├── GitHub Actions
  │     ├── pruebas Python
  │     ├── pruebas web
  │     ├── smoke HTTP
  │     ├── controles de seguridad
  │     └── construcción de imagen
  └── GitHub Container Registry (opcional)
          │
          ▼
Render Web Service
  ├── contenedor sicl-core-http
  ├── HTTPS gestionado
  ├── URL pública del Core
  ├── variables secretas server-side
  └── Persistent Disk para SQLite
          │
          ▼
sicl-web / tRPC
  ├── SICL_CORE_URL server-side
  └── SICL_CORE_SERVICE_TOKEN server-side
```

Render se selecciona como plataforma gestionada porque admite servicios Python/Docker, URL HTTPS, health checks, variables secretas y discos persistentes. El disco persistente es obligatorio si SQLite continúa siendo el almacenamiento de SICL 0.6; el servicio no debe ejecutarse con filesystem efímero.

## 2. Qué se mantiene sin cambios

Esta migración no modifica:

- el Core Contract;
- las entidades constitucionales de SICL 0.6;
- HTTP v0.3;
- la separación `Recommendation ≠ Decision`;
- la autoridad humana sobre `Decision`;
- `Decision Conditions` read-only;
- la política de eventos append-only;
- la política de fallback local explícito;
- la etiqueta aprobada `sicl-core-http:release-0.6`;
- el commit de despliegue aprobado `2ef49aba2136`.

GitHub y Render son infraestructura de entrega y ejecución. No son nuevas entidades ni nuevas capacidades semánticas.

## 3. Estado actual y bloqueo de migración

| Elemento | Estado | Consecuencia |
|---|---|---|
| Proyecto web en Git | Disponible localmente | Puede continuar con CI web |
| Repositorio canónico del Core | No disponible como checkout Git verificable en esta sesión | No se puede construir ni desplegar honestamente el Core |
| Commit `2ef49aba2136` | Referenciado documentalmente | Debe verificarse en el repositorio Core real |
| GitHub connector | Instalado pero deshabilitado en la sesión | No se pueden crear workflows/repositorios remotos desde aquí |
| Cuenta Render | No conectada | No se puede crear el servicio ni registrar secretos |
| Dockerfile del Core | No localizado en el sandbox actual | No se puede construir `sicl-core-http` aquí |
| Persistent Disk | Disponible como opción de Render | Debe montarse antes de declarar persistencia |
| `SICL_CORE_URL` | No definido | Debe generarse después del despliegue real |
| `SICL_CORE_SERVICE_TOKEN` | No definido | Debe crearse y almacenarse únicamente server-side |

**Conclusión:** el paquete está preparado, pero todavía no es correcto afirmar que la migración fue desplegada.

## 4. Requisitos previos

Antes de ejecutar el despliegue se debe disponer de:

1. El repositorio GitHub canónico que contiene el Core Python y el adaptador HTTP.
2. El commit exacto `2ef49aba2136` accesible en ese repositorio.
3. Un repositorio que contenga el `Dockerfile` de `sicl-core-http`, o una ruta inequívoca dentro de un monorepo.
4. Una cuenta Render con permisos para crear un Web Service.
5. Un secreto server-to-server para autenticar `sicl-web` contra el Core.
6. La decisión de si el servicio será público con token o privado dentro de una red compatible.
7. La ruta de datos persistentes, recomendada como `/data/sicl` dentro del contenedor.

No se deben inventar URL, tokens, dominios, IDs de servicio ni nombres de repositorio.

## 5. Preparación del repositorio GitHub

El repositorio canónico debe conservar el commit aprobado y añadir, sin modificar el contrato, los archivos de operación siguientes:

```text
.github/workflows/sicl-ci.yml
render.yaml                         # solo si se decide IaC de Render
Dockerfile                          # Core, existente o incorporado desde el repositorio canónico
deploy/                              # runbooks y verificadores
```

La rama de despliegue debe estar protegida para que Render solo despliegue cambios que hayan pasado el workflow obligatorio.

Se recomienda crear el tag:

```text
sicl-0.6-rc
```

El tag no reemplaza al commit de despliegue: el commit de despliegue sigue siendo `2ef49aba2136` hasta que el Product Owner autorice otro.

## 6. Pipeline GitHub Actions

El pipeline debe ejecutar, en este orden:

### 6.1 Validación Core

```bash
pytest -q
python -m compileall src
```

### 6.2 Validación web

```bash
pnpm install --frozen-lockfile
pnpm test -- --run
pnpm exec tsc --noEmit
pnpm build
```

### 6.3 Controles de contrato y seguridad

El workflow debe fallar si encuentra:

- referencias operativas a `latest`;
- referencias operativas a `RELEASE_TAG`;
- secretos escritos en código, logs de prueba o artefactos;
- activación automática de `SICL_ALLOW_LOCAL_CORE` en producción;
- ausencia de la separación entre Recommendation y Decision;
- escritura de Decision sin autoridad humana;
- endpoint de escritura para Decision Conditions;
- cambios en el Core Contract sin RFC o decisión aprobada.

### 6.4 Smoke HTTP

El workflow puede iniciar temporalmente el Core en el runner, ejecutar el smoke test server-to-server y destruir el proceso. Esta prueba no equivale a persistencia remota ni a E2E de producción.

## 7. Servicio Render

Crear un **Web Service** desde el repositorio GitHub canónico.

Configuración esperada:

| Parámetro | Valor requerido |
|---|---|
| Servicio | `sicl-core-http` |
| Fuente | Repositorio GitHub canónico |
| Rama/tag | Commit o tag que contiene `2ef49aba2136` |
| Runtime | Docker |
| Imagen lógica | `sicl-core-http:release-0.6` |
| Bind | `0.0.0.0:${PORT}` |
| Health check | Endpoint de salud real del adaptador |
| Escalado | Una sola instancia mientras use SQLite local |
| TLS | Gestionado por Render |
| Secretos | Variables privadas de Render |
| Persistencia | Persistent Disk obligatorio |

Mientras SQLite esté en uso, no se debe escalar a múltiples instancias. El disco persistente debe ser accesible por una sola instancia para evitar corrupción o carreras de escritura.

## 8. Persistencia SQLite

Configurar un Persistent Disk de Render montado en:

```text
/data/sicl
```

Y configurar el servicio para escribir el archivo canónico dentro de esa ruta, por ejemplo:

```text
SICL_CORE_SQLITE_PATH=/data/sicl/core.sqlite
```

El nombre exacto de la variable debe conservar el contrato ya preparado por el Core; no se debe introducir una variable alternativa si el repositorio canónico ya define otra.

Criterio de aceptación:

1. Crear un proyecto y una Preference.
2. Confirmar `PREFERENCE_RECORDED`.
3. Registrar el snapshot y la versión.
4. Reiniciar el servicio Render.
5. Recuperar el proyecto y la Preference.
6. Confirmar que los eventos previos permanecen intactos.

Un reinicio exitoso sin verificar estos datos **no** demuestra persistencia.

## 9. Secretos y conexión web

Los siguientes valores deben existir únicamente en configuración server-side:

```text
SICL_CORE_URL=https://<url-real-del-servicio-core>
SICL_CORE_SERVICE_TOKEN=<secreto-generado-para-server-to-server>
```

Reglas:

- Nunca usar prefijo `VITE_` para estos secretos.
- Nunca incluir el token en HTML, JavaScript del navegador, logs o errores.
- No registrar la URL hasta que Render haya creado el servicio real.
- Mantener `SICL_ALLOW_LOCAL_CORE=true` únicamente en desarrollo explícito.
- En producción, ausencia de `SICL_CORE_URL` debe producir fallo cerrado.

## 10. Orden de ejecución

### Fase 0 — Verificación de autoridad y fuentes

- Confirmar repositorio Core canónico.
- Confirmar commit `2ef49aba2136`.
- Confirmar permisos de GitHub.
- Confirmar cuenta Render.
- Confirmar que no se cambiará el Core Contract.

### Fase 1 — CI sin despliegue

- Incorporar workflow.
- Ejecutar pruebas completas.
- Verificar controles de seguridad.
- Construir el contenedor.
- Guardar artefactos de evidencia.

### Fase 2 — Crear Render Web Service

- Conectar GitHub con Render.
- Seleccionar el repositorio y la rama/tag.
- Configurar Docker.
- Configurar el puerto.
- Configurar health check.
- Crear el Persistent Disk.
- Añadir variables secretas.

### Fase 3 — Primer despliegue

- Desplegar exactamente desde el commit aprobado.
- Consultar el health check.
- Confirmar HTTPS.
- Registrar la URL real.
- No declarar E2E todavía.

### Fase 4 — Prueba de persistencia

- Ejecutar el escenario de Preference.
- Reiniciar el servicio.
- Recuperar datos.
- Confirmar eventos y versiones.
- Guardar evidencia.

### Fase 5 — Configurar `sicl-web`

- Registrar `SICL_CORE_URL` server-side.
- Registrar `SICL_CORE_SERVICE_TOKEN` server-side.
- Mantener el fallback local desactivado en producción.
- Ejecutar pruebas de propagación 401, 404, 409 y 422.

### Fase 6 — E2E poblado

Ejecutar el vertical slice disponible por HTTP v0.3 y clasificar como `PASS`, `FAIL`, `BLOQUEADO POR CONTRATO` o `BLOQUEADO POR INFRAESTRUCTURA`.

No se deben transformar en PASS las capacidades que HTTP v0.3 todavía marca como bloqueadas por contrato: Evidence, Objective, Constraint/Requirement, Alternative, Evaluation, Comparison y Report.

### Fase 7 — Release report

Generar:

```text
SICL_A003_RELEASE_REPORT_v1.md
```

El informe debe incluir commit, imagen, URL, configuración de persistencia, pruebas, reinicio, E2E y límites restantes.

## 11. Criterios de salida

La migración puede clasificarse como **REMOTE CORE READY** cuando:

- el repositorio canónico está conectado a GitHub;
- el workflow pasa;
- Render crea el servicio;
- el servicio responde por HTTPS;
- el Persistent Disk está montado;
- el Core arranca desde el commit aprobado;
- el token no aparece en el navegador;
- el health check pasa.

Puede clasificarse como **E2E VERIFIED** únicamente cuando además:

- la persistencia sobrevive a un reinicio real;
- Preference genera `PREFERENCE_RECORDED`;
- Recommendation no crea Decision;
- Decision exige autoridad humana;
- los eventos previos permanecen append-only;
- el flujo web usa el Core remoto real;
- todas las etapas no bloqueadas por contrato pasan;
- las etapas bloqueadas por contrato permanecen explícitamente clasificadas como tales.

## 12. Decisiones que requieren intervención del Product Owner

1. ¿Autoriza utilizar Render como plataforma gestionada para `sicl-core-http`?
2. ¿Autoriza mantener SQLite con un Persistent Disk de una sola instancia para SICL 0.6?
3. ¿Autoriza conectar el repositorio canónico del Core a GitHub Actions y Render?
4. ¿Autoriza la creación y almacenamiento de los secretos server-side necesarios?
5. ¿Autoriza que el dominio generado por Render sea utilizado inicialmente como `SICL_CORE_URL`, dejando un dominio propio para una fase posterior?

## 13. Veredicto

La migración es **factible** y evita la dependencia de un servidor físico administrado manualmente. La solución no elimina la necesidad de una plataforma de ejecución: la traslada a Render, que proporciona servicio, HTTPS y disco persistente gestionados.

El siguiente paso técnico no es inventar una URL ni desplegar desde este sandbox. Es obtener el repositorio Core canónico y habilitar las conexiones GitHub/Render necesarias. Después se ejecuta Fase 0 y se continúa con el workflow, el servicio y la prueba de persistencia.

**Estado final de este documento:** `PREPARADO — NO DESPLEGADO — PENDIENTE DE CREDENCIALES Y REPOSITORIO CORE`.
