# ARKI — Roadmap Corporativo v1.0

**Estado:** Aprobado como documento estratégico  
**Base verificada:** UI-2 v1.7, checkpoint `c62183a5`  
**Fecha:** 23 de septiembre de 2026

## Propósito

Este roadmap consolida los siete addenda corporativos de ARKI, sus dependencias y el orden recomendado de apertura. Es un documento estratégico. No autoriza por sí mismo la escritura de código; cada fase requiere contrato, ADR, implementación acotada y evidencia verificable.

## Estado actual

El núcleo paramétrico, el modelo constructivo, costos, recálculo, exportaciones conceptuales y expediente local están implementados en distintos grados. UI-1 con i18n de ocho idiomas y UI-2 v1.7 están aprobadas. UI-3A está aprobada como contrato y pendiente de revisión contra el código real.

Luka permanece como **FUTURE REFERENCE / NOT IMPLEMENTED**. No se detectan módulos verificables de visión, OCR, realidad aumentada, voz o cámara. Tampoco existen todavía backend persistente, canvas BIM semántico interactivo, PDF técnico definitivo, conectores nativos RFA/RVT, BCF/COBie ni O&M operativo.

## Addenda A–G

| Addendum | Alcance | Dependencia principal | Estado |
|---|---|---|---|
| A | Expediente técnico dual público/privado | UI-6 | Registrado |
| B | Campo móvil, captura geolocalizada e incidencias | UI-4 + backend | Registrado |
| C | Reemplazo S-10: APU, valorizaciones y reajustes | UI-5 | Registrado |
| D | Reemplazo Revit: RFA/RVT, familias y planificación | UI-6 | Registrado |
| E | COD, captura Luka y preparación de asientos | UI-4 + backend + canal OECE | Registrado |
| F | Middleware de coordinación entre actores | UI-5 + backend | Registrado |
| G | JPRD, riesgos, consultas, respuestas y evidencias | E + F + backend | Registrado |

## Dependencias y fases

UI-3 implementa canvas y selección. UI-4 incorpora familias paramétricas y backend básico. UI-5 desarrolla costos, 4D y valorizaciones. UI-6 construye expediente real, PDF y planos. UI-7 aborda activos y operación/mantenimiento.

El backend persistente es el cuello de botella para campo móvil, COD, S-10 operativo y middleware. El Addendum G es posterior porque requiere trazabilidad, COD y coordinación. Addenda A y D dependen principalmente del expediente real. El Addendum C puede evolucionar después de UI-5.

## Orden de apertura

1. UI-3A a UI-3D, en bloques verificables.
2. UI-4 y backend básico.
3. Addenda B y E en captura y preparación manual.
4. UI-5, Addenda C y F.
5. UI-6, Addenda A y D, y fase oficial de E si existe autorización del OECE.
6. Addendum G con backend, E y F aprobados.
7. UI-7 y operación/mantenimiento.

## Reglas de gobierno

Ningún addendum se mezcla con UI-2 ni con otro bloque UI sin contrato propio. Ningún estado se promueve sin código, test y output real. Luka no cuenta como dependencia hasta que exista código verificable. Toda integración estatal requiere canal oficial y autorización; no se permite scraping no autorizado.

## Referencias relacionadas

Los documentos de detalle se mantienen separados: Addenda A–G, contrato UI-3A, ADRs de cada fase y actas de verificación. Este roadmap se revisará después de cada cierre de UI.
