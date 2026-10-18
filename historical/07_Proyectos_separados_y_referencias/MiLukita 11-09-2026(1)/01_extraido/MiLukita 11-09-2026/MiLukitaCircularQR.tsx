import { useState } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { getCircularQrPresentation, type CircularQrSource, type CircularQrVariant } from "../../../shared/circularQr";
import { isQrExpiringSoon } from "../../../shared/manifestTiming";
import { buildCircularQrSvg, getTimerArcSegments, type TimerPalette } from "../lib/customQrGenerator";

const variantLabels: Record<CircularQrVariant, string> = {
  central: "L Central",
  circle: "L en Círculo",
  integrated: "L Integrada",
};

export default function MiLukitaCircularQR({ source, variant = "circle", size = 260, timerProgress, timerPalette, timerRemainingSeconds }: { source: CircularQrSource; variant?: CircularQrVariant; size?: number; timerProgress?: number; timerPalette?: Partial<TimerPalette>; timerRemainingSeconds?: number }) {
  const [renderFailed, setRenderFailed] = useState(false);
  const presentation = getCircularQrPresentation(source, variant);
  const normalizedTimerProgress = timerProgress === undefined ? undefined : Math.max(0, Math.min(100, timerProgress));
  const expiringSoon = isQrExpiringSoon(timerRemainingSeconds);
  const circularSvg = presentation.matrix ? buildCircularQrSvg(presentation.matrix, { size, label: variantLabels[variant], accentColor: variant === "integrated" ? "#27d3b2" : "#f5c96a", backgroundColor: "#071a12", variant, timerProgress: normalizedTimerProgress, timerPalette }) : null;
  const canRender = Boolean(presentation.available && (circularSvg || presentation.imageDataUrl) && !renderFailed);

  if (!canRender) {
    return <div className="grid place-items-center border border-dashed border-rose-200/30 bg-black/20 p-5 text-center text-xs text-rose-100" style={{ width: size, minHeight: size }} role="status"><AlertTriangle className="mb-2 h-7 w-7 text-rose-200" /><span>{renderFailed ? "QR circular no disponible · QR estándar requerido" : "Sin código escaneable"}</span></div>;
  }

  return <div className={`milukita-circular-qr milukita-circular-qr--${variant}${expiringSoon ? " milukita-circular-qr--expiring" : ""}`} data-qr-variant={variant} data-qr-expiring={expiringSoon ? "true" : "false"} data-qr-payload={presentation.payload ? "authoritative" : "missing"} style={{ width: size, height: size }} role="img" aria-label={`${variantLabels[variant]} · QR autoritativo MiLukita`}>
    <img src={circularSvg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(circularSvg)}` : presentation.imageDataUrl ?? undefined} alt="QR autoritativo MiLukita" onError={() => setRenderFailed(true)} />
    {!circularSvg && <><span className="milukita-circular-qr__ring" aria-hidden="true" /><span className="milukita-circular-qr__brand" aria-hidden="true"><strong>L</strong><small>MiLukita</small></span></>}
    {normalizedTimerProgress !== undefined && <svg className="milukita-circular-qr__timer-svg" viewBox="0 0 100 100" role="img" aria-label={`Tiempo transcurrido: ${Math.round(normalizedTimerProgress)} por ciento`}><circle cx="50" cy="50" r="47.5" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="2.5" />{getTimerArcSegments(100, normalizedTimerProgress, timerPalette).map(({ d, color }) => <path key={`${color}-${d}`} d={d} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />)}</svg>}
    {expiringSoon && <span className="milukita-circular-qr__warning" role="alert" aria-live="assertive">Código QR expira en {timerRemainingSeconds}s</span>}
    <span className="milukita-circular-qr__label"><ShieldCheck className="h-3 w-3" /> {variantLabels[variant]}</span>
  </div>;
}
