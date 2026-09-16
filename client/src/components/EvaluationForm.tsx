import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { EvaluationInput } from "@/api/sicl-client";
export default function EvaluationForm({ onSubmit, busy }: { onSubmit: (input: EvaluationInput) => Promise<void>; busy?: boolean }) {
  const { t } = useTranslation();
  const [form, setForm] = useState<EvaluationInput>({ alternative: "", objective: "", value: 0, unit: "", confidence: "1.0", source: "USER_INPUT" });
  const set = (key: keyof EvaluationInput, value: string | number) => setForm((current) => ({ ...current, [key]: value }));
  return <form className="grid gap-3 border p-4" onSubmit={async (event) => { event.preventDefault(); await onSubmit(form); setForm({ alternative: "", objective: "", value: 0, unit: "", confidence: "1.0", source: "USER_INPUT" }); }}><h3 className="font-semibold">Crear Evaluation</h3><label>Alternative<input required value={form.alternative} onChange={(e) => set("alternative", e.target.value)} /></label><label>Objective<input required value={form.objective} onChange={(e) => set("objective", e.target.value)} /></label><label>Value<input required type="number" value={form.value} onChange={(e) => set("value", Number(e.target.value))} /></label><label>Unit<input value={form.unit ?? ""} onChange={(e) => set("unit", e.target.value)} /></label><label>Confidence<input value={form.confidence ?? ""} onChange={(e) => set("confidence", e.target.value)} /></label><label>Source<input value={form.source ?? ""} onChange={(e) => set("source", e.target.value)} /></label><button disabled={busy} type="submit">{busy ? t("phase_a.saving") : t("phase_a.create_evaluation")}</button></form>;
}
