import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { SourceInput } from "@/api/sicl-client";
const types = ["OFFICIAL", "SECONDARY", "USER_PROVIDED", "UNKNOWN"];
const fieldClass = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";
const labelClass = "grid gap-1 text-sm font-medium text-foreground";
export default function SourceForm({ onSubmit, busy }: { onSubmit: (input: SourceInput) => Promise<void>; busy?: boolean }) {
  const { t } = useTranslation(); const [form, setForm] = useState<SourceInput>({ source_id: "", source_type: "OFFICIAL", title: "" });
  const set = (key: keyof SourceInput, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return <form className="grid gap-3" onSubmit={async (event) => { event.preventDefault(); await onSubmit(form); setForm({ source_id: "", source_type: "OFFICIAL", title: "" }); }}><h3 className="font-semibold text-foreground">{t("module_ui.create_source")}</h3><label className={labelClass}>{t("phase_a.source_id")}<input className={fieldClass} required value={form.source_id} onChange={(e) => set("source_id", e.target.value)} /></label><label className={labelClass}>{t("module_ui.source_type")}<select className={fieldClass} value={form.source_type} onChange={(e) => set("source_type", e.target.value)}>{types.map((value) => <option key={value}>{value}</option>)}</select></label><label className={labelClass}>{t("module_ui.title")}<input className={fieldClass} required value={form.title} onChange={(e) => set("title", e.target.value)} /></label><label className={labelClass}>{t("ui.url")}<input className={fieldClass} type="url" value={form.url ?? ""} onChange={(e) => set("url", e.target.value)} /></label><button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90" disabled={busy} type="submit">{busy ? t("phase_a.saving") : t("phase_a.create_source")}</button></form>;
}
