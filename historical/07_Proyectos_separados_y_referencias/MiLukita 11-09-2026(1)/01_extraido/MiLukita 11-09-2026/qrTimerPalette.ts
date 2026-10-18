export type TimerPalette = { green: string; yellow: string; orange: string; red: string };

export const ADMIN_TIMER_PALETTE_STORAGE_KEY = "milukita.qr.admin-timer-palette.v1";
export const TIMER_PALETTE_EVENT = "milukita:timer-palette-updated";
export const DEFAULT_TIMER_PALETTE: TimerPalette = { green: "#22c55e", yellow: "#facc15", orange: "#f97316", red: "#ef4444" };

export function normalizeTimerPalette(palette?: Partial<TimerPalette> | null): TimerPalette {
  const safe = (value: string | undefined, fallback: string) => /^#[0-9a-f]{6}$/i.test(value ?? "") ? value! : fallback;
  return { green: safe(palette?.green, DEFAULT_TIMER_PALETTE.green), yellow: safe(palette?.yellow, DEFAULT_TIMER_PALETTE.yellow), orange: safe(palette?.orange, DEFAULT_TIMER_PALETTE.orange), red: safe(palette?.red, DEFAULT_TIMER_PALETTE.red) };
}

function channelToLinear(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(firstHex: string, secondHex: string): number {
  const parse = (hex: string) => {
    const value = /^#([0-9a-f]{6})$/i.exec(hex)?.[1];
    if (!value) return null;
    return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
  };
  const first = parse(firstHex);
  const second = parse(secondHex);
  if (!first || !second) return 1;
  const luminance = (rgb: number[]) => 0.2126 * channelToLinear(rgb[0]) + 0.7152 * channelToLinear(rgb[1]) + 0.0722 * channelToLinear(rgb[2]);
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

export function timerPaletteContrastReport(palette?: Partial<TimerPalette> | null, background = "#071a12") {
  const safe = normalizeTimerPalette(palette);
  return (Object.entries(safe) as Array<[keyof TimerPalette, string]>).map(([stage, color]) => ({ stage, color, ratio: Number(contrastRatio(color, background).toFixed(2)), passesNonTextAA: contrastRatio(color, background) >= 3 }));
}

export function createRandomTimerVisualProfile() {
  const palettes: TimerPalette[] = [
    { green: "#16a34a", yellow: "#eab308", orange: "#ea580c", red: "#b91c1c" },
    { green: "#34d399", yellow: "#fbbf24", orange: "#fb7185", red: "#be123c" },
    { green: "#22c55e", yellow: "#facc15", orange: "#f97316", red: "#ef4444" },
  ];
  const palette = palettes[Math.floor(Math.random() * palettes.length)] ?? DEFAULT_TIMER_PALETTE;
  const durationSeconds = 60 + Math.floor(Math.random() * 241);
  return { palette, durationSeconds };
}

export function buildPaletteWcagCsv(presets: Record<string, { timerPalette: Partial<TimerPalette>; backgroundColor?: string }>) {
  const rows = ["preset,stage,color,background,contrast_ratio,passes_non_text_aa"];
  Object.entries(presets).forEach(([name, preset]) => timerPaletteContrastReport(preset.timerPalette, preset.backgroundColor).forEach((item) => rows.push([name, item.stage, item.color, preset.backgroundColor ?? "#071a12", item.ratio, item.passesNonTextAA ? "true" : "false"].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))));
  return `${rows.join("\n")}\n`;
}
