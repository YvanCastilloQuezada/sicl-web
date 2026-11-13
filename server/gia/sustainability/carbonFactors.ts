/**
 * Factores de carbono por material.
 *
 * Fuente principal: ICE Database v3.0 (Inventory of Carbon and Energy),
 * University of Bath, 2019. https://circularecology.com/embodied-carbon-footprint-database.html
 *
 * Valores en kgCO2e/kg. Para conversión a kgCO2e/m3, multiplicar por densidad.
 */

import type { CarbonFactor } from "./types";

export const CARBON_FACTORS: Map<string, CarbonFactor> = new Map([
  // === Concreto ===
  ["concrete-c20", { id: "concrete-c20", name: "Concreto C20/25", gwp_kgco2e_per_kg: 0.10, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["concrete-c30", { id: "concrete-c30", name: "Concreto C30/37", gwp_kgco2e_per_kg: 0.13, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["concrete-c40", { id: "concrete-c40", name: "Concreto C40/50", gwp_kgco2e_per_kg: 0.17, module: "A1-A3", source: "ICE v3.0, 2019" }],

  // === Acero ===
  ["steel-rebar", { id: "steel-rebar", name: "Acero de refuerzo", gwp_kgco2e_per_kg: 1.99, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["steel-structural", { id: "steel-structural", name: "Acero estructural", gwp_kgco2e_per_kg: 1.55, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["steel-recycled", { id: "steel-recycled", name: "Acero reciclado (EAF)", gwp_kgco2e_per_kg: 0.47, module: "A1-A3", source: "ICE v3.0, 2019" }],

  // === Aluminio ===
  ["aluminium-virgin", { id: "aluminium-virgin", name: "Aluminio virgen", gwp_kgco2e_per_kg: 12.79, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["aluminium-recycled", { id: "aluminium-recycled", name: "Aluminio reciclado", gwp_kgco2e_per_kg: 0.49, module: "A1-A3", source: "ICE v3.0, 2019" }],

  // === Vidrio ===
  ["glass-double", { id: "glass-double", name: "Vidrio doble", gwp_kgco2e_per_kg: 1.40, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["glass-triple", { id: "glass-triple", name: "Vidrio triple", gwp_kgco2e_per_kg: 1.85, module: "A1-A3", source: "ICE v3.0, 2019" }],

  // === Aislamiento ===
  ["insulation-mineral-wool", { id: "insulation-mineral-wool", name: "Lana mineral", gwp_kgco2e_per_kg: 1.20, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["insulation-cellulose", { id: "insulation-cellulose", name: "Celulosa", gwp_kgco2e_per_kg: 0.16, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["insulation-wood-fiber", { id: "insulation-wood-fiber", name: "Fibra de madera", gwp_kgco2e_per_kg: 0.85, module: "A1-A3", source: "ICE v3.0, 2019" }],

  // === Madera ===
  ["timber-glulam", { id: "timber-glulam", name: "Madera laminada", gwp_kgco2e_per_kg: -0.60, module: "A1-A3", source: "ICE v3.0, 2019 (biogenic carbon)" }],
  ["timber-clt", { id: "timber-clt", name: "CLT (Cross-Laminated Timber)", gwp_kgco2e_per_kg: -0.40, module: "A1-A3", source: "ICE v3.0, 2019 (biogenic carbon)" }],
  ["timber-sawn", { id: "timber-sawn", name: "Madera aserrada", gwp_kgco2e_per_kg: -0.30, module: "A1-A3", source: "ICE v3.0, 2019 (biogenic carbon)" }],

  // === Mampostería ===
  ["brick-clay", { id: "brick-clay", name: "Ladrillo de arcilla", gwp_kgco2e_per_kg: 0.24, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["block-concrete", { id: "block-concrete", name: "Bloque de concreto", gwp_kgco2e_per_kg: 0.09, module: "A1-A3", source: "ICE v3.0, 2019" }],

  // === Otros ===
  ["gypsum-board", { id: "gypsum-board", name: "Yeso-cartón", gwp_kgco2e_per_kg: 0.39, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["plaster", { id: "plaster", name: "Yeso", gwp_kgco2e_per_kg: 0.12, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["ceramic-tile", { id: "ceramic-tile", name: "Baldosa cerámica", gwp_kgco2e_per_kg: 0.78, module: "A1-A3", source: "ICE v3.0, 2019" }],
  ["bitumen-membrane", { id: "bitumen-membrane", name: "Membrana bituminosa", gwp_kgco2e_per_kg: 0.50, module: "A1-A3", source: "ICE v3.0, 2019" }],
]);

/** Factores de transporte (A4) por defecto, en kgCO2e por kg de material por km. */
export const TRANSPORT_FACTOR_KGCO2E_PER_KG_KM = 0.000105; // Camión diésel, 32t, 80% carga

/** Distancia de transporte por defecto (km). */
export const DEFAULT_TRANSPORT_DISTANCE_KM = 100;
