# ARKI-CAD-001B — Forensic and Adapter Decision

**Estado máximo:** `COMPLETE_FOR_FORENSIC_SELECTION / IMPLEMENTATION_BLOCKED`

## Conclusión ejecutiva

La investigación comparativa confirma que **ODA Drawings SDK** es el candidato primario para una futura ingestión DWG/DXF de ARKI. Ofrece lectura, creación, edición y guardado, acceso a datos DWG y plataformas amplias. Su elección todavía depende de fijar una release concreta, cerrar la licencia de distribución y demostrar el comportamiento real con el corpus ABB-001.

**Autodesk RealDWG** queda como referencia independiente de compatibilidad AutoCAD en un worker Windows 64-bit. **GNU LibreDWG** queda como fallback controlado para lectura, conversión y diagnóstico, pero no como escritor único de DWG moderno. **ODA File Converter** queda limitado a herramienta externa de conversión y diagnóstico; no es un SDK embebible.

No se autoriza instalación, compra, integración ni benchmark productivo en esta orden. `CAD_GEOMETRY_READY` permanece en `NO`.

## Decisión de arquitectura

El adaptador CAD debe terminar en **ACIR**, la representación intermedia trazable ya definida. ACIR es derivada y no canónica. El lector CAD no puede convertirse en propietario de BIM, geometría semántica, relaciones, cantidades, costos o estado del proyecto.

La frontera obligatoria es:

```text
DWG/DXF no confiable
        ↓
worker aislado + límites de recursos
        ↓
adaptador CAD
        ↓
ACIR con provenance y estado epistémico
        ↓
revisión/promoción humana
        ↓
BIM semántico, sólo cuando exista evidencia suficiente
```

Una línea no se convierte automáticamente en muro. Un bloque no se convierte automáticamente en puerta. Una polilínea no se convierte automáticamente en espacio.

## Hallazgos por candidato

| Candidato | Rol | Decisión actual | Riesgo principal |
|---|---|---|---|
| ODA Drawings SDK | SDK primario | `PRIMARY / CONDITIONAL` | Release, licencia SaaS, entidades verticales y determinismo todavía no demostrados |
| Autodesk RealDWG | Cross-check | `CROSS-CHECK / CONDITIONAL` | Windows 64-bit, contrato Tech Soft 3D/Autodesk y server/cloud no cerrados |
| GNU LibreDWG | Fallback | `FALLBACK / CONDITIONAL` | GPLv3+, escritura moderna incompleta, CRC y clases omitidas |
| ODA File Converter | Diagnóstico | `DIAGNOSTIC ONLY` | No es SDK; redistribución comercial y cobertura por entidad no demostradas |

## Riesgos que bloquean la implementación

No existe todavía una matriz exhaustiva y versionada de entidades DWG/DXF, proxies, objetos custom y objetos verticales. Tampoco existe evidencia experimental de round-trip semántico, equivalencia geométrica, estabilidad de handles, determinismo byte a byte, concurrencia segura o límites de recursos.

La seguridad debe tratarse como requisito de primer orden. ODA publica avisos históricos de vulnerabilidades de parsing. La futura ejecución deberá usar una release parcheada, un proceso aislado, límites de CPU/memoria, timeouts, preservación del original y pruebas con archivos corruptos y adversariales.

## Criterio para desbloquear ABB-001

ABB-001 sólo podrá avanzar cuando exista un corpus congelado y versionado con arquitectura, estructura, sanitarias, eléctricas, bloques, cotas, textos, layouts, unidades, referencias externas, archivos grandes y archivos dañados. Debe compararse la salida del lector primario con una referencia independiente cuando el entorno lo permita.

El resultado requerido no es únicamente “abre el DWG”. Debe demostrar trazabilidad a archivo, hash, handle o identificador fuente, capa, layout, transformación, geometría recuperada, propiedades, pérdida declarada y estado epistémico.

## Fuentes

[1] [ODA Drawings SDK](https://www.opendesign.com/products/drawings) [2] [ODA supported platforms](https://www.opendesign.com/supported-platforms/drawings) [3] [ODA pricing and memberships](https://www.opendesign.com/pricing) [4] [ODA Drawings inWEB](https://www.opendesign.com/blog/2024/october/drawings-inweb-sdk-oda) [5] [Autodesk RealDWG API](https://aps.autodesk.com/developer/overview/realdwg-api) [6] [GNU LibreDWG](https://www.gnu.org/software/libredwg/) [7] [LibreDWG manual](https://www.gnu.org/software/libredwg/manual/LibreDWG.html) [8] [ODA File Converter](https://www.opendesign.com/guestfiles/oda_file_converter) [9] [ODA File Converter FAQ](https://www.opendesign.com/faq/question/what-are-oda-viewer-and-oda-file-converter) [10] [ODA security advisories](https://www.opendesign.com/security-advisories)
