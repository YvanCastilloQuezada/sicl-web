# Investigación de licencias para un asset 3D base de Lukita

## Unity Asset Store

Fuente oficial: [Asset Store Terms of Service and EULA](https://unity.com/legal/as-terms). La licencia permite usos comerciales de los assets conforme a los términos aplicables, pero el activo debe utilizarse dentro de un proyecto/obra y no redistribuirse como archivo independiente. La licencia concreta del asset y sus restricciones deben conservarse en el expediente de compra.

## Sketchfab

Fuente oficial: [Sketchfab License Agreement](https://sketchfab.com/licenses). La licencia editorial no permite uso comercial ni promocional y tampoco permite sugerir afiliación o patrocinio. La licencia estándar tiene restricciones propias; además, los modelos no son exclusivos y no debe asumirse que Sketchfab garantiza todos los derechos del licenciante. Para MiLukita, un asset editorial queda descartado. Debe conservarse la URL, factura, licencia, autor, fecha y comprobación de derechos antes de importar cualquier modelo.

## Criterio para Lukita

Comprar un asset base es técnicamente factible y puede reducir tiempo de modelado, pero no convierte automáticamente el resultado en Lukita. La identidad maestra LUKITA-A+B+C-2D-APPROVED-01 sigue siendo obligatoria. El asset debe considerarse una base estructural potencial, no un rostro, vestuario o identidad reutilizable. Antes de integrarlo se debe ejecutar revisión de licencia, descarte de parecido con terceros, adaptación de rostro/cabello/silueta/vestuario, pruebas de rendimiento GLB y Identity Lock Test. Mixamo puede evaluarse como fuente de animaciones, pero debe verificarse la licencia vigente en el momento de uso.

## Conclusión

La propuesta es factible como acelerador técnico, no como sustituto de la dirección artística. La ruta recomendada es comprar solo un asset humano adulto estilizado con licencia comercial explícita, sin marcas ni rasgos reconocibles de terceros; personalizarlo de forma sustantiva; mantenerlo en Preview/Review; y no integrarlo a `/tv` hasta obtener aprobación estética y documental humana.

## Decisión de implementación — Candidate Asset Preview

Se adopta la idea original de usar un asset base para acelerar la producción, con una mejora de gobernanza: ningún asset comprado entra directamente al modelo maestro ni a `/tv`. En `/lukita-3d`, cada archivo local se trata como candidato aislado y se revisa en comparación lado a lado con el blockout procedimental y la referencia `LUKITA-A+B+C-2D-APPROVED-01`.

La interfaz incorpora un gate visible con cuatro verificaciones: licencia comercial documentada, procedencia/originalidad, Identity Lock Test y aptitud técnica. El estado puede quedar en checklist pendiente, no elegible o listo para revisión humana; “listo” no equivale a aprobación estética, producción ni publicación. Esta separación reduce el riesgo de que una compra, una carga de archivo o un asset con licencia válida se confunda con la identidad definitiva de Lukita.

La recomendación operativa es trabajar en tres rondas: primero seleccionar varios candidatos con licencia clara; después compararlos en Preview/Review con iluminación, wireframe, cámara y proporciones; finalmente elegir solo uno para adaptación artística y nueva revisión humana. No se habilitan todavía rigging definitivo, voz, TTS, lip-sync, animación final, integración pública ni publicación.
