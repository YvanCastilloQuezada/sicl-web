# ARKI Marketplace de tipologías

## Estado

Se implementó un contrato local y gobernado para compartir tipologías declarativas, validar definiciones DSL, preparar propuestas de instalación y generación, agregar moderación y calcular analítica determinista de uso y fallos. La vista está disponible en `/arki-marketplace` y el runtime conserva el enlace de retorno.

## Invariantes

El marketplace no ejecuta código arbitrario, Python, imports, filesystem, red ni comandos de terceros. Las definiciones se aceptan únicamente como DSL declarativo. Una propuesta permanece en estado `PENDING_REVIEW` hasta que exista revisión humana. Rechazar o congelar no elimina automáticamente el registro: se conserva para trazabilidad.

La publicación exige aprobación humana y autoridad administrativa; no se habilitó publicación automática, mutación del SICL Core ni distribución externa. La analítica resume usos, fallos, tasa de aprobación y puntuación media; no sustituye revisión normativa, profesional o disciplinar.

## API protegida

El router `parametricRuntime` expone consultas públicas de contrato, API y feature flags. La validación de una propuesta y la consulta de analítica requieren sesión mediante `protectedProcedure`. Las rutas operativas de moderación, persistencia productiva, apelaciones y distribución externa quedan preparadas como gates posteriores, porque requieren almacenamiento y autoridad de producto adicionales.

## Resultado de validación

TypeScript PASS. Pruebas focalizadas del DSL y contratos existentes PASS. `git diff --check` PASS. La implementación es reversible mediante el checkpoint WebDev asociado a esta fase.

## Pendientes explícitos

La persistencia productiva de submissions, reportes y eventos de analítica debe conectarse a tablas de aplicación antes de comercializar. Los tests E2E de navegador, la documentación pública para terceros, la moderación operativa con apelaciones y cualquier proveedor externo requieren una fase separada. Estas limitaciones no bloquean el contrato local ni la experiencia de inspección.
