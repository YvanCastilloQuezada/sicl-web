# SICL_REMOTE_EXECUTION_PACKAGE_v1
## Paquete único para el ciclo E2E remoto

**Propósito:** dejar preparada una ejecución real contra `sicl-core-http` cuando exista un Cloud Computer autorizado.  
**Estado actual:** preparado; no ejecutado.  
**Regla:** este documento no crea infraestructura, no inventa URL/IP/token y no modifica el Core Contract.

> La secuencia autorizada es: **infraestructura → despliegue → health → contract → persistencia → proyecto → flujo 0.6 completo → reinicio → recuperación → evidencia → aceptación**.

---

## 1. Precondiciones de infraestructura

Antes de ejecutar cualquier comando, debe existir un Cloud Computer adjunto y conectado a la sesión, con acceso SSH operativo y permisos administrativos. La máquina debe disponer de Docker, `systemd`, `ufw`, un nombre DNS decidido y un volumen persistente para `/data/sicl`.

El dominio debe resolver hacia la IP pública de la máquina antes de emitir un certificado. No se debe abrir públicamente el puerto interno 8000. El contenedor escuchará internamente en `127.0.0.1:8000` y el acceso público pasará por un reverse proxy HTTPS.

El Product Owner debe confirmar la infraestructura, el dominio y las credenciales por los canales autorizados. Ningún valor de IP, dominio o token debe fabricarse para completar una tabla.

### Bloqueo técnico actual

A la fecha de preparación no existe evidencia de Cloud Computer disponible, servicio remoto desplegado, `/data/sicl/`, URL HTTPS pública verificable ni `SICL_CORE_URL` registrado. Este bloqueo impide ejecutar el paquete.

### Bloqueo constitucional actual

Continúan sujetas a clasificación humana las decisiones sobre Fact/Assumption, Audit/Report, escritura canónica de Decision Conditions, clasificación formal del Master Spec y alcance congelado de 0.6. Estas decisiones no deben mezclarse con el bloqueo técnico de infraestructura.

---

## 2. Qué debe existir en Cloud Computer

La máquina objetivo debe proporcionar Docker para construir y ejecutar la imagen, `systemd` para reinicio automático, `ufw` para restringir exposición, un reverse proxy HTTPS y almacenamiento persistente fuera del contenedor.

La estructura esperada, una vez autorizada la instalación, es:

```text
/opt/sicl-core/                         # repositorio desplegado
/etc/sicl-core/sicl-core.env            # secretos/configuración, permisos 0600
/data/sicl/core.sqlite                  # SQLite persistente fuera del contenedor
/etc/systemd/system/sicl-core-http.service
```

El volumen del contenedor debe montarse como:

```text
/data/sicl:/data/sicl
```

La existencia de una ruta local con ese nombre en otro entorno no constituye evidencia de que la ruta exista en Cloud Computer.

---

## 3. Variables que deben configurarse

| Variable | Ubicación | Valor requerido |
|---|---|---|
| `SICL_CORE_SERVICE_TOKEN` | `/etc/sicl-core/sicl-core.env` y secreto server-side de `sicl-web` | Token real generado y compartido por canal seguro; nunca se documenta en texto plano. |
| `SICL_CORE_SQLITE_PATH` | `/etc/sicl-core/sicl-core.env` | `/data/sicl/core.sqlite`. |
| `PORT` | `/etc/sicl-core/sicl-core.env` | Puerto interno; el runbook usa `8000` por defecto. |
| `SICL_CORE_URL` | Entorno server-side de `sicl-web` | URL HTTPS real, solo después del certificado. |

El token no debe aparecer en el repositorio, Dockerfile, frontend, logs, capturas ni comandos visibles. No debe pegarse en este documento ni en el reporte final.

---

## 4. Archivos que deben desplegarse

El despliegue debe usar el repositorio Core Python versionado y sus archivos reales, no una reconstrucción manual. Deben estar disponibles:

| Archivo o directorio | Uso |
|---|---|
| `src/sicl/` | Core Contract, dominio, servicios y persistencia. |
| `http_adapter/sicl_core_http.py` | Adaptador FastAPI `sicl-core-http`. |
| `http_adapter/` | Dependencias y pruebas del adaptador. |
| `Dockerfile` | Imagen reproducible del servicio. |
| `deploy/CLOUD_COMPUTER_RUNBOOK.md` | Procedimiento operativo base. |
| `deploy/sicl-core.env.example` | Forma de configuración sin secretos reales. |
| `deploy/sicl-core-http.service` | Unidad systemd, si está presente en el checkout objetivo. |

Antes de construir, registrar el commit/tag desplegado y comprobar que el checkout no contiene cambios locales no documentados.

---

## 5. Orden exacto de ejecución

### Paso 0 — Inspección y captura inicial

Registrar sistema operativo, versión de Docker, estado de `systemd`, estado de `ufw`, DNS, espacio disponible y existencia de `/data/sicl`. No registrar secretos.

```bash
uname -a
docker --version
systemctl --version | head -1
sudo ufw status verbose
getent hosts DOMINIO_REAL
df -h /data/sicl
```

Sustituir `DOMINIO_REAL` únicamente por el dominio real confirmado. Si falta cualquiera de las precondiciones, detenerse y registrar el bloqueo.

### Paso 1 — Persistencia

```bash
sudo mkdir -p /data/sicl
sudo chown -R USUARIO_DOCKER:USUARIO_DOCKER /data/sicl
sudo chmod 750 /data/sicl
```

El usuario, permisos y resultado deben corresponder a la máquina real. No asumirlos de antemano.

### Paso 2 — Código y configuración protegida

```bash
sudo mkdir -p /opt/sicl-core /etc/sicl-core
# Transferir o clonar aquí el checkout versionado autorizado.
sudo install -m 0600 /ruta/segura/sicl-core.env /etc/sicl-core/sicl-core.env
```

El archivo `sicl-core.env` debe contener los valores reales configurados mediante el gestor de secretos. No imprimirlo.

### Paso 3 — Construcción y arranque local

```bash
cd /opt/sicl-core
docker build -t sicl-core-http:RELEASE_TAG .
docker run --rm \
  --name sicl-core-http-check \
  --env-file /etc/sicl-core/sicl-core.env \
  -p 127.0.0.1:8000:8000 \
  -v /data/sicl:/data/sicl \
  sicl-core-http:RELEASE_TAG
```

La prueba inicial debe ejecutarse en una sesión controlada. Confirmar `/health` localmente antes de instalar el servicio permanente.

### Paso 4 — Servicio systemd

Instalar la unidad del runbook, revisar su contenido y habilitarla:

```bash
sudo install -m 0644 deploy/sicl-core-http.service /etc/systemd/system/sicl-core-http.service
sudo systemctl daemon-reload
sudo systemctl enable sicl-core-http
sudo systemctl start sicl-core-http
sudo systemctl status sicl-core-http --no-pager
```

Si la unidad real tiene otro nombre, documentar el nombre utilizado; no inventar una unidad paralela.

### Paso 5 — Health local

```bash
curl -fsS http://127.0.0.1:8000/health
curl -fsS http://127.0.0.1:8000/v1/contract
```

Guardar respuestas sin tokens ni datos sensibles. Si falla, detener el ciclo antes de UFW o HTTPS.

### Paso 6 — Firewall

Confirmar primero que la sesión SSH actual funciona. Después aplicar la secuencia del runbook:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

No abrir 8000 al público. El puerto 80 debe mantenerse solo si es necesario para el desafío de Let's Encrypt.

### Paso 7 — DNS, reverse proxy y HTTPS

Crear o verificar el registro DNS real hacia la IP pública confirmada. Instalar y configurar el reverse proxy elegido. Verificar que el dominio sea accesible por HTTP antes de ejecutar Certbot.

```bash
getent hosts DOMINIO_REAL
curl -I http://DOMINIO_REAL/health
# Ejecutar certbot únicamente con el reverse proxy instalado y el dominio accesible.
```

No ejecutar `certbot --nginx` si Nginx no está instalado/configurado o si el dominio aún no resuelve. El certificado debe verificarse sobre el dominio real.

### Paso 8 — Verificación HTTPS y registro URL

```bash
curl -fsS https://DOMINIO_REAL/health
curl -fsS -H "Authorization: Bearer $SICL_CORE_SERVICE_TOKEN" \
  https://DOMINIO_REAL/v1/projects/PROJECT_ID/snapshot
```

Registrar el valor HTTPS real como `SICL_CORE_URL` únicamente en el entorno server-side de `sicl-web`, y reiniciar el servidor web según el procedimiento de la plataforma. No escribirlo en el frontend ni en el repositorio.

### Paso 9 — Flujo 0.6 poblado

Usar un identificador de proyecto y datos de prueba identificados explícitamente como sintéticos. Ejecutar y registrar la cadena:

```text
Project → Persist → Retrieve → Context → Evidence → Objective
→ Constraint/Requirement → Preference → Alternative → Evaluation
→ Comparison → Recommendation → HumanReview → Decision → Audit → Report
```

Para Preference, usar el contrato HTTP v0.3 con `preference_id`, `name`, `justification`, `domain`, `strength`, `scope_type`, `scope_id`, `provenance`, `expected_project_version` y `event_id`. Confirmar incremento de versión, snapshot con `preferences` y evento `PREFERENCE_RECORDED`.

Decision Conditions debe permanecer read-only porque no forma parte de la superficie HTTP canónica v0.3.

### Paso 10 — Reinicio y recuperación

```bash
sudo systemctl restart sicl-core-http
sudo systemctl status sicl-core-http --no-pager
curl -fsS https://DOMINIO_REAL/health
```

Recuperar el snapshot del proyecto creado antes del reinicio y comprobar que `core.sqlite`, eventos, Preference y versiones siguen presentes. Si se pierde el proyecto o los eventos, el criterio de persistencia falla.

---

## 6. Pruebas que deberán ejecutarse

| Prueba | PASS | FAIL |
|---|---|---|
| `/health` local | Responde desde loopback | No responde o expone secretos. |
| `/v1/contract` | Devuelve contrato esperado | Contrato ausente o no versionado. |
| HTTPS | Dominio real responde con certificado válido | Certificado, DNS o proxy inválido. |
| Bearer ausente | Devuelve `401` | Permite acceso sin autenticación. |
| Entidad inexistente | Devuelve `404` contractual | Oculta o transforma incorrectamente el envelope. |
| Conflicto de versión | Devuelve `409` | Sobrescribe silenciosamente. |
| Violación de contrato | Devuelve `422` | Acepta datos inválidos. |
| Preference | Guarda atómicamente y registra `PREFERENCE_RECORDED` | Guarda parcialmente o sin evento. |
| Council | Permanece read-only | Selecciona o decide automáticamente. |
| Recommendation | No crea Decision | Produce decisión automática. |
| Decision | Requiere autoridad humana | Registra autoridad ausente. |
| Reinicio | Recupera proyecto, eventos y versiones | Se pierden datos. |
| Web | Usa Core remoto y no muestra token | Usa fallback o expone secreto. |

---

## 7. Evidencias que deberán conservarse

La evidencia debe contener el commit desplegado, fechas UTC, comandos ejecutados sin secretos, respuestas HTTP sanitizadas, códigos de estado, logs relevantes sin tokens, estado de systemd/UFW, certificado y DNS, snapshot antes/después del reinicio, eventos, versiones, captura del navegador poblado y resultado PASS/FAIL de cada criterio.

La evidencia debe distinguir entre `remote_e2e`, `local_http`, `local_tests` y `documentation`. Un PASS local nunca debe etiquetarse como `remote_e2e`. Los datos UPAO deben conservar su etiqueta de fixture sintético.

No conservar tokens, cookies, contraseñas, rutas privadas innecesarias ni archivos de entorno en el repositorio o en capturas.

---

## 8. Criterios globales PASS/FAIL

El ciclo será **PASS** únicamente si existe una URL HTTPS real, el servicio se reinicia automáticamente, el SQLite persiste fuera del contenedor y sobrevive al reinicio, el bearer se exige, los errores 404/409/422 se preservan, Preference registra su evento, la cadena 0.6 se ejecuta contra el Core canónico y el navegador recibe datos del Core remoto sin exponer secretos.

El ciclo será **FAIL** si falta cualquier precondición crítica, si se usa fallback como sustituto del Core remoto, si se pierde persistencia, si se modifica un evento previo, si una Recommendation aparece como Decision, si falta autoridad humana o si cualquier dato sintético se presenta como dato real.

Si la infraestructura no está disponible, el resultado correcto no es FAIL del producto: es **BLOQUEO TÉCNICO DEMOSTRADO**, con la dependencia concreta registrada.

---

## 9. Qué NO debe hacerse

No deben inventarse dominio, IP, token, URL, respuestas, datos poblados ni resultados. No debe abrirse 8000 públicamente. No deben escribirse secretos en logs, frontend, Dockerfile, repositorio, capturas o comandos visibles.

No debe habilitarse escritura de Decision Conditions, estética, agentes, BIM/IFC, IoT, Digital Twin, Monte Carlo, optimización avanzada, planificación nacional automática ni nuevas entidades en este ciclo. Tampoco debe modificarse el Core Contract, la autoridad, la semántica de Recommendation/Decision, el modelo de eventos, la persistencia canónica o la seguridad.

No debe declararse E2E por ejecutar endpoints aislados ni por obtener un HTTP 200. No debe presentarse el fallback local como operación remota.

---

## 10. Decisiones que siguen dependiendo del Product Owner

**INTERVENCIÓN DEL USUARIO REQUERIDA** para clasificar el Master Spec y decidir sobre Fact/Assumption, Audit/Report, escritura canónica de Decision Conditions, alcance congelado de 0.6, infraestructura autorizada, dominio y cualquier modificación del Core Contract.

El paquete técnico puede prepararse sin resolver esas decisiones, pero no puede utilizarlas como aprobadas por silencio. Si una prueba demuestra que el contrato actual no permite una etapa del flujo, debe registrarse la discrepancia y detener únicamente esa parte.

---

## 11. Referencia operativa

La fuente operativa es `deploy/CLOUD_COMPUTER_RUNBOOK.md`. Este paquete lo resume y lo organiza para un único ciclo remoto; el runbook mantiene la autoridad sobre nombres, rutas y secuencia operativa.

**Estado de este artefacto:** preparado, no ejecutado.  
**Siguiente acción válida:** disponer de un Cloud Computer adjunto, confirmar dominio y credenciales por canal seguro, y comenzar por el Paso 0.
