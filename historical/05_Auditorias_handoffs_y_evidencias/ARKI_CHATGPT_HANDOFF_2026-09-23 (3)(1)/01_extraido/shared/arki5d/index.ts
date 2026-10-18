export type PriceBookItem = { id: string; code: string; description: string; unit: string; unitPrice: number; currency: "PEN"; source: string; version: string };
export type QuantityItem = { elementId: string; itemId: string; quantity: number; unit: string };
export type CostLine = QuantityItem & { unitPrice: number; total: number };
export type Budget5D = { lines: CostLine[]; directCost: number; currency: "PEN"; priceBookVersion: string };

export function calculateBudget5D(items: PriceBookItem[], quantities: QuantityItem[]): Budget5D {
  const book = new Map(items.map((item) => [item.id, item]));
  const lines = quantities.map((quantity) => {
    const price = book.get(quantity.itemId);
    if (!price) throw new Error(`PriceBook item missing: ${quantity.itemId}`);
    if (quantity.quantity < 0 || !Number.isFinite(quantity.quantity)) throw new Error(`Invalid quantity: ${quantity.elementId}`);
    return { ...quantity, unitPrice: price.unitPrice, total: Number((quantity.quantity * price.unitPrice).toFixed(2)) };
  });
  return { lines, directCost: Number(lines.reduce((sum, line) => sum + line.total, 0).toFixed(2)), currency: "PEN", priceBookVersion: items[0]?.version ?? "unknown" };
}
