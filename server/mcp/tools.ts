/**
 * Los 5 tools MCP de ARKI.
 *
 * Cada tool expone una capacidad de ARKI como herramienta invocable.
 */

import type { McpTool } from "./types";
import { executeIntegratedArchitectCycle } from "../arkiIntegratedArchitectCycle";
import { calculateEmbodiedCarbon, netZeroScore, type MaterialQuantity } from "../gia/sustainability";
import { retrofitVsDemolition, reusePotential, type ExistingStructure, type NewBuild } from "../gia/retrofit";
import { resilienceIndex, type Terrain, type Geometry, type WaterSystems } from "../gia/resilience";
import { buildIndex, query as ragQuery, SAMPLE_DOCUMENTS } from "../gia/rag";
import { readFileSync } from "fs";
import { resolve } from "path";

/** Cargar el fixture de una tipología. */
function loadFixture(typology: string) {
  const path = resolve(__dirname, "../gia/fixtures", `${typology}.json`);
  return JSON.parse(readFileSync(path, "utf-8"));
}

/** El índice RAG se construye una vez al importar. */
const RAG_INDEX = buildIndex(SAMPLE_DOCUMENTS);

export const TOOLS: McpTool[] = [
  {
    name: "evaluate_typology",
    description: "Ejecuta el ciclo integrado de ARKI sobre una tipología (59 disponibles: hospital, educativo, oficinas, residencial, comercial, industrial, cultural, deportivo, transporte, hotelero, clinica, religioso, penitenciario, acueducto, canal, carretera, represa, puerto-lacustre, puerto-maritimo, aeropuerto, almacen, reactor, centro-convenciones, rascacielos, multifamiliar, museo, universidad, instituto-tecnologico, centro-arte-cultura, centro-nacional-tecnologia, data-center-ia, teatro, biblioteca, parque-infantil, parque-diversiones, restaurante, centro-campestre, parque-aguas, centro-entretenimiento-digital, bomberos, policia, parque-zonal, zoologico, jardin-botanico, urbanizacion, planificacion-distrital, planificacion-provincial, planificacion-regional, planificacion-macro-regional, planificacion-nacional, planificacion-cuencas, planificacion-intercuencas, base-aerea, base-naval, base-terrestre, bunker, defensa-antiaerea, centro-mando, polvorin).",
    inputSchema: {
      type: "object",
      properties: {
        typology: { type: "string", description: "ID de la tipología (ej. 'hospital', 'oficinas')." },
      },
      required: ["typology"],
    },
    handler: async (args) => {
      const typology = args.typology as string;
      if (!typology) throw new Error("typology es requerido");
      const input = loadFixture(typology);
      const cycle = await executeIntegratedArchitectCycle(input);
      return {
        typology,
        cycleVersion: cycle.cycleVersion,
        status: cycle.status,
        projectPartis: cycle.projectPartis.length,
        evaluation: cycle.evaluation,
      };
    },
  },
  {
    name: "calculate_sustainability",
    description: "Calcula carbono incorporado (A1-A5), carbono operacional (B6), y score Net Zero contra LETI 2020 y RIBA 2030. 24 materiales disponibles (concrete-c30, steel-rebar, steel-recycled, glass-double, insulation-cellulose, timber-glulam, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        materials: {
          type: "array",
          description: "Lista de { materialId, quantity_kg }.",
          items: {
            type: "object",
            properties: {
              materialId: { type: "string" },
              quantity_kg: { type: "number" },
            },
            required: ["materialId", "quantity_kg"],
          },
        },
        area_m2: { type: "number", description: "Área construida en m2." },
        annualEnergy_kWh: { type: "number", description: "Energía anual en kWh (opcional)." },
      },
      required: ["materials", "area_m2"],
    },
    handler: async (args) => {
      const materials = args.materials as MaterialQuantity[];
      const area = args.area_m2 as number;
      const embodied = calculateEmbodiedCarbon(materials, undefined, area);
      const score = netZeroScore(embodied.kgco2e_per_m2 ?? 0);
      return { embodied, score };
    },
  },
  {
    name: "calculate_retrofit",
    description: "Compara demoler vs rehabilitar. Calcula carbono evitado y potencial de reutilización.",
    inputSchema: {
      type: "object",
      properties: {
        existing: {
          type: "object",
          properties: {
            area_m2: { type: "number" },
            structureType: { type: "string", enum: ["concrete", "steel", "masonry", "timber", "mixed"] },
            yearBuilt: { type: "number" },
            condition: { type: "string", enum: ["good", "fair", "poor"] },
            embodiedCarbon_existing_kgco2e: { type: "number" },
          },
          required: ["area_m2", "structureType", "yearBuilt", "condition"],
        },
        newBuild: {
          type: "object",
          properties: {
            area_m2: { type: "number" },
            embodiedCarbon_new_kgco2e: { type: "number" },
          },
          required: ["area_m2", "embodiedCarbon_new_kgco2e"],
        },
      },
      required: ["existing", "newBuild"],
    },
    handler: async (args) => {
      const existing = args.existing as ExistingStructure;
      const newBuild = args.newBuild as NewBuild;
      const comparison = retrofitVsDemolition(existing, newBuild);
      const potential = reusePotential(existing);
      return { comparison, potential };
    },
  },
  {
    name: "calculate_resilience",
    description: "Calcula resiliencia climática: flood risk, heat island, drought, y score combinado.",
    inputSchema: {
      type: "object",
      properties: {
        terrain: {
          type: "object",
          properties: {
            slope: { type: "number" },
            elevation_m: { type: "number" },
            proximityToWater_m: { type: "number" },
          },
          required: ["slope", "elevation_m", "proximityToWater_m"],
        },
        geometry: {
          type: "object",
          properties: {
            footprint_m2: { type: "number" },
            height_m: { type: "number" },
            albedo: { type: "number" },
            vegetation_m2: { type: "number" },
          },
          required: ["footprint_m2", "height_m", "albedo", "vegetation_m2"],
        },
        water: {
          type: "object",
          properties: {
            rainwaterHarvesting_m3: { type: "number" },
            demand_m3: { type: "number" },
            greywaterReuse: { type: "boolean" },
          },
          required: ["rainwaterHarvesting_m3", "demand_m3", "greywaterReuse"],
        },
        climate: { type: "string" },
        rainfall_mm: { type: "number" },
      },
      required: ["terrain", "geometry", "water", "climate", "rainfall_mm"],
    },
    handler: async (args) => {
      const terrain = args.terrain as Terrain;
      const geometry = args.geometry as Geometry;
      const water = args.water as WaterSystems;
      const climate = args.climate as string;
      const rainfall = args.rainfall_mm as number;
      return resilienceIndex(terrain, geometry, water, climate, rainfall);
    },
  },
  {
    name: "rag_query",
    description: "Consulta la normativa (RNE, permits, lecciones aprendidas) por lenguaje natural. 35 documentos indexados.",
    inputSchema: {
      type: "object",
      properties: {
        question: { type: "string", description: "Pregunta en lenguaje natural." },
        topK: { type: "number", description: "Número de resultados (default 3)." },
      },
      required: ["question"],
    },
    handler: async (args) => {
      const question = args.question as string;
      const topK = (args.topK as number) ?? 3;
      return ragQuery(RAG_INDEX, question, topK);
    },
  },
];
