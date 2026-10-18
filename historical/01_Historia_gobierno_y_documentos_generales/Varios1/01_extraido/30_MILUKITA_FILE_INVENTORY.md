# 30 — Inventario de archivos y clasificación

## Conteo observado

En el corte de auditoría se observaron **1.002 archivos** fuera de `node_modules` y `.git`, mediante `find . -type f`. El inventario completo debe conservarse con el commit/checkpoint asociado; este documento clasifica las familias sin duplicar cada archivo generado.

## Clasificación

| Clase | Rutas representativas | Tratamiento |
|---|---|---|
| MILUKITA_CORE | `client/src/pages`, `client/src/components`, `shared/*` de identidad/experiencias | Dominio de producto; requiere revisión por módulo. |
| MILUKITA_MODULE | `server/territorialTrust.ts`, `fieldGateReports.ts`, Controller/TV/AR | Módulos funcionales; estados mixtos. |
| MJP_CORE | reglas, RNG, wallet, ledger, settlement, `MjpTvManifest` | PROTECTED; no tocar. |
| SHARED | `shared/territorialTrust.ts`, `circularQr.ts`, `agentRegistry.ts` | Contratos; revisar primero antes de UI. |
| DOCUMENTATION | `docs/*.md`, manuales, auditorías | Fuente documental; no asumir implementación. |
| TEST | `*.test.ts`, `*.spec.ts` | Evidencia de regresión, no certificación de producción. |
| ASSET | `client/public`, S3 references, GLB, logos, QR | Verificar URL, MIME, hash y lifecycle. |
| GENERATED | `dist`, reports, exported PDFs/CSVs | No usar como fuente de verdad de dominio. |
| CONFIG | `package.json`, `vite.config.ts`, `drizzle.config.ts`, `tsconfig.json`, env metadata | Determinan build/deploy; contienen dependencias sensibles. |
| LEGACY/UNKNOWN | logs, provisional pages, historical artifacts | No eliminar sin dependency audit. |

## Archivos críticos

`client/src/App.tsx`, `Home.tsx`, `QrGeneratorPage.tsx`, `LukitaARStagePage.tsx`, `TouchRemotePage.tsx`, `TerritorialTrustPage.tsx`, `TerritorialFieldEntryPage.tsx`, `TerritorialPilotConsole.tsx`, `TerritorialFieldTools.tsx`, `server/territorialTrust.ts`, `server/fieldGateReports.ts`, `drizzle/schema.ts`, `shared/territorialTrust.ts`, `shared/circularQr.ts`, `shared/mjpCoreIsolation.test.ts`.

## Regla

No se modificaron archivos de código durante la Orden Maestra 54. Los nuevos archivos de esta auditoría son documentación y deben distinguirse de fuentes ejecutables.
