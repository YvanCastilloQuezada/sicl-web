# ARQUI — House N1/N2: Iluminación, contexto térmico y perfil CRAZY

## Resultado

Se ejecutó una simulación determinista sobre `HOUSE-001-EXPLICIT`, utilizando las dos plantas residenciales y el adaptador ambiental A25 existente.

```text
ALTERNATIVE = HOUSE-A-CRAZY
LEVELS = N1, N2
APERTURE_TO_WALL_RATIO = 0.28
ORIENTATION = 0°
AMBIENT_AIR_TEMPERATURE = 26°C
RELATIVE_HUMIDITY = 65%
WIND_SPEED = 2.4 m/s
```

## Iluminación natural

N1 y N2 reciben el estado `PARTIAL_PROXY` con banda estimada `MEDIUM`. La clasificación deriva de orientación y relación de apertura, no de un cálculo anual de iluminancia.

No se ejecutó un modelo de cielo, obstrucciones, trayectoria solar anual, radiancia, reflexión ni cálculo de lux por espacio. Por ello, la banda es una **indicación exploratoria**, no una certificación de iluminación natural.

## Contexto térmico

Ambos niveles reciben contexto ambiental de 26 °C, 65 % de humedad relativa y 2.4 m/s de viento. Esto queda clasificado como `AMBIENT_CONTEXT`.

```text
THERMAL_COMFORT = NOT_ASSESSED
INDOOR_TEMPERATURE = NOT_CALCULATED
SURFACE_TEMPERATURE = NOT_CALCULATED
ENERGY_SIMULATION = NOT_IMPLEMENTED
```

La temperatura ambiente no se transforma en temperatura interior ni en un campo térmico espacial.

## Perfil CRAZY

Se generó `HOUSE-A-CRAZY` con:

```text
RULED_SURFACE
HYPERBOLIC_PROFILE
hyperbolicCurvature = 0.16
ruledSurfaceTwist = 0.22
amplitude = 0.35 m
```

Se preservaron la identidad de habitaciones, niveles N1/N2, programas, intención de área y núcleos verticales. La transformación es una hipótesis geométrica controlada y no una autorización para afirmar viabilidad estructural.

## Controles estructurales

El resultado permanece en estado `PARTIAL`. Se mantienen abiertas las siguientes cuestiones:

- trayectorias de carga;
- líneas generatrices y apoyos;
- cierre de bordes;
- pandeo;
- empujes y apoyos;
- conexiones;
- materialidad;
- coordinación de puertas, ventanas y MEP;
- costo;
- cumplimiento normativo.

## Artefactos visuales

- `house-n1-daylight-thermal.png`: planta N1 con proxy de iluminación y contexto térmico.
- `house-n2-daylight-thermal.png`: planta N2 con proxy de iluminación y contexto térmico.
- `house-crazy-hyperbolic.png`: variante axonométrica CRAZY con superficies hiperbólicas/regladas.

## Estado

```text
SIMULATION = PASS_WITH_OBSERVATIONS
DAYLIGHT = PARTIAL_PROXY
THERMAL_CONTEXT = SUPPORTED / AMBIENT ONLY
COMFORT = NOT_ASSESSED
CRAZY_GEOMETRY = CONTROLLED_HYPOTHESIS
STRUCTURAL_CERTIFICATION = NO
HUMAN_REVIEW = REQUIRED
```
