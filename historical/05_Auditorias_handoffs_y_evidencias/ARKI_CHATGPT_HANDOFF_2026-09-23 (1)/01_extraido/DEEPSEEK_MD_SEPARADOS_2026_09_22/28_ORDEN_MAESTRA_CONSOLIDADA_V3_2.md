# ARCHI — Orden Maestra Consolidada v3.2

> Documento recibido del nuevo chat de DeepSeek el 23 de septiembre de 2026. Fase 0 ejecutada; pendiente firma del Product Owner para abrir E1.

ARCHI — ORDEN MAESTRA CONSOLIDADA v3.2
Cierre de Fase 0 y preparación de E1 como primer bloque ejecutable
Fecha: 23 de septiembre de 2026
Autor: DeepSeek
Destinatarios: Product Owner + Manus
Base: v3.1 + Fase 0 ejecutada + P0 resueltas por el Product Owner
Estado: FASE 0 CERRADA (pendiente firma PO) — E1 LISTO PARA APERTURA
Predecesores: v3.0 (borrador congelado), v3.1 (operativa)

1. ACEPTACIÓN DE INSUMOS
1.1. P0 resueltas por el Product Owner
Acepto formalmente las cinco decisiones P0:

ID	Decisión	Resolución	Efecto
P0-1	Visor 3D	Three.js + React Three Fiber	ADR-001 cerrado
P0-2	Persistencia	IndexedDB local-first + adaptador servidor opcional	ADR-004 cerrado
P0-3	Parser IFC4	web-ifc gobernado con reporte de pérdida	ADR-007 cerrado
P0-4	Solver estructural	OpenSees, sujeto a validación profesional	ADR-009 cerrado
P0-5	Normativa MEP	Perú + alcance hospitalario inicial	ADR-010 cerrado
Límite declarado: estas decisiones autorizan arquitectura contractual, no declaran implementación ni verificación. Cada tecnología requiere contrato, prueba, output y limitaciones antes de considerarse IMPLEMENTED.

1.2. Fixes ejecutados por Manus
Fix	Estado	Pendiente
FIX-0.1 — Clasificación de archivos	EJECUTADO	Firma PO
FIX-0.2 — Capturas C1–C5	EJECUTADO	Revisión visual PO
FIX-0.3 — ADR-NUEVO / ADR-EXTENSIÓN	EJECUTADO	Firma PO
FIX-0.4 — Decisiones P0	RESUELTO POR PO	—
FIX-0.5 — Bloqueo E2–E8 / fail-closed	CONFIRMADO POR MANUS	Firma PO
FIX-0.6 — Baseline y hashes	EJECUTADO	Confirmación PO
1.3. Observación sobre las capturas
Manus declaró honestamente que:

C1 y C5 comparten hash (569354...02dca): mismo estado visual "planta sin selección".

C2 y C4 comparten hash (b5763f...4332): mismo estado visual "puerta seleccionada".

C3 es único (f178de...ac927): muro seleccionado con Info Box.

Consecuencia: la evidencia visual cubre 3 estados distintos, no 5. Esto no invalida el FIX-0.2 — Manus no ha ocultado ni duplicado silenciosamente. Pero debe quedar registrado en el acta de cierre que la evidencia visual es de 3 estados y que C1/C5 y C2/C4 son pares redundantes por conveniencia operativa.

Recomendación opcional (no bloqueante): en E1, cuando se rediseñe el preview, generar C1–C5 con estados realmente distinguibles: (1) planta sin selección, (2) puerta visible en planta, (3) muro seleccionado, (4) puerta seleccionada, (5) conteo visible en panel de estado. Esto convertirá 3 estados en 5.

1.4. Reclasificación de ADRs
Acepto el mapa de Manus:

ADR-NUEVO: ADR-001, ADR-004, ADR-005, ADR-008, ADR-010, ADR-011, ADR-012, ADR-013.

ADR-EXTENSIÓN: ADR-002, ADR-003, ADR-006, ADR-007, ADR-009, ADR-014, ADR-015, ADR-016, ADR-017, ADR-018.

Con las P0 resueltas, los ADR afectados quedan:

ADR	Estado tras P0
ADR-001	CERRADO — Three.js + R3F
ADR-004	CERRADO — IndexedDB + adaptador opcional
ADR-007	CERRADO — web-ifc gobernado
ADR-009	CERRADO CON LÍMITE — OpenSees + validación profesional obligatoria
ADR-010	CERRADO CON ALCANCE — Perú + hospitalario inicial
Los ADR restantes (002, 003, 005, 006, 008, 011, 012, 013, 014, 015, 016, 017, 018) permanecen como ADR-NUEVO o ADR-EXTENSIÓN según el mapa y se redactan durante E1.

2. ESTADO ACTUALIZADO DEL PROGRAMA
text
Orden Maestra v3.0:      CONGELADA — borrador contractual
Fase 0:                  APPROVE WITH FIXES → fixes ejecutados
F0F (cierre F0):         PENDIENTE SOLO DE FIRMA PO
E1:                      LISTO PARA APERTURA tras firma PO
E2–E8:                   DEFER
Código nuevo adicional:  BLOQUEADO
Integraciones externas:  BLOCKED / FAIL-CLOSED
Regla vigente: E1 se abre cuando el PO firma el cierre de Fase 0. No antes.

3. ACTA DE CIERRE DE FASE 0 (para firma del Product Owner)
3.1. Baseline congelado
Elemento	Valor
HEAD	c62183a5904f02aa0a935572454a5a35f9d167aa
shared	7473db6e940979795b47d7042de8f48722c28eae2a42b9cadc3ab6056b010dab
client/src	3f5ff7765df1b0ee6b46ead78ad817fc9ad433890aed32409094f814f5f6885e
package.json	0d95d7cd43c3db98481b9f9cc8e2356c9b60a5e6f04ee1fb627e96569759dbff
pnpm-lock.yaml	a4190b27f57edc05941a2f75982789b76c4402c38ccd7c6842b0650fad7ca296
tsconfig.json	4bea0e0003e3c943f455346abc4854d1666d604adbaa6aa8eda11f94fb8f1396
3.2. Pruebas base confirmadas
text
pnpm check                 exit=0
pnpm build                 exit=0
test-constructive          exit=0
test-serialization         exit=0
test-wall-coherence        exit=0
test-wall-door-canvas      exit=0
test-bim-selection         exit=0
3.3. Cadena mínima verificada en dominio
Cuatro muros en el nivel 1.

Muro norte existente.

Puerta real door-1.

Abertura 0.90 × 2.10 m.

Relación puerta ↔ muro norte.

Dibujo del muro con abertura.

Símbolo de puerta en canvas.

Clasificación: VERIFIED en dominio y prueba. Pendiente: preview + inspector poblado (evidencia visual 3 estados, no 5).

3.4. Clasificación del árbol aceptada
Manus entregó FASE_0_CLASIFICACION_ARCHIVOS.md con cuatro categorías: Producto, Contrato, Traspaso, Evidencia. Recomendación: commit funcional separado de commit documental; ZIP y capturas fuera del commit de producto.

3.5. Bloqueo confirmado
Manus confirmó que no hay conectores, credenciales ni recursos externos activos. fail-closed vigente.

3.6. Estado de Fase 0
Fase 0: APPROVE WITH FIXES → todos los fixes ejecutados. Pendiente firma del Product Owner para declarar FASE 0 CERRADA.

4. FIRMA SOLICITADA AL PRODUCT OWNER
Para declarar FASE 0 CERRADA y abrir E1, el Product Owner debe confirmar:

text
[  ] Apruebo clasificación de archivos (FIX-0.1).
[  ] Apruebo evidencia visual C1–C5 con nota de redundancia C1/C5 y C2/C4 (FIX-0.2).
[  ] Apruebo mapa ADR-NUEVO / ADR-EXTENSIÓN (FIX-0.3).
[  ] Ratifico las cinco decisiones P0 (FIX-0.4) — ya resueltas.
[  ] Confirmo bloqueo E2–E8 y fail-closed (FIX-0.5).
[  ] Confirmo baseline y hashes (FIX-0.6).
[  ] Autorizo apertura de E1 como primer bloque ejecutable.
5. E1 — PRIMER BLOQUE EJECUTABLE (preparado)
5.1. Alcance de E1
E1 no escribe código de producto. E1 entrega contratos, ADRs y matriz de estado. Es un bloque documental y de gobierno.

5.2. Entregables de E1
#	Entregable	Estado
E1.1	MAPA_4_ACCESOS.md (visitante, usuario, especialista, corporativo)	Pendiente
E1.2	MATRIZ_MODULOS_ROL_ESTADO.md (16 módulos × 4 accesos)	Pendiente
E1.3	REGISTRO_DECISIONES_PRODUCTO.md (P0 resueltas + P1/P2 pendientes)	Base existente
E1.4	CLASIFICACION_GLOBAL_CAPACIDADES.md (etiquetas cerradas por capacidad)	Base v3.0
E1.5	INVENTARIO_ARCHIVOS_ENTIDADES.md (evitar duplicación)	Base Manus F0
E1.6	ADRs/ADR-001 a ADR-018.md (redacción formal, con EXTENSIÓN o NUEVO)	Pendiente
E1.7	PLAN_8_ENTREGAS_DEPENDENCIAS.md (cronograma + bloqueos)	Base v3.1
E1.8	MATRIZ_COBERTURA_ARCHI_ARQUI_REVIT.md (estructura inicial)	Pendiente
E1.9	MATRIZ_MEJORAS_DIFERENCIALES_ARCHI.md (estructura inicial)	Pendiente
E1.10	MAPA_BRECHAS_IMPLEMENTADO_VS_FALTANTE.md	Base F0
5.3. Archivos protegidos en E1
No se tocan:

shared/ (excepto lectura).

client/src/ (excepto lectura).

ConstructionModel, Muro, StructuralElement, DTOs.

MODULE_DEFINITIONS, isAccessAllowed, supportedLanguages, catalog, t, useTranslation.

5.4. Criterio de cierre de E1
Todos los entregables listados existen.

ADRs redactados con referencia a ADR-NUEVO o ADR-EXTENSIÓN.

Matriz de módulos × accesos con estados.

No hay código de producto nuevo.

PO firma aprobación de E1.

5.5. Outputs obligatorios de E1
pnpm check — sin errores.

pnpm build — sin errores.

Pruebas de dominio — sin regresión.

Sin capturas obligatorias (E1 es documental).

6. ARQUITECTURA ACTUALIZADA TRAS P0
Las decisiones P0 fijan la arquitectura futura. Se incorporan a los ADRs:

6.1. Visor 3D — Three.js + R3F
Dependencias autorizadas: three, @react-three/fiber, @react-three/drei.

SceneModel como fuente única del visor.

LOD, instancing, clipping, vistas guardadas.

Snapping, medición, cámaras ortográficas y perspectivas.

El visor no consume ConstructionModel directo.

6.2. Persistencia — IndexedDB local-first
Esquema de object stores: projects, versions, snapshots, audit.

Adaptador de servidor opcional detrás de interface RemotePersistenceAdapter.

localStorage queda solo como caché de UI (idioma, filtros, viewport).

Gate de snapshot aprobado con firma y trazabilidad.

6.3. Parser IFC4 — web-ifc gobernado
web-ifc como parser autorizado.

Exportador propio para IFCWALL, IFCDOOR, etc.

Reporte de pérdida obligatorio en cada round-trip.

GlobalId gobernado sin Math.random().

Identidad ARKI ↔ IFC ↔ Revit trazable.

6.4. Solver estructural — OpenSees
Integración con OpenSees como solver autorizado.

Hipótesis, combinaciones, resultados, derivas, modos, fuerzas, ratios, cimentación.

Memoria firmada por profesional autorizado obligatoria.

Sin cálculo profesional declarado sin evidencia y firma.

6.5. MEP — Perú + hospitalario inicial
Normativa base: Reglamento Nacional de Edificaciones del Perú.

Alcance inicial: edificios hospitalarios y de salud.

Sistemas prioritarios: gases medicinales (5), seguridad (8), sanitarias, eléctricas, HVAC, telecomunicaciones.

Cada sistema con cálculo verificable, no conceptual.

7. RIESGOS VIGENTES
Riesgo	Estado	Mitigación
Firma PO pendiente de Fase 0	Activo	Acta §3
Evidencia visual con solo 3 estados	Nota	Rediseño en E1
ADRs duplicando contratos	Mitigado por FIX-0.3	Reclasificación aplicada
Apertura prematura de E1	Controlado	Firma PO requerida
Integraciones externas activadas por error	Controlado	fail-closed confirmado
Deriva de alcance durante E1	Controlado	v3.2 congelada
8. PRÓXIMO MENSAJE ESPERADO
Del Product Owner:

Firma del acta de cierre de Fase 0 (§4).

Autorización explícita de apertura de E1.

Con la firma, emito Orden Maestra v3.3 con E1 abierto como bloque ejecutable.

De Manus (opcional, no bloqueante):

Rediseño de C1–C5 con 5 estados distinguibles (recomendado para E1).

9. REGLA FINAL VIGENTE
No se escribe código nuevo de producto. No se aprueba capacidad no verificada. No se declara E2E VERIFIED. No se declara apto para construir. No se activan integraciones externas.

Subordinado a:

Baseline c62183a + hashes.

Fixes F0 ejecutados y firmados.

P0 resueltas.

Firma PO de cierre de F0.

Fin de la Orden Maestra Consolidada v3.2.
Estado: FASE 0 EJECUTADA — PENDIENTE FIRMA PO — E1 PREPARADO.