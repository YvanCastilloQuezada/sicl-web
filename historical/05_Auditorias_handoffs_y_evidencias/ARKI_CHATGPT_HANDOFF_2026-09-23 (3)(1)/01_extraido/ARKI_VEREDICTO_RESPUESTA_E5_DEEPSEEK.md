# ARKI — Veredicto sobre la respuesta de DeepSeek al reporte E5

**Fecha:** 23 de septiembre de 2026  
**Objeto:** Revisar `pasted_content_67.txt` frente al estado real del repositorio y la autorización conversacional.

## Veredicto

> **ACCEPTACIÓN TÉCNICA CONDICIONADA — CLASIFICACIÓN PROVISIONAL: E5-PREVIEW / EXPLORATORY — NO E5 VERIFIED.**

El informe de DeepSeek acierta en que el trabajo presentado no cumple todos los criterios de una entrega E5 completa. Sin embargo, su rechazo procesal absoluto contiene una discrepancia: en la conversación del Product Owner quedaron expresamente registradas las aprobaciones de Fase 0, E1, E2, E3, E4 y la autorización de E5. Los documentos Markdown del expediente no reflejan de forma suficiente esas aprobaciones, por lo que existe un **defecto documental de gobernanza**, no evidencia suficiente para afirmar que la ejecución carecía de autorización conversacional.

La clasificación correcta es:

- **Autorización conversacional:** registrada en el historial de decisiones.
- **Registro documental de autorización:** incompleto o desactualizado.
- **Mérito técnico:** real y verificable en el alcance implementado.
- **Cierre formal E5:** no concedido.
- **E5 Verified:** no concedido.
- **E5-PREVIEW / Exploratory:** clasificación recomendada hasta completar el contrato.

## Qué acepta este veredicto

DeepSeek identifica correctamente brechas que ya estaban declaradas en el informe técnico de E5:

| Criterio E5 | Estado real |
|---|---|
| Visor Three.js / R3F | Implementado y verificado |
| SceneModel determinista | Implementado y verificado |
| Muros, puertas, ventanas, estructura y espacios | Implementado y probado |
| Capas y filtro por nivel | Implementado |
| Selección sincronizada con Info Box | Implementado |
| Comparación en memoria contra referencia | Implementado |
| Comparación lado a lado persistente | Pendiente |
| IndexedDB y snapshots aprobados | Pendiente |
| Secciones dinámicas / clipping | Pendiente |
| Medición y snapping | Pendiente |
| Viewpoints guardados | Pendiente |
| Cámara ortográfica y vistas técnicas completas | Pendiente |
| Comparación 2D sincronizada | Pendiente |
| Round-trip IFC productivo | Pendiente |
| Evidencia visual WebGL con hash | Pendiente |
| ADRs previos específicos de E5 | Pendiente de consolidación documental |

Por tanto, no corresponde declarar que E5 está completo.

## Qué corrige este veredicto

### 1. La premisa procesal de DeepSeek es incompleta

La conversación registra las siguientes autorizaciones explícitas del Product Owner:

- Cierre de Fase 0 y autorización de E1.
- Aprobación de E1 y autorización de E2.
- Aprobación de E2 y autorización de E3.
- Aprobación de E3 y autorización de E4.
- Aprobación de E4 y autorización de E5.

No obstante, el expediente Markdown contiene documentos que todavía dicen “pendiente firma PO”. Esa inconsistencia debe corregirse porque el sistema de evidencia no puede depender únicamente del historial conversacional.

### 2. La dependencia Three.js no es una violación técnica automática

La decisión P0 registrada autorizó Three.js/R3F para el visor 3D. La incorporación de:

- `three`
- `@react-three/fiber`
- `@react-three/drei`

está técnicamente alineada con esa decisión. Lo que falta es consolidar un ADR específico de dependencia, versiones, fallback y límites de uso.

### 3. No corresponde revertir de inmediato

La reversión destruiría trabajo real, probado y reutilizable. La opción prudente es conservarlo, congelarlo como `E5-PREVIEW / EXPLORATORY` y someterlo a un contrato E5 formal cuando el gobierno documental esté actualizado.

## Decisión recomendada

Se adopta una combinación controlada de las opciones **B + C** de DeepSeek:

1. Conservar el código actual.
2. Clasificarlo como `E5-PREVIEW / EXPLORATORY`.
3. No declararlo E5 cerrado ni `VERIFIED`.
4. Corregir el expediente documental de autorizaciones.
5. Congelar el alcance actual antes de continuar.
6. Crear un contrato E5 revisado con criterios faltantes.
7. No abrir E6 ni agregar nuevas capacidades de producto sobre esta base hasta que el contrato E5 revisado esté aprobado.

## Criterios para abrir la continuación de E5

La continuación debe cubrir, como mínimo:

- ADR de Three.js/R3F/Drei.
- Captura WebGL con hash SHA-256.
- Persistencia local de snapshots mediante IndexedDB.
- Gate de aprobación de snapshots.
- Comparación lado a lado de dos escenas.
- Comparación 2D/3D sincronizada.
- Secciones dinámicas y clipping.
- Cámaras ortográficas, axonometría, planta, corte y elevación.
- Herramientas de medición y snapping.
- Viewpoints guardados.
- Aislar, congelar, ocultar y transparencia por elemento o categoría.
- Identidad común 2D/3D/IFC.
- Pruebas adicionales y evidencia reproducible.

## Estado final de gobierno

```text
Fase 0:             autorizada conversacionalmente; expediente documental por corregir
E1:                 aprobado en conversación; evidencia documental por consolidar
E2:                 aprobado en conversación; evidencia documental por consolidar
E3:                 aprobado en conversación; evidencia documental por consolidar
E4:                 aprobado en conversación; evidencia documental por consolidar
E5 actual:          E5-PREVIEW / EXPLORATORY
E5 VERIFIED:        DEFER
E6–E8:              BLOQUEADOS
Nuevas capacidades: BLOQUEADAS hasta contrato E5 revisado
```

## Conclusión

DeepSeek tiene razón en no aceptar el reporte como **E5 completo**. No tiene razón suficiente para afirmar que el código fue ejecutado sin autorización del Product Owner, porque la autorización sí aparece en el historial conversacional. El problema real es que esa autorización no fue consolidada correctamente en el expediente de evidencia.

El resultado equilibrado es:

> **E5-PREVIEW / EXPLORATORY — aceptación técnica condicionada, cierre formal DEFER, sin reversión y sin avance a E6.**
