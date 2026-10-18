# ARCHI — Orden Maestra Consolidada v3.0

> Documento recibido del nuevo chat de DeepSeek el 23 de septiembre de 2026. Propuesta de contrato marco; requiere auditoría real y aprobación del Product Owner.

ARCHI — ORDEN MAESTRA CONSOLIDADA v3.0
Programa único integrado: auditoría, cobertura, cuatro partes, ocho entregas, catálogo P2, mejoras diferenciales y protocolo de desbloqueo temporal
Versión: 3.0 — consolidada, mejorada y unificada
Fecha: 23 de septiembre de 2026
Autor: DeepSeek (Arquitecto de Solución)
Estado: PROPUESTA ÚNICA — REQUIERE APROBACIÓN DEL PRODUCT OWNER
Baseline declarado: c62183a (checkpoint UI-3A)
Árbol de trabajo: puede contener cambios no committeados — INSPECCIÓN OBLIGATORIA
Documentos integrados: mensaje maestro, resumen histórico, estado real, Addenda E v2, controles 16 módulos, flujo de trabajo, roadmap, contrato UI-3A, propuesta Planta SVG, protocolo de desbloqueo temporal, adendas corporativas A y B, contrato UI BIM, contrato de diseño UI.

VEREDICTO DE AUDITORÍA
Estado: AUDITORÍA DOCUMENTAL COMPLETA — REPOSITORIO REAL NO INSPECCIONADO DIRECTAMENTE.

Conclusión:
Archi es un prototipo paramétrico avanzado con base técnica sólida en shared/, UI-1/UI-2/UI-3A documentadas, exportación IFC conceptual, persistencia local y comparación numérica. No existe evidencia documental de visor 3D real, comparación visual lado a lado, persistencia de servidor, snapshots aprobados, parser IFC4, DXF gobernado, cálculo estructural profesional, MEP profesional, O-M operativo, Avatar ni Luka.

Limitación declarada:
Toda clasificación es documental. Debe verificarse contra el código real antes de autorizar cualquier entrega.

Veredicto: PRODUCT OWNER DECISION REQUIRED para:

Autorizar la Fase 0 (auditoría real del repositorio).

Aprobar esta Orden Maestra Consolidada v3.0 como contrato marco único.

Resolver las 18 decisiones abiertas listadas al final.

PARTE 0 — REGLA FUNDAMENTAL Y CLASIFICACIÓN DE ESTADOS
0.1. Regla central
No se promueve un estado sin código real, prueba ejecutable y output real.

Toda capacidad debe clasificarse con una sola etiqueta de esta lista cerrada:

Etiqueta	Significado
IMPLEMENTED	Existe código y funciona, sin prueba E2E
VERIFIED	Código + prueba ejecutable + output real
E2E VERIFIED	Desde UI hasta dominio, persistencia o exportación
PARTIAL	Existe parte funcional, con brechas visibles
CONCEPTUAL	Modelo o diseño sin implementación completa
CATALOGED	Definido en catálogo, sin implementación
SCHEMA_DEFINED	Contrato de datos, sin motor
NOT IMPLEMENTED	No existe
FUTURE	Registrado y decidido como futuro
BLOCKED	Depende de recurso externo no disponible
PRODUCT OWNER DECISION REQUIRED	Pendiente de decisión
0.2. Prohibiciones estrictas
No se puede:

Presentar un SVG como Three.js.

Presentar localStorage como sesión real.

Presentar IFC conceptual como IFC profesional.

Presentar predimensionamiento como memoria de cálculo estructural.

Presentar programación conceptual como cálculo MEP profesional.

Presentar comparación de métricas como comparación visual.

Presentar un mock como integración productiva.

Declarar “aprobado para construir” sin gate profesional completo.

Usar Math.random(), Date.now() ni any nuevos en archivos críticos sin ADR.

Borrar o reemplazar shared/ sin ADR y migración.

Mezclar UI, motor BIM, persistencia, IFC y Avatar en una sola entrega.

PARTE 1 — AUDITORÍA DEL ESTADO REAL Y BASELINE
1.1. Baseline obligatorio
Checkpoint canónico: c62183a

Manus debe ejecutar y registrar:

git status

git log --oneline -10

git diff c62183a --stat

git rev-parse HEAD

hash SHA-256 de archivos críticos de shared/

El hash exacto del árbol de trabajo debe quedar registrado antes de tocar cualquier archivo.

1.2. Matriz de estado por capacidad (documental)
Capacidad	Estado	Evidencia declarada	Brecha principal
Generador paramétrico base	VERIFIED	scripts/test-constructive.ts (16 muros, 16 espacios, 72 columnas, 16 vigas, 4 losas, 72 cimentaciones, 4 escaleras, 1 cubierta, 4 particiones, 16 puertas, 320 ventanas, 464 relaciones, S/ 4,672,910, 93 días)	Confirmar vigencia
Serialización Muro / ConstructionModel	VERIFIED	test-serialization.ts, test-wall-coherence.ts	Regresión
Familias mamparas	VERIFIED	Recalculación completa	Confirmar
Puerta hospedada en muro	VERIFIED en dominio	Muro.aberturas, door-1, scripts/test-wall-door-canvas.ts	Evidencia visual pendiente
Capas y acabados de muro	VERIFIED en dominio	Muro.capas, Muro.acabados	Confirmar
Metrados / APU conceptual	VERIFIED	Pruebas constructivas	No es catálogo contractual
4D conceptual	VERIFIED	ConstructionModel.schedule	No es planificación profesional
UI-1 y gateway	VERIFIED documentalmente	Contratos previos	Regresión
UI-2 y shell	VERIFIED documentalmente	Contrato UI BIM	Regresión
UI-3A	VERIFIED documentalmente	ContextPanel + CanvasPlanView + InfoBoxPanel + selección BIM	Verificar implementación real
Selección BIM	VERIFIED en contrato	arkiBimSelection.ts, test-bim-selection.ts	Verificar
Ocho idiomas	IMPLEMENTED documentalmente	es, en, pt, fr, de, it, zh, ja	Cobertura y persistencia
Comparación numérica	IMPLEMENTED	compareDynamicBuildings()	No es comparación visual
localStorage	IMPLEMENTED local	Guarda propuestas	No es persistencia real
IFC conceptual	IMPLEMENTED conceptual	exportConstructionIfc(), conceptualGeometryOnly: true	No es IFC4 productivo
Visor ProfessionalFamilyViewer.tsx	CONCEPTUAL	SVG	No es visor 3D
CanvasPlanView	CONCEPTUAL/PARTIAL	SVG 2D semántico	No es 3D navegable
Propuesta Planta SVG	ESPECIFICACIÓN RECIBIDA	Documento 09 (Vue)	Migrar a React/TS
Propuesta Corte SVG	ESPECIFICACIÓN RECIBIDA	Documento 09 (Vue)	Migrar a React/TS
Comparación visual propuestas	NOT IMPLEMENTED	—	Contrato
Comparación visual plantas	NOT IMPLEMENTED	—	Contrato
Persistencia real servidor	NOT IMPLEMENTED	—	Contrato
Snapshots aprobados	NOT IMPLEMENTED	—	Contrato
DSL familias ampliado	PARTIAL	Solo mamparas verificadas	Puertas, ventanas, columnas, vigas, losas, escaleras, cubiertas, mobiliario, MEP
Importación / exportación familias	NOT IMPLEMENTED	—	Adaptador gobernado
Parser IFC4	NOT IMPLEMENTED	—	Parser + round-trip
DXF gobernado	NOT IMPLEMENTED	—	Adaptador autorizado
Cálculo estructural profesional	NOT IMPLEMENTED	Predimensionamiento	Solver verificable
MEP profesional	NOT IMPLEMENTED	Parámetros conceptuales	Cálculo real
O-M	CONCEPTUAL	Módulo listado	Activos, garantías, mantenimiento
Avatar ARKI	FUTURE	—	GLB/glTF, rig, gestos, visión, OCR, AR
Luka	FUTURE	—	Visión/OCR propio
16 módulos	PARTIAL	Taxonomía + matriz de controles	Controles y pruebas
Clashes profesionales	CONCEPTUAL	Registros	Detección espacial real, BCF
PARTE 2 — ARQUITECTURA, CONTRATOS Y ADRs
2.1. Principios arquitectónicos
shared/ protegido. No se borra, no se reemplaza sin ADR-014 y migración.

Nuevas capas alrededor del dominio existente:

shared/scene/ — modelo intermedio de escena (SceneModel).

shared/adapters/ — IFC, DXF, Revit, familias externas.

shared/persistence/ — sesiones, proyectos, versiones, snapshots.

shared/families/ — DSL ampliado.

shared/structural/ — modelo estructural y solver.

shared/mep/ — modelo MEP.

shared/vision/ — visión y OCR (Luka).

Identidad única de elemento: ArchiElementId estable + GlobalId IFC gobernado, generado sin Math.random() ni Date.now().

El visor 3D consume SceneModel, no ConstructionModel directamente.

Persistencia real: backend local-first (IndexedDB + opción servidor) según decisión del PO. localStorage = fallback.

UI sin duplicación: ningún tipo nuevo que replique Muro, ConstructionModel, GeneratedBuilding, ProjectSnapshot, PriceBook o TechnicalDossier.

2.2. Diagrama de capas
text
[UI React] → [SceneModel] → [Visor 2D/3D]
     ↓
[Adaptadores] ← [shared/ dominio] → [Persistencia]
     ↓                ↓
[IFC] [DXF] [Revit]  [ConstructionModel]
2.3. Contratos de datos clave
SceneModel
typescript
interface SceneModel {
  id: string;
  sourceModelId: string;
  units: 'm' | 'mm';
  coordinateSystem: 'local' | 'global';
  northAngle: number;
  levels: SceneLevel[];
  zones: SceneZone[];
  disciplines: SceneDiscipline[];
  categories: SceneCategory[];
  nodes: SceneNode[];
  materials: SceneMaterial[];
  metadata: SceneMetadata;
}
interface SceneNode {
  id: string;            // ArchiElementId
  globalId: string;      // IFC GlobalId gobernado
  type: 'wall' | 'door' | 'window' | 'column' | 'beam' | 'slab' | 'footing' | 'stair' | 'roof' | 'space' | 'furniture' | 'mep';
  geometry: SceneGeometry;
  transform: Matrix4;
  levelId: string;
  zoneId?: string;
  disciplineId: string;
  categoryId: string;
  materialIds: string[];
  properties: Record<string, unknown>;
  parentId?: string;
}
Persistencia
typescript
interface Session { id; userId; projectId; createdAt; lastAccessAt; permissions: Permission[]; }
interface Project { id; name; ownerId; versions: Version[]; currentVersionId; }
interface Version { id; projectId; number; createdAt; createdBy; parentVersionId?; modelHash; status: 'draft'|'review'|'approved'|'frozen'|'archived'; snapshotId?; }
interface Snapshot { id; versionId; approvedBy?; approvedAt?; frozenAt?; signature?; auditTrail: AuditEntry[]; gateStatus: 'pending'|'passed'|'failed'; }
Familias
typescript
interface FamilyDefinition {
  id; name; category;
  parameters: ParameterDefinition[];
  constraints: Constraint[];
  materials: MaterialRule[];
  quantityRules: QuantityRule[];
  costRules: CostRule[];
  scheduleRules: ScheduleRule[];
  hostRules: HostRule[];
  levelRules: LevelRule;
  phaseRules: PhaseRule;
  exportRules: ExportRule[];
}
IFC4
typescript
interface IFCModel {
  header; entities: IFCEntity[]; spatialStructure; relationships;
  propertySets; materials;
  globalIds: Map<string,string>; // ArchiElementId ↔ IFC GlobalId
  lossReport: IFCLossReport;
}
Estructuras y MEP
typescript
interface StructuralModel { combinations; solver; results; drift; modes; forces; ratios; foundation; report; }
interface MEPModel { systems; networks; flows; diameters; losses; panels; coordination; }
2.4. ADRs necesarios
ADR	Título	Decisión
ADR-001	Tecnología visor 3D	Three.js + R3F (recomendado) vs Babylon.js vs WebGPU
ADR-002	Modelo intermedio de escena	SceneModel derivado de ConstructionModel
ADR-003	Identidad de elemento	ArchiElementId + GlobalId IFC gobernado
ADR-004	Persistencia real	Local-first / servidor / servicio externo
ADR-005	Snapshots aprobados	Gate: datos + revisión + trazabilidad + firma
ADR-006	DSL de familias	Extender sin romper mamparas
ADR-007	IFC4 parser/exporter	Propio vs librería gobernada (web-ifc / IfcOpenShell)
ADR-008	DXF gobernado	Solo con adaptador autorizado
ADR-009	Solver estructural	OpenSees / CalculiX / propio validado
ADR-010	Coordinación MEP	Normativa aplicable
ADR-011	Avatar ARKI	GLB/glTF, rig, gestos, visión, OCR, AR
ADR-012	Luka	Agente de visión/OCR separado
ADR-013	Compatibilidad Revit	Adaptador gobernado
ADR-014	Migración shared/	Estrategia incremental
ADR-015	Planta/Corte SVG	Migrar propuesta Vue → React/TS
ADR-016	Gate de no emisión	Regla de no declarar apto sin evidencia
ADR-017	Desbloqueo temporal	Protocolo y rebloqueo fail-closed
ADR-018	Home.tsx → Shell BIM	Transición y convivencia
PARTE 3 — CATÁLOGO CORPORATIVO P2 COMPLETO
3.1. 18 disciplinas o dominios
Arquitectura y espacios.

Estructuras de concreto armado.

Estructuras metálicas.

Cimentaciones y geotecnia.

Sanitarias y agua fría.

Agua caliente sanitaria.

Aguas residuales y drenaje.

Drenaje pluvial.

Electricidad de baja tensión.

Media tensión y subestaciones.

Iluminación normal y de emergencia.

HVAC y climatización.

Protección contra incendios.

Telecomunicaciones y datos.

Wi-Fi, racks y redes activas.

Seguridad electrónica, CCTV y control de acceso.

Gases medicinales y sistemas hospitalarios.

Equipamiento, mobiliario, operación y mantenimiento.

3.2. 8 tipologías de escalera
Recta.

Dos tramos.

Tres tramos.

L.

U.

Caracol.

Compensada.

Rampa + escalera accesible combinada.

Cada tipología define: ancho, huella, contrahuella, descanso, pendiente, barandas, material, sentido, nivel, reglas de evacuación, estado de revisión.

3.3. 7 tipos de ascensor
Pasajeros.

Camillero.

Carga.

Servicio.

Panorámico.

Contra incendio o rescate.

Montacargas especializado.

Cada tipo define: capacidad, dimensiones, recorrido, puertas, cuarto de máquinas / sistema equivalente, foso, sobre recorrido, alimentación, seguridad, mantenimiento, relación con núcleo BIM.

3.4. 5 gases medicinales
Oxígeno.

Vacío.

Aire medicinal.

Óxido nitroso.

Nitrógeno.

Cada sistema define: fuente, red, presión, puntos terminales, alarmas, sectorización, redundancia, mantenimiento, riesgos, reglas de coordinación.

3.5. 8 sistemas de seguridad
CCTV.

Control de acceso.

Detección de intrusión.

Detección y alarma contra incendios.

Megafonía y evacuación por voz.

Videoportero e intercomunicación.

Botón de pánico y asistencia.

Integración con centro de monitoreo.

Cada sistema relaciona: ubicación, cobertura, alimentación, canalización, red, rack, dispositivo, zona, evento, mantenimiento, permisos, reporte.

3.6. Matriz de especialistas y revisión
Rol	Propone	Revisa	Aprueba	Evidencia exigida
Arquitectura	Sí	Sí	Sí	Planos, especificaciones, memoria
Estructuras	Sí	Sí	Sí	Solver, memoria, planos, armado
Sanitarias	Sí	Sí	Sí	Redes, cálculo, planos
Electricidad	Sí	Sí	Sí	Redes, tableros, cálculo
HVAC	Sí	Sí	Sí	Redes, caudales, cálculo
Incendio	Sí	Sí	Sí	Redes, rociadores, cálculo
Gases medicinales	Sí	Sí	Sí	Redes, presiones, alarmas
Telecomunicaciones	Sí	Sí	Sí	Racks, puntos, redes
Seguridad electrónica	Sí	Sí	Sí	Cámaras, accesos, sensores
Costos	Sí	Sí	Sí	APU, catálogo, conciliación
Planificación	Sí	Sí	Sí	Cronograma, ruta crítica
Expediente	Sí	Sí	Sí	Documentos, versiones
Mantenimiento	Sí	Sí	Sí	Activos, garantías
PARTE 4 — LAS OCHO ENTREGAS
Distribución en cuatro partes
PARTE I — Gobierno, accesos, arquitectura, wireflows. → E1, E2

PARTE II — Catálogo P2, disciplinas, familias, especialistas. → E3, E4

PARTE III — Modelo BIM, visor, comparación, persistencia, interoperabilidad. → E5, E6

PARTE IV — Estructuras, MEP, costos, 4D, expediente, O-M, Avatar, gate final. → E7, E8

E1 — Contrato de producto, ADRs y estado real
Objetivo: auditar el repositorio, congelar el estado real, emitir ADRs base y clasificar cada capacidad.

Artefactos obligatorios:

ADR-018 Home.tsx → Shell BIM (transición y convivencia).

ADR-014 protección de shared/ y migración.

Mapa de 4 accesos: visitante, usuario, especialista, corporativo.

Matriz de módulos por rol, capacidad, estado y restricciones.

Registro de decisiones de producto.

Clasificación global por estado (etiquetas cerradas).

Inventario de archivos y entidades existentes.

Plan de ocho entregas y dependencias.

Cierre E1: no se toca UI estructural ni se eliminan entidades canónicas hasta aprobación.

E2 — Wireflows, controles y pruebas de gobierno
Objetivo: convertir el flujo de trabajo en wireflows verificables para los 16 módulos y los 4 accesos.

Para cada módulo:

Estado de entrada.

Acciones disponibles.

Panel izquierdo (contexto).

Canvas central.

Inspector derecho (Info Box).

Botones, atajos, permisos, estados vacíos.

Datos que consume y produce.

Reglas de trazabilidad.

Mensajes de advertencia.

Condiciones de bloqueo.

Pruebas de montaje y comportamiento.

Controles transversales: selección, edición, filtros, niveles, disciplinas, fases, visibilidad, medición, revisión, aprobación, exportación, ayuda contextual, idioma, accesibilidad.

Cierre E2: matriz de controles y pruebas para los 16 módulos. Ningún módulo se cierra por tarjeta visual.

E3 — Inventario corporativo P2 (18 disciplinas y familias)
Objetivo: definir el catálogo completo como datos gobernados, sin reducir complejidad.

Cada familia con: identidad estable, tipo, parámetros, unidades, materiales, restricciones, host, nivel, fase, especialidad, reglas de cantidad, costo, plazo, relaciones, destino de exportación.

Cierre E3: inventario único sin duplicación. Separar lo existente en shared/, lo que se amplía y lo futuro.

E4 — Catálogos especializados P2 y especialistas
Objetivo: completar 8 escaleras, 7 ascensores, 5 gases medicinales, 8 sistemas de seguridad y matriz de especialistas.

Cierre E4: catálogos completos como datos gobernados. No se declaran implementados por estar enumerados.

E5 — Visor BIM 3D, modelo semántico y comparación
Objetivo: visor 3D real, comparación visual lado a lado.

Debe definir:

Tecnología de escena (ADR-001).

Árbol proyecto / edificio / nivel / disciplina / sistema / categoría.

Zonas, espacios, capas, visibilidad.

Selección individual y múltiple.

Ocultar, aislar, congelar, transparencia.

Cámaras ortográficas y perspectivas.

Axonometría, planta, corte, elevación.

Secciones dinámicas, clipping box.

Medición distancia, área, volumen, perímetro.

Snap a vértices, ejes, caras, elementos.

Coordenadas, unidades, norte, niveles.

Viewpoints guardados.

Identidad común 2D/3D/IFC/Revit.

Comparación lado a lado con estados: nuevo, modificado, eliminado, sin cambios, pendiente de revisión.

Comparación de plantas 2D sincronizada.

Cierre E5: escena 3D real, selección verificable, filtros funcionales, pruebas de comparación. SVG conceptual no satisface el cierre.

E6 — Persistencia real, snapshots y exportación gobernada
Persistencia:

Organización, usuarios, roles, sesiones.

Proyectos, versiones, snapshots.

Aprobaciones, congelamiento, restauración.

Auditoría, historial por elemento.

Migraciones de esquema.

Exportación y recuperación.

Interoperabilidad:

Parser IFC4, exportación IFC4 semántica.

GlobalId, identidad ARKI, relación ARKI/IFC/Revit.

Propiedades, materiales, cantidades, relaciones espaciales.

BRep, CSG, swept solids, mallas trianguladas.

Round-trip ARKI → IFC → ARKI e IFC → ARKI → IFC.

Reporte de pérdida, degradación, no convertidos.

DXF únicamente con adaptador gobernado y pruebas reales.

Cierre E6: persistencia real verificable, snapshots con estados de aprobación, auditoría, exportación gobernada. Un botón de descarga IFC conceptual no satisface el cierre.

E7 — Estructuras, MEP, costos, 4D y coordinación
Estructuras: ubicación, suelo, cargas, materiales, sistema estructural, combinaciones, solver externo autorizado, reacciones, desplazamientos, derivas, periodos, modos, fuerzas internas, ratios, cimentaciones, armados, hipótesis, unidades, reglamento, evidencia de ejecución.

MEP: redes 3D, demanda, caudales, presiones, diámetros, pérdidas, bombas, tanques, agua caliente, drenaje, electricidad, tableros, cortocircuito, caída de tensión, HVAC, incendio, gases medicinales, telecomunicaciones, Wi-Fi, racks, cámaras, coordinación con arquitectura y estructura.

Coordinación: clashes duros, blandos, mantenimiento, circulación, normativa, constructivos, operativos. Cada incidencia con elemento, ubicación, responsable, fecha, estado, comentario, evidencia, decisión, cierre.

5D y 4D: conciliar cantidades, partidas, precios, cotizaciones, gastos, contratos, avance, calendario, ruta crítica, secuencia, cambios, desviaciones.

Cierre E7: estado explícito separando programación conceptual / predimensionamiento / cálculo profesional. Informes con hipótesis, fuentes, evidencia.

E8 — Expediente, operación, mantenimiento, Avatar y gate final
Expediente: planos, cortes, detalles, metrados, presupuesto, especificaciones, memoria, reportes, control de revisiones, incidencias, responsables, trazabilidad.

Operación y mantenimiento: activos, garantías, manuales, inspecciones, órdenes de trabajo, repuestos, responsables, vida útil, historial, costos, relación con elemento BIM.

Avatar Archi: contrato de datos, GLB/glTF, rig, animaciones, gestos, expresiones, tres tamaños (botón circular / mediano / semigrande), guía contextual, visión, OCR, lectura de planos, AR. No bloquea trabajo, no inventa conclusiones, muestra fuentes, deriva decisiones.

Luka: agente de visión/OCR separado, con contrato propio, modelo, límites, pruebas, verificación.

Gate final:

Archi nunca muestra “aprobado para construir” por acción de IA. Requiere:

Datos completos.

Modelo arquitectónico aprobado.

Modelo estructural calculado.

Modelos MEP calculados.

Clashes críticos resueltos.

Normativa verificada.

Metrados conciliados.

Costos sustentados.

Planos coordinados.

Memorias y especificaciones.

Revisión independiente.

Firma o credencial profesional cuando corresponda.

Snapshot aprobado y congelado.

Si falta algo:

NO APTO PARA CONSTRUCCIÓN — PROPUESTA CONCEPTUAL O PROYECTO EN REVISIÓN

Cierre E8: gate de proyecto, expediente trazable, módulo O-M y contrato verificable Avatar/Luka. La implementación completa del Avatar puede tener fase propia posterior, pero no puede desaparecer del alcance.

PARTE 5 — REGLAS DE LAS OCHO ENTREGAS
Cada entrega debe incluir:

Alcance cerrado.

Archivos permitidos.

Archivos protegidos.

ADRs aplicables.

Contratos de datos.

Pruebas unitarias o de dominio.

Pruebas de integración.

Prueba de regresión.

pnpm check.

pnpm build.

Outputs reales.

Capturas cuando exista UI.

Manifest y hashes.

Limitaciones declaradas.

Veredicto independiente.

No se avanza de una entrega a la siguiente sin APPROVE o APPROVE WITH FIXES.

PARTE 6 — PROTOCOLO DE DESBLOQUEO TEMPORAL Y REBLOQUEO
6.1. Autorización
El Product Owner autoriza un ciclo temporal para implementar y verificar componentes bloqueados, sin inventar recursos externos, restaurando fail-closed al finalizar.

6.2. Componentes cubiertos
Componente	Implementación temporal	Estado final obligatorio
Core remoto canónico	Cliente, contrato, health-check, autenticación explícita, errores tipados	Bloqueado si faltan URL/token; sin fallback silencioso
Hosts Revit/Dynamo/Rhino/Grasshopper/Blender	Interfaces, jobs, colas, aislamiento, manifests, fixtures mock	Real solo con host autorizado
RVT/DGN/ghx/dyn	Adaptadores, reportes de cobertura/pérdida	Bloqueado sin software y archivos reales
IFC round-trip	Contrato, parser/adaptador, fixtures, loss report	Productivo solo con modelos reales validados
Estructuras/MEP/firma	Modelos preliminares, contrato de solver	Bloqueado sin solver y profesional autorizado
WebXR	Detección de soporte, fallback, pruebas simuladas	Físico solo con Android/iPhone reales
Transcripción	Contrato de proveedor, estados, fallback visible	Productivo solo con proveedor configurado
WebRTC pairing	QR, signaling, expiración, estados	Real solo con servidor y dos dispositivos
ARKI-TV/LUKA-TV	Pipeline local, borrador, moderación, autorización	Publicación live bloqueada
Investigación web diaria	Lease, autorización, auditoría	Desactivada hasta orden explícita
Marketplace/terceros	Manifest, sandbox, permisos, logs	Bloqueado hasta pentest y revisión humana
8K/16K	Perfiles, límites, jobs, reporte de upscale	Nativo solo con worker probado
Enterprise/Cloud Computer	Contrato de despliegue, health-check	Pendiente hasta entorno real
6.3. Secuencia
Registrar ADRs, archivos protegidos, recursos disponibles.

Implementar localmente contratos, adaptadores, mocks deterministas, fixtures, pruebas.

Ejecutar recursos externos solo si existen y están autorizados.

Ejecutar pnpm check, pnpm build, dominio, integración, regresión, seguridad, outputs, capturas.

Revocar flags temporales, retirar secretos de logs, cerrar endpoints, apagar publicación, restaurar fail-closed.

Emitir informe antes / durante / después por componente.

6.4. Prohibiciones
No inventar URL, token, host, proveedor, firma, modelo, dispositivo o resultado profesional. No presentar mock, SVG, toast ni descarga conceptual como integración profesional. No publicar automáticamente. No declarar cálculo estructural, MEP o firma profesional sin solver y profesional autorizado.

6.5. Cierre del ciclo
Termina únicamente cuando lo local está implementado y probado, las integraciones externas están verificadas o explícitamente bloqueadas, y el sistema vuelve a operar en fail-closed.

PARTE 7 — MATRIZ DE COBERTURA ARCHI / ARQUI / REVIT
Debe entregarse como documento único MATRIZ_COBERTURA_ARCHI_ARQUI_REVIT.md con una fila por capacidad:

Campo	Contenido
Capacidad	Nombre claro
Dominio	Arquitectura, estructura, MEP, documentación, colaboración…
Estado Archi	Etiqueta cerrada
Evidencia	Archivo, función, prueba, output
Brecha	Qué falta exactamente
Estrategia	Nativo / adaptador / importación / exportación / futuro
Entrega	E1–E8
ADR	Decisión técnica requerida
Prueba de aceptación	Cómo se demuestra
Riesgo	Bajo / medio / alto / crítico
7.1. Cobertura obligatoria por dominio
Gestión de proyecto y datos: proyectos, organizaciones, usuarios, roles, permisos, sesiones, unidades, plantillas, estándares, ubicaciones, fases, revisiones, versiones, snapshots, auditoría, aprobación, navegador de proyecto, búsqueda, filtros, favoritos, recientes, dependencias, trazabilidad.

Modelado arquitectónico: muros, muros apilados, muros cortina, capas, materiales, acabados, tarrajeos, imprimantes, pinturas, revestimientos, pisos, cielos rasos, cubiertas, losas, techos, masas, vacíos, aperturas, shafts, huecos, componentes, columnas arquitectónicas, habitaciones, espacios, zonas, áreas, superficies, topografía, emplazamiento, caminos, estacionamientos, paisajismo, mobiliario.

Familias paramétricas: definición, tipos, subtipos, parámetros de instancia y tipo, compartidos, calculados, restricciones, referencias, host, nivel, fase, materiales, reglas de cantidad/costo/calendario/mantenimiento/exportación, versionado, migración, dependencias, catálogo, vista previa, importación, exportación.

Estructural: ejes, retículas, niveles, columnas, vigas, cerchas, arriostres, placas, muros estructurales, losas, cimentaciones, zapatas, pilotes, vigas de cimentación, conexiones, acero, armaduras, detalles, materiales, cargas, combinaciones, modelo analítico, vínculos, apoyos, restricciones, resultados.

MEP y sistemas técnicos: agua fría, agua caliente, residuales, pluvial, ventilación sanitaria, bombeo, cisternas, tanques, tratamiento, redes eléctricas, tableros, circuitos, iluminación, emergencia, puesta a tierra, media y baja tensión, generadores, UPS, canalizaciones, bandejas, telecomunicaciones, datos, Wi-Fi, routers, racks, CCTV, control de acceso, intrusión, incendio, megafonía, HVAC, conductos, tuberías, refrigeración, condensados, automatización, presiones diferenciales, mantenimiento, 5 gases medicinales.

Seguridad y baja tensión: 8 sistemas corporativos, cada uno relacionado con ubicación, cobertura, alimentación, canalización, red, rack, dispositivo, zona, evento, mantenimiento, permisos, reporte.

Documentación 2D y expediente: vistas (planta, techo, cielo raso, estructura, MEP, corte, elevación, axonometría, perspectiva, detalle, llamada, leyenda, esquema, diagrama, coordinación), plantillas, escalas, niveles de detalle, estilos visuales, filtros, fases, subyacencias, rangos, regiones, recortes, cajas de sección, anotaciones, cotas, textos, etiquetas, símbolos, marcas, notas clave, leyendas, grillas, ejes, norte, escala gráfica, tablas, cuadros, habitaciones, puertas, ventanas, áreas, materiales, equipos, hojas, láminas, cajetines, revisiones, nubes, numeración, impresión, PDF, SVG, PNG, listados, CSV, reportes.

Cuantificación, costos, planificación: tablas, metrados por elemento/material/capa/sistema/zona/fase/disciplina, conciliación, unidades, fórmulas, filtros, agrupación, redondeo, partidas, precios, cotizaciones, presupuesto, gastos, contratos, valorizaciones, avances, cronograma, ruta crítica, recursos, productividad, secuencia, control de cambios.

Coordinación y revisión: vínculos, federación, clashes duros/blandos/mantenimiento/circulación/normativa/constructivos/operativos, incidencias BCF o equivalente, comentarios, capturas, viewpoints, responsable, fecha, prioridad, estado, decisión, evidencia, aprobación, cierre.

Interoperabilidad: IFC4, IFC4x3, DXF, DWG, PDF, SVG, PNG, CSV, Excel, OBJ, glTF, GLB, SKP, DGN, RVT, RFA, RTE, RFT, nubes de puntos, gbXML. Para cada formato: lectura, escritura, entidades, propiedades, materiales, cantidades, relaciones, identidad, pérdida, pruebas reales.

Visualización, render y análisis: visor 2D, visor 3D, alámbrico, sombreado, materiales, texturas, iluminación, render, perspectivas, ortografía, secciones, clipping, selección, transparencia, LOD, instancing, rendimiento, medición, anotación, sombras, norte, coordenadas, viewpoints.

Reglas, fases, opciones, estándares: fases, demolición, existente, nuevo, construcción, operación, opciones de diseño, variantes, alternativas, módulos, grupos, assemblies, sistemas, plantillas, estándares de nombres, unidades, materiales, clasificaciones, códigos, normativa, restricciones, reglas, gates.

Operación, mantenimiento, Avatar: activos, ubicación, fabricante, modelo, serie, garantía, manual, mantenimiento preventivo/correctivo, inspecciones, repuestos, responsables, costos, órdenes de trabajo, incidencias, vida útil, Avatar contextual, Luka.

7.2. Criterio de completitud
Cada capacidad debe tener: estado real, evidencia o ausencia explícita, dueño funcional, entrega E1–E8, contrato de datos, prueba, adaptador o motor, riesgo, regla de no emisión profesional.

Una capacidad no desaparece por ser grande. Si no cabe en una entrega, se subdivide y permanece visible.

PARTE 8 — MATRIZ DE MEJORAS DIFERENCIALES DE DEEPSEEK
8.1. Objetivo
No basta con identificar lo que falta. Archi debe proponer qué hace mejor o diferente frente a Revit, Archicad o Arqui, sin copiar.

8.2. Cuadro obligatorio
Mejora	Problema	Referencia	Ventaja Archi	Módulos	Datos	Entrega	Prioridad	Complejidad	Riesgo	Prueba	Decisión
8.3. Temas mínimos
Generación paramétrica orientada a espacios — pasar de sólidos aislados a espacios, usos, circulaciones, zonas.

Modelo semántico único — cada elemento vinculado a geometría, material, metrado, costo, calendario, expediente, O-M.

Trazabilidad completa — del parámetro de origen al plano, costo, tarea, incidencia, snapshot, activo.

Catálogo corporativo vivo — disciplinas y familias con estados, responsables, reglas, adaptadores.

Comparación inteligente — geometría + área + aforo + accesibilidad + costo + plazo + emisiones + mantenimiento + riesgo + cumplimiento.

Diseño orientado a decisiones — mostrar consecuencias antes de aprobar.

Revisión profesional gobernada — separar IA, cálculo de especialistas, validación normativa, decisión PO.

Interoperabilidad con informe de pérdida — qué se conservó, qué se degradó, qué no se convirtió.

Persistencia y snapshots comprensibles — auditables, recuperables.

Coordinación multidisciplinaria — desde el mismo elemento.

Expediente técnico trazable — vinculado a versión exacta.

Construcción y O-M — continuidad hasta garantías y activos.

Avatar contextual — enseña, no decora.

Accesibilidad y experiencia — paneles, atajos, estados, 8 idiomas, guías.

Rendimiento — SceneModel, LOD, instancing, carga progresiva, caché, vistas ligeras.

Seguridad y gobierno — permisos, auditoría, datos sensibles, decisiones profesionales.

Biblioteca e importación — validación, clasificación, mapeo, reporte de cobertura.

Análisis de alternativas — costo, plazo, materialidad, constructibilidad, O-M, riesgo.

Automatización responsable — sin presentar automatización como aprobación.

Diferenciación estratégica — Archi como estación propia de decisión, coordinación y ciclo de vida.

8.4. Regla de calidad
No se aceptan propuestas genéricas. Cada mejora debe indicar:

Qué cambia.

Para quién.

Qué dato usa.

Qué módulo afecta.

Qué riesgo introduce.

En qué entrega entra.

Cómo se prueba.

Qué queda fuera.

PARTE 9 — ARCHIVOS AUTORIZADOS Y PROTEGIDOS
9.1. Protegidos (no modificar sin ADR)
shared/ completo.

ConstructionModel, GeneratedBuilding, Muro, StructuralElement.

Serialización existente.

Contratos UI-1, UI-2, UI-3A verificados.

MODULE_DEFINITIONS, isAccessAllowed, supportedLanguages, catalog, t, useTranslation.

package.json, pnpm-lock.yaml, tsconfig.json (solo con autorización expresa).

9.2. Autorizados para nuevas fases
shared/scene/, shared/adapters/, shared/persistence/, shared/families/, shared/structural/, shared/mep/, shared/vision/.

client/src/viewer3d/, client/src/comparison/, client/src/persistence/, client/src/avatar/, client/src/luka/.

contracts/, audits/, evidence/ (documentos).

PARTE 10 — PRUEBAS Y OUTPUTS OBLIGATORIOS
10.1. Por entrega
pnpm check — sin errores.

pnpm build — sin errores.

Pruebas de dominio — tsx, sin fallos.

Pruebas de integración cuando aplique.

Preview con capturas reales.

Output real (datos, métricas, reportes).

Manifest y hash SHA-256.

Veredicto.

10.2. Demostración mínima obligatoria
Antes de declarar cierre de generación constructiva, Manus debe ejecutar y capturar:

Cuadrado de cuatro muros del ConstructionModel.

Puerta real alojada en muro norte.

Abertura 0.90 × 2.10 m.

Selección del muro con capas, acabados, metrados, costo.

Selección de la puerta con dimensiones, material, costo, muro anfitrión.

Conteo visible de muros y puertas.

Prueba scripts/test-wall-door-canvas.ts.

Esta demostración no autoriza a declarar Archi como BIM profesional completo.

PARTE 11 — CRITERIOS DE ACEPTACIÓN POR ENTREGA
Entrega	Criterio verificable
E1	Auditoría, ADRs, mapa de accesos, matriz de módulos, clasificación completa
E2	Wireflows + controles + pruebas de los 16 módulos
E3	Inventario P2 sin duplicación, con estados y responsables
E4	Catálogos especializados (8+7+5+8) y matriz de especialistas
E5	Visor 3D real + comparación visual lado a lado + capturas + rendimiento
E6	Persistencia real + snapshots aprobados + parser IFC4 + round-trip con reporte de pérdida
E7	Estructuras con solver + MEP calculado + coordinación + 5D/4D
E8	Expediente + O-M + Avatar + Luka + gate final
PARTE 12 — RIESGOS TÉCNICOS
Riesgo	Probabilidad	Impacto	Mitigación
shared/ no soporta SceneModel sin refactor	Media	Alto	ADR-014, migración incremental, regresión
Three.js + R3F incompatible con React 19	Baja	Alto	PoC temprana, fallback Babylon.js
Parser IFC4 incompleto	Alta	Alto	Librería gobernada, reporte de pérdida
Solver estructural no verificable	Media	Crítico	Solver externo validado, sin IA
MEP requiere normativa local	Alta	Alto	Definir alcance normativo con PO
Persistencia real requiere backend	Media	Alto	Local-first IndexedDB, servidor opcional
Avatar requiere modelo 3D complejo	Alta	Medio	Contrato independiente, GLB/glTF, rig
DXF sin adaptador gobernado	Alta	Medio	Mantener como FUTURE si no se aprueba
Regresiones UI-3A	Media	Alto	Regresión + inspección visual
Math.random() / Date.now() en crítico	Media	Alto	Prohibido sin ADR
Desbloqueo temporal no se revoca	Media	Crítico	Protocolo con verificación antes/durante/después
PARTE 13 — DECISIONES ABIERTAS DEL PRODUCT OWNER
Aprobar Fase 0 (auditoría real del repositorio).

Aprobar esta Orden Maestra Consolidada v3.0 como contrato marco.

Aprobar arquitectura que conserva shared/ y añade capas.

Aprobar ADRs ADR-001 a ADR-018 o solicitar modificaciones.

Tecnología de visor 3D (Three.js + R3F recomendado).

Backend de persistencia (local-first IndexedDB recomendado).

Solver estructural (OpenSees / CalculiX / propio).

Alcance normativo MEP (país, hospitalario).

Adaptador Revit (autorizar y alcance).

DXF gobernado (autorizar o FUTURE).

Contrato independiente Avatar ARKI.

Contrato independiente Luka.

IFC4: parser propio o librería gobernada (web-ifc / IfcOpenShell).

Migración shared/ (autorizar ADR-014).

Gate de snapshot aprobado (quién firma, datos obligatorios, validación profesional).

Confirmar paleta vigente (#080736, blanco, amarillo, naranja, verde, cian).

Confirmar 8 idiomas (es, en, pt, fr, de, it, zh, ja) + fallback.

Autorizar a Manus para inspeccionar, ejecutar pnpm check, pnpm build, pruebas, capturas.

PARTE 14 — ORDEN DE IMPLEMENTACIÓN (MAYOR VALOR / MENOR RIESGO)
Fase 0 — Auditoría real del repositorio (1–2 días, obligatoria).

E1 — Contrato de producto, ADRs, estado real.

E2 — Wireflows, controles y pruebas.

E3 — Inventario P2 (18 disciplinas y familias).

E4 — Catálogos especializados (8+7+5+8) y especialistas.

E5 — Visor BIM 3D + comparación visual.

E6 — Persistencia real + snapshots + IFC4 + DXF.

E7 — Estructuras + MEP + 5D + 4D + coordinación.

E8 — Expediente + O-M + Avatar + Luka + gate final.

Regla: no se inicia una entrega sin APPROVE o APPROVE WITH FIXES de la anterior.

PARTE 15 — ENTREGABLES DOCUMENTALES UNIFICADOS
El paquete único solicitado por el PO incluye:

ORDEN_MAESTRA_CONSOLIDADA_v3.md — este documento.

MATRIZ_COBERTURA_ARCHI_ARQUI_REVIT.md.

INVENTARIO_COMPLETO_FAMILIAS_Y_DISCIPLINAS.md.

CONTRATO_INTEROPERABILIDAD_ARCHI_IFC_REVIT_DXF.md.

MATRIZ_CONTROLES_16_MODULOS_V2.md.

MAPA_BRECHAS_IMPLEMENTADO_VS_FALTANTE.md.

MATRIZ_MEJORAS_DIFERENCIALES_ARCHI.md.

INFORME_DESBLOQUEO_TEMPORAL_ANTES_DURANTE_DESPUES.md.

Estos documentos forman parte de E1 y E2. No se reescribe UI ni se implementa nueva arquitectura hasta que la matriz de cobertura esté revisada por el PO y Manus.

PARTE 16 — REGLA FINAL DE NO EMISIÓN PROFESIONAL
Queda terminantemente prohibido declarar:

Visor BIM profesional sin visor 3D real con malla, capas, zonas, selección por superficies, clipping, cámaras, rendimiento verificado.

IFC profesional sin parser IFC4, round-trip, GlobalId gobernado, reporte de pérdida y pruebas con archivos reales.

Persistencia real sin sesión de servidor, snapshots aprobados, auditoría, concurrencia, migraciones.

DXF sin adaptador gobernado y probado.

Cálculo estructural profesional sin solver verificable, combinaciones, derivas, modos, fuerzas, ratios, cimentación, memoria.

Coordinación MEP profesional sin redes, sistemas, caudales, diámetros, pérdidas, tableros, HVAC, incendio, gases, telecom, Wi-Fi, racks, cámaras, agua caliente calculados.

Comparación visual sin dos modelos lado a lado, cámaras independientes/sincronizadas, estados de diferencia, navegación a elemento.

Avatar ARKI sin GLB/glTF, rig, gestos, animaciones, visión, OCR, AR, tres tamaños.

Luka sin visión y OCR funcionales.

“Aprobado para construir” sin gate profesional completo.

Evidencia obligatoria: código real + prueba ejecutable + output real + captura (cuando aplique) + veredicto. Sin excepción.

CIERRE
Estado del documento: PROPUESTA ÚNICA CONSOLIDADA v3.0.

Próximo paso obligatorio: Manus debe inspeccionar el repositorio contra c62183a, registrar hash exacto, y emitir veredicto de auditoría real (APPROVE / APPROVE WITH FIXES / REJECT / DEFER / PRODUCT OWNER DECISION REQUIRED) sobre el estado por capacidad.

No se autoriza código hasta que el Product Owner apruebe esta Orden Maestra y Manus confirme el estado real.

Fin de la Orden Maestra Consolidada v3.0.