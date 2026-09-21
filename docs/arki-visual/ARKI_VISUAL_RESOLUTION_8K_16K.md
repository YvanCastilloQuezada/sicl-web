# ARKI — Superpoder visual 8K y 16K

## Estado

`IMPLEMENTED_AS_TARGET_PROFILES / PROVIDER_RESOLUTION_UNVERIFIED / HUMAN_REVIEW_REQUIRED`

ARKI ahora acepta perfiles `HD`, `2K`, `FULL_HD`, `4K`, `8K` y `16K` en el contrato de generación visual. Los perfiles 8K y 16K representan objetivos de salida, no una afirmación automática de que el proveedor haya entregado un archivo nativo con esas dimensiones.

## Perfiles

| Perfil | Objetivo | Estado de entrega |
|---|---:|---|
| HD | 1280 × 720 | Dependiente del proveedor |
| 2K | 2560 × 1440 | Dependiente del proveedor |
| Full HD | 1920 × 1080 | Dependiente del proveedor |
| 4K | 3840 × 2160 | Dependiente del proveedor |
| 8K | 7680 × 4320 | Puede requerir upscale aprobado o worker de render externo |
| 16K | 15360 × 8640 | Requiere verificación de proveedor o worker externo; no se presume nativo |

## Regla de no alucinación

`requestedResolution` es una intención técnica. `providerResolutionVerified` permanece en `false` hasta inspeccionar las dimensiones reales del archivo entregado. La calidad visual, el detalle aparente o la posibilidad de imprimir a gran formato no demuestran por sí mismos precisión geométrica, escala, cumplimiento normativo, constructibilidad ni resolución nativa.

## Flujo gobernado

El usuario selecciona un perfil; el Brain prepara una propuesta visual; el proveedor genera el archivo; el runtime mide las dimensiones efectivas; si no coinciden, el resultado se marca como discrepante y puede pasar a un upscale o render externo autorizado. El archivo final conserva el origen, la versión, el perfil solicitado, la resolución efectiva, el método de ampliación y la revisión humana.

## 4K, 8K y 16K no sustituyen CAD/BIM

Para planos con cotas y documentación constructiva, ARKI debe conservar una fuente vectorial o modelo CAD/BIM. Una imagen raster de 8K o 16K puede mejorar la impresión y la lectura, pero no convierte una lámina conceptual en un plano de fabricación, expediente técnico aprobado ni documento profesional firmado.

## Poder ARKI

El catálogo `SELECTABLE_VISUAL_RESOLUTION` queda ampliado a HD/2K/Full HD/4K/8K/16K. El gate obligatorio es `PROVIDER_RESOLUTION_VERIFICATION`; la autoridad humana conserva la decisión sobre la salida final y cualquier worker externo.
