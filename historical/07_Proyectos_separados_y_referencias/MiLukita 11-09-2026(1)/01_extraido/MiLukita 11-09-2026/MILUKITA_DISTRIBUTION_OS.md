# MiLukita Distribution OS — expediente técnico

## Alcance

Distribution OS se implementa como una capa superior de proyección y preparación de distribución. No reemplaza `MJP CORE`, `MjpTvManifest`, RNG, RTP, wallet, credits, ledger, settlement, reglas, Event Engine, Kill Switch, Auditor ni Watchdog.

## Implementado localmente

| Componente | Estado | Evidencia |
|---|---|---|
| Contrato de canales | IMPLEMENTADO | `shared/distributionOs.ts` |
| Master feed projection | IMPLEMENTADO | `createMasterFeedProjection()` consume `MjpTvManifest` |
| ShowState projection | IMPLEMENTADO | `shared/showState.ts` |
| Detección de conflictos | IMPLEMENTADO | duración, solapamiento, QR, contingencia y siguiente evento |
| Gate de publicación | IMPLEMENTADO | bloquea conflictos críticos y canales bloqueados |
| Panel de revisión | IMPLEMENTADO | `DistributionOsPanel.tsx` dentro de Control Room |
| Pruebas | IMPLEMENTADO | `distributionOs.test.ts`, `showState.test.ts` |

## Parcial o pendiente

La conexión real a FAST, OTT, IPTV, cable, DRM, CDN, playout profesional, acuerdos con operadores, publicación externa, homologación y observabilidad de proveedores no está configurada. Los canales externos aparecen como `EXTERNAL_REQUIRED` o `BLOCKED` y no se realiza ninguna llamada, reserva, gasto o publicación automática.

El `ShowState` actual es una proyección derivada del manifest; no es una segunda fuente de verdad. La secuencia y el hash sirven para diagnóstico local y no sustituyen firma, integridad ni verificación independiente de producción.

## Seguridad y gobernanza

El panel no puede modificar resultados, reglas, RNG, RTP, créditos, wallet, liquidación, Kill Switch ni el manifest autoritativo. La publicación se rechaza si existe un conflicto crítico. La integración comercial y de distribución permanece en modo de preparación y requiere autorización humana.

## Verificación

La evidencia local incluye compilación TypeScript y pruebas unitarias. La operación 24/7 real, multiinstancia contra base compartida, QA físico, staging persistente y distribución externa requieren una fase posterior autorizada.

## Observabilidad de distribución

El panel `DistributionOsPanel` incorpora un filtro por estado para separar rápidamente canales `READY`, `READY_FOR_STAGING`, `EXTERNAL_REQUIRED`, `DEGRADED` y `BLOCKED`. También muestra un historial local derivado de las políticas actuales y de conflictos detectados; los registros sin timestamp se identifican como configuración/política y no como publicaciones externas realizadas.

Cada canal dispone de un detalle accesible mediante foco y tooltip, con su estado, notas y necesidad de integración externa. La publicación continúa bloqueada ante canales bloqueados o conflictos críticos. No se habilitan proveedores, CDN, DRM, playout, acuerdos ni distribución externa.
