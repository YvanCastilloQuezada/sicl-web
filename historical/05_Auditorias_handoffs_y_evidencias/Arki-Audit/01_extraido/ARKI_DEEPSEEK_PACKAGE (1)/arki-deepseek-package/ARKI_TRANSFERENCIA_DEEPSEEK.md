# ARKI — Documento de transferencia para continuar el desarrollo con DeepSeek

## 1. Propósito de este documento

Este documento pone al tanto a DeepSeek del trabajo realizado en ARKI, de la forma de colaboración utilizada y del objetivo final del proyecto. Debe servir como contexto operativo para continuar escribiendo código sin duplicar módulos, sin perder decisiones previas y sin confundir un prototipo conceptual con un expediente técnico aprobado.

La finalidad de ARKI es convertirse en una plataforma BIM paramétrica para edificios completos. ARKI debe permitir diseñar, importar, parametrizar, documentar, presupuestar, construir, hacer seguimiento y mantener una obra durante todo su ciclo de vida.

## 2. Forma de trabajo acordada

La colaboración se ha organizado con tres roles claros.

### DeepSeek: desarrollador de código y arquitecto de dominio

DeepSeek propone la ontología, los contratos de datos, los algoritmos y los módulos de negocio. Escribe o transforma el código que implementa las familias paramétricas, el modelo constructivo, los elementos, los costos, el expediente, las importaciones y las reglas de operación.

Cada módulo que entregue debe incluir contratos tipados, funciones deterministas cuando sea posible, datos de ejemplo y pruebas reproducibles. No debe crear módulos duplicados. Antes de añadir una entidad debe revisar si ya existe una equivalente en el modelo central.

### Manus: integrador, compilador y verificador

Manus integra los cambios en el proyecto, ejecuta la comprobación de TypeScript, compila la aplicación, ejecuta las pruebas, revisa el preview, corrige incompatibilidades y guarda checkpoints ejecutables. Manus no debe inventar resultados de ingeniería ni presentar como definitivo un resultado que solo es conceptual.

Los comandos principales de validación son:

```bash
cd /home/ubuntu/generador-familias
pnpm check
pnpm build
pnpm tsx scripts/test-constructive.ts
pnpm tsx scripts/test-professional.ts
pnpm tsx scripts/test-technical-dossier.ts
```

### Usuario: asesor de arquitectura, construcción y producto

El usuario define la visión, valida si la ontología representa la práctica real, prioriza módulos, aporta documentos y decide qué debe continuar. El usuario actúa como asesor funcional y de dominio. No tiene que revisar cada detalle de TypeScript, pero sí debe validar los nombres, procesos, documentos, familias, normas, costos y flujos de trabajo.

## 3. Objetivo final de ARKI

ARKI debe funcionar como un sistema BIM paramétrico y de ciclo de vida, no como una colección de pantallas separadas.

```text
Importación de familias y sólidos
              ↓
Catálogo de familias paramétricas
              ↓
Módulo 2D paramétrico
              ↓
Modelo BIM semántico 3D
              ↓
Metrados y materiales
              ↓
Costos, APU y presupuesto 5D
              ↓
Cronograma y seguimiento 4D
              ↓
Modelo conforme a obra
              ↓
Activos, mantenimiento y operación
              ↓
Renovación, ampliación o demolición
```

La regla principal es que exista un **modelo central único**. El dibujo 2D, el visor 3D, el presupuesto, el avance de obra y el mantenimiento deben leer y escribir sobre el mismo modelo semántico. No se deben crear copias desconectadas de los objetos.

## 4. Estado real al momento de la transferencia

El proyecto actual es una aplicación React con TypeScript y Tailwind, ejecutable en WebDev. El frontend está integrado con un motor local en `shared/`. No existe todavía un backend persistente completo.

El checkpoint funcional más reciente es:

[Checkpoint ejecutable ARKI](manus-webdev://6e4624b6)

### 4.1 Funciones ya operativas

- Catálogo declarativo de 12 familias de edificación.
- Tres variantes por familia en el catálogo actual.
- Generación paramétrica por área, aforo, niveles, ciudad y contexto RNE.
- Vistas conceptuales de planta, corte y masa 3D.
- Guardado, restauración, eliminación y comparación local de versiones.
- Modelo constructivo semántico con espacios, muros, capas, aberturas, cimentaciones, columnas, vigas, losas, escaleras, pisos, techos, tabiques, puertas, ventanas y relaciones.
- Metrados conceptuales y presupuesto referencial.
- Base APU inicial en soles peruanos.
- Importación local de CSV con estructura S10.
- Exportación IFC semántica conceptual.
- Módulos locales de 4D, 5D, clashes heurísticos, aprobación y CDE demostrativo.
- Expediente técnico local con especificaciones, encofrados, precios regionales y revisión RNE inicial.
- Editor local de títulos y descripciones de especificaciones.
- Editor local parcial de sistemas, días y ciclos de reutilización de encofrados.
- Guardado de borrador en `localStorage`.
- Descarga Markdown de especificaciones y encofrados.

### 4.2 Resultados de la prueba actual

Para el caso de prueba de un hospital general en Trujillo se han verificado los siguientes valores:

| Resultado | Valor probado |
|---|---:|
| Espacios | 16 |
| Muros | 16 |
| Cimentaciones | 72 |
| Columnas | 72 |
| Vigas | 16 |
| Losas | 4 |
| Escaleras | 4 |
| Pisos | 4 |
| Techos | 1 |
| Tabiques | 4 |
| Puertas | 16 |
| Ventanas | 320 |
| Relaciones | 464 |
| Requerimientos de encofrado | 164 |
| Especificaciones base | 7 |
| Hallazgos RNE iniciales | 4 |
| Periodos 5D | 3 |
| Incidencias heurísticas | 480 |
| Conflictos de recursos | 0 |

Estos números demuestran que el flujo funciona como prototipo. No significan que el modelo esté listo para construcción ni que los resultados normativos o económicos sean definitivos.

## 5. Archivos centrales actuales

| Archivo | Función |
|---|---|
| `shared/arkiDynamicFamilies.ts` | Catálogo de familias, variantes, parámetros, reglas y generación de propuestas |
| `shared/arkiConstructionOntology.ts` | Muros, capas, aberturas, espacios, metrados, partidas, schedule y contrato constructivo |
| `shared/arkiConstructionElements.ts` | Columnas, vigas, losas, cimentaciones, puertas, ventanas, escaleras, pisos, techos, tabiques y relaciones |
| `shared/arkiFamilyComparison.ts` | Versiones, comparación y exportación de propuestas |
| `shared/arkiProfessionalModules.ts` | 4D, 5D, clashes, aprobación, CDE e importación S10 |
| `shared/arkiTechnicalDossier.ts` | Especificaciones, encofrados, precios regionales, revisión RNE y Markdown |
| `client/src/pages/Home.tsx` | Frontend principal, generador, visores, panel BIM, tabs del expediente y editor local |
| `client/src/components/ProfessionalFamilyViewer.tsx` | Vista conceptual de planta, corte y modelo 3D |
| `client/src/index.css` | Sistema visual oscuro/minimalista y estilos del editor |
| `scripts/test-constructive.ts` | Prueba de elementos, relaciones, presupuesto e IFC |
| `scripts/test-professional.ts` | Prueba de 4D, 5D, clashes, aprobación, CDE y S10 |
| `scripts/test-technical-dossier.ts` | Prueba de expediente, especificaciones, encofrados, precios y RNE |

## 6. Contratos de código importantes

### 6.1 Familia de edificio actual

Este es el contrato base que DeepSeek debe respetar para las familias de edificación existentes:

```ts
export type DynamicBuildingFamily = {
  id: string;
  name: string;
  description: string;
  category:
    | "SALUD" | "EDUCATION" | "COMMERCE" | "SPORT"
    | "OFFICES" | "LANDSCAPE" | "INDUSTRY" | "TRANSPORT"
    | "CULTURE" | "RESIDENTIAL" | "HOSPITALITY" | "WORSHIP";
  scale: "BUILDING" | "COMPLEX" | "URBAN";
  version: string;
  baseProgram: FamilyProgram;
  variants: FamilyVariant[];
  baseParameters: FamilyParameter[];
  baseRules: FamilyRule[];
  geometryStrategy:
    | "COURTYARD_MASS" | "LINEAR_MASS"
    | "ARENA_BOWL" | "PODIUM_TOWER";
  tags: string[];
};
```

### 6.2 Propuesta generada

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
  geometry2d: {
    type: string;
    footprintM2: number;
    widthM: number;
    depthM: number;
    courtyardM2?: number;
    rings?: number;
  };
  section: {
    type: string;
    floors: number;
    floorHeightM: number;
    totalHeightM: number;
    usesByFloor: string[];
  };
  geometry3d: {
    type: string;
    floors: number;
    heightM: number;
    massing: string;
  };
  unifiedGeometry: {
    schema: "ARKI-UNIFIED-GEOMETRY-1.0";
    plan: GeneratedBuilding["geometry2d"];
    section: GeneratedBuilding["section"];
    model3d: GeneratedBuilding["geometry3d"];
  };
  constructionModel?: ConstructionModel;
  validation: ValidationState;
  alerts: Alert[];
  status: "GENERATED_CANDIDATE";
  humanReviewRequired: true;
  projectStateMutation: "NOT_REQUESTED";
};
```

El estado `GENERATED_CANDIDATE` debe mantenerse hasta que exista revisión y aprobación. No se debe convertir automáticamente una propuesta en una versión aprobada.

### 6.3 Modelo constructivo central

```ts
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

### 6.4 Familia paramétrica futura

Este contrato debe servir para importar o crear familias de Revit, sólidos, muebles, equipamiento y activos:

```ts
export type ArkiParametricFamily = {
  id: string;
  name: string;
  category: string;
  discipline: string;
  typologies: string[];
  source?: {
    format: "RFA" | "RVT" | "IFC" | "DWG" | "DXF" | "OBJ" | "STEP" | "GLB";
    fileName: string;
    version?: string;
  };
  geometry: {
    parameters: FamilyParameter[];
    constraints: Constraint[];
    referencePlanes: ReferencePlane[];
    host?: "wall" | "floor" | "roof" | "face" | "level" | "none";
  };
  materials: Material[];
  types: FamilyType[];
  nestedFamilies: string[];
  quantityRules: QuantityRule[];
  costRules: CostRule[];
  scheduleRules: ScheduleRule[];
  maintenanceRules: MaintenanceRule[];
  revit: {
    category?: string;
    subcategory?: string;
    sharedParameters?: string[];
    connectors?: Connector[];
  };
};
```

### 6.5 Expediente técnico actual

```ts
export type TechnicalDossier = {
  title: string;
  version: string;
  modelId: string;
  specifications: TechnicalSpecification[];
  formwork: FormworkRequirement[];
  regionalPrices: RegionalPrice[];
  normativeFindings: NormativeFinding[];
  sections: DossierSection[];
  readiness: {
    percentage: number;
    blockers: string[];
    specialistReviewRequired: boolean;
  };
};
```

El expediente actual es local. Sus secciones son memoria descriptiva, especificaciones técnicas, planos/modelo IFC, metrados/APU/encofrados, revisión RNE y firmas/emisión.

### 6.6 Encofrados

El contrato de encofrados ya contiene los campos principales pedidos durante la sesión:

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
```

La siguiente mejora debe convertir este contrato en una entidad editable completa, incluyendo materiales, espesor, arriostres, notas y reglas de seguridad.

## 7. Familias paramétricas que se quieren incorporar

La visión de ARKI incluye familias importables y paramétricas, no únicamente sólidos creados desde cero.

### Arquitectura y envolvente

Muros, puertas, ventanas, vidrios, mamparas, muros cortina, perfilerías, paneles, pisos, cielos rasos, techos, cubiertas, escaleras, rampas, barandas, rejas, portones, acabados, aislantes y sistemas de impermeabilización.

### Estructuras

Columnas, vigas, losas, cimentaciones, muros estructurales, acero de refuerzo, perfiles metálicos, cerchas, pórticos, arriostres, placas base, pernos, soldaduras, conexiones, estructuras espaciales, plataformas, marquesinas y soportes de equipos.

### Instalaciones

Aparatos sanitarios, tuberías, válvulas, bombas, cisternas, tanques, rociadores, gabinetes contra incendio, tableros, tomacorrientes, luminarias, bandejas, conduit, transformadores, UPS, grupos electrógenos, paneles solares, ductos, equipos HVAC, sensores, cámaras, racks, servidores, controles de acceso y sistemas de comunicación.

### Mobiliario, equipamiento y activos

Muebles fijos y móviles, escritorios, mesas, sillas, camas, armarios, gabinetes, cocinas, bibliotecas, vitrinas, góndolas, computadoras, monitores, televisores, impresoras, proyectores, servidores, equipos médicos, máquinas industriales, equipamiento deportivo, butacas, sistemas escénicos y equipos de transporte.

Cada familia debe poder clasificarse por tipología de obra: vivienda, multifamiliar, salud, educación, oficinas, comercio, industria, deporte, cultura, hotelería, transporte, culto y paisajismo.

## 8. Importación y reutilización

Se quiere aprovechar lo que ya existe en Revit y en catálogos de fabricantes. ARKI debe tener un módulo de Importación y Catálogo BIM.

Formatos objetivo:

- `.rfa` para familias nativas de Revit.
- `.rvt` para proyectos o modelos.
- `.ifc` para intercambio BIM.
- `.dwg` y `.dxf` para CAD.
- `.sat`, `.step` y `.stp` para sólidos.
- `.obj`, `.fbx` y `.glb` para visualización 3D.
- `.csv` y `.xlsx` para parámetros, costos y catálogos.
- `.bcf` para incidencias.
- `.cobie` para activos y mantenimiento.
- `.e57` y nube de puntos para existentes o as-built.
- `.pdf`, `.jpg` y `.png` para documentación de referencia.

El flujo deseado es:

```text
Carga → detección de formato → validación → unidades → clasificación
→ mapeo de parámetros → detección de duplicados → previsualización
→ aprobación del usuario → catálogo ARKI → inserción 2D/3D
→ costos → avance → mantenimiento → exportación
```

Un `.rfa` importado debe conservar todo lo posible. Un `.ifc`, `.obj` o `.dwg` puede llegar solo como geometría y luego ser enriquecido. La generación de un `.rfa` nativo requiere un conector con Revit API, Dynamo o un complemento de escritorio; no debe prometerse como una simple función del navegador.

## 9. Módulos finales de ARKI

### Módulo 1: Familias paramétricas e importación

Catálogo central, importación de RFA/RVT/IFC/CAD/sólidos, validación, parámetros, tipos, familias anidadas, duplicados, versiones y conversión a objeto BIM ARKI.

### Módulo 2: 2D paramétrico

Plantas, cortes, elevaciones, ejes, niveles, cotas, símbolos, cuadros, láminas, cajetín, escalas y vínculos directos al modelo central.

### Módulo 3: 3D paramétrico y BIM

Espacios, arquitectura, estructura, vidrios, mamparas, estructura metálica, MEP, mobiliario, equipamiento, materiales, relaciones, IFC y coordinación.

### Módulo 4: Costos y presupuestos

Metrados, APU, S10/CAPECO, materiales, mano de obra, equipos, desperdicios, gastos generales, utilidad, IGV, comparaciones, adicionales y deductivos.

### Módulo 5: Planificación y seguimiento de obra

Cronograma, 4D, 5D, avance físico, avance financiero, valorizaciones, reportes diarios, fotografías, consultas, RFI, no conformidades, calidad, seguridad y control de cambios.

### Módulo 6: Expediente técnico y control documental

Memorias, especificaciones, planos, metrados, presupuesto, cronograma, IFC, BCF, firmas, revisiones, emisión, auditoría y PDF final.

### Módulo 7: Operación y mantenimiento

Activos, fabricante, modelo, número de serie, garantía, manuales, vida útil, órdenes de trabajo, mantenimiento preventivo y correctivo, fallas, repuestos, consumo y desempeño.

### Módulo 8: Modelo conforme a obra

Actualización de elementos ejecutados, diferencias entre diseño y construcción, planos as-built, modelo as-built, activos instalados y entrega al operador.

## 10. Lo que falta actualmente

### Prioridad inmediata

- Persistir proyectos, familias, documentos, versiones y borradores.
- Completar la edición de todos los campos de especificaciones.
- Editar todos los encofrados, no solo los primeros 12 visibles.
- Recalcular metrados, APU, 4D e IFC después de una edición.
- Agregar y eliminar especificaciones y encofrados.
- Generar una hoja de encofrados CSV/PDF.
- Añadir materiales, puntales, arriostres, clavos, alambre, desmoldante y notas al editor.

### Segunda prioridad

- Importador de IFC con reconstrucción de elementos.
- Importador de DWG/DXF y sólidos.
- Catálogo persistente de familias paramétricas.
- Mapeador de parámetros.
- Detección de duplicados.
- Tipos y familias anidadas.
- Validación de unidades y escala.
- Previsualización 2D/3D de una familia importada.

### Tercera prioridad

- Módulo 2D técnico con cotas, ejes, niveles, láminas y cuadros.
- Planos vectoriales profesionales.
- Memoria descriptiva y especificaciones completas por partida.
- PDF real del expediente.
- Cuadros de puertas, ventanas, acabados, mobiliario y equipamiento.

### Cuarta prioridad

- Estructuras metálicas y conexiones.
- Vidrios y mamparas paramétricas.
- Mobiliario y equipamiento por tipología.
- Computadoras, televisores, servidores y activos electrónicos.
- Redes MEP con cálculo y coordinación.

### Quinta prioridad

- Cálculo estructural real.
- Revisión RNE completa y versionada.
- Clash detection geométrica y BCF.
- Cronograma editable y avance real.
- Valorizaciones y control contractual.
- CDE con usuarios, roles, revisiones y auditoría.

### Sexta prioridad

- Modelo as-built.
- Inventario de activos.
- Mantenimiento preventivo y correctivo.
- Órdenes de trabajo.
- Manuales, garantías, repuestos y desempeño.

## 11. Qué debe evitarse

No se debe duplicar el modelo creando una estructura diferente para cada módulo. No se debe tratar un objeto importado como un simple sólido si puede convertirse en una familia paramétrica. No se deben presentar precios referenciales como presupuesto contractual. No se debe presentar una validación heurística como aprobación normativa. No se debe presentar IFC conceptual como modelo listo para construcción. No se debe declarar firmado o emitido un expediente sin identidad, permisos y firma real.

Tampoco se debe modificar el backend sin acordarlo. El estado actual fue construido como frontend con motor local y debe mantenerse compatible hasta decidir la arquitectura persistente.

## 12. Siguiente trabajo recomendado para DeepSeek

La siguiente entrega recomendada es completar la **Fase 1 del núcleo paramétrico**:

1. Crear `shared/arkiParametricFamilies.ts`.
2. Definir `ArkiParametricFamily`, `FamilyType`, `Constraint`, `ReferencePlane`, `QuantityRule`, `CostRule`, `ScheduleRule`, `MaintenanceRule` y `ImportSource`.
3. Crear el primer catálogo con mampara de aluminio y vidrio, ventana, puerta, perfil metálico, escritorio, computadora, televisor y equipo HVAC.
4. Definir cómo una familia se inserta en planta 2D y modelo 3D.
5. Enlazar cada familia con metrado, partida, costo, tarea 4D y activo.
6. Agregar una prueba de importación simulada con un sólido y una tabla CSV.
7. No intentar generar `.rfa` en el navegador; dejar preparado el contrato para un conector Revit posterior.
8. Entregar los cambios con pruebas y sin duplicar `ConstructionModel`.

La segunda entrega debe completar el editor técnico y propagar cambios al modelo. La tercera debe comenzar el importador BIM y el catálogo persistente.

## 13. Instrucción operativa para continuar

DeepSeek debe leer este documento como contexto de continuidad. Antes de escribir código debe revisar los archivos listados y conservar sus contratos. Debe proponer cambios pequeños y acumulables. Cada entrega debe incluir:

```text
1. Qué se añadió.
2. Qué archivos se modificaron.
3. Qué contratos se conservaron.
4. Qué pruebas se agregaron.
5. Qué comandos debe ejecutar Manus.
6. Qué limitaciones siguen existiendo.
7. Qué decisión debe validar el asesor.
```

Manus integrará, compilará y probará la entrega. El asesor validará si el comportamiento corresponde a arquitectura, construcción, costos, obra y mantenimiento reales.

## 14. Mensaje breve para DeepSeek

> DeepSeek, continuamos el desarrollo de ARKI. Tú eres el desarrollador de código y debes construir la ontología y los módulos. Manus integra, compila, prueba y corrige la aplicación. El usuario es el asesor de arquitectura, construcción y producto que valida la lógica real. ARKI debe evolucionar desde el generador conceptual actual hacia un sistema BIM paramétrico completo. Ya existe un modelo constructivo semántico con 2D/3D conceptual, elementos de obra, metrados, APU inicial, 4D/5D, IFC, encofrados, especificaciones y editor local. No dupliques entidades ni rompas `GeneratedBuilding`, `ConstructionModel` o `TechnicalDossier`. La siguiente etapa es crear el catálogo de familias paramétricas importables y enlazar cada familia con geometría, materiales, metrados, costos, 4D, avance y mantenimiento. La meta final es cubrir arquitectura, estructuras, vidrios, mamparas, estructuras metálicas, MEP, mobiliario, equipamiento, computadoras, televisores, activos, expediente, construcción y operación. Entrega contratos tipados, código probado y lista explícita de limitaciones.

## Referencias

[1]: manus-webdev://6e4624b6 "Checkpoint ejecutable de ARKI antes de esta transferencia"
[2]: /home/ubuntu/generador-familias/ARKI_ESTADO_COMPLETO_Y_PENDIENTES.md "Auditoría completa del estado y pendientes de ARKI"
[3]: /home/ubuntu/generador-familias/ARKI_LISTA_COMPLETA_FAMILIAS_REVIT.md "Lista de familias Revit y catálogo previsto para ARKI"
