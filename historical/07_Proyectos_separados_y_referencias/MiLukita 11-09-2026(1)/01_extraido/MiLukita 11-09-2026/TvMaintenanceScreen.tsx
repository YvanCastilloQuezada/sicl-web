import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ShieldAlert, Wifi, RefreshCw } from "lucide-react";

type TvMaintenanceScreenProps = {
  reason?: string;
  onRetry?: () => void;
  watchdogAlerts?: Array<{ key: string; status: string; message: string; observedAt?: string }>;
  showAgentIndicators?: boolean;
  onToggleAgentIndicators?: () => void;
};

export default function TvMaintenanceScreen({ reason, onRetry, watchdogAlerts = [], showAgentIndicators = true, onToggleAgentIndicators }: TvMaintenanceScreenProps) {
  const [qr, setQr] = useState("");
  useEffect(() => {
    const url = `${window.location.origin}/estado-sistema?source=tv-maintenance`;
    void QRCode.toDataURL(url, { width: 240, margin: 2, errorCorrectionLevel: "H", color: { dark: "#07130f", light: "#ffffff" } }).then(setQr).catch(() => setQr(""));
  }, []);
  return (
    <main className="tv-maintenance-screen" role="alert" aria-live="assertive">
      <div className="tv-maintenance-panel">
        <div className="tv-maintenance-icon"><ShieldAlert className="h-12 w-12" aria-hidden="true" /></div>
        <p className="eyebrow text-amber-200">MiLukita LIVE · pausa operativa</p>
        <h1 className="mt-4 font-display text-4xl text-white sm:text-6xl">Volvemos pronto.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">La transmisión está temporalmente en mantenimiento para proteger la integridad del evento. No se procesan nuevas transiciones mientras esta pausa esté activa.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300"><span className="inline-flex items-center gap-2 border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-amber-100"><Wifi className="h-4 w-4" /> Estado: {reason === "kill_switch_active" ? "pausa de seguridad" : "mantenimiento"}</span><span className="border border-white/10 px-4 py-2">Créditos virtuales protegidos</span></div>
        <div className="mt-7 flex flex-col items-center justify-center gap-4 border border-white/10 bg-black/20 p-4 sm:flex-row sm:text-left"><div className="tv-maintenance-qr shrink-0 bg-white p-2">{qr ? <img src={qr} alt="Código QR para consultar el estado del sistema" className="h-40 w-40" /> : <div className="grid h-40 w-40 place-items-center text-xs text-slate-700">QR no disponible</div>}</div><div><p className="text-xs font-bold uppercase tracking-[.14em] text-cyan-200">Consulta móvil</p><p className="mt-2 max-w-xs text-base font-bold leading-6 text-white">Escanea el QR para consultar el estado.</p><p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">Abre la cámara de tu teléfono y apunta al código para ver la información del sistema.</p><p className="mt-2 text-xs text-slate-500">No permite modificar rondas, resultados ni controles operativos.</p></div></div>
        {watchdogAlerts.length ? <section className="tv-maintenance-alerts mt-6 text-left" aria-label="Historial de últimas alertas del Watchdog"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-[.14em] text-amber-200">Últimas alertas de continuidad</p><span className="text-[10px] uppercase tracking-[.12em] text-slate-500">Historial local · máximo 8</span></div><div className="mt-3 space-y-2">{watchdogAlerts.slice(0, 8).map((alert, index) => <div key={`${alert.key}-${alert.message}-${alert.observedAt ?? index}`} className="tv-maintenance-alert"><span className="font-bold text-amber-100">{alert.key}</span><span className="text-slate-300">{alert.message}</span>{alert.observedAt ? <time className="text-xs text-slate-500" dateTime={alert.observedAt}>{new Date(alert.observedAt).toLocaleTimeString()}</time> : null}</div>)}</div></section> : <p className="mt-6 text-sm text-slate-500">No hay alertas detalladas disponibles; el estado se revalidará automáticamente.</p>}
        <p className="mt-4 text-sm text-slate-500">Los resultados oficiales permanecen bajo la autoridad de MJP CORE.</p>
        {onToggleAgentIndicators ? <button type="button" onClick={onToggleAgentIndicators} className="mt-4 border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-white/10">{showAgentIndicators ? "Ocultar indicadores" : "Mostrar indicadores"}</button> : null}
        {onRetry ? <button type="button" onClick={onRetry} className="mt-7 inline-flex items-center gap-2 border border-amber-200/30 bg-amber-200/10 px-5 py-3 text-sm font-bold text-amber-50 hover:bg-amber-200/20"><RefreshCw className="h-4 w-4" /> Reintentar conexión</button> : null}
      </div>
    </main>
  );
}
