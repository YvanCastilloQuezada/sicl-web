# Blocked-route causal clusters

A0.R3 does not merge every blocked route into one defect. The evidence supports several distinct clusters.

| Cluster | Classification | Evidence-supported finding | Routes |
|---|---|---|---|
| A | `BLOCKED_LAZY` | React shell is present and the visible route remains `Cargando módulo`; route-specific screen did not resolve during capture. Exact chunk HTTP status and module evaluation are not persisted and remain UNKNOWN. | See `04_SCREEN_REGISTRY.json` records with `BLOCKED_LAZY`. |
| B | `BLOCKED_CORE` | A rendered fail-closed screen reports unavailable Core/spatial/session state. This is not classified as a UI defect. | `/evidence`, `/field`, `/spatial-comparison` |
| C | `BLOCKED_AUTH` | Browser redirects to Manus authentication. No login takeover was performed. | Any record marked `BLOCKED_AUTH`; if none is present in the current text corpus, this cluster remains a documented possibility rather than an observed route. |
| D | `NOT_IMPLEMENTED` | A declared route renders the product 404 screen. | `/control-center` in the captured evidence set. |
| E | `UNKNOWN` | No route-specific evidence artifact is available. | `/help/commands` where applicable. |

The clusters are causal classifications, not repair prescriptions. A0.R3 does not repair lazy loading, configure Core, change auth or add routes.
