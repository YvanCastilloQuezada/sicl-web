# ARKI — Política de acceso web y Archive.org

## Estado

`IMPLEMENTED_LOCALLY / HUMAN_REVIEW_REQUIRED`

## Regla de acceso

ARKI no mantiene acceso web abierto. Toda consulta de investigación debe ejecutarse bajo un **research internet lease** activo. El lease estándar dura diez minutos y se cierra automáticamente al expirar. La ausencia de lease bloquea la consulta con una política fail-closed.

El propietario humano puede conceder una extensión explícita. El contrato actual permite una extensión de hasta 120 minutos por concesión, pero nunca se activa por defecto ni se deriva de una autorización genérica anterior.

El acceso puede cerrarse manualmente en cualquier momento. La tarea diaria también exige abrir un lease y cerrar el acceso al terminar o ante un error.

## Preferencia de fuentes

`https://archive.org/` es la fuente preferida para investigación bibliográfica y documental. Esta preferencia no convierte automáticamente sus materiales en obras de dominio público. Cada obra debe conservar su estado de derechos: `UNKNOWN`, `PUBLIC_METADATA_ONLY`, `OPEN_LICENSE` o `COPYRIGHTED`, según evidencia específica.

El sistema no reproduce texto protegido. Por defecto registra metadatos, resúmenes breves, términos, URL, hash y provenance en staging. La promoción al Core permanece separada y requiere revisión humana.

## Flujo

```text
OWNER AUTHORIZATION
→ 10-MINUTE LEASE
→ PREFER ARCHIVE.ORG
→ HTTPS ALLOWLIST
→ METADATA / ABSTRACT ONLY
→ RIGHTS CHECK
→ EXCEL STAGING
→ AUTO-CLOSE LEASE
→ HUMAN REVIEW
→ OPTIONAL SEPARATE CORE VALIDATION
```

## Límites

El límite diario permanece en 30 fuentes. La tarea programada permanece en modo `ask_user`; no ejecuta consultas sin la autorización correspondiente. No se permite crawling ilimitado, promoción automática, escritura silenciosa en SICL Core ni suposición de derechos por el simple hecho de que un documento esté visible en Archive.org.

## Evidencia de validación

Las pruebas focalizadas del módulo de investigación pasan: 5 pruebas, incluyendo allowlist de Archive.org, autorización del propietario, duración estándar de diez minutos, extensión explícita y cierre del lease. La validación global de TypeScript continúa bloqueada por los 11 errores preexistentes en `client/src/App.tsx` reportados por el proyecto.
