import type { GeneratedBuilding } from "@shared/arkiDynamicFamilies";

type ViewMode = "PLAN" | "SECTION" | "MODEL_3D";
type Quality = "baja" | "media" | "alta" | "ultra";
type Resolution = "hd" | "fullhd" | "2k" | "4k" | "8k" | "16k";

export const RESOLUTIONS: Record<Resolution, { width: number; height: number; label: string }> = { hd: { width: 1280, height: 720, label: "HD 720p" }, fullhd: { width: 1920, height: 1080, label: "Full HD" }, "2k": { width: 2560, height: 1440, label: "2K QHD" }, "4k": { width: 3840, height: 2160, label: "4K UHD" }, "8k": { width: 7680, height: 4320, label: "8K UHD" }, "16k": { width: 15360, height: 8640, label: "16K" } };

const COLORS = { orange: "#ff8958", cream: "#f5d9b5", cyan: "#62d8d0", blue: "#77a9ff", ink: "#101820", grid: "#27343c" };

export default function ProfessionalFamilyViewer({ building, mode = "MODEL_3D", quality = "alta", resolution = "2k" }: { building?: GeneratedBuilding | null; mode?: ViewMode; quality?: Quality; resolution?: Resolution }) {
  const plan = building?.geometry2d ?? { widthM: 80, depthM: 50, footprintM2: 4000, courtyardM2: 0 };
  const section = building?.section ?? { floors: 4, totalHeightM: 14 };
  const width = 440;
  const height = 250;
  const maxW = Math.max(plan.widthM, plan.depthM);
  const scale = Math.min(330 / maxW, 185 / Math.max(plan.depthM, 1));
  const w = plan.widthM * scale;
  const d = plan.depthM * scale;
  const x = (width - w) / 2;
  const y = (height - d) / 2;
  const stackHeight = Math.min(168, Math.max(72, section.totalHeightM * 7));
  const stackWidth = Math.min(310, Math.max(120, w));
  const sx = (width - stackWidth) / 2;
  const sy = 202 - stackHeight;
  const label = mode === "PLAN" ? "PLANTA 2D" : mode === "SECTION" ? "CORTE" : "MODELO 3D";

  return <div className="viewer-shell" data-mode={mode}>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label} de ${building?.name ?? "propuesta vacía"}`}>
      <defs>
        <linearGradient id={`mass-${mode}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={COLORS.orange} stopOpacity=".95" /><stop offset="1" stopColor={COLORS.cream} stopOpacity=".72" /></linearGradient>
        <pattern id={`micro-${mode}`} width="18" height="18" patternUnits="userSpaceOnUse"><path d="M 18 0 L 0 0 0 18" fill="none" stroke={COLORS.grid} strokeWidth=".6" opacity=".42" /></pattern>
        <filter id={`shadow-${mode}`}><feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity=".28" /></filter>
      </defs>
      <rect width="440" height="250" fill={COLORS.ink} />
      <rect x="12" y="12" width="416" height="226" rx="8" fill={`url(#micro-${mode})`} />
      {mode === "PLAN" && <g filter={`url(#shadow-${mode})`}>
        <rect x={x} y={y} width={w} height={d} rx="2" fill="url(#mass-PLAN)" stroke={COLORS.cream} strokeWidth="1.5" />
        {building?.geometry2d.courtyardM2 ? <rect x={x + w * .32} y={y + d * .28} width={w * .36} height={d * .44} fill="#173d3c" stroke={COLORS.cyan} strokeWidth="1.5" strokeDasharray="4 3" /> : null}
        <line x1={x} y1={y + d * .18} x2={x + w} y2={y + d * .18} stroke="#fff" opacity=".24" /><line x1={x} y1={y + d * .8} x2={x + w} y2={y + d * .8} stroke="#fff" opacity=".24" />
        <text x="22" y="30" fill={COLORS.cream} fontSize="9" letterSpacing="2">N ↑</text><text x={x} y={y + d + 15} fill="#92a7ad" fontSize="8">{Math.round(plan.widthM)} m</text><text x={x + w + 8} y={y + d / 2} fill="#92a7ad" fontSize="8" transform={`rotate(90 ${x + w + 8} ${y + d / 2})`}>{Math.round(plan.depthM)} m</text>
      </g>}
      {mode === "SECTION" && <g filter={`url(#shadow-${mode})`}>
        <line x1="38" y1="204" x2="402" y2="204" stroke="#50616a" strokeWidth="1" /><line x1="38" y1="204" x2="38" y2="43" stroke="#50616a" strokeWidth="1" />
        {Array.from({ length: Math.min(section.floors, 18) }, (_, i) => <g key={i}><rect x={sx} y={sy + i * stackHeight / section.floors} width={stackWidth} height={stackHeight / section.floors - 3} fill={i % 2 ? "#efbd8d" : "#ff8958"} fillOpacity=".75" stroke="#f7ddbc" strokeOpacity=".45" /><line x1={sx + 15} x2={sx + stackWidth - 15} y1={sy + i * stackHeight / section.floors + stackHeight / section.floors / 2} y2={sy + i * stackHeight / section.floors + stackHeight / section.floors / 2} stroke="#102028" strokeOpacity=".35" /></g>)}
        <path d={`M ${sx} ${sy} L ${sx + 22} ${sy - 20} L ${sx + stackWidth} ${sy - 20} L ${sx + stackWidth} ${sy}`} fill="#75a8b5" fillOpacity=".35" stroke="#a8e0dd" /><line x1={sx - 18} x2={sx - 18} y1={sy} y2="204" stroke={COLORS.cyan} /><text x={sx - 29} y={sy + stackHeight / 2} fill="#a7ccc9" fontSize="8" transform={`rotate(-90 ${sx - 29} ${sy + stackHeight / 2})`}>{section.totalHeightM} m</text>
      </g>}
      {mode === "MODEL_3D" && <g filter={`url(#shadow-${mode})`}>
        <polygon points={`${sx},${sy + 20} ${sx + stackWidth * .72},${sy} ${sx + stackWidth},${sy + 26} ${sx + stackWidth * .28},${sy + 46}`} fill="#ffd3a5" stroke={COLORS.cream} />
        <polygon points={`${sx},${sy + 20} ${sx + stackWidth * .28},${sy + 46} ${sx + stackWidth * .28},${sy + stackHeight + 20} ${sx},${sy + stackHeight - 6}`} fill="#e9784f" stroke="#ffc29d" />
        <polygon points={`${sx + stackWidth * .28},${sy + 46} ${sx + stackWidth},${sy + 26} ${sx + stackWidth},${sy + stackHeight} ${sx + stackWidth * .28},${sy + stackHeight + 20}`} fill="url(#mass-MODEL_3D)" stroke={COLORS.cream} />
        {Array.from({ length: Math.min(section.floors, 10) }, (_, i) => <line key={i} x1={sx + stackWidth * .28} x2={sx + stackWidth} y1={sy + 46 + (i + 1) * stackHeight / Math.min(section.floors, 10)} y2={sy + 26 + (i + 1) * stackHeight / Math.min(section.floors, 10)} stroke="#633b2c" strokeOpacity=".28" />)}
        <ellipse cx="220" cy="212" rx="148" ry="11" fill="#0a1015" opacity=".5" />
      </g>}
      {!building && <g><circle cx="220" cy="112" r="23" fill="none" stroke={COLORS.orange} strokeDasharray="3 5" /><path d="M220 92v40M200 112h40" stroke={COLORS.orange} opacity=".75" /><text x="220" y="158" fill="#91a6ad" textAnchor="middle" fontSize="10" letterSpacing="1.5">GENERA UNA PROPUESTA</text></g>}
      <text x="24" y="226" fill="#81969d" fontSize="8" letterSpacing="1.6">{label} · {building ? `${building.geometry2d.footprintM2.toLocaleString("es-PE")} m²` : "ESPERANDO DATOS"}</text>
    </svg>
    <div className="viewer-meta"><span>{RESOLUTIONS[resolution].label}</span><span>•</span><span>{quality}</span><span>•</span><span>ARKI geometry</span></div>
  </div>;
}

export { type ViewMode, type Quality, type Resolution };
