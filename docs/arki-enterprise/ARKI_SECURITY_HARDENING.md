# ARKI — Security Hardening v1

## Implementado

ARKI incorpora headers de endurecimiento (`nosniff`, `SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Resource-Policy`, `Origin-Agent-Cluster` y HSTS cuando la conexión es HTTPS). En producción publica y aplica `Content-Security-Policy` estricta; en desarrollo conserva `Report-Only` para no interferir con HMR. Los reportes CSP se reciben en `/api/security/csp-report`.

Las mutaciones HTTP pasan por una guardia de origen: si el navegador envía un `Origin` distinto del host servido o de `ARKI_ALLOWED_ORIGINS`, la petición se rechaza con `403 ORIGIN_NOT_ALLOWED`. Las peticiones GET/HEAD/OPTIONS y clientes sin `Origin` no se bloquean, preservando APIs internas y el flujo temporal de acceso directo.

Se aplican límites en memoria por IP para OAuth, SICL Core y tRPC. El límite es defensivo y local; en producción distribuida debe complementarse con un gateway o rate limiter compartido (Redis, WAF o CDN), porque un límite en memoria no coordina múltiples réplicas.

El WebSocket paramétrico ahora limita el tamaño de mensaje a 16 KiB, una suscripción por socket, 50 suscriptores por canal, 30 mensajes por minuto, orígenes no permitidos y conexiones inactivas mediante ping. Los eventos continúan siendo progreso gobernado y no autorizan decisiones arquitectónicas.

## Qué no se afirma

Estas medidas reducen superficie de ataque, pero no sustituyen WAF, gestión de secretos, análisis de dependencias, backups cifrados, rotación de credenciales, protección DDoS, observabilidad centralizada ni pruebas de penetración profesionales. Tampoco convierten el bypass temporal de interfaz en autenticación: el backend protegido continúa dependiendo de `protectedProcedure` y `adminProcedure`.

## Panel administrativo

La ruta `/security-events` muestra los bloqueos de origen, rate limits, reportes CSP y bloqueos WebSocket recientes. La consulta está protegida por `adminProcedure`, y el servidor conserva un ring buffer acotado de 500 eventos para diagnóstico local. No se registran cuerpos de solicitudes ni secretos.

## Pendientes de producción

Debe configurarse `ARKI_ALLOWED_ORIGINS` con los dominios definitivos, trasladar el registro de eventos y rate limiting a componentes compartidos, activar escaneo SAST/DAST y realizar una revisión profesional antes de comercializar ARKI.
