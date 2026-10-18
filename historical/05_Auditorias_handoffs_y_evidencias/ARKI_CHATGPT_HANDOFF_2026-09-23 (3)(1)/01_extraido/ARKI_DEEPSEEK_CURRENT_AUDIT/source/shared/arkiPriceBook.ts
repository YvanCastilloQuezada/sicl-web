// ARKI — Price Book
// Entrega 1B — catálogo de precios versionado.
// No reemplaza APU_DATABASE. La envuelve mediante fromApuDatabase().
// Compatibilidad hacia atrás: fromApuDatabase() produce un PriceBook estable.

import type { ApuInsumo, ApuPartida } from "./arkiConstructionOntology";

export type PriceBookSource =
  | "ARKI_REFERENCIAL"
  | "S10"
  | "CAPECO"
  | "MANUAL";

export type PriceBookCurrency = "PEN" | "USD";

export type PriceBookUnit = "m2" | "m3" | "kg" | "und" | "ml";

export type PriceBookItem = {
  code: string;
  description: string;
  unit: PriceBookUnit;
  directCost: number;
  overheadPct: number;
  profitPct: number;
  taxPct: number;
  unitPrice: number;
  source: string;
  validFrom: string;
  insumos?: ApuInsumo[];
};

export type PriceBook = {
  schema: "ARKI-PRICE-BOOK-1.0";
  id: string;
  version: number;
  source: PriceBookSource;
  region: string;
  country: string;
  currency: PriceBookCurrency;
  validFrom: string;
  validTo?: string;
  projectId?: string;
  items: PriceBookItem[];
};

// Normaliza unidades del APU existente al tipo PriceBookUnit.
function normalizeUnit(unit: string): PriceBookUnit {
  if (unit === "m²") return "m2";
  if (unit === "m³") return "m3";
  if (unit === "und") return "und";
  if (unit === "kg") return "kg";
  if (unit === "ml") return "ml";
  if (unit === "m2") return "m2";
  if (unit === "m3") return "m3";
  throw new Error(`UNSUPPORTED_UNIT: ${unit}`);
}

// Convierte APU_DATABASE existente en un PriceBook versionado.
// Idempotente: misma entrada, misma salida (excepto validFrom si no se pasa).
export function fromApuDatabase(
  apu: ApuPartida[],
  options?: {
    id?: string;
    version?: number;
    region?: string;
    country?: string;
    currency?: PriceBookCurrency;
    validFrom?: string;
    projectId?: string;
  },
): PriceBook {
  const validFrom = options?.validFrom ?? "2026-09-22";
  return {
    schema: "ARKI-PRICE-BOOK-1.0",
    id: options?.id ?? "PB-ARKI-REFERENCIAL",
    version: options?.version ?? 1,
    source: "ARKI_REFERENCIAL",
    region: options?.region ?? "La Libertad",
    country: options?.country ?? "PE",
    currency: options?.currency ?? "PEN",
    validFrom,
    projectId: options?.projectId,
    items: apu.map((partida) => ({
      code: partida.codigo,
      description: partida.descripcion,
      unit: normalizeUnit(partida.unidad),
      directCost: partida.costo_directo,
      overheadPct: partida.costo_directo === 0 ? 0 : (partida.gastos_generales / partida.costo_directo) * 100,
      profitPct: partida.costo_directo === 0 ? 0 : (partida.utilidad / partida.costo_directo) * 100,
      taxPct: partida.subtotal === 0 ? 0 : (partida.igv / partida.subtotal) * 100,
      unitPrice: partida.precio_unitario,
      source: "ARKI_REFERENCIAL",
      validFrom,
      insumos: partida.insumos,
    })),
  };
}

export function findPriceBookItem(
  priceBook: PriceBook,
  code: string,
): PriceBookItem | undefined {
  return priceBook.items.find((item) => item.code === code);
}

export function isPriceBookValid(item: PriceBookItem): boolean {
  return (
    typeof item.code === "string" &&
    item.code.length > 0 &&
    typeof item.description === "string" &&
    item.description.length > 0 &&
    item.directCost >= 0 &&
    item.unitPrice >= 0 &&
    typeof item.source === "string" &&
    item.source.length > 0 &&
    typeof item.validFrom === "string" &&
    item.validFrom.length > 0
  );
}
