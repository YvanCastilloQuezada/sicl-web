# E1.2 — Matriz de módulos, accesos y estados

La matriz distingue visibilidad, integración de dominio y capacidad de aprobación. Una tarjeta visible no equivale a un módulo terminado.

| Módulo | Visitante | Usuario | Especialista | Corporativo | Estado de dominio actual |
|---|---|---|---|---|---|
| Data | Vista pública | Consulta proyecto | Consulta disciplinar | Gobierno de datos | PARTIAL |
| Biblioteca | Catálogo público | Usa familias | Revisa familias | Administra estándares | PARTIAL |
| Proyectos | Demostración | Crea y versiona localmente | Revisa proyectos asignados | Administra cartera | PARTIAL |
| Generador | Demo limitada | Genera propuestas | Revisa parámetros | Define catálogo | VERIFIED en alcance base |
| Modelo BIM | Demo | Consulta modelo | Coordina disciplinas | Gobierna modelo | PARTIAL |
| Planta | Demo | Edita/selecciona | Revisa por disciplina | Configura estándares | VERIFIED 2D conceptual |
| Corte | Demo | Consulta corte | Revisa coordinación | Gobierna documentación | PARTIAL |
| 3D | Demo conceptual | Pendiente visor real | Pendiente coordinación 3D | Pendiente estándar 3D | NOT IMPLEMENTED profesional |
| Metrados | Muestra | Calcula referencial | Concilia | Aprueba catálogo | VERIFIED referencial |
| PRESUP-5D | Muestra | Presupuesto referencial | Revisa APUs | Gobierna precios | PARTIAL |
| GASTOS | No datos privados | Consulta según permiso | Revisa contratos | Administra gastos | NOT IMPLEMENTED productivo |
| 4D | Muestra | Programa conceptual | Revisa avance | Gobierna planificación | PARTIAL |
| Clashes | Demo | Consulta incidencias | Coordina y cierra | Gobierna reglas | CONCEPTUAL |
| EXP-TEC | Demo | Genera expediente de trabajo | Revisa documentos | Emite con gate | PARTIAL |
| O-M | Información | Consulta activos propios | Revisa mantenimiento | Administra activos | CONCEPTUAL |
| ADM | No | No | Según rol | Administra organización | NOT IMPLEMENTED productivo |

Los permisos detallados, atajos, estados vacíos, consumo y producción de datos se desarrollan en E2. Las etiquetas anteriores no autorizan uso profesional sin pruebas.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards" 
