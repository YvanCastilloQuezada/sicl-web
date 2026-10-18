# MiLukita — Sistema de identidad

## 1. Arquitectura de marca

**MiLukita** es la marca principal del canal de entretenimiento digital interactivo. **Lukita** es el anfitrión digital: presenta, guía, explica y acompaña, pero no decide resultados ni sustituye al motor oficial.

| Nivel | Nombre | Función |
| --- | --- | --- |
| Marca | MiLukita | Identidad comercial y experiencia principal |
| TV | MiLukita TV | Experiencia audiovisual y canal |
| Web | MiLukita.com | Dominio objetivo no verificado |
| Juegos | MiLukita Juegos | Catálogo de modalidades virtuales |
| Eventos | MiLukita Eventos | Programación y experiencias |
| Verificación | MiLukita Verificación | Consulta pública de resultados |
| Anfitrión | Lukita | Presentador, guía y acompañante |

No se utilizarán como nombres principales `Lukita Juegos`, `Lukita TV` o `Lukita Web`, salvo una razón concreta de producto.

## 2. Personalidad

MiLukita debe sentirse cercana, inteligente, entretenida, confiable, transparente, dinámica y ligeramente juguetona. La personalidad no debe infantilizar la experiencia, gritar, presionar comercialmente, usar lenguaje manipulador ni permanecer presente de forma constante.

Lukita aparece en bienvenida, instrucciones, transiciones, anuncios, celebración, ayuda, contingencia y cierre. El juego, el evento y el resultado son siempre protagonistas.

## 3. Voz y tono

La voz debe usar español claro, frases cortas y verbos directos. En TV se prioriza legibilidad a distancia; en móvil se prioriza acción y contexto; en operaciones se prioriza precisión; en verificación se prioriza evidencia.

Ejemplos aprobados de tono:

> “Bienvenidos a MiLukita.”

> “La participación está cerrada. Preparando el sorteo.”

> “El resultado oficial permanece protegido y puede verificarse.”

Ejemplos que deben evitarse: promesas de ganar, presión temporal manipuladora, afirmaciones de dinero real, lenguaje infantil excesivo o afirmaciones regulatorias no verificadas.

## 4. Principios de diseño

La jerarquía visual debe responder en este orden: qué está ocurriendo, qué puede hacer el usuario, cuándo ocurre y qué información secundaria está disponible. Cada elemento debe tener una función. TV y overlay no deben parecer una página web ampliada.

La marca debe conservar el aviso permanente de piloto gratuito, créditos virtuales, sin dinero real, sin depósitos, sin retiros y sin conversión. MiLukita no implica disponibilidad del dominio ni registro de marca.

## 5. Compatibilidad técnica

La marca comercial se implementará mediante aliases y constantes de presentación. Se conservan los identificadores técnicos `MjpTvManifest`, `MJP_TV_MANIFEST_VERSION`, `MJP_CORE`, prefijos históricos de rondas, rulesets, tickets, auditoría y nombres internos. No se modifica el RNG, las matemáticas, los RTP, las tablas de premios, la liquidación ni los resultados.

## 6. Lukita como contenido

El flujo autorizado es:

```text
GAME ENGINE → EVENT ENGINE → FACTS → CONTENT ENGINE → LUKITA
```

Lukita puede comunicar hechos ya producidos por el backend. No puede producir resultados, modificar estados oficiales, cambiar premios, aprobar programación crítica ni activar pagos. La IA generativa futura, si se considera, deberá limitarse a contenido no crítico con fallback determinista y revisión humana.

## 7. Dominio y legalidad

`MiLukita.com` es un dominio objetivo. Su disponibilidad, titularidad, registro y compatibilidad marcaria no están verificados en esta fase. No se presenta como adquirido ni jurídicamente disponible.
