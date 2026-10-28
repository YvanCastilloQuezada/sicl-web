# A0 — Runbook reproducible

1. Capturar branch, HEAD, worktree, lockfile y variables no secretas.
2. Ejecutar `python3 scripts/run_ui_governance_a0.py`.
3. Ejecutar `pnpm check`, `pnpm test` y `pnpm build` sin alterar archivos.
4. Iniciar una sola instancia del servidor y guardar URL, puerto y commit.
5. Abrir cada ruta del mapa en una sesión limpia.
6. Registrar consola, red, estado visual y controles visibles.
7. Ejecutar primero acciones reversibles. Aislar mutaciones en un proyecto de prueba.
8. Para cada acción, guardar payload, respuesta, versión antes/después, screenshot y hash.
9. Repetir la acción después de recargar para probar persistencia.
10. Cerrar con un informe de diferencias. No cambiar el estado de clasificación sin evidencia.
