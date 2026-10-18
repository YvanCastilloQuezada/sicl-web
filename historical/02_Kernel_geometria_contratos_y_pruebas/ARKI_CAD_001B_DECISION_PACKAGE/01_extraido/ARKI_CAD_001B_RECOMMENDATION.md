# ARKI-CAD-001B — Selection Recommendation

**Veredicto:** `MORE_EVIDENCE_REQUIRED`

## Recomendación

Adoptar **ODA Drawings SDK como candidato primario condicionado**. Utilizar **RealDWG como cross-check** cuando exista un worker Windows 64-bit y un acuerdo comercial autorizado. Mantener **LibreDWG como fallback controlado de lectura/conversión**, no como escritor único moderno. Mantener **ODA File Converter como herramienta externa de diagnóstico y batch**.

Esta recomendación no autoriza compra, instalación, integración, implementación ni la apertura de ABB-001-F2.

## Por qué esta es la mejor estrategia

ODA ofrece la mejor combinación aparente de cobertura DWG/DXF, edición, guardado y plataformas. Sin embargo, los puntos decisivos para ARKI todavía no están demostrados: entidades verticales, proxies, round-trip semántico, determinismo, server/headless, concurrencia y contrato SaaS.

RealDWG aporta un contraste útil frente al ecosistema AutoCAD, pero su dependencia de Windows 64-bit y sus términos contractuales lo hacen inadecuado como base multiplataforma sin una decisión específica.

LibreDWG es valioso para una estrategia abierta y controlable, pero sus limitaciones de escritura moderna, CRC, clases omitidas y GPLv3+ impiden tratarlo como solución única.

## Decisiones necesarias del Product Owner

1. Definir el despliegue objetivo: local, worker server, multi-tenant o SaaS.
2. Definir si la fidelidad exigida es lossless, loss-declared o reject-on-unsupported.
3. Autorizar o no una estrategia dual ODA + RealDWG.
4. Autorizar revisión legal y consultas contractuales a los proveedores.
5. Aprobar el corpus y los criterios de `CAD_GEOMETRY_READY=YES`.

## Estado final de la orden

`ARKI-CAD-001B` queda cerrada en alcance documental. `IMPLEMENTATION_READY=NO`. `ACIR_IMPLEMENTED=NO/UNVERIFIED`. `CAD_GEOMETRY_READY=NO`. `ABB-001` permanece bloqueado para reconstrucción BIM ciega.

## Fuentes

[1] [ODA Drawings SDK](https://www.opendesign.com/products/drawings) [2] [ODA pricing and memberships](https://www.opendesign.com/pricing) [3] [ODA supported platforms](https://www.opendesign.com/supported-platforms/drawings) [4] [Autodesk RealDWG API](https://aps.autodesk.com/developer/overview/realdwg-api) [5] [GNU LibreDWG](https://www.gnu.org/software/libredwg/) [6] [ODA File Converter](https://www.opendesign.com/guestfiles/oda_file_converter)
