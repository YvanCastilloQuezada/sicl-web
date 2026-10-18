# E5 — Cierre contractual: resultado de reverificación

**Baseline:** `c62183a`  
**Fecha de ejecución:** 23 de septiembre de 2026  
**Alcance:** reverificación técnica y contractual, sin modificar producto.

## 1. Resultado ejecutivo

La regresión técnica de E5 terminó correctamente:

| Verificación | Resultado |
|---|---|
| `pnpm check` | PASS (`EXIT_CODE=0`) |
| `pnpm build` | PASS (`EXIT_CODE=0`) |
| Regresiones E5 | PASS (`EXIT_CODE=0`) |
| Modelo constructivo | PASS |
| Serialización | PASS |
| Coherencia de muros | PASS |
| Muro–puerta en canvas | PASS |
| SceneModel | PASS |
| Comparación de escenas | PASS |
| Selección BIM | PASS |
| Persistencia formal | PASS |
| Sincronización 2D/3D | PASS |
| Clipping/filtro técnico actual | PASS como contrato serializable |
| Cámaras técnicas | PASS |
| Medición actual | PASS como medición entre centroides |
| Viewpoints | PASS como contrato estructural |
| Aislamiento/congelación | PASS |

## 2. Resultado de los ocho puntos de cierre reclamados

| Punto | Resultado | Evidencia exacta |
|---|---|---|
| Capturas y hashes | `PARTIAL_EXISTING_CAPTURE_ONLY` | Existe `evidence/E5_CAPTURAS/arki-scene-general.png` con SHA-256 `4e603cc4764377bdf92b9de3375c49f3b3fcd1d299ed66f69370fed7ec9b5798`; no existe el paquete completo de ocho capturas |
| Restauración real de snapshots | `NOT_DEMONSTRATED` | `test-persistence-idb.ts` construye y valida un registro; no ejecuta guardar → cerrar → reabrir → restaurar en IndexedDB |
| Restauración real de viewpoints | `NOT_DEMONSTRATED` | `test-viewpoints.ts` verifica el código fuente y campos; no ejecuta guardar → recargar → restaurar |
| Controles independientes de comparación | `PARTIAL` | La comparación produce `added/removed/modified/unchanged`; no existe prueba de interacción que demuestre cámara, nivel, capa y filtro independientes por lado |
| Nomenclatura final | `NOT_CLOSED_LEGACY_TERMS_PRESENT` | El código todavía contiene `clipping`, `clippingActive`, `snap` y `snap: centroide` |
| `E5_MANIFEST.json` | `NOT_DEMONSTRATED_MISSING` | No existe el manifest contractual con todos los hashes de E5 |
| `E5_SCOPE_LIMITS.md` | `NOT_DEMONSTRATED_MISSING` | No existe el archivo contractual específico en el baseline inspeccionado |
| `E5_OUTPUTS.txt` | `NOT_DEMONSTRATED_MISSING` | Existe `E5_SCENE_MODEL_3D_OUTPUTS.txt`, pero no el output contractual con todos los pendientes de E5 |

## 3. Conclusión

No hubo fallos de compilación ni fallos en las regresiones técnicas ejecutadas. El estado correcto es:

```text
E5 technical regression: PASS
E5 contract closure: NOT CLOSED
E5 status: FROZEN / PARTIAL
E6: BLOCKED under the current gate
```

La causa no es que las pruebas técnicas fallen. La causa es que faltan demostraciones E2E y artefactos contractuales específicos de cierre.

## 4. No sobreafirmaciones

Esta reverificación no declara `E5 VERIFIED`. Tampoco declara que exista restauración E2E de snapshots o viewpoints, ni que la comparación tenga controles independientes demostrados. El resultado se entrega para que DeepSeek pueda emitir el siguiente veredicto contractual con evidencia reproducible.

## 5. Archivo de evidencia cruda

El detalle completo, incluidos comandos y outputs, está en `E5_CLOSURE_REVERIFICATION_OUTPUTS.txt`.
