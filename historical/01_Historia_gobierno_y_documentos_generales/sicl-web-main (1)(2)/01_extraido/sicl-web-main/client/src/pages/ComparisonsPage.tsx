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
  const submit = async (input: ComparisonInput) => { setBusy(true); setError(""); try { await siclClient.createComparison(projectId, input); setMessage(t("page.comparison_created")); await refresh(); } catch (err) { setError(apiErrorMessage(err)); } finally { setBusy(false); } };
  return <PhaseAPageLayout active="comparisons" projectId={projectId}><section className="space-y-6"><header className="border-b border-border pb-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">ARKI Core v2.2 · /v1</p><h1 className="mt-2 font-serif text-4xl tracking-[-0.04em]">{t("module_ui.comparisons")}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{t("page.comparisons_description")}</p></header><label>ID del proyecto<input value={projectId} onChange={(e) => setProjectId(e.target.value)} /></label>{message && <p role="status" className="border border-[#b9c4bd] bg-[#eef1eb] p-3 text-sm text-[#385348]">{message}</p>}{error && <p role="alert" className="border border-[#d07b4a] bg-[#fff3eb] p-3 text-sm text-[#7a4327]">{error}</p>}<ComparisonForm busy={busy} onSubmit={submit} />{loading ? <div className="border"><CoreTableSkeleton columns={4} /></div> : <div className="overflow-x-auto border"><table><thead><tr><th>{t("phase_a.comparison_id")}</th><th>{t("module_ui.alternatives")}</th><th>{t("module_ui.objectives")}</th><th>{t("phase_a.created")}</th></tr></thead><tbody>{items.map((item, index) => <tr key={String(item.comparison_id ?? index)}><td>{String(item.comparison_id ?? "—")}</td><td>{(item.alternative_ids ?? item.alternatives ?? []).join(", ")}</td><td>{(item.objectives ?? []).join(", ") || "—"}</td><td>{String(item.created_at ?? "—")}</td></tr>)}{items.length === 0 && <tr><td colSpan={4}>{t("module_ui.no_comparisons")}</td></tr>}</tbody></table></div>}</section></PhaseAPageLayout>;
}
