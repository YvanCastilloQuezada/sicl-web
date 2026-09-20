# Manual de presentación de ARKI

## El primer minuto

ARKI es un espacio de trabajo para convertir una pregunta de diseño espacial en un proceso trazable. El sistema no reemplaza al arquitecto, al urbanista ni a la autoridad competente. Organiza el contexto, separa hechos de supuestos, compara alternativas y deja claro qué debe revisar una persona.

> **La promesa:** cada recomendación muestra de dónde viene, qué supone y qué todavía debe decidir un humano.

## El momento WOW

Escriba una petición en lenguaje natural o use el modo guiado. Si el Copiloto está conectado, ARKI propone un comando SICL en una vista previa. El sistema muestra el comando canónico, su explicación y su confianza. Nada se ejecuta automáticamente.

Después, el usuario puede recorrer el Camino A:

1. **Project:** declare el proyecto y su escala.
2. **Preference:** registre lo que la persona valora.
3. **Recommendation:** compare alternativas y análisis.
4. **HumanReview:** revise la propuesta y sus evidencias.
5. **Decision:** registre la decisión con actor y autoridad.
6. **Audit:** consulte el historial completo.

Los módulos complementarios aportan contexto, objetivos, restricciones, alternativas, evidencia, evaluaciones, comparaciones, consejo y gobernanza.

## Cómo empezar sin aprender SICL

Seleccione **Guided Mode**. El mapa de módulos indica el siguiente paso. Los catálogos muestran opciones canónicas. Los formularios visuales generan comandos sin exigir memorizar la sintaxis. La barra de ayuda explica cada campo y ofrece ejemplos.

Cuando desee aprender el lenguaje, abra la **Command Bar** con su botón visible o con `Ctrl+K` / `Cmd+K`. Busque un comando, lea su descripción, revise sus argumentos y observe el equivalente canónico antes de ejecutarlo.

## Tres reglas simples

**Fact** es un dato declarado como hecho. **Assumption** es una hipótesis que todavía debe tratarse como tal. **Preference** expresa una prioridad humana. No son intercambiables.

**Recommendation** no es **Decision**. Una recomendación puede ser analítica; una decisión necesita revisión humana, actor y autoridad.

**Fuente externa** no significa **verdad automática**. GIS, RNE, IFC y Ollama aportan datos o propuestas con procedencia. La vigencia, la licencia y el uso deben revisarse.

## Qué puede hacer hoy

ARKI puede trabajar con once escalas espaciales, evidencia y fuentes, simulaciones, factibilidad, Pareto, generación de alternativas, memoria institucional, actores, ciclos temporales, corpus normativo de prueba, IFC, GIS/OGC y Copiloto local. El sistema mantiene la trazabilidad en SQLite y usa eventos append-only para proteger el historial.

## Conexiones avanzadas

El adaptador IFC permite leer modelos físicos en modo de solo lectura. Revit y Archicad requieren sus aplicaciones y SDKs nativos. GIS acepta GeoJSON y OGC API Features para `PARCELA_SITIO`. Los snapshots tienen hash, vigencia, fuente y estado de revisión. Ollama traduce lenguaje natural a una intención SICL, pero no ejecuta comandos.

## Qué significa cada estado

| Estado | Significado |
|---|---|
| `PREVIEW_ONLY` | Se muestra una propuesta sin ejecutarla. |
| `HUMAN_REVIEW_REQUIRED` | Una persona debe revisar antes de continuar. |
| `CORE_UNAVAILABLE` | El Core no está disponible o configurado. |
| `CORE_UNAUTHORIZED` | Falta o no es válido el token server-side. |
| `INFEASIBLE` | La alternativa no cumple una restricción declarada. |
| `VIGENTE` | Estado normativo registrado y validado según su expediente. |

## Primer recorrido recomendado

Para una demostración de cinco minutos, cree un proyecto sintético, registre una preferencia de confort y privacidad, añada una evidencia, compare dos alternativas, genere una recomendación, ejecute HumanReview y termine con una Decision. Después abra Audit y muestre que cada paso conserva actor, fuente y timestamp.

## Mensaje final

ARKI no promete eliminar la complejidad del diseño. Promete hacerla visible, ordenada y revisable. El usuario conserva la autoridad; el sistema conserva la memoria.

## References

[1]: https://github.com/YvanCastilloQuezada/sicl-core "SICL Core repository"
[2]: https://github.com/YvanCastilloQuezada/sicl-web "ARKI web repository"
