# ARKI · Command Center

**URL:** https://4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer/arki-host-connections

---

Instala ARKI como WebApp

Acceso rápido y una experiencia local preparada para conectividad intermitente.

Instalar
SICL
⌘K
CONEXIONES AUTORIZADAS
Revit · Dynamo Host Bridge

Configura el host que ejecutará validaciones o exportaciones. ARKI sólo prepara la conexión y verifica capacidades; los tokens permanecen en el servidor y toda ejecución requiere revisión humana.

Configuración segura
Revit
Dynamo
Identificador del host
Endpoint HTTPS del host

Capacidades declaradas

revit-export
shared-coordinates
parameter-map
Validar configuración
Preparar solicitud
Probar host server-side
Límites de seguridad

HTTPS obligatorio y rechazo de endpoints locales o de redes privadas desde la aplicación pública.

Los tokens sólo se configuran mediante secretos del servidor; nunca se guardan en localStorage ni se envían desde el navegador.

Un host disponible no demuestra que el modelo sea correcto. La exportación, ejecución y firma siguen bloqueadas hasta la revisión humana.

HOST_CONFIGURED ≠ MODEL_APPROVED