import { useMemo, useState } from "react";
import { ChevronDown, Copy, ListFilter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GUIDED_CATALOGS, type GuidedCatalogKey } from "@/content/guided-catalogs";
import { toast } from "sonner";

const CATALOG_KEYS: GuidedCatalogKey[] = ["spatialScopes", "temporalScopes", "stages", "epistemicStates", "variableTypes", "feasibilityStates", "evidenceTypes", "authorityLevels", "actorRoles", "recommendationStates", "reviewStates", "decisionStates", "simulationMethods", "generationMethods", "commandFamilies"];

export default function GuidedCatalogPanel() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<GuidedCatalogKey>("spatialScopes");
  const values = useMemo(() => GUIDED_CATALOGS[selected].filter((value) => value.toLowerCase().includes(filter.toLowerCase())), [filter, selected]);
  const copyValue = async (value: string) => { await navigator.clipboard?.writeText(value); toast.success(t("guided.catalog_copied", { value })); };
  return <Card className="border-[#b9c4bd] bg-[#fbfaf6] shadow-none">
    <CardHeader className="pb-3"><div className="flex flex-wrap items-center justify-between gap-3"><CardTitle className="flex items-center gap-2 font-serif text-xl"><ListFilter className="h-5 w-5 text-[#d07b4a]" />{t("guided.catalog_title")}</CardTitle><Button type="button" variant="outline" size="sm" onClick={() => setOpen((value) => !value)} aria-expanded={open}>{open ? t("guided.catalog_hide") : t("guided.catalog_show")}<ChevronDown className="ml-2 h-4 w-4" /></Button></div><p className="text-sm text-[#718078]">{t("guided.catalog_description")}</p></CardHeader>
    {open && <CardContent className="space-y-3"><div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]"><select value={selected} onChange={(event) => setSelected(event.target.value as GuidedCatalogKey)} aria-label={t("guided.catalog_select" )} className="h-10 rounded border border-[#b9c4bd] bg-white px-3 text-sm text-[#1d2925]">{CATALOG_KEYS.map((key) => <option key={key} value={key}>{t(`guided.catalogs.${key}`)}</option>)}</select><Input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder={t("guided.catalog_filter")} className="border-[#b9c4bd] bg-white text-[#1d2925] placeholder:text-[#718078]" /></div><div className="flex flex-wrap gap-2" aria-live="polite">{values.map((value) => <button type="button" key={value} onClick={() => void copyValue(value)} className="group rounded border border-[#d7d8cf] bg-white px-3 py-2 text-left text-xs text-[#385348] transition-colors hover:border-[#d07b4a] hover:bg-[#fff4ec] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#385348]" title={t("guided.catalog_copy")}><span>{value}</span><Copy className="ml-2 inline h-3 w-3 opacity-50 group-hover:opacity-100" /></button>)}{values.length === 0 && <p className="text-sm text-[#718078]">{t("guided.catalog_empty")}</p>}</div></CardContent>}
  </Card>;
}
