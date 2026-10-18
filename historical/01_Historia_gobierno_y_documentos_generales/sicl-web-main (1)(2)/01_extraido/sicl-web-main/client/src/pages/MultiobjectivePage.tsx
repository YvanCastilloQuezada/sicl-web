import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { apiErrorMessage, siclClient } from "@/api/sicl-client";
import { transformParetoData, type ParetoCoreResponse } from "@/visualization/models/paretoModel";
import ParetoChart from "@/visualization/charts/ParetoChart";
import ChartEmptyState from "@/visualization/charts/ChartEmptyState";
import paretoMock from "@/visualization/mocks/paretoMock.json";

type Props = { projectId?: string };

export default function MultiobjectivePage({ projectId: suppliedProjectId }: Props) {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const [projectId, setProjectId] = useState(suppliedProjectId ?? params.get("project") ?? "");
  const [result, setResult] = useState<ParetoCoreResponse | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    setBusy(true);
    void siclClient.calculatePareto(projectId, { objectives: ["ENERGY_SAVINGS", "CONSTRUCTION_COST"] })
      .then((data) => setResult(data as ParetoCoreResponse))
      .catch((reason) => setError(apiErrorMessage(reason)))
      .finally(() => setBusy(false));
  }, [projectId]);

  const calculate = async () => {
    if (!projectId.trim()) return setError(t("visualization.project_required"));
    setBusy(true); setError("");
    try { setResult(await siclClient.calculatePareto(projectId.trim(), { objectives: ["ENERGY_SAVINGS", "CONSTRUCTION_COST"] }) as ParetoCoreResponse); }
    catch (reason) { setError(apiErrorMessage(reason)); }
    finally { setBusy(false); }
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d07b4a]">Multiobjetivo</p><h1 className="mt-2 font-serif text-4xl tracking-[-0.04em]">{t("visualization.pareto.title")}</h1><p className="mt-2 max-w-2xl text-sm text-[#718078]">{t("visualization.pareto.description")}</p></div><Button variant="outline" onClick={() => navigate("/")}>{t("visualization.back")}</Button></div>
    <Card className="border-[#d4d8d0] bg-[#fbfaf6] shadow-none"><CardHeader><CardTitle className="font-serif text-xl">{t("visualization.pareto.calculate")}</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-3"><Input value={projectId} onChange={(event) => setProjectId(event.target.value)} placeholder={t("visualization.project_id")} className="max-w-sm border-[#b9c4bd] bg-transparent" /><Button onClick={calculate} disabled={busy}>{busy ? t("common.loading") : t("visualization.pareto.calculate")}</Button></CardContent></Card>
    {error && <div role="alert" className="rounded-lg border border-[#d07b4a] bg-[#fff4ed] p-3 text-sm text-[#a95e35]">{error}</div>}
    <ParetoChart data={transformParetoData(result ?? (!projectId ? paretoMock : null))} />
    {!result && projectId && !error && !busy && <ChartEmptyState message={t("visualization.pareto.empty")} />}
  </div>;
}
