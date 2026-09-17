import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PhaseAPageLayout from "@/components/PhaseAPageLayout";
import { apiErrorMessage, siclClient, type Comparison, type ComparisonInput } from "@/api/sicl-client";
import ComparisonForm from "@/components/ComparisonForm";
import CoreTableSkeleton from "@/components/CoreTableSkeleton";
const projectFromUrl = () => new URLSearchParams(window.location.search).get("project") || "TEST-API-001";
export default function ComparisonsPage() {
  const { t } = useTranslation();
  const [projectId, setProjectId] = useState(projectFromUrl); const [items, setItems] = useState<Comparison[]>([]); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const [loading, setLoading] = useState(true);
  const refresh = async () => { try { setLoading(true); setItems(await siclClient.listComparisons(projectId)); setError(""); } catch (err) { setError(apiErrorMessage(err)); } finally { setLoading(false); } };
  useEffect(() => { void refresh(); }, [projectId]);
  const submit = async (input: ComparisonInput) => { setBusy(true); setError(""); try { await siclClient.createComparison(projectId, input); setMessage("Comparison creada"); await refresh(); } catch (err) { setError(apiErrorMessage(err)); } finally { setBusy(false); } };
  return <PhaseAPageLayout active="comparisons"><section className="space-y-6"><header className="border-b border-border pb-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">SiMS-DeI Core v2.2 · /v1</p><h1 className="mt-2 font-serif text-4xl tracking-[-0.04em]">Comparisons</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Comparaciones de alternativas y objetivos; no registran una Decision.</p></header><label>Project ID<input value={projectId} onChange={(e) => setProjectId(e.target.value)} /></label>{message && <p role="status" className="border border-[#b9c4bd] bg-[#eef1eb] p-3 text-sm text-[#385348]">{message}</p>}{error && <p role="alert" className="border border-[#d07b4a] bg-[#fff3eb] p-3 text-sm text-[#7a4327]">{error}</p>}<ComparisonForm busy={busy} onSubmit={submit} />{loading ? <div className="border"><CoreTableSkeleton columns={4} /></div> : <div className="overflow-x-auto border"><table><thead><tr><th>comparison_id</th><th>alternatives</th><th>objectives</th><th>created_at</th></tr></thead><tbody>{items.map((item, index) => <tr key={String(item.comparison_id ?? index)}><td>{String(item.comparison_id ?? "—")}</td><td>{(item.alternative_ids ?? item.alternatives ?? []).join(", ")}</td><td>{(item.objectives ?? []).join(", ") || "—"}</td><td>{String(item.created_at ?? "—")}</td></tr>)}{items.length === 0 && <tr><td colSpan={4}>No Comparisons registradas.</td></tr>}</tbody></table></div>}</section></PhaseAPageLayout>;
}
