# 09 — Mapa de APIs

## Territorial Trust

| Función | Auth/rol | Efecto |
|---|---|---|
| `createTerritorialObject` | Mapper Operator | Inserta WorldObject CAPTURED + snapshot + audit. |
| `updateTerritorialObject` | Mapper Operator | Incrementa versión, vuelve CAPTURED/UNPUBLISHED + snapshot + audit. |
| `addTerritorialClaim` | Mapper Operator | Inserta Claim + audit. |
| `addTerritorialSource` | Mapper Operator/Eye Reviewer | Inserta Source + audit. |
| `addTerritorialEvidence` | Mapper Operator | Inserta Evidence con integrityHash + audit. |
| `reviewTerritorialObject` | Eye Reviewer | Inserta Review, calcula score, cambia estado + audit. |
| `publishTerritorialObject` | Human Authority | Verifica gate, publica + audit. |
| `uploadTerritorialAsset` | Mapper/Eye | Sube S3, hash, metadata y scope + audit. |
| `exportTerritorialData` | Depende de router | Produce CSV/GeoJSON desde objetos listados. |
| `importTerritorialData` | Actor protegido | Crea objetos desde CSV/GeoJSON con límites de tamaño. |
| `queueOfflineCapture` | Mapper | Inserta cola offline + audit. |
| `syncOfflineCapture` | Mapper | Sincroniza o crea conflicto + audit. |
| `resolveOfflineConflict` | Eye/Human Authority | Resolución auditada KEEP/MERGE/DISPUTE. |
| `listPublishedTerritorialObjects` | runtime | Devuelve solo objetos publicados y visibles. |

## Otras familias

Auth/OAuth expone `me` y logout; Controller expone pairing, commands, profiles y sesiones; QR expone datos/payload y exportación; Field Gate expone reportes, métricas y PDFs/CSVs. La ruta exacta debe comprobarse en `server/routers.ts` y módulos importados; una función interna no es automáticamente un endpoint público.

## Errores observables

`DATABASE_UNAVAILABLE`, `WORLD_OBJECT_NOT_FOUND`, `INVALID_STATUS_TRANSITION`, `PUBLICATION_GATE_FAILED`, `ASSET_SIZE_LIMIT`, `UNSUPPORTED_ASSET_TYPE`, `CONFLICT_NOT_PENDING` y errores de RBAC protegen límites importantes.
