import type { BimElementKind } from "@shared/arkiBimSelection";

export type CanvasViewport = { scale: number; translateX: number; translateY: number };
export type CanvasView = { kind: "plan"; level: number; discipline: string | "all"; phase: string | "all"; visibleCategories: string[]; showGrid: boolean; showAxes: boolean; viewport: CanvasViewport };
export type CanvasHit = { elementId: string; kind: BimElementKind; distance: number };
