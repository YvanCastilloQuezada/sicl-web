# Archi — Protocolo de desbloqueo temporal y rebloqueo fail-closed

## Estado

**Autorización solicitada:** desbloqueo temporal para implementar y verificar capacidades locales y adaptadores seguros.

**Regla:** el desbloqueo temporal no autoriza a inventar hosts, secretos, proveedores, firmas profesionales ni resultados de dispositivos reales. Todo recurso externo que no esté configurado y verificado permanece bloqueado.

## Objetivo

Implementar todo lo que pueda ejecutarse de forma determinista en el repositorio, crear contratos y adaptadores para lo externo, ejecutar pruebas con fixtures controlados y después restaurar el modo `fail-closed`.

El ciclo termina con dos estados distintos:

| Capacidad | Estado posterior al ciclo |
|---|---|
| Código local, contratos, validaciones y fixtures | Implementado y verificado si pasa pruebas reales |
| Conectores sin host, token, proveedor o dispositivo | Bloqueado fail-closed |
| Cálculo profesional y firma | Bloqueado hasta solver y profesional autorizado |
| Publicación, marketplace y ejecución de terceros | Bloqueado hasta sandbox, pentest y aprobación |

## Precondiciones obligatorias

Antes de abrir un componente, DeepSeek y Manus deben registrar el inventario del repositorio, baseline, hash del árbol, dependencias, permisos, secretos disponibles, hosts disponibles, fixtures y pruebas. No se deben crear secretos ficticios ni activar fallback local silencioso.

La configuración debe distinguir `configured`, `reachable`, `authenticated`, `tested` y `approved`. Solo un componente que llegue a todos los estados requeridos puede ejecutar una integración externa real.

## Componentes y tratamiento temporal

| Componente | Durante el desbloqueo | Resultado obligatorio antes del rebloqueo |
|---|---|---|
| Core remoto canónico | Crear cliente, contrato, health-check, autenticación explícita, timeout y errores tipados. | Si URL/token faltan, `BLOCKED`; sin fallback automático. |
| Revit/Dynamo/Rhino/Grasshopper/Blender | Crear interfaces de host, jobs, colas, aislamiento, manifests y fixtures mock. | Ejecución real solo con host autorizado; mocks no se presentan como exportación nativa. |
| RVT/DGN/ghx/dyn | Crear adaptadores y reportes de cobertura/pérdida. | Exportación nativa bloqueada sin software real y archivo de prueba real. |
| IFC round-trip | Crear parser/adapter contract, fixtures y loss report. | Productivo solo después de archivos reales, validación y round-trip sin pérdida no declarada. |
| Estructuras, MEP y firma | Crear modelos, entradas, resultados preliminares y contrato de solver. | Cálculo profesional y firma permanecen bloqueados sin solver validado y profesional autorizado. |
| WebXR | Crear contrato de capacidades, detección de soporte, fallback y pruebas simuladas. | Activación física solo con Android/iPhone reales y matriz de compatibilidad. |
| Transcripción | Crear contrato de proveedor, cargador de audio, estados y fallback visible. | Productivo solo con proveedor configurado y prueba de transcripción real. |
| Pairing WebRTC | Crear QR, signaling contract, estado de conexión y expiración. | Pairing real solo con servidor y dos dispositivos de prueba. |
| ARKI-TV/LUKA-TV | Crear pipeline local, moderación, estados de borrador y autorización. | Publicación live siempre bloqueada hasta sandbox, moderación y aprobación explícita. |
| Investigación web diaria | Crear contrato de lease, autorización y auditoría. | Permanece desactivada hasta orden y schedule autorizado. |
| Marketplace/terceros | Crear manifest, sandbox, permisos mínimos, límites y logs. | Ejecución real bloqueada hasta aislamiento, pentest y revisión humana. |
| 8K/16K | Crear perfiles, validación de límites, jobs y reporte de upscale. | Native universal solo con worker/proveedor probado; upscale no se llama nativo. |
| Enterprise/Cloud Computer | Crear deployment contract, health-check y checklist. | Pendiente hasta entorno real, HTTPS, Core, almacenamiento, backups y monitoreo. |

## Secuencia de ejecución

### Paso 1 — Desbloqueo documental

Registrar esta orden, sus límites, los archivos autorizados, los archivos protegidos y los criterios de éxito. Añadir ADRs para cada integración que modifique `shared/`, persistencia, permisos o contratos.

### Paso 2 — Implementación local

Crear contratos, adaptadores, mocks deterministas, validadores, reportes de cobertura, fixtures y pruebas de error. Toda capacidad debe mostrar estados `unconfigured`, `blocked`, `ready`, `running`, `failed`, `completed` y `approved` cuando corresponda.

### Paso 3 — Ejecución externa autorizada

Solo si aparece una URL, token, host, proveedor, dispositivo o sandbox real, ejecutar la integración correspondiente. La prueba debe conservar logs, versión, entrada, salida, hash, pérdida y resultado.

### Paso 4 — Verificación

Ejecutar `pnpm check`, `pnpm build`, pruebas de dominio, integración, regresión, seguridad, fixtures, captura del preview y revisión de no-fallback. Ningún mock cuenta como prueba productiva.

### Paso 5 — Rebloqueo obligatorio

Al terminar, desactivar flags temporales, retirar secretos de logs, revocar leases, cerrar endpoints de prueba, apagar publicación, restaurar `fail-closed` y verificar que los componentes sin recursos reales muestran bloqueo explícito.

### Paso 6 — Informe final

Entregar una tabla `antes / durante / después` con cada componente, archivos tocados, pruebas, outputs, recursos reales usados, limitaciones, estado final y motivo de bloqueo si corresponde.

## Prohibiciones

No inventar URL, token, host, proveedor, firma, archivo RVT, modelo IFC productivo, dispositivo físico o resultado profesional.

No habilitar un fallback local automático cuando el contrato exige Core remoto.

No presentar un mock, un SVG, una descarga textual o un toast como integración profesional.

No publicar automáticamente, no ejecutar terceros fuera de sandbox y no declarar cálculo estructural, MEP o firma profesional.

## Criterio de cierre

El desbloqueo temporal solo se considera terminado cuando lo local está implementado y probado, las integraciones externas están verificadas o explícitamente bloqueadas, y el sistema vuelve a operar en modo `fail-closed`.
