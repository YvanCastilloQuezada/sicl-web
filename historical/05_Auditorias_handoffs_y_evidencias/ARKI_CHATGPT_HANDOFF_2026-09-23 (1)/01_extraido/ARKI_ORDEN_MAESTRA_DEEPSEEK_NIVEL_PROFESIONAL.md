# ARKI — Orden maestra de desarrollo para DeepSeek

## Propósito

DeepSeek debe continuar ARKI como un sistema de ingeniería BIM paramétrico, no como una demo visual. La prioridad es construir una base verificable, trazable, reversible y preparada para escalar desde familias de edificios hasta componentes, costos, construcción, operación y mantenimiento.

La expresión **“nivel NASA”** significa disciplina de ingeniería: contratos explícitos, control de cambios, pruebas reproducibles, trazabilidad, tolerancia a fallos, documentación, observabilidad y revisión humana. No significa que el software esté certificado por NASA ni que los resultados de ingeniería sean automáticamente aptos para obra.

## 1. Roles y reglas de colaboración

### DeepSeek

DeepSeek es responsable de diseñar contratos, implementar código de dominio, escribir pruebas, documentar decisiones y declarar limitaciones. Debe trabajar sobre el código existente y crear entidades nuevas solo cuando no exista una equivalente.

### Manus

Manus integra los cambios, ejecuta `pnpm check`, `pnpm build`, los tests de dominio y el preview. También verifica que no existan regresiones y guarda checkpoints.

### Usuario

El usuario es asesor de arquitectura, construcción, costos, operación y producto. Valida el significado funcional, las prioridades y las decisiones de dominio. Ninguna regla normativa, costo contractual, cálculo estructural o emisión legal debe considerarse aprobado sin validación profesional.

## 2. Estado canónico que no se puede contradecir

- Proyecto: ARKI / Generador de Familias.
- Checkpoint canónico: `6e4624b6`.
- Estado: prototipo funcional local / demostrador técnico.
- Código de dominio: `shared/`.
- UI canónica: `client/src/pages/Home.tsx` y `client/src/components/ProfessionalFamilyViewer.tsx`.
- Servidor: entrega estática y proxy de storage de Manus; no es backend BIM de negocio.
- Tests actuales: `test-constructive.ts`, `test-professional.ts`, `test-technical-dossier.ts`; los tres pasan.
- DELTA-6.2: no integrado y debe mantenerse separado.

No se debe afirmar que ARKI está en producción, que el expediente es definitivo, que IFC está validado externamente o que las reglas RNE reemplazan a especialistas.

## 3. Contratos que deben conservarse

No romper ni duplicar estos contratos sin una migración explícita:

- `DynamicBuildingFamily`.
- `GeneratedBuilding`.
- `ConstructionModel`.
- `Muro`.
- `StructuralElement`.
- `ElementRelation`.
- `ApuPartida`.
- `ScheduleTask`.
- `TechnicalDossier`.
- `FormworkRequirement`.
- `exportConstructionIfc()`.
- `generateTechnicalDossier()`.
- Los tres tests existentes.

Si un contrato debe cambiar, entregar primero un ADR con motivación, impacto, compatibilidad, migración, rollback y pruebas.

## 4. Principios de ingeniería obligatorios

### 4.1 Una sola fuente de verdad

No mantener copias mutables de la misma entidad. Las colecciones específicas de puertas, ventanas, escaleras, pisos, techos y tabiques pueden existir como índices derivados, pero debe existir una colección canónica de instancias.

### 4.2 Dominio separado de UI

La UI no debe contener reglas de negocio. `Home.tsx` puede orquestar estado y eventos, pero la generación, el recálculo, la serialización y la exportación deben vivir en `shared/` o en servicios de aplicación claramente definidos.

### 4.3 Dominio separado de infraestructura

El motor debe poder probarse sin navegador, servidor, almacenamiento Manus ni Revit. Los importadores, almacenamiento y conectores deben depender de interfaces, no al revés.

### 4.4 DTOs para persistencia

Las clases como `Muro` pueden conservar métodos de dominio. La persistencia debe usar DTOs planos versionados. Nunca guardar instancias de clase directamente en JSON, `localStorage`, base de datos o archivos de intercambio.

### 4.5 Unidades explícitas

Cada cantidad debe declarar unidad y sistema. El dominio debe normalizar internamente a unidades SI y convertir únicamente en la presentación. Las conversiones deben probarse y registrar origen, precisión y redondeo.

### 4.6 Inmutabilidad de snapshots

Una versión generada debe ser inmutable. Una edición debe producir un nuevo snapshot con número de versión, autor, fecha, causa, dependencias invalidadas y hash de contenido.

### 4.7 Determinismo

La misma entrada, versión de catálogo y reglas debe producir el mismo resultado, salvo timestamps y metadatos explícitamente excluidos del hash. Evitar `Math.random()` en identificadores de elementos que deban ser reproducibles.

### 4.8 Trazabilidad completa

Cada resultado debe poder responder:

```text
¿De qué familia provino?
¿De qué tipo?
¿Con qué parámetros?
¿Con qué reglas?
¿Con qué versión de materiales?
¿Con qué APU?
¿Con qué modelo?
¿Quién lo modificó?
¿Cuándo?
¿Por qué?
¿Qué cálculos quedaron invalidados?
```

### 4.9 Errores explícitos

No ocultar datos faltantes con valores silenciosos. Diferenciar `unknown`, `not_applicable`, `invalid`, `blocked` y `derived`. Los exportadores deben rechazar o advertir cuando falten datos críticos.

### 4.10 Compatibilidad hacia atrás

Los esquemas deben incluir versión. Una migración debe poder leer snapshots anteriores o rechazar el archivo con un diagnóstico claro. No cambiar nombres de campos sin adaptador.

## 5. Primera entrega obligatoria: núcleo de familia paramétrica y recálculo

Crear los siguientes archivos nuevos:

```text
shared/arkiParametricFamilies.ts
shared/arkiConstructionDTOs.ts
shared/arkiRecalculation.ts
scripts/test-wall-coherence.ts
scripts/test-budget-reconciliation.ts
scripts/test-serialization.ts
scripts/test-recalculation.ts
```

### 5.1 `ArkiParametricFamily`

Debe complementar, no reemplazar, a `DynamicBuildingFamily`.

```ts
export type ArkiParametricFamily = {
  schema: "ARKI-PARAMETRIC-FAMILY-1.0";
  id: string;
  name: string;
  category: string;
  discipline: string;
  typologies: string[];
  source?: ImportSource;
  geometry: {
    parameters: FamilyParameter[];
    constraints: Constraint[];
    referencePlanes: ReferencePlane[];
    host: "wall" | "floor" | "roof" | "face" | "level" | "none";
  };
  materials: Material[];
  types: FamilyType[];
  nestedFamilies: string[];
  quantityRules: QuantityRule[];
  costRules: CostRule[];
  scheduleRules: ScheduleRule[];
  maintenanceRules: MaintenanceRule[];
  classification: {
    revitCategory?: string;
    ifcClass?: string;
    uniformat?: string;
    omniclass?: string;
    customCodes: Record<string, string>;
  };
  lifecycle: {
    status: "draft" | "validated" | "approved" | "deprecated";
    version: number;
    createdAt: string;
    updatedAt: string;
  };
};
```

### 5.2 `FamilyInstance`

Debe ser una entidad nueva. No convertir todos los componentes en `StructuralElement`.

```ts
export type FamilyInstance = {
  schema: "ARKI-FAMILY-INSTANCE-1.0";
  id: string;
  familyId: string;
  typeId: string;
  projectId: string;
  hostId?: string;
  elementRole: "architectural" | "structural" | "mep" | "furniture" | "equipment" | "asset";
  transform: {
    xM: number;
    yM: number;
    zM: number;
    rotationDeg: number;
    scale: { x: number; y: number; z: number };
  };
  parameters: Record<string, string | number | boolean>;
  materialOverrides?: Record<string, string>;
  quantity?: QuantityResult;
  cost?: CostResult;
  schedule?: ScheduleLink;
  asset?: AssetLink;
  sourceSnapshotId: string;
  version: number;
  status: "derived" | "overridden" | "stale";
};
```

### 5.3 DTOs de construcción

Crear `WallDTO`, `ConstructionModelDTO` y conversiones explícitas:

```ts
export function wallToDTO(wall: Muro): WallDTO;
export function wallFromDTO(dto: WallDTO): Muro;
export function constructionModelToDTO(model: ConstructionModel): ConstructionModelDTO;
export function constructionModelFromDTO(dto: ConstructionModelDTO): ConstructionModel;
```

Los tests deben demostrar:

```text
Muro → DTO → JSON.stringify → JSON.parse → DTO → Muro
```

sin pérdida de identidad, capas, aberturas, metrados, partidas, estado ni metadata.

### 5.4 APU versionado

Crear `PriceBook` o `ApuCatalog`. No eliminar de golpe `APU_DATABASE`; dejar adaptador para pruebas actuales.

Campos mínimos:

```ts
export type PriceBook = {
  schema: "ARKI-PRICE-BOOK-1.0";
  id: string;
  version: number;
  source: "ARKI_REFERENCIAL" | "S10" | "CAPECO" | "MANUAL";
  region: string;
  country: string;
  currency: "PEN" | "USD";
  validFrom: string;
  validTo?: string;
  projectId?: string;
  items: PriceBookItem[];
};
```

Cada partida debe guardar código, unidad, insumos, rendimientos, costo directo, indirectos, utilidad, impuestos, fuente y fecha.

### 5.5 Encofrado trazable

Añadir a `FormworkRequirement`:

```ts
modelVersion: number;
elementVersion: number;
sourceSnapshotId: string;
status: "derived" | "overridden" | "stale";
```

Si cambia el elemento original, los requerimientos derivados deben marcarse `stale` hasta ser recalculados. Si el usuario los edita, deben marcarse `overridden` y no sobrescribirse silenciosamente.

### 5.6 `recalculateProject()`

Implementar una función pura y versionada:

```ts
export type ProjectInput = {
  source: ProjectSnapshot;
  changes: ProjectChange[];
  rules: RuleSet;
};

export type ProjectSnapshot = {
  schema: "ARKI-PROJECT-SNAPSHOT-1.0";
  id: string;
  version: number;
  sourceVersion: number;
  familyInstances: FamilyInstance[];
  constructionModel: ConstructionModelDTO;
  quantities: QuantityTakeoff;
  budget: Budget;
  schedule: Schedule;
  technicalDossier: TechnicalDossier;
  invalidations: string[];
  provenance: ProvenanceRecord[];
  generatedAt: string;
};

export function recalculateProject(input: ProjectInput): ProjectSnapshot;
```

La primera implementación debe funcionar en memoria. No implementar aún backend, usuarios, importadores RFA/RVT ni mantenimiento completo.

## 6. Caso demostrable obligatorio

Crear una familia paramétrica de mampara o ventana. El caso debe probar:

```text
cambiar ancho/alto
→ actualizar geometría 2D
→ actualizar geometría 3D
→ actualizar cantidad de vidrio
→ actualizar longitud de perfiles
→ actualizar herrajes
→ actualizar metrado
→ actualizar partida
→ actualizar presupuesto
→ actualizar duración de montaje
→ actualizar actividad 4D
→ actualizar IFC
→ actualizar Markdown
```

Cada paso debe dejar evidencia en `snapshot.invalidations` y `provenance`.

## 7. Tests y calidad mínima

Los tests existentes no se deben borrar ni debilitar. Agregar:

### `test-wall-coherence.ts`

Debe comprobar:

- Todas las capas tienen espesor mayor que cero.
- Todas las aberturas caben dentro de la longitud del muro.
- Ninguna área o volumen calculado es negativo.
- El área neta coincide con el área bruta menos aberturas.
- El volumen coincide con área neta por espesor.
- El peso coincide con densidad por volumen de capa.
- El metrado coincide con el dominio.

### `test-budget-reconciliation.ts`

Debe comprobar:

- Todas las partidas referencian una partida válida.
- El precio unitario coincide con el catálogo de precios usado.
- La suma de partidas coincide con el presupuesto del modelo con tolerancia documentada.
- La moneda y unidades están presentes.
- No existen partidas sin fuente o fecha.

### `test-serialization.ts`

Debe comprobar:

- Conversión de clases a DTO.
- JSON stringify/parse.
- Reconstrucción del dominio.
- Preservación de campos críticos.
- Repetición del cálculo después de reconstruir.

### `test-recalculation.ts`

Debe comprobar toda la cadena de la sección 6 y verificar que no se recalculen módulos no afectados.

## 8. Calidad de código

- TypeScript estricto.
- No `any` salvo adaptadores de entrada aislados y documentados.
- No `Math.random()` para IDs deterministas.
- No `Date.now()` dentro de resultados que deban tener hash estable.
- No mutar snapshots recibidos.
- No esconder excepciones.
- Funciones pequeñas y con una responsabilidad.
- Tipos discriminados para estados y formatos.
- Validación de entradas con esquemas.
- Nombres consistentes y unidades en campos.
- JSDoc solo donde explique una decisión no obvia.
- Ningún `TODO` crítico sin issue o documento de decisión.
- Ningún archivo nuevo sin test o razón documentada.

## 9. Observabilidad y diagnóstico

Cada cálculo importante debe poder devolver un diagnóstico:

```ts
export type CalculationDiagnostic = {
  code: string;
  severity: "info" | "warning" | "error" | "blocker";
  message: string;
  entityId?: string;
  field?: string;
  source?: string;
  remediation?: string;
};
```

Los errores deben indicar entidad, campo, versión, unidad, regla y corrección sugerida. No responder únicamente `INVALID_MODEL`.

## 10. Seguridad y confianza

Aunque la primera fase sea local, el diseño debe quedar preparado para:

- Validar archivos importados.
- Rechazar extensiones no permitidas.
- Limitar tamaño de archivos.
- No ejecutar scripts contenidos en archivos de usuario.
- Separar geometría de metadatos.
- Sanitizar Markdown y HTML exportado.
- Registrar autor y origen de cambios.
- Evitar que datos importados modifiquen silenciosamente reglas normativas.
- Mantener los archivos originales sin alterarlos.

## 11. Interoperabilidad futura

Preparar adaptadores, pero no fingir implementaciones que todavía no existen:

- IFC import/export.
- RFA/RVT mediante conector Revit API o Dynamo.
- DWG/DXF mediante servicio o librería especializada.
- OBJ/GLB/STEP/SAT para geometría.
- BCF para incidencias.
- COBie para activos.
- CSV/XLSX para precios y catálogos.
- PDF para expediente.

Cada adaptador futuro debe declarar capacidades, pérdida de información, unidades, versión y estado de validación.

## 12. Documentación obligatoria por entrega

Cada entrega de DeepSeek debe incluir:

1. Resumen de cambios.
2. Archivos modificados y creados.
3. Contratos conservados.
4. Decisiones nuevas.
5. Migraciones necesarias.
6. Tests agregados.
7. Comandos ejecutados.
8. Resultado de cada test.
9. Riesgos conocidos.
10. Limitaciones.
11. Recomendación de siguiente paso.
12. Si aplica, ADR con rollback.

## 13. Lo que no se debe hacer todavía

No implementar aún:

- Backend persistente.
- Usuarios y permisos.
- Importadores RFA/RVT.
- Importadores CAD.
- Asset y mantenimiento completo.
- Firma legal.
- Separación estética de `arkiProfessionalModules.ts`.
- Refactorización masiva de la UI.
- Cálculo estructural definitivo.
- Declarar cumplimiento RNE automático.

Primero debe estar estable el contrato paramétrico, la serialización, el catálogo versionado y el recálculo.

## 14. Criterio de aceptación de la primera fase

La fase se acepta únicamente si:

- `pnpm check` pasa.
- `pnpm build` pasa.
- Los tres tests existentes siguen pasando.
- Los cuatro tests nuevos pasan.
- El snapshot se puede serializar y reconstruir.
- La mampara o ventana demuestra la cadena completa.
- APU y encofrados tienen trazabilidad de versión.
- No se duplican `DynamicBuildingFamily`, `GeneratedBuilding` o `ConstructionModel`.
- La UI actual sigue generando y guardando propuestas.
- La exportación IFC actual no queda rota.
- La documentación de limitaciones se entrega junto al código.

## 15. Orden listo para copiar a DeepSeek

> DeepSeek, queremos llevar ARKI a un estándar profesional de ingeniería, con disciplina tipo NASA: contratos explícitos, una sola fuente de verdad, DTOs serializables, determinismo, trazabilidad, versionado, diagnóstico, pruebas de contrato, rollback y documentación. No queremos solo una demo. El checkpoint canónico es `6e4624b6`, ARKI está en prototipo funcional local, los tres tests actuales pasan y la UI canónica sí consume el dominio. No rompas ni dupliques `DynamicBuildingFamily`, `GeneratedBuilding`, `ConstructionModel`, `Muro`, `StructuralElement`, `ApuPartida`, `ScheduleTask`, `TechnicalDossier` ni `FormworkRequirement`.
>
> Primera entrega obligatoria: crea `shared/arkiParametricFamilies.ts`, `shared/arkiConstructionDTOs.ts`, `shared/arkiRecalculation.ts` y los tests `test-wall-coherence.ts`, `test-budget-reconciliation.ts`, `test-serialization.ts` y `test-recalculation.ts`. Define `ArkiParametricFamily` y `FamilyInstance` como entidades nuevas que complementen a `DynamicBuildingFamily`. Define `WallDTO` y `ConstructionModelDTO` con `toDTO()` y `fromDTO()`. Añade a `FormworkRequirement` `modelVersion`, `elementVersion`, `sourceSnapshotId` y `status: derived | overridden | stale`. Crea un `PriceBook` o `ApuCatalog` versionado con fuente, región, moneda, fechas y proyecto.
>
> Implementa `recalculateProject()` con snapshots inmutables, DTOs, invalidaciones y provenance. Prueba una mampara o ventana paramétrica con la cadena ancho/alto → geometría 2D/3D → vidrio/perfiles/herrajes → metrado → partida → presupuesto → duración → 4D → IFC → Markdown. La misma entrada y las mismas versiones deben producir el mismo resultado. No uses IDs aleatorios para resultados deterministas. No guardes clases directamente en JSON. Mantén compatibilidad con las pruebas actuales mediante adaptadores.
>
> No implementes todavía backend, usuarios, RFA/RVT, CAD, BCF, COBie, O&M ni una refactorización grande de la UI. Antes de cada cambio peligroso entrega un ADR. En cada entrega informa archivos, contratos, migraciones, tests, comandos, resultados, riesgos y limitaciones. Si algo es conceptual, dilo. Si no puedes verificar algo con código o test, márcalo como UNKNOWN. El criterio de aceptación es `pnpm check`, `pnpm build`, los tres tests actuales y los cuatro nuevos pasando, sin romper la UI, IFC ni el expediente.

## Referencias

[1]: manus-webdev://6e4624b6 "Checkpoint canónico de ARKI"
[2]: /home/ubuntu/generador-familias/ARKI_AUDITORIA_TECNICA_DEEPSEEK.md "Auditoría técnica verificable de ARKI"
[3]: /home/ubuntu/upload/pasted_content_15.txt "Veredicto final de DeepSeek"
