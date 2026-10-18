# ARKI-COCO-001 — Reporte final

**Estado máximo:** `COCO PREREQUISITES TESTED / PENDING INDEPENDENT REVIEW`

## 1. Estado inicial

La auditoría independiente encontró los cuatro frentes como `PARTIAL`. ARKI ya tenía bases reutilizables: `ConstructionModel` y `ConstructionSpace`; Relationship Fabric, provenance/evidence, UNKNOWN, applicability, scale y revision; E8-A/E8-C para compilación y gates documentales; SceneModel/Three.js, snapshots, viewpoints, IFC e IndexedDB; y E8-B para activos, garantías, inspecciones, órdenes de trabajo e historial.

No existía un fundamento genérico completo para grafos espaciales, un contrato documental transversal, una representación abstracta gobernada de avatar ni una base O&M event-sourced con separación as-built/sensor.

## 2. Implementación realizada

COCO-A creó `shared/arkiCocoSpatial.ts` con BFS, DFS, componentes conexos, Dijkstra, ciclos, grado normalizado y fingerprint determinista. No contiene tipos ni reglas de hospital, museo o colegio.

COCO-B creó `shared/arkiCocoDossier.ts` con tipos documentales, trazabilidad, revisión, responsabilidad, emisión condicionada a aprobación y firma, y detección mínima de inconsistencia. No emite expediente profesional.

COCO-C creó `shared/arkiCocoAvatar.ts` con nodos de escena, transforms jerárquicos, validación sintética de assets, clips, comandos y observaciones de dispositivo, y separación entre percepción y evidencia. No incluye GLB real, rig productivo, OCR productivo ni AR.

COCO-D creó `shared/arkiCocoOm.ts` con activos, eventos append-only, estado de condición, work orders, verificación de cierre, as-built separado y observaciones de sensores. `sensorIsCanonical()` es deliberadamente falso: una lectura no se convierte automáticamente en hecho canónico.

## 3. Pruebas

La suite `scripts/test-coco.ts` ejecutó 34 assertions normales y cubrió límites, adversariales, metamórficos, transferencias y test-the-test en los cuatro frentes. El test-the-test detectó mutantes de camino mínimo y de historial. También se ejecutó la regresión PA-001.

## 4. Regresiones

Se ejecutaron diez comandos: `pnpm check`, COCO-A/B/C/D, PA-001, E8-A, E8-B, E8-C, BKH4 foundation, E5 close, E7 y `pnpm build`. Resultado: `10 PASS`, `0 FAIL`, `OVERALL=PASS`.

## 5. Mutantes y límites

Se demostró que los oráculos detectan un shortest path incorrecto y un historial de condición sobrescrito. Quedan como gaps deliberados: mutantes exhaustivos por cada operador, tests browser reales de O&M más allá de E8-B, y validación profesional de cualquier documento, avatar o mantenimiento.

## 6. No auto-certificación

COCO no declara `SPATIAL_SYNTAX_COMPETENCY_VERIFIED`, `EXPEDIENTE_TECNICO_COMPETENCY_VERIFIED`, `AVATAR_COMPETENCY_VERIFIED` ni `OM_COMPETENCY_VERIFIED`. El resultado es únicamente preparación fundamental probada en fixtures sintéticos y transferibles.

## 7. Human Authority y PF-H01

No se modificó PF-H01, no se creó bypass, master override ni recovery key. No se emitió firma, publicación, decisión profesional ni commit canónico. El worktree sigue siendo histórico/sucio y no se declara limpio.

## 8. Recomendación

El siguiente paso correcto es revisión independiente del paquete COCO. Si se aprueba, la siguiente capacitación debe ampliar sólo una frontera a la vez: primero métricas matemáticas genéricas y programa espacial; después contrato documental; luego assets/scene importables; finalmente O&M con restauración real y autoridad humana. No conviene saltar todavía a exámenes DeepSeek ni a capacidades productivas.
