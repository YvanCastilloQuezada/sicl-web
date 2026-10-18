# ARKI — Addendum de verificación para DeepSeek

## Resultado

La respuesta de DeepSeek es técnicamente correcta y debe incorporarse al handoff. Sus hallazgos no contradicen la auditoría; la hacen más precisa.

## Hallazgos aceptados

### P1 — Duplicación semántica de elementos

`StructuralElement.kind` incluye `door`, `window`, `stair`, `floor`, `roof` y `partition`, mientras `ConstructionModel` mantiene arreglos separados para esas categorías. Hoy esos arreglos se generan como colecciones específicas sobre el mismo dominio, pero no existe una política formal de fuente de verdad.

Decisión: mantener por ahora los arrays específicos para consultas de UI y exportación, pero establecer una colección canónica de instancias en la siguiente refactorización. Los arrays específicos deben ser vistas derivadas o índices, no copias mutables.

### P1 — APU global

`APU_DATABASE` es una constante global de cinco partidas referenciales. `ConstructionModel.apuDatabase` la expone, pero no la versiona por proyecto, fecha, región o fuente.

Decisión: no reutilizarla como presupuesto contractual. La siguiente entidad debe ser `PriceBook` o `ApuCatalog` versionado, con `source`, `region`, `currency`, `validFrom` y `projectId` opcional.

### P1 — Encofrado sin versiones

`generateFormworkRequirements()` genera los requerimientos desde el modelo, pero `FormworkRequirement` no contiene `elementVersion`, `modelVersion` ni `sourceSnapshotId`.

Decisión: añadir esos campos antes de implementar edición persistente. Un requerimiento editado debe poder marcarse como `derived`, `overridden` o `stale`.

### P2 — `Muro` como clase

`ConstructionModel.walls` contiene instancias de la clase `Muro`, no DTOs planos. `to_dict()` existe, pero no hay serializador global del modelo.

Decisión: mantener la clase para cálculos del motor y crear DTOs serializables para persistencia. No guardar instancias de clase directamente en `localStorage`, JSON o base de datos.

### P2 — Módulos profesionales acoplados

`arkiProfessionalModules.ts` agrupa 5D, simulación, clashes, aprobación, CDE e importación S10. Esto es válido para el prototipo, pero debe separarse por dominio cuando se implemente persistencia.

Decisión: no dividirlo todavía solo por estética. Dividirlo al crear servicios de aplicación y contratos persistentes para evitar una refactorización sin pruebas.

### P2 — Dos rutas IFC

`arkiFamilyComparison.ts` usa `exportConstructionIfc()` cuando hay modelo constructivo y conserva una ruta manual para propuestas sin modelo. Ambas deben converger en un único adaptador de exportación.

Decisión: conservar compatibilidad con propuestas antiguas, pero agregar una función de normalización previa y una prueba de equivalencia para que no existan dos semánticas IFC divergentes.

### P2 — Tests de humo

Los tests actuales verifican conteos, existencia de tokens y resultados positivos. No verifican suficientemente geometría, capas, aberturas, sumas presupuestales, serialización o errores.

Decisión: añadir primero tres pruebas de contrato:

1. `test-wall-coherence.ts`: capas, aberturas dentro del muro, áreas no negativas y metrado coherente.
2. `test-budget-reconciliation.ts`: suma de partidas, APU y total del modelo.
3. `test-serialization.ts`: conversión completa `ConstructionModel → DTO → JSON → DTO` sin pérdida de campos críticos.

## Verificación solicitada por DeepSeek

### `server/index.ts`

El archivo fue revisado. Solo crea un servidor Express para servir archivos estáticos y resolver rutas del frontend. No tiene endpoints de negocio, autenticación, base de datos, almacenamiento de documentos ni persistencia de proyectos.

Por tanto, la afirmación correcta es:

> No existe backend de negocio persistente. Existe un servidor estático de entrega, más el servidor de desarrollo de Vite.

### `client/src/`

`Home.tsx` confirma que el frontend consume el motor local y usa `localStorage` para versiones. El editor de expediente es local. `ProfessionalFamilyViewer.tsx` genera SVG conceptual a partir de `GeneratedBuilding`; no es un modelador 3D paramétrico real.

### Configuración

`vite.config.ts` configura Vite, Tailwind, React, runtime de Manus, logs de depuración y proxy de almacenamiento. `tsconfig.node.json` compila la configuración de Vite. `template.json` describe el template como estático. Ninguno implementa persistencia BIM de negocio.

## Resolución de las tres decisiones abiertas

### ¿`ArkiParametricFamily` reemplaza a `DynamicBuildingFamily`?

No. Debe complementar y convivir con ella.

- `DynamicBuildingFamily` representa una familia de edificio y su programa arquitectónico.
- `ArkiParametricFamily` representa una familia de componente reutilizable: ventana, mampara, puerta, perfil metálico, mueble, equipo o activo.
- Una `DynamicBuildingFamily` puede usar muchas `ArkiParametricFamily`.

### ¿`FamilyInstance` es un `StructuralElement`?

No como regla general. `FamilyInstance` debe ser una entidad nueva para componentes paramétricos cargables. Puede tener una relación opcional con `StructuralElement` cuando el componente sea estructural, pero no debe forzar muebles, computadoras, vidrios o equipos a ser elementos estructurales.

Relación recomendada:

```ts
FamilyInstance {
  familyId: string;
  typeId: string;
  hostId?: string;
  elementRole: "architectural" | "structural" | "mep" | "furniture" | "equipment" | "asset";
}
```

### ¿`ProjectSnapshot` guarda `Muro` como clase o DTO?

Debe guardar DTOs serializables. `Muro` puede seguir existiendo como clase de dominio para cálculos y validaciones. La conversión debe ser explícita:

```text
Muro de dominio → WallDTO → JSON / localStorage / base de datos
JSON / base de datos → WallDTO → Muro de dominio
```

## Primera tarea corregida

Antes de implementar importadores complejos, DeepSeek debe hacer una refactorización controlada y pequeña:

1. Crear `FamilyDefinition`/`ArkiParametricFamily` y `FamilyInstance` sin tocar el contrato de familia de edificio.
2. Crear DTOs serializables para `Muro` y `ConstructionModel`.
3. Versionar APU y encofrado mediante `modelVersion` y `sourceSnapshotId`.
4. Implementar `recalculateProject()` con una ventana o mampara simple.
5. Añadir los tres tests de contrato.

La importación RFA/RVT/IFC/CAD debe comenzar después de que esta base esté estable.

## Respuesta a la pregunta de si falta algo

Para cerrar el handoff técnico ya no falta información crítica. DeepSeek recibió los archivos centrales de dominio y ahora debe recibir este addendum más los archivos de servidor y UI incluidos en el paquete complementario.

Los únicos insumos que serán necesarios más adelante son archivos reales de prueba: una familia `.rfa`, un `.ifc`, un `.dwg` o `.dxf`, un sólido `.obj`/`.glb`/`.step` y un catálogo de fabricante.

## Referencias

[1]: /home/ubuntu/upload/pasted_content_13.txt "Respuesta y hallazgos técnicos de DeepSeek"
[2]: manus-webdev://6e4624b6 "Checkpoint ejecutable canónico de ARKI"
