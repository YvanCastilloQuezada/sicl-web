# E-KNOW — Bloque 2: semántica espacial y transferencia tipológica

## Estado

- **Implementación:** `IMPLEMENTED_LOCALLY`
- **Estatus epistemológico de las reglas nuevas:** `HYPOTHESIS`
- **Estado de conocimiento:** `K2_CANDIDATE`
- **Promoción automática a FACT:** `FORBIDDEN`
- **Revisión humana:** `HUMAN_REVIEW_REQUIRED`
- **Modificación de SICL Core remoto:** `NO`

Este bloque resuelve formalmente dos lagunas detectadas en el interrogatorio E-KNOW, sin convertir una formalización de software en conocimiento arquitectónico confirmado.

## 1. SPACE versus ROOM

`SPACE` es la categoría amplia para una entidad o condición espacial identificable. Puede ser abierta, compartida, continua, exterior, de circulación, de transición o no exclusiva.

`ROOM` es una clasificación candidata de `SPACE` que solo puede utilizarse cuando existe evidencia suficiente de una unidad espacial discreta. El contrato exige simultáneamente:

1. extensión identificable;
2. envolvente cerrada;
3. uso dedicado o no meramente compartido;
4. condición de acceso identificable; y
5. continuidad discreta o unidad espacial reconocible.

Si falta una de estas condiciones, ARKI conserva la clasificación `SPACE` y registra el dato faltante como `UNKNOWN` cuando corresponda. Por tanto, un patio, galería, circulación, umbral, vacío o espacio exterior puede ser arquitectónicamente significativo sin ser una habitación.

La regla no afirma que toda habitación deba ser cerrada en todos los marcos normativos o tipológicos; establece un umbral operativo provisional para evitar que ARKI convierta automáticamente cada actividad o contenedor semántico en una habitación.

## 2. SPATIAL_BOUNDARY versus WALL

`SPATIAL_BOUNDARY` es una condición de diferenciación espacial. Puede ser visual, acústica, de acceso, temporal, vegetal, material, geométrica o constructiva.

`WALL` es una realización constructiva posible de una frontera espacial. No es sinónimo de frontera y no debe generarse automáticamente solo porque dos actividades sean distintas.

La resolución sigue esta secuencia:

```text
REQUISITO DE DIFERENCIACIÓN
→ EFECTO NECESARIO
→ CONDICIONES COMPARTIDAS O SEPARADAS
→ REALIZACIONES POSIBLES
→ DECISIÓN CONDICIONAL SOBRE MURO
```

Cuando la diferenciación es perceptual y se permite compartir aire, iluminación y circulación, la salida es `NOT_REQUIRED` para muro con los datos disponibles. Esto no significa que un muro esté prohibido; significa que no está justificado por ese requisito aislado.

Cuando existe una necesidad de control, seguridad, acústica o separación física, la salida es `CONDITIONAL` salvo que exista evidencia explícita que requiera una realización constructiva. Aun en ese caso, el contrato no inventa espesor, material, resistencia, condición estructural ni dimensiones.

Cuando faltan el efecto requerido o la evidencia de muro, la salida es `UNKNOWN` y se registra una ruta de resolución mediante evidencia de proyecto y revisión del arquitecto.

## 3. Transferencia tipológica

Las reglas anteriores son transferibles como **razones de decisión**, no como configuraciones geométricas. ARKI puede reutilizar la distinción entre categoría espacial, habitación y frontera, pero debe readaptarla a la tipología, el uso, la escala, la normativa y el escenario del proyecto.

## 4. Pruebas implementadas

La batería `client/src/arkiSpatialSemantics.test.ts` verifica:

- patio abierto y compartido clasificado como `SPACE`;
- recinto cerrado, dedicado y accesible clasificado como `ROOM` candidato;
- diferenciación perceptual sin inferencia automática de muro;
- frontera de control con decisión de muro condicional;
- preservación de `UNKNOWN` cuando faltan datos;
- y bloqueo de promoción automática a `FACT`.

## 5. Limitaciones

Estas reglas no constituyen todavía una norma, una especificación constructiva ni una validación normativa. No determinan por sí solas:

- dimensiones;
- espesores;
- resistencia al fuego;
- aislamiento acústico;
- accesibilidad;
- iluminación;
- ventilación;
- estructura;
- ni cumplimiento del RNE u otra normativa.

La promoción a `FACT` requiere evidencia explícita, prueba de transferencia, contraejemplos y revisión humana.
