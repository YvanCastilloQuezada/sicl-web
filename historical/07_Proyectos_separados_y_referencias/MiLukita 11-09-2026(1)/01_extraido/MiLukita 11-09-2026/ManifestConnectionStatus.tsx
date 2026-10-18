import { CheckCircle2, Loader2, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ManifestConnectionState } from "../../../shared/manifestUi";
import { MILUKITA_BRAND } from "../../../shared/brandSystem";

type Props = {
  state: ManifestConnectionState;
  detail?: string;
  refreshing?: boolean;
  compact?: boolean;
};

const copy: Record<ManifestConnectionState, { label: string; detail: string }> = {
  loading: { label: "Cargando manifest", detail: `Conectando con ${MILUKITA_BRAND.tvName}…` },
  connected: { label: "Manifest conectado", detail: "Estado recibido desde el servidor" },
  disconnected: { label: "Manifest desconectado", detail: "Conservando el último estado verificable" },
};

export default function ManifestConnectionStatus({ state, detail, refreshing = false, compact = false }: Props) {
  const content = copy[state];
  const Icon = state === "loading" ? Loader2 : state === "connected" ? CheckCircle2 : WifiOff;
  const tone = state === "loading" ? "text-slate-300" : state === "connected" ? "text-emerald-200" : "text-amber-200";
  const dotTone = state === "loading" ? "bg-slate-300" : state === "connected" ? "bg-emerald-300" : "bg-amber-300";
  return <div className={`manifest-status-shell flex items-center gap-3 border ${compact ? "px-3 py-2" : "px-4 py-3"} ${state === "disconnected" ? "border-amber-200/25 bg-amber-200/10" : state === "loading" ? "border-white/10 bg-white/5" : "border-emerald-300/20 bg-emerald-300/8"}`} role="status" aria-live="polite" aria-label={content.label}>
    <span className={`manifest-status-dot relative grid shrink-0 place-items-center rounded-full ${compact ? "h-7 w-7" : "h-9 w-9"} ${state === "disconnected" ? "bg-amber-200/15" : state === "loading" ? "bg-white/10" : "bg-emerald-300/15"}`}>
      <span className={`absolute inset-1 rounded-full ${dotTone} opacity-30`} aria-hidden="true" />
      <Icon className={`relative z-10 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${tone} ${state === "loading" || refreshing ? "animate-spin" : ""}`} />
    </span>
    <span className="min-w-0 flex-1">
      <span className={`block text-xs font-bold ${tone}`}>{refreshing && state === "connected" ? "Actualizando manifest" : content.label}</span>
      {!compact ? <span className="mt-0.5 block truncate text-xs text-slate-400">{detail ?? content.detail}</span> : null}
    </span>
    {!compact && state === "connected" ? <Badge className="border border-emerald-300/20 bg-emerald-300/10 text-[10px] text-emerald-100">{MILUKITA_BRAND.technicalCore}</Badge> : null}
  </div>;
}
