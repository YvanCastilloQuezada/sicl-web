# E6 — Aprobación del Product Owner

**Fecha:** 23 de septiembre de 2026  
**Estado:** AUTORIZADO PARA EJECUCIÓN

El Product Owner declara:

> Acepto las recomendaciones E6-D1 a E6-D7 y autorizo la ejecución de los pasos 2–9 del Contrato E6 v1.0.

## Decisiones vinculantes

| ID | Decisión | Resolución |
|---|---|---|
| E6-D1 | web-ifc / WASM | Autorizado |
| E6-D2 | Pérdida round-trip | Menor de 5% en entidades; 0% de pérdida para identidad existente |
| E6-D3 | Snapshots por versión | Un snapshot por versión |
| E6-D4 | Cifrado | Fuera de E6 |
| E6-D5 | Firma | Hash de validación; no firma profesional |
| E6-D6 | DXF | Fuera de E6; se difiere a E8 |
| E6-D7 | Fixtures IFC | Menores de 5 MB |
| E6-D8 | E5 durante E6 | Mantener E5-PREVIEW / IMPLEMENTATION FREEZE sin nuevas features |
| E6-D9 | GlobalId | Hash determinista gobernado |

## Estados de fases

- **E5:** E5-PREVIEW / IMPLEMENTATION FREEZE — DEFER, no VERIFIED.
- **E6:** OPEN — ejecución autorizada.
- **E7:** BLOQUEADO hasta el cierre formal de E6.

La autorización no convierte E5 en VERIFIED ni elimina su deuda heredada.

## Regla de cierre

E6 sólo podrá declararse VERIFIED con pruebas, outputs, fixtures, capturas, manifest, reportes, veredicto técnico de DeepSeek y aprobación final del Product Owner.
