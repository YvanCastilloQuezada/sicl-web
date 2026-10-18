# ARKI — Contrato de extensiones `ARKI-EXTENSION-1.0`

Una extensión ARKI es un paquete versionado que declara qué comandos entiende, qué entradas acepta, qué resultados produce y qué permisos necesita. El manifiesto no ejecuta código ni convierte automáticamente una extensión en autoridad del sistema.

## Campos mínimos

```json
{
  "contractVersion": "ARKI-EXTENSION-1.0",
  "id": "mi-extension",
  "name": "Mi extensión ARKI",
  "version": "0.1.0",
  "commands": ["/PROJECT SHOW"],
  "inputSchema": [],
  "capabilities": ["PREVIEW", "VALIDATE", "EXPORT"],
  "humanReviewRequired": true,
  "noArbitraryCode": true,
  "hostAdapters": [],
  "provenance": "user-authored"
}
```

## Reglas de seguridad

La extensión debe declarar provenance, límites, dependencias y compatibilidad. No puede activar código arbitrario desde el manifiesto, saltarse `protectedProcedure`, escribir decisiones sin aprobación humana ni promover UNKNOWN a FACT. Si necesita Dynamo/Revit, Rhino/Grasshopper, Blender, CAD, BIM, GIS o simulación, debe declarar el host y quedar en `PENDING_EXTERNAL` hasta disponer de un worker HTTPS autorizado.

## Ciclo de activación

El ciclo previsto es **manifest → schema validation → sandbox review → fixture tests → security review → human approval → versioned activation → regression monitoring**. Un manifiesto exportado desde la Escuela Operativa sólo cubre el primer paso y sirve como punto de partida para el desarrollo de un plugin o adapter propio.
