# ARKI-CAD-001B — Licensing and Deployment Matrix

**Estado:** `DECISION SUPPORT / NO PURCHASE / IMPLEMENTATION BLOCKED`

## Matriz

| Candidato | Despliegue técnicamente plausible | Postura comercial observada | Decisión ARKI |
|---|---|---|---|
| ODA Drawings SDK | Linux, Windows y otros targets; cloud sólo mediante producto/licencia compatible | ODA publica que Web/SaaS requiere Sustaining o Founding; Commercial no debe asumirse suficiente | Negociar y confirmar por escrito antes de diseñar producción |
| RealDWG | Worker local Windows 64-bit | Licencia gestionada por Tech Soft 3D; derechos de servidor, SaaS, OEM y redistribución no confirmados | Sólo cross-check o worker Windows sujeto a contrato |
| LibreDWG | Worker Linux/Windows/macOS y batch | GPLv3-or-later; revisión legal de enlace, distribución y obligaciones | Sólo si la arquitectura corporativa acepta GPL y sus obligaciones |
| ODA File Converter | Herramienta local/CLI controlada | Descarga gratuita no equivale a permiso comercial de redistribución | No empaquetar ni ofrecer como servicio sin autorización escrita |

## Reglas de despliegue

Ningún candidato debe abrir archivos no confiables dentro del proceso principal de la aplicación. El futuro diseño debe separar la carga, el parsing y la conversión mediante un worker aislado. Debe conservarse el archivo original y su hash antes de cualquier transformación.

No se debe confundir **compatibilidad técnica** con **derecho de distribución**. La selección de ODA como candidato primario no constituye una compra ni una autorización legal. La elección de RealDWG tampoco se resuelve con la afirmación pública de “100% DWG read/write”; se requieren términos actuales del acuerdo correspondiente.

## Decisiones humanas pendientes

El Product Owner debe decidir si ARKI será local, servidor headless, multi-tenant o SaaS. También debe fijar la política de pérdida aceptable: round-trip estrictamente lossless, pérdida declarada con revisión humana o rechazo de entidades no soportadas.

Antes de cualquier código de producción se requiere revisión legal de licencias, propiedad intelectual de DWG, distribución de runtime, uso de afiliadas y subsidiarias, SaaS, OEM y tratamiento de archivos de clientes.

## Fuentes

[1] [ODA pricing and memberships](https://www.opendesign.com/pricing) [2] [ODA File Converter FAQ](https://www.opendesign.com/faq/question/what-are-oda-viewer-and-oda-file-converter) [3] [Autodesk RealDWG API](https://aps.autodesk.com/developer/overview/realdwg-api) [4] [LibreDWG COPYING](https://raw.githubusercontent.com/LibreDWG/libredwg/master/COPYING) [5] [GNU LibreDWG manual](https://www.gnu.org/software/libredwg/manual/LibreDWG.html)
