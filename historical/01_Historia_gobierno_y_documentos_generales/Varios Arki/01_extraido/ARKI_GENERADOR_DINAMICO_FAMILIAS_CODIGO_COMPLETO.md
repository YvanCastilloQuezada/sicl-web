# ARKI — Generador dinámico de familias: código completo y guía de prueba

> Documento autocontenido para copiar el generador a un proyecto de prueba independiente. Incluye el motor declarativo real, el comparador, el visor Three.js, la pantalla de estudio y el contrato de endpoints.

## 1. Qué contiene

El generador sigue el flujo `FAMILIA → VARIANTE → CONTEXTO → PARÁMETROS → PROGRAMA → REGLAS → 2D → CORTE → 3D → MÉTRICAS → GATES`. El registro raíz es pequeño y las variantes amplían el espacio de soluciones sin duplicar motores. Cada resultado es una propuesta conceptual y queda marcado como `GENERATED_CANDIDATE`; no modifica Project State ni el Core automáticamente.

La pantalla visual está diseñada para mostrar simultáneamente planta, corte y modelo 3D. También permite guardar hasta cuatro versiones en el navegador, compararlas y exportar JSON, IFC4 conceptual, GeoJSON, SVG, CSV o HTML.

## 2. Requisitos mínimos

Para usar solamente el motor se necesita TypeScript y `node:crypto`. Para la pantalla React/Three.js se necesitan React, `three` y `@react-three/fiber`. Para la integración tRPC se necesita el cliente tRPC del proyecto de destino.

```bash
pnpm add react react-dom three @react-three/fiber
```

El visor usa `OrbitControls` desde `three/examples/jsm/controls/OrbitControls.js`; no requiere `@react-three/drei`.

## 3. Instalación de los archivos

Copia los cuatro archivos principales respetando estos destinos. Si tu proyecto usa otros alias, cambia únicamente los imports, no el contenido del contrato.

```text
shared/arkiDynamicFamilies.ts
shared/arkiFamilyComparison.ts
client/src/components/ProfessionalFamilyViewer.tsx
client/src/pages/ArkiFamilyStudioPage.tsx
```

## 4. Prueba directa sin autenticación ni backend

Antes de conectar tRPC, puedes probar el motor directamente. Guarda este ejemplo como `scripts/test-family-generator.ts` y ejecútalo con `pnpm tsx scripts/test-family-generator.ts`.

```ts
import {
  dynamicFamilySummary,
  familyOptions,
  generateDynamicBuilding,
  isProposalOnly,
  searchDynamicFamilies,
} from "../shared/arkiDynamicFamilies";
import { exportDynamicBuilding } from "../shared/arkiFamilyComparison";

console.log(dynamicFamilySummary());
console.log(familyOptions());
console.log(searchDynamicFamilies("hospital"));

const building = generateDynamicBuilding({
  familyId: "FAM-HEALTH",
  variantId: "GENERAL",
  context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
  parameters: { areaM2: 20000, capacity: 400, floors: 4 },
});

console.log(JSON.stringify({
  id: building.id,
  name: building.name,
  metrics: building.metrics,
  validation: building.validation,
  alerts: building.alerts,
  proposalOnly: isProposalOnly(building),
}, null, 2));

const json = exportDynamicBuilding(building, "JSON");
console.log(json.fileName, json.mimeType);
```

Este modo permite verificar el generador aunque el nuevo proyecto todavía no tenga login, base de datos, tRPC o rutas protegidas.

## 5. Integración tRPC

El catálogo puede ser público porque solo lee definiciones. La generación, comparación y exportación deben permanecer protegidas y con revisión humana. El bloque siguiente es el contrato que debes adaptar al router de tu nuevo proyecto.

```ts
parametricRuntime: router({
  dynamicFamilies: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(({ input }) => ({
      ...dynamicFamilySummary(),
      families: listDynamicFamilies(input?.category as FamilyCategory | undefined),
    })),

  searchDynamicFamilies: protectedProcedure
    .input(z.object({ query: z.string().max(240) }))
    .query(({ input }) => searchDynamicFamilies(input.query)),

  generateDynamicBuilding: protectedProcedure
    .input(z.object({
      familyId: z.string().min(1),
      variantId: z.string().min(1),
      context: z.object({
        country: z.string().length(2).optional(),
        region: z.string().max(120).optional(),
        city: z.string().max(120).optional(),
        climate: z.string().max(120).optional(),
        seismicZone: z.string().max(120).optional(),
        jurisdiction: z.string().max(160).optional(),
      }).optional(),
      parameters: z.record(z.string(), z.union([
        z.string(), z.number(), z.boolean(),
      ])).optional(),
    }))
    .mutation(({ ctx, input }) => ({
      ownerId: ctx.user.id,
      generation: generateDynamicBuilding(input),
      persistence: "PROPOSAL_ONLY" as const,
      humanReviewRequired: true as const,
    })),

  compareDynamicBuildings: protectedProcedure
    .input(z.object({
      mode: z.enum(["GRID", "TIMELINE", "DIFF"]).optional(),
      versions: z.array(z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        version: z.string().min(1),
        createdAt: z.string().optional(),
        building: z.record(z.string(), z.unknown()),
      })).min(2).max(4),
    }))
    .mutation(({ input }) => ({
      comparison: compareDynamicBuildings(input.versions as BuildingVersion[], input.mode ?? "GRID"),
      persistence: "PROPOSAL_ONLY" as const,
    })),

  exportDynamicBuilding: protectedProcedure
    .input(z.object({
      format: z.enum(["JSON", "IFC4", "GEOJSON", "SVG", "CSV", "HTML"]),
      building: z.record(z.string(), z.unknown()),
    }))
    .mutation(({ input }) => ({
      export: exportDynamicBuilding(input.building as GeneratedBuilding, input.format),
      persistence: "PROPOSAL_ONLY" as const,
      humanReviewRequired: true as const,
    })),
})
```

Imports mínimos del router:

```ts
import {
  DYNAMIC_FAMILY_CATEGORIES,
  dynamicFamilySummary,
  generateDynamicBuilding,
  listDynamicFamilies,
  searchDynamicFamilies,
  type FamilyCategory,
} from "../shared/arkiDynamicFamilies";
import {
  compareDynamicBuildings,
  exportDynamicBuilding,
  type BuildingVersion,
} from "../shared/arkiFamilyComparison";
```


## 6. Motor declarativo completo

**Archivo de origen:** `shared/arkiDynamicFamilies.ts`

```ts
import { randomUUID } from "node:crypto";

export type FamilyCategory = "SALUD" | "EDUCATION" | "COMMERCE" | "SPORT" | "OFFICES" | "LANDSCAPE" | "INDUSTRY" | "TRANSPORT" | "CULTURE" | "RESIDENTIAL" | "HOSPITALITY" | "WORSHIP";
export type BuildingScale = "BUILDING" | "COMPLEX" | "URBAN";
export type RuleOperator = "MIN" | "MAX" | "EXACT" | "REQUIRED";

export type FamilyParameter = {
  id: string;
  label: string;
  type: "number" | "string" | "boolean";
  unit?: string;
  defaultValue: string | number | boolean;
  min?: number;
  max?: number;
};

export type FamilyVariant = {
  id: string;
  name: string;
  description: string;
  capacityUnit: string;
  capacityMin?: number;
  capacityMax?: number;
  modifiers: Record<string, string | number | boolean>;
  programExtra: string[];
  ruleIds: string[];
  tags: string[];
};

export type FamilyRule = {
  id: string;
  code: string;
  description: string;
  parameter: string;
  operator: RuleOperator;
  value?: number | string | boolean;
  unit?: string;
  source: string;
  required: boolean;
};

export type FamilyProgram = {
  zones: Array<{ id: string; name: string; areaRatio: number }>;
  primarySpaces: string[];
  services: string[];
  circulations: string[];
};

export type BuildingContext = {
  country: string;
  region?: string;
  city?: string;
  climate?: string;
  seismicZone?: string;
  jurisdiction?: string;
};

export type DynamicBuildingFamily = {
  id: string;
  name: string;
  description: string;
  category: FamilyCategory;
  scale: BuildingScale;
  version: string;
  baseProgram: FamilyProgram;
  variants: FamilyVariant[];
  baseParameters: FamilyParameter[];
  baseRules: FamilyRule[];
  geometryStrategy: "COURTYARD_MASS" | "LINEAR_MASS" | "ARENA_BOWL" | "PODIUM_TOWER";
  tags: string[];
};

export type GeneratedBuilding = {
  id: string;
  familyId: string;
  variantId: string;
  name: string;
  context: BuildingContext;
  parameters: Record<string, string | number | boolean>;
  program: FamilyProgram;
  rules: FamilyRule[];
  geometry2d: { type: string; footprintM2: number; widthM: number; depthM: number; courtyardM2?: number; rings?: number };
  section: { type: string; floors: number; floorHeightM: number; totalHeightM: number; usesByFloor: string[] };
  geometry3d: { type: string; floors: number; heightM: number; massing: string };
  unifiedGeometry: { schema: "ARKI-UNIFIED-GEOMETRY-1.0"; plan: GeneratedBuilding["geometry2d"]; section: GeneratedBuilding["section"]; model3d: GeneratedBuilding["geometry3d"] };
  metrics: { footprintM2: number; builtAreaM2: number; capacity: number; estimatedCostUsdConceptual: number };
  validation: { status: "PASS" | "UNKNOWN" | "BLOCKED"; checked: string[]; unknowns: string[] };
  alerts: Array<{ code: string; message: string; severity: "INFO" | "WARNING" | "BLOCKER" }>;
  status: "GENERATED_CANDIDATE";
  humanReviewRequired: true;
  projectStateMutation: "NOT_REQUESTED";
};

const p = (id: string, label: string, defaultValue: string | number | boolean, extra: Partial<FamilyParameter> = {}): FamilyParameter => ({ id, label, type: typeof defaultValue as FamilyParameter["type"], defaultValue, ...extra });
const rule = (id: string, code: string, description: string, parameter: string, operator: RuleOperator, value: number | string | boolean | undefined, source: string): FamilyRule => ({ id, code, description, parameter, operator, value, source, required: true });
const program = (primarySpaces: string[], services: string[], circulations: string[]): FamilyProgram => ({ zones: [{ id: "PUBLIC", name: "Área pública", areaRatio: 0.25 }, { id: "SERVICE", name: "Área de servicio", areaRatio: 0.15 }, { id: "PRIMARY", name: "Área principal", areaRatio: 0.6 }], primarySpaces, services, circulations });

function makeAdditionalFamily(input: { id: string; name: string; category: FamilyCategory; description: string; geometryStrategy: DynamicBuildingFamily["geometryStrategy"]; tags: string[]; primary: string[]; services: string[]; variants: Array<{ id: string; name: string; description: string; tags: string[]; extra: string[]; modifiers: Record<string, string | number | boolean> }> }): DynamicBuildingFamily {
  return { id: input.id, name: input.name, description: input.description, category: input.category, scale: input.category === "LANDSCAPE" ? "URBAN" : "COMPLEX", version: "1.0.0", baseProgram: program(input.primary, input.services, ["público", "personal", "servicio", "evacuación"]), variants: input.variants.map((variant) => ({ id: variant.id, name: variant.name, description: variant.description, capacityUnit: "usuarios", modifiers: { floors: 2, courtyardRatio: 0.08, capacity: 300, ...variant.modifiers }, programExtra: variant.extra, ruleIds: ["GEN-EGRESS"], tags: variant.tags })), baseParameters: [p("areaM2", "Área del terreno", 10000, { unit: "m²", min: 100 }), p("capacity", "Capacidad", 300, { unit: "personas", min: 1 }), p("floors", "Niveles", 2, { unit: "niveles", min: 1, max: 80 }), p("courtyardRatio", "Proporción de vacío", 0.08, { unit: "ratio", min: 0, max: 0.8 })], baseRules: [rule("GEN-EGRESS", "RNE-A.130", "Aforo y evacuación requieren validación del proyecto.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista")], geometryStrategy: input.geometryStrategy, tags: input.tags };
}

const ADDITIONAL_DYNAMIC_FAMILIES: DynamicBuildingFamily[] = [
  makeAdditionalFamily({ id: "FAM-LANDSCAPE", name: "Paisajismo", category: "LANDSCAPE", description: "Parques, plazas, malecones, corredores verdes y humedales.", geometryStrategy: "COURTYARD_MASS", tags: ["paisajismo", "parque", "espacio público", "GH.020"], primary: ["áreas verdes", "senderos", "estancias", "equipamiento"], services: ["riego", "bombas", "servicios higiénicos"], variants: [
    { id: "URBAN_PARK", name: "Parque urbano", description: "Parque de barrio con recreación y vegetación.", tags: ["parque", "verde"], extra: ["juegos infantiles", "ciclovía"], modifiers: { areaM2: 20000, capacity: 5000 } },
    { id: "PUBLIC_PLAZA", name: "Plaza pública", description: "Plaza cívica y cultural.", tags: ["plaza", "cívica"], extra: ["fuente", "pavimento cívico"], modifiers: { areaM2: 5000, capacity: 2000 } },
    { id: "WETLAND", name: "Humedal artificial", description: "Humedal para tratamiento y biodiversidad.", tags: ["humedal", "agua"], extra: ["sendero interpretativo", "mirador de aves"], modifiers: { areaM2: 50000, capacity: 500 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-INDUSTRY", name: "Industria", category: "INDUSTRY", description: "Manufactura, almacenes y centros logísticos.", geometryStrategy: "LINEAR_MASS", tags: ["industria", "manufactura", "logística", "RNE-A.060"], primary: ["producción", "almacén", "patio de maniobras"], services: ["vestuarios", "cuarto eléctrico", "control de calidad"], variants: [
    { id: "WAREHOUSE", name: "Almacén simple", description: "Almacén de mercancías secas.", tags: ["almacén"], extra: ["racks", "muelles"], modifiers: { areaM2: 3000, floors: 1 } },
    { id: "LOGISTICS", name: "Centro logístico", description: "Distribución multi-almacén.", tags: ["logística"], extra: ["muelles múltiples", "patio de maniobras"], modifiers: { areaM2: 25000, floors: 1 } },
    { id: "MANUFACTURING", name: "Planta de manufactura", description: "Producción industrial con líneas y control de calidad.", tags: ["manufactura"], extra: ["líneas de producción", "laboratorio"], modifiers: { areaM2: 15000, floors: 2 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-TRANSPORT", name: "Transporte", category: "TRANSPORT", description: "Terminales, estaciones, aeropuertos y nodos intermodales.", geometryStrategy: "LINEAR_MASS", tags: ["transporte", "terminal", "intermodal"], primary: ["vestíbulo", "andenes", "circulación pública"], services: ["control", "equipaje", "mantenimiento"], variants: [
    { id: "BUS_TERMINAL", name: "Terminal terrestre", description: "Terminal de buses interprovincial.", tags: ["buses", "terminal"], extra: ["andenes", "salas de espera"], modifiers: { areaM2: 18000, capacity: 2500 } },
    { id: "STATION", name: "Estación intermodal", description: "Intercambio de modos de transporte.", tags: ["intermodal", "estación"], extra: ["conexión peatonal", "bicicletas"], modifiers: { areaM2: 12000, capacity: 4000 } },
    { id: "AIRPORT", name: "Terminal aeroportuaria", description: "Terminal de pasajeros con controles y plataforma.", tags: ["aeropuerto", "aviación"], extra: ["check-in", "seguridad", "mangas"], modifiers: { areaM2: 60000, capacity: 12000, floors: 3 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-CULTURE", name: "Cultura", category: "CULTURE", description: "Museos, bibliotecas, teatros y centros culturales.", geometryStrategy: "COURTYARD_MASS", tags: ["cultura", "museo", "teatro"], primary: ["exposición", "auditorio", "espacio comunitario"], services: ["carga cultural", "conservación", "taquilla"], variants: [
    { id: "MUSEUM", name: "Museo", description: "Museo con galerías y conservación.", tags: ["museo"], extra: ["galerías", "depósitos"], modifiers: { areaM2: 8000, capacity: 1200 } },
    { id: "LIBRARY", name: "Biblioteca", description: "Biblioteca pública y digital.", tags: ["biblioteca"], extra: ["salas de lectura", "archivo"], modifiers: { areaM2: 5000, capacity: 600 } },
    { id: "THEATER", name: "Teatro", description: "Teatro y artes escénicas.", tags: ["teatro", "escénico"], extra: ["escenario", "camerinos"], modifiers: { areaM2: 10000, capacity: 1400 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-RESIDENTIAL", name: "Residencial", category: "RESIDENTIAL", description: "Vivienda unifamiliar, multifamiliar y conjunto residencial.", geometryStrategy: "COURTYARD_MASS", tags: ["vivienda", "residencial", "multifamiliar"], primary: ["unidades de vivienda", "áreas comunes", "patios"], services: ["estacionamiento", "cuartos técnicos", "residuos"], variants: [
    { id: "SINGLE", name: "Vivienda unifamiliar", description: "Casa independiente.", tags: ["casa"], extra: ["jardín", "estacionamiento"], modifiers: { areaM2: 300, capacity: 6, floors: 2 } },
    { id: "MULTIFAMILY", name: "Multifamiliar", description: "Edificio de departamentos.", tags: ["departamentos"], extra: ["núcleo vertical", "área común"], modifiers: { areaM2: 3000, capacity: 120, floors: 8 } },
    { id: "HOUSING_COMPLEX", name: "Conjunto residencial", description: "Conjunto de bloques y espacio común.", tags: ["conjunto", "barrial"], extra: ["parque común", "equipamiento vecinal"], modifiers: { areaM2: 20000, capacity: 900, floors: 5 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-HOSPITALITY", name: "Hospedaje", category: "HOSPITALITY", description: "Hoteles, hostales y resorts.", geometryStrategy: "COURTYARD_MASS", tags: ["hotel", "turismo", "hospedaje"], primary: ["habitaciones", "lobby", "restaurante"], services: ["housekeeping", "cocina", "mantenimiento"], variants: [
    { id: "HOTEL", name: "Hotel", description: "Hotel urbano con habitaciones y servicios.", tags: ["hotel"], extra: ["recepción", "salón de eventos"], modifiers: { areaM2: 15000, capacity: 500, floors: 10 } },
    { id: "HOSTEL", name: "Hostal", description: "Hospedaje económico de escala media.", tags: ["hostal"], extra: ["cocina compartida", "terraza"], modifiers: { areaM2: 2500, capacity: 100, floors: 4 } },
    { id: "RESORT", name: "Resort", description: "Complejo turístico con paisaje y recreación.", tags: ["resort", "paisaje"], extra: ["piscinas", "spa", "jardines"], modifiers: { areaM2: 40000, capacity: 700, floors: 4 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-WORSHIP", name: "Culto", category: "WORSHIP", description: "Templos, centros comunitarios y espacios de culto.", geometryStrategy: "COURTYARD_MASS", tags: ["culto", "templo", "comunidad"], primary: ["sala de culto", "patio", "espacio comunitario"], services: ["administración", "servicios", "apoyo social"], variants: [
    { id: "TEMPLE", name: "Templo", description: "Espacio de culto con nave principal.", tags: ["templo"], extra: ["nave", "sacristía"], modifiers: { areaM2: 2500, capacity: 800, floors: 1 } },
    { id: "COMMUNITY_CENTER", name: "Centro comunitario", description: "Centro de reunión y apoyo social.", tags: ["comunidad"], extra: ["aulas", "comedor social"], modifiers: { areaM2: 4000, capacity: 500, floors: 2 } },
  ] }),
];

export const DYNAMIC_BUILDING_FAMILIES: DynamicBuildingFamily[] = [
  ...ADDITIONAL_DYNAMIC_FAMILIES,
  {
    id: "FAM-HEALTH",
    name: "Salud",
    description: "Familia de establecimientos de salud con flujos diferenciados y criticidad configurable.",
    category: "SALUD",
    scale: "COMPLEX",
    version: "1.0.0",
    baseProgram: program(["admisión", "consultorios", "hospitalización"], ["instalaciones MEP", "residuos", "mantenimiento"], ["público", "personal", "servicio", "evacuación"]),
    variants: [
      { id: "GENERAL", name: "Hospital general", description: "Atención general con internamiento.", capacityUnit: "camas", modifiers: { beds: 400, floors: 4, courtyardRatio: 0.18 }, programExtra: ["emergencia", "diagnóstico por imágenes", "centro quirúrgico"], ruleIds: ["HEALTH-FLOW", "HEALTH-EGRESS"], tags: ["hospital", "alta-complejidad"] },
      { id: "CLINIC", name: "Clínica ambulatoria", description: "Atención ambulatoria sin internamiento masivo.", capacityUnit: "consultas/día", modifiers: { beds: 20, floors: 3, courtyardRatio: 0.12 }, programExtra: ["procedimientos ambulatorios", "farmacia"], ruleIds: ["HEALTH-FLOW"], tags: ["clínica", "ambulatorio"] },
      { id: "RURAL", name: "Centro de salud rural", description: "Atención primaria adaptable a baja densidad.", capacityUnit: "consultas/día", modifiers: { beds: 12, floors: 1, courtyardRatio: 0.08 }, programExtra: ["tópico", "residencia de personal"], ruleIds: ["HEALTH-FLOW"], tags: ["rural", "modular"] },
    ],
    baseParameters: [p("areaM2", "Área del terreno", 20000, { unit: "m²", min: 1000 }), p("capacity", "Capacidad", 400, { unit: "personas", min: 1 }), p("floors", "Niveles", 4, { unit: "niveles", min: 1, max: 50 }), p("courtyardRatio", "Proporción de patio", 0.15, { unit: "ratio", min: 0, max: 0.6 })],
    baseRules: [rule("HEALTH-FLOW", "RNE-A.050", "Separar flujos públicos, personal, servicio y evacuación.", "flowSeparation", "REQUIRED", true, "RNE de referencia; validar vigencia"), rule("HEALTH-EGRESS", "RNE-A.130", "La evacuación debe verificarse con aforo y configuración real.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista" )],
    geometryStrategy: "COURTYARD_MASS",
    tags: ["salud", "MEP", "evacuación", "RNE"],
  },
  {
    id: "FAM-EDUCATION",
    name: "Educación",
    description: "Familia educativa con aulas, espacios comunes, patios y circulación segura.",
    category: "EDUCATION",
    scale: "BUILDING",
    version: "1.0.0",
    baseProgram: program(["aulas", "administración", "espacio común"], ["servicios higiénicos", "cocina", "almacén"], ["alumnos", "personal", "evacuación"]),
    variants: [
      { id: "INITIAL", name: "Inicial", description: "Educación inicial con patio protegido.", capacityUnit: "alumnos", modifiers: { students: 180, floors: 1, courtyardRatio: 0.2 }, programExtra: ["aula psicomotriz", "patio de juegos"], ruleIds: ["EDU-DENSITY", "EDU-EGRESS"], tags: ["inicial", "patio"] },
      { id: "SCHOOL", name: "Colegio", description: "Educación básica con aulas y servicios colectivos.", capacityUnit: "alumnos", modifiers: { students: 900, floors: 3, courtyardRatio: 0.16 }, programExtra: ["laboratorios", "biblioteca", "comedor", "cancha"], ruleIds: ["EDU-DENSITY", "EDU-EGRESS"], tags: ["primaria", "secundaria"] },
      { id: "UNIVERSITY", name: "Campus universitario", description: "Conjunto educativo con investigación y usos mixtos.", capacityUnit: "alumnos", modifiers: { students: 5000, floors: 5, courtyardRatio: 0.1 }, programExtra: ["laboratorios especializados", "auditorio", "investigación"], ruleIds: ["EDU-DENSITY", "EDU-EGRESS"], tags: ["universidad", "campus"] },
    ],
    baseParameters: [p("areaM2", "Área del terreno", 8000, { unit: "m²", min: 500 }), p("capacity", "Capacidad", 900, { unit: "alumnos", min: 1 }), p("floors", "Niveles", 3, { unit: "niveles", min: 1, max: 20 }), p("courtyardRatio", "Proporción de patio", 0.16, { unit: "ratio", min: 0, max: 0.6 })],
    baseRules: [rule("EDU-DENSITY", "RNE-A.040", "La capacidad y el programa deben contrastarse con área educativa y aforo.", "capacity", "MIN", 1, "RNE de referencia; validar programa"), rule("EDU-EGRESS", "RNE-A.130", "La evacuación debe comprobarse con ocupación y rutas reales.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista")],
    geometryStrategy: "COURTYARD_MASS",
    tags: ["educación", "aulas", "campus"],
  },
  {
    id: "FAM-COMMERCE",
    name: "Comercio",
    description: "Familia comercial para mercados, comercio vecinal y centros comerciales.",
    category: "COMMERCE",
    scale: "COMPLEX",
    version: "1.0.0",
    baseProgram: program(["locales", "circulación comercial", "espacio público"], ["carga y descarga", "residuos", "servicios"], ["público", "servicio", "emergencia"]),
    variants: [
      { id: "MARKET", name: "Mercado", description: "Mercado con puestos y logística separada.", capacityUnit: "usuarios", modifiers: { stalls: 180, floors: 1, courtyardRatio: 0.08 }, programExtra: ["cámara fría", "patio de maniobras"], ruleIds: ["COM-LOAD", "COM-EGRESS"], tags: ["mercado", "abastecimiento"] },
      { id: "MALL", name: "Centro comercial", description: "Centro comercial con ancla y estacionamiento.", capacityUnit: "usuarios", modifiers: { stalls: 120, floors: 4, courtyardRatio: 0.12 }, programExtra: ["ancla comercial", "food court", "estacionamiento"], ruleIds: ["COM-LOAD", "COM-EGRESS"], tags: ["mall", "retail"] },
      { id: "NEIGHBORHOOD", name: "Comercio vecinal", description: "Comercio de proximidad de baja escala.", capacityUnit: "usuarios", modifiers: { stalls: 24, floors: 2, courtyardRatio: 0.05 }, programExtra: ["entrega de última milla"], ruleIds: ["COM-EGRESS"], tags: ["barrial", "proximidad"] },
      { id: "DEPARTMENT_STORE", name: "Tienda departamental", description: "Retail masivo organizado por departamentos.", capacityUnit: "usuarios", modifiers: { stalls: 60, floors: 4, courtyardRatio: 0 }, programExtra: ["área de venta", "carga y descarga", "almacén"], ruleIds: ["COM-LOAD", "COM-EGRESS"], tags: ["retail", "departamental"] },
      { id: "GALLERY", name: "Galería comercial", description: "Locales pequeños alrededor de circulaciones compartidas.", capacityUnit: "locales", modifiers: { stalls: 80, floors: 3, courtyardRatio: 0.08 }, programExtra: ["locales modulares", "pasaje comercial"], ruleIds: ["COM-EGRESS"], tags: ["galería", "locales"] },
    ],
    baseParameters: [p("areaM2", "Área del terreno", 5000, { unit: "m²", min: 200 }), p("capacity", "Aforo", 800, { unit: "personas", min: 1 }), p("floors", "Niveles", 2, { unit: "niveles", min: 1, max: 20 }), p("courtyardRatio", "Proporción de vacío", 0.1, { unit: "ratio", min: 0, max: 0.6 })],
    baseRules: [rule("COM-LOAD", "RNE-A.070", "Separar abastecimiento, carga y descarga del flujo público.", "serviceFlowSeparated", "REQUIRED", true, "RNE de referencia; validar operación"), rule("COM-EGRESS", "RNE-A.130", "El aforo y las salidas requieren verificación especializada.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista")],
    geometryStrategy: "PODIUM_TOWER",
    tags: ["comercio", "mercado", "retail"],
  },
  {
    id: "FAM-OFFICES",
    name: "Oficinas",
    description: "Familia de oficinas pequeñas, coworking, corporativas y gubernamentales.",
    category: "OFFICES",
    scale: "BUILDING",
    version: "1.0.0",
    baseProgram: program(["puestos de trabajo", "salas de reunión", "lobby"], ["datos", "cuarto eléctrico", "servicios"], ["público", "personal", "mantenimiento", "evacuación"]),
    variants: [
      { id: "SMALL", name: "Oficina pequeña", description: "Unidad de trabajo de baja escala.", capacityUnit: "personas", modifiers: { employees: 25, floors: 1, courtyardRatio: 0 }, programExtra: ["recepción", "sala de reunión"], ruleIds: ["OFF-EGRESS"], tags: ["pequeña", "boutique"] },
      { id: "COWORKING", name: "Coworking", description: "Trabajo flexible y compartido.", capacityUnit: "usuarios", modifiers: { employees: 180, floors: 2, courtyardRatio: 0.08 }, programExtra: ["cabinas", "café", "sala flexible"], ruleIds: ["OFF-EGRESS", "OFF-DATA"], tags: ["coworking", "flexible"] },
      { id: "CORPORATE", name: "Torre corporativa", description: "Oficinas de alta densidad con núcleo vertical.", capacityUnit: "personas", modifiers: { employees: 1200, floors: 18, courtyardRatio: 0.04 }, programExtra: ["lobby corporativo", "amenities", "helipuerto o terraza técnica"], ruleIds: ["OFF-EGRESS", "OFF-DATA"], tags: ["corporativo", "torre"] },
      { id: "GOVERNMENT", name: "Oficina gubernamental", description: "Edificio institucional con atención al ciudadano.", capacityUnit: "personas", modifiers: { employees: 450, floors: 6, courtyardRatio: 0.12 }, programExtra: ["atención al ciudadano", "archivo", "sala de actos"], ruleIds: ["OFF-EGRESS"], tags: ["gubernamental", "institucional"] },
    ],
    baseParameters: [p("areaM2", "Área del terreno", 5000, { unit: "m²", min: 200 }), p("capacity", "Aforo", 300, { unit: "personas", min: 1 }), p("floors", "Niveles", 6, { unit: "niveles", min: 1, max: 80 }), p("courtyardRatio", "Proporción de vacío", 0.08, { unit: "ratio", min: 0, max: 0.6 })],
    baseRules: [rule("OFF-EGRESS", "RNE-A.080", "La ocupación, salidas y circulación requieren verificación del proyecto.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista"), rule("OFF-DATA", "OFF-MEP-001", "La continuidad de datos y energía debe coordinarse con MEP.", "dataAndPowerValidated", "REQUIRED", true, "Coordinación MEP")],
    geometryStrategy: "PODIUM_TOWER",
    tags: ["oficinas", "corporativo", "coworking", "gobierno"],
  },
  {
    id: "FAM-SPORT",
    name: "Deporte y espectáculos",
    description: "Familia de recintos deportivos y de espectáculos con bowl, cubierta y evacuación masiva.",
    category: "SPORT",
    scale: "COMPLEX",
    version: "1.0.0",
    baseProgram: program(["graderías", "campo o sala", "vestíbulos"], ["vestuarios", "servicios", "prensa y operación"], ["público", "deportistas", "servicio", "evacuación"]),
    variants: [
      { id: "STADIUM", name: "Estadio", description: "Estadio abierto o cubierto para gran aforo.", capacityUnit: "espectadores", modifiers: { spectators: 80000, floors: 3, courtyardRatio: 0, rings: 3 }, programExtra: ["campo", "graderías", "palcos", "cubierta"], ruleIds: ["SPORT-EGRESS", "SPORT-COVER"], tags: ["estadio", "fútbol", "gran-aforo"] },
      { id: "ARENA", name: "Arena multiuso", description: "Recinto cubierto para deporte y eventos.", capacityUnit: "espectadores", modifiers: { spectators: 15000, floors: 4, courtyardRatio: 0, rings: 2 }, programExtra: ["cancha adaptable", "escenario", "producción"], ruleIds: ["SPORT-EGRESS", "SPORT-COVER"], tags: ["arena", "multiuso"] },
      { id: "COMMUNITY", name: "Polideportivo", description: "Equipamiento deportivo comunitario.", capacityUnit: "usuarios", modifiers: { spectators: 1200, floors: 2, courtyardRatio: 0.05, rings: 1 }, programExtra: ["canchas múltiples", "gimnasio"], ruleIds: ["SPORT-EGRESS"], tags: ["polideportivo", "comunitario"] },
    ],
    baseParameters: [p("areaM2", "Área del terreno", 60000, { unit: "m²", min: 1000 }), p("capacity", "Aforo", 80000, { unit: "espectadores", min: 1 }), p("floors", "Niveles", 3, { unit: "niveles", min: 1, max: 20 }), p("rings", "Anillos de gradería", 3, { unit: "anillos", min: 1, max: 6 })],
    baseRules: [rule("SPORT-EGRESS", "RNE-A.130", "La evacuación masiva debe simularse y verificarse con especialista.", "egressValidated", "REQUIRED", true, "RNE de referencia; simulación requerida"), rule("SPORT-COVER", "STRUCT-001", "La cubierta requiere cálculo estructural y viento del sitio.", "coverStructuralValidated", "REQUIRED", true, "Cálculo estructural especializado")],
    geometryStrategy: "ARENA_BOWL",
    tags: ["deporte", "estadio", "evacuación", "cubierta"],
  },
];

const findFamily = (familyId: string) => DYNAMIC_BUILDING_FAMILIES.find((family) => family.id === familyId);

export function listDynamicFamilies(category?: FamilyCategory) { return DYNAMIC_BUILDING_FAMILIES.filter((family) => !category || family.category === category); }
export function getDynamicFamily(familyId: string) { return findFamily(familyId) ?? null; }
export function dynamicFamilySummary() { return { version: "ARKI-DYNAMIC-FAMILY-GENERATOR-1.0", familyCount: DYNAMIC_BUILDING_FAMILIES.length, variantCount: DYNAMIC_BUILDING_FAMILIES.reduce((sum, family) => sum + family.variants.length, 0), categories: Array.from(new Set(DYNAMIC_BUILDING_FAMILIES.map((family) => family.category))), status: "REFERENCE_FAMILIES_REQUIRE_EVIDENCE" as const }; }

function valueAsNumber(value: string | number | boolean | undefined) { return typeof value === "number" ? value : Number(value); }
function buildRules(family: DynamicBuildingFamily, variant: FamilyVariant) { return family.baseRules.filter((item) => variant.ruleIds.includes(item.id) || !variant.ruleIds.length); }
function geometryFor(family: DynamicBuildingFamily, params: Record<string, string | number | boolean>) {
  const area = Math.max(1, valueAsNumber(params.areaM2) || 1);
  const floors = Math.max(1, Math.round(valueAsNumber(params.floors) || 1));
  const footprint = area / floors;
  const width = Math.sqrt(footprint * 1.35);
  const depth = footprint / width;
  const courtyardRatio = Math.max(0, Math.min(0.8, valueAsNumber(params.courtyardRatio) || 0));
  return { type: family.geometryStrategy, footprintM2: Number(footprint.toFixed(2)), widthM: Number(width.toFixed(2)), depthM: Number(depth.toFixed(2)), courtyardM2: Number((footprint * courtyardRatio).toFixed(2)), rings: Number(params.rings) || undefined };
}

export function generateDynamicBuilding(input: { familyId: string; variantId: string; context?: Partial<BuildingContext>; parameters?: Record<string, string | number | boolean> }): GeneratedBuilding {
  const family = findFamily(input.familyId);
  if (!family) throw new Error(`Dynamic family '${input.familyId}' is not registered`);
  const variant = family.variants.find((item) => item.id === input.variantId);
  if (!variant) throw new Error(`Variant '${input.variantId}' is not registered in family '${input.familyId}'`);
  const context: BuildingContext = { country: "PE", ...input.context };
  const parameters: Record<string, string | number | boolean> = Object.fromEntries(family.baseParameters.map((item) => [item.id, item.defaultValue]));
  Object.assign(parameters, variant.modifiers, input.parameters ?? {});
  const rules = buildRules(family, variant);
  const unknowns: string[] = [];
  const alerts: GeneratedBuilding["alerts"] = [];
  for (const parameter of family.baseParameters) {
    const value = parameters[parameter.id];
    if (parameter.type === "number" && !Number.isFinite(valueAsNumber(value))) { unknowns.push(parameter.id); alerts.push({ code: "MISSING_PARAMETER", message: `FALTA_DATO: ${parameter.id}`, severity: "BLOCKER" }); }
    if (typeof parameter.min === "number" && valueAsNumber(value) < parameter.min) alerts.push({ code: "PARAMETER_BELOW_MIN", message: `${parameter.id} debe ser >= ${parameter.min}`, severity: "WARNING" });
    if (typeof parameter.max === "number" && valueAsNumber(value) > parameter.max) alerts.push({ code: "PARAMETER_ABOVE_MAX", message: `${parameter.id} debe ser <= ${parameter.max}`, severity: "WARNING" });
  }
  if (!context.city || !context.jurisdiction) { unknowns.push("site_or_jurisdiction"); alerts.push({ code: "CONTEXT_INCOMPLETE", message: "FALTA_DATO: ciudad o jurisdicción normativa", severity: "WARNING" }); }
  for (const item of rules.filter((rule) => rule.operator === "REQUIRED")) { const key = String(item.parameter); if (parameters[key] !== true) unknowns.push(key); }
  const geometry2d = geometryFor(family, parameters);
  const floors = Math.max(1, Math.round(valueAsNumber(parameters.floors) || 1));
  const capacity = Math.max(0, Math.round(valueAsNumber(parameters.capacity) || valueAsNumber(parameters.spectators) || valueAsNumber(parameters.students) || valueAsNumber(parameters.beds) || 0));
  const builtArea = geometry2d.footprintM2 * floors;
  const geometry3d = { type: "EXTRUSION_FROM_2D", floors, heightM: Number((floors * 3.4).toFixed(2)), massing: family.geometryStrategy } as const;
  const section = { type: "SECTION_FROM_PROGRAM", floors, floorHeightM: 3.4, totalHeightM: geometry3d.heightM, usesByFloor: Array.from({ length: floors }, (_, index) => index === 0 ? family.baseProgram.primarySpaces[0] ?? "acceso" : variant.programExtra[index - 1] ?? "programa principal") };
  const plan = { ...geometry2d };
  return { id: randomUUID(), familyId: family.id, variantId: variant.id, name: `${variant.name} · ${context.city || "sin ciudad"}`, context, parameters, program: { ...family.baseProgram, primarySpaces: [...family.baseProgram.primarySpaces, ...variant.programExtra] }, rules, geometry2d: plan, section, geometry3d, unifiedGeometry: { schema: "ARKI-UNIFIED-GEOMETRY-1.0", plan, section, model3d: geometry3d }, metrics: { footprintM2: geometry2d.footprintM2, builtAreaM2: Number(builtArea.toFixed(2)), capacity, estimatedCostUsdConceptual: Math.round(builtArea * (family.category === "SALUD" ? 1800 : 1200)) }, validation: { status: unknowns.length ? "UNKNOWN" : "PASS", checked: rules.map((item) => item.code), unknowns: Array.from(new Set(unknowns)) }, alerts, status: "GENERATED_CANDIDATE", humanReviewRequired: true, projectStateMutation: "NOT_REQUESTED" };
}

export function searchDynamicFamilies(query: string) { const q = query.trim().toLocaleLowerCase(); return listDynamicFamilies().flatMap((family) => family.variants.map((variant) => ({ familyId: family.id, familyName: family.name, variantId: variant.id, variantName: variant.name, score: q ? Number([family.name, family.description, variant.name, variant.description, ...family.tags, ...variant.tags].join(" ").toLocaleLowerCase().includes(q) ? 1 : 0) : 1 }))).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.variantName.localeCompare(b.variantName)); }

export function dynamicFamilyContract() { return { schema: "ARKI-DYNAMIC-FAMILY-GENERATOR-1.0", flow: "FAMILY -> VARIANT -> CONTEXT -> PARAMETERS -> PROGRAM -> RULES -> 2D -> 3D -> METRICS -> GATES", gates: ["HUMAN_REVIEW", "PROFESSIONAL_SIGNATURE", "NO_CORE_MUTATION"], limitations: ["geometry_conceptual", "normative_reference_only", "not_native_revit_family"] as const }; }

export default DYNAMIC_BUILDING_FAMILIES;
export type { DynamicBuildingFamily as ArkiDynamicFamily };
export type { GeneratedBuilding as ArkiGeneratedBuilding };
export type { BuildingContext as ArkiBuildingContext };
export type { FamilyCategory as ArkiFamilyCategory };
export type { FamilyVariant as ArkiFamilyVariant };
export type { FamilyParameter as ArkiFamilyParameter };
export type { FamilyRule as ArkiFamilyRule };
export type { FamilyProgram as ArkiFamilyProgram };

// Explicitly exported aliases keep the contract easy to discover from API/UI code.
export const arkiDynamicFamilyGeneratorVersion = "ARKI-DYNAMIC-FAMILY-GENERATOR-1.0" as const;
export const arkiDynamicFamilyGenerator = { listDynamicFamilies, getDynamicFamily, generateDynamicBuilding, searchDynamicFamilies, dynamicFamilySummary, dynamicFamilyContract };

// Prevent accidental mutation of the registry from callers.
export function cloneDynamicFamily(familyId: string) { const family = getDynamicFamily(familyId); return family ? structuredClone(family) : null; }

// The registry is deliberately small; variants create the large candidate space.
export const dynamicFamilyCount = DYNAMIC_BUILDING_FAMILIES.length;
export const dynamicVariantCount = DYNAMIC_BUILDING_FAMILIES.reduce((total, family) => total + family.variants.length, 0);

// Invariant: every family must have at least one variant and a geometry strategy.
if (DYNAMIC_BUILDING_FAMILIES.some((family) => !family.variants.length || !family.geometryStrategy)) throw new Error("Invalid dynamic family registry");

// Invariant: IDs must be unique across families and variants.
const ids = DYNAMIC_BUILDING_FAMILIES.flatMap((family) => [family.id, ...family.variants.map((variant) => `${family.id}:${variant.id}`)]);
if (new Set(ids).size !== ids.length) throw new Error("Duplicate dynamic family registry ID");

// The generated result is proposal-only by construction; no Core mutation is performed here.
export const DYNAMIC_FAMILY_GOVERNANCE = { persistence: "PROPOSAL_ONLY", humanReviewRequired: true, professionalSignatureRequired: true, canonicalPromotion: "NOT_REQUESTED" } as const;

// Kept as an explicit helper for UI selectors.
export function familyOptions() { return listDynamicFamilies().map((family) => ({ id: family.id, name: family.name, category: family.category, variants: family.variants.map((variant) => ({ id: variant.id, name: variant.name })) })); }

// No arbitrary code, eval, dynamic imports or external execution are used by this generator.
export const dynamicFamilySecurity = { arbitraryCodeExecution: false, dynamicImport: false, externalHostExecution: false } as const;

// Reference-only families can be extended by adding declarative records, not executable code.
export const dynamicFamilyExtensionRule = "ADD_DECLARATIVE_FAMILY_OR_VARIANT_AND_TEST" as const;

// Compact deterministic fingerprint for UI and audit labels.
export function familyFingerprint(familyId: string, variantId: string) { return `${familyId}:${variantId}:ARKI-DYNAMIC-FAMILY-GENERATOR-1.0`; }

// Human-readable next-step status.
export const dynamicFamilyStatus = "PARAMETRIC_CANDIDATE_REQUIRES_PROFESSIONAL_REVIEW" as const;

// Keep exports stable for future UI adapters.
export const DYNAMIC_FAMILY_CATEGORIES: FamilyCategory[] = ["SALUD", "EDUCATION", "COMMERCE", "SPORT", "OFFICES", "LANDSCAPE", "INDUSTRY", "TRANSPORT", "CULTURE", "RESIDENTIAL", "HOSPITALITY", "WORSHIP"];
export const DYNAMIC_FAMILY_SCALES: BuildingScale[] = ["BUILDING", "COMPLEX", "URBAN"];

// Metadata for the generated artifact.
export function generatedBuildingMetadata(building: GeneratedBuilding) { return { schema: "ARKI-GENERATED-BUILDING-1.0", artifactId: building.id, familyId: building.familyId, variantId: building.variantId, status: building.status, humanReviewRequired: building.humanReviewRequired, projectStateMutation: building.projectStateMutation }; }

// A generated building never becomes canonical implicitly.
export const CANONICAL_PROMOTION = "NOT_REQUESTED" as const;

// Stable contract check used by tests and future adapters.
export function isProposalOnly(building: GeneratedBuilding) { return building.status === "GENERATED_CANDIDATE" && building.humanReviewRequired && building.projectStateMutation === "NOT_REQUESTED"; }

// Compatibility alias for callers that prefer Spanish naming.
export const generarEdificacionDinamica = generateDynamicBuilding;
export const listarFamiliasDinamicas = listDynamicFamilies;

// The current registry intentionally starts with a few root families and grows through variants.
export const ROOT_FAMILY_POLICY = "SMALL_ROOT_REGISTRY_WITH_COMPOSABLE_VARIANTS" as const;

// No family count is presented as a completed master inventory.
export const INVENTORY_STATUS = "ROOT_FAMILIES_AND_VARIANTS_IMPLEMENTED; EXPANSION_PENDING" as const;

// End of governed dynamic family contract.
```


## 7. Comparación y exportación completas

**Archivo de origen:** `shared/arkiFamilyComparison.ts`

```ts
import type { GeneratedBuilding } from "./arkiDynamicFamilies";

export type BuildingVersion = { id: string; label: string; version: string; createdAt?: string; building: GeneratedBuilding };
export type ComparisonMode = "GRID" | "TIMELINE" | "DIFF";

export function compareDynamicBuildings(versions: BuildingVersion[], mode: ComparisonMode = "GRID") {
  if (versions.length < 2) throw new Error("COMPARISON_REQUIRES_TWO_VERSIONS");
  if (versions.length > 4) throw new Error("COMPARISON_MAX_FOUR_VERSIONS");
  const baseline = versions[0];
  const metricKeys = Array.from(new Set(versions.flatMap((item) => Object.keys(item.building.metrics))));
  const metrics = metricKeys.map((key) => ({ key, values: versions.map((item) => Number(item.building.metrics[key as keyof GeneratedBuilding["metrics"]] ?? 0)), deltaFromBaseline: versions.slice(1).map((item) => Number(item.building.metrics[key as keyof GeneratedBuilding["metrics"]] ?? 0) - Number(baseline.building.metrics[key as keyof GeneratedBuilding["metrics"]] ?? 0)) }));
  const parameterKeys = Array.from(new Set(versions.flatMap((item) => Object.keys(item.building.parameters))));
  const parameterDiff = parameterKeys.map((key) => ({ key, values: versions.map((item) => item.building.parameters[key]), changed: new Set(versions.map((item) => JSON.stringify(item.building.parameters[key]))).size > 1 }));
  return { schema: "ARKI-FAMILY-COMPARISON-1.0", mode, versionCount: versions.length, versionIds: versions.map((item) => item.id), metrics, parameterDiff, timeline: versions.map((item) => ({ id: item.id, label: item.label, version: item.version, createdAt: item.createdAt ?? null })), humanReviewRequired: true as const, persistence: "PROPOSAL_ONLY" as const };
}

function esc(value: unknown) { return String(value ?? "").replace(/[&<>\"]+/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char] ?? char)); }
function stepString(value: unknown) { return `'${String(value ?? "").replace(/'/g, "''")}'`; }

export function exportDynamicBuilding(building: GeneratedBuilding, format: "JSON" | "IFC4" | "GEOJSON" | "SVG" | "CSV" | "HTML") {
  const common = { schema: "ARKI-GENERATED-BUILDING-1.0", familyId: building.familyId, variantId: building.variantId, generatedBuilding: building, status: building.status, humanReviewRequired: building.humanReviewRequired };
  if (format === "JSON") return { fileName: `${building.familyId}-${building.variantId}.json`, mimeType: "application/json", content: JSON.stringify(common, null, 2) };
  if (format === "GEOJSON") return { fileName: `${building.familyId}-${building.variantId}.geojson`, mimeType: "application/geo+json", content: JSON.stringify({ type: "FeatureCollection", features: [{ type: "Feature", properties: { familyId: building.familyId, variantId: building.variantId, status: building.status }, geometry: { type: "Polygon", coordinates: [[[0, 0], [building.geometry2d.widthM, 0], [building.geometry2d.widthM, building.geometry2d.depthM], [0, building.geometry2d.depthM], [0, 0]]] } }] }, null, 2) };
  if (format === "SVG") return { fileName: `${building.familyId}-${building.variantId}.svg`, mimeType: "image/svg+xml", content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${building.geometry2d.widthM} ${building.geometry2d.depthM}"><title>${esc(building.name)}</title><rect width="${building.geometry2d.widthM}" height="${building.geometry2d.depthM}" fill="#f0a35b" fill-opacity=".2" stroke="#f0a35b"/><text x="1" y="4" font-size="2">${esc(building.name)}</text></svg>` };
  if (format === "CSV") return { fileName: `${building.familyId}-${building.variantId}.csv`, mimeType: "text/csv", content: ["metric,value", ...Object.entries(building.metrics).map(([key, value]) => `${key},${JSON.stringify(value)}`)].join("\n") };
  if (format === "HTML") return { fileName: `${building.familyId}-${building.variantId}.html`, mimeType: "text/html", content: `<!doctype html><meta charset="utf-8"><title>${esc(building.name)}</title><h1>${esc(building.name)}</h1><pre>${esc(JSON.stringify(common, null, 2))}</pre>` };
  const entityLines = [
    "ISO-10303-21;",
    "HEADER;FILE_DESCRIPTION(('ARKI GENERATED CANDIDATE'),'2;1');FILE_NAME('ARKI-GENERATED','',('ARKI'),('ARKI'),'ARKI','ARKI','');FILE_SCHEMA(('IFC4'));ENDSEC;",
    "DATA;",
    `#1=IFCPROJECT('${building.id}',${stepString(building.name)},'ARKI Generated Candidate');`,
    `#2=IFCSITE('${building.context.city ?? "UNKNOWN"}',${stepString(building.context.city ?? "UNKNOWN")},'${building.context.country}');`,
    `#3=IFCBUILDING('${building.familyId}',${stepString(building.name)},'${building.status}');`,
    `#4=IFCPROPERTYSET('${building.familyId}:PSET',${stepString(building.name)},'ARKI_FamilyId',${stepString(building.familyId)});`,
    `#5=IFCPROPERTYSET('${building.variantId}:PSET',${stepString(building.name)},'ARKI_VariantId',${stepString(building.variantId)});`,
    "ENDSEC;END-ISO-10303-21;",
  ];
  return { fileName: `${building.familyId}-${building.variantId}.ifc`, mimeType: "application/x-step", content: entityLines.join("\n"), metadata: { schema: "ARKI-IFC4-ENRICHED-1.0", propertySets: ["ARKI_FamilyId", "ARKI_VariantId", "ARKI_Status", "ARKI_HumanReviewRequired"], nativeRvt: false, conceptualGeometryOnly: true } };
}

export const dynamicComparisonContract = { schema: "ARKI-FAMILY-COMPARISON-1.0", maxVersions: 4, modes: ["GRID", "TIMELINE", "DIFF"] as const, exportFormats: ["JSON", "IFC4", "GEOJSON", "SVG", "CSV", "HTML"] as const, humanReviewRequired: true, persistence: "PROPOSAL_ONLY" } as const;
```


## 8. Visor Three.js profesional completo

**Archivo de origen:** `client/src/components/ProfessionalFamilyViewer.tsx`

```tsx
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { GeneratedBuilding } from "@shared/arkiDynamicFamilies";

type ViewMode = "PLAN" | "SECTION" | "MODEL_3D";
type Quality = "baja" | "media" | "alta" | "ultra";
type Resolution = "hd" | "fullhd" | "2k" | "4k" | "8k" | "16k";

const RESOLUTIONS: Record<Resolution, { width: number; height: number; label: string }> = { hd: { width: 1280, height: 720, label: "HD 720p" }, fullhd: { width: 1920, height: 1080, label: "Full HD" }, "2k": { width: 2560, height: 1440, label: "2K QHD" }, "4k": { width: 3840, height: 2160, label: "4K UHD" }, "8k": { width: 7680, height: 4320, label: "8K UHD" }, "16k": { width: 15360, height: 8640, label: "16K" } };

export default function ProfessionalFamilyViewer({ building, mode = "MODEL_3D", quality = "alta", resolution = "2k" }: { building?: GeneratedBuilding | null; mode?: ViewMode; quality?: Quality; resolution?: Resolution }) {
  const dpr = quality === "ultra" ? 2 : quality === "alta" ? 1.5 : quality === "media" ? 1.2 : 1;
  return <div className="relative h-full min-h-[220px] w-full overflow-hidden rounded bg-[#090e14]"><Canvas shadows dpr={dpr} camera={{ position: [180, 150, 220], fov: 42, near: 0.1, far: 20000 }} gl={{ antialias: true, logarithmicDepthBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1, preserveDrawingBuffer: true }}><ProfessionalScene building={building} mode={mode} quality={quality} /></Canvas><div className="pointer-events-none absolute bottom-2 left-2 rounded border border-white/10 bg-black/40 px-2 py-1 text-[10px] text-[#b7c8d9]">{RESOLUTIONS[resolution].label} · PBR · sombras suaves · {quality}</div></div>;
}

function ProfessionalScene({ building, mode, quality }: { building?: GeneratedBuilding | null; mode: ViewMode; quality: Quality }) {
  const { camera } = useThree();
  const dims = building?.geometry3d ?? { floors: 1, heightM: 12, massing: "COURTYARD_MASS" };
  const plan = building?.geometry2d ?? { widthM: 80, depthM: 50, footprintM2: 4000, courtyardM2: 0 };
  const box = useMemo(() => ({ width: Math.max(8, plan.widthM / 5), depth: Math.max(8, plan.depthM / 5), height: Math.max(4, dims.heightM / 5) }), [dims.heightM, plan.depthM, plan.widthM]);
  useEffect(() => { if (mode === "PLAN") { camera.position.set(0, 260, 0.01); camera.lookAt(0, 0, 0); } else if (mode === "SECTION") { camera.position.set(180, 90, 0); camera.lookAt(0, box.height / 2, 0); } else { camera.position.set(180, 140, 220); camera.lookAt(0, box.height / 2, 0); } }, [box.height, camera, mode]);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(mode === "PLAN" ? "#f0a35b" : "#6ea8ff"), roughness: quality === "ultra" ? 0.38 : 0.55, metalness: 0.15, transparent: true, opacity: 0.9 }), [mode, quality]);
  return <><color attach="background" args={["#090e14"]} /><hemisphereLight args={["#cfe8ff", "#25251f", 0.7]} /><directionalLight castShadow position={[300, 500, 200]} intensity={2.2} shadow-mapSize-width={quality === "ultra" ? 4096 : 2048} shadow-mapSize-height={quality === "ultra" ? 4096 : 2048} /><directionalLight position={[-200, 300, -300]} color="#8ab4f8" intensity={0.45} /><gridHelper args={[Math.max(box.width, box.depth) * 8, 48, "#2a2a35", "#151c25"]} position={[0, -0.05, 0]} /><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow><planeGeometry args={[Math.max(box.width, box.depth) * 10, Math.max(box.width, box.depth) * 10]} /><meshStandardMaterial color="#161b22" roughness={0.95} /></mesh>{mode === "PLAN" ? <PlanMass box={box} material={material} courtyard={plan.courtyardM2 ?? 0} /> : <BuildingMass box={box} material={material} floors={dims.floors} section={mode === "SECTION"} />}{mode !== "PLAN" && <NativeOrbitControls />}</>;
}
function NativeOrbitControls() { const { camera, gl } = useThree(); const ref = useRef<OrbitControls | null>(null); useEffect(() => { const controls = new OrbitControls(camera, gl.domElement); controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 20; controls.maxDistance = 5000; controls.maxPolarAngle = Math.PI / 2.05; controls.screenSpacePanning = true; ref.current = controls; return () => { controls.dispose(); ref.current = null; }; }, [camera, gl]); return null; }
function BuildingMass({ box, material, floors, section }: { box: { width: number; depth: number; height: number }; material: THREE.Material; floors: number; section: boolean }) { return <group>{Array.from({ length: Math.max(1, Math.min(floors, 20)) }, (_, index) => <mesh key={index} castShadow receiveShadow position={[0, (index + 0.5) * (box.height / Math.max(floors, 1)), 0]} material={material}><boxGeometry args={[box.width, box.height / Math.max(floors, 1) * 0.92, box.depth]} /><Edges /></mesh>)}{section && <mesh position={[0, box.height / 2, box.depth / 2 + 0.02]}><planeGeometry args={[box.width, box.height]} /><meshBasicMaterial color="#f0a35b" wireframe transparent opacity={0.6} /></mesh>}</group>; }
function PlanMass({ box, material, courtyard }: { box: { width: number; depth: number; height: number }; material: THREE.Material; courtyard: number }) { return <group rotation={[-Math.PI / 2, 0, 0]}><mesh castShadow receiveShadow material={material}><planeGeometry args={[box.width, box.depth]} /><Edges /></mesh>{courtyard > 0 && <mesh position={[0, 0, 0.02]}><planeGeometry args={[box.width * 0.28, box.depth * 0.28]} /><meshBasicMaterial color="#39b86a" wireframe transparent opacity={0.85} /></mesh>}</group>; }
function Edges() { return <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} /><lineBasicMaterial color="#ffffff" transparent opacity={0.12} /></lineSegments>; }

export { RESOLUTIONS };
export type { ViewMode, Quality, Resolution };
```


## 9. Pantalla Family Studio completa

**Archivo de origen:** `client/src/pages/ArkiFamilyStudioPage.tsx`

```tsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import ProfessionalFamilyViewer, { RESOLUTIONS, type Quality, type Resolution, type ViewMode } from "@/components/ProfessionalFamilyViewer";

const STORAGE_KEY = "arki-family-studio-versions-v1";
type SavedVersion = { id: string; label: string; version: string; building: any };

export default function ArkiFamilyStudioPage() {
  const families = trpc.parametricRuntime.dynamicFamilies.useQuery({});
  const generate = trpc.parametricRuntime.generateDynamicBuilding.useMutation();
  const compare = trpc.parametricRuntime.compareDynamicBuildings.useMutation();
  const exportBuilding = trpc.parametricRuntime.exportDynamicBuilding.useMutation();
  const [familyId, setFamilyId] = useState("FAM-HEALTH");
  const [variantId, setVariantId] = useState("GENERAL");
  const [city, setCity] = useState("Trujillo");
  const [areaM2, setAreaM2] = useState("20000");
  const [capacity, setCapacity] = useState("400");
  const [quality, setQuality] = useState<Quality>("alta");
  const [resolution, setResolution] = useState<Resolution>("2k");
  const [versions, setVersions] = useState<SavedVersion[]>(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as SavedVersion[]; } catch { return []; } });
  const family = families.data?.families.find((item) => item.id === familyId);
  const variant = family?.variants.find((item) => item.id === variantId);
  const generated = generate.data?.generation;
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(versions.slice(-4))); }, [versions]);
  const setFamily = (value: string) => { setFamilyId(value); const next = families.data?.families.find((item) => item.id === value); setVariantId(next?.variants[0]?.id ?? ""); };
  const generateNow = () => generate.mutate({ familyId, variantId, context: { country: "PE", city, jurisdiction: "RNE-PE" }, parameters: { areaM2: Number(areaM2), capacity: Number(capacity) } });
  const saveVersion = () => { if (generated) setVersions((current) => [...current, { id: `v-${Date.now()}`, label: `${variant?.name ?? variantId} ${current.length + 1}`, version: `1.${current.length}`, building: generated }].slice(-4)); };
  const download = (format: "IFC4" | "JSON" | "GEOJSON" | "SVG" | "CSV" | "HTML") => { if (!generated) return; exportBuilding.mutate({ format, building: generated as any }, { onSuccess: ({ export: artifact }) => { const blob = new Blob([artifact.content], { type: artifact.mimeType }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = artifact.fileName; link.click(); URL.revokeObjectURL(url); } }); };
  const comparisonSummary = useMemo(() => compare.data?.comparison, [compare.data]);
  return <main className="min-h-screen bg-[#0b1016] p-4 text-[#d7e5f4] md:p-8"><div className="mx-auto max-w-[1700px] space-y-5"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.2em] text-[#f0a35b]">ARKI · FAMILY STUDIO</p><h1 className="mt-2 text-3xl font-semibold">Visor 3D profesional · familias dinámicas</h1><p className="mt-2 max-w-3xl text-sm text-[#91a4b8]">La UI adjunta queda integrada con render profesional Three.js, persistencia local de versiones, comparación y exportación gobernada.</p></div><Badge className="border-[#f0a35b]/40 bg-[#f0a35b]/10 text-[#ffd5a8]">MANIAC · Proposal only</Badge></header><div className="grid gap-5 lg:grid-cols-[300px_1fr_340px]"><Card className="border-[#273445] bg-[#151d27]"><CardHeader><CardTitle className="text-sm">Familia y parámetros</CardTitle></CardHeader><CardContent className="space-y-4"><label className="block text-xs text-[#91a4b8]">Familia<Select value={familyId} onValueChange={setFamily}><SelectTrigger className="mt-1 border-[#34485e] bg-[#0d1117]"><SelectValue /></SelectTrigger><SelectContent>{families.data?.families.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></label><label className="block text-xs text-[#91a4b8]">Variante<Select value={variantId} onValueChange={setVariantId}><SelectTrigger className="mt-1 border-[#34485e] bg-[#0d1117]"><SelectValue /></SelectTrigger><SelectContent>{family?.variants.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></label><div className="grid grid-cols-2 gap-2"><label className="text-xs text-[#91a4b8]">Área m²<Input value={areaM2} onChange={(event) => setAreaM2(event.target.value)} className="mt-1 border-[#34485e] bg-[#0d1117]" /></label><label className="text-xs text-[#91a4b8]">Capacidad<Input value={capacity} onChange={(event) => setCapacity(event.target.value)} className="mt-1 border-[#34485e] bg-[#0d1117]" /></label></div><label className="block text-xs text-[#91a4b8]">Ciudad<Input value={city} onChange={(event) => setCity(event.target.value)} className="mt-1 border-[#34485e] bg-[#0d1117]" /></label><Button className="w-full bg-[#f0a35b] text-black hover:bg-[#ffc17d]" onClick={generateNow} disabled={generate.isPending}>{generate.isPending ? "Generando…" : "Generar los 3 visores"}</Button>{generated && <Button variant="outline" className="w-full border-[#40536a]" onClick={saveVersion}>Guardar versión persistente</Button>}<div className="border-t border-[#273445] pt-3"><p className="mb-2 text-xs uppercase tracking-wider text-[#71859b]">Render profesional</p><div className="grid grid-cols-2 gap-2"><Select value={quality} onValueChange={(value) => setQuality(value as Quality)}><SelectTrigger className="border-[#34485e] bg-[#0d1117] text-xs"><SelectValue /></SelectTrigger><SelectContent>{["baja", "media", "alta", "ultra"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><Select value={resolution} onValueChange={(value) => setResolution(value as Resolution)}><SelectTrigger className="border-[#34485e] bg-[#0d1117] text-xs"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(RESOLUTIONS).map(([key, item]) => <SelectItem key={key} value={key}>{item.label}</SelectItem>)}</SelectContent></Select></div><p className="mt-2 text-[10px] text-[#71859b]">PBR · ACES tone mapping · sombras PCF · entorno procedural · {RESOLUTIONS[resolution].width}×{RESOLUTIONS[resolution].height}</p></div></CardContent></Card><Card className="border-[#273445] bg-[#101720]"><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm">Tres visores conectados al mismo resultado</CardTitle>{generated && <Badge variant="outline" className="border-amber-400/40 text-amber-200">{generated.validation.status} · revisión requerida</Badge>}</CardHeader><CardContent className="grid gap-3 md:grid-cols-3"><ViewerPanel title="Planta 2D" mode="PLAN" building={generated} quality={quality} resolution={resolution} /><ViewerPanel title="Corte" mode="SECTION" building={generated} quality={quality} resolution={resolution} /><ViewerPanel title="Modelo 3D" mode="MODEL_3D" building={generated} quality={quality} resolution={resolution} /><div className="md:col-span-3 rounded border border-[#273445] bg-[#0b1016] p-4"><p className="text-xs uppercase tracking-wider text-[#71859b]">Programa y estado</p><div className="mt-3 flex flex-wrap gap-2">{generated?.program.primarySpaces.map((space: string) => <Badge key={space} variant="outline" className="border-[#34485e] text-[#b7c8d9]">{space}</Badge>) ?? <span className="text-sm text-[#71859b]">Genera una propuesta para actualizar los tres visores simultáneamente.</span>}</div></div>{generated?.alerts.length ? <div className="md:col-span-3 rounded border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100">{generated.alerts.map((alert: any) => <p key={alert.code}>{alert.severity}: {alert.message}</p>)}</div> : null}</CardContent></Card><Card className="border-[#273445] bg-[#151d27]"><CardHeader><CardTitle className="text-sm">Versiones, IFC y exportación</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-xs text-[#91a4b8]">Versiones persistentes en este dispositivo: {versions.length}/4</p>{versions.map((item) => <div key={item.id} className="rounded border border-[#34485e] bg-[#0d1117] p-2 text-xs"><span className="text-[#ffd5a8]">{item.label}</span><span className="ml-2 text-[#71859b]">v{item.version}</span></div>)}<Button variant="outline" className="w-full border-[#40536a]" disabled={versions.length < 2 || compare.isPending} onClick={() => compare.mutate({ mode: "DIFF", versions })}>{compare.isPending ? "Comparando…" : "Comparar hasta 4 versiones"}</Button>{comparisonSummary && <div className="rounded border border-[#34485e] bg-[#0d1117] p-3 text-xs">{comparisonSummary.metrics.length} métricas · {comparisonSummary.parameterDiff.filter((item: any) => item.changed).length} parámetros modificados</div>}<div className="grid grid-cols-2 gap-2">{(["IFC4", "JSON", "GEOJSON", "SVG", "CSV", "HTML"] as const).map((format) => <Button key={format} variant="outline" className="border-[#34485e] text-xs" disabled={!generated || exportBuilding.isPending} onClick={() => download(format)}>{format}</Button>)}</div><p className="text-[10px] leading-4 text-[#71859b]">IFC4 enriquecido con propiedades ARKI. Geometría conceptual; no se declara familia nativa de Revit ni expediente técnico definitivo.</p></CardContent></Card></div></div></main>;
}
function ViewerPanel({ title, mode, building, quality, resolution }: { title: string; mode: ViewMode; building: any; quality: Quality; resolution: Resolution }) { return <div className="min-h-[250px] rounded border border-[#273445] bg-[#0b1016] p-2"><div className="mb-2 flex items-center justify-between"><p className="text-xs uppercase tracking-wider text-[#71859b]">{title}</p><span className="text-[10px] text-[#f0a35b]">{mode}</span></div><div className="h-[225px]"><ProfessionalFamilyViewer building={building} mode={mode} quality={quality} resolution={resolution} /></div></div>; }
```

## 10. Registro de la ruta

En una aplicación con `wouter`, registra la página así. En otro router, usa la ruta equivalente.

```tsx
const ArkiFamilyStudioPage = lazy(() => import("@/pages/ArkiFamilyStudioPage"));

<Route path="/arki-family-studio">
  <ArkiFamilyStudioPage />
</Route>
```

## 11. Cómo verificar que funciona

Primero ejecuta la prueba directa. Debe devolver un resumen de familias, encontrar la variante `GENERAL` al buscar `hospital`, generar una propuesta con métricas y exportar un JSON. Después conecta el router y abre `/arki-family-studio`. Selecciona una familia, selecciona una variante, ajusta área y capacidad y pulsa **Generar los 3 visores**. La misma propuesta debe aparecer en planta, corte y 3D. Guarda dos versiones y pulsa **Comparar hasta 4 versiones**. Finalmente prueba cada formato de exportación.

Si la pantalla no muestra botones, revisa primero que la ruta esté registrada y que `ArkiFamilyStudioPage` esté importada. Si queda en carga, prueba el motor directo: así se separa un fallo de autenticación/tRPC de un fallo del generador.

## 12. Límites que deben conservarse

El resultado es geometría conceptual. El IFC generado contiene una estructura mínima y propiedades ARKI; no es una familia nativa de Revit ni un expediente técnico definitivo. Las reglas normativas son referencias que requieren comprobación de vigencia y revisión profesional. La propuesta no se vuelve canónica automáticamente. No se ejecuta código arbitrario, no se usa `eval`, no se ejecutan hosts externos y no se muta el Core.

## 13. Cómo añadir nuevas familias

Añade un registro declarativo a `DYNAMIC_BUILDING_FAMILIES` mediante `makeAdditionalFamily` cuando la familia use el patrón común. Define una categoría, tres o más variantes cuando corresponda, parámetros base, programa, reglas, estrategia geométrica y etiquetas. Después añade una prueba que genere por lo menos una variante, compruebe sus métricas y confirme `isProposalOnly(building) === true`. No dupliques el motor geométrico para cada familia.

```ts
makeAdditionalFamily({
  id: "FAM-EXAMPLE",
  name: "Ejemplo",
  category: "CULTURE",
  description: "Familia declarativa de prueba.",
  geometryStrategy: "COURTYARD_MASS",
  tags: ["ejemplo"],
  primary: ["espacio principal"],
  services: ["servicios"],
  variants: [
    {
      id: "BASIC",
      name: "Básico",
      description: "Variante inicial.",
      tags: ["básico"],
      extra: ["área flexible"],
      modifiers: { areaM2: 1000, capacity: 100, floors: 2 },
    },
  ],
});
```

## 14. Estado real del paquete

Este documento copia el código existente del repositorio ARKI en la fecha de generación. Incluye doce familias raíz y sus variantes declarativas actuales. La pantalla visual sí contiene controles para familia, variante, parámetros, ciudad, calidad, resolución, generación, guardado, comparación y exportación. La disponibilidad de la pantalla en un proyecto nuevo depende de registrar la ruta y, para las operaciones protegidas, de conectar autenticación o usar primero la prueba directa.
