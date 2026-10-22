# ARKI — Universidad → práctica de motores

**Contrato:** `ARKI-EDU-MOTOR-ALIGNMENT-1.0`  
**Estado inicial:** IMPLEMENTED_CONTRACT / NOT_YET_FULLY_INTEGRATED

## Decisión

ARKI conserva una sola arquitectura educativa. Delta 6.2 es la ruta federada de ingestión de conocimiento; la Universidad organiza, enseña y evalúa ese conocimiento; el laboratorio de motores sólo se habilita después de demostrar los prerrequisitos intelectuales.

`SOURCE → DELTA 6.2 → UNIVERSITY → FOUNDATION → UNDERGRADUATE → SPECIALIZATION → MASTERS → DOCTORATE → MOTOR READINESS GATE → PRACTICUM WITH MASTER ENGINES → PRACTICAL EXAMS → NATIVE CAPABILITY`

## Invariantes

1. El motor no sustituye conocimiento disciplinar.
2. Usar software no demuestra comprensión.
3. Conocimiento ingerido no demuestra capacidad.
4. Aprobar teoría sólo habilita el practicum; no demuestra capacidad práctica.
5. El practicum puede comparar múltiples motores maestros.
6. La capacidad nativa no puede depender permanentemente del motor maestro.
7. Delta 6.2 conserva provenance, UNKNOWN y revisión humana.
8. No se crea una universidad paralela ni un segundo cerebro.

## Alineación

Los registros Delta 6.2 continúan usando `DELTA-6.2-FEDERATED-KNOWLEDGE-1.0`. La malla existente y el currículo maestro 5000 permanecen como superficie curricular. Las especialidades y posgrados se expresan como profundidad de conocimiento y prerrequisitos. Los motores son práctica terminal.

## Gate

Un practicum permanece `LOCKED` hasta que todos sus `knowledgeId` requeridos estén `HUMAN_CONFIRMED`. Al satisfacerse el gate pasa sólo a `READY_FOR_PRACTICUM`; nunca a `CAPABLE`, `GRADUATED` ni equivalente.

## Siguiente integración

- enlazar IDs reales del currículo maestro con prerrequisitos de cada familia de motores;
- registrar evidencia de transferencia y exámenes teóricos;
- conectar el practicum con el DAM del Core;
- incorporar vigilancia periódica de versiones/motores sin confundir actualización de herramienta con nuevo conocimiento.
