import React, { useMemo, useState } from "react";
import { CheckCircle2, Lock, Play, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiErrorMessage, siclClient, type CoreProject } from "@/api/sicl-client";
import { critiqueArchitecturalDesign } from "./arquiDesignCritic";
import { readArchitecturalResult } from "./arquiArchitecturalReading";
import { applyRevisionResult, authorizeRevision, prepareRevision, supportedRevisionHypothesis, type ArchitecturalRevisionPlan } from "./arquiControlledRevision";
import type { ArchitecturalRealizationPlan } from "./arquiControlledRealization";
import type { SpatialDesignOrganization } from "./arquiSpatialRealization";
import type { SpatialRepresentation } from "./UPAO001SpatialViewer";

type Props = { projectId: string; project: CoreProject; representation: SpatialRepresentation; organization: SpatialDesignOrganization; realizationPlan: ArchitecturalRealizationPlan };
export default function ArquiControlledRevision({ projectId, project, representation, organization, realizationPlan }: Props) {
  const { t } = useTranslation();
  const beforeReading = useMemo(() => readArchitecturalResult(representation, organization, realizationPlan), [organization, realizationPlan, representation]);
  const beforeCritique = useMemo(() => critiqueArchitecturalDesign({ reading: beforeReading }), [beforeReading]);
  const [gap, setGap] = useState("6");
  const [plan, setPlan] = useState<ArchitecturalRevisionPlan>();
  const [result, setResult] = useState<Record<string, unknown>>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const hypothesis = supportedRevisionHypothesis();
  const select = () => { const prepared = prepareRevision(hypothesis, beforeReading, { mass_separation: Number(gap), target: "ALL_MASSES" }, true); setPlan(prepared); };
  const authorize = () => { if (plan) setPlan(authorizeRevision(plan, true)); };
  const execute = async () => {
    if (!plan || plan.executionState !== "AUTHORIZED") return;
    setBusy(true); setError("");
    try {
      const alternatives = project.alternatives && typeof project.alternatives === "object" && !Array.isArray(project.alternatives) ? project.alternatives as Record<string, unknown> : {};
      const source = alternatives[representation.alternative_id] && typeof alternatives[representation.alternative_id] === "object" ? { alternative_id: representation.alternative_id, project_id: project.project_id, ...(alternatives[representation.alternative_id] as Record<string, unknown>) } : undefined;
      if (!source) throw new Error("A17 source alternative is not available");
      const executed = await siclClient.executeSpatialOperation(projectId, { alternative: source, operation_type: "SET_GAP", parameters: plan.parameters, intent_linkage: ["A16 change hypothesis", "A17 human selection", "A17 human authorization"], knowledge_linkage: ["P8 capability self-knowledge", "A17 revision plan"], controls: {}, human_confirmed: true });
      const postRepresentation = executed.after_representation as SpatialRepresentation | undefined;
      const resultAlternative = executed.proposed_child && typeof executed.proposed_child === "object" ? String((executed.proposed_child as Record<string, unknown>).alternative_id ?? "") : "";
      if (!postRepresentation || !resultAlternative) throw new Error("A17 readback missing actual post-change representation");
      const postReading = readArchitecturalResult(postRepresentation, organization, realizationPlan);
      const postCritique = critiqueArchitecturalDesign({ reading: postReading });
      setResult(executed);
      setPlan(applyRevisionResult(plan, { resultAlternative, geometryChanged: JSON.stringify(representation) !== JSON.stringify(postRepresentation), postReading, postCritique }, beforeCritique));
    } catch (reason) { setError(apiErrorMessage(reason)); }
    finally { setBusy(false); }
  };
  return <Card className="border-primary/30 bg-background p-4" aria-label="A17 controlled architectural revision"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">A17 · {t("arqui.a17_eyebrow")}</p><h3 className="mt-1 text-lg font-semibold">{t("arqui.a17_title")}</h3><p className="mt-1 text-xs text-muted-foreground">{t("arqui.a17_description")}</p></div><span className="rounded-full border border-amber-300 px-2 py-1 text-xs font-semibold text-amber-800">{plan?.executionState ?? "NOT_SELECTED"}</span></div>
    <div className="mt-3 grid gap-3 sm:grid-cols-3"><div className="rounded border border-border p-3"><p className="text-xs text-muted-foreground">{t("arqui.a17_hypothesis")}</p><p className="mt-1 text-sm font-semibold">SET_GAP</p><p className="mt-1 text-xs text-muted-foreground">{t("arqui.a17_supported")}</p></div><div className="rounded border border-border p-3"><p className="text-xs text-muted-foreground">{t("arqui.a17_parameter")}</p><input aria-label={t("arqui.a17_parameter")} className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-sm" type="number" min="0.1" step="0.1" value={gap} onChange={(event) => setGap(event.target.value)} /></div><div className="rounded border border-border p-3"><p className="text-xs text-muted-foreground">{t("arqui.a17_provenance")}</p><p className="mt-1 text-xs">{t("arqui.a17_existing_operation_default")}</p></div></div>
    <div className="mt-3 flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={select} disabled={busy}><CheckCircle2 className="mr-2 h-4 w-4" />{t("arqui.a17_select")}</Button><Button type="button" variant="outline" onClick={authorize} disabled={busy || plan?.executionState !== "PREPARED"}><Lock className="mr-2 h-4 w-4" />{t("arqui.a17_authorize")}</Button><Button type="button" onClick={() => void execute()} disabled={busy || plan?.executionState !== "AUTHORIZED"}><Play className="mr-2 h-4 w-4" />{t("arqui.a17_execute")}</Button></div>
    {plan?.executionState === "PREPARED" && <p className="mt-2 text-xs text-amber-700">{t("arqui.a17_prepared_not_executed")}</p>}{error && <div className="mt-3 rounded border border-destructive/30 bg-destructive/10 p-3 text-sm"><ShieldAlert className="mr-2 inline h-4 w-4" />{error}</div>}{result && plan?.readback && <div className="mt-3 rounded border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-950"><p className="font-semibold">{t("arqui.a17_readback")}: {plan.readback.geometricChangeObserved ? t("arqui.a17_geometry_changed") : t("arqui.a17_false_success")}</p><p className="mt-1 text-xs">{t("arqui.a17_source_result")}: {plan.readback.sourceAlternative} → {plan.readback.resultAlternative}</p><p className="mt-1 text-xs">{t("arqui.a17_transition")}: {plan.reevaluation?.transitions.map((item) => `${item.findingId}=${item.transition}`).join(" · ")}</p><p className="mt-1 text-xs">{t("arqui.a17_no_improvement_claim")}</p></div>}</Card>;
}
