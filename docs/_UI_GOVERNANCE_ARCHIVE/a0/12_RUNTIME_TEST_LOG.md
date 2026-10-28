# A0 — Registro runtime

## Resultado de esta ejecución

No se ejecutó un sweep interactivo completo de las 38 rutas en esta fase documental. La razón es preservar A0 como auditoría de evidencia sin convertir la falta de acceso autenticado, host externo o dispositivo físico en una falsa afirmación de funcionamiento.

## Evidencia histórica conservada

La ruta `/arki-design-funnel` tiene evidencia previa de montaje y de interacción con selección humana, promoción al Final Four, evaluación profunda, selección 4→1 y vistas Planta, Corte, 3D y Programa. Esa evidencia se clasifica como `PARTIAL_HISTORICAL`, no como aceptación total de A0.

## Blockers

La verificación actual ejecutó `pnpm check` con resultado PASS, la regresión completa con **96 archivos y 434 tests PASS**, y `pnpm build` con resultado PASS. El build conserva un warning no bloqueante por chunks mayores de 500 kB. La reconciliación de autenticación, permisos y persistencia por control permanece pendiente.
