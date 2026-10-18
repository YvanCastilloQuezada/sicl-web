# Orden Maestra 001 — mapa focalizado de Fase A

## Alcance de fase

Fase A autoriza rescatar Mobile Shell, integrar L★, rescatar LUKA Entry, identificar agentes/servicios relevantes, eliminar desconexiones evidentes y verificar el resultado. El criterio de salida exige evidencia de estructura Shell, L★ integrado, QR contextual, LUKA Entry funcional, mapa focalizado, ausencia de duplicación y pruebas de cambios. Después debe detenerse para evaluación de Human Authority.

## Evidencia existente

`client/src/components/LukaUniversalEntry.tsx` ya funciona como entrada contextual: resuelve intents de voz, aplica disponibilidad del launch registry, conserva historial local de comandos, ofrece táctil como fallback, abre AR/TV/control modes y distingue laboratorio interno. Sin embargo, la resolución principal es cliente/local y el historial usa localStorage; no demuestra por sí sola autorización backend.

`client/src/pages/Home.tsx` ya es una portada pública mínima con L★, Entrar al Mundo y Ver TV. L★ abre `/generador-qr`; la pulsación larga comparte o abre QR. Esto evidencia un acceso L★ existente, pero no demuestra aún que el QR sea una hoja contextual que preserve exactamente el estado anterior.

`client/src/App.tsx` ya contiene rutas para `/`, `/portal`, `/lukita-ar-stage`, `/touch-remote`, `/mapper`, `/the-eye`, y `/mapper-the-eye`, además de un indicador persistente online/offline y carga diferida. No existe una abstracción explícita denominada Mobile Shell; la composición se realiza por `App`, `ThemeProvider`, `LanguageProvider`, `TooltipProvider`, `PersistentNetworkStatus` y rutas.

`shared/lukaOsContract.ts` define intents, disclosures por modo, fallback contextual, permisos de cámara y separación conceptual de intent/modo. `shared/lukaLaunchRegistry.ts` define capabilities disponibles/reservadas/ocultas y protección nominal de acciones CORE. `server/lukaShare.ts` contiene el ShareService backend de Orden 52/59 con TTL, revocación, resolución prioritaria y gates de publicación. El QR Studio cliente sigue siendo una superficie de personalización independiente y no debe confundirse con la entrada contextual L★.

`client/src/pages/TouchRemotePage.tsx` contiene una superficie amplia con modos remote, trackpad, keyboard, ar y universal, perfiles, orientación, personalización y escenas. Puede ser referencia/rescate para interacción contextual, pero no debe convertirse automáticamente en el Mobile Shell ni ampliarse durante Fase A.

`LukaRuntimeLab` y `LukaDevControlPanel` son superficies de laboratorio/simulación y no deben presentarse como producto público ni como evidencia de capacidades reales.

## Decisión provisional

La mayor parte de Fase A ya existe parcialmente. El gap verificable es de integración y contrato: definir o documentar el Mobile Shell mínimo, conectar L★ con resolución contextual real de ShareService, mantener retorno exacto al estado anterior y probar la transición de Entry → contexto QR → retorno. No se autoriza iniciar Fase B–G ni reconstruir AR, TV, Controller, Mapper o The Eye.
