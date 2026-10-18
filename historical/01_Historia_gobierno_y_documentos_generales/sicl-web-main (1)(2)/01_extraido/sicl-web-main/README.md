# ARKI Command Center

ARKI Command Center es la interfaz web de SICL 0.6 para trabajar con proyectos espaciales: contexto, evidencia, objetivos, restricciones, alternativas, evaluaciones, recomendaciones, revisión humana y decisión.

## Estado actual

**Frontend:** SICL 0.6, React 19 + TypeScript + tRPC.

**Integración REST:** disponible para conectar con ARKI Core v2.2 mediante `VITE_API_URL`. Cuando esa variable está configurada, el workspace REST usa el Core como fuente canónica para crear proyectos, ejecutar comandos y refrescar el dashboard. Cuando no está configurada, se conserva el modo compatible local/tRPC; este modo no debe interpretarse como Core remoto.

**Verificación local reciente:** TypeScript sin errores, 69 pruebas Vitest aprobadas y build de producción aprobado.

## Requisitos

- Node.js 18 o superior.
- pnpm 10 recomendado.
- Una instancia accesible de SICL Core para activar la integración REST.

## Instalación local

```bash
cd sicl-web
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

El modo de desarrollo permite el fallback local explícito mediante `SICL_ALLOW_LOCAL_CORE=true`. Este fallback está restringido al desarrollo y no debe habilitarse en producción.

## Configuración REST

Defina `VITE_API_URL` en el entorno de build o despliegue:

```text
VITE_API_URL=https://<sicl-core-host>
```

En GitHub Actions, configure este valor como **Repository variable** llamada `VITE_API_URL` (`Settings → Secrets and variables → Actions → Variables`). No es un secreto: una URL usada por el navegador termina siendo visible en el bundle. No coloque tokens o claves en variables `VITE_*`; los secretos de servicio deben permanecer server-side y utilizar GitHub Actions Secrets solo en jobs que no los incorporen al bundle.

El Core debe permitir el origen real del frontend mediante `SICL_CORS_ORIGINS`.

## Pruebas y build

```bash
pnpm check
pnpm test -- --run
pnpm build
```

## Estructura

```text
client/       Aplicación React y cliente REST tipado
server/       Router tRPC, autenticación y delegación server-side
docs/         Contratos, decisiones y runbooks
drizzle/      Esquema y migraciones de la aplicación web
```

## CI

GitHub Actions ejecuta TypeScript, Vitest y el build en cada `push` y `pull_request` hacia `main`.

## Licencia

Este repositorio se distribuye actualmente como **Proprietary — All rights reserved**. Cualquier cambio a una licencia abierta requiere una decisión explícita del Product Owner.
