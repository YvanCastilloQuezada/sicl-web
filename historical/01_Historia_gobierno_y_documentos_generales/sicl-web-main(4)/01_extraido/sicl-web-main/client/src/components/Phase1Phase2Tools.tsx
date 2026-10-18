import { Copy, FlaskConical, Info, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type EpistemicKind = "FACT" | "ASSUMPTION" | "PREFERENCE";

const epistemicStyle: Record<EpistemicKind, string> = {
  FACT: "border-[#385348] bg-[#dce6dc] text-[#385348]",
  ASSUMPTION: "border-[#d07b4a] bg-[#fbe5d6] text-[#a94524]",
  PREFERENCE: "border-[#8a6d1d] bg-[#f8edbd] text-[#6f5714]",
};

export function EpistemicBadge({ kind, detail }: { kind: EpistemicKind; detail?: string }) {
  const { t } = useTranslation();
  return <Badge variant="outline" title={detail ?? t(`epistemic.${kind.toLowerCase()}_description`)} className={cn("font-semibold tracking-wide", epistemicStyle[kind])}>{t(`epistemic.${kind.toLowerCase()}`)}</Badge>;
}

export function EpistemicLegend() {
  const { t } = useTranslation();
  return <Card className="border-[#d4d8d0] bg-[#fbfaf6] shadow-none"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 font-serif text-xl"><Info className="h-4 w-4 text-[#d07b4a]" /> {t("epistemic.legend_title")}</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-3">{(["FACT", "ASSUMPTION", "PREFERENCE"] as EpistemicKind[]).map((kind) => <div key={kind} className="flex items-start gap-2"><EpistemicBadge kind={kind} /><p className="text-xs leading-5 text-[#718078]">{t(`epistemic.${kind.toLowerCase()}_description`)}</p></div>)}</CardContent></Card>;
}

export function SyntheticDemoCard() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return <Card className="border-[#d07b4a] bg-[#fffaf5] shadow-none"><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="flex items-center gap-2 font-serif text-xl"><FlaskConical className="h-5 w-5 text-[#d07b4a]" /> {t("demo.title")}</CardTitle><p className="mt-2 text-sm leading-6 text-[#718078]">{t("demo.description")}</p></div><Badge variant="outline" className="border-[#d07b4a] bg-[#fbe5d6] text-[#a94524]">{t("demo.synthetic")}</Badge></div></CardHeader><CardContent><Button type="button" onClick={() => setOpen((value) => !value)} className="bg-[#385348] text-white hover:bg-[#294038]">{open ? t("demo.hide") : t("demo.explore")}</Button>{open && <div className="mt-5 grid gap-3 border-t border-[#ead1c2] pt-5 md:grid-cols-3"><div><EpistemicBadge kind="FACT" /><p className="mt-2 text-sm">{t("demo.fact")}</p></div><div><EpistemicBadge kind="ASSUMPTION" /><p className="mt-2 text-sm">{t("demo.assumption")}</p></div><div><EpistemicBadge kind="PREFERENCE" /><p className="mt-2 text-sm">{t("demo.preference")}</p></div></div>}</CardContent></Card>;
}

type BuilderKind = "PROJECT" | "OBJECTIVE" | "HUMAN_REVIEW" | "DECISION";
const builderCommands: Record<BuilderKind, { name: string; fields: string[] }> = {
  PROJECT: { name: "/PROJECT CREATE", fields: ["project_id", "name", "spatial_scope", "temporal_scope"] },
  OBJECTIVE: { name: "/OBJECTIVE SET", fields: ["key", "direction", "value"] },
  HUMAN_REVIEW: { name: "/HUMAN REVIEW", fields: ["actor", "timestamp_utc", "review", "reason", "authority"] },
  DECISION: { name: "/DECISION RECORD", fields: ["statement", "actor", "authority"] },
};

export function CommandBuilder({ onCommandChange }: { onCommandChange?: (command: string) => void }) {
  const { t } = useTranslation();
  const [kind, setKind] = useState<BuilderKind>("PROJECT");
  const [values, setValues] = useState<Record<string, string>>({ project_id: "DEMO-001", name: "Proyecto de demostración", spatial_scope: "PROJECT", temporal_scope: "PRESENT", key: "ENERGY_SAVINGS", direction: "MAXIMIZE", value: "80", actor: "architect", timestamp_utc: new Date().toISOString(), review: "Revisado por arquitecto", reason: "Coherente con los criterios del proyecto", authority: "PROJECT_OWNER", statement: "Aprobar alternativa seleccionada" });
  const definition = builderCommands[kind];
  const generated = useMemo(() => `${definition.name} ${definition.fields.map((field) => values[field]?.trim()).filter(Boolean).map((value) => value.includes(" ") ? JSON.stringify(value) : value).join(" ")}`.trim(), [definition, values]);
  const update = (field: string, value: string) => setValues((previous) => ({ ...previous, [field]: value }));
  const copy = async () => { await navigator.clipboard?.writeText(generated); onCommandChange?.(generated); };
  return <Card className="border-[#385348] bg-[#fbfaf6] shadow-none"><CardHeader><CardTitle className="flex items-center gap-2 font-serif text-xl"><WandSparkles className="h-5 w-5 text-[#d07b4a]" /> {t("builder.title")}</CardTitle><p className="text-sm leading-6 text-[#718078]">{t("builder.description")}</p></CardHeader><CardContent className="space-y-4"><div><Label htmlFor="builder-command">{t("builder.command_type")}</Label><select id="builder-command" value={kind} onChange={(event) => setKind(event.target.value as BuilderKind)} className="mt-2 h-10 w-full border border-[#cbd2c9] bg-white px-3 text-sm">{Object.entries(builderCommands).map(([value, item]) => <option key={value} value={value}>{item.name}</option>)}</select></div><div className="grid gap-3 md:grid-cols-2">{definition.fields.map((field) => <div key={field}><Label htmlFor={`builder-${field}`}>{field}</Label><Input id={`builder-${field}`} value={values[field] ?? ""} onChange={(event) => update(field, event.target.value)} className="mt-1 border-[#cbd2c9] bg-white" /></div>)}</div><div className="border-l-4 border-[#f2c300] bg-[#f8edbd] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[#6f5714]">{t("builder.preview")}</p><code id="builder-preview" className="mt-2 block break-words font-mono text-sm text-[#1d2925]">{generated}</code></div><Button type="button" onClick={() => void copy()} className="bg-[#385348] text-white hover:bg-[#294038]"><Copy className="mr-2 h-4 w-4" />{t("builder.copy")}</Button></CardContent></Card>;
}
