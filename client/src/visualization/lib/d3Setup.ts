export const SVG_FONT_FAMILY = "ui-sans-serif, system-ui, sans-serif";
export const SVG_TEXT_COLOR = "#385348";
export const SVG_MUTED_COLOR = "#718078";
export const SVG_GRID_COLOR = "#d7d8cf";

export const chartMargins = { top: 48, right: 28, bottom: 58, left: 62 };

export function innerSize(width: number, height: number) {
  return {
    width: Math.max(1, width - chartMargins.left - chartMargins.right),
    height: Math.max(1, height - chartMargins.top - chartMargins.bottom),
  };
}

export function formatTimestamp(value: string | number | Date): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

export function safeText(value: unknown, fallback = "—"): string {
  if (value === null || value === undefined || value === "") return fallback;
  return typeof value === "string" ? value : JSON.stringify(value);
}

export const STATUS_COLORS = {
  front: "#385348",
  dominated: "#b9c4bd",
  incomplete: "#d07b4a",
} as const;

export const EVENT_COLORS = ["#385348", "#d07b4a", "#6a7d72", "#8e6b58", "#52645a"];

export function eventColor(type: string, types: string[]): string {
  const index = Math.max(0, types.indexOf(type));
  return EVENT_COLORS[index % EVENT_COLORS.length];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const tooltipStyle = {
  position: "absolute" as const,
  pointerEvents: "none" as const,
  zIndex: 10,
  maxWidth: 280,
  border: "1px solid #b9c4bd",
  borderRadius: 8,
  background: "#fbfaf6",
  color: SVG_TEXT_COLOR,
  padding: "8px 10px",
  fontSize: 12,
  boxShadow: "0 8px 24px rgba(56,83,72,.14)",
};

export { scaleLinear, scaleTime } from "d3-scale";
export { axisBottom, axisLeft } from "d3-axis";
export { line } from "d3-shape";
export { select } from "d3-selection";
export type { ScaleLinear, ScaleTime } from "d3-scale";
export type { Selection } from "d3-selection";
export type { Line } from "d3-shape";
export type { Axis } from "d3-axis";

export type ChartStatus = keyof typeof STATUS_COLORS;
export const chartColors = STATUS_COLORS;
export const eventColors = EVENT_COLORS;
export const defaultChartMargins = chartMargins;
export const getInnerSize = innerSize;
export const formatDate = formatTimestamp;
export const stringifyValue = safeText;
export const getEventColor = eventColor;
export const clampValue = clamp;
export const tooltipStyles = tooltipStyle;
export const d3Configured = true;

