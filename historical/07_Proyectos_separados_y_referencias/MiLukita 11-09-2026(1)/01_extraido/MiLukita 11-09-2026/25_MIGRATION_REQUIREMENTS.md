# 25 — Requisitos de migración

## Fuente
Repositorio completo, historial, lockfile, scripts, contratos, tests, docs, assets y checkpoints. El código generado por framework debe separarse de dominio.

## Dependencias
Node/pnpm, React/Vite, Express/tRPC, Drizzle, MySQL/TiDB, QR, Three.js, PDFKit, WebSocket, Service Worker y proveedores externos.

## Datos
DB schema, migraciones aplicadas, índices, enums, usuarios/roles, auditoría, snapshots, offline queue y compatibilidad UTC. Hacer backup y ensayo de restore antes de mover.

## Assets/storage
S3 objects, keys, scopes, URLs, hashes, GLB, logos, QR assets y manuales. No copiar secretos dentro de assets.

## Entorno
Variables OAuth, DB, JWT, storage, APIs de mapas/LLM/voice, URLs públicas, CORS, cookies, HTTPS y observabilidad.

## Auth
Reemplazo o conservación de Manus OAuth, callback, sesiones, expiración, roles, migraciones de usuarios y revocación.

## Build/deploy
Reproducir `pnpm install --frozen-lockfile`, tests, typecheck, build, server runtime, SPA fallback, Service Worker cache bump y rollback.

## Dominio
DNS, TLS, redirecciones, URLs canónicas, QR regenerados y smoke tests. No usar preview como URL definitiva.

## Externos
S3, mapas, WebXR, Cast/DLNA, proveedores de voz/LLM, email/WhatsApp y analytics.

## No migrar sin separar
MJP CORE, RNG, RTP, wallet, ledger, settlement, rules y manifest requieren una frontera contractual independiente.
