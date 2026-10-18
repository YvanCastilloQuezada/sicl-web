import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";

type TvHeartbeatStatusProps = {
  status?: "CONNECTED" | "DISCONNECTED" | "STOPPED";
  ageSeconds?: number | null;
  loading?: boolean;
  reconnecting?: boolean;
};

export default function TvHeartbeatStatus({ status, ageSeconds, loading, reconnecting }: TvHeartbeatStatusProps) {
  const resolved = loading ? "LOADING" : reconnecting ? "RECONNECTING" : status ?? "DISCONNECTED";
  const copy = resolved === "CONNECTED" ? "Heartbeat conectado" : resolved === "STOPPED" ? "Pausa de seguridad" : resolved === "LOADING" ? "Comprobando Heartbeat" : resolved === "RECONNECTING" ? "Reconectando…" : "Heartbeat desconectado";
  const detail = resolved === "CONNECTED" && ageSeconds !== null && ageSeconds !== undefined ? `hace ${ageSeconds}s` : resolved === "DISCONNECTED" ? "conexión inestable · revisión automática" : resolved === "RECONNECTING" ? "intentando recuperar" : "";
  return <div className={`tv-heartbeat-status tv-heartbeat-${resolved.toLowerCase()}`} title="Estado técnico de continuidad del canal" role="status" aria-live="polite">{resolved === "LOADING" || resolved === "RECONNECTING" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : resolved === "CONNECTED" ? <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" /> : <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />}<span>{copy}</span>{detail ? <span className="text-[10px] opacity-70">· {detail}</span> : null}</div>;
}
