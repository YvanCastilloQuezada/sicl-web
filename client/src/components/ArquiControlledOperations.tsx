import React, { useMemo, useState } from "react";
import { CheckCircle2, Hand, Play, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siclClient, type CoreProject } from "@/api/sicl-client";
import { parseArquiOperation, prepareHeightAction, verifyHeightResult, type PreparedAction } from "./arquiOperations";

type Props = { projectId: string; project?: CoreProject; onNavigate: (target: string) => void };

export default function ArquiControlledOperations({ projectId, project, onNavigate }: Props) {
  const { t } = useTranslation();
  const [command, setCommand] = useState("");
  const [prepared, setPrepared] = useState<PreparedAction>();
  const [delegated, setDelegated] = useState(false);
  const [status, setStatus] = useState<{ kind: "info" | "success" | "error"; text: string }>();
  const [busy, setBusy] = useState(false);
  const alternativeIds = useMemo(() => Object.keys(project?.alternatives ?? {}), [project]);

  const execute = async (action: PreparedAction) => {
    setBusy(true); setStatus({ kind: "info", text: t("arqui.p9_executing") });
    try {
      const result = await siclClient.executeSpatialOperation(projectId, { alternative: action.alternative, operation_type: action.operationType, parameters: action.parameters, human_confirmed: true, intent_linkage: ["ARQUI_P9_USER_COMMAND"], knowledge_linkage: ["P8_DESIGN_OPERATIONS"] });
      const verification = verifyHeightResult(result, action);
      setStatus({ kind: verification.verified ? "success" : "error", text: verification.verified ? t("arqui.p9_verified", { alternative: action.alternativeId, floors: action.parameters.floors }) : t("arqui.p9_false_success") });
      if (verification.verified) setPrepared(undefined);
    } catch (error) { setStatus({ kind: "error", text: `${t("arqui.p9_failed")} ${error instanceof Error ? error.message : ""}` }); }
    finally { setBusy(false); }
  };

  const submit = async () => {
    const parsed = parseArquiOperation(command);
    if (parsed.kind === "STOP") { setDelegated(false); setPrepared(undefined); setCommand(""); setStatus({ kind: "info", text: t("arqui.p9_stopped") }); return; }
    if (parsed.kind === "PRESENTATION" && parsed.alternativeId) { onNavigate("comparisons"); setStatus({ kind: "success", text: t("arqui.p9_presentation", { alternative: parsed.alternativeId }) }); setCommand(""); return; }
    if (parsed.kind === "UNSUPPORTED") { setStatus({ kind: "error", text: parsed.reason ?? t("arqui.p9_unsupported") }); return; }
    if (parsed.kind === "INVALID") { setStatus({ kind: "error", text: parsed.reason ?? t("arqui.p9_invalid") }); return; }
    if (parsed.kind === "APPLY_PREPARED") { if (!prepared) { setStatus({ kind: "error", text: t("arqui.p9_no_prepared") }); return; } await execute(prepared); setCommand(""); return; }
    if (parsed.kind === "DELEGATE" && !delegated) { setStatus({ kind: "error", text: t("arqui.p9_delegation_not_active") }); return; }
    const action = prepareHeightAction(projectId, project, parsed, parsed.kind === "DELEGATE" ? "DELEGATED_INPUT" : "EXPLICIT_COMMAND");
    if ("error" in action) { setStatus({ kind: "error", text: action.error }); return; }
    if (parsed.kind === "DELEGATE") { await execute(action); setCommand(""); return; }
    setPrepared(action); setStatus({ kind: "info", text: t("arqui.p9_prepared", { alternative: action.alternativeId, floors: action.parameters.floors }) }); setCommand("");
  };

  return <Card className="border-primary/20 bg-background p-4" aria-label={t("arqui.p9_title")}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("arqui.p9_eyebrow")}</p><h3 className="mt-1 text-lg font-semibold">{t("arqui.p9_title")}</h3><p className="mt-1 text-xs text-muted-foreground">{t("arqui.p9_description")}</p></div><span className={`rounded-full px-2 py-1 text-xs font-semibold ${delegated ? "bg-amber-100 text-amber-900" : "bg-muted text-muted-foreground"}`}>{delegated ? t("arqui.p9_delegation_active") : t("arqui.p9_delegation_inactive")}</span></div>
    <div className="mt-3 flex flex-wrap gap-2"><Button type="button" variant="outline" size="sm" onClick={() => onNavigate("comparisons")}>{t("arqui.p9_show_alternative")}</Button><Button type="button" variant="outline" size="sm" onClick={() => { setDelegated(true); setStatus({ kind: "info", text: t("arqui.p9_delegation_started") }); }} disabled={delegated}><Hand className="mr-2 h-4 w-4" />{t("arqui.p9_start_delegation")}</Button>{delegated && <Button type="button" variant="outline" size="sm" onClick={() => { setDelegated(false); setStatus({ kind: "info", text: t("arqui.p9_stopped") }); }}><Square className="mr-2 h-4 w-4" />{t("arqui.p9_stop")}</Button>}</div>
    <div className="mt-3 flex gap-2"><input value={command} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void submit(); }} placeholder={t("arqui.p9_placeholder")} className="min-w-0 flex-1 rounded border border-input bg-background px-3 py-2 text-sm" aria-label={t("arqui.p9_placeholder")} /><Button type="button" onClick={() => void submit()} disabled={busy || !command.trim()}><Play className="mr-2 h-4 w-4" />{t("arqui.p9_send")}</Button></div>
    {prepared && <div className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950"><p className="font-semibold">{t("arqui.p9_prepared_label")}</p><p className="mt-1">{t("arqui.p9_prepared_detail", { alternative: prepared.alternativeId, floors: prepared.parameters.floors })}</p><Button type="button" className="mt-2" onClick={() => void execute(prepared)} disabled={busy}>{t("arqui.p9_apply")}</Button></div>}
    {status && <div className={`mt-3 flex items-start gap-2 rounded border p-3 text-sm ${status.kind === "success" ? "border-emerald-300 bg-emerald-50 text-emerald-950" : status.kind === "error" ? "border-destructive/30 bg-destructive/10" : "border-border bg-muted/40"}`} role="status">{status.kind === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4" />}<span>{status.text}</span></div>}
    <p className="mt-3 text-xs text-muted-foreground">{t("arqui.p9_scope", { count: alternativeIds.length })}</p>
  </Card>;
}
