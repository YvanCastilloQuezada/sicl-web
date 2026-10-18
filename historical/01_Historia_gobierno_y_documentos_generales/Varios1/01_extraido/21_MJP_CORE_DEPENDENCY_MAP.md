# 21 — Mapa de dependencias MJP CORE

## Dominios protegidos

`MJP_CORE`, `RNG`, `RTP`, `WALLET`, `LEDGER`, `SETTLEMENT`, `RULES`, `MjpTvManifest`.

## Qué necesita MiLukita de MJP CORE

Solo proyecciones/lecturas autorizadas del estado de show, manifest o resultados cuando exista un contrato explícito. El Controller/TV puede proyectar estado; el agente/copilot puede responder con `NO DATA` si falta información.

## Qué necesita MJP CORE de MiLukita

No debe necesitar territorio, AR, QR, Mapper, The Eye, Controller Lab o agentes para preservar su autoridad. Cualquier integración debe ser un adaptador de lectura/proyección, no una dependencia de mutación.

## Compartidos

Tipos, contratos de manifest, show state y orquestación pueden ser compartidos si no exponen una escritura inversa. Tests P0 deben permanecer independientes y pasar ante metadata hostil.

## Separación de migración

Mover MiLukita fuera del entorno no requiere mover MJP CORE. Los contratos de lectura/proyección deben desacoplarse; Wallet/Ledger/RNG/Rules/Settlement deben seguir bajo control del núcleo. **No se modificó MJP CORE durante la auditoría.**

**Evidencia:** `shared/mjpCoreIsolation.test.ts`, `shared/agentRegistry.ts`, `shared/tvManifest.ts`, `shared/experienceOrchestrator.ts`.
