# E4.4 — Gobierno de especialistas y revisión

Cada disciplina debe registrar quién propone, quién revisa, quién aprueba, qué evidencia exige y qué estados puede modificar.

| Estado | Proponente | Revisor | Aprobador | Evidencia |
|---|---|---|---|---|
| DRAFT | Especialista asignado | No requerido | No requerido | Datos mínimos |
| VALIDATED | Especialista | Revisor de disciplina | No requerido | Prueba y advertencias resueltas |
| COORDINATED | Especialista | Coordinador BIM | No requerido | Clashes revisados y relaciones |
| APPROVED | Especialista | Revisor | Profesional o responsable autorizado | Memoria, firma y gate |
| BLOCKED | Cualquier rol | Responsable del bloqueo | No | Causa y dependencia |
| SUPERSEDED | Nuevo responsable | Revisor | Responsable del proyecto | Relación con versión nueva |

## Reglas

Una disciplina no puede aprobar su propio resultado cuando la política exija separación de funciones. Un cambio aprobado crea una nueva versión. La trazabilidad debe conservar usuario, fecha, fuente, hipótesis y documentos afectados.

La firma profesional no puede ser simulada por un botón. El sistema debe guardar la referencia a una firma externa o mantener el gate cerrado.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards"
