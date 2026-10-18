# ARCHI — Orden Maestra Consolidada v3.1

> Documento recibido del nuevo chat de DeepSeek el 23 de septiembre de 2026. Versión operativa para cierre de Fase 0 y apertura de E1.

ARCHI — ORDEN MAESTRA CONSOLIDADA v3.1
Actualización tras Fase 0 real ejecutada por Manus
Fecha: 23 de septiembre de 2026
Autor: DeepSeek
Destinatarios: Product Owner + Manus
Base: Orden Maestra v3.0 (congelada) + Fase 0 real ejecutada
Estado: OPERATIVA PARA CIERRE DE FIXES Y APERTURA DE E1
Predecesor: v3.0 APPROVE AS CONTRACT DRAFT (congelada como borrador)

1. VEREDICTO DE CIERRE DE FASE 0
1.1. Aceptación del resultado de Manus
Acepto el veredicto APPROVE WITH FIXES de Manus para Fase 0 y lo incorporo como estado oficial del programa.

Confirmado por auditoría real:

Elemento	Estado
HEAD	c62183a5904f02aa0a935572454a5a35f9d167aa
Árbol	Cambios no committeados presentes (UI-3A, canvas, selección BIM, docs, contratos, evidencia, pruebas, addendas, paquete DeepSeek)
pnpm check	exit=0
pnpm build	exit=0
test-constructive	exit=0
test-serialization	exit=0
test-wall-coherence	exit=0
test-wall-door-canvas	exit=0
test-bim-selection	exit=0
Confirmado por prueba de muro y puerta:

Cuatro muros en el nivel 1.

Muro norte existente.

Puerta real door-1.

Abertura de 0.90 × 2.10 m.

Relación puerta ↔ muro norte.

Dibujo del muro con abertura.

Símbolo de puerta en canvas.

Conclusión: la cadena muro → abertura → puerta → relación → dibujo queda formalmente VERIFIED en dominio y en prueba. Sigue pendiente la captura visual del preview y el inspector poblado en UI.

1.2. Estado formal del programa
text
Orden Maestra v3.0:      APPROVE AS CONTRACT DRAFT
Fase 0:                  APPROVE WITH FIXES
E1:                      DEFER (bloqueado por fixes de Fase 0)
E2–E8:                   DEFER
Código nuevo adicional:  BLOQUEADO
Integraciones externas:  BLOCKED / FAIL-CLOSED
Regla vigente: sin cierre de fixes de Fase 0 + resolución de decisiones P0, no se abre E1.

2. FIXES OBLIGATORIOS DE FASE 0 (BLOQUEANTES DE E1)
Estos son los únicos 6 fixes que separan el programa de abrir E1. No son nuevos alcances; son cierres administrativos y de evidencia.

FIX-0.1 — Separar categorías de cambios en el árbol
Problema: el árbol mezcla cambios de producto, evidencia, contratos y traspaso.

Acción requerida (Manus):

Ejecutar git status --porcelain y clasificar cada archivo nuevo o modificado en:

Producto: shared/, client/src/, scripts/, package.json, tsconfig.json, vite.config.ts.

Contrato: contracts/, audits/, addenda/, orden-maestra/.

Evidencia: evidence/, capturas/, manifest/.

Traspaso: paquete DeepSeek, mensajes maestros, índices.

Producir FASE_0_CLASIFICACION_ARCHIVOS.md con la lista.

Recomendar qué va a commit, qué queda en staging, qué se ignora (gitignore).

Cierre: listado aprobado por PO.

FIX-0.2 — Captura visual del preview
Problema: el test pasa pero no hay evidencia visual de la cadena mínima.

Acción requerida (Manus):

Levantar preview (pnpm dev o equivalente).

Capturar 5 imágenes reales:

C1: cuadrado de 4 muros.

C2: puerta 0.90 × 2.10 en muro norte.

C3: muro seleccionado → Info Box con capas, acabados, metrado, costo.

C4: puerta seleccionada → dimensiones, material, costo, muro anfitrión.

C5: conteo visible de muros y puertas.

Guardar en evidence/F0_CAPTURAS/ con hashes.

Cierre: PO revisa y firma visualmente.

FIX-0.3 — Comparar ADR nuevos contra contratos existentes
Problema: ADR-001 a ADR-018 podrían duplicar contratos ya presentes.

Acción requerida (Manus):

Para cada ADR del v3.0, verificar si ya existe contrato en:

shared/arkiBimSelection.ts (identidad, selección).

shared/arkiContextPanel.ts (contexto).

shared/arkiDynamicFamilies.ts (familias).

shared/arkiParametricFamilies.ts (familias).

shared/arkiMamparaFamily.ts (familias).

shared/arkiPriceBook.ts (precio).

shared/arkiRecalculation.ts (recalculo).

shared/arkiTechnicalDossier.ts (expediente).

Contratos ProjectSnapshot, ConstructionModel, Muro, StructuralElement.

Resultado esperado: cada ADR pasa a:

ADR-NUEVO — sin contrato previo.

ADR-EXTENSIÓN — amplía contrato existente, con referencia.

Cierre: PO aprueba la reclasificación.

FIX-0.4 — Resolver decisiones P0
Problema: cinco decisiones bloquean arquitectura de E5–E7.

Acción requerida (PO): responder tabla §4 (abajo).

Cierre: las cinco decisiones marcadas como RESOLVED o DEFER EXPLÍCITO.

FIX-0.5 — Confirmar bloqueo de E2–E8
Acción requerida (Manus + PO):

Confirmar que no hay código nuevo de E2–E8 en el árbol.

Confirmar que no hay integraciones externas activas.

Confirmar que fail-closed sigue vigente.

Cierre: constancia escrita.

FIX-0.6 — Congelar baseline operativo
Acción requerida (Manus):

Registrar git rev-parse HEAD = c62183a....

Registrar hash SHA-256 de:

shared/ (todos los archivos).

client/src/ (todos los archivos).

package.json, pnpm-lock.yaml, tsconfig.json.

Guardar en evidence/F0_BASELINE_HASHES.txt.

Cierre: PO confirma hash de trabajo.

3. MEJORAS APLICADAS EN v3.1 (RESPECTO A v3.0)
Sin modificar alcance, la v3.1:

Incorpora Fase 0 como parte formal del programa (numerada F0, previa a E1).

Convierte la demostración de muro-puerta de "opcional" a VERIFIED en dominio (confirmada por Manus).

Formaliza ADR-NUEVO vs ADR-EXTENSIÓN como categoría obligatoria de reclasificación.

Establece el estado BLOCKED / FAIL-CLOSED como estado operativo explícito.

Redefine el bloqueador principal: del "repositorio no inspeccionado" al "fixes de Fase 0 + P0".

Reduce la lista de 18 decisiones a 5 P0 + 4 P1 + 4 P2 + 5 confirmaciones, para hacerla resoluble.

Introduce el concepto de "preview operativo": el preview debe estar reproducible con comandos exactos para que cualquier captura sea auditable.

Eleva la captura visual a artefacto con hash, no a nota de campo.

Inserta un checklist de cierre de E1 que toma los 6 fixes como precondición.

La v3.0 sigue congelada y consultable como borrador contractual. La v3.1 es la versión operativa hasta apertura de E1.

4. DECISIONES P0 — TABLA PARA EL PRODUCT OWNER
Estas decisiones desbloquean arquitectura. Sin respuesta, E5 no puede contratarse.

#	Decisión	Opciones	Recomendación	Impacto si no se resuelve
P0-1	Tecnología visor 3D	Three.js + R3F / Babylon.js / WebGPU	Three.js + R3F (React 19, ecosistema)	E5 bloqueado
P0-2	Persistencia real	Local-first IndexedDB / servidor propio / servicio externo	Local-first IndexedDB + adaptador servidor opcional	E6 bloqueado
P0-3	Parser IFC4	Propio / web-ifc / IfcOpenShell	web-ifc (gobernado, con reporte de pérdida)	E6 bloqueado
P0-4	Solver estructural	OpenSees / CalculiX / propio validado	OpenSees (mayor ecosistema, validación profesional)	E7 bloqueado
P0-5	Normativa MEP	País / norma / sectorial	Definir país base + alcance hospitalario	E7 bloqueado
Formato de respuesta sugerido:

text
P0-1: RESOLVED — Three.js + R3F
P0-2: RESOLVED — Local-first IndexedDB
P0-3: DEFER EXPLÍCITO — se evalúa en E5
...
5. DECISIONES P1 — INTEROPERABILIDAD
Bloquean E6 en adelante.

#	Decisión	Opciones	Recomendación
P1-1	Adaptador Revit	Autorizar RVT/RFA / FUTURE	FUTURE hasta IFC4 productivo
P1-2	DXF gobernado	Autorizar / FUTURE	FUTURE hasta IFC4 productivo
P1-3	Versionado de esquema	Migraciones automáticas / manuales con ADR	Manuales con ADR
P1-4	Gate de snapshot	Quién firma / qué datos / por disciplina	Definir en E4
6. DECISIONES P2 — ALCANCE
Bloquean E7–E8.

#	Decisión	Opciones
P2-1	Avatar ARKI	Contrato independiente / FUTURE
P2-2	Luka	Contrato independiente / FUTURE
P2-3	O-M	E8 dentro del alcance / fase posterior
P2-4	Costos contractuales	Catálogo PO / referencial
7. CONFIRMACIONES RÁPIDAS
#	Confirmación	Valor vigente
C-1	Paleta	#080736, blanco, amarillo, naranja, verde, cian
C-2	8 idiomas	es, en, pt, fr, de, it, zh, ja
C-3	Manus autorizado a inspeccionar	Sí
C-4	Protocolo desbloqueo temporal	Activo hasta cierre de E8
C-5	Congelamiento v3.0	Vigente
8. CHECKLIST DE APERTURA DE E1
E1 se abre únicamente cuando:

□ FIX-0.1 clasificación de archivos entregada y aprobada.
□ FIX-0.2 capturas C1–C5 entregadas con hash.
□ FIX-0.3 ADRs reclasificados (NUEVO / EXTENSIÓN).
□ FIX-0.4 P0-1 a P0-5 respondidas.
□ FIX-0.5 bloqueo E2–E8 y fail-closed confirmados por escrito.
□ FIX-0.6 baseline congelado con hashes.
□ PO firma apertura de E1.
Si algún ítem queda abierto, E1 permanece DEFER.

9. ORDEN DE IMPLEMENTACIÓN ACTUALIZADO
text
F0  Auditoría real                → APPROVE WITH FIXES
F0F Cierre de fixes F0            → en curso
E1  Contrato de producto          → DEFER hasta cierre F0F
E2  Wireflows y controles         → DEFER
E3  Inventario P2                 → DEFER
E4  Catálogos especializados      → DEFER
E5  Visor 3D + comparación        → DEFER (requiere P0-1)
E6  Persistencia + IFC4 + DXF     → DEFER (requiere P0-2, P0-3)
E7  Estructuras + MEP + 5D + 4D   → DEFER (requiere P0-4, P0-5)
E8  Expediente + O-M + Avatar     → DEFER
Regla: no se abre una fase sin APPROVE o APPROVE WITH FIXES de la anterior.

10. ENTREGABLES DOCUMENTALES
El paquete único consolidado queda:

ORDEN_MAESTRA_CONSOLIDADA_v3.1.md — este documento (operativo).

ORDEN_MAESTRA_CONSOLIDADA_v3.0.md — borrador congelado.

FASE_0_AUDITORIA_REAL_2026-09-23.md — informe Manus.

FASE_0_CLASIFICACION_ARCHIVOS.md — pendiente (FIX-0.1).

FASE_0_CAPTURAS/ — pendiente (FIX-0.2).

FASE_0_ADRS_RECLASIFICADOS.md — pendiente (FIX-0.3).

FASE_0_BASELINE_HASHES.txt — pendiente (FIX-0.6).

MATRIZ_COBERTURA_ARCHI_ARQUI_REVIT.md — E1.

INVENTARIO_COMPLETO_FAMILIAS_Y_DISCIPLINAS.md — E3.

CONTRATO_INTEROPERABILIDAD_ARCHI_IFC_REVIT_DXF.md — E6.

MATRIZ_CONTROLES_16_MODULOS_V2.md — E2.

MAPA_BRECHAS_IMPLEMENTADO_VS_FALTANTE.md — E1.

MATRIZ_MEJORAS_DIFERENCIALES_ARCHI.md — E1.

INFORME_DESBLOQUEO_TEMPORAL_ANTES_DURANTE_DESPUES.md — al cierre de E8.

11. RIESGOS VIGENTES
Riesgo	Estado	Mitigación
Apertura prematura de E1 sin fixes	Activo	Checklist §8
Deriva de alcance durante cierre F0	Activo	v3.1 congelada hasta apertura E1
Integraciones externas activadas por error	Activo	fail-closed + FIX-0.5
ADRs duplicando contratos existentes	Activo	FIX-0.3
Capturas no reproducibles	Activo	FIX-0.2 con hashes + comandos exactos
P0 no resueltas bloqueando E5–E7	Activo	Tabla §4
12. PRÓXIMO MENSAJE ESPERADO
Solicito al Product Owner y a Manus:

De Manus:

FASE_0_CLASIFICACION_ARCHIVOS.md.

Capturas C1–C5 con hashes.

FASE_0_ADRS_RECLASIFICADOS.md.

FASE_0_BASELINE_HASHES.txt.

Confirmación por escrito de bloqueo E2–E8 + fail-closed.

Del Product Owner:

Respuesta a P0-1 a P0-5.

Confirmación C-1 a C-5.

Firma de apertura de E1 cuando los fixes estén cerrados.

Con esos insumos, emito Orden Maestra v3.2 con E1 redactado como primer bloque ejecutable y cierro formalmente Fase 0.

13. REGLA FINAL VIGENTE
No se escribe código nuevo. No se aprueba capacidad no verificada. No se declara E2E VERIFIED. No se declara apto para construcción. No se activan integraciones externas.

Toda nueva conversación queda subordinada a:

Baseline c62183a + hash de trabajo.

Fixes F0 cerrados.

P0 resueltas.

Aprobación explícita del PO.

Fin de la Orden Maestra Consolidada v3.1.
Estado: OPERATIVA PARA CIERRE DE FASE 0 — E1 DEFERIDO.