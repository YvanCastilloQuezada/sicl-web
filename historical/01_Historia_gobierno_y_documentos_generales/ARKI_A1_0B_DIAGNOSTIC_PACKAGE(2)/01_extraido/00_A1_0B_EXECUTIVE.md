# ARKI-UI-GOVERNANCE-001.A1.0B — Route Settlement & Meaningful-Render Verification

**Veredicto:** `ROUTE_SETTLEMENT_PARTIAL`

**Alcance:** diagnóstico forense únicamente. Se utilizaron las mismas 14 rutas de A1.0 y el runtime canónico de producción en `4001`. No se modificaron rutas, React.lazy, Suspense, loaders, Core, autenticación, UI, backend ni configuración.

La pasada confirma que cinco rutas alcanzaron un meaningful render observable: `/arki`, `/arki-device-bridge`, `/arki-operations`, `/audit` y `/help/user`. Dos rutas (`/comparisons`, `/evaluations`) también renderizaron su pantalla, pero mostraron una dependencia Core HTTP 503 y por eso se clasifican como `BLOCKED_CORE`. `/arki-parametric-runtime` terminó en el flujo de autenticación Manus durante la observación y se clasifica `BLOCKED_AUTH`.

Seis rutas quedaron en estado `UNKNOWN`: `/arki-book`, `/arki-research-review`, `/help/operations`, `/security-events`, `/sources` y `/spatial`. En los casos medidos con ventana completa, el fallback persistió a 2, 5, 10 y 15 segundos, pero no apareció evidencia positiva de rechazo de importación, error HTTP del chunk, error de evaluación o mismatch de exportación. Conforme a la orden, un timeout no se convierte en causa raíz confirmada.

**Conteo:** meaningful render observado 7 (incluye las 2 bloqueadas por Core); `RENDERED_NORMAL` 5; `RENDERED_SLOW` 0 demostradas en esta pasada; `BLOCKED_LAZY_CONFIRMED` 0; `BLOCKED_CORE` 2; `BLOCKED_AUTH` 1; `BLOCKED_OTHER_DEPENDENCY` 0; `UNKNOWN` 6.

**A1.1:** no justificado. No hay subconjunto con evidencia suficiente de fallo lazy confirmado. La evidencia apunta a una combinación de método de observación, estado/runtime y dependencias externas, pero no demuestra un defecto único del producto.
