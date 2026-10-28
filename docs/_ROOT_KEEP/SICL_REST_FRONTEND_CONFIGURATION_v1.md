# SICL 0.6 — Configuración del puente REST hacia Core v1.0

## Configuración

El frontend usa `VITE_API_URL` como origen del Core FastAPI. Debe apuntar a una URL accesible desde el navegador del usuario, no a `localhost` cuando la aplicación esté publicada. No se incluye ningún token en el navegador; la capa REST actual no añade cabeceras secretas.

Ejemplo de configuración de despliegue:

```text
VITE_API_URL=https://<sicl-core-host>
```

El valor real queda pendiente de la URL efectiva del servicio Core. No se inventa una dirección mientras el backend no esté publicado.

## Flujo unificado

Cuando `VITE_API_URL` está configurado, SICL 0.6 muestra el workspace REST como fuente canónica. El formulario `Create via REST` ejecuta `POST /projects`; la consola ejecuta `POST /commands`; después se ejecuta `GET /projects/{project_id}` para refrescar el dashboard y mostrar la versión real del Core.

Cuando `VITE_API_URL` no está configurado, el frontend conserva el flujo tRPC existente para desarrollo y compatibilidad. Esto evita presentar un fallback local como si fuera el Core remoto.

## CORS

La verificación preflight debe ejecutarse después de publicar el Core, usando el origen real del frontend:

```bash
curl -i -X OPTIONS "$VITE_API_URL/projects" \
  -H "Origin: https://<frontend-host>" \
  -H "Access-Control-Request-Method: POST"
```

La respuesta debe incluir un `Access-Control-Allow-Origin` compatible con el origen del frontend. En este sandbox el Core no está escuchando en `127.0.0.1:8000`, por lo que la prueba de red real queda pendiente de despliegue; no se declara CORS E2E verificado.
