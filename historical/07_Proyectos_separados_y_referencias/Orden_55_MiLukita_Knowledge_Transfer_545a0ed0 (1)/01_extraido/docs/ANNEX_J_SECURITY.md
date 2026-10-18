# 19 — Seguridad y RBAC

## Autenticación

Manus OAuth y el contexto server-side resuelven el usuario autenticado. Las rutas públicas pueden mostrar información limitada; las operaciones territoriales deben usar procedimientos protegidos.

## Roles

El proyecto distingue rol base de usuario, roles territoriales Mapper Operator/Eye Reviewer/Human Authority y roles Controller USER/PRESENTER/OPERATOR. La autorización real se comprueba en procedimientos como `requireTerritorialRole`; la UI solo debe ocultar/mostrar controles como conveniencia.

## Scopes de assets

`ADMIN_ONLY`, `REVIEW_ONLY` y `PUBLISHED_RUNTIME` limitan exposición. S3 URL, key, hash y metadata deben mantenerse coherentes.

## Riesgos

Una ruta pública puede parecer funcional mientras la operación real exige login; un botón visible puede fallar si el backend rechaza el rol; un QR puede iniciar un deep link sin otorgar permiso. Debe revisarse cualquier endpoint donde la UI sugiera autoridad que el backend no concede.

## Estado

Auth y RBAC territorial: IMPLEMENTED. Configuración productiva de secretos, dominio, cookies, CORS, S3 ACL, rate limiting y revisión de logs: REQUIERE_HUMANO/EXTERNAL_REQUIRED.
