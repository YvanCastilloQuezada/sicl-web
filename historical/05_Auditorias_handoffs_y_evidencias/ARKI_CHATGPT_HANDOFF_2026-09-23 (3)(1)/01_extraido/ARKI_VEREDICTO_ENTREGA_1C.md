# ARKI — Acta de verificación de la Entrega 1C

**Fecha:** 22 de septiembre de 2026  
**Entrega:** 1C — Mampara paramétrica, recálculo y snapshots  
**Veredicto:** **APPROVE WITH FIXES**  
**UI BIM:** permanece como orden separada

## 1. Archivos integrados

```text
shared/arkiMamparaFamily.ts
shared/arkiRecalculation.ts
shared/arkiSnapshotExports.ts
scripts/test-recalculation.ts
```

No se modificó `exportConstructionIfc()` ni `arkiConstructionOntology.ts`. La integración IFC se realiza mediante postprocesado controlado del string IFC base, según la opción A aprobada.

## 2. Resultados de verificación

Los nueve comandos solicitados pasan:

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
| `test-recalculation.ts` | PASS |

El test de 1C también produjo:

```text
determinism=PASS
IFC changed=true
Markdown changed=true
```

Durante la primera compilación se detectó una iteración de `Map` incompatible con el target TypeScript configurado. Se corrigió usando `Array.from(byParam.entries())` sin cambiar el contrato funcional. La verificación final posterior a la corrección volvió a pasar completa.

## 3. Capacidades verificadas

La familia de mampara incluye parámetros para ancho, alto, espesor de vidrio, tipo de perfil y número de hojas.

La creación de instancias valida los límites de fabricación y elimina el typo `espesor_vidio_mm`.

Se verificó `CONSTRAINT_VIOLATION` para ancho y alto fuera de rango.

La geometría derivada incluye ancho, alto, profundidad, área de vidrio, número de paneles, posición, rotación y host.

El cambio de ancho modificó:

```text
área de vidrio
longitud de perfiles
peso
partida AL-01
partida AL-02
costo total
duración
geometría
presupuesto global
cronograma 4D
IFC
Markdown
```

El cambio de alto también modificó área, costo, geometría, IFC y Markdown.

`update-formwork` y `update-specification` lanzan `UNSUPPORTED_CHANGE` explícito.

El snapshot conserva `invalidations` y `provenance`.

El presupuesto global se calcula como:

```text
base del ConstructionModel + costo total de mamparas
```

## 4. IFC

`exportSnapshotToIfc()` reutiliza el exportador IFC existente y añade entidades de las `FamilyInstance` antes del marcador final.

La exportación incluye:

```text
IFCBUILDINGELEMENTPROXY
IFCPROPERTYSET
IFCMATERIAL
IFCRELDEFINESBYPROPERTIES
IFCRELCONTAINEDINSPATIALSTRUCTURE
```

El test demostró que los contenidos IFC inicial y recalculado son diferentes:

```text
length0=246753
length1=246752
length2=246752
changed=true
```

## 5. Markdown

`exportSnapshotToMarkdown()` genera un expediente resumido del snapshot con:

- ID y versión.
- Versión fuente.
- PriceBook.
- Presupuesto base, mamparas y total.
- Instancias y parámetros.
- Metrados.
- Partidas.
- Duración.
- Geometría.
- Invalidaciones.
- Provenance.
- Estado del modelo.

El test verificó que el Markdown cambia al cambiar ancho y alto.

## 6. Correcciones no bloqueantes

### Validación IFC

La exportación de mamparas se realiza mediante postprocesado de texto. El test comprueba entidades, contenido y diferencia entre snapshots, pero todavía no ejecuta un parser IFC externo para validar toda la sintaxis STEP/IFC.

Debe incorporarse un validador IFC o una prueba sintáctica más estricta antes de declarar el intercambio IFC como producción.

### Relación espacial IFC

La relación `IFCRELCONTAINEDINSPATIALSTRUCTURE` de la extensión debe revisarse contra el esquema IFC4X3 formal. En esta fase se utiliza una representación conceptual compatible con el exportador existente.

### Geometría del muro anfitrión

La mampara tiene geometría propia y `hostId`, pero no modifica `Muro.aberturas`. La integración física como abertura queda para una fase posterior.

### Visor 2D/3D

La geometría está disponible en el snapshot, IFC y Markdown. Todavía no se dibuja dentro de `ProfessionalFamilyViewer.tsx`; eso pertenece a la orden UI BIM.

### Snapshot y catálogo

El snapshot inicial utiliza `sourceSnapshotId` recibido por la instancia y `generatedAt` determinista. El hash es FNV-1a, suficiente para determinismo básico, pero no es un hash criptográfico.

## 7. Decisión

La Entrega 1C queda **aprobada con correcciones no bloqueantes**.

Se considera cumplida la cadena contractual de demostración:

```text
ancho/alto
→ geometría derivada
→ materiales
→ metrado
→ partidas
→ presupuesto global
→ duración
→ 4D
→ IFC extendido
→ Markdown
→ invalidations
→ provenance
```

## 8. Estado del roadmap

```text
1A: APPROVE WITH FIXES
1B: APPROVE WITH FIXES
1C: APPROVE WITH FIXES
UI BIM Workspace: siguiente orden separada
```

La siguiente orden puede iniciar el diseño e implementación del **BIM Workspace minimalista**, con shell persistente, Navigator, Toolbox, Canvas, Info Box, tab bar, toolbar contextual, barra de estado, atajos y fondo `#080736`.
