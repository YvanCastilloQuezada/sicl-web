# 04 — Arquitectura maestra

## Capas

1. **Frontend:** React 19, Vite, wouter, Tailwind/shadcn, páginas y componentes.
2. **Contratos compartidos:** estados, tipos, contratos territoriales, QR, TV, agentes y Controller Lab.
3. **API:** Express + tRPC; procedimientos públicos, protegidos y administrativos.
4. **Dominio:** trust territorial, Field Gate, sesiones, identidad, Controller Lab, TV y juegos.
5. **Persistencia:** Drizzle ORM sobre MySQL/TiDB.
6. **Archivos:** S3 mediante `storagePut`/helpers.
7. **Cliente local:** Service Worker, Cache Storage, cola offline y localStorage.
8. **Externos:** OAuth, mapas, WebXR, cámara/GPS/micrófono, Cast/DLNA.

```text
Browser → React routes → tRPC client → Express/tRPC → domain service
       → Drizzle → MySQL/TiDB
       → storagePut → S3
       → audit events / snapshots / hashes
```

## Límites

`server/territorialTrust.ts` contiene el gate CAPTURE/VERIFY/PUBLISH. `shared/mjpCoreIsolation.test.ts` mantiene la frontera MJP CORE. El navegador nunca debe considerarse fuente de autoridad para publicación o resultados.

## Dependencias críticas

Three.js/GLTFLoader pueden fallar por asset o cache; Service Worker puede servir HTML desactualizado; WebXR y permisos son dependencias de dispositivo; Cast/DLNA requiere receptor y red; S3 requiere URL, headers y scope correctos.
