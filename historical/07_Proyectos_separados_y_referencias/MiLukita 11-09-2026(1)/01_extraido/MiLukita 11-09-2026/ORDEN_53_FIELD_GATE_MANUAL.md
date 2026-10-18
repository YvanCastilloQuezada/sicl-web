# MiLukita · Field Gate 001
## Manual de verificación para Mapper y The Eye

**Versión:** 1.0 · **Ámbito:** primera muestra territorial · **Estado:** piloto controlado

> Este manual no es una guía de software. Es una ficha de trabajo para arquitectos, ingenieros y responsables de validación en campo. Cada paso debe dejar evidencia y una decisión explícita.

## 1. Propósito

Comprobar que una persona puede levantar un punto territorial con ubicación, fotografía y observaciones, conservarlo sin conexión y entregarlo a revisión humana sin alterar el núcleo MJP CORE. Mapper captura; The Eye revisa. Ninguno publica por sí solo.

## 2. Roles y separación

| Rol | Acción permitida | Decisión que no puede tomar |
|---|---|---|
| Mapper Operator | Capturar coordenadas, foto, fuente, claim y observación | Publicar conocimiento territorial |
| Eye Reviewer | Comparar evidencia, resolver conflictos y marcar estado | Modificar RNG, wallet, reglas o ledger |
| Human Authority | Aprobar publicación y aceptar el expediente de campo | Delegar su aprobación automáticamente |

## 3. Equipamiento mínimo

- Dos teléfonos reales: Android y/o iOS, con cámara, GPS y micrófono disponibles.
- Navegador actualizado y conexión HTTPS. Una prueba debe ejecutarse con conectividad interrumpida intencionalmente.
- Una pantalla o segundo teléfono para escanear el QR de acceso.
- Hoja de incidencia o registro digital para anotar hora UTC, dispositivo, versión y resultado.

## 4. Secuencia operativa

### A. Antes de salir

| Paso | Acción | Evidencia | Resultado |
|---|---|---|---|
| A1 | Abrir `/mapper` bajo HTTPS | URL y hora UTC | PENDIENTE / PASS / FAIL |
| A2 | Ejecutar diagnóstico GPS, cámara y micrófono | Exportación TXT | PENDIENTE / PASS / FAIL |
| A3 | Confirmar identidad del operador | Usuario/rol, sin compartir contraseña | PENDIENTE / PASS / FAIL |
| A4 | Verificar indicador ONLINE | Captura de pantalla | PENDIENTE / PASS / FAIL |

### B. Captura Mapper

1. Crear una **CaptureSession** con un identificador único.
2. Registrar punto, coordenadas y precisión; no corregir manualmente una coordenada sin anotarlo.
3. Capturar fotografía orientada al objeto real. Registrar fuente y observación original.
4. Guardar con conectividad y verificar estado **SYNCED**.
5. Repetir la captura sin conectividad. Verificar **LOCAL_PENDING** y que la fotografía no desaparezca.
6. Recuperar conectividad, sincronizar manualmente y registrar resultado.

### C. Revisión The Eye

1. Abrir el expediente sincronizado y comparar versión local/remota.
2. Revisar coordenadas, precisión, timestamp UTC, fuente y evidencia visual.
3. Si existe conflicto, escoger **KEEP_LOCAL**, **KEEP_REMOTE**, **MERGE** o **MARK_DISPUTED** con motivo.
4. Confirmar que la resolución queda en el audit log con hash y responsable.
5. Mantener el estado en revisión hasta la aprobación explícita de Human Authority.

## 5. Prueba de desconexión

Desactivar datos durante la captura y conservar el dispositivo en el lugar. El resultado PASS exige: captura visible, fotografía accesible, estado offline explícito, cola pendiente y recuperación sin pérdida al volver la red. Un fallback visual no equivale a sincronización confirmada.

## 6. Evidencias obligatorias por muestra

| Evidencia | Requisito |
|---|---|
| Identidad | Operador, dispositivo y versión |
| Espacio | Coordenadas, precisión y timestamp UTC |
| Visual | Fotografía o motivo documentado si no se pudo capturar |
| Semántica | Claim, fuente y observación original |
| Integridad | Hash de expediente/exportación |
| Decisión | Estado, responsable y comentario |

## 7. Criterios de salida

**PASS de muestra:** todos los campos obligatorios presentes, evidencia legible, cola sincronizada, conflicto resuelto o marcado disputado y audit log verificable. **FAIL:** pérdida de evidencia, permiso no explicable, coordenada ausente, estado ambiguo o publicación sin autoridad humana. **BLOCKED:** hardware, permiso o red impiden completar la prueba; no debe convertirse en PASS por interpretación.

## 8. Registro final

Al terminar, guardar: fecha/hora UTC, operador, modelo y sistema operativo, URL usada, resultado por paso, hash de exportación, incidencias y firma o aprobación de Human Authority. No registrar contraseñas, tokens ni información personal innecesaria.

## 9. Límites conocidos

La certificación de cámara, GPS, micrófono, permisos, instalación de Service Worker, rendimiento y escaneo QR requiere dispositivos físicos. El modo sandbox no demuestra por sí solo que un teléfono real conserve permisos, cámara o caché offline. MJP CORE permanece fuera de este procedimiento.
