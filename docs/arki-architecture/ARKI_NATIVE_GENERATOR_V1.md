# ARKI Native Generator v1

## Alcance

Se incorporó una capa segura de plantillas de primera parte sobre `ARKI-PARAMETRIC-RUNTIME`. La capa ofrece cinco plantillas iniciales para exploración conceptual: hotel con patio bioclimático, estadio tropical, corredor urbano, vivienda compacta y campus paisajístico.

Cada plantilla aporta una geometría inicial, etiquetas y supuestos explícitos. La página del runtime permite cargarla, modificar sus parámetros, observar la geometría existente, guardar la sesión por proyecto, comparar variaciones y exportar el paquete `.ark`/`.dyn`/`.ghx` ya gobernado por el runtime.

## Métricas y alertas

El contrato calcula área por nivel, área construida conceptual, altura total y área de patio. También emite alertas deterministas para dimensiones fuera del rango básico, patios superiores al 50 %, alturas totales superiores a 36 m y la condición permanente de resultado conceptual con revisión humana obligatoria.

Estas métricas no son cálculo estructural, normativo, de costos ni de evacuación. No deben interpretarse como aprobación de diseño.

## Seguridad

La versión v1 sólo usa grafos deterministas de primera parte. La ejecución de código de terceros del marketplace queda explícitamente deshabilitada. No se ejecuta `exec` de código enviado por usuarios, no se muta Project State automáticamente y los formatos nativos RVT, GH y BLEND continúan requiriendo hosts autorizados externos.

## Reversibilidad

La integración se implementa en la rama `feature/arki-native-generator-v1` y se guarda mediante commit y checkpoint WebDev. El cambio puede revertirse con el commit padre o reemplazarse por una versión posterior sin modificar `main`.

## Estado de validación

- TypeScript: PASS.
- Pruebas focalizadas del generador nativo y runtime existente: PASS, 10/10.
- Build: PASS.
- `git diff --check`: PASS.
- Advertencia no bloqueante: el build conserva chunks grandes heredados del bundle existente.
- Verificación visual pública: el servidor local responde HTTP 200, pero el navegador de preview quedó en estado de carga de la aplicación; requiere una comprobación posterior con la sesión/preview WebDev disponible.
