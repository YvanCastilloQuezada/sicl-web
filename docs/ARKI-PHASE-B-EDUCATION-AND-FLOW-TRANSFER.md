# ARKI — Fase B: Educación y transferencia de separación de flujos

## Estado

`PHASE_B = IMPLEMENTED / VALIDATED_WITH_HUMAN_REVIEW_REQUIRED`

La fase extiende la gramática funcional canónica existente. No crea un segundo motor tipológico, un segundo modelo canónico ni una ontología de habitaciones.

## Perfil educativo

Se implementó `buildEducationOperationalProgram()` para la tipología `EDUCATION`. El programa representa actores, actividades, sistemas mínimos, procesos, flujos, relaciones, controles, interfaces, capacidades y requisitos funcionales antes de cualquier coordenada geométrica.

El perfil incluye llegada supervisada, aprendizaje, administración y supervisión, alimentación, juego/aprendizaje exterior, servicio y evacuación. La epistemología se conserva como `HYPOTHESIS`; cada perfil exige revisión humana.

## Zonificación

Se implementó `deriveFunctionalZoning()`, que deriva bandas desde `TypologyFunctionalProfile.zoningGradient` y no mantiene una verdad geométrica paralela. Para educación, las bandas propuestas son:

```text
PUBLIC_ENTRY
→ SUPERVISED_SHARED
→ LEARNING
→ STAFF_RESTRICTED
→ SERVICE
```

La zonificación es funcional y preliminar. No equivale todavía a una planta, cumplimiento normativo, cálculo de evacuación ni documentación constructiva.

## Transferencia hospitalaria

Se implementaron dos casos independientes del principio `separate flows`:

| Origen | Destino | Principio preservado | Condiciones cambiadas | Resultado |
|---|---|---|---|---|
| Healthcare | Hospitality/Hotel | Separación entre flujos públicos y de servicio; interfaces controladas | Llegada de huéspedes, housekeeping, recepción de bienes, cocina, residuos; sin flujo estéril clínico | `PASS` |
| Healthcare | Laboratory | Separación entre flujos limpios/contaminados o públicos/de proceso; acceso controlado | Cadena de muestras, equipos, peligros, mantenimiento y residuos; proceso de laboratorio en lugar de atención de pacientes | `PASS` |

La transferencia falla como evidencia cuando se copia la solución hospitalaria, se omite el cambio de condiciones o no se declara la no-aplicabilidad. Esto se prueba explícitamente para el laboratorio.

## Pruebas

- TypeScript: `PASS`
- Suite focalizada: `18 tests passed`
- Cobertura focalizada: perfil educativo, bandas de zonificación, transferencia a hotel, transferencia a laboratorio y control negativo de copia de solución.

## Límites

Los datos de capacidad son sintéticos y educativos. El resultado no afirma funcionamiento real de un colegio, hotel o laboratorio. La autoridad humana permanece obligatoria. Las dimensiones, regulación, seguridad, accesibilidad, ingeniería y geometría deben verificarse por separado cuando se avance a la realización espacial.

## Siguiente paso seguro

La siguiente extensión proporcional es conectar las bandas de zonificación educativa con una topología de adyacencias pre-coordenada y validar alternativas de organización sin generar todavía una planta constructiva ni declarar cumplimiento.

## Commit

El commit debe contener únicamente esta extensión de Fase B, sus pruebas y este documento. No se autoriza push, merge ni despliegue por este cierre.

---

Fuentes de conocimiento: perfiles funcionales derivados de referencias Neufert/Plazola registradas por ARKI; las referencias se conservan como hipótesis de diseño y no como sustituto de normativa o juicio profesional.

Human authority: `PRESERVED`  
Automatic decision: `NOT_CREATED`  
Recommendation: `NOT_CREATED`  
Winner: `NOT_CREATED`  
Decision: `NOT_CREATED`  
Estado epistemológico de salidas: `HYPOTHESIS / PROPOSED`
