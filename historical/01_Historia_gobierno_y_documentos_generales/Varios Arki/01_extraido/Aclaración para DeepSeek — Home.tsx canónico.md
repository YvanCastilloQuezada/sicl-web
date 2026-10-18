# Aclaración para DeepSeek — Home.tsx canónico

El `Home.tsx` que recibiste como placeholder no corresponde al estado canónico de ARKI. Es una copia del template inicial de WebDev y no debe usarse para evaluar la integración.

El archivo canónico actual es:

```text
client/src/pages/Home.tsx
```

En este archivo real se importan y consumen:

```ts
import { DYNAMIC_BUILDING_FAMILIES, generateDynamicBuilding } from "@shared/arkiDynamicFamilies";
import { compareDynamicBuildings, exportDynamicBuilding } from "@shared/arkiFamilyComparison";
import { exportConstructionIfc } from "@shared/arkiConstructionOntology";
import { importS10Csv, professionalSummary } from "@shared/arkiProfessionalModules";
import { generateTechnicalDossier, technicalDossierMarkdown } from "@shared/arkiTechnicalDossier";
```

También contiene:

- Estado local de `GeneratedBuilding`.
- Generación de propuestas.
- Guardado y restauración de versiones.
- Comparación de versiones.
- Exportación IFC, JSON, GEOJSON, SVG, CSV y HTML.
- Importación CSV S10.
- Panel de modelo constructivo.
- Panel de 4D, 5D, clashes, aprobación y CDE.
- Workspace de expediente técnico.
- Editor local de especificaciones.
- Editor parcial de encofrados.
- Guardado de borrador en `localStorage`.
- Descarga Markdown del dossier.

El visor `client/src/components/ProfessionalFamilyViewer.tsx` también es el visor canónico actual y genera las vistas conceptuales de planta, corte y masa 3D a partir de `GeneratedBuilding`.

La conclusión corregida es:

> La UI ARKI sí consume el dominio en el checkpoint canónico. El placeholder recibido por DeepSeek fue un archivo equivocado o una copia del template y no debe considerarse evidencia del estado actual.

El servidor sigue siendo únicamente entrega estática con proxy de storage de Manus. No existe backend de negocio persistente propio.
