# 22 — Mapa de dependencias

| Dependencia | Uso observable | Clasificación | Riesgo |
|---|---|---|---|
| pnpm/Node | scripts, build, tests | CORE | versión/lockfile |
| React/Vite | frontend y chunks | CORE | cache/chunks |
| Express/tRPC | API y contratos | CORE | auth/proxy |
| Drizzle/MySQL/TiDB | persistencia | CORE | migraciones/DB |
| Manus OAuth | identidad/sesión | EXTERNAL | proveedor |
| S3/storagePut | assets/evidencia | EXTERNAL | URL/scope/headers |
| QRCode/custom generator | QR | CORE del módulo QR | escaneo físico |
| Three.js/GLTFLoader | AR | OPTIONAL por ruta | GLB/rendimiento |
| WebXR/browser media APIs | AR/GPS/cámara/mic | EXTERNAL | hardware/permisos |
| OpenStreetMap/Google proxy | mapas | EXTERNAL | proveedor/tiles |
| WebSocket | Controller/sesión | OPTIONAL/EXTERNAL | receptor/latencia |
| Cast/DLNA/UPnP | TV real | EXTERNAL | hardware/red |
| PDFKit | informes | CORE del reporting | formato |
| Service Worker/Cache | offline | OPTIONAL por superficie | cache obsoleta |
| A-Frame/AR.js | solo si importado por ruta | UNKNOWN/OPTIONAL | verificar imports reales |
| LLM/voice providers | copilot/agentes | EXTERNAL | credenciales/latencia |

No se encontró evidencia suficiente en este informe para clasificar cada dependencia como UNUSED; ese dato requiere un análisis de bundle/import graph dedicado.
