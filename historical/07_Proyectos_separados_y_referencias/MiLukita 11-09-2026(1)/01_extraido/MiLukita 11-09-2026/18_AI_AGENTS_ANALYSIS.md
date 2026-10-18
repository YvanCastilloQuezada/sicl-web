# 18 — Agentes IA

## Distinciones

- **Agente:** identidad registrada con modo, límites, herramientas y auditoría.
- **Copilot:** asistencia contextual que requiere confirmación/fallback.
- **Automatización:** flujo determinista sin autoridad propia.
- **Servicio:** backend que ejecuta una operación autorizada.
- **Modelo IA:** componente probabilístico; no es autoridad.
- **Regla determinista:** validación/transición codificada.

## Agentes registrados

La matriz en `shared/agentRegistry.ts` y documentación de governance contiene agentes como Auditor, Watchdog, Recovery, Supervisor, Legal/Compliance, Distribution, Audience Intelligence, Marketing, Social, Content, Lukita, Sales, Revenue, Financial Intelligence y Experience Director. Para cada agente la fuente debe ser la entrada real de registry, no una tabla histórica.

## Límites comunes

Todos deben conservar la frontera `MJP_CORE`, `RNG`, `RTP`, `WALLET`, `LEDGER`, `SETTLEMENT`, `RULES`, `MjpTvManifest`. Modos válidos son READ_ONLY, ALERT_ONLY, PROPOSE_ONLY o PROJECTION_ONLY. Ningún agente puede decidir publicación territorial salvo el proceso Human Authority.

## Estado

Registry y tests: IMPLEMENTED/CONTRACTUAL. Madurez operacional, memoria productiva, herramientas externas, observabilidad y cobertura de cada agente: deben clasificarse por evidencia individual; no se deben inventar porcentajes.
