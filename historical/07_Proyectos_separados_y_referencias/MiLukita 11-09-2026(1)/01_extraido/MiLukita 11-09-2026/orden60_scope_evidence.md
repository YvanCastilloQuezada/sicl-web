# Evidencia de alcance original — Orden 60

Fuente: `/home/ubuntu/upload/pasted_content_60.txt`.

La Orden 60 define alcance exclusivamente backend, domain, API, persistencia, autenticación, autorización, RBAC, capabilities, sesiones, tokens, validación, auditoría, integridad, protección de datos, infraestructura de seguridad y tests de seguridad (líneas 10–27).

Prohíbe modificar frontend: JSX/TSX visual, CSS, Tailwind, layouts, páginas, componentes, iconos, navegación visual, UX, responsive, animaciones y estilos (líneas 30–53). Si existe un problema de seguridad frontend debe reportarse como `FRONTEND_SECURITY_PENDING`, sin modificarlo (líneas 55–63).

El inventario exigido incluye autenticación, sesiones, cookies, JWT/tokens, API/tRPC/REST, middleware, RBAC, capabilities, ownership, auditoría, base de datos, migraciones, secretos, variables de entorno, rate limiting, CSRF si corresponde, CORS, uploads, assets, QR, ShareService, Mapper, The Eye, World Engine, LUKA AR, Copilot y Human Authority (líneas 86–121).

La clasificación final debe distinguir completado, parcial, no completado, no verificado, external required y fuera de alcance original, con evidencia y prueba por pendiente. La evidencia del documento original no convierte automáticamente pruebas externas en completadas; cualquier requisito no verificable debe conservar `NOT_VERIFIED` o `EXTERNAL_REQUIRED` según corresponda.
