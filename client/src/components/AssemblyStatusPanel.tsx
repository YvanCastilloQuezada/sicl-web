import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const areaGroups = [
  { key: "REUSED", label: "Reutilizadas", count: 3, color: "#55d49a", description: "Capas DNA existentes reutilizadas sin crear motores paralelos.", items: ["Epistemología, provenance, UNKNOWN y Human Authority", "Ontología, escalas, estados y contexto", "Knowledge, reasoning, generation, evaluation, learning y memory"] },
  { key: "CONNECTED", label: "Conectadas", count: 8, color: "#75b9ff", description: "Componentes conectados en el ciclo arquitectónico integrado.", items: ["Percepción multimodal y fuentes", "Programación y requisitos", "Topología, geometría 2D/3D", "INPUT → EVIDENCE → KNOWLEDGE", "KNOWLEDGE → REASONING → PARTI", "PARTI → TOPOLOGY → GEOMETRY", "Evaluación → Human Decision", "Corporación ARKI → Intelligence"] },
  { key: "PARTIAL", label: "Parciales", count: 4, color: "#f0b35b", description: "Áreas conectadas sólo a alcance local, conceptual o futuro.", items: ["Site, GIS y clima", "CAD, BIM, ingeniería, performance, cost, construction y operations", "Geometry → Performance → Evaluation", "Observation → Learning → Transfer"] },
] as const;

const gaps = [
  "Escritura canónica remota al SICL Core",
  "Producción profesional BIM/CAD/engineering",
  "Cuerpo completo GIS/clima/DTM/operaciones",
  "Aprendizaje y generalización automática",
  "Servicios y agentes operativos de Corporación ARKI",
];

const chartData = areaGroups.map(({ label, count, color }) => ({ name: label, áreas: count, fill: color }));

export default function AssemblyStatusPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const activeGroup = areaGroups.find((group) => group.key === selected);

  return <Card className="border-[#294765] bg-[#0d223d]">
    <CardHeader>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f0a35b]">MC-03 · ENSAMBLAJE</p><CardTitle className="mt-2 font-serif text-xl text-[#edf4ff]">15 áreas de ARKI y 5 gaps</CardTitle><p className="mt-2 max-w-2xl text-xs leading-5 text-[#b8cbe0]">Haz clic en una barra o en una categoría para ver qué significa cada estado. Esto describe el nivel de integración; no es una calificación profesional.</p></div>
        <span className="rounded-full border border-[#55d49a]/40 bg-[#55d49a]/10 px-3 py-1 text-[10px] tracking-[0.12em] text-[#9ff0c5]">GATE_ARKI_ASSEMBLED = PASS</span>
      </div>
    </CardHeader>
    <CardContent className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="h-64 min-h-[16rem]" role="img" aria-label="Gráfico de 15 áreas de ARKI por estado de ensamblaje"><ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}><BarChart data={chartData} margin={{ top: 10, right: 16, left: -18, bottom: 8 }} onClick={(state) => { const label = state?.activeLabel; const group = areaGroups.find((entry) => entry.label === label); setSelected(group?.key ?? null); }}><CartesianGrid stroke="#294765" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fill: "#b8cbe0", fontSize: 11 }} axisLine={{ stroke: "#42627e" }} tickLine={false} /><YAxis allowDecimals={false} domain={[0, 8]} tick={{ fill: "#7893af", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "#17345c" }} contentStyle={{ background: "#071426", border: "1px solid #42627e", borderRadius: 6, color: "#edf4ff" }} formatter={(value) => [`${value} áreas`, "Estado"]} /><Bar dataKey="áreas" radius={[5, 5, 0, 0]}>{chartData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Bar></BarChart></ResponsiveContainer></div>
        <div className="space-y-2" aria-label="Filtros de estado de áreas">{areaGroups.map((group) => <button key={group.key} type="button" onClick={() => setSelected(selected === group.key ? null : group.key)} className={`w-full rounded-lg border p-3 text-left transition-colors ${selected === group.key ? "border-[#edf4ff] bg-[#17345c]" : "border-[#294765] bg-[#071426] hover:bg-[#17345c]"}`}><span className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-sm text-[#edf4ff]"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: group.color }} />{group.label}</span><span className="font-serif text-2xl text-[#edf4ff]">{group.count}</span></span><span className="mt-1 block text-xs leading-5 text-[#7893af]">{group.description}</span></button>)}</div>
      </div>
      {activeGroup && <div className="rounded-lg border border-[#42627e] bg-[#071426] p-4"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f0b35b]"><CheckCircle2 className="h-4 w-4" />{activeGroup.label} · {activeGroup.count} áreas</p><ul className="mt-3 grid gap-2 text-sm text-[#b8cbe0] md:grid-cols-2">{activeGroup.items.map((item) => <li key={item} className="flex gap-2"><span className="text-[#75b9ff]">•</span>{item}</li>)}</ul></div>}
      <div className="rounded-lg border border-[#f0b35b]/30 bg-[#f0b35b]/10 p-4"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f0c77c]"><AlertTriangle className="h-4 w-4" />Gaps abiertos · 5</p><div className="mt-3 grid gap-2 md:grid-cols-2">{gaps.map((gap, index) => <button key={gap} type="button" onClick={() => setSelected(`GAP-${index + 1}`)} className={`flex items-start gap-2 rounded px-2 py-2 text-left text-xs leading-5 transition-colors ${selected === `GAP-${index + 1}` ? "bg-[#f0b35b]/20 text-[#fff1d2]" : "text-[#e3c58d] hover:bg-[#f0b35b]/10"}`}><CircleDashed className="mt-0.5 h-3.5 w-3.5 shrink-0" />{index + 1}. {gap}</button>)}</div><p className="mt-3 text-[11px] leading-5 text-[#c9aa72]">Un gap no significa que ARKI esté inutilizable; señala una frontera que no debe presentarse como resuelta.</p></div>
    </CardContent>
  </Card>;
}
