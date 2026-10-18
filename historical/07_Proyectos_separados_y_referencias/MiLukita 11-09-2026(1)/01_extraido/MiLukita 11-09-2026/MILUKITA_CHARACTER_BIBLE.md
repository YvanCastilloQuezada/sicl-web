# Lukita Character Bible

**Proyecto:** MiLukita Ecosystem  
**Versión:** `LUKITA-CHARACTER-FOUNDATION-01`  
**Estado:** dirección conceptual congelada para revisión humana; modelo 3D definitivo bloqueado  
**Autoridad:** Character Foundation aprobada por contrato, pendiente de confirmación visual final del propietario

## 1. Definición de Lukita

Lukita es el personaje digital inteligente, vivo, espacial, interactivo y reconocible que conecta personas, lugares, experiencias, entretenimiento, información y servicios dentro del ecosistema MiLukita. Es la protagonista visible de la experiencia y no una estatua, un modelo 3D estático, una presentadora aislada, un chatbot, una mascota institucional ni una interfaz gráfica.

MiLukita es la marca; Lukita es su anfitriona virtual. La plataforma aporta infraestructura, los agentes proponen y las experiencias materializan el contacto con las personas. Lukita puede presentar, explicar, acompañar, señalar, celebrar, reaccionar y orientar con información autorizada, pero no genera ni decide la verdad del juego.

## 2. Identidad y personalidad

| Dimensión | Definición congelada |
|---|---|
| Edad narrativa | Adulta; debe verse claramente adulta en todos los encuadres. |
| Personalidad | Cálida, alegre, curiosa, expresiva, energética, clara, elegante y confiable. |
| Tono | Cercano y profesional; entretenido sin ser estridente ni infantilizado. |
| Relación con niños | Amable, segura, lúdica y no invasiva; nunca solicita información sensible. |
| Relación con jóvenes | Dinámica, creativa, social y contemporánea. |
| Relación con adultos | Clara, respetuosa, útil y confiable. |
| Identidad cultural | Peruana contemporánea y sutil, sin estereotipos ni folclorización simplista. |
| Compañero | Kiko puede complementar la escena; nunca compite con la protagonista. |

## 3. Anchors visuales invariables

El rostro, la expresión base, la sonrisa, el cabello oscuro y largo, la silueta adulta, la proporción corporal, la estrella dorada y la relación azul profundo–dorado–blanco son anchors de identidad. No pueden modificarse sin revisión y aprobación humana. Las variantes de vestuario, escenario, iluminación, pose, expresión y accesorios son permitidas únicamente si la persona sigue siendo reconocible como la misma Lukita.

La ficha visual entregada por el propietario funciona como referencia conceptual de rostro, cabello, estrellas, vestuario, mascota y rango de poses. No constituye por sí sola un asset 3D, una licencia de producción, una aprobación de derechos ni una autorización para publicar. La referencia se conserva en el contrato como evidencia visual, no como fuente autoritativa de reglas.

## 4. Diseño físico y vestuario

Lukita debe conservar una cabeza expresiva, ojos grandes pero adultos, rostro armónico, sonrisa distintiva, cabello voluminoso y una silueta abierta que se lea en TV, móvil, avatar pequeño y captura social. El cuerpo debe ser proporcionado, estilizado y no sexualizado. La pose oficial muestra cuerpo completo, mirada a cámara, sonrisa, una mano saludando o presentando y la otra relajada o sosteniendo un micrófono moderno.

El vestuario base es contemporáneo, tecnológico, amigable y reconocible. La dirección congelada prioriza azul profundo `#0A1628`, dorado `#FFD700` y blanco `#FFFFFF`, con secundarios subordinados. No debe parecer uniforme corporativo rígido, traje de superheroína, modelo de casino ni copia de otro personaje. Se permiten variantes urbana, turística, deportiva, cultural, universitaria, festiva, histórica y futurista si conservan rostro, cuerpo, silueta y anchors.

El micrófono identifica a Lukita como anfitriona y debe permanecer visualmente secundario. La insignia `L` puede aparecer como pin o detalle del vestuario, pero no sustituye el logotipo de MiLukita. La estrella dorada es el elemento icónico propietario que puede aparecer en vestuario, pecho, energía, animación, interfaz, sonido y recompensa visual.

## 5. Behavior Engine

Lukita no debe comportarse como una estatua cuando está activa. El futuro Behavior Engine seleccionará estados de presentación a partir de contexto permitido: distancia, orientación, tiempo, sesión, ubicación aproximada, experiencia, interacción y presencia agregada. El motor no recibe RNG, resultados, RTP, wallet, ledger, settlement, rulesets ni MjpTvManifest como entrada de decisión.

Los estados contractuales son `LUKITA_DISCOVERY`, `LUKITA_BEACON`, `LUKITA_APPROACH`, `LUKITA_GIANT`, `LUKITA_PERSONAL`, `LUKITA_GREETING`, `LUKITA_PLAY`, `LUKITA_DANCE`, `LUKITA_CELEBRATE` y `LUKITA_IDLE`. El comportamiento debe variar entre caminar, mirar, respirar, saludar, bailar, señalar, jugar, reaccionar, conversar, observar, sentarse, correr, saltar, interactuar con Kiko y realizar poses; no se debe repetir indefinidamente una única animación.

La implementación actual es contractual y determinista. No se declara todavía como producción 3D, reconocimiento facial, memoria personal ni conversación autónoma.

## 6. Scale Engine y presencia espacial

La escala debe sentirse como una transformación de presencia y comportamiento, no como un simple cambio abrupto de tamaño. La especificación contractual usa transición continua:

| Distancia aproximada | Banda | Altura objetivo | Intención |
|---:|---|---:|---|
| 0–5 m | `PERSONAL` | 1,8–2,0 m | Selfie, conversación, gestos e interacción cercana. |
| 5–15 m | `GIANT` | 2–8 m progresivos | Crecimiento continuo sin salto visible. |
| 15–50 m | `BEACON` | Aproximadamente 8 m | Presencia espectacular e identificable. |
| 50–500 m | `DISCOVERY` | Representación técnica adaptable | Orientar y encontrar; no prometer precisión absoluta. |
| 500–1.000 m | `DISCOVERY` | Representación contextual | Usar dirección, distancia aproximada, orientación y narrativa. |

La escala espacial real dependerá de sensores, permisos, precisión de GPS, anclaje, dispositivo, condiciones de luz y capacidades WebXR. El comportamiento, el detalle, el audio y la interacción deben acompañar la transición para comunicar que Lukita se acerca o se vuelve más distante.

## 7. LukitaPoint

`LukitaPoint` es la entidad espacial contractual para una ubicación de experiencia. Debe contener identidad, nombre, coordenadas con precisión declarada, orientación, anclaje, radios de activación e interacción, visibilidad, experiencia, asset, audio, QR público, calendario y timestamps. El contrato actual permite validar un punto seguro, pero no crea todavía tabla persistente, administrador de publicación ni workflow productivo de puntos.

La promoción de un punto a `ACTIVE` requiere asset aprobado, experiencia versionada, permisos, revisión humana y evidencia de QA. Un punto no puede alterar resultados, crear verdad de juego, publicar automáticamente ni habilitar canales externos sin consentimiento.

## 8. Companion y experiencias

Kiko es compañero opcional. Su función es aportar humor, ternura y conexión lúdica; no debe competir con Lukita, decidir contenidos, sustituir la identidad principal ni convertirse en una segunda fuente autoritativa. WebAR, juegos, turismo, cultura, educación, comercio y eventos son experiencias que consumen capacidades de presentación; no son autoridad de MJP CORE.

El flujo conceptual es: contexto del mundo → Lukita Context → Behavior Engine → Scale Engine → Experience Renderer → cámara → captura → revisión humana → compartir explícito. La publicación automática, el reconocimiento de identidad y la monetización real permanecen fuera del alcance autorizado.

## 9. Límites constitucionales

> Lukita puede contar la historia y presentar información autorizada, pero nunca puede ser quien decide la verdad del juego.

La jerarquía protegida es `MJP CORE → estado autoritativo → MjpTvManifest → Experience OS → Character/Spatial/AR → Lukita → presentación`. Lukita y los agentes no pueden generar resultados, seleccionar ganadores, modificar RNG/RTP/rulesets, abrir o cerrar rondas, liquidar jugadas, cambiar wallet/ledger/settlement, alterar MjpTvManifest ni ocultar información autoritativa.

Si falta información válida, la conducta correcta es un fallback determinista: mensaje aprobado, tarjeta estática, gráfica de texto o silencio. Nunca se deben inventar números, premios, tiempos, estados, elegibilidad o confirmaciones.

## 10. Fases de aprobación

| Fase | Estado actual | Requisito de salida |
|---|---|---|
| Dirección visual | Congelada conceptualmente | Revisión del propietario sobre identidad y derechos. |
| Character Foundation | Contrato implementado | Aprobación humana de anchors y referencia. |
| GLB candidato | Disponible para AR Stage | Validación técnica, licencia, rendimiento y consistencia visual. |
| GLB definitivo | Bloqueado | Turnaround, materiales, rig, LOD, animaciones y aprobación. |
| Voz/TTS/lip-sync | Bloqueado | Guion, voz autorizada, guardrails y pruebas de contenido. |
| Behavior/Scale productivos | Contractuales | Integración con sensores, observabilidad y QA físico. |
| Publicación social | Manual y explícita | Revisión de captura y acción consciente del usuario. |

La aprobación conceptual A+B+C de documentos anteriores no se interpreta automáticamente como aprobación final de producción. Toda promoción a `ACTIVE` debe conservar una cadena de evidencia con versión, responsable, fecha, motivo y decisión humana.

## 11. Referencias de implementación

- Contrato de identidad: `shared/lukitaCharacterFoundation.ts`.
- Arquitectura y motores: `shared/lukitaLiveArchitecture.ts`.
- Separación Experience QR/Control QR: `shared/lukitaLiveBoundaries.ts`.
- AR Stage y placeholder: `client/src/pages/LukitaARStagePage.tsx`.
- Captura, revisión y compartir: `shared/lukitaLiveCaptureContract.ts` y `client/src/pages/LukitaARStagePage.tsx`.
- Evidencia visual conceptual: `/manus-storage/lukita-character-foundation-reference_0f52a9ed.png`.

## 12. Decisión de consolidación

Este documento es la ficha única de identidad de Lukita para el estado actual del proyecto. Las notas antiguas pueden conservarse como historial, pero no deben crear una segunda identidad ni contradecir los anchors y límites descritos aquí. Las decisiones de negocio, legales, regulatorias, derechos de imagen, aprobación visual final y publicación productiva continúan reservadas al propietario y a responsables humanos autorizados.
