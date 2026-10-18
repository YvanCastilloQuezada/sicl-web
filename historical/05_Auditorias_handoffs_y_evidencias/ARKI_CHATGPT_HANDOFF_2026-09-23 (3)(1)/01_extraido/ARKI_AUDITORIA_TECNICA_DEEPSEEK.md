# ARKI — Auditoría técnica verificable para DeepSeek

**Fecha de verificación:** 22 de septiembre de 2026  
**Estado canónico:** checkpoint WebDev `6e4624b6`  
**Nombre canónico:** ARKI / Generador de Familias  
**Repositorio de trabajo:** `YvanCastilloQuezada/milukita`  
**Proyecto WebDev:** `generador-familias`  
**Clasificación:** prototipo funcional local / demostrador técnico; no MVP productivo ni sistema BIM de producción.

## Resumen ejecutivo

La evidencia actual muestra un frontend React funcional, un motor TypeScript local y tres pruebas ejecutables que pasan. El motor genera familias de edificios, un modelo constructivo conceptual, elementos BIM, metrados, presupuesto referencial, cronograma conceptual, IFC semántico, módulos locales de coordinación y un dossier técnico editable.

No existe todavía una plataforma persistente multiusuario. No existe un importador real de RFA, RVT, IFC, DWG, DXF, OBJ, STEP, GLB, BCF o COBie. No existe una cadena automática de propagación desde una edición del expediente hasta metrado, APU, presupuesto, 4D, IFC y Markdown. No existe PDF técnico definitivo, firma legal, cálculo estructural completo, redes MEP completas, validación normativa exhaustiva ni mantenimiento operativo.

## 1. Estado canónico

### 1.1 Respuestas directas

| Pregunta | Respuesta verificable |
|---|---|
| Checkpoint actual | `6e4624b6` |
| Fecha del estado | 22 de septiembre de 2026 |
| Estado declarado | Prototipo funcional local / demostrador técnico |
| Fuente de verdad | Código TypeScript en `shared/` y pruebas en `scripts/`; UI en `client/src/` consume el motor |
| Backend | No hay backend de negocio persistente implementado |
| Base de datos | No implementada |
| Persistencia actual | Estado local del navegador y exportaciones descargables |
| Nombre canónico | ARKI |
| SICL / SiMS-DeI | No forman parte de este proyecto ni deben mezclarse con ARKI |

### 1.2 Qué línea manda

La fuente de verdad actual es el motor de dominio en `shared/`. La UI no debe inventar entidades independientes. `Home.tsx` consume `GeneratedBuilding`, `ConstructionModel`, `TechnicalDossier` y los módulos profesionales. Las visualizaciones SVG son presentaciones derivadas del modelo y no sustituyen al modelo central.

### 1.3 Registro de decisiones aprobadas

| Fecha | Aprobación | Decisión | Respaldo |
|---|---|---|---|
| 22-09-2026 | Usuario | ARKI debe evolucionar de generador de sólidos a generador BIM semántico | Conversación del proyecto y documentos adjuntos |
| 22-09-2026 | Usuario | La UI debe ser minimalista y funcional | Confirmación explícita del rediseño |
| 22-09-2026 | Usuario | Deben incorporarse espacios, muros, materiales, costos, tiempo, 4D, 5D, expediente y encofrados | Documentos técnicos recibidos |
| 22-09-2026 | Usuario | Deben cubrirse vidrios, mamparas, estructuras metálicas, mobiliario, equipamiento, computadoras, televisores y activos según tipología | Conversación del proyecto |
| 22-09-2026 | Usuario | Se deben importar y reutilizar familias y sólidos existentes | Conversación del proyecto |
| 22-09-2026 | Usuario | Roles: DeepSeek escribe código; Manus integra, compila y verifica; usuario asesora | Documento de transferencia anterior |
| 22-09-2026 | Usuario | ARKI es el nombre canónico | Conversación del proyecto |

No existe todavía un registro formal persistente de decisiones dentro de la aplicación. La tabla anterior es el registro documental de esta transferencia.

## 2. Estados de módulos

Se usa la taxonomía solicitada por DeepSeek.

| Módulo | Estado | Evidencia | Falta |
|---|---|---|---|
| Familias de edificios | IMPLEMENTED / EXPOSED | `arkiDynamicFamilies.ts`; UI de familias y variantes | Catálogo persistente y familias de componentes |
| Generación paramétrica | IMPLEMENTED / VERIFIED | `generateDynamicBuilding`; test constructivo | Más reglas, geometría editable y validación de dominio |
| Planta, corte y masa 3D | IMPLEMENTED / EXPOSED | `ProfessionalFamilyViewer.tsx`; preview | Planos técnicos, cotas, ejes, escalas y edición gráfica |
| Modelo constructivo | IMPLEMENTED / VERIFIED | `generateConstructionModel`; test constructivo | Modelo completo por disciplinas y persistencia |
| Muros, capas y aberturas | IMPLEMENTED / VERIFIED | `Muro`, capas, puertas y ventanas | Encuentros, tolerancias, familias anidadas y reglas completas |
| Elementos estructurales | IMPLEMENTED / VERIFIED | `arkiConstructionElements.ts`; test constructivo | Cálculo estructural y detallado de ingeniería |
| Materiales | IMPLEMENTED | Capas y materiales tipados | Catálogo central, propiedades físicas, proveedores y versiones |
| Metrados | IMPLEMENTED / VERIFIED | `summary`, cantidades y test constructivo | Validación contractual, fórmulas por familia y recálculo por edición |
| APU | IMPLEMENTED / VERIFIED | `APU_DATABASE`; test constructivo | Base completa, rendimientos, desperdicio, impuestos y auditoría |
| Presupuesto 5D | IMPLEMENTED / VERIFIED | `buildFinancial5D`; test profesional | Presupuesto contractual y enlace editable elemento-partida |
| Cronograma 4D | IMPLEMENTED / VERIFIED | `simulateConstruction`; test profesional | Cronograma editable, avance real y control de cambios |
| Clashes | IMPLEMENTED / VERIFIED | `detectModelClashes`; test profesional | Motor geométrico y BCF |
| Aprobaciones | IMPLEMENTED / VERIFIED | `createApprovalWorkflow`; test profesional | Usuarios, roles, firmas y auditoría |
| CDE | IMPLEMENTED / VERIFIED local | `createCdeManifest`; test profesional | Almacenamiento, permisos, revisiones y transmittals |
| S10 | IMPLEMENTED / VERIFIED local | `importS10Csv`; test profesional | Integración robusta y catálogo versionado |
| IFC export | IMPLEMENTED / VERIFIED local | `exportConstructionIfc`; test constructivo | Validación externa y cobertura completa de propiedades |
| Expediente | IMPLEMENTED / EXPOSED | `TechnicalDossier`, tabs de UI | PDF real, láminas, memorias, anexos y emisión |
| Especificaciones | IMPLEMENTED / EXPOSED | 7 registros y editor local | CRUD completo, versionado, campos de aceptación y normas |
| Encofrados | IMPLEMENTED / EXPOSED | 164 requerimientos; editor parcial | Editar todo, recalcular cadena y hoja profesional |
| RNE | IMPLEMENTED / READ-ONLY | 4 heurísticas en `reviewNormativeReadiness` | Motor normativo completo y fuentes versionadas |
| Importación IFC/RFA/RVT/CAD | FUTURE / BLOCKED BY INFRASTRUCTURE | No hay parser ni endpoint | Importadores y librerías/conectores |
| Familias paramétricas de componentes | FUTURE / BLOCKED BY CONTRACT | No existe entidad persistente `ArkiParametricFamily` | Contrato canónico, catálogo y reglas |
| Backend | FUTURE / BLOCKED BY INFRASTRUCTURE | `server/` solo sirve estáticos | API, DB, archivos, usuarios y jobs |
| Mantenimiento | FUTURE | No existe módulo ejecutable | Activos, órdenes de trabajo, garantías y O&M |

## 3. Contratos TypeScript reales

### 3.1 Familia de edificio

Archivo: `shared/arkiDynamicFamilies.ts`.

```ts
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
  modifiers: Record<string, string | number | boolean>;
  programExtra: string[];
  ruleIds: string[];
  tags: string[];
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
```

No existe todavía `FamilyInstance` persistente. La familia actual es una definición declarativa de edificio. Las variantes son datos dentro de `DynamicBuildingFamily`, no familias cargables de Revit.

### 3.2 Propuesta generada

Archivo: `shared/arkiDynamicFamilies.ts`.

```ts
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
  constructionModel?: ConstructionModel;
  validation: { status: "PASS" | "UNKNOWN" | "BLOCKED"; checked: string[]; unknowns: string[] };
  alerts: Array<{ code: string; message: string; severity: "INFO" | "WARNING" | "BLOCKER" }>;
  status: "GENERATED_CANDIDATE";
  humanReviewRequired: true;
  projectStateMutation: "NOT_REQUESTED";
};
```

### 3.3 Muro, capa, abertura y partida

Archivo: `shared/arkiConstructionOntology.ts`.

```ts
export type CapaMuro = {
  id: string;
  nombre: string;
  material: MaterialCapa;
  espesor_m: number;
  funcion: "estructural" | "aislamiento" | "acabado";
  densidad_kg_m3?: number;
  conductividad_w_mk?: number;
  resistencia_fuego_min?: number;
  orden?: number;
};

export type Abertura = {
  id: string;
  tipo: "puerta" | "ventana" | "pasadizo" | "ducto";
  ancho_m: number;
  alto_m: number;
  posicion_m: number;
  altura_antepecho_m?: number;
  tipo_marco?: string;
  tipo_vidrio?: string;
  permite_fuego?: boolean;
};

export type PartidaPresupuestal = {
  id: string;
  codigo: string;
  descripcion: string;
  unidad: "m2" | "m3" | "kg" | "und";
  metrado: number;
  precio_unitario: number;
  parcial: number;
  especialidad: Especialidad;
  fase: "estructuras" | "arquitectura" | "acabados";
};
```

La clase `Muro` ya tiene geometría, capas, acabados, aberturas, metrados, partidas, interferencias, estado, versión, autor y metadata.

### 3.4 Modelo constructivo

Archivo: `shared/arkiConstructionOntology.ts`.

```ts
export type ConstructionSpace = {
  id: string;
  nombre: string;
  funcion: string;
  nivel_piso: number;
  area_m2: number;
  altura_libre_m: number;
  wallIds: string[];
  requisitos: string[];
  estado: "conceptual" | "coordinado" | "validado";
};

export type ScheduleTask = {
  id: string;
  codigo: string;
  nombre: string;
  fase: "diseño" | "estructura" | "arquitectura" | "instalaciones" | "acabados" | "puesta_en_marcha";
  duracion_dias: number;
  inicio_dia: number;
  fin_dia: number;
  predecessors: string[];
  elementIds: string[];
  costo_pen: number;
};

export type ConstructionModel = {
  schema: "ARKI-CONSTRUCTION-MODEL-1.0";
  projectId: string;
  generatedAt: string;
  ontologyLevel: "CONSTRUCTIVE_ELEMENTS";
  spaces: ConstructionSpace[];
  walls: Muro[];
  foundations: StructuralElement[];
  columns: StructuralElement[];
  beams: StructuralElement[];
  slabs: StructuralElement[];
  doors: StructuralElement[];
  windows: StructuralElement[];
  stairs: StructuralElement[];
  floors: StructuralElement[];
  roofs: StructuralElement[];
  partitions: StructuralElement[];
  relations: ElementRelation[];
  schedule: ScheduleTask[];
  apuDatabase: ApuPartida[];
  summary: ConstructionSummary;
  gates: ConstructionGates;
};
```

### 3.5 Estructura, APU, precio e importación S10

`StructuralElement`, `ElementRelation`, `ApuPartida` y sus cantidades viven en `shared/arkiConstructionElements.ts` y `shared/arkiConstructionOntology.ts`. La función `importS10Csv` vive en `shared/arkiProfessionalModules.ts` y solo interpreta CSV local. No existe todavía un tipo `Budget` persistente ni `BudgetItem` independiente; el presupuesto está distribuido en partidas, resúmenes y módulos financieros.

### 3.6 Dossier y encofrados

Archivo: `shared/arkiTechnicalDossier.ts`.

```ts
export type FormworkRequirement = {
  id: string;
  elementId: string;
  elementType: "column" | "beam" | "slab" | "foundation" | "wall";
  system: "metalica" | "madera" | "fenolica" | "aluminio";
  areaM2: number;
  volumeM3: number;
  reuseCycles: number;
  estimatedDays: number;
  releaseCondition: string;
  safetyNotes: string[];
  quantity: {
    sets: number;
    effectiveAreaM2: number;
    faceVolumeM3: number;
    props: number;
    propLengthM: number;
    nailsKg: number;
    wireKg: number;
    releaseAgentL: number;
  };
};

export type TechnicalDossier = {
  title: string;
  version: string;
  modelId: string;
  specifications: TechnicalSpecification[];
  formwork: FormworkRequirement[];
  regionalPrices: RegionalPrice[];
  normativeFindings: NormativeFinding[];
  sections: Array<{ order: number; title: string; status: "ready" | "review_required" | "pending"; outputs: string[] }>;
  readiness: { percentage: number; blockers: string[]; specialistReviewRequired: boolean };
};
```

### 3.7 Tipos que todavía no existen

No existen todavía como entidades canónicas independientes:

- `FamilyInstance` para una instancia de componente cargable.
- `ArkiParametricFamily` persistente.
- `FamilyType` y catálogo de tipos.
- `Constraint` y `ReferencePlane`.
- `Material` central persistente.
- `Budget`, `BudgetItem` y `UnitPrice` persistentes.
- `Schedule`, `Activity` y `Milestone` como aggregate persistente.
- `BCFIssue`.
- `Asset` y `MaintenanceTask`.
- `IFCImport`, `DWGImport`, `RFAImport` u otros tipos de importación.
- Usuario, organización, proyecto persistente, documento, revisión o firma.

## 4. Arquitectura de archivos existente

El árbol real no usa todavía las carpetas `core/`, `constructive/`, `budget/`, `schedule/`, `export/` y `ui/` propuestas por DeepSeek. La arquitectura real es más plana.

```text
/home/ubuntu/generador-familias/
├── client/
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── index.css
│       ├── main.tsx
│       ├── pages/Home.tsx
│       ├── components/ProfessionalFamilyViewer.tsx
│       ├── components/ui/*
│       ├── contexts/*
│       ├── hooks/*
│       └── lib/*
├── shared/
│   ├── arkiDynamicFamilies.ts
│   ├── arkiConstructionOntology.ts
│   ├── arkiConstructionElements.ts
│   ├── arkiFamilyComparison.ts
│   ├── arkiProfessionalModules.ts
│   ├── arkiTechnicalDossier.ts
│   └── const.ts
├── scripts/
│   ├── test-constructive.ts
│   ├── test-professional.ts
│   └── test-technical-dossier.ts
├── server/index.ts
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

### Fuente de verdad y derivados

| Archivo o capa | Tipo | Responsabilidad |
|---|---|---|
| `shared/*.ts` | Fuente de verdad de dominio | Contratos y generación local |
| `client/src/pages/Home.tsx` | Exposición UI | Consume el dominio y mantiene estados locales |
| `client/src/components/ProfessionalFamilyViewer.tsx` | Derivado visual | Render conceptual de datos generados |
| `scripts/test-*.ts` | Verificación | Ejecuta casos y aserciones de humo |
| `dist/` | Derivado | Build de producción; no editar a mano |
| `localStorage` | Persistencia temporal | Versiones y borradores en navegador |
| `server/index.ts` | Servidor estático | Sirve archivos, no contiene dominio ni API |

No existe `README.md` de proyecto en el árbol actual. No hay archivos marcados formalmente como `legacy`; sí existe deuda de organización porque el dominio está en módulos planos y algunos nombres son genéricos.

## 5. Estado de pruebas

Los tres scripts actuales pasan al momento de esta auditoría.

| Test | Resultado | Qué verifica | Limitación |
|---|---|---|---|
| `scripts/test-constructive.ts` | PASA | Generación de elementos, cantidades, presupuesto, duración y tokens IFC | Happy path; no prueba edición, errores ni apertura externa del IFC |
| `scripts/test-professional.ts` | PASA | 5D, simulación, clashes, aprobación, CDE e importación CSV S10 | Verifica existencia de resultados, no su exactitud profesional |
| `scripts/test-technical-dossier.ts` | PASA | Especificaciones, encofrados, precios, hallazgos normativos y Markdown | No prueba el editor UI, PDF, persistencia ni recalculado enlazado |

Resultados observados:

```text
constructive: walls=16, spaces=16, columns=72, beams=16,
slabs=4, foundations=72, stairs=4, floors=4, roofs=1,
partitions=4, doors=16, windows=320, relations=464,
netWallM2=8028.6, budgetPen=4672910, durationDays=93

professional: periods=3, financialTotal=1759040.94,
conflicts=0, clashes=480, approvalStatus=pending,
cdeDocuments=2, s10Imported=2

technical: readiness=50, specifications=7, formwork=164,
prices=7, findings=4, sections=6
```

No existen pruebas unitarias aisladas, pruebas de integración del editor, pruebas de importación de formatos BIM, pruebas de regresión visual, pruebas de accesibilidad, pruebas de seguridad, pruebas de rendimiento ni pruebas con modelos externos.

## 6. Familia actual frente al catálogo deseado

| Bloque deseado | Ya existe | Brecha |
|---|---|---|
| Identidad | `id`, nombre, categoría, versión, tags | Fabricante, modelo, proveedor, clasificación y estado persistentes |
| Geometría | `geometry2d`, `section`, `geometry3d`, dimensiones de muros/elementos | Parámetros geométricos, restricciones, planos de referencia y tipos |
| Materiales | Capas de muro y algunos materiales | Catálogo central, acabados, propiedades físicas, texturas y proveedores |
| Metrados | Métodos de muro y cantidades de elementos | Reglas genéricas por familia y recálculo tras edición |
| Costos | APU y precios referenciales | Presupuesto persistente, base contractual, rendimientos, impuestos y auditoría |
| 4D | Tareas generadas y simulación | Actividades editables, calendarios, avance y línea base |
| Operación | No hay entidad Asset | Garantías, manuales, vida útil, mantenimiento y órdenes de trabajo |
| Importación | CSV S10 | RFA, RVT, IFC, CAD, sólidos, BCF, COBie y catálogos |
| Familias anidadas | No hay contrato persistente | Composición de perfiles, vidrios, herrajes, muebles y equipos |
| Tipos de familia | Variantes de edificio | Tipos cargables y parámetros compartidos |

La familia actual representa principalmente **familias de edificio**. El catálogo deseado incluye familias de componentes paramétricos: vidrios, mamparas, puertas, ventanas, perfiles metálicos, muebles, computadoras, televisores, equipos médicos, maquinaria y activos.

## 7. Importaciones y exportaciones: estado real

| Formato | Implementado | Estado real | Prioridad |
|---|---|---|---|
| CSV S10 | Sí | Parser local simple con 4 columnas | Media: robustecer validación |
| CSV metrados | Parcial | No hay contrato dedicado | Alta |
| JSON propio | Sí | Exportación/lectura local de propuestas | Media: versionar schema |
| IFC | Solo exportación | Generador semántico conceptual; no importador | Alta |
| DWG | No | Sin librería ni parser | Media |
| DXF | No | Sin parser | Media |
| RFA | No | Requiere conector Revit/API | Alta, fuera del navegador puro |
| RVT | No | Requiere Revit/API o servicio especializado | Alta, fuera del navegador puro |
| OBJ | No | Sin importador | Media |
| STEP/SAT | No | Sin parser | Media |
| GLB/glTF | No | Sin importador | Media |
| BCF | No | Clashes no se exportan como BCF | Alta |
| COBie | No | Sin contrato de activos | Media |
| Markdown | Sí | Generación local del dossier | Baja: completar contenido |
| PDF | No | No existe generador PDF real | Alta |
| SVG | Sí | Vistas conceptuales y descarga | Media: planos técnicos |
| HTML | Sí | Exportación de propuesta | Baja |

No se debe confundir la mención de un formato en la visión del producto con una integración implementada.

## 8. Propagación de cambios

### 8.1 Estado actual

La cadena esperada es:

```text
edición → metrado → APU → presupuesto → 4D → IFC → Markdown
```

Hoy la cadena no está implementada como una transacción o pipeline automático.

- Editar un título o descripción de especificación cambia el estado local del editor.
- Editar sistema, días o ciclos de un encofrado cambia el estado local de la vista.
- Guardar borrador guarda datos locales del expediente.
- Descargar Markdown lee el estado del dossier disponible al momento de la descarga.
- No se recalcula automáticamente el modelo constructivo.
- No se recalcula automáticamente el presupuesto general.
- No se recalcula automáticamente el cronograma.
- No se regenera automáticamente el IFC después de editar el expediente.
- No existe invalidación de caché ni versión transaccional.

### 8.2 Cadena que DeepSeek debe implementar primero

Debe crearse un servicio de aplicación local, por ejemplo `recalculateProject(projectState)`, que reciba una versión inmutable del proyecto y produzca un nuevo snapshot:

```ts
export type ProjectSnapshot = {
  id: string;
  version: number;
  sourceVersion: number;
  familyInstances: FamilyInstance[];
  constructionModel: ConstructionModel;
  quantities: QuantityTakeoff;
  budget: Budget;
  schedule: Schedule;
  technicalDossier: TechnicalDossier;
  exports: {
    ifc?: ExportArtifact;
    markdown?: ExportArtifact;
  };
  invalidations: string[];
  generatedAt: string;
};

export function recalculateProject(input: ProjectInput): ProjectSnapshot;
```

La primera versión puede ser local y síncrona. Debe tener pruebas de que cambiar una dimensión de familia cambia el metrado y el costo, que cambiar duración cambia el cronograma y que el snapshot exporta el IFC y Markdown correspondientes.

## 9. DELTA-6.2

No existe integración con DELTA-6.2. No hay código que lea hojas `FUENTES`, `REGISTROS_DELTA62`, `EVIDENCIA` o `GLOSARIO`. La revisión RNE actual usa heurísticas locales en `reviewNormativeReadiness` y no consume esos registros.

DELTA-6.2 debe mantenerse como canal separado hasta que el usuario solicite una integración explícita. No debe mezclarse con el catálogo de familias ni con el modelo constructivo sin un contrato de importación y trazabilidad.

## 10. Respuestas a las preguntas abiertas

### 10.1 Estado canónico

El estado canónico es el prototipo funcional local del checkpoint `6e4624b6`. No hay una versión más avanzada verificada en esta sesión.

### 10.2 Catálogo de familias

La lista de familias Revit es una especificación de alcance y taxonomía. No es todavía un contrato de implementación completo. El contrato persistente de familia paramétrica debe diseñarse antes de crear cientos de familias.

### 10.3 ¿Código nuevo o completar lo existente?

La instrucción es **completar lo existente y crear solo contratos que aún no existen**. No se deben duplicar `GeneratedBuilding`, `ConstructionModel`, `Muro`, `TechnicalDossier`, `FormworkRequirement` ni las funciones de exportación existentes.

### 10.4 Primera tarea concreta

La primera tarea técnica debe ser crear el contrato persistente de familia paramétrica y, simultáneamente, implementar la propagación mínima de cambios sobre un caso pequeño. El primer caso recomendado es una mampara de aluminio y vidrio o una ventana.

La prueba mínima debe demostrar:

```text
cambiar ancho/alto
→ cambiar geometría 2D y 3D
→ cambiar área y piezas
→ cambiar metrado
→ cambiar costo
→ cambiar duración de montaje
→ cambiar IFC
→ cambiar Markdown
```

### 10.5 Roles

DeepSeek desarrolla el código y propone contratos. Manus integra, compila, ejecuta pruebas y verifica la UI. El usuario asesora la lógica de arquitectura, construcción, producto y prioridades.

### 10.6 Nombre del proyecto

El nombre canónico es ARKI. SICL y SiMS-DeI no pertenecen a este proyecto.

## 11. Paquete entregable para DeepSeek

El paquete complementario contiene:

- Los módulos TypeScript reales de dominio.
- Los tres tests ejecutables.
- `package.json` y `pnpm-lock.yaml`.
- La configuración TypeScript.
- El árbol del proyecto.
- Esta auditoría.
- El documento de estado general.
- La lista de familias Revit.
- El handoff narrativo anterior.

El paquete no incluye `node_modules`, `dist`, capturas, logs ni la UI completa, porque DeepSeek necesita primero verificar el dominio y las pruebas.

## 12. Orden de trabajo acordado

1. Crear `ArkiParametricFamily` y `FamilyInstance` sin duplicar el catálogo de edificios.
2. Crear un catálogo pequeño de familias paramétricas: ventana, mampara, puerta, perfil metálico, escritorio, computadora, televisor y HVAC.
3. Crear `recalculateProject` y los tipos de snapshot.
4. Probar la propagación completa con una familia.
5. Completar la edición de especificaciones y de los 164 encofrados.
6. Crear el importador de IFC y el catálogo de sólidos/familias.
7. Incorporar las familias por tipología de obra.
8. Construir el backend persistente y el almacenamiento documental.
9. Completar costos, avance, expediente y mantenimiento.

## 13. Mensaje listo para DeepSeek

> Este es el estado técnico verificable de ARKI. El checkpoint canónico es `6e4624b6` del 22-09-2026. ARKI es un prototipo funcional local, no un MVP productivo. El código fuente de dominio está en `shared/` y los tests ejecutables en `scripts/`. Los tres tests pasan. No existe backend persistente ni importador real de RFA/RVT/IFC/CAD/BCF/COBie. El modelo de edificio actual usa `DynamicBuildingFamily` y `GeneratedBuilding`; el modelo constructivo usa `ConstructionModel`, `Muro`, `StructuralElement`, `ApuPartida` y `ScheduleTask`; el dossier usa `TechnicalDossier` y `FormworkRequirement`. No dupliques esas entidades. La primera tarea es diseñar `ArkiParametricFamily` y `FamilyInstance`, implementar `recalculateProject` y demostrar con una mampara o ventana la cadena dimensión → geometría → metrado → costo → 4D → IFC → Markdown. DELTA-6.2 no está integrado y debe mantenerse separado. DeepSeek escribe código; Manus compila y verifica; el usuario asesora el dominio y acepta el comportamiento.

## Referencias

[1]: manus-webdev://6e4624b6 "Checkpoint canónico de ARKI"
[2]: /home/ubuntu/generador-familias/ARKI_TRANSFERENCIA_DEEPSEEK.md "Handoff narrativo previo para DeepSeek"
[3]: /home/ubuntu/generador-familias/ARKI_ESTADO_COMPLETO_Y_PENDIENTES.md "Auditoría general de capacidades y pendientes"
[4]: /home/ubuntu/generador-familias/ARKI_LISTA_COMPLETA_FAMILIAS_REVIT.md "Taxonomía completa de familias Revit para ARKI"
