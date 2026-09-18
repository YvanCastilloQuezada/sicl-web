import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, Lock, Play, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiErrorMessage, siclClient, type CoreProject } from "@/api/sicl-client";
import { SpatialSvgViewer, type Metrics, type SpatialRepresentation } from "./UPAO001SpatialViewer";
import { buildA14Plan, deriveA14Coverage, readbackA14, type A14Capabilities, type A14Readback, type ArchitecturalRealizationPlan } from "./arquiControlledRealization";
import ArquiArchitecturalReading from "./ArquiArchitecturalReading";
import ArquiDesignCritic from "./ArquiDesignCritic";
import { readArchitecturalResult } from "./arquiArchitecturalReading";
import ArquiControlledRevision from "./ArquiControlledRevision";
import type { ArchitecturalStrategy } from "./arquiArchitecturalSynthesis";
import type { SpatialDesignOrganization } from "./arquiSpatialRealization";

type Props = { projectId: string; project: CoreProject; strategy: ArchitecturalStrategy; organization: SpatialDesignOrganization };

type Result = Record<string, unknown>;

function asCapabilities(value: unknown): A14Capabilities {
  return value && typeof value === "object" && !Array.isArray(value) ? value as A14Capabilities : {};
}

function asAlternative(project: CoreProject): Record<string, unknown> | undefined {
  const alternatives = project.alternatives;
  if (!alternatives || typeof alternatives !== "object" || Array.isArray(alternatives)) return undefined;
  const [alternativeId, raw] = Object.entries(alternatives)[0] ?? [];
  return alternativeId ? { alternative_id: alternativeId, project_id: project.project_id, ...(raw && typeof raw === "object" ? raw as Record<string, unknown> : {}) } : undefined;
}

export default function ArquiControlledRealization({ projectId, project, strategy, organization }: Props) {
  const { t, i18n } = useTranslation();
  const [capabilities, setCapabilities] = useState<A14Capabilities>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<Result>();
  const [result, setResult] = useState<Result>();
  const [readback, setReadback] = useState<A14Readback>();
  const [error, setError] = useState("");
  const alternative = useMemo(() => asAlternative(project), [project]);
  const plan = useMemo<ArchitecturalRealizationPlan>(() => buildA14Plan(strategy, organization, alternative, capabilities), [alternative, capabilities, organization, strategy]);
  const coverage = useMemo(() => deriveA14Coverage(organization, capabilities), [capabilities, organization]);
  const firstStep = plan.steps[0];

  useEffect(() => {
    let active = true;
    setLoading(true);
    const capabilitiesReader = (siclClient as typeof siclClient & { spatialOperationCapabilities?: (id: string) => Promise<Record<string, unknown>> }).spatialOperationCapabilities;
    if (!capabilitiesReader) {
      if (active) setCapabilities({ CREATE_COURTYARD: { status: "AVAILABLE" }, SET_GAP: { status: "AVAILABLE" }, SCALE_MASS: { status: "AVAILABLE" }, CHANGE_HEIGHT: { status: "AVAILABLE" }, CREATE_SPINE: { status: "NOT_CURRENTLY_SUPPORTED" } });
      setLoading(false);
      return () => { active = false; };
    }
    void capabilitiesReader(projectId)
      .then((payload) => {
        const value = payload.capabilities;
        if (active) setCapabilities(asCapabilities(value));
      })
      .catch((reason) => { if (active) setError(apiErrorMessage(reason)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [projectId]);

  const operationPayload = firstStep && alternative ? { alternative, operation_type: firstStep.operationType, parameters: firstStep.parameters, intent_linkage: plan.sourceIntent, knowledge_linkage: ["P8_DESIGN_OPERATIONS", "A14_REALIZATION_PLAN"], controls: {} } : undefined;
  const runPreview = async () => {
    if (!operationPayload) return;
    setBusy(true); setError("");
    try { setPreview(await siclClient.previewSpatialOperation(projectId, operationPayload)); }
    catch (reason) { setError(apiErrorMessage(reason)); }
    finally { setBusy(false); }
  };
  const execute = async () => {
    if (!operationPayload || plan.executionStatus !== "PREPARED") return;
    setBusy(true); setError("");
    try {
      const executed = await siclClient.executeSpatialOperation(projectId, { ...operationPayload, human_confirmed: true });
      setResult(executed);
      setReadback(readbackA14(executed, plan, String(alternative?.alternative_id ?? "")));
    } catch (reason) { setError(apiErrorMessage(reason)); }
    finally { setBusy(false); }
  };
  const representation = result?.after_representation as SpatialRepresentation | undefined;
  const metrics = result?.metrics_after as Metrics | undefined;

  return <Card className="border-primary/30 bg-background p-4" aria-label="A14 controlled architectural geometric realization">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">A14 · {t("arqui.a14_eyebrow")}</p><h3 className="mt-1 text-lg font-semibold">{t("arqui.a14_title")}</h3><p className="mt-1 text-xs text-muted-foreground">{t("arqui.a14_description")}</p></div>
      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${plan.status === "SUPPORTED" ? "bg-emerald-100 text-emerald-900" : plan.status === "PARTIAL" ? "bg-amber-100 text-amber-900" : "bg-muted text-muted-foreground"}`}>{plan.status}</span>
    </div>
    <div className="mt-3 grid gap-3 sm:grid-cols-3"><div className="rounded border border-border p-3"><p className="text-xs text-muted-foreground">{t("arqui.a14_source")}</p><p className="mt-1 text-sm font-semibold">{String(alternative?.alternative_id ?? t("arqui.a14_missing_alternative"))}</p></div><div className="rounded border border-border p-3"><p className="text-xs text-muted-foreground">{t("arqui.a14_strategy")}</p><p className="mt-1 text-sm font-semibold">{strategy.family}</p></div><div className="rounded border border-border p-3"><p className="text-xs text-muted-foreground">{t("arqui.a14_authority")}</p><p className="mt-1 text-sm font-semibold">{t("arqui.a14_human_required")}</p></div></div>
    <div className="mt-3 rounded border border-border p-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("arqui.a14_coverage")}</p><div className="mt-2 grid gap-2 md:grid-cols-2">{coverage.map((item) => <div key={`${item.concept}-${item.operation}`} className="rounded border border-border p-2 text-sm"><div className="flex items-center justify-between gap-2"><span className="font-semibold">{item.concept}</span><span className="text-xs">{item.operationStatus}</span></div><p className="mt-1 text-xs text-muted-foreground">{item.operation} · {item.executable ? t("arqui.a14_executable") : t("arqui.a14_not_executable")}</p>{item.expectedLoss.length > 0 && <p className="mt-1 text-xs text-amber-700">{item.expectedLoss.join(" ")}</p>}</div>)}</div></div>
    <div className="mt-3 rounded border border-primary/20 bg-primary/5 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("arqui.a14_plan")}</p>{plan.steps.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">{plan.unresolvedRequirements.join(" ")}</p> : <div className="mt-2 space-y-2">{plan.steps.map((step) => <div key={`${step.order}-${step.operationType}`} className="rounded border border-border bg-background p-2 text-sm"><p className="font-semibold">{step.order}. {step.operationType}</p><p className="mt-1 text-xs text-muted-foreground">{step.purpose}</p><p className="mt-1 text-xs">{t("arqui.a14_parameters")}: {JSON.stringify(step.parameters)} · {t("arqui.a14_source_label")}: {step.parameterSource.join(", ")}</p></div>)}</div>}<p className="mt-2 text-xs text-muted-foreground">{t("arqui.a14_no_silent_degradation")}</p></div>
    <div className="mt-3 flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => void runPreview()} disabled={busy || loading || !operationPayload}><Eye className="mr-2 h-4 w-4" />{t("arqui.a14_preview")}</Button><Button type="button" onClick={() => void execute()} disabled={busy || plan.executionStatus !== "PREPARED" || !operationPayload}><Play className="mr-2 h-4 w-4" />{t("arqui.a14_execute")}</Button><span className="inline-flex items-center rounded border border-border px-3 py-2 text-xs text-muted-foreground"><Lock className="mr-2 h-3.5 w-3.5" />{t("arqui.a14_explicit_confirmation")}</span></div>
    {preview && <div className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950" role="status"><p className="font-semibold">{t("arqui.a14_preview_ready")}</p><p className="mt-1">{t("arqui.a14_preview_boundary")}</p><p className="mt-1 text-xs">{t("arqui.a14_predicted_effect")}: {String((preview.metrics_after as Record<string, unknown> | undefined)?.gross_massing_area ?? "—")} · {String(preview.proposed_child && typeof preview.proposed_child === "object" ? (preview.proposed_child as Record<string, unknown>).alternative_id : "—")}</p></div>}
    {error && <div className="mt-3 flex items-start gap-2 rounded border border-destructive/30 bg-destructive/10 p-3 text-sm" role="alert"><ShieldAlert className="mt-0.5 h-4 w-4" />{error}</div>}
    {readback && <div className="mt-3 rounded border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-950" role="status"><p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4" />{t("arqui.a14_readback")}: {readback.intentPreservation}</p><p className="mt-1 text-xs">{t("arqui.a14_source_result")}: {readback.sourceAlternativeId} → {readback.resultAlternativeId ?? "—"}</p><p className="mt-1 text-xs">{readback.preservationEvidence.join(" · ") || t("arqui.a14_unknown_preservation")}</p><p className="mt-1 text-xs">{readback.falseSuccess ? t("arqui.a14_false_success") : t("arqui.a14_geometry_verified")}</p></div>}
    {representation && <div className="mt-3"><SpatialSvgViewer representation={representation} metrics={metrics} language={i18n.language.split("-")[0]} /></div>}
    {representation && <div className="mt-3"><ArquiArchitecturalReading representation={representation} organization={organization} plan={plan} /></div>}
    {representation && <div className="mt-3"><ArquiDesignCritic reading={readArchitecturalResult(representation, organization, plan)} /></div>}
    {representation && <div className="mt-3"><ArquiControlledRevision projectId={projectId} project={project} representation={representation} organization={organization} realizationPlan={plan} /></div>}
    <p className="mt-3 text-xs text-muted-foreground">{t("arqui.a14_no_decision")}</p>
  </Card>;
}
