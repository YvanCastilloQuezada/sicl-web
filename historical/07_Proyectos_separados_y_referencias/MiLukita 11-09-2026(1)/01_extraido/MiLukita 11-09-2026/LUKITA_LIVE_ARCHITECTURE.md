# Lukita Live — Arquitectura consolidada

**Proyecto:** MiLukita Ecosystem  
**Versión contractual:** `LUKITA-LIVE-ARCHITECTURE-01`  
**Estado:** consolidación técnica; componentes de producción sujetos a aprobación humana  
**Fecha:** 28 de agosto de 2026

## 1. Decisión arquitectónica

Lukita Live no es solamente un visor WebAR. Es una experiencia de personaje vivo que usa WebAR, cámara, interacción, captura y redes sociales como medios de presentación. El núcleo de identidad es Lukita; la plataforma ofrece infraestructura; los agentes proponen; las experiencias conectan el personaje con el mundo; y MJP CORE conserva exclusivamente la verdad del juego.

La orden se ejecuta en dos niveles. El nivel técnico autónomo queda implementado mediante contratos, validadores deterministas, UI de prototipo, pruebas y documentación. El nivel que puede afectar derechos, negocio, publicación, credenciales, operación física o autoridad de juego queda expresamente reservado a revisión humana.

## 2. Organigrama consolidado

```text
MiLukita Ecosystem
│
├── LUKITA EXPERIENCE
│   ├── Lukita Character      identidad, modelo, rostro, vestuario, voz, poses
│   ├── Lukita Spatial        lugar, distancia, orientación, escala y contexto
│   ├── Lukita AR             cámara, anclaje, colocación, interacción y efectos
│   ├── Lukita AI             conversación y adaptación dentro de guardrails
│   └── Lukita Companion      Kiko y acompañantes subordinados a Lukita
│
├── EXPERIENCES
│   ├── WebAR                 presencia espacial y captura
│   ├── Juegos                presentación de experiencias autorizadas
│   ├── Turismo / Cultura     contexto editorial y territorial
│   ├── Educación             orientación y contenido aprobado
│   ├── Comercio              experiencias comerciales separadas
│   └── Eventos               programación y presentación
│
├── PLATFORM CORE
│   ├── Identity              sesiones, permisos y consentimiento
│   ├── Data                  datos no sensibles y observabilidad
│   └── Services              storage, distribución y capacidades técnicas
│
├── AGENT OS
│   ├── propuestas             nunca decisiones irreversibles
│   ├── observabilidad          evidencia, alertas y métricas
│   └── recuperación            fallback determinista y escalamiento humano
│
└── PROTECTED MJP CORE
    └── verdad autoritativa del juego: RNG, resultados, RTP, reglas,
        wallet, ledger, settlement y MjpTvManifest
```

El organigrama es una interfaz de responsabilidades, no una licencia para que las capas inferiores escriban en las superiores. La única dirección permitida hacia la presentación es la proyección de estado autorizado. Nunca debe existir el camino inverso desde Lukita, agentes, captura o redes sociales hacia la verdad del juego.

## 3. Interfaces entre capas

| Interfaz | Entrada permitida | Salida | Prohibición principal |
|---|---|---|---|
| World Context → Lukita Context | ubicación aproximada, orientación, distancia, hora, sesión y experiencia | contexto de presentación | no introducir resultados ni wallet |
| Lukita Context → Behavior Engine | contexto permitido y evento de experiencia | estado conductual | no seleccionar verdad del juego |
| Spatial Context → Scale Engine | distancia y estado espacial | banda y altura objetivo suavizada | no prometer precisión absoluta |
| Experience OS → Character/AR | experiencia versionada y contenido aprobado | instrucciones de presentación | no cambiar el evento autoritativo |
| Character/AR → Renderer | asset, pose, estado, intensidad y fallback | imagen, escena, audio o texto | no ocultar información autoritativa |
| Renderer → Capture | cámara y composición visible | foto/video local | no publicar automáticamente |
| Capture → Human Review | blob local, metadatos técnicos y consentimiento | decisión de descarte, descarga o share | no enviar sin acción explícita |
| Platform Core → MJP CORE | ninguna interfaz de escritura desde Lukita Live | solo integración autorizada existente | no crear una segunda verdad |

## 4. Behavior Engine

El contrato `shared/lukitaLiveArchitecture.ts` define `LukitaBehaviorContext` con distancia, orientación, sesión, hora, estado de ubicación, tipo de experiencia, interacción y presencia agregada. La función `deriveLukitaBehavior` produce estados deterministas de presentación: descubrimiento, beacon, aproximación, gigante, personal, bienvenida, juego, baile, celebración o espera.

La implementación no incorpora reconocimiento facial, memoria personal ni IA generativa autónoma. Esa ausencia es deliberada: permite comprobar el flujo sin inventar capacidades productivas. Cualquier futura IA debe consumir únicamente datos autorizados, mensajes aprobados y guardrails versionados.

## 5. Scale Engine

La función `deriveLukitaScale` convierte la distancia aproximada en una banda visual y altura objetivo. Entre 5 y 15 metros utiliza una interpolación smoothstep para evitar saltos visibles; a distancias mayores usa representación beacon/discovery. El resultado expresa una intención de presentación y no una medición certificada de realidad aumentada.

La precisión depende de GPS, sensores, permisos, anclaje, cámara, luz, navegador y dispositivo. Por ello, una implementación productiva debe mostrar incertidumbre, degradar a orientación aproximada cuando sea necesario y evitar prometer una ubicación exacta a cientos de metros.

## 6. LukitaPoint

`LukitaPoint` es la entidad espacial contractual para convertir un lugar en una experiencia. El contrato exige `pointId`, nombre, coordenadas acotadas, orientación, tipo de anclaje, perfil de escala, radios de activación/interacción, visibilidad, experiencias, versión del asset, perfil de audio, QR público y calendario.

El validador `isSafeLukitaPoint` rechaza coordenadas fuera de rango, radios no positivos, radios de interacción mayores que el de activación y puntos sin versión de asset. En esta consolidación no se crea una tabla persistente ni un administrador de publicación: eso requiere decisiones de negocio, permisos, retención de datos, geoprivacidad y aprobación humana.

## 7. Character Foundation y Character Bible

La identidad está consolidada en `docs/MILUKITA_CHARACTER_BIBLE.md` y su contrato ejecutable `shared/lukitaCharacterFoundation.ts`. Los anchors son rostro adulto, sonrisa, cabello oscuro largo, silueta reconocible, estrella dorada y paleta azul profundo–dorado–blanco. La imagen proporcionada por el propietario permanece como referencia conceptual y evidencia visual, no como aprobación de producción ni licencia.

El modelo 3D definitivo, rigging, animaciones, voz, TTS, lip-sync y reconocimiento de usuario quedan bloqueados hasta la decisión humana correspondiente. El placeholder interactivo del AR Stage sirve para evaluar composición y escala, no para declarar finalizado el personaje.

## 8. Captura social y consentimiento

El flujo piloto es `front/rear camera → photo/video → review → download/discard/share`. La revisión previa muestra el video, permite reproducirlo, descargarlo o descartarlo y exige una acción explícita para abrir el menú de compartir. Los destinos sociales se presentan como acciones del usuario; no se publican contenidos automáticamente.

El formato preferido es MP4 cuando el navegador expone un `MediaRecorder` compatible. Si no lo hace, la experiencia declara WebM y utiliza una extensión coherente. La universalidad de MP4 no se considera validada hasta ejecutar pruebas físicas en navegadores y dispositivos objetivo.

## 9. Controller Lab y backstage

Controller Lab es una superficie backstage para navegación, volumen, cursor, escena, modo de presentación y vinculación operativa TV–celular. No es una experiencia narrativa, no es una segunda superficie de juego y no recibe configuración desde fuera del laboratorio. Su separación del Experience QR está documentada en `shared/lukitaLiveBoundaries.ts`.

## 10. Agentes y gobierno

Los agentes pueden observar, analizar, proponer, alertar y escalar. No pueden modificar MJP CORE, decidir resultados, publicar contenido sin aprobación, ejecutar una decisión legal autónoma, operar dinero real ni cambiar contratos constitucionales sin revisión. Las métricas productivas deben distinguirse de métricas simuladas, estimadas o no disponibles.

| Capacidad | Estado autónomo | Próximo gate humano |
|---|---|---|
| Contrato de capas | Implementado | aprobar organigrama como referencia oficial |
| Character Foundation | Implementado como candidato | aprobar anchors, derechos e imagen final |
| Behavior Engine | Contrato determinista | validar comportamiento con usuarios y contexto real |
| Scale Engine | Contrato determinista | validar sensores, precisión y degradación |
| LukitaPoint | Tipo y validador | decidir persistencia, permisos y publicación |
| Capture/review/share | Piloto implementado | QA físico y política de privacidad |
| MJP CORE isolation | Conservado y probado | auditoría independiente y staging |

## 11. Roadmap de consolidación

| Fase | Alcance | Criterio de salida |
|---|---|---|
| 0. Constitución | capas, autoridad, Character Bible y límites | contratos y documentación sin contradicciones |
| 1. Foundation | referencia visual, turnaround, asset y derechos | aprobación humana registrada |
| 2. Spatial | LukitaPoint, permisos, geoprivacidad y anclaje | QA territorial y fallback medido |
| 3. Behavior/Scale | estados, animación, audio, escala y observabilidad | pruebas de dispositivo y rendimiento |
| 4. Live pilot | cámara, AR, captura, revisión y share | consentimiento y pruebas E2E |
| 5. Social readiness | formatos, metadatos, accesibilidad y compatibilidad | validación por canal sin autopublicación |
| 6. Productive gate | staging, seguridad, auditoría independiente y runbook | aprobación explícita de operación |

## 12. Evidencia y pruebas

La cobertura contractual se concentra en `shared/lukitaLiveArchitecture.test.ts`, `shared/lukitaCharacterFoundation.test.ts`, `shared/lukitaLiveBoundaries.test.ts`, `shared/lukitaLiveCaptureContract.test.ts`, `shared/lukitaArStageContract.test.ts`, `shared/mjpCoreIsolation.test.ts` y `shared/touchRemoteContract.test.ts`. La suite automatizada prueba invariantes y código, pero no sustituye cámara física, GPS, WebXR, GPU, temperatura, escaneo real, social sharing ni aceptación visual.

La validación de cierre de esta iteración debe registrar TypeScript sin errores, suite Vitest completa, build exitoso y ausencia de tareas pendientes en `todo.md`. Todo resultado de rendimiento, audiencia, retención o canal externo debe etiquetarse como real, simulado, estimado o no disponible.

## 13. Decisiones reservadas al propietario

La aprobación visual final de Lukita, la licencia de los assets, la definición de voz, el alcance de reconocimiento o memoria, la publicación de LukitaPoints, la conexión de proveedores sociales, la apertura de dominios, la contratación de servicios externos, la operación 24/7 y cualquier modificación de MJP CORE no pueden resolverse autónomamente sin decisión humana.

La consolidación queda técnicamente preparada sin declarar producción lo que aún no tiene evidencia. El principio rector es: **Lukita puede estar viva en la experiencia; MJP CORE permanece soberano sobre el juego.**


## 14. Nuevas superficies de Controller Lab

Controller Lab incorpora tres superficies de ensayo separadas de la operación productiva. El **Generador QR dinámico** crea un payload temporal con etiqueta, tipo, expiración y nonce para pruebas físicas en móviles. Se etiqueta explícitamente como `Experience QR` y nunca como `Control QR`; no contiene RNG, resultados, wallet, ledger, settlement ni credenciales de sesión del controlador.

El formulario de **LukitaPoint** trabaja con borrador local, privacidad `PRIVATE`, `UNLISTED` o `PUBLIC` y consentimiento explícito. Desde Controller Lab solo puede enviar un borrador a `REVIEW`. Los estados `APPROVED` y `ACTIVE` requieren aprobación humana fuera de este panel. La regla se formaliza en `shared/lukitaPointPublication.ts` y se verifica con `shared/lukitaPointPublication.test.ts`.

La **vista previa del Character Foundation** presenta la referencia visual conceptual y permite revisar cinco anchors: rostro adulto, cabello/silueta, estrella dorada, proporción y paleta maestra. Las casillas son un checklist de revisión, no un mecanismo de aprobación ni de promoción a modelo 3D definitivo. La pantalla declara expresamente que la referencia no es un asset final.

Estas superficies permiten pruebas de campo y preparación editorial sin convertir Controller Lab en un panel de publicación automática ni en una puerta lateral hacia MJP CORE.


## 15. Business OS y Marketing Intelligence

La orden de Marketing Intelligence se incorpora como una capacidad de **Business OS**, no como una extensión de Lukita Character ni como una función de MJP CORE. La posición canónica es:

```text
MiLukita
├── Products
├── Entertainment OS
│   ├── Experience
│   ├── Content
│   ├── Audience
│   ├── Events
│   └── Lukita
├── Business OS
│   ├── Marketing Intelligence
│   │   ├── Brand Intelligence
│   │   ├── Truth / Claim Gate
│   │   ├── Content Factory
│   │   ├── Campaign Engine
│   │   ├── Funnel Intelligence
│   │   └── Marketing Analytics
│   ├── Sales
│   ├── Revenue
│   ├── Finance / Accounting / Tax
│   ├── Sponsorship / Partnerships
│   └── Distribution
├── Governance OS
│   ├── Legal
│   ├── Auditor
│   ├── Supervisor
│   ├── Approval Engine
│   └── Decision Log
├── KPI / Observability
└── Protected MJP CORE
```

Marketing Intelligence puede leer datos de marketing, audiencia y producto aprobado; puede generar borradores, propuestas y analítica; y debe escalar a humano para publicación crítica, claims regulatorios, presupuesto, compromisos comerciales y contratos externos. Su escritura sobre RNG, resultados, RTP, wallet, ledger, settlement o reglas está denegada por contrato. La publicación de contenido permanece `EXTERNAL_REQUIRED`, `BLOCKED` o `REQUIRES_HUMAN` según la evidencia y el gate correspondiente.
