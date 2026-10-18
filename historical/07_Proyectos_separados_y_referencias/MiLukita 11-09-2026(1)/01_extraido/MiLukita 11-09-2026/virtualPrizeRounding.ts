/**
 * Regla operativa del piloto: los premios se liquidan en créditos virtuales enteros.
 * [0, 0.4) se anula; [0.4, +∞) se redondea hacia arriba a la siguiente unidad.
 */
export function roundVirtualPrize(value: number): number {
  if (!Number.isFinite(value) || value <= 0 || value < 0.4) return 0;
  return Math.ceil(value);
}

export function isWholeVirtualPrize(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}
