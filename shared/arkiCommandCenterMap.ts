export type CommandCenterStatus = "VERIFIED" | "IMPLEMENTED" | "IN_PROGRESS" | "FROZEN" | "DESIGN" | "UNKNOWN" | "RECONCILIATION_REQUIRED";
export type CommandCenterNode = { id:string; name:string; kind:string; status:CommandCenterStatus; summary:string; gained:string; missing:string; phase:string; children?:CommandCenterNode[] };

export const commandCenterPhases: CommandCenterNode[] = Array.from({length:10},(_,i)=>{
 const phase=i+1;
 const current=phase===6;
 return {
  id:`F${phase}`,name:`Fase ${phase}`,kind:"PHASE",
  status:current?"IN_PROGRESS":phase<6?"RECONCILIATION_REQUIRED":"DESIGN",
  summary:current?"Fase actual declarada por Product Owner; definición histórica exacta y subfase aún deben reconciliarse con evidencia.":"Definición, subfases y gates históricos pendientes de recuperación; no se inventa un nombre.",
  gained:current?"Zona actual de trabajo: ensamblaje, fidelidad canónica y frontend vivo, con evidencia parcial ya recuperada.":phase<6?"Existe trabajo histórico previo, pero esta vista no lo declara cerrado sin reconciliación fase por fase.":"Fase futura dentro del esquema de diez fases; alcance exacto pendiente de evidencia.",
  missing:"Recuperar definición histórica exacta, gates, artefactos, pruebas y SHA antes de elevar el estado.",
  phase:`F${phase}`
 };
});
export const commandCenterPhases: CommandCenterNode[] = [
 {id:"F1",name:"F1 · Identidad, Trust & Project State",kind:"PHASE",status:"RECONCILIATION_REQUIRED",phase:"F1",summary:"Identidad reproducible, provenance, autoridad humana y estado versionado del proyecto.",gained:"Project/version, provenance, snapshots y revisión humana tienen activos históricos.",missing:"Reconciliar gates históricos, custodia, firmas/revocación y evidencia actual."},
 {id:"F2",name:"F2 · Conocimiento & Universidad",kind:"PHASE",status:"RECONCILIATION_REQUIRED",phase:"F2",summary:"Delta 6.2 como única puerta de conocimiento; Universidad, Tutor, Curator y Examiner.",gained:"M0-K, D6.1, KR-6.2, Book y currículos existen.",missing:"Conectar aprendizaje, examen, Version Watcher y R&D Scout sin crear un segundo conocimiento."},
 {id:"F3",name:"F3 · Inteligencia Arquitectónica",kind:"PHASE",status:"RECONCILIATION_REQUIRED",phase:"F3",summary:"Brief, razonamiento, transferencia, semántica, agentes y razonamiento jurisdiccional.",gained:"D6.2 y reasoning/transfer tienen evidencia histórica acotada.",missing:"Reconciliar runtime actual y ampliar jurisdicción/especialistas con provenance."},
 {id:"F4",name:"F4 · Parti, Topología & Exploración",kind:"PHASE",status:"RECONCILIATION_REQUIRED",phase:"F4",summary:"Parti divergente, topología, generación, mutación, rechazo y backtracking.",gained:"PARTI, integrated cycle y D6.3 bridge existen en alcance conceptual.",missing:"Reconciliar tres realizaciones, multi-escala y gates actuales."},
 {id:"F5",name:"F5 · Evaluación & 16→4→1",kind:"PHASE",status:"RECONCILIATION_REQUIRED",phase:"F5",summary:"Evaluación multiobjetivo, superpoderes y selección humana con genealogía.",gained:"Funnel, Pareto/evaluaciones y superpoderes tienen activos materiales.",missing:"Cerrar integración E2E generación→evaluación→selección→AGK."},
 {id:"F6",name:"F6 · AGK / Espina 3D Constructiva",kind:"PHASE",status:"IN_PROGRESS",phase:"F6",summary:"Geometría canónica 3D, paramétricos, identidad persistente y commits fail-closed.",gained:"OCCT discovery, DELTA-005 naming y contratos geométricos avanzan con evidencia ejecutable.",missing:"P6→P10: transacción, persistencia/replay, concurrencia, OCCT E2E y estrés/regresión."},
 {id:"F7",name:"F7 · Desarrollo Técnico Profesional",kind:"PHASE",status:"DESIGN",phase:"F7",summary:"Modelo coordinado, normativa y especialidades sobre la misma verdad geométrica.",gained:"BIM viewer, investigación de especialidades y contratos históricos reutilizables.",missing:"RNE/jurisdicción, estructura/MEP, accesibilidad/incendio, cantidades/costos, IFC/CAD verificables."},
 {id:"F8",name:"F8 · Súper Expediente & Entrega",kind:"PHASE",status:"DESIGN",phase:"F8",summary:"Documentación técnica trazable derivada del estado canónico.",gained:"Roadmap de Súper Expediente y superficies documentales existentes.",missing:"Planos, cortes, elevaciones, especificaciones, metrados y paquete de revisión desde un único estado."},
 {id:"F9",name:"F9 · Obra, Campo & Digital Twin",kind:"PHASE",status:"DESIGN",phase:"F9",summary:"Continuidad diseño→obra→as-built con evidencia de campo.",gained:"Field Mode, AR/WebXR, OCR/Visual Field y activos lifecycle.",missing:"ARKI-CONSTRUCT, correspondencia espacial, change sets, as-built y control de calidad E2E."},
 {id:"F10",name:"F10 · Operación, Aprendizaje & Ecosistema",kind:"PHASE",status:"DESIGN",phase:"F10",summary:"Operación/mantenimiento, aprendizaje por resultados y sostenibilidad económica AR-LU.",gained:"Operations, Self-Care, Marketplace, LUCA federation y arquitectura corporativa existen.",missing:"ARKI-BUILDING, telemetría, mantenimiento, concursos/ingresos y retorno gobernado a Delta 6.2."}
];

export const organismNodes: CommandCenterNode[] = [
 {id:"ARKI",name:"ARKI",kind:"SUPERARCHITECT",status:"IN_PROGRESS",phase:"F6→F7",summary:"Superarquitecto: aprende, razona, genera, evalúa, materializa y conserva autoridad humana.",gained:"D-2, Funnel, familias, superpoderes, AGK y otras capacidades ya tienen evidencia material.",missing:"Conectar los órganos en un E2E integral y reconciliar el mapa completo."},
 {id:"UNIVERSITY",name:"Universidad ARKI",kind:"LEARNING",status:"RECONCILIATION_REQUIRED",phase:"POR ASIGNAR",summary:"Fuente y proceso educativo gobernado: Tutor/Profesor prepara conocimiento candidato; todo aprendizaje converge por Delta 6.2 y luego es examinado independientemente.",gained:"LearningLedger reportado con implementación/tests; contratos Teacher/Examiner y Charter Academy/Advisory recuperados.",missing:"Reconciliar currículo, Curator, Delta 6.2 y Examiner con evidencia actual antes de elevar a VERIFIED."},
 {id:"RESEARCH",name:"Investigación & Tendencias",kind:"RESEARCH",status:"IMPLEMENTED",phase:"TRANSVERSAL",summary:"Observa tendencias y conocimiento emergente; debe producir RESEARCH_CANDIDATE para curación y entrada gobernada por Delta 6.2.",gained:"Research review, curriculum y archivos de investigación existentes.",missing:"Formalizar R&D Scout + Version Watcher y vincular cada hallazgo a Delta 6.2, evidencia, fase y decisión."},
 {id:"ACS",name:"ACS",kind:"TECH_LAB",status:"IN_PROGRESS",phase:"TRANSVERSAL",summary:"Laboratorio tecnológico: inspecciona y experimenta con motores/programas/herramientas; produce evidencia y candidatos de rutina/conocimiento para Delta 6.2, no verdad canónica directa.",gained:"KNOW/RUN/UNDERSTAND/EVOLVE y memoria tecnológica tienen implementación material.",missing:"Cerrar verificación Windows Stage 2/3 y conectar motores→programas→scripts/rutinas→capacidad con Delta 6.2."},
 {id:"AI_LAB",name:"Laboratorio de IA",kind:"AI_LAB",status:"IMPLEMENTED",phase:"POR ASIGNAR",summary:"Sandbox gobernado para experimentar, evaluar y mantener capacidades de IA.",gained:"Ledger/provenance, determinismo, fail-closed y Human Authority encontrados en Core.",missing:"Evolucionar/verificar benchmarking multi-modelo y enlazar Universidad ARKI."},
 {id:"D2",name:"D-2 · Reasoning",kind:"AUTHORITY",status:"FROZEN",phase:"TRANSVERSAL",summary:"Autoridad de significado arquitectónico y razonamiento gobernado.",gained:"Cadena de autoridad y gates congelados en contratos previos.",missing:"Reconciliar implementación web/core en el mapa único."},
 {id:"FUNNEL",name:"Diseño N→16→4→1",kind:"DESIGN",status:"IMPLEMENTED",phase:"POR RECONCILIAR",summary:"Exploración de alternativas con selección humana y preservación de candidatos.",gained:"Funnel ejecutable y UI existentes.",missing:"Verificar integración E2E con generación, evaluación y AGK."},
 {id:"AGK",name:"AGK · Geometry",kind:"GEOMETRY",status:"IN_PROGRESS",phase:"F6→F7",summary:"Única autoridad de geometría operacional; dirección 3D-FIRST.",gained:"Spine, regeneración causal y compilación paramétrica materialmente implementados.",missing:"AGK super-kernel OCCT+Delta y ampliación geométrica."},
 {id:"LUCA",name:"LUCA / MiLukita",kind:"TWIN",status:"IN_PROGRESS",phase:"FEDERATED",summary:"Hermana gemela geoespacial/AR de ARKI; se integra por contratos federados, no fusionando cores.",gained:"Control Center y AR-LU federation encontrados.",missing:"Verificar ejecución AR física actual en dispositivo y completar federación."},
 {id:"CORP",name:"AR-LU Corporation",kind:"CORPORATION",status:"RECONCILIATION_REQUIRED",phase:"BUSINESS",summary:"Capa corporativa que agrupa ARKI, LUCA y laboratorios y debe sostener económicamente la infraestructura.",gained:"Marketplace y arquitectura corporativa histórica existen en el ecosistema.",missing:"Auditar modelo económico y órganos corporativos actuales antes de afirmar operación."},
 {id:"CONTESTS",name:"Concursos & Ingresos",kind:"REVENUE",status:"RECONCILIATION_REQUIRED",phase:"BUSINESS",summary:"Frente para convertir capacidades ARKI en participación competitiva e ingresos.",gained:"Objetivo del Product Owner registrado.",missing:"Localizar contratos/código/roadmap existentes y definir gate de activación."}
];

export const statusClass:Record<CommandCenterStatus,string>={
 VERIFIED:"border-emerald-400/50 text-emerald-200 bg-emerald-400/10",
 IMPLEMENTED:"border-cyan-400/50 text-cyan-100 bg-cyan-400/10",
 IN_PROGRESS:"border-amber-400/50 text-amber-100 bg-amber-400/10",
 FROZEN:"border-violet-400/50 text-violet-100 bg-violet-400/10",
 DESIGN:"border-blue-400/50 text-blue-100 bg-blue-400/10",
 UNKNOWN:"border-slate-500 text-slate-300 bg-slate-500/10",
 RECONCILIATION_REQUIRED:"border-rose-400/40 text-rose-100 bg-rose-400/10"
};
