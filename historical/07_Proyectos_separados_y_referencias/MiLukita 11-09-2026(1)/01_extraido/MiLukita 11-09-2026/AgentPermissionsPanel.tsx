import { useMemo, useState } from "react";
import { BookOpen, ChevronDown, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AGENT_MAP_PERMISSIONS, AGENT_PERMISSION_PROFILES, type AgentMapPermission, type AgentPermissionProfile, type PermissionLevel } from "../../../shared/agentMap";

const permissionLevel = (profile: AgentPermissionProfile, permission: AgentMapPermission): PermissionLevel => {
  if (permission === "READ") return profile.canRead === "NOT ALLOWED" ? "NOT ALLOWED" : "ALLOWED";
  if (permission === "WRITE") return profile.canWrite === "NOT ALLOWED" ? "NOT ALLOWED" : profile.canWrite.toLowerCase().includes("limit") || profile.canWrite.toLowerCase().includes("solo") ? "LIMITED" : "ALLOWED";
  if (permission === "PROPOSE") return profile.canPropose === "NOT ALLOWED" ? "NOT ALLOWED" : "ALLOWED";
  return profile.canExecute === "NOT ALLOWED" ? "NOT ALLOWED" : profile.canExecute === "LIMITED" ? "LIMITED" : "ALLOWED";
};

function levelLabel(level: PermissionLevel) {
  if (level === "ALLOWED") return "Permitido";
  if (level === "LIMITED") return "Limitado";
  if (level === "NOT ALLOWED") return "No permitido";
  return "N/A";
}

function statusTone(status: AgentPermissionProfile["status"]) {
  if (status === "IMPLEMENTED / LIMITED") return "border-cyan-300/25 bg-cyan-300/10 text-cyan-100";
  if (status === "PREPARED") return "border-amber-300/25 bg-amber-300/10 text-amber-100";
  if (status === "CONCEPTUAL" || status === "NOT IMPLEMENTED") return "border-slate-300/15 bg-slate-300/5 text-slate-300";
  if (status === "BLOCKED") return "border-rose-300/25 bg-rose-300/10 text-rose-100";
  return "border-emerald-300/25 bg-emerald-300/10 text-emerald-100";
}

function permissionTone(level: PermissionLevel) {
  if (level === "ALLOWED") return "border-emerald-300/25 bg-emerald-300/10 text-emerald-100";
  if (level === "LIMITED") return "border-amber-300/25 bg-amber-300/10 text-amber-100";
  return "border-rose-300/25 bg-rose-300/10 text-rose-100";
}

export default function AgentPermissionsPanel() {
  const [selectedId, setSelectedId] = useState(AGENT_PERMISSION_PROFILES[0].id);
  const [statusFilter, setStatusFilter] = useState<"ALL" | AgentPermissionProfile["status"]>("ALL");
  const [showDetails, setShowDetails] = useState(true);
  const selected = AGENT_PERMISSION_PROFILES.find((profile) => profile.id === selectedId) ?? AGENT_PERMISSION_PROFILES[0];
  const filtered = useMemo(() => statusFilter === "ALL" ? AGENT_PERMISSION_PROFILES : AGENT_PERMISSION_PROFILES.filter((profile) => profile.status === statusFilter), [statusFilter]);

  return <section className="mt-6 border border-violet-200/15 bg-violet-200/[0.04] p-5 sm:p-6" aria-labelledby="agent-permissions-title">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-violet-200" /><div><p className="text-xs font-bold uppercase tracking-[.14em] text-violet-200">Orden 42 · gobernanza</p><h2 id="agent-permissions-title" className="mt-1 font-display text-2xl text-white">Matriz de permisos de agentes</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Visualización documental de `MJP_MASTER_AGENT_MAP.md`. Consultar esta matriz no concede permisos, no cambia allowlists y no reemplaza la autoridad de MJP CORE.</p></div></div>
      <div className="flex flex-wrap gap-2"><Badge className="border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">Solo lectura</Badge><Badge className="border border-amber-300/20 bg-amber-300/10 text-amber-100">No autoritativa</Badge></div>
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[.86fr_1.14fr]">
      <div className="border border-white/10 bg-black/15 p-3"><div className="flex flex-col gap-2 sm:flex-row"><label className="flex-1 text-xs text-slate-400">Filtrar por estado<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="mt-1 w-full border border-white/10 bg-[#07161b] px-3 py-2 text-xs text-white"><option value="ALL">Todos los estados</option><option value="IMPLEMENTED / LIMITED">IMPLEMENTED / LIMITED</option><option value="PREPARED">PREPARED</option><option value="CONCEPTUAL">CONCEPTUAL</option><option value="BLOCKED">BLOCKED</option></select></label></div><div className="mt-3 space-y-2">{filtered.map((profile) => <button key={profile.id} type="button" onClick={() => setSelectedId(profile.id)} className={`w-full border px-3 py-3 text-left transition ${selectedId === profile.id ? "border-violet-200/60 bg-violet-200/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"}`}><div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-white">{profile.name}</span><span className={`border px-2 py-1 text-[10px] ${statusTone(profile.status)}`}>{profile.status}</span></div><span className="mt-1 block text-xs text-slate-500">Autoridad final: {profile.authority}</span></button>)}{filtered.length === 0 && <p className="p-4 text-sm text-slate-500">No hay agentes con este estado.</p>}</div></div>
      <div className="border border-white/10 bg-black/15 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-slate-500">Agente seleccionado</p><h3 className="mt-1 text-xl font-bold text-white">{selected.name}</h3><p className="mt-1 text-xs text-slate-400">{selected.evidence}</p></div><button type="button" onClick={() => setShowDetails((current) => !current)} className="inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-xs font-bold text-slate-200">{showDetails ? "Ocultar detalle" : "Mostrar detalle"}<ChevronDown className={`h-3.5 w-3.5 ${showDetails ? "rotate-180" : ""}`} /></button></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{AGENT_MAP_PERMISSIONS.map((permission) => <div key={permission} className={`border px-3 py-3 ${permissionTone(permissionLevel(selected, permission))}`}><p className="text-[10px] uppercase tracking-widest opacity-70">{permission}</p><p className="mt-1 text-xs font-bold">{levelLabel(permissionLevel(selected, permission))}</p></div>)}</div>{showDetails && <div className="mt-4 space-y-3 border-t border-white/10 pt-4"><div><p className="text-[10px] uppercase tracking-widest text-slate-500">Puede leer</p><p className="mt-1 text-xs leading-5 text-slate-300">{selected.canRead}</p></div><div><p className="text-[10px] uppercase tracking-widest text-slate-500">Puede escribir</p><p className="mt-1 text-xs leading-5 text-slate-300">{selected.canWrite}</p></div><div><p className="text-[10px] uppercase tracking-widest text-slate-500">Puede proponer</p><p className="mt-1 text-xs leading-5 text-slate-300">{selected.canPropose}</p></div><div><p className="text-[10px] uppercase tracking-widest text-slate-500">Puede ejecutar</p><p className="mt-1 text-xs leading-5 text-slate-300">{selected.canExecute}</p></div><div><p className="text-[10px] uppercase tracking-widest text-slate-500">No puede modificar</p><div className="mt-1 flex flex-wrap gap-1.5">{selected.forbidden.map((item) => <span key={item} className="border border-rose-300/15 bg-rose-300/5 px-2 py-1 text-[10px] text-rose-100/80">{item}</span>)}</div></div><div className="flex items-center gap-2 border-t border-white/10 pt-3 text-xs text-slate-400"><BookOpen className="h-3.5 w-3.5 text-violet-200" />Eventos: <span className="text-slate-200">{selected.events}</span></div></div>}</div>
    </div>
    <p className="mt-4 text-[11px] leading-5 text-slate-500">La visualización refleja el expediente documental actual. Los agentes marcados como PREPARED o CONCEPTUAL no pueden tratarse como implementados.</p>
  </section>;
}
