# MiLukita — Marketing Intelligence & Content Factory

**Estado:** arquitectura implementada parcialmente y verificable localmente. No es publicación productiva ni integración externa habilitada.

## Decisión de integración

Marketing Intelligence vive dentro de **Business OS** y reutiliza el Control Room existente. No se creó una segunda aplicación de marketing ni se subordinó Marketing al Content Agent. La superficie disponible es `MarketingIntelligencePanel`, cargada de forma diferida en `/control-room`.

El agente trabaja bajo el flujo `READ → ANALYZE → PROPOSE → VALIDATE → APPROVE → EXECUTE → MEASURE → LEARN`. En esta iteración, `EXECUTE` queda limitado a preparar borradores locales y solicitudes de revisión. La publicación automática y la programación de redes permanecen deshabilitadas.

## Contrato canónico

`shared/marketingIntelligence.ts` define Brand Intelligence, Content Library, Campaign Brief, estados de capability, lifecycle de contenido, Claim Status, Content Decision, Business KPI y Agent KPI. También define los límites de lectura, acciones que requieren humano y denegaciones de escritura sobre `MJP CORE`, `RNG`, `RESULT`, `RTP`, `WALLET`, `LEDGER` y `SETTLEMENT`.

El contrato `validateClaim` bloquea claims sin evidencia o sobre capacidades que no están en `IMPLEMENTED`. `evaluateContentGate` exige verdad, estado de producto, revisión legal, revisión de experiencia y aprobación humana. `canPublishMarketingContent` devuelve siempre `false` durante esta fase deliberadamente.

## Superficie implementada

El panel permite introducir una propuesta de campaña, elegir objetivo, redactar un contenido candidato, indicar estado del producto, adjuntar una referencia de evidencia, simular estados de Legal y Experience y enviar el elemento a revisión humana. Expone los doce módulos contractuales de Marketing Intelligence y los doce content pillars de la orden.

El Launch Pack de 30 días se representa como estructura de cuatro semanas: explicación de MiLukita, TV → QR → celular, Lukita + entretenimiento y comunidad + interacción. Cada etapa se etiqueta `READY_FOR_HUMAN_APPROVAL`; no se presenta como campaña publicada ni como resultado de una campaña real.

## KPI y Data Trust

Business KPI y Agent KPI están separados. Reach, impressions, engagement, CTR, QR scan rate, usuarios, CAC y ROI requieren fuentes autoritativas y permanecen `NO_DATA` mientras no exista instrumentación persistente. Task success, generation success, validation success, false claim rate, policy violation rate, human escalation rate y execution latency son KPI del agente y tampoco se inventan.

La ausencia de datos no se convierte en cero, crecimiento, ROI, conversión ni éxito. Esta regla se alinea con `shared/observabilityContract.ts` y el resumen Observability OS del Control Room.

## Estado frente a los entregables de la orden

| Entregable | Estado real | Límite |
|---|---|---|
| Marketing Intelligence Agent | ARCHITECTURE_ONLY / PARTIAL | Contrato y panel local; sin runtime autónomo |
| Brand Intelligence | IMPLEMENTED AS CONTRACT | No hay repositorio persistente de claims |
| Truth / Claim Engine | IMPLEMENTED AS CONTRACT | Bloqueo local, no servicio central |
| Content Factory | PARTIAL | Estructura y gates; no genera assets multimodales automáticamente |
| Content Library | ARCHITECTURE_ONLY | Falta almacenamiento versionado persistente |
| Campaign Engine | PARTIAL | Brief local; sin calendario persistente ni ejecución externa |
| 30-Day Launch Pack | PARTIAL / READY_FOR_HUMAN_APPROVAL | Estructura de etapas, no paquete publicado |
| Legal Integration | REQUIRES_HUMAN | Legal Agent sigue PLANNED / DISABLED |
| Experience Integration | REQUIRES_HUMAN | Revisión representada, no agente autónomo |
| Marketing Dashboard | PARTIAL | Panel dentro de Control Room; KPI productivos no medidos |
| Observability | PARTIAL | Contrato y resumen local; sin pipeline persistente |
| Publication | EXTERNAL_REQUIRED / BLOCKED | No hay conectores ni credenciales; no hay auto-publicación |
| MJP CORE isolation | IMPLEMENTED / TESTED | Denegaciones contractuales y pruebas; CORE no modificado |

## Pruebas

`shared/marketingIntelligence.test.ts` cubre claims sin evidencia, estados no implementados, quality gates, aprobación humana, separación de KPI, repurposing y denegación de escritura en CORE. La validación integral del proyecto se ejecuta con `pnpm exec tsc --noEmit`, `pnpm test -- --run` y `pnpm build`.

## Próxima etapa permitida

No se debe añadir automatización de publicación todavía. La siguiente etapa segura es persistir Content Records y Campaign Briefs con versionado, aprobación y audit log, siempre que el esquema, los roles y la retención sean aprobados. La integración de redes sociales requiere conectores, secretos, consentimiento y política explícita.
