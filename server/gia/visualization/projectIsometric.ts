/**
 * Proyección isométrica de vertices 3D a 2D.
 *
 * Fórmula estándar:
 *   screen_x = (x - z) * cos(30°)
 *   screen_y = (x + z) * sin(30°) - y
 *
 * Con cos(30°) = √3/2 ≈ 0.866 y sin(30°) = 0.5.
 *
 * Luego se normaliza al viewBox del SVG (580 × 400 por defecto).
 */

import type { RenderVertex } from "./types";

export type Point2D = [number, number];

export type ProjectionOptions = {
  width?: number;
  height?: number;
  margin?: number;
};

const COS30 = Math.sqrt(3) / 2; // ≈ 0.866
const SIN30 = 0.5;

/** Proyecta un vertex 3D a 2D (isométrico, sin normalizar). */
export function projectVertex(v: RenderVertex): Point2D {
  const [x, y, z] = v;
  return [(x - z) * COS30, (x + z) * SIN30 - y];
}

/** Proyecta todos los vertices y normaliza al viewBox. */
export function projectAll(
  vertices: RenderVertex[],
  options: ProjectionOptions = {},
): { points: Point2D[]; width: number; height: number; margin: number } {
  const width = options.width ?? 580;
  const height = options.height ?? 400;
  const margin = options.margin ?? 20;

  const projected = vertices.map(projectVertex);

  if (projected.length === 0) {
    return { points: [], width, height, margin };
  }

  const xs = projected.map((p) => p[0]);
  const ys = projected.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const availW = width - 2 * margin;
  const availH = height - 2 * margin;
  const scale = Math.min(availW / spanX, availH / spanY);

  const points: Point2D[] = projected.map(([px, py]) => [
    margin + (px - minX) * scale,
    margin + (py - minY) * scale,
  ]);

  return { points, width, height, margin };
}
