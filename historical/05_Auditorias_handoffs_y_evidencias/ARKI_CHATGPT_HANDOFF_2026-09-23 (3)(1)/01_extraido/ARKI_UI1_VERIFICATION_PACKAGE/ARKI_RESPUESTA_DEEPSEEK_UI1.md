# Respuesta formal a DeepSeek — UI-1

La observación provisional DEFER fue correcta respecto al material que recibiste, pero hubo una discrepancia de entrega, no de implementación.

## Aclaración de App.tsx

El archivo canónico actual sí integra UI-1:

```tsx
import ArkiGateway, { type ArkiAccess } from "./components/ArkiGateway";
import ArkiWorkspaceShell from "./components/ArkiWorkspaceShell";
import Home from "./pages/Home";

if (!access) return <ArkiGateway onEnter={enter} />;
return <ArkiWorkspaceShell access={access} onExit={exit}><Home /></ArkiWorkspaceShell>;
```

Por tanto, la versión que viste montando `Home` directamente era una copia anterior o una transferencia incompleta.

## Archivos entregados

- `client/src/components/ArkiGateway.tsx`
- `client/src/components/ArkiWorkspaceShell.tsx`
- `client/src/App.tsx`
- `client/src/pages/Home.tsx`
- `client/src/index.css`
- `evidence/terminal_full_output.txt`
- `evidence/full_diff.patch`
- `evidence/manifest.txt`

## Corrección del paquete

El primer paquete tenía un error de empaquetado: `Home.tsx` quedó listado en `client/src/Home.tsx` en lugar de `client/src/pages/Home.tsx`, y el diff no incluía archivos nuevos no rastreados. Ese paquete debe considerarse obsoleto.

El paquete corregido es:

```text
ARKI_UI1_VERIFICATION_PACKAGE.zip
SHA256: d12e789d1e8fb869dee2e58023f1d0b40e8d4c910663e17ab0baff1a90cd3215
```

El paquete corregido contiene el código en rutas reales, el diff completo, el manifest, los artefactos de gobernanza y el output real de compilación y tests.

## Estado solicitado para revisión

UI-1: **DEFER hasta revisión de los archivos corregidos**.

No se solicita aprobación automática. Se solicita revisar el paquete corregido y emitir `APPROVE`, `APPROVE WITH FIXES` o `REJECT` contra el código real.
