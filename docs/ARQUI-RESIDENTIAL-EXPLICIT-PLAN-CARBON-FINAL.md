# SiMS-DeI — ARQUI
# Planta residencial explícita, operaciones controladas y carbono

## Resultado

ARQUI ahora dispone de un modelo residencial explícito y verificable a nivel digital para `HOUSE-001-EXPLICIT` / `HOUSE-A-CONSTRUCTIVE`.

La implementación ya no se limita a zonas abstractas. El modelo contiene habitaciones con límites rectangulares explícitos, muros exteriores, particiones, puertas, ventanas, núcleo de escalera, ducto de servicio, adyacencias respaldadas por aperturas y una ruta de circulación registrada.

Esto constituye una **planta espacial digital validada parcialmente**. No constituye documentación constructiva aprobada ni certificación normativa.

## Elementos implementados

| Elemento | Estado |
|---|---|
| Habitaciones / espacios | Geometría explícita |
| Límites espaciales | Verificados contra el sitio |
| Áreas | Derivadas determinísticamente |
| Adyacencias | Vinculadas a aperturas geométricas |
| Muros exteriores | Modelo explícito |
| Particiones | Modelo explícito |
| Puertas | Cinco puertas con ancho registrado |
| Ventanas | Ventana propuesta con ancho registrado |
| Escalera | Núcleo identificado entre N1 y N2 |
| Ducto | Núcleo de servicio continuo propuesto |
| Ruta accesible | Ancho registrado, estado propuesto |
| Continuidad de instalaciones | Ducto identificado; coordinación MEP pendiente |
| Documentación constructiva | No generada |

## Operaciones controladas

Se implementó una función común de mutación espacial para:

```text
MOVE_ROOM
RESIZE_ROOM
OFFSET_ROOM
RESHAPE_SPATIAL_ELEMENT
EDIT_ROOM
```

Las operaciones verifican antes de aceptar el resultado:

- identidad del espacio;
- contención dentro del sitio;
- ausencia de solape con otros espacios del mismo nivel;
- dimensiones mínimas;
- actualización determinística del área;
- preservación del resto del plan cuando la operación falla.

Las operaciones no ejecutan cambios irreversibles ni crean decisiones automáticas. Una futura interfaz de edición deberá reutilizar esta función y añadir autorización humana, preview, readback y registro en `DesignMemory`.

## Materiales y carbono

La vivienda usa el registro existente de materiales de A26 y selecciona un candidato compatible con `HOUSING` usando área, presupuesto indicativo y objetivo de carbono.

El panel muestra:

- área bruta del modelo;
- material seleccionado;
- carbono medio estimado;
- rango indicativo bajo-alto;
- estado epistemológico;
- advertencia de que el valor no es un LCA.

La clasificación es:

```text
STATE = ILLUSTRATIVE_PROXY
CARBON_IS_NOT_LCA = TRUE
COST_IS_NOT_BID = TRUE
HUMAN_REVIEW_REQUIRED = TRUE
```

Los valores dependen de perfiles indicativos de A26. Para uso profesional deben sustituirse por EPD del producto, transporte, desperdicio, sistema estructural, acabados, mantenimiento, vida útil, reutilización y condiciones locales.

## Qué se verifica

La prueba automatizada confirma:

1. que todos los espacios tienen límites válidos;
2. que los espacios están contenidos en el sitio;
3. que no existe solape entre espacios del mismo nivel;
4. que las adyacencias requeridas tienen una apertura geométrica;
5. que puertas y ventanas tienen extremos conocidos;
6. que existen escalera y ducto de servicio;
7. que se registra una ruta entre niveles;
8. que las métricas de carbono tienen rango positivo y reproducible;
9. que una operación válida modifica un espacio sin corromper el plan;
10. que operaciones con solape o salida del sitio son rechazadas.

## Qué todavía no se afirma

La planta no se presenta como:

- cálculo estructural;
- proyecto de instalaciones;
- verificación de accesibilidad normativa;
- estudio de evacuación;
- certificación de seguridad contra incendios;
- presupuesto de obra;
- LCA completo;
- modelo BIM constructivo;
- permiso de edificación;
- documentación ejecutiva.

La ruta accesible está registrada como propuesta. El ducto prueba continuidad semántica entre niveles, pero no dimensiona instalaciones. La escalera está identificada como núcleo, pero no contiene todavía huellas, contrahuellas, descansos ni cálculo de evacuación.

## Veredicto

```text
EXPLICIT_SPATIAL_MODEL = IMPLEMENTED
DIGITAL_GEOMETRIC_VALIDATION = PARTIAL / PASS
CONTROLLED_ROOM_OPERATIONS = IMPLEMENTED
MATERIAL_SELECTION = IMPLEMENTED AS ILLUSTRATIVE PROXY
CARBON_METRICS = IMPLEMENTED AS ILLUSTRATIVE PROXY
CONSTRUCTION_DOCUMENTATION = NOT_GENERATED
PROFESSIONAL_CERTIFICATION = NOT_CLAIMED
HUMAN_AUTHORITY = PRESERVED
```
