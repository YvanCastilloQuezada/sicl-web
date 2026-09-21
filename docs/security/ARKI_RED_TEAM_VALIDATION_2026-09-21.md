# ARKI — Validación defensiva intensiva

**Fecha:** 2026-09-21  
**Alcance:** tres pasadas locales de revisión estática, runtime, seguridad HTTP, dependencias, pruebas y build.  
**Modo:** defensivo; no se ejecutó explotación destructiva, no se usaron credenciales, no se habilitó el Core local como sustituto del remoto y no se enviaron solicitudes fuera del entorno local.

## Resultado ejecutivo

La validación local terminó con **TypeScript PASS**, **310 pruebas PASS en 67 archivos**, **build PASS**, **estrés local PASS**, **0 vulnerabilidades críticas**, **0 vulnerabilidades altas** en dependencias de producción y **0 marcadores de conflicto**. El Core remoto continúa deliberadamente ausente, por lo que sus endpoints responden `503` fail-closed; esto es un bloqueo de infraestructura, no un fallo de seguridad.

## Correcciones aplicadas

Se añadió `scripts/arki-local-security-stress.mjs` y el comando `pnpm run security:stress:local`. La prueba es acotada, reproducible y distingue el `503 CORE_UNAVAILABLE` esperado de un `5xx` inesperado. Verifica además el rechazo sin sesión, el rate limit CSP y la presencia de headers defensivos.

Se actualizaron las dependencias directas vulnerables: tRPC 11.19, Axios 1.20, Drizzle ORM 0.45.3, MySQL2 3.24.4, nanoid 5.1.16 y SDK S3 3.1137. Se trasladó la configuración de `overrides` y `patchedDependencies` a `pnpm-workspace.yaml`, compatible con pnpm moderno, y se fijaron `fast-xml-parser` 5.11.1, `path-to-regexp` 0.1.13, `lodash` 4.18.1 y `lodash-es` 4.18.1. También se añadió `minWidth`/`minHeight` al gráfico de ensamblaje como mitigación de layout en entornos sin medición DOM.

## Evidencia de seguridad

| Control | Resultado | Evidencia |
|---|---:|---|
| TypeScript | PASS | `pnpm check` |
| Pruebas completas | PASS | 67 archivos / 310 pruebas |
| Build | PASS | `pnpm build` |
| Auditoría crítica/alta | PASS | `pnpm audit --prod --audit-level=high` → exit 0 |
| Auditoría total | INFORME | 0 critical, 0 high, 27 moderate, 7 low |
| Protected procedure sin sesión | PASS | `POST /api/trpc/projects.create` → `401 UNAUTHORIZED` |
| Origin guard | PASS | origen `https://evil.example` → `403` |
| Rate limiting CSP | PASS | 60 respuestas `204`, 10 respuestas `429` en la primera corrida |
| Estrés local | PASS | 100 solicitudes, concurrencia 20, `unexpected5xx=[]` |
| Core sin URL remota | PASS FAIL-CLOSED | 67 respuestas `503` esperadas en estrés |
| Conflictos Git | PASS | 0 marcadores `<<<<<<<`, `=======`, `>>>>>>>` |
| Build PWA | PASS | build y shell local servidos; no se tocó identidad/API del service worker |

## Hallazgos que permanecen abiertos

El entorno de desarrollo responde CSP en `Report-Only`; el código conserva enforcement estricto para producción. El proceso local no debe confundirse con una verificación de producción desplegada.

Persisten 27 vulnerabilidades moderadas y 7 bajas de producción. No se forzó una actualización mayor de Express, Recharts, Mermaid u otras ramas con riesgo de regresión funcional. Deben tratarse en una ventana separada con pruebas de compatibilidad y revisión de changelogs.

La suite conserva cinco warnings no bloqueantes de Recharts (`width(0)`/`height(0)`) porque jsdom no proporciona layout real en esos tests; no son errores de TypeScript, runtime de navegador ni build. El gráfico tiene dimensiones mínimas defensivas y debe verificarse visualmente en navegador real.

El patrón `TEMPORARY_DIRECT_ACCESS = true` sigue siendo un bypass únicamente de interfaz temporal y visible; el backend protegido no se debilitó. Para producción debe cambiarse a `false` antes de comercializar o exponer el sistema ampliamente.

No existe un SICL Core remoto configurado en este entorno. No se afirmó equivalencia con un Core remoto ni se sincronizó un fallback local.

## Conclusión

ARKI quedó más fuerte frente a fallos de entrada, abuso de endpoints, orígenes no autorizados, ráfagas de solicitudes y vulnerabilidades de dependencias críticas/altas. La arquitectura sigue fail-closed: sin sesión no hay mutación protegida; sin Core canónico no hay persistencia canónica; sin revisión humana no se promueven reparaciones o mejoras como verdad del sistema.
