import type { CircularQrVariant } from "@/../../shared/circularQr";

export type QrMatrix = ReadonlyArray<ReadonlyArray<boolean>>;

export { ADMIN_TIMER_PALETTE_STORAGE_KEY, buildPaletteWcagCsv, createRandomTimerVisualProfile, DEFAULT_TIMER_PALETTE, normalizeTimerPalette, timerPaletteContrastReport, TIMER_PALETTE_EVENT, type TimerPalette } from "@/../../shared/qrTimerPalette";
import { DEFAULT_TIMER_PALETTE, normalizeTimerPalette, type TimerPalette } from "@/../../shared/qrTimerPalette";

export type CustomQrVisualConfig = {
  matrix?: QrMatrix;
  size: number;
  label: string;
  accentColor: string;
  backgroundColor: string;
  variant: CircularQrVariant;
  logoDataUrl?: string | null;
  moduleColor?: string;
  timerProgress?: number;
  shape?: "round" | "square";
  timerPalette?: Partial<TimerPalette>;
};

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character] ?? character);

const isFinderCell = (row: number, column: number, size: number) => [[0, 0], [0, size - 7], [size - 7, 0]].some(([startRow, startColumn]) => row >= startRow && row < startRow + 7 && column >= startColumn && column < startColumn + 7);

const polar = (center: number, radius: number, degrees: number) => ({ x: center + radius * Math.cos((degrees * Math.PI) / 180), y: center + radius * Math.sin((degrees * Math.PI) / 180) });
const arcPath = (center: number, radius: number, startDegrees: number, endDegrees: number) => {
  const start = polar(center, radius, startDegrees);
  const end = polar(center, radius, endDegrees);
  const largeArc = endDegrees - startDegrees > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

export function getTimerArcSegments(size: number, timerProgress = 0, timerPalette?: Partial<TimerPalette>) {
  const progress = Math.max(0, Math.min(100, timerProgress));
  const degrees = progress * 2.7;
  const center = size / 2;
  const radius = size * .475;
  const colors = normalizeTimerPalette(timerPalette);
  const palette = [[0, 90, colors.green], [90, 150, colors.yellow], [150, 220, colors.orange], [220, 270, colors.red]] as const;
  return palette.flatMap(([start, end, color]) => {
    const visibleEnd = Math.min(end, degrees);
    return visibleEnd <= start ? [] : [{ d: arcPath(center, radius, start - 90, visibleEnd - 90), color }];
  });
}

function circularFinder(matrix: QrMatrix, startRow: number, startColumn: number, cell: number, left: number, top: number, moduleColor: string) {
  const center = { x: left + (startColumn + 3.5) * cell, y: top + (startRow + 3.5) * cell };
  const outer = `<circle cx="${center.x}" cy="${center.y}" r="${cell * 3.68}" fill="#ffffff"/>`;
  const modules = Array.from({ length: 7 }, (_, row) => Array.from({ length: 7 }, (_, column) => {
    const dark = matrix[startRow + row]?.[startColumn + column];
    return dark ? `<circle cx="${left + (startColumn + column + .5) * cell}" cy="${top + (startRow + row + .5) * cell}" r="${cell * .47}" fill="${moduleColor}"/>` : "";
  }).join("")).join("");
  return `${outer}${modules}`;
}

export function buildCircularQrSvg(matrix: QrMatrix, config: CustomQrVisualConfig) {
  const moduleCount = matrix.length;
  if (!moduleCount || matrix.some((row) => row.length !== moduleCount)) return "";
  const size = Math.max(240, Math.min(1400, Math.round(config.size)));
  const safeMargin = size * .145;
  const inner = size - safeMargin * 2;
  const cell = inner / moduleCount;
  const accent = escapeXml(config.accentColor);
  const background = escapeXml(config.backgroundColor);
  const moduleColor = escapeXml(config.moduleColor ?? "#07110d");
  const label = escapeXml(config.label.trim() || "MiLukita");
  const modules = matrix.map((row, rowIndex) => row.map((dark, columnIndex) => {
    if (!dark || isFinderCell(rowIndex, columnIndex, moduleCount)) return "";
    const cx = safeMargin + (columnIndex + .5) * cell;
    const cy = safeMargin + (rowIndex + .5) * cell;
    return `<circle cx="${cx}" cy="${cy}" r="${cell * .42}" fill="${moduleColor}"/>`;
  }).join("")).join("");
  const finders = `${circularFinder(matrix, 0, 0, cell, safeMargin, safeMargin, moduleColor)}${circularFinder(matrix, 0, moduleCount - 7, cell, safeMargin, safeMargin, moduleColor)}${circularFinder(matrix, moduleCount - 7, 0, cell, safeMargin, safeMargin, moduleColor)}`;
  const center = size / 2;
  const ring = config.variant === "central" ? "" : `<circle cx="${center}" cy="${center}" r="${size * .46}" fill="none" stroke="${accent}" stroke-width="${Math.max(3, size * .012)}" opacity=".92"/>`;
  const logo = config.logoDataUrl ? `<circle cx="${center}" cy="${center}" r="${size * .085}" fill="#ffffff" stroke="${accent}" stroke-width="${Math.max(2, size * .01)}"/><image href="${escapeXml(config.logoDataUrl)}" x="${center - size * .062}" y="${center - size * .062}" width="${size * .124}" height="${size * .124}" preserveAspectRatio="xMidYMid meet"/>` : `<circle cx="${center}" cy="${center}" r="${size * .075}" fill="${config.variant === "integrated" ? "#173c78" : background}" stroke="${accent}" stroke-width="${Math.max(2, size * .01)}"/><text x="${center}" y="${center + size * .024}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size * .07}" font-weight="700" fill="${config.variant === "integrated" ? "#ffffff" : accent}">L</text>`;
  const timerProgress = Math.max(0, Math.min(100, config.timerProgress ?? 0));
  const timerArc = getTimerArcSegments(size, timerProgress, config.timerPalette).map(({ d, color }) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${Math.max(7, size * .018)}" stroke-linecap="round"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="QR circular personalizado ${label}"><circle cx="${center}" cy="${center}" r="${size * .49}" fill="${background}"/><circle cx="${center}" cy="${center}" r="${size * .43}" fill="#ffffff"/>${modules}${finders}${ring}${timerArc}${logo}</svg>`;
}

export function qrMatrixFromData(data: { size: number; data: Uint8Array | readonly number[] }): QrMatrix {
  return Array.from({ length: data.size }, (_, row) => Array.from({ length: data.size }, (_, column) => Boolean(data.data[row * data.size + column])));
}

export function buildSquareQrSvg(matrix: QrMatrix, config: CustomQrVisualConfig) {
  const moduleCount = matrix.length;
  if (!moduleCount || matrix.some((row) => row.length !== moduleCount)) return "";
  const size = Math.max(240, Math.min(1400, Math.round(config.size)));
  const margin = size * .11;
  const cell = (size - margin * 2) / moduleCount;
  const accent = escapeXml(config.accentColor);
  const background = escapeXml(config.backgroundColor);
  const moduleColor = escapeXml(config.moduleColor ?? "#07110d");
  const label = escapeXml(config.label.trim() || "MiLukita");
  const modules = matrix.map((row, rowIndex) => row.map((dark, columnIndex) => dark && !isFinderCell(rowIndex, columnIndex, moduleCount) ? `<rect x="${margin + columnIndex * cell}" y="${margin + rowIndex * cell}" width="${cell * 1.01}" height="${cell * 1.01}" fill="${moduleColor}"/>` : "").join("")).join("");
  const finder = (startRow: number, startColumn: number) => {
    const x = margin + startColumn * cell;
    const y = margin + startRow * cell;
    const dark = `<rect x="${x}" y="${y}" width="${cell * 7}" height="${cell * 7}" fill="${moduleColor}"/><rect x="${x + cell}" y="${y + cell}" width="${cell * 5}" height="${cell * 5}" fill="#ffffff"/><rect x="${x + cell * 2}" y="${y + cell * 2}" width="${cell * 3}" height="${cell * 3}" fill="${moduleColor}"/>`;
    return `<rect x="${x - cell * .18}" y="${y - cell * .18}" width="${cell * 7.36}" height="${cell * 7.36}" fill="#ffffff"/>${dark}`;
  };
  const finders = `${finder(0, 0)}${finder(0, moduleCount - 7)}${finder(moduleCount - 7, 0)}`;
  const center = size / 2;
  const logo = config.logoDataUrl ? `<circle cx="${center}" cy="${center}" r="${size * .085}" fill="#ffffff" stroke="${accent}" stroke-width="${Math.max(2, size * .01)}"/><image href="${escapeXml(config.logoDataUrl)}" x="${center - size * .062}" y="${center - size * .062}" width="${size * .124}" height="${size * .124}" preserveAspectRatio="xMidYMid meet"/>` : `<circle cx="${center}" cy="${center}" r="${size * .075}" fill="${background}" stroke="${accent}" stroke-width="${Math.max(2, size * .01)}"/><text x="${center}" y="${center + size * .024}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size * .07}" font-weight="700" fill="${accent}">L</text>`;
  const timerArc = getTimerArcSegments(size, config.timerProgress ?? 0).map(({ d, color }) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${Math.max(7, size * .018)}" stroke-linecap="round"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="QR cuadrado personalizado ${label}"><rect width="100%" height="100%" fill="${background}"/><rect x="${margin - cell * .18}" y="${margin - cell * .18}" width="${size - (margin - cell * .18) * 2}" height="${size - (margin - cell * .18) * 2}" fill="#ffffff"/>${modules}${finders}${timerArc}${logo}<rect x="${size * .57}" y="${size * .89}" width="${size * .36}" height="${size * .055}" fill="${background}" opacity=".96"/><text x="${size * .75}" y="${size * .928}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size * .03}" font-weight="700" fill="${accent}">${label}</text></svg>`;
}

export function buildCustomizedQrSvg(imageDataUrl: string, config: CustomQrVisualConfig) {
  if (config.matrix) return config.shape === "square" ? buildSquareQrSvg(config.matrix, config) : buildCircularQrSvg(config.matrix, config);
  const size = Math.max(160, Math.min(1024, Math.round(config.size)));
  const label = escapeXml(config.label.trim() || "MiLukita");
  const accent = escapeXml(config.accentColor);
  const background = escapeXml(config.backgroundColor);
  const center = size / 2;
  const ringRadius = size * 0.44;
  const imageHref = escapeXml(imageDataUrl);
  const centerMark = config.variant === "central" ? `<circle cx="${center}" cy="${center}" r="${size * 0.085}" fill="${accent}"/><text x="${center}" y="${center + size * 0.022}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size * 0.075}" font-weight="700" fill="${background}">L</text>` : config.variant === "circle" ? `<circle cx="${center}" cy="${center}" r="${size * 0.085}" fill="${background}" stroke="${accent}" stroke-width="${Math.max(2, size * 0.012)}"/><text x="${center}" y="${center + size * 0.022}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size * 0.075}" font-weight="700" fill="${accent}">L</text>` : `<circle cx="${center}" cy="${center}" r="${size * 0.085}" fill="#173c78" stroke="${accent}" stroke-width="${Math.max(2, size * 0.012)}"/><text x="${center}" y="${center + size * 0.022}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size * 0.075}" font-weight="700" fill="#ffffff">L</text>`;
  const logo = config.logoDataUrl ? `<rect x="${center - size * 0.105}" y="${center - size * 0.105}" width="${size * 0.21}" height="${size * 0.21}" rx="${size * 0.035}" fill="#ffffff" stroke="${accent}" stroke-width="${Math.max(2, size * 0.01)}"/><image href="${escapeXml(config.logoDataUrl)}" x="${center - size * 0.075}" y="${center - size * 0.075}" width="${size * 0.15}" height="${size * 0.15}" preserveAspectRatio="xMidYMid meet"/>` : centerMark;
  const ring = config.variant === "central" ? "" : `<circle cx="${center}" cy="${center}" r="${ringRadius}" fill="none" stroke="${accent}" stroke-width="${Math.max(3, size * 0.014)}" opacity="0.92"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="QR personalizado ${label}"><rect width="100%" height="100%" rx="${size * 0.04}" fill="${background}"/><image href="${imageHref}" x="${size * 0.08}" y="${size * 0.08}" width="${size * 0.84}" height="${size * 0.84}" preserveAspectRatio="none"/>${ring}${logo}<rect x="${size * 0.54}" y="${size * 0.86}" width="${size * 0.38}" height="${size * 0.075}" rx="${size * 0.018}" fill="${background}" opacity="0.96"/><text x="${size * 0.73}" y="${size * 0.91}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size * 0.034}" font-weight="700" fill="${accent}">${label}</text></svg>`;
}

export function buildQrDownloadName(label: string, format: "svg" | "png") {
  const normalized = label.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "milukita-qr";
  return `${normalized}.${format}`;
}
