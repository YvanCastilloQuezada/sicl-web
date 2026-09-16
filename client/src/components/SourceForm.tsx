import { useState } from "react";
import type { SourceInput } from "@/api/sicl-client";
const types = ["OFFICIAL", "SECONDARY", "USER_PROVIDED", "UNKNOWN"];
export default function SourceForm({ onSubmit, busy }: { onSubmit: (input: SourceInput) => Promise<void>; busy?: boolean }) {
  const [form, setForm] = useState<SourceInput>({ source_id: "", source_type: "OFFICIAL", title: "" });
  const set = (key: keyof SourceInput, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return <form className="grid gap-3 border p-4" onSubmit={async (event) => { event.preventDefault(); await onSubmit(form); setForm({ source_id: "", source_type: "OFFICIAL", title: "" }); }}><h3 className="font-semibold">Crear Source</h3><label>Source ID<input required value={form.source_id} onChange={(e) => set("source_id", e.target.value)} /></label><label>Source type<select value={form.source_type} onChange={(e) => set("source_type", e.target.value)}>{types.map((value) => <option key={value}>{value}</option>)}</select></label><label>Title<input required value={form.title} onChange={(e) => set("title", e.target.value)} /></label><label>URL<input type="url" value={form.url ?? ""} onChange={(e) => set("url", e.target.value)} /></label><button disabled={busy} type="submit">{busy ? "Guardando…" : "Crear Source"}</button></form>;
}
