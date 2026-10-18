# ARKI — Acta de verificación de la Entrega 1B

**Fecha:** 22 de septiembre de 2026  
**Entrega:** 1B — PriceBook y trazabilidad de encofrados  
**Veredicto:** **APPROVE WITH FIXES**  
**Avance a 1C:** Desbloqueado con alcance controlado

## 1. Archivos integrados

Se integraron:

```text
shared/arkiPriceBook.ts
scripts/test-budget-reconciliation.ts
```

Se modificó de forma mínima:

```text
shared/arkiTechnicalDossier.ts
```

La modificación añade a `FormworkRequirement` los campos opcionales:

```text
modelVersion
 elementVersion
sourceSnapshotId
status
```

Los requerimientos generados reciben actualmente:

```text
modelVersion: 1
elementVersion: 1
sourceSnapshotId: "snapshot:initial"
status: "derived"
```

## 2. Alcance verificado

`APU_DATABASE` no fue reemplazada ni modificada. `fromApuDatabase()` la adapta a un `PriceBook` versionado.

`PriceBook` incluye schema, id, versión, fuente, región, país, moneda, vigencia e items.

`findPriceBookItem()` permite resolver una partida por código.

`isPriceBookValid()` realiza validación básica de campos obligatorios y valores no negativos.

`FormworkRequirement` mantiene compatibilidad hacia atrás porque los nuevos campos son opcionales.

No se implementó `recalculateProject()`, no se creó la mampara paramétrica y no se modificó la UI, el backend, los importadores ni operación y mantenimiento.

## 3. Evidencia de verificación

Los ocho comandos solicitados finalizaron correctamente.

| Verificación | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm build` | PASS |
| `test-constructive.ts` | PASS |
| `test-professional.ts` | PASS |
| `test-technical-dossier.ts` | PASS |
| `test-serialization.ts` | PASS |
| `test-wall-coherence.ts` | PASS |
| `test-budget-reconciliation.ts` | PASS |

### Reconciliación presupuestal

El test de 1B produjo:

```text
status=PASS
priceBookItems=5
partidasVerified=60
partidasSum=1270854.8
elementCostsSum=3402055.2
totalCalculated=4672910
modelBudget=4672910
formworkWithTraceability=164
```

La igualdad principal quedó verificada:

```text
totalCalculated == model.summary.totalBudgetPen
4672910 == 4672910
```

También quedaron verificadas la idempotencia de `fromApuDatabase()`, la coherencia de precios con APU y la trazabilidad de 164 requerimientos de encofrado.

## 4. Regresiones

Las pruebas de 1A continúan pasando:

- `test-serialization.ts`: PASS.
- `test-wall-coherence.ts`: PASS.

Las pruebas previas del modelo, módulos profesionales y expediente técnico también pasan.

## 5. Correcciones pendientes

### Versionado real de elementos

En el generador actual, los elementos utilizados para construir los requerimientos se proyectan a objetos con `id`, `type`, `area` y `volume`. Por eso `elementVersion` queda en `1` y no se obtiene todavía de una propiedad versionada real del elemento.

Esto es aceptable como valor inicial de 1B, pero debe corregirse antes de depender del versionado para recálculo, auditoría o control de cambios.

### Snapshot real

`sourceSnapshotId` usa temporalmente:

```text
snapshot:initial
```

Debe reemplazarse por el identificador real del snapshot cuando exista `recalculateProject()` en 1C.

### Validación del PriceBook

`isPriceBookValid()` todavía no valida duplicados, rangos de porcentajes, moneda, vigencia completa ni coherencia entre `directCost`, porcentajes y `unitPrice`.

### Reconciliación regional

El `PriceBook` y el dossier regional todavía mantienen catálogos separados. La unificación de fuentes regionales queda pendiente.

### Advertencias de tooling

`pnpm` informa que la sección `pnpm` de `package.json` ya no es la ubicación moderna para algunas configuraciones. El build pasa, pero la configuración debe migrarse posteriormente.

Vite también informa un chunk mayor a 500 kB. No bloquea la entrega, pero debe atenderse con code splitting antes de una publicación amplia.

## 6. Decisión

La Entrega 1B queda **aprobada con correcciones no bloqueantes**.

El avance a 1C queda desbloqueado únicamente para implementar:

```text
recalculateProject()
reconciliación completa del snapshot
mampara paramétrica
cadena ancho/alto → geometría → materiales → metrado → partida → presupuesto → 4D → IFC → Markdown
```

La UI BIM Workspace sigue fuera de 1C y debe permanecer como orden separada.

## 7. Condiciones para 1C

1. No romper las ocho verificaciones actuales.
2. Crear `test-recalculation.ts`.
3. No usar `Math.random()`, `Date.now()` ni `any` nuevos en los archivos críticos.
4. Reemplazar `snapshot:initial` por un snapshot real o documentar una decisión explícita si el contrato de 1C lo permite.
5. Demostrar que un cambio de ancho o alto modifica la cadena completa de resultados.
6. No declarar terminado el flujo IFC o Markdown sin output verificable.
7. Entregar diff, outputs completos y limitaciones.
