import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ComparisonInput } from "@/api/sicl-client";
const fieldClass = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";
const labelClass = "grid gap-1 text-sm font-medium text-foreground";
export default function ComparisonForm({ onSubmit, busy }: { onSubmit: (input: ComparisonInput) => Promise<void>; busy?: boolean }) {
  const [alternatives, setAlternatives] = useState(""); const [objectives, setObjectives] = useState(""); const { t } = useTranslation();
  return <form className="grid gap-3" onSubmit={async (event) => { event.preventDefault(); const values = alternatives.split(",").map((item) => item.trim()).filter(Boolean); if (values.length < 2) return; await onSubmit({ alternatives: values, objectives: objectives.split(",").map((item) => item.trim()).filter(Boolean) }); setAlternatives(""); setObjectives(""); }}><h3 className="font-semibold text-foreground">{t("module_ui.create_comparison")}</h3><label className={labelClass}>{t("ui.alternatives_min")}<input className={fieldClass} required value={alternatives} onChange={(e) => setAlternatives(e.target.value)} /></label><label className={labelClass}>{t("ui.objectives_optional")}<input className={fieldClass} value={objectives} onChange={(e) => setObjectives(e.target.value)} /></label><button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90" disabled={busy} type="submit">{busy ? t("phase_a.saving") : t("phase_a.create_comparison")}</button></form>;
}
