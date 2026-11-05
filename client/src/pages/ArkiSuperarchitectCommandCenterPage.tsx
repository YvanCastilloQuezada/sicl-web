import { useMemo, useState } from "react";
import {
  Activity, Brain, Building2, ChevronRight, FlaskConical, GraduationCap,
  HeartHandshake, Lightbulb, Network, Search, ShieldCheck, Sparkles, Trophy,
} from "lucide-react";
import { organismNodes, commandCenterPhases, statusClass, type CommandCenterNode } from "@shared/arkiCommandCenterMap";
import { Link } from "wouter";

type MainTab = "OVERVIEW" | "KNOWLEDGE" | "SYSTEM" | "PHASES" | "IDEAS" | "EVOLUTION";

const icon = (kind:string) =>
  kind === "LEARNING" ? GraduationCap :
  kind === "TECH_LAB" || kind === "AI_LAB" ? FlaskConical :
  kind === "CORPORATION" ? Building2 :
  kind === "REVENUE" ? Trophy :
  kind === "RESEARCH" ? Search :
  kind === "AUTHORITY" ? Brain :
  kind === "SUPERARCHITECT" ? Activity : Network;

const deltaStats = [
  ["4,118", "registros consolidados", "evidencia KR-6.2"],
  ["947", "canonicalizados", "estado histórico"],
  ["1,604", "investigados", "aún ≠ capacidad"],
  ["458", "UNKNOWN", "preservados explícitamente"],
  ["9", "conexiones runtime", "mapa KR-6.2"],
];

const knowledgeFlow = [
  ["01", "FUENTES", "Universidad · normas · libros · proyectos · programas · investigación"],
  ["02", "PRE-INGESTA", "Profesor/Tutor · provenance · derechos · duplicados · prerrequisitos"],
  ["03", "CURADOR", "Semántica · contradicciones · nivel curricular · decisión de admisión"],
  ["04", "DELTA 6.2", "Única puerta gobernada de conocimiento de ARKI"],
  ["05", "APRENDIZAJE", "ARKI integra; recibir información no equivale a aprenderla"],
  ["06", "EXAMEN", "Evaluador independiente · transferencia · generalización · límites"],
  ["07", "COMPETENCIA", "No demostrada → implementada → verificada → E2E / gate profesional"],
];

const primarySurfaces = [
  { href:"/", eyebrow:"PROFESSIONAL", title:"ARKI Professional", body:"Proyecto, contexto, alternativas, evidencia, evaluación y decisión en el workspace profesional.", accent:"text-[#7dd3fc]" },
  { href:"/arki-arbol-vivo", eyebrow:"LIVING TREE", title:"Árbol Vivo original", body:"Maqueta Viva y Árbol Gemelo Digital existentes, con observación AV-022 de evidencias y decisiones. Requiere servicio local.", accent:"text-[#a7e6c5]" },
  { href:"/arki-command-center", eyebrow:"SYSTEM", title:"Command Center", body:"Cuerpo vivo de ARKI: órganos, Delta 6.2, fases, evidencia, estado y próximos gates.", accent:"text-[#d4ff3a]" },
  { href:"/control-center", eyebrow:"AUTHORITY", title:"Director / Control", body:"Superficie de Human Authority para control, revisión, gobernanza y decisiones.", accent:"text-[#f0a35b]" },
  { href:"/arki-design-funnel", eyebrow:"DESIGN", title:"Design Studio", body:"Exploración arquitectónica N→9→4→1 con comparación, trazabilidad y selección para desarrollo.", accent:"text-[#70e1a2]" },
];

const productionChain = [
  ["01","SITIO","Ubicación confirmada y contexto territorial"],
  ["02","INTELIGENCIA","Clima · solar · GIS · restricciones · UNKNOWN"],
  ["03","BRIEF","Programa, objetivos, preferencias y restricciones"],
  ["04","PARTI","Intención → relaciones → topología"],
  ["05","EXPLORAR","Generación y divergencia arquitectónica"],
  ["06","9 → 4 → 1","Comparar · evaluar · seleccionar sin borrar genealogía"],
  ["07","AGK","Geometría canónica 3D en Local Engineering Frame"],
  ["08","DOCUMENTAR","Planta · corte · elevación · BIM desde el mismo estado"],
];

const phaseIdeaChips:Record<string,string[]> = {
 F1:["Project State","Trust","Provenance"],
 F2:["Delta 6.2","Universidad","Book adaptativo"],
 F3:["Brief","Normativa","Agentes"],
 F4:["PARTI ×3","Topología","Backtrack"],
 F5:["9→4→1","Pareto","Superpoderes"],
 F6:["OCCT","Naming","Paramétricos"],
 F7:["RNE","MEP/Estructura","IFC/CAD"],
 F8:["Súper Expediente","Planos","Metrados"],
 F9:["ARKI-CONSTRUCT","As-built","Field/AR"],
 F10:["ARKI-BUILDING","O&M","Concursos/Ingresos"],
};

function TenPhaseRoadmap(){
 return <section className="rounded-[6px] border border-[#28445b] bg-[#091827] p-4">
  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#28445b] pb-3">
   <div><div className="text-[9px] font-bold tracking-[.18em] text-[#7dd3fc]">PRODUCT SPINE · F1→F10</div><h2 className="mt-1 font-semibold">Cronograma por evidencia</h2><p className="mt-1 text-[10px] text-[#8fa8bc]">Sin fechas inventadas: cada fase avanza cuando cruza su gate. F6 es el frente activo declarado.</p></div>
   <div className="flex gap-2 text-[9px]"><span className="rounded border border-amber-400/40 px-2 py-1 text-amber-100">NOW · F6</span><span className="rounded border border-blue-400/40 px-2 py-1 text-blue-100">NEXT · F7</span></div>
  </div>
  <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-5">{commandCenterPhases.map(p=><div key={p.id} className={`rounded-[5px] border p-3 ${p.status==="IN_PROGRESS"?"border-[#d4ff3a] bg-[#d4ff3a]/10":"border-[#28445b] bg-[#0d1d2c]"}`}>
   <div className="flex items-center justify-between gap-2"><b className="text-[11px] text-[#e8f1f7]">{p.id}</b><span className={`rounded border px-1.5 py-0.5 text-[8px] ${statusClass[p.status]}`}>{p.status}</span></div>
   <div className="mt-2 text-[11px] font-semibold text-[#d4ff3a]">{p.name.replace(p.id+" · ","")}</div>
   <p className="mt-1 text-[9px] leading-4 text-[#8fa8bc]">{p.summary}</p>
   <div className="mt-2 flex flex-wrap gap-1">{phaseIdeaChips[p.id]?.map(x=><span key={x} className="rounded bg-[#102538] px-1.5 py-0.5 text-[8px] text-[#9eb5c4]">{x}</span>)}</div>
   <div className="mt-2 border-t border-[#28445b] pt-2 text-[8px] leading-3 text-[#718b9a]">GATE: {p.missing}</div>
  </div>)}</div>
 </section>;
}

const watchCards = [
  {title:"Version Watcher", tag:"ACTUALIZACIONES", body:"Vigila conocimiento ya estudiado. Una nueva edición, norma, método o software crea UPDATE_CANDIDATE; nunca sobrescribe conocimiento silenciosamente.", tone:"cyan"},
  {title:"R&D Scout", tag:"CONOCIMIENTO NUEVO", body:"Busca investigación y desarrollos emergentes. Los hallazgos entran como RESEARCH_CANDIDATE y pasan por curación antes de llegar a ARKI.", tone:"lime"},
  {title:"Tecnología → capacidad", tag:"MOTORES / PROGRAMAS / SCRIPTS", body:"Herramienta externa → practicum/oráculo → rutina candidata → validación → capacidad nativa cuando sea viable. La herramienta no se vuelve autoridad semántica.", tone:"orange"},
];

function NodeCard({node,onOpen}:{node:CommandCenterNode;onOpen:(n:CommandCenterNode)=>void}) {
  const I=icon(node.kind);
  return <button onClick={()=>onOpen(node)} className="group rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#d4ff3a]/70 hover:bg-[#102538]">
    <div className="flex items-start justify-between gap-2"><I className="size-5 text-[#7dd3fc]"/><span className={`rounded border px-2 py-0.5 text-[9px] ${statusClass[node.status]}`}>{node.status}</span></div>
    <div className="mt-3 font-semibold text-[#eef6fb]">{node.name}</div>
    <div className="mt-1 text-[10px] uppercase tracking-[.14em] text-[#718b9a]">{node.kind} · {node.phase}</div>
    <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#9eb5c4]">{node.summary}</p>
    <div className="mt-3 flex items-center text-[10px] font-semibold text-[#d4ff3a]">Abrir <ChevronRight className="ml-1 size-3"/></div>
  </button>;
}

function DeltaKnowledgePanel(){
  const [selectedStep,setSelectedStep]=useState(3);
  return <div className="space-y-4">
    <section className="grid gap-3 md:grid-cols-5">{deltaStats.map(([value,label,note])=><div key={label} className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-4"><div className="text-2xl font-semibold text-[#e8f1f7]">{value}</div><div className="mt-1 text-xs font-semibold text-[#d4ff3a]">{label}</div><div className="mt-1 text-[10px] text-[#718b9a]">{note}</div></div>)}</section>
    <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <div className="rounded-[6px] border border-[#28445b] bg-[#091827] p-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#28445b] pb-3">
          <div><div className="text-[10px] uppercase tracking-[.2em] text-[#7dd3fc]">KNOWLEDGE PIPELINE</div><h2 className="mt-1 text-lg font-semibold">Cómo aprende ARKI</h2></div>
          <span className="rounded-full border border-[#60731d] px-3 py-1 text-[9px] font-semibold tracking-[.12em] text-[#d4ff3a]">DELTA 6.2 · SINGLE KNOWLEDGE GATE</span>
        </div>
        <div className="mt-4 grid gap-2 lg:grid-cols-7">{knowledgeFlow.map(([n,title,body],i)=><button key={n} onClick={()=>setSelectedStep(i)} className={`min-h-32 rounded-[5px] border p-3 text-left transition ${selectedStep===i?"border-[#d4ff3a] bg-[#d4ff3a]/10":"border-[#28445b] bg-[#102538] hover:border-[#7dd3fc]/60"}`}><div className="text-[9px] text-[#718b9a]">{n}</div><div className={`mt-2 text-xs font-bold ${selectedStep===i?"text-[#d4ff3a]":"text-[#e8f1f7]"}`}>{title}</div><p className="mt-2 text-[10px] leading-4 text-[#9eb5c4]">{body}</p></button>)}</div>
        <div className="mt-3 rounded-[5px] border border-[#28445b] bg-[#07121e] p-4"><div className="text-[10px] uppercase tracking-[.15em] text-[#718b9a]">Paso seleccionado</div><div className="mt-1 font-semibold text-[#d4ff3a]">{knowledgeFlow[selectedStep][1]}</div><p className="mt-1 text-xs leading-5 text-[#b9cbd6]">{knowledgeFlow[selectedStep][2]}</p></div>
      </div>
      <aside className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-4">
        <div className="flex items-center gap-2 text-[#d4ff3a]"><ShieldCheck className="size-4"/><b className="text-sm">Reglas epistemológicas</b></div>
        <div className="mt-4 space-y-3 text-xs leading-5 text-[#b9cbd6]">
          <p><b className="text-white">Conocimiento ≠ capacidad.</b> Investigar o registrar algo no demuestra que ARKI sepa aplicarlo.</p>
          <p><b className="text-white">Research ≠ implementación.</b> Todo hallazgo conserva su estado.</p>
          <p><b className="text-white">Implementación ≠ demostración.</b> El Examiner debe comprobar transferencia y límites.</p>
          <p><b className="text-white">Demostración ≠ validación profesional.</b> Los gates regulados permanecen humanos.</p>
          <p><b className="text-white">UNKNOWN permanece visible.</b> No se rellena por conveniencia.</p>
        </div>
      </aside>
    </section>
    <section className="grid gap-3 lg:grid-cols-3">{watchCards.map((c,i)=><div key={c.title} className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-4"><div className={`text-[9px] font-bold tracking-[.15em] ${i===0?"text-[#7dd3fc]":i===1?"text-[#d4ff3a]":"text-[#f0a35b]"}`}>{c.tag}</div><h3 className="mt-2 font-semibold">{c.title}</h3><p className="mt-2 text-xs leading-5 text-[#9eb5c4]">{c.body}</p></div>)}</section>
  </div>;
}

export default function ArkiSuperarchitectCommandCenterPage(){
  const [selected,setSelected]=useState<CommandCenterNode>(organismNodes[0]);
  const [tab,setTab]=useState<MainTab>("OVERVIEW");
  const counts=useMemo(()=>({active:organismNodes.filter(n=>n.status==="IN_PROGRESS").length,reconcile:organismNodes.filter(n=>n.status==="RECONCILIATION_REQUIRED").length,frozen:organismNodes.filter(n=>n.status==="FROZEN").length}),[]);

  return <main className="min-h-screen bg-[#07121e] text-[#e8f1f7]">
    <header className="sticky top-0 z-30 border-b border-[#28445b] bg-[#091827]/95 px-4 py-3 backdrop-blur md:px-6">
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-4">
        <div className="text-lg font-black tracking-[.2em]">ARKI</div>
        <span className="rounded-full border border-[#60731d] px-2.5 py-1 text-[9px] tracking-[.12em] text-[#d4ff3a]">LOCAL COMMAND CENTER · V1</span>
        <div className="h-6 w-px bg-[#28445b]"/>
        <div><div className="text-[9px] uppercase tracking-[.2em] text-[#8fa8bc]">AR-LU CORPORATION</div><div className="text-xs font-semibold">Superarchitect Control Surface</div></div>
        <div className="ml-auto flex items-center gap-2 text-[10px] text-[#70e1a2]"><span className="size-2 rounded-full bg-[#70e1a2] shadow-[0_0_9px_#70e1a2]"/>LOCAL-FIRST · NO INTERNET EXPOSURE</div>
      </div>
    </header>

    <div className="mx-auto max-w-[1680px] p-4 md:p-6">
      <section className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {primarySurfaces.map((surface)=><Link key={surface.title} href={surface.href} className="group rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-4 transition hover:-translate-y-0.5 hover:border-[#d4ff3a]/70 hover:bg-[#102538]">
          <div className={`text-[9px] font-bold tracking-[.18em] ${surface.accent}`}>{surface.eyebrow}</div>
          <div className="mt-2 flex items-center justify-between gap-3"><h2 className="font-semibold text-[#eef6fb]">{surface.title}</h2><ChevronRight className="size-4 text-[#718b9a] transition group-hover:text-[#d4ff3a]"/></div>
          <p className="mt-2 text-[11px] leading-5 text-[#9eb5c4]">{surface.body}</p>
        </Link>)}
      </section>

      <section className="mb-5 rounded-[6px] border border-[#28445b] bg-[#091827] p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><div className="text-[9px] font-bold tracking-[.18em] text-[#7dd3fc]">NERVIOUS SYSTEM · SITE-FIRST</div><h2 className="mt-1 font-semibold">Cadena principal del Superarquitecto</h2></div>
          <Link href="/arki-design-funnel" className="rounded border border-[#60731d] px-3 py-1.5 text-[10px] font-bold text-[#d4ff3a] hover:bg-[#d4ff3a]/10">ABRIR DESIGN STUDIO</Link>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">{productionChain.map(([n,title,body])=><div key={n} className="rounded-[5px] border border-[#28445b] bg-[#0d1d2c] p-3"><div className="text-[9px] text-[#718b9a]">{n}</div><div className="mt-1 text-[10px] font-bold text-[#d4ff3a]">{title}</div><p className="mt-1 text-[9px] leading-4 text-[#8fa8bc]">{body}</p></div>)}</div>
      </section>

      <div className="mb-5"><TenPhaseRoadmap/></div>

      <section className="grid gap-3 xl:grid-cols-[1fr_auto]">
        <div><div className="text-[10px] uppercase tracking-[.25em] text-[#7dd3fc]">ESTADO VIVO DEL SISTEMA</div><h1 className="mt-1 text-2xl font-semibold">ARKI · Retomar exactamente donde nos quedamos</h1><p className="mt-2 max-w-4xl text-xs leading-5 text-[#8fa8bc]">Una sola superficie para ver avance, conocimiento, órganos, fases, evidencia y próximos pasos. Sin inventar verde: lo no reconciliado permanece explícito.</p></div>
        <div className="rounded-[6px] border border-[#f0a35b]/50 bg-[#f0a35b]/10 px-4 py-3"><div className="text-[9px] tracking-[.18em] text-[#f6c995]">POSICIÓN ACTUAL DECLARADA</div><div className="mt-1 font-semibold">FASE 6 · IN PROGRESS</div><div className="text-[10px] text-[#9eb5c4]">10 fases · definiciones históricas en reconciliación</div></div>
      </section>

      <nav className="mt-5 flex gap-1 overflow-x-auto border-b border-[#28445b]">{([
        ["OVERVIEW","RESUMEN"],["PHASES","10 FASES"],["SYSTEM","CUERPO ARKI"],["KNOWLEDGE","DELTA 6.2"],["IDEAS","IDEAS / FROZEN"],["EVOLUTION","PRUEBA 9→4→1"]
      ] as [MainTab,string][]).map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-[11px] font-semibold tracking-[.08em] ${tab===id?"border-[#d4ff3a] text-[#d4ff3a]":"border-transparent text-[#8fa8bc] hover:text-white"}`}>{label}</button>)}</nav>

      <div className="mt-4">
        {tab==="OVERVIEW"&&<div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <section className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-4"><div className="text-2xl font-semibold">{counts.active}</div><div className="text-xs text-[#f0a35b]">órganos en trabajo</div></div><div className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-4"><div className="text-2xl font-semibold">{counts.frozen}</div><div className="text-xs text-violet-200">frozen</div></div><div className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-4"><div className="text-2xl font-semibold">{counts.reconcile}</div><div className="text-xs text-rose-200">por reconciliar</div></div></div>
            <div className="rounded-[6px] border border-[#28445b] bg-[#091827] p-4"><div className="flex items-center gap-2 text-[#d4ff3a]"><HeartHandshake className="size-4"/><b>PF-05 · Pacto de Cuidado</b></div><p className="mt-2 text-xs text-[#9eb5c4]">ARKI me cuida. Yo cuido a ARKI. Pilar sellado; la continuidad del sistema debe preservar identidad, memoria, gobernanza y este pacto.</p></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{organismNodes.slice(0,9).map(n=><NodeCard key={n.id} node={n} onOpen={n=>{setSelected(n);setTab("SYSTEM")}}/>)}</div>
          </section>
          <aside className="space-y-3">
            <div className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-4"><div className="text-[9px] tracking-[.18em] text-[#7dd3fc]">ÚLTIMO HITO RECUPERADO</div><h3 className="mt-2 font-semibold">KR-6.2 · Gate PASS</h3><p className="mt-2 text-xs leading-5 text-[#9eb5c4]">Master histórico de conocimiento/razonamiento: 4,118 filas consolidadas, lineage v1–v6.1, conexiones runtime y UNKNOWN explícito.</p><button onClick={()=>setTab("KNOWLEDGE")} className="mt-3 flex items-center text-xs font-semibold text-[#d4ff3a]">Abrir Delta 6.2 <ChevronRight className="ml-1 size-3"/></button></div>
            <div className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-4"><div className="text-[9px] tracking-[.18em] text-[#f0a35b]">TRABAJANDO AHORA</div><p className="mt-2 text-xs leading-5 text-[#b9cbd6]">Frontend-first: ensamblaje de Professional + Command Center + Director/Control + Design Studio. AGK continúa como soporte, no como bloqueo del frontend.</p></div>
            <div className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-4"><div className="text-[9px] tracking-[.18em] text-[#d4ff3a]">SIGUIENTE</div><p className="mt-2 text-xs leading-5 text-[#b9cbd6]">Conectar el flujo SITE-FIRST con Design Studio y el estado canónico: sitio → inteligencia → brief → Parti → 9→4→1 → AGK → planta/3D/BIM.</p></div>
          </aside>
        </div>}

        {tab==="KNOWLEDGE"&&<DeltaKnowledgePanel/>}

        {tab==="SYSTEM"&&<div className="grid gap-4 xl:grid-cols-[1fr_360px]"><section><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{organismNodes.map(n=><NodeCard key={n.id} node={n} onOpen={setSelected}/>)}</div></section><aside className="h-fit rounded-[6px] border border-[#35536b] bg-[#0d1d2c] p-5 xl:sticky xl:top-20"><div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-[.2em] text-[#d4ff3a]">INSPECTOR</span><span className={`rounded border px-2 py-0.5 text-[9px] ${statusClass[selected.status]}`}>{selected.status}</span></div><h2 className="mt-2 text-xl font-semibold">{selected.name}</h2><p className="mt-1 text-[10px] uppercase tracking-[.15em] text-[#718b9a]">{selected.kind} · {selected.phase}</p><div className="mt-5 space-y-4 text-sm"><div><div className="text-[10px] uppercase text-[#718b9a]">¿Qué hace?</div><p className="mt-1 text-[#c0d0dc]">{selected.summary}</p></div><div><div className="text-[10px] uppercase text-[#718b9a]">Capacidad ganada</div><p className="mt-1 text-[#d4ff3a]">{selected.gained}</p></div><div><div className="text-[10px] uppercase text-[#718b9a]">¿Qué falta?</div><p className="mt-1 text-[#f0b978]">{selected.missing}</p></div></div></aside></div>}

        {tab==="PHASES"&&<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">{commandCenterPhases.map(n=><NodeCard key={n.id} node={n} onOpen={setSelected}/>)}</div>}

        {tab==="IDEAS"&&<div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-5"><div className="text-[9px] font-bold tracking-[.16em] text-[#7dd3fc]">IDEAS PURAS</div><h3 className="mt-2 font-semibold">Capturadas / investigar</h3><p className="mt-2 text-xs leading-5 text-[#9eb5c4]">No se implementan por estar aquí. Deben conservar origen, motivo, dependencias, fase candidata y estado CAPTURED / INVESTIGATE / HOLD / REJECT.</p></div>
          <div className="rounded-[6px] border border-violet-400/40 bg-violet-400/5 p-5"><div className="text-[9px] font-bold tracking-[.16em] text-violet-200">FROZEN</div><h3 className="mt-2 font-semibold">Congeladas / preservadas</h3><p className="mt-2 text-xs leading-5 text-[#9eb5c4]">Decisiones o capacidades congeladas permanecen visibles, con razón, evidencia y condición explícita para reabrirse. Frozen ≠ olvidado.</p></div>
          <div className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-5"><div className="text-[9px] font-bold tracking-[.16em] text-[#d4ff3a]">IMPLEMENTACIÓN</div><h3 className="mt-2 font-semibold">Cuándo entra cada idea</h3><p className="mt-2 text-xs leading-5 text-[#9eb5c4]">Cada registro debe mostrar NOT_IMPLEMENTED / IMPLEMENTED / VERIFIED / FROZEN, fase objetivo, prerequisitos, responsable, evidencia y último movimiento.</p></div>
          <div className="lg:col-span-3 rounded-[6px] border border-[#28445b] bg-[#091827] p-5"><div className="text-[10px] uppercase tracking-[.18em] text-[#f0a35b]">PENDIENTE DE RECONCILIACIÓN</div><p className="mt-2 text-sm text-[#b9cbd6]">Este tablero ya fija la taxonomía visual, pero todavía no inventa el inventario. La siguiente pasada debe cargar las ideas reales y los registros Frozen existentes del repositorio y documentos históricos.</p></div>
        </div>}
        {tab==="EVOLUTION"&&<div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[6px] border border-[#28445b] bg-[#0d1d2c] p-5"><div className="flex items-center gap-2 text-[#d4ff3a]"><Sparkles className="size-4"/><b>Banco de pruebas arquitectónico</b></div><h3 className="mt-3 text-xl font-semibold">F5 · Design Studio</h3><p className="mt-2 text-sm leading-6 text-[#9eb5c4]">El contrato de selección se ha reducido a 9→4→1. La demostración sintética está suspendida indefinidamente; el Studio reabrirá cuando la generación arquitectónica real esté conectada y verificada.</p><a href="/arki-design-funnel" className="mt-4 inline-flex items-center rounded bg-[#d4ff3a] px-4 py-2 text-xs font-bold text-[#07121e]">Ver estado del Design Studio <ChevronRight className="ml-1 size-4"/></a></div>
          <div className="rounded-[6px] border border-[#f0a35b]/50 bg-[#f0a35b]/5 p-5"><div className="text-[9px] font-bold tracking-[.16em] text-[#f0a35b]">LÍMITE ACTUAL</div><p className="mt-3 text-xs leading-5 text-[#b9cbd6]">Estado: PAUSADO. No se muestran candidatos fabricados ni se afirma generación arquitectónica hasta que el motor real produzca geometría trazable y supere sus pruebas.</p></div>
        </div>}
      </div>
    </div>
  </main>;
}
