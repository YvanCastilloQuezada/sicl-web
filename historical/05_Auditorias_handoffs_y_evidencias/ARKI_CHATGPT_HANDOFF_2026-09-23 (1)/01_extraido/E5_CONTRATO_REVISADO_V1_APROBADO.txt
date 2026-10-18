ARCHI — CONTRATO E5 REVISADO v1.0
Visor BIM 3D, modelo semántico, comparación y vistas técnicas
Fecha: 23 de septiembre de 2026
Autor: DeepSeek
Destinatario: Product Owner (aprobación) + Manus (ejecución)
Base: E5-PREVIEW / EXPLORATORY entregado por Manus + P0 resueltas + Fase 0 firmada
Estado: PROPUESTA — requiere aprobación del PO antes de ejecución
Predecesores: Orden Maestra v3.2, Reporte E5 de Manus, Veredicto corregido E5

0. PROPÓSITO Y ALCANCE
Este contrato redefine E5 como entregable formal. Toma el trabajo E5-PREVIEW / EXPLORATORY como base congelada y establece los criterios exactos para declarar E5 VERIFIED.

No es un contrato nuevo desde cero. Es un contrato de cierre que:

Congela lo ya entregado.

Lista los 12 pendientes.

Define criterio de aceptación por pendiente.

Establece pruebas, outputs y capturas obligatorias.

Fija el gate de cierre.

Protege shared/ y contratos existentes.

Regla de avance: E6 no se abre hasta que E5 cierre con veredicto APPROVE o APPROVE WITH FIXES.

1. BASE CONGELADA — E5-PREVIEW / EXPLORATORY
1.1. Artefactos aceptados como base
Artefacto	Ruta	Estado
Contrato SceneModel	shared/arkiSceneModel.ts	CONGELADO
Comparación de escenas	shared/arkiSceneComparison.ts	CONGELADO
Visor WebGL	client/src/canvas/SceneModel3D.tsx	CONGELADO
Módulo 3D	client/src/modules/SceneModelModule.tsx	CONGELADO
Integración shell	client/src/components/ArkiWorkspaceShell.tsx	CONGELADO (solo extensión aditiva)
Estilo visor	client/src/index.css	CONGELADO (solo extensión aditiva)
Pruebas	scripts/test-scene-model.ts, test-scene-model-mount.ts, test-scene-comparison.ts	CONGELADAS
Regla de congelamiento: estos archivos no se reescriben. Solo se extienden de forma aditiva para cerrar los pendientes.

1.2. Regresión verde obligatoria
Al iniciar E5-Revisado, Manus debe confirmar que siguen pasando:

text
pnpm check
pnpm build
test-constructive
test-serialization
test-wall-coherence
test-wall-door-canvas
test-bim-selection
test-scene-model
test-scene-model-mount
test-scene-comparison
Si alguna regresión se rompe durante E5-Revisado, se detiene la entrega y se reporta.

2. ADRs REQUERIDOS ANTES DE ESCRIBIR CÓDIGO
Antes de tocar código nuevo, deben existir formalmente estos ADRs. Son precondición de ejecución.

ADR-001 — Tecnología de visor 3D
Decisión: Three.js + React Three Fiber + Drei.
Versiones exactas a fijar en package.json:

three: (fijar versión — Manus declara)

@react-three/fiber: (fijar versión)

@react-three/drei: (fijar versión)

Justificación: P0-1 resuelta por el Product Owner.
Alternativas descartadas: Babylon.js, WebGPU puro.
Riesgo: compatibilidad R3F ↔ React 19 → mitigado con prueba PoC ya existente.

ADR-002 — Modelo intermedio de escena
Decisión: SceneModel derivado determinísticamente de ConstructionModel.
Contrato existente: shared/arkiSceneModel.ts (E5-PREVIEW).
Clasificación: ADR-EXTENSIÓN (no duplica ConstructionModel).
Regla: el visor consume SceneModel, nunca ConstructionModel directo.

ADR-003 — Identidad de elemento
Decisión: cada nodo de SceneModel porta:

id: ArchiElementId estable (derivado determinista, sin Math.random()).

globalId: GlobalId IFC gobernado (para round-trip futuro).

Regla: misma identidad entre 2D (CanvasPlanView), 3D (SceneModel3D), IFC y futuras familias Revit.
Clasificación: ADR-EXTENSIÓN (apoya arkiBimSelection.ts).

ADR-019 — Captura de canvas WebGL
Decisión: método autorizado para capturar el canvas.

Preferido: canvas.toDataURL('image/png') desde el propio componente.

Alternativa: Playwright headless con --enable-webgl.

Fallback: html2canvas solo si las anteriores fallan.

Regla: cada captura debe guardarse con SHA-256 y metadatos (viewport, nivel, capa, estado).

Estos cuatro ADRs forman parte del entregable de E5-Revisado.

3. LOS 12 PENDIENTES — CRITERIOS DE ACEPTACIÓN
Cada pendiente tiene: descripción, archivo(s) afectado(s), prueba, output y captura.

P1 — Captura WebGL con hash SHA-256
Descripción: generar captura verificable del canvas WebGL.

Archivos: no modifica producto; añade evidence/E5_CAPTURAS/.

Prueba: script scripts/capture-scene-model.ts genera PNG.

Output: .png con hash SHA-256 + .json con metadatos.

Captura: al menos 1 imagen general del visor.

Cierre: hash registrado en manifest.

P2 — IndexedDB y snapshots aprobados
Descripción: persistencia local real de SceneModel y snapshots.

Archivos: shared/persistence/ (nuevo), client/src/persistence/ (nuevo).

Contrato: Session, Project, Version, Snapshot (v3.0 Parte 2.3).

Prueba: test-persistence-idb.ts.

Output: snapshot guardado, restaurado, hasheado.

Captura: panel de snapshots con versión aprobada.

Nota: usa IndexedDB, no localStorage.

P3 — Comparación lado a lado persistente
Descripción: dos SceneModel desde snapshots en IndexedDB, lado a lado.

Archivos: client/src/comparison/ (nuevo).

Prueba: test-comparison-side-by-side.ts.

Output: reporte de added/removed/modified/unchanged entre snapshots.

Captura: dos visores lado a lado.

Requisito: cada lado con cámara, nivel, capa y filtros independientes.

P4 — Comparación 2D/3D sincronizada
Descripción: CanvasPlanView (2D) y SceneModel3D (3D) sincronizados por selección.

Archivos: client/src/canvas/ (extensión).

Prueba: test-plan-3d-sync.ts.

Output: misma selección propagada a 2D y 3D.

Captura: planta y modelo 3D mostrando misma selección.

P5 — Secciones dinámicas y clipping box
Descripción: plano de corte ajustable + caja de recorte.

Archivos: SceneModel3D.tsx (extensión).

Prueba: test-clipping-section.ts.

Output: estado de clipping serializable.

Captura: modelo con clipping activo.

P6 — Cámaras ortográficas y vistas técnicas completas
Descripción: cámara ortográfica + axonometría + planta + corte + elevación.

Archivos: SceneModel3D.tsx (extensión).

Prueba: test-camera-modes.ts.

Output: matriz de vistas con parámetros de cámara.

Captura: vista ortográfica + axonometría.

P7 — Medición y snapping
Descripción: medir distancia/área/volumen + snap a vértices/ejes/caras.

Archivos: client/src/canvas/measure/ (nuevo).

Prueba: test-measure-snap.ts.

Output: medidas retornadas con unidad y precisión.

Captura: medición activa con snap visible.

P8 — Viewpoints guardados
Descripción: guardar/restaurar cámara + estado de capas + selección.

Archivos: client/src/canvas/viewpoints/ (nuevo).

Prueba: test-viewpoints.ts.

Output: JSON de viewpoint + restauración idéntica.

Captura: lista de viewpoints con nombre.

P9 — Aislamiento y congelación de elementos
Descripción: aislar selección, congelar elementos, mostrar todo.

Archivos: SceneModel3D.tsx (extensión).

Prueba: test-isolate-freeze.ts.

Output: estado de aislamiento serializable.

Captura: modelo con elemento aislado.

P10 — Árbol con disciplina (no solo nivel + categoría)
Descripción: nodo padre = disciplina, luego nivel, luego categoría, luego elemento.

Archivos: shared/arkiSceneModel.ts (extensión aditiva).

Prueba: test-tree-discipline.ts.

Output: árbol con 4 niveles jerárquicos.

Captura: árbol expandido con disciplina.

P11 — ADRs 001/002/003 redactados
Descripción: documentos formales en contracts/adr/.

Archivos: contracts/adr/ADR-001.md, ADR-002.md, ADR-003.md, ADR-019.md.

Prueba: no aplica (documental).

Output: ADRs firmados.

Captura: no aplica.

P12 — Round-trip IFC productivo
Descripción: FUERA DE E5. Pertenece a E6.

Acción: se declara explícitamente fuera de alcance.

Documentación: incluir nota en E5_SCOPE_LIMITS.md.

Resumen: 11 pendientes dentro de E5, 1 fuera (P12 → E6).

4. ARCHIVOS AUTORIZADOS Y PROTEGIDOS
4.1. Protegidos (no modificar sin ADR-EXTENSIÓN)
shared/ — solo extensión aditiva.

ConstructionModel, Muro, StructuralElement, DTOs.

MODULE_DEFINITIONS, isAccessAllowed, supportedLanguages, catalog, t, useTranslation.

package.json, pnpm-lock.yaml, tsconfig.json — solo con autorización explícita.

4.2. Autorizados para crear
shared/persistence/

shared/scene/ (si se decide separar)

client/src/comparison/

client/src/canvas/measure/

client/src/canvas/viewpoints/

client/src/persistence/

contracts/adr/

evidence/E5_CAPTURAS/

scripts/test-*.ts (nuevas pruebas)

4.3. Autorizados para extender (aditivo, no reescritura)
shared/arkiSceneModel.ts

shared/arkiSceneComparison.ts

client/src/canvas/SceneModel3D.tsx

client/src/modules/SceneModelModule.tsx

client/src/components/ArkiWorkspaceShell.tsx

client/src/index.css

5. PRUEBAS Y OUTPUTS OBLIGATORIOS
5.1. Pruebas nuevas (mínimo)
text
scripts/test-persistence-idb.ts
scripts/test-comparison-side-by-side.ts
scripts/test-plan-3d-sync.ts
scripts/test-clipping-section.ts
scripts/test-camera-modes.ts
scripts/test-measure-snap.ts
scripts/test-viewpoints.ts
scripts/test-isolate-freeze.ts
scripts/test-tree-discipline.ts
scripts/capture-scene-model.ts
5.2. Pruebas de regresión
Todas las listadas en §1.2 deben seguir pasando.

5.3. Outputs obligatorios por entrega
pnpm check → exit=0.

pnpm build → exit=0.

Cada prueba → {status: "PASS", ...} con datos reales.

E5_OUTPUTS.txt con todos los outputs.

E5_MANIFEST.json con hashes.

E5_CAPTURAS/ con PNG + SHA-256.

E5_REPORT.md con:

Alcance entregado.

Alcance pendiente.

Limitaciones honestas.

Riesgos.

Próximos pasos.

5.4. Capturas obligatorias (mínimo 8)
Visor 3D general con modelo cargado.

Selección 3D ↔ Info Box poblado.

Comparación lado a lado (dos snapshots).

Sincronización 2D/3D con misma selección.

Clipping activo.

Cámara ortográfica.

Medición con snap.

Árbol con disciplina expandido.

Cada captura con:

Archivo .png.

Hash SHA-256.

Metadatos (viewport, nivel, disciplina, capa, estado).

6. CRITERIOS DE ACEPTACIÓN POR PENDIENTE
Pendiente	Aceptación
P1	Captura PNG con hash en E5_CAPTURAS/
P2	Snapshot en IndexedDB, restaurado, con gateStatus
P3	Dos SceneModel lado a lado con cámaras independientes
P4	Selección propagada 2D ↔ 3D sin desincronización
P5	Clipping ajustable y persistente
P6	4 vistas técnicas operativas (axonométrica, planta, corte, elevación)
P7	Medición con unidad correcta y snap funcional
P8	Viewpoint guardado y restaurado idénticamente
P9	Aislar/congelar/mostrar todo operativo
P10	Árbol con disciplina → nivel → categoría → elemento
P11	4 ADRs redactados y firmados
P12	Fuera de E5, documentado en E5_SCOPE_LIMITS.md
Todos los pendientes P1–P11 deben cerrarse para declarar E5 VERIFIED.

7. GATE DE CIERRE E5
E5 se declara VERIFIED solo cuando:

□ Los 4 ADRs (001, 002, 003, 019) existen y están firmados.
□ Los 11 pendientes P1–P11 cierran con prueba + output + captura.
□ Todas las pruebas de regresión pasan.
□ pnpm check y pnpm build en verde.
□ E5_MANIFEST.json con hashes completo.
□ E5_REPORT.md entregado.
□ Manus emite veredicto de implementación.
□ DeepSeek emite veredicto técnico.
□ PO aprueba cierre.
Si algún ítem falta: E5 permanece E5-PREVIEW / EXPLORATORY.

8. PROHIBICIONES
No se puede:

Reescribir shared/arkiSceneModel.ts ni arkiSceneComparison.ts. Solo extensión aditiva.

Modificar ConstructionModel, Muro, StructuralElement, DTOs.

Introducir Math.random() ni Date.now() en IDs críticos.

Introducir any nuevos en archivos críticos.

Declarar VERIFIED sin capturas con hash.

Declarar comparación visual si es solo numérica.

Abrir E6 antes del cierre de E5.

Activar integraciones externas.

Publicar el visor como "equivalente a Revit".

9. RIESGOS Y MITIGACIONES
Riesgo	Probabilidad	Impacto	Mitigación
Captura WebGL falla con html2canvas	Media	Alto	Playwright headless con --enable-webgl
IndexedDB incompatible con Safari viejo	Baja	Medio	Detectar y degradar a memoria con aviso visible
R3F rompe en React 19 al añadir nuevas features	Baja	Alto	Probar PoC por feature antes de integrar
Clipping section rompe bounding box	Media	Medio	Test de regresión geométrica
Viewpoints con capas no deterministas	Media	Medio	Serializar capa + selección + cámara juntos
Aislamiento deja nodos huérfanos	Baja	Medio	Test de integridad tras operación
Deriva de alcance	Media	Alto	Contrato cerrado; cambios requieren ADR
10. SECUENCIA DE EJECUCIÓN
text
Paso 1. PO aprueba este Contrato E5 Revisado.
Paso 2. Manus redacta ADRs 001/002/003/019.
Paso 3. Manus confirma regresión verde (§1.2).
Paso 4. Manus produce captura WebGL inicial (P1).
Paso 5. Manus implementa P2 (persistencia IndexedDB).
Paso 6. Manus implementa P3 (comparación lado a lado).
Paso 7. Manus implementa P4 (sincronización 2D/3D).
Paso 8. Manus implementa P5, P6, P7, P8, P9 (vistas técnicas y operaciones).
Paso 9. Manus implementa P10 (árbol con disciplina).
Paso 10. Manus ejecuta todo el bloque de pruebas + capturas.
Paso 11. Manus entrega E5_REPORT + E5_MANIFEST.
Paso 12. DeepSeek emite veredicto.
Paso 13. PO firma cierre.
Paso 14. Se abre E6.
Cada paso con APPROVE antes de avanzar al siguiente.

11. ENTREGABLES FORMALES DE E5
contracts/adr/ADR-001.md — Three.js + R3F + Drei.

contracts/adr/ADR-002.md — SceneModel.

contracts/adr/ADR-003.md — Identidad ArchiElementId + GlobalId.

contracts/adr/ADR-019.md — Captura WebGL.

shared/persistence/ — contratos y adaptador IndexedDB.

client/src/comparison/ — comparación lado a lado.

client/src/canvas/measure/ — medición y snapping.

client/src/canvas/viewpoints/ — viewpoints.

Extensiones aditivas a SceneModel3D.tsx.

Extensiones aditivas a arkiSceneModel.ts (árbol con disciplina).

scripts/test-persistence-idb.ts y siguientes.

scripts/capture-scene-model.ts.

evidence/E5_CAPTURAS/ — mínimo 8 PNG con hash.

E5_OUTPUTS.txt.

E5_MANIFEST.json.

E5_REPORT.md.

E5_SCOPE_LIMITS.md — declara P12 fuera de E5.

12. VEREDICTO ESPERADO
Si E5-Revisado cierra correctamente:

text
E5:           VERIFIED
E5-PREVIEW:   superseded by E5 VERIFIED
E6:           AUTORIZADO
Si E5-Revisado no cierra:

text
E5:           APPROVE WITH FIXES → iteración
o
E5:           DEFER → E5-PREVIEW vigente
E6:           BLOQUEADO
13. ACCIÓN SOLICITADA AL PRODUCT OWNER
text
[  ] Apruebo Contrato E5 Revisado v1.0.
[  ] Autorizo a Manus a ejecutar pasos 2–11.
[  ] Autorizo a DeepSeek a emitir veredicto final de E5.
[  ] Confirmo que E6 permanece bloqueado hasta cierre de E5.
14. DECLARACIÓN DE HONESTIDAD
El trabajo E5-PREVIEW se reconoce como base técnica válida.

Este contrato no reduce los criterios de E5 para facilitar el cierre.

Los 11 pendientes son criterios reales, no decorativos.

Si Manus no puede cerrar algún pendiente con evidencia, se declara DEFER explícito en ese punto, no se declara E5 completo.

La evidencia visual con hash es obligatoria, no opcional.

Fin del Contrato E5 Revisado v1.0.
Estado: PROPUESTO — requiere aprobación del Product Owner para ejecución.