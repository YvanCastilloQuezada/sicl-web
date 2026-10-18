# ARKI — Acta de verificación de la Entrega 1A

**Fecha:** 22 de septiembre de 2026  
**Entrega:** 1A — Contrato paramétrico y DTOs  
**Veredicto:** **APPROVE WITH FIXES**  
**Avance a 1B:** Desbloqueado, sujeto a conservar este alcance

## 1. Archivos integrados

Se integraron físicamente los cuatro archivos solicitados:

```text
shared/arkiParametricFamilies.ts
shared/arkiConstructionDTOs.ts
scripts/test-serialization.ts
scripts/test-wall-coherence.ts
```

No se modificaron los contratos existentes ni los archivos de UI, servidor o fases posteriores.

## 2. Alcance verificado

La entrega incluye `ArkiParametricFamily` y `FamilyInstance` como entidades nuevas. `DynamicBuildingFamily` no fue reemplazada.

`FamilyParameter` se reutiliza desde `arkiDynamicFamilies.ts`; no existe una segunda declaración del tipo.

`FamilyInstance` no contiene `scale` ni `AssetLink`.

`WallDTO` replica la salida `snake_case` de `Muro.to_dict()` sin añadir `schema` propio. Conserva `geometria.longitud` y `geometria.espesor_total` porque existen en la salida real del dominio.

`ConstructionModelDTO` mantiene la estructura de `ConstructionModel` y cambia únicamente `walls` de `Muro[]` a `WallDTO[]`.

`wallFromDTO()` reconstruye una instancia operativa de `Muro` con métodos de cálculo disponibles.

No se creó `PriceBook`, no se modificó `FormworkRequirement`, no se creó `recalculateProject()` y no se creó la familia de mampara.

## 3. Evidencia de compilación y pruebas

### `pnpm check`

Resultado: **PASA**.

### `pnpm build`

Resultado: **PASA**.

El build produjo `dist/public` y `dist/index.js`. Vite emitió una advertencia no bloqueante sobre un chunk mayor a 500 kB.

### `test-constructive.ts`

Resultado: **PASA**.

Resumen:

```text
walls=16
spaces=16
columns=72
beams=16
slabs=4
foundations=72
stairs=4
floors=4
roofs=1
partitions=4
doors=16
windows=320
relations=464
netWallM2=8028.6
budgetPen=4672910
durationDays=93
```

### `test-professional.ts`

Resultado: **PASA**.

Resumen:

```text
periods=3
financialTotal=1759040.94
conflicts=0
clashes=480
approvalStatus=pending
cdeDocuments=2
s10Imported=2
```

### `test-technical-dossier.ts`

Resultado: **PASA**.

Resumen:

```text
readiness=50
specifications=7
formwork=164
prices=7
findings=4
sections=6
```

### `test-serialization.ts`

Resultado: **PASA**.

Verificó:

- Identidad entre `wallToDTO(wall)` y `Muro.to_dict()`.
- Conversión JSON de un muro.
- Reconstrucción operativa de `Muro`.
- Preservación profunda de `metrado`.
- Igualdad profunda de `to_dict()` original y reconstruido.
- Recalculo de metrado.
- Serialización completa de `ConstructionModel`.
- Preservación de colecciones, relaciones, cronograma, resumen y gates.

Resumen observado:

```text
status=PASS
wallCount=16
```

### `test-wall-coherence.ts`

Resultado: **PASA**.

Verificó 16 muros y comprobó:

- Espesores positivos.
- Funciones válidas de capas.
- Aberturas dentro del muro.
- Tipos válidos de abertura.
- Áreas y volúmenes no negativos.
- Área neta coherente.
- Metrado en m² y m³ coherente.
- Peso por suma de capas.
- `metrado.peso_total_kg` coherente con `peso_total_kg()`.
- Coherencia después de DTO round-trip.

## 4. Correcciones no bloqueantes

### Advertencia de pnpm

El comando muestra:

```text
The "pnpm" field in package.json is no longer read by pnpm.
```

La compilación y las pruebas pasan. Debe migrarse posteriormente la configuración `pnpm.patchedDependencies` y `pnpm.overrides` a la ubicación moderna de pnpm.

### Cobertura de `pnpm check`

El `tsconfig.json` no incluye `scripts/` como entrada explícita. Por ese motivo, los tests se validaron directamente con `pnpm tsx`, que sí los ejecutó correctamente. En una entrega posterior conviene incorporar una configuración de tests o un script de typecheck que cubra `scripts/` sin alterar el build de la aplicación.

### Validación estructural de DTO

`wallToDTO()` usa un cast de TypeScript:

```ts
return wall.to_dict() as WallDTO;
```

La identidad está cubierta por `test-serialization.ts`, pero no existe validación de runtime. Esto queda aceptado como limitación de 1A y debe resolverse con ADR y validador en una entrega posterior.

## 5. Revisión de patrones prohibidos

No se encontraron `Math.random()`, `Date.now()` ni `any` en los archivos críticos nuevos de 1A.

No se encontraron archivos de fases posteriores:

```text
arkiPriceBook.ts
arkiRecalculation.ts
arkiMamparaFamily.ts
test-budget-reconciliation.ts
test-recalculation.ts
```

No se detectó duplicación de `FamilyParameter`.

## 6. Decisión

La Entrega 1A queda **aprobada con correcciones no bloqueantes**.

DeepSeek puede comenzar la Entrega 1B, respetando el alcance aprobado:

```text
PriceBook versionado
Extensión compatible de FormworkRequirement
Test de reconciliación presupuestal
```

No debe comenzar todavía `recalculateProject()`, la mampara paramétrica ni la UI BIM Workspace. La UI tipo Archicad pertenece a una orden posterior separada.

## 7. Condición para mantener la aprobación

La Entrega 1B no debe eliminar los cuatro archivos de 1A ni debilitar sus tests. Debe continuar pasando:

```text
pnpm check
pnpm build
pnpm tsx scripts/test-constructive.ts
pnpm tsx scripts/test-professional.ts
pnpm tsx scripts/test-technical-dossier.ts
pnpm tsx scripts/test-serialization.ts
pnpm tsx scripts/test-wall-coherence.ts
```
