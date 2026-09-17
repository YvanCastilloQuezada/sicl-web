import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { EvaluationInput } from "@/api/sicl-client";

const fieldClass = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";
const labelClass = "grid gap-1 text-sm font-medium text-foreground";

export default function EvaluationForm({ onSubmit, busy }: { onSubmit: (input: EvaluationInput) => Promise<void>; busy?: boolean }) {
  const { t } = useTranslation();
  const [form, setForm] = useState<EvaluationInput>({ alternative: "", objective: "", value: 0, unit: "", confidence: "1.0", source: "USER_INPUT" });
  const set = (key: keyof EvaluationInput, value: string | number) => setForm((current) => ({ ...current, [key]: value }));
  return <form className="grid gap-3" onSubmit={async (event) => { event.preventDefault(); await onSubmit(form); setForm({ alternative: "", objective: "", value: 0, unit: "", confidence: "1.0", source: "USER_INPUT" }); }}>
    <h3 className="font-semibold text-foreground">{t("gate.evaluation_title")}</h3>
    <label className={labelClass}>{t("gate.alternative")}<input className={fieldClass} required value={form.alternative} onChange={(e) => set("alternative", e.target.value)} /></label>
    <label className={labelClass}>{t("gate.objective")}<input className={fieldClass} required value={form.objective} onChange={(e) => set("objective", e.target.value)} /></label>
    <label className={labelClass}>{t("gate.value")}<input className={fieldClass} required type="number" value={form.value} onChange={(e) => set("value", Number(e.target.value))} /></label>
    <label className={labelClass}>{t("gate.unit")}<input className={fieldClass} value={form.unit ?? ""} onChange={(e) => set("unit", e.target.value)} /></label>
    <label className={labelClass}>{t("gate.confidence")}<input className={fieldClass} value={form.confidence ?? ""} onChange={(e) => set("confidence", e.target.value)} /></label>
    <label className={labelClass}>{t("gate.source")}<input className={fieldClass} value={form.source ?? ""} onChange={(e) => set("source", e.target.value)} /></label>
    <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90" disabled={busy} type="submit">{busy ? t("phase_a.saving") : t("phase_a.create_evaluation")}</button>
  </form>;
}
