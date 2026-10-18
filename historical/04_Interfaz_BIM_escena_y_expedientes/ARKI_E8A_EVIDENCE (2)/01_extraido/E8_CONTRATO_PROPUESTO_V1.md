# ARKI — Contrato E8 v1.0

## Expediente técnico, operación y mantenimiento, y gate final

**Estado:** PROPUESTO — requiere aprobación del Product Owner  
**Duración:** un ciclo único  
**Regla:** si E8 queda `PARTIAL`, el programa se cierra con cuatro entregas congeladas

## 1. Alcance cerrado

E8 tiene sólo tres frentes:

1. **EXP-TEC:** expediente técnico compilado y trazable.
2. **O-M:** operación y mantenimiento básico conectado al modelo.
3. **Gate final:** verificación de estados, evidencia, deuda y cierre del programa.

Avatar ARKI, Luka, WebXR, nuevos kernels científicos, nuevas disciplinas y ampliaciones de E5, E6 o E7 quedan fuera de E8 y se registran como `FUTURE`.

## 2. Precondición obligatoria

Antes de modificar código deben pasar en verde:

- `pnpm check`.
- `pnpm build`.
- Regresión de E5.
- Regresión de E6.
- Regresión de E7.
- Verificación de que E5, E6 y E7 permanecen congelados y no se modifican.

Si la regresión no pasa, E8 no empieza con nuevas funciones. Se documenta el bloqueo.

## 3. EXP-TEC

El expediente debe compilar desde el estado canónico del proyecto, sin copiar datos manualmente. Como mínimo debe incluir:

- portada e identificación del proyecto;
- índice de entregables;
- resumen del modelo y sus niveles;
- listado de elementos y familias;
- metrados disponibles;
- presupuesto disponible;
- cronograma disponible;
- clashes y estado de revisión;
- limitaciones y advertencias;
- provenance de cada sección;
- estado de aprobación humana.

El expediente debe conservar relación con snapshot y versión del proyecto. Si un dato no existe, debe aparecer como `UNKNOWN` o `NOT_DEMONSTRATED`, no como texto inventado.

## 4. O-M

El módulo O-M debe permitir registrar activos y mantenimiento básico a partir de elementos del modelo. Cada activo debe conservar:

- identidad estable;
- tipo y ubicación;
- sistema o disciplina;
- fabricante y modelo cuando existan;
- fecha de instalación cuando exista;
- periodicidad de mantenimiento;
- actividad de mantenimiento;
- responsable;
- estado;
- evidencia o documento asociado;
- próxima acción.

La primera versión no pretende ser un CMMS completo. Debe demostrar trazabilidad modelo → activo → mantenimiento y permitir guardar un registro local verificable.

## 5. Gate final

El gate final debe mostrar, sin ambigüedad:

- qué está `IMPLEMENTED`;
- qué está `VERIFIED`;
- qué está `PARTIAL`;
- qué está `NOT_DEMONSTRATED`;
- qué requiere validación profesional;
- las deudas de E5, E6 y E7;
- los hashes de outputs y capturas;
- los límites del producto;
- la decisión final del Product Owner.

Manus no emite el veredicto final. DeepSeek revisa la evidencia y el Product Owner decide el cierre.

## 6. Evidencia desde el día 1

Las capturas no se dejan para el final. En el primer bloque de trabajo se generan y registran las siguientes seis capturas con SHA-256 y metadatos:

1. EXP-TEC compilado.
2. Sección del expediente con provenance y estado.
3. Activo O-M seleccionado desde el modelo.
4. Registro de mantenimiento guardado.
5. Gate final con deuda consolidada.
6. Vista final del programa con estados E5/E6/E7/E8.

Cada captura debe incluir viewport, fecha, ruta de interacción y hash.

## 7. Pruebas mínimas

E8 debe añadir como mínimo ocho pruebas:

- tres del compilador EXP-TEC;
- tres de activos y mantenimiento O-M;
- dos del gate final y clasificación de estados.

Todos los tests deben producir output crudo. Deben pasar las regresiones previas de E5, E6 y E7.

## 8. Entregables

- `E8_OUTPUTS.txt`.
- `E8_MANIFEST.json`.
- `E8_REPORT.md`.
- `E8_SCOPE_LIMITS.md`.
- `E8_DEBT_INHERITED.md`.
- ocho pruebas nuevas como mínimo.
- seis capturas con SHA-256 y metadatos.
- diff completo de archivos modificados.
- veredicto corto de DeepSeek.

## 9. Criterio de cierre

E8 sólo puede declararse `VERIFIED` si el expediente y O-M funcionan, las ocho pruebas y regresiones pasan, las seis capturas tienen hash, el manifest coincide con los archivos, las deudas son visibles y DeepSeek emite un veredicto favorable.

Si cualquier criterio falla al terminar el único ciclo, E8 queda `PARTIAL / IMPLEMENTATION FREEZE` y el programa se cierra con E5, E6, E7 y E8 congelados. No se abre E9.

## 10. Regla de no expansión

Durante E8 no se añaden nuevas disciplinas, nuevos kernels, Avatar, Luka, colaboración multiusuario, IFC nuevo, cálculo estructural, cálculo MEP, WebXR ni nuevas funciones de generación.

**Estado:** ningún código E8 se ejecuta hasta la aprobación explícita de este contrato.
