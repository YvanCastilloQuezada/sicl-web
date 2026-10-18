# Archi — Protocolo de desbloqueo temporal y rebloqueo fail-closed

Este documento autoriza un ciclo temporal para implementar y verificar componentes bloqueados, sin inventar recursos externos y restaurando el bloqueo al finalizar.

## Regla

Se implementan contratos, adaptadores, estados, mocks deterministas, fixtures, validaciones, reportes y pruebas locales. Una integración externa solo se activa con URL, token, host, proveedor, servidor o dispositivo real autorizado y verificado.

## Componentes

| Componente | Implementación temporal | Estado final obligatorio |
|---|---|---|
| Core remoto canónico | Cliente, contrato, health-check, autenticación explícita y errores tipados | Bloqueado si faltan URL/token; sin fallback silencioso |
| Hosts Revit/Dynamo/Rhino/Grasshopper/Blender | Interfaces, jobs, colas, aislamiento, manifests y fixtures mock | Real solo con host autorizado |
| RVT/DGN/ghx/dyn | Adaptadores y reportes de cobertura/pérdida | Bloqueado sin software y archivos reales |
| IFC round-trip | Contrato, parser/adaptador, fixtures y loss report | Productivo solo con modelos reales y validación |
| Estructuras/MEP/firma | Modelos preliminares y contrato de solver | Bloqueado sin solver y profesional autorizado |
| WebXR | Detección de soporte, fallback y pruebas simuladas | Físico solo con Android/iPhone reales |
| Transcripción | Contrato de proveedor, estados y fallback visible | Productivo solo con proveedor configurado |
| WebRTC pairing | QR, signaling, expiración y estados | Real solo con servidor y dos dispositivos |
| ARKI-TV/LUKA-TV | Pipeline local, borrador, moderación y autorización | Publicación live bloqueada |
| Investigación web diaria | Lease, autorización y auditoría | Desactivada hasta orden explícita |
| Marketplace/terceros | Manifest, sandbox, permisos y logs | Bloqueado hasta pentest y revisión humana |
| 8K/16K | Perfiles, límites, jobs y reporte de upscale | Nativo solo con worker probado |
| Enterprise/Cloud Computer | Contrato de despliegue y health-check | Pendiente hasta entorno real configurado |

## Secuencia

1. Registrar ADRs, archivos protegidos y recursos disponibles.
2. Implementar localmente contratos, adaptadores, mocks, fixtures y pruebas.
3. Ejecutar recursos externos solo si existen y están autorizados.
4. Ejecutar check, build, dominio, integración, regresión, seguridad, outputs y capturas.
5. Revocar flags temporales, retirar secretos de logs, cerrar endpoints, apagar publicación y restaurar `fail-closed`.
6. Emitir informe `antes / durante / después` por componente.

## Prohibiciones

No inventar URL, token, host, proveedor, firma, modelo, dispositivo o resultado profesional. No presentar un mock, SVG, toast o descarga conceptual como integración profesional. No publicar automáticamente ni declarar cálculo estructural, MEP o firma profesional.

## Cierre

El ciclo termina únicamente cuando lo local está implementado y probado, las integraciones externas están verificadas o explícitamente bloqueadas, y el sistema vuelve a operar en modo `fail-closed`.
