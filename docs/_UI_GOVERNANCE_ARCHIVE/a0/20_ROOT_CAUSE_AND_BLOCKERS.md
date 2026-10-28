# A0 — Causas raíz y blockers

## Blocker de bootstrap heredado

El diagnóstico heredado reportaba marcadores de conflicto y errores TypeScript en `client/src/App.tsx`, pero el baseline actual no reproduce esos errores: `pnpm check` pasa y no quedan marcadores de conflicto en el archivo. A0 registra el antecedente para trazabilidad, pero no lo clasifica como blocker actual.

## Blocker de evidencia

El inventario fuente no permite probar que un handler produzca el efecto esperado. Por ello, la causa de la mayoría de estados desconocidos es insuficiencia de evidencia, no una conclusión de que el control esté roto.

## Blocker de entorno

Las capacidades que dependen de OAuth, Core remoto, base de datos, WebXR, cámara, micrófono, WebRTC, Revit, Dynamo, Rhino, Blender o proveedores externos requieren un entorno autorizado y reproducible. Sin ese entorno, A0 debe conservar `BLOCKED_PENDING_EVIDENCE` o `UNKNOWN_UNVERIFIED`.
