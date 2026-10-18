# ARKI-CAD-001A — CAD Ingestion Forensic & Adapter Selection

**Estado:** `FORENSIC + SELECTION ONLY`  
**Origen:** ABB-001-F1C-D01 — `DWG_READER_MISSING`

## Conclusión ejecutiva

La evidencia disponible permite descartar a **ODA File Converter** como infraestructura comercial y permite descartar a **LibreDWG** como adaptador primario para round-trip moderno R2018 sin una revisión jurídica y técnica adicional. **RealDWG** ofrece la fidelidad nativa más cercana al ecosistema Autodesk, pero sus requisitos actuales son Windows 64-bit y el proveedor publica restricciones relevantes para alojarlo como servidor. **ODA Drawings SDK** es el candidato técnicamente más compatible con la arquitectura corporativa de ARKI porque ofrece acceso nativo DWG/DXF, plataformas Linux/Windows y rutas desktop/cloud; sin embargo, la licencia Web/SaaS y las extensiones especializadas deben confirmarse contractualmente.

## Veredicto permitido

**`MORE_EVIDENCE_REQUIRED`**

La recomendación técnica provisional es **ODA Drawings SDK como candidato primario para benchmark**, con **LibreDWG como baseline abierto de lectura/seguridad** y una posible **validación oracle RealDWG** si se obtiene un entorno/licencia Windows autorizado. No se autoriza todavía implementación, compra ni integración.

## Reglas de arquitectura

El adaptador termina en ACIR. No será dueño de BIM, Geometry, Project State, relaciones semánticas ni interpretación arquitectónica. ACIR deberá representar lo que el CAD contiene, con provenance y estado epistémico, sin convertir automáticamente línea en muro, bloque en puerta o polilínea en habitación.

## Fuentes oficiales consultadas

[ODA Drawings SDK][1], [ODA pricing/membership][2], [ODA File Converter FAQ][3], [Autodesk RealDWG API][4], [Tech Soft 3D RealDWG][5], [GNU LibreDWG manual][6], [LibreDWG repository][7].

[1]: https://www.opendesign.com/products/drawings  
[2]: https://www.opendesign.com/pricing  
[3]: https://www.opendesign.com/faq/question/what-are-oda-viewer-and-oda-file-converter  
[4]: https://aps.autodesk.com/developer/overview/realdwg-api  
[5]: https://www.techsoft3d.com/oem/realdwg/  
[6]: https://www.gnu.org/software/libredwg/manual/LibreDWG.pdf  
[7]: https://github.com/LibreDWG/libredwg

## Prohibiciones respetadas

No se compró licencia, no se ejecutó un adaptador sobre ABB-001, no se generó BIM ni 3D, no se modificó ABB-001, no se abrió F2 y no se modificó BKH.
