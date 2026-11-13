/**
 * SVG del sólido 3D proyectado en isométrico.
 *
 * - Proyección isométrica de los vertices.
 * - Faces ordenadas por profundidad (z-buffer aproximado).
 * - Sombreado por normal y orientación solar.
 * - Colores por material.
 *
 * Sin Three.js, sin WebGL, sin dependencias externas.
 */

import type { RenderData, RenderFace, RenderMaterial } from "./types";
import { projectAll, type Point2D } from "./projectIsometric";

type Vec3 = [number, number, number];

/** Normal de una face (producto cruz de dos lados). */
function faceNormal(a: Vec3, b: Vec3, c: Vec3): Vec3 {
  const u: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v: Vec3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const nx = u[1] * v[2] - u[2] * v[1];
  const ny = u[2] * v[0] - u[0] * v[2];
  const nz = u[0] * v[1] - u[1] * v[0];
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
  return [nx / len, ny / len, nz / len];
}

/** Dirección del sol desde azimuth/elevación (grados). */
function sunDirection(azimuthDeg: number, elevationDeg: number): Vec3 {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  return [Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az)];
}

/** Factor de iluminación: 0.4 (sombra) a 1.0 (iluminado). */
function lightFactor(normal: Vec3, sunDir: Vec3): number {
  const dot = normal[0] * sunDir[0] + normal[1] * sunDir[1] + normal[2] * sunDir[2];
  return 0.4 + 0.6 * Math.max(0, dot);
}

/** Ajusta un color hex a un factor de iluminación (0-1). */
function shadeColor(hex: string, factor: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v * factor)));
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(clamp(r))}${toHex(clamp(g))}${toHex(clamp(b))}`;
}

/** Profundidad media de una face (para z-buffer aproximado). */
function faceDepth(face: RenderFace, vertices: Vec3[]): number {
  const verts = face.vertices.map((i) => vertices[i]);
  return verts.reduce((acc, v) => acc + v[2], 0) / verts.length;
}

/** Genera el SVG del sólido. */
export function renderSolidSvg(data: RenderData): string {
  const { points, width, height } = projectAll(data.vertices);
  const sunDir = sunDirection(data.lighting.sunAzimuthDeg, data.lighting.sunElevationDeg);

  // Mapa de materiales por id
  const materialMap = new Map<string, RenderMaterial>();
  for (const m of data.materials) materialMap.set(m.id, m);

  // Calcular normal y factor de iluminación por face
  const facesWithData = data.faces.map((face, idx) => {
    const verts = face.vertices.map((i) => data.vertices[i]) as Vec3[];
    const normal = verts.length >= 3 ? faceNormal(verts[0], verts[1], verts[2]) : ([0, 1, 0] as Vec3);
    const factor = lightFactor(normal, sunDir);
    const depth = faceDepth(face, data.vertices);
    const material = materialMap.get(face.materialId);
    const baseColor = material?.color ?? "#999999";
    return { face, idx, factor, depth, fill: shadeColor(baseColor, factor) };
  });

  // Ordenar por profundidad: las más lejanas primero (z mayor = más lejos en isométrico)
  facesWithData.sort((a, b) => b.depth - a.depth);

  // Generar <polygon> por face
  const polygons = facesWithData
    .map(({ face, fill, idx }) => {
      const polygonPoints = face.vertices
        .map((vi) => points[vi])
        .filter((p): p is Point2D => p !== undefined)
        .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
        .join(" ");
      return `<polygon points="${polygonPoints}" fill="${fill}" stroke="#0f172a" stroke-width="0.5" data-face-index="${idx}"/>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="ARKI solid ${data.projectId}">${polygons}</svg>`;
}
