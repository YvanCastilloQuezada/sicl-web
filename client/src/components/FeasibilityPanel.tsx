import { useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siclClient, type FeasibilityResult } from "@/api/sicl-client";
import { useTranslation } from "react-i18next";

type Props = { projectId: string };

export default function FeasibilityPanel({ projectId }: Props) {
  const { t } = useTranslation();
  const [alternativeId, setAlternativeId] = useState("ALT-A");
  const [key, setKey] = useState("INVESTMENT");
  const [value, setValue] = useState("90");
  const [result, setResult] = useState<FeasibilityResult>();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function check() {
    setBusy(true); setMessage("");
    try {
      const evaluated = await siclClient.checkFeasibility(projectId, alternativeId, { [key.trim().toUpperCase()]: Number(value) });
      setResult(evaluated);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("core.unknown"));
    } finally { setBusy(false); }
  }

  const stateClass = result?.state === "FEASIBLE" ? "border-[#385348] bg-[#e8f2e6] text-[#385348]" : "border-[#d07b4a] bg-[#fff0e7] text-[#9a3f21]";
  return <Card className="border-[#385348] bg-[#fbfaf6] shadow-none" aria-label="RFC-020"><CardHeader><CardTitle className="flex items-center gap-2 font-serif text-xl"><ShieldCheck className="h-5 w-5 text-[#385348]" /> {t("core.feasibility_title")}</CardTitle><p className="text-sm leading-6 text-[#718078]">{t("core.feasibility_description")}</p></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 md:grid-cols-3"><div><Label htmlFor="feasibility-alternative">{t("core.alternative")}</Label><Input id="feasibility-alternative" value={alternativeId} onChange={(event) => setAlternativeId(event.target.value)} /></div><div><Label htmlFor="feasibility-key">{t("core.variable")}</Label><Input id="feasibility-key" value={key} onChange={(event) => setKey(event.target.value)} /></div><div><Label htmlFor="feasibility-value">{t("core.value")}</Label><Input id="feasibility-value" type="number" value={value} onChange={(event) => setValue(event.target.value)} /></div></div><Button type="button" onClick={() => void check()} disabled={busy} className="bg-[#385348] text-white hover:bg-[#294038]">{busy ? t("core.checking") : t("core.check")}</Button>{result && <div className={`border p-4 ${stateClass}`} role="status">{result.state === "FEASIBLE" ? <CheckCircle2 className="mr-2 inline h-4 w-4" /> : <AlertTriangle className="mr-2 inline h-4 w-4" />}<strong>{result.alternative_id}: {result.state}</strong><p className="mt-1 text-sm">{result.state === "FEASIBLE" ? t("core.feasible") : result.state === "INFEASIBLE" ? t("core.infeasible") : t("core.unknown")}</p></div>}{message && <p role="alert" className="text-sm text-[#9a3f21]">{message}</p>}</CardContent></Card>;
}
