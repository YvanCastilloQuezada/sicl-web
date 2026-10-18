# Content Engine y Avatar

## Separación de responsabilidades

`FACT` contiene datos provenientes del manifest y del servidor: juego, estado, cuenta regresiva y disponibilidad de resultado. `CONTENT` es una frase de presentación. El contenido nunca es fuente de verdad.

## Fallback

Cada mensaje puede tener `PRIMARY`, `FALLBACK` y `SAFE_FALLBACK`. Si falla el contenido dinámico, se muestra una frase segura y determinista. `shared/contentEngine.ts` implementa esta regla sin consultar un modelo externo.

## Avatar

`shared/avatarScripts.ts` genera guiones deterministas en español peruano para inicio, cierre, sorteo, resultado, transición e interacción. El Avatar no puede cambiar estado oficial, números, premios, horarios ni reglas. No se implementa Avatar 3D ni TTS externo.

## IA futura

Una IA generativa podría producir variantes de estilo, traducción o entretenimiento, pero no resultados, premios, reglas, horarios, estados financieros ni decisiones de autoridad. Toda integración futura requiere proveedor, secretos, límites y revisión humana.


## Integración con Marketing Intelligence

Los contenidos de marketing reutilizan la separación `FACT → CONTENT` y además atraviesan `TRUTH → LEGAL → EXPERIENCE → HUMAN APPROVAL`. `shared/marketingIntelligence.ts` bloquea claims sin evidencia o sobre capacidades no implementadas y clasifica el resultado como `BLOCKED` o `REQUIRES_HUMAN`. La Content Factory y el Launch Pack de 30 días permanecen en estado de propuesta local; no publican ni programan redes automáticamente.

El estado `SIMULATED`, `PROJECTION`, `EXTERNAL_REQUIRED` o `ROADMAP` debe conservarse en los metadatos y nunca presentarse como `IMPLEMENTED`. Para datos de audiencia, conversión, ROI, alcance o atribución se aplica `NO DATA → NO CLAIM`.
