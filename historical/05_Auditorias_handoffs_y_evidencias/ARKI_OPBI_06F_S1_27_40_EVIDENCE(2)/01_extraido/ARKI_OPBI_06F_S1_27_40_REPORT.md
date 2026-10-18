# OPBI 06F-S1.27–40 — Rapid Opportunity Radar

## Estado máximo

`IMPLEMENTED FOR BOUNDED CLASSIFICATION / OPERATIONAL VALIDATION REQUIRED / PILOTS NOT_DEMONSTRATED`

## Implementado

Se incorporó una clasificación determinista de urgencia: `FLASH`, `CRITICAL`, `VERY_HIGH`, `HIGH`, `ACCELERATED`, `NORMAL`, `EXPIRED` y `UNKNOWN`. Los umbrales siguen siendo propuestos y requieren validación operacional.

Se incorporó quick screening para detectar fuente disponible, relevancia del proyecto, bloqueadores fatales, relevancia de la capacidad ARKI, tiempo de producción, tiempo de revisión humana y dependencias externas.

La clasificación `RAPID_BID_CANDIDATE` no equivale a `GO`. La señal de ventaja se denomina `TIME_COMPRESSION_ADVANTAGE_CANDIDATE`, nunca `WIN_PROBABILITY`.

## Gates

Los bloqueadores fatales, los UNKNOWN críticos y las dependencias externas no se esconden dentro de una puntuación global. La decisión humana permanece obligatoria.

`ARKI MAY COMPRESS TIME. ARKI SHALL NOT COMPRESS EVIDENCE.`

## No implementado

No se activó monitorización periódica, recalculo automático por eventos externos, scraping, conectores, alertas de producción ni Opportunity Command Center visual. La infraestructura solo ofrece clasificación pura y determinista para integración posterior gobernada.

La hipótesis estratégica de ventaja competitiva por velocidad sigue en `HYPOTHESIS / NOT_DEMONSTRATED`.
