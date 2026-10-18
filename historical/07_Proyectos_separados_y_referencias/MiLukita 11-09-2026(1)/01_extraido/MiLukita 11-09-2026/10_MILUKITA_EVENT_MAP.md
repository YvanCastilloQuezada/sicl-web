# 10 — Mapa de eventos

| Evento | Productor | Persistencia | Consecuencia |
|---|---|---|---|
| WORLD_OBJECT_CREATED | Mapper service | Audit + snapshot + object | Nuevo objeto CAPTURED. |
| WORLD_OBJECT_EDITED | Mapper service | Audit + snapshot | Nueva versión y UNPUBLISHED. |
| CLAIM_CREATED | Mapper service | Claim + audit | Afirmación pendiente/relacionada. |
| SOURCE_CREATED | Mapper/Eye | Source + audit | Fuente incorporada. |
| EVIDENCE_CREATED | Mapper | Evidence + hash + audit | Evidencia disponible para revisión. |
| WORLD_OBJECT_VERIFY/DISPUTE | Eye | Review + object + audit | Cambia estado/score. |
| WORLD_OBJECT_PUBLISHED | Human Authority | Object + audit | Runtime puede consumir. |
| OFFLINE_CAPTURE_QUEUED | Mapper client/server | OfflineCapture + audit | Cola local/server. |
| OFFLINE_CAPTURE_CONFLICT | Sync | Conflict + audit | Requiere revisión humana. |
| OFFLINE_CONFLICT_RESOLVED | Eye/HA | OfflineCapture + audit | Keep/Merge/Dispute. |
| ASSET_UPLOADED | Mapper/Eye | S3 + asset metadata + audit | Evidencia disponible según scope. |
| login/logout | Auth | Session/auth logs | Sesión creada/cerrada. |
| controller pairing/command | Controller | Session/command tables | Comando contextual, no autoridad core. |
| QR generated/shared | QR UI | local state/optional logs | Payload/deep link; no autorización. |
| copilot intent/action | Voice UI | local/server logs según flujo | Interpretación o acción permitida; no publicación. |

Debe distinguirse `INTENT_DETECTED` de `ACTION_EXECUTED`; una intención reconocida no implica que el comando haya sido ejecutado por un receptor real.
