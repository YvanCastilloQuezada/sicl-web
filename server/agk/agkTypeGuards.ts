/**
 * Type guards para AgkGeometry.
 *
 * AgkGeometry es una unión discriminada por `kind`. Algunos kinds
 * (MULTI_SOLID, OVERHANG, BRIDGE) no tienen `profile` ni origen
 * (x_mm, y_mm, z_mm, height_mm). Estos guards permiten acceder a
 * esos campos de forma segura sin `as any` disperso.
 */

import type { AgkGeometry } from "../arkiGeometryKernel";

/** Kinds que NO tienen profile ni origen. */
const NON_EXTRUDED_KINDS = new Set(["MULTI_SOLID", "OVERHANG", "BRIDGE"]);

/** Kinds que SÍ tienen profile y origen. */
export function isExtruded(g: AgkGeometry): boolean {
  return !NON_EXTRUDED_KINDS.has(g.kind);
}

/** Devuelve el origen de una geometría, con defaults seguros. */
export function getOrigin(g: AgkGeometry): {
  x_mm: number;
  y_mm: number;
  z_mm: number;
  height_mm: number;
} {
  const anyG = g as any;
  return {
    x_mm: typeof anyG.x_mm === "number" ? anyG.x_mm : 0,
    y_mm: typeof anyG.y_mm === "number" ? anyG.y_mm : 0,
    z_mm: typeof anyG.z_mm === "number" ? anyG.z_mm : 0,
    height_mm: typeof anyG.height_mm === "number" ? anyG.height_mm : 0,
  };
}

/** Devuelve el profile de una geometría, o null si no lo tiene. */
export function getProfile(g: AgkGeometry): any | null {
  return (g as any).profile ?? null;
}

/** Devuelve los solids de un MULTI_SOLID, o [] si no lo es. */
export function getSolids(g: AgkGeometry): any[] {
  return (g as any).solids ?? [];
}
