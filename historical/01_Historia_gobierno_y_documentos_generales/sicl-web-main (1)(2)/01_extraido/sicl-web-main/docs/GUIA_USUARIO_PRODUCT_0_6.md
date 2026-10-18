# Guía de usuario — SICL Product 0.6

## Propósito

Esta guía permite recorrer un proyecto SICL desde la interfaz sin atribuir autoridad automática al sistema. El producto registra contexto, objetivos, restricciones, preferencias, alternativas y evidencia; después conserva evaluaciones, comparaciones, recomendaciones y actos humanos separados.

> SICL puede describir una base analítica. Solo una persona con autoridad explícita puede registrar una decisión.

## Recorrido recomendado

| Paso | Módulo | Acción | Resultado esperado |
|---|---|---|---|
| 1 | Project | Crear o seleccionar el proyecto | Se establece identidad, versión, escala espacial y horizonte temporal |
| 2 | Context / Site | Registrar contexto y revisar representación espacial | Se muestra el marco declarado; no se inventan coordenadas |
| 3 | Objectives & Constraints | Registrar objetivos, restricciones y Preferences | Cada registro mantiene su semántica; una Preference no se convierte en requisito |
| 4 | Alternatives & Evaluation | Registrar alternativas, Evaluation y Comparison | Se conserva método, valor, unidad, inputs, provenance, dirección y factibilidad |
| 5 | Alternatives & Evaluation | Registrar Decision Condition, si corresponde | Se declara una frontera condicional; no se predice cuándo cambiará la preferencia |
| 6 | Council / Recommendation | Revisar el material read-only | Council observa; Recommendation describe su base analítica |
| 7 | Decision & Audit | Preparar HumanReview y Decision | El sistema exige actor, autoridad, confirmación y justificación explícitas |
| 8 | Decision & Audit | Exportar reporte seguro | El reporte excluye tokens y mantiene referencias auditables |

## Qué debe comprobar la persona usuaria

Una revisión válida debe confirmar que cada Evaluation identifica alternativa, objetivo, criterio, valor, unidad, método, inputs y provenance. Una Comparison debe mostrar dirección y estado de factibilidad explícitos. Una Decision Condition debe mostrar la alternativa y objetivo relacionados, el criterio, operador, umbral, unidad, razón, provenance y estado; no debe aparecer como Recommendation ni como Decision.

La persona usuaria debe verificar además que Council no ofrece botones para aprobar, que Recommendation no selecciona automáticamente una alternativa y que Decision solo puede registrarse después de introducir la autoridad humana y la confirmación correspondiente.

## Qué no se debe concluir

El mapa contextual no demuestra georreferenciación profesional. Un estado `FEASIBLE` no sustituye una certificación técnica. Una Recommendation no equivale a una Decision. Un fixture UPAO sintético no es evidencia de un proyecto real ni autorización para actuar sobre él.

## Criterio de salida de Product 0.6

Product 0.6 puede considerarse listo para una prueba de usuario cuando la persona completa el recorrido anterior, identifica la separación entre análisis y autoridad, y el equipo conserva evidencia de pruebas automatizadas, auditoría sin secretos y comportamiento de error. La aceptación de producción requiere además el núcleo remoto desplegado, persistencia externa, HTTPS, `SICL_CORE_URL` y una prueba poblada autorizada.
